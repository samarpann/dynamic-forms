const express = require('express');
const router = express.Router();
const {
  getAllFormTypes,
  getFormByType,
  submitFormData,
  createNewForm
} = require('../controllers/formController');

router.get('/', getAllFormTypes);              // all form types
router.post('/new', createNewForm);            // ✅ create new form type (must come before `/:type`)
router.get('/:type', getFormByType);           // get form by type
router.post('/:type', submitFormData);         // submit filled form


module.exports = router;
