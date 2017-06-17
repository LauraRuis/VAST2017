/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    // global title
    d3.select("#titleContainer").append("div").append("h3")
        .attr("class", "page-header text-center sub-header=")
        .text("VAST 2017").append("h4")
        .text("MC1");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // LINE CHART
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

    // parse the date / time
    var parseTime = d3.timeParse("%d/%m/%Y");

    // for now hardcoded selected
    var selected = ["total"];

    // set scales for lines
    var xLine = d3.scaleTime()
            .range([0, width]),
        yLine = d3.scaleLinear()
            .range([height, 0]);

    d3.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

        if (error) throw error;

        var arrData = d3.entries(data);
        arrData.forEach(function (d) {
            d.key = parseTime(d.key);
        });

        makeLineChart(arrData, lineContainer, xLine, yLine, height);

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPH
    var graphWidth = 1000,
        graphHeight = 1000;

    var svg = d3.select('#graph').append('svg')
        .attr('width', graphWidth)
        .attr('height', graphHeight);

    var g = svg.append("g")
        .attr("class", "everything");

    d3.json("../Data/graph.json", function(error, graph) {

        if (error) throw error;
        var node = makegraph(graph, svg, g, graphWidth, graphHeight);

        node
            .on("click", function(d) {
                console.log(d.id);
                var fileString = "../Data/data per gate/check-ins_day_" + d.id + ".json";

                d3.json(fileString, function (error, new_data) {

                    if (error) throw error;

                    var new_arrData = d3.entries(new_data);
                    new_arrData.forEach(function (d) {
                        d.key = parseTime(d.key);
                    });

                    updateLines(new_arrData, lineContainer, legendContainer, xLine, yLine, selected, width, titleContainer, d.id)

                });
            });

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TABLE
    // bootstrap table
    var table = d3.select("#table").append("table")
            .attr("id", "my_table")
            .attr("class", "table table-hover table-responsive col-xs-6"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    d3.json("../Data/vars_per_id.json", function (error, data) {

        if (error) throw error;

        var dataTable = makeTable(data, table, thead, tbody);

        // add click event to each row
        dataTable.find('tbody').on('click', 'tr', function () {
            var d = d3.select(this).data();
            highlightRoute(svg, d[0].key, dataTable);
        });

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PARALLEL COODINATES
    // initialize attributes of svg as constants
    const marginsPC = {top: 40, right: 10, bottom: 75, left: 20},
        heightPC = 800 - marginsPC.top - marginsPC.bottom,
        widthPC = 800 - marginsPC.left - marginsPC.right;

    var svgPC = d3.select('#pc').append('svg')
        .attr('width', widthPC + marginsPC.left + marginsPC.right)
        .attr('height', heightPC + marginsPC.top + marginsPC.bottom)
        .append("g")
        .attr("transform", "translate(" + marginsPC.left + "," + (marginsPC.top + 10) + ")");

    d3.json("../Data/vars_per_id.json", function(error, data) {

        if (error) throw error;

        // makePC(data, svgPC, widthPC)

    });
};
