'use client';

import { useGameContext } from '../contexts/GameContext';
import OverChart from './OverChart';
import VerticalColorLegend from './VerticalColorLegend';
import Image from 'next/image';

const GameDataDisplay: React.FC = () => {
    const { gameInfo, players, flags, partnerships, images } = useGameContext();

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
                        
                        <div className="bg-white rounded p-4 border border-gray-200 flex justify-center">
                            <OverChart
                                val={firstInningBalls}
                                min={1}
                                max={50}
                                hoverswitch={true}
                            />
                        </div>
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
                        
                        <div className="bg-white rounded p-4 border border-gray-200 flex justify-center">
                            <OverChart
                                val={secondInningBalls}
                                min={1}
                                max={50}
                                hoverswitch={true}
                            />
                        </div>
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

            {/* Match Summary */}
            {/* <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Match Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">Total Balls:</span>
                        <span className="ml-2 text-gray-600">{gameInfo.balls.length}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Total Players:</span>
                        <span className="ml-2 text-gray-600">{Object.keys(players).length}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Partnerships:</span>
                        <span className="ml-2 text-gray-600">{partnerships.length}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Player Images:</span>
                        <span className="ml-2 text-gray-600">{Object.keys(images).length}</span>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default GameDataDisplay; 