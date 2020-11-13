const { REPL_MODE_SLOPPY } = require("repl");
const config = require("./jest-config");
config.testMathc = ["**/*.spec.ts"];
module.exports = config;
