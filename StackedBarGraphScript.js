//Script For Stacked Bar Graph
function stackedBarInit() {
    w = 800;
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
    console.log(series);

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
                    
    //Create Tooltip
    var tooltip = d3.select("#stackedBarGraph")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .style("width", 200 + "px");

    var mouseover = function(d){
        var subgroupname = d3.select(this.parentNode).datum().key;
        var subgroupvalue = d.target.__data__.data[subgroupname];

        switch(subgroupname){
            case("AustraliaValues"):
                subgroupname = "Australia";
                break;
            case("EnglandValues"):
                subgroupname = "England";
                break;
            case("IndiaValues"):
                subgroupname = "India";
                break;
            case("ChinaValues"):
                subgroupname = "China";
                break;
            case("NewZealandValues"):
                subgroupname = "New Zealand";
                break;
            case("PhilippinesValues"):
                subgroupname = "Philippines";
                break;
            case("SouthAfricaValues"):
                subgroupname = "South Africa";
                break;
            default:
                subgroupname = "Error";
                break;
        }
        tooltip.html("Country: " + subgroupname + "<br>" + "Unemployment Rate: " + subgroupvalue + "%")
                .style("opacity", 1);
    }
    var mouseleave = function(d) {
        tooltip.style("opacity", 0);
    }
                 

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
                        .attr("width", xScale.bandwidth())
                        .on("mouseover", mouseover)
                        .on("mouseleave", mouseleave);

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
            
            

            d3.select("#AustraliaData")
                .on("click", function() {
                    var australiaChange = dataset.map(function(d) {                     //Remap the dataset, exluding Australia
                        return {
                            date: d.date,
                            EnglandValues: d.EnglandValues,
                            IndiaValues: d.IndiaValues,
                            ChinaValues: d.ChinaValues,
                            NewZealandValues: d.NewZealandValues,
                            PhilippinesValues: d.PhilippinesValues,
                            SouthAfricaValues: d.SouthAfricaValues
                        };
                    });

                    console.table(australiaChange, ["country", "dateValues"]);

                    var removeAustraliaStack = d3.stack()
                    .keys([
                        "EnglandValues", 
                        "IndiaValues", 
                        "ChinaValues", 
                        "NewZealandValues", 
                        "PhilippinesValues", 
                        "SouthAfricaValues"
                    ]);

                    var removeAustraliaSeries = removeAustraliaStack(australiaChange);
                    console.log(removeAustraliaSeries);

                    var removeAustraliaGroups = svg.selectAll("g")
                                                .data(removeAustraliaSeries);

                    console.log(removeAustraliaGroups);

                    removeAustraliaGroups.exit()
                            .selectAll("rect")
                            .transition()
                            .duration(1000)
                            .attr("y", h)
                            .each(function(d) {
                                console.log("Removing value:", d.key, d[1] - d[0]);
                              })
                            .remove();

                    removeAustraliaGroups.enter()
                                        .append("g")
                                        .attr("class","group")
                                        .style("fill", function(d, i) {
                                            return color(i + 1);
                                        })
                                        .selectAll("rect.bar")
                                        .data(function(d) { return d;})
                                        .enter()
                                        .append("rect")
                                        .attr("class", "bar")
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
                })

                d3.select("#EnglandData")
                .on("click", function() {
                    console.log("england");
                    var englandChange = dataset.map(function(d) {                     //Remap the dataset, exluding Australia
                        return {
                            date: d.date,
                            AustraliaValues: d.AustraliaValues,
                            IndiaValues: d.IndiaValues,
                            ChinaValues: d.ChinaValues,
                            NewZealandValues: d.NewZealandValues,
                            PhilippinesValues: d.PhilippinesValues,
                            SouthAfricaValues: d.SouthAfricaValues
                        };
                    });

                    console.table(englandChange, ["country", "dateValues"]);

                    var removeEnglandStack = d3.stack()
                    .keys([
                        "AustraliaValues", 
                        "IndiaValues", 
                        "ChinaValues", 
                        "NewZealandValues", 
                        "PhilippinesValues", 
                        "SouthAfricaValues"
                    ]);

                    var removeEnglandSeries = removeEnglandStack(englandChange);

                    var removeEnglandGroups = svg.selectAll("g")
                                                .data(removeEnglandSeries);
                                                
                    console.log(removeEnglandGroups);

                    removeEnglandGroups.exit()
                            .selectAll("rect")
                            .transition()
                            .duration(1000)
                            .attr("y", h)
                            .remove();

                    removeEnglandGroups.enter()
                                        .append("g")
                                        .attr("class","group")
                                        .style("fill", function(d, i) {
                                            return color(i + 1);
                                        })
                                        .selectAll("rect")
                                        .data(function(d) { return d;})
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
                })
}