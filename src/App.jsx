import React, { useState } from 'react';
import './App.css';
import { MEAL_OPTIONS, CONSTANTS } from './data/simulationData';
import { useMonteCarlo } from './hooks/useMonteCarlo';
import { normalizeWeights } from './utils/monteCarloUtils';

// Components
// Fíjate que no hace falta poner .jsx al final, Vite lo busca solo
import MetricInput from './components/MetricInput'; 
import StrategyManager from './components/StrategyManager';
import WeightChart from './components/WeightChart';
import MacroSummary from './components/MacroSummary';

function App() {
  // 1. Local State
 

  const [userMetrics, setUserMetrics] = useState({
    startingWeight: CONSTANTS.STARTING_WEIGHT, // Now 78
    maintenanceCal: CONSTANTS.MAINTENANCE_CAL, // Now 2600
    pizzaProb: 0.02, 
  });

  // CORREGIDO AQUÍ: Cambiado 'initialMeals' por 'MEAL_OPTIONS'
  const [meals, setMeals] = useState({
    breakfast: MEAL_OPTIONS.breakfast || [],
    lunch: MEAL_OPTIONS.lunch || [],
    dinner: MEAL_OPTIONS.dinner || MEAL_OPTIONS.lunch 
  });

  // 2. Hook
  const { results, loading, runSimulation } = useMonteCarlo();

  // 3. Handlers
  const handleStartSim = () => {
    runSimulation({ 
      ...userMetrics, 
      meals: meals 
    });
  };

  const handleMealWeightChange = (category, index, newValue) => {
    setMeals(prevMeals => {
      const updatedCategory = [...prevMeals[category]];
      updatedCategory[index] = { ...updatedCategory[index], weight: newValue };
      
      return {
        ...prevMeals,
        [category]: updatedCategory // Esto actualiza dinámicamente 'breakfast', 'lunch' o 'dinner'
      };
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Monte Carlo Fitness Sim</h1>
        <p>Projecting 100 days of habits starting at {userMetrics.startingWeight}kg</p>
      </header>

      <main className="dashboard">
        <section className="controls">
          <div className="card">
            <h2>User Inputs</h2>
            <MetricInput 
              label="Starting Weight"
              unit="kg"
              min={40} max={150}
              value={userMetrics.startingWeight}
              onChange={(val) => setUserMetrics({...userMetrics, startingWeight: val})}
            />
            <MetricInput 
              label="Maintenance"
              unit="kcal"
              min={1500} max={4000} step={50}
              value={userMetrics.maintenanceCal}
              onChange={(val) => setUserMetrics({...userMetrics, maintenanceCal: val})}
            />
            <MetricInput 
              label="Pizza Probability"
              unit="%"
              min={0} max={1} step={0.01}
              value={userMetrics.pizzaProb}
              onChange={(val) => setUserMetrics({...userMetrics, pizzaProb: val})}
            />
          </div>

          <div className="card">
            <h2>Habit Weights</h2>
            
            {/* 1. PANEL DE DESAYUNO */}
            <StrategyManager 
              title="Breakfast Options"
              options={meals.breakfast}
              onWeightChange={(idx, val) => handleMealWeightChange('breakfast', idx, val)}
            />
            
            <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

            {/* 2. PANEL DE ALMUERZO */}
            <StrategyManager 
              title="Lunch Options"
              options={meals.lunch}
              onWeightChange={(idx, val) => handleMealWeightChange('lunch', idx, val)}
            />

            <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

            {/* 3. PANEL DE CENA */}
            <StrategyManager 
              title="Dinner Options"
              options={meals.dinner}
              onWeightChange={(idx, val) => handleMealWeightChange('dinner', idx, val)}
            />
          </div>

          <button className="run-btn" onClick={handleStartSim} disabled={loading}>
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </section>

        <section className="results-panel">
          {results ? (
            <div className="stats-card">
              <div className="result-header">
                <div className="big-stat">
                  <label>Final Weight</label>
                  <strong>{results[results.length - 1].weight} kg</strong>
                </div>
                <MacroSummary results={results} />
              </div>
              
              <WeightChart data={results} />
            </div>
          ) : (
            <div className="empty-state">
              <p>Configure your habits and click run.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;