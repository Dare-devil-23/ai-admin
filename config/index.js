const NODE_ENV = process.env.NODE_ENV.trim();
let config = null;

switch (NODE_ENV) {
  case "prod":
    config = require("./prod")
    break
  case "qa":
    config = require("./qa")
    break
  case "local":
    config = require("./local")
    break
}

module.exports = config