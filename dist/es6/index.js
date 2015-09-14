/*
 * yaee
 */

"use strict";

export { getEventListeners };
export { addEventListener };
export { removeEventListener };
export { dispatchEvent };
const YAEE_SYM = Symbol["for"](`yaee["0.1"]`);

let __global__ = () => {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  return Object.create(null);
}();

let __yaee__ = __global__ => {
  if (!__global__[YAEE_SYM]) {
    Object.defineProperty(__global__, YAEE_SYM, { value: Object.create(null) });
  }
  return __global__[YAEE_SYM];
}(__global__);

let __listeners__ = __yaee__ => {
  if (!__yaee__.listeners) {
    Object.defineProperty(__yaee__, "listeners", { value: new WeakMap() });
  }
  return __yaee__.listeners;
}(__yaee__);

function getEventListeners(emitter) {
  return __listeners__.get(emitter);
}

function addEventListener(emitter, type, listener) {
  if (this !== undefined) {
    [emitter, type, listener] = [this, emitter, type];
  }
  if (typeof listener !== "function") {
    throw new TypeError("Listener must be callable");
  }
  if (typeof type === "function") {
    [listener, listener.listener] = [type => e => {
      if (e instanceof type) {
        listener.listener(e);
      }
    }(type), listener];
    type = Function;
  }
  let typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    let listeners = typedListeners.get(type);
    if (listeners instanceof Array) {
      listeners.push(listener);
    } else {
      typedListeners.set(type, [listener]);
    }
  } else {
    __listeners__.set(emitter, new Map([[type, [listener]]]));
  }
}

function removeEventListener(emitter, type, listener) {
  if (this !== undefined) {
    [emitter, type, listener] = [this, emitter, type];
  }
  if (typeof type === "function") {
    type = Function;
  }
  let typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    let listeners = typedListeners.get(type);
    if (listeners instanceof Array) {
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener || listeners[i].listener === listener) {
          listeners.splice(i--, 1);
        }
      }
    }
  }
}

function dispatchEvent(emitter, event) {
  if (this !== undefined) {
    [emitter, event] = [this, emitter];
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
  let typedListeners = __listeners__.get(emitter);
  if (typedListeners instanceof Map) {
    let listeners = [];
    if (typedListeners.has(event.type)) {
      listeners = listeners.concat(typedListeners.get(event.type));
    }
    if (typedListeners.has(Function)) {
      listeners = listeners.concat(typedListeners.get(Function));
    }
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }
  return !event.defaultPrevented;
}

class EventEmitter {

  static getEventListeners(emitter) {
    return getEventListeners(emitter);
  }

  addEventListener(type, listener) {
    addEventListener.call(this, type, listener);
  }

  removeEventListener(type, listener) {
    removeEventListener.call(this, type, listener);
  }

  dispatchEvent(event) {
    return dispatchEvent.call(this, event);
  }

  on(type, listener) {
    addEventListener.call(this, type, listener);
    return this;
  }

  emit(type, ...args) {
    dispatchEvent.call(this, new CustomEvent(type, {
      detail: args.length < 2 ? args[0] : args
    }));
    return true;
  }
}

export { EventEmitter };

class Event {

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

class CustomEvent extends Event {

  constructor(type, init) {
    super(type, init);
    this.defineProperty("detail", init && init.detail || null);
  }
}

export { CustomEvent };