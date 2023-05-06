//This is for Lachie's Bar Graph Script
function init(){

    d3.csv("/Files/NetMigration.csv").then(function(data){
        console.log(data);
        migrationData = data;
    });

    function barChart(){
       var w = 500; // Width
       var h = 100; //height
       var svg = d3.select(".barGraph")
                    .append("svg")           
                    .attr("width", w) 
                    .attr("height", h);
                //selection.attr(name[, value]);
        svg.selectAll("rect")
            .data(migrationData)
            .enter()
            .append("rect")
            .attr("x", function(d,i){
                return i * (w/ migrationData.length);
            })
            .attr("y", function(d){
                return h - (d.Net_Overseas_Migration_Thousands);
            })
            .attr("height", function(d){
                return d.Net_Overseas_Migration_Thousands;
            })
            .attr("width", w/ migrationData.length - 4)
            .attr("fill", function (d) {
                return "rgb(0,0, " + Math.round(d.wombats * 10) + ")";
            });




    }

}
window.onload = init;