import React, { useState } from 'react';
import './BasicInformation.css';

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
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Basic Information</h2>
        <p className="form-subtitle">Please provide your personal information</p>
      </div>
      
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Full Name */}
            <div>
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            {/* Age */}
            <div>
              <label className="form-label">
                Age
              </label>
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
          </div>

          <div className="form-row">
            {/* Weight */}
            <div>
              <label className="form-label">
                Weight
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="form-input"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  placeholder="Weight"
                />
                <select
                  className="unit-select"
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
            <div>
              <label className="form-label">
                Height
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="form-input"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  placeholder="Height"
                />
                <select
                  className="unit-select"
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
          </div>

          {/* Blood Type */}
          <div className="form-row">
            <div style={{ textAlign: 'center' }}>
              <label className="form-label" style={{ textAlign: 'center' }}>
                Blood Type
              </label>
            <select
              className="form-select blood-type-select"
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
          </div>

          <div className="form-buttons">
            {onPrevious && (
              <button 
                type="button" 
                className="button-secondary"
                onClick={onPrevious}
              >
                Previous
              </button>
            )}
            <button 
              type="submit" 
              className={`button-primary ${!onPrevious ? 'button-primary-right' : ''}`}
            >
              Next
            </button>
          </div>
        </form>
      </div>
      
      {/* Progress indicator */}
      <div className="progress-container">
        <div className="progress-dots">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`progress-dot ${i === 1 ? 'progress-dot-active' : 'progress-dot-inactive'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;