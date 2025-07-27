'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KeyedOverSummary } from '@/models';

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

    const teamColors: Record<string, string> = {};
    teamColors["India"] = "#0080FF";
    teamColors["Bangladesh"] = "#5AAB54";
    teamColors["United Arab Emirates"] = "#003366";
    teamColors["Scotland"] = "#66B2FF";
    teamColors["Ireland"] = "#80FF00";
    teamColors["Afghanistan"] = "#0066CC";
    teamColors["England"] = "#004C99";
    teamColors["South Africa"] = "#006633";
    teamColors["Australia"] = "gold";
    teamColors["New Zealand"] = "#000000";
    teamColors["West Indies"] = "#660000";
    teamColors["Pakistan"] = "#00CC00";
    teamColors["Zimbabwe"] = "#CC0000";
    teamColors["Sri Lanka"] = "#000099";

    const tooltipText = (d: KeyedOverSummary, overNumber: number) => {
      const runsScored = (d.runs == 0) ? "" : (`Runs Scored: ${d.runs}<br/>`);
      const wicketsTaken = (d.wickets == 0) ? "" : (`Wickets Taken: ${d.wickets}`);
      return `Over ${overNumber}<br/>${runsScored}${wicketsTaken}`;
    };

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
      .attr("width", overs.bandwidth())
      .on("mouseover", function(event: any, d: any) {
        const overIndex = (d3.select(this).datum() as any).data.key as number;
        const over = overIndex + 1;
        console.log(over)
        if (over >= min && over <= max) {
          // Highlight the hovered bar
          vis.selectAll('.summary-bar')
            .selectAll('rect')
            .style("opacity", function(bar: any, j: number) {
              if (overIndex == j) {
                return 1;
              } else {
                return 0.2;
              }
            });
          
          // Show tooltip
          tooltip
            .style('opacity', 1)
            .html(tooltipText(d.data, over))
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on("mousemove", function(event: any) {
        // Update tooltip position on mouse move
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on("mouseout", function() {
        // Reset opacity for all bars
        vis.selectAll('.summary-bar')
          .selectAll('rect')
          .style("opacity", function(d: any, i: number) {
            const over = i + 1;
            if (over >= min && over <= max) {
              return 1;
            } else {
              return 0.2;
            }
          });
        
        // Hide tooltip
        tooltip.style('opacity', 0);
      });

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

    // Initial visibility
    const changeVisibility = (newMin: number, newMax: number) => {
      vis.selectAll('.summary-bar')
        .selectAll('rect')
        .style("opacity", function(d: any, i: number) {
          const over = i + 1;
          if (over >= newMin && over <= newMax) {
            return 1;
          } else {
            return 0.2;
          }
        });
    };

    changeVisibility(min, max);

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      d3.selectAll('.tooltip').remove();
    };

  }, []); // Empty dependency array - only runs once on mount

  // Separate useEffect for min and max changes
  useEffect(() => {
    if (!svgRef.current) return;

    const changeVisibility = (newMin: number, newMax: number) => {
      d3.select(svgRef.current)
        .selectAll('.summary-bar')
        .selectAll('rect')
        .style("opacity", function(d: any, i: number) {
          const over = i + 1;
          if (over >= newMin && over <= newMax) {
            return 1;
          } else {
            return 0.2;
          }
        });
    };

    changeVisibility(min, max);

  }, [min, max]); // Only depends on min and max

  return (
    <div className="over-summary-chart-container p-2" style={{ border: '1px solid #333', borderRadius: '4px' }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
    </div>
  );
};

export default OverSummaryChart; 