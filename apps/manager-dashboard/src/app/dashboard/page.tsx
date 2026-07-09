import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          <p className="text-4xl mt-4 font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Pending AI Approvals</h2>
          <p className="text-4xl mt-4 font-bold text-yellow-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">At Risk Tasks</h2>
          <p className="text-4xl mt-4 font-bold text-red-600">1</p>
        </div>
      </div>
    </div>
  );
}
