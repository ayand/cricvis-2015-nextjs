'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KeyedOverSummary } from '@/models';
import { teamColors } from '@/lib/teamColors';

interface OverSummaryChartProps {
  val: KeyedOverSummary[];
  team: string;
  min: number;
  max: number;
}

const OverSummaryChart: React.FC<OverSummaryChartProps> = ({
  val,
  team,
  min,
  max
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const height = 280;

  const convertDimension = (d: number) => {
    return ((d * height) / 450);
  };

  const margin = convertDimension(20);
  const width = convertDimension(720);

  // Initial render effect - only runs once on mount
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content and tooltips
    d3.select(svgRef.current).selectAll("*").remove();

    // Create tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "stacked-bar-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "black")
      .style("color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px 12px")
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .style("pointer-events", "none")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("z-index", "1000");

    const vis = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height + 10);

    // Background rectangle for double border effect
    vis.append("rect")
      .attr("width", width)
      .attr("height", height + 10)
      .attr("fill", "white")
      .style("stroke", "black");

    const overNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43',
      '44', '45', '46', '47', '48', '49', '50'];

    const overs = d3.scaleBand().range([margin, (width - margin)]);
    overs.domain(overNumbers);

    const stack = d3.stack()
      .keys(["runs", "wickets"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(val);

    vis.selectAll('g')
      .data(series)
      .enter().append("g")
      .attr('class', 'summary-bar')
      .attr("fill", function(d: any, i: number) {
        if (d.key == "runs") {
          return teamColors[team];
        } else {
          return "#F45333";
        }
      })
      .selectAll("rect")
      .data(function(d: any) { return d; })
      .enter().append("rect")
      .attr("x", function(d: any, i: number) {
        return overs((i + 1).toString()) || 0;
      })
      .attr("y", function(d: any) {
        return height - margin - (convertDimension(12) * d[1]);
      })
      .attr("height", function(d: any) {
        return (convertDimension(12) * (d[1] - d[0]));
      })
      .attr("width", overs.bandwidth());

    const overAxis = d3.axisBottom(overs);
    overAxis.tickValues(['5', '10', '15', '20', '25', '30', '35', '40', '45', '50']);
    
    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height - margin) + ")")
      .call(overAxis);
    
    // Make axis numbers darker
    vis.selectAll(".tick line").attr("stroke", "black");
    vis.selectAll(".domain").attr("stroke", "black");
    vis.selectAll(".tick text").style("fill", "black").style("font-weight", "bold");

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.selectAll('.tooltip').remove();
    };

  }, []); // Empty dependency array - only runs once on mount

  // Separate useEffect for min and max changes and event handling
  useEffect(() => {
    if (!svgRef.current) return;

    const vis = d3.select(svgRef.current);
    
    // Function to update visibility based on current min/max
    const updateVisibility = (currentMin: number, currentMax: number) => {
      vis.selectAll('.summary-bar')
        .selectAll('rect')
        .style("opacity", function(d: any, i: number) {
          const over = i + 1;
          if (over >= currentMin && over <= currentMax) {
            return 1;
          } else {
            return 0.2;
          }
        });
    };

    // Update cursor styles
    vis.selectAll('.summary-bar')
      .selectAll('rect')
      .style("cursor", function(d: any, i: number) {
        const over = i + 1;
        return (over >= min && over <= max) ? "pointer" : "default";
      });

    // Remove existing event handlers
    vis.selectAll('.summary-bar')
      .selectAll('rect')
      .on("mouseover", null)
      .on("mousemove", null)
      .on("mouseout", null);

    // Add new event handlers with current min/max values
    vis.selectAll('.summary-bar')
      .selectAll('rect')
      .on("mouseover", function(event: any, d: any) {
        const overIndex = (d3.select(this).datum() as any).data.key as number;
        const over = overIndex + 1;
        
        // Only proceed if the bar is within the current range
        if (over >= min && over <= max) {
          // Highlight the hovered bar
          vis.selectAll('.summary-bar')
            .selectAll('rect')
            .style("opacity", function(bar: any, j: number) {
              const barOver = j + 1;
              if (overIndex == j) {
                return 1; // Full opacity for hovered bar
              } else if (barOver >= min && barOver <= max) {
                return 0.2; // Dimmed for other bars in range
              } else {
                return 0.2; // Dimmed for bars outside range
              }
            });
          
          // Show tooltip
          const tooltip = d3.select('.stacked-bar-tooltip');
          const tooltipText = (d: KeyedOverSummary, overNumber: number) => {
            const runsScored = (d.runs == 0) ? "" : (`Runs Scored: ${d.runs}<br/>`);
            const wicketsTaken = (d.wickets == 0) ? "" : (`Wickets Taken: ${d.wickets}`);
            return `Over ${overNumber}<br/>${runsScored}${wicketsTaken}`;
          };
          
          tooltip
            .style('opacity', 1)
            .html(tooltipText(d.data, over))
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on("mousemove", function(event: any) {
        const overIndex = (d3.select(this).datum() as any).data.key as number;
        const over = overIndex + 1;
        
        // Only update tooltip position if the bar is within the current range
        if (over >= min && over <= max) {
          const tooltip = d3.select('.stacked-bar-tooltip');
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on("mouseout", function() {
        // Always restore the filtered state when mouse leaves any bar
        updateVisibility(min, max);
        
        // Hide tooltip
        const tooltip = d3.select('.stacked-bar-tooltip');
        tooltip.style('opacity', 0);
      });

    // Update initial visibility
    updateVisibility(min, max);

  }, [min, max]); // Only depends on min and max

  return (
    <div className="over-summary-chart-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default OverSummaryChart; 