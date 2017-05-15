var files = [];
var lastFileNum;

d3.json("datafiles.json", function(error, data) {
    data.forEach(function(d,i) {
        files.push(d);
    });

    lastFileNum = (files[files.length - 1].name.substr(4,1));

    console.log("lastFileNum: "+ lastFileNum);
});

var svg = d3.select("svg");
var container = d3.select("#container");

function update(data, datasetNum) {
    d3.json(data, function(error, data) {
        // DATA JOIN circles
        var circle = svg.selectAll("circle")
            .data(data);

        console.log("datasetNum: " + datasetNum);

        // ENTER + UPDATE circles
        circle.enter().append("circle")
            .merge(circle)
                .attr("class", "dataset" + datasetNum)
                .attr("cx", function(d) { return +d.x; })
                .attr("cy", function(d) { return +d.y; })
                .attr("r", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .attr("r", function(d) { return +d.r; });

        // EXIT/REMOVE old circles
        circle.exit().transition().duration(800)
            .attr("r", 0)
            .remove();

        // DATA JOIN <div class="text">s
        var text = container.selectAll("div.text")
            .data(data);

        // ENTER + UPDATE <div class="text">s
        text.enter().append("div")
                .attr("class", "text")
            .merge(text)
                .style("width", function(d) { return +d.r * 2 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 1.5) + "px";})
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1);

        // EXIT/REMOVE old <div class="text">s
        text.html(null) // remove child <span class="heading">s and <span class="copy">s as well
            .exit().transition().duration(800)
            .attr("opacity", 0)
            .remove();

        // Create SELECTION of all <div class="text">s, incl. newly appended ones
        var textContainers = container.selectAll("div.text");

        // Append <span class="heading"> to <div class="text">s
        textContainers.append("span")
            .attr("class", "heading")
            .text(function(d) { return d.heading; });

        // Append <span class="copy"> to <div class="text">s
        textContainers.append("span")
            .attr("class", "copy")
            .text(function(d) { return d.copy; });

        // Attach click event listener to circles to switch to next dataset
        svg.selectAll("circle.dataset" + datasetNum + ":not(:first-of-type)")
            .on("click", function() {
                update("data" + ++datasetNum + ".json", datasetNum++);
            });

        // If on last dataset, clicking button reloads page.
        if(svg.selectAll("circle.dataset" + lastFileNum).size()) {
            svg.selectAll("circle.dataset" + lastFileNum)
                .on("click", function() {
                    window.location.reload();
                });
        }

    });
}

d3.select("#start")
    .on("click", function() {
        update("data1.json", 1);
        this.remove();
    });
