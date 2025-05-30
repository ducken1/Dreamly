function Navbar({ user, onLogout, darkMode, setDarkMode }) {
  return (
    <nav
      className={`px-6 py-2 flex justify-between items-center shadow-md
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-purple-50 text-purple-800'}`}
    >
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Dreamly Logo" className="w-16 h-16" />
        <h1 className="text-2xl font-bold tracking-tight"> Dreamly</h1>
      </div>

      <div className="flex items-center gap-4">
        <span>{user.name}</span>

        {/* Dark Mode Toggle with icons */}
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
