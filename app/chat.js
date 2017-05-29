/* global jd, io, localStorage, location, AudioContext */

(() => {

"use strict";

if (localStorage.getItem("q") !== null) {
  ban();
}

function ban() {
  localStorage.setItem("q", "1");
  document.body.removeChild(jd.f(".main"));
  document.body.appendChild(jd.c("form", {events: {
    submit: e => {
      e.preventDefault();
      if (jd.f("input", e.target).value === "pointprojects") {
        localStorage.removeItem("q");
        location.reload();
      }
      return false;
    }
  }}, [
    jd.c("input", {style: {border: "1px solid white"}, autofocus: true})
  ]));
}

class UpdatingList {
  constructor(buildItem, name) { // pass in name (the header); function to make new li's — passed li element and user's args
    this.name = name;
    this.buildItem = buildItem;

    this.el = jd.f(".rooms");
    this.ul = jd.f("ul", this.el);
    this.header = jd.f("span", this.el);
    jd.f("button", this.el).addEventListener("click", e => {
      jd.f("form", this.el).classList.toggle("hide");
      jd.f("input", this.el).focus();
    });

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

    this.displayName = nickname;
    if (myId === id) {
      this.displayName += " (me)";
    }

    this.hueRotate = id * 65;
    this.hsl = `hsl(${210 + this.hueRotate}, 75%, 50%)`;
  }
  createIcon() {
    return jd.c("img", {class: "m-icon", style: {filter: `hue-rotate(${this.hueRotate}deg)`}});
  }
  createLabel() {
    return jd.c("span", {_: this.displayName, style: {color: this.hsl}});
  }
}
User.create = (...args) => {
  const user = new User(...args);
  users[user.id] = user;
  return user;
};
let myId;


const socket = io();

socket.on("ban", ban);

const nicknameForm = jd.f(".nickname", ".main");

nicknameForm.addEventListener("submit", e => {
  e.preventDefault();

  login(jd.f("input", e.target).value);

  return false;
});

if (localStorage.getItem("nickname")) {
  login(localStorage.getItem("nickname"));
} else {
  nicknameForm.classList.remove("hide");
}

function login(nickname) {
  socket.emit("login", nickname, location.hash ? location.hash.slice(1) : undefined);
}

socket.on("nickInvalid", (name, reason) => {
  jd.f(".error", nicknameForm).textContent = `Nickname "${name}" ${reason}.`;
  nicknameForm.classList.remove("hide");
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
        users[myId].createLabel(),
        jd.c("button", {class: "fa fa-times", events: {click: () => {
          localStorage.removeItem("nickname");
          location.reload();
        }}})
      ])
    ])
  ], jd.f(".names", ".people"));
});


const RoomList = new UpdatingList((li, room) => {
  if (room.isPrivate) {
    li.classList.add("hide");
  }
  if (room.creator) {
    li.style.color = room.creator.hsl;
  }
  li.textContent = room.name;
  li.addEventListener("click", () => {
    socket.emit("join", room.id);
  });

  room.li = li;
  return li;
}, "Rooms");


