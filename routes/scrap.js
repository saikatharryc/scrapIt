const express = require("express");
const router = express.Router();
const scrapController = require("../controller/scrapController");

router.get("/", (req, res, next) => {
  scrapController
    .scrapIt()
    .then(data => {
   scrapController.saveIt(data).then(saved=>{
    return res.json(saved);
   }).catch(error=>{
       throw error;
   })
    })
    .catch(err => {
      throw err;
    });
});

router.get("/search",(req,res,next)=>{

});


module.exports = router;
