import React, { useState } from 'react';

const PersonalInformation = ({ onSave, prevData }) => {
  const [formData, setFormData] = useState(prevData || {
    fullName: '',
    age: '',
    gender: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    bloodType: '',
    activityLevel: '',
    smokingHabits: '',
    alcoholConsumption: '',
    medications: '',
    dietaryRestrictions: [],
    foodAllergies: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
          ? [...formData[name], value]
          : formData[name].filter((item) => item !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="questionnaire-step">
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </label>
        
        <label>Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        
        <label>Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>Height:
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
          <select name="heightUnit" value={formData.heightUnit} onChange={handleChange}>
            <option value="cm">cm</option>
            <option value="ft">ft</option>
          </select>
        </label>

        <label>Weight:
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
          <select name="weightUnit" value={formData.weightUnit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </label>

        <label>Blood Type:
          <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </label>

        <label>Activity Level:
          <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
            <option value="Super Active">Super Active</option>
          </select>
        </label>

        <label>Smoking Habits:
          <select name="smokingHabits" value={formData.smokingHabits} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Non-smoker">Non-smoker</option>
            <option value="Occasional Smoker">Occasional Smoker</option>
            <option value="Frequent Smoker">Frequent Smoker</option>
            <option value="Former Smoker">Former Smoker</option>
          </select>
        </label>

        <label>Alcohol Consumption:
          <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Occasionally">Occasionally</option>
            <option value="Regularly">Regularly</option>
            <option value="Frequently">Frequently</option>
          </select>
        </label>

        <label>Medications Currently Taking:
          <textarea name="medications" value={formData.medications} onChange={handleChange} />
        </label>

        <label>Dietary Restrictions:
          <input type="checkbox" name="dietaryRestrictions" value="Vegetarian" onChange={handleChange} /> Vegetarian
          <input type="checkbox" name="dietaryRestrictions" value="Vegan" onChange={handleChange} /> Vegan
          <input type="checkbox" name="dietaryRestrictions" value="Pescatarian" onChange={handleChange} /> Pescatarian
          <input type="checkbox" name="dietaryRestrictions" value="Gluten-Free" onChange={handleChange} /> Gluten-Free
        </label>

        <button type="submit" className="btn-primary">Next</button>
      </form>
    </div>
  );
};

export default PersonalInformation;
