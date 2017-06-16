/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

function makegraph(graph, svg, g, width, height) {

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // add zoom capabilities
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    // set scale for nodes
    var nodeScale = d3.scaleLog();

    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var edgecolor = d3.scaleLinear()
        .domain(d3.extent(graph.links, function(d) { return d.value }));

    nodeScale
        .domain(d3.extent(graph.nodes, function(d) { return d.check_ins }));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.xpos * 4;
            })
            .attr("y1", function (d) {
                return d.source.ypos * 4;
            })
            .attr("x2", function (d) {
                return d.target.xpos * 4;
            })
            .attr("y2", function (d) {
                return d.target.ypos * 4;
            })
            .style("stroke-width", function(d) {
                return edgecolor(d.value) * 5;
            });

        node
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return nodeScale(d.check_ins)*20;})
            .attr("cx", function (d) {
                return d.xpos * 4;
            })
            .attr("cy", function (d) {
                return d.ypos * 4;
            })
            .on("mouseover", function(d) {
                link.style("stroke", function(l) {
                    if (d === l.source || d === l.target)
                        return "#b40009";
                    else
                        return "grey";
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
                link.style('stroke', "grey");
                link.style("stroke-opacity", 1);
            })
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.xpos * 4;
        d.fy = d.ypos * 4;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", d3.event.transform)
    }

    return node;
}

function highlightRoute(svg, id, dt) {

    // var id = "20151305011343-613";
    d3.json("../Data/route_per_id.json", function (error, data) {

        if (error) throw error;
        var route = data[id];
        route.forEach(function(d, i) {
            setTimeout(function () {

                var node = svg.selectAll("#" + d.gate);
                node
                    .attr("stroke", "black")
                    .attr("stroke-width", "5px");

            }, 1000 * i);
        });
        // Add event listener for opening and closing details
        $('#my_table tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = dt.api().row( tr );

            if ( row.child.isShown() ) {
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                row.child(format(route)).show();
                tr.addClass('shown');
            }
        } );
    });
}


function format(route) {
    var routestring = "";
    route.forEach(function(d) {
        routestring += d.gate + "      at      " + d.timestamp + " <br> "
    });
    return "<strong>Route</strong>" + "<br>" + routestring;
}