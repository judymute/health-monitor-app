import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInformation from './BasicInformation';
import DietaryPreferences from './DietaryPreferences';
import MedicalConditions from './MedicalConditions';
// No need for custom CSS file when using Bootstrap

const QuestionnaireContainer = ({ onComplete, userData = null }) => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const [collectedData, setCollectedData] = useState(userData || {
    basicInformation: {},
    dietaryPreferences: {},
    medicalConditions: {},
    dietaryGoals: {},
    lifestyleInformation: {},
    mealPreferences: {}
  });

  const handleStepComplete = (sectionName, data) => {
    let updatedData = { ...collectedData };
    
    if (sectionName === 'combined') {
      // For the medical conditions step, we need to split the data
      updatedData = {
        ...updatedData,
        medicalConditions: data.medicalConditions,
        dietaryGoals: data.dietaryGoals
      };
    } else {
      updatedData = {
        ...updatedData,
        [sectionName]: data
      };
    }
    
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
  
  // In this version, we're implementing just the first 3 steps from the questionnaire
  const totalSteps = 3;
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformation 
            onSave={(data) => handleStepComplete('basicInformation', data)}
            prevData={collectedData.basicInformation}
            onPrevious={null} // First step doesn't have a previous button
          />
        );
      case 2:
        return (
          <DietaryPreferences 
            onSave={(data) => handleStepComplete('dietaryPreferences', data)} 
            prevData={collectedData.dietaryPreferences}
            onPrevious={handlePrevStep}
          />
        );
      case 3:
        // For the medical conditions step, we need to combine both medical conditions and dietary goals
        return (
          <MedicalConditions 
            onSave={(data) => {
              // Split the data into the separate sections for the JSON structure
              const { medicalConditions, dietaryGoals } = data;
              
              handleStepComplete('combined', { 
                medicalConditions, 
                dietaryGoals 
              });
            }}
            prevData={{
              medicalConditions: collectedData.medicalConditions,
              dietaryGoals: collectedData.dietaryGoals
            }}
            onPrevious={handlePrevStep}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h1 className="display-6 mb-2">Health Profile Questionnaire</h1>
              <p className="lead mb-0">Please complete this questionnaire to receive personalized meal recommendations</p>
            </div>
            
            <div className="card-body p-0">
              {/* Progress bar */}
              <div className="px-4 pt-4">
                <div className="mb-3">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${progressPercentage}%` }}
                      aria-valuenow={progressPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-end mt-1">
                    <span className="badge bg-secondary">Step {currentStep} of {totalSteps}</span>
                  </div>
                </div>
              </div>
              
              {/* Current step */}
              <div className="px-4 pb-4">
                {renderCurrentStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContainer;