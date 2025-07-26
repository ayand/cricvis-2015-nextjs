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
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  team1,
  team2,
  date,
  ground,
  result,
  onInningChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedInning, setSelectedInning] = useState<number>(1);

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
        <div className="flex space-x-2">
          <button className="btn btn-default">
            Ball-by-Ball Analysis
          </button>
          <button className="btn btn-default">
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

      {/* Team Flags */}
      {/* <div className="flex justify-center space-x-8 mt-6">
        <div className="text-center">
          <Image
            src={flags[team1] || '/flags/default.png'}
            alt={`${team1} flag`}
            width={50}
            height={50}
            className="border border-gray-300 rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/flags/default.png';
            }}
          />
          <p className="text-sm text-gray-600 mt-2">{team1}</p>
        </div>
        <div className="text-center">
          <Image
            src={flags[team2] || '/flags/default.png'}
            alt={`${team2} flag`}
            width={50}
            height={50}
            className="border border-gray-300 rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/flags/default.png';
            }}
          />
          <p className="text-sm text-gray-600 mt-2">{team2}</p>
        </div>
      </div> */}
    </div>
  );
};

export default MatchHeader; 