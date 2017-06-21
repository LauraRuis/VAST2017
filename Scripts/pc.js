/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    // initialize attributes of svg as constants
    const margins = {top: 40, right: 10, bottom: 75, left: 20},
        height = 1000 - margins.top - margins.bottom,
        width = 1000 - margins.left - margins.right;

    var svg = d3.select('body').append('svg')
        .attr('width', width + margins.left + margins.right)
        .attr('height', height + margins.top + margins.bottom)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + 10) + ")");

    var xScale = d3.scaleBand().range([0, width]);
    var yScale = {};
    var dragging = {};

    var line = d3.line();
    var axis = d3.axisLeft();
    var background;
    var foreground;

    d3.json("../Data/vars_per_id.json", function(error, data) {

        if (error) throw error;

        var dimensions = ["car_type", "camping", "number_stops", "number_days"];

        // Extract the list of dimensions and create a scale for each.
        xScale.domain(dimensions.filter(function(d) {
            if(d === "car_type" || d === "camping") {
                yScale[d] = d3.scalePoint().domain(d3.entries(data).map(function(p) {
                    return p.value[d];
                })).range([height, 0]);
            }
            else {
                yScale[d] = d3.scaleLinear().domain(d3.extent(d3.entries(data), function(p) {
                    return p.value[d];
                })).range([height, 0]);
            }
           return true;
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(d3.entries(data))
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(d3.entries(data))
            .enter().append("path")
            .attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) {
                return "translate(" + xScale(d) + ")";
            })
            .call(d3.drag()
                .on("start", function(d) {
                    dragging[d] = this.__origin__ = xScale(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) {
                        return position(a) - position(b);
                    });
                    xScale.domain(dimensions);
                    g.attr("transform", function(d) {
                        return "translate(" + position(d) + ")";
                    });
                })
                .on("end", function(d) {
                    delete this.__origin__;
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ")");
                    transition(foreground)
                        .attr("d", path);
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
                d3.select(this).call(d3.axisRight(yScale[d]));
            })
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text("hoi");

        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(yScale[d].brush = d3.brushY(yScale[d]).on("brush", brush));
            })
            .attr("x", -8)
            .attr("width", 16);

        function position(d) {
            var v = dragging[d];
            return v === null ? xScale(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) {
                return [xScale(p), yScale[p](d.value[p])];
            }));
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            var actives = dimensions.filter(function(p) { return !yScale[p].brush.empty(); }),
                extents = actives.map(function(p) {
                    return yScale[p].brush.extent;
                });
            foreground.style("display", function(d) {
                return actives.every(function(p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });
        }
    });
};
