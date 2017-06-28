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
        width = (window.innerWidth / 2 + 100) - margins.right - margins.left,
        height = (window.innerHeight - margins.top) ;

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

    // add zoom capabilities
    var zoom_handler = version4.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);
    var graphScale = 0.7;
    zoom_handler.scaleTo(svg, graphScale);

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
        .attr("r", 15)
        .attr("fill", function(d) { return color(d.group); })
        .attr("data-legend", function(d) { return d.group; });

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

    var legendOrdinal = version4.legendColor()
        .shape("path", version4.symbol().type(version4.symbolCircle).size(150)())
        .shapePadding(5)
        .scale(color);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    function ticked() {
        /**
         * Draws a node and a link from that node to it's target.
         */

        $("#table").block({
            message: null,
            overlayCSS: {opacity: 0}
        });

        // draw line between source node and target node position
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos * 4 - 150; })
            .attr("y1", function (d) { return d.source.ypos * 4 - 150; })
            .attr("x2", function (d) { return d.target.xpos * 4 - 150; })
            .attr("y2", function (d) { return d.target.ypos * 4 - 150; });

        var highlighted;
        // draw node on position specified in data and highlight connections on mouseover
        node
            .attr("id", function(d) { return d.id; })
            .attr("r", 15)
            .attr("cx", function (d) { return d.xpos * 4 - 150; })
            .attr("cy", function (d) { return d.ypos * 4 - 150; })
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
                highlighted = svg.selectAll(".highlightedLink");
                if (highlighted["_groups"][0].length > 0) {
                    version4.selectAll(".non")
                        .style("stroke", "grey")
                        .style("stroke-opacity", 0.1)
                        .style("stroke-width", "1px");

                    version4.selectAll(".highlightedLink")
                        .style("stroke", "rgb(27, 158, 119)")
                        .style("stroke-opacity", 1)
                        .style("stroke-width", "3px");
                }
                else {
                    version4.selectAll(".non")
                        .style("stroke", "grey")
                        .style("stroke-opacity", 1)
                        .style("stroke-width", "1px");
                }
            });

        return $("#table").unblock();
    }

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", version4.event.transform);
    }

    return {
        node: node,
        svg: svg,
        simulation: simulation
    };
}

function restart(simulation, graph) {

    // append svg with g in it
    const margins = {top: 200, right: 200, bottom: 75, left: 50},
        width = (window.innerWidth / 2 + 100) - margins.right - margins.left,
        height = (window.innerHeight - margins.top) ;


    // scale for coloring nodes
    var color = version4.scaleOrdinal(version4.schemeCategory20);

    // select nodes
    var node = version4.selectAll(".nodes circle");
    var link = version4.selectAll(".links line");

    // update nodes
    node = node.data(graph.nodes);
    node.exit().remove();
    node.enter().append("circle")
        .attr("fill", function(d) { return color(d.group); })
        .attr("r", 15)
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
