/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

 /**
 * Function that draws empty line chart, ready to be filled with lines.
 * */
function makeLineChart(data, lineContainer, xLine, yLine, height) {

     // define the line
     var line = d3.line()
         .x(function (d, i) {
             return xLine(i + 1998);
         })
         .y(function (d) {
             return yLine(d.value);
         });

    // set domain
    var format = d3.timeFormat("%b %Y");
    var period = d3.extent(data, function(d) {return d.key});
    xLine.domain(period);
    yLine.domain(d3.extent(data, function(d) {return d.value.total}));

    // Add the X Axis
    lineContainer.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xLine)
            .tickFormat(function(d) { return format(d); }))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // Add the Y Axis
    lineContainer.append("g")
        .attr("class", "axis y")
        .call(d3.axisLeft(yLine))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y",  6)
        .attr("dy", ".71em")
        .text("Check-ins");
}

/**
 * Function that adds or deletes lines and legend rects according to array of selected country.
 * @param {object} data
 * */
function updateLines(data, lineContainer, legendContainer, xLine, yLine, selected) {

    var period = d3.extent(data, function(d) {return d.key});
    xLine.domain(period);
    console.log(d3.extent(data, function(d) {return d.value.total}));
    yLine.domain(d3.extent(data, function(d) {return d.value.total}));

    // get current max value for y axis scaling and put data per line in dict of arrays
    var lineData = {};
    var max = 0;
    selected.forEach(function(s) {
        lineData[s] = [];
        data.forEach(function(item) {
            lineData[s].push({date: item.key, value: item.value[s]});
            if (item.value[s] > max) {
                max = item.value[s]
            }
        });
    });
    yLine.domain([0, max]);

    // scale for color of lines
    var lineColor = d3.scaleOrdinal(d3["schemeDark2"]);

    // make new line
    line = d3.line()
        .x(function(d) { return xLine(d.date); })
        .y(function(d) { return yLine(d.value); });

    // update axis
    lineContainer.selectAll(".y.axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(yLine));

    // update lines
    lineContainer.selectAll(".line")
        .data(selected)
        .attr("class", "line")
        .transition()
        .duration(650)
        .attr("id", function(d) { return "line" + d; })
        .style("stroke", function(d) { return lineColor(d); })
        .attr("d", function(d) { return line(lineData[d]); });

    lineContainer.selectAll(".line")
        .data(selected)
        .enter().append("path")
        .attr("class", "line")
        .attr("id", function(d) { return "line" + d; })
        .transition()
        .duration(650)
        .style("stroke", function(d, i) {  return lineColor(d); })
        .attr("d", function(d) { return line(lineData[d]); });

    // draw (and update) legend
    var legend = legendContainer.selectAll("g")
        .data(selected, function(d) { return d; });

    legend.exit().remove();

    // draw legend
    legend
        .enter().append("g")
        .merge(legend)
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + 50 + "," + i * 20 + ")"; });

    // add colored rects to legend
    legendContainer.selectAll("g").append("rect")
        .attr("class", "legend")
        .attr("x", 10)
        .attr("y", 15)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", function(d) { return lineColor(d); });

    // add text to legend
    legendContainer.selectAll("g").append("text")
        .attr("class", function(d) { return "legend" +  d; })
        .attr("x", 40)
        .attr("y", 18)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

    // add event listener to lines that highlights lines and legend items
    lineContainer.selectAll(".line")
        .on("mouseover", function() {
            d3.select(this)
                .style("stroke-width", '4px');
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("stroke-width", '2px');
        });
}
