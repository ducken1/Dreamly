import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DreamEntryForm from '../components/DreamEntryForm';
import EntriesList from '../components/EntriesList';
import AlertMessage from '../components/AlertMessage';
import { useDreamEntries } from '../hooks/useDreamEntries';
import MoodChart from '../components/MoodChart';

function Dashboard({ user, onLogout, darkMode, setDarkMode }) {
  // success / error alerts
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  // which entry we’re editing
  const [editingEntry, setEditingEntry] = useState(null);
  // track online/offline
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // listen for network changes
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

  // your data + background-sync hooks
  const {
    entries,
    loading,
    fetchError,
    addEntry,
    updateEntry,
    deleteEntry
  } = useDreamEntries(user);

  const handleSubmit = async (entryData) => {
    // clear old messages
    setError('');
    setSuccess('');

    if (!entryData.dream.trim()) {
      setError('Polje za sanje je obvezno.');
      return;
    }

    // OFFLINE: show same AlertMessage style, then queue the entry
    if (isOffline) {
      setSuccess(
        'Trenutno si offline. Vnos bo shranjen lokalno in sinhroniziran ob ponovni povezavi.'
      );
      setTimeout(() => setSuccess(''), 3000);

      try {
        await addEntry(entryData); // background‐sync queue
      } catch (bgErr) {
        console.warn('Napaka pri enqueue Background Sync:', bgErr);
      }

      setEditingEntry(null);
      return;
    }

    // ONLINE: normal save/update flow
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, entryData);
        setSuccess('Vnos uspešno posodobljen!');
      } else {
        await addEntry(entryData);
        setSuccess('Vnos uspešno shranjen!');
      }
      setEditingEntry(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Napaka pri shranjevanju:', err);
      setError(err.message || 'Prišlo je do napake pri shranjevanju.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleted = await deleteEntry(id);
      if (deleted) {
        if (editingEntry?.id === id) {
          setEditingEntry(null);
          setError('');
        }
        setSuccess('Vnos je bil izbrisan.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Napaka pri brisanju:', err);
      setError(err.message || 'Prišlo je do napake pri brisanju vnosa.');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
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
        {/* Left form container */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Nadzorna plošča</h2>
          <p className={darkMode ? 'mb-2 text-gray-300' : 'mb-2 text-purple-800'}>
            Dobrodošli nazaj,{' '}
            <span className="font-semibold">{user?.name || 'uporabnik'}</span>! Tukaj
            lahko zabeležiš svoje sanje in občutke.
          </p>

          {/* OFFLINE banner inlined here with same AlertMessage styling */}
          {isOffline && (
            <AlertMessage
              message="Trenutno si offline. Vnos bo shranjen lokalno in sinhroniziran ob ponovni povezavi."
              type="success"
              darkMode={darkMode}
            />
          )}

          {/* Success & error alerts */}
          <AlertMessage message={success} type="success" darkMode={darkMode} />
          <AlertMessage message={error}   type="error"   darkMode={darkMode} />

          <DreamEntryForm
            editingEntry={editingEntry}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            darkMode={darkMode}
          />
        </div>

        {/* Right sidebar */}
        <EntriesList
          entries={entries}
          loading={loading}
          fetchError={fetchError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          darkMode={darkMode}
        />
      </div>

      <div className="flex justify-center px-4">
        <MoodChart entries={entries} darkMode={darkMode} />
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
