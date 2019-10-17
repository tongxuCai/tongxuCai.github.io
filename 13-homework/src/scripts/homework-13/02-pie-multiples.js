import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right
const container = d3.select('#chart-2')

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .each(function(d) {
      const datapoints = d.values

      const svg = d3
        .select('#chart-2')
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('transform', `translate(${width / 2},${height / 2})`)

      const task = ['Typing code', 'Rewriting code', 'Reading StackOverflow']

      const pie = d3.pie().value(function(d) {
        return d.minutes
      })

      console.log(nested)
      // console.log(pie(nested))

      const angleScale = d3
        .scaleBand()
        .domain(task)
        .range([0, Math.PI * 2])

      const radius = 100

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)

      const labelArc = d3
        .arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(d => angleScale(d))
        .endAngle(d => angleScale(d) + angleScale.bandwidth())

      const colorScale = d3.scaleOrdinal().range(['pink', 'cyan', 'magenta'])

      // console.log(pie(datapoints))
      svg
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
        .attr('opacity', 0.5)

      svg
        .selectAll('.outside-label')
        .data(angleScale.domain())
        .enter()
        .append('text')
        .text(d => d)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('transform', function(d) {
          return `translate(${labelArc.centroid(d)})`
        })
      console.log('everything in the angle scale', angleScale.domain())
      // }
    })
}
