/**
 * Name: Laura Ruis
 * Student number: 10158006
 * Programmeerproject
 * VAST Challenge 2017
 */

/**
 * Function that draws table with data.
 * @param {object} data
 * */
function makeTable(svg, data) {

    // bootstrap table
    var table = version4.select("#table").append("table")
            .attr("id", "my_table")
            .attr("class", "table table-hover table-responsive"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // change format of data to array for d3's enter function
    var arrData = version4.entries(data);

    // append the header row
    var columns = ["Car ID", "Period", "Car type", "Camping", "Number of check-ins", "Days of stay", "Month of stay"],
        keys = ["entrance", "car_type", "camping", "number_stops", "number_days", "month"];

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .attr("data-field", function (d) {
            return d;
        })
        .attr("data-sortable", "true")
        .attr("data-sorter", "tableSort")
        .text(function (column) {
            return column;
        });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(arrData)
        .enter().append("tr")
        .attr("class", function (d) {
            return d.key;
        })
        .attr("id", function (d) {
            return d.key;
        });

    // create a cell in each row for each column
    rows.selectAll("td")
        .data(function (row) {
            return columns.map(function (column, i) {
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
                return {column: column, value: value}
            });
        })
        .enter()
        .append("td")
        .html(function (d) {
            return d.value
        });

    var nCloneTh = document.createElement( 'th' );
    var nCloneTd = document.createElement( 'td' );
    // nCloneTd.innerHTML = '<img src="../details_open.png">';
    nCloneTd.className = "center";

    $('#my_table thead tr').each( function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );

    $('#my_table tbody tr').each( function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );

    // make a datatable of it (with search bar and pages)
    var dataTable = $('#my_table');
    dataTable.dataTable({
        // remove option to change amount of shown entries
        "bLengthChange": false,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<img src="../details_open.png">'
            },
            { "data": "id" },
            { "data": "entrance" },
            { "data": "type" },
            { "data": "camping" },
            { "data": "check-ins" },
            { "data": "days" },
            { "data": "month" }
        ],
        "order": [[1, 'asc']]
    });
    // d3.select("#my_table").style("width", "100%");
    // when next page or search event is fired, table is redrawn so selected countries have to be colored again
    dataTable
        .on('draw.dt', function () {
            highlightRoute(svg, dataTable)
        });

    return dataTable;
}

/**
 * Function that fills table with new data.
 * @param {object} arrData
 * */
function fillTable(arrData) {

    var table = $("#my_table").DataTable();
    table.clear();
    arrData.forEach(function(d) {
        var entrance = d.value.entrance !== undefined ? d.value.entrance[0].split(" ")[0] + " - " + d.value.entrance[1].split(" ")[0] : "Missing data";
        var month = d.value.month !== undefined ? d.value.month : "Missing data";
        var row = {
            "DT_RowId": d.key,
            "DT_RowClass": d.key,
            "camping": d.value.camping,
            "check-ins": d.value.number_stops,
            "days": d.value.number_days,
            "entrance": entrance,
            "id": d.key,
            "month": month,
            "type": d.value.car_type
        };
        table.row.add(row)
    });
    table.draw();
}
