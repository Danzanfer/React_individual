import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProteinChart = ({ data }) => {
  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-title">Día {label}</div>
        <div>Protein: {payload[0].value} g</div>
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
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'Protein (g)', angle: -90, position: 'insideLeft', dy: 20 }} />
          <Tooltip content={renderTooltip} />
          <Line type="monotone" dataKey="dailyProt" stroke="#16a34a" strokeWidth={2} dot={renderDot} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProteinChart;
