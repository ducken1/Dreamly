import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

function MoodChart({ entries, darkMode }) {
  const emojiCount = entries.reduce((acc, entry) => {
    const emoji = entry.emoji || '❓';
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(emojiCount).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <p className={darkMode ? 'text-gray-300' : 'text-purple-800'}>Ni podatkov za prikaz grafa.</p>;
  }

  return (
    <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-2">
          <h3
            className={darkMode ? 'text-xl text-gray-300' : 'text-xl text-purple-900'}
            style={{ minHeight: 38 }}
          >
            Pogostost občutkov ob prebujanju
          </h3>
        </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name }) => name}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodChart;
