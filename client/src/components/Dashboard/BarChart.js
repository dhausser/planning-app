import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

const transparency = '0.3';
const colors = [
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` },
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` },
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` },
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` },
];

const config = ({ labels, values }) => ({
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: '# of Issues',
        data: values,
        backgroundColor: colors[2].value,
        // values.map(
        //   (_entry, index) => colors[index % colors.length].value,
        // ),
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

function updateChart(chart, { labels, values }) {
  // eslint-disable-next-line no-param-reassign
  chart.data.labels = labels;
  // eslint-disable-next-line no-param-reassign
  chart.data.datasets[0].data = values;
  // chart.data.datasets[0].backgroundColor = values.map(
  //   (_entry, index) => colors[index % colors.length].value,
  // );
  chart.update();
}

export default function BarChart({ dashboardIssues }) {
  const [chart, setChart] = useState(null);
  const {
    labels, values, maxResults, total,
  } = dashboardIssues;

  useEffect(() => {
    if (chart === null) {
      setChart(new Chart('BarChart', config({ labels, values })));
    } else {
      updateChart(chart, { labels, values });
    }
  }, [labels, values, chart]);

  const results = maxResults > total ? total : maxResults;

  return (
    <>
      <h5>{`Displaying ${results} of ${total}`}</h5>
      <canvas id="BarChart" width="400" height="250" />
    </>
  );
}

BarChart.defaultProps = {
  dashboardIssues: [],
};

BarChart.propTypes = {
  dashboardIssues: PropTypes.objectOf(PropTypes.objectOf),
};
