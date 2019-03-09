require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const app = express();
const utils = require("./utils");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(
    () => console.log("Connected to database."),
    err => console.log(`Error connecting to database.\n${err}`)
  );

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    statusCode: 200,
    statusMessage: "OK",
    message:
      "Welcome to the SmartIr API. You can get readings from the /readings endpoint. You can also submit readings to the database using the /readings endpoint."
  });
});

app.get("/readings", (req, res) => {
  // If given a quantity, only get that amount, else get them all
  req.query.quantity
    ? utils
        .getQuantityOfReadings(parseInt(req.query.quantity))
        .then(readings => {
          if (!readings) {
            res.json({
              success: false,
              statusCode: 500,
              statusMessage: "Internal Server Error",
              message: "Error retrieving readings from the database."
            });
            return;
          }
          res.json({
            success: true,
            statusCode: 200,
            statusMessage: "OK",
            data: readings
          });
        })
    : utils.getReadings().then(readings => {
        if (!readings) {
          res.json({
            success: false,
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "Error retrieving readings from the database."
          });
          return;
        }
        res.json({
          success: true,
          statusCode: 200,
          statusMessage: "OK",
          data: readings
        });
      });
});

app.post("/readings", utils.validateAPIKey, (req, res) => {
  const { valid, message } = utils.validateData(req.body);
  if (!valid) {
    res.json({
      success: false,
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `${message}`
    });
    return;
  }

  utils.createReading(req.body).then(({ success, data }) => {
    success
      ? res.json({
          success: true,
          statusCode: 200,
          statusMessage: "OK",
          message: "Saved new reading to database.",
          data
        })
      : res.json({
          success: false,
          statusCode: 500,
          statusMessage: "Internal Server Error",
          message: "Error saving reading to database."
        });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
