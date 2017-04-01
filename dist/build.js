"use strict";Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),window.AudioContext=window.AudioContext||window.webkitAudioContext;
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};window.jd=function(t,e){function r(t,n){return n?("string"==typeof n&&(n=r(n)),n.querySelector(t)):o[t]||(o[t]=e.querySelector(t))}function n(t,r,n,o){var i=e.createElement(t);if("string"==typeof r)i.textContent=r;else if(null!==r&&"object"===(void 0===r?"undefined":_typeof(r)))for(var f in r)if("_"===f)i.textContent=r[f];else if(null!==r[f]&&"object"===_typeof(r[f])){if("style"===f)for(var y in r[f])i.style.setProperty(y,r[f][y]);else if("events"===f)for(var l in r[f])i.addEventListener(l,r[f][l])}else i.setAttribute(f,r[f]);if(Array.isArray(n)){var u=!0,a=!1,c=void 0;try{for(var s,p=n[Symbol.iterator]();!(u=(s=p.next()).done);u=!0){var d=s.value;i.appendChild(d)}}catch(t){a=!0,c=t}finally{try{!u&&p.return&&p.return()}finally{if(a)throw c}}}return o&&o.appendChild(i),i}var o={};return{find:r,f:r,create:n,c:n}}(window,document);
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();!function(){function e(e){s.emit("login",e)}function t(){return c.setTime(Date.now()),(c.getHours()%12||12)+":"+("0"+c.getMinutes()).slice(-2)}var n=function(){function e(t,n){var i=this;_classCallCheck(this,e),this.name=n,this.buildItem=t,this.el=jd.f(".rooms"),this.ul=jd.f("ul",this.el),this.header=jd.f("span",this.el),jd.f("button",this.el).addEventListener("click",function(e){jd.f("form",i.el).classList.toggle("hide"),jd.f("input",i.el).focus()}),this.count=0}return _createClass(e,[{key:"init",value:function(e,t){for(var n in e)this.add(e[n]);t.appendChild(this.el)}},{key:"add",value:function(e){this.ul.appendChild(this.buildItem(jd.c("li"),e)),++this.count,this.header.textContent=this.name+" ("+this.count+")"}},{key:"remove",value:function(e){this.ul.removeChild(e),--this.count}}]),e}(),i={},a=function(){function e(t,n){_classCallCheck(this,e),this.id=t,this.nickname=n,this.displayName=n,o===t&&(this.displayName+=" (me)"),this.hueRotate=65*t,this.hsl="hsl("+(210+this.hueRotate)+", 75%, 50%)"}return _createClass(e,[{key:"createIcon",value:function(){return jd.c("img",{class:"m-icon",style:{filter:"hue-rotate("+this.hueRotate+"deg)"}})}},{key:"createLabel",value:function(){return jd.c("span",{_:this.displayName,style:{color:this.hsl}})}}]),e}();a.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var o=new(Function.prototype.bind.apply(a,[null].concat(t)));return i[o.id]=o,o};var o=void 0,s=io(),l=jd.f(".nickname",".main");l.addEventListener("submit",function(t){return t.preventDefault(),e(jd.f("input",t.target).value),!1}),localStorage.getItem("nickname")?e(localStorage.getItem("nickname")):l.classList.remove("hide"),s.on("nickInvalid",function(e,t){jd.f(".error",l).textContent='Nickname "'+e+'" '+t+".",l.classList.remove("hide")}),s.on("login",function(e,t){jd.f(".main").removeChild(jd.f(".nickname",".main")),o=e,a.create(e,t),window.localStorage.setItem("nickname",t),jd.c("div",{class:"message"},[i[o].createIcon(),jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[i[o].createLabel(),jd.c("button",{class:"fa fa-times",events:{click:function(){localStorage.removeItem("nickname"),location.reload()}}})])])],jd.f(".people"))});var r=new n(function(e,t){return e.textContent=t.name,e.addEventListener("click",function(){s.emit("join",t.id)}),t.li=e,e},"Rooms");s.on("join",function(e,t){f[e].setUpWindow();for(var n=[],s=0;s<t.length;s+=2)a.create(t[s],t[s+1]),n.push(t[s+1]);var l="joined room "+f[e].name;n.length&&(l+=" with "+n.join(", ")),f[e].addUpdate(l,i[o])}),s.on("tell",function(e,t,n){f[e].addMessage(t,i[n])}),s.on("+member",function(e,t,n){a.create(t,n),f[e].addUpdate(n+" has joined the room",i[t])}),s.on("-member",function(e,t){f[e].addUpdate(i[t].nickname+" has left the room",i[t])}),s.on("left",function(e){f[e].leave()});var c=new Date,d=0,u=function(){function e(t,n,i){_classCallCheck(this,e),this.name=n,this.id=t,this.isPrivate=i.isPrivate,this.creatorId=i.creatorId}return _createClass(e,[{key:"setUpWindow",value:function(){var e=this;this.el=jd.c("div",{class:"window"},[jd.c("header","Room",[jd.c("button",{class:"fa fa-times",events:{click:function(t){s.emit("leave",e.id)}}})]),jd.c("div",{class:"feed"}),jd.c("form",{class:"field"},[jd.c("input",{class:"f-input",maxlength:1e3,autofocus:!0}),jd.c("button",{class:"f-submit fa fa-reply"})])],jd.f(".main")),this.field=jd.f(".field",this.el),this.input=jd.f(".f-input",this.field),this.field.addEventListener("submit",function(t){t.preventDefault();var n=e.input.value.trim().substr(0,1e3);if(!(Date.now()-d<100)&&n.length)return d=Date.now(),s.emit("tell",e.id,n),t.target.reset(),e.addMessage(n,i[o]),!1}),this.feed=jd.f(".feed",this.el)}},{key:"leave",value:function(){jd.f(".main").removeChild(this.el),delete this.el,delete this.field,delete this.input,delete this.feed}},{key:"addMessage",value:function(e,n){var i=jd.c("div",{class:"m-text",_:e});this.lastSenderId===n.id?this.lastContent.appendChild(i):(this.lastContent=jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[n.createLabel(),jd.c("span",{class:"m-time",_:t()})]),i]),jd.c("div",{class:"message"},[n.createIcon(),this.lastContent],this.feed)),this.lastSenderId=n.id,this.scroll(),h.beep()}},{key:"addUpdate",value:function(e,n){jd.c("div",{class:"update",_:e,style:n?{color:n.hsl}:null},[jd.c("span",{class:"m-time",_:t()})],jd.f(".feed",this.el)),this.scroll()}},{key:"scroll",value:function(){this.feed.scrollTop=this.feed.scrollHeight}}]),e}(),f={};u.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var i=new(Function.prototype.bind.apply(u,[null].concat(t)));return f[i.id]=i,i},s.on("rooms",function(e){for(var t=0;t<e.length;t+=4)u.create(e[t],e[t+1],{creatorId:e[t+2],isPrivate:e[t+3]});r.init(f,jd.f(".people"))}),s.on("-room",function(e){console.log("heya"),r.remove(f[e].li),delete f[e]}),jd.f("form",r.el).addEventListener("submit",function(e){return e.preventDefault(),s.emit("+room",jd.f('input[type="text"]',e.target).value,jd.f('input[type="checkbox"]',e.target).value),!1}),s.on("+room",function(e,t,n,i){r.add(u.create(e,t,{creatorId:n,isPrivate:i})),n===o&&(jd.f("form",(void 0).el).reset(),jd.f("form",(void 0).el).classList.add("hide"))}),s.on("roomInvalid",function(e,t){jd.f(".error",jd.f("form",r.el)).textContent='Name "'+e+'" '+t+"."});var h=function(){var e=!0;window.addEventListener("focus",function(){e=!0}),window.addEventListener("blur",function(){e=!1});var t=AudioContext?new AudioContext:null;return{beep:function(){if(!e&&t){var n=t.createOscillator(),i=t.createGain();n.connect(i),n.frequency.value=587.33,i.gain.setValueAtTime(0,t.currentTime),i.gain.linearRampToValueAtTime(.8,t.currentTime+.1),i.gain.linearRampToValueAtTime(0,t.currentTime+.7),i.connect(t.destination),n.start(),n.stop(t.currentTime+.8)}}}}()}();