socket.on("join", (roomId, roomCode, arr) => {
  const room = rooms[roomId];

  let members = [];
  for (let i = 0; i < arr.length; i += 2) {
    User.create(arr[i], arr[i+1]);
    members.push(arr[i+1]);
  }

  if (room.el) {
    return;
  }

  room.link = `${location.origin}/#${roomCode}`;
  room.setUpWindow();

  let update = `joined ${room.creator ? room.creator.nickname + "'s" : "the"} room ${room.name}`;
  if (members.length) {
    update += " with " + members.join(", ");
  }
  room.addUpdate(update, users[myId]);

  if (room.isPrivate) {
    room.li.classList.remove("hide");
  }
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

const urlRegex = /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g;
const imgRegex = /\.(jpe?g|png|gif)$/g;
function processUris(text) {
  return text.replace(urlRegex, match =>
    `<a href="${match}">${imgRegex.test(match) ? `<img src=${match}>` : match}</a>`
  );
}

class Room {
  constructor(id, name, settings) {
    this.name = name;
    this.id = id;
    this.isPrivate = !!settings.isPrivate;
    this.creatorId = settings.creatorId;
    this.isPermanent = !!settings.isPermanent;
  }

  setUpWindow() {
    this.el = jd.c("div", {class: "window"}, [
      jd.c("header", null, [
        jd.c("span", null, [
          jd.c("button", jd.c("a", {
            class: "fa fa-link",
            href: this.link,
            tabindex: 2
          })),
          jd.c("button", jd.c("a", {
            class: "fa fa-envelope",
            href: `mailto:?subject=Articulatte%20room%20invite&body=Join%20here!%20${this.link}`,
            tabindex: 2
          }))
        ]),
        jd.c("span", {_: this.name, style: (this.creator ? {color: this.creator.hsl} : null)}),
        jd.c("button", {class: "fa fa-times", events: {click: e => {
          socket.emit("leave", this.id);
        }}})
      ]),
      jd.c("div", {class: "feed"}),
      jd.c("form", {class: "field"}, [
        jd.c("textarea", {class: "f-input", maxlength: 1000, tabindex: 1, rows: 1, events: {"keypress": e => {
          if (!e.shiftKey && e.keyCode === 13) {
            e.preventDefault();

            let message = processUris(this.input.value.trim().substr(0, 1000));
            if (Date.now() - lastMessage < 100 || !message.length)  return;
            lastMessage = Date.now();
      
            socket.emit("tell", this.id, message);
            this.field.reset();
            this.addMessage(message, users[myId]);
      
            return false;
          }
        }}}),
        jd.c("button", {class: "f-submit fa fa-reply"})
      ])
    ], jd.f(".windows"));

    this.field = jd.f(".field", this.el);
    this.input = jd.f(".f-input", this.field);
    this.input.focus();

    this.feed = jd.f(".feed", this.el);
  }
  leave() {
    jd.f(".windows").removeChild(this.el);
    delete this.el;
    delete this.field;
    delete this.input;
    delete this.feed;
  }
  
  /*function youtubeEmbedCode(src) {
    var match = src.match(/(?:youtube\.(?:com|com\.br)\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
    if (match[1] && match[1].length === 11) {
      return match[1];
    }
  }
  
  element = document.createElement("iframe");
  element.width = "420";
  element.height = "315";
  element.src = "https://www.youtube.com/embed/" + src;
  element.frameborder = "0";
  element.allowfullscreen = true;*/

  addMessage(text, sender) {
    const textEl = jd.c("div", {class: "m-text"});
    if (text.indexOf("<") === -1) {
      textEl.textContent = text;
    } else {
      textEl.innerHTML = text;
    }

    let time = getTime();
    if (this.lastSenderId === sender.id && this.lastTime === time) {
      this.lastContent.appendChild(textEl);
    } else {
      this.lastContent = jd.c("div", {class: "m-content"}, [
        jd.c("div", {class: "m-header"}, [
          sender.createLabel(),
          jd.c("span", {class: "m-time", _: time})
        ]),
        textEl
      ]);
      jd.c("div", {class: "message"}, [
        sender.createIcon(),
        this.lastContent
      ], this.feed);
    }
    this.lastSenderId = sender.id;
    this.lastTime = time;

    this.scroll();
    Notify.beep();
  }
  addUpdate(text, sender) {
    jd.c("div", {class: "update", _: text, style: (sender ? {color: sender.hsl} : null)}, [
      jd.c("span", {class: "m-time", _: getTime()})
    ], jd.f(".feed", this.el));
    this.scroll();
    this.lastSenderId = -1;
  }
  scroll() {
    if (this.feed.scrollHeight - (this.feed.scrollTop + this.feed.clientHeight) < this.feed.clientHeight / 2) {
      this.feed.scrollTop = this.feed.scrollHeight;
    }
  }
  get creator() {
    return users[this.creatorId];
  }
}

const rooms = {};
Room.create = (...args) => {
  const room = new Room(...args);
  rooms[room.id] = room;

  return room;
};

socket.once("rooms", (arr) => {
  for (let i = 0; i < arr.length; i += 5) {
    Room.create(arr[i], arr[i + 1], {
      creatorId: arr[i + 2],
      isPrivate: !!arr[i + 3],
      isPermanent: !!arr[i + 4]
    });
  }
  RoomList.init(rooms, jd.f(".people"));
});

socket.on("reconnect", () => {
  for (let x in rooms) {
    socket.emit("join", rooms[x].id);
  }
});

socket.on("-room", id => {
  RoomList.remove(rooms[id].li);
  delete rooms[id];
});

const roomForm = {
  el: jd.f("form", RoomList.el),
  privateCount: 5,
  permanentCount: 1
};
roomForm.name = jd.f(`input[type="text"]`, roomForm.el);
roomForm.isPrivate = jd.f(`label[name="priv"]`, roomForm.el);
roomForm.isPermanent = jd.f(`label[name="perm"]`, roomForm.el);

roomForm.el.addEventListener("submit", e => {
  e.preventDefault();
  socket.emit("+room", roomForm.name.value.trim(), jd.f("input", roomForm.isPrivate).checked ? 1 : 0, jd.f("input", roomForm.isPermanent).checked ? 1 : 0);
  return false;
});

socket.on("+room", (id, name, creatorId, isPrivate, isPermanent) => {
  RoomList.add(Room.create(id, name, {creatorId, isPrivate, isPermanent}));
  if (creatorId === myId) {
    jd.f("form", ".rooms").reset();
    jd.f("form", ".rooms").classList.add("hide");
    if (isPrivate && --roomForm.privateCount <= 0) {
      roomForm.el.removeChild(roomForm.isPrivate);
    }
    if (isPermanent && --roomForm.permanentCount <= 0) {
      roomForm.el.removeChild(roomForm.isPermanent);
    }
  }
});

socket.on("roomInvalid", (name, reason) => {
  jd.f(".error", roomForm.el).textContent = `Name "${name}" ${reason}.`;
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
      if (tabActive || !context || jd.f(".mute").checked) return;

      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      osc.frequency.value = 587.33;

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.7);
      gain.connect(context.destination);

      osc.start();
      osc.stop(context.currentTime + 0.8);
    }
  };
})();

})();
