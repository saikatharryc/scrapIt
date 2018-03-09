var api = {};
api.includeRoutes = function(app) {
  const scrap = require("./scrap");

  app.use("/scrap", scrap);
};

module.exports = api;
