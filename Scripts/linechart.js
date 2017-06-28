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

    // parse data
    var arrData = dateParser(data);

    // initialize attributes of svg as constants
    const margins = {top: 20, right: 350, bottom: 75, left: 50},
        height = (window.innerHeight / 2 + 80) - margins.top - margins.bottom,
        width = (window.innerWidth / 2 + 100) - margins.left - margins.right;

    // append svg element for line chart
    var lineContainer = version4.select("#lineChart    ").append("svg")
        .attr("id", "lineSVG")
        .attr("height", height + margins.top + margins.bottom)
        .attr("width", width + margins.left + margins.right).append("g")
        .attr("id", "lineContainer")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // append svg for legend
    var legendSvg = version4.select("#lineSVG").append("svg")
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
        .attr("id", "titleContainer");

    titleContainer
        .append("text")
        .attr("x", (width / 2))
        .attr("y", top)
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("For number of cars per gate per day, click node on graph.");

    // set scales for lines
    var xLine = version4.scaleTime()
            .range([0, width]),
        yLine = version4.scaleLinear()
            .range([height, 0]);

    // set domain
    var format = version4.timeFormat("%b %Y");
    var period = version4.extent(arrData, function(d) {return d.key});
    xLine.domain(period);
    yLine.domain(version4.extent(arrData, function(d) {return d.value.total}));

    // Add the X Axis
    lineContainer.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(version4.axisBottom(xLine)
            .tickFormat(function(d) { return format(d); }))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // Add the Y Axis
    lineContainer.append("g")
        .attr("class", "axis y")
        .call(version4.axisLeft(yLine))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y",  6)
        .attr("dy", ".71em")
        .text("Check-ins");

    return {
        "xLine": xLine,
        "yLine": yLine
    }
}

/**
 * Function that adds or deletes lines and legend rects according to array of selected country.
 * @param {object} data
 * */
function updateLines(data, lineObject, selected, gate) {

    var arrData = dateParser(data);

    // get variables from lineObject
    var lineContainer = version4.select("#lineContainer"),
        legendContainer = version4.select("#legendContainer"),
        xLine = lineObject.xLine,
        yLine = lineObject.yLine,
        titleContainer = version4.select("#titleContainer");

    var title = titleContainer.selectAll("text")
        .data(["Number of cars per day of " + gate]);

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

    var period = version4.extent(arrData, function(d) {return d.key});
    xLine.domain(period);

    yLine.domain(version4.extent(arrData, function(d) {return d.value.total}));

    // get current max value for y axis scaling and put data per line in dict of arrays
    var lineData = {};
    var max = 0;
    selected.forEach(function(s) {
        lineData[s] = [];
        arrData.forEach(function(item) {
            lineData[s].push({date: item.key, value: item.value[s]});
            if (item.value[s] > max) {
                max = item.value[s]
            }
        });
    });
    yLine.domain([0, max]);

    // scale for color of lines
    var legendArray = carTypeColors(version4);
    var legendDict = legendArray[1];

    // make new line
    var line = version4.line()
        .x(function(d) { return xLine(d.date); })
        .y(function(d) { return yLine(d.value); });

    // update axis
    lineContainer.selectAll(".y.axis")
        .transition()
        .duration(750)
        .call(version4.axisLeft(yLine));

    // update lines
    lineContainer.selectAll(".line").data(selected).exit().remove();
    lineContainer.selectAll(".line")
        .data(selected)
        .attr("class", "line")
        .transition()
        .duration(650)
        .attr("id", function(d) { return "line" + d; })
        .style("stroke", function(d) { return legendDict[d]; })
        .attr("d", function(d) { return line(lineData[d]); });

    lineContainer.selectAll(".line")
        .data(selected)
        .enter().append("path")
        .attr("class", "line")
        .attr("id", function(d) { return "line" + d; })
        .transition()
        .duration(650)
        .style("stroke", function(d, i) {  return legendDict[d]; })
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
        .attr("fill", function(d) { return legendDict[d]; });

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
            version4.select(this)
                .style("stroke-width", '3px');
        })
        .on("mouseout", function() {
            version4.select(this)
                .style("stroke-width", "1px");
        });
}


function updateFocus(lineObject, date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var day = date.getUTCDate();
    var newDate = new Date(year, month, day);
    newDate.setDate(newDate.getDate() + 7);

    var areas = {
        x0: lineObject.xLine(date),
        x1: lineObject.xLine(newDate),
        y0: lineObject.yLine(0),
        y1: 0
    };
    var area = version4.area()
        .x0( function(d) { return d.x0 } )
        .x1( function(d) { return d.x1 } )
        .y0( function(d) { return d.y0 } )
        .y1(  function(d) { return d.y1 } );

    var lineContainer = version4.select("#lineContainer");

    lineContainer.selectAll(".area").remove();

    lineContainer.append("path")
        .datum([areas])
        .attr("class", "area")
        .attr("stroke", "red")
        .attr("d", area);
}


function nodeListener(node, lineObject, selected, currentData, currentID) {

    node
        .on("click", function(d) {
            var fileString = "../Data/data per gate/check-ins_day_" + d.id + ".json";

            version4.json(fileString, function (error, new_data) {

                if (error) throw error;

                currentData = new_data;
                currentID = d.id;
                updateLines(new_data, lineObject, selected, d.id)

            });
        });

    $('input:checkbox[name="mode"]').change(
        function(){
            if (selected.indexOf(version4.select(this).data()[0]) === -1 && this.checked) {
                selected.push(version4.select(this).data()[0])
            }
            else {
                var index = selected.indexOf(version4.select(this).data()[0]);
                if (index !== -1) {
                    selected.splice(index, 1)
                }
            }
            updateLines(currentData, lineObject, selected, currentID);
        });
}