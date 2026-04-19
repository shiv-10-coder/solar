import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function EnergyChart({ predictions }) {
  const solar = predictions.filter(p => p.type === 'solar').slice(0, 10).reverse();
  const wind = predictions.filter(p => p.type === 'wind').slice(0, 10).reverse();

  const data = {
    labels: Array.from({ length: Math.max(solar.length, wind.length) }, (_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Solar (kWh/day)',
        data: solar.map(p => p.result),
        borderColor: '#ffe600',
        backgroundColor: 'rgba(255, 230, 0, 0.1)',
        pointBackgroundColor: '#ffe600',
        pointBorderColor: '#ffe600',
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Wind (Watts)',
        data: wind.map(p => p.result),
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        pointBackgroundColor: '#00f0ff',
        pointBorderColor: '#00f0ff',
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e0e6ff', font: { family: 'Inter' } } },
      tooltip: {
        backgroundColor: 'rgba(10,10,26,0.9)',
        titleColor: '#00f0ff',
        bodyColor: '#e0e6ff',
        borderColor: 'rgba(0,240,255,0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: 'rgba(224,230,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: 'rgba(224,230,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  return <Line data={data} options={options} />;
}
