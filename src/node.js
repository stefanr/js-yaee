/*
 * Yet Another EventEmitter
 * Node.js
 */

/**
 * shim
 */
export function shim(EventEmitter: callable): void {
  let events = require("events");

  if (events.EventEmitter.prototype instanceof EventEmitter) {
    return;
  }
  Object.setPrototypeOf(events.EventEmitter.prototype, EventEmitter.prototype);

  events.EventEmitter.prototype.on = ((on) => {
    return function () {
      EventEmitter.prototype.on.apply(this, arguments);
      return on.apply(this, arguments);
    };
  })(events.EventEmitter.prototype.on);

  events.EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be callable");
    }
    let fired = false;
    let g = () => {
      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
        events.EventEmitter.prototype.removeListener.call(this, type, g);
      }
    }
    g.listener = listener;
    return events.EventEmitter.prototype.on.call(this, type, g);
  };
}
