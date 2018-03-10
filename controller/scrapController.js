const request = require("request-promise");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

const Scrapy = mongoose.model("Scrapy");

module.exports = {
  scrapIt,
  processService,
  saveIt,
  update,
  search
};
/**
 * Just to know how many iteration will it take.
 *
 */
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

/**
 * Scrap and return the scrapped data.
 */
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
                    .text()
                    ? parseFloat(
                        $(article)
                          .find(".number_rating")
                          .text()
                      )
                    : 0),
                  (payloadObject.likes = $(article)
                    .find(".per_votes")
                    .text()
                    ? parseInt(
                        $(article)
                          .find(".per_votes")
                          .text()
                      )
                    : 0),
                  (payloadObject.votes = $(article)
                    .find(".txt_votes")
                    .text()
                    .split(" ")[0]
                    ? parseInt(
                        $(article)
                          .find(".txt_votes")
                          .text()
                          .split(" ")[0]
                      )
                    : 0),
                  (payloadObject.location = $(article)
                    .find(".location_distance")
                    .text()),
                  (payloadObject.mobile_no = $(article)
                    .find(".mobile_no")
                    .text()
                    ? $(article)
                        .find(".mobile_no")
                        .text()
                    : null);

                payloadObject.service_url =
                  baseUrl +
                  $(article)
                    .find(".select-jobs")
                    .attr("href");

                theArr.push(payloadObject);
                if (processedJson.meta["X-Total-Count"] == theArr.length) {
                  return resolve(theArr);
                }
              });
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
/**
 * Gets servicess from service url.
 * @param {Object} element
 * @returns {Object}
 */
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
          services_single.push(
            $(services)
              .find("li")
              .text()
          );
        });
        element.services = services_single;
        return resolve(element);
      })
      .catch(error => {
        // continue;
      });
  });
}

/**
 * Saves Array of Scrapped Items
 *  at a Time.
 * @param {Array} payload
 */
function saveIt(payload) {
  return Scrapy.insertMany(payload);
}

/**
 * updpates all the docs with their services.
 */
function update() {
  return new Promise((resolve, reject) => {
    return Scrapy.find({})
      .exec()
      .then(data => {
        let some_data = [];
        data.forEach(elements => {
          processService(elements)
            .then(updated_data => {
              elements.services = updated_data.services;
              some_data.push(elements);
              elements.save();
              console.log(some_data.length);
              if (data.length == some_data.length) {
                return resolve(some_data);
              }
            })
            .catch(error => {
              return reject(error);
            });
        });
      });
  });
}

/**
 * Search by attributes.
 * @param {Object} payload
 */
function search(payload) {
  let query = {};
  if (payload.name) {
    Object.assign(query, { name: { $regex: payload.name, $options: "i" } });
  }
  if (payload.rating_gt) {
    Object.assign(query, { rating: { $gt: Number(payload.rating_gt) } });
  }
  if (payload.rating_lt) {
    Object.assign(query, { rating: { $lt: Number(payload.rating_lt) } });
  }
  if (payload.location) {
    Object.assign(query, {
      location: { $regex: payload.location, $options: "i" }
    });
  }
  if (payload.mobile_no) {
    Object.assign(query, {
      mobile_no: { $regex: Number(payload.mobile_no), $options: "i" }
    });
  }
  if (payload.services) {
    Object.assign(query, { services: { $regex: services, $options: "i" } });
  }
  return Scrapy.find(query)
    .lean()
    .exec();
}
