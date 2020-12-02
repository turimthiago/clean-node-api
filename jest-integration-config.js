const { REPL_MODE_SLOPPY } = require("repl");
const config = require("./jest.config");
config.testMatch = ["**/*.test.ts"];
module.exports = config;
