function lineInit() {
    w = 600;
    h = 300;
    padding = 20;

    var dataset;

    d3.csv("Files/InflationRateSecondAttempt.csv", function(d) {        //Load in each CSV column into a different value
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
        lineChart(dataset, w, h, padding);                              //Run Linechart() with inputed values
    });
}

function lineChart(data, w, h, padding) {
    console.log(data);

    var parseTime = d3.timeParse("%b-%y");                              //Create a solution for converting string to date
    var dates = [];
    for(let obj of data) {
        dates.push(parseTime(obj.date));                                //Iterate over all dates and push them to dates as a date
    }

    xScale = d3.scaleTime()
                .domain(d3.extent(dates))                               //Find the lowest and highest dates
                .range([0, w]);

    yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.IndiaValues; })            //Scale from india values since india has the highest inflation rate
                ])
                .range([h, 0]);

    australialine = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.AustraliaValues)});        //Create the line using australian values

    englandline = d3.line()
                    .x(function(d) { return xScale(parseTime(d.date)); })
                    .y(function(d) { return yScale(d.EnglandValues)});      //Create the line using Engaland Values

    var svg = d3.select("#lineGraph")
                .append("svg")
                .attr("width", w + 2 * padding)
                .attr("height", h + 2 * padding);


    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("transform", "translate(20, 0)")
        .attr("d", australialine)
        .attr("stroke", "blue");

    svg.append("path")
        .datum(data)
        .attr("class", "secondline")
        .attr("transform", "translate(20, 0)")
        .attr("d", englandline)
        .attr("stroke", "red");

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

function lineSelectGraph() {
    var choice = document.getElementById("lineSelect").value;

    update(choice);
}

function update(choice){
    var dataset;

    d3.csv("Files/InflationRateSecondAttempt.csv", function(d) {
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
    }).then(function (data){
        dataset = data;
    })

    var parseTime = d3.timeParse("%b-%y");

    englandline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.EnglandValues)});

    indialine = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.IndiaValues)});
    
    chinaline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.ChinaValues)});
        
    newzealandline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.NewZealandValues)});
        
    philippinesline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.PhilippinesValues)});
        
    southafricaline = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.SouthAfricaValues)});

    var secondline;
    switch(choice) {
        case "England":
            secondline = englandline;
            break;

        case "India":
            secondline = indialine;
            break;
        
        case "China":
            secondline = chinaline;
            break;

        case "NewZealand":
            secondline = newzealandline;
            break;
        
        case "Philippines":
            secondline = philippinesline;
            break;

        case "SouthAfrica":
            secondline = southafricaline;
            break;

        default:
            secondline = australialine;
            break;
    }

    var svg = d3.select("#lineGraph")
                .transition();

    svg.select(".secondline")
        .duration(750)
        .attr("d", secondline);
}