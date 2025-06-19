const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  type: String, // "Railway Form"
  data: {} // actual submitted form data (flexible)
});

module.exports = mongoose.model('FormData', FormDataSchema);
