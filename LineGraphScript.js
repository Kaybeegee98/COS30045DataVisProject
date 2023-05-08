function lineInit() {
    w = 600;
    h = 300;
    padding = 20;

    var dset;

    d3.csv("Files/InflationRate.csv", function(d) {
        return {
            country: d.Country,
            dateValues: [+d.Jan18, +d.Apr18, +d.Oct18, +d.Jan19, +d.Apr19, +d.Jul19, +d.Oct19, +d.Jan20, +d.Apr20, +d.Jul20, +d.Oct20,  +d.Jan21, +d.Apr21, +d.Jul21, +d.Oct21, +d.Jan22, +d.Apr22, +d.Jul22, +d.Oct22]
        };   
    }).then(function(data) {
        dataset = data;
        console.table(dataset, ["country", "dateValues"]);
    });
}