# Yet Another EventEmitter

## ES6 Example

```js
import {EventEmitter, CustomEvent} from "yaee";

class MyEvent extends CustomEvent {

  myValue: any;

  constructor(type: string, init: object) {
    super(type, init);
    this.defineProperty("myValue", init && init.myValue);
  }

  static create(type: string, myValue: any): MyEvent {
    return new MyEvent(type, {
      myValue: myValue,
    });
  }
}

class MyClass extends EventEmitter {

  myValue: number;

  constructor() {
    super();
    this.myValue = Math.random();
  }

  foo() {
    this.emit("foo", this.myValue);
  }

  bar() {
    this.dispatchEvent(new CustomEvent("bar", {
      detail: this.myValue,
    }));
  }

  my() {
    this.dispatchEvent(MyEvent.create("my", this.myValue));
  }
}

let my = new MyClass();
my.addEventListener("foo", (e) => {
  console.log("foo1", e.detail);
});
my.addEventListener("bar", (e) => {
  console.log("bar", e.detail);
});
my.on("foo", (e) => {
  console.log("foo2", e.detail);
});
my.on("my", (e) => {
  console.log("my", e.myValue);
});

my.foo();
my.bar();
my.my();
```

## Node.js Example

```js
var yaee = require("yaee");

var my = Object.create(yaee.EventEmitter.prototype, {
  myValue: {
    value: Math.random(),
  },
  foo: {
    value: function () {
      this.emit("foo", this.myValue);
    },
  },
});

my.on("foo", function (e) {
  console.log("foo", e.detail);
});

my.foo();
```

## Node.js Shim Example

```js
var yaee = require("yaee");
require("yaee/node-shim")(yaee);

process.addEventListener("foo", function (e) {
  console.log("foo", e.emitter.pid);
});

process.dispatchEvent(new yaee.Event("foo"));
```
