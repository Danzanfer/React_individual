import React from 'react';

const StrategyManager = ({ title, options, onWeightChange }) => {
  return (
    <div className="strategy-card">
      <h3>{title}</h3>
      {options.map((option, index) => (
        <div key={option.name} className="strategy-item">
          <div className="item-info">
            <span>{option.name}</span>
            <small>{option.cal} kcal</small>
          </div>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={option.weight}
            onChange={(e) => onWeightChange(index, parseFloat(e.target.value))}
          />
          <span className="weight-display">
            {(option.weight * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default StrategyManager;