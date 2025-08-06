'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BallData } from '@/models';

interface Partnership {
  batsman_1: string;
  batsman_2: string;
  batsman_1_score: number;
  batsman_2_score: number;
  score: number;
  team: string;
  game: number;
  position: number;
}

interface PartnershipMatrixProps {
  partnerships: Partnership[];
  batsmen: string[];
  balls: BallData[];
  min: number;
  max: number;
}

const PartnershipMatrix: React.FC<PartnershipMatrixProps> = ({ partnerships, batsmen, balls, min, max }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const height = 280;

  const convertDimension = (d: number) => {
    return ((d * height) / 350);
  };

  const width = convertDimension(560);
  const margin = convertDimension(80);

  // Initial render effect - only runs once on mount
  useEffect(() => {
    if (!svgRef.current || !partnerships || !batsmen) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const canvas = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height + 10);

    // Background rectangle
    canvas.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white");

    // Matrix background
    canvas.append("rect")
      .attr("width", convertDimension(420))
      .attr("height", convertDimension(260))
      .attr("x", (width - convertDimension(420)) / 2 + 25)
      .attr("y", convertDimension(65))
      .attr("fill", "#BBBBBB")
      .style("stroke", "#BBBBBB");

    // Create tooltip (simplified version without d3-tip)
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const tooltipText = (d: Partnership) => {
      const line1 = `<strong>${d.batsman_1} and ${d.batsman_2}</strong><br>`;
      const line2 = `<strong>${d.score} runs</strong>`;
      return line1 + line2;
    };

    const batsmanYScale = d3.scaleBand()
      .domain(batsmen)
      .range([convertDimension(65), height - convertDimension(25)]);

    const batsmanXScale = d3.scaleBand()
      .domain(batsmen)
      .range([(width - convertDimension(420)) / 2 + 25, (width + convertDimension(420)) / 2 + 25]);

    const xShift = batsmanXScale.bandwidth() / 2;

    const scores = partnerships.map(d => d.score);
    const scoreRange: [number, number] = [Math.min(...scores), Math.max(...scores)];

    const colors = ["#ADCCFF", "#97BAF1", "#82AAE3", "#6B99D5", "#5287C7", "#3777B9", "#0868AC"];
    const indexes = [0, 1, 2, 3, 4, 5, 6];

    const colorScale = d3.scaleQuantile()
      .domain(scoreRange)
      .range(indexes);

    // Create invalid partnerships (diagonal)
    canvas.selectAll(".invalidPartnership")
      .data(batsmen)
      .enter().append("rect")
      .attr("class", "invalidPartnership")
      .attr("width", batsmanXScale.bandwidth())
      .attr("height", batsmanYScale.bandwidth())
      .attr("fill", "#555555")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x", (d) => batsmanXScale(d) || 0)
      .attr("y", (d) => batsmanYScale(d) || 0);

    // Create valid partnerships
    canvas.selectAll(".partnership")
      .data(partnerships)
      .enter().append("rect")
      .attr("class", "partnership")
      .attr("width", batsmanXScale.bandwidth())
      .attr("height", batsmanYScale.bandwidth())
      .attr("x", (d) => batsmanXScale(d.batsman_1) || 0)
      .attr("y", (d) => batsmanYScale(d.batsman_2) || 0)
      .attr("fill", (d) => colors[colorScale(d.score)])
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .on("mouseover", function(event, d) {
        tooltip
          .style('opacity', 1)
          .html(tooltipText(d))
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on("mouseout", function() {
        tooltip.style('opacity', 0);
      })
      .style("cursor", "pointer");

    // Y-axis
    canvas.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${(width - convertDimension(420)) / 2 + 25}, 0)`)
      .call(d3.axisLeft(batsmanYScale));

    canvas.select(".yAxis")
      .selectAll("text")
      .text(function(d: any) {
        const names = d.split(" ");
        const firstName = names[0].charAt(0);
        const lastName = names[names.length - 1];
        return `${firstName}. ${lastName}`;
      })
      .style("font-size", "10px");

    // X-axis
    canvas.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${convertDimension(65)})`)
      .call(d3.axisTop(batsmanXScale));

    canvas.select(".xAxis")
      .selectAll("text")
      .text(function(d: any) {
        const names = d.split(" ");
        const firstName = names[0].charAt(0);
        const lastName = names[names.length - 1];
        return `${firstName}. ${lastName}`;
      })
      .style("font-size", "10px")
      .attr("transform", `translate(${xShift - 5}, -20) rotate(-40)`);

    // Make axis numbers darker
    canvas.selectAll(".tick line").attr("stroke", "black");
    canvas.selectAll(".domain").attr("stroke", "black");
    canvas.selectAll(".tick text").style("fill", "black").style("font-weight", "bold");

    // Hide axis paths
    canvas.select(".xAxis").selectAll("path").style("opacity", 0);
    canvas.select(".yAxis").selectAll("path").style("opacity", 0);

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.selectAll('.tooltip').remove();
    };

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
        .selectAll(".partnership")
        .style("display", function(d: any) {
          return activePlayers.includes(d.batsman_1) && activePlayers.includes(d.batsman_2) ? "block" : "none";
        });
    };

    updateVisibility(min, max);

  }, [min, max, partnerships, balls]); // Only depends on min, max, partnerships, and balls

  return (
    <div className="partnership-matrix-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default PartnershipMatrix; 