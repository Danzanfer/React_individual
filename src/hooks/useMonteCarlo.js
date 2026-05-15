import { useState, useCallback } from 'react';
import { getRandomItem, calculateWeightChange } from '../utils/monteCarloUtils';
import { CONSTANTS } from '../data/simulationData';

export const useMonteCarlo = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = useCallback((config) => {
    setLoading(true);
    
    // Traemos de forma segura los datos de la interfaz
    const { startingWeight, maintenanceCal, pizzaProb, meals } = config;
    
    let currentWeight = parseFloat(startingWeight);
    const totalDays = 100;
    const history = [];

    for (let day = 1; day <= totalDays; day++) {
      let dailyCals = 0;
      let dailyProt = 0;

      // 1. Desayuno (Usa las opciones de breakfast de la interfaz)
      if (meals?.breakfast && meals.breakfast.length > 0) {
        const breakfast = getRandomItem(meals.breakfast);
        dailyCals += breakfast.cal;
        dailyProt += breakfast.prot;
      }

      // 2. Almuerzo (Usa las opciones de lunch de la interfaz)
      if (meals?.lunch && meals.lunch.length > 0) {
        const lunch = getRandomItem(meals.lunch);
        dailyCals += lunch.cal;
        dailyProt += lunch.prot;
      }

      // 3. Cena (Lógica de Pizza vs Comida Normal)
      if (Math.random() < pizzaProb) {
        dailyCals += CONSTANTS.PIZZA_CAL;
        dailyProt += CONSTANTS.PIZZA_PROT;
      } else {
        // Si tu objeto "meals" tiene "dinner", usa meals.dinner. Si no, usa meals.lunch
        const dinnerOptions = meals?.dinner || meals?.lunch || [];
        if (dinnerOptions.length > 0) {
          const dinner = getRandomItem(dinnerOptions);
          dailyCals += dinner.cal;
          dailyProt += dinner.prot;
        }
      }

      // 4. Lógica de Peso: (Calorías Consumidas - Calorías Gastadas)
      // Si consumes 3000 y gastas 2600, netCalories es +400 (Superávit)
      const netCalories = dailyCals - maintenanceCal; 
      
      // calculateWeightChange devolverá un valor positivo si hay superávit y negativo si hay déficit
      const weightChange = calculateWeightChange(netCalories);
      currentWeight += weightChange;

      // Guardamos el día en el historial
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