var api = {};
api.includeRoutes = function(app) {
  const scrap = require("./scrap");

  app.use("/", scrap);
};

module.exports = api;
