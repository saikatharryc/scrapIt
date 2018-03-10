const mongoose = require("mongoose");

const { scrapySchema } = require("./scrapy");
mongoose.model("Scrapy", scrapySchema);

module.exports = mongoose;
