import { BallData, OverSummary, GameInfo } from "@/models";

export const calculateOverSummaries = (balls: BallData[]): OverSummary[] => {
    const maxOvers = Math.floor(balls[balls.length - 1].ovr) + 1;
    const overSummaries: OverSummary[] = Array(maxOvers).fill(null).map(() => ({
        runs: 0,
        wickets: 0
    }));

    balls.forEach(ball => {
        const over = Math.floor(ball.ovr);
        const wicketAmount = (ball.wicket && ball.extras_type != "Nb" && ball.extras_type != "Wd") ? 1 : 0;
        overSummaries[over].runs += ball.runs_batter;
        overSummaries[over].wickets += wicketAmount;
    });

    return overSummaries;
};

export const calculateInningData = (gameInfo: GameInfo, inning: number) => {
    const inningBalls = gameInfo.balls.filter(ball => ball.inning === inning);
    
    if (inningBalls.length === 0) {
        return null;
    }

    const totalRuns = inningBalls[inningBalls.length - 1].cumul_runs;
    const totalWickets = inningBalls.filter(ball => 
        ball.wicket && ball.extras_type !== "Nb" && ball.extras_type !== "Wd"
    ).length;
    const battingTeam = inningBalls[0].batting_team;
    const overSummaries = calculateOverSummaries(inningBalls);

    return {
        balls: inningBalls,
        stats: { totalRuns, totalWickets },
        battingTeam,
        overSummaries
    };
};