function sliderToFilename(value) {

    var filename;
    // convert slider value to filename
    if (value < 35) {
        filename = parseInt(value) + 18 + "-2015"
    }
    else {
        filename = parseInt(value) - 34 + "-2016"
    }

    return filename;
}

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

function makeSlider(id) {
    var slider = $(id).slider({
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

    // time parser
    var parseTime = version4.timeParse("%d/%m/%Y");

    // parse dates
    var arrData = version4.entries(data);
    arrData.forEach(function (d) {
        d.key = parseTime(d.key);
    });

    return arrData;
}

function drawToggles(options, defaultChecked) {

    // make form with toggle buttons for options
    var form = version4.select("#formDiv").append("form").attr("id", "form");
    var labels = form.selectAll("label")
        .attr("class", "checkbox-inline")
        .data(options)
        .enter()
        .append("label")
        .text(function(d) {return d;})
        .append("input")
        .attr("id", function(d) {return d;})
        .attr("type", "checkbox")
        .attr("data-toggle", "toggle")
        .attr("name", "mode");

    // initialize total button checked
    labels.each(function(l) {
        if (l === defaultChecked) {
            version4.select(this).attr("checked", "True")
        }
    });

    // use bootstrap library on each button
    options.forEach(function(d) {
        $("#" + d).bootstrapToggle();
    });

    return form;
}