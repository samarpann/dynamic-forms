const FormStructure = require('../models/FormStructure');
const FormData = require('../models/FormData');

// GET /api/forms - all form types
exports.getAllFormTypes = async (req, res) => {
  try {
    const forms = await FormStructure.find({});
    res.json(forms.map(f => f.type));
  } catch (err) {
    console.error('❌ Error in getAllFormTypes:', err);
    res.status(500).json({ error: 'Failed to fetch form types' });
  }
};

// GET /api/forms/:type - get structure of a specific form
exports.getFormByType = async (req, res) => {
  try {
    const form = await FormStructure.findOne({ type: req.params.type });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (err) {
    console.error('❌ Error in getFormByType:', err);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// POST /api/forms/:type - submit form data
exports.submitFormData = async (req, res) => {
  try {
    const formData = new FormData({
      type: req.params.type,
      data: req.body
    });
    await formData.save();
    res.json({ message: 'Form data saved successfully' });
  } catch (err) {
    console.error('❌ Error in submitFormData:', err);
    res.status(500).json({ error: 'Failed to save form data' });
  }
};

// POST /api/forms/new - create new form
exports.createNewForm = async (req, res) => {
  try {
    const { type, fields } = req.body;

    if (!type || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Invalid form structure data' });
    }

    const exists = await FormStructure.findOne({ type });
    if (exists) {
      return res.status(409).json({ error: 'Form with this type already exists' });
    }

    const newForm = new FormStructure({ type, fields });
    await newForm.save();
    res.status(201).json({ message: 'New form created' });
  } catch (err) {
    console.error('❌ Error in createNewForm:', err);
    res.status(500).json({ error: 'Failed to create new form' });
  }
};
// GET /api/forms - get unique form types
exports.getAllFormTypes = async (req, res) => {
  try {
    const forms = await FormStructure.find().select('type -_id');
    const uniqueTypes = [...new Set(forms.map(f => f.type))];
    res.json(uniqueTypes);
  } catch (err) {
    console.error('❌ Error in getAllFormTypes:', err);
    res.status(500).json({ error: 'Failed to fetch form types' });
  }
};
