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
        height = 393 - margins.top - margins.bottom,
        width = 800 - margins.left - margins.right;

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
        updateLines(arrData, lineContainer, legendContainer, xLine, yLine, selected);

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
        makegraph(graph, svg, g, graphWidth, graphHeight);

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

        makeTable(data, table, thead, tbody);

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

        makePC(data, svgPC, widthPC)

    });
};