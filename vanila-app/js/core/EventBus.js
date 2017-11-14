'use strict';

var App = App || {};
App.Core = App.Core || {};

(function(){

	var EventBus = function() {
		
		var events = {};

		function on(eventName, fn) {
			events[eventName] = events[eventName] || [];
			events[eventName].push(fn);
		}

		function off(eventName, fn) {
			if (!events[EventName]) return;

			var queue = events[EventName];
			
			for (var i = queue.length - 1; i >= 0; i--) {
				if( queue[i] === fn ) {
					events[eventName].splice(i, 1);
					break;
				}
			}
			
		}

		function fire(eventName, data) {
			if(!events[eventName]) return;
			events[eventName].map(function(fn){
				fn(data);
			});
		}

		return {
			on: on,
			off: off,
			fire: fire
		}

	};
	
	App.Core.EventBus = new EventBus();
	
})(this, this.document);