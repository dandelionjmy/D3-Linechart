//do not forget to include dependencies
define([
   "d3"
],
function(d3) {
   /** 
    * Data Manager
    * @module datamanager
    * @description This module processes and serves up data for a visualization. This module needs some updates to allow it to be applied in a more general setting.
    * @author isheu
    * @requires d3
    * @requires dispatcher
    * */    
   /* **/
   
   function module() {
      /**
       * Object that stores the processed data. Set/get this variable by using the accessor method, {@link module:datamanager.processed_data processed_data}.
       * @memberof module:datamanager
       * @inner
       * @var {Object} processed_data
       */
      /* **/
      var processed_data = {};
      /**
       * Object that stores the model's data. Set/get this variable by using the accessor method, {@link module:datamanager.model_data model_data}.
       * @memberof module:datamanager
       * @inner
       * @var {Object} model_data
       */
      /* **/
      var model_data;
      /**
       * Object that stores the links dataset. Set/get this variable by using the accessor method, {@link module:datamanager.links_dataset links_dataset}.
       * @memberof module:datamanager
       * @inner
       * @var {Object} links_dataset
       */
      /* **/
      var links_dataset;
      /**
       * Object that stores the nodes dataset. Set/get this variable by using the accessor method, {@link module:datamanager.nodes_dataset nodes_dataset}.
       * @memberof module:datamanager
       * @inner
       * @var {Object} nodes_dataset
       */
      /* **/
      var nodes_dataset;
      /**
       * Function that defines how the datamanager must update the data. Set/get this variable by using the accessor method, {@link module:datamanager.update_model_fn update_model_fn}.
       * @memberof module:datamanager
       * @inner
       * @var {function} update_model_fn
       */
      /* **/
      var update_model_fn; 
      var data_manager = {};
      var dispatcher = d3.dispatch('data_ready', 'data_loading')
      d3.rebind(data_manager, dispatcher, 'on');

      data_manager.load_csv = function(_file, _cleaningFunc) {
         var data_loader = d3.csv(_file);
         data_loader.on('progress', function() { dispatcher.data_loading(d3.event.loaded); });

         data_loader.get(function(_err, _response) {
            _response.forEach(function(d) { _cleaningFunc(d); });
            processed_data = _response;
            dispatcher.data_ready(_response);
         });
      }
      data_manager.load_json = function(_file, _cleaningFunc) {
         var data_loader = d3.json(_file);
         data_loader.on('progress', function() { dispatcher.data_loading(d3.event.loaded); });

         data_loader.get(function(_err, _response) {
            _response.forEach(function(d) { _cleaningFunc(d); });
            processed_data = _response;
            dispatcher.data_ready(_response);
         });
      }
      data_manager.load_geojson = function(_file, _callback) {
         d3.json(_file, function(_err, _data) {
            _callback(_data);
         });
      }

      /** Getter/setter methods for accessing properties of datamanager*/
      /** @function module:datamanager.links_dataset
       * @param {Object} [_links_dataset] - Sets {@link module:datamanager~links_dataset links_dataset} to _links_dataset If parameter missing then returns current value of {@link module:datamanager~links_dataset links_dataset}.
       * @description Setter/getter function for {@link module:datamanager~links_dataset links_dataset}.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * example_datamanager.links_dataset({{source: "a", target: "b"}});
       *
       * //returns {source: "a", target: "b"}
       * example_datamanager.links_dataset();
       * */ 
      /* **/
      data_manager.links_dataset = function(_links_dataset) {
         if (!arguments.length) { return links_dataset; }
         else { links_dataset = _links_dataset; }
         return this;
      }
      /** @function module:datamanager.nodes_dataset
       * @param {Object} [_nodes_dataset] - Sets {@link module:datamanager~nodes_dataset nodes_dataset} to _nodes_dataset If parameter missing then returns current value of {@link module:datamanager~nodes_dataset nodes_dataset}.
       * @description Setter/getter function for {@link module:datamanager~nodes_dataset nodes_dataset}.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * example_datamanager.nodes_dataset({{provider: "a", ...}, {provider:"b", ...}});
       *
       * //returns {{provider: "a", ...}, {provider:"b", ...}}
       * example_datamanager.nodes_dataset();
       * */ 
      /* **/
      data_manager.nodes_dataset = function(_nodes_dataset) {
         if (!arguments.length) { return nodes_dataset; }
         else { nodes_dataset = _nodes_dataset; }
         return this;
      }
      /** @function module:datamanager.get_cleaned_dataset
       * @returns {@link module:datamanager~processed_data processed_data}.
       * @description Getter function for {@link module:datamanager~processed_data processed_data}.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * ...
       * //returns processed_data
       * example_datamanager.get_cleaned_dataset();
       * */ 
      /* **/
      data_manager.get_cleaned_data = function() { 
         return processed_data; 
      };
      /** @function module:datamanager.update_model_fn
       * @param {Object} [_update_model_fn] - Sets {@link module:datamanager~update_model_fn update_model_fn} to _update_model_fn If parameter missing then returns current value of {@link module:datamanager~update_model_fn update_model_fn}.
       * @description Setter/getter function for {@link module:datamanager~update_model_fn update_model_fn}.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * example_datamanager.update_model_fn(some_function);
       *
       * //returns some_function
       * example_datamanager.update_model_fn();
       * */ 
      /* **/
      data_manager.update_model_fn = function(_update_model_fn) {
         if (!arguments.length) { return update_model_fn; }
         else { update_model_fn = _update_model_fn; }
         return this;
      }
      /** @function module:datamanager.update_model
       * @description Applies {@link module:datamanager~update_model_fn update_model_fn} using the {@link module:datamanager~links_dataset links_dataset} and {@link module:datamanager~nodes_dataset nodes_dataset}.
       * @param {module:datamanager} context - An instance of a {@link module:datamanager datamanager} module. This is the instance upon which the update function is called.
       * @param {Object} selected_node - A node object (single row of the nodes_dataset).
       * @param {number} threshold - A number using which {@link module:datamanager~update_link_fn update_link_fn} updates the data.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * ...
       * //updates data by calling update_model_fn(example_datamanager, node_1, 5000, links_dataset, nodes_dataset)
       * example_datamanager.update_model(example_datamanager, node_1, 5000);
       * */ 
      /* **/
      data_manager.update_model = function(context, selected_node, threshold) {
         update_model_fn(context, selected_node, threshold, links_dataset, nodes_dataset);
         return this;
      }
      /** @function module:datamanager.model_data
       * @param {Object} [_model_data] - Sets {@link module:datamanager~model_data model_data} to _model_data If parameter missing then returns current value of {@link module:datamanager~model_data model_data}.
       * @description Setter/getter function for {@link module:datamanager~model_data model_data}.
       * @example 
       * <caption>Assume that the datamanager module is referenced as datamanager in the main.js file.</caption>
       * var example_datamanager = datamanager();
       * example_datamanager.model_data(some_data);
       *
       * //returns some_data
       * example_datamanager.model_data();
       * */ 
      /* **/
      data_manager.model_data = function(_model_data) {
         if (!arguments.length) { return model_data; }
         else { model_data = _model_data; }
         return this;
      }
      /* **/
      return data_manager;
   }
   return module;
});
