// d3.legend.js 

define([
    "d3",
    "dispatcher"
], 
function(d3, dispatcher) {
   function module() {

      var dispatch = dispatcher.dispatch;

      /**
      * Object that stores the color for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var color;

      /**
      * Variable that stores the color for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var size;

      /**
      * Object that stores the order for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var order;

      var position;

      function util(_selection) {
         _selection.each(function(_data) {

            items = {};
            var g = d3.select(this),
            svg = d3.select(".line-group"),
            legendPadding = g.attr("data-style-padding") || 5,
            lb = g.selectAll(".legend-box").data([true]),
            li = g.selectAll(".legend-items").data([true]);

            lb.enter().append("rect").classed("legend-box",true);
            li.enter().append("g").classed("legend-items",true);

            svg.selectAll("[data-legend]").each(function() {
               var self = d3.select(this);
               items[self.attr("data-legend")] = {
                  pos : self.attr("data-legend-pos") || this.getBBox().y,
                  color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
               }
            });

            items = d3.entries(items).sort(function(a,b) { return a.key-b.key; })
            console.log(items);

            var legend_list = d3.select(this).selectAll("li").data(items, function(d){ return d.key;}).enter().append("li");

            legend_list.append("span")
               .style("color", function(d) { return d.value.color; })
               .html(function(d) { return d.key;})
               .on("click", function(d) {
                  if (d3.select("#legend-container").select("#input-"+d.key).property("checked")) {
                     d3.select("#legend-container").select("#input-"+d.key).property("checked", false)
                  }
                  else { 
                     d3.select("#legend-container").select("#input-"+d.key).property("checked", true);
                  }
                  dispatcher.dispatch.click_legend(d);
               })      

            legend_list.append("input")
               .attr("type", "checkbox")
               .attr("id", function(d) {return 'input-'+d.key;})
               .property("checked", true)
               .on("change", function(d) {
                  dispatcher.dispatch.click_legend(d);
               });
/**
            li.selectAll("text")
               .data(items,function(d) { return d.key})
               .call(function(d) { d.enter().append("text")})
               .call(function(d) { d.exit().remove()})
               .attr("y",function(d,i) { return i+"em"})
               .attr("x","1em")
               .text(function(d) { ;return d.key})
            
            li.selectAll("circle")
               .data(items,function(d) { return d.key})
               .call(function(d) { d.enter().append("circle")})
               .call(function(d) { d.exit().remove()})
               .attr("cy",function(d,i) { return i-0.25+"em"})
               .attr("cx",0)
               .attr("r","0.4em")
               .style("fill",function(d) { console.log(d.value.color);return d.value.color})  **/

         })
      }

      util.color = function(_x) {
         if (!arguments.length) return color;
         color = _x;
         return this;
      }

      util.size = function(_x) {
         if (!arguments.length) return size;
         size = _x;
         return this;
      }

      util.order = function(_x) {
         if (!arguments.length) return order;
         order = _x;
         return this;
      }

      util.position = function(_x) {
         if (!arguments.length) return position;
         position = _x;
         return this;
      }
      return util;
   }
   return module;
})
