import React, { useState } from 'react';
import './DietaryPreferences.css';

const DietaryPreferences = ({ onSave, prevData = {}, onPrevious }) => {
  // Initialize form state with previous data or defaults
  const [formData, setFormData] = useState({
    dietType: prevData.dietType || '',
    dietTypeOther: prevData.dietTypeOther || '',
    allergiesIntolerances: prevData.allergiesIntolerances || {
      noAllergies: prevData.allergiesIntolerances?.noAllergies || false,
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
    
    // Handle "No allergies" option
    if (name === 'noAllergies') {
      if (checked) {
        // If "No allergies" is checked, reset all other allergies
        const resetAllergies = {
          noAllergies: true,
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
        };
        
        setFormData({
          ...formData,
          allergiesIntolerances: resetAllergies
        });
      } else {
        // Just update the noAllergies value
        setFormData({
          ...formData,
          allergiesIntolerances: {
            ...formData.allergiesIntolerances,
            [name]: checked
          }
        });
      }
    } else {
      // Handle other allergies
      // If any other allergy is checked, uncheck "No allergies"
      let updatedAllergies = {
        ...formData.allergiesIntolerances,
        noAllergies: false
      };
      
      if (name === 'nuts' || name === 'other') {
        updatedAllergies = {
          ...updatedAllergies,
          [name]: {
            ...formData.allergiesIntolerances[name],
            selected: checked
          }
        };
      } else {
        updatedAllergies = {
          ...updatedAllergies,
          [name]: checked
        };
      }
      
      setFormData({
        ...formData,
        allergiesIntolerances: updatedAllergies
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
    <div className="dietary-container">
      <form onSubmit={handleSubmit}>
        {/* Diet Type */}
        <div className="section">
          <h3 className="section-title">Diet Type</h3>
          <label className="input-label" htmlFor="dietType">
            What type of diet do you follow?
          </label>
          <select 
            className="select"
            id="dietType" 
            name="dietType" 
            value={formData.dietType} 
            onChange={handleChange}
            required
          >
  <option value="">Select Diet Type</option>
  <option value="Omnivore">Omnivore - Includes all types of foods, including meat, dairy, and plants</option>
  <option value="Vegetarian">Vegetarian - Excludes meat but includes dairy and eggs</option>
  <option value="Vegan">Vegan - Excludes all animal products, including dairy and eggs</option>
  <option value="Pescatarian">Pescatarian - Excludes meat but includes fish and seafood</option>
  <option value="Flexitarian">Flexitarian - Primarily plant-based but occasionally includes meat</option>
  <option value="Keto">Keto - Low-carb, high-fat diet focusing on ketosis</option>
  <option value="Paleo">Paleo - Emphasizes whole foods, excluding processed foods and dairy</option>
  <option value="Mediterranean">Mediterranean - Focuses on fruits, vegetables, whole grains, and healthy fats</option>
  <option value="Other">Other</option>
          </select>
        </div>

        {/* Other Diet Type - Conditional Field */}
        {formData.dietType === 'Other' && (
          <div className="section section-no-margin">
            <label className="input-label" htmlFor="dietTypeOther">
              Please specify your diet:
            </label>
            <input
              className="input"
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
        <div className="section">
          <h3 className="section-title">Food Allergies/Intolerances</h3>
          <label className="input-label">
            Do you have any allergies or intolerances to the following foods?
          </label>
          
          {/* No Allergies Option */}
          <div className="no-allergies-container">
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="noAllergies"
                name="noAllergies"
                checked={formData.allergiesIntolerances.noAllergies}
                onChange={handleAllergyChange}
              />
              <label className="checkbox-label strong-label" htmlFor="noAllergies">
                I do not have any food allergies or intolerances
              </label>
            </div>
          </div>
          
          {/* Only show allergy checkboxes if "No allergies" is not checked */}
          {!formData.allergiesIntolerances.noAllergies && (
            <div className="checkbox-container">
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="dairy"
                  name="dairy"
                  checked={formData.allergiesIntolerances.dairy}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="dairy">Dairy</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="eggs"
                  name="eggs"
                  checked={formData.allergiesIntolerances.eggs}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="eggs">Eggs</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="nuts"
                  name="nuts"
                  checked={formData.allergiesIntolerances.nuts.selected}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="nuts">Nuts</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="seafoodShellfish"
                  name="seafoodShellfish"
                  checked={formData.allergiesIntolerances.seafoodShellfish}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="seafoodShellfish">Seafood/Shellfish</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="gluten"
                  name="gluten"
                  checked={formData.allergiesIntolerances.gluten}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="gluten">Gluten</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="soy"
                  name="soy"
                  checked={formData.allergiesIntolerances.soy}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="soy">Soy</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="other-allergy"
                  name="other"
                  checked={formData.allergiesIntolerances.other.selected}
                  onChange={handleAllergyChange}
                />
                <label className="checkbox-label" htmlFor="other-allergy">Other</label>
              </div>
            </div>
          )}
          
          {/* Only show conditional inputs if "No allergies" is not checked */}
          {!formData.allergiesIntolerances.noAllergies && (
            <>
              {formData.allergiesIntolerances.nuts.selected && (
                <input
                  className="nested-input"
                  type="text"
                  name="nuts"
                  value={formData.allergiesIntolerances.nuts.details}
                  onChange={handleAllergyDetailsChange}
                  placeholder="Specify which nuts"
                />
              )}
              
              {formData.allergiesIntolerances.other.selected && (
                <input
                  className="nested-input"
                  type="text"
                  name="other"
                  value={formData.allergiesIntolerances.other.details}
                  onChange={handleAllergyDetailsChange}
                  placeholder="Specify other allergies/intolerances"
                />
              )}
            </>
          )}
        </div>

        {/* Favorite Cuisines */}
        <div className="section">
          <h3 className="section-title">Favorite Cuisines</h3>
          <label className="input-label">
            Select cuisines that you enjoy (select all that apply):
          </label>
          <div className="checkbox-container">
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="italian"
                name="italian"
                checked={formData.favoriteCuisines.italian}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="italian">Italian</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="mexican"
                name="mexican"
                checked={formData.favoriteCuisines.mexican}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="mexican">Mexican</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="indian"
                name="indian"
                checked={formData.favoriteCuisines.indian}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="indian">Indian</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="chinese"
                name="chinese"
                checked={formData.favoriteCuisines.chinese}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="chinese">Chinese</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="japanese"
                name="japanese"
                checked={formData.favoriteCuisines.japanese}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="japanese">Japanese</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="thai"
                name="thai"
                checked={formData.favoriteCuisines.thai}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="thai">Thai</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="mediterranean"
                name="mediterranean"
                checked={formData.favoriteCuisines.mediterranean}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="mediterranean">Mediterranean</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="american"
                name="american"
                checked={formData.favoriteCuisines.american}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="american">American</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="middleEastern"
                name="middleEastern"
                checked={formData.favoriteCuisines.middleEastern}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="middleEastern">Middle Eastern</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="other-cuisine"
                name="other"
                checked={formData.favoriteCuisines.other.selected}
                onChange={handleCuisineChange}
              />
              <label className="checkbox-label" htmlFor="other-cuisine">Other</label>
            </div>
          </div>
          
          {formData.favoriteCuisines.other.selected && (
            <input
              className="nested-input"
              type="text"
              name="other"
              value={formData.favoriteCuisines.other.details}
              onChange={handleCuisineDetailsChange}
              placeholder="Specify other cuisines"
            />
          )}
        </div>

        {/* Spice Tolerance */}
        <div className="section">
          <h3 className="section-title">Spice Tolerance</h3>
          <label className="input-label">
            How spicy do you prefer your food?
          </label>
          <div className="radio-container">
            {[
              { value: 1, label: '1 - Mild (No spice)' },
              { value: 2, label: '2 - Light spice' },
              { value: 3, label: '3 - Moderate spice' },
              { value: 4, label: '4 - Spicy' },
              { value: 5, label: '5 - Very spicy (Heat enthusiast)' }
            ].map(option => (
              <div key={option.value} className="radio-item">
                <input
                  className="radio"
                  type="radio"
                  id={`spice-${option.value}`}
                  name="spiceTolerance"
                  value={option.value}
                  checked={parseInt(formData.spiceTolerance) === option.value}
                  onChange={() => setFormData({...formData, spiceTolerance: option.value})}
                  required
                />
                <label className="checkbox-label" htmlFor={`spice-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Foods You Dislike */}
        <div className="section">
          <h3 className="section-title">Foods You Dislike</h3>
          <label className="input-label" htmlFor="dislikedFoods">
            Please list any foods you dislike or would prefer to avoid:
          </label>
          <textarea
            className="textarea"
            id="dislikedFoods"
            name="dislikedFoods"
            value={formData.dislikedFoods}
            onChange={handleChange}
            placeholder="Enter foods you dislike, separated by commas"
            rows="4"
          />
        </div>

        <div className="button-container">
          <button 
            type="button" 
            className="button-previous" 
            onClick={onPrevious}
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="button-next"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietaryPreferences;