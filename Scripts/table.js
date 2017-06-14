/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */



    // global title
    d3.select("#titleContainer").append("div").append("h3")
        .attr("class", "page-header text-center sub-header=")
        .text("VAST 2017").append("h4")
        .text("MC1");


    d3.json("../Data/vars_per_id.json", function(error, data) {

        if (error) throw error;

        makeTable(data);

    });

    /**
     * Function that draws table with data.
     * @param {object} data
     * */
    function makeTable(data) {


        // bootstrap table
        var table = d3.select("#table").append("table")
                .attr("id", "my_table")
                .attr("class", "table table-hover table-responsive col-xs-6"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

        // change format of data to array for d3's enter function
        var arrData = d3.entries(data);
        console.log(arrData);

        // append the header row
        var columns = ["Car ID", "Period", "Car type", "Camping", "Number of check-ins", "Days of stay", "Month of stay"],
            keys = ["entrance", "car_type", "camping", "number_stops", "number_days", "month"];

        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .attr("data-field", function(d) { return d; })
            .attr("data-sortable", "true")
            .attr("data-sorter", "tableSort")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(arrData)
            .enter().append("tr")
            .attr("class", function(d) { return d.key; })
            .attr("id", function(d) { return d.key; });

        // create a cell in each row for each column
        rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column, i) {
                    var value;
                    if (i === 0) {
                        value = row.key
                    }
                    else if (i === 1) {
                        if (row.value.entrance !== undefined) {
                            value = row.value.entrance[0].split(" ")[0] + " - " + row.value.entrance[1].split(" ")[0]
                        }
                        else {
                            value = "Missing data"
                        }
                    }
                    else {
                        value = row.value[keys[i - 1]]
                    }
                    return {column: column, value: value }
                });
            })
            .enter()
            .append("td")
            .attr("class", function(d, i) { return columns[i]; })
            .attr("data", function(d) { return d.value; })
            .html(function(d) { return d.value });

        // make a datatable of it (with search bar and pages)
        var dataTable = $('#my_table');
        dataTable.DataTable({

            // remove option to change amount of shown entries
            "bLengthChange": false
        });

        // add click event to each row
        dataTable.find('tbody').on('click', 'tr', function () {
            var d = d3.select(this).data();
            console.log(d)
        } );

        // when next page or search event is fired, table is redrawn so selected countries have to be colored again
        dataTable
            .on('draw.dt', function() {
                dataTable.find("tr")
                    .css("background-color", "white");
                selected.forEach(function(d) {
                    $("#table" + d)
                        .css("background-color", "orange");
                });
            });
    }

    /**
     * Function that fills table with new data.
     * @param {object} arrData
     * */
    function fillTable(arrData) {

        var table = $("#my_table").DataTable();

        // select rows on country code and fill with data (otherwise data gets placed wrongly when table is sorted)
        table.rows().every( function () {
            var data = this.data();
            var className = this.node().className.split(" ")[0];
            data[1] = Math.round(arrData[className].value * 100) / 100;
            this.data(data);
        });
    }
