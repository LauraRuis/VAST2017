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

    $('#toggle').bootstrapToggle({
        on: 'Parallel Coordinates',
        off: 'Line Chart',
        width: 200
    });

    d3.select('#linechart').append("img")
        .attr('width', 700)
        .attr('height', 700).attr("src","../lekagul.jpg");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // LINE CHART
    // parse the date / time
    var parseTime = version4.timeParse("%d/%m/%Y");

    var options  = ["total", "1", "2", "3", "4", "5", "6", "2P"];

    var form = version4.select("#formDiv").append("form").attr("id", "form");
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
            version4.select(this).attr("checked", "True")
        }
    });

    options.forEach(function(d) {
        $("#" + d).bootstrapToggle();
    });

    // make slider
    var slider = makeSlider();

    // for now hardcoded selected
    var selected = ["total"];

    var lineObject,
        pcObject;
    d3.select("#formDiv").style("display", "none");
    d3.select('#pcPage').on("click", function() {
        if (d3.select("#pcSVG")[0][0] === null) {
            d3.select('#linechart img').remove();
            d3.json("../Data/vars per week/vars_15-2016.json", function (error, data) {
                if (error) throw error;
                d3.select("#lineSVG").remove();
                d3.select("#formDiv").style("display", "none");
                pcObject = makePC(data)
                highlightRoute(graphObject.svg, dataTable, selectedRows, pcObject.paths);
            });
        }
    });
    d3.select('#linePage').on("click", function() {
        if (d3.select("#lineSVG")[0][0] === null) {
            d3.select('#linechart img').remove();
            d3.select("#pcSVG").remove();
            d3.select("#formDiv").style("margin-top", "100px");
            d3.select("#formDiv").style("display", "block");
            version4.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

                if (error) throw error;

                var arrData = version4.entries(data);
                arrData.forEach(function (d) {
                    d.key = parseTime(d.key);
                });
                lineObject = makeLineChart(arrData);

            });
        }
    });
    d3.select('#parkPage').on("click", function() {
        if (d3.select("#linechart img")[0][0] === null) {
            d3.select("#pcSVG").remove();
            d3.select("#lineSVG").remove();
            d3.select("#formDiv").style("display", "none");
            d3.select('#linechart').append("img")
                .attr('width', 700)
                .attr('height', 700).attr("src","../lekagul.jpg")
        }
    });


    $('#ex1').change( function() {
        var filename;

        // convert slider value to filename
        if (this.value < 0) {
            filename = 53 - (-this.value) + "-2015"
        }
        else {
            filename = parseInt(this.value) + 1 + "-2016"
        }
        console.log(d3.select("#pcSVG")[0][0])
        if (d3.select("#pcSVG")[0][0] !== null) {
            var datastring = "../Data/vars per week/vars_" + filename + ".json";
            version4.json(datastring, function (error, data) {

                if (error) throw error;
                selectedRows = {};
                drawPC(data, pcObject.svg, pcObject.height, pcObject.width);
                fillTable(version4.entries(data), dataTable);
                highlightRoute(graphObject.svg, dataTable, selectedRows, pcObject.paths);

            });
        }
        else {
            var graphstring = "../Data/graphs per week/graph_" + filename + ".json";
            version4.json(graphstring, function(error, graph) {
                if (error) throw error;

                // restart graph
                restart(graphObject.simulation, graph, graphObject.scale)

            });
            var datastring = "../Data/vars per week/vars_" + filename + ".json";
            version4.json(datastring, function (error, data) {

                if (error) throw error;
                selectedRows = {};
                fillTable(version4.entries(data), dataTable);
                highlightRoute(graphObject.svg, dataTable, selectedRows, false);

            });
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPH
    var graphObject,
        currentData,
        currentID;

    var selectedRows = {};
    version4.json("../Data/graph3.json", function(error, graph) {

        if (error) throw error;
        graphObject = makeGraph(graph);

        graphObject.node
            .on("click", function(d) {
                var fileString = "../Data/data per gate/check-ins_day_" + d.id + ".json";

                version4.json(fileString, function (error, new_data) {

                    if (error) throw error;

                    var new_arrData = version4.entries(new_data);
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
                selected.push(version4.select(this).data()[0])
            }
            else {
                var index = selected.indexOf(version4.select(this).data()[0]);
                if (index !== -1) {
                    selected.splice(index, 1)
                }
            }
            updateLines(currentData, lineObject, selected, currentID);
        });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TABLE
    var dataTable;
    version4.json("../Data/vars per week/vars_15-2016.json", function (error, data) {

        if (error) throw error;
        dataTable = makeTable(graphObject.svg, data);
        highlightRoute(graphObject.svg, dataTable, selectedRows, false);

    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PARALLEL COODINATES
    // // make slider
    // var slider = makeSlider();
    // $('#ex1').change( function() {
    //     var filename;
    //
    //     // convert slider value to filename
    //     if (this.value < 0) {
    //         filename = 53 - (-this.value) + "-2015"
    //     }
    //     else {
    //         filename = parseInt(this.value) + 1 + "-2016"
    //     }
    //
    //     var datastring = "../Data/vars per week/vars_" + filename + ".json";
    //     version4.json(datastring, function(error, data) {
    //
    //         if (error) throw error;
    //         selectedRows = {};
    //         drawPC(data, pcObject.svg, pcObject.height, pcObject.width);
    //         fillTable(version4.entries(data), dataTable);
    //         highlightRoute(graphObject.svg, dataTable, selectedRows);
    //
    //     });
    //
    //     var graphstring = "../Data/graphs per week/graph_" + filename + ".json";
    //     version4.json(graphstring, function(error, graph) {
    //         if (error) throw error;
    //
    //         // restart graph
    //         restart(graphObject.simulation, graph, graphObject.scale)
    //
    //     });
    // });
};