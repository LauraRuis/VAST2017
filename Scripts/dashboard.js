/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

var graphObject;

window.onload = function() {

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
            var currentHash = window.location.hash;
            return dashboard(filenames, varJSONS, graphJSONS, currentHash);
        }
    }
};

function dashboard(filenames, varJSONS, graphJSONS, currentHash) {

    // some global variables
    var lineObject,
        pcObject,
        dataTable,
        currentData,
        currentID;

    // options for toggle buttons of line chart
    var optionsLine  = ["total", "1", "2", "3", "4", "5", "6", "2P"];
    var optionsPC = ["weekend", "highseason", "nightly_movement"];
    if (d3.select("#formDiv2").selectAll("form")[0].length === 0) {
        drawButtons("#formDiv2", optionsPC, false, false);
    }
    if (d3.select("#formDiv").selectAll("form")[0].length === 0) {
        drawButtons("#formDiv", optionsLine, "total", true);
    }
    d3.select("#formDiv").style("display", "none");
    d3.select("#formDiv2").style("display", "none");

    // default selected line is total
    var selected = ["total"];

    window.onhashchange = function() {
        currentHash = window.location.hash;
        dashboard(filenames, varJSONS, graphJSONS, currentHash)
    };

    var initIndex = filenames["30-2015"];
    var initDataTable = varJSONS[initIndex];
    var initDataGraph = graphJSONS[initIndex];
    if (d3.select("#my_table")[0][0] === null) {
        dataTable = makeTable(initDataTable);
    }
    else {
        dataTable = $("#my_table").dataTable();
    }

    // actions when user clicks on parallel coordinates link
    if (currentHash === "#pc") {

        if (d3.select("#graphSVG")[0][0] === null) {
            graphObject = makeGraph(initDataGraph);
        }

        // only initialize the first time a user clicks
        if (d3.select("#pcSVG")[0][0] === null) {

            // draw toggles, not displayed at first page
            d3.select("#formDiv").style("display", "none");
            d3.select("#formDiv2").style("display", "block");
            d3.select("#scatterSVG").remove();

            // remove attributes from otherpages
            d3.select('#lineChart img').remove();
            d3.select("#lineSVG").remove();
            pcObject = makePC(initDataTable, dataTable);
            fillTable(version4.entries(initDataTable), dataTable);
        }

        // when user drags slider change data in graph, table and PC
        $('#weekSlider').change( function() {
            var filename = sliderToFilename(this.value);
            var dataIndex = filenames[filename];
            var graph = graphJSONS[dataIndex];
            var varsPerID = varJSONS[dataIndex];
            restart(graphObject.simulation, graph, graphObject.scale);
            updatePC(varsPerID, dataTable);
            fillTable(version4.entries(varsPerID), dataTable);
        });
    }

    else if (currentHash === "#line") {

        // only initialize the first time a user clicks
        if (d3.select("#lineSVG")[0][0] === null) {
            // remove image of park and PC
            d3.select('#lineChart img').remove();
            d3.select("#pcSVG").remove();
            d3.select("#scatterSVG").remove();

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

                // when user drags slider change data in graph, table and PC
                $('#weekSlider').change( function() {

                    var filename = sliderToFilename(this.value);
                    var dataIndex = filenames[filename];
                    var graph = graphJSONS[dataIndex];
                    var varsPerID = varJSONS[dataIndex];
                    restart(graphObject.simulation, graph, graphObject.scale);
                    var date = dateFromWeekNumber(parseInt(filename.split("-")[1]), parseInt(filename.split("-")[0]));
                    fillTable(version4.entries(varsPerID), dataTable);
                    highlightRoute(graphObject.svg, dataTable, false);
                    updateFocus(lineObject, date)


                });
            });
        }
    }

    // actions when user clicks on lekagul preserve link
    else if (currentHash === "#home") {
        console.log(currentHash);

        // only initialize the first time a user clicks
        if (d3.select("#lineChart img")[0][0] === null) {

            // remove line chart, toggle buttons and PC
            d3.select("#graphSVG").remove();
            d3.select("#pcSVG").remove();
            d3.select("#lineSVG").remove();
            d3.select("#scatterSVG").remove();
            d3.select("#formDiv2").style("display", "none");
            d3.select("#formDiv").style("display", "none");

            // add image
            d3.select('#lineChart').append("img")
                .attr('width', window.innerWidth / 2 - 250)
                .attr('height', window.innerHeight / 2).attr("src","../lekagul.jpg")
        }
    }
}
