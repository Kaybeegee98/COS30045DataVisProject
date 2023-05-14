//Script For Stacked Bar Graph
function stackedBarInit() {
    w = 600;
    h = 300;
    padding = 20;

    var dataset;

    d3.csv("Files/UnemploymentRateSecondAttempt.csv", function(d) {        //Load in each CSV column into a different value
        return {
            date: d.Date,
            AustraliaValues: +d.AustraliaValues,
            EnglandValues: +d.EnglandValues,
            IndiaValues: +d.IndiaValues,
            ChinaValues: +d.ChinaValues,
            NewZealandValues: +d.NewZealandValues,
            PhilippinesValues: +d.PhilippinesValues,
            SouthAfricaValues: +d.SouthAfricaValues
        };
    }).then(function(data) {
        dataset = data;

        stackedBarChart(dataset, w, h, padding);                              //Run Linechart() with inputed values
    });
}

function stackedBarChart(dataset, w, h, padding) {
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    console.table(dataset, ["country", "dateValues"]);

    var parseTime = d3.timeParse("%b-%y");                              //Create a solution for converting string to date
    var dates = [];
    for(let obj of dataset) {
        dates.push(parseTime(obj.date));                                //Iterate over all dates and push them to dates as a date
    }

    var xScale = d3.scaleBand()
                    .domain(dates.map(function(d) { return d; }))
                    .rangeRound([0, w])
                    .paddingInner(0.05);

    console.log(xScale.domain());

    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function(d) {
                        return d.AustraliaValues + d.EnglandValues + d.IndiaValues + d.ChinaValues + d.NewZealandValues + d.PhilippinesValues + d.SouthAfricaValues;
                        })
                    ])
                    .range([h, 0]);  

    var stack = d3.stack()
                    .keys([
                        "AustraliaValues", 
                        "EnglandValues", 
                        "IndiaValues", 
                        "ChinaValues", 
                        "NewZealandValues", 
                        "PhilippinesValue", 
                        "SouthAfricaValues"
                    ]);

    var series = stack(dataset);

    var svg = d3.select("#stackedBarGraph")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var groups = svg.selectAll("g")
                    .data(series)
                    .enter()
                    .append("g")
                    .style("fill", function(d, i) {
                        return color(i);
                    });              

    var rects = groups.selectAll("rect")
                        .data(function(d) { return d; })
                        .enter()
                        .append("rect")
                        .attr("x", function(d, i) {
                            console.log(xScale(d));
                            return xScale(dates[i]);
                        })
                        .attr("y", function(d, i) {
                            return yScale(d[1]);
                        })
                        .attr("height", function(d) {
                            return yScale(d[0]) - yScale(d[1]);
                        })
                        .attr("width", xScale.bandwidth());

        var xAxis = d3.axisBottom()
            .scale(xScale);
    
        svg.append("g")
            .attr("transform", "translate(20, " + (h + (padding/2)) + ")")
            .call(xAxis);
    
        var yAxis = d3.axisLeft()
            .ticks(10)
            .scale(yScale); 
    
        svg.append("g")
            .attr("transform", "translate(20 , 10)")                        //Position Y-Axis Correctly
            .call(yAxis);
}