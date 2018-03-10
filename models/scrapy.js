var mongoose = require("mongoose");

var scrapySchema = new mongoose.Schema({
  name: String,
  rating: Number,
  likes: Number,
  votes: Number,
  location: String,
  mobile_no: Number,
  service_url: String,
  services: Array
});

module.exports = { scrapySchema };
