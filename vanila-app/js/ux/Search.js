'use sctrict';

var App = App || {};
App.Ux = App.Ux || {};

(function(g, d) {

	var studentService,
			renderer,
			searchBox,
			searchWrap,
			searchResults,
			searchResultTpl= d.querySelector('#searchResultTpl');

	var Search = function(node) {
		
		var wrapperTpl = d.querySelector('#SearchModule');

		function render() {
			node.appendChild(renderer.render(wrapperTpl));
			searchResults = d.querySelector('.search-results');
			searchBox = d.querySelector('#search-box');
			searchWrap = d.querySelector('.search');
			bindEvents();
		}

		function renderResults(students) {
			var fragment = d.createDocumentFragment();
			students.map(function(student){
				 students.forEach(function(student){
          fragment.appendChild( renderer.render(searchResultTpl, student) )
        });
			})
			searchResults.appendChild(fragment);
		}

		function bindEvents() {
			searchBox.addEventListener('focus', function(event) {
					searchResults.classList.add('in');
			});
			searchBox.addEventListener('blur', function(event) {
					searchResults.classList.remove('in');
			});
			searchBox.addEventListener('keyup', function(event) {
				if(event.target.value.length < 3) return;
				
				var students = studentService.search(event.target.value);
				if(!students.length) return;
				renderResults(students);
			});
		}

		function init() {
			studentService = App.Services.StudentService;
			renderer = new App.Core.Renderer();

			render();
		}

		init();
	}

	App.Ux.Search = Search;
	
})(this, this.document)