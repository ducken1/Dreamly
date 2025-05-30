// src/pages/Home.jsx

import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth, provider, signInWithPopup } from '../firebase';

function Home({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleEmailLogin = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setUser({
      name: user.displayName,
      email: user.email,
      uid: user.uid,
    });

    // Shranimo v localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      })
    );

    setSuccess('Prijava uspešna!');
    setTimeout(() => {
      setSuccess('');
      navigate('/dashboard');
    }, 1500);
  } catch (err) {
    console.error(err);
    switch (err.code) {
      case 'auth/invalid-credential':
        setError('Napačni podatki za prijavo.');
        break;
      case 'auth/too-many-requests':
        setError('Preveč neuspešnih poskusov. Poskusi kasneje.');
        break;
      default:
        setError('Prišlo je do napake pri prijavi.');
    }
  }
};

const handleGoogleLogin = async () => {
  setError('');
  setSuccess('');
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setUser({
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
    });

    // Shranimo v localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
      })
    );

    setSuccess('Prijava z Google računom uspešna!');
    setTimeout(() => {
      setSuccess('');
      navigate('/dashboard');
    }, 1500);
  } catch (err) {
    console.error(err);
    setError('Google prijava ni uspela.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300 flex flex-col items-center justify-start pt-12 text-center px-4 gap-4">

      <img src="/logo-192x192.png" alt="Dreamly Logo" className="w-32 h-32" />

      <h1 className="text-5xl font-extrabold text-purple-700 drop-shadow-md">
        Dobrodošli v Dreamly
      </h1>
      <p className="text-lg text-purple-800 max-w-md">
        Prijavi se z Google računom ali preko emaila.
      </p>

      {/* Obvestila */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded w-72">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded w-72">
          {success}
        </div>
      )}

      {/* Email/password login form */}
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-72">
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
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded shadow">
          Prijava
        </button>
      </form>

{/* Google Login */}
<button
  onClick={handleGoogleLogin}
  className="flex items-center justify-center gap-3 px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 shadow-sm transition-colors duration-200 text-gray-900"
>
  <img src="/google-logo.svg" alt="Google logo" className="w-6 h-6" />
  Prijava z Google
</button>

      {/* Link to Register */}
      <p className="text-purple-800">
        Še nimaš računa?{' '}
        <Link to="/register" className="text-purple-700 underline">
          Registriraj se
        </Link>
      </p>
    </div>
  );
}

export default Home;
