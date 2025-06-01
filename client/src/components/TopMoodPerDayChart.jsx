import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { format, getDay } from 'date-fns';

const dniVTednu = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];

const vrstniRedDni = {
  Pon: 0,
  Tor: 1,
  Sre: 2,
  Čet: 3,
  Pet: 4,
  Sob: 5,
  Ned: 6,
};

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

  // Za vsak datum najdi top emoji in count
  const dataPerDate = Object.entries(groupedByDate).map(([date, emojis]) => {
    let topEmoji = '❓';
    let maxCount = 0;

    for (const [emoji, count] of Object.entries(emojis)) {
      if (count > maxCount) {
        topEmoji = emoji;
        maxCount = count;
      }
    }

    const parsedDate = new Date(date);
    const dayIndex = getDay(parsedDate);
    const day = dniVTednu[dayIndex];

    return {
      date,
      day,
      count: maxCount,
      emoji: topEmoji,
    };
  });

  // Agregacija: združimo podatke po dnevu, da na dan pripišemo največji count in pripadajoči emoji
  // Lahko izbereš tudi vsoto countov, ampak tukaj vzamemo največji count in emoji tega vnosa

  const aggregatedByDay = dataPerDate.reduce((acc, curr) => {
    const day = curr.day;

    if (!acc[day]) {
      acc[day] = { day, count: curr.count, emoji: curr.emoji };
    } else {
      if (curr.count > acc[day].count) {
        acc[day] = { day, count: curr.count, emoji: curr.emoji };
      }
    }

    return acc;
  }, {});

  // Pretvorba nazaj v array
  let data = Object.values(aggregatedByDay);

  // Sortiramo po tvojem vrstnem redu dni
  data.sort((a, b) => vrstniRedDni[a.day] - vrstniRedDni[b.day]);

  if (data.length === 0) {
    return <p className={darkMode ? 'text-gray-300' : 'text-purple-800'}>Ni dovolj podatkov za prikaz grafikona.</p>;
  }

  return (
    <div className="max-w-md w-full ml-8">
      <div className="flex flex-col items-center mb-2">
        <h3
          className={darkMode ? 'text-xl text-gray-300' : 'text-xl text-purple-900'}
          style={{ minHeight: 38 }}
        >
          Najpogostejši občutek po dnevih
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="day" stroke={darkMode ? '#ccc' : '#333'} />
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
