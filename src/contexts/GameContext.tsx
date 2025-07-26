'use client';

import React, { createContext, useContext } from 'react';
import { GameInfo, Partnership, PlayerInfo } from '@/models';

interface GameContextType {
  gameInfo: GameInfo;
  players: PlayerInfo;
  flags: Record<string, string>;
  partnerships: Partnership[];
  images: Record<string, string>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
  gameInfo: GameInfo;
  players: PlayerInfo;
  flags: Record<string, string>;
  partnerships: Partnership[];
  images: Record<string, string>;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  gameInfo,
  players,
  flags,
  partnerships,
  images
}) => {
  const value: GameContextType = {
    gameInfo,
    players,
    flags,
    partnerships,
    images
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 