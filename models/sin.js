// models/fruit.js

const mongoose = require('mongoose');

const sinSchema = new mongoose.Schema({
  name: String,
  isDeadly: Boolean,
  isFun: Boolean,
  bestActivity: String,
  worstActivity: String
});

const Sin = mongoose.model("Sin", sinSchema); // create model
module.exports = Sin;
