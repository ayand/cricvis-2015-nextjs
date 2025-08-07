'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BallData, MatchBallGroup, MatchesByTeam, Player } from '../../models';
import { decideColor } from '@/services/ballService';
import { teamColors } from '@/lib/teamColors';

interface TournamentOverviewProps {
  data: MatchesByTeam;
  team: string;
  selectedPlayers: string[];
  currentView: 'allBalls' | 'overSummaries';
  currentPlayer: Player | null;
}

export default function TournamentOverview({
  data,
  team,
  selectedPlayers,
  currentView,
  currentPlayer
}: TournamentOverviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const visRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);

  const yDimension = 830;
  const xDimension = 1075;

  // Static visualization setup - runs only once
  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const specialCases = ["Australia", "Bangladesh"];

    const getIndex = (i: number) => {
      if (i > 0 && specialCases.includes(team)) {
        return i + 1;
      }
      return i;
    };

    const getStage = (i: number) => {
      const groupLimit = (specialCases.includes(team)) ? 4 : 5;
      if (i <= groupLimit) {
        return "Group";
      } else if (i === groupLimit + 1) {
        return "Quarter-Final";
      } else if (i === groupLimit + 2) {
        return "Semi-Final";
      }
      return "Final";
    };

    const vis = d3.select(svgRef.current)
      .append("svg")
      .attr("width", xDimension)
      .attr("height", yDimension);

    visRef.current = vis;

    vis.append("rect")
      .attr("width", xDimension)
      .attr("height", yDimension)
      .attr("fill", "white")
      .style("stroke", "black");

    const overs: string[] = [];
    for (let i = 1; i <= 50; i++) {
      overs.push(i.toString());
    }

    const firstInningScale = d3.scaleBand().domain(overs).range([370, 40]);
    const secondInningScale = d3.scaleBand().domain(overs).range([460, 800]);

    const matchScale = d3.scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8].map(String))
      .range([50, xDimension - 10])
      .paddingInner(0.05);

    vis.append("text")
      .attr("x", 45)
      .attr("y", 30)
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .text("Inning 1");

    vis.append("text")
      .attr("x", 45)
      .attr("y", 820)
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .text("Inning 2");

    const maxBattingSize: Record<string, number> = {};
    const maxBowlingSize: Record<string, number> = {};
    const overScores: number[] = [];
    const overLengths: number[] = [];

    data.batting_balls.forEach((d: any) => {
      const oversMap = d3.group(d.values, (ball: any) => Math.floor(ball.ovr));
      const overs = Array.from(oversMap, ([key, values]) => ({ key, values }));
      
      const maxOverLength = d3.max(overs, (over: any) => over.values.length) ?? 0;
      
      overs.forEach((over: any) => {
        const maxScore = d3.max(over.values, (v: any) => Number(v.cumul_runs)) ?? 0;
        overScores.push(maxScore);
      });

      const bandwidth = Number(matchScale.bandwidth());
      maxBattingSize[d.key] = bandwidth / maxOverLength;
      
      overLengths.push(maxOverLength);
    });

    data.bowling_balls.forEach((d: any) => {
      const oversMap = d3.group(d.values, (ball: any) => Math.floor(ball.ovr));
      const overs = Array.from(oversMap, ([key, values]) => ({ key, values }));
      
      const maxOverLength = d3.max(overs, (over: any) => over.values.length) ?? 0;
      
      overs.forEach((over: any) => {
        const maxScore = d3.max(over.values, (v: any) => Number(v.cumul_runs)) ?? 0;
        overScores.push(maxScore);
      });

      const bandwidth = Number(matchScale.bandwidth());
      maxBowlingSize[d.key] = bandwidth / maxOverLength;
      
      overLengths.push(maxOverLength);
    });

    const maxOverLength = d3.max(overLengths) || 1;
    const finalBallWidth = matchScale.bandwidth() / maxOverLength;

    // Create batting matches
    const battingMatch = vis.selectAll(".battingMatch")
      .data(data.batting_balls)
      .enter().append("g")
      .attr("class", "battingMatch")
      .attr("transform", (d: MatchBallGroup, i: number) => {
        return `translate(${matchScale(getIndex(i).toString())},0)`;
      });

    battingMatch.append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("height", 790)
      .attr("width", matchScale.bandwidth())
      .attr("fill", (d: MatchBallGroup) => {
        return d.winning_team === team ? 'white' : "#FF5050";
      })
      .style("opacity", 0.3);

    battingMatch.append("text")
      .attr("x", matchScale.bandwidth() / 2)
      .attr("y", 35)
      .style("text-anchor", "middle")
      .text((d: MatchBallGroup) => d.opponent)
      .style("fill", "black")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("cursor", "pointer");

    if (specialCases.includes(team)) {
      vis.append("text")
        .attr("x", matchScale('1')! + (matchScale.bandwidth() / 2))
        .attr("y", 35)
        .style("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text((team === "Australia") ? "Bangladesh" : "Australia");
    }

    battingMatch.append("text")
      .attr("x", matchScale.bandwidth() / 2)
      .attr("y", 420)
      .style("text-anchor", "middle")
      .text((d: MatchBallGroup) => d.date.split(" ")[0]);

    if (specialCases.includes(team)) {
      vis.append("text")
        .attr("x", matchScale('1')! + (matchScale.bandwidth() / 2))
        .attr("y", 420)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("2015-02-21");
    }

    battingMatch.append("text")
      .attr("x", matchScale.bandwidth() / 2)
      .attr("y", 390)
      .style("text-anchor", "middle")
      .text((d: MatchBallGroup, i: number) => getStage(i));

    if (specialCases.includes(team)) {
      vis.append("text")
        .attr("x", matchScale('1')! + (matchScale.bandwidth() / 2))
        .attr("y", 390)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Group");
    }

    battingMatch.append("text")
      .attr("x", matchScale.bandwidth() / 2)
      .attr("y", 450)
      .style("text-anchor", "middle")
      .text((d: MatchBallGroup) => {
        if (d.values[0].inning === 1) {
          return "First to Bat";
        }
        return "Second to Bat";
      });

    if (specialCases.includes(team)) {
      vis.append("text")
        .attr("x", matchScale('1')! + (matchScale.bandwidth() / 2))
        .attr("y", 450)
        .style("text-anchor", "middle")
        .style("fill", "D82E08")
        .style("font-weight", "bold")
        .text("Cancelled");
    }

    // Create batting balls
    const battingBalls = battingMatch.append("g")
      .attr("class", "allBalls");

    battingBalls.selectAll(".ball")
      .data((d: MatchBallGroup) => d.values)
      .enter().append("rect")
      .attr("class", "ball")
      .classed("activeball", true)
      .attr("y", (d: BallData) => {
        if (d.inning === 1) {
          return firstInningScale(Math.ceil(d.ovr).toString())!;
        } else {
          return secondInningScale(Math.ceil(d.ovr).toString())!;
        }
      })
      .attr("x", (d: BallData) => {
        const ballWithinOver = d.ball_within_over - 1;
        return ballWithinOver * finalBallWidth;
      })
      .attr("width", finalBallWidth)
      .attr("height", firstInningScale.bandwidth())
      .attr("fill", decideColor)
      .style("stroke", "white");

    // Create bowling matches
    const bowlingMatch = vis.selectAll(".bowlingMatch")
      .data(data.bowling_balls)
      .enter().append("g")
      .attr("class", "bowlingMatch")
      .attr("transform", (d: MatchBallGroup, i: number) => {
        return `translate(${matchScale(getIndex(i).toString())},0)`;
      });

    const bowlingBalls = bowlingMatch.append("g")
      .attr("class", "allBalls");

    bowlingBalls.selectAll(".ball")
      .data((d: MatchBallGroup) => d.values)
      .enter().append("rect")
      .attr("class", "ball")
      .classed("activeball", true)
      .attr("y", (d: BallData) => {
        if (d.inning === 1) {
          return firstInningScale(Math.ceil(d.ovr).toString())!;
        } else {
          return secondInningScale(Math.ceil(d.ovr).toString())!;
        }
      })
      .attr("x", (d: BallData) => {
        const ballWithinOver = d.ball_within_over - 1;
        return ballWithinOver * finalBallWidth;
      })
      .attr("width", finalBallWidth)
      .attr("height", secondInningScale.bandwidth())
      .attr("fill", decideColor)
      .style("stroke", "white");

    // Add lines
    vis.append("line")
      .attr("x1", 50)
      .attr("y1", 370)
      .attr("x2", xDimension - 10)
      .attr("y2", 370)
      .style("stroke", "black");

    vis.append("line")
      .attr("x1", 50)
      .attr("y1", 460)
      .attr("x2", xDimension - 10)
      .attr("y2", 460)
      .style("stroke", "black");

    // Add axes
    vis.append("g")
      .attr("class", "batAxis")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(firstInningScale).tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(String)))
      .style("stroke", "black");

    vis.append("g")
      .attr("class", "bowlAxis")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(secondInningScale).tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(String)))
      .style("stroke", "black");

    vis.selectAll(".tick line").attr("stroke", "black");
    vis.selectAll(".domain").attr("stroke", "black");

    // Create over summaries (stacked bar chart) - initially hidden
    const overSummaries = vis.append("g")
      .attr("class", "overSummaries")
      .style("display", "none");

    const stack = d3.stack()
      .keys(["runs", "wickets"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    // Calculate max values for scaling
    const battingMax = d3.max(data.batting_balls, (data: any) => {
      const oversMap = d3.group(data.values, (ball: any) => Math.ceil(ball.ovr));
      const nestedData = Array.from(oversMap, ([key, values]) => ({
        key,
        value: {
          runs: d3.sum(values, (leaf: any) => leaf.runs_batter),
          wickets: values.filter((leaf: any) => leaf.wicket).length
        }
      }));
      return d3.max(nestedData, (d: any) => d.value.runs + d.value.wickets);
    }) || 0;

    const bowlingMax = d3.max(data.bowling_balls, (data: any) => {
      const oversMap = d3.group(data.values, (ball: any) => Math.ceil(ball.ovr));
      const nestedData = Array.from(oversMap, ([key, values]) => ({
        key,
        value: {
          runs: d3.sum(values, (leaf: any) => leaf.runs_batter),
          wickets: values.filter((leaf: any) => leaf.wicket).length
        }
      }));
      return d3.max(nestedData, (d: any) => d.value.runs + d.value.wickets);
    }) || 0;

    const maxBarLength = Math.max(battingMax, bowlingMax);
    const stackScale = d3.scaleLinear().domain([0, maxBarLength]).range([0, matchScale.bandwidth()]);

    // Create batting summary bars
    const batSummary = overSummaries.selectAll(".batSummary")
      .data(data.batting_balls)
      .enter().append("g")
      .attr("class", "batSummary")
      .attr("transform", (d: MatchBallGroup, i: number) => {
        return `translate(${matchScale(getIndex(i).toString())}, 0)`;
      });

    const batArea = batSummary.append("g")
      .attr("transform", (d: MatchBallGroup) => {
        const y = (d.values[0].inning === 1) ? 0 : 130;
        if (y === 0) {
          return "translate(0, 0)";
        }
        return `translate(0, ${y + 700}) scale(1, -1)`;
      });

    const batBars = batArea.selectAll(".summaryBar")
      .data((d: MatchBallGroup) => {
        const oversMap = d3.group(d.values, (ball: any) => Math.ceil(ball.ovr));
        const nestedData = Array.from(oversMap, ([key, values]) => ({
          key,
          value: {
            runs: d3.sum(values, (leaf: any) => leaf.runs_batter),
            wickets: values.filter((leaf: any) => leaf.wicket).length
          }
        }));
        return stack(nestedData.map((nest: any) => nest.value));
      })
      .enter().append("g")
      .attr("class", "summaryBar")
      .attr("fill", (d: any) => {
        if (d.key === "runs") {
          return teamColors[team];
        } else {
          return "#F45333";
        }
      });

    batBars.selectAll("rect")
      .data((d: any) => d)
      .enter().append("rect")
      .attr("x", (d: any) => stackScale(d[0]))
      .attr("y", (d: any, i: number) => firstInningScale((i + 1).toString())!)
      .attr("height", firstInningScale.bandwidth())
      .attr("width", (d: any) => stackScale(d[1] - d[0]));

    // Create bowling summary bars
    const bowlSummary = overSummaries.selectAll(".bowlSummary")
      .data(data.bowling_balls)
      .enter().append("g")
      .attr("class", "bowlSummary")
      .attr("transform", (d: MatchBallGroup, i: number) => {
        return `translate(${matchScale(getIndex(i).toString())}, 0)`;
      });

    const bowlArea = bowlSummary.append("g")
      .attr("transform", (d: MatchBallGroup) => {
        const y = (d.values[0].inning === 1) ? 0 : 130;
        if (y === 0) {
          return "translate(0, 0)";
        }
        return `translate(0, ${y + 700}) scale(1, -1)`;
      });

    const bowlBars = bowlArea.selectAll(".summaryBar")
      .data((d: MatchBallGroup) => {
        const oversMap = d3.group(d.values, (ball: any) => Math.ceil(ball.ovr));
        const nestedData = Array.from(oversMap, ([key, values]) => ({
          key,
          value: {
            runs: d3.sum(values, (leaf: any) => leaf.runs_batter),
            wickets: values.filter((leaf: any) => leaf.wicket).length
          }
        }));
        return stack(nestedData.map((nest: any) => nest.value));
      })
      .enter().append("g")
      .attr("class", "summaryBar")
      .attr("fill", (d: any) => {
        if (d.key === "runs") {
          return teamColors[team];
        } else {
          return "#F45333";
        }
      });

    bowlBars.selectAll("rect")
      .data((d: any) => d)
      .enter().append("rect")
      .attr("x", (d: any) => stackScale(d[0]))
      .attr("y", (d: any, i: number) => firstInningScale((i + 1).toString())!)
      .attr("height", firstInningScale.bandwidth())
      .attr("width", (d: any) => stackScale(d[1] - d[0]));

    // Add axes for over summaries
    overSummaries.append("g")
      .attr("class", "batAxis")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(firstInningScale).tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(String)))
      .style("stroke", "black");

    overSummaries.append("g")
      .attr("class", "bowlAxis")
      .attr("transform", "translate(50,0)")
      .call(d3.axisLeft(secondInningScale).tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(String)))
      .style("stroke", "black");

    overSummaries.selectAll(".tick line").attr("stroke", "black");
    overSummaries.selectAll(".domain").attr("stroke", "black");

  }, [data, team]); // Only re-run when data or team changes

  // Handle selected players - dynamic update
  useEffect(() => {
    if (!visRef.current) return;
    console.log("Selected players:", JSON.stringify(selectedPlayers));
    if (selectedPlayers.length === 0) {
      visRef.current.selectAll(".ball")
        .classed("activeball", true)
        .classed("inactiveball", false);
    } else {
      visRef.current.selectAll(".ball")
        .classed("activeball", (d: any) => {
          return selectedPlayers.includes(d.batsman) || selectedPlayers.includes(d.bowler);
        })
        .classed("inactiveball", (d: any) => {
          return !selectedPlayers.includes(d.batsman) && !selectedPlayers.includes(d.bowler);
        });
    }
  }, [selectedPlayers]);

  // Handle current view - dynamic update
  useEffect(() => {
    if (!visRef.current) return;

    const allBallStuff = visRef.current.selectAll(".allBalls");
    const overSummaries = visRef.current.selectAll(".overSummaries");

    if (currentView === "allBalls") {
      allBallStuff.style("display", "block");
      overSummaries.style("display", "none");
    } else if (currentView === "overSummaries") {
      allBallStuff.style("display", "none");
      overSummaries.style("display", "block");
    }
  }, [currentView]);

  // Handle current player highlighting - dynamic update
  useEffect(() => {
    if (!visRef.current) return;

    if (currentPlayer === null) {
      visRef.current.selectAll(".ball")
        .style("stroke", "white")
        .style("stroke-width", 1);
    } else {
      visRef.current.selectAll(".ball")
        .style("stroke", (d: any) => {
          return (d.batsman === currentPlayer.id || d.bowler === currentPlayer.id) ? "orange" : "white";
        })
        .style("stroke-width", (d: any) => {
          return (d.batsman === currentPlayer.id || d.bowler === currentPlayer.id) ? 3 : 1;
        });
    }
  }, [currentPlayer]);

  return (
    <div className="tournament-overview">
      <svg width={xDimension} height={yDimension} ref={svgRef}></svg>
    </div>
  );
} 