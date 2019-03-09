require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const app = express();
const Reading = require("./models/Reading");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(
    () => console.log("Connected to database."),
    err => console.log(`Error connecting to database.\n${err}`)
  );

const validateAPIKey = (req, res, next) => {
  if (!req.headers.authorization)
    return res.json({
      success: false,
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Missing authorization header."
    });
  if (req.header.authorization !== process.env.API_KEY)
    return res.json({
      success: false,
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Invalid API Key"
    });

  next();
};

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
  getReadings().then(readings => {
    res.json({
      success: true,
      statusCode: 200,
      statusMessage: "OK",
      data: readings
    });
  });
});

app.post("/readings", validateAPIKey, (req, res) => {
  const { success, message } = validateData(req.body);
  if (!success) {
    res.json({
      success: false,
      statusCode: 400,
      statusMessage: "Bad Request",
      message: `${message}`
    });
    return;
  }

  createReading(req.body).then(created => {
    created
      ? res.json({
          success: true,
          statusCode: 200,
          statusMessage: "OK",
          message: "Saved new reading to database."
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

const validateData = data => {
  if (
    data.moisture === undefined ||
    data.light === undefined ||
    data.temp === undefined
  )
    return { success: false, message: "Missing required field." };

  if (
    typeof data.moisture !== "number" ||
    typeof data.light !== "number" ||
    typeof data.temp !== "number"
  )
    return { success: false, message: "Invalid field type." };

  return { success: true, message: "" };
};

const createReading = ({ moisture, light, temp }) => {
  return new Promise((resolve, reject) => {
    const reading = new Reading({
      date: Date.now(),
      moisture,
      light,
      temp
    });

    reading.save(err => {
      err ? resolve(false) : resolve(true);
    });
  });
};

const getReadings = () => {
  return new Promise((resolve, reject) => {
    const readings = Reading.find();
    resolve(readings);
  });
};
