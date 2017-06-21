
function makeSlider() {
    var slider = $('#ex1').slider({
        tooltip: 'always',
        formatter: function(value) {
            if (value < 0) {
                value = 53 - (-value) + "-2015"
            }
            else {
                value = parseInt(value) + 1 + "-2016"
            }
            return value;
        }
    });

    $("#ex1-enabled").click(function() {
        if(this.checked) {
            // With JQuery
            $("#ex1").slider("enable");

            // Without JQuery
            slider.enable();
        }
        else {
            // With JQuery
            $("#ex1").slider("disable");

            // Without JQuery
            slider.disable();
        }
    });
    return slider;
}
