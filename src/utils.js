const Reading = require("./models/Reading");

module.exports = {
  validateAPIKey: (req, res, next) => {
    if (!req.headers.authorization)
      return res.json({
        success: false,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Missing authorization header."
      });
    if (!req.headers.authorization.includes(process.env.API_KEY))
      return res.json({
        success: false,
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid API Key."
      });

    next();
  },
  validateData: data => {
    if (
      data.moisture === undefined ||
      data.light === undefined ||
      data.temp === undefined
    )
      return { valid: false, message: "Missing required field." };

    if (
      typeof data.moisture !== "number" ||
      typeof data.light !== "number" ||
      typeof data.temp !== "number"
    )
      return { valid: false, message: "Invalid field type." };

    return { valid: true, message: "" };
  },
  getReadings: () => {
    return new Promise((resolve, reject) => {
      const readings = Reading.find();
      Reading.find()
        .sort({ date: -1 })
        .exec((err, readings) => {
          err ? resolve(null) : resolve(readings);
        });
    });
  },
  getQuantityOfReadings: quantity => {
    return new Promise((resolve, reject) => {
      Reading.find()
        .sort({ date: -1 })
        .limit(quantity)
        .exec((err, readings) => {
          err ? resolve(null) : resolve(readings);
        });
    });
  },
  createReading: ({ moisture, light, temp }) => {
    return new Promise((resolve, reject) => {
      const reading = new Reading({
        date: Date.now(),
        moisture,
        light,
        temp
      });

      reading.save(err => {
        err
          ? resolve({ success: false, data: "" })
          : resolve({ success: true, data: reading });
      });
    });
  }
};
