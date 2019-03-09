import React, { Component } from 'react';
import Chart from 'chart.js';

const transparency = '0.2';
const colors = [
  { key: 'R200 - Salmon sashimi', value: `rgba(255, 116, 82, ${transparency})` }, 
  { key: 'Y200 - Pub mix', value: `rgba(255, 196, 0, ${transparency})` }, 
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` }, 
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` }, 
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` }, 
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` }, 
];

const config = (dataset) => ({
  type: 'bar',
  data: {
    labels: Object.keys(dataset),
    datasets: [{
      label: '# of Issues',
      data: Object.values(dataset),
      backgroundColor: 
        Object.entries(dataset).map((entry, index) =>
          colors[index % colors.length].value),
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

export default class BarChart extends Component {
  state = {
    chart: null,
  }

  componentDidMount() {
    this.setState({ chart: new Chart("BarChart", config(this.props.dataset)) });
  }

  componentDidUpdate() {
    const { chart } = this.state;
    const { dataset } = this.props;
    chart.data.labels = Object.keys(dataset);
    chart.data.datasets[0].data = Object.values(dataset)
    chart.data.datasets[0].backgroundColor = 
      Object.entries(dataset).map((entry, index) =>
        colors[index % colors.length].value)
    chart.update();
  }

  render() {
    return (
      <div>
        <canvas id="BarChart" width="400" height="250"></canvas>
      </div>
    );
  }
};