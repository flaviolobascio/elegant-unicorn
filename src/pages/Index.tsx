import TurnSimulator from "@/components/TurnSimulator";
import React from 'react';

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <TurnSimulator />
    </div>
  );
};

export default Index;