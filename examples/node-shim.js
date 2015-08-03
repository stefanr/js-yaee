/*
 * Yet Another EventEmitter
 * Example : node-shim
 */
var yaee = require("..");
require("../shim");

process.addEventListener("foo", function (e) {
  console.log("foo", e.emitter.pid);
});

process.dispatchEvent(new yaee.Event("foo"));
