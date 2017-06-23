
function makeSlider() {
    var slider = $('#weekSlider').slider({
        tooltip: 'always',
        formatter: sliderToFilename
    });

    $("#weekSlider-enabled").click(function() {
        if(this.checked) {
            $("#weekSlider").slider("enable");

            slider.enable();
        }
        else {
            $("#weekSlider").slider("disable");

            slider.disable();
        }
    });
    return slider;
}
