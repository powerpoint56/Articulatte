{

"use strict";

const users = {};
class User {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;

    this.hueRotate = id * 65;
    this.hsl = `hsl(${210 + this.hueRotate}, 75%, 60%)`;
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


const Message = {
  compress: (eventName, ...args) => JSON.stringify([eventName, ...args]).slice(1, -1),
  open: message => JSON.parse(`[${message}]`)
};

const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

socket.onopen = e => {
  if (window.localStorage.getItem("nickname")) {
    login(window.localStorage.getItem("nickname"));
  } else {
    jd.c("form", {class: "nickname"}, [
      jd.c("label", "Enter a nickname: ", [
        jd.c("input", {placeholder: "anonymous"})
      ])
    ], jd.f(".main")).addEventListener("submit", e => {
      e.preventDefault();

      let nickname = jd.f("input", e.target).value;

      jd.f(".main").removeChild(e.target);

      login(nickname);

      return false;
    });
  }
};

socket.onmessage = e => {
  var data = Message.open(e.data);
  messages[data[0]](...data.splice(1));
};

socket.onerror = function(e) {
  alert(`Error ${e.type}`);
};

socket.onclose = e => {
  alert(`Connection to server closed. Code ${e.code}; Reason: ${e.reason}; ${e.wasClean ? "Clean" : "Not Clean"}`);
};

const messages = {};

messages.login = (id, nickname) => {
  myId = id;
  User.create(id, nickname);

  window.localStorage.setItem("nickname", nickname);
  jd.c("div", {class: ".message"}, [
    users[myId].createIcon(),
    jd.c("div", {class: "m-content"}, [
      jd.c("div", {class: "m-header"}, [
        users[myId].createLabel()
      ])
    ])
  ], jd.f(".people"));
};

messages.rooms = (...arr) => {
  for (let i = 0; i < arr.length; ++i) {
    Room.create(arr[i], arr[++i]);
  }
};

messages.join = (roomId, ...arr) => {
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
};

messages.tell = (roomId, content, userId) => {
  rooms[roomId].addMessage(content, users[userId]);
};

messages["-room"] = id => {
  delete rooms[id];
};

messages["+member"] = (roomId, userId, nickname) => {
  User.create(userId, nickname);
  rooms[roomId].addUpdate(`${nickname} has joined the room`, users[userId]);
};

messages["-member"] = (roomId, userId) => {
  rooms[roomId].addUpdate(`${users[userId].nickname} has left the room`, users[userId]);
};

messages.left = roomId => {
  rooms[roomId].leave();
}


function login(nickname) {
  socket.send(Message.compress("login", nickname));
}

const date = new Date();
function getTime() {
  date.setTime(Date.now());
  return `${((date.getHours() % 12) || 12)}:${("0" + date.getMinutes()).slice(-2)}`;
}
let lastMessage = 0;

class Room {
  constructor(id, name) {
    this.name = name;
    this.id = id;
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

      socket.send(Message.compress("tell", this.id, message));
      this.input.value = "";
      this.addMessage(message, users[myId]);

      return false;
    });

    this.feed = jd.f(".feed", this.el);

    jd.f("button", jd.f("header", this.el)).addEventListener("click", e => {
      socket.send(Message.compress("leave", this.id));
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
Room.create = (id, name) => {
  const room = new Room(id, name);
  rooms[room.id] = room;
  return room;
};

const Notify = (() => {
  let tabActive = true;
  window.addEventListener("focus", () => {
      tabActive = true;
  });
  window.addEventListener("blur", () => {
      tabActive = false;
  });

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
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

}
