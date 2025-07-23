'use client';

import { useState, useEffect } from 'react';
import { GameService } from '../services/gameService';
import { Match } from '../models';

const MatchDropdown: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const games = await GameService.getGames();
        setMatches(games);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleMatchSelect = (match: Match) => {
    console.log('Selected match:', match);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="col-span-4">
        <button className="btn btn-success" disabled>
          Loading matches...
        </button>
      </div>
    );
  }

  return (
    <div className="col-span-4 dropdown">
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-success dropdown-toggle"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          Select A Match Here <span className="caret"></span>
        </button>
        {isOpen && (
          <ul className="dropdown-menu show max-h-48 overflow-y-auto" role="menu">
            {matches.map((match) => (
              <li
                key={match.match_id}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                role="menuitem"
                onClick={() => handleMatchSelect(match)}
              >
                <a>
                  {match.date.split(" ")[0] + " " + match.team1_name + " vs " + match.team2_name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MatchDropdown; 