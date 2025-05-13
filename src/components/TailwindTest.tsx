import React from 'react';

export default function TailwindTest() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Tailwind Test
          </div>
          <p className="mt-2 text-slate-500">
            This is a test component to verify Tailwind CSS is working properly.
          </p>
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Test Button
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-red-500 h-20 rounded"></div>
            <div className="bg-green-500 h-20 rounded"></div>
            <div className="bg-blue-500 h-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 