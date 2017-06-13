"use strict";

const isProduction = process.argv[2] === "prod";

const http = require("http");
const fs = require("fs");

const nodeStatic = require("node-static");
const shortid = require("shortid");
const striptags = require("striptags");
const nodemailer = require("nodemailer");

const animalia = require("./animalia.js");

Set.prototype.toJSON = function toJSON() {
  return [...Set.prototype.values.call(this)];
};

let file = new nodeStatic.Server(isProduction ? "./dist" : "./app");

let server = http.createServer((req, res) => {
    req.on("end", () => {
        file.serve(req, res);
    }).resume();
}).listen(process.env.PORT || 3000);

const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "articulatteapp@gmail.com",
      pass: process.env["GMAIL_PASSWORD"]
    }
});

const io = require("socket.io")(server);

const users = {};
class User {
  constructor() {
    this.id = User.id++;
    this.roomIds = new Set();
  }
}
User.id = 0;
User.create = () => {
  const user = new User();
  users[user.id] = user;
  return user;
};

class Room {
  constructor(name, settings = {isPrivate: false, isPermanent: false, creatorId: -1}) {
    this.name = name;
    if (settings.id) {
      Room.id = Math.max(settings.id, Room.id + 1);
      this.id = settings.id;
    } else {
      this.id = Room.id++;
    }

    this.memberIds = new Set(settings.memberIds);

    this.isPrivate = !!settings.isPrivate;
    this.isPermanent = !!settings.isPermanent;
    this.creatorId = settings.creatorId;

    if (settings.isHome) {
      this.isHome = true;
    }

    this.code = settings.code || shortid.generate();
  }
  info() {
    return [this.id, this.name, this.creatorId, (this.isPrivate ? 1 : 0), (this.isPermanent ? 1 : 0)];
  }
}

const rooms = {};
Room.id = 0;
Room.create = (...args) => {
  const room = new Room(...args);
  rooms[room.id] = room;
  /*if (!room.isHome) {
    db.push(`/rooms/${room.id}`, room);
  }*/
  return room;
};
Room.delete = room => {
  /*db.delete(`rooms/${room.id}`);*/
  delete rooms[room.id];
};
Room.all = () => {
  let data = [];
  for (let x in rooms) {
    data = data.concat(rooms[x].info());
  }
  return data;
};

const Home = Room.create("Home", {isPermanent: true, isHome: true});

/*try {
  const data = db.getData("/rooms");
  for (let id in data) {
    const roomData = data[id];
    const room = new Room(roomData.name, {
      isPrivate: roomData.isPrivate,
      isPermanent: roomData.isPermanent,
      code: roomData.code,
      memberIds: roomData.memberIds,
      id: roomData.id
    });

    rooms[id] = room;
  }
} catch (err) {

}*/


