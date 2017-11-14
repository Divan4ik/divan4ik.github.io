'use strict';

var App = App || {};

(function(g,d){

	var workspace,
			renderer,
			loader;

	function render() {

		loader.on();
		var search = new App.Ux.Search(workspace);
		var tabs = new App.Ux.Tabs(workspace);
		var studentRegion = d.createDocumentFragment(),
				abonementsRegion = d.createDocumentFragment();

		tabs.add('Students', studentRegion);
		tabs.add('Abonements', abonementsRegion);

		var students = new Students(studentRegion);
		var students = new Abonements(abonementsRegion);

		tabs.render();
		setTimeout(() => loader.off(), 500);
	}

	function init() {
		loader = new App.Ux.LoadingScreen( d.body );
		renderer = new App.Core.Renderer();
		workspace = d.querySelector('.wrap');

		render();
	}


	d.addEventListener('DOMContentLoaded', init, false);

}(this, this.document));