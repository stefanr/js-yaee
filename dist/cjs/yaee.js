/*
 * Yet Another EventEmitter
 */

/**
 * Global
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.getEventListeners = _getEventListeners;
exports.addEventListener = _addEventListener;
exports.removeEventListener = _removeEventListener;
exports.dispatchEvent = _dispatchEvent;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __global__ = (function () {
  if (typeof window !== "undefined" && window instanceof window.Window) {
    return window;
  } else if (typeof global !== "undefined") {
    return global;
  }
  return Object.create(null);
})();

/**
 * Symbols
 */
var SYM_LISTENERS = Symbol["for"]("yaee.__listeners__");

/**
 * Listeners
 */
var __listeners__ = (function () {
  if (!__global__[SYM_LISTENERS]) {
    Object.defineProperty(__global__, SYM_LISTENERS, {
      value: new WeakMap()
    });
  }
  return __global__[SYM_LISTENERS];
})();

/**
 * getEventListeners
 */

function _getEventListeners(emitter) {
  return __listeners__.get(emitter);
}

/**
 * addEventListener
 */

function _addEventListener(emitter, type, listener) {
  if (this !== undefined) {
    var _ref = [this, emitter, type];
    emitter = _ref[0];
    type = _ref[1];
    listener = _ref[2];
  }
  if (typeof listener !== "function") {
    throw new TypeError("Listener must be callable");
  }
  if (typeof type === "function") {
    var _ref2 = [(function (type) {
      return function (e) {
        if (e instanceof type) {
          listener.listener(e);
        }
      };
    })(type), listener];
    listener = _ref2[0];
    listener.listener = _ref2[1];

    type = Function;
  }
  var typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    var listeners = typedListeners.get(type);
    if (listeners instanceof Array) {
      listeners.push(listener);
    } else {
      typedListeners.set(type, [listener]);
    }
  } else {
    __listeners__.set(emitter, new Map([[type, [listener]]]));
  }
}

/**
 * removeEventListener
 */

function _removeEventListener(emitter, type, listener) {
  if (this !== undefined) {
    var _ref3 = [this, emitter, type];
    emitter = _ref3[0];
    type = _ref3[1];
    listener = _ref3[2];
  }
  if (typeof type === "function") {
    type = Function;
  }
  var typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    var listeners = typedListeners.get(type);
    if (listeners instanceof Array) {
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener || listeners[i].listener === listener) {
          listeners.splice(i--, 1);
        }
      }
    }
  }
}

/**
 * dispatchEvent
 */

function _dispatchEvent(emitter, event) {
  if (this !== undefined) {
    var _ref4 = [this, emitter];
    emitter = _ref4[0];
    event = _ref4[1];
  }
  if (!event) {
    throw new Error("Event must be an object");
  }
  if (!event.type) {
    throw new Error("Missing event type");
  }
  if (event instanceof Event) {
    event.defineProperty("emitter", emitter);
  }
  var typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    var listeners = [];
    if (typedListeners.has(event.type)) {
      listeners = listeners.concat(typedListeners.get(event.type));
    }
    if (typedListeners.has(Function)) {
      listeners = listeners.concat(typedListeners.get(Function));
    }
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }
  return !event.defaultPrevented;
}

/**
 * EventEmitter
 */

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
  }

  _createClass(EventEmitter, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      _addEventListener.call(this, type, listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      _removeEventListener.call(this, type, listener);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      return _dispatchEvent.call(this, event);
    }
  }, {
    key: "on",
    value: function on(type, listener) {
      _addEventListener.call(this, type, listener);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _dispatchEvent.call(this, new CustomEvent(type, {
        detail: args.length < 2 ? args[0] : args
      }));
      return true;
    }
  }], [{
    key: "getEventListeners",
    value: function getEventListeners(emitter) {
      return _getEventListeners(emitter);
    }
  }]);

  return EventEmitter;
})();

exports.EventEmitter = EventEmitter;

/**
 * Event
 */

var Event = (function () {
  function Event(type, init) {
    _classCallCheck(this, Event);

    this.type = null;
    this.emitter = null;
    this.defaultPrevented = false;
    this.propagationStopped = false;

    this.defineProperty("type", type);
  }

  _createClass(Event, [{
    key: "defineProperty",
    value: function defineProperty(name, value) {
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        value: value
      });
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {
      if (this.defaultPrevented) {
        return;
      }
      this.defineProperty("defaultPrevented", true);
    }
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      if (this.propagationStopped) {
        return;
      }
      this.defineProperty("propagationStopped", true);
    }
  }]);

  return Event;
})();

exports.Event = Event;

/**
 * CustomEvent
 */

var CustomEvent = (function (_Event) {
  _inherits(CustomEvent, _Event);

  function CustomEvent(type, init) {
    _classCallCheck(this, CustomEvent);

    _get(Object.getPrototypeOf(CustomEvent.prototype), "constructor", this).call(this, type, init);
    this.detail = null;
    this.defineProperty("detail", init && init.detail || null);
  }

  return CustomEvent;
})(Event);

exports.CustomEvent = CustomEvent;