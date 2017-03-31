"use strict";

const http = require("http");
const nodeStatic = require("node-static");
//const shortid = require("shortid");
const animalia = require("./animalia.js");

let file = new nodeStatic.Server(process.argv[2] === "prod" ? "./dist" : "./app");

let server = http.createServer((req, res) => {
    req.addListener("end", () => {
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
  constructor(name) {
    this.name = name;
    this.id = Room.id++;
    this.memberIds = new Set();
  }
}

const rooms = {};
Room.id = 0;
Room.create = name => {
  const room = new Room(name);
  rooms[room.id] = room;
  return room;
};
Room.all = () => {
  let data = [];
  for (let x in rooms) {
    data.push(x);
    data.push(rooms[x].name);
  }
  return data;
};

const Home = Room.create("Home");
Home.permanent = true;

io.on("connection", socket => {
  const user = User.create();
  user.socket = socket;

  socket.emit("rooms", Room.all());

  function joinRoom(room) {
    if (!room || user.roomIds.has(room.id)) return;

    let reply = [];

    room.memberIds.forEach(id => {
      reply.push(id);
      reply.push(users[id].nickname);

      users[id].socket.emit("+member", room.id, user.id, user.nickname);
    });

    socket.emit("join", room.id, reply);

    room.memberIds.add(user.id);
    user.roomIds.add(room.id);
  }

  socket.on("login", nickname => {
    nickname = nickname.trim().substr(0, 20) || `anonymous ${animalia.random()}`; // mult' animalia!!
    for (let user in users) {
      if (user.nickname === nickname) {
        socket.emit("nick taken");
        return;
      }
    }
    user.nickname = nickname;
    socket.emit("login", user.id, user.nickname);

    joinRoom(Home);
  });

  socket.on("tell", (roomId, content) => {
    content = content.trim().substr(0, 1000);
    rooms[roomId].memberIds.forEach(id => {
      if (id !== user.id) {
        users[id].socket.emit("tell", roomId, content, user.id);
      }
    });
  });

  socket.on("leave", roomId => {
    leaveRoom(rooms[roomId]);
    socket.emit("left", roomId);
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

    room.memberIds.forEach(id => {
      users[id].socket.emit("-member", room.id, user.id);
    });

    if (!room.permanent && !room.memberIds.size) {
      deleteRoom(room);
    }
  }

  function deleteRoom(room) {
    sockets.broadcast(Message.compress("-room", room.id));
    delete rooms[room.id];
  }
});
