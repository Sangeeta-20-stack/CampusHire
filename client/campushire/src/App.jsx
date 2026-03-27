import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind CSS is Working!</h1>
      <p className="text-gray-700">Click the button to test state:</p>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </button>
      <div className="w-40 h-40 bg-red-400 rounded shadow-lg"></div>
    </div>
  );
}

export default App;