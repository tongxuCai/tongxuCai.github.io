import * as d3 from 'd3'

// and then feed it to your scale to 'teach' it the domain after you've read in data

// Define the margin, radius, and color scale. Colors are assigned lazily, so
// if you want deterministic behavior, define a domain for the color scale.
const m = 10
const r = 100
const z = d3.scaleOrdinal(d3.schemeCategory10)

// Define a pie layout: the pie angle encodes the minutes of flights. Since our
// data is stored in CSV, the minutess are strings which we coerce to numbers.
const pie = d3.layout
  .pie()
  .value(function(d) {
    return +d.minutes
  })
  .sort(function(a, b) {
    return b.minutes - a.minutes
  })

// Define an arc generator. Note the radius is specified here, not the layout.
const arc = d3.svg
  .arc()
  .innerRadius(r / 2)
  .outerRadius(r)

// Load the flight data asynchronously.
d3.csv(require('/data/time-breakdown-all.csv'), function(error, flights) {
  if (error) throw error

  // Nest the flight data by originating airport. Our data has the minutess per
  // airport and task, but we want to group minutess by aiport.
  const airports = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(flights)

  const names = airports.map(d => d.name)
  z.domain(names)

  console.log(flights)

  // Insert an svg element (with margin) for each airport in our dataset. A
  // child g element translates the origin to the pie center.
  const svg = d3
    .select('#chart-2')
    .selectAll('div')
    .data(airports)
    .enter()
    .append('div') // http://code.google.com/p/chromium/issues/detail?id=98951
    .style('display', 'inline-block')
    .style('width', (r + m) * 2 + 'px')
    .style('height', (r + m) * 2 + 'px')
    .append('svg')
    .attr('width', (r + m) * 2)
    .attr('height', (r + m) * 2)
    .append('g')
    .attr('transform', 'translate(' + (r + m) + ',' + (r + m) + ')')

  // Add a label for the airport. The `key` comes from the nest operator.
  svg
    .append('text')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text(function(d) {
      return d.key
    })

  // Pass the nested per-airport values to the pie layout. The layout computes
  // the angles for each arc. Another g element will hold the arc and its label.
  const g = svg
    .selectAll('g')
    .data(function(d) {
      return pie(d.values)
    })
    .enter()
    .append('g')

  // Add a colored arc path, with a mouseover title showing the minutes.
  g.append('path')
    .attr('d', arc)
    .style('fill', function(d) {
      return z(d.data.task)
    })
    .append('title')
    .text(function(d) {
      return d.data.task + ': ' + d.data.minutes
    })

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  g.filter(function(d) {
    return d.endAngle - d.startAngle > 0.2
  })
    .append('text')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      return 'translate(' + arc.centroid(d) + ')rotate(' + angle(d) + ')'
    })
    .text(function(d) {
      return d.data.task
    })

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    const a = ((d.startAngle + d.endAngle) * 90) / Math.PI - 90
    return a > 90 ? a - 180 : a
  }
})
