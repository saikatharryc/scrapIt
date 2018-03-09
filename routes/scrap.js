const express = require("express");
const router = express.Router();
const scrapController = require("../controller/scrapController");

router.get("/", (req, res, next) => {
  return res.json("hi");
});

module.exports = router;
