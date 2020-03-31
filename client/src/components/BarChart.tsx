import React, { useState, useEffect, FunctionComponent } from 'react';
import { Chart } from 'chart.js';

interface ChartData {
  labels: string[];
  values: number[];
  maxResults: number;
  total: number;
}

const transparency = '0.3';
const colors = [
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` },
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` },
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` },
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` },
];

function updateChartOptions(results: number, total: number) {
  return {
    title: {
      display: true,
      text: `Displaying ${results} of ${total} issues`,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
}

function updateChartData(labels: string[], values: number[]) {
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

const BarChart: FunctionComponent<ChartData> = ({
  labels,
  values,
  maxResults,
  total,
}) => {
  const [chart, setChart] = useState<Chart | null>(null);
  const results = maxResults > total ? total : maxResults;
  const ctx = 'myChart';

  useEffect(() => {
    if (chart) {
      chart.options.title!.text = `Displaying ${results} of ${total} issues`;
      chart.data = updateChartData(labels, values);
      chart.update();
    } else {
      setChart(
        new Chart(ctx, {
          type: 'bar',
          data: updateChartData(labels, values),
          options: updateChartOptions(results, total),
        }),
      );
    }
  }, [chart, labels, values, results, total]);

  return <canvas id="myChart" />;
};

export default BarChart;
