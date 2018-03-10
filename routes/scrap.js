const express = require("express");
const router = express.Router();
const scrapController = require("../controller/scrapController");

router.get("/", (req, res, next) => {
  scrapController
    .scrapIt()
    .then(data => {
      //   scrapController
      //     .processService()
      //     .then(processed_data => {
      //       return res.json(processed_data);
      //     })
      // .catch(error => {
      //   throw error;
      // });

      return res.json(data);
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
