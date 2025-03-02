import React, { useState } from 'react';
// No need for custom CSS file when using Bootstrap

const BasicInformation = ({ onSave, prevData = {}, onPrevious }) => {
  // Initialize form state with previous data or defaults
  const [formData, setFormData] = useState({
    fullName: prevData.fullName || '',
    age: prevData.age || '18',
    weight: prevData.weight?.value || '',
    weightUnit: prevData.weight?.unit || 'kg',
    height: prevData.height?.value || '',
    heightUnit: prevData.height?.unit || 'cm',
    bloodType: prevData.bloodType || '',
  });

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format data to match JSON structure
    const formattedData = {
      fullName: formData.fullName,
      age: parseInt(formData.age),
      weight: {
        value: parseFloat(formData.weight),
        unit: formData.weightUnit
      },
      height: {
        value: parseFloat(formData.height),
        unit: formData.heightUnit
      },
      bloodType: formData.bloodType
    };
    
    onSave(formattedData);
  };

  // Generate age dropdown options
  const ageOptions = [];
  for (let i = 18; i <= 100; i++) {
    ageOptions.push(
      <option key={i} value={i}>{i}</option>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Basic Information</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name:</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Age */}
            <div className="mb-3">
              <label htmlFor="age" className="form-label">Age:</label>
              <select 
                className="form-select"
                id="age" 
                name="age" 
                value={formData.age} 
                onChange={handleChange}
                required
              >
                {ageOptions}
              </select>
            </div>

            {/* Weight */}
            <div className="mb-3">
              <label htmlFor="weight" className="form-label">Weight:</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  placeholder="Enter your weight"
                />
                <select
                  className="form-select"
                  style={{ maxWidth: '100px' }}
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            {/* Height */}
            <div className="mb-3">
              <label htmlFor="height" className="form-label">Height:</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  placeholder="Enter your height"
                />
                <select
                  className="form-select"
                  style={{ maxWidth: '100px' }}
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleChange}
                  required
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            {/* Blood Type */}
            <div className="mb-3">
              <label htmlFor="bloodType" className="form-label">Blood Type:</label>
              <select
                className="form-select"
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="d-flex justify-content-between mt-4">
              {onPrevious && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={onPrevious}
                >
                  Previous
                </button>
              )}
              <button type="submit" className="btn btn-primary">Next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;