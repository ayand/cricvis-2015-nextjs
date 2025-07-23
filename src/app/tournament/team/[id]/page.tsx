import { GameService } from '../../../../services/gameService';
import TournamentOverview from '../../../../components/TournamentOverview';
import VerticalColorLegend from '../../../../components/VerticalColorLegend';
import TeamPageClient from '../../../../components/TeamPageClient';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;

  // Fetch all data simultaneously
  const [matches, players, playerImages] = await Promise.all([
    GameService.getMatchesByTeam(id),
    GameService.getPlayersByTeam(id),
    GameService.getPlayerImages()
  ]);

  const teams: Record<string, string> = {
    afghanistan: "Afghanistan",
    australia: "Australia",
    bangladesh: "Bangladesh",
    england: "England", 
    india: "India",
    ireland: "Ireland",
    nz: "New Zealand",
    pakistan: "Pakistan",
    scotland: "Scotland",
    sa: "South Africa",
    sl: "Sri Lanka",
    uae: "United Arab Emirates",
    wi: "West Indies",
    zimbabwe: "Zimbabwe"
  };

  return (
    <div className="mt-8">
        <TeamPageClient
          matches={matches}
          players={players}
          playerImages={playerImages}
          teamName={teams[id]}
        />
      </div>
  );
} 