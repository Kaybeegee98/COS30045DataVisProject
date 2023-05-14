//This is for Lachie's Bar Graph Script
function init() {

    d3.csv("/Files/NetMigration.csv").then(function (data) {
        console.log(data);
        migrationData = data;
        barChart(migrationData);
    });

    function barChart() {
        var w = 500; // Width
        var h = 100; //height
        var barpadding = 4;
        var svg = d3.select(".barGraph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        //selection.attr(name[, value]);

        //Create the x-scale
        var xScale = d3.scaleBand()
            .domain(migrationData.map(d => d.Year))
            .range([0, w])

        //Create the y-scale
        var yScale = d3.scaleLinear()
            //  .domain([0, d3.max(migrationData)])
            .domain([0, d3.max(migrationData, d => d.Net_Overseas_Migration_Thousands)])
            .range([0, h]);
        //Create x-axis
        var xAxis = d3.axisBottom()
            .scale(xScale);
        svg.append("g")
            .attr("transform", "translate(0, " + (h - barpadding) + ")")
            .call(xAxis);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        svg.append("g")
            .attr("transform", "translate(" + (barpadding) + ",0)")
            .call(yAxis);






        //Append rectangles for bar chart
        svg.selectAll("rect")
            .data(migrationData)
            .enter()
            .append("rect")
            /*
            .attr("x", function (d, i) {
                return i * (w / migrationData.length);
            })
            */
           
            .attr("x", function (d) {
                return xScale(d.Year);
            })
            
            /*
             .attr("y", function (d) {
                 return h - (d.Net_Overseas_Migration_Thousands / 3);
             })
             */
            .attr("y", function (d) {
                return h - yScale(d.Net_Overseas_Migration_Thousands);

            })
            /*
             .attr("height", function (d) {
                 return d.Net_Overseas_Migration_Thousands / 3;
             })
             */
            .attr("height", function (d) {
                return yScale(d.Net_Overseas_Migration_Thousands - 13)
            })

            /*
            .attr("width", w / migrationData.length - 5)
            */
            .attr("width", w / migrationData.length - 5)
            .attr("fill", function (d) {
                return "rgb(0,0, " + Math.round(d.Net_Overseas_Migration_Thousands * 10) + ")";
            });
            




    }

}
window.onload = init;