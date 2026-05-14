import React, { useState } from 'react';
import './App.css';
import { MEAL_OPTIONS, CONSTANTS } from './data/simulationData';
import { useMonteCarlo } from './hooks/useMonteCarlo';
import { normalizeWeights } from './utils/monteCarloUtils';

// Components
import MetricInput from './components/MetricInput';
import StrategyManager from './components/StrategyManager';

function App() {
  // 1. Physical Metrics State
  const [userMetrics, setUserMetrics] = useState({
    startingWeight: CONSTANTS.STARTING_WEIGHT,
    maintenanceCal: CONSTANTS.MAINTENANCE_CAL,
    pizzaProb: 0.02, 
  });

  // 2. Meal Strategy State (Initialized from our data file)
  const [meals, setMeals] = useState(MEAL_OPTIONS);

  // 3. The Logic Engine Hook
  const { results, loading, runSimulation } = useMonteCarlo();

  // 4. Handlers
  const handleStartSim = () => {
    // Run simulation using current state values
    runSimulation({ 
      ...userMetrics, 
      meals: meals 
    });
  };

  const handleMealWeightChange = (category, index, newWeight) => {
    const updatedCategory = [...meals[category]];
    updatedCategory[index].weight = newWeight;
    
    // Normalize ensures the sum of weights is always 1.0 (100%)
    const normalized = normalizeWeights(updatedCategory);
    
    setMeals({
      ...meals,
      [category]: normalized
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Monte Carlo Fitness Odyssey</h1>
        <p>Simulating 100 days of habits for a {userMetrics.startingWeight}kg individual.</p>
      </header>

      <main className="dashboard">
        {/* Left Column: Configuration */}
        <section className="controls">
          <div className="card">
            <h2>1. Physical Parameters</h2>
            <MetricInput 
              label="Current Weight"
              unit="kg"
              min={40}
              max={150}
              value={userMetrics.startingWeight}
              onChange={(val) => setUserMetrics({...userMetrics, startingWeight: val})}
            />

            <MetricInput 
              label="Maintenance Calories"
              unit="kcal"
              min={1200}
              max={4000}
              step={50}
              value={userMetrics.maintenanceCal}
              onChange={(val) => setUserMetrics({...userMetrics, maintenanceCal: val})}
            />

            <MetricInput 
              label="Pizza Night Probability"
              unit="%"
              min={0}
              max={1}
              step={0.01}
              value={userMetrics.pizzaProb}
              onChange={(val) => setUserMetrics({...userMetrics, pizzaProb: val})}
            />
          </div>

          <div className="card">
            <h2>2. Eating Strategy</h2>
            <StrategyManager 
              title="Breakfast"
              options={meals.breakfast}
              onWeightChange={(index, val) => handleMealWeightChange('breakfast', index, val)}
            />
            <StrategyManager 
              title="Lunch/Dinner"
              options={meals.lunch}
              onWeightChange={(index, val) => handleMealWeightChange('lunch', index, val)}
            />
          </div>

          <button 
            className="run-btn" 
            onClick={handleStartSim}
            disabled={loading}
          >
            {loading ? "Simulating..." : "Run 100-Day Simulation"}
          </button>
        </section>

        {/* Right Column: Results */}
        <section className="results-panel">
          {results ? (
            <div className="stats-card">
              <h2>Projected Result</h2>
              <div className="big-stat">
                {results[results.length - 1].weight} <span>kg</span>
              </div>
              <p>Estimated weight after 100 days</p>
              
              {/* This is a placeholder for the Chart we will build next */}
              <div className="chart-placeholder">
                <p>Chart Data Ready: {results.length} data points generated.</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Adjust your habits and click run to see the "Jagged Line" of your future progress.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;