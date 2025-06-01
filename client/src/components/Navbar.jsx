import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, darkMode, setDarkMode }) {
  const [showEmojiSearch, setShowEmojiSearch] = useState(false);
  const navigate = useNavigate();

  const emojis = ['😄', '🙂', '😐', '😢', '😠', '😵'];

  const handleEmojiClick = (emoji) => {
    setShowEmojiSearch(false);
    navigate(`/search/${emoji}`);
  };

  return (
    <nav
      className={`px-6 py-2 flex justify-between items-center shadow-md
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-purple-50 text-purple-800'}`}
    >
      <div className="flex items-center gap-3">
        <img src="/logo-192x192.png" alt="Dreamly Logo" className="w-16 h-16" />
        <h1 className="text-2xl font-bold tracking-tight"> Dreamly</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Gumb za iskanje */}
        <button
          onClick={() => setShowEmojiSearch(!showEmojiSearch)}
          className={`p-2 rounded transition ${
            darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-400 hover:bg-purple-500'
          }`}
          aria-label="Search dreams by emoji"
        >
          {/* SVG ikona namesto slike */}
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>

        {/* Meni z emotikoni */}
        {showEmojiSearch && (
          <div
            className={`absolute top-14 right-0 z-50 p-3 rounded-lg shadow-md border 
              ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'}`}
          >
            <p className="mb-2 text-sm font-semibold">Izberi emoji za iskanje:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ostali elementi */}
        <span>{user.name}</span>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded transition ${
            darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-400 hover:bg-purple-500'
          }`}
          aria-label="Toggle dark mode"
        >
          <img
            src={darkMode ? '/light-mode.svg' : '/dark-mode.svg'}
            alt={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-6 h-6"
          />
        </button>

        <button
          onClick={onLogout}
          className={`${
            darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-400 hover:bg-purple-500'
          } text-white px-4 py-2 shadow-sm transition duration-200 rounded`}
        >
          Odjava
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
