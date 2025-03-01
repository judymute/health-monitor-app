import React, { useState } from 'react';
import './DietaryPreferences.css'; // You'll create this for styling

const DietaryPreferences = ({ onSave, prevData = {} }) => {
  // Initialize form state with previous data or defaults
  const [formData, setFormData] = useState({
    dietType: prevData.dietType || 'No specific diet',
    otherDiet: prevData.otherDiet || '',
    foodAllergies: prevData.foodAllergies || ['No food allergies'],
    otherAllergies: prevData.otherAllergies || '',
    foodIntolerance: prevData.foodIntolerance || ['No food intolerances'],
    dislikedFoods: prevData.dislikedFoods || [],
  });

  // For handling tags input
  const [tagInput, setTagInput] = useState('');

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e, group) => {
    const { value, checked } = e.target;
    
    let updatedValues;
    
    // Special handling for "None/No" options
    if ((value === "No food allergies" || value === "No food intolerances") && checked) {
      // If "None" is checked, uncheck all others
      updatedValues = [value];
    } else if (checked) {
      // If any other option is checked, remove "None" option if present
      updatedValues = formData[group].filter(item => 
        item !== "No food allergies" && item !== "No food intolerances"
      );
      updatedValues.push(value);
    } else {
      // If unchecked, remove the value
      updatedValues = formData[group].filter(item => item !== value);
    }
    
    setFormData({ ...formData, [group]: updatedValues });
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.dislikedFoods.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          dislikedFoods: [...formData.dislikedFoods, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      dislikedFoods: formData.dislikedFoods.filter(t => t !== tag)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="dietary-preferences-container">
      <h2>Dietary Preferences</h2>
      <form onSubmit={handleSubmit}>
        {/* Diet Type */}
        <div className="form-group">
          <label htmlFor="dietType">Do you follow any specific diet?</label>
          <select 
            id="dietType" 
            name="dietType" 
            value={formData.dietType} 
            onChange={handleChange}
            required
          >
            <option value="No specific diet">No specific diet</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Low-carb">Low-carb</option>
            <option value="Low-fat">Low-fat</option>
            <option value="Gluten-free">Gluten-free</option>
            <option value="Dairy-free">Dairy-free</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Other Diet - Conditional Field */}
        {formData.dietType === 'Other' && (
          <div className="form-group">
            <label htmlFor="otherDiet">Please specify your diet:</label>
            <input
              type="text"
              id="otherDiet"
              name="otherDiet"
              value={formData.otherDiet}
              onChange={handleChange}
              placeholder="Describe your diet"
            />
          </div>
        )}

        {/* Food Allergies */}
        <div className="form-group">
          <label>Do you have any food allergies?</label>
          <div className="checkbox-group">
            {[
              "No food allergies",
              "Dairy",
              "Eggs",
              "Peanuts",
              "Tree nuts",
              "Soy",
              "Wheat/Gluten",
              "Fish",
              "Shellfish",
              "Other"
            ].map(allergy => (
              <div key={allergy} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`allergy-${allergy}`}
                  name="allergy"
                  value={allergy}
                  checked={formData.foodAllergies.includes(allergy)}
                  onChange={(e) => handleCheckboxChange(e, 'foodAllergies')}
                />
                <label htmlFor={`allergy-${allergy}`}>{allergy}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Other Allergies - Conditional Field */}
        {formData.foodAllergies.includes('Other') && (
          <div className="form-group">
            <label htmlFor="otherAllergies">Please specify your allergies:</label>
            <input
              type="text"
              id="otherAllergies"
              name="otherAllergies"
              value={formData.otherAllergies}
              onChange={handleChange}
              placeholder="List any other food allergies"
            />
          </div>
        )}

        {/* Food Intolerances */}
        <div className="form-group">
          <label>Do you have any food intolerances?</label>
          <div className="checkbox-group">
            {[
              "No food intolerances",
              "Lactose",
              "Gluten",
              "Fructose",
              "Histamine",
              "Salicylates",
              "FODMAPs",
              "Other"
            ].map(intolerance => (
              <div key={intolerance} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`intolerance-${intolerance}`}
                  name="intolerance"
                  value={intolerance}
                  checked={formData.foodIntolerance.includes(intolerance)}
                  onChange={(e) => handleCheckboxChange(e, 'foodIntolerance')}
                />
                <label htmlFor={`intolerance-${intolerance}`}>{intolerance}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Disliked Foods */}
        <div className="form-group">
          <label htmlFor="dislikedFoods">Are there any foods you strongly dislike?</label>
          <div className="tags-input-container">
            <input
              type="text"
              id="dislikedFoods"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type foods you dislike and press Enter"
            />
            <div className="tags-container">
              {formData.dislikedFoods.map((tag, index) => (
                <div className="tag" key={index}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-secondary">Previous</button>
          <button type="submit" className="btn-primary">Next</button>
        </div>
      </form>
    </div>
  );
};

export default DietaryPreferences;