/*
 * yaee shim
 */
var shim = require("./dist/cjs/node").shim;

shim(require("./").EventEmitter);
module.exports = shim;
