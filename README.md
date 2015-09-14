# [![yaee][yaee-img]][yaee-url]
**Yet Another EventEmitter**

## Usage

```js
// ES5
var yaee = require("yaee");

// ES6
import {EventEmitter} from "yaee";
```

## Examples
### ES6

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

```sh
> babel-node examples/es6
foo1 0.4952439935877919
foo2 0.4952439935877919
bar 0.4952439935877919
my 0.4952439935877919
```

### ES7 - Function bind

```js
import {addEventListener as on, dispatchEvent, CustomEvent} from "yaee";

function emit(type: string, detail: any): void {
  this::dispatchEvent(new CustomEvent(type, {detail}));
}

class Foo {
  name: string = "foo";
  setName(name: string): void {
    let old = this.name;
    this.name = name;
    this::emit("nameChanged", {old, name});
  }
}

let foo = new Foo();
foo::on("nameChanged", (e) => {
  console.log("New name:", e.detail.old, "->", e.detail.name);
});

foo.setName("bar");
```

```sh
> babel-node examples/es7-bind
New name: foo -> bar
```

### Type

```js
import {EventEmitter, CustomEvent} from "yaee";

class MyEvent extends CustomEvent {
}

class MyEventEmitter extends EventEmitter {
  doSomething(): void {
    console.log("doSomething:");
    this.dispatchEvent(new CustomEvent("something"));
  }
  doSomethingElse(): void {
    console.log("doSomethingElse:");
    this.dispatchEvent(new MyEvent("something"));
  }
}

let my = new MyEventEmitter();
my.addEventListener("something", () => {
  console.log("  on:", "'something'");
});
my.addEventListener(CustomEvent, () => {
  console.log("  on:", "CustomEvent");
});
my.addEventListener(MyEvent, () => {
  console.log("  on:", "MyEvent");
});

my.doSomething();
my.doSomethingElse();
```

```sh
> babel-node examples/type
doSomething:
  on: 'something'
  on: CustomEvent
doSomethingElse:
  on: 'something'
  on: CustomEvent
  on: MyEvent
```

### Node

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

```sh
> babel-node examples/node
foo 0.7281268276274204
```

[yaee-img]: https://raw.githubusercontent.com/stefanr/yaee/gh-pages/images/yaee.png
[yaee-url]: https://www.npmjs.com/package/yaee
