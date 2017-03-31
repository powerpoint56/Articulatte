if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
