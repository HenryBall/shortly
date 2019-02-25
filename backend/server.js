const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const mongoURI = "mongodb://localhost/zipurl";

const connectOptions = { 
  keepAlive: true, 
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true 
};

// connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log("Error", err);
  console.log("Connected to MongoDB");
});

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,x-access-token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

// must add bosy parser before adding routes
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/build")))

// import routs and data model
const Data = require("./data");
require("./routes")(app);

// launch backend into a port
const API_PORT = process.env.PORT || 5000;
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
