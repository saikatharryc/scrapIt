var mongoose = require("mongoose");

var scrapySchema = new mongoose.Schema({
  name: String,
  rating: String,
  likes: String,
  votes: String,
  location: String,
  mobile_no: String,
  service_url: String,
  services: Array
});

module.exports = { scrapySchema };
