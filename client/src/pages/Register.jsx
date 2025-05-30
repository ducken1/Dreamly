import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setSuccess('Registracija uspešna!');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    } catch (err) {
      switch (err.code) {
        case 'auth/weak-password':
          setError('Geslo mora vsebovati vsaj 6 znakov.');
          break;
        case 'auth/email-already-in-use':
          setError('Ta email naslov je že registriran.');
          break;
        case 'auth/invalid-email':
          setError('Neveljaven email naslov.');
          break;
        default:
          setError('Prišlo je do napake. Poskusi znova.');
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300 flex flex-col items-center justify-start pt-12 text-center px-4 gap-4">

      <img src="/logo-192x192.png" alt="Dreamly Logo" className="w-32 h-32" />

      <h1 className="text-5xl font-extrabold text-purple-700 drop-shadow-md">
        Registracija
      </h1>

      {/* Error notification */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded w-72 mb-4">
          {error}
        </div>
      )}

      {/* Success notification */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded w-72 mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-72">
        <input
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border rounded bg-white text-gray-900"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded bg-white text-gray-900"
        />
        <input
          type="password"
          placeholder="Geslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded bg-white text-gray-900"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded shadow"
        >
          Registriraj se
        </button>
      </form>

      <p className="text-purple-700 mt-4">
        Imaš že račun?{' '}
        <Link to="/" className="underline">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}

export default Register;
