import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMonthlySaleQuery } from '../../redux/features/management/saleApi';
import { months } from '../../utils/generateDate';
import { Flex } from 'antd';
import Loader from '../Loader';

const MonthlyChart = () => {
  const { data: monthlyData, isLoading } = useMonthlySaleQuery(undefined);

  if (isLoading)
    return (
      <Flex>
        <Loader />
      </Flex>
    );

  const data = monthlyData?.data.map(
    (item: { month: number; year: number; totalRevenue: number }) => ({
      name: `${months[item.month - 1]}, ${item.year}`,
      revenue: item.totalRevenue,
    })
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* Gradient Background */}
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Grid and Axes */}
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#fff' }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
        />
        <YAxis
          tick={{ fill: '#fff' }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
        />

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            background: 'rgba(31, 41, 55, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#fff',
          }}
          labelStyle={{ fontWeight: 'bold' }}
        />

        {/* Legend */}
        <Legend
          wrapperStyle={{
            color: '#fff',
            paddingTop: '20px',
          }}
        />

        {/* Bar */}
        <Bar
          dataKey="revenue"
          fill="url(#colorRevenue)" 
          radius={[4, 4, 0, 0]} 
          animationDuration={1500} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyChart;