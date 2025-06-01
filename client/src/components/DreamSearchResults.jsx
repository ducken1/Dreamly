import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import EntryCard from './EntryCard';

function DreamSearchResults() {
  const { emoji } = useParams();
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  // fetchDreams zdaj s useCallback, da jo lahko pokličemo tudi iz onDelete
  const fetchDreams = useCallback(async () => {
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
      const q = emoji ? query(entriesRef, where('emoji', '==', emoji)) : query(entriesRef);
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
  }, [auth, db, emoji]);

  useEffect(() => {
    fetchDreams();
  }, [fetchDreams]);

  // Funkcija za brisanje vnosa direktno tukaj
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Ali res želite izbrisati ta vnos?');
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Uporabnik ni prijavljen.');
        setLoading(false);
        return;
      }
      const docRef = doc(db, 'users', user.uid, 'entries', id);
      await deleteDoc(docRef);

      // Osveži seznam sanj po brisanju
      await fetchDreams();

    } catch (err) {
      console.error('Napaka pri brisanju vnosa:', err);
      setError('Prišlo je do napake pri brisanju vnosa.');
    }

    setLoading(false);
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

  return (
    <div className="min-h-screen px-6 py-8 bg-purple-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-6">
          Sanje{emoji ? ` z emotikonom:` : ':'} {emoji && <span className="text-4xl">{emoji}</span>}
        </h2>

        <div className="grid gap-4">
          {dreams.map((entry) => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              darkMode={false} 
              onEdit={() => navigate('/dashboard', { state: { editId: entry.id } })}
              onDelete={() => handleDelete(entry.id)} 
            />
          ))}
        </div>

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
