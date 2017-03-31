// https://gist.github.com/juliocesar/926500
(function (isStorage) {
    if (!isStorage) {
        var data = {},
            undef;
        window.localStorage = {
            setItem     : function(id, val) { return data[id] = String(val); },
            getItem     : function(id) { return data.hasOwnProperty(id) ? data[id] : undef; },
            removeItem  : function(id) { return delete data[id]; },
            clear       : function() { return data = {}; }
        };
    }
})((function () {
    try {
        return "localStorage" in window && window.localStorage != null;
    } catch (e) {
        return false;
    }
})());

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
