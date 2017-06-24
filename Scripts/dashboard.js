/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    // add image
    d3.select('#lineChart').append("img")
        .attr('width', 700)
        .attr('height', 700).attr("src","../lekagul.jpg");

    // make slider
    makeSlider("#weekSlider");

    // generate filenames
    var filenames = {};
    for (var i = 0; i < 57; i++) {
        var key = sliderToFilename(i);
        filenames[key] = i;
    }

    // get 106 json files and draw dashboard as callback
    var varJSONS,
        graphJSONS;
    var count = 0;
    getQueue(filenames, "../Data/graphs per week/graph_");
    function getQueue(filenames, filestring) {
        if (count < 2) {
            var queue = d3.queue();
            d3.entries(filenames).forEach(function(filename) {
                var file = filename.key;
                queue.defer(d3.json, filestring + file + ".json");
            });
            queue.awaitAll(getVarData);

            function getVarData(error, jsons) {

                if (error) throw error;

                if (count === 1) varJSONS = jsons;
                else graphJSONS = jsons;
                count += 1;
                return getQueue(filenames, "../Data/vars per week2/vars_")
            }
        }
        else {
            return dashboard(filenames, varJSONS, graphJSONS);
        }
    }
};

function dashboard(filenames, varJSONS, graphJSONS) {

    // options for toggle buttons of line chart
    var optionsLine  = ["total", "1", "2", "3", "4", "5", "6", "2P"];
    var optionsPC = ["weekend", "highseason", "nightly_movement"];
    drawButtons("#formDiv2", optionsPC, false, false);
    drawButtons("#formDiv", optionsLine, "total", true);
    d3.select("#formDiv").style("display", "none");
    d3.select("#formDiv2").style("display", "none");

    // default selected line is total
    var selected = ["total"];

    // some global variables
    var lineObject,
        pcObject,
        dataTable,
        graphObject,
        currentData,
        currentID;

    // when user drags slider change data in graph, table and PC
    $('#weekSlider').change( function() {

        var filename = sliderToFilename(this.value);
        var dataIndex = filenames[filename];
        var graph = graphJSONS[dataIndex];
        var varsPerID = varJSONS[dataIndex];
        restart(graphObject.simulation, graph, graphObject.scale);

        if (d3.select("#pcSVG")[0][0] !== null) {
            drawPC(varsPerID, pcObject.svg, pcObject.height, pcObject.width, dataTable);
            fillTable(version4.entries(varsPerID), dataTable);
        }
        else {
            var date = dateFromWeekNumber(parseInt(filename.split("-")[1]), parseInt(filename.split("-")[0]));
            fillTable(version4.entries(varsPerID), dataTable);
            highlightRoute(graphObject.svg, dataTable, false);
            updateFocus(lineObject, date)
        }

    });

    var initIndex = filenames["32-2015"];
    var initDataTable = varJSONS[initIndex];
    var initDataGraph = graphJSONS[initIndex];
    dataTable = makeTable(initDataTable);

    // actions when user clicks on parallel coordinates link
    d3.select('#pcPage').on("click", function() {

        if (d3.select("#graphSVG")[0][0] === null) {
            graphObject = makeGraph(initDataGraph);
        }

        // only initialize the first time a user clicks
        if (d3.select("#pcSVG")[0][0] === null) {

            // draw toggles, not displayed at first page
            d3.select("#formDiv").style("display", "none");
            d3.select("#formDiv2").style("display", "block");

            // remove attributes from otherpages
            d3.select('#lineChart img').remove();
            d3.select("#lineSVG").remove();

            pcObject = makePC(initDataTable, dataTable);
            fillTable(version4.entries(initDataTable), dataTable);
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
            d3.select("#formDiv2").style("display", "none");
            d3.select("#formDiv").style("display", "block");

            version4.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

                if (error) throw error;

                lineObject = makeLineChart(data);

                if (d3.select("#graphSVG")[0][0] === null) {
                    graphObject = makeGraph(initDataGraph);
                    nodeListener(graphObject.node, lineObject, selected, currentData, currentID);
                    highlightRoute(graphObject.svg, dataTable, false);
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
            d3.select("#formDiv2").style("display", "none");
            d3.select("#formDiv").style("display", "none");

            // add image
            d3.select('#lineChart').append("img")
                .attr('width', 700)
                .attr('height', 700).attr("src","../lekagul.jpg")
        }
    });
}
