const mongoose = require("mongoose");

const BlackListedJWTScheme = new mongoose.Schema({
  JWT: {
    type: String,
    unique: true,
    required: true,
  },
});

const BlackListedJWT = mongoose.model("BlackListedJWT", BlackListedJWTScheme);

module.exports = BlackListedJWT;
