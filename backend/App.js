const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error.js");

const placesRoutes = require("./Routes/places-routes.js");
const usersRoutes = require("./Routes/users-routes.js");
const { default: mongoose, mongo } = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(`mongodb://mongodb:27017/?replicaSet=rs0`)
  .then(() => {
    console.log("Connected to the database!");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
