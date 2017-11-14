'use strict';

var App = App || {};
App.Services = App.Services || {};

(function(){

	var id = 1;

	var Abonement = function(args) {
		var baseAbonement = {
			id: id,
			get owner () {
				return App.Services.StudentService.get(this.client_id);
			}
		};
		id++;

		return Object.assign(baseAbonement, args);

	};


	var AbonementService = function() {
		
		var	abonements = [],
				add = (args) => {
					var abonement = new Abonement(args);
					abonements.push(abonement);
					App.Core.EventBus.fire('abonements_update');
				},
				remove = (id) => { 
					var index = abonements.findIndex( 
						abonement => abonement.id === id
					);
					abonements.splice(index, 1);
					App.Core.EventBus.fire('abonements_update');
				},
				get = (id) => abonements.find(
					abonement => abonement.id === id
				),
				getAll = () => abonements;

		App.Core.EventBus.on('abonement_add', add);
		App.Core.EventBus.on('abonement_remove', remove);

		return {
			add: add,
			remove: remove,
			get: get,
			getAll: getAll,
		}
	};

	App.Services.AbonementService = new AbonementService();

}(this, this.document));