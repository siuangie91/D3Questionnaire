//Rescale
var baseWidth = 1024;
var screenWidth = window.screen.width;
var bodyWidth = ('body' in document) ? document.body.clientWidth : document.documentElement.clientWidth;
var viewport = document.querySelector("meta[name='viewport']");
var options = viewport.content.split(',');

if (bodyWidth > baseWidth) {
    //var scale = (bodyWidth / baseWidth) > 1.333 ? 1.333 : (bodyWidth / baseWidth);
    var scale = (bodyWidth / baseWidth);
    options.push("initial-scale=" + scale);
    options.push("maximum-scale=" + scale);
    options.push("minimum-scale=" + scale);

} else {
    options.push("initial-scale=1.0");
    options.push("maximum-scale=1.0");
    options.push("minimum-scale=1.0");
}

viewport.content = options.join(',');
