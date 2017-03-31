(() => {

"use strict";

class UpdatingList {
  constructor(buildItem, name) { // pass in name (the header); function to make new li's — passed li element and user's args
    this.name = name;
    this.buildItem = buildItem;

    this.el = jd.f(".rooms");
    this.ul = jd.f("ul", this.el);
    this.header = jd.f("h4", this.el);

    this.count = 0;
  }
  init(arr, parent) {
    for (let x in arr) {
      this.add(arr[x]);
    }

    parent.appendChild(this.el);
  }
  add(args) {
    this.ul.appendChild(this.buildItem(jd.c("li"), args));
    ++this.count;
    this.header.textContent = `${this.name} (${this.count})`;
  }
  remove(el) {
    this.ul.removeChild(el);
    --this.count;
  }
}


const users = {};
class User {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;

    this.hueRotate = id * 65;
    this.hsl = `hsl(${210 + this.hueRotate}, 75%, 40%)`;
  }
  createIcon() {
    return jd.c("img", {class: "m-icon", style: {filter: `hue-rotate(${this.hueRotate}deg)`}});
  }
  createLabel() {
    return jd.c("span", {_: this.nickname, style: {color: this.hsl}});
  }
}
User.create = (...args) => {
  const user = new User(...args);
  users[user.id] = user;
  return user;
}
let myId;


const socket = io();

const nicknameForm = jd.f(".nickname", ".main").addEventListener("submit", e => {
  e.preventDefault();

  login(jd.f("input", e.target).value);

  return false;
});

if (localStorage.getItem("nickname")) {
  login(localStorage.getItem("nickname"));
}

function login(nickname) {
  socket.emit("login", nickname);
}

socket.on("nickInvalid", (name, reason) => {
  jd.f(".error", nicknameForm).textContent = `Nickname "${name}" ${reason}.`;
});

socket.on("login", (id, nickname) => {
  jd.f(".main").removeChild(jd.f(".nickname", ".main"));

  myId = id;
  User.create(id, nickname);

  window.localStorage.setItem("nickname", nickname);
  jd.c("div", {class: "message"}, [
    users[myId].createIcon(),
    jd.c("div", {class: "m-content"}, [
      jd.c("div", {class: "m-header"}, [
        users[myId].createLabel()
      ])
    ])
  ], jd.f(".people"));
});


const RoomList = new UpdatingList((li, room) => {
  li.textContent = room.name;
  room.li = li;
  return li;
}, "Rooms");

jd.f("form", RoomList.el).addEventListener("submit", e => {
  e.preventDefault();

  socket.emit("+room", jd.f(`input[type="text"]`, e.target).value, jd.f(`input[type="checkbox"]`, e.target).value); // room name, is private?

  return false;
});


socket.on("join", (roomId, arr) => {
  rooms[roomId].setUpWindow();

  let members = [];
  for (let i = 0; i < arr.length; i+=2) {
    User.create(arr[i], arr[i+1]);
    members.push(arr[i+1]);
  }

  let update = "joined room " + rooms[roomId].name;
  if (members.length) {
    update += " with " + members.join(", ");
  }
  rooms[roomId].addUpdate(update, users[myId]);
});

socket.on("tell", (roomId, content, userId) => {
  rooms[roomId].addMessage(content, users[userId]);
});

socket.on("+member", (roomId, userId, nickname) => {
  User.create(userId, nickname);
  rooms[roomId].addUpdate(`${nickname} has joined the room`, users[userId]);
});

socket.on("-member", (roomId, userId) => {
  rooms[roomId].addUpdate(`${users[userId].nickname} has left the room`, users[userId]);
});

socket.on("left", roomId => {
  rooms[roomId].leave();
});



const date = new Date();
function getTime() {
  date.setTime(Date.now());
  return `${((date.getHours() % 12) || 12)}:${("0" + date.getMinutes()).slice(-2)}`;
}
let lastMessage = 0;

class Room {
  constructor(id, name, settings) {
    this.name = name;
    this.id = id;
    this.isPrivate = settings.isPrivate;
  }

  setUpWindow() {
    this.el = jd.c("div", {class: "window"}, [
      jd.c("header", "Room", [
        jd.c("button", {class: "fa fa-times"})
      ]),
      jd.c("div", {class: "feed"}),
      jd.c("form", {class: "field"}, [
        jd.c("input", {class: "f-input", maxlength: 1000}),
        jd.c("button", {class: "f-submit fa fa-reply"})
      ])
    ], jd.f(".main"));

    this.field = jd.f(".field", this.el);
    this.input = jd.f(".f-input", this.field);

    this.field.addEventListener("submit", e => {
      e.preventDefault();

      let message = this.input.value.trim().substr(0, 1000);
      if (Date.now() - lastMessage < 100 || !message.length)  return;
      lastMessage = Date.now();

      socket.emit("tell", this.id, message);
      this.input.value = "";
      this.addMessage(message, users[myId]);

      return false;
    });

    this.feed = jd.f(".feed", this.el);

    jd.f("button", jd.f("header", this.el)).addEventListener("click", e => {
      socket.emit("leave", this.id);
    });
  }
  leave() {
    jd.f(".main").removeChild(this.el);
    delete this.el;
    delete this.field;
    delete this.input;
    delete this.feed;
  }

  addMessage(text, sender) {
    jd.c("div", {class: "message"}, [
      sender.createIcon(),
      jd.c("div", {class: "m-content"}, [
        jd.c("div", {class: "m-header"}, [
          sender.createLabel(),
          jd.c("span", {class: "m-time", _: getTime()})
        ]),
        jd.c("div", {class: "m-text", _: text})
      ])
    ], this.feed);
    this.scroll();
    Notify.beep();
  }
  addUpdate(text, sender) {
    jd.c("div", {class: "update", _: text, style: (sender ? {color: sender.hsl} : null)}, [
      jd.c("span", {class: "m-time", _: getTime()})
    ], jd.f(".feed", this.el));
    this.scroll();
  }
  scroll() {
    this.feed.scrollTop = this.feed.scrollHeight;
  }
}

const rooms = {};
Room.create = (...args) => {
  const room = new Room(...args);
  rooms[room.id] = room;
  return room;
};

socket.on("rooms", (arr) => {
  for (let i = 0; i < arr.length; i += 3) {
    Room.create(arr[i], arr[i + 1], {isPrivate: arr[i + 2]});
  }
  RoomList.init(rooms, jd.f(".people"));
});

socket.on("-room", id => {
  RoomList.remove(rooms[id].li);
  delete rooms[id];
});

socket.on("+room", (id, name, isPrivate) => {
  RoomList.add(Room.create(id, name, {isPrivate}));
});

socket.on("roomInvalid", (name, reason) => {
  jd.f(".error", jd.f("form", RoomList.el)).textContent = `Name "${name}" ${reason}.`;
});



const Notify = (() => {
  let tabActive = true;
  window.addEventListener("focus", () => {
      tabActive = true;
  });
  window.addEventListener("blur", () => {
      tabActive = false;
  });

  const context = AudioContext ? new AudioContext() : null;

  return {
    beep: () => {
      if (tabActive || !context) return;

      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      osc.frequency.value = 587.33;

      gain.gain.setValueAtTime(0, 0);
      gain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.7);
      gain.connect(context.destination);

      osc.start();
      osc.stop(context.currentTime + 0.8);
    }
  };
})();

})();
