'use client';

import { useState } from 'react';
import TournamentOverview from '../visualizations/TournamentOverview';
import VerticalColorLegend from '../visualizations/VerticalColorLegend';
import PlayerGrid from '../utilities/PlayerGrid';
import { Player } from '../../models';

interface TeamPageClientProps {
  matches: any;
  players: Player[];
  playerImages: Record<string, string>;
  teamName: string;
}

const TeamPageClient: React.FC<TeamPageClientProps> = ({
  matches,
  players,
  playerImages,
  teamName
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentView, setCurrentView] = useState<'allBalls' | 'overSummaries'>('allBalls');

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const handlePlayerHover = (player: Player | null) => {
    setCurrentPlayer(player);
  };

  const handleViewChange = (view: 'allBalls' | 'overSummaries') => {
    setCurrentView(view);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {teamName}
        </h1>
        <h5 className="text-xl font-semibold text-gray-700">Tournament Analysis</h5>
      </div>
      <div className="mb-4 flex justify-center">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentView === 'allBalls'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleViewChange('allBalls')}
              >
                All Tournament Balls
              </button>
              <button
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentView === 'overSummaries'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleViewChange('overSummaries')}
              >
                Over Summaries
              </button>
            </div>
          </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Team Players Section - Left Column */}
        <div className="col-span-3">
          <PlayerGrid
            players={players}
            playerImages={playerImages}
            selectedPlayers={selectedPlayers}
            onPlayerSelect={handlePlayerSelect}
            onPlayerHover={handlePlayerHover}
            teamName={teamName}
          />
        </div>

        {/* Tournament Analysis Section - Center Column */}
        <div className="col-span-7">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="overflow-x-auto">
              <TournamentOverview
                data={matches}
                team={teamName}
                selectedPlayers={selectedPlayers}
                currentView={currentView}
                currentPlayer={currentPlayer}
              />
            </div>
          </div>
          
        </div>

        {/* Legend Section - Right Column */}
        <div className="col-span-2">
          <VerticalColorLegend />
        </div>
      </div>
    </div>
  );
};

export default TeamPageClient; 