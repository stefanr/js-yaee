define(["exports"], function (exports) {
  /*
   * Yet Another EventEmitter
   * Node.js
   */

  /**
   * shim
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shim = shim;

  function shim(EventEmitter) {
    var events = require("events");

    if (events.EventEmitter.prototype instanceof EventEmitter) {
      return;
    }
    Object.setPrototypeOf(events.EventEmitter.prototype, EventEmitter.prototype);

    events.EventEmitter.prototype.on = (function (on) {
      return function () {
        EventEmitter.prototype.on.apply(this, arguments);
        return on.apply(this, arguments);
      };
    })(events.EventEmitter.prototype.on);

    events.EventEmitter.prototype.once = function once(type, listener) {
      var _this = this,
          _arguments = arguments;

      if (typeof listener !== "function") {
        throw new TypeError("Listener must be callable");
      }
      var fired = false;
      var g = function g() {
        if (!fired) {
          fired = true;
          listener.apply(_this, _arguments);
          events.EventEmitter.prototype.removeListener.call(_this, type, g);
        }
      };
      g.listener = listener;
      return events.EventEmitter.prototype.on.call(this, type, g);
    };
  }
});