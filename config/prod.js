const common = require("./common")

module.exports = {
  ...common,
  mode: "PROD",
  backendConfig: {
    platform: {
      domain: "https://user-1014105386081.asia-south1.run.app",
      port: "",
      folder: common.backendConfig.platform.folder,
    },
  },
}
