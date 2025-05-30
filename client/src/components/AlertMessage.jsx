function AlertMessage({ message, type, darkMode }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className={`rounded px-4 py-2 mb-4 ${
      isSuccess 
        ? darkMode ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-700 border border-green-400'
        : darkMode ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-700 border border-red-400'
    }`}>
      {message}
    </div>
  );
}

export default AlertMessage;