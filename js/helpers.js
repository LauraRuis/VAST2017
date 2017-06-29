function sliderToFilename(value) {
    /**
     * Converts slider number to file name.
     * @param {number} value
     */

    var filename;
    // if value smaller than 35 year is 2015, otherwise 2016
    if (value < 35) {
        filename = parseInt(value) + 18 + "-2015"
    }
    else {
        filename = parseInt(value) - 34 + "-2016"
    }

    return filename;
}


function dateFromWeekNumber(year, week) {
    /**
     * Get date from a week number
     * @param {number} year
     * @param {number} week
     */
    var d = new Date(year, 0, 1);
    var dayNum = d.getDay();
    var diff = --week * 7;

    // if 1 Jan is Friday to Sunday, go to next week
    if (!dayNum || dayNum > 4) {
        diff += 7;
    }

    // add required number of days
    d.setDate(d.getDate() - d.getDay() + ++diff);
    return d;
}


function makeSlider(id) {
    /**
     * Make a bootstrap slider.
     * @param {selector} id
     */
    var slider = $(id).slider({
        value: 12,
        tooltip: 'always',
        formatter: sliderToFilename
    });

    $(id + "-enabled").click(function() {
        if(this.checked) {
            $(id).slider("enable");

            slider.enable();
        }
        else {
            $(id).slider("disable");

            slider.disable();
        }
    });

    return slider;
}


function dateParser(data) {
    /**
     * Parse dates in object.
     * @param {object} data
     */

    // time parser
    var parseTime = version4.timeParse("%d/%m/%Y");

    // parse dates
    var arrData = version4.entries(data);
    arrData.forEach(function (d) {
        d.key = parseTime(d.key);
    });

    return arrData;
}


function drawButtons(divID, options, defaultChecked, toggle) {
    /**
     * Draw toggle or radio buttons with specified options.
     * @param {selector} divID
     * @param {object} options
     * @param {string} defaultChecked
     * @param {boolean} toggle
     */

    var className,
        type,
        name;
    if (toggle === true) {
        className = "checkbox-inline";
        type = "checkbox";
        name = "mode"
    }
    else {
        className = "radio-inline";
        type = "radio";
        name = "optradio"
    }

    // make form with buttons for options
    var form = version4.select(divID).append("form").attr("id", "form");
    var labels = form.selectAll("label")
        .attr("class", className)
        .data(options)
        .enter()
        .append("label")
        .text(function(d) {return d;})
        .append("input")
        .attr("id", function(d) {return d;})
        .attr("type", type)
        .attr("data-toggle", "toggle")
        .attr("name", name);

    // initialize default button checked
    labels.each(function(l) {
        if (l === defaultChecked) {
            version4.select(this).attr("checked", "True")
        }
    });

    if (toggle === true) {
        // use bootstrap library on each button
        options.forEach(function(d) {
            $("#" + d).bootstrapToggle();
        });
    }

    return form;
}


