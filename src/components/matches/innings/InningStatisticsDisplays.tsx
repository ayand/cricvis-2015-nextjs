import { useState } from 'react';
import OverTimeline from '@/components/visualizations/OverTimeline';
import PartnershipBars from '@/components/visualizations/PartnershipBars';
import PartnershipMatrix from '@/components/visualizations/PartnershipMatrix';
import { BallData } from '@/models';
import { useGameContext } from '../../../contexts/GameContext';

interface InningStatisticsDisplaysProps {
    inning: number;
    allBalls: BallData[];
    inningBalls: BallData[];
    min: number;
    max: number;
}

export default function InningStatisticsDisplays({ inning, allBalls, inningBalls, min, max }: InningStatisticsDisplaysProps) {
    const { partnerships, gameInfo } = useGameContext();
    const [chartView, setChartView] = useState<string>('Timeline');
    const chartViews = ['Timeline', 'Partner Matrix', 'Partner Bars'];

    const firstBatsmenAlphabetical = gameInfo.first_batsmen;
    const secondBatsmenAlphabetical = gameInfo.second_batsmen;


    // Filter partnerships for the current inning
    const inningPartnerships = partnerships.filter(p => {
        // For inning 1, use partnerships from the first batting team
        // For inning 2, use partnerships from the second batting team
        const firstTeam = inningBalls[0]?.batting_team;
        const condition1 = p.team === firstTeam;
        const condition2 = inning === 1 ? firstBatsmenAlphabetical.indexOf(p.batsman_2) < firstBatsmenAlphabetical.indexOf(p.batsman_1) : secondBatsmenAlphabetical.indexOf(p.batsman_2) < secondBatsmenAlphabetical.indexOf(p.batsman_1);
        return condition1 && condition2;
    });

    inningPartnerships.sort((a, b) => {
        const referenceBatsmen = inning === 1 ? firstBatsmenAlphabetical : secondBatsmenAlphabetical;
        const indexA1 = referenceBatsmen.indexOf(a.batsman_1);
        const indexA2 = referenceBatsmen.indexOf(a.batsman_2);
        const indexB1 = referenceBatsmen.indexOf(b.batsman_1);
        const indexB2 = referenceBatsmen.indexOf(b.batsman_2);
        if (indexA1 === indexA2) {
            return indexB1 - indexB2;
        }
        return indexA1 - indexA2;
    });

    // Get batsmen for the current inning
    const currentBatsmen = inning === 1 ? firstBatsmenAlphabetical : secondBatsmenAlphabetical;

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex gap-2">
                    {chartViews.map((view) => (
                        <button
                            key={view}
                            className={`px-4 py-2 rounded font-medium transition-colors ${chartView === view
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            onClick={() => setChartView(view)}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
                <br />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{chartView === 'Timeline' ? (inning === 1 ? 'Timeline for Inning 1' : 'Timeline for Innings 1 and 2') : `Partnerships for Inning ${inning}`}</h3>
                <br />
                <br />
                <div className="bg-white rounded p-4 border border-gray-200 flex justify-center w-full">
                    {chartView === 'Timeline' ? (
                        <OverTimeline balls={inning === 1 ? inningBalls : allBalls} min={min} max={max} />
                    ) : chartView === 'Partner Matrix' ? (
                        <PartnershipMatrix partnerships={inningPartnerships} batsmen={currentBatsmen} balls={inningBalls} min={min} max={max} />
                    ) : chartView === 'Partner Bars' ? (
                        <PartnershipBars partnerships={inningPartnerships} balls={inningBalls} min={min} max={max} />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>Visualization not available...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
