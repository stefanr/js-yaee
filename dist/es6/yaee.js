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
      throw new Error("Event must be an object");
    }
    if (!event.type) {
      throw new Error("Missing event type");
    }
    Event.prototype.defineProperty.call(event, "emitter", this);

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

  type = null;
  emitter = null;

  defaultPrevented = false;
  propagationStopped = false;

  constructor(type, init) {
    this.defineProperty("type", type);
  }

  defineProperty(name, value) {
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      value: value
    });
  }

  preventDefault() {
    if (this.defaultPrevented) {
      return;
    }
    this.defineProperty("defaultPrevented", true);
  }

  stopPropagation() {
    if (this.propagationStopped) {
      return;
    }
    this.defineProperty("propagationStopped", true);
  }
}

export { Event };

/**
 * CustomEvent
 */

class CustomEvent extends Event {

  constructor(type, init) {
    super(type, init);
    this.defineProperty("detail", init && init.detail || null);
  }
}

export { CustomEvent };