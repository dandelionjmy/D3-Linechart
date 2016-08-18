define([
   "d3"
],
function(d3) {
   /**tooltip*/
   function module() {
      //various internal, private variables of the module.
      /**
       * Object whose x and y properties determine the offset of the tooltip from the mouse pointer in px. Set/get this variable by using the accessor method, {@link module:tooltip.offset offset}.
       * @memberof module:tooltip
       * @inner
       * @var {Object} offset
       */
      /* **/
      var offset = {x: 5, y: -40};
      /**
       * Number, n, in the form of an integer. This determines the width (as n + "px") of the tooltip div. Set/get this variable by using the accessor method, {@link module:tooltip.width  width}.
       * @memberof module:tooltip
       * @inner
       * @var {number} width
       */
      /* **/
      var width;
      /**
       * Number, n, in the form of an integer. This determines the height (as n + "px") of the tooltip div. Set/get this variable by using the accessor method, {@link module:tooltip.height  height}.
       * @memberof module:tooltip
       * @inner
       * @var {number} height
       */
      /* **/
      var height;
      /**
       * Number, n, in the form of an integer. This determines the padding (as n + "px") within the tooltip div. Set/get this variable by using the accessor method, {@link module:tooltip.padding  padding}.
       * @memberof module:tooltip
       * @inner
       * @var {number} padding
       */
      /* **/
      var padding;
      /**
       * Boolean that determines if a tooltip div is fixed. Set/get this variable by using the accessor method, {@link module:tooltip.fixed_position  fixed_position}.
       * @memberof module:tooltip
       * @inner
       * @var {boolean} fixed_position
       */
      /* **/
      var fixed_position;
      /**
       * Number that determines the maximum opacity of the tooltip div. Set/get this variable by using the accessor method, {@link module:tooltip.opacity  opacity}.
       * @memberof module:tooltip
       * @inner
       * @var {number} opacity
       * @default 0.9
       */
      /* **/
      var opacity = 0.9;
      /**
       * Number that determines the time(in ms) it takes for the tooltip div to fade in. Set/get this variable by using the accessor method, {@link module:tooltip.fade_in  fade_in}.
       * @memberof module:tooltip
       * @inner
       * @var {number} fade_in
       * @default 250
       */
      /* **/
      var fade_in = 250;
      /**
       * Number that determines the time(in ms) it takes for the tooltip div to fade out. Set/get this variable by using the accessor method, {@link module:tooltip.fade_out  fade_out}.
       * @memberof module:tooltip
       * @inner
       * @var {number} fade_out
       * @default 250
       */
      /* **/
      var fade_out = 250;
      /**
       * String that is the HTML class of this instance of the tooltip. Set/get this variable by using the accessor method, {@link module:tooltip.tooltip_class tooltip_class}.
       * @memberof module:tooltip
       * @inner
       * @var {string} tooltip_class
       */
      /* **/
      var tooltip_class = "tooltip";
      /**
       * String that is the HTML id of this instance of the tooltip. Set/get this variable by using the accessor method, {@link module:tooltip.tooltip_id tooltip_id}.
       * @memberof module:tooltip
       * @inner
       * @var {string} tooltip_id
       */
      /* **/
      var tooltip_id;
      /**
       * String that is exactly HTML that goes within the tooltip div. Set/get this variable by using the accessor method, {@link module:tooltip.html html}.
       * @memberof module:tooltip
       * @inner
       * @var {string} html
       */
      /* **/
      var html;
      /**
       * A d3 selection of the tooltip div. This variable does not have an accessor function.
       * @memberof module:tooltip
       * @inner
       * @var {Object.<d3.selection>} html
       */
      /* **/
      var tooltip_container;

      /**main internal module functionality*/
      /** 
       * tooltip
       * @description This module creates tooltip objects that can be attached to d3 charts.
       * @author vjob
       * @module tooltip
       * @requires d3
       * */
      /* **/
      function util(_selection) {
         _selection.each(function(_data) {
            d3.select(this)
               .datum(_data)
               .on("mouseover.tooltip." + tooltip_id, function(d) {
                  show(d);
               })
               .on("mousemove.tooltip." + tooltip_id, function(d) {
                  if (!fixed_position) {
                     move(d);
                  }
               })
               .on("mouseout.tooltip." + tooltip_id, function() { 
                  hide(); 
               });

            //create tooltip chart
            var show = function(data) {
               //remove any existing tooltip divs
               d3.selectAll("#" + tooltip_id).remove();

               //create tooltip container div
               if (!fixed_position) {
                  d3.select("body")
                     .append("div")
                     .attr("class", tooltip_class)
                     .attr("id", tooltip_id)
                     .style({width : width + "px", height : height + "px", padding : padding + "px"})
                     .style("position", "absolute")
                     .style("opacity", 0);

                  tooltip_container = d3.select("#" + tooltip_id);

                  tooltip_container
                     .html(html(data))
                     .style("left",(d3.event.pageX + offset.x)+"px")
                     .style("top",(d3.event.pageY + offset.y)+"px");
               } else {
                  d3.select(fixed_position)
                     .append("div")
                     .attr("class", tooltip_class)
                     .attr("id", tooltip_id)
                     .style({width : width + "px", height : height + "px", padding : padding + "px"})
                     .style("position", "absolute")
                     .style("opacity", 0);

                  tooltip_container = d3.select("#" + tooltip_id);

                  tooltip_container
                     .html(html(data));
               }


               tooltip_container.transition()
                  .duration(fade_in)
                  .style("opacity", opacity);
            };

            //move tooltip
            var move = function() {
               //fade out and remove tooltip div
               tooltip_container
                  .style("left",(d3.event.pageX + offset.x)+"px")
                  .style("top",(d3.event.pageY + offset.y)+"px");
            };

            //hide tooltip
            var hide = function() {
               //fade out tooltip div
               tooltip_container
                  .transition()
                  .duration(fade_out)
                  .style("opacity", 0);
            };
         });
      }
      /* **/

      /** getter/setter functions*/
      /** @function module:tooltip.offset
       * @param {Object} [_x] - Sets {@link module:tooltip~offset offset} to _x. If parameter missing then returns current value of {@link module:tooltip~offset offset}.
       * @description Setter/getter function for {@link module:tooltip~offset offset}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * example_tooltip.offset({x: 10, y: 10});
       *
       * //returns {x: 10, y: 10}
       * example_tooltip.offset();
       * */ 
      /* **/
      util.offset = function(_x) {
         if (!arguments.length) return offset;
         offset = _x;
         return this;
      };

      /** @function module:tooltip.offset.x
       * @param {number} [_x] - Sets x property of {@link module:tooltip~offset offset} to _x. If parameter missing then returns current value of x property of {@link module:tooltip~offset offset}.
       * @description Setter/getter function for {@link module:tooltip~offset offset}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets offset.x of tooltip div to 10px
       * example_tooltip.offset.x(10);
       *
       * //returns 10
       * example_tooltip.offset.x();
       * */ 
      /* **/
      util.offset.x = function(_x) {
         if (!arguments.length) return offset.x;
         offset.x = _x;
         return this;
      };

      /** @function module:tooltip.offset.y
       * @param {number} [_x] - Sets y property of {@link module:tooltip~offset offset} to _x. If parameter missing then returns current value of y property of {@link module:tooltip~offset offset}.
       * @description Setter/getter function for {@link module:tooltip~offset offset}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets offset.y of tooltip div to 10px
       * example_tooltip.offset.y(10);
       *
       * //returns 10
       * example_tooltip.offset.y();
       * */ 
      /* **/
      util.offset.y = function(_x) {
         if (!arguments.length) return offset.y;
         offset.y = _x;
         return this;
      };

      /** @function module:tooltip.width
       * @param {number} [_x] - Sets value of {@link module:tooltip~width width} to _x. If parameter missing then returns current value of {@link module:tooltip~width width}.
       * @description Setter/getter function for {@link module:tooltip~width width}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets width of tooltip div to 10px
       * example_tooltip.width(10);
       *
       * //returns 10
       * example_tooltip.width();
       * */ 
      /* **/
      util.width = function(_x) {
         if (!arguments.length) return width;
         width = parseInt(_x);
         return this;
      };

      /** @function module:tooltip.height
       * @param {number} [_x] - Sets value of {@link module:tooltip~height height} to _x. If parameter missing then returns current value of {@link module:tooltip~height height}.
       * @description Setter/getter function for {@link module:tooltip~height height}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets height of tooltip div to 10px
       * example_tooltip.height(10);
       *
       * //returns 10
       * example_tooltip.height();
       * */ 
      /* **/
      util.height = function(_x) {
         if (!arguments.length) return height;
         height = parseInt(_x);
         return this;
      };
      
      /** @function module:tooltip.padding
       * @param {number} [_x] - Sets value of {@link module:tooltip~padding padding} to _x. If parameter missing then returns current value of {@link module:tooltip~padding padding}.
       * @description Setter/getter function for {@link module:tooltip~padding padding}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets tooltip div padding to 5px
       * example_tooltip.padding(5);
       *
       * //returns 5
       * example_tooltip.padding();
       * */ 
      /* **/
      util.padding = function(_x) {
         if (!arguments.length) return padding;
         padding = parseInt(_x);
         return this;
      };
      
      /** @function module:tooltip.fixed_position
       * @param {boolean} [_x] - Sets value of {@link module:tooltip~fixed_position fixed_position} to _x. If parameter missing then returns current value of {@link module:tooltip~fixed_position fixed_position}.
       * @description Setter/getter function for {@link module:tooltip~fixed_position fixed_position}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * example_tooltip.fixed_position(true);
       *
       * //returns true
       * example_tooltip.fixed_position();
       * */ 
      /* **/
      util.fixed_position = function(_x) {
         if (!arguments.length) return fixed_position;
         fixed_position = _x;
         return this;
      };
      
      /** @function module:tooltip.opacity
       * @param {number} [_x] - Sets value of {@link module:tooltip~opacity opacity} to _x. If parameter missing then returns current value of {@link module:tooltip~opacity opacity}.
       * @description Setter/getter function for {@link module:tooltip~opacity opacity}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets opacity of tooltip div to 0.5
       * example_tooltip.opacity(0.5);
       *
       * //returns 0.5
       * example_tooltip.opacity();
       * */ 
      /* **/
      util.opacity = function(_x) {
         if (!arguments.length) return opacity;
         opacity = _x;
         return this;
      };

      /** @function module:tooltip.fade_in
       * @param {number} [_x] - Sets value of {@link module:tooltip~fade_in fade_in} to _x. If parameter missing then returns current value of {@link module:tooltip~fade_in fade_in}.
       * @description Setter/getter function for {@link module:tooltip~fade_in fade_in}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets fade in time to 1000ms
       * example_tooltip.fade_in(1000);
       *
       * //returns 1000
       * example_tooltip.fade_in();
       * */ 
      /* **/
      util.fade_in = function(_x) {
         if (!arguments.length) return fade_in;
         fade_in = parseInt(_x);
         return this;
      };
      
      /** @function module:tooltip.fade_out
       * @param {number} [_x] - Sets value of {@link module:tooltip~fade_out fade_out} to _x. If parameter missing then returns current value of {@link module:tooltip~fade_out fade_out}.
       * @description Setter/getter function for {@link module:tooltip~fade_out fade_out}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * //sets fade in time to 1000ms
       * example_tooltip.fade_out(1000);
       *
       * //returns 1000
       * example_tooltip.fade_out();
       * */ 
      /* **/
      util.fade_out = function(_x) {
         if (!arguments.length) return fade_out;
         fade_out = parseInt(_x);
         return this;
      };
      
      /** @function module:tooltip.tooltip_class
       * @param {string} [_x] - Sets value of {@link module:tooltip~tooltip_class tooltip_class} to _x. If parameter missing then returns current value of {@link module:tooltip~tooltip_class tooltip_class}.
       * @description Setter/getter function for {@link module:tooltip~tooltip_class tooltip_class}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * example_tooltip.tooltip_class("example_tooltip");
       *
       * //returns "example_tooltip"
       * example_tooltip.tooltip_class();
       * */ 
      /* **/
      util.tooltip_class = function(_x) {
         if (!arguments.length) return tooltip_class;
         tooltip_class = _x;
         return this;
      };
      
      /** @function module:tooltip.tooltip_id
       * @param {string} [_x] - Sets value of {@link module:tooltip~tooltip_id tooltip_id} to _x. If parameter missing then returns current value of {@link module:tooltip~tooltip_id tooltip_id}.
       * @description Setter/getter function for {@link module:tooltip~tooltip_id tooltip_id}.
       * @example 
       * <caption>Assume that the tooltip module is referenced as tooltip in the main.js file.</caption>
       * var example_tooltip = tooltip();
       * example_tooltip.tooltip_id("example_tooltip");
       *
       * //returns "example_tooltip"
       * example_tooltip.tooltip_id();
       * */ 
      /* **/
      util.tooltip_id = function(_x) {
         if (!arguments.length) return tooltip_id;
         tooltip_id = _x;
         return this;
      };
      
      util.html = function(_x) {
         if (!arguments.length) return html;
         html = _x;
         return this;
      };
      
      /* **/
      return util;
   }
   /*tooltip **/
   return module;
});
