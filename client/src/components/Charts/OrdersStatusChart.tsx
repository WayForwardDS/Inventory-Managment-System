// src/components/Charts/OrderStatusChart.tsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card } from 'antd';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatusChartProps {
  completed: number;
  pending: number;
  cancelled: number;
}

const OrderStatusChart = ({ completed, pending, cancelled }: OrderStatusChartProps) => {
  const data = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [completed, pending, cancelled],
        backgroundColor: [
          '#52c41a', // green for completed
          '#faad14', // yellow for pending
          '#ff4d4f', // red for cancelled
        ],
        borderColor: [
          '#389e0d',
          '#d48806',
          '#cf1322',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default OrderStatusChart;