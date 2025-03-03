import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Role-Specific', value: 30 },
  { name: 'Technical skills', value: 100 },
  { name: 'Soft Skills', value: 70 },
  { name: 'Certifications', value: 20 },
  { name: 'Experience', value: 50 },
  { name: 'Industry keywords', value: 10 },
];

const MyChart = () => (
  <ResponsiveContainer width="50%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#2a93b0" />
    </BarChart>
  </ResponsiveContainer>
);

export default MyChart;
