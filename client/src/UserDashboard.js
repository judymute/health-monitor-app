import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from './cutecowprofile.png';

const UserDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [activeDay, setActiveDay] = useState(new Date().getDate());

  // Color palette based on the pastel purple theme
  const colors = {
   primary: '#2ECC71',    // Main green color
    secondary: '#27AE60',  // Darker green
    light: '#E8F8F5',      // Very light green
    accent1: '#D5F5E3',    // Soft light green
    accent2: '#A2DED0',    // Soft mint
    text: '#2C3E50',       // Dark blue/green for text
    success: '#58D68D',    // Bright green for success indicators
    warning: '#F4D03F',    // Soft yellow for warnings
    danger: '#E74C3C'      // Soft red for danger/avoid
  };

  useEffect(() => {
    // Check if we have user data
    if (!userData) {
      navigate('/questionnaire');
      return;
    }

    // Function to fetch recommendations
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        console.log('Fetching meal plan recommendations...');
        
        // Call the backend API to generate meal plan
        const response = await fetch('http://localhost:3001/api/generateMealPlan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        // Log the status code to help diagnose issues
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate meal plan');
        }
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to generate meal plan');
        }
        
        setRecommendations(data.mealPlan);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(`Failed to load your recommendations: ${err.message}`);
        setErrorDetails(err.stack || "No additional details available");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userData, navigate]);

  // Function to handle questionnaire retake
  const handleRetakeQuestionnaire = () => {
    navigate('/questionnaire');
  };

  // Function to manually refresh recommendations
  const handleRefreshRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generateMealPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate meal plan');
      }
      
      setRecommendations(data.mealPlan);
      setLoading(false);
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      setError(`Failed to refresh your recommendations: ${err.message}`);
      setLoading(false);
    }
  };

  // Generate day selector for the week
  const renderDaySelector = () => {
    const days = [];
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    
    // Show a week of days (current day and 6 days ahead)
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDay + i);
      const dayNum = date.getDate();
      
      days.push(
        <div 
          key={i} 
          className={`day-selector ${activeDay === dayNum ? 'active' : ''}`}
          onClick={() => setActiveDay(dayNum)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: activeDay === dayNum ? colors.primary : colors.light,
            color: activeDay === dayNum ? 'white' : colors.text,
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: activeDay === dayNum ? '0 4px 8px rgba(139, 128, 249, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {dayNum}
        </div>
      );
    }
    
    return (
      <div className="d-flex gap-2 mb-4 justify-content-center">
        {days}
      </div>
    );
  };

  // If we're loading
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div 
          className="card border-0 rounded-4 shadow-sm"
          style={{ background: colors.light }}
        >
          <div className="card-body p-5">
            <h2 className="mb-4" style={{ color: colors.text }}>Preparing your nutrition plan...</h2>
            <div className="spinner-border" role="status" style={{ color: colors.primary, width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-4" style={{ color: colors.text }}>
              This may take a few moments as we analyze your health profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="container my-5">
        <div 
          className="card border-0 rounded-4 shadow-sm"
          style={{ background: colors.light }}
        >
          <div className="card-header rounded-top-4 border-0 p-4" style={{ background: colors.danger, color: 'white' }}>
            <h2 className="mb-0">Something went wrong</h2>
          </div>
          <div className="card-body p-4">
            <div className="alert" role="alert" style={{ background: 'rgba(255, 107, 107, 0.1)', color: colors.danger, border: 'none' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            {errorDetails && (
              <div className="accordion mt-3" id="errorAccordion">
                <div className="accordion-item border-0 rounded-3" style={{ background: colors.light }}>
                  <h2 className="accordion-header" id="headingOne">
                    <button 
                      className="accordion-button collapsed rounded-3" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseOne" 
                      aria-expanded="false" 
                      aria-controls="collapseOne"
                      style={{ background: 'rgba(255, 107, 107, 0.05)', color: colors.text }}
                    >
                      Technical Details
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#errorAccordion">
                    <div className="accordion-body">
                      <pre className="p-3 rounded-3" style={{ background: 'rgba(255, 107, 107, 0.05)' }}>{errorDetails}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button 
                className="btn px-4 py-2 rounded-pill" 
                onClick={handleRetakeQuestionnaire}
                style={{ background: colors.primary, color: 'white', border: 'none', boxShadow: '0 4px 8px rgba(139, 128, 249, 0.3)' }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Retake Questionnaire
              </button>
              <button 
                className="btn px-4 py-2 rounded-pill" 
                onClick={handleRefreshRecommendations}
                style={{ background: 'white', color: colors.primary, border: `1px solid ${colors.primary}` }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there are no recommendations
  if (!recommendations) {
    return (
      <div className="container my-5 text-center">
        <div 
          className="card border-0 rounded-4 shadow-sm"
          style={{ background: colors.light }}
        >
          <div className="card-body p-5">
            <h2 className="mb-4" style={{ color: colors.text }}>No recommendations available</h2>
            <p className="text-muted mb-4">Please complete the health questionnaire to receive personalized recommendations.</p>
            <button 
              className="btn px-4 py-2 rounded-pill" 
              onClick={handleRetakeQuestionnaire}
              style={{ background: colors.primary, color: 'white', border: 'none', boxShadow: '0 4px 8px rgba(139, 128, 249, 0.3)' }}
            >
              Take Questionnaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard with recommendations
  return (
    <div className="container-fluid py-4" style={{ background: 'rgba(234, 230, 255, 0.3)' }}>
      <div className="container">
        {/* User Profile Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div 
              className="card border-0 rounded-4 shadow-sm"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-center">
                  {/* Profile Picture */}
                  <div className="me-4 mb-3 mb-md-0">
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `3px solid ${colors.primary}`,
                        boxShadow: '0 4px 10px rgba(139, 128, 249, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: colors.light
                      }}
                    >
 <img src={avatarImage} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="flex-grow-1">
                    <h2 
                      style={{ 
                        color: colors.text, 
                        fontSize: '1.8rem',
                        marginBottom: '0.5rem' 
                      }}
                    >
                      {userData?.basicInformation?.fullName || "User"}
                    </h2>
                    
                    <div className="row mt-3">
                      <div className="col-md-6 col-lg-3 mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ 
                              width: '28px',
                              height: '28px',
                              background: colors.light,
                              color: colors.primary
                            }}
                          >
                            <i className="bi bi-calendar3"></i>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Age</span>
                            <p style={{ margin: 0, fontWeight: '500' }}>{userData?.basicInformation?.age || "-"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 col-lg-3 mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ 
                              width: '28px',
                              height: '28px',
                              background: colors.light,
                              color: colors.primary
                            }}
                          >
                            <i className="bi bi-rulers"></i>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Height</span>
                            <p style={{ margin: 0, fontWeight: '500' }}>
                              {userData?.basicInformation?.height?.value || "-"} {userData?.basicInformation?.height?.unit || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 col-lg-3 mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ 
                              width: '28px',
                              height: '28px',
                              background: colors.light,
                              color: colors.primary
                            }}
                          >
                            <i className="bi bi-speedometer"></i>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Weight</span>
                            <p style={{ margin: 0, fontWeight: '500' }}>
                              {userData?.basicInformation?.weight?.value || "-"} {userData?.basicInformation?.weight?.unit || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 col-lg-3 mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ 
                              width: '28px',
                              height: '28px',
                              background: colors.light,
                              color: colors.primary
                            }}
                          >
                            <i className="bi bi-droplet"></i>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', color: colors.text, opacity: 0.7 }}>Blood Type</span>
                            <p style={{ margin: 0, fontWeight: '500' }}>{userData?.basicInformation?.bloodType || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Profile Button */}
                  <div className="ms-md-auto mt-3 mt-md-0">
                    <button 
                      className="btn px-3 py-2 rounded-pill" 
                      onClick={handleRetakeQuestionnaire}
                      style={{ 
                        background: 'white', 
                        color: colors.primary, 
                        border: `1px solid ${colors.primary}`,
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div 
              className="card border-0 rounded-4 shadow-sm"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h1 style={{ color: colors.text, fontSize: '1.8rem' }}>Your Nutrition Plan</h1>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn px-3 py-2 rounded-pill" 
                      onClick={handleRetakeQuestionnaire}
                      style={{ 
                        background: 'white', 
                        color: colors.text, 
                        border: `1px solid ${colors.light}`,
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Update Profile
                    </button>
                    <button 
                      className="btn px-3 py-2 rounded-pill" 
                      onClick={handleRefreshRecommendations}
                      style={{ 
                        background: colors.primary, 
                        color: 'white', 
                        border: 'none',
                        boxShadow: '0 4px 8px rgba(139, 128, 249, 0.3)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Refresh Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div 
              className="card border-0 rounded-4 shadow-sm mb-4"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <h2 style={{ color: colors.text, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Today's Meal Plan</h2>
                
                {/* Breakfast */}
                <div 
                  className="card mb-4 border-0 rounded-4"
                  style={{ background: colors.light }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: colors.secondary,
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-sunrise fs-5"></i>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: colors.text, margin: 0 }}>Breakfast</h3>
                    </div>
                    
                    <h4 style={{ color: colors.primary, fontSize: '1.2rem', marginBottom: '1rem' }}>
                      {recommendations.dailyPlan.breakfast.name}
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Ingredients</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.breakfast.ingredients.map((ingredient, idx) => (
                            <li 
                              key={idx} 
                              className="list-group-item px-0 py-1"
                              style={{ background: 'transparent', border: 'none' }}
                            >
                              <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Preparation</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.breakfast.preparation.split('. ').map((step, idx) => (
                            step.trim() && (
                              <li 
                                key={idx} 
                                className="list-group-item px-0 py-1"
                                style={{ background: 'transparent', border: 'none' }}
                              >
                                <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                                {step}.
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div 
                      className="mt-3 p-3 rounded-3"
                      style={{ background: 'white' }}
                    >
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Benefits:</strong> {recommendations.dailyPlan.breakfast.nutritionalBenefits}
                      </p>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Notes:</strong> {recommendations.dailyPlan.breakfast.healthNotes}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Lunch */}
                <div 
                  className="card mb-4 border-0 rounded-4"
                  style={{ background: colors.light }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: colors.secondary,
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-sun fs-5"></i>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: colors.text, margin: 0 }}>Lunch</h3>
                    </div>
                    
                    <h4 style={{ color: colors.primary, fontSize: '1.2rem', marginBottom: '1rem' }}>
                      {recommendations.dailyPlan.lunch.name}
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Ingredients</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.lunch.ingredients.map((ingredient, idx) => (
                            <li 
                              key={idx} 
                              className="list-group-item px-0 py-1"
                              style={{ background: 'transparent', border: 'none' }}
                            >
                              <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Preparation</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.lunch.preparation.split('. ').map((step, idx) => (
                            step.trim() && (
                              <li 
                                key={idx} 
                                className="list-group-item px-0 py-1"
                                style={{ background: 'transparent', border: 'none' }}
                              >
                                <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                                {step}.
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div 
                      className="mt-3 p-3 rounded-3"
                      style={{ background: 'white' }}
                    >
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Benefits:</strong> {recommendations.dailyPlan.lunch.nutritionalBenefits}
                      </p>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Notes:</strong> {recommendations.dailyPlan.lunch.healthNotes}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Dinner */}
                <div 
                  className="card mb-4 border-0 rounded-4"
                  style={{ background: colors.light }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: colors.secondary,
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-moon fs-5"></i>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: colors.text, margin: 0 }}>Dinner</h3>
                    </div>
                    
                    <h4 style={{ color: colors.primary, fontSize: '1.2rem', marginBottom: '1rem' }}>
                      {recommendations.dailyPlan.dinner.name}
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Ingredients</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.dinner.ingredients.map((ingredient, idx) => (
                            <li 
                              key={idx} 
                              className="list-group-item px-0 py-1"
                              style={{ background: 'transparent', border: 'none' }}
                            >
                              <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1rem', color: colors.text }}>Preparation</h5>
                        <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                          {recommendations.dailyPlan.dinner.preparation.split('. ').map((step, idx) => (
                            step.trim() && (
                              <li 
                                key={idx} 
                                className="list-group-item px-0 py-1"
                                style={{ background: 'transparent', border: 'none' }}
                              >
                                <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                                {step}.
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div 
                      className="mt-3 p-3 rounded-3"
                      style={{ background: 'white' }}
                    >
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Benefits:</strong> {recommendations.dailyPlan.dinner.nutritionalBenefits}
                      </p>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: colors.primary }}>Notes:</strong> {recommendations.dailyPlan.dinner.healthNotes}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Snacks */}
                <div 
                  className="card border-0 rounded-4"
                  style={{ background: colors.light }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: colors.secondary,
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-apple fs-5"></i>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: colors.text, margin: 0 }}>Snacks</h3>
                    </div>
                    
                    
                    {recommendations.dailyPlan.snacks.map((snack, idx) => (
                      <div 
                        key={idx}
                        className="card mb-3 border-0 rounded-3"
                        style={{ background: 'white' }}
                      >
                        <div className="card-body p-3">
                          <h4 style={{ color: colors.primary, fontSize: '1.1rem', marginBottom: '0.8rem' }}>
                            {snack.name}
                          </h4>
                          
                          <div className="row">
                            <div className="col-md-6 mb-2 mb-md-0">
                              <h5 style={{ fontSize: '0.9rem', color: colors.text }}>Ingredients</h5>
                              <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                                {snack.ingredients.map((ingredient, ingredientIdx) => (
                                  <li 
                                    key={ingredientIdx} 
                                    className="list-group-item px-0 py-1"
                                    style={{ background: 'transparent', border: 'none', fontSize: '0.9rem' }}
                                  >
                                    <i className="bi bi-check2-circle me-2" style={{ color: colors.primary }}></i>
                                    {ingredient}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <h5 style={{ fontSize: '0.9rem', color: colors.text }}>Preparation</h5>
                              <p style={{ fontSize: '0.9rem' }}>{snack.preparation}</p>
                            </div>
                          </div>
                          
                          <div 
                            className="mt-2 p-2 rounded-3"
                            style={{ background: colors.light, fontSize: '0.85rem' }}
                          >
                            <p className="mb-1">
                              <strong style={{ color: colors.primary }}>Benefits:</strong> {snack.nutritionalBenefits}
                            </p>
                            <p className="mb-0">
                              <strong style={{ color: colors.primary }}>Notes:</strong> {snack.healthNotes}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Nutritional Focus */}
            <div 
              className="card border-0 rounded-4 shadow-sm mb-4"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <h3 style={{ color: colors.text, fontSize: '1.3rem', marginBottom: '1rem' }}>Nutritional Focus</h3>
                
                {recommendations.nutritionalFocus.map((item, idx) => (
                  <div 
                    key={idx}
                    className="card mb-3 border-0 rounded-3"
                    style={{ background: colors.light }}
                  >
                    <div className="card-body p-3">
                      <h4 style={{ color: colors.primary, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {item.nutrient}
                      </h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>{item.reason}</p>
                      
                      <h5 style={{ fontSize: '0.9rem', color: colors.text }}>Top Sources:</h5>
                      <ul className="list-group list-group-flush" style={{ background: 'transparent' }}>
                        {item.sources.map((source, sourceIdx) => (
                          <li 
                            key={sourceIdx} 
                            className="list-group-item px-0 py-1"
                            style={{ background: 'transparent', border: 'none', fontSize: '0.9rem' }}
                          >
                            <i className="bi bi-circle-fill me-2" style={{ color: colors.primary, fontSize: '0.5rem' }}></i>
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods to Limit */}
            <div 
              className="card border-0 rounded-4 shadow-sm mb-4"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <h3 style={{ color: colors.text, fontSize: '1.3rem', marginBottom: '1rem' }}>Foods to Limit</h3>
                
                {recommendations.avoidList.map((item, idx) => (
                  <div 
                    key={idx}
                    className="card mb-3 border-0 rounded-3"
                    style={{ background: colors.light }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-exclamation-circle me-2" style={{ color: colors.danger }}></i>
                        <h5 style={{ color: colors.danger, fontSize: '1rem', margin: 0 }}>{item.food}</h5>
                      </div>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Habit Tips */}
            <div 
              className="card border-0 rounded-4 shadow-sm"
              style={{ background: 'white' }}
            >
              <div className="card-body p-4">
                <h3 style={{ color: colors.text, fontSize: '1.3rem', marginBottom: '1rem' }}>Weekly Habit Tips</h3>
                
                <div 
                  className="card border-0 rounded-3"
                  style={{ background: colors.light }}
                >
                  <div className="card-body p-3">
                    <ul className="list-group list-group-flush mb-0" style={{ background: 'transparent' }}>
                      {recommendations.weeklyHabitTips.map((tip, idx) => (
                        <li 
                          key={idx}
                          className="list-group-item d-flex align-items-start px-0 py-2"
                          style={{ background: 'transparent', border: 'none' }}
                        >
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0" 
                            style={{ 
                              width: '22px', 
                              height: '22px',
                              background: colors.success,
                              color: 'white',
                              marginTop: '2px'
                            }}
                          >
                            <i className="bi bi-check" style={{ fontSize: '0.8rem' }}></i>
                          </div>
                          <p style={{ fontSize: '0.9rem', margin: 0 }}>{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;