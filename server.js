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
    return res.json({ error: "Missing authorization header." });
  if (req.header.authorization !== process.env.API_KEY)
    return res.json({ error: "Invalid API Key" });

  next();
};

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send("Welcome to the API.");
});

app.get("/api/readings", (req, res) => {
  getReadings().then(readings => {
    res.send({ success: true, readings });
  });
});

app.use(validateAPIKey);

app.post("/api/readings", (req, res) => {
  const { success, message } = validateData(req.body);
  if (!success) {
    res.send(`Post unsuccessful: ${message}`);
    return;
  }

  createReading(req.body).then(success => {
    success
      ? res.send("Success!")
      : res.send("Error saving reading to database.");
  });
});

app.listen(port, () =>
  console.log(`Listening on port ${port}.\nhttp://localhost:${port}/`)
);

const validateData = data => {
  if (
    data.moisture === undefined ||
    data.light === undefined ||
    data.temp === undefined
  )
    return { success: false, message: "missing required field" };

  if (
    typeof data.moisture !== "number" ||
    typeof data.light !== "number" ||
    typeof data.temp !== "number"
  )
    return { success: false, message: "invalid field type." };

  return { success: true, message: "" };
};

const createReading = ({ id, moisture, light, temp }) => {
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
