import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInformation from './PersonalInformation';
import DietaryPreferences from './DietaryPreferences';
import './QuestionnaireContainer.css';

const QuestionnaireContainer = ({ onComplete, userData = null }) => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const [collectedData, setCollectedData] = useState(userData || {
    personalInfo: {},
    dietaryPreferences: {},
    healthConditions: {},
  });

  const handleStepComplete = (sectionName, data) => {
    const updatedData = {
      ...collectedData,
      [sectionName]: data
    };
    
    setCollectedData(updatedData);
    
    if (currentStep === totalSteps) {
      onComplete(updatedData);
      navigate('/dashboard');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };
  
  const totalSteps = 3;
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformation 
            onSave={(data) => handleStepComplete('personalInfo', data)}
            prevData={collectedData.personalInfo}
          />
        );
      case 2:
        return (
          <DietaryPreferences 
            onSave={(data) => handleStepComplete('dietaryPreferences', data)} 
            prevData={collectedData.dietaryPreferences}
          />
        );
      case 3:
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
