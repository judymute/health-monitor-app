import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInformation from '../BasicInformation/BasicInformation';
import DietaryPreferences from '../DietaryPreferences/DietaryPreferences';
import MedicalConditions from '../MedicalConditions/MedicalConditions';
import './QuestionnaireContainer.css';

const QuestionnaireContainer = ({ onComplete, userData = null }) => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state for form submission
  const [error, setError] = useState(null); // Add error state
  
  // Initialize with userData if provided or use default structure
  const [collectedData, setCollectedData] = useState(userData || {
    basicInformation: {},
    dietaryPreferences: {},
    medicalConditions: {
      diabetes: { selected: false, type: '' },
      inflammatoryBowelDisease: { selected: false, type: '' },
      other: { selected: false, details: '' }
    },
    dietaryGoals: {
      other: { selected: false, details: '' }
    },
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
      // Add code to send data to server
      console.log('Sending data to server:', updatedData);
      
      setIsSubmitting(true); // Set loading state
      setError(null); // Clear any previous errors
      
      fetch('http://localhost:3001/api/updateUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Server responded with an error');
        }
        return response.json();
      })
      .then(result => {
        console.log('Server response:', result);
        setIsSubmitting(false);
        
        if (result.success) {
          // After successful save, generate meal plan
          return fetch('http://localhost:3001/api/generateMealPlan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          throw new Error(result.message || 'Unknown error occurred');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate meal plan');
        }
        return response.json();
      })
      .then(mealPlanResult => {
        console.log('Meal plan generated:', mealPlanResult);
        // Complete the process
        onComplete(updatedData);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error saving data:', error);
        setIsSubmitting(false);
        setError('Error connecting to the server. Please try again later.');
      });
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

  // Steps data for the step indicator
  const steps = [
    { name: "Basic Information", number: 1 },
    { name: "Dietary Preferences", number: 2 },
    { name: "Medical Conditions", number: 3 }
  ];

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <h1 className="questionnaire-title">Health Profile Questionnaire</h1>
          <p className="questionnaire-subtitle">
            Please complete this questionnaire to receive personalized health recommendations
          </p>
        </div>
        
        {/* Step indicator and progress */}
        <div className="steps-section">
          {/* Progress indicator */}
          <div className="progress-container">
            {/* Progress line */}
            <div className="progress-line-bg"></div>
            
            {/* Completed progress line */}
            <div 
              className="progress-line-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
            
            {/* Step circles */}
            {steps.map((step, index) => (
              <div key={index} className="step-container">
                <div 
                  className={`step-circle ${
                    currentStep >= step.number ? 'step-circle-active' : 'step-circle-inactive'
                  }`}
                >
                  {step.number}
                </div>
                <div 
                  className={`step-label ${
                    currentStep === step.number ? 'step-label-active' : 'step-label-inactive'
                  }`}
                >
                  {step.name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Step counter */}
          <div className="step-counter-container">
            <div className="step-counter">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
        
        {/* Current step content */}
        <div className="content-section">
          {isSubmitting ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Saving your data and generating meal plan...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>Try Again</button>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireContainer;