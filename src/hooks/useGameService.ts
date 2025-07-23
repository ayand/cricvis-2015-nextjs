import { useState, useCallback } from 'react';
import GameService from '../services/gameService';
import { Ball, Player, Match, Partnership, RegionParams, MatchesByTeam } from '../models';

// Hook return type
interface UseGameServiceReturn {
  loading: boolean;
  error: string | null;
  clearError: () => void;
  
  // Service methods with loading states
  getGameInfo: (id: string) => Promise<Ball[]>;
  getPlayers: () => Promise<Player[]>;
  getPlayerImages: () => Promise<Record<string, string>>;
  getFlagImages: () => Promise<Record<string, string>>;
  getGames: () => Promise<Match[]>;
  getPlayerList: () => Promise<Player[]>;
  getBallsByBatsman: (batsman: string) => Promise<Ball[]>;
  getBallsByBowler: (bowler: string) => Promise<Ball[]>;
  getMatchesByTeam: (team: string) => Promise<MatchesByTeam>;
  getPlayersByTeam: (team: string) => Promise<Player[]>;
  getPlayerGraph: () => Promise<any>;
  getPartnerships: (id: string) => Promise<Partnership[]>;
  getBracketInfo: () => Promise<any>;
  getAllBalls: () => Promise<Ball[]>;
  getBallsByRegion: (params: RegionParams) => Promise<Ball[]>;
}

export const useGameService = (): UseGameServiceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeServiceMethod = useCallback(async <T>(
    serviceMethod: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serviceMethod();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    
    getGameInfo: useCallback((id: string) => 
      executeServiceMethod(() => GameService.getGameInfo(id)), [executeServiceMethod]),
    
    getPlayers: useCallback(() => 
      executeServiceMethod(() => GameService.getPlayers()), [executeServiceMethod]),
    
    getPlayerImages: useCallback(() => 
      executeServiceMethod(() => GameService.getPlayerImages()), [executeServiceMethod]),
    
    getFlagImages: useCallback(() => 
      executeServiceMethod(() => GameService.getFlagImages()), [executeServiceMethod]),
    
    getGames: useCallback(() => 
      executeServiceMethod(() => GameService.getGames()), [executeServiceMethod]),
    
    getPlayerList: useCallback(() => 
      executeServiceMethod(() => GameService.getPlayerList()), [executeServiceMethod]),
    
    getBallsByBatsman: useCallback((batsman: string) => 
      executeServiceMethod(() => GameService.getBallsByBatsman(batsman)), [executeServiceMethod]),
    
    getBallsByBowler: useCallback((bowler: string) => 
      executeServiceMethod(() => GameService.getBallsByBowler(bowler)), [executeServiceMethod]),
    
    getMatchesByTeam: useCallback((team: string) => 
      executeServiceMethod(() => GameService.getMatchesByTeam(team)), [executeServiceMethod]),
    
    getPlayersByTeam: useCallback((team: string) => 
      executeServiceMethod(() => GameService.getPlayersByTeam(team)), [executeServiceMethod]),
    
    getPlayerGraph: useCallback(() => 
      executeServiceMethod(() => GameService.getPlayerGraph()), [executeServiceMethod]),
    
    getPartnerships: useCallback((id: string) => 
      executeServiceMethod(() => GameService.getPartnerships(id)), [executeServiceMethod]),
    
    getBracketInfo: useCallback(() => 
      executeServiceMethod(() => GameService.getBracketInfo()), [executeServiceMethod]),
    
    getAllBalls: useCallback(() => 
      executeServiceMethod(() => GameService.getAllBalls()), [executeServiceMethod]),
    
    getBallsByRegion: useCallback((params: RegionParams) => 
      executeServiceMethod(() => GameService.getBallsByRegion(params)), [executeServiceMethod]),
  };
};

export default useGameService; 