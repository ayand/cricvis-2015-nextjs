'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VerticalColorLegendProps {
  className?: string;
}

const VerticalColorLegend: React.FC<VerticalColorLegendProps> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 300;
  const height = 350;

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing content
    d3.select(svgRef.current).selectAll('*').remove();

    

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);


    const legendColors = d3.scaleOrdinal()
      .domain(['Non-Boundary', 'Boundary', 'Extra', 'Wicket', 'Dot Ball'])
      .range(['#43A2CA', '#0868AC', '#7BCCC4', '#F45333', '#CCCCCC']);

    const ballTypes = ['Non-Boundary', 'Boundary', 'Extra', 'Wicket', 'Dot Ball'];

    const legend = svg.selectAll('.legendItem')
      .data(ballTypes)
      .enter()
      .append('g')
      .attr('class', 'legendItem')
      .attr('transform', (d, i) => {
        const yTransformation = 30 + (i * 60);
        return `translate(0,${yTransformation})`;
      });

    legend.append('circle')
      .attr('cx', 35)
      .attr('cy', 38)
      .attr('r', 12)
      .attr('fill', (d: string) => legendColors(d) as string);

    legend.append('text')
      .text(d => d)
      .attr('x', 80)
      .attr('y', 48)
      .style('font-size', '18px')
      .style('font-weight', 'bold');

  }, []);

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
};

export default VerticalColorLegend; 