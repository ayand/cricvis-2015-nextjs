'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BallData } from '@/models';

interface Partnership {
  position: number;
  batsman_1: string;
  batsman_2: string;
  batsman_1_score: number;
  batsman_2_score: number;
  score: number;
  team: string;
}

interface PartnershipBarsProps {
  partnerships: Partnership[];
  balls: BallData[];
  min: number;
  max: number;
}

const PartnershipBars: React.FC<PartnershipBarsProps> = ({ partnerships, balls, min, max }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const height = 280;

  const convertDimension = (d: number) => {
    return ((d * height) / 350);
  };

  const width = convertDimension(560);
  const margin = convertDimension(7);

  const primaryTeamColors: Record<string, string> = {
    "India": "#0080FF",
    "Bangladesh": "#5AAB54",
    "United Arab Emirates": "#003366",
    "Scotland": "#66B2FF",
    "Ireland": "#80FF00",
    "Afghanistan": "#0066CC",
    "England": "#004C99",
    "South Africa": "#006633",
    "Australia": "gold",
    "New Zealand": "#000000",
    "West Indies": "#660000",
    "Pakistan": "#00CC00",
    "Zimbabwe": "#CC0000",
    "Sri Lanka": "#000099"
  };

  const secondaryTeamColors: Record<string, string> = {
    "India": "#82C0FF",
    "Bangladesh": "#9CC999",
    "United Arab Emirates": "#9AA3AD",
    "Scotland": "#C6E2FF",
    "Ireland": "#CEFF9E",
    "Afghanistan": "#9DB3C9",
    "England": "#798B9E",
    "South Africa": "#8ECEAE",
    "Australia": "#FFF2AA",
    "New Zealand": "#E0E0E0",
    "West Indies": "#AA7575",
    "Pakistan": "#A0BFA0",
    "Zimbabwe": "#CC8282",
    "Sri Lanka": "#5D5D8C"
  };

  // Initial render effect - only runs once on mount
  useEffect(() => {
    if (!svgRef.current || !partnerships || partnerships.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Sort partnerships by position
    const sortedPartnerships = [...partnerships].sort((a, b) => a.position - b.position);

    const canvas = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height + 10);

    const rowHeight = (height - (2 * margin)) / sortedPartnerships.length;
    const barHeight = rowHeight / 2;

    const max1 = d3.max(sortedPartnerships.map(d => d.batsman_1_score)) || 0;
    const max2 = d3.max(sortedPartnerships.map(d => d.batsman_2_score)) || 0;
    const max = Math.max(max1, max2);

    const leftScale = d3.scaleLinear()
      .domain([max, 0])
      .range([margin + 145, (width / 2)]);

    const rightScale = d3.scaleLinear()
      .domain([0, max])
      .range([(width / 2), width - margin - 145]);

    const partnershipGroups = canvas.selectAll(".partnershipBar")
      .data(sortedPartnerships)
      .enter()
      .append("g")
      .attr("class", "partnershipBar")
      .attr("transform", (d, i) => `translate(0,${margin + (i * rowHeight)})`)
      .style("cursor", "pointer");

    // Add partnership score text
    partnershipGroups.append("text")
      .attr("x", width / 2)
      .attr("y", (rowHeight / 4) + 5)
      .text(d => d.score)
      .style("text-anchor", "middle")
      .style("font-size", "13px");

    // Add left bar (batsman 1)
    partnershipGroups.append("rect")
      .attr("x", d => leftScale(d.batsman_1_score))
      .attr("y", barHeight)
      .attr("height", barHeight)
      .attr("width", d => leftScale(0) - leftScale(d.batsman_1_score))
      .attr("fill", d => primaryTeamColors[d.team])
      .style("stroke", "none");

    // Add right bar (batsman 2)
    partnershipGroups.append("rect")
      .attr("x", width / 2)
      .attr("y", barHeight)
      .attr("height", barHeight)
      .attr("width", d => rightScale(d.batsman_2_score) - rightScale(0))
      .attr("fill", d => secondaryTeamColors[d.team])
      .style("stroke", "none");

    // Add batsman 1 name and score
    partnershipGroups.append("text")
      .attr("x", margin)
      .attr("y", margin + barHeight)
      .text(function(d) {
        const names = d.batsman_1.split(" ");
        const firstName = names[0].charAt(0);
        const lastName = names[names.length - 1];
        return `${firstName}. ${lastName} (${d.batsman_1_score})`;
      })
      .style("text-anchor", "start")
      .style("font-weight", "bold");

    // Add batsman 2 name and score
    partnershipGroups.append("text")
      .attr("x", width - margin)
      .attr("y", margin + barHeight)
      .text(function(d) {
        const names = d.batsman_2.split(" ");
        const firstName = names[0].charAt(0);
        const lastName = names[names.length - 1];
        return `(${d.batsman_2_score}) ${firstName}. ${lastName}`;
      })
      .style("text-anchor", "end")
      .style("font-weight", "bold");

  }, []); // Empty dependency array - only runs once on mount

  // Separate useEffect for min and max changes
  useEffect(() => {
    if (!svgRef.current || !partnerships || !balls) return;

    const updateVisibility = (newMin: number, newMax: number) => {
      const validBalls = balls.filter(d => {
        const over = Math.ceil(d.ovr);
        return over >= newMin && over <= newMax;
      });

      const currentBatsmen = Array.from(new Set(
        validBalls.map(d => d.batsman_name)
      ));

      const currentSeconds = Array.from(new Set(
        validBalls.map(d => d.non_striker)
      ));

      const activePlayers = currentBatsmen.concat(currentSeconds);

      d3.select(svgRef.current)
        .selectAll(".partnershipBar")
        .style("display", function(d: any) {
          return activePlayers.includes(d.batsman_1) && activePlayers.includes(d.batsman_2) ? "block" : "none";
        });
    };

    updateVisibility(min, max);

  }, [min, max, partnerships, balls]); // Only depends on min, max, partnerships, and balls

  return (
    <div className="partnership-bars-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default PartnershipBars; 