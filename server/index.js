"use strict";

const ws = require("ws");
const http = require("http");
const nodeStatic = require("node-static");
const shortid = require("shortid");
const animalia = require("./animalia.js");

let file = new nodeStatic.Server("./app");

let server = http.createServer((req, res) => {
    req.addListener("end", () => {
        file.serve(req, res);
    }).resume();
}).listen(process.env.PORT || 8888);

const Message = {
  compress: (eventName, ...args) => JSON.stringify([eventName, ...args]).slice(1, -1),
  open: message => JSON.parse(`[${message}]`)
};

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

let wss = new ws.Server({server: server});

wss.broadcast = data =>
    wss.clients.forEach(client => client.send(data));

wss.on("connection", ws => {
  const user = User.create();
  user.socket = ws;

  ws.send(Message.compress("rooms", ...Room.all()));

  function joinRoom(room) {
    if (!room || user.roomIds.has(room.id)) return;

    const greeting = Message.compress("+member", room.id, user.id, user.nickname);
    let reply = ["join", room.id];

    room.memberIds.forEach(id => {
      reply.push(id);
      reply.push(users[id].nickname);

      users[id].socket.send(greeting);
    });

    ws.send(Message.compress(...reply));

    room.memberIds.add(user.id);
    user.roomIds.add(room.id);
  }

  const messages = {};

  messages.login = nickname => {
    user.nickname = nickname.trim().substr(0, 20) || `anonymous ${animalia.random()}`; // mult' animalia!!
    ws.send(Message.compress("login", user.id, user.nickname));

    joinRoom(Home);
  };

  messages.tell = (roomId, content) => {
    content = content.trim().substr(0, 1000);
    rooms[roomId].memberIds.forEach(id => {
      if (id !== user.id) {
        users[id].socket.send(Message.compress("tell", roomId, content, user.id));
      }
    });
  };

  messages.leave = roomId => {
    leaveRoom(rooms[roomId]);
    ws.send(Message.compress("left", roomId));
  };

  ws.on("message", data => {
    data = Message.open(data);
    messages[data[0]](...data.splice(1));
  });

  ws.on("close", e => {
    console.log(e);
    user.roomIds.forEach(id => {
      leaveRoom(rooms[id]);
    });

    delete users[user.id];
  });

  function leaveRoom(room) {
    if (!room || !user.roomIds.has(room.id)) return;

    room.memberIds.delete(user.id);
    user.roomIds.delete(room.id);

    let message = Message.compress("-member", room.id, user.id);
    room.memberIds.forEach(id => {
      users[id].socket.send(message);
    });

    if (!room.permanent && !room.memberIds.size) {
      deleteRoom(room);
    }
  }

  function deleteRoom(room) {
    wss.broadcast(Message.compress("-room", room.id));
    delete rooms[room.id];
  }
});
