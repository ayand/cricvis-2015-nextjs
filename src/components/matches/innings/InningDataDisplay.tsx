'use client';

import { calculateInningData } from '@/services/gameDataService';
import { useGameContext } from '../../../contexts/GameContext';
import VerticalColorLegend from '../../visualizations/VerticalColorLegend';
import InningsChartsDisplay from '@/components/utilities/InningsChartsDisplay';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import OverTimeline from '@/components/visualizations/OverTimeline';
import InningStatisticsDisplays from './InningStatisticsDisplays';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

interface InningsDataDisplayProps {
    inning: number;
}

export default function InningsDataDisplay({ inning }: InningsDataDisplayProps) {
    const { gameInfo, flags, seeAllBalls } = useGameContext();

    const [chartView, setChartView] = useState<string>('Timeline');
    const chartViews = ['Timeline', 'Partner Matrix', 'Partner Bars'];
    
    // Add min and max state variables
    const [min, setMin] = useState<number>(1);
    const [max, setMax] = useState<number>(50);

    const { balls: inningBalls, stats: inningStats, battingTeam: inningBattingTeam, overSummaries: inningDivision } = calculateInningData(gameInfo, inning)!;

    // Reset min and max when inning changes (new page load)
    useEffect(() => {
        setMin(1);
        setMax(50);
    }, [inning]);

    // Calculate slider width to match SVG width (same as OverChart/OverSummaryChart)
    const height = 280;
    const convertDimension = (d: number) => ((d * height) / 450);
    const sliderWidth = convertDimension(720);

    const handleSliderChange = (value: number[]) => {
        setMin(value[0]);
        setMax(value[1]);
    };

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
                    {inning === 1 ? (
                        <>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="text-center mb-4">
                                    <div className="flex justify-center mb-3">
                                        <Image
                                            src={flags[inningBattingTeam] || '/flags/default.png'}
                                            alt={`${inningBattingTeam} flag`}
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
                                        {inning === 1 ? "1st" : "2nd"} Innings: {inningBattingTeam}
                                    </h3>
                                    <p className="text-xl font-bold text-gray-700">
                                        {inningStats.totalRuns}-{inningStats.totalWickets}
                                    </p>
                                </div>
                                <InningsChartsDisplay
                                    ballData={inningBalls}
                                    min={min}
                                    max={max}
                                    hoverswitch={true}
                                    overSummaries={inningDivision.map((ball, i) => ({ 'key': i, ...ball }))}
                                    team={inningBattingTeam}
                                    seeAllBalls={seeAllBalls}
                                />
                                <div className="mt-4 flex justify-center">
                                    <div style={{ width: `${sliderWidth}px` }}>
                                        <div className="text-center mt-1">
                                            <span className="text-md text-gray-500">Overs</span>
                                        </div>
                                        <br/>
                                        <DualRangeSlider
                                            min={1}
                                            max={50}
                                            value={[min, max]}
                                            onValueChange={handleSliderChange}
                                            className="w-full"
                                            label={(value) => value?.toString() || ''}
                                            labelPosition="bottom"
                                        />
                                    </div>
                                </div>
                            </div>
                            <InningStatisticsDisplays inning={inning} allBalls={gameInfo.balls} inningBalls={inningBalls} min={min} max={max} />
                        </>
                    ) : (
                        <>
                            <InningStatisticsDisplays inning={inning} allBalls={gameInfo.balls} inningBalls={inningBalls} min={min} max={max} />
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="text-center mb-4">
                                    <div className="flex justify-center mb-3">
                                        <Image
                                            src={flags[inningBattingTeam] || '/flags/default.png'}
                                            alt={`${inningBattingTeam} flag`}
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
                                        {inning === 1 ? "1st" : "2nd"} Innings: {inningBattingTeam}
                                    </h3>
                                    <p className="text-xl font-bold text-gray-700">
                                        {inningStats.totalRuns}-{inningStats.totalWickets}
                                    </p>
                                </div>
                                <InningsChartsDisplay
                                    ballData={inningBalls}
                                    min={min}
                                    max={max}
                                    hoverswitch={true}
                                    overSummaries={inningDivision.map((ball, i) => ({ 'key': i, ...ball }))}
                                    team={inningBattingTeam}
                                    seeAllBalls={seeAllBalls}
                                />
                                <div className="mt-4 flex justify-center">
                                    <div style={{ width: `${sliderWidth}px` }}>
                                        <div className="text-center mt-1">
                                            <span className="text-md text-gray-500">Overs</span>
                                        </div>
                                        <br/>
                                        <DualRangeSlider
                                            min={1}
                                            max={50}
                                            value={[min, max]}
                                            onValueChange={handleSliderChange}
                                            className="w-full"
                                            label={(value) => value?.toString() || ''}
                                            labelPosition="bottom"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
    )
}
