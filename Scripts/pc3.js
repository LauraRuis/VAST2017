/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

function makePC(data) {

    // initialize attributes of svg as constants
    const marginsPC = {top: 40, right: 10, bottom: 75, left: 20},
        heightPC = 800 - marginsPC.top - marginsPC.bottom,
        widthPC = 800 - marginsPC.left - marginsPC.right;

    var svg = d3.select('#linechart').append('svg')
        .attr("id", "pcSVG")
        .attr('width', widthPC + marginsPC.left + marginsPC.right)
        .attr('height', heightPC + marginsPC.top + marginsPC.bottom)
        .append("g")
        .attr("id", "pcContainer")
        .attr("transform", "translate(" + marginsPC.left + "," + (marginsPC.top + 10) + ")");

    const margins = {top: 40, right: 10, bottom: 75, left: 20},
        height = 800 - margins.top - margins.bottom,
        width = 800 - margins.left - margins.right;

    drawPC(data, svg, height, width);

    return {
        svg: svg,
        height: height,
        width: width
    }
}

function drawPC(data, svg, height, width) {

    d3.selectAll(".foreground").remove();
    d3.selectAll(".background").remove();
    // set scales
    var xScale = d3.scale.ordinal().rangePoints([0, width], 1),
        yScale = {},
        dragging = {};

    // initialize line, axis and containers for back- and foreground lines
    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    // make some data-specific arrays
    var ordinals = ["car_type", "camping"],
        domains = {"car_type": ["1", "2", "3", "4", "5", "6", "2P"],
            "camping": ["no_camping", "camping0", "camping1", "camping2", "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]};

    // initialize dicts for keeping track of connected variables and all the connections per ID
    var connections = {};
    var pathsPerID = {};

    var dimensions = ["car_type", "camping", "number_stops", "number_days", "month"];
    d3.entries(data).forEach(function(d) {
        pathsPerID[d.key] = [];
        for (var i = 0; i < dimensions.length - 1; i++) {
            var new_key = dimensions[i] + "_" + d.value[dimensions[i]] + "_" + dimensions[i + 1] + "_" + d.value[dimensions[i + 1]];
            connections[new_key] = {"path": {}, "amount": 0, "ids": []}
        }
    });
    d3.entries(data).forEach(function(d) {
        for (var i = 0; i < dimensions.length - 1; i++) {
            var new_key = dimensions[i] + "_" + d.value[dimensions[i]] + "_" + dimensions[i + 1] + "_" + d.value[dimensions[i + 1]];
            pathsPerID[d.key].push(new_key);
            connections[new_key]["amount"] += 1;
            connections[new_key]["path"][dimensions[i]] = d.value[dimensions[i]];
            connections[new_key]["path"][dimensions[i + 1]] = d.value[dimensions[i + 1]];
            connections[new_key]["ids"].push(d.key)
        }
    });

    // Extract the list of dimensions and create a scale for each.
    xScale.domain(dimensions.filter(function(d) {
        if(d === "camping") {
            yScale[d] = d3.scale.ordinal().domain(domains.camping).rangePoints([height, 0]);
        }
        else if (d === "car_type") {
            yScale[d] = d3.scale.ordinal().domain(domains.car_type).rangePoints([height, 0]);
        }
        else {
            yScale[d] = d3.scale.linear().domain(d3.extent(d3.entries(data), function(p) {
                return p.value[d];
            })).range([height, 0]);
        }
        return true;
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        // .attr("class", function(d) { return d.key; })
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        .attr("class", function(d) { return d.key; })
        .attr("d", path);

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
                d3.selectAll("path").style("stroke", "steelblue");
            });})
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brushstart", brushstart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

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

    function colorLines(dim) {
        d3.selectAll("path").style("stroke", "#772718");
        var actives = [];
        var non = [];
        d3.entries(data).forEach(function(d) {
            // console.log(d);
            if (d.value[dim] === 1) {
                actives.push(d.key);
                var path = pathsPerID[d.key];
                path.forEach(function(p) {
                    svg.select("path." + p).style("stroke", "steelblue");
                })
            }
            else {
                non.push(d.key)
            }
        });
    }

    function position(d) {
        var v = dragging[d];
        return v === undefined ? xScale(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        var dims = d3.keys(d.value.path);
        return line(dims.map(function(p, i) {
            return [xScale(p), yScale[p](d.value.path[p])];
        }));
    }

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
                svg.select("path." + p).style("stroke", "steelblue");
            })
        });
    }
}