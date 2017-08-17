"use strict";Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),window.AudioContext=window.AudioContext||window.webkitAudioContext;
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};window.jd=function(e,t){function n(e,r){return r?("string"==typeof r&&(r=n(r)),r.querySelector(e)):o[e]||(o[e]=t.querySelector(e))}function r(e,n,r,o){var i=t.createElement(e);if("string"==typeof n)i.textContent=n;else if(n instanceof HTMLElement)i.appendChild(n);else if(null!==n&&"object"===(void 0===n?"undefined":_typeof(n)))for(var f in n)if("_"===f)n[f]instanceof HTMLElement?i.appendChild(n[f]):i.textContent=n[f];else if(null!==n[f]&&"object"===_typeof(n[f])){if("style"===f)for(var l in n[f])i.style.setProperty(l,n[f][l]);else if("events"===f)for(var y in n[f])i.addEventListener(y,n[f][y])}else i.setAttribute(f,n[f]);if(Array.isArray(r)){var a=!0,u=!1,c=void 0;try{for(var p,s=r[Symbol.iterator]();!(a=(p=s.next()).done);a=!0){var d=p.value;i.appendChild(d)}}catch(e){u=!0,c=e}finally{try{!a&&s.return&&s.return()}finally{if(u)throw c}}}return o&&o.appendChild(i),i}var o={};return{find:n,f:n,create:r,c:r}}(window,document);
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();!function(){function e(){localStorage.setItem("q","1"),document.body.removeChild(jd.f(".main")),document.body.appendChild(jd.c("form",{events:{submit:function(e){return e.preventDefault(),"pointprojects"===jd.f("input",e.target).value&&(localStorage.removeItem("q"),location.reload()),!1}}},[jd.c("input",{style:{border:"1px solid white"},autofocus:!0})]))}function t(e){u.emit("login",e,location.hash?location.hash.slice(1):void 0)}function n(e,t){if(c[e])return c[e];var n=l.create(e,t);return n.onlineIndicator=jd.c("div",{class:"message"},[n.createIcon(),jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[n.createLabel()])])],jd.f(".names",".people")),n}function i(){return m.setTime(Date.now()),(m.getHours()%12||12)+":"+("0"+m.getMinutes()).slice(-2)}function a(e){return e.replace(p,function(e){var t=e.match(g);return t&&t[1]&&11===t[1].length?'<iframe width=420 height=315 src="https://www.youtube.com/embed/'+t[1]+'" frameborder=0 allowfullscreen></iframe>':'<a href="'+e+'">'+(j.test(e)?"<img src="+e+">":e)+"</a>"})}function o(e,t){if(3===e.nodeType)t(e);else{var n=!0,i=!1,a=void 0;try{for(var r,s=e.childNodes[Symbol.iterator]();!(n=(r=s.next()).done);n=!0){o(r.value,t)}}catch(e){i=!0,a=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw a}}}}function r(e){var t=jd.f("#dynamic-favicon",document.head);t&&document.head.removeChild(t),jd.c("link",{id:"dynamic-favicon",rel:"shortcut icon",href:e},0,document.head)}null!==localStorage.getItem("q")&&e();var s=function(){function e(t,n){var i=this;_classCallCheck(this,e),this.name=n,this.buildItem=t,this.el=jd.f(".rooms"),this.ul=jd.f("ul",this.el),this.header=jd.f("span",this.el),jd.f("button",this.el).addEventListener("click",function(e){jd.f("form",i.el).classList.toggle("hide"),jd.f("input",i.el).focus()}),this.count=0}return _createClass(e,[{key:"init",value:function(e,t){for(var n in e)this.add(e[n]);t.appendChild(this.el)}},{key:"add",value:function(e){this.ul.appendChild(this.buildItem(jd.c("li"),e)),++this.count,this.header.textContent=this.name+" ("+this.count+")"}},{key:"remove",value:function(e){this.ul.removeChild(e),--this.count}}]),e}(),c={},l=function(){function e(t,n){_classCallCheck(this,e),this.id=t,this.nickname=n,this.displayName=n,d===t&&(this.displayName+=" (me)"),"jweiss"===this.nickname?this.hueRotate=-100:"Topher"===this.nickname?this.hueRotate=-220:this.hueRotate=65*t,this.hsl="hsl("+(210+this.hueRotate)+", 75%, 50%)"}return _createClass(e,[{key:"createIcon",value:function(){return jd.c("img",{class:"m-icon",style:{filter:"hue-rotate("+this.hueRotate+"deg)"}})}},{key:"createLabel",value:function(){return jd.c("span",{_:this.displayName,style:{color:this.hsl}})}}]),e}();l.create=function(e,t){if(c[e])return c[e];var n=new l(e,t);return c[n.id]=n,n};var d=void 0,u=io();u.on("ban",e);var f=jd.f(".nickname",".main");f.addEventListener("submit",function(e){return e.preventDefault(),t(jd.f("input",e.target).value),!1}),localStorage.getItem("nickname")?t(localStorage.getItem("nickname")):f.classList.remove("hide"),u.on("nickInvalid",function(e,t){jd.f(".error",f).textContent='Nickname "'+e+'" '+t+".",f.classList.remove("hide")}),u.on("login",function(e,t){jd.f(".main").removeChild(jd.f(".nickname",".main")),d=e,l.create(e,t),window.localStorage.setItem("nickname",t),jd.c("div",{class:"message"},[c[d].createIcon(),jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[c[d].createLabel(),jd.c("button",{class:"fa fa-times",events:{click:function(){localStorage.removeItem("nickname"),location.reload()}}})])])],jd.f(".names",".people"))});var h=new s(function(e,t){return t.isPrivate&&e.classList.add("hide"),t.creator&&(e.style.color=t.creator.hsl),e.textContent=t.name,e.addEventListener("click",function(){u.emit("join",t.id)}),t.li=e,e},"Rooms");u.on("join",function(e,t,i){for(var a=b[e],o=[],r=0;r<i.length;r+=2)n(i[r],i[r+1]),o.push(i[r+1]);if(!a.el){a.link=location.origin+"/#"+t,a.setUpWindow();var s="joined "+(a.creator?a.creator.nickname+"'s":"the")+" room "+a.name;o.length&&(s+=" with "+o.join(", ")),a.addUpdate(s,c[d]),a.isPrivate&&a.li.classList.remove("hide")}}),u.on("tell",function(e,t,n){var i=c[n];b[e].addMessage(t,i),i[e].typingIndicator&&i[e].typingIndicator.classList.add("hide")}),u.on("typing",function(e,t){var n=c[t];n[e]?n[e].typingIndicator.classList.remove("hide"):(n[e]={typingIndicator:n.createIcon()},b[e].typing.appendChild(n[e].typingIndicator))}),u.on("not typing",function(e,t){var n=c[t];n[e].typingIndicator&&n[e].typingIndicator.classList.add("hide")}),u.on("+member",function(e,t,i){var a=n(t,i);b[e].addUpdate(i+" has joined the room",a)}),u.on("-member",function(e,t){var n=c[t],i=b[e];i.addUpdate(n.nickname+" has left the room",n),i.typing.removeChild(n[e].typingIndicator),n.onlineIndicator.parentNode.removeChild(n.onlineIndicator)}),u.on("left",function(e){b[e].leave()});var m=new Date,v=0,p=/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/gi,j=/\.(jpe?g|png|gif)$/gi,g=/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,y=function(){function e(t,n,i){_classCallCheck(this,e),this.name=n,this.id=t,this.isPrivate=!!i.isPrivate,this.creatorId=i.creatorId,this.isPermanent=!!i.isPermanent}return _createClass(e,[{key:"setUpWindow",value:function(){var e=this;this.el=jd.c("div",{class:"window"},[jd.c("div",{class:"header"},[jd.c("span",0,[jd.c("button",jd.c("a",{class:"fa fa-link",href:this.link,tabindex:2})),jd.c("button",{class:"fa fa-envelope",tabindex:2,events:{click:function(e){var t=jd.f("form",e.target.nextElementSibling);t.classList.toggle("fade"),jd.f("input",t).value=localStorage.getItem("last-emailed")||""}}}),jd.c("span",{style:"position: relative;"},[jd.c("form",{class:"fade fadeable email",events:{submit:function(t){t.preventDefault();var n=jd.f("input",t.target).value;return u.emit("email",n,e.id),t.target.classList.toggle("fade"),t.target.reset(),localStorage.setItem("last-emailed",n),!1}}},[jd.c("input",{type:"email",multiple:!0,placeholder:"Email Address"}),jd.c("button",{class:"fa fa-arrow-right"})])])]),jd.c("span",{_:this.name,style:this.creator?{color:this.creator.hsl}:null}),jd.c("button",{class:"fa fa-times",events:{click:function(t){u.emit("leave",e.id)}}})]),jd.c("div",{class:"feed"}),jd.c("div",{class:"typing"}),jd.c("div",{class:"field"},[jd.c("div",{class:"f-input",tabindex:1,contenteditable:!0}),jd.c("button",{class:"f-submit fa fa-reply"})])],jd.f(".windows")),this.field=jd.f(".field",this.el),this.input=jd.f(".f-input",this.field),this.input.addEventListener("keydown",function(t){if(!t.shiftKey&&13===t.keyCode){t.preventDefault();var n=e.input.innerHTML.trim().substr(0,2e3);if(Date.now()-v<100||!n.length)return;return v=Date.now(),u.emit("tell",e.id,n),e.input.textContent="",e.addMessage(n,c[d]),!1}e.input.innerHTML.length>2e3&&(e.input.innerHTML=e.input.innerHTML.substring(0,2e3)),void 0===e.typeTimeoutId&&u.emit("typing",e.id),clearTimeout(e.typeTimeoutId),e.typeTimeoutId=setTimeout(function(){u.emit("not typing",e.id),e.typeTimeoutId=void 0},3e3)}),this.input.focus(),this.feed=jd.f(".feed",this.el),this.typing=jd.f(".typing",this.el)}},{key:"leave",value:function(){jd.f(".windows").removeChild(this.el),delete this.el,delete this.field,delete this.input,delete this.feed}},{key:"addMessage",value:function(e,t){var n=jd.c("div",{class:"m-text"});-1===e.indexOf("/")&&-1===e.indexOf("&")&&-1===e.indexOf("<")?n.textContent=e:(n.innerHTML=e,o(n,function(e){var t=e.parentNode;t.src||t.href||(t.innerHTML=a(t.innerHTML))}));var r=i();this.lastSenderId===t.id&&this.lastTime===r?this.lastContent.appendChild(n):(this.lastContent=jd.c("div",{class:"m-content"},[jd.c("div",{class:"m-header"},[t.createLabel(),jd.c("span",{class:"m-time",_:r})]),n]),jd.c("div",{class:"message"},[t.createIcon(),this.lastContent],this.feed)),this.lastSenderId=t.id,this.lastTime=r,this.scroll(),k.notify()}},{key:"addUpdate",value:function(e,t){jd.c("div",{class:"update",_:e,style:t?{color:t.hsl}:null},[jd.c("span",{class:"m-time",_:i()})],jd.f(".feed",this.el)),this.scroll(),this.lastSenderId=-1}},{key:"scroll",value:function(){this.feed.scrollHeight-(this.feed.scrollTop+this.feed.clientHeight)<this.feed.clientHeight/2&&(this.feed.scrollTop=this.feed.scrollHeight)}},{key:"creator",get:function(){return c[this.creatorId]}}]),e}(),b={};y.create=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];var i=new(Function.prototype.bind.apply(y,[null].concat(t)));return b[i.id]=i,i},u.once("rooms",function(e){for(var t=0;t<e.length;t+=5)y.create(e[t],e[t+1],{creatorId:e[t+2],isPrivate:!!e[t+3],isPermanent:!!e[t+4]});h.init(b,jd.f(".people"))}),u.on("reconnect",function(){for(var e in b)u.emit("join",b[e].id)}),u.on("-room",function(e){h.remove(b[e].li),delete b[e]});var C={el:jd.f("form",h.el),privateCount:5,permanentCount:1};C.name=jd.f('input[type="text"]',C.el),C.isPrivate=jd.f('label[name="priv"]',C.el),C.isPermanent=jd.f('label[name="perm"]',C.el),C.el.addEventListener("submit",function(e){return e.preventDefault(),u.emit("+room",C.name.value.trim(),jd.f("input",C.isPrivate).checked?1:0,jd.f("input",C.isPermanent).checked?1:0),!1}),u.on("+room",function(e,t,n,i,a){h.add(y.create(e,t,{creatorId:n,isPrivate:i,isPermanent:a})),n===d&&(jd.f("form",".rooms").reset(),jd.f("form",".rooms").classList.add("hide"),i&&--C.privateCount<=0&&C.el.removeChild(C.isPrivate),a&&--C.permanentCount<=0&&C.el.removeChild(C.isPermanent))}),u.on("roomInvalid",function(e,t){jd.f(".error",C.el).textContent='Name "'+e+'" '+t+"."});var k=function(){function e(){if(n){var e=n.createOscillator(),t=n.createGain();e.connect(t),e.frequency.value=587.33,t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.8,n.currentTime+.1),t.gain.linearRampToValueAtTime(0,n.currentTime+.7),t.connect(n.destination),e.start(),e.stop(n.currentTime+.8)}}var t=!0;window.addEventListener("focus",function(){t=!0,r("fav.ico")}),window.addEventListener("blur",function(){t=!1});var n=AudioContext?new AudioContext:null;return{notify:function(){t||(r("update.ico"),e())}}}()}();