const { REPL_MODE_SLOPPY } = require("repl");
const config = require("./jest.config");
config.testMatch = ["**/*.spec.ts"];
module.exports = config;
