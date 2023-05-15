//Script For Stacked Bar Graph
function stackedBarInit() {
    w = 600;
    h = 300;
    padding = 25;

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
                        "PhilippinesValues", 
                        "SouthAfricaValues"
                    ]);

    var series = stack(dataset);

    var svg = d3.select("#stackedBarGraph")
                .append("svg")
                .attr("width", w + padding + 10)
                .attr("height", h + padding + 10);

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
                            return xScale(dates[i]) + padding;
                        })
                        .attr("y", function(d, i) {
                            return yScale(d[1]);
                        })
                        .attr("height", function(d) {
                            return yScale(d[0]) - yScale(d[1]);
                        })
                        .attr("width", xScale.bandwidth());

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat(function(d) {
                var month = d3.timeFormat("%b")(d);
                var year = d3.timeFormat("'%y")(d);
                return month + " " + year;
            })

        svg.append("g")
            .attr("transform", "translate(" + padding + ", 300)")
            .call(xAxis)
            .selectAll(".tick text")
            .attr("transform", "translate(0, 10)")
            .attr("transform", "rotate(-30)");
    
        var yAxis = d3.axisLeft()
            .ticks(10)
            .scale(yScale); 
    
        svg.append("g")
            .attr("transform", "translate(" + padding + " , 0)")                        //Position Y-Axis Correctly
            .call(yAxis);
}