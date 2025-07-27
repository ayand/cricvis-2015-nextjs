import { BallData, KeyedOverSummary } from "@/models";
import OverChart from "../visualizations/OverChart";
import OverSummaryChart from "../visualizations/OverSummaryChart";

interface InningsChartsDisplayProps {
    ballData: BallData[];
    min: number;
    max: number;
    hoverswitch: boolean;
    overSummaries: KeyedOverSummary[];
    team: string;
    seeAllBalls: boolean;
}

const InningsChartsDisplay: React.FC<InningsChartsDisplayProps> = ({ ballData, min, max, hoverswitch, overSummaries, team, seeAllBalls }) => {
    return (
        <div className="bg-white rounded p-4 border border-gray-200 flex justify-center">
            {seeAllBalls ? (
                <OverChart
                    val={ballData}
                    min={min}
                    max={max}
                    hoverswitch={hoverswitch}
                />
            ) : (
                <OverSummaryChart
                    val={overSummaries}
                    team={team}
                    min={min}
                    max={max}
                />
            )}
        </div>
    )
}

export default InningsChartsDisplay;
