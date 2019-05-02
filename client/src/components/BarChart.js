import React, { useState, useEffect } from 'react'
import Chart from 'chart.js'

const transparency = '0.3'
const colors = [
  { key: 'G200 - Green tea', value: `rgba(87, 217, 163, ${transparency})` },
  { key: 'T200 - Mermaid net', value: `rgba(0, 199, 229, ${transparency})` },
  { key: 'B200 - Coogee', value: `rgba(38, 132, 255, ${transparency})` },
  { key: 'P200 - Pastelli', value: `rgba(135, 119, 217, ${transparency})` },
]

const config = dataset => ({
  type: 'bar',
  data: {
    labels: Object.keys(dataset),
    datasets: [
      {
        label: '# of Issues',
        data: Object.values(dataset),
        backgroundColor: Object.entries(dataset).map(
          (entry, index) => colors[index % colors.length].value,
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
})

export default ({ dataset, maxResults, total }) => {
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (chart === null) {
      setChart(new Chart('BarChart', config(dataset)))
    } else {
      chart.data.labels = Object.keys(dataset)
      chart.data.datasets[0].data = Object.values(dataset)
      chart.data.datasets[0].backgroundColor = Object.entries(dataset).map(
        (entry, index) => colors[index % colors.length].value,
      )
      chart.update()
    }
  }, [chart, dataset])

  return (
    <div>
      <h5>
        Displaying{' '}
        {(maxResults && maxResults > total ? total : maxResults) || 0} of{' '}
        {total || 0} issues in fixVersion
      </h5>
      <canvas id="BarChart" width="400" height="250" />
    </div>
  )
}
