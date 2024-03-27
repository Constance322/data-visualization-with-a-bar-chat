// Fetch data from JSON endpoint
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
    // Destructure data
    const { data: gdpData } = data;

    // Set up chart dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Parse date format
    const parseDate = d3.timeParse('%Y-%m-%d');
    gdpData.forEach(d => {
      d.date = parseDate(d[0]);
      d.gdp = +d[1];
    });

    // Create scales
    const xScale = d3.scaleTime()
      .domain([d3.min(gdpData, d => d.date), d3.max(gdpData, d => d.date)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(gdpData, d => d.gdp)])
      .range([height, 0]);

    // Create SVG container
    const svg = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // Create y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create bars
    svg.selectAll('.bar')
      .data(gdpData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d.date)
      .attr('data-gdp', d => d.gdp)
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.gdp))
      .attr('width', width / gdpData.length)
      .attr('height', d => height - yScale(d.gdp))
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('#tooltip');
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Date: ${d.date.toDateString()}<br>GDP: $${d.gdp.toFixed(2)} Billion`)
          .attr('data-date', d.date)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        const tooltip = d3.select('#tooltip');
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  })
  .catch(error => console.error('Error fetching data:', error));
