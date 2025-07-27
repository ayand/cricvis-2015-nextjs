import { GameService } from '../../../services/gameService';
import MatchPageClient from '../../../components/clients/MatchPageClient';

interface MatchLayoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

export default async function MatchLayout({ params, children }: MatchLayoutProps) {
  const { id } = await params;

  // Fetch all data in parallel
  const [gameInfo, players, flags, partnerships, images, games] = await Promise.all([
    GameService.getGameInfo(id),
    GameService.getPlayers(),
    GameService.getFlagImages(),
    GameService.getPartnerships(id),
    GameService.getPlayerImages(),
    GameService.getGames()
  ]);

  const game = games.find((game: any) => game.match_id.toString() === id)!;
  console.log(game);
  const date = game.date.split(" ")[0];
  const ground = game.ground_name;
  const team1 = game.team1_name;
  const team2 = game.team2_name;
  const result = game.result;

  return (
    <MatchPageClient
      gameInfo={gameInfo}
      players={players}
      flags={flags}
      partnerships={partnerships}
      images={images}
      team1={team1}
      team2={team2}
      date={date}
      ground={ground}
      result={result}
    >
      {children}
    </MatchPageClient>
  );
}
