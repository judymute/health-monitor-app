import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Check, Copy, Printer } from 'lucide-react';

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
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            ul { list-style-type: none; padding: 0; }
            li { padding: 8px; border-bottom: 1px solid #eee; }
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
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Shopping List</span>
          <span className="text-sm font-normal text-gray-500">
            {checkedItemsCount}/{totalItems} items
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCheckAll}
            className="text-xs"
          >
            Check All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="text-xs ml-auto"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={printList}
            className="text-xs"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedIngredients).map(([meal, mealIngredients]) => (
            <div key={meal} className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{meal}</h3>
              <div className="space-y-2">
                {mealIngredients.map(ingredient => (
                  <div 
                    key={ingredient.id}
                    className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-50"
                  >
                    <Checkbox 
                      id={ingredient.id}
                      checked={checkedItems[ingredient.id] || false}
                      onCheckedChange={() => handleCheckboxChange(ingredient.id)}
                    />
                    <label 
                      htmlFor={ingredient.id}
                      className={`text-sm cursor-pointer flex-1 ${checkedItems[ingredient.id] ? 'line-through text-gray-400' : ''}`}
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
          <div className="text-center py-8 text-gray-500">
            No ingredients found in meal plan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingList;