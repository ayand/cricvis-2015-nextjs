'use client';

import { useGameContext } from '../contexts/GameContext';

const GameDataDisplay: React.FC = () => {
  const { gameInfo, players, flags, partnerships, images } = useGameContext();

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Game Data (via Context)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Game Info</h3>
          <p className="text-sm text-gray-600">Balls: {gameInfo.balls.length}</p>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Players</h3>
          <p className="text-sm text-gray-600">Total: {Object.keys(players).length}</p>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Flags</h3>
          <p className="text-sm text-gray-600">Available: {Object.keys(flags).length}</p>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Partnerships</h3>
          <p className="text-sm text-gray-600">Total: {partnerships.length}</p>
        </div>

        <div className="bg-white rounded p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Player Images</h3>
          <p className="text-sm text-gray-600">Available: {Object.keys(images).length}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Sample Data Preview</h3>
        <div className="bg-white rounded p-4 border border-gray-200 overflow-x-auto">
          <pre className="text-xs text-gray-600">
            {JSON.stringify({
              ballsCount: gameInfo.balls.length,
              playersCount: Object.keys(players).length,
              flagsCount: Object.keys(flags).length,
              partnershipsCount: partnerships.length,
              imagesCount: Object.keys(images).length
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GameDataDisplay; 