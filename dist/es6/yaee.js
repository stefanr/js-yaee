/*
 * Yet Another EventEmitter
 */

/**
 * Listeners
 */
"use strict";

const __listeners__ = new WeakMap();

/**
 * EventEmitter
 */

class EventEmitter {

  static getEventListeners(emitter) {
    return __listeners__.get(emitter);
  }

  addEventListener(type, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be callable");
    }
    let typedListeners = __listeners__.get(this);
    if (typedListeners instanceof Map) {
      let listeners = typedListeners.get(type);
      if (listeners instanceof Array) {
        listeners.push(listener);
      } else {
        typedListeners.set(type, [listener]);
      }
    } else {
      __listeners__.set(this, new Map([[type, [listener]]]));
    }
  }

  removeEventListener(type, listener) {
    let typedListeners = __listeners__.get(this);
    if (typedListeners instanceof Map) {
      let listeners = typedListeners.get(type);
      if (listeners instanceof Array) {
        for (let i = 0, len = listeners.length; i < len; i++) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  dispatchEvent(event) {
    if (!event) {
      throw new Error("Event must not be undefined");
    }
    if (!event.type) {
      throw new Error("Missing event type");
    }
    event.defineProperty("emitter", this);
    let typedListeners = __listeners__.get(this);
    if (typedListeners instanceof Map) {
      let listeners = typedListeners.get(event.type);
      if (listeners instanceof Array) {
        for (let i = 0, len = listeners.length; i < len; i++) {
          listeners[i].call(undefined, event);
        }
      }
    }
    return !event.defaultPrevented;
  }

  on(type, listener) {
    EventEmitter.prototype.addEventListener.call(this, type, listener);
    return this;
  }

  emit(type, ...args) {
    let event = new CustomEvent(type, {
      detail: args.length < 2 ? args[0] : args
    });
    return EventEmitter.prototype.dispatchEvent.call(this, event);
  }
}

export { EventEmitter };

/**
 * Event
 */

class Event {

  emitter = null;
  defaultPrevented = false;

  constructor(type, eventInit) {
    this.defineProperty("type", type);
  }

  defineProperty(name, value) {
    Object.defineProperty(this, name, {
      value: value,
      enumerable: true
    });
  }

  preventDefault() {
    if (!this.defaultPrevented) {
      this.defineProperty("defaultPrevented", true);
    }
  }
}

export { Event };

/**
 * CustomEvent
 */

class CustomEvent extends Event {

  constructor(type, eventInit) {
    super(type, eventInit);
    this.defineProperty("detail", eventInit && eventInit.detail);
  }
}

export { CustomEvent };