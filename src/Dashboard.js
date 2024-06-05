import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Dashboard.css';

const Dashboard = () => {
  const [preprocessedData, setPreprocessedData] = useState({
    barChartData: [],
    pieChartData: [],
    timeSeriesData: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log('Fetched Data:', data); // Debugging statement
      preprocessData(data);
    } catch (error) {
      console.error('Error fetching the data:', error);
    }
  };

  const preprocessData = (data) => {
    const preprocessed = {
      barChartData: {},
      pieChartData: {},
      timeSeriesData: {}
    };

    data.forEach(alert => {
      const date = alert.timestamp.split('T')[0];

      // Bar Chart Data
      preprocessed.barChartData[alert.src_ip] = (preprocessed.barChartData[alert.src_ip] || 0) + 1;

      // Pie Chart Data
      preprocessed.pieChartData[alert.alert.category] = (preprocessed.pieChartData[alert.alert.category] || 0) + 1;

      // Time Series Data
      preprocessed.timeSeriesData[date] = (preprocessed.timeSeriesData[date] || 0) + 1;
    });

    const barChartData = Object.entries(preprocessed.barChartData).map(([key, value]) => ({ x: key, y: value }));
    const pieChartData = Object.entries(preprocessed.pieChartData).map(([key, value]) => ({ labels: key, values: value }));
    const timeSeriesData = Object.entries(preprocessed.timeSeriesData).map(([key, value]) => ({ x: key, y: value }));

    console.log('Processed Data:', { barChartData, pieChartData, timeSeriesData }); // Debugging statement

    setPreprocessedData({
      barChartData,
      pieChartData,
      timeSeriesData,
    });
  };

  return (
    <div className="dashboard">
      <div className="charts-row">
        <div className="chart-container">
          <h2>Number of Alerts by Source IP</h2>
          <Plot
            data={[{
              type: 'bar',
              x: preprocessedData.barChartData.map(item => item.x),
              y: preprocessedData.barChartData.map(item => item.y),
            }]}
            layout={{
              title: 'Number of Alerts by Source IP',
              template: 'plotly_dark',
              paper_bgcolor: '#1e1e1e',
              plot_bgcolor: '#1e1e1e',
              font: {
                color: '#ffffff'
              }
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="chart-container">
          <h2>Distribution of Alert Categories</h2>
          <Plot
            data={[{
              type: 'pie',
              labels: preprocessedData.pieChartData.map(item => item.labels),
              values: preprocessedData.pieChartData.map(item => item.values),
            }]}
            layout={{
              title: 'Distribution of Alert Categories',
              template: 'plotly_dark',
              paper_bgcolor: '#1e1e1e',
              plot_bgcolor: '#1e1e1e',
              font: {
                color: '#ffffff'
              }
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="chart-container">
        <h2>Count of Alerts Over Time</h2>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines',
            x: preprocessedData.timeSeriesData.map(item => item.x),
            y: preprocessedData.timeSeriesData.map(item => item.y),
          }]}
          layout={{
            title: 'Count of Alerts Over Time',
            template: 'plotly_dark',
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: {
              color: '#ffffff'
            }
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
