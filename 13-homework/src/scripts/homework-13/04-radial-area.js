import * as d3 from 'd3'
const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right
const svg = d3
  .select('#chart-4')
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
const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'orange')
    .attr('stroke', 'none')
    .attr('opacity', 0.75)
  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  const bands = [0, 30, 40, 50, 60, 70, 80, 90]

  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .lower()

  svg
    .selectAll('.label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  svg
    .append('text')
    .text('NYC')
    .attr('x', 0)
    .attr('y', 8)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .style('font-size', '30px')

  // svg
  //   .selectAll('.radius-line')
  //   .data(angleScale.domain())
  //   .enter()
  //   .append('line')
  //   .attr('x1', 0)
  //   .attr('y1', 0)
  //   .attr('x2', 0)
  //   .attr('y2', -radius)
  //   .attr('stroke', 'black')
  //   .attr('transform', function(d) {
  //     return `rotate(${(angleScale(d) * 180) / Math.PI})`
  //   })

  console.log('evertying in the angle scale'.angleScale.domain())
}
