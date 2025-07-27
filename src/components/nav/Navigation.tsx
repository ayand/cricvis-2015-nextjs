'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className="flex space-x-4">
      <Link
        href="/tournament"
        className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
          isActive('/tournament') 
            ? 'bg-white text-gray-900' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        Tournament View
      </Link>
      <Link
        href="/matches"
        className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
          isActive('/matches') 
            ? 'bg-white text-gray-900' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        Match Analysis
      </Link>
      <Link
        href="/matchups"
        className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
          isActive('/matchups') 
            ? 'bg-white text-gray-900' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        Player Matchup
      </Link>
    </nav>
  );
};

export default Navigation; 