import React, { useState } from 'react';
import './App.css';
import { MEAL_OPTIONS, CONSTANTS } from './data/simulationData';
import { useMonteCarlo } from './hooks/useMonteCarlo';
import { normalizeWeights } from './utils/monteCarloUtils';

// Components
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

  const [meals, setMeals] = useState(MEAL_OPTIONS);

  // 2. Hook
  const { results, loading, runSimulation } = useMonteCarlo();

  // 3. Handlers
  const handleStartSim = () => {
    runSimulation({ 
      ...userMetrics, 
      meals: meals 
    });
  };

  const handleMealWeightChange = (category, index, newWeight) => {
    const updatedCategory = [...meals[category]];
    updatedCategory[index].weight = newWeight;
    const normalized = normalizeWeights(updatedCategory);
    
    setMeals({
      ...meals,
      [category]: normalized
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
            <StrategyManager 
              title="Breakfast"
              options={meals.breakfast}
              onWeightChange={(idx, val) => handleMealWeightChange('breakfast', idx, val)}
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