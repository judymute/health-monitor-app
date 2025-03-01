
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DietaryPreferences from './DietaryPreferences';
import './QuestionnaireContainer.css';

// You would import other questionnaire components here
// import PersonalInformation from './PersonalInformation';
// import HealthConditions from './HealthConditions';
// etc.

const QuestionnaireContainer = ({ onComplete, userData = null }) => {
  const navigate = useNavigate();
  
  // State to track current step in the questionnaire
  const [currentStep, setCurrentStep] = useState(1);
  
  // State to collect all user data across questionnaire steps
  const [collectedData, setCollectedData] = useState(userData || {
    personalInfo: {},
    dietaryPreferences: {},
    healthConditions: {},
    // Add other sections as needed
  });

  // Function to handle data from each questionnaire step
  const handleStepComplete = (sectionName, data) => {
    // Update collected data
    const updatedData = {
      ...collectedData,
      [sectionName]: data
    };
    
    setCollectedData(updatedData);
    
    // If this is the final step, complete the questionnaire
    if (currentStep === totalSteps) {
      onComplete(updatedData);
      navigate('/dashboard');
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to go back to previous step
  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };
  
  // Total number of steps in the questionnaire
  const totalSteps = 3; // Update this based on how many sections you have
  
  // Custom onSave handler for DietaryPreferences
  const handleDietaryPrefsSave = (data) => {
    handleStepComplete('dietaryPreferences', data);
  };
  
  // Render current step based on state
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Replace with your PersonalInformation component when available
        return (
          <div className="questionnaire-step">
            <h2>Personal Information</h2>
            <p>This would be your PersonalInformation component</p>
            <div className="form-buttons">
              <button 
                className="btn-primary" 
                onClick={() => handleStepComplete('personalInfo', { placeholder: 'data' })}
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <DietaryPreferences 
            onSave={handleDietaryPrefsSave} 
            prevData={collectedData.dietaryPreferences}
          />
        );
        
      case 3:
        // Replace with your HealthConditions component when available
        return (
          <div className="questionnaire-step">
            <h2>Health Conditions</h2>
            <p>This would be your HealthConditions component</p>
            <div className="form-buttons">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button 
                className="btn-primary" 
                onClick={() => handleStepComplete('healthConditions', { placeholder: 'data' })}
              >
                Complete
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h1>Health Profile Questionnaire</h1>
        <p>Please complete this questionnaire to receive personalized meal recommendations</p>
      </div>
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="step-indicator">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      {renderCurrentStep()}
    </div>
  );
};

export default QuestionnaireContainer;