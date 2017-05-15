var svg = d3.select("svg");

function update(data) {
    d3.json(data, function(error, data) {
        var circle = svg.selectAll("circle")
            .data(data);

        circle.enter().append("circle")
            .merge(circle)
                .attr("r", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .attr("r", function(d) { return +d.r; })
                .attr("cx", function(d) { return +d.x; })
                .attr("cy", function(d) { return +d.y; });

        circle.exit().transition().duration(800)
            .attr("r", 0)
            .remove();
    });
}
setTimeout(function() {
    console.log("Update using data1");
    update("data1.json");
}, 1000);


setTimeout(function() {
    console.log("Update using data2");
    update("data2.json");
}, 3000);
