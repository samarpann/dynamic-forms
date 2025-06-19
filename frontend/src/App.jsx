import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicForm from './components/DynamicForm';

function App() {
  const [formType, setFormType] = useState('');
  const [formTypes, setFormTypes] = useState([]);

  // ✅ Extracted to call it from both useEffect and DynamicForm
  const fetchFormTypes = async () => {
    try {
      const res = await axios.get(' http://localhost:5000/api/forms');
      setFormTypes(res.data);
    } catch (error) {
      console.error('Failed to fetch form types:', error);
    }
  };

  useEffect(() => {
    fetchFormTypes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto mb-6">
        <label className="block text-lg font-semibold mb-2">Select a Form Type:</label>
       <select
  className="..."
  onChange={(e) => setFormType(e.target.value)}
  value={formType}
>
  <option value="">-- Select --</option>
  <option value="admin-form-builder">🛠 Create New Form</option>
  {formTypes.map((type, i) => (
    <option key={i} value={type}>{type}</option>
  ))}
</select>
      </div>

      {formType && <DynamicForm formType={formType} refreshFormTypes={fetchFormTypes} />}
    </div>
  );
}

export default App;
