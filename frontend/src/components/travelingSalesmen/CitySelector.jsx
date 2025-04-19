import React from 'react';

const CitySelector = ({ cities, homeCity, selectedCities, handleCityToggle, solveTSP }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-2 text-gray-300">Home City: {homeCity}</h2>
      <h3 className="text-xl font-medium mb-4 text-gray-300">Select Cities to Visit:</h3>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => handleCityToggle(city)}
            disabled={city === homeCity}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              selectedCities.includes(city)
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-400'
            } ${city === homeCity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 hover:text-gray-300'}`}
          >
            {city}
          </button>
        ))}
      </div>
      <button
        onClick={solveTSP}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:scale-105 transition"
      >
        Find Shortest Route
      </button>
    </>
  );
};

export default CitySelector;