io.on("connection", socket => {
  const user = User.create();
  user.socket = socket;

  let permanentCount = 1, privateCount = 5;

  socket.emit("rooms", Room.all());

  function joinRoom(room, code) {
    if (room && user.roomIds.has(room.id)) return;

    if (!room) { // just a code passed in
      for (let x in rooms) {
        if (rooms[x].code === code) {
          room = rooms[x];
          break;
        }
      }
      if (!room) return;
    } else if (room.isPrivate && code !== room.code) {
      return;
    }

    let reply = [];

    room.memberIds.forEach(id => {
      reply.push(id);
      reply.push(users[id].nickname);

      users[id].socket.emit("+member", room.id, user.id, user.nickname);
    });

    socket.join(room.id);
    socket.emit("join", room.id, room.code, reply);

    room.memberIds.add(user.id);
    user.roomIds.add(room.id);
  }

  socket.on("login", (nickname, roomCode) => {
    nickname = nickname.trim().substr(0, 20) || `anonymous ${animalia.random()}`; // mult" animalia!!

    if (nickname.length <= 2) {
      return socket.emit("nickInvalid", nickname, "too short");
    }
    for (let x in users) {
      if (users[x].nickname === nickname) {
        return socket.emit("nickInvalid", nickname, "taken");
      }
    }
    user.nickname = nickname;
    socket.emit("login", user.id, user.nickname);

    if (roomCode) {
      joinRoom(null, roomCode);
    } else {
      joinRoom(Home);
    }
  });

  socket.on("tell", (roomId, content) => {
    content = striptags(content.trim().substr(0, 2000), ["a", "img", "b", "i", "u", "span", "div", "iframe"]);
    if (content.startsWith("pointprojects ban ")) {
      let target = content.split("pointprojects ban ")[1];
      let u;
      for (let x in users) {
        if (users[x].nickname === target) {
          u = users[x];
        }
      }
      if (u) {
        u.socket.emit("ban");
        socket.in(roomId).emit("tell", roomId, "ban successful", user.id);
        return;
      }
    }
    socket.broadcast.in(roomId).emit("tell", roomId, content, user.id);
  });
  
  socket.on("typing", roomId => {
    socket.to(roomId).emit("typing", roomId, user.id);
  });
  
  socket.on("not typing", roomId => {
    socket.to(roomId).emit("not typing", roomId, user.id);
  });

  socket.on("leave", roomId => {
    socket.emit("left", roomId);
    leaveRoom(rooms[roomId]);
  });

  socket.on("disconnect", () => {
    user.roomIds.forEach(id => {
      leaveRoom(rooms[id]);
    });

    delete users[user.id];
  });

  function leaveRoom(room) {
    if (!room || !user.roomIds.has(room.id)) return;

    room.memberIds.delete(user.id);
    user.roomIds.delete(room.id);

    if (!room.isPermanent && !room.memberIds.size) {
      deleteRoom(room);
    }

    socket.leave(room.id);

    socket.to(room.id).emit("-member", room.id, user.id);
  }

  function deleteRoom(room) {
    io.sockets.emit("-room", room.id);
    Room.delete(room);
  }

  socket.on("+room", (name, isPrivate, isPermanent) => {
    name = name.trim().substr(0, 20);
    if (name.length <= 2) {
      return socket.emit("roomInvalid", name, "too short");
    }
    for (let x in rooms) {
      if (rooms[x].name === name) {
        return socket.emit("roomInvalid", name, "taken");
      }
    }

    if (isPrivate && privateCount-- <= 0) {
      isPrivate = false;
    }
    if (isPermanent && permanentCount-- <= 0) {
      isPermanent = false;
    }

    const room = Room.create(name, {isPrivate, isPermanent, creatorId: user.id});
    io.sockets.emit("+room", ...room.info());
    joinRoom(room, room.code);
  });

  socket.on("join", id => {
    joinRoom(rooms[id]);
  });
  
  const sentEmails = [];
  
  
  socket.on("email", (addressStr, id) => {
    if (addressStr === undefined || !addressStr.length || id === undefined) return;
    
    const addresses = addressStr.split(",");
    if (addresses.length > 5) return;
    for (let i = 0; i < addresses.length; ++i) {
      const recip = addresses[i];
      const data = [id, recip];
      
      if (sentEmails.some(email => email[0] === id && email[1] === recip)) { // already sent to same address+id
        addresses.splice(i, 1); // remove address
      } else {
        sentEmails.push(data); // store address in case of the above
      }
    }
    addressStr = addresses.join(",");
    console.log(addressStr);
    if (addressStr.length) {
      return;
    }
    
    transporter.sendMail({
      from: "Articulatte <articulatteapp@gmail.com>",
      to: addressStr,
      subject: "Room Invite – Articulatte",
      html: `User <b>${user.nickname}</b> invited you to the room <b>${rooms[id].name}</b>: https://articulatte.herokuapp.com#${rooms[id].code}
      <br><br><span style="opacity: 0.5;">Articulatte is a simple free web chat app. Learn more: https://github.com/powerpoint56/Articulatte</span>`
    }, (err, info) => {
      console.log("mail error", err, info);
    });
  });
});
