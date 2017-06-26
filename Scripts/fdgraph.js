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
    const margins = {top: 200, right: 200, bottom: 75, left: 50},
        width = (window.innerWidth / 2) - margins.right - margins.left,
        height = (window.innerHeight - margins.top - margins.bottom) ;

    var svg = version4.select('#graph').append('svg')
        .attr("id", "graphSVG")
        .attr('width', width)
        .attr('height', height);

    var g = svg.append("g")
        .attr("class", "graphContainer")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // scale for coloring nodes
    var color = version4.scaleOrdinal(version4.schemeCategory20);

    // start force simulation with center in center of svg
    var simulation = version4.forceSimulation()
        .force("link", version4.forceLink().id(function(d) { return d.id; }))
        .force("center", version4.forceCenter());

    // set scale for nodes
    var nodeScale = version4.scaleLog();

    // add zoom capabilities
    var zoom_handler = version4.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);
    zoom_handler.scaleTo(svg, 0.6);

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
        .attr("data-legend", function(d) { return d.group; });

    // scale nodes
    var minmax = version4.extent(graph.nodes, function(d) { return d.check_ins });
    if (minmax[0] === 0) {
        minmax[0] = 1;
    }
    nodeScale
        .domain(minmax);

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
        .attr("transform", "translate(" + (width - 80) + ",20)");

    svg.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20, " + (height - 50) + ")");

    var legendSize = version4.legendSize()
        .scale(nodeScale)
        .labelFormat(version4.format(".0f"))
        .cells(5)
        .shape('circle')
        .shapePadding(40)
        .labelOffset(30)
        .orient('horizontal')
        .title("Number of check-ins");

    svg.select(".legendSize")
        .call(legendSize);

    svg.select(".legendSize").selectAll("circle")
        .attr("fill", "rgb(27, 158, 119)")
        .attr("r", function() { return version4.select(this).attr("r") * 20; });

    var legendOrdinal = version4.legendColor()
        .shape("path", version4.symbol().type(version4.symbolCircle).size(150)())
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
            .attr("x1", function (d) { return d.source.xpos * 4 - 200; })
            .attr("y1", function (d) { return d.source.ypos * 4 - 200; })
            .attr("x2", function (d) { return d.target.xpos * 4 - 200; })
            .attr("y2", function (d) { return d.target.ypos * 4 - 200; });

        var highlighted;
        // draw node on position specified in data and highlight connections on mouseover
        node
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.check_ins !== 0 ? nodeScale(d.check_ins) * 20 : nodeScale(1); })
            .attr("cx", function (d) { return d.xpos * 4 - 200; })
            .attr("cy", function (d) { return d.ypos * 4 - 200; })
            .on("mouseover", function(d) {
                highlighted = svg.selectAll(".highlightedLink");
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
                highlighted = svg.selectAll(".highlightedLink");
                if (highlighted["_groups"][0].length > 0) {
                    version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1).style("stroke-width", "1px");
                    version4.selectAll(".highlightedLink").style("stroke", "rgb(27, 158, 119)").style("stroke-opacity", 1).style("stroke-width", "3px");
                }
                else {
                    version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 1).style("stroke-width", "1px");
                }
            })
    }

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", version4.event.transform);
    }

    return {
        node: node,
        svg: svg,
        simulation: simulation,
        scale: nodeScale
    };
}

function restart(simulation, graph, nodeScale) {

    // scale for coloring nodes
    var color = version4.scaleOrdinal(version4.schemeCategory20);

    // select nodes
    var node = version4.selectAll(".nodes circle");
    var link = version4.selectAll(".links line");

    // re-scale nodes
    var minmax = version4.extent(graph.nodes, function(d) { return d.check_ins });
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


function highlightRoute(svg, dt, paths) {
    /**
     * On row click in datatable, highlight corresponding route of car-id. Also open detailed info about route in table.
     * @param {object} svg
     * @param {object} dt
     */
    // var svg = d3.select("#graphSVG");
    var color = version4.scaleOrdinal(version4.schemeCategory20);
    version4.json("../Data/route_per_ID.json", function (error, data) {

        if (error) throw error;

        dt.find('tbody').unbind( "click" );

        // Add event listener for opening and closing details
        dt.find('tbody').on('click', 'tr td.details-control', function () {
            var id = this.parentNode.id;
            var route = data[id];
            var tr = $(this).closest('tr');
            var row = dt.api().row( tr );
            if ( row.child.isShown() ) {
                version4.select(this)
                    .html('<img height="15" width="15" src="../details_open.png">');
                row.child.hide();
                tr.removeClass('shown');
                var circles = version4.selectAll(".nodes circle");
                circles
                    .style("stroke", function (d) {
                        return color(d.group);
                    });
                route.forEach(function(d, i) {
                    if (i !== route.length - 1) { {
                        svg.selectAll("#" + d.gate + "-" + route[i + 1].gate).style("stroke", "grey").attr("class", "non");
                    }}
                });
                var highlighted = version4.selectAll(".highlightedLink");
                if (highlighted["_groups"][0].length > 0) {
                    version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1).style("stroke-width", "1px");
                    version4.selectAll(".highlightedLink").style("stroke", "rgb(27, 158, 119)").style("stroke-opacity", 1);
                }
                else {
                    version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 1);
                }
                if (paths !== undefined && paths !== false) {
                    var path = paths[id];
                    path.forEach(function(p) {
                        d3.select("." + p)
                            .attr("class", "notShown")
                            .style("stroke", "steelblue")
                            .style("stroke-width", "1px");
                    })
                }
            }
            else {
                version4.select(this)
                    .html('<img height="15" width="15" src="../details_close.png">');
                svg.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1);
                route.forEach(function(d, i) {
                    setTimeout(function () {
                        var node = svg.selectAll("#" + d.gate);
                        node
                            .attr("class", "highlightedNode")
                            .style("stroke", "black")
                            .style("stroke-width", "5px");
                        if (i !== route.length - 1) {
                            var links = svg.selectAll("#" + d.gate + "-" + route[i + 1].gate);
                            links
                                .attr("class", "highlightedLink")
                                .style("stroke", "rgb(27, 158, 119)")
                                .style("stroke-width", "3px")
                                .style("stroke-opacity", 1);
                        }
                    }, 100 * i);
                });
                if (paths !== undefined && paths !== false) {
                    var path = paths[id];
                    path.forEach(function(p) {
                        var pathSelection = d3.select("." + p);
                        pathSelection
                            .attr("class", p + " shown")
                            .style("stroke", "rgb(27, 158, 119)")
                            .style("stroke-width", "3px");

                        pathSelection.each(function () {
                            this.parentNode.appendChild(this);
                        });
                    });
                }
                row.child(format(route)).show();
                tr.addClass('shown');
                window.scrollTo(0, 0);
            }
        } );
    });
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