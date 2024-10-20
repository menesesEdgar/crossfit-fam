import React from 'react';
import UnderConstruction from '../../assets/images/under_construction.jpg';
const Dashboard = () => {
  return (
    <div className="h-full bg-white rounded-lg p-4">
      <h1 className="text-xl font-bold text-orange-500 mb-2">Dashboard</h1>
      <div className="flex flex-col items-center justify-center mt-6">
        <p className="text-center md:text-lg xl:text-2xl text-stone-800 text-base font-semibold">
          ¡Estamos trabajando en esta sección!
        </p>
        <img
          src={UnderConstruction}
          alt="Under Construction"
          className="h-auto w-4/5 md:w-2/3 lg:w-1/2 xl:w-4/12 mx-auto"
        />
      </div>
    </div>
  );
};

export default Dashboard;
