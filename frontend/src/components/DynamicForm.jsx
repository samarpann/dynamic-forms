import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const DynamicForm = ({ formType }) => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [newField, setNewField] = useState({ label: '', type: 'text', required: false, options: [] });

  useEffect(() => {
    if (formType === 'admin-form-builder') {
      setFormFields([]);
      return;
    }

    const fetchForm = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/forms/${formType}`);
        setFormFields(res.data.fields);
        setFormData({});
        setMessage('');
      } catch (err) {
        console.error(err);
        setFormFields([]);
        setMessage('❌ Form not found');
      }
    };

    if (formType) fetchForm();
  }, [formType]);

  const handleChange = (label, value) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formType === 'admin-form-builder') {
      const formName = prompt("Enter new form type (e.g. college-form):");
      if (!formName) return;
      try {
        await axios.post(`${API_BASE}/api/forms/new`, {
          type: formName,
          fields: formFields,
        });
        setMessage(`✅ Form "${formName}" created successfully`);
        setFormFields([]);
      } catch (err) {
        console.error(err);
        setMessage('❌ Failed to create form');
      }
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/forms/${formType}`, formData);
      setMessage('✅ Form data submitted successfully');
      setFormData({});
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit data');
    }
  };

  const addFieldToBuilder = () => {
    if (!newField.label) return alert("Label is required");
    const newFields = [...formFields, { ...newField }];
    setFormFields(newFields);
    setNewField({ label: '', type: 'text', required: false, options: [] });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-white shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 capitalize text-center text-gray-800">
        {formType === 'admin-form-builder' ? '🛠 Build a New Form' : `${formType.replace('-', ' ')}`}
      </h2>
      {message && <p className="mb-4 text-center text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-md">{message}</p>}

      {formType === 'admin-form-builder' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Field Label"
            value={newField.label}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="multiselect">Multi-Select</option>
          </select>
          {(newField.type === 'select' || newField.type === 'multiselect') && (
            <input
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-full"
              placeholder="Comma-separated options"
              onChange={(e) =>
                setNewField({ ...newField, options: e.target.value.split(',').map(opt => opt.trim()) })
              }
            />
          )}
          <label className="flex items-center gap-2 col-span-full">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              className="accent-blue-600"
            />
            <span>Required</span>
          </label>
          <button
            type="button"
            onClick={addFieldToBuilder}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 col-span-full"
          >
            ➕ Add Field
          </button>
          <hr className="col-span-full my-4" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {formFields.map((field, idx) => (
          <div key={idx}>
            <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
                required={field.required}
              >
                <option value="">Select</option>
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'multiselect' ? (
              <select
                multiple
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData[field.label] || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  handleChange(field.label, selected);
                }}
              >
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={field.required}
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            )}
          </div>
        ))}

        {formFields.length > 0 && (
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            {formType === 'admin-form-builder' ? '✅ Create Form' : ' Submit'}
          </button>
        )}
      </form>
    </div>
  );
};

export default DynamicForm;
