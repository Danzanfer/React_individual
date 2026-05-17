import { useEffect, useState } from 'react';
import appIcon from '../assets/MCDiet.jpeg';

const tierNames = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const Dashboard = ({ userEmail, results, onEditSimulation, onLogout }) => {
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    if (!recommendation && results && results.length > 0) {
      setRecommendation(results[0]);
    }
  }, [results, recommendation]);

  const generateDailyRecommendation = () => {
    if (!results || results.length === 0) return;
    const randomDay = results[Math.floor(Math.random() * results.length)];
    setRecommendation(randomDay);
  };

  return (
    <div className="page-shell dashboard-shell">
      <div className="hero-banner dashboard-hero">
        <div className="hero-banner-left">
          <img src={appIcon} alt="Icono de la app" className="hero-icon" />
          <div>
            <span className="eyebrow">Recomendaciones</span>
            <h1>Plan diario</h1>
            <p>La primera recomendación aparece sola después de aprobar la simulación.</p>
          </div>
        </div>
      </div>

      <div className="card recommendation-card">
        <div className="recommendation-header">
          <div>
            <h2>Menú del día</h2>
            <p>Si quieres, genera otra recomendación usando el botón.</p>
          </div>
          <button className="run-btn" onClick={generateDailyRecommendation}>
            {recommendation ? 'Actualizar menú' : 'Generar menú'}
          </button>
        </div>

        {recommendation ? (
          <>
            <div className="summary-card dashboard-summary">
              <div>
                <span className="summary-label">Día</span>
                <strong>{recommendation.day}</strong>
              </div>
              <div>
                <span className="summary-label">Calorías totales</span>
                <strong>{recommendation.dailyCals} kcal</strong>
              </div>
              <div>
                <span className="summary-label">Proteína total</span>
                <strong>{recommendation.dailyProt} g</strong>
              </div>
            </div>

            {/* Nota de cena culposa removida por petición del usuario */}

            <div className="today-grid dashboard-grid">
              <div className="meal-suggestion">
                <span>Desayuno</span>
                <div className="meal-tags">
                  <span className={`tier-pill tier-${recommendation.breakfast.calTier}`}>{tierNames[recommendation.breakfast.calTier]}</span>
                </div>
                <strong>{recommendation.breakfast.name}</strong>
                <small>{recommendation.breakfast.cal} kcal • {recommendation.breakfast.prot} g proteína</small>
              </div>
              <div className="meal-suggestion">
                <span>Almuerzo</span>
                <div className="meal-tags">
                  <span className={`tier-pill tier-${recommendation.lunch.calTier}`}>{tierNames[recommendation.lunch.calTier]}</span>
                </div>
                <strong>{recommendation.lunch.name}</strong>
                <small>{recommendation.lunch.cal} kcal • {recommendation.lunch.prot} g proteína</small>
              </div>
              <div className={`meal-suggestion ${recommendation.dinner.isGuilty ? 'guilty-card' : ''}`}>
                <span>Cena</span>
                <div className="meal-tags">
                  <span className={`tier-pill tier-${recommendation.dinner.calTier}`}>{tierNames[recommendation.dinner.calTier]}</span>
                  {recommendation.dinner.isGuilty && <span className="guilty-pill">Cena culposa</span>}
                </div>
                <strong>{recommendation.dinner.name}</strong>
                <small>{recommendation.dinner.cal} kcal • {recommendation.dinner.prot} g proteína</small>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state blank-state">
            <p>No hay recomendación aún. Haz clic en Generar menú.</p>
          </div>
        )}
      </div>
      <div className="page-footer dashboard-footer">
        <button className="secondary-btn" onClick={onEditSimulation}>Editar configuración</button>
        <button className="secondary-btn logout-bottom" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;
