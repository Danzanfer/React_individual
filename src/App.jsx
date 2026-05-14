import React, { useState } from 'react';
import './App.css';
import { MEAL_OPTIONS, CONSTANTS } from './data/simulationData';
import { useMonteCarlo } from './hooks/useMonteCarlo';

function App() {
  // 1. User Input State
  const [userMetrics, setUserMetrics] = useState({
    startingWeight: CONSTANTS.STARTING_WEIGHT,
    maintenanceCal: CONSTANTS.MAINTENANCE_CAL,
    pizzaProb: 0.02, 
  });

  // 2. The Hook
  const { results, runSimulation } = useMonteCarlo();

  // 3. Action Handler
  const handleStartSim = () => {
    // We pass the metrics and the default meal options for now
    runSimulation({ ...userMetrics, meals: MEAL_OPTIONS });
  };

  return (
    <div className="container">
      <header>
        <h1>Monte Carlo Fitness Odyssey</h1>
        <p>Simulating 100 days of habits for a {userMetrics.startingWeight}kg individual.</p>
      </header>

      <main>
        <section className="controls">
          {/* We will build the actual input components next, 
              but for now, let's just make sure the button works */}
          <button className="run-btn" onClick={handleStartSim}>
            Run 100-Day Simulation
          </button>
        </section>

        <section className="results">
          {results ? (
            <div className="stats-card">
              <h2>Simulation Result</h2>
              <p>Final Weight: <strong>{results[results.length - 1].weight} kg</strong></p>
              <small>Based on 100 simulated days</small>
            </div>
          ) : (
            <p>Adjust your settings and click run to see your potential future.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;