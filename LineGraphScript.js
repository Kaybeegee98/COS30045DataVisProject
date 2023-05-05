lineInit() {
    w = 600;
    h = 300;
    padding = 20;

    var dataset;

    d3.csv("InflationRate.csv", function(data) {
        var countries;
        var dates;

        for (var variable in data[0]) {
            if (variable != ""){
                if (key == "Country"){
                    countries = data.map(function(d) { return d[variable]; });         
                    //loops through everything in the country column and adds it to the array. Map is used to extract the data
                }
                } else {
                    dates.push(variable);
                }
        }

        var values = [];

        data.forEach(function(d) {                             //Loop through every element in data, creating an object for each line
            var country = d.Country;
            for (var i = 0; i < dates.length; i++) {
                var date = dates[i];
                var value = +d[date];
                values.push({
                    country: country,
                    date: date,
                    value: value
                });
            }
        });



    });
}