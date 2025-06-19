const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  label: String,
  type: String,
  options: [String], // for select, multi-select
});

const FormStructureSchema = new mongoose.Schema({
  type: String, // e.g., "Railway Form"
  fields: [FieldSchema]
});

module.exports = mongoose.model('FormStructure', FormStructureSchema);
