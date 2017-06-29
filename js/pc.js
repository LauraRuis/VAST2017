/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

// global variables
var pathFunction,
    xScale,
    yScale,
    globalHeight,
    axis;


function makePC(data, dt) {
    /**
     * Function that draws svg for parallel coordinates and runs function to draw parallel coordinates
     * @param {object} data
     * @param {object} dt
     */

    // set margins, height and width
    const margins = {top: 40, right: 40, bottom: 75, left: 20},
        height = (window.innerHeight - 150) - margins.top - margins.bottom,
        width = (window.innerWidth / 2 - 150) - margins.left - margins.right;

    // make height global
    globalHeight = height;

    // append svg to correct div and append grouped element for parallel coordinates
    var svg = d3.select("#lineChart").append("svg")
        .attr("id", "pcSVG")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .append("g")
        .attr("id", "pcContainer")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + 10) + ")");

    // draw parallel coordinates
    drawPC(data, svg, width, dt);

    return {
        svg: svg,
        height: height,
        width: width
    }
}


function drawPC(data, svg, width, dt) {
    /**
     * Draws parallel coordinates for specified data.
     * @param {object} data
     * @param {object} svg
     * @param {number} width
     * @param {object} dt
     */

    // set scales
    xScale = d3.scale.ordinal().rangePoints([0, width], 1);
    yScale = {};
    var dragging = {};

    // initialize line, axis and containers for back- and foreground lines
    var line = d3.svg.line(),
        background,
        foreground;

    // put axis in axis variable
    axis = d3.svg.axis().orient("left");

    // specify ordinal variables and domains per ordinal variable
    var ordinals = ["car_type", "camping"],
        domains = {"car_type": ["1", "2", "3", "4", "5", "6", "2P"],
            "camping": ["no_camping", "camping0", "camping1", "camping2",
                "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]};

    // dimensions used in parallel coordinates
    var dimensions = ["car_type", "number_stops", "number_days", "speed", "camping"];

    // because of large amount of data points, group data with same variables between dimensions
    var groupedData = groupData(d3.entries(data), dimensions);
    var connections = groupedData[0];
    var pathsPerID = groupedData[1];

    // get minimum and maximum and specify colour range for lines
    var minmax = d3.extent(d3.entries(connections), function(d) { return d.value.amount });
    var colours = ["#a9e6fa", "#88c3fa", "#1E90FF", "#4169E1", "#0000CD", "#00008B"];

    // set scales for colored lines, make range binary
    var binRange = [0, 1];
    var binScale = d3.scale.linear()
        .domain(minmax)
        .range(binRange);
    var colorScale = d3.scale.linear()
        .range(colours)
        .domain(d3.range(0, 1, 1.0 / (colours.length - 1)));

    // scale parallel coordinates dimensions
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

            // on mouseover, move line to front and thicken if path not highlighted
            if (d3.select(this).attr("class").split(" ")[1] !== "shown") {
                d3.select(this).style("stroke-width", "3px");
                d3.select(this).moveToFront();
            }
        })
        .on("mouseout", function() {

            // on mouseout, reset stroke width if path not highlighted
            if (d3.select(this).attr("class").split(" ")[1] !== "shown") {
                d3.select(this).style("stroke-width", "1px");
            }
        })
        .on("click", function(d) {

            // on click fill table with data from that path
            var ids = d.value.ids;
            var arrData = [];
            ids.forEach(function(id) {
                arrData.push({key: id, value: data[id]})
            });
            fillTable(arrData)
        });

    // Add a grouped element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", function(d) { return "dimension " + d; })
        .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return {x: xScale(d)}; })
            .on("dragstart", function(d) {

                // make dragging of dimensions possible
                dragging[d] = xScale(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {

                // reset scales
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

                // on double click show all lines again
                svg.select(".foreground")
                    .selectAll("path")
                    .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
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
            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d])
                .on("brushstart", brushStart)
                .on("brush", brush));
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

    // returns path for given data point
    function path(d) {
        var dims = d3.keys(d.value.path);
        return line(dims.map(function(p) {
            return [xScale(p), yScale[p](d.value.path[p])];
        }));
    }

    // make path function global
    pathFunction = path;

    // get radio functions for removing outliers
    var radioFunction = radioFunctions(data, dimensions, domains, colorScale, binScale, dt);
    radioFunction();

    // when PC drawn, call highlightRoute for event listener on table
    return highlightRoute(d3.select("#graphSVG"), dt, pathsPerID, false)
}


