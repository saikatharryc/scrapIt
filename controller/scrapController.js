const request = require("request-promise");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

const Scrapy = mongoose.model("Scrapy");

module.exports = {
  scrapIt,
  processService,
  saveIt
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

    request(options).then(html => {
      let processedJson = JSON.parse(html);
      return resolve(processedJson.meta["X-Total-Page"]);
    });
  });
}

function scrapIt() {
  let baseUrl = "https://www.carworkz.com";
  return new Promise((resolve, reject) => {
    return initialize()
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

          request(options)
            .then(html => {
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

                payloadObject.service_url =
                  baseUrl +
                  $(article)
                    .find(".select-jobs")
                    .attr("href");
                //tackle in some other way if possible
                // processService(payloadObject)
                //   .then(data => {
                //     theArr.push(data);
                //     if (processedJson.meta["X-Total-Count"] == theArr.length) {
                //       return resolve(theArr);
                //     }
                //   })
                //   .catch(error => {
                //     return reject(error);
                //   });

                theArr.push(payloadObject);
                if (processedJson.meta["X-Total-Count"] == theArr.length) {
                  return resolve(theArr);
                }
              });
              //   return resolve(theArr);
            })
            .catch(error => {
              return reject(error);
            });
        }
      })
      .catch(error => {
        return reject(error);
      });
  });
}

function processService(element) {
  return new Promise((resolve, reject) => {
    let options = {
      url: element.service_url,
      transform: function(body) {
        return cheerio.load(body);
      }
    };

    request(options)
      .then($ => {
        let services_single = [];
        $(".serv_custom_list").each((i, services) => {
          services_single.push({
            services: $(services)
              .find("li")
              .text()
          });
        });
        element.services = services_single;
        return resolve(element);
      })
      .catch(error => {
        // continue;
      });
  });
}

function saveIt(payload) {
  return Scrapy.insertMany(payload);
}
