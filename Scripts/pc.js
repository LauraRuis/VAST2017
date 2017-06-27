/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

var pathFunction,
    xScale,
    yScale,
    globalHeight;

function makePC(data, dt) {

    // initialize attributes of svg as constants
    const margins = {top: 40, right: 10, bottom: 75, left: 20},
        height = (window.innerHeight - 150) - margins.top - margins.bottom,
        width = (window.innerWidth / 2 - 150) - margins.left - margins.right;

    globalHeight = height;

    var svg = d3.select('#lineChart').append('svg')
        .attr("id", "pcSVG")
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append("g")
        .attr("id", "pcContainer")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + 10) + ")");

    drawPC(data, svg, width, dt);

    return {
        svg: svg,
        height: height,
        width: width
    }
}

function drawPC(data, svg, width, dt) {
    
    // remove all old lines
    d3.selectAll(".foreground").remove();
    d3.selectAll(".background").remove();

    // set scales
    xScale = d3.scale.ordinal().rangePoints([0, width], 1);
    yScale = {};
    var dragging = {};

    // initialize line, axis and containers for back- and foreground lines
    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    // make some data-specific arrays
    var ordinals = ["car_type", "camping"],
        domains = {"car_type": ["1", "2", "3", "4", "5", "6", "2P"],
            "camping": ["no_camping", "camping0", "camping1", "camping2",
                "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]};

    // dimensions used in parallel coordinates
    var dimensions = ["car_type", "number_stops", "number_days", "speed", "camping"];

    var groupedData = groupData(d3.entries(data), dimensions);
    var connections = groupedData[0];
    var pathsPerID = groupedData[1];

    var minmax = d3.extent(d3.entries(connections), function(d) { return d.value.amount });
    var colours = ["#a9e6fa", "#88c3fa", "#1E90FF", "#4169E1", "#0000CD", "#00008B"];

    var binScale = d3.scale.linear().domain(minmax).range([0, 1]);
    var colorScale = d3.scale.linear()
        .range(colours)
        .domain(d3.range(0, 1, 1.0 / (colours.length - 1)));

    scalePC(d3.entries(data), dimensions, domains);

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        .attr("class", function(d) { return d.key; })
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", path)
        .on("mouseover", function() {
            if (d3.select(this).attr("class").split(" ")[1] !== "shown") {
                d3.select(this).style("stroke-width", "3px")
            }
        })
        .on("mouseout", function() {
            if (d3.select(this).attr("class").split(" ")[1] !== "shown") {
                d3.select(this).style("stroke-width", "1px")
            }
        })
        .on("click", function(d) {
            var ids = d.value.ids;
            var arrData = [];
            ids.forEach(function(id) {
                arrData.push({key: id, value: data[id]})
            });
            fillTable(arrData)
        });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", function(d) { return "dimension " + d; })
        .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return {x: xScale(d)}; })
            .on("dragstart", function(d) {
                dragging[d] = xScale(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                xScale.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) {
            d3.select(this).call(axis.scale(yScale[d]));
            d3.select(this).on("dblclick", function() {
                svg.select(".foreground").selectAll("path").style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
            });})
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // get brush functions
    var pcFunctions = brushFunctions(svg, foreground, dimensions, ordinals, domains, yScale, pathsPerID, colorScale, binScale);
    var brushStart = pcFunctions[0];
    var brush = pcFunctions[1];

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brushstart", brushStart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function transition(g) {
        return g.transition().duration(500);
    }

    function position(d) {
        var v = dragging[d];
        return v === undefined ? xScale(d) : v;
    }

    function colorLines(dim) {
        svg.selectAll("path")
            .style("stroke", "#772718");

        var actives = [];
        var non = [];
        d3.entries(data).forEach(function(d) {
            if (d.value[dim] === 1) {
                actives.push(d.key);
                var path = pathsPerID[d.key];
                path.forEach(function(p) {
                    svg.select("path." + p)
                        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
                })
            }
            else {
                non.push(d.key)
            }
        });
    }

    // Returns the path for a given data point.
    function path(d) {
        var dims = d3.keys(d.value.path);
        return line(dims.map(function(p) {
            return [xScale(p), yScale[p](d.value.path[p])];
        }));
    }

    pathFunction = path;

    function radioListener() {
        $('input[type=radio][name="optradio"]').change(
            function(){
                colorLines(this.id)
            });
    }
    radioListener();

    return highlightRoute(d3.select("#graphSVG"), dt, pathsPerID)
}

