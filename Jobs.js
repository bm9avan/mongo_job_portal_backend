const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  desc: String,
  exp: Number,
  profile: String,
  techs: [String],
});

module.exports = mongoose.model("jobs", jobSchema);
