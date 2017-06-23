function sliderToFilename(value) {

    var filename;
    // convert slider value to filename
    if (value < 0) {
        filename = 53 - (-value) + "-2015"
    }
    else {
        filename = parseInt(value) + 1 + "-2016"
    }

    return filename;
}