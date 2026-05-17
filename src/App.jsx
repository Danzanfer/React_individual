import React, { useState } from 'react';
import './App.css';
import { useMonteCarlo } from './hooks/useMonteCarlo';
import { DEFAULT_SETUP } from './data/simulationData';
import LoginPage from './components/LoginPage';
import SetupPage from './components/SetupPage';
import Dashboard from './components/Dashboard';
import WeightChart from './components/WeightChart';
import ProteinChart from './components/ProteinChart';
import MacroSummary from './components/MacroSummary';
import appIcon from './assets/MCDiet.jpeg';

function App() {
  const [page, setPage] = useState('login');
  const [userEmail, setUserEmail] = useState('');
  const [setupConfig, setSetupConfig] = useState(DEFAULT_SETUP);
  const { results, loading, runSimulation } = useMonteCarlo();

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setPage('setup');
  };

  const handleLogout = () => {
    setUserEmail('');
    setPage('login');
  };

  const handleRunSimulation = () => {
    runSimulation(setupConfig);
    setPage('simulation');
  };

  const handleApproval = () => setPage('dashboard');
  const handleEditInputs = () => setPage('setup');

  if (page === 'login') {
    return <LoginPage onSuccess={handleLoginSuccess} />;
  }

  if (page === 'setup') {
    return (
      <SetupPage
        config={setupConfig}
        onChange={setSetupConfig}
        onRun={handleRunSimulation}
        onLogout={handleLogout}
      />
    );
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        userEmail={userEmail}
        results={results}
        onEditSimulation={handleEditInputs}
        onLogout={handleLogout}
      />
    );
  }

  const finalDay = results?.[results.length - 1];

  return (
    <div className="page-shell simulation-shell">
      <div className="hero-banner dashboard-hero">
        <div className="hero-banner-left">
          <img src={appIcon} alt="Icono de la app" className="hero-icon" />
          <div>
            <h1>Simulación 100 días</h1>
            <p>Revisa cómo la simulación proyecta tu peso y proteína durante 100 días.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Ejecutando la simulación...</p>
        </div>
      ) : results ? (
        <>
          <div className="results-grid">
          <div className="card summary-card summary-row-card">
              <div className="summary-row">
                <div className="summary-stat">
                  <span>Peso final proyectado</span>
                  <strong>{finalDay.weight} kg</strong>
                </div>
                <div className="summary-stat">
                  <span>Proteína promedio</span>
                  <strong>{(results.reduce((acc, day) => acc + day.dailyProt, 0) / results.length).toFixed(0)} g</strong>
                </div>
                <div className="summary-stat">
                  <span>Calorías promedio</span>
                  <strong>{(results.reduce((acc, day) => acc + day.dailyCals, 0) / results.length).toFixed(0)} kcal</strong>
                </div>
              </div>
            </div>

            <div className="card chart-card">
              <WeightChart data={results} />
              <ProteinChart data={results} />
            </div>
          </div>

          <div className="page-actions">
            <button className="run-btn" onClick={handleApproval}>Aprobar y ver recomendaciones</button>
          </div>
          <div className="page-footer">
            <button className="secondary-btn logout-bottom" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>No hay resultados de simulación. Vuelve a configuración para ejecutar el pronóstico.</p>
        </div>
      )}
    </div>
  );
}

export default App;
