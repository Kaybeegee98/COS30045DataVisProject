
function pieInit() {


    d3.csv("/Files/OverseasBorn.csv").then(function (data) {
        console.log(data);
        overseasBornData = data;
        pieChart(overseasBornData);
    });

    //Enlarge the slice of the pie chart
    // Define a function to interpolate the arc's outer radius
    function arcTween(radius) {
        return function (d) {
            var i = d3.interpolate(d.outerRadius, radius);
            return function (t) {
                d.outerRadius = i(t);
                return arc(d);
            };
        };
    }


    function pieChart() {
        var w = 500;
        var h = 540;
        //To generate the paths for our pie chart we can use d3.pie().
        var pie = d3.pie().value(function (d) {
            return d.overseas_born_thousands;
        });

        //Set up pie chart parmeters 
        var outerRadius = w / 2;
        var innerRadius = 0;
        /*
        If you add our data into the
        pie function it will generate angles which can be used to draw the 
        segments of our pie chart.
        However, it does not draw the chart. For the we need d3.arc()
         */
        var arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        //Create SVG element
        var svg = d3.select("#pieGraph")
            .append("svg")
            .attr("width", w + 120)
            .attr("height", h + 20);

        //Set up groups
        var arcs = svg.selectAll()
            .data(pie(overseasBornData))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + (outerRadius + 100) + ", " + (outerRadius + 40) + ")");
        //Set up colors
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        //Draw the arcs
        arcs.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            }).attr("d", function (d, i) {
                return arc(d, i);
            })
            .on("mouseover", function (event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("d", d3.arc().outerRadius(outerRadius + 10).innerRadius(innerRadius));
              })
              .on("mouseout", function (event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("d", d3.arc().outerRadius(outerRadius).innerRadius(innerRadius));
              });
                                              

        //generate text labels for each wedge
        arcs.append("text")
            .attr("transform", function (d) {
                /*
                To push them out to their
                respective segments we can use the transform and arc.centroid(). arc.-
                centroid() finds the middle of an irregular shape   
                */
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")

            /*
            Note that in text(), we reference the value with d.value instead of 
            just d. This is because we bound the pie-ified data, so instead of 
            referencing our original array (d), we have to reference the array of
            objects (d.value)
            */
            .text(function (d) {
                return d.data.country + ": " + d.data.overseas_born_thousands;
            });

        // Add title to the top of the pie chart
        svg.append("text")
            .attr("x", w /2 + 100)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Overseas Born Population (Thousands) by Country in 2020");








    }

}
window.onload = init;
