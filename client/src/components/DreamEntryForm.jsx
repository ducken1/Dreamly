import { useState, useEffect } from 'react';

function DreamEntryForm({ 
  editingEntry, 
  onSubmit, 
  onCancel, 
  darkMode 
}) {
  const [dream, setDream] = useState(editingEntry?.dream || '');
  const [events, setEvents] = useState(editingEntry?.events || '');
  const [selectedEmoji, setSelectedEmoji] = useState(editingEntry?.emoji || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dream.trim()) {
      throw new Error('Polje za sanje je obvezno.');
    }

    const entryData = {
      dream,
      emoji: selectedEmoji,
      events
    };

    await onSubmit(entryData);
    
    // Reset form after successful submission
    setDream('');
    setEvents('');
    setSelectedEmoji('');
  };

  const handleCancel = () => {
    setDream('');
    setEvents('');
    setSelectedEmoji('');
    onCancel();
  };

    useEffect(() => {
    setDream(editingEntry?.dream || '');
    setEvents(editingEntry?.events || '');
    setSelectedEmoji(editingEntry?.emoji || '');
  }, [editingEntry]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        placeholder="Kaj ste sanjali?"
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        className={`p-3 rounded border bg-white text-black placeholder:text-black ${
          darkMode ? 'bg-gray-700 text-gray-100 placeholder:text-gray-400' : ''
        }`}
        required
      />

      <textarea
        placeholder="Pomembni dogodki včerajšnjega dne"
        value={events}
        onChange={(e) => setEvents(e.target.value)}
        className={`p-3 rounded border bg-white text-black placeholder:text-black ${
          darkMode ? 'bg-gray-700 text-gray-100 placeholder:text-gray-400' : ''
        }`}
      />

      {/* Emoji izbor za počutje */}
      <div
        className={`mt-2 p-4 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-purple-100 border-transparent text-purple-800'
        }`}
      >
        <p className="w-full font-semibold mb-2 text-sm">
          Kako si se počutil/a ob prebujanju?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['😄', '🙂', '😐', '😢', '😠', '😵'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-2xl p-2 rounded transition ${
                selectedEmoji === emoji
                  ? darkMode
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-400 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-600 text-gray-300'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className={`py-2 mt-2 rounded text-white ${
          darkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {editingEntry ? 'Uredi vnos' : 'Shrani vnos'}
      </button>

      {editingEntry && (
        <button
          type="button"
          onClick={handleCancel}
          className="mt-2 py-2 rounded border border-red-500 text-red-500 bg-white hover:bg-red-100"
        >
          Prekliči urejanje
        </button>
      )}
    </form>
  );
}

export default DreamEntryForm;