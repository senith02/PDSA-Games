import React, { useEffect, useRef } from 'react';

const PathVisualization = ({ results, homeCity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!results || !results.dynamicProgramming) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Set background
    ctx.fillStyle = '#1F2937'; // bg-gray-800
    ctx.fillRect(0, 0, width, height);

    // Define city positions in a heart-like shape
    const cityPositions = [
      { x: width * 0.3, y: height * 0.2 },  // Top left
      { x: width * 0.7, y: height * 0.2 },  // Top right
      { x: width * 0.9, y: height * 0.5 },  // Right
      { x: width * 0.7, y: height * 0.8 },  // Bottom right
      { x: width * 0.5, y: height * 0.9 },  // Bottom center
      { x: width * 0.3, y: height * 0.8 },  // Bottom left
      { x: width * 0.1, y: height * 0.5 },  // Left
    ];

    // Map cities to positions
    const path = results.dynamicProgramming.path; // e.g., ['A', 'B', 'A']
    const pathCities = path.slice(0, -1); // Exclude the last city (same as start)
    const cityMap = {};
    pathCities.forEach((city, index) => {
      cityMap[city] = cityPositions[index % cityPositions.length];
    });

    // Draw the path (dashed lines)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#60A5FA'); // blue-400
    gradient.addColorStop(1, '#9333EA'); // purple-600
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line
    ctx.beginPath();
    for (let i = 0; i < path.length - 1; i++) {
      const startCity = path[i];
      const endCity = path[i + 1];
      const startPos = cityMap[startCity];
      const endPos = cityMap[endCity];
      if (startPos && endPos) {
        if (i === 0) {
          ctx.moveTo(startPos.x, startPos.y);
        }
        ctx.lineTo(endPos.x, endPos.y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset dashed line

    // Draw cities as circles
    Object.entries(cityMap).forEach(([city, pos]) => {
      // Draw city circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = city === homeCity ? '#A855F7' : '#374151'; // purple-500 for home, gray-700 for others
      ctx.fill();
      ctx.strokeStyle = '#D1D5DB'; // gray-300
      ctx.stroke();

      // Draw city label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#60A5FA'; // text-blue-400
      ctx.textAlign = 'center';
      ctx.fillText(city, pos.x, pos.y + 5);
    });

    // Draw the salesman at the home city
    const homePos = cityMap[homeCity];
    if (homePos) {
      ctx.font = '30px Arial';
      ctx.fillStyle = '#FFFFFF'; // white
      ctx.fillText('🧳', homePos.x - 15, homePos.y + 40);
    }
  }, [results, homeCity]);

  return (
    <div className="flex-1">
      <h3 className="text-xl font-medium mb-2 text-gray-300">Shortest Path (Dynamic Programming):</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-700 rounded"
      />
    </div>
  );
};

export default PathVisualization;