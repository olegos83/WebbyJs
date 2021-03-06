/**
 * @file A wrapper for array to manage event driven data.
 * @author Olegos <olegos83@yandex.ru>
 */
WebbyJs.define({
	/**
	 * Data event types.
	 * 
	 * @memberof WebbyJs
	 * @enum {String}
	 */
	Data: {
		ADD: 'add',
	    REMOVE: 'remove',
	    REPLACE: 'replace',
	    CLEAR: 'clear',
	    CHANGE: 'change'
	}
});

/**
 * DataProvider is designed to work with event driven data collections.
 * Events support is provided by extending EventListener prototype.
 * 
 * Any class may be inherited or extend DataProvider to support data events.
 * In that case, EventListener is applied to that class too. Don`t forget to
 * declare 'dp_storage' array in class constructor and you can alias 'dp_storage'
 * with more convinient name, 'points' or 'children' for example:
 * 
 * 		this.children = this.dp_storage = [];
 * 
 * Event support can slow down items iteration, so you can directly use 'dp_storage' array
 * to get more iteration speed, but in that case, events must be processed manually.
 * 
 * @class DataProvider
 * @extends WObject
 * 
 * @memberof WebbyJs
 */
WebbyJs.Class({
	/**
	 * Class name.
	 */
	name: 'DataProvider',
	
	/**
	 * @constructor
	 */
	construct: function DataProvider() {
		/**
		 * Events hash, containing arrays of functions by event type as key.
		 * 
		 * @memberof EventListener
		 * @type {Object}
		 * 
		 * @private
		 */
		this._handlers = {};
		
		/**
		 * Data array.
		 * 
		 * @memberof DataProvider
		 * @type {Array}
		 */
		this.dp_storage = [];
	},
	
	/**
	 * Interfaces.
	 */
	implement: WebbyJs.EventListener,
	
	/**
	 * Prototype.
	 */
	proto: {
		/**
		 * Append new item to the end and trigger Data.ADD event.
		 * 
		 * @method append
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		append: function(item) {
			this.dp_storage.push(item);
			this.processEvent({ item: item, type: wData.ADD });
			
			return this;
		},
		
		/**
		 * Insert new item to specified index position and trigger Data.ADD event.
		 * 
		 * @method appendAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Number} index - index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		appendAt: function(item, index) {
		    this.dp_storage.splice(index, 0, item);
		    this.processEvent({ item: item, index: index, type: wData.ADD });
		    
		    return this;
		},
		
		/**
		 * Remove item from data and trigger Data.REMOVE event.
		 * 
		 * @method remove
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		remove: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) if (data[i] == item) {
				data.splice(i, 1);
				this.processEvent({ item: item, type: wData.REMOVE });
				
				return this;
			}
			
			return this;
		},
		
		/**
		 * Remove item from data at specified index position and trigger Data.REMOVE event.
		 * 
		 * @method removeAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		removeAt: function(index) {
			var evt = { item: this.dp_storage[index], index: index, type: wData.REMOVE };
			
		    this.dp_storage.splice(index, 1);
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Replace item by another item and trigger Data.REPLACE event.
		 * 
		 * @method replace
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Object} newItem - new item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		replace: function(item, newItem) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) if (data[i] == item) {
				data[i] = newItem;
				this.processEvent({ oldItem: item, newItem: newItem, type: wData.REPLACE });
				
				return this;
			}
			
			return this;
		},
		
		/**
		 * Replace item by another item at specified index position and trigger Data.REPLACE event.
		 * 
		 * @method replaceAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * @param {Object} newItem - new item reference.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		replaceAt: function(index, newItem) {
			var evt = { oldItem: this.dp_storage[index], newItem: newItem, index: index, type: wData.REPLACE };
			
		    this.dp_storage[index] = newItem;
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Remove all data and trigger Data.CLEAR event.
		 * 
		 * @method clear
		 * @memberof DataProvider.prototype
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		clear: function() {
			var evt = { data: [].concat(this.dp_storage), type: wData.CLEAR };
			
		    this.dp_storage.length = 0;
		    this.processEvent(evt);
		    
		    return this;
		},
		
		/**
		 * Get item at specified index.
		 * 
		 * @method itemAt
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Number} index - index position.
		 * 
		 * @returns {Object} found item.
		 */
		itemAt: function(index) {
		    return this.dp_storage[index];
		},
		
		/**
		 * Get item index.
		 * 
		 * @method indexOf
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {Number} item index or -1, if item not found.
		 */
		indexOf: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
		    for (i = 0; i < l; i++) {
		    	if (data[i] == item) return i;
		    }
		    
		    return -1;
		},
		
		/**
		 * Check if this data provider contains specified item.
		 * 
		 * @method contains
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * 
		 * @returns {Boolean} true, if item is in data provider or false otherwise.
		 */
		contains: function(item) {
			var data = this.dp_storage, l = data.length, i;
			
		    for (i = 0; i < l; i++) {
		    	if (data[i] == item) return true;
		    }
		    
		    return false;
		},
		
		/**
		 * Change item index position and trigger Data.CHANGE event.
		 * 
		 * @method setItemIndex
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Object} item - item reference.
		 * @param {Number} index - new index position.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		setItemIndex: function(item, index) {
			var data = this.dp_storage, l = data.length, i;
		    
			for (i = 0; i < l; i++) if (data[i] == item) {
				data.splice(i, 1);
			    data.splice(index, 0, item);
			    
			    this.processEvent({ item: item, oldIndex: i, newIndex: index, type: wData.CHANGE });
			    return this;
		    }
			
			return this;
		},
		
		/**
		 * Get number of items in data.
		 * 
		 * @method length
		 * @memberof DataProvider.prototype
		 * 
		 * @returns {Number} number of items.
		 */
		length: function() {
			return this.dp_storage.length;
		},
		
		/**
		 * Iterate items form the begining to the end and invoke
		 * method with 'this' pointing to iterated item.
		 * 
		 * @method forEach
		 * @memberof DataProvider.prototype
		 * 
		 * @param {Function} method - method reference.
		 * @param {Array} args - method arguments.
		 * 
		 * @returns {DataProvider} current instance for chaining.
		 */
		forEach: function(method, args) {
			var data = this.dp_storage, l = data.length, i;
			
			for (i = 0; i < l; i++) {
				method.apply(data[i], args);
			}
			
			return this;
		}
	}
});
