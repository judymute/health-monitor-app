import React, { useState } from 'react';
import './MedicalConditions.css';

const MedicalConditions = ({ onSave, prevData = {}, onPrevious }) => {
  // Initialize form state with previous data or defaults
  // Make sure we have a proper structure even if prevData is incomplete
  const [formData, setFormData] = useState({
    medicalConditions: {
      noMedicalConditions: prevData?.medicalConditions?.noMedicalConditions || false,
      diabetes: {
        selected: prevData?.medicalConditions?.diabetes?.selected || false,
        type: prevData?.medicalConditions?.diabetes?.type || ''
      },
      celiacDisease: prevData?.medicalConditions?.celiacDisease || false,
      inflammatoryBowelDisease: {
        selected: prevData?.medicalConditions?.inflammatoryBowelDisease?.selected || false,
        type: prevData?.medicalConditions?.inflammatoryBowelDisease?.type || ''
      },
      hypertension: prevData?.medicalConditions?.hypertension || false,
      cardiovascularDisease: prevData?.medicalConditions?.cardiovascularDisease || false,
      chronicKidneyDisease: prevData?.medicalConditions?.chronicKidneyDisease || false,
      acidReflux: prevData?.medicalConditions?.acidReflux || false,
      irritableBowelSyndrome: prevData?.medicalConditions?.irritableBowelSyndrome || false,
      gout: prevData?.medicalConditions?.gout || false,
      phenylketonuria: prevData?.medicalConditions?.phenylketonuria || false,
      liverDisease: prevData?.medicalConditions?.liverDisease || false,
      other: {
        selected: prevData?.medicalConditions?.other?.selected || false,
        details: prevData?.medicalConditions?.other?.details || ''
      }
    },
    dietaryGoals: {
      weightLoss: prevData?.dietaryGoals?.weightLoss || false,
      weightGain: prevData?.dietaryGoals?.weightGain || false,
      maintenance: prevData?.dietaryGoals?.maintenance || false,
      increasedEnergy: prevData?.dietaryGoals?.increasedEnergy || false,
      betterDigestion: prevData?.dietaryGoals?.betterDigestion || false,
      improvedSleep: prevData?.dietaryGoals?.improvedSleep || false,
      muscleBuilding: prevData?.dietaryGoals?.muscleBuilding || false,
      other: {
        selected: prevData?.dietaryGoals?.other?.selected || false,
        details: prevData?.dietaryGoals?.other?.details || ''
      }
    }
  });

  // Handle checkbox changes for medical conditions
  const handleConditionChange = (e) => {
    const { name, checked } = e.target;
    
    // Special handling for "noMedicalConditions" option
    if (name === 'noMedicalConditions') {
      // If checking "No medical conditions", uncheck all other conditions
      if (checked) {
        const resetConditions = {};
        
        // Reset all other conditions while keeping their structure
        Object.keys(formData.medicalConditions).forEach(key => {
          if (key === 'noMedicalConditions') {
            resetConditions[key] = true;
          } else if (typeof formData.medicalConditions[key] === 'object') {
            resetConditions[key] = {
              ...formData.medicalConditions[key],
              selected: false,
              type: ''
            };
          } else {
            resetConditions[key] = false;
          }
        });
        
        setFormData({
          ...formData,
          medicalConditions: resetConditions
        });
      } else {
        // Just update the noMedicalConditions value
        setFormData({
          ...formData,
          medicalConditions: {
            ...formData.medicalConditions,
            [name]: checked
          }
        });
      }
    } else {
      // If checking any medical condition, uncheck "noMedicalConditions"
      let updatedMedicalConditions = {
        ...formData.medicalConditions,
        noMedicalConditions: false
      };
      
      // Update the specific condition
      if (name === 'diabetes' || name === 'inflammatoryBowelDisease' || name === 'other') {
        updatedMedicalConditions = {
          ...updatedMedicalConditions,
          [name]: {
            ...formData.medicalConditions[name],
            selected: checked
          }
        }; 
      } else {
        updatedMedicalConditions = {
          ...updatedMedicalConditions,
          [name]: checked
        };
      }
      
      setFormData({
        ...formData,
        medicalConditions: updatedMedicalConditions
      });
    }
  };

  // Handle dropdown changes for condition types
  const handleConditionTypeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      medicalConditions: {
        ...formData.medicalConditions,
        [name]: {
          ...formData.medicalConditions[name],
          type: value
        }
      }
    });
  };

  // Handle text input for condition details
  const handleConditionDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      medicalConditions: {
        ...formData.medicalConditions,
        [name]: {
          ...formData.medicalConditions[name],
          details: value
        }
      }
    });
  };

  // Handle checkbox changes for dietary goals
  const handleGoalChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'other') {
      setFormData({
        ...formData,
        dietaryGoals: {
          ...formData.dietaryGoals,
          [name]: {
            ...formData.dietaryGoals[name],
            selected: checked
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        dietaryGoals: {
          ...formData.dietaryGoals,
          [name]: checked
        }
      });
    }
  };

  // Handle text input for goal details
  const handleGoalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dietaryGoals: {
        ...formData.dietaryGoals,
        [name]: {
          ...formData.dietaryGoals[name],
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
    <div className="medical-container">
      <form onSubmit={handleSubmit}>
        {/* Medical Conditions Section */}
        <div className="section">
          <h3 className="section-title">Medical Conditions</h3>
          <p className="section-description">
            Do you have any of the following medical conditions? This information helps us tailor dietary recommendations to your specific health needs.
          </p>
          
          {/* No Medical Conditions Option */}
          <div className="no-conditions-container">
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="noMedicalConditions"
                name="noMedicalConditions"
                checked={formData.medicalConditions.noMedicalConditions}
                onChange={handleConditionChange}
              />
              <label className="checkbox-label strong-label" htmlFor="noMedicalConditions">
                I do not have any medical conditions
              </label>
            </div>
          </div>
          
          {/* Only show condition checkboxes if "No medical conditions" is not checked */}
          {!formData.medicalConditions.noMedicalConditions && (
            <div className="checkbox-grid">
              <div>
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="diabetes"
                    name="diabetes"
                    checked={formData.medicalConditions.diabetes.selected}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="diabetes">Diabetes</label>
                </div>
                {formData.medicalConditions.diabetes.selected && (
                  <select
                    className="select"
                    name="diabetes"
                    value={formData.medicalConditions.diabetes.type}
                    onChange={handleConditionTypeChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="Gestational">Gestational</option>
                    <option value="Prediabetes">Prediabetes</option>
                  </select>
                )}
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="celiacDisease"
                    name="celiacDisease"
                    checked={formData.medicalConditions.celiacDisease}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="celiacDisease">Celiac Disease</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="inflammatoryBowelDisease"
                    name="inflammatoryBowelDisease"
                    checked={formData.medicalConditions.inflammatoryBowelDisease.selected}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="inflammatoryBowelDisease">
                    Inflammatory Bowel Disease
                  </label>
                </div>
                {formData.medicalConditions.inflammatoryBowelDisease.selected && (
                  <select
                    className="select"
                    name="inflammatoryBowelDisease"
                    value={formData.medicalConditions.inflammatoryBowelDisease.type}
                    onChange={handleConditionTypeChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Crohn's">Crohn's</option>
                    <option value="Ulcerative Colitis">Ulcerative Colitis</option>
                  </select>
                )}
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="hypertension"
                    name="hypertension"
                    checked={formData.medicalConditions.hypertension}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="hypertension">
                    Hypertension (High Blood Pressure)
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="cardiovascularDisease"
                    name="cardiovascularDisease"
                    checked={formData.medicalConditions.cardiovascularDisease}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="cardiovascularDisease">
                    Cardiovascular Disease
                  </label>
                </div>
              </div>
              
              <div>
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="chronicKidneyDisease"
                    name="chronicKidneyDisease"
                    checked={formData.medicalConditions.chronicKidneyDisease}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="chronicKidneyDisease">
                    Chronic Kidney Disease
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="acidReflux"
                    name="acidReflux"
                    checked={formData.medicalConditions.acidReflux}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="acidReflux">
                    GERD/Acid Reflux
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="irritableBowelSyndrome"
                    name="irritableBowelSyndrome"
                    checked={formData.medicalConditions.irritableBowelSyndrome}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="irritableBowelSyndrome">
                    Irritable Bowel Syndrome
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="gout"
                    name="gout"
                    checked={formData.medicalConditions.gout}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="gout">Gout</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="phenylketonuria"
                    name="phenylketonuria"
                    checked={formData.medicalConditions.phenylketonuria}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="phenylketonuria">
                    Phenylketonuria (PKU)
                  </label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="liverDisease"
                    name="liverDisease"
                    checked={formData.medicalConditions.liverDisease}
                    onChange={handleConditionChange}
                  />
                  <label className="checkbox-label" htmlFor="liverDisease">
                    Liver Disease
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* "Other" is shown only if "No medical conditions" is not checked */}
          {!formData.medicalConditions.noMedicalConditions && (
            <div className="other-item">
              <div className="checkbox-item">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="other-condition"
                  name="other"
                  checked={formData.medicalConditions.other.selected}
                  onChange={handleConditionChange}
                />
                <label className="checkbox-label" htmlFor="other-condition">
                  Other medical condition
                </label>
              </div>
              {formData.medicalConditions.other.selected && (
                <input
                  className="input-text"
                  type="text"
                  name="other"
                  value={formData.medicalConditions.other.details}
                  onChange={handleConditionDetailsChange}
                  placeholder="Specify other conditions"
                />
              )}
            </div>
          )}
        </div>

        {/* Dietary Goals Section */}
        <div className="section">
          <h3 className="section-title">Dietary Goals</h3>
          <p className="section-description">
            What are your primary dietary goals? Select all that apply.
          </p>
          
          <div className="goals-grid">
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="weightLoss"
                name="weightLoss"
                checked={formData.dietaryGoals.weightLoss}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="weightLoss">Weight loss</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="weightGain"
                name="weightGain"
                checked={formData.dietaryGoals.weightGain}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="weightGain">Weight gain</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="maintenance"
                name="maintenance"
                checked={formData.dietaryGoals.maintenance}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="maintenance">Maintenance</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="increasedEnergy"
                name="increasedEnergy"
                checked={formData.dietaryGoals.increasedEnergy}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="increasedEnergy">Increased energy</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="betterDigestion"
                name="betterDigestion"
                checked={formData.dietaryGoals.betterDigestion}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="betterDigestion">Better digestion</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="improvedSleep"
                name="improvedSleep"
                checked={formData.dietaryGoals.improvedSleep}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="improvedSleep">Improved sleep</label>
            </div>
            
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="muscleBuilding"
                name="muscleBuilding"
                checked={formData.dietaryGoals.muscleBuilding}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="muscleBuilding">Muscle building</label>
            </div>
          </div>
          
          <div className="other-item">
            <div className="checkbox-item">
              <input
                className="checkbox"
                type="checkbox"
                id="other-goal"
                name="other"
                checked={formData.dietaryGoals.other.selected}
                onChange={handleGoalChange}
              />
              <label className="checkbox-label" htmlFor="other-goal">Other goal</label>
            </div>
            {formData.dietaryGoals.other.selected && (
              <input
                className="input-text"
                type="text"
                name="other"
                value={formData.dietaryGoals.other.details}
                onChange={handleGoalDetailsChange}
                placeholder="Specify other goals"
              />
            )}
          </div>
        </div>

        <div className="disclaimer">
          <h4 className="disclaimer-title">Disclaimer</h4>
          <p className="disclaimer-text">
            Please note that this information will be used to provide general dietary suggestions. 
            Always consult with healthcare providers before making significant dietary changes, as individual needs vary 
            considerably even within the same condition.
          </p>
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
            className="button-complete"
          >
            Complete
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalConditions;