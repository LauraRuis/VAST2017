/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

 /**
 * Function that draws empty line chart, ready to be filled with lines.
 * */
function makeLineChart(data) {

     // initialize attributes of svg as constants
     const margins = {top: 20, right: 200, bottom: 75, left: 50},
         height = 500 - margins.top - margins.bottom,
         width = 1000 - margins.left - margins.right;

     // append svg element for line chart
     var lineContainer = d3.select("#linechart").append("svg")
         .attr("id", "lineSVG")
         .attr("height", height + margins.top + margins.bottom)
         .attr("width", width + margins.left + margins.right).append("g")
         .attr("id", "lineContainer")
         .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

     // append svg for legend
     var legendSvg = d3.select("#lineSVG").append("svg")
         .attr("id", "legendSVG")
         .attr("height", height + margins.top + margins.bottom)
         .attr("width", width + margins.left + margins.right).append("g")
         .attr("id", "legendContainer")
         .attr("transform", "translate(" + width + "," + 0 + ")");

     // make legend container
     var legendContainer = legendSvg.append("g")
         .attr("font-family", "sans-serif")
         .attr("font-size", 10)
         .attr("text-anchor", "front");

     // make title for line chart
     var titleContainer = lineContainer.append("g")
         .attr("class", "titleContainer");

     titleContainer
         .append("text")
         .attr("x", (width / 2))
         .attr("y", top)
         .attr("class", "title")
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .text("For check-ins per gate, click node on graph.");

     // set scales for lines
     var xLine = d3.scaleTime()
             .range([0, width]),
         yLine = d3.scaleLinear()
             .range([height, 0]);

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

    return {"lineContainer": lineContainer, "legendContainer": legendContainer, "xLine": xLine, "yLine": yLine, "width": width, "titleContainer": titleContainer}
 }

/**
 * Function that adds or deletes lines and legend rects according to array of selected country.
 * @param {object} data
 * */
function updateLines(data, lineObject, selected, gate) {

    // get variables from lineObject
    var lineContainer = lineObject.lineContainer,
        legendContainer = lineObject.legendContainer,
        xLine = lineObject.xLine,
        yLine = lineObject.yLine,
        width = lineObject.width,
        titleContainer = lineObject.titleContainer;

    var title = titleContainer.selectAll("text")
        .data(["Check-ins of " + gate]);

    title.attr("class", "update");
    title.enter().append("text")
        .attr("class", "enter")
        .attr("x", function(d, i) { return i * 32; })
        .attr("dy", ".35em")
        .merge(title)
        .text(function(d) { return d; });

    // EXIT
    // Remove old elements as needed.
    title.exit().remove();

    var period = d3.extent(data, function(d) {return d.key});
    xLine.domain(period);

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
    var line = d3.line()
        .x(function(d) { return xLine(d.date); })
        .y(function(d) { return yLine(d.value); });

    // update axis
    lineContainer.selectAll(".y.axis")
        .transition()
        .duration(750)
        .call(d3.axisLeft(yLine));

    // update lines
    lineContainer.selectAll(".line").data(selected).exit().remove();
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
        .text(function(d) { return d !== "total" ? "Car-type " + d : d; });

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
