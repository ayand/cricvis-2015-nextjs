'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BallData } from '@/models';
import { isWicketBall, decideColor } from '@/services/ballService';

interface OverChartProps {
  val: BallData[];
  min?: number;
  max?: number;
  hoverswitch: boolean;
}

const OverChart: React.FC<OverChartProps> = ({
  val,
  min = 1,
  max = 50,
  hoverswitch
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Initial render effect - only runs once on mount
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Remove existing tooltips
    // d3.selectAll('.tooltip').remove();

    const height = 280;
    const convertDimension = (d: number) => ((d * height) / 450);
    const width = convertDimension(720);
    const ballBuffer = convertDimension(2);
    const margin = convertDimension(20);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height + 10);

    // Background rectangle
    svg.append("rect")
      .attr("width", width)
      .attr("height", height + 10)
      .attr("fill", "white")
      .style("stroke", "black");

    const overNumbers = Array.from({ length: 50 }, (_, i) => (i + 1).toString());

    const overs = d3.scaleBand()
      .range([margin, (width - margin)])
      .domain(overNumbers);

    const barHeight = (d: BallData) => {
      if (d.runs_batter <= 1) {
        return convertDimension(12);
      }
      return convertDimension(12 * d.runs_batter);
    };

    const tooltipText = (d: BallData) => {
      const overNumber = Math.ceil(d.ovr);
      const ballNumber = Math.round((d.ovr * 10) % 10);
      const batsman = d.batsman_name;
      const bowler = d.bowler_name;
      const runs = d.runs_w_extras;
      const scoreType = d.extras_type;
      
      let score = "";
      if (scoreType === "Wd") {
        score = "Wides";
      } else if (scoreType === "Lb") {
        score = "Leg byes";
      } else if (scoreType === "Nb") {
        score = "No Ball";
      } else {
        score = "Runs";
      }

      const line1 = `<strong>Over ${overNumber}, Ball ${ballNumber}</strong><br/>`;
      const line2 = `${batsman}: ${runs} ${score}<br/>`;
      const line3 = `Bowled by ${bowler}<br/>`;
      const line4 = !isWicketBall(d) ? "" : `Wicket- ${d.who_out} (${d.wicket_method})`;
      
      return line1 + line2 + line3 + line4;
    };

    const className = (val[0]?.inning === 1) ? "ballBar1" : "ballBar2";

    const bottomBoundaries: Record<string, number> = {};
    for (let i = 1; i <= 50; i += 1) {
      bottomBoundaries[i.toString()] = (height - margin - ballBuffer);
    }

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

    // Create bars
    const bars = svg.selectAll('.' + className)
      .data(val);

    bars.enter().append("rect")
      .attr("class", className)
      .attr("fill", (d: BallData) => decideColor(d))
      .attr("x", (d: BallData) => overs(Math.ceil(d.ovr).toString()) || 0)
      .attr("rx", convertDimension(4))
      .attr("ry", convertDimension(4))
      .attr("width", overs.bandwidth())
      .attr("y", (d: BallData) => {
        const overNumber = Math.ceil(d.ovr);
        const bottomBoundary = bottomBoundaries[overNumber.toString()];
        const height = barHeight(d);
        const startingPoint = bottomBoundary - height + ballBuffer;
        bottomBoundaries[overNumber.toString()] -= (height + ballBuffer);
        return startingPoint;
      })
      .attr("height", (d: BallData) => barHeight(d))
      .attr("stroke", "#cccccc");

    // Create over axis
    const overAxis = d3.axisBottom(overs);
    overAxis.tickValues(['5', '10', '15', '20', '25', '30', '35', '40', '45', '50']);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(overAxis);

    // Make axis numbers darker
    svg.selectAll(".tick line").attr("stroke", "black");
    svg.selectAll(".domain").attr("stroke", "black");
    svg.selectAll(".tick text").style("fill", "black").style("font-weight", "bold");

    // Initial visibility
    const changeVisibility = (newMin: number, newMax: number) => {
      d3.selectAll("." + className)
        .classed("visiblebar", function(d: any) {
          const over = Math.ceil(d.ovr);
          return (over >= newMin && over <= newMax);
        })
        .classed("invisiblebar", function(d: any) {
          const over = Math.ceil(d.ovr);
          return !(over >= newMin && over <= newMax);
        });
    };

    changeVisibility(min, max);

    // Initial hover functionality
    if (hoverswitch) {
      d3.selectAll('.' + className)
        .on("mouseover", function(event: any, d: any) {
          const over = Math.ceil(d.ovr);
          if (over >= min && over <= max) {
            d3.selectAll('.visiblebar')
              .style("opacity", function(ball: any) {
                if (d === ball) {
                  return 1;
                } else {
                  return 0.2;
                }
              });

            tooltip
              .style('opacity', 1)
              .html(tooltipText(d))
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          }
        })
        .on("mouseout", function() {
          d3.selectAll('.visiblebar')
            .style("opacity", 1);
          tooltip.style('opacity', 0);
        });
    }

  }, []); // Empty dependency array - only runs once on mount

  // Separate useEffect for min, max, and hoverswitch changes
  useEffect(() => {
    if (!svgRef.current || !val || val.length === 0) return;

    const className = (val[0]?.inning === 1) ? "ballBar1" : "ballBar2";

    // Update visibility
    const changeVisibility = (newMin: number, newMax: number) => {
      d3.selectAll("." + className)
        .classed("visiblebar", function(d: any) {
          const over = Math.ceil(d.ovr);
          return (over >= newMin && over <= newMax);
        })
        .classed("invisiblebar", function(d: any) {
          const over = Math.ceil(d.ovr);
          return !(over >= newMin && over <= newMax);
        });
    };

    changeVisibility(min, max);

    // Update hover functionality
    if (hoverswitch) {
      d3.selectAll('.' + className)
        .on("mouseover", function(event: any, d: any) {
          const over = Math.ceil(d.ovr);
          if (over >= min && over <= max) {
            d3.selectAll('.visiblebar')
              .style("opacity", function(ball: any) {
                if (d === ball) {
                  return 1;
                } else {
                  return 0.2;
                }
              });

            const tooltip = d3.select('.tooltip');
            tooltip
              .style('opacity', 1)
              .html(`<strong>Over ${Math.ceil(d.ovr)}, Ball ${Math.round((d.ovr * 10) % 10)}</strong><br/>${d.batsman_name}: ${d.runs_w_extras} ${d.extras_type || 'Runs'}<br/>Bowled by ${d.bowler_name}`)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          }
        })
        .on("mouseout", function() {
          d3.selectAll('.visiblebar')
            .style("opacity", 1);
          d3.select('.tooltip').style('opacity', 0);
        });
    } else {
      d3.selectAll('.' + className)
        .on("mouseover", null)
        .on("mouseout", null);
    }

  }, [min, max, hoverswitch]); // Only depend on min, max, and hoverswitch

  return (
    <div className="over-chart-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default OverChart; 