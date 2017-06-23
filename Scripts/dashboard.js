/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    // draw toggles, not displayed at first page
    var form = drawToggles();
    form.style("display", "none");

    // make slider
    makeSlider();

    // default selected line is total
    var selected = ["total"];

    // some global variables
    var lineObject,
        pcObject,
        dataTable;

    var graphObject,
        currentData,
        currentID;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // TABLE
    version4.json("../Data/vars per week/vars_15-2016.json", function (error, data) {

        if (error) throw error;

        dataTable = makeTable(data);

    });

    // add image
    d3.select('#lineChart').append("img")
        .attr('width', 700)
        .attr('height', 700).attr("src","../lekagul.jpg");

    // actions when user clicks on parallel coordinates link
    d3.select('#pcPage').on("click", function() {

        if (d3.select("#graphSVG")[0][0] === null) {
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // GRAPH

            version4.json("../Data/graphs per week/graph_15-2016.json", function(error, graph) {

                if (error) throw error;
                graphObject = makeGraph(graph);
            });
        }

        // only initialize the first time a user clicks
        if (d3.select("#pcSVG")[0][0] === null) {

            // remove attributes from otherpages
            d3.select('#lineChart img').remove();
            d3.select("#lineSVG").remove();
            form.style("display", "none");

            // draw PC and option to choose ID in table (highlightRoute)
            d3.json("../Data/vars per week2/vars_15-2016.json", function (error, data) {

                if (error) throw error;

                // draw PC
                pcObject = makePC(data, dataTable);
                fillTable(version4.entries(data), dataTable);

            });
        }
    });

    // actions when user clicks on line chart link
    d3.select('#linePage').on("click", function() {

        // only initialize the first time a user clicks
        if (d3.select("#lineSVG")[0][0] === null) {

            // remove image of park and PC
            d3.select('#lineChart img').remove();
            d3.select("#pcSVG").remove();

            // show toggle buttons
            form.style("margin-top", "100px");
            form.style("display", "block");

            version4.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

                if (error) throw error;

                lineObject = makeLineChart(data);

                if (d3.select("#graphSVG")[0][0] === null) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // GRAPH

                    version4.json("../Data/graphs per week/graph_15-2016.json", function(error, graph) {

                        if (error) throw error;
                        graphObject = makeGraph(graph);
                        nodeListener(graphObject.node, lineObject, selected, currentData, currentID);
                        highlightRoute(graphObject.svg, dataTable, false);
                    });
                }
            });
        }
    });

    // actions when user clicks on lekagul preserve link
    d3.select('#parkPage').on("click", function() {

        // only initialize the first time a user clicks
        if (d3.select("#lineChart img")[0][0] === null) {

            // remove line chart, toggle buttons and PC
            d3.select("#graphSVG").remove();
            d3.select("#pcSVG").remove();
            d3.select("#lineSVG").remove();
            form.style("display", "none");

            // add image
            d3.select('#lineChart').append("img")
                .attr('width', 700)
                .attr('height', 700).attr("src","../lekagul.jpg")
        }
    });

    // when user drags slider change data in graph, table and PC
    $('#weekSlider').change( function() {

        // variables for different filenames
        var dataString;
        var filename = sliderToFilename(this.value);

        var graphString = "../Data/graphs per week/graph_" + filename + ".json";
        version4.json(graphString, function(error, graph) {

            if (error) throw error;

            // restart graph
            restart(graphObject.simulation, graph, graphObject.scale)

        });

        if (d3.select("#pcSVG")[0][0] !== null) {
            dataString = "../Data/vars per week2/vars_" + filename + ".json";
            version4.json(dataString, function (error, data) {

                if (error) throw error;
                drawPC(data, pcObject.svg, pcObject.height, pcObject.width, dataTable);
                fillTable(version4.entries(data), dataTable);
            });
        }
        else {

            dataString = "../Data/vars per week2/vars_" + filename + ".json";
            version4.json(dataString, function (error, data) {

                if (error) throw error;

                var date = dateFromWeekNumber(parseInt(filename.split("-")[1]), parseInt(filename.split("-")[0]));
                fillTable(version4.entries(data), dataTable);
                highlightRoute(graphObject.svg, dataTable, false);
                updateFocus(lineObject, date)

            });
        }
    });

    function dateFromWeekNumber(year, week) {
        var d = new Date(year, 0, 1);
        var dayNum = d.getDay();
        var diff = --week * 7;

        // If 1 Jan is Friday to Sunday, go to next week
        if (!dayNum || dayNum > 4) {
            diff += 7;
        }

        // Add required number of days
        d.setDate(d.getDate() - d.getDay() + ++diff);
        return d;
    }
};
