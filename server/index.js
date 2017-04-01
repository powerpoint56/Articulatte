"use strict";

const isProduction = process.argv[2] === "prod";

const http = require("http");
const nodeStatic = require("node-static");
const shortid = require("shortid");
const animalia = require("./animalia.js");

let file = new nodeStatic.Server(isProduction ? "./dist" : "./app");

let server = http.createServer((req, res) => {
    req.on("end", () => {
        file.serve(req, res);
    }).resume();
}).listen(process.env.PORT || 3000);

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
}


class Room {
  constructor(name, settings = {isPrivate: false, isPermanent: false, creatorId: -1}) {
    this.name = name;
    this.id = Room.id++;

    this.memberIds = new Set();

    this.isPrivate = !!settings.isPrivate;
    this.isPermanent = !!settings.isPermanent;
    this.creatorId = settings.creatorId;

    this.code = shortid.generate();
  }
  info() {
    return [this.id, this.name, this.creatorId, this.isPrivate];
  }
}

const rooms = {};
Room.id = 0;
Room.create = (...args) => {
  const room = new Room(...args);
  rooms[room.id] = room;
  return room;
};
Room.all = () => {
  let data = [];
  for (let x in rooms) {
    data = data.concat(rooms[x].info());
  }
  return data;
};

const Home = Room.create("Home", {isPermanent: true});

io.on("connection", socket => {
  const user = User.create();
  user.socket = socket;

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
    nickname = nickname.trim().substr(0, 20) || `anonymous ${animalia.random()}`; // mult' animalia!!

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
    content = content.trim().substr(0, 1000);
    socket.broadcast.emit("tell", roomId, content, user.id);
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
    delete rooms[room.id];
  }

  socket.on("+room", (name, isPrivate) => {
    name = name.trim().substr(0, 20);
    if (name.length <= 2) {
      return socket.emit("roomInvalid", name, "too short");
    }
    for (let x in rooms) {
      if (rooms[x].name === name) {
        return socket.emit("roomInvalid", name, "taken");
      }
    }

    const room = Room.create(name, {isPrivate, creatorId: user.id});
    io.sockets.emit("+room", ...room.info());
    joinRoom(room, room.code);
  });

  socket.on("join", id => {
    joinRoom(rooms[id]);
  });
});
