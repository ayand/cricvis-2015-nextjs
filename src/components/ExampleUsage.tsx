'use client';

import { useState, useEffect } from 'react';
import useGameService from '../hooks/useGameService';
import { Match, Player } from '../models';

export default function ExampleUsage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const { loading, error, getGames, getPlayers } = useGameService();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [matchesData, playersData] = await Promise.all([
          getGames(),
          getPlayers()
        ]);
        
        // Ensure we have arrays, fallback to empty arrays if not
        setMatches(Array.isArray(matchesData) ? matchesData : []);
        setPlayers(Array.isArray(playersData) ? playersData : []);
      } catch (err) {
        console.error('Failed to load data:', err);
        // Set empty arrays on error to prevent runtime errors
        setMatches([]);
        setPlayers([]);
      }
    };

    loadData();
  }, [getGames, getPlayers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Ensure we have arrays before rendering
  const safeMatches = Array.isArray(matches) ? matches : [];
  const safePlayers = Array.isArray(players) ? players : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Matches ({safeMatches.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safeMatches.slice(0, 6).map((match) => (
            <div key={match.match_id} className="bg-white p-4 rounded-lg">
              <h3 className="font-bold">{match.team1_name} vs {match.team2_name}</h3>
              <p className="text-sm text-gray-600">{match.date}</p>
              <p className="text-sm text-gray-600">{match.ground_name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Players ({safePlayers.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safePlayers.slice(0, 6).map((player) => (
            <div key={player.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{player.name}</h3>
              <p className="text-sm text-gray-600">{player.team}</p>
              <p className="text-sm text-gray-600">{player.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 