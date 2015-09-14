/*
 * yaee shim
 */
var shim = require("./dist/cjs/node").shim;

shim(require("./dist/cjs").EventEmitter);
module.exports = shim;
