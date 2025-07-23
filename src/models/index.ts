// Types for the cricket data
export interface Ball {
  id: string;
  matchId: string;
  innings: number;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  extras: number;
  wickets: number;
  [key: string]: any; // For additional properties
}

// New interfaces for matches_by_team.json structure
export interface BallData {
  "": string; // Ball identifier
  inning: number;
  ball_speed: number;
  ended_x: number;
  ended_y: number;
  bowler_name: string;
  bowling_team: string;
  who_out: string;
  wicket: boolean;
  extras: number;
  runs_batter: number;
  landing_y: number;
  landing_x: number;
  ovr: number;
  non_striker: string;
  batsman: number;
  control: number;
  batting_team: string;
  x: number;
  bat_right_handed: string;
  runs_w_extras: number;
  batsman_name: string;
  bowler: number;
  ball_within_over: number;
  wicket_method: string;
  game: number;
  extras_type: string;
  y: number;
  cumul_runs: number;
  z: number;
}

export interface MatchBallGroup {
  key: string; // Match ID
  values: BallData[];
  date: string;
  opponent: string;
  winning_team: string;
}

export interface MatchesByTeam {
  batting_balls: MatchBallGroup[];
  bowling_balls: MatchBallGroup[];
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role?: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  venue: string;
  result: string;
  [key: string]: any;
}

export interface Partnership {
  batsman1: string;
  batsman2: string;
  runs: number;
  balls: number;
  [key: string]: any;
}

export interface RegionParams {
  leftX: number;
  rightX: number;
  topY: number;
  bottomY: number;
  xName: string;
  yName: string;
} 