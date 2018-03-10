const express = require("express");
const router = express.Router();
const scrapController = require("../controller/scrapController");

router.get("/", (req, res, next) => {
  scrapController
    .scrapIt()
    .then(data => {
      return res.json(data);
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
