import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

const transparency = '0.3';
const colors = [
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` },
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` },
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` },
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` },
];

/**
 * TODO: Chart options to start Y scale from 0
 */
function updateChartOptions(results, total) {
  return {
    title: {
      display: true,
      text: `Displaying ${results} of ${total} issues`,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };
}

function updateChartData(labels, values) {
  return {
    labels,
    datasets: [
      {
        label: 'Sum of issues',
        data: values,
        backgroundColor: colors[0].value,
      },
    ],
  };
}

export default function BarChart({ labels, values, maxResults, total }) {
  const [chart, setChart] = useState(null);
  const results = maxResults > total ? total : maxResults;
  const ctx = 'myChart';

  useEffect(() => {
    if (chart) {
      chart.data = updateChartData(labels, values);
      chart.update();
    } else {
      setChart(new Chart(ctx, {
        type: 'bar',
        data: updateChartData(labels, values),
        options: updateChartOptions(results, total),
      }));
    }
  }, [chart, labels, values, results, total]);

  return <canvas id="myChart" />;
}

BarChart.defaultProps = {
  labels: [],
  values: [],
  maxResults: 0,
  total: 0,
};

BarChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.number),
  maxResults: PropTypes.number,
  total: PropTypes.number,
};
