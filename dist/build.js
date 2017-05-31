"use strict";Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),window.AudioContext=window.AudioContext||window.webkitAudioContext;
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};window.jd=function(e,t){function n(e,r){return r?("string"==typeof r&&(r=n(r)),r.querySelector(e)):o[e]||(o[e]=t.querySelector(e))}function r(e,n,r,o){var i=t.createElement(e);if("string"==typeof n)i.textContent=n;else if(n instanceof HTMLElement)i.appendChild(n);else if(null!==n&&"object"===(void 0===n?"undefined":_typeof(n)))for(var f in n)if("_"===f)n[f]instanceof HTMLElement?i.appendChild(n[f]):i.textContent=n[f];else if(null!==n[f]&&"object"===_typeof(n[f])){if("style"===f)for(var l in n[f])i.style.setProperty(l,n[f][l]);else if("events"===f)for(var y in n[f])i.addEventListener(y,n[f][y])}else i.setAttribute(f,n[f]);if(Array.isArray(r)){var a=!0,u=!1,c=void 0;try{for(var p,s=r[Symbol.iterator]();!(a=(p=s.next()).done);a=!0){var d=p.value;i.appendChild(d)}}catch(e){u=!0,c=e}finally{try{!a&&s.return&&s.return()}finally{if(u)throw c}}}return o&&o.appendChild(i),i}var o={};return{find:n,f:n,create:r,c:r}}(window,document);
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();!function(){function e(){localStorage.setItem("q","1"),document.body.removeChild(jd.f(".main")),document.body.appendChild(jd.c("form",{events:{submit:function(e){return e.preventDefault(),"pointprojects"===jd.f("input",e.target).value&&(localStorage.removeItem("q"),location.reload()),!1}}},[jd.c("input",{style:{border:"1px solid white"},autofocus:!0})]))}function t(e){c.emit("login",e,location.hash?location.hash.slice(1):void 0)}function n(){return f.setTime(Date.now()),(f.getHours()%12||12)+":"+("0"+f.getMinutes()).slice(-2)}function i(e){return e.replace(m,function(e){return'<a href="'+e+'">'+(v.test(e)?"<img src="+e+">":e)+"</a>"})}function a(e){var t=document.createElement("link"),n=document.getElementById("dynamic-favicon");t.id="dynamic-favicon",t.rel="icon",t.href=e,n&&document.head.removeChild(n),document.head.appendChild(t)}null!==localStorage.getItem("q")&&e();var o=function(){function e(t,n){var i=this;_classCallCheck(this,e),this.name=n,this.buildItem=t,this.el=jd.f(".rooms"),this.ul=jd.f("ul",this.el),this.header=jd.f("span",this.el),jd.f("button",this.el).addEventListener("click",function(e){jd.f("form",i.el).classList.toggle("hide"),jd.f("input",i.el).focus()}),this.count=0}return _createClass(e,[{key:"init",value:function(e,t){for(var n in e)this.add(e[n]);t.appendChild(this.el)}},{key:"add",value:function(e){this.ul.appendChild(this.buildItem(jd.c("li"),e)),++this.count,this.header.textContent=this.name+" ("+this.count+")"}},{key:"remove",value:function(e){this.ul.removeChild(e),--this.count}}]),e}(),s={},r=function(){function e(t,n){_classCallCheck(this,e),this.id=t,this.nickname=n,this.displayName=n,l===t&&(this.displayName+=" (me)"),"jweiss"===this.nickname?this.hueRotate=-100:"Topher"===this.nickname?this.hueRotate=-220:this.hueRotate=65*t,this.hsl="hsl("+(210+this.hueRotate)+", 75%, 50%)"}return _createClass(e,[{key:"createIcon",value:function(){return jd.c("img",{class:"m-icon",style:{filter:"hue-rotate("+this.hueRotate+"deg)"}})}},{key:"createLabel",value:function(){return jd.c("span",{_:this.displayName,style:{color:this.hsl}})}}]),e}();r.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var i=new(Function.prototype.bind.apply(r,[null].concat(t)));return s[i.id]=i,i};var l=void 0,c=io();c.on("ban",e);var d=jd.f(".nickname",".main");d.addEventListener("submit",function(e){return e.preventDefault(),t(jd.f("input",e.target).value),!1}),localStorage.getItem("nickname")?t(localStorage.getItem("nickname")):d.classList.remove("hide"),c.on("nickInvalid",function(e,t){jd.f(".error",d).textContent='Nickname "'+e+'" '+t+".",d.classList.remove("hide")}),c.on("login",function(e,t){jd.f(".main").removeChild(jd.f(".nickname",".main")),l=e,r.create(e,t),window.localStorage.setItem("nickname",t),jd.c("div",{class:"message"},[s[l].createIcon(),jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[s[l].createLabel(),jd.c("button",{class:"fa fa-times",events:{click:function(){localStorage.removeItem("nickname"),location.reload()}}})])])],jd.f(".names",".people"))});var u=new o(function(e,t){return t.isPrivate&&e.classList.add("hide"),t.creator&&(e.style.color=t.creator.hsl),e.textContent=t.name,e.addEventListener("click",function(){c.emit("join",t.id)}),t.li=e,e},"Rooms");c.on("join",function(e,t,n){for(var i=j[e],a=[],o=0;o<n.length;o+=2)r.create(n[o],n[o+1]),a.push(n[o+1]);if(!i.el){i.link=location.origin+"/#"+t,i.setUpWindow();var c="joined "+(i.creator?i.creator.nickname+"'s":"the")+" room "+i.name;a.length&&(c+=" with "+a.join(", ")),i.addUpdate(c,s[l]),i.isPrivate&&i.li.classList.remove("hide")}}),c.on("tell",function(e,t,n){j[e].addMessage(t,s[n])}),c.on("+member",function(e,t,n){r.create(t,n),j[e].addUpdate(n+" has joined the room",s[t])}),c.on("-member",function(e,t){j[e].addUpdate(s[t].nickname+" has left the room",s[t])}),c.on("left",function(e){j[e].leave()});var f=new Date,h=0,m=/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g,v=/\.(jpe?g|png|gif)$/g,p=function(){function e(t,n,i){_classCallCheck(this,e),this.name=n,this.id=t,this.isPrivate=!!i.isPrivate,this.creatorId=i.creatorId,this.isPermanent=!!i.isPermanent}return _createClass(e,[{key:"setUpWindow",value:function(){var e=this;this.el=jd.c("div",{class:"window"},[jd.c("header",null,[jd.c("span",null,[jd.c("button",jd.c("a",{class:"fa fa-link",href:this.link,tabindex:2})),jd.c("button",jd.c("a",{class:"fa fa-envelope",href:"mailto:?subject=Articulatte%20room%20invite&body=Join%20here!%20"+this.link,tabindex:2}))]),jd.c("span",{_:this.name,style:this.creator?{color:this.creator.hsl}:null}),jd.c("button",{class:"fa fa-times",events:{click:function(t){c.emit("leave",e.id)}}})]),jd.c("div",{class:"feed"}),jd.c("form",{class:"field"},[jd.c("textarea",{class:"f-input",maxlength:1e3,tabindex:1,rows:1,events:{keypress:function(t){if(!t.shiftKey&&13===t.keyCode){t.preventDefault();var n=i(e.input.value.trim().substr(0,1e3));if(Date.now()-h<100||!n.length)return;return h=Date.now(),c.emit("tell",e.id,n),e.field.reset(),e.addMessage(n,s[l]),!1}}}}),jd.c("button",{class:"f-submit fa fa-reply"})])],jd.f(".windows")),this.field=jd.f(".field",this.el),this.input=jd.f(".f-input",this.field),this.input.focus(),this.feed=jd.f(".feed",this.el)}},{key:"leave",value:function(){jd.f(".windows").removeChild(this.el),delete this.el,delete this.field,delete this.input,delete this.feed}},{key:"addMessage",value:function(e,t){var i=jd.c("div",{class:"m-text"});-1===e.indexOf("<")?i.textContent=e:i.innerHTML=e;var a=n();this.lastSenderId===t.id&&this.lastTime===a?this.lastContent.appendChild(i):(this.lastContent=jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[t.createLabel(),jd.c("span",{class:"m-time",_:a})]),i]),jd.c("div",{class:"message"},[t.createIcon(),this.lastContent],this.feed)),this.lastSenderId=t.id,this.lastTime=a,this.scroll(),y.notify()}},{key:"addUpdate",value:function(e,t){jd.c("div",{class:"update",_:e,style:t?{color:t.hsl}:null},[jd.c("span",{class:"m-time",_:n()})],jd.f(".feed",this.el)),this.scroll(),this.lastSenderId=-1}},{key:"scroll",value:function(){this.feed.scrollHeight-(this.feed.scrollTop+this.feed.clientHeight)<this.feed.clientHeight/2&&(this.feed.scrollTop=this.feed.scrollHeight)}},{key:"creator",get:function(){return s[this.creatorId]}}]),e}(),j={};p.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var i=new(Function.prototype.bind.apply(p,[null].concat(t)));return j[i.id]=i,i},c.once("rooms",function(e){for(var t=0;t<e.length;t+=5)p.create(e[t],e[t+1],{creatorId:e[t+2],isPrivate:!!e[t+3],isPermanent:!!e[t+4]});u.init(j,jd.f(".people"))}),c.on("reconnect",function(){for(var e in j)c.emit("join",j[e].id)}),c.on("-room",function(e){u.remove(j[e].li),delete j[e]});var g={el:jd.f("form",u.el),privateCount:5,permanentCount:1};g.name=jd.f('input[type="text"]',g.el),g.isPrivate=jd.f('label[name="priv"]',g.el),g.isPermanent=jd.f('label[name="perm"]',g.el),g.el.addEventListener("submit",function(e){return e.preventDefault(),c.emit("+room",g.name.value.trim(),jd.f("input",g.isPrivate).checked?1:0,jd.f("input",g.isPermanent).checked?1:0),!1}),c.on("+room",function(e,t,n,i,a){u.add(p.create(e,t,{creatorId:n,isPrivate:i,isPermanent:a})),n===l&&(jd.f("form",".rooms").reset(),jd.f("form",".rooms").classList.add("hide"),i&&--g.privateCount<=0&&g.el.removeChild(g.isPrivate),a&&--g.permanentCount<=0&&g.el.removeChild(g.isPermanent))}),c.on("roomInvalid",function(e,t){jd.f(".error",g.el).textContent='Name "'+e+'" '+t+"."});var y=function(){function e(){if(n){var e=n.createOscillator(),t=n.createGain();e.connect(t),e.frequency.value=587.33,t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.8,n.currentTime+.1),t.gain.linearRampToValueAtTime(0,n.currentTime+.7),t.connect(n.destination),e.start(),e.stop(n.currentTime+.8)}}var t=!0;window.addEventListener("focus",function(){t=!0,a("fav.ico")}),window.addEventListener("blur",function(){t=!1});var n=AudioContext?new AudioContext:null;return{notify:function(){t||(a("update.ico"),e())}}}()}();