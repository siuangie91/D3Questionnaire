var svg = d3.select("svg");
var container = d3.select("#container");

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

        var heading = container.selectAll("span.heading")
            .data(data);

        heading.enter().append("span")
            .merge(heading)
                .attr("class", "heading")
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1)
                .style("width", function(d) { return +d.r * 2 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 1.5) + "px";})
            .text(function(d) { return d.heading; });

        heading.exit().transition().duration(800)
            .attr("opacity", 0)
            .remove();

        var copy = container.selectAll("span.copy")
            .data(data);

        copy.enter().append("span")
            .merge(copy)
                .attr("class", "copy")
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1)
                .style("width", function(d) { return +d.r * 2 - 20 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 2) + 20 + "px";})
            .text(function(d) { return d.copy; });
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
