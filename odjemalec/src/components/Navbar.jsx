function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-purple-50 shadow-md px-6 py-2 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Dreamly Logo" className="w-16 h-16" />
        <h1 className="text-2xl font-bold text-purple-600 tracking-tight">Dreamly</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-purple-800 font-medium">{user.name}</span>
        <button
          onClick={onLogout}
          className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 shadow-sm transition duration-200"
        >
          Odjava
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
