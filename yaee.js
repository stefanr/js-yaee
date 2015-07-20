/*
 * Yet Another EventEmitter
 */
module.exports = require(!!process.env.YAEE_DEV_ENV ? "./src/yaee" : "./dist/common/yaee");
