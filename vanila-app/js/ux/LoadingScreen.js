'use sctrict';

var App = App || {};
App.Ux = App.Ux || {};

(function(g, d) {


	var LoadingScreen = function(node) {
		
		var loadingScreenTag;

		function addloadingScreen() {

			if(!node)
				throw new Error('Node not specified');
			
			node.style.position = 'relative';

			loadingScreenTag = d.createElement('div');
			var inner = loadingScreenTag.cloneNode();

			loadingScreenTag.className ='dimmer fade';
			inner.className = 'inner';
			inner.innerText = 'Loading...';
			loadingScreenTag.appendChild(inner);
			node.appendChild(loadingScreenTag);
		}

		function _on() {
			if(loadingScreenTag.classList.contains('in'))
				return false;
			loadingScreenTag.classList.add('in');
		}

		function toggle() {
			loadingScreenTag.classList.toggle('in');
		}

		function _off() {
			loadingScreenTag.classList.remove('in')
		}

		addloadingScreen();

		return {
			on: _on,
			off: _off
		}
	}

	App.Ux.LoadingScreen = LoadingScreen;
	
})(this, this.document)