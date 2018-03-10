const express = require("express");
const router = express.Router();
const scrapController = require("../controller/scrapController");

router.get("/", (req, res, next) => {
  return res.send("Yeah, water is boiling!");
});

/**
 * Scrapping Initialize
 */
router.get("/scrap", (req, res, next) => {
  scrapController
    .scrapIt()
    .then(data => {
      scrapController
        .saveIt(data)
        .then(saved => {
          return res.json(saved);
        })
        .catch(error => {
          throw error;
        });
    })
    .catch(err => {
      throw err;
    });
});

/**
 * Update all the Docs in DB,
 * with the services.
 */
router.get("/update", (req, res, next) => {
  scrapController
    .update()
    .then(data => {
      return res.json(data);
    })
    .catch(error => {
      throw error;
    });
});

/**
 * Searching scrapped items with keywords,
 *  and filtering
 */
router.get("/search", (req, res, next) => {
  let payload = {};
  Object.assign(payload, req.query);
  scrapController
    .search(payload)
    .then(data => {
      return res.json(data);
    })
    .catch(error => {
      throw error;
    });
});

module.exports = router;
