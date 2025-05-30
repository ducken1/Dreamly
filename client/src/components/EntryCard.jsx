function EntryCard({ entry, onEdit, onDelete, darkMode }) {
  // Lepši prikaz datuma
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleString('sl-SI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`relative mb-3 p-3 rounded shadow-sm border flex flex-col ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-300'
      }`}
    >
      {/* Zgornja vrstica: Datum + Edit/Delete ikone */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(entry.createdAt)}
          {entry.updatedAt && entry.updatedAt !== entry.createdAt ? ' (posodobljeno)' : ''}
        </p>

        <p>{entry.emoji}</p>
        
        <div className="flex gap-2 text-xl">
          <button
            onClick={() => onEdit(entry)}
            title="Uredi vnos"
            className={`p-1 rounded transition-colors duration-200 ${
              darkMode
                ? 'bg-purple-700 hover:bg-purple-800 text-purple-300 hover:text-purple-400'
                : 'bg-purple-700 hover:bg-purple-800 text-purple-300 hover:text-purple-400'
            }`}
            style={{ border: 'none' }}
          >
            {/* Inline SVG za "edit" */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(entry.id)}
            title="Izbriši vnos"
            className={`p-1 rounded transition-colors duration-200 ${
              darkMode
                ? 'bg-purple-700 hover:bg-purple-800 text-purple-300 hover:text-purple-400'
                : 'bg-purple-700 hover:bg-purple-800 text-purple-300 hover:text-purple-400'
            }`}
            style={{ border: 'none' }}
          >
            {/* Inline SVG za "delete" */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Spodnja vrstica: Sanje, Občutki, Dogodki v eni vrstici */}
      <div className="text-sm flex flex-wrap gap-4">
        <p><strong>Sanje:</strong> {entry.dream}</p>
        <p><strong>Dogodki:</strong> {entry.events}</p>
      </div>
    </div>
  );
}

export default EntryCard;