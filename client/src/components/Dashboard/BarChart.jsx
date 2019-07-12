/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Chart from 'chart.js';

const GET_TEAM = gql`
  query GetTeam {
    team @client {
      id
      name
    }
  }
`;

const transparency = '0.3';
const colors = [
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` },
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` },
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` },
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` },
];

const config = dataset => ({
  type: 'bar',
  data: {
    labels: Object.keys(dataset),
    datasets: [
      {
        label: '# of Issues',
        data: Object.values(dataset),
        backgroundColor: Object.entries(dataset).map(
          (_entry, index) => colors[index % colors.length].value,
        ),
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

function aggregateByAssignee(issues) {
  return issues.reduce((resources, issue) => {
    if (issue.assignee && issue.assignee.name) {
      const name = issue.assignee.name.split(' ').shift();
      if (!resources[name]) {
        resources[name] = 0;
      }
      resources[name] += 1;
    }
    return resources;
  }, {});
}

function aggregateByTeam(issues) {
  return issues.reduce((teams, issue) => {
    if (issue.assignee && issue.assignee.team) {
      const { team: teamName } = issue.assignee;
      if (!teams[teamName]) {
        teams[teamName] = 0;
      }
      teams[teamName] += 1;
    }
    return teams;
  }, {});
}

function filterByTeam(issues, team) {
  return team
    ? aggregateByAssignee(
      issues.filter(({ assignee }) => assignee.team === team.id),
    )
    : aggregateByTeam(issues);
}

function updateChart(chart, dataset) {
  chart.data.labels = Object.keys(dataset);
  chart.data.datasets[0].data = Object.values(dataset);
  chart.data.datasets[0].backgroundColor = Object.entries(dataset).map(
    (_entry, index) => colors[index % colors.length].value,
  );
  chart.update();
}

function BarChart({ issues, maxResults, total }) {
  const [chart, setChart] = useState(null);
  const { data: { team } } = useQuery(GET_TEAM);
  const dataset = filterByTeam(issues, team);

  useEffect(() => {
    if (chart === null) {
      setChart(new Chart('BarChart', config(dataset)));
    } else {
      updateChart(chart, dataset);
    }
  }, [dataset, chart]);

  const results = maxResults > total ? total : maxResults;

  return (
    <div>
      <h5>{`Displaying ${results} of ${total}`}</h5>
      <canvas id="BarChart" width="400" height="250" />
    </div>
  );
}

BarChart.defaultProps = {
  issues: [],
  maxResults: 0,
  total: 0,
};

BarChart.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.objectOf),
  maxResults: PropTypes.number,
  total: PropTypes.number,
};

export default BarChart;
