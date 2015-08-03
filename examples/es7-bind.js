/*
 * Yet Another EventEmitter
 * Example : es7-bind
 */
import {addEventListener as on, dispatchEvent, CustomEvent} from "..";

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
