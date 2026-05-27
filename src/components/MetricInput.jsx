import React from 'react';

const MetricInput = ({ label, value, onChange, min, max, step = 1, unit = "" }) => {
  return (
    <div className="input-group">
      <label>{label} ({unit})</label>
      <div className="input-wrapper">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
        />
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
        />
      </div>
    </div>
  );
};

export default MetricInput;