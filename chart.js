//do not forget to include dependencies
define([
   "d3",
   "dispatcher"
],
function(d3, dispatcher) {
   /**module goes within the module function below var dispatch definition*/
   function module(){
      /**
      * Variable to access dispatch object defined in dispatcher. This variable does not have an accessor function.
      * @var {d3.dispatch} dispatch
      * @memberof module:chart
      * @inner
      * @default dispatcher.dispatch
      * @private
      */
      /* **/
      var dispatch = dispatcher.dispatch;

      /**
      * Object that stores the margins and variables that stores height and width of the chart area.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var margin = {top: 20, right: 200, bottom: 30, left: 50},
         width = 960 - margin.left - margin.right,
         height = 500 - margin.top - margin.bottom;

      /**
      * String that sets the ease method;
      * @memberof module:chart
      * @inner
      */
      /* **/
      var ease = "bounce";

      /**
      * Object that stores the chart area
      * @memberof module:chart
      * @inner
      */
      /* **/
      var svg;

      /**
      * Object that stores the x and y scale of the chart.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var x_scale = d3.time.scale();
      var y_scale = d3.scale.linear();

      /**
      * Object that stores the x and y axis of the chart.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var x_axis;
      var y_axis;

      /**
      * String that sets the category variable of the data, the x-axis variable and y-axis variable.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var category_var;
      var x;
      var y;

      /**
      * Object that stores the color scale for different categories.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var color_scale = d3.scale.category10();

      /**
      * Object that stores the path style(solid line or dashed line) for different categories.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var path_style;
      /**
      * Variable that stores the stroke width of the lines.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var stroke_width;
      /**
      * Variable that stores the radius of the circle.
      * @memberof module:chart
      * @inner
      */
      /* **/
      var circle_size;

      /**
      * {@link module:tooltip Tooltip} object for chart. Set/get this variable by using the accessor method, {@link module:chart.chart_tooltip chart_tooltip}.
      * @memberof module:chart
      * @inner
      * @var {module:tooltip} chart_tooltip
      */
      /* **/
      var chart_tooltip;

      var focus_on = true;

      /**
      * String that is the name of the dispatch event associated with row mouseoverSet/get this variable by using the accessor method, {@link module:chart.custom_hover  custom_hover}.
      * @memberof module:chart
      * @inner
      * @var {string} custom_hover
      */
      /* **/
      var custom_hover;
      var custom_click;
   
      /**main internal module functionality*/
      /** 
      * @description This module helps generate multi-line charts.
      * @author miji
      * @module chart
      * @requires d3
      * @requires dispatcher
      * */
      /* **/
      function exports(_selection) {
         _selection.each(function(_data) {   
            //if user does not specify input variables;
            if (!category_var) {
               category_var = "cat_var";
            }

            if (!x) {
               x = "x";
            }

            if (!y) {
               y = "y";
            }

            //if user does not specify domain of x scale;
            if (x_scale.domain().length == 2 && (x_scale.domain()[1] - x_scale.domain()[0] == 1)) {   
               x_scale.domain(d3.extent(_data, function(d) { return d[x];}));
            }
            
            x_scale.range([0, width]);

            // if user does not specify domain of y scale;
            if (y_scale.domain()[0] == 0 && y_scale.domain()[1] == 1) {
               y_scale.domain([0, d3.max(_data, function(d) { return d[y];})]);
            }

            y_scale.range([height, 0]);

            // set up axis;
            x_axis = d3.svg.axis()
                  .scale(x_scale)
                  .orient("bottom");

            y_axis = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left");

            svg = d3.select(this)
               .selectAll(".chart")   
               .data([_data]);
               
            var container = svg.enter()   
               .append("svg")
               .classed("chart", true)
               .append("g")
               .classed("container-group", true);

            container.append("g").classed("area", true).append("svg").attr({width: width, height: height}).classed("line-group", true);
            container.append("g").classed("x axis", true);
            container.append("g").classed("y axis", true);
            //container.append("g").classed("label-group", true);  

            var voronoi_group = svg.selectAll(".voronoi").data([0]);

            voronoi_group.enter()
               .append("g").classed("voronoi", true)
               .attr("fill", "none")
               .attr("pointer-events", "all");

            svg.transition().attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom});
            svg.select(".container-group")
               .attr({transform: "translate("+ margin.left + ", " + margin.top + ")"});      

            var x_axis_label = svg.select(".x.axis")
                  .selectAll("text")
                  .data([x]);

            x_axis_label.enter()
                  .append("text")
                  .classed("x label", true)
                  .text(x);
               
            x_axis_label.transition()
                  .text(x)
                  .attr("x", width)
                  .attr("dy", "2.5em")
                  .style("text-anchor", "end");  

            svg.select(".x.axis")
               .transition()
               .ease(ease)
               .attr({transform: "translate(0, " + height + ")"})
               .call(x_axis);

            var y_axis_label = svg.select(".y.axis")
               .selectAll("text")
               .data([y]);

            y_axis_label.enter()
               .append("text")
               .classed("y label", true)
               .text(y);

            y_axis_label.transition()
               .text(y)
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "end");

            svg.select(".y.axis")
               .transition()
               .ease(ease)
               .call(y_axis);

            var data_nest=d3.nest()
               .key(function(d) { return d[category_var];})
               .entries(_data);

            var line = d3.svg.line()
               .x(function(d) { return x_scale(d[x]); })
               .y(function(d) { return y_scale(d[y]); });  
            
            var voronoi = d3.geom.voronoi()
               .x(function(d) {return x_scale(d[x]) + margin.left; })
               .y(function(d) {return y_scale(d[y]) + margin.top; })
               .clipExtent([[margin.left, margin.top], [width + margin.left, height + margin.top]]);

            var label_space = height / data_nest.length;

            var lines = svg.select(".container-group")
                  .select(".line-group")
                  .selectAll(".line")
                  .data(data_nest);

            lines.enter().append("path")
               .classed("line", true)
               .attr("id", function(d) { return 'path-'+d.key.replace(/\s+/g, ''); })
               .style("stroke", function(d) {
                  return d.color = color_scale(d.key); })
               .style("stroke-width", function() { return typeof stroke_with == "undefined" ? 2 : stroke_width })
               .attr("d", function(d) { return line(d.values);})
               .attr("data-legend", function(d) { return d.key; })
               .style("stroke-dasharray", function(d, i) {
                  if (path_style.has(d.key) && path_style.get(d.key) == "dashed") {
                        return ("3, 3");
                  }
                  else {return ("3, 0"); 
               }});

            lines.transition().ease(ease)
               .attr("id", function(d) { return 'path-'+d.key.replace(/\s+/g, ''); })
               .style("stroke", function(d) {
                  return d.color = color_scale(d.key); })
               .style("stroke-width", function() { return typeof stroke_with == "undefined" ? 2 : stroke_width })
               .attr("d", function(d) { return line(d.values);})
               .attr("data-legend", function(d) { return d.key})
               .style("stroke-dasharray", function(d, i) {
                  if (path_style.has(d.key) && path_style.get(d.key) == "dashed") {
                        return ("3, 3");
                  }
                  else {return ("3, 0"); 
               }});

            //lines.exit().transition().style({opacity: 0}).remove();
            lines.exit().remove();

            var voronoi_lines = voronoi_group.selectAll(".voronoi-line")
                  .data(voronoi(_data))
                  .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
                  .datum(function(d) { return d.point; });

            voronoi_lines.enter()
               .append("path")
               .classed("voronoi-line", true)   
               .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
               .datum(function(d) { return d.point; });

            voronoi_lines.exit().transition().style({opacity: 0}).remove();  

            d3.select("#show-voronoi")
               .property("disabled", false)
               .on("change", function() { voronoi_group.classed("voronoi--show", this.checked); });

            var focus = container.append("g")
               .attr("transform", "translate(-100,-100)")   
               .classed("focus", true);

            focus.append("circle")
               .attr("r", function() {return typeof circle_size == undefined ? 3 : circle_size});

            voronoi_lines.on("mouseout", function(d) {
               d3.select(".focus").attr("transform", "translate(-100, -100)");      
               d3.select('#path-'+d[category_var]).classed("line--hover", false);   
            });      

            if (custom_hover) {
               voronoi_lines.on("mouseover", function(d) {
                  if (focus_on == true) {      
                        dispatch[custom_hover](d, x_scale, y_scale, category_var, x, y);
                  }
               });
            }  

            if (typeof chart_tooltip == "undefined" && focus_on == true) {
               focus.append("text").attr("y", -10);   
               voronoi_lines.on("mousemove", function(d) {      
                  focus.attr("transform", "translate(" + x_scale(d[x]) + ", " + y_scale(d[y]) + ")");
                  focus.select("text").text(d[x] + ',' + d[y]);   
               })
                  
            }   
            
            //attach tooltip to chart;
            if ( typeof chart_tooltip !== "undefined" && focus_on == true) {
               d3.select(".focus").select("text").remove();
               voronoi_lines.call(chart_tooltip);
            }
         });  
      };

      /** getter/setter functions*/
      /** @function module:chart.margin 
      * @param {Array<string>} [_x] - Sets value of {@link module:chart~margin margin} to _x. If parameter missing then returns current value of {@link module:chart~margin margin}.
      * @description Setter/getter function for {@link module:chart~margin margin}.
      * @example 
      * var example_chart = chart();
      * example_table.columns(["col_a", "col_b"]);
      * <caption>Assume that the table module is referenced as table in the main.js file.</caption>
      * //returns ["col_a", "col_b"]
      * example_table.columns();
      * */ 
      /* **/
      exports.margin = function(_x) {
         if (!arguments.length) return margin;
         margin = _x;
         return this;
      };

      exports.width = function(_x) {
         if (!arguments.length) return width;
         width = parseInt(_x);
         return this;
      };

      exports.height = function(_x) {
         if (!arguments.length) return height;
         height = parseInt(_x);
         return this;
      };
      
      exports.custom_hover = function(_x) {
         if (!arguments.length) return custom_hover;
         custom_hover = _x;
         return this;
      };

      exports.x_scale = function(_x) {
         if (!arguments.length) return x_scale;
         x_scale = _x;
         return this;
      };

      exports.y_scale = function(_x) {
         if (!arguments.length) return y_scale;
         y_scale = _x;
         return this;
      };

      exports.x_axis = function(_x) {
         if (!arguments.length) return x_axis;
         x_axis = _x;
         x_scale = x_axis.scale();
         return this;
      };

      exports.y_axis = function(_x) {
         if (!arguments.length) return y_axis;
         y_axis = _x;
         y_scale = y_axis.scale();
         return this;
      };

      exports.category_var = function(_x) {
         if (!arguments.length) return category_var;
         category_var = _x;
         return this;
      };

      exports.x = function(_x) {
         if (!arguments.length) return x;
         x = _x;
         return this;
      };

      exports.y = function(_x) {
         if (!arguments.length) return y;
         y = _x;
         return this;
      };

      exports.color_scale = function(_x) {
         if (!arguments.length) return color_scale;
         color_scale = _x;
         return this;
      };

      exports.path_style = function(_x) {
         if (!arguments.length) return path_style;
         path_style = _x;
         return this;
      };  

      exports.stroke_width = function(_x) {
         if (!arguments.length) return stroke_width;
         stroke_width = _x;
         return this;
      };  

      exports.circle_size = function(_x) {
         if (!arguments.length) return circle_size;
         circle_size = _x;
         return this;
      };  

      exports.chart_tooltip = function(_x) {
         if (!arguments.length) return chart_tooltip;
         chart_tooltip = _x;
         return this;
      };

      exports.focus_on = function(_x) {
         if (!arguments.length) return focus_on;
         focus_on = _x;
         return this;
      };

      exports.custom_hover = function(_x) {
         if (!arguments.length) return custom_hover;
         custom_hover = _x;
         return this;
      };

      exports.custom_click = function(_x) {
         if (!arguments.length) return custom_click;
         custom_click = _x;
         return this;
      };

      exports.ease = function(_x) {
         if (!arguments.length) return ease;
         ease = _x;
         return this;
      };

      return exports;
   }
/*end module **/
   return module;
});