function highlightRoute(svg, dt, paths, vers4) {
    /**
     * On row click in data table, highlight corresponding route of car-id. Also open detailed info about route in table.
     * @param {object} svg
     * @param {object} dt
     */

    // use correct version of d3
    if (vers4 === false) {
        vers4 = version4;
    }

    // get data of routes per ID
    vers4.json("../Data/route_per_ID.json", function (error, data) {

        if (error) throw error;

        // unbind old click listeners of table rows
        dt.find('tbody').unbind( "click" );

        // add event listener for opening and closing details
        dt.find('tbody').on('click', 'tr td.details-control', function () {

            // get route of clicked id
            var id = this.parentNode.id;
            var route = data[id];
            var tr = $(this).closest('tr');
            var row = dt.api().row(tr);

            // if details row is opened and user clicks on it
            if (row.child.isShown()) {

                // change button image and update class
                vers4.select(this)
                    .html('<img height="15" width="15" src="../details_open.png">');
                row.child.hide();
                tr.removeClass('shown');

                // if graph is available
                if (svg !== false) {
                    // change color of links back
                    route.forEach(function(d, i) {
                        if (i !== route.length - 1) { {
                            svg.selectAll("#" + d.gate + "-" + route[i + 1].gate)
                                .style("stroke", "grey")
                                .attr("class", "non");
                        }}
                    });

                    // except for the still highlighted ones (if user has clicked more rows)
                    var highlighted = vers4.selectAll(".highlightedLink");
                    if (highlighted["_groups"][0].length > 0) {
                        version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 0.1).style("stroke-width", "1px");
                        version4.selectAll(".highlightedLink").style("stroke", "rgb(27, 158, 119)").style("stroke-opacity", 1);
                    }
                    else {
                        version4.selectAll(".non").style("stroke", "grey").style("stroke-opacity", 1);
                    }
                }

                // if parallel coordinates available, also unhighlight ID in PC
                console.log(paths);
                if (paths !== undefined && paths !== false) {
                    var path = paths[id];
                    console.log("path: ", path);
                    if (path !== undefined && path !== null) {
                        path.forEach(function(p) {
                            d3.select("." + p)
                                .attr("class", p + " notShown")
                                .style("stroke", "steelblue")
                                .style("stroke-width", "1px");
                        })
                    }
                }
            }

            // if details row is closed and user clicks on it
            else {

                // change button image
                vers4.select(this)
                    .html('<img height="15" width="15" src="../details_close.png">');

                if (svg !== false) {

                    // block screen until animation of route is finished
                    $.blockUI({
                        message: null,
                        overlayCSS: {opacity: 0}
                    });

                    // set all strokes to grey and animate route in graph
                    svg.selectAll(".non")
                        .style("stroke", "grey")
                        .style("stroke-opacity", 0.1);

                    // loop over route and highlight links with timeout
                    route.forEach(function(d, i) {
                        setTimeout(function () {

                            // select links and highlight
                            if (i !== route.length - 1) {
                                var links = svg.selectAll("#" + d.gate + "-" + route[i + 1].gate);
                                links
                                    .attr("class", "highlightedLink")
                                    .style("stroke", "rgb(27, 158, 119)")
                                    .style("stroke-width", "3px")
                                    .style("stroke-opacity", 1);
                            }

                            // if animation done unblock screen
                            else {
                                $.unblockUI();
                                d3.select("#graphSVG").select("#entrance1-ranger-stop1")
                                    .style("stroke-dasharray", ("3, 3"));
                                console.log(d3.select("#graphSVG").select("#entrance1-ranger-stop1"))
                            }
                        }, 100 * i);
                    });

                    // scroll to graph to show animation
                    window.scrollTo(0, 0);
                }


                // if parallel coordinates available also highlight ID here
                console.log(paths)
                if (paths !== undefined && paths !== false) {

                    var path = paths[id];
                    console.log("path: ", path)
                    if (path !== undefined && path !== null) {
                        path.forEach(function(p) {

                            // select path of clicked ID
                            var pathSelection = d3.select("." + p);
                            console.log(d3.select("." + p))
                            var currentColor = pathSelection.style("stroke");

                            // highlight selected
                            pathSelection
                                .attr("class", p + " shown -" + currentColor)
                                .style("stroke", "rgb(27, 158, 119)")
                                .style("stroke-width", "3px");

                            // move selected to front
                            pathSelection.moveToFront();
                        });
                    }
                }

                // show details row and add class shown
                row.child(format(route)).show();
                tr.addClass('shown');

            }
        });
    });
}


d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};


function format(route) {
    /**
     * Takes array of gates and formats it into a string for showing detailed info in table.
     * @param {object} route
     */
    var routestring = "";
    route.forEach(function(d) {
        routestring += d.gate + " at " + d.timestamp + " <br> "
    });
    return "<strong>Route</strong>" + "<br>" + routestring;
}


function carTypeColors(d3version) {
    /**
     * Takes version of d3 and returns car-type colors.
     * @param {object} d3version
     */

    var color = d3version.scaleOrdinal(d3version.schemeCategory20);

    var legendDict = {
        "total": color(0),
        "1": color(1),
        "2": color(2),
        "3": color(3),
        "4": color(4),
        "5": color(5),
        "6": color(6),
        "2P": color("2P")
    };

    return [color, legendDict]
}


function zoom(svg) {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
}
