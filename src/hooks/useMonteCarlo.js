import { useState, useCallback } from 'react';
import { getRandomItem, calculateWeightChange } from '../utils/monteCarloUtils';
import { CONSTANTS } from '../data/simulationData';

export const useMonteCarlo = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = useCallback((config) => {
    setLoading(true);
    
    // We wrap the logic in a small timeout or use direct execution
    // In a real 10,000 iteration sim, this keeps the UI responsive
    const { startingWeight, maintenanceCal, pizzaProb, meals } = config;
    
    let currentWeight = parseFloat(startingWeight);
    const totalDays = 100;
    const history = [];

    for (let day = 1; day <= totalDays; day++) {
      let dailyCals = 0;

      // 1. Roll for Breakfast
      const breakfast = getRandomItem(meals.breakfast);
      dailyCals += breakfast.cal;

      // 2. Roll for Lunch
      const lunch = getRandomItem(meals.lunch);
      dailyCals += lunch.cal;

      // 3. The "Pizza" Logic (The Spike)
      // If Math.random() is less than the probability (e.g. 0.02), it's a pizza night
      if (Math.random() < pizzaProb) {
        dailyCals += CONSTANTS.PIZZA_CAL; 
      } else {
        // Normal Dinner (we'll use lunch options as a proxy for dinner variety)
        const dinner = getRandomItem(meals.lunch);
        dailyCals += dinner.cal;
      }

      // 4. Calculate Metric Weight Change
      // (Daily Intake - Maintenance) / 7700
      const deficit = dailyCals - maintenanceCal;
      const weightChange = calculateWeightChange(deficit);
      
      currentWeight += weightChange;

      // Store this "Universe's" day in the history array
      history.push({
        day,
        weight: currentWeight.toFixed(2),
        dailyCals
      });
    }

    setResults(history);
    setLoading(false);
  }, []);

  return { results, loading, runSimulation };
};