function brushFunctions(svg, foreground, dimensions, ordinals, domains, yScale, pathsPerID, colorScale, binScale) {
    /**
     * Functions for setting brush possibility on each dimension of parallel coordinates.
     * @param {object} svg
     * @param {object} foreground
     * @param {object} dimensions
     * @param {object} ordinals
     * @param {object} domains
     * @param {function} yScale
     * @param {object} pathsperID
     * @param {function} colorScale
     * @param {function} binScale
     */

    // make dict of location of ticks of ordinal scales for inversion purposes
    // need to invert x, y coordinates back to data values
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

    // handles a brush event, toggling the display of foreground lines
    function brush() {

        // get active dimensions and brushed extent
        var actives = dimensions.filter(function (p) {
                return !yScale[p].brush.empty();
            }),
            extents = actives.map(function (p) {
                return yScale[p].brush.extent();
            });

        // for each active dimension, show all lines between brushed extent
        var active = [];
        actives.forEach(function(act, i) {

            // for ordinal scales, first invert values
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

                // search for lines that fall within extent
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

                // search for lines that fall within extent
                foreground.each(function(d) {
                    if (d.key.indexOf(act) !== -1) {
                        if (extents[i][0] <= d.value.path[act] && d.value.path[act] <= extents[i][1]) {
                            active.push(d.value.ids)
                        }
                    }
                });
            }
        });

        // merge all active lines
        var mergedActive = [].concat.apply([], active);

        // set all lines to light grey
        d3.selectAll("path").style("stroke", "#ddd");

        // show all active lines and move them to front
        mergedActive.forEach(function(d) {
            var path = pathsPerID[d];
            path.forEach(function(p) {
                svg.select("path." + p).style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
                svg.select("path." + p).moveToFront()
            })
        });
    }

    // return brush functions for appending to listeners
    return [brushstart, brush]
}


function groupData(dataToGroup, dimensions) {
    /**
     * Function that takes data set, finds out how many times a certain value pair between two dimensions occurs, saves this
     * dimension value pair in a dict and returns this dict. Also saves all dimension value pairs per car ID for
     * highlighting purposes.
     * @param {object} dataToGroup
     * @param {object} dimensions
     */

    // initialize dicts for keeping track of connected variables and all the connections per ID
    var connections = {};
    var pathsPerID = {};

    // first initialize dicts for each ID in data
    dataToGroup.forEach(function(d) {
        pathsPerID[d.key] = [];
        for (var i = 0; i < dimensions.length - 1; i++) {
            var new_key = dimensions[i] + "_" + d.value[dimensions[i]] +
                "_" + dimensions[i + 1] + "_" + d.value[dimensions[i + 1]];
            connections[new_key] = {"path": {}, "amount": 0, "ids": []}
        }
    });

    // fill dicts with path traveled by ID and save each connection between two dimensions once
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


function updatePC(newData, dt) {
    /**
     * Function that updates parallel coordinates with new data. Also updates brush events and calls highlighRoute
     * function when finished.
     * @param {object} newData
     * @param {object} dt
     */

    var foreground,
        background;

    var pcSVG = d3.select("#pcSVG");

    // dimensions used in parallel coordinates with domains per ordinal dimension
    var ordinals = ["car_type", "camping"],
        dimensions = ["car_type", "number_stops", "number_days", "speed", "camping"],
        domains = {"car_type": ["1", "2", "3", "4", "5", "6", "2P"],
            "camping": ["no_camping", "camping0", "camping1", "camping2",
                "camping3", "camping4", "camping5", "camping6", "camping7", "camping8"]};

    // remove old brushes
    pcSVG.selectAll(".extent").remove();

    // delete outliers if radio button 'without outliers' is checked
    $('input[type=radio][name="optradio"]').each(function(i, opt) {
        pcSVG.selectAll(".axis").transition();
        if (opt.checked && i === 0) {
            var outliers = ["20154519024544-322", "20154112014114-381", "20155705025759-63", "20162904122951-717"];
            outliers.forEach(function(o) {
                delete newData[o];
            });
        }
    });

    // group data
    var groupedData = groupData(d3.entries(newData), dimensions);
    var connections = groupedData[0];
    var pathsPerID = groupedData[1];

    // reset scales
    var colours = ["#a9e6fa", "#88c3fa", "#1E90FF", "#4169E1", "#0000CD", "#00008B"];
    var minmax = d3.extent(d3.entries(connections), function(d) { return d.value.amount });
    var binScale = d3.scale.linear().domain(minmax).range([0, 1]);
    var colorScale = d3.scale.linear()
        .range(colours)
        .domain(d3.range(0, 1, 1.0 / (colours.length - 1)));

    // get radio functions for updating parallel coordinates without outliers
    radioFunctions(newData, dimensions, domains, colorScale, binScale, dt);

    // remove fore- and background lines
    pcSVG
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections)).exit().remove();

    pcSVG
        .select("g.background")
        .selectAll("path")
        .data(d3.entries(connections)).exit().remove();

    // set all remaining background lines to grey
    d3.select(".background").selectAll("path").style("stroke", "lightgrey");

    // update old lines
    foreground = pcSVG
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .attr("class", function(d) { return d.key; })
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", pathFunction);

    // draw new lines
    foreground = pcSVG
        .select("g.foreground")
        .selectAll("path")
        .data(d3.entries(connections))
        .enter().append("path")
        .attr("class", function(d) { return d.key; })
        .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); })
        .attr("d", pathFunction);

    // update event listener for clicking on lines with new data
    pcSVG.select(".foreground").selectAll("path")
        .on("click", function(d) {
            var ids = d.value.ids;
            var arrData = [];
            ids.forEach(function(id) {
                arrData.push({key: id, value: newData[id]})
        });
        fillTable(arrData)
    });

    // get brush functions
    var pcFunctions = brushFunctions(pcSVG,
        pcSVG.select(".foreground").selectAll("path"),
        dimensions, ordinals, domains, yScale, pathsPerID, colorScale, binScale);
    var brushStart = pcFunctions[0];
    var brush = pcFunctions[1];

    // Add and store a brush for each axis.
    pcSVG.selectAll(".dimension").append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brushstart", brushStart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    return highlightRoute(d3.select("#graphSVG"), dt, pathsPerID, false)
}


