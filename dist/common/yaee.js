/*
 * Yet Another EventEmitter
 */

/**
 * Listeners
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __listeners__ = new WeakMap();

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
      if (typeof listener !== "function") {
        throw new TypeError("Listener must be callable");
      }
      var typedListeners = __listeners__.get(this);
      if (typedListeners instanceof Map) {
        var listeners = typedListeners.get(type);
        if (listeners instanceof Array) {
          listeners.push(listener);
        } else {
          typedListeners.set(type, [listener]);
        }
      } else {
        __listeners__.set(this, new Map([[type, [listener]]]));
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var typedListeners = __listeners__.get(this);
      if (typedListeners instanceof Map) {
        var listeners = typedListeners.get(type);
        if (listeners instanceof Array) {
          for (var i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (!event) {
        throw new Error("Event must not be undefined");
      }
      if (!event.type) {
        throw new Error("Missing event type");
      }
      event.defineProperty("emitter", this);
      var typedListeners = __listeners__.get(this);
      if (typedListeners instanceof Map) {
        var listeners = typedListeners.get(event.type);
        if (listeners instanceof Array) {
          for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i].call(undefined, event);
          }
        }
      }
      return !event.defaultPrevented;
    }
  }, {
    key: "on",
    value: function on(type, listener) {
      EventEmitter.prototype.addEventListener.call(this, type, listener);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var event = new CustomEvent(type, {
        detail: args.length < 2 ? args[0] : args
      });
      return EventEmitter.prototype.dispatchEvent.call(this, event);
    }
  }], [{
    key: "getEventListeners",
    value: function getEventListeners(emitter) {
      return __listeners__.get(emitter);
    }
  }]);

  return EventEmitter;
})();

exports.EventEmitter = EventEmitter;

/**
 * Event
 */

var Event = (function () {
  function Event(type, eventInit) {
    _classCallCheck(this, Event);

    this.emitter = null;
    this.defaultPrevented = false;

    this.defineProperty("type", type);
  }

  _createClass(Event, [{
    key: "defineProperty",
    value: function defineProperty(name, value) {
      Object.defineProperty(this, name, {
        value: value,
        enumerable: true
      });
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {
      if (!this.defaultPrevented) {
        this.defineProperty("defaultPrevented", true);
      }
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

  function CustomEvent(type, eventInit) {
    _classCallCheck(this, CustomEvent);

    _get(Object.getPrototypeOf(CustomEvent.prototype), "constructor", this).call(this, type, eventInit);
    this.defineProperty("detail", eventInit && eventInit.detail);
  }

  return CustomEvent;
})(Event);

exports.CustomEvent = CustomEvent;