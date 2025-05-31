// src/components/DreamEntryForm.jsx

import { useState, useEffect, useRef } from 'react';

function DreamEntryForm({
  editingEntry,
  onSubmit,
  onCancel,
  darkMode
}) {
  // ─── 1) Stanja za obeh textarea in emoji ───
  const [dream, setDream] = useState(editingEntry?.dream || '');
  const [events, setEvents] = useState(editingEntry?.events || '');
  const [selectedEmoji, setSelectedEmoji] = useState(editingEntry?.emoji || '');

  // ─── 2) Stanja za Speech Recognition ───
  const [activeField, setActiveField] = useState(null); // 'dream' | 'events' | null
  const activeFieldRef = useRef(activeField);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef(null);
  const nextFieldRef = useRef(null);

  // ─── 3) Sinhroniziramo activeField v ref, da onresult vedno bere zadnjo vrednost ───
  useEffect(() => {
    activeFieldRef.current = activeField;
  }, [activeField]);

  // ─── 4) Inicializiramo SpeechRecognition samo enkrat ob mountu ───
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition ni podprt v tem brskalniku.');
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // uporabljamo samo “končne” rezultate
    recognition.lang = 'sl-SI';
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (!finalTranscript.trim()) return;

      const field = activeFieldRef.current;
      if (field === 'dream') {
        setDream(prev => prev + finalTranscript);
      } else if (field === 'events') {
        setEvents(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognition.stop();
    };

    recognition.onend = () => {
      if (nextFieldRef.current) {
        const fieldToStart = nextFieldRef.current;
        nextFieldRef.current = null;
        setActiveField(fieldToStart);
        recognition.start();
      } else {
        setActiveField(null);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []); // [] → enkrat ob mountu

  // ─── 5) Če je editingEntry, napolnimo polja; sicer počistimo ───
  useEffect(() => {
    if (editingEntry) {
      setDream(editingEntry.dream || '');
      setEvents(editingEntry.events || '');
      setSelectedEmoji(editingEntry.emoji || '');
    } else {
      setDream('');
      setEvents('');
      setSelectedEmoji('');
    }
  }, [editingEntry]);

  // ─── 6) toggleListening preklaplja snemanje med ‘dream’ in ‘events’ ───
  const toggleListening = (field) => {
    if (!recognitionSupported) {
      alert('Vaš brskalnik ne podpira govornega vnosa.');
      return;
    }
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Če že poslušamo na tem polju, ustavimo snemanje
    if (activeField === field) {
      recognition.stop();
      return;
    }

    // Če poslušamo na drugem polju, želimo preklopiti
    if (activeField && activeField !== field) {
      nextFieldRef.current = field;
      recognition.stop();
      return;
    }

    // Če trenutno ne poslušamo (activeField === null), začnemo snemati
    setActiveField(field);
    recognition.start();
  };

  // ─── 7) Po kliku “Shrani vnos” pošljemo podatke, potem počistimo ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dream.trim()) {
      throw new Error('Polje za sanje je obvezno.');
    }
    const entryData = { dream, emoji: selectedEmoji, events };
    setDream('');
    setEvents('');
    setSelectedEmoji('');
    await onSubmit(entryData);
  };

  // ─── 8) “Prekliči urejanje” počisti vse in pokliče onCancel ───
  const handleCancel = () => {
    setDream('');
    setEvents('');
    setSelectedEmoji('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* ───── “Kaj ste sanjali?” z ikono mikrofona na dnu ───── */}
      <div className="relative">
        <textarea
          placeholder="Kaj ste sanjali?"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          className={`p-3 rounded border w-full text-black placeholder:text-black ${
            darkMode ? 'bg-gray-700 text-gray-100 placeholder:text-gray-400' : 'bg-white'
          }`}
          rows={3}
          required
        />
        {/* Namesto top-2 zdaj bottom-2 → gumb bo v spodnjem desnem kotu */}
        <button
          type="button"
          onClick={() => toggleListening('dream')}
          title={activeField === 'dream' ? 'Ustavi snemanje' : 'Začni snemanje'}
          className={`
            absolute bottom-3 right-1
            p-2 rounded-full
            focus:outline-none
            transition
            ${
              activeField === 'dream'
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode
                ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                : 'bg-purple-700 text-purple-800 hover:bg-purple-300'
            }
          `}
        >
          {/* Slika mikrofona iz public/mic.svg */}
          <img
            src="/mic.svg"
            alt="Mic"
            className="h-6 w-6"
          />
        </button>
      </div>

      {/* ───── “Pomembni dogodki...” z ikono mikrofona na dnu ───── */}
      <div className="relative">
        <textarea
          placeholder="Pomembni dogodki včerajšnjega dne"
          value={events}
          onChange={(e) => setEvents(e.target.value)}
          className={`p-3 rounded border w-full text-black placeholder:text-black ${
            darkMode ? 'bg-gray-700 text-gray-100 placeholder:text-gray-400' : 'bg-white'
          }`}
          rows={3}
        />
        <button
          type="button"
          onClick={() => toggleListening('events')}
          title={activeField === 'events' ? 'Ustavi snemanje' : 'Začni snemanje'}
          className={`
            absolute bottom-3 right-1
            p-2 rounded-full
            focus:outline-none
            transition
            ${
              activeField === 'events'
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode
                ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                : 'bg-purple-700 text-purple-800 hover:bg-purple-300'
            }
          `}
        >
          <img
            src="/mic.svg"
            alt="Mic"
            className="h-6 w-6"
          />
        </button>
      </div>

      {/* ───── Izbira emotikona ───── */}
      <div
        className={`mt-2 p-4 rounded-xl border ${
          darkMode
            ? 'bg-gray-800 border-gray-600 text-gray-300'
            : 'bg-purple-100 border-transparent text-purple-800'
        }`}
      >
        <p className="w-full font-semibold mb-2 text-sm">
          Kako si se počutil/a ob prebujanju?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['😄', '🙂', '😐', '😢', '😠', '😵'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-2xl p-2 rounded transition ${
                selectedEmoji === emoji
                  ? darkMode
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-400 text-white'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-600 text-gray-300'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* ───── Gumb “Shrani vnos” ───── */}
      <button
        type="submit"
        className={`py-2 mt-2 rounded text-white ${
          darkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {editingEntry ? 'Uredi vnos' : 'Shrani vnos'}
      </button>

      {/* ───── Gumb “Prekliči urejanje” ───── */}
      {editingEntry && (
        <button
          type="button"
          onClick={handleCancel}
          className="mt-2 py-2 rounded border border-red-500 text-red-500 bg-white hover:bg-red-100"
        >
          Prekliči urejanje
        </button>
      )}
    </form>
  );
}

export default DreamEntryForm;
