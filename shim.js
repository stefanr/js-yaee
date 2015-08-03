/*
 * Yet Another EventEmitter
 * Node.js EventEmitter Shim
 */
var EventEmitter = require("./").EventEmitter;
module.exports = require("./dist/cjs/node").shim(EventEmitter);
