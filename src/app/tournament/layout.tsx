'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '../../components/utilities/LoadingSpinner';

interface Team {
  team: string;
  image: string;
  key: string;
}

export default function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const teams: Team[] = [
    {
      team: "Afghanistan",
      image: "/flags/afghanistan.png",
      key: "afghanistan"
    },
    {
      team: "Australia", 
      image: "/flags/australia.png",
      key: "australia"
    },
    {
      team: "Bangladesh",
      image: "/flags/bangladesh.png", 
      key: "bangladesh"
    },
    {
      team: "England",
      image: "/flags/england.png",
      key: "england"
    },
    {
      team: "India",
      image: "/flags/india.png",
      key: "india"
    },
    {
      team: "Ireland",
      image: "/flags/ireland.png",
      key: "ireland"
    },
    {
      team: "New Zealand",
      image: "/flags/new_zealand.png",
      key: "nz"
    },
    {
      team: "Pakistan",
      image: "/flags/pakistan.png",
      key: "pakistan"
    },
    {
      team: "Scotland",
      image: "/flags/scotland.png",
      key: "scotland"
    },
    {
      team: "South Africa",
      image: "/flags/south_africa.png",
      key: "sa"
    },
    {
      team: "Sri Lanka",
      image: "/flags/sri_lanka.png",
      key: "sl"
    },
    {
      team: "United Arab Emirates",
      image: "/flags/uae.png",
      key: "uae"
    },
    {
      team: "West Indies",
      image: "/flags/west_indies.png",
      key: "wi"
    },
    {
      team: "Zimbabwe",
      image: "/flags/zimbabwe.png",
      key: "zimbabwe"
    }
  ];

  const handleTeamSelect = (team: Team) => {
    // setSelectedTeam(team.team);
    setIsLoading(true);
    console.log('Selected team:', team.team);
    router.push(`/tournament/team/${team.key}`);
  };

  // Extract team ID from pathname for highlighting
  const currentTeamId = pathname.includes('/team/') ? pathname.split('/team/')[1] : null;

  // Reset loading state when pathname changes (page loads)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-8xl mx-auto">
        <div className="p-10">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Tournament Analysis</h3>
            
            <h4 className="text-lg font-semibold text-gray-700 mb-8">Select a team to analyze</h4>
            
            <div className="team-list mb-8">
              <div className="bg-gray-400 p-4 rounded-lg">
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {teams.map((team) => (
                    <div
                      key={team.key}
                      onClick={() => handleTeamSelect(team)}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-200 rounded p-3 min-w-[100px] ${
                        team.key === currentTeamId
                          ? 'bg-black text-white font-bold' 
                          : 'bg-gray-400 text-black hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <h6 className="text-sm font-medium mb-2">{team.team}</h6>
                        <img
                          src={team.image}
                          alt={`${team.team} flag`}
                          className="mx-auto block"
                          style={{ height: '50px', width: 'auto' }}
                          onError={(e) => {
                            // Fallback to a generic flag if image fails to load
                            e.currentTarget.src = '/flags/australia.png';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Render the nested route content */}
            <div className="mt-8">
              {isLoading ? (
                <LoadingSpinner 
                  size="lg" 
                  text="Loading team data..." 
                  className="min-h-[200px]"
                />
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 