'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BallData } from '@/models';
import { teamColors } from '@/lib/teamColors';

interface OverTimelineProps {
  balls: BallData[];
  min: number;
  max: number;
}

interface LineSegment {
  over1: number;
  score1: number;
  over2: number;
  score2: number;
}

interface InningData {
  key: string;
  values: Array<{
    key: number;
    value: {
      maxScore: number;
      team: string;
      wickets: BallData[];
    };
  }>;
  lines: LineSegment[];
}

const OverTimeline: React.FC<OverTimelineProps> = ({ balls, min, max }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const height = 280;

  const convertDimension = (d: number) => {
    return ((d * height) / 450);
  };

  const width = convertDimension(720);
  const margin = convertDimension(20);

  // Initial render effect - only runs once on mount
  useEffect(() => {
    if (!svgRef.current || !balls || balls.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const vis = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height + 10);

    const maxScore = d3.max(balls, (d) => d.cumul_runs) || 0;

    const runScale = d3.scaleLinear()
      .domain([0, maxScore])
      .range([height - margin - convertDimension(20), margin + convertDimension(20)]);

    const overScale = d3.scaleLinear()
      .domain([1, 50])
      .range([margin + convertDimension(40), width - margin - convertDimension(150)]);

    // Y-axis
    vis.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${margin + 20},0)`)
      .call(d3.axisLeft(runScale));

    // X-axis
    vis.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${height - (margin + 10)})`)
      .call(d3.axisBottom(overScale));

    // Make axis numbers darker
    vis.selectAll(".tick line").attr("stroke", "black");
    vis.selectAll(".domain").attr("stroke", "black");
    vis.selectAll(".tick text").style("fill", "black").style("font-weight", "bold");

    // Process data
    const data: InningData[] = [];
    
    // Group balls by batting team and over
    const groupedData = new Map<string, Map<number, BallData[]>>();
    
    balls.forEach((ball) => {
      const team = ball.batting_team;
      const over = Math.ceil(ball.ovr);
      
      if (!groupedData.has(team)) {
        groupedData.set(team, new Map());
      }
      
      const teamData = groupedData.get(team)!;
      if (!teamData.has(over)) {
        teamData.set(over, []);
      }
      
      teamData.get(over)!.push(ball);
    });

    // Convert to the expected format
    groupedData.forEach((teamData, team) => {
      const values: Array<{
        key: number;
        value: {
          maxScore: number;
          team: string;
          wickets: BallData[];
        };
      }> = [];

      // Sort by over number
      const sortedOvers = Array.from(teamData.keys()).sort((a, b) => a - b);
      
      sortedOvers.forEach((over) => {
        const overBalls = teamData.get(over)!;
        const maxScore = Math.max(...overBalls.map(d => d.cumul_runs));
        const wickets = overBalls.filter(d => d.wicket === true && d.extras_type !== "Nb" && d.extras_type !== "Wd");
        
        values.push({
          key: over,
          value: {
            maxScore,
            team,
            wickets
          }
        });
      });

      // Create line segments
      const lineSegments: LineSegment[] = [];
      for (let j = 0; j < values.length - 1; j++) {
        const line: LineSegment = {
          over1: values[j].key,
          score1: values[j].value.maxScore,
          over2: values[j + 1].key,
          score2: values[j + 1].value.maxScore
        };
        lineSegments.push(line);
      }

      data.push({
        key: team,
        values,
        lines: lineSegments
      });
    });

    // Create innings groups
    const inning = vis.selectAll(".innings")
      .data(data)
      .enter().append("g")
      .attr("class", "innings")
      .attr("fill", (d) => teamColors[d.key])
      .style("stroke", (d) => teamColors[d.key]);

    // Create line segments
    inning.selectAll(".segment")
      .data((d) => d.lines)
      .enter().append("line")
      .attr("class", "segment")
      .attr("x1", (d) => overScale(d.over1))
      .attr("y1", (d) => runScale(d.score1))
      .attr("x2", (d) => overScale(d.over2))
      .attr("y2", (d) => runScale(d.score2))
      .style("stroke-width", 2);

    // Create wicket markers
    const wicket = inning.selectAll(".wicket")
      .data((d) => d.values)
      .enter().append("g")
      .attr("class", "wicket")
      .attr("transform", (d) => {
        return `translate(${overScale(d.key)},${runScale(d.value.maxScore)})`;
      });

    const wicketBall = wicket.selectAll(".wicketBall")
      .data((d) => d.value.wickets)
      .enter().append("circle")
      .attr("class", "wicketBall")
      .attr("r", convertDimension(3))
      .attr("transform", (d, i) => {
        const direction = d.inning === 1 ? -1 : 1;
        const y = direction * i * convertDimension(7);
        return `translate(0,${y})`;
      })
      .attr("fill", "#F45333")
      .style("stroke", "#F45333");

    // Create legend
    const teamNames = data.map((d) => d.key);

    const legend = vis.selectAll(".legend")
      .data(teamNames)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        return `translate(${(width - convertDimension(160))},${margin + (i * convertDimension(30))})`;
      })
      .on("mouseover", function(event, d) {
        inning.style("opacity", (i) => {
          return i.key === d ? 1 : 0.1;
        });
      })
      .on("mouseout", function() {
        inning.style("opacity", 1);
      })
      .style("cursor", "pointer");

    legend.append("circle")
      .attr("cx", convertDimension(25))
      .attr("cy", convertDimension(12))
      .attr("r", convertDimension(8))
      .attr("fill", (d) => teamColors[d]);

    legend.append("text")
      .attr("x", convertDimension(40))
      .attr("y", convertDimension(16))
      .text((d) => d === 'United Arab Emirates' ? 'UAE' : d)
      .style("font-size", convertDimension(18));

    // Add labels
    vis.append("text")
      .attr("x", convertDimension(15))
      .attr("y", convertDimension(25))
      .text("Score");

    vis.append("text")
      .attr("x", width - convertDimension(85))
      .attr("y", height - convertDimension(10) + 10)
      .text("Over")
      .style("text-anchor", "end");

  }, []); // Empty dependency array - only runs once on mount

  const updateVisibility = (newMin: number, newMax: number) => {
    // Update line opacity
    d3.select(svgRef.current)
      .selectAll(".segment")
      .style("opacity", function(d: any) {
        const greaterThan = d.over1 >= newMin;
        const lessThan = d.over2 <= newMax;
        return greaterThan && lessThan ? 1 : 0.1;
      });

    // Update wicket ball opacity
    d3.select(svgRef.current)
      .selectAll(".wicketBall")
      .style("opacity", function(d: any) {
        const o = Math.ceil(d.ovr);
        return (o >= newMin && o <= newMax) ? 1 : 0.1;
      });
  };

  
  // Separate useEffect for min and max changes
  useEffect(() => {
    if (!svgRef.current || !balls || balls.length === 0) return;

    updateVisibility(min, max);

  }, [min, max]); // Only depends on min and max

  return (
    <div className="over-timeline-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default OverTimeline; 