function brushFunctions(svg, foreground, dimensions, ordinals, domains, yScale, pathsPerID, colorScale, binScale) {

    // make dict of location of ticks of ordinal scales for inversion purposes
    var inversDict = {};
    ordinals.forEach(function(p) {
        inversDict[p] = {};
        domains[p].forEach(function(k) {
            var ticks = d3.selectAll(".dimension." + p + " .tick")
                .filter(function(d){ return d===k;} );
            inversDict[p][k] = d3.transform(ticks.attr("transform")).translate[1]
        });
    });

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function (p) {
                return !yScale[p].brush.empty();
            }),
            extents = actives.map(function (p) {
                return yScale[p].brush.extent();
            });

        var active = [];
        actives.forEach(function(act, i) {
            if (act === "camping" || act === "car_type") {
                var temp1 = extents[i][0];
                var temp2 = extents[i][1];
                var invert = d3.entries(inversDict[act]);
                var key = [];
                invert.forEach(function(d) {
                    if (temp1 <= d.value && d.value <= temp2) {
                        key.push(d.key)
                    }
                });
                foreground.each(function(d) {
                    if (d.key.indexOf(act) !== -1) {
                        key.forEach(function(k) {
                            if (k === d.value.path[act]) {
                                active.push(d.value.ids)
                            }
                        })
                    }
                });
            }
            else {
                foreground.each(function(d) {
                    if (d.key.indexOf(act) !== -1) {
                        if (extents[i][0] <= d.value.path[act] && d.value.path[act] <= extents[i][1]) {
                            active.push(d.value.ids)
                        }
                    }
                });
            }
        });

        var mergedActive = [].concat.apply([], active);
        d3.selectAll("path").style("stroke", "#ddd");
        mergedActive.forEach(function(d) {
            var path = pathsPerID[d];
            path.forEach(function(p) {
                console.log(svg.select("path." + p))
                svg.select("path." + p).style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
            })
        });
    }

    return [brushstart, brush]
}

function groupData(dataToGroup, dimensions) {

    // initialize dicts for keeping track of connected variables and all the connections per ID
    var connections = {};
    var pathsPerID = {};

    // because of large amount of data, only draw each possible connection once
    // first initialize dicts for each ID in data
    dataToGroup.forEach(function(d) {
        pathsPerID[d.key] = [];
        for (var i = 0; i < dimensions.length - 1; i++) {
            var new_key = dimensions[i] + "_" + d.value[dimensions[i]] +
                "_" + dimensions[i + 1] + "_" + d.value[dimensions[i + 1]];
            connections[new_key] = {"path": {}, "amount": 0, "ids": []}
        }
    });

    // fill dicts with path traveled by ID
    dataToGroup.forEach(function(d) {
        for (var i = 0; i < dimensions.length - 1; i++) {
            var new_key = dimensions[i] + "_" + d.value[dimensions[i]] +
                "_" + dimensions[i + 1] + "_" + d.value[dimensions[i + 1]];

            pathsPerID[d.key].push(new_key);

            // keep track of how often a connection occurs
            connections[new_key]["amount"] += 1;
            connections[new_key]["path"][dimensions[i]] = d.value[dimensions[i]];
            connections[new_key]["path"][dimensions[i + 1]] = d.value[dimensions[i + 1]];
            connections[new_key]["ids"].push(d.key)
        }
    });

    return [connections, pathsPerID]
}

// update parallel coordinates
function updatePC(newData, dt) {

    var foreground,
        background;

    // dimensions used in parallel coordinates
    var ordinals = ["car_type", "camping"],
        dimensions = ["car_type", "number_stops", "number_days", "speed", "camping"],
        domains = {"car_type": ["1", "2", "3", "4", "5", "6", "2P"],
            "camping": ["no_camping", "camping0", "camping1", "camping2",
                "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]};

    var groupedData = groupData(d3.entries(newData), dimensions);
    var connections = groupedData[0];
    var pathsPerID = groupedData[1];

    var colours = ["#a9e6fa", "#88c3fa", "#1E90FF", "#4169E1", "#0000CD", "#00008B"];
    var minmax = d3.extent(d3.entries(connections), function(d) { return d.value.amount });
    var binScale = d3.scale.linear().domain(minmax).range([0, 1]);
    var colorScale = d3.scale.linear()
        .range(colours)
        .domain(d3.range(0, 1, 1.0 / (colours.length - 1)));

    d3.select("#pcSVG")
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections)).exit().remove();

    d3.select("#pcSVG")
        .select("g.background")
        .selectAll("path")
        .data(d3.entries(connections)).exit().remove();

    foreground = d3.select("#pcSVG")
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .attr("class", function(d) { return d.key; })
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", pathFunction);

    foreground = d3.select("#pcSVG")
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        .attr("class", function(d) { return d.key; })
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", pathFunction);

    d3.select("#pcSVG").select(".foreground").selectAll("path")
        .on("click", function(d) {
            var ids = d.value.ids;
            var arrData = [];
            ids.forEach(function(id) {
                arrData.push({key: id, value: newData[id]})
        });
        fillTable(arrData)
    });

    // get brush functions
    var pcFunctions = brushFunctions(d3.select("#pcSVG"),
        d3.select("#pcSVG").select(".foreground").selectAll("path"),
        dimensions, ordinals, domains, yScale, pathsPerID, colorScale, binScale);
    var brushStart = pcFunctions[0];
    var brush = pcFunctions[1];

    // Add and store a brush for each axis.
    d3.select("#pcSVG").selectAll(".dimension").append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brushstart", brushStart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    return highlightRoute(d3.select("#graphSVG"), dt, pathsPerID)
}

function scalePC(data, dimensions, domains) {

    // Extract the list of dimensions and create a scale for each.
    xScale.domain(dimensions.filter(function(d) {

        // ordinal scales for camping and car type
        if(d === "camping") {
            yScale[d] = d3.scale.ordinal().domain(domains.camping).rangePoints([globalHeight, 0]);
        }
        else if (d === "car_type") {
            yScale[d] = d3.scale.ordinal().domain(domains.car_type).rangePoints([globalHeight, 0]);
        }

        // linear for every other dimension
        else {
            yScale[d] = d3.scale.linear().domain([0, d3.extent(data, function(p) {
                return p.value[d];
            })[1]]).range([globalHeight, 0]);
        }
        return true;
    }));

}