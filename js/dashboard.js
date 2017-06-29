/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */


// global variable
var graphObject;


window.onload = function() {

    // add image
    d3.select('#lineChart').append("img")
        .attr('width', window.innerWidth / 2 - 250)
        .attr('height', window.innerHeight / 2)
        .attr("src","../lekagul.jpg");

    // make slider
    makeSlider("#weekSlider");

    // generate filenames
    var filenames = {};
    for (var i = 0; i < 57; i++) {
        var key = sliderToFilename(i);
        filenames[key] = i;
    }

    // put all (more than 100) json files in a queue recursively and draw dashboard when done
    var varJSONS,
        graphJSONS;

    var count = 0;
    getQueue(filenames, "../Data/graphs per week/graph_");

    function getQueue(filenames, fileString) {
        /**
         * Function that gets files from an array and puts them in a d3-queue.
         * @param {object} filenames
         * @param {string} fileString
         */
        if (count < 2) {
            var queue = d3.queue();
            d3.entries(filenames).forEach(function(filename) {
                var file = filename.key;
                queue.defer(d3.json, fileString + file + ".json");
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
    /**
     * Function that draws entire dashboard.
     * @param {object} filenames
     * @param {object} varJSONS
     * @param {object} graphJSONS
     * @param {string} currentHash
     */

    // some global variables
    var lineObject,
        dataTable,
        currentData,
        currentID;

    // options for toggle buttons of line chart and radio buttons of parallel coordinates
    var optionsLine  = ["total", "1", "2", "3", "4", "5", "6", "2P"];
    var optionsPC = ["without outliers", "with outliers"];

    // only draw if not already available on page
    if (d3.select("#formDiv2").selectAll("form")[0].length === 0) {
        drawButtons("#formDiv2", optionsPC, false, false);
    }
    if (d3.select("#formDiv").selectAll("form")[0].length === 0) {
        drawButtons("#formDiv", optionsLine, "total", true);
    }

    // initial visibility is none
    d3.select("#formDiv").style("display", "none");
    d3.select("#formDiv2").style("display", "none");

    // default selected line in line chart is total
    var selected = ["total"];

    // if hash changes, redraw dashboard
    window.onhashchange = function() {
        currentHash = window.location.hash;
        dashboard(filenames, varJSONS, graphJSONS, currentHash)
    };

    // initial data for graph and table
    var initIndex = filenames["30-2015"];
    var initDataTable = varJSONS[initIndex];
    var initDataGraph = graphJSONS[initIndex];

    // only draw table if not already available on page
    if (d3.select("#my_table")[0][0] === null) {
        dataTable = makeTable(initDataTable);
        highlightRoute(false, dataTable, false, d3);
    }
    else {
        dataTable = $("#my_table").dataTable();
    }

    // only draw graph if not already initialized
    if (d3.select("#graphSVG")[0][0] === null) {
        graphObject = makeGraph(initDataGraph);
    }

    // actions when user clicks on parallel coordinates link
    if (currentHash === "#pc") {

        // only draw graph if not already available on page
        if (d3.select("#graphSVG")[0][0] === null) {
            graphObject = makeGraph(initDataGraph);
        }

        // only initialize the first time a user clicks
        if (d3.select("#pcSVG")[0][0] === null) {

            // show radio buttons for parallel coordinates, hide toggles for line chart, remove scatter plot
            d3.select("#formDiv").style("display", "none");
            d3.select("#formDiv2").style("display", "block");
            d3.select("#scatterSVG").remove();

            // remove attributes from other pages and draw PC, fill table
            d3.select('#lineChart img').remove();
            d3.select("#lineSVG").remove();
            makePC(initDataTable, dataTable);
            fillTable(version4.entries(initDataTable), dataTable);
        }

        // unbind change listener from line chart
        var slider = $('#weekSlider');
        slider.unbind();

        // when user drags slider restart graph simulation, re-fill table and update PC
        slider.change(function() {
            var filename = sliderToFilename(this.value);
            var dataIndex = filenames[filename];
            var graph = graphJSONS[dataIndex];
            var varsPerID = varJSONS[dataIndex];
            restart(graphObject.simulation, graph, graphObject.scale, graphObject.sizes);
            updatePC(varsPerID, dataTable);
            fillTable(version4.entries(varsPerID), dataTable);
        });
    }

    // actions when user clicks on line chart link
    else if (currentHash === "#line") {

        // only initialize the first time a user clicks
        if (d3.select("#lineSVG")[0][0] === null) {

            // remove image of park and PC
            d3.select('#lineChart img').remove();
            d3.select("#pcSVG").remove();
            d3.select("#scatterSVG").remove();

            // show toggle buttons, hide radio buttons
            d3.select("#formDiv2").style("display", "none");
            d3.select("#formDiv").style("display", "block");

            // get initial data for line chart
            version4.json("../Data/data per gate/check-ins_day_camping8.json", function (error, data) {

                if (error) throw error;

                lineObject = makeLineChart(data);

                // only draw graph if not already initialized
                if (d3.select("#graphSVG")[0][0] === null) {
                    graphObject = makeGraph(initDataGraph);
                }

                // unbind change listener from PC
                var slider = $('#weekSlider');
                slider.unbind();

                // when user drags slider change data in graph and table, update focus line in line chart
                slider.change(function() {

                    // convert slider value to file name, and get correct data from dict
                    var filename = sliderToFilename(this.value);
                    var dataIndex = filenames[filename];
                    var graph = graphJSONS[dataIndex];
                    var varsPerID = varJSONS[dataIndex];

                    // restart graph, get current date and draw focus line, and re-fill table
                    restart(graphObject.simulation, graph, graphObject.scale, graphObject.sizes);
                    var date = dateFromWeekNumber(parseInt(filename.split("-")[1]), parseInt(filename.split("-")[0]));
                    fillTable(version4.entries(varsPerID), dataTable);
                    highlightRoute(graphObject.svg, dataTable, false, version4);
                    updateFocus(lineObject, date)
                });

                // re-run highlightRoute and nodeListener function when new data is initialized
                highlightRoute(graphObject.svg, dataTable, false, version4);
                nodeListener(graphObject.node, lineObject, selected, currentData, currentID);
            });
        }
    }

    // actions when user clicks on Lekagul Preserve link
    else if (currentHash === "#home") {

        // only initialize the first time a user clicks
        if (d3.select("#lineChart img")[0][0] === null) {

            // remove line chart, toggle and radio buttons and PC
            d3.select("#graphSVG").remove();
            d3.select("#pcSVG").remove();
            d3.select("#lineSVG").remove();
            d3.select("#scatterSVG").remove();
            d3.select("#formDiv2").style("display", "none");
            d3.select("#formDiv").style("display", "none");

            // add image
            d3.select('#lineChart').append("img")
                .attr('width', window.innerWidth / 2 - 250)
                .attr('height', window.innerHeight / 2)
                .attr("src","../lekagul.jpg")

            // only draw graph if not already initialized
            if (d3.select("#graphSVG")[0][0] === null) {
                graphObject = makeGraph(initDataGraph);
            }
        }
    }
}
