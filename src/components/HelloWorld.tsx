import React from 'react';

const HelloWorld: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white p-4">
      <h1 className="text-6xl md:text-8xl font-bold animate-pulse">
        Ciao, Mondo!
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-center">
        Questa è la tua nuova app React pronta per GitHub Pages.
      </p>
      <div className="mt-8 text-5xl animate-bounce">
        🎉
      </div>
    </div>
  );
};

export default HelloWorld;