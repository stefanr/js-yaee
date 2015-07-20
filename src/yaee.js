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

  type: string;

  emitter: any = null;
  defaultPrevented: boolean = false;

  constructor(type: string, eventInit: object) {
    this.defineProperty("type", type);
  }

  defineProperty(name: string, value: any): void {
    Object.defineProperty(this, name, {
      value: value,
      enumerable: true,
    });
  }

  preventDefault(): void {
    if (!this.defaultPrevented) {
      this.defineProperty("defaultPrevented", true);
    }
  }
}

/**
 * CustomEvent
 */
export class CustomEvent extends Event {

  detail: any;

  constructor(type: string, eventInit: object) {
    super(type, eventInit);
    this.defineProperty("detail", eventInit && eventInit.detail);
  }
}
