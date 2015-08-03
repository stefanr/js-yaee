/*
 * Yet Another EventEmitter
 */

/**
 * Global
 */
let __global__: object = (() => {
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
const SYM_LISTENERS = Symbol.for("yaee.__listeners__");

/**
 * Listeners
 */
let __listeners__: WeakMap<EventEmitter, Map<string, Array>> = (() => {
  if (!__global__[SYM_LISTENERS]) {
    Object.defineProperty(__global__, SYM_LISTENERS, {
      value: new WeakMap(),
    });
  }
  return __global__[SYM_LISTENERS];
})();

/**
 * getEventListeners
 */
export function getEventListeners(emitter: any): Map<string, Array> {
  return __listeners__.get(emitter);
}

/**
 * addEventListener
 */
export function addEventListener(emitter: any, type: string, listener: callable): void {
  if (this !== undefined) {
    [emitter, type, listener] = [this, emitter, type];
  }
  if (typeof listener !== "function") {
    throw new TypeError("Listener must be callable");
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

/**
 * removeEventListener
 */
export function removeEventListener(emitter: any, type: string, listener: callable): void {
  if (this !== undefined) {
    [emitter, type, listener] = [this, emitter, type];
  }
  let typedListeners = __listeners__.get(emitter);
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

/**
 * dispatchEvent
 */
export function dispatchEvent(emitter: any, event: Event): boolean {
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
    let listeners = typedListeners.get(event.type);
    if (listeners instanceof Array) {
      for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(undefined, event);
      }
    }
  }
  return !event.defaultPrevented;
}

/**
 * EventEmitter
 */
export class EventEmitter {

  static getEventListeners(emitter: any): Map<string, Array> {
    return getEventListeners(emitter);
  }

  addEventListener(type: string, listener: callable): void {
    this::addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: callable): void {
    this::removeEventListener(type, listener);
  }

  dispatchEvent(event: Event): boolean {
    return this::dispatchEvent(event);
  }

  on(type: string, listener: callable): EventEmitter {
    this::addEventListener(type, listener);
    return this;
  }

  emit(type: string, ...args: any): boolean {
    this::dispatchEvent(new CustomEvent(type, {
      detail: args.length < 2 ? args[0] : args,
    }));
    return true;
  }
}

/**
 * Event
 */
export class Event {

  type: string = null;
  emitter: any = null;

  defaultPrevented: boolean = false;
  propagationStopped: boolean = false;

  constructor(type: string, init: object) {
    this.defineProperty("type", type);
  }

  defineProperty(name: string, value: any): void {
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      value: value,
    });
  }

  preventDefault(): void {
    if (this.defaultPrevented) {
      return;
    }
    this.defineProperty("defaultPrevented", true);
  }

  stopPropagation(): void {
    if (this.propagationStopped) {
      return;
    }
    this.defineProperty("propagationStopped", true);
  }
}

/**
 * CustomEvent
 */
export class CustomEvent extends Event {

  detail: any = null;

  constructor(type: string, init: object) {
    super(type, init);
    this.defineProperty("detail", (init && init.detail) || null);
  }
}
