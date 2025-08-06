'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MatchHeaderProps {
  team1: string;
  team2: string;
  date: string;
  ground: string;
  result: string;
  onInningChange: (inning: number) => void;
  seeAllBalls: boolean;
  onSeeAllBallsChange: () => void;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  team1,
  team2,
  date,
  ground,
  result,
  onInningChange,
  seeAllBalls,
  onSeeAllBallsChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [_selectedInning, setSelectedInning] = useState<number>(1);

  const handleInningSelect = (inning: number) => {
    setSelectedInning(inning);
    onInningChange(inning);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {team1} vs {team2}
      </h2>
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {date} - ({ground})
      </h3>
      <h3 className="text-xl font-bold text-gray-800 mb-5">
        {result}
      </h3>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Skyline of Overs</h3>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded font-medium transition-colors ${seeAllBalls
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => onSeeAllBallsChange()}
          >
            Ball-by-Ball Analysis
          </button>
          <button
            className={`px-4 py-2 rounded font-medium transition-colors ${!seeAllBalls
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => onSeeAllBallsChange()}
          >
            Over Summary
          </button>
        </div>

        <div className="dropdown">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-success dropdown-toggle"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              Inning Analysis <span className="caret"></span>
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu show" role="menu">
                <li
                  style={{ cursor: 'pointer' }}
                  role="menuitem"
                  onClick={() => handleInningSelect(1)}
                >
                  <a>Inning 1</a>
                </li>
                <li
                  style={{ cursor: 'pointer' }}
                  role="menuitem"
                  onClick={() => handleInningSelect(2)}
                >
                  <a>Inning 2</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader; 