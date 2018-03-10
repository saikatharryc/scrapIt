var mongoose = require("mongoose");
const config = require("./config");

var connection = mongoose.connection;

connection
  .on("error", function() {
    //we can log here
  })
  .on("disconnected", reConnect)
  .once("open", listen);

connection.on("reconnected", function() {
  console.log("MongoDB reconnected!");
});

function listen() {
  console.log("Data Base Connected");
  console.log(connection.readyState);
}

function connect() {
  const connection = mongoose.connect(config.db.uri, config.db.options, err => {
    reConnect();
  });
  return connection;
}

function reConnect() {
  if (mongoose.connection.readyState == 0) {
    console.log(mongoose.connection.readyState);
    // connect();
  } else {
    // DO nothing.
    console.log("I am already Connected");
  }
}
connect();
module.exports = exports = mongoose;
