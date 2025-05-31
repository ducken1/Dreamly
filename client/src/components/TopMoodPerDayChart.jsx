import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { format } from 'date-fns';

function TopMoodPerDayChart({ entries, darkMode }) {
  const groupedByDate = entries.reduce((acc, entry) => {
    if (!entry.createdAt) return acc;

    let parsedDate;

    if (entry.createdAt.seconds !== undefined) {
      parsedDate = new Date(
        entry.createdAt.seconds * 1000 + Math.floor(entry.createdAt.nanoseconds / 1000000)
      );
    } else if (typeof entry.createdAt === 'string') {
      parsedDate = new Date(entry.createdAt);
    } else if (entry.createdAt instanceof Date) {
      parsedDate = entry.createdAt;
    } else {
      console.warn('Datum ni parsiran:', entry.createdAt);
      return acc;
    }

    if (isNaN(parsedDate)) {
      console.warn('Datum ni veljaven:', parsedDate);
      return acc;
    }

    const date = format(parsedDate, 'yyyy-MM-dd');
    const emoji = entry.emoji || '❓';

    acc[date] = acc[date] || {};
    acc[date][emoji] = (acc[date][emoji] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(groupedByDate).map(([date, emojis]) => {
    let topEmoji = '❓';
    let maxCount = 0;

    for (const [emoji, count] of Object.entries(emojis)) {
      if (count > maxCount) {
        topEmoji = emoji;
        maxCount = count;
      }
    }

    return {
      date,
      count: maxCount,
      emoji: topEmoji,
    };
  });

  if (data.length === 0) {
    return <p className={darkMode ? 'text-gray-300' : 'text-purple-800'}>Ni dovolj podatkov za prikaz grafikona.</p>;
  }

  return (
    <div className="max-w-md w-full ml-8"> {/* ml-8 za razmak od prvega */}
      <h3
        className={darkMode ? 'text-xl text-gray-300' : 'text-xl text-purple-900'}
        style={{ minHeight: 38 }} // enaka višina naslova
      >
        Najpogostejši občutek po dnevih
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="date" stroke={darkMode ? '#ccc' : '#333'} />
          <YAxis stroke={darkMode ? '#ccc' : '#333'} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8">
            <LabelList dataKey="emoji" position="top" fontSize={24} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopMoodPerDayChart;
