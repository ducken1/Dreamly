import { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, getDocs, addDoc, Timestamp, 
  doc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useDreamEntries = (user) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Nalaganje vnosov
  const fetchEntries = async () => {
    if (!user || !user.uid) return;

    setLoading(true);
    setFetchError('');

    try {
      const entriesRef = collection(db, `users/${user.uid}/entries`);
      const q = query(entriesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEntries(docs);
    } catch (err) {
      console.error("Napaka pri pridobivanju vnosov: ", err);
      setFetchError('Napaka pri nalaganju prejšnjih vnosov.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setEntries([]);
    } else {
      fetchEntries();
    }
  }, [user]);

  // Dodaj nov vnos
  const addEntry = async (entryData) => {
    if (!user || !user.uid) {
      throw new Error('Uporabnik ni prijavljen.');
    }

    const entriesRef = collection(db, `users/${user.uid}/entries`);
    await addDoc(entriesRef, {
      ...entryData,
      favourite: false, // Novi vnosi privzeto niso priljubljeni
      createdAt: Timestamp.now()
    });

    await fetchEntries();
  };

  // Uredi vnos
  const updateEntry = async (id, entryData) => {
    if (!user || !user.uid) {
      throw new Error('Uporabnik ni prijavljen.');
    }

    const docRef = doc(db, `users/${user.uid}/entries`, id);
    await updateDoc(docRef, {
      ...entryData,
      updatedAt: Timestamp.now()
    });

    await fetchEntries();
  };

  // Toggle favourite status
  const toggleFavourite = async (id) => {
    if (!user || !user.uid) {
      throw new Error('Uporabnik ni prijavljen.');
    }

    try {
      // Najdi trenutni vnos v lokalnem state-u
      const currentEntry = entries.find(entry => entry.id === id);
      if (!currentEntry) {
        throw new Error('Vnos ni najden.');
      }

      // Posodobi v Firestore
      const docRef = doc(db, `users/${user.uid}/entries`, id);
      const newFavouriteStatus = !currentEntry.favourite;
      
      await updateDoc(docRef, {
        favourite: newFavouriteStatus,
        updatedAt: Timestamp.now()
      });

      // Posodobi lokalni state takoj za boljšo uporabniško izkušnjo
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === id 
            ? { ...entry, favourite: newFavouriteStatus }
            : entry
        )
      );

      return newFavouriteStatus;
    } catch (err) {
      console.error("Napaka pri posodobitvi priljubljenih: ", err);
      throw new Error('Prišlo je do napake pri posodobitvi priljubljenih.');
    }
  };

  // Izbriši vnos
  const deleteEntry = async (id) => {
    if (!user || !user.uid) return;

    const confirmDelete = window.confirm('Ali ste prepričani, da želite izbrisati ta vnos?');
    if (!confirmDelete) return false;

    try {
      const docRef = doc(db, `users/${user.uid}/entries`, id);
      await deleteDoc(docRef);
      await fetchEntries();
      return true;
    } catch (err) {
      console.error("Napaka pri brisanju: ", err);
      throw new Error('Prišlo je do napake pri brisanju vnosa.');
    }
  };

  return {
    entries,
    loading,
    fetchError,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavourite
  };
};