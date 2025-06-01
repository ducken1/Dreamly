import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function DreamSearchResults() {
  const { emoji } = useParams();
  const navigate = useNavigate(); // za preusmeritev
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    async function fetchDreams() {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError('Uporabnik ni prijavljen.');
        setDreams([]);
        setLoading(false);
        return;
      }

      try {
        const entriesRef = collection(db, 'users', user.uid, 'entries');

        let q;
        if (emoji) {
          q = query(entriesRef, where('emoji', '==', emoji));
        } else {
          q = query(entriesRef);
        }

        const querySnapshot = await getDocs(q);

        const dreamsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDreams(dreamsData);
      } catch (err) {
        console.error('Napaka pri nalaganju sanj:', err);
        setError('Prišlo je do napake pri nalaganju sanj.');
      }
      setLoading(false);
    }

    fetchDreams();
  }, [emoji, auth, db]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
        >
          Domov
        </button>
      </div>
    );
  }

  // Če ni najdenih sanj za emotikon, pokaži samo sporočilo in en gumb Domov (brez spodnjega gumba)
  if (emoji && dreams.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-8 bg-purple-50 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-6">
          Sanje z emotikonom: <span className="text-4xl">{emoji}</span>
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Ni najdenih sanj za ta emotikon.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
        >
          Domov
        </button>
      </div>
    );
  }

  // Če ni emoji ali so najdene sanje, prikaži sanje in spodnji gumb Domov
  return (
    <div className="min-h-screen px-6 py-8 bg-purple-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-6">
          Sanje {emoji ? `z emotikonom: ` : 'uporabnika:'}{' '}
          {emoji && <span className="text-4xl">{emoji}</span>}
        </h2>

        <div className="grid gap-4">
          {dreams.map((entry) => (
            <div
              key={entry.id}
              className={`relative mb-3 p-6 rounded-2xl shadow-md border flex flex-col ${
                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
              } transition-all hover:shadow-lg`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(entry.createdAt)}
                  {entry.updatedAt && entry.updatedAt !== entry.createdAt ? ' (posodobljeno)' : ''}
                </p>
                <p className="text-2xl">{entry.emoji}</p>
              </div>

              <p className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">{entry.dream}</p>
              {entry.events && (
                <p className="text-sm text-gray-600 dark:text-gray-300">Dogodki: {entry.events}</p>
              )}
            </div>
          ))}
        </div>

        {/* Gumb Domov spodaj (samo če so sanje) */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
          >
            Domov
          </button>
        </div>
      </div>
    </div>
  );
}

export default DreamSearchResults;
