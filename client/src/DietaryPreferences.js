import React, { useState } from 'react';
import './DietaryPreferences.css'; // You'll need to create this for styling

const DietaryPreferences = ({ onSave, prevData = {}, onPrevious }) => {
  // Initialize form state with previous data or defaults
  const [formData, setFormData] = useState({
    dietType: prevData.dietType || '',
    dietTypeOther: prevData.dietTypeOther || '',
    allergiesIntolerances: prevData.allergiesIntolerances || {
      dairy: false,
      eggs: false,
      nuts: {
        selected: false,
        details: ''
      },
      seafoodShellfish: false,
      gluten: false,
      soy: false,
      other: {
        selected: false,
        details: ''
      }
    },
    favoriteCuisines: prevData.favoriteCuisines || {
      italian: false,
      mexican: false,
      indian: false,
      chinese: false,
      japanese: false,
      thai: false,
      mediterranean: false,
      american: false,
      middleEastern: false,
      other: {
        selected: false,
        details: ''
      }
    },
    spiceTolerance: prevData.spiceTolerance || null,
    dislikedFoods: prevData.dislikedFoods || ''
  });

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes for allergies/intolerances
  const handleAllergyChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'nuts' || name === 'other') {
      setFormData({
        ...formData,
        allergiesIntolerances: {
          ...formData.allergiesIntolerances,
          [name]: {
            ...formData.allergiesIntolerances[name],
            selected: checked
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        allergiesIntolerances: {
          ...formData.allergiesIntolerances,
          [name]: checked
        }
      });
    }
  };

  // Handle text input for allergy details
  const handleAllergyDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      allergiesIntolerances: {
        ...formData.allergiesIntolerances,
        [name]: {
          ...formData.allergiesIntolerances[name],
          details: value
        }
      }
    });
  };

  // Handle checkbox changes for favorite cuisines
  const handleCuisineChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'other') {
      setFormData({
        ...formData,
        favoriteCuisines: {
          ...formData.favoriteCuisines,
          [name]: {
            ...formData.favoriteCuisines[name],
            selected: checked
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        favoriteCuisines: {
          ...formData.favoriteCuisines,
          [name]: checked
        }
      });
    }
  };

  // Handle text input for cuisine details
  const handleCuisineDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      favoriteCuisines: {
        ...formData.favoriteCuisines,
        [name]: {
          ...formData.favoriteCuisines[name],
          details: value
        }
      }
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
          <label htmlFor="dietType">Diet Type:</label>
          <select 
            id="dietType" 
            name="dietType" 
            value={formData.dietType} 
            onChange={handleChange}
            required
          >
            <option value="">Select Diet Type</option>
            <option value="Omnivore">Omnivore</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Flexitarian">Flexitarian</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Other Diet Type - Conditional Field */}
        {formData.dietType === 'Other' && (
          <div className="form-group">
            <label htmlFor="dietTypeOther">Please specify your diet:</label>
            <input
              type="text"
              id="dietTypeOther"
              name="dietTypeOther"
              value={formData.dietTypeOther}
              onChange={handleChange}
              placeholder="Describe your diet"
              required
            />
          </div>
        )}

        {/* Food Allergies/Intolerances */}
        <div className="form-group">
          <label>Food Allergies/Intolerances:</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="dairy"
                name="dairy"
                checked={formData.allergiesIntolerances.dairy}
                onChange={handleAllergyChange}
              />
              <label htmlFor="dairy">Dairy</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="eggs"
                name="eggs"
                checked={formData.allergiesIntolerances.eggs}
                onChange={handleAllergyChange}
              />
              <label htmlFor="eggs">Eggs</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="nuts"
                name="nuts"
                checked={formData.allergiesIntolerances.nuts.selected}
                onChange={handleAllergyChange}
              />
              <label htmlFor="nuts">Nuts</label>
              {formData.allergiesIntolerances.nuts.selected && (
                <input
                  type="text"
                  name="nuts"
                  value={formData.allergiesIntolerances.nuts.details}
                  onChange={handleAllergyDetailsChange}
                  placeholder="Specify which nuts"
                  className="indented-input"
                />
              )}
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="seafoodShellfish"
                name="seafoodShellfish"
                checked={formData.allergiesIntolerances.seafoodShellfish}
                onChange={handleAllergyChange}
              />
              <label htmlFor="seafoodShellfish">Seafood/Shellfish</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="gluten"
                name="gluten"
                checked={formData.allergiesIntolerances.gluten}
                onChange={handleAllergyChange}
              />
              <label htmlFor="gluten">Gluten</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="soy"
                name="soy"
                checked={formData.allergiesIntolerances.soy}
                onChange={handleAllergyChange}
              />
              <label htmlFor="soy">Soy</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="other-allergy"
                name="other"
                checked={formData.allergiesIntolerances.other.selected}
                onChange={handleAllergyChange}
              />
              <label htmlFor="other-allergy">Other</label>
              {formData.allergiesIntolerances.other.selected && (
                <input
                  type="text"
                  name="other"
                  value={formData.allergiesIntolerances.other.details}
                  onChange={handleAllergyDetailsChange}
                  placeholder="Specify other allergies/intolerances"
                  className="indented-input"
                />
              )}
            </div>
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div className="form-group">
          <label>Favorite Cuisines:</label>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="italian"
                name="italian"
                checked={formData.favoriteCuisines.italian}
                onChange={handleCuisineChange}
              />
              <label htmlFor="italian">Italian</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="mexican"
                name="mexican"
                checked={formData.favoriteCuisines.mexican}
                onChange={handleCuisineChange}
              />
              <label htmlFor="mexican">Mexican</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="indian"
                name="indian"
                checked={formData.favoriteCuisines.indian}
                onChange={handleCuisineChange}
              />
              <label htmlFor="indian">Indian</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="chinese"
                name="chinese"
                checked={formData.favoriteCuisines.chinese}
                onChange={handleCuisineChange}
              />
              <label htmlFor="chinese">Chinese</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="japanese"
                name="japanese"
                checked={formData.favoriteCuisines.japanese}
                onChange={handleCuisineChange}
              />
              <label htmlFor="japanese">Japanese</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="thai"
                name="thai"
                checked={formData.favoriteCuisines.thai}
                onChange={handleCuisineChange}
              />
              <label htmlFor="thai">Thai</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="mediterranean"
                name="mediterranean"
                checked={formData.favoriteCuisines.mediterranean}
                onChange={handleCuisineChange}
              />
              <label htmlFor="mediterranean">Mediterranean</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="american"
                name="american"
                checked={formData.favoriteCuisines.american}
                onChange={handleCuisineChange}
              />
              <label htmlFor="american">American</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="middleEastern"
                name="middleEastern"
                checked={formData.favoriteCuisines.middleEastern}
                onChange={handleCuisineChange}
              />
              <label htmlFor="middleEastern">Middle Eastern</label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="other-cuisine"
                name="other"
                checked={formData.favoriteCuisines.other.selected}
                onChange={handleCuisineChange}
              />
              <label htmlFor="other-cuisine">Other</label>
              {formData.favoriteCuisines.other.selected && (
                <input
                  type="text"
                  name="other"
                  value={formData.favoriteCuisines.other.details}
                  onChange={handleCuisineDetailsChange}
                  placeholder="Specify other cuisines"
                  className="indented-input"
                />
              )}
            </div>
          </div>
        </div>

        {/* Spice Tolerance */}
        <div className="form-group">
          <label>Spice Tolerance:</label>
          <div className="radio-group">
            {[
              { value: 1, label: '1 - Mild (No spice)' },
              { value: 2, label: '2 - Light spice' },
              { value: 3, label: '3 - Moderate spice' },
              { value: 4, label: '4 - Spicy' },
              { value: 5, label: '5 - Very spicy (Heat enthusiast)' }
            ].map(option => (
              <div key={option.value} className="radio-item">
                <input
                  type="radio"
                  id={`spice-${option.value}`}
                  name="spiceTolerance"
                  value={option.value}
                  checked={formData.spiceTolerance === option.value}
                  onChange={() => setFormData({...formData, spiceTolerance: option.value})}
                  required
                />
                <label htmlFor={`spice-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Foods You Dislike */}
        <div className="form-group">
          <label htmlFor="dislikedFoods">Foods You Dislike:</label>
          <textarea
            id="dislikedFoods"
            name="dislikedFoods"
            value={formData.dislikedFoods}
            onChange={handleChange}
            placeholder="Enter foods you dislike, separated by commas"
            rows="4"
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-secondary" onClick={onPrevious}>
            Previous
          </button>
          <button type="submit" className="btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietaryPreferences;