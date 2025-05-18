import React from 'react';
import TaskBoard from '../components/TaskBoard';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-white">
        Task Board
      </h1>
      <div className="max-w-4xl mx-auto">
        <TaskBoard />
      </div>
    </div>
  );
};

export default Home;
