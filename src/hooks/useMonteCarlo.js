import { useState, useCallback } from 'react';
import { getRandomItem, calculateWeightChange } from '../utils/monteCarloUtils';
import { CONSTANTS } from '../data/simulationData';

export const useMonteCarlo = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = useCallback((config) => {
    setLoading(true);
    
    const { startingWeight, maintenanceCal, pizzaProb, meals } = config;
    
    let currentWeight = parseFloat(startingWeight);
    const totalDays = 100;
    const history = [];

    for (let day = 1; day <= totalDays; day++) {
      let dailyCals = 0;
      let dailyProt = 0;

      // 1. Breakfast
      const breakfast = getRandomItem(meals.breakfast);
      dailyCals += breakfast.cal;
      dailyProt += breakfast.prot;

      // 2. Lunch
      const lunch = getRandomItem(meals.lunch);
      dailyCals += lunch.cal;
      dailyProt += lunch.prot;

      // 3. Dinner (Pizza vs. Normal)
      if (Math.random() < pizzaProb) {
        dailyCals += CONSTANTS.PIZZA_CAL;
        dailyProt += CONSTANTS.PIZZA_PROT;
      } else {
        // Using lunch options as a proxy for dinner
        const dinner = getRandomItem(meals.lunch);
        dailyCals += dinner.cal;
        dailyProt += dinner.prot;
      }

      // 4. Logic: (Intake - Maintenance) / 7700
      const deficit = dailyCals - maintenanceCal;
      const weightChange = calculateWeightChange(deficit);
      currentWeight += weightChange;

      history.push({
        day,
        weight: parseFloat(currentWeight.toFixed(2)),
        dailyCals,
        dailyProt
      });
    }

    setResults(history);
    setLoading(false);
  }, []);

  return { results, loading, runSimulation };
};