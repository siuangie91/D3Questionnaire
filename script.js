var getRandomInt = function() {
    return Math.floor(Math.random() * 255);
};

var svg = d3.select("svg");

function update(data, fill) {
    d3.json(data, function(error, data) {
        fill = fill || "steelblue";
        // DATA JOIN
        var circle = svg.selectAll("circle")
            .data(data);

        // Automatically UPDATE existin elems when creating new ones
        // ENTER to create new elems as needed + automatically UPDATE existing elements
        circle.enter().append("circle")
            .merge(circle) // merge() merges arrays into a single array. In this case, it merges selections (our circle data) together.
                .attr("r", 0)
            .transition().duration(800).delay(function(d,i) { return i * 400; })
                .attr("r", 10)
                .attr("cx", function(d) { return +d.x; })
                .attr("cy", function(d) { return +d.y; })
                .style("fill", fill);

        // EXIT to remove old elements.
        circle.exit().transition().duration(800)
            .attr("r", 0)
            .remove();
    });
}

setTimeout(function() {
    console.log("Update using data1");
    update("data1.json", "red");
}, 1000);

setTimeout(function() {
    console.log("Update using data2");
    update("data2.json", "green");
}, 8000);
