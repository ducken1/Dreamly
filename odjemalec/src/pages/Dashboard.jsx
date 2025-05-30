import Navbar from '../components/Navbar';

function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Tvoja nadzorna plošča</h2>
        <p className="text-purple-800 text-lg">
          Dobrodošla nazaj, <span className="font-semibold">{user.name}</span>! 👋 Tukaj bo tvoja vsebina.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
