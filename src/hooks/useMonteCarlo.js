import { useState, useCallback } from 'react';
import { selectMealByTiers, normalizeWeights, calculateWeightChange } from '../utils/monteCarloUtils';
import { MEAL_OPTIONS, CONSTANTS } from '../data/simulationData';

export const useMonteCarlo = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = useCallback((config) => {
    setLoading(true);

    const {
      startingWeight,
      maintenanceCal,
      activeCal,
      guiltyChance,
      mealFrequencies,
    } = config;

    const totalDays = 100;
    let currentWeight = parseFloat(startingWeight);
    const effectiveMaintenance = Number(maintenanceCal) + Number(activeCal);
    const guiltyProbability = Math.min(1, Number(guiltyChance) / 100);
    const history = [];

    for (let day = 1; day <= totalDays; day++) {
      const breakfast = selectMealByTiers(
        MEAL_OPTIONS.breakfast,
        mealFrequencies.breakfast.cal,
        mealFrequencies.breakfast.prot,
      );
      const lunch = selectMealByTiers(
        MEAL_OPTIONS.lunch,
        mealFrequencies.lunch.cal,
        mealFrequencies.lunch.prot,
      );

      const isGuiltyDay = Math.random() < guiltyProbability;
      const dinner = isGuiltyDay
        ? { ...CONSTANTS.GUILTY_DISH, isGuilty: true }
        : { ...selectMealByTiers(
            MEAL_OPTIONS.dinner,
            mealFrequencies.dinner.cal,
            mealFrequencies.dinner.prot,
          ), isGuilty: false };

      const dailyCals = breakfast.cal + lunch.cal + dinner.cal;
      const dailyProt = breakfast.prot + lunch.prot + dinner.prot;
      const netCalories = dailyCals - effectiveMaintenance;
      const weightChange = calculateWeightChange(netCalories);
      currentWeight += weightChange;

      history.push({
        day,
        weight: parseFloat(currentWeight.toFixed(2)),
        dailyCals,
        dailyProt,
        breakfast,
        lunch,
        dinner,
        isGuilty: isGuiltyDay,
      });
    }

    setResults(history);
    setLoading(false);
  }, []);

  return { results, loading, runSimulation };
};
