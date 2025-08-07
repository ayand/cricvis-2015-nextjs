'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Player } from '../../models';
import { teamColors } from '@/lib/teamColors';

interface PlayerGridProps {
  players: Player[];
  playerImages: Record<string, string>;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onPlayerHover: (player: Player | null) => void;
  teamName: string;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  playerImages,
  selectedPlayers,
  onPlayerSelect,
  onPlayerHover,
  teamName
}) => {

  const normalStyling = {
    color: "black",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid white",
    borderRight: "1px solid white"
  };

  const selectedStyling = {
    color: "white",
    backgroundColor: teamColors[teamName] || "#80FF00",
    fontWeight: "bold" as const,
    borderLeft: "1px solid white",
    borderRight: "1px solid white"
  };

  const handlePlayerClick = (playerId: string) => {
    console.log(typeof playerId)
    console.log("Player clicked:", playerId);
    onPlayerSelect(playerId);
  };

  const handlePlayerHover = (player: Player | null) => {
    onPlayerHover(player);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h4 className="text-xl font-semibold text-gray-800 text-center mb-6">Team Players</h4>
      <div className="grid grid-cols-5 gap-2">
        {players.map((player) => {
          const isSelected = selectedPlayers.includes(player.id);
          // Fix the image path - remove /cleaned_info prefix and use correct path
          const imagePath = playerImages[player.name];
          const imageUrl = imagePath 
            ? imagePath.replace('/cleaned_info/players/', '/players/')
            : '/players/default.jpg';
          
          return (
            <div
              key={player.id}
              className="text-center cursor-pointer border border-gray-300 rounded p-2 transition-all duration-200"
              style={isSelected ? selectedStyling : normalStyling}
              onClick={() => handlePlayerClick(player.id)}
              onMouseEnter={() => handlePlayerHover(player)}
              onMouseLeave={() => handlePlayerHover(null)}
            >
              <div className="mb-2">
                <Image
                  src={imageUrl}
                  alt={player.name}
                  width={90}
                  height={90}
                  className="mx-auto rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/players/default.jpg';
                  }}
                />
              </div>
              <div className="text-sm font-medium">
                {player.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerGrid; 