import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicForm from './components/DynamicForm';
import AdminPanel from './components/AdminPanel';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// ✅ Home Page with Form Type Dropdown
const Home = ({ fetchFormTypes, formTypes }) => {
  const [formType, setFormType] = useState('');
  const navigate = useNavigate();

  const handleSelect = (value) => {
    if (value === 'admin-form-builder') {
      navigate('/admin');
    } else {
      setFormType(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto mb-6">
        <label className="block text-lg font-semibold mb-2">Select a Form Type:</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => handleSelect(e.target.value)}
          value={formType}
        >
          <option value="">-- Select --</option>
          <option value="admin-form-builder">🛠 Create New Form</option>
          {formTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {formType && (
        <DynamicForm formType={formType} refreshFormTypes={fetchFormTypes} />
      )}
    </div>
  );
};

function App() {
  const [formTypes, setFormTypes] = useState([]);

  const fetchFormTypes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms`)
;
      setFormTypes(res.data);
    } catch (error) {
      console.error('Failed to fetch form types:', error);
    }
  };

  useEffect(() => {
    fetchFormTypes();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home fetchFormTypes={fetchFormTypes} formTypes={formTypes} />}
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
