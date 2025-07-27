'use client';

import { useState } from 'react';
import MatchHeader from '../matches/MatchHeader';
import { GameInfo, Partnership, PlayerInfo } from '@/models';
import { GameProvider } from '../../contexts/GameContext';

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
  const [seeAllBalls, setSeeAllBalls] = useState<boolean>(true);

  const handleInningChange = (inning: number) => {
    setSelectedInning(inning);
    console.log('Selected inning:', inning);
  };

  const handleSeeAllBalls = () => {
    setSeeAllBalls(!seeAllBalls);
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
          seeAllBalls={seeAllBalls}
          onSeeAllBallsChange={handleSeeAllBalls}
        />
      </div>

        {/* Inning Selection Display */}
        {/* <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">
            Currently viewing: Inning {selectedInning}
          </p>
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
            seeAllBalls={seeAllBalls}
            >
                {children}
            </GameProvider>
            
          </div>
        )}
      </div>
  );
};

export default MatchPageClient; 