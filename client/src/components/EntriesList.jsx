import EntryCard from './EntryCard';

function EntriesList({ 
  entries, 
  loading, 
  fetchError, 
  onEdit, 
  onDelete, 
  onToggleFavourite,
  darkMode 
}) {
  // Statistika
  const countEntries = entries.length;
  const countFavourites = entries.filter(entry => entry.favourite).length;
  
  const avgLength = (field) => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((acc, entry) => acc + (entry[field]?.length || 0), 0);
    return Math.round(total / entries.length);
  };

  return (
    <div
      className={`w-96 rounded-lg shadow-lg p-4 border flex flex-col ${
        darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-purple-300 text-purple-800'
      }`}
      style={{ height: '470px', minHeight: '250px' }}
    >
      <h3 className="text-2xl font-semibold mb-2">Prejšnji vnosi</h3>
    
      {loading && <p>{darkMode ? 'Nalagam vnose...' : 'Nalagam vnose...'}</p>}
      {fetchError && <p className="text-red-500">{fetchError}</p>}
    
      <div className="overflow-y-auto flex-grow">
        {entries.length === 0 && !loading && (
          <p className="text-center text-sm opacity-70">Ni še vnosov...</p>
        )}
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavourite={onToggleFavourite}
            darkMode={darkMode}
          />
        ))}
      </div>

      <hr className="my-4 border-purple-400/50" />
      
      <div className="text-sm opacity-70">
        <p>Število vnosov: <strong>{countEntries}</strong></p>
        <p>Priljubljeni vnosi: <strong>{countFavourites}</strong></p>
        <p>Povprečna dolžina sanj: <strong>{avgLength('dream')}</strong> znakov</p>
        <p>Povprečna dolžina dogodkov: <strong>{avgLength('events')}</strong> znakov</p>
      </div>
    </div>
  );
}

export default EntriesList;