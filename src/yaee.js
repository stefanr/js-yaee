/*
 * Yet Another EventEmitter
 */

/**
 * Listeners
 */
const __listeners__: WeakMap<EventEmitter, Map<string, Array>> = new WeakMap();

/**
 * EventEmitter
 */
export class EventEmitter {

  static getEventListeners(emitter: any): Map<string, Array> {
    return __listeners__.get(emitter);
  }

  addEventListener(type: string, listener: callable): void {
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

  removeEventListener(type: string, listener: callable): void {
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

  dispatchEvent(event: Event): boolean {
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

  on(type: string, listener: callable): EventEmitter {
    EventEmitter.prototype.addEventListener.call(this, type, listener);
    return this;
  }

  emit(type: string, ...args: any): boolean {
    let event = new CustomEvent(type, {
      detail: args.length < 2 ? args[0] : args
    });
    return EventEmitter.prototype.dispatchEvent.call(this, event);
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

  detail: any;

  constructor(type: string, init: object) {
    super(type, init);
    this.defineProperty("detail", (init && init.detail) || null);
  }
}
