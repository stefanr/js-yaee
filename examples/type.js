/*
 * Yet Another EventEmitter
 * Example : type
 */
import {EventEmitter, CustomEvent} from "..";

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