function scalePC(data, dimensions, domains) {
    /**
     *
     * @param {object} data
     * @param {object} dimensions
     * @param {object} domains
     */

    // create a scale for each dimension
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


function radioFunctions(data, dimensions, domains, colorScale, binScale, dt) {
    /**
     * Function that sets all radio functions for updating parallel coordinates with or without outliers.
     * @param {object} data
     * @param {object} dimensions
     * @param {object} domains
     * @param {function} colorScale
     * @param {function} binScale
     * @param {object} dt
     */

    function radioListener() {
        $('input[type=radio][name="optradio"]').change(
            function(){

                // on change set all background lines to grey
                d3.select(".background").selectAll("path").style("stroke", "lightgrey");

                // make deep copy of data (otherwise option to get back data with outliers does not work)
                var dataMinOutlier = jQuery.extend(true, {}, data);

                // update axis
                var ax = d3.select("#pcSVG").selectAll(".axis").transition();
                if (this.id === "without outliers") {

                    // remove outliers from data
                    var outliers = ["20154519024544-322", "20154112014114-381", "20155705025759-63", "20162904122951-717"];
                    outliers.forEach(function(o) {
                        delete dataMinOutlier[o];
                    });

                    // rescale PC
                    scalePC(d3.entries(dataMinOutlier), dimensions, domains);

                    // update axis
                    ax
                        .each(function(d) {
                            d3.select(this).call(axis.scale(yScale[d]));
                            d3.select(this).on("dblclick", function() {
                                d3.select("#pcSVG").select(".foreground")
                                    .selectAll("path")
                                    .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
                            });
                        });
                    updatePC(dataMinOutlier, dt);
                }
                else {

                    // rescale PC
                    scalePC(d3.entries(data), dimensions, domains);

                    // update axis
                    ax
                        .each(function(d) {
                            d3.select(this).call(axis.scale(yScale[d]));
                            d3.select(this).on("dblclick", function() {
                                d3.select("#pcSVG").select(".foreground")
                                    .selectAll("path")
                                    .style("stroke", function(d) { return colorScale(binScale(d.value.amount)); });
                            });
                        });
                    updatePC(data, dt);
                }
            });
    }

    return radioListener;
}