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
    // parse the date / time
    var parseTime = d3.timeParse("%d/%m/%Y");

    var options  = ["total", "1", "2", "3", "4", "5", "6", "2P"];

    var form = d3.select("#linechart").append("form");
    var labels = form.selectAll("label")
        .attr("class", "checkbox-inline")
        .data(options)
        .enter()
        .append("label")
        .text(function(d) {return d;})
        .append("input")
        .text(function(d) {return d;})
        .attr("id", function(d) {return d;})
        .attr("type", "checkbox")
        .attr("data-toggle", "toggle")
        .attr("name", "mode");

    labels.each(function(l) {
        if (l === "total") {
            d3.select(this).attr("checked", "True")
        }
    });

    options.forEach(function(d) {
        $("#" + d).bootstrapToggle();
    });

    // for now hardcoded selected
    var selected = ["total"];

    var lineObject;

    d3.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

        if (error) throw error;

        var arrData = d3.entries(data);
        arrData.forEach(function (d) {
            d.key = parseTime(d.key);
        });

        lineObject = makeLineChart(arrData);

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPH
    var node,
        svg,
        simulation,
        nodeScale,
        currentData,
        currentID;
    var selectedRows = {};
    d3.json("../Data/graph3.json", function(error, graph) {

        if (error) throw error;
        var graphVars = makeGraph(graph);
        node = graphVars[0];
        svg = graphVars[1];
        simulation = graphVars[2];
        nodeScale = graphVars[3];

        node
            .on("click", function(d) {
                var fileString = "../Data/data per gate/check-ins_day_" + d.id + ".json";

                d3.json(fileString, function (error, new_data) {

                    if (error) throw error;

                    var new_arrData = d3.entries(new_data);
                    new_arrData.forEach(function (d) {
                        d.key = parseTime(d.key);
                    });
                    currentData = new_arrData;
                    currentID = d.id;
                    updateLines(new_arrData, lineObject, selected, d.id)

                });
            });

    });

    $('input:checkbox[name="mode"]').change(
        function(){
            if (this.checked) {
                selected.push(d3.select(this).data()[0])
            }
            else {
                var index = selected.indexOf(d3.select(this).data()[0]);
                if (index !== -1) {
                    selected.splice(index, 1)
                }
            }
            updateLines(currentData, lineObject, selected, currentID);
        });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TABLE
    var dataTable;
    d3.json("../Data/temp.json", function (error, data) {

        if (error) throw error;
        dataTable = makeTable(svg, data);
        highlightRoute(svg, dataTable, selectedRows);

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PARALLEL COODINATES
    // make slider
    $('#ex1').slider({
        formatter: function(value) {
            return value;
        }
    });
    $('#ex1').change( function() {
        var datastring = "../Data/vars per week/vars_" + this.value + "-2016.json";
        d3.json(datastring, function(error, data) {

            if (error) throw error;
            selectedRows = {};
            // makePC(data);
            fillTable(d3.entries(data), dataTable);
            highlightRoute(svg, dataTable, selectedRows);

        });
        var graphstring = "../Data/graphs per week/graph_" + this.value + "-2016.json";
        d3.json(graphstring, function(error, graph) {
            if (error) throw error;
            // scale nodes
            // set scale for nodes
            restart(simulation, graph, nodeScale)

        });
    });

    // d3.json("../Data/vars_per_id.json", function(error, data) {
    //
    //     if (error) throw error;
    //
    //     makePC(data)
    //
    // });
};