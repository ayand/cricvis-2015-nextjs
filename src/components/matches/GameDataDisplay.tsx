'use client';

import { useGameContext } from '../../contexts/GameContext';
import VerticalColorLegend from '../visualizations/VerticalColorLegend';
import Image from 'next/image';
import InningsChartsDisplay from '../utilities/InningsChartsDisplay';
import { calculateInningData } from '@/services/gameDataService';

const GameDataDisplay: React.FC = () => {
    const { gameInfo, flags, seeAllBalls } = useGameContext();

    const { balls: firstInningBalls, stats: firstInningStats, battingTeam: firstBattingTeam, overSummaries: firstDivision } = calculateInningData(gameInfo, 1)!;
    const { balls: secondInningBalls, stats: secondInningStats, battingTeam: secondBattingTeam, overSummaries: secondDivision } = calculateInningData(gameInfo, 2)!;

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
                                    src={flags[firstBattingTeam] || '/flags/default.png'}
                                    alt={`${firstBattingTeam} flag`}
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
                                1st Innings: {firstBattingTeam}
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
                                    src={flags[secondBattingTeam] || '/flags/default.png'}
                                    alt={`${secondBattingTeam} flag`}
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
                                2nd Innings: {secondBattingTeam}
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
