import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightChart = ({ data }) => {
  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-title">Día {label}</div>
        <div>Weight: {payload[0].value} kg</div>
        {item.isGuilty && <div className="guilty-tooltip">Día guilty incluido</div>}
      </div>
    );
  };

  const renderDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.isGuilty) return null;
    return <circle cx={cx} cy={cy} r={5} fill="#dc2626" stroke="#fff" strokeWidth={2} />;
  };

  return (
    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            label={{ value: 'Days', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']} 
            label={{ value: 'kg', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={renderTooltip} />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#646cff" 
            strokeWidth={2}
            dot={renderDot}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;