// const API = "AIzaSyBin4tqq4NSWHePzJBrf4YSnqQBAkRzQLo";
const API = process.env.GOOGLE_API_KEY;
const HttpError = require("../models/http-error");
const axios = require("axios");

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    return next(error);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
