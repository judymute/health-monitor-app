import React from 'react';

const MealPlan = ({ recommendations }) => {
  return (
    <div className="card border-0 rounded-4 shadow-sm">
      <div className="card-body p-4">
        <h2>Your Nutrition Plan</h2>
        
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <div key={meal} className="card mb-4 p-3">
            <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
            <h4>{recommendations.dailyPlan[meal].name}</h4>
            <p><strong>Ingredients:</strong> {recommendations.dailyPlan[meal].ingredients.join(', ')}</p>
            <p><strong>Preparation:</strong> {recommendations.dailyPlan[meal].preparation}</p>
          </div>
        ))}

        <h3>Snacks</h3>
        {recommendations.dailyPlan.snacks.map((snack, idx) => (
          <div key={idx} className="card mb-3 p-3">
            <h4>{snack.name}</h4>
            <p><strong>Ingredients:</strong> {snack.ingredients.join(', ')}</p>
            <p><strong>Preparation:</strong> {snack.preparation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
