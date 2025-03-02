import React, { useState, useEffect } from 'react';
import './ShoppingList.css';

const ShoppingList = ({ mealPlan }) => {
  const [ingredients, setIngredients] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  
  useEffect(() => {
    if (mealPlan && mealPlan.dailyPlan) {
      // Extract and consolidate ingredients from all meals
      const allIngredients = extractIngredients(mealPlan.dailyPlan);
      setIngredients(allIngredients);
      
      // Initialize checked state for all ingredients
      const initialCheckedState = {};
      allIngredients.forEach(item => {
        initialCheckedState[item.id] = false;
      });
      setCheckedItems(initialCheckedState);
    }
  }, [mealPlan]);
  
  // Extract ingredients from meal plan
  const extractIngredients = (dailyPlan) => {
    const ingredientsList = [];
    let idCounter = 0;
    
    // Process breakfast
    if (dailyPlan.breakfast && dailyPlan.breakfast.ingredients) {
      dailyPlan.breakfast.ingredients.forEach(ingredient => {
        ingredientsList.push({
          id: `ingredient-${idCounter++}`,
          name: ingredient,
          meal: 'Breakfast'
        });
      });
    }
    
    // Process lunch
    if (dailyPlan.lunch && dailyPlan.lunch.ingredients) {
      dailyPlan.lunch.ingredients.forEach(ingredient => {
        ingredientsList.push({
          id: `ingredient-${idCounter++}`,
          name: ingredient,
          meal: 'Lunch'
        });
      });
    }
    
    // Process dinner
    if (dailyPlan.dinner && dailyPlan.dinner.ingredients) {
      dailyPlan.dinner.ingredients.forEach(ingredient => {
        ingredientsList.push({
          id: `ingredient-${idCounter++}`,
          name: ingredient,
          meal: 'Dinner'
        });
      });
    }
    
    // Process snacks
    if (dailyPlan.snacks && dailyPlan.snacks.length > 0) {
      dailyPlan.snacks.forEach((snack, snackIndex) => {
        if (snack.ingredients) {
          snack.ingredients.forEach(ingredient => {
            ingredientsList.push({
              id: `ingredient-${idCounter++}`,
              name: ingredient,
              meal: `Snack ${snackIndex + 1}`
            });
          });
        }
      });
    }
    
    return ingredientsList;
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Handle clearing all checkboxes
  const handleClearAll = () => {
    const clearedState = {};
    Object.keys(checkedItems).forEach(key => {
      clearedState[key] = false;
    });
    setCheckedItems(clearedState);
  };
  
  // Handle checking all checkboxes
  const handleCheckAll = () => {
    const checkedState = {};
    Object.keys(checkedItems).forEach(key => {
      checkedState[key] = true;
    });
    setCheckedItems(checkedState);
  };
  
  // Copy shopping list to clipboard
  const copyToClipboard = () => {
    const uncheckedItems = ingredients
      .filter(item => !checkedItems[item.id])
      .map(item => item.name)
      .join('\n');
    
    navigator.clipboard.writeText(uncheckedItems)
      .then(() => {
        alert('Shopping list copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  // Print shopping list
  const printList = () => {
    const printWindow = window.open('', '_blank');
    const uncheckedItems = ingredients
      .filter(item => !checkedItems[item.id])
      .map(item => item.name);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Shopping List</title>
          <style>
            body { font-family: "SF Pro Display", "Helvetica Neue", sans-serif; padding: 20px; background-color: #f7fcf7; }
            h1 { text-align: center; color: #2e7d32; }
            ul { list-style-type: none; padding: 0; }
            li { padding: 12px; border-bottom: 1px solid #e8f5e9; font-size: 16px; color: #2e7d32; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Shopping List</h1>
          <ul>
            ${uncheckedItems.map(item => `<li>□ ${item}</li>`).join('')}
          </ul>
          <button onClick="window.print()">Print</button>
        </body>
      </html>
    `);
  };
  
  // Group ingredients by meal
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.meal]) {
      acc[ingredient.meal] = [];
    }
    acc[ingredient.meal].push(ingredient);
    return acc;
  }, {});
  
  // Count total and checked items
  const totalItems = ingredients.length;
  const checkedItemsCount = Object.values(checkedItems).filter(Boolean).length;
  
  return (
    <div className="shopping-list-card">
      <div className="shopping-list-header">
        <h2 className="shopping-list-title">
          Shopping List
          <span className="shopping-list-counter">
            {checkedItemsCount}/{totalItems} items
          </span>
        </h2>
      </div>
      <div className="shopping-list-content">
        <div className="shopping-list-actions">
          <button 
            className="shopping-list-button"
            onClick={handleClearAll}
          >
            Clear All
          </button>
          <button 
            className="shopping-list-button"
            onClick={handleCheckAll}
          >
            Check All
          </button>
          <button 
            className="shopping-list-button shopping-list-button-right"
            onClick={copyToClipboard}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shopping-list-icon">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
          <button 
            className="shopping-list-button"
            onClick={printList}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shopping-list-icon">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print
          </button>
        </div>
        
        <div className="shopping-list-items-container">
          {Object.entries(groupedIngredients).map(([meal, mealIngredients]) => (
            <div key={meal} className="shopping-list-meal-group">
              <h3 className="shopping-list-meal-title">{meal}</h3>
              <div className="shopping-list-meal-items">
                {mealIngredients.map(ingredient => (
                  <div 
                    key={ingredient.id}
                    className="shopping-list-item"
                  >
                    <div className="custom-checkbox-container">
                      <input 
                        type="checkbox"
                        id={ingredient.id}
                        checked={checkedItems[ingredient.id] || false}
                        onChange={() => handleCheckboxChange(ingredient.id)}
                        className="shopping-list-checkbox"
                      />
                      <span className="custom-checkbox"></span>
                    </div>
                    <label 
                      htmlFor={ingredient.id}
                      className={`shopping-list-label ${checkedItems[ingredient.id] ? 'shopping-list-checked' : ''}`}
                    >
                      {ingredient.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {ingredients.length === 0 && (
          <div className="shopping-list-empty">
            <div className="empty-state-icon">🌱</div>
            <div>No ingredients found in meal plan</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;