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
