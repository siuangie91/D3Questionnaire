var files = [];
var lastFileNum;

d3.json("datafiles.txt", function(error, data) {
    data.forEach(function(d,i) {
        files.push(d);
    });

    lastFileNum = (files[files.length - 1].name.substr(4,1));

    console.log("lastFileNum: "+ lastFileNum);
});

//var svg = d3.select("svg");
var container = d3.select("#container");

var update = function(data, datasetNum) {
    d3.json(data, function(error, data) {
        // DATA JOIN <div class="group">s
        var group = container.selectAll("div.group")
            .data(data);

        // ENTER + UPDATE groups
        group.enter().append("div")
                .classed("group", true)
            .merge(group)
                .classed("dataset" + datasetNum, true)
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("width", "40px")
                .style("height", "40px")
                .style("top", function(d) { return +d.y + 200 + "px";})
            .transition().duration(1200).delay(function(d,i) { return i * 200; })
                .style("width", function(d) { return +d.r * 2 + "px"; })
                .style("height", function(d) { return +d.r * 2 + "px"; })
                .style("top", function(d) { return +d.y - (d.r / 2) + "px";});

        // EXIT/REMOVE old <div class="group">s
        group.html(null) // remove child elems as well
            .exit().transition().duration(800)
            .attr("opacity", 0)
            .remove();

        // Recreate SELECTION of all <div class="group">s, incl. newly appended ones
        var groupContainers = container.selectAll("div.group");

        // Append <div class="circle">s to <div class="group">s
        groupContainers.append("div")
            .classed("circle", true);

        // Append <span class="heading">s to <div class="group">s
        groupContainers.append("span")
            .classed("heading", true)
            .call(fadeIn, 800)
            .text(function(d) { return d.heading; });

        // Append <span class="copy">s to <div class="group">s
        groupContainers.append("span")
            .classed("copy", true)
            .text(function(d) { return d.copy; })
            .call(fadeIn, 800);

        // Attach click event listener to <div class="group">s to switch to next dataset
        container.selectAll(".group.dataset" + datasetNum + ":not(:first-of-type)")
            .on("click", function() {
                update("data" + ++datasetNum + ".txt", datasetNum++);
            });

        // If on last dataset, clicking reloads page.
        if(container.selectAll(".group.dataset" + lastFileNum).size()) {
            container.selectAll(".group.dataset" + lastFileNum + ":not(:first-of-type)")
                .on("click", function() {
                    window.location.reload();
                });
        }

        function fadeIn(selection, duration) {
            selection.transition()
                .duration(duration)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1);
        }
    });
};

d3.select("#start")
    .on("click", function() {
        update("data1.txt", 1);
        this.remove();
    });
