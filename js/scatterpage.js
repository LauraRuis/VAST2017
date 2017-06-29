/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

window.onload = function() {

    // filenames
    var filenames = {};
    var files = ["vars_18-2015_vars_21-2015.json", "vars_22-2015_vars_25-2015.json", "vars_26-2015_vars_29-2015.json",
                "vars_30-2015_vars_33-2015.json", "vars_34-2015_vars_37-2015.json", "vars_38-2015_vars_41-2015.json",
        "vars_42-2015_vars_45-2015.json", "vars_46-2015_vars_49-2015.json", "vars_50-2015_vars_52-2015.json",
        "vars_1-2016_vars_4-2016.json", "vars_5-2016_vars_8-2016.json", "vars_9-2016_vars_12-2016.json",
        "vars_13-2016_vars_16-2016.json", "vars_17-2016_vars_20-2016.json", "vars_21-2016_vars_22-2016.json"];

    for (var i = 0; i < files.length; i++) {
        var key = files[i];
        filenames[key] = i;
    }

    // put all (more than 60) json files in a queue recursively and draw dashboard when done
    var varJSONS;
    var count = 0;
    getQueue(filenames, "../Data/tsne/");
    function getQueue(filenames, filestring) {
        if (count < 1) {
            var queue = d3.queue();
            d3.entries(filenames).forEach(function(filename) {
                var file = filename.key;
                queue.defer(d3.json, filestring + file);
            });
            queue.awaitAll(getVarData);

            function getVarData(error, jsons) {

                if (error) throw error;

                varJSONS = jsons;
                count += 1;
                return getQueue(filenames, "../Data/vars per week for tsne/vars_")
            }
        }
        else {
            return dashboard(filenames, varJSONS);
        }
    }
};


function dashboard(filenames, varJSONS) {
    /**
     * Draw dashboard for tsne visualization.
     * @param {object} filenames
     * @param {object} varJSONS
     */

    // dict for converting dropdown value to month
    var monthDict = {
        0: "May 2015",
        1: "June 2015",
        2: "July 2015",
        3: "August 2015",
        4: "September 2015",
        5: "October 2015",
        6: "November 2015",
        7: "December 2015 - week 1/2",
        8: "December 2015 - week 3/4",
        9: "January 2016",
        10: "February 2016",
        11: "March 2016",
        12: "April 2016",
        13: "May 2016 - week 1/2",
        14: "May 2016 - week 3/4"
    };

    // initial data
    var initIndex = filenames["vars_18-2015_vars_21-2015.json"];
    var initDataTable = varJSONS[initIndex];
    var dataTable = makeTable(initDataTable);

    // only initialize the first time a user clicks
    if (d3.select("#scatterSVG")["_groups"][0][0] === null) {

        d3.json("../Data/vars_per_id_2.json", function(error, data) {

            if (error) throw error;

            drawScatter(data);
            highlightRoute(false, dataTable, false, d3)
        })
    }

    // make dropdown meny
    d3.select(".dropdown-menu").selectAll("li")
        .data(d3.entries(filenames))
        .enter().append("li")
        .attr("class", function(d) {return d.key;})
        .text(function(d) {return monthDict[d.value];});

    // on click update scatter
    $('#dropdownScatter').find('li').on('click', function(){

        var newFile = d3.select(this).attr("class");
        d3.json("../Data/tsne/" + newFile, function(error, data) {

            if (error) throw error;

            updateScatter(d3.entries(data), dataTable)
        })
    });
}
