import React, { useState } from 'react';
// No need for custom CSS file when using Bootstrap

const MedicalConditions = ({ onSave, prevData = {}, onPrevious }) => {
  // Initialize form state with previous data or defaults
  // Make sure we have a proper structure even if prevData is incomplete
  const [formData, setFormData] = useState({
    medicalConditions: {
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
    
    if (name === 'diabetes' || name === 'inflammatoryBowelDisease' || name === 'other') {
      setFormData({
        ...formData,
        medicalConditions: {
          ...formData.medicalConditions,
          [name]: {
            ...formData.medicalConditions[name],
            selected: checked
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        medicalConditions: {
          ...formData.medicalConditions,
          [name]: checked
        }
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
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Medical Conditions</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Medical Conditions Section */}
            <div className="mb-4">
              <h4 className="mb-3">Do you have any of the following medical conditions?</h4>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="diabetes"
                      name="diabetes"
                      checked={formData.medicalConditions.diabetes.selected}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="diabetes">Diabetes</label>
                  </div>
                  {formData.medicalConditions.diabetes.selected && (
                    <div className="ms-4 mb-3">
                      <select
                        className="form-select form-select-sm"
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
                    </div>
                  )}
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="celiacDisease"
                      name="celiacDisease"
                      checked={formData.medicalConditions.celiacDisease}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="celiacDisease">Celiac Disease</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="inflammatoryBowelDisease"
                      name="inflammatoryBowelDisease"
                      checked={formData.medicalConditions.inflammatoryBowelDisease.selected}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="inflammatoryBowelDisease">
                      Inflammatory Bowel Disease
                    </label>
                  </div>
                  {formData.medicalConditions.inflammatoryBowelDisease.selected && (
                    <div className="ms-4 mb-3">
                      <select
                        className="form-select form-select-sm"
                        name="inflammatoryBowelDisease"
                        value={formData.medicalConditions.inflammatoryBowelDisease.type}
                        onChange={handleConditionTypeChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Crohn's">Crohn's</option>
                        <option value="Ulcerative Colitis">Ulcerative Colitis</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="hypertension"
                      name="hypertension"
                      checked={formData.medicalConditions.hypertension}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="hypertension">
                      Hypertension (High Blood Pressure)
                    </label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="cardiovascularDisease"
                      name="cardiovascularDisease"
                      checked={formData.medicalConditions.cardiovascularDisease}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="cardiovascularDisease">
                      Cardiovascular Disease
                    </label>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="chronicKidneyDisease"
                      name="chronicKidneyDisease"
                      checked={formData.medicalConditions.chronicKidneyDisease}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="chronicKidneyDisease">
                      Chronic Kidney Disease
                    </label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="acidReflux"
                      name="acidReflux"
                      checked={formData.medicalConditions.acidReflux}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="acidReflux">
                      GERD/Acid Reflux
                    </label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="irritableBowelSyndrome"
                      name="irritableBowelSyndrome"
                      checked={formData.medicalConditions.irritableBowelSyndrome}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="irritableBowelSyndrome">
                      Irritable Bowel Syndrome
                    </label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="gout"
                      name="gout"
                      checked={formData.medicalConditions.gout}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="gout">Gout</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="phenylketonuria"
                      name="phenylketonuria"
                      checked={formData.medicalConditions.phenylketonuria}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="phenylketonuria">
                      Phenylketonuria (PKU)
                    </label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="liverDisease"
                      name="liverDisease"
                      checked={formData.medicalConditions.liverDisease}
                      onChange={handleConditionChange}
                    />
                    <label className="form-check-label" htmlFor="liverDisease">
                      Liver Disease
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="other-condition"
                    name="other"
                    checked={formData.medicalConditions.other.selected}
                    onChange={handleConditionChange}
                  />
                  <label className="form-check-label" htmlFor="other-condition">
                    Other
                  </label>
                </div>
                {formData.medicalConditions.other.selected && (
                  <div className="ms-4 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      name="other"
                      value={formData.medicalConditions.other.details}
                      onChange={handleConditionDetailsChange}
                      placeholder="Specify other conditions"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dietary Goals Section */}
            <div className="mb-4">
              <h4 className="mb-3">What are your primary dietary goals?</h4>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="weightLoss"
                      name="weightLoss"
                      checked={formData.dietaryGoals.weightLoss}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="weightLoss">Weight loss</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="weightGain"
                      name="weightGain"
                      checked={formData.dietaryGoals.weightGain}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="weightGain">Weight gain</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="maintenance"
                      name="maintenance"
                      checked={formData.dietaryGoals.maintenance}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="maintenance">Maintenance</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="increasedEnergy"
                      name="increasedEnergy"
                      checked={formData.dietaryGoals.increasedEnergy}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="increasedEnergy">Increased energy</label>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="betterDigestion"
                      name="betterDigestion"
                      checked={formData.dietaryGoals.betterDigestion}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="betterDigestion">Better digestion</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="improvedSleep"
                      name="improvedSleep"
                      checked={formData.dietaryGoals.improvedSleep}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="improvedSleep">Improved sleep</label>
                  </div>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="muscleBuilding"
                      name="muscleBuilding"
                      checked={formData.dietaryGoals.muscleBuilding}
                      onChange={handleGoalChange}
                    />
                    <label className="form-check-label" htmlFor="muscleBuilding">Muscle building</label>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="other-goal"
                    name="other"
                    checked={formData.dietaryGoals.other.selected}
                    onChange={handleGoalChange}
                  />
                  <label className="form-check-label" htmlFor="other-goal">Other</label>
                </div>
                {formData.dietaryGoals.other.selected && (
                  <div className="ms-4 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      name="other"
                      value={formData.dietaryGoals.other.details}
                      onChange={handleGoalDetailsChange}
                      placeholder="Specify other goals"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="alert alert-secondary mt-4">
              <h5>Disclaimer</h5>
              <p className="mb-0">
                Please note that this information will be used to provide general dietary suggestions. 
                Always consult with healthcare providers before making significant dietary changes, as individual needs vary 
                considerably even within the same condition.
              </p>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={onPrevious}>
                Previous
              </button>
              <button type="submit" className="btn btn-primary">
                Complete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalConditions;