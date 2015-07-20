/*
 * Yet Another EventEmitter
 * Node.js EventEmitter Shim
 */
module.exports = function (yaee) {
  var events = require("events");

  Object.setPrototypeOf(events.EventEmitter.prototype, yaee.EventEmitter.prototype);

  events.EventEmitter.prototype.on = (function (on) {
    return function () {
      yaee.EventEmitter.prototype.on.apply(this, arguments);
      return on.apply(this, arguments);
    };
  })(events.EventEmitter.prototype.on);

  events.EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be callable");
    }
    var self = this;
    var fired = false;
    function g() {
      if (!fired) {
        fired = true;
        listener.apply(self, arguments);
        events.EventEmitter.prototype.removeListener.call(self, type, g);
      }
    }
    g.listener = listener;
    return events.EventEmitter.prototype.on.call(this, type, g);
  };
};
