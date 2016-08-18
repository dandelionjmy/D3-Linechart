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
      * default is the color of the line chart
      */
      /* **/
      var color;

      /**
      * Variable that stores the size for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var legend_size;

      /**
      * Object that stores the order for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var order;

      /**
      * Object that stores the position for the data legend.
      * @memberof module:legend
      * @inner
      */
      /* **/
      var position;

      function util(_selection) {  
         /**module goes within the module function below var dispatch definition*/
         _selection.each(function() {

            if (!legend_size) {
               legend_size = '12px';
            }

            var items = {},
            //select the chart svg;
            svg = d3.select(".line-group"),
            legendPadding = d3.select(this).attr("data-style-padding") || 5,
            lb = d3.select(this).selectAll(".legend-box").data([true]),
            li = d3.select(this).selectAll(".legend-items").data([true]);

            lb.enter().append("rect").classed("legend-box",true);
            li.enter().append("g").classed("legend-items",true);

            svg.selectAll("[data-legend]").each(function(d) {  
               items[d.key] = {
                  color : d.color
               } 
            });

            //sort by key;
            items = d3.entries(items).sort(function(a,b) { return a.key - b.key; });

            var legend_list = li.selectAll("li")  
               .data(items, function(d){ return d.key;});

            legend_list.enter().append("li")
            .style("color", function(d) { return d.value.color; })
            .style("font-size", "20px")
            .style("padding-bottom", "15px");

            legend_list.append("span")
               .style("color", function(d) { return d.value.color; })
               .style("font-size", legend_size)
               .html(function(d) { return d.key;})
               .on("click", function(d) {
                  if (d3.select("#legend-container").select("#input-"+d.key).property("checked")) {
                     d3.select("#legend-container").select("#input-"+d.key).property("checked", false)
                  }
                  else { 
                     d3.select("#legend-container").select("#input-"+d.key).property("checked", true);
                  }
                  dispatcher.dispatch.click_legend(d);
               });

            legend_list.append("input")
               .attr("type", "checkbox")
               .attr("id", function(d) {return 'input-'+d.key;})
               .style("margin-left", "12px")
               .property("checked", true)
               .on("change", function(d) {
                  dispatcher.dispatch.click_legend(d);
               });  

            legend_list.exit().remove();

         })
      }

      util.color = function(_x) {
         if (!arguments.length) return color;
         color = _x;
         return this;
      }

      util.legend_size = function(_x) {
         if (!arguments.length) return legend_size;
         legend_size = _x;
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
