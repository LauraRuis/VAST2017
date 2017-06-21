/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */


function makeGraph(graph) {
    /**
     *  Takes an object of data (with nodes and links) and draws a force directed graph with d3-force.
     *  Returns svg and node selection.
     * @param {object} graph
     */

    // append svg with g in it
    const margins = {top: 20, right: 200, bottom: 75, left: 50},
        width = 1000,
        height = 1000;

    var svg = d3.select('#graph').append('svg')
        .attr("id", "graphSVG")
        .attr('width', width)
        .attr('height', height);

    var g = svg.append("g")
        .attr("class", "graphContainer")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // global title
    d3.select("#graphSVG").append("text")
        .attr("x", (width / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .text("Lekagul Roadways");

    // scale for coloring nodes
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // start force simulation with center in center of svg
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        // .force("charge", d3.forceManyBody());
        .force("center", d3.forceCenter((width / 2 - 50), height / 2));

    // add zoom capabilities
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);
    zoom_handler(svg);

    // set scale for nodes
    var nodeScale = d3.scaleLog();

    // add links
    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    // add nodes
    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .attr("data-legend",function(d) { return d.group});

    // scale nodes
    nodeScale
        .domain(d3.extent(graph.nodes, function(d) { return d.check_ins }));

    // add title for hovering
    node.append("title")
        .text(function(d) { return d.id; });

    // add nodes and links to simulation
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
    simulation
        .force("link")
        .links(graph.links);

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (width - 150) + ",20)");

    svg.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20, " + (20) + ")");

    var legendSize = d3.legendSize()
        .scale(nodeScale)
        .labelFormat(d3.format(".0f"))
        .cells(5)
        .shape('circle')
        .shapePadding(40)
        .labelOffset(30)
        .orient('vertical')
        .title("Number of check-ins");

    svg.select(".legendSize")
        .call(legendSize);

    svg.select(".legendSize").selectAll("circle")
        .attr("fill", "rgb(27, 158, 119)")
        .attr("r", function() { return d3.select(this).attr("r") * 20; });

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .scale(color);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    function ticked() {
        /**
         * Draws a node and a link from that node to it's target.
         */

        // draw line between source node and target node position
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos * 4; })
            .attr("y1", function (d) { return d.source.ypos * 4; })
            .attr("x2", function (d) { return d.target.xpos * 4; })
            .attr("y2", function (d) { return d.target.ypos * 4; });

        // draw node on position specified in data and highlight connections on mouseover
        node
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.check_ins !== 0 ? nodeScale(d.check_ins) * 20 : nodeScale(1); })
            .attr("cx", function (d) { return d.xpos * 4; })
            .attr("cy", function (d) { return d.ypos * 4; })
            .on("mouseover", function(d) {
                link.style("stroke", function(l) {
                    if (d === l.source || d === l.target) {
                        return "#772718";
                    }
                    else {
                        return "grey";
                    }
                });
                link.style("stroke-opacity", function(l) {
                    if ((d === l.source || d === l.target) === false) {
                        return 0.1;
                    }
                    else {
                        return 1;
                    }
                });
            })
            .on('mouseout', function() {
                var highlighted = d3.selectAll(".highlighted");
                if (highlighted["_groups"][0].length > 0) {
                    d3.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1);
                    d3.selectAll(".highlighted").style("stroke", "rgb(27, 158, 119)").style("stroke-opacity", 1);
                }
                else {
                    d3.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 1);
                }
            })
    }

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", d3.event.transform)
    }

    return [node, svg, simulation, nodeScale];
}

function restart(simulation, graph, nodeScale) {

    // scale for coloring nodes
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // select nodes
    var node = d3.selectAll(".nodes circle");
    var link = d3.selectAll(".links line");

    // re-scale nodes
    var minmax = d3.extent(graph.nodes, function(d) { return d.check_ins });
    if (minmax[0] === 0) {
        minmax[0] = 1;
    }
    nodeScale
        .domain(minmax);

    // update nodes
    node = node.data(graph.nodes);
    node.exit().remove();
    node.enter().append("circle")
        .attr("fill", function(d) { return color(d.group); })
        .attr("r", function(d) { return d.check_ins !== 0 ? nodeScale(d.check_ins) * 20 : nodeScale(minmax[0]); })
        .merge(node);

    // Apply the general update pattern to the links.
    link = link.data(graph.links);
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // update and restart simulation
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.alpha(1).restart();
}

function highlightRoute(svg, dt, selected) {
    /**
     * On row click in datatable, highlight corresponding route of car-id. Also open detailed info about route in table.
     * @param {object} svg
     * @param {object} dt
     */
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    d3.json("../Data/route_per_id.json", function (error, data) {

        if (error) throw error;
        dt.find('tbody').unbind( "click" );
        // d3.selectAll()
        // Add event listener for opening and closing details
        dt.find('tbody').on('click', 'tr td.details-control', function () {
            var id = this.parentNode.id;
            var route = data[id];
            var tr = $(this).closest('tr');
            var row = dt.api().row( tr );
            if ( row.child.isShown() ) {
                d3.select(this)
                    .html('<img src="../details_open.png">');
                row.child.hide();
                tr.removeClass('shown');
                var circles = d3.selectAll(".nodes circle");
                circles
                    .style("stroke", function (d) {
                        return color(d.group);
                    });
                var links = selected[id];
                links.forEach(function(l) {
                    l.style("stroke", "grey").attr("class", "non")
                });
                var highlighted = d3.selectAll(".highlighted");
                if (highlighted["_groups"][0].length > 0) {
                    d3.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1);
                    d3.selectAll(".highlighted").style("stroke", "rgb(27, 158, 119)").style("stroke-opacity", 1);
                }
                else {
                    d3.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 1);
                }
            }
            else {
                d3.select(this)
                    .html('<img src="../details_close.png">');
                svg.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1);
                selected[id] = [];
                route.forEach(function(d, i) {
                    setTimeout(function () {
                        var node = svg.selectAll("#" + d.gate);
                        node
                            .style("stroke", "black")
                            .style("stroke-width", "5px");
                        if (i !== route.length - 1) {
                            var links = svg.selectAll("#" + d.gate + "-" + route[i + 1].gate);
                            selected[id].push(links);
                            links
                                .style("stroke", "rgb(27, 158, 119)")
                                .attr("class", "highlighted")
                                .style("stroke-opacity", 1);
                        }
                    }, 100 * i);
                });

                row.child(format(route)).show();
                tr.addClass('shown');
            }
        } );
    });
    return selected;
}


function format(route) {
    /**
     * Takes array of gates and formats it into a string for showing detailed info in table.
     * @param {object} route
     */
    var routestring = "";
    route.forEach(function(d) {
        routestring += d.gate + " at " + d.timestamp + " <br> "
    });
    return "<strong>Route</strong>" + "<br>" + routestring;
}