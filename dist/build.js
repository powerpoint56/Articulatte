"use strict";Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),window.AudioContext=window.AudioContext||window.webkitAudioContext;
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};window.jd=function(e,t){function n(e,r){return r?("string"==typeof r&&(r=n(r)),r.querySelector(e)):o[e]||(o[e]=t.querySelector(e))}function r(e,n,r,o){var i=t.createElement(e);if("string"==typeof n)i.textContent=n;else if(n instanceof HTMLElement)i.appendChild(n);else if(null!==n&&"object"===(void 0===n?"undefined":_typeof(n)))for(var f in n)if("_"===f)n[f]instanceof HTMLElement?i.appendChild(n[f]):i.textContent=n[f];else if(null!==n[f]&&"object"===_typeof(n[f])){if("style"===f)for(var l in n[f])i.style.setProperty(l,n[f][l]);else if("events"===f)for(var y in n[f])i.addEventListener(y,n[f][y])}else i.setAttribute(f,n[f]);if(Array.isArray(r)){var a=!0,u=!1,c=void 0;try{for(var p,s=r[Symbol.iterator]();!(a=(p=s.next()).done);a=!0){var d=p.value;i.appendChild(d)}}catch(e){u=!0,c=e}finally{try{!a&&s.return&&s.return()}finally{if(u)throw c}}}return o&&o.appendChild(i),i}var o={};return{find:n,f:n,create:r,c:r}}(window,document);
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();!function(){function e(e){o.emit("login",e,location.hash?location.hash.slice(1):void 0)}function t(){return c.setTime(Date.now()),(c.getHours()%12||12)+":"+("0"+c.getMinutes()).slice(-2)}var n=function(){function e(t,n){var i=this;_classCallCheck(this,e),this.name=n,this.buildItem=t,this.el=jd.f(".rooms"),this.ul=jd.f("ul",this.el),this.header=jd.f("span",this.el),jd.f("button",this.el).addEventListener("click",function(e){jd.f("form",i.el).classList.toggle("hide"),jd.f("input",i.el).focus()}),this.count=0}return _createClass(e,[{key:"init",value:function(e,t){for(var n in e)this.add(e[n]);t.appendChild(this.el)}},{key:"add",value:function(e){this.ul.appendChild(this.buildItem(jd.c("li"),e)),++this.count,this.header.textContent=this.name+" ("+this.count+")"}},{key:"remove",value:function(e){this.ul.removeChild(e),--this.count}}]),e}(),i={},a=function(){function e(t,n){_classCallCheck(this,e),this.id=t,this.nickname=n,this.displayName=n,s===t&&(this.displayName+=" (me)"),this.hueRotate=65*t,this.hsl="hsl("+(210+this.hueRotate)+", 75%, 50%)"}return _createClass(e,[{key:"createIcon",value:function(){return jd.c("img",{class:"m-icon",style:{filter:"hue-rotate("+this.hueRotate+"deg)"}})}},{key:"createLabel",value:function(){return jd.c("span",{_:this.displayName,style:{color:this.hsl}})}}]),e}();a.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=new(Function.prototype.bind.apply(a,[null].concat(t)));return i[s.id]=s,s};var s=void 0,o=io(),r=jd.f(".nickname",".main");r.addEventListener("submit",function(t){return t.preventDefault(),e(jd.f("input",t.target).value),!1}),localStorage.getItem("nickname")?e(localStorage.getItem("nickname")):r.classList.remove("hide"),o.on("nickInvalid",function(e,t){jd.f(".error",r).textContent='Nickname "'+e+'" '+t+".",r.classList.remove("hide")}),o.on("login",function(e,t){jd.f(".main").removeChild(jd.f(".nickname",".main")),s=e,a.create(e,t),window.localStorage.setItem("nickname",t),jd.c("div",{class:"message"},[i[s].createIcon(),jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[i[s].createLabel(),jd.c("button",{class:"fa fa-times",events:{click:function(){localStorage.removeItem("nickname"),location.reload()}}})])])],jd.f(".people"))});var l=new n(function(e,t){return t.isPrivate&&e.classList.add("hide"),t.creator&&(e.style.color=t.creator.hsl),e.textContent=t.name,e.addEventListener("click",function(){o.emit("join",t.id)}),t.li=e,e},"Rooms");o.on("join",function(e,t,n){for(var o=f[e],r=[],l=0;l<n.length;l+=2)a.create(n[l],n[l+1]),r.push(n[l+1]);if(!o.el){o.link=location.origin+"/#"+t,o.setUpWindow();var c="joined "+(o.creator?o.creator.nickname+"'s":"the")+" room "+o.name;r.length&&(c+=" with "+r.join(", ")),o.addUpdate(c,i[s]),o.isPrivate&&o.li.classList.remove("hide")}}),o.on("tell",function(e,t,n){f[e].addMessage(t,i[n])}),o.on("+member",function(e,t,n){a.create(t,n),f[e].addUpdate(n+" has joined the room",i[t])}),o.on("-member",function(e,t){f[e].addUpdate(i[t].nickname+" has left the room",i[t])}),o.on("left",function(e){f[e].leave()});var c=new Date,d=0,u=function(){function e(t,n,i){_classCallCheck(this,e),this.name=n,this.id=t,this.isPrivate=!!i.isPrivate,this.creatorId=i.creatorId,this.isPermanent=!!i.isPermanent}return _createClass(e,[{key:"setUpWindow",value:function(){var e=this;this.el=jd.c("div",{class:"window"},[jd.c("header",null,[jd.c("span",null,[jd.c("button",jd.c("a",{class:"fa fa-link",href:this.link,tabindex:2})),jd.c("button",jd.c("a",{class:"fa fa-envelope",href:"mailto:?subject=Articulatte%20room%20invite&body=Join%20here!%20"+this.link,tabindex:2}))]),jd.c("span",{_:this.name,style:this.creator?{color:this.creator.hsl}:null}),jd.c("button",{class:"fa fa-times",events:{click:function(t){o.emit("leave",e.id)}}})]),jd.c("div",{class:"feed"}),jd.c("form",{class:"field"},[jd.c("input",{class:"f-input",maxlength:1e3,tabindex:1}),jd.c("button",{class:"f-submit fa fa-reply"})])],jd.f(".windows")),this.field=jd.f(".field",this.el),this.input=jd.f(".f-input",this.field),this.input.focus(),this.field.addEventListener("submit",function(t){t.preventDefault();var n=e.input.value.trim().substr(0,1e3).replace(/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g,'<a href="$1">$1</a>');if(!(Date.now()-d<100)&&n.length)return d=Date.now(),o.emit("tell",e.id,n),t.target.reset(),e.addMessage(n,i[s]),!1}),this.feed=jd.f(".feed",this.el)}},{key:"leave",value:function(){jd.f(".main").removeChild(this.el),delete this.el,delete this.field,delete this.input,delete this.feed}},{key:"addMessage",value:function(e,n){var i=jd.c("div",{class:"m-text"});e.includes("<")?i.innerHTML=e:i.textContent=e,this.lastSenderId===n.id?this.lastContent.appendChild(i):(this.lastContent=jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[n.createLabel(),jd.c("span",{class:"m-time",_:t()})]),i]),jd.c("div",{class:"message"},[n.createIcon(),this.lastContent],this.feed)),this.lastSenderId=n.id,this.scroll(),m.beep()}},{key:"addUpdate",value:function(e,n){jd.c("div",{class:"update",_:e,style:n?{color:n.hsl}:null},[jd.c("span",{class:"m-time",_:t()})],jd.f(".feed",this.el)),this.scroll(),this.lastSenderId=-1}},{key:"scroll",value:function(){this.feed.scrollTop=this.feed.scrollHeight}},{key:"creator",get:function(){return i[this.creatorId]}}]),e}(),f={};u.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var i=new(Function.prototype.bind.apply(u,[null].concat(t)));return f[i.id]=i,i},o.once("rooms",function(e){for(var t=0;t<e.length;t+=5)u.create(e[t],e[t+1],{creatorId:e[t+2],isPrivate:!!e[t+3],isPermanent:!!e[t+4]});l.init(f,jd.f(".people"))}),o.on("reconnect",function(){for(var e in f)o.emit("join",f[e].id)}),o.on("-room",function(e){l.remove(f[e].li),delete f[e]});var h={el:jd.f("form",l.el),privateCount:5,permanentCount:1};h.name=jd.f('input[type="text"]',h.el),h.isPrivate=jd.f('label[name="priv"]',h.el),h.isPermanent=jd.f('label[name="perm"]',h.el),h.el.addEventListener("submit",function(e){return e.preventDefault(),o.emit("+room",h.name.value.trim(),jd.f("input",h.isPrivate).checked?1:0,jd.f("input",h.isPermanent).checked?1:0),!1}),o.on("+room",function(e,t,n,i,a){l.add(u.create(e,t,{creatorId:n,isPrivate:i,isPermanent:a})),n===s&&(jd.f("form",".rooms").reset(),jd.f("form",".rooms").classList.add("hide"),i&&--h.privateCount<=0&&h.el.removeChild(h.isPrivate),a&&--h.permanentCount<=0&&h.el.removeChild(h.isPermanent))}),o.on("roomInvalid",function(e,t){jd.f(".error",h.el).textContent='Name "'+e+'" '+t+"."});var m=function(){var e=!0;window.addEventListener("focus",function(){e=!0}),window.addEventListener("blur",function(){e=!1});var t=AudioContext?new AudioContext:null;return{beep:function(){if(!e&&t){var n=t.createOscillator(),i=t.createGain();n.connect(i),n.frequency.value=587.33,i.gain.setValueAtTime(0,t.currentTime),i.gain.linearRampToValueAtTime(.8,t.currentTime+.1),i.gain.linearRampToValueAtTime(0,t.currentTime+.7),i.connect(t.destination),n.start(),n.stop(t.currentTime+.8)}}}}()}();