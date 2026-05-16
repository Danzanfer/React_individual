import React, { useState } from 'react';
import './App.css';
import { MEAL_OPTIONS, CONSTANTS } from './data/simulationData';
import { useMonteCarlo } from './hooks/useMonteCarlo';
import { getRandomItem, normalizeWeights } from './utils/monteCarloUtils';

// Components
import MetricInput from './components/MetricInput'; 
import StrategyManager from './components/StrategyManager';
import WeightChart from './components/WeightChart';
import MacroSummary from './components/MacroSummary';

function App() {
  // 1. Local State
  const [userMetrics, setUserMetrics] = useState({
    startingWeight: CONSTANTS.STARTING_WEIGHT,
    maintenanceCal: CONSTANTS.MAINTENANCE_CAL,
    pizzaProb: 0.02, 
  });

  const [meals, setMeals] = useState({
    breakfast: MEAL_OPTIONS.breakfast || [],
    lunch: MEAL_OPTIONS.lunch || [],
    dinner: MEAL_OPTIONS.dinner || MEAL_OPTIONS.lunch
  });

  // Estado para el plan sugerido del día
  const [todayPlan, setTodayPlan] = useState(null);

  // 2. Hook
  const { results, loading, runSimulation } = useMonteCarlo();

  // 3. Handlers
  const handleStartSim = () => {
    runSimulation({ 
      ...userMetrics, 
      meals: {
        breakfast: normalizeWeights(meals.breakfast),
        lunch: normalizeWeights(meals.lunch),
        dinner: normalizeWeights(meals.dinner)
      } 
    });
    // Limpiamos el plan diario al correr una nueva simulación para evitar confusión
    setTodayPlan(null);
  };

  const handleMealWeightChange = (category, index, newValue) => {
    setMeals(prevMeals => {
      const updatedCategory = [...prevMeals[category]];
      updatedCategory[index] = { ...updatedCategory[index], weight: newValue };
      
      return {
        ...prevMeals,
        [category]: updatedCategory 
      };
    });
  };

  // Función para generar la recomendación de hoy según probabilidades elegidas
  const generateTodayPlan = () => {
    const plan = {
      breakfast: getRandomItem(normalizeWeights(meals.breakfast)),
      lunch: getRandomItem(normalizeWeights(meals.lunch)),
      dinner: Math.random() < userMetrics.pizzaProb 
        ? { name: '🍕 Pizza Night!', cal: CONSTANTS.PIZZA_CAL, prot: CONSTANTS.PIZZA_PROT }
        : getRandomItem(normalizeWeights(meals.dinner || meals.lunch))
    };
    setTodayPlan(plan);
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
              title="Breakfast Options"
              options={meals.breakfast}
              onWeightChange={(idx, val) => handleMealWeightChange('breakfast', idx, val)}
            />
            
            <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

            <StrategyManager 
              title="Lunch Options"
              options={meals.lunch}
              onWeightChange={(idx, val) => handleMealWeightChange('lunch', idx, val)}
            />

            <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

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
            <>
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

              {/* NUEVA TARJETA: PLAN DEL DÍA ACCIONABLE */}
              <div className="card" style={{ marginTop: '20px', borderTop: '4px solid #4a90e2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ margin: 0 }}>Today's Action Plan</h2>
                  <button onClick={generateTodayPlan} className="today-btn">
                    {todayPlan ? "Re-roll Menu" : "What should I eat today?"}
                  </button>
                </div>

                {todayPlan ? (
                  <div className="today-grid">
                    <div className="meal-suggestion">
                      <span>BREAKFAST</span>
                      <strong>{todayPlan.breakfast.name}</strong>
                      <small>{todayPlan.breakfast.cal} kcal</small>
                    </div>
                    <div className="meal-suggestion">
                      <span>LUNCH</span>
                      <strong>{todayPlan.lunch.name}</strong>
                      <small>{todayPlan.lunch.cal} kcal</small>
                    </div>
                    <div className="meal-suggestion">
                      <span>DINNER</span>
                      <strong>{todayPlan.dinner.name}</strong>
                      <small>{todayPlan.dinner.cal} kcal</small>
                    </div>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                    Click the button to generate a specific menu based on your settings.
                  </p>
                )}
              </div>
            </>
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