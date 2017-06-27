var tableDataGlobal;

drawScatter = function(tableData) {

    tableDataGlobal = tableData;

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 100, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var legendArray = carTypeColors(d3);
    var color = legendArray[0];
    var legendDict = legendArray[1];

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .shapePadding(10)
        .scale(color);

    // append the svg obgect to the body of the page
    var svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "scatterSVG")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (width + margin.right / 2) + ",20)");

    // Get the data
    d3.json("../Data/tsne/vars_21-2016_vars_22-2016.json", function(error, data) {

        if (error) throw error;

        // Scale the range of the data
        x.domain(d3.extent(d3.entries(data), function(d) { return d.value.x; }));
        y.domain(d3.extent(d3.entries(data), function(d) { return d.value.y; }));

        // Add the scatterplot
        var circles = svg.selectAll("circle")
            .data(d3.entries(data))
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.value.x); })
            .attr("cy", function(d) { return y(d.value.y); })
            .style("fill", function(d) { return legendDict[d.value.car_type]; });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axis x")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .attr("class", "axis y")
            .call(d3.axisLeft(y));

        var legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
            .title("Car-type")
            .shapePadding(10)
            .scale(color);

        svg.select(".legendOrdinal")
            .call(legendOrdinal);

        svg.selectAll(".cell")
            .filter(function(d) { console.log(d); return d === 0 })
                .style("display", "none");

        var lasso = d3.lasso()
            .closePathSelect(true)
            .closePathDistance(100)
            .items(circles)
            .targetArea(svg);

        var lassos = lassoFunctions(tableData, lasso);
        var lasso_start = lassos[0];
        var lasso_draw = lassos[1];
        var lasso_end = lassos[2];

        lasso
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);

        svg.call(lasso);
    });

};

function lassoFunctions(tableData, lasso) {

    // Lasso functions
    var lasso_start = function() {
        lasso.items()
            .attr("r", 5) // reset size
            .classed("not_possible",true)
            .classed("selected",false);
    };

    var lasso_draw = function() {

        // Style the possible dots
        lasso.possibleItems()
            .classed("not_possible",false)
            .classed("possible",true);

        // Style the not possible dot
        lasso.notPossibleItems()
            .classed("not_possible",true)
            .classed("possible",false);
    };

    var lasso_end = function() {
        // Reset the color of all dots
        lasso.items()
            .classed("not_possible",false)
            .classed("possible",false);

        // Style the selected dots
        lasso.selectedItems()
            .classed("selected",true)
            .attr("r", 10);

        // fill table with selected dots data
        var selected = lasso.items().filter(function(){
            return d3.select(this).attr("class") === "selected"
        });
        var newTableData = [];
        selected.each(function(s) {
            newTableData.push({key: s.key, value: tableData[s.key]})
        });
        fillTable(newTableData);

        // Reset the style of the not selected dots
        lasso.notSelectedItems()
            .attr("r", 5);
    };

    return [lasso_start, lasso_draw, lasso_end]
}

function updateScatter(data) {

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var legendArray = carTypeColors(d3);
    var legendDict = legendArray[1];

    // Scale the range of the data
    x.domain(d3.extent((data), function(d) { return d.value.x; }));
    y.domain(d3.extent((data), function(d) { return d.value.y; }));

    var svg = d3.select("#scatterSVG");

    // update axis
    svg.selectAll(".axis.y")
        .call(d3.axisLeft(y));
    svg.selectAll(".axis.x")
        .call(d3.axisLeft(y));

    var circles = svg.selectAll("circle")
        .data(data);

    // remove old circles
    circles.exit().remove();

    // update existing circles
    circles
        .data(data)
        .transition()
        .duration(650)
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.value.x); })
        .attr("cy", function(d) { return y(d.value.y); })
        .style("fill", function(d) { return legendDict[d.value.car_type]; });

    // draw new circles
    circles
        .data(data)
        .enter().append("circle")
        .transition()
        .duration(650)
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.value.x); })
        .attr("cy", function(d) { return y(d.value.y); })
        .style("fill", function(d) { return legendDict[d.value.car_type]; });

    circles.exit().remove();
    console.log(d3.selectAll("circle"))
    // update lasso function
    var lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(d3.selectAll("circle"))
        .targetArea(svg);

    var lassos = lassoFunctions(tableDataGlobal, lasso);
    var lasso_start = lassos[0];
    var lasso_draw = lassos[1];
    var lasso_end = lassos[2];

    lasso
        .on("start", lasso_start)
        .on("draw", lasso_draw)
        .on("end", lasso_end);

    svg.call(lasso);
}