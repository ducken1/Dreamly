// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DreamEntryForm from '../components/DreamEntryForm';
import EntriesList from '../components/EntriesList';
import AlertMessage from '../components/AlertMessage';
import { useDreamEntries } from '../hooks/useDreamEntries';
import MoodChart from '../components/MoodChart';
import TopMoodPerDayChart from '../components/TopMoodPerDayChart';
import { ShowNotification } from '../components/ShowNotification';


function Dashboard({ user, onLogout, darkMode, setDarkMode }) {
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  // Če urejamo, vsebuje objekt; če ne, je null → prazen obrazec
  const [editingEntry, setEditingEntry] = useState(null);

  // Poseben ključ, da vsakič remonta DreamEntryForm (= prazni fieldi)
  const [formKey, setFormKey] = useState(0);

  // Spremljamo online/offline, da prikažemo ustrezno obvestilo
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Nastavi darkMode ob prvem renderju glede na sistemsko nastavitev
  setDarkMode(darkModeMediaQuery.matches);

  // Poslušaj spremembe sistemske teme
  const handleChange = (e) => setDarkMode(e.matches);
  darkModeMediaQuery.addEventListener('change', handleChange);

  return () => darkModeMediaQuery.removeEventListener('change', handleChange);
}, [setDarkMode]);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  const {
    entries,
    loading,
    fetchError,
    addEntry,
    updateEntry,
    deleteEntry
  } = useDreamEntries(user);

  const handleSubmit = (entryData) => {
    // 1) Počistimo vsa sporočila
    setError('');
    setSuccess('');

    // 2) Takoj “odpovemo” editingEntry in remontaš formo
    //    (reakcija: key se spremeni => unmount + mount → DreamEntryForm je prazen)
    const wasEditing = Boolean(editingEntry);
    const entryId    = editingEntry?.id;
    setEditingEntry(null);
    setFormKey(prev => prev + 1);

    // 3) Počnemo dejanski add/update asinkrono (ne čakamo, da se obrazec spremeni)
    if (wasEditing) {
      // urejamo obstoječ vnos
      updateEntry(entryId, entryData)
        .then(() => {
          setSuccess('Vnos uspešno posodobljen!');
          ShowNotification('Sanjski dnevnik', 'Vnos uspešno posodobljen!');
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch((err) => {
          console.error('Napaka pri posodobitvi:', err);
          setError(err.message || 'Prišlo je do napake pri posodobitvi.');
        });
    } else {
      // ustvarjamo nov vnos (če smo offline, addEntry bo enqueue-ano)
      addEntry(entryData)
        .then(() => {
          setSuccess('Vnos uspešno shranjen!');
          ShowNotification('Sanjski dnevnik', 'Vnos uspešno shranjen!');
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch((err) => {
          console.error('Napaka pri shranjevanju:', err);
          setError(err.message || 'Prišlo je do napake pri shranjevanju.');
          ShowNotification('Sanjski dnevnik', 'Prišlo je do napake pri shranjevanju.');
        });
    }
  };

  const handleDelete = (id) => {
    deleteEntry(id)
      .then((deleted) => {
        if (deleted) {
          // če brišemo tisti, ki ga urejamo, odpovemo urejanje in remontaš
          if (editingEntry?.id === id) {
            setEditingEntry(null);
            setFormKey(prev => prev + 1);
          }
          setSuccess('Vnos je bil izbrisan.');
          ShowNotification('Sanjski dnevnik', 'Vnos uspešno izbrisan!');
          setTimeout(() => setSuccess(''), 3000);
        }
      })
      .catch((err) => {
        console.error('Napaka pri brisanju:', err);
        setError(err.message || 'Prišlo je do napake pri brisanju vnosa.');
      });
  };

  const handleEdit = (entry) => {
    // Preklopimo v “urejanje” za ta vnos
    setEditingEntry(entry);
    setError('');
    setSuccess('');
    // NE spreminjamo formKey, ker želimo obstoječe vrednosti v obrazcu
  };

  const handleCancelEdit = () => {
    // Prekličemo urejanje → remontaš formo, da je prazna
    setEditingEntry(null);
    setFormKey(prev => prev + 1);
    setError('');
    setSuccess('');
  };

  return (
    <div
      className={
        darkMode
          ? 'min-h-screen bg-gray-900 text-gray-100'
          : 'min-h-screen bg-purple-50 text-purple-900'
      }
    >
      <Navbar
        user={user}
        onLogout={onLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="p-8 max-w-7xl mx-auto flex justify-between gap-8 min-h-[80vh]">
        {/* Levi stolpec: obrazec + obvestila */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Nadzorna plošča</h2>
          <p className={darkMode ? 'mb-2 text-gray-300' : 'mb-2 text-purple-800'}>
            Dobrodošli nazaj,&nbsp;
            <span className="font-semibold">{user?.name || 'uporabnik'}</span>! Tukaj
            lahko zabeležiš svoje sanje in občutke.
          </p>

          {/* Offline banner */}
          {isOffline && (
            <AlertMessage
              message="Trenutno si offline. Vnos bo shranjen lokalno in sinhroniziran ob ponovni povezavi."
              type="success"
              darkMode={darkMode}
            />
          )}

          {/* Uspeh / napaka */}
          <AlertMessage message={success} type="success" darkMode={darkMode} />
          <AlertMessage message={error}   type="error"   darkMode={darkMode} />

          {/*
            DreamEntryForm z dinamičnim key:
            - Če urejamo (editingEntry ≠ null), key = editingEntry.id
            - Če ne (editingEntry === null), key = new-${formKey}
            Vsakič, ko kličeš setEditingEntry(null) in setFormKey(...), 
            se DreamEntryForm unmounta in remonta s praznim state-om.
          */}
          <DreamEntryForm
            key={editingEntry ? editingEntry.id : `new-${formKey}`}
            editingEntry={editingEntry}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            darkMode={darkMode}
          />
        </div>

        {/* Desni stolpec: seznam prejšnjih vnosov */}
        <EntriesList
          entries={entries}
          loading={loading}
          fetchError={fetchError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
      </div>

<div className="flex justify-center items-start px-4">
  <MoodChart entries={entries} darkMode={darkMode} />
  <TopMoodPerDayChart entries={entries} darkMode={darkMode} />
</div>



      

      <footer className="mt-8">
        <p className="text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} Dreamly. Vse pravice pridržane.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
