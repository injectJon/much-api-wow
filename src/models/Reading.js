const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  date: { type: Number, required: true },
  deviceID: { type: String, required: true },
  moisture: { type: Number, required: true },
  light: { type: Number, required: true },
  temp: { type: Number, required: true }
});

const Reading = mongoose.model("Reading", readingSchema);

module.exports = Reading;
