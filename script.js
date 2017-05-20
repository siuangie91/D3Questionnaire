var files = [];
var lastFileNum;

d3.json("datafiles.txt", function(error, data) {
    data.forEach(function(d,i) {
        files.push(d);
    });

    lastFileNum = (files[files.length - 1].name.substr(4,1));

    console.log("lastFileNum: "+ lastFileNum);
});

var svg = d3.select("svg");
var container = d3.select("#container");

var update = function(data, datasetNum) {
    //*********** CIRCLES + TEXT **************//
    d3.json(data, function(error, data) {
        // DATA JOIN <div class="group">s
        var group = container.selectAll("div.group")
            .data(data, function(d) { return d.x; });

        // ENTER + UPDATE groups
        group.enter().append("div")
            .classed("group", true)
            .classed("dataset" + datasetNum, true)
        .merge(group)
            .style("left", function(d) { return +d.x - d.r + "px";})
            .style("top", function(d) { return +d.y + 200 + "px";})
            .style("width", function(d) { return +d.r * 2 + "px"; })
            .style("height", function(d) { return +d.r * 2 + "px"; })
            .style("transform", "scale(0.25)")
            .style("opacity", 0)
        .transition().duration(400).delay(450)
            .style("opacity", 1)
        .transition().duration(1200).delay(function(d,i) { return i * 200; })
            .style("transform", "scale(1)")
            .style("top", function(d) { return +d.y - (d.r / 2) + "px";});

        // EXIT/REMOVE old <div class="group">s
        group.html(null) // remove child elems as well
            .exit()
                .transition().duration(400)
                .style("opacity", 0)
            .remove();

        // Recreate SELECTION of all <div class="group">s, incl. newly appended ones
        var groupContainers = container.selectAll("div.group");

        // Append <div class="circle">s to <div class="group">s
        groupContainers.append("div")
            .classed("circle", true)
            .call(fadeIn, 1200);

        // Append <span class="heading">s to <div class="group">s
        groupContainers.append("span")
            .classed("heading", true)
            .call(fadeIn, 800)
            .text(function(d) { return d.heading; });

        // Append <span class="copy">s to <div class="group">s
        groupContainers.append("span")
            .classed("copy", true)
            .call(fadeIn, 800)
            .text(function(d) { return d.copy; });

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
                    this.blur();
                });
        }

        function fadeIn(selection, duration) {
            selection.transition()
                .duration(duration).delay(function(d,i) { return i * 200; })
                .style("opacity", 1);
        }
    });

    //*********** CONNECTING LINES **************//
    d3.json(data, function(error, data) {
        // DATA JOIN <line>s
        var line = svg.selectAll("line.connector")
            .data(data, function(d) { return d.x; });

        // ENTER + UPDATE lines
        line.enter().append("line")
                .classed("connector", true)
            .merge(line)
                .style("opacity", 0)
            .transition().duration(1200).delay(function(d,i) { return i * 200 + 400; })
                .style("opacity", 1)
                .attr("x1", function(d,i) { if(data[i+1] !== undefined) return +d.x; })
                .attr("y1", function(d,i) { if(data[i+1] !== undefined) return +d.y + (d.r / 2); })
                .attr("x2", function(d,i) { if(data[i+1] !== undefined) return +d.x; })
                .attr("y2", function(d,i) { if(data[i+1] !== undefined) return +d.y + (d.r / 2); })
            .transition().duration(800)
                .attr("x2", function(d,i) { if(data[i+1] !== undefined) return +data[i+1].x; })
                .attr("y2", function(d,i) { if(data[i+1] !== undefined) return +data[i+1].y + (data[i+1].r / 2); });

        // EXIT/REMOVE old lines
        line.exit()
                .transition().duration(200)
                .style("opacity", 0)
            .remove();

    });

    //*********** BOOKEND LINES **************//
    d3.json(data, function(error, data) {
        // DATA JOIN <line class="bookend">s
        bookend = svg.selectAll("line.bookend")
            .data(data.filter(function(d,i) { return (i === 0) || (i === data.length - 1); })); // get first and last items only (the bookends)

        // ENTER + UPDATE <line class="bookend">s
        bookend.enter().append("line")
            .merge(bookend)
                .classed("bookend", true)
                .attr("id", function(d,i) { return (i == 0) ? "begin" : "end"; })
                .attr("x1", function(d,i) { return (i == 0) ? 0 : d.x; })
                .attr("y1", function(d,i) { return (i == 0) ? 768 : d.y; })
                .attr("x2", function(d,i) { return (i == 0) ? 0 : d.x; })
                .attr("y2", function(d,i) { return (i == 0) ? 768 : d.y; })
            .transition().duration(800).delay(function(d,i) { return (i == 0) ? 1200 : data.length * 200 + 1400; })
                .attr("x2", function(d,i) { return (i == 0) ? d.x : 1024; })
                .attr("y2", function(d,i) { return (i == 0) ? d.y : 768; });

        // EXIT/REMOVE old <line class="bookend">s
        bookend.exit()
                .transition().duration(200)
                .style("opacity", 0)
            .remove();

    })
};

d3.select("#start")
    .on("click", function() {
        update("data1.txt", 1);
        this.remove();
    });














