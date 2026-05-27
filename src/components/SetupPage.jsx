import { useState } from 'react';
import MetricInput from './MetricInput';
import appIcon from '../assets/MCDiet.jpeg';

const tierNames = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const SetupPage = ({ config, onChange, onRun, onLogout }) => {
  const [step, setStep] = useState(1);
  const [showExamples, setShowExamples] = useState(false);

  const handleMetricChange = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const handleFrequencyChange = (mealKey, type, tier, value) => {
    const updatedMeal = {
      ...config.mealFrequencies[mealKey],
      [type]: {
        ...config.mealFrequencies[mealKey][type],
        [tier]: value,
      },
    };

    onChange({
      ...config,
      mealFrequencies: {
        ...config.mealFrequencies,
        [mealKey]: updatedMeal,
      },
    });
  };

  const totalCount = (mealKey, type) =>
    Object.values(config.mealFrequencies[mealKey][type]).reduce((sum, value) => sum + value, 0);

  const renderMealFrequency = (mealKey, mealLabel) => {
    const meal = config.mealFrequencies[mealKey];
    const calTotal = totalCount(mealKey, 'cal');
    const protTotal = totalCount(mealKey, 'prot');

    return (
      <div className="tier-card" key={mealKey}>
        <div className="tier-card-header">
          <div>
            <h3>{mealLabel}</h3>
          </div>
          <div className="tier-badges">
            <span className={calTotal !== 7 ? 'pill pill-warning' : 'pill pill-success'}>
              Calorías: {calTotal}/7
            </span>
            <span className={protTotal !== 7 ? 'pill pill-warning' : 'pill pill-success'}>
              Proteína: {protTotal}/7
            </span>
          </div>
        </div>

        <div className="tier-grid">
          <div>
            <h4>Calorías</h4>
            {['high', 'medium', 'low'].map((tier) => (
              <div className="tier-input" key={tier}>
                <label>
                  <span className={`tier-tag tier-${tier}`}>{tierNames[tier]}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={meal.cal[tier]}
                  onChange={(e) => handleFrequencyChange(mealKey, 'cal', tier, parseInt(e.target.value, 10) || 0)}
                />
              </div>
            ))}
          </div>

          <div>
            <h4>Proteínas</h4>
            {['high', 'medium', 'low'].map((tier) => (
              <div className="tier-input" key={tier}>
                <label>
                  <span className={`tier-tag tier-${tier}`}>{tierNames[tier]}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={meal.prot[tier]}
                  onChange={(e) => handleFrequencyChange(mealKey, 'prot', tier, parseInt(e.target.value, 10) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        {(calTotal !== 7 || protTotal !== 7) && (
          <div className="warning-box">Cada grupo debe sumar 7 días para calorías y proteína.</div>
        )}
      </div>
    );
  };

  return (
    <div className="page-shell setup-shell">
      <div className="hero-banner">
        <div className="hero-banner-left">
          <img src={appIcon} alt="Icono de la app" className="hero-icon" />
          <div>
            <span className="eyebrow">Configuración</span>
            <h1>Prepara tu simulación</h1>
          </div>
        </div>
      </div>

      <div className="step-tabs">
        <button className={`step-tab ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
          Datos básicos
        </button>
        <button className={`step-tab ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
          Desayuno / Almuerzo / Cena
        </button>
      </div>

      {step === 1 ? (
        <div className="card panel-card">
          <h2>Datos principales</h2>
          <p className="panel-copy">Estos valores son la base para calcular el balance calórico y la probabilidad de cena culposa.</p>
          <MetricInput
            label="Peso inicial"
            unit="kg"
            min={40}
            max={150}
            value={config.startingWeight}
            onChange={(value) => handleMetricChange('startingWeight', value)}
          />
          <MetricInput
            label="Calorías de mantenimiento"
            unit="kcal"
            min={1400}
            max={4200}
            step={50}
            value={config.maintenanceCal}
            onChange={(value) => handleMetricChange('maintenanceCal', value)}
          />
          <MetricInput
            label="Calorías activas"
            unit="kcal"
            min={0}
            max={1200}
            step={25}
            value={config.activeCal}
            onChange={(value) => handleMetricChange('activeCal', value)}
          />
          <MetricInput
            label="Probabilidad de cena culposa"
            unit="%"
            min={0}
            max={100}
            value={config.guiltyChance}
            onChange={(value) => handleMetricChange('guiltyChance', value)}
          />

          <div className="page-actions">
            <button className="run-btn" onClick={() => setStep(2)}>Siguiente</button>
          </div>
        </div>
      ) : (
        <>
          <div className="card panel-card">
            <h2>Tier de comidas</h2>
            <p className="panel-copy">Elige la frecuencia de cada nivel para desayuno, almuerzo y cena.</p>
            <button className="secondary-btn collapsible-btn" onClick={() => setShowExamples((s) => !s)}>
              {showExamples ? 'Ocultar ejemplos' : 'Mostrar ejemplos'}
            </button>
            {showExamples && (
              <div className="info-box">
                <ul className="example-list">
                  <li>
                    <span className="tier-pill tier-high">Alto</span>
                    <strong>Desayuno</strong>: Waffles, Pancakes
                  </li>
                  <li>
                    <span className="tier-pill tier-medium">Medio</span>
                    <strong>Desayuno</strong>: Smoothie Bowl, Eggs & Toast
                  </li>
                  <li>
                    <span className="tier-pill tier-low">Bajo</span>
                    <strong>Desayuno</strong>: Yogurt Parfait, Fruit Oatmeal
                  </li>
                  <li>
                    <span className="tier-pill tier-high">Alto</span>
                    <strong>Almuerzo</strong>: Burger Bowl, Pasta with Veggies
                  </li>
                  <li>
                    <span className="tier-pill tier-medium">Medio</span>
                    <strong>Almuerzo</strong>: Chicken & Rice, Steak Sandwich
                  </li>
                  <li>
                    <span className="tier-pill tier-low">Bajo</span>
                    <strong>Almuerzo</strong>: Grain Salad, Tofu Bowl
                  </li>
                  <li>
                    <span className="tier-pill tier-high">Alto</span>
                    <strong>Cena</strong>: Pizza Slice, Beef Stew
                  </li>
                  <li>
                    <span className="tier-pill tier-medium">Medio</span>
                    <strong>Cena</strong>: Salmon Salad, Quinoa Bowl, Tofu Curry
                  </li>
                  <li>
                    <span className="tier-pill tier-low">Bajo</span>
                    <strong>Cena</strong>: Veggie Stir Fry
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="tier-summary-card card">
            <p className="tier-summary-text">Cuántos días de 7 pertenecen a cada nivel de calorías y proteína.</p>
            <div className="tier-legend">
              <span className="tier-pill tier-high">Alto</span>
              <span className="tier-pill tier-medium">Medio</span>
              <span className="tier-pill tier-low">Bajo</span>
            </div>
          </div>

          <div className="frequency-grid">
            {renderMealFrequency('breakfast', 'Desayuno')}
            {renderMealFrequency('lunch', 'Almuerzo')}
            {renderMealFrequency('dinner', 'Cena')}
          </div>

          <div className="page-actions">
            <button className="secondary-btn" onClick={() => setStep(1)}>Volver</button>
            <button className="run-btn" onClick={onRun}>Simular</button>
          </div>
        </>
      )}
      <div className="page-footer">
        <button className="secondary-btn logout-bottom" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default SetupPage;
