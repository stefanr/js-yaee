/*
 * Yet Another EventEmitter
 * Node.js EventEmitter Shim
 */
var EventEmitter = require("./").EventEmitter;

if (!!process.env.YAEE_DEV_ENV) {
  module.exports = require("./src/node").shim(EventEmitter);
} else {
  module.exports = require("./dist/cjs/node").shim(EventEmitter);
}
