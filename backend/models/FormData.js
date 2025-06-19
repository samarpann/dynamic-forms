const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    data: { type: Object, required: true }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('FormData', FormDataSchema);
