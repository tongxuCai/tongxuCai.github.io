import * as d3 from 'd3'
const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right
const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

// const defs = svg.append('defs')

// const gradient = defs
//   .append('linearGradient')
//   .attr('id', 'svgGradient')
//   .attr('x1', '0%')
//   .attr('x2', '100%')
//   .attr('y1', '0%')
//   .attr('y2', '100%')

// gradient
//   .append('stop')
//   .attr('class', 'start')
//   .attr('offset', '0%')
//   .attr('stop-color', 'pink')
//   .attr('stop-opacity', 1)

// gradient
//   .append('stop')
//   .attr('class', 'end')
//   .attr('offset', '100%')
//   .attr('stop-color', 'teal')
//   .attr('stop-opacity', 1)

const colorScale = d3
  .scaleLinear()
  .range(['cyan', 'pink'])
  .domain([35, 85])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    // .attr('fill', 'url(#svgGradient)')
    .attr('fill', d => colorScale(d.high_temp))

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)
}
