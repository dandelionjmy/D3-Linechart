//do not forget to include dependencies
define([
   "d3"
],
function(d3){
   return {dispatch: d3.dispatch("custom_hover", "custom_click", "custom_mouseout", "click_legend")};
});
