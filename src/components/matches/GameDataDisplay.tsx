'use client';

import { BallData, OverSummary } from '@/models';
import { useGameContext } from '../../contexts/GameContext';
import OverChart from '../visualizations/OverChart';
import VerticalColorLegend from '../visualizations/VerticalColorLegend';
import Image from 'next/image';
import OverSummaryChart from '../visualizations/OverSummaryChart';
import InningsChartsDisplay from '../utilities/InningsChartsDisplay';

const calculateOverSummaries = (balls: BallData[]): OverSummary[] => {
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

const GameDataDisplay: React.FC = () => {
    const { gameInfo, flags, seeAllBalls } = useGameContext();

    // Calculate runs and wickets for each inning
    const calculateInningStats = (inning: number) => {
        const inningBalls = gameInfo.balls.filter(ball => ball.inning === inning);
        const totalRuns = inningBalls[inningBalls.length - 1].cumul_runs;
        const totalWickets = inningBalls.filter(ball => ball.wicket == true && ball.extras_type != "Nb" && ball.extras_type != "Wd").length;
        return { totalRuns, totalWickets };
    };

    const firstInningStats = calculateInningStats(1);
    const secondInningStats = calculateInningStats(2);

    // Get team names from the first ball of each inning
    const firstInningTeam = gameInfo.balls.find(ball => ball.inning === 1)?.batting_team || '';
    const secondInningTeam = gameInfo.balls.find(ball => ball.inning === 2)?.batting_team || '';

    // Filter balls for each inning
    const firstInningBalls = gameInfo.balls.filter(ball => ball.inning === 1);
    const secondInningBalls = gameInfo.balls.filter(ball => ball.inning === 2);

    const firstDivision = calculateOverSummaries(firstInningBalls);
    const secondDivision = calculateOverSummaries(secondInningBalls);

    const firstBattingTeam = firstInningBalls[0].batting_team;
    const secondBattingTeam = secondInningBalls[0].batting_team;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                {/* Left Column - Inning Selection */}
                <div className="bg-white-50 rounded-lg p-4 flex flex-col justify-center">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-blue-800 mb-3">
                            Select Inning for Analysis
                        </h3>
                        <p className="text-blue-600 text-sm">
                            Choose an inning to explore detailed ball-by-ball statistics and performance metrics
                        </p>
                    </div>
                </div>

                {/* Middle Columns - OverCharts */}
                <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* First Innings */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-3">
                                <Image
                                    src={flags[firstInningTeam] || '/flags/default.png'}
                                    alt={`${firstInningTeam} flag`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="h-14 w-auto border border-gray-300 rounded shadow-sm"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/flags/default.png';
                                    }}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                1st Innings: {firstInningTeam}
                            </h3>
                            <p className="text-xl font-bold text-gray-700">
                                {firstInningStats.totalRuns}-{firstInningStats.totalWickets}
                            </p>
                        </div>
                        <InningsChartsDisplay
                            ballData={firstInningBalls}
                            min={1}
                            max={50}
                            hoverswitch={true}
                            overSummaries={firstDivision.map((ball, i) => ({ 'key': i, ...ball }))}
                            team={firstBattingTeam}
                            seeAllBalls={seeAllBalls}
                        />
                    </div>

                    {/* Second Innings */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-3">
                                <Image
                                    src={flags[secondInningTeam] || '/flags/default.png'}
                                    alt={`${secondInningTeam} flag`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="h-14 w-auto border border-gray-300 rounded shadow-sm"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/flags/default.png';
                                    }}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                2nd Innings: {secondInningTeam}
                            </h3>
                            <p className="text-xl font-bold text-gray-700">
                                {secondInningStats.totalRuns}-{secondInningStats.totalWickets}
                            </p>
                        </div>
                        <InningsChartsDisplay
                            ballData={secondInningBalls}
                            min={1}
                            max={50}
                            hoverswitch={true}
                            overSummaries={secondDivision.map((ball, i) => ({ 'key': i, ...ball }))}
                            team={secondBattingTeam}
                            seeAllBalls={seeAllBalls}
                        />
                    </div>
                </div>

                {/* Right Column - Color Legend */}
                <div className="flex justify-center">
                    <div className="scale-75">
                        <h2 className="text-2xl font-bold text-black mb-4 text-center">Color Legend</h2>
                        <VerticalColorLegend />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDataDisplay;
