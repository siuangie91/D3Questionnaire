var svg = d3.select("svg");
var container = d3.select("#container");

function update(data, datasetNum) {
    d3.json(data, function(error, data) {
        var circle = svg.selectAll("circle")
            .data(data);

        console.log("datasetNum: " + datasetNum);

        circle.enter().append("circle")
            .merge(circle)
                .attr("class", "dataset" + datasetNum)
                .attr("cx", function(d) { return +d.x; })
                .attr("cy", function(d) { return +d.y; })
                .attr("r", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .attr("r", function(d) { return +d.r; });

        circle.exit().transition().duration(800)
            .attr("r", 0)
            .remove();

        var heading = container.selectAll("span.heading")
            .data(data);

        heading.enter().append("span")
            .merge(heading)
                .attr("class", "heading")
                .style("width", function(d) { return +d.r * 2 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 1.5) + "px";})
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1)
            .text(function(d) { return d.heading; });

        heading.exit().transition().duration(800)
            .attr("opacity", 0)
            .remove();

        var copy = container.selectAll("span.copy")
            .data(data);

        copy.enter().append("span")
            .merge(copy)
                .attr("class", "copy")
                .style("width", function(d) { return +d.r * 2 - 20 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 2) + 20 + "px";})
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1)
            .text(function(d) { return d.copy; });

        svg.selectAll("circle.dataset" + datasetNum + ":not(:first-of-type)")
            .on("click", function() {
                update("data" + ++datasetNum + ".json", 2);
            });
    });
}

d3.select("#start")
    .on("click", function() {
        update("data1.json", 1);
        this.remove();
    });









