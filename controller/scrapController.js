const request = require("request");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

module.exports = {
  scrapIt
};

function initialize() {
  return new Promise((resolve, reject) => {
    url = "https://www.carworkz.com/mumbai/regular-service?format=json&page=1";
    let options = {
      url: url,
      headers: {
        "User-Agent": "request",
        "content-types": "application/html"
      }
    };

    request(options, function(error, response, html) {
      if (!error) {
        let processedJson = JSON.parse(html);
        return resolve(processedJson.meta["X-Total-Page"]);
      } else {
        return reject(error);
      }
    });
  });
}

function scrapIt(axNo) {
  return new Promise((resolve, reject) => {
    return initialize
      .then(maxNo => {
        let theArr = [];
        for (let j = 0; j < maxNo; j++) {
          // console.log(j)
          let url =
            "https://www.carworkz.com/mumbai/regular-service?format=json&city=mumbai&type=jobs&q=Regular%20Service&reQuery=0&page=" +
            (j + 1);
          let options = {
            url: url,
            headers: {
              "User-Agent": "request",
              "content-types": "application/html"
            }
          };

          request(options, function(error, response, html) {
            if (!error) {
              let processedJson = JSON.parse(html);
              let processedHtml = processedJson.listing;
              let lol = unescape(processedHtml);
              // let lol =html;
              let $ = cheerio.load(lol);
              console.log(j);
              $(".animate").each(function(i, article) {
                let payloadObject = {};
                (payloadObject.name = $(article)
                  .find(".list-title")
                  .text()),
                  (payloadObject.rating = $(article)
                    .find(".number_rating")
                    .text()),
                  (payloadObject.likes = $(article)
                    .find(".per_votes")
                    .text()),
                  (payloadObject.votes = $(article)
                    .find(".txt_votes")
                    .text()
                    .split(" ")[0]),
                  (payloadObject.location = $(article)
                    .find(".location_distance")
                    .text()),
                  (payloadObject.mobile_no = $(article)
                    .find(".mobile_no")
                    .text());
                theArr.push(payloadObject);
                if (processedJson.meta["X-Total-Count"] == theArr.length) {
                  return resolve(theArr);
                }
              });
            } else {
              return reject(error);
            }
          });
        }
      })
      .catch(error => {
        return reject(error);
      });
  });
}
