var files = [];
var lastFileNum;

d3.json("datafiles.json", function(error, data) {
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
                .style("width", function(d) { return +d.r * 2 + "px"; })
                .style("height", function(d) { return +d.r * 2 + "px"; })
                .style("left", function(d) { return +d.x - d.r + "px";})
                .style("top", function(d) { return +d.y - (d.r / 1.5) + "px";})
                .style("opacity", 0)
            .transition().duration(800).delay(function(d,i) { return i * 200; })
                .style("opacity", 1);

        // EXIT/REMOVE old <div class="text">s
        group.html(null) // remove child <span class="heading">s and <span class="copy">s as well
            .exit().transition().duration(800)
            .attr("opacity", 0)
            .remove();

        // Recreate SELECTION of all <div class="group">s, incl. newly appended ones
        var groupContainers = container.selectAll("div.group");

        // Append <div class="circle"> to <div class="group">s
        groupContainers.append("div")
            .classed("circle", true);

        // Append <span class="heading"> to <div class="group">s
        groupContainers.append("span")
            .classed("heading", true)
            .text(function(d) { return d.heading; });

        // Append <span class="copy"> to <div class="group">s
        groupContainers.append("span")
            .classed("copy", true)
            .text(function(d) { return d.copy; });

        // Attach click event listener to circles to switch to next dataset
        container.selectAll(".group.dataset" + datasetNum + ":not(:first-of-type)")
            .on("click", function() {
                update("data" + ++datasetNum + ".json", datasetNum++);
            });

        // If on last dataset, clicking button reloads page.
        if(container.selectAll(".group.dataset" + lastFileNum).size()) {
            container.selectAll(".group.dataset" + lastFileNum + ":not(:first-of-type)")
                .on("click", function() {
                    window.location.reload();
                });
        }
    });
};

d3.select("#start")
    .on("click", function() {
        update("data1.json", 1);
        this.remove();
    });
