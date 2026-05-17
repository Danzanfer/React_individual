import React from 'react';

const MacroSummary = ({ results }) => {
  const avgProtein = results.reduce((acc, day) => acc + day.dailyProt, 0) / results.length;
  const avgCals = results.reduce((acc, day) => acc + day.dailyCals, 0) / results.length;

  return (
    <div className="macro-summary">
      <div className="macro-item">
        <span>Proteína promedio</span>
        <strong>{avgProtein.toFixed(0)} g</strong>
      </div>
      <div className="macro-item">
        <span>Calorías promedio</span>
        <strong>{avgCals.toFixed(0)} kcal</strong>
      </div>
    </div>
  );
};

export default MacroSummary;