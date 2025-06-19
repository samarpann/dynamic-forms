import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [formType, setFormType] = useState('');
  const [fields, setFields] = useState([
    { label: '', type: 'text', required: false, options: [] }
  ]);
  const [message, setMessage] = useState('');

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;

    if (key === 'type' && value === 'text') {
      updatedFields[index].options = [];
    }

    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text', required: false, options: [] }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...fields];
    if (!updatedFields[fieldIndex].options) updatedFields[fieldIndex].options = [];
    updatedFields[fieldIndex].options.push('');
    setFields(updatedFields);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formType.trim()) {
      return setMessage('⚠️ Form type is required');
    }

    const finalType = formType.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      // Step 1: Get existing form types
      const existingTypesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms`);
      const existingTypes = existingTypesRes.data;

      // Step 2: Check if type already exists
      if (existingTypes.includes(finalType)) {
        setMessage(`❌ A form with the type "${finalType}" already exists.`);
        return;
      }

      // Step 3: Submit the form
      const payload = {
        type: finalType,
        fields,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/new`, payload);

      setMessage('✅ Form created successfully!');
      setFormType('');
      setFields([{ label: '', type: 'text', required: false, options: [] }]);
    } catch (error) {
      console.error("❌ Error creating form:", error);
      setMessage('❌ Error creating form: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛠 Admin Panel – Create a New Form Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Form Type Name</label>
          <input
            type="text"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="e.g. Railway Form"
            required
          />
        </div>

        {fields.map((field, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <h4 className="font-semibold">Field {index + 1}</h4>

            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
              className="border p-2 w-full rounded"
              required
            />

            <select
              value={field.type}
              onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="multiselect">Multi-Select</option>
            </select>

            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
              />
              <span>Required</span>
            </label>

            {(field.type === 'select' || field.type === 'multiselect') && (
              <div>
                <p className="font-medium">Options:</p>
                {field.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, e.target.value)
                      }
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index, optIndex)}
                      className="text-red-500"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  className="text-blue-500"
                >
                  ➕ Add Option
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleRemoveField(index)}
              className="text-red-600 mt-2"
            >
              Remove Field
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddField}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ➕ Add Field
        </button>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
          >
            ✅ Submit Form Type
          </button>
        </div>

        {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
      </form>
    </div>
  );
};

export default AdminPanel;
