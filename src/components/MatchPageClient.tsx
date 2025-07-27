'use client';

import { useState } from 'react';
import MatchHeader from './MatchHeader';
import { GameInfo, Partnership, PlayerInfo } from '@/models';
import { GameProvider } from '../contexts/GameContext';

interface MatchPageClientProps {
  gameInfo: GameInfo;
  players: PlayerInfo;
  flags: Record<string, string>;
  partnerships: Partnership[];
  images: Record<string, string>;
  team1: string;
  team2: string;
  date: string;
  ground: string;
  result: string;
  children?: React.ReactNode;
}

const MatchPageClient: React.FC<MatchPageClientProps> = ({
  gameInfo,
  players,
  flags,
  partnerships,
  images,
  team1,
  team2,
  date,
  ground,
  result,
  children
}) => {
  const [selectedInning, setSelectedInning] = useState<number>(0);

  const handleInningChange = (inning: number) => {
    setSelectedInning(inning);
    console.log('Selected inning:', inning);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Match Header Component */}
      <div className="mb-8">
        <MatchHeader
          team1={team1}
          team2={team2}
          date={date}
          ground={ground}
          result={result}
          onInningChange={handleInningChange}
        />
      </div>

        {/* Inning Selection Display */}
        {/* <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">
            Currently viewing: Inning {selectedInning}
          </p>
        </div> */}
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Game Info</h2>
            <p className="text-sm text-gray-600">Balls: {gameInfo.balls.length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Players</h2>
            <p className="text-sm text-gray-600">Total: {Object.keys(players).length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Flags</h2>
            <p className="text-sm text-gray-600">Available: {Object.keys(flags).length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Partnerships</h2>
            <p className="text-sm text-gray-600">Total: {partnerships.length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Player Images</h2>
            <p className="text-sm text-gray-600">Available: {Object.keys(images).length}</p>
          </div>
        </div> */}

        {/* Children Content */}
        {children && (
          <div className="mt-8">
            <GameProvider
            gameInfo={gameInfo}
            players={players}
            flags={flags}
            partnerships={partnerships}
            images={images}
            >
                {children}
            </GameProvider>
            
          </div>
        )}
      </div>
  );
};

export default MatchPageClient; 