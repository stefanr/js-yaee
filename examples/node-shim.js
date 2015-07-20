var yaee = require("yaee");
require("yaee/node-shim")(yaee);

process.addEventListener("foo", function (e) {
  console.log("foo", e.emitter.pid);
});

process.dispatchEvent(new yaee.Event("foo"));
