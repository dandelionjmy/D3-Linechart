
require.config({
paths: {
    "d3": "../linechart/d3.v3",
    "charts": "../linechart"

    }
});

require([      
    "d3",      
    "charts/chart",
    "charts/tooltip",
    "charts/datamanager_modify",
    "dispatcher"
], function(d3, chart, tooltip, datamanager_modify, dispatcher) {
  
   //position the checkbox according to the width and height of the chart;
   d3.select("#form")
      .style("left", 1000 + 'px')
      .style("top", 25 + 'px');

   // Parse the date / time; 
   var parse_date = d3.time.format("%b %Y").parse;

   // Format date / time for tooltip;
   var format_date = d3.time.format("%d-%b-%y");
   var format_value = d3.format(",.2f");
   var format_currency = function(d) {
      return "$" + format_value(d);   
   }  

   var color_scale = d3.scale.category10();

   //pre-process data; better use data manager;
   test_data.forEach(function(d) {
      d.x = +d.x;
      d.y = +d.y;
   });  

   var path_st = d3.map();
   path_st.set("1", "dashed");

   var main_div = d3.select("#container").append("div").attr("id", "main");
   main_div.append("div").attr("id", "main-canvas")
      .style('width', 1100 + 'px')
      .style('display', 'inline-block');
   main_div.append("div")
      .attr("id", "legend-container")
      .style('left', 1100 + 'px')
      .style('top', 200 + 'px')
      .style('position', 'absolute')
      .style('display', 'inline-block');

   var start = 2;
   var end = 8;
   var filter_metric = "x";
   var threshold = [start, end];

   var chart_datamanager = datamanager_modify()
      .original_dataset(test_data)
      .update_model_fn(update_data_w_selection);

   chart_datamanager.update_model(chart_datamanager);

   function update_data_w_selection(context, original_dataset) {
      var data_restricted = original_dataset.filter(function(d) {
         return d[filter_metric]>=threshold[0] && d[filter_metric]<=threshold[1];      
      });
      context.model_data(data_restricted);
   }  

   //var focus_tooltip = tooltip().height(28).tooltip_id("focus-tooltip").html( function(d) { return "<p>"+ d.x + ", " + d.y + "</p>"; } );
   //var focus_tooltip = d3tip().attr("class","focus-tooltip").direction('s').html( function(d) { return "<p>"+ d.x + ", " + d.y + "</p>"; } );
   var focus_tooltip = tooltip().height(28).tooltip_id("focus-tooltip").html( function(d) { return "<p>"+ d.x + ", " + d.y + "</p>"; } );

   var linechart = chart()
      .width(1000)
      .height(600);

   linechart.x_scale(d3.scale.linear().domain([start, end]))
      .y_scale(d3.scale.linear())
      .path_style(path_st)
      .circle_size(5)
      .custom_hover("custom_hover")
      .focus_on(true);

   d3.select("#main-canvas")
      .datum(chart_datamanager.model_data())
      .call(linechart);  

   var data_nest=d3.nest()
      .key(function(d) { return d.cat_var;})
      .entries(test_data);

   var legend_list = d3.select("#legend-container").selectAll("li")
      .data(data_nest)
      .enter().append("li");

   legend_list.append("span")
      .style("color", function(d) { return color_scale(d.key)})
      .html(function(d) { return d.key})
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

   function update() {
      //update the chart;
      stocks.forEach(function(d) {
         d.date = parse_date(d.date);
         d.price = +d.price;
      });  

      path_st.empty();
      path_st.set("MSFT", "dashed");

      start = parse_date("Jan 2004");
      end = parse_date("Jan 2010");
      threshold = [start, end];
      filter_metric = "date";
      chart_datamanager.original_dataset(stocks);
      chart_datamanager.update_model(chart_datamanager);
      focus_tooltip = tooltip().height(28).tooltip_id("focus-tooltip").html( function(d) { return "<p>"+ format_date(d.date) + ", " + d.price + "</p>"; } );

      linechart.category_var("symbol")
         .x("date")
         .y("price")
         .x_scale(d3.time.scale().domain([start, end]))
         .y_scale(d3.scale.linear().domain([0, 250]))
         .path_style(path_st)
         .stroke_width(2)
         .custom_hover("custom_hover")
         .custom_click("custom_click")
         .chart_tooltip(focus_tooltip);

      d3.select("#main-canvas")
         .datum(chart_datamanager.model_data())
         .transition()
         .ease("linear")
         .call(linechart);
   }

   //setTimeout(update, 4000);
   //update();

   function update_data_2(context, original_dataset) {
      var data_restricted = original_dataset.filter(function(d) {      
         return cat_var.indexOf(d.symbol) > -1 ;
      });
      context.model_data(data_restricted);
   }  
/**
    var cat_var = d3.keys(d3.nest().key(function(d) {return d.cat_var}).map(test_data));
    var path_array = ["dashed", "solid", "dashed", "solid", "solid", "solid"];
    var path_st = cat_var.map(function(obj, i) {
        var robj = {};
        robj[obj] = path_array[i];
        return robj;
    });  **/

   var active_var = d3.keys(d3.nest().key(function(d) {return d.cat_var}).map(test_data));

   dispatcher.dispatch.on("custom_hover", function(d, x_scale, y_scale, category_var, x, y) {      
      d3.select('#path-'+d[category_var]).classed("line--hover", true);   
      d3.select(".focus").attr("transform", "translate(" + x_scale(d[x]) + ", " + y_scale(d[y]) + ")");
   });  

   dispatcher.dispatch.on("click_legend", function(d) {      
      var active = d.active? false : true;
      /**
      new_opacity = active? 0 : 1;
      d3.select("#path-"+d.key.replace(/\s+/g, ''))
         .transition().duration(100)
         .style("opacity",  new_opacity);  **/
      d.active = active;   

      if (active) {
         active_var.splice(active_var.indexOf(d.key), 1);
      }
      else {
         if (active_var.indexOf(d.key)<0) {
         active_var.push(d.key);
         }
      }

      var new_data = chart_datamanager.model_data().filter(function(_d) {
         return active_var.indexOf(String(_d.cat_var)) > -1;
      })   

      d3.select("#main-canvas")
         .datum(new_data)
         .transition()
         .ease("linear")
         .call(linechart);  

        /**
        chart_datamanager.update_model_fn(update_data_2);
        chart_datamanager.update_model(chart_datamanager);
        d3.select("#container")
            .datum(chart_datamanager.model_data())
            .call(linechart);  **/
    });   

});
