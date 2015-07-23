/*
 * Yet Another EventEmitter
 */
if (!!process.env.YAEE_DEV_ENV) {
  module.exports = require("./src/yaee");
} else {
  module.exports = require("./dist/cjs/yaee");
}
