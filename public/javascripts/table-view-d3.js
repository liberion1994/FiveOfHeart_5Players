/**
 * Created by liboyuan on 16/8/13.
 */

var width = 400;
var height = 400;

var rects = [
    { color: 'red', x: 150, y:200, width:30, height: 15, rx: 2, ry: 2 },
    { color: 'black', x: 250, y:200, width:30, height: 15, rx: 2, ry: 2 }
];

var svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height);

svg.selectAll("rect")
    .data(rects)
    .enter()
    .append("rect")
    .attr("x",function(d){ return d.x; })
    .attr("y",function(d){ return d.y; })
    .attr("width",function(d){ return d.width; })
    .attr("height",function(d){ return d.height; })
    .attr("rx",function(d){ return d.rx; })
    .attr("ry",function(d){ return d.ry; })
    .attr("fill",function(d){ return d.color; })
    .call(d3.drag().on("start", dragStart).on("drag", dragMove));  //这里是刚才定义的drag行为

function dragStart(d) {
    d.mx = d3.event.x - d.x;
    d.my = d3.event.y - d.y;
}

function dragMove(d) {
    d3.select(this)
        .attr("x", d.x = d3.event.x - d.mx)
        .attr("y", d.y = d3.event.y - d.my);
}