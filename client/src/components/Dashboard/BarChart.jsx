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
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  // chart.data.datasets[0].backgroundColor = values.map(
  //   (_entry, index) => colors[index % colors.length].value,
  // );
  chart.update();
}

function BarChart({
  labels, values, maxResults, total,
}) {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chart === null) {
      setChart(new Chart('BarChart', config({ labels, values })));
    } else {
      updateChart(chart, { labels, values });
    }
  }, [labels, values, chart]);

  const results = maxResults > total ? total : maxResults;

  return (
    <div>
      <h5>{`Displaying ${results} of ${total}`}</h5>
      <canvas id="BarChart" width="400" height="250" />
    </div>
  );
}

BarChart.defaultProps = {
  // dataset: [],
  maxResults: 0,
  total: 0,
};

BarChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  maxResults: PropTypes.number,
  total: PropTypes.number,
};

export default BarChart;

// function aggregateByAssignee(issues) {
//   return issues.reduce((resources, issue) => {
//     if (issue.assignee && issue.assignee.name) {
//       const name = issue.assignee.name.split(' ').shift();
//       if (!resources[name]) {
//         resources[name] = 0;
//       }
//       resources[name] += 1;
//     }
//     return resources;
//   }, {});
// }

// function filterByTeam(issues, team) {
//   return team
//     ? aggregateByAssignee(
//       issues.filter(({ assignee }) => assignee.team === team.name),
//     )
//     : aggregateByTeam(issues);
// }
