import { BallData } from "@/models";

export const isWicketBall = (d: BallData): boolean => {
    return d.wicket === true && d.extras_type !== "Nb" && d.extras_type !== "Wd";
};

export const decideColor = (d: BallData): string => {
    if (isWicketBall(d)) {
        return "#F45333";
    } 
    if (d.runs_batter === 0 && d.extras_type !== "Wd" && d.extras_type !== "Nb") {
        return "#CCCCCC";
    }
    if (d.extras_type !== "") {
        return "#7BCCC4";
    }
    if (d.runs_batter < 4) {
        return "#43A2CA";
    }
    return "#0868AC";
};
