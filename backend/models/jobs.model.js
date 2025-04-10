// backend/models/producto.model.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company:  String ,
  role: String,
  status: { type: String, required: true},
  date: { type: Date, default: Date.now },
  link: String
});

module.exports = mongoose.model('Job', jobSchema);