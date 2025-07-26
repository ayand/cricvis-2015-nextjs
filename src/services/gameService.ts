import {
  Ball,
  MatchesByTeam,
  Player,
  Match,
  Partnership,
  RegionParams,
  GameInfo,
  PlayerInfo
} from '../models';

// Base API configuration
const API_BASE_URL = 'https://bqit16poh0.execute-api.us-east-1.amazonaws.com/prod';
const LOCAL_DATA_URL = '/cleaned_info';

// Generic fetch wrapper with error handling
const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Local file fetch wrapper for server-side rendering
const fetchLocalFile = async <T>(filePath: string): Promise<T> => {
  try {
    // For server-side rendering, we need to use the full URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}${filePath}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching local file ${filePath}:`, error);
    throw error;
  }
};

// Game Service class
export class GameService {
  // Get specific game/match information by ID
  static async getGameInfo(id: string): Promise<GameInfo> {
    return fetchWithErrorHandling<GameInfo>(`${API_BASE_URL}/matches/${id}`);
  }

  // Get all players
  static async getPlayers(): Promise<PlayerInfo> {
    return fetchWithErrorHandling<PlayerInfo>(`${API_BASE_URL}/players`);
  }

  // Get player images from local data
  static async getPlayerImages(): Promise<Record<string, string>> {
    return fetchLocalFile<Record<string, string>>(`${LOCAL_DATA_URL}/playerImages.json`);
  }

  // Get flag images from local data
  static async getFlagImages(): Promise<Record<string, string>> {
    return fetchLocalFile<Record<string, string>>(`${LOCAL_DATA_URL}/flags.json`);
  }

  // Get all games/matches
  static async getGames(): Promise<Match[]> {
    return fetchWithErrorHandling<Match[]>(`${API_BASE_URL}/matches`);
  }

  // Get player list
  static async getPlayerList(): Promise<Player[]> {
    return fetchWithErrorHandling<Player[]>(`${API_BASE_URL}/players/list`);
  }

  // Get balls by specific batsman
  static async getBallsByBatsman(batsman: string): Promise<Ball[]> {
    return fetchWithErrorHandling<Ball[]>(`${API_BASE_URL}/matches/batsman/${encodeURIComponent(batsman)}`);
  }

  // Get balls by specific bowler
  static async getBallsByBowler(bowler: string): Promise<Ball[]> {
    return fetchWithErrorHandling<Ball[]>(`${API_BASE_URL}/matches/bowler/${encodeURIComponent(bowler)}`);
  }

  // Get matches by team
  static async getMatchesByTeam(team: string): Promise<MatchesByTeam> {
    return fetchWithErrorHandling<MatchesByTeam>(`${API_BASE_URL}/matches/team/${encodeURIComponent(team)}`);
  }

  // Get players by team
  static async getPlayersByTeam(team: string): Promise<Player[]> {
    return fetchWithErrorHandling<Player[]>(`${API_BASE_URL}/players/team/${encodeURIComponent(team)}`);
  }

  // Get player graph data
  static async getPlayerGraph(): Promise<any> {
    return fetchWithErrorHandling<any>(`${API_BASE_URL}/players/graph`);
  }

  // Get partnerships for a specific match
  static async getPartnerships(id: string): Promise<Partnership[]> {
    return fetchWithErrorHandling<Partnership[]>(`${API_BASE_URL}/matches/${id}/partnerships`);
  }

  // Get bracket/tournament stage information
  static async getBracketInfo(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/cricket_stages.json`);
  }

  // Get teams data from local file
  static async getTeams(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/teams.json`);
  }

  // Get grounds data from local file
  static async getGrounds(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/grounds.json`);
  }

  // Get games data from local file
  static async getGamesLocal(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/games.json`);
  }

  // Get matches data from local file
  static async getMatchesLocal(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/matches.json`);
  }

  // Get players data from local file
  static async getPlayersLocal(): Promise<any> {
    return fetchLocalFile<any>(`${LOCAL_DATA_URL}/players.json`);
  }

  // Get all balls data
  static async getAllBalls(): Promise<Ball[]> {
    return fetchWithErrorHandling<Ball[]>(`${API_BASE_URL}/matches/allBalls`);
  }

  // Get balls by region with parameters
  static async getBallsByRegion(params: RegionParams): Promise<Ball[]> {
    const queryParams = new URLSearchParams({
      leftX: params.leftX.toString(),
      rightX: params.rightX.toString(),
      topY: params.topY.toString(),
      bottomY: params.bottomY.toString(),
      xName: params.xName,
      yName: params.yName
    });

    return fetchWithErrorHandling<Ball[]>(`${API_BASE_URL}/balls/?${queryParams.toString()}`);
  }

}

// Export default instance for convenience
export default GameService; 