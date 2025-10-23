import React from 'react';
import GaugeChart from 'react-gauge-chart';

const Gauge = ({ title, value, aqi_value, maxValue }) => {
  // Tính toán phần trăm để sử dụng trong GaugeChart
  const percent = value / maxValue;

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px', color: 'white', backgroundColor: 'white', padding: '20px',  borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', }}>
      <h3>{title}</h3>
      <GaugeChart 
        id={`gauge-chart-${title}`}
        nrOfLevels={20}
        percent={percent}
        hideText="true"
        textColor="#000000"
        needleColor="#345243"
        colors={["#00FF00", "#FF0000"]}
        cornerRadius={9}
      />
      <p style={{ marginTop: '10px',color: '#000'}}>AQI: {(aqi_value / 1).toFixed(3)}</p>
      <p style={{ color: '#000'}}>Value: {(value / 1).toFixed(3)} µg/m³</p>
    </div>
  );
};

export default Gauge;