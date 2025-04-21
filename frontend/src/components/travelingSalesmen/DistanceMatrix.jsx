import React from 'react';

const DistanceMatrix = ({ matrix, cities }) => {
  return (
    <div className="flex-1">
      <h3 className="text-xl font-medium mb-2 text-gray-300">Distance Matrix (km):</h3>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2 text-gray-300"></th>
              {cities.map(city => (
                <th key={city} className="border border-gray-700 px-4 py-2 text-gray-300">
                  {city}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-700 px-4 py-2 font-medium text-gray-300">
                  {cities[i]}
                </td>
                {row.map((dist, j) => (
                  <td key={j} className="border border-gray-700 px-4 py-2 text-gray-400">
                    {dist}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistanceMatrix;