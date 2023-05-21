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

    //Create Tooltip
    var tooltip = d3.select("#tooltip");

    var secondtooltip = d3.select("#secondtooltip");
    
    var tooltopDot = svg.append("circle")
                        .attr("r", 5)
                        .attr("fill", "#fc8781")
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0)
                        .attr("pointer-events", "none");

    var secondtooltipDot = svg.append("circle")
                        .attr("r", 5)
                        .attr("fill", "#fc8781")
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0)
                        .attr("pointer-events", "none");

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

    svg.append("rect")
        .attr("width", w + 2 * padding)
        .attr("height", h + 2 * padding)
        .style("opacity", 0)
        .style("pointer-events", "all")
        .on("touchmouse mousemove", function(event) {
            var choice = document.getElementById("lineSelect").value;
            console.log(choice);
            var mousePos = d3.pointer(event, this);
            
            var date = xScale.invert(mousePos[0]);

            var hoveredIndex;

            var year = date.getFullYear();
            var yearIndex;
            var monthIndex;

            switch(year) {
                case(2018):
                    yearIndex = 0;
                    break;
                case(2019):
                    yearIndex = 4;
                    break;
                case(2020):
                    yearIndex = 8;
                    break;
                case(2021):
                    yearIndex = 12;
                    break;
                case(2022):
                    yearIndex = 16;
                    break;
                default:
                    break;
            }

            if(date.getMonth() >= 0 && date.getMonth() < 3) {
                monthIndex = 0;
            }
            else if (date.getMonth() >= 3 && date.getMonth() < 6) {
                monthIndex = 1;
            }
            else if (date.getMonth() >= 6 && date.getMonth() < 9) {
                monthIndex = 2;
            }
            else{
                monthIndex = 3;
            }
            hoveredIndex = data[monthIndex + yearIndex];

            tooltopDot.style("opacity", 1)
                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                    .attr("cy", yScale(hoveredIndex.AustraliaValues))
                    .attr("transform", "translate(20, 0)");

            tooltip.style("display", "block")
                    .style("top", 2100 + "px")
                    .style("left", 600 + "px")

            secondtooltip.style("display", "block")
                    .style("top", 2160 + "px")
                    .style("left", 600 + "px")

            tooltip.select(".date")
                    .text("Australia " + hoveredIndex.date);

            tooltip.select(".price")
                    .text(hoveredIndex.AustraliaValues);

            switch(choice) {
                case "England":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.EnglandValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                .text("England " + hoveredIndex.date);
        
                    secondtooltip.select(".price")
                                .text(hoveredIndex.EnglandValues);
                    break;
        
                case "India":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.IndiaValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                .text("India " + hoveredIndex.date);
        
                    secondtooltip.select(".price")
                                .text(hoveredIndex.IndiaValues);

                    break;
                
                case "China":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.ChinaValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                    .text("China " + hoveredIndex.date);
            
                    secondtooltip.select(".price")
                                    .text(hoveredIndex.ChinaValues);
                    break;
        
                case "NewZealand":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.NewZealandValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                    .text("New Zealnd " + hoveredIndex.date);
            
                    secondtooltip.select(".price")
                                    .text(hoveredIndex.NewZealandValues);
                    break;
                
                case "Philippines":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.PhilippinesValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                    .text("Philippines " + hoveredIndex.date);
            
                    secondtooltip.select(".price")
                                    .text(hoveredIndex.PhilippinesValues);
                    break;
        
                case "SouthAfrica":
                    secondtooltipDot.style("opacity", 1)
                                    .attr("cx", xScale(parseTime(hoveredIndex.date)))
                                    .attr("cy", yScale(hoveredIndex.SouthAfricaValues))
                                    .attr("transform", "translate(20, 0)");

                    secondtooltip.select(".date")
                                    .text("South Africa " + hoveredIndex.date);
            
                    secondtooltip.select(".price")
                                    .text(hoveredIndex.SouthAfricaValues);
                    break;
        
                default:
                    break;
            }
        })
        .on("mouseleave", function(){
            tooltopDot.style("opacity", 0);
            tooltip.style("display", "none");
            secondtooltipDot.style("opacity", 0);
            secondtooltip.style("display", "none");
        })
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