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
'use sctrict';

var App = App || {};
App.Core = App.Core || {};

(function(g, d) {


	var Renderer = function(template) {
		
		function getHtmlfromString(html, data) {

			var template = document.createElement('template');
			
			if(typeof data == 'object') {

				html = html.replace(/\{\{([\w\.\_]+)\}\}/gi, function(string, shortcode) {

					// shortcode is string;
					if( !/\./.test(shortcode) ) return data[shortcode];

					// shortcode is object;
					return shortcode.split('.').reduce(function(value, property){
					  return value[property] || value;
					 }, data);
          
        });
			}
	    template.innerHTML = html;
	    return cleanTextNodes(template);
		}

		function cleanTextNodes(template) {
			return [].filter.call(template.content.childNodes,
				(node) => node.nodeType === Element.ELEMENT_NODE 
			)[0];
		}

		function render(html, data) {
			
			if(typeof html === 'string') {
				return getHtmlfromString(html, data);
			} else if(html.nodeType === Element.ELEMENT_NODE) {
				if(typeof data === 'object') {
	        return getHtmlfromString(html.innerHTML, data);
				}
				return d.importNode(html.content, true)
			}
		}

		function clear(node) {
			if(!node)
				return;
			while (node.firstChild) {
	    	node.removeChild(node.firstChild);
			}
		}

		return {
			render: render,
			clear: clear
		}
	}

	App.Core.Renderer = Renderer;
	
})(this, this.document)
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
'use strict';

var App = App || {};
App.Services = App.Services || {};


(function(){

	var id = 1;

	var Student = function(args) {

		var student = {
			id: id,
			get fullName () {
				return this.name + ' ' + this.lastname;
			},
			get searchText () {
				return [this.name, this.lastname, this.phone].join(' ');
			}
		};

		id++;

		return Object.assign(student, args);

	};


	var StudentService = function() {

		var	students = [],
				add = (name, lastname, age) => {
					students.push(new Student(name, lastname, age));
					App.Core.EventBus.fire('students_update');
				},
				remove = (id) => { 
					var index = students.findIndex( 
						student => student.id === id
					);
					students.splice(index, 1);
					App.Core.EventBus.fire('students_update');
				},
				get = (id) => {
					return students.find( (student) => student.id === parseInt(id) );
				},
				getAll = () => students,
				search = (phrase) => {
					var StudentIndexArray = students.map(
						(student)=> {
							return {
								search: student.searchText,
								id: student.id
							};
						});

					return StudentIndexArray.filter((studentIndex) => {
						if(studentIndex.search.search(phrase) !== -1) 
							return get(studentIndex.id);
					}).map((student) => get(student.id));
			}

		App.Core.EventBus.on('student_add', add);
		App.Core.EventBus.on('student_remove', remove);

		return {
			add: add,
			remove: remove,
			get: get,
			search: search,
			getAll: getAll,
		}
	};

	App.Services.StudentService = new StudentService();

}(this, this.document));
'user strict';

var Students;

(function(w, d) {

  var studentService,
      renderer,
      node,
      sector;

  var StudentsModule = function(node) {

    var wrapperTpl = d.querySelector('#StudentsModule'),
        studentTpl = d.querySelector('#studentTpl'),
        studentFormTpl = d.querySelector('#studentFormTpl'),
        items,
        studentForm;

    function render() {
      renderer.clear(items);

      var students = studentService.getAll();

      if(students.length < 1) {
        items.appendChild(renderer.render('<div class="item">Записей не найдено</div>'));
      } else {
        students.forEach(function(student){
          items.appendChild( renderer.render(studentTpl, student) )
        });
      }
    }

    function bindEvents() {

      /**
      * TABLE
      */
      sector.addEventListener('click', function(event) {

        if (event.target.classList.contains('remove')) {
          var item = event.target.parentNode;
          var id = parseInt(item.getAttribute('data-id'))
          App.Core.EventBus.fire('student_remove', id);
        }

        if (event.target.classList.contains('add')) {
          studentForm.classList.add('in');
        }

      }, false);

      /**
      * Form
      */
      studentForm.addEventListener('click', function(event) {

        if (event.target.classList.contains('submit')) {
           App.Core.EventBus.fire('student_add', getFormData());
          studentForm.classList.remove('in');
        }

        if (event.target.classList.contains('abort')) {
          studentForm.classList.remove('in');
        }
      }, false);

       App.Core.EventBus.on('students_update', render);
    }

    function getFormData() {
      var form = {};
      form.name = d.querySelector('[name="name"]').value;
      form.lastname = d.querySelector('[name="lastname"]').value;
      form.phone = d.querySelector('[name="phone"]').value;
      return form;
    }

    function add() {
      studentService.add();
      render();
    }

    function remove() {
      studentService.remove(id);
      render();
    }

    function init() {
      studentService = App.Services.StudentService;
      renderer = new App.Core.Renderer();
      
      studentService.add({name:'John', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'Annita', lastname:'', phone:'+7 905 7974388'});
      studentService.add({name:'Mia', lastname:'Salvadore', phone:'+7 905 7974388'});
      studentService.add({name:'Max', lastname:'Payne', phone:'+7 905 7974388'});
      studentService.add({name:'Leo', lastname:'Jenkins', phone:'+7 905 7974388'});
      studentService.add({name:'Trinity', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'John', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'Annita', lastname:'', phone:'+7 905 7974388'});
      studentService.add({name:'Mia', lastname:'Salvadore', phone:'+7 905 7974388'});
      studentService.add({name:'Max', lastname:'Payne', phone:'+7 905 7974388'});
      studentService.add({name:'Leo', lastname:'Jenkins', phone:'+7 905 7974388'});
      studentService.add({name:'Trinity', lastname:'Dhoe', phone:'+7 905 7974388'});

      var wrapper = renderer.render(wrapperTpl);
      studentForm = renderer.render(studentFormTpl);
      wrapper.appendChild(studentForm);
      node.appendChild(wrapper);

      items = node.querySelector('.items');
      studentForm = node.querySelector('.student-form');
      sector = items.parentNode;

      render();
      bindEvents();
    }
    
    init();

    return {};

  };

  Students = StudentsModule;

})(this, this.document);
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
'user strict';

var Abonements;

(function(w, d) {

  var abonementService,
      studentService,
      renderer,
      node,
      sector;

  var AbonementsModule = function(node) {

    var wrapperTpl = d.querySelector('#AbonementsModule'),
        abonementTpl = d.querySelector('#abonementTpl'),
        abonementFormTpl = d.querySelector('#abonementFormTpl'),
        items,
        abonementForm;

    function render() {
      renderer.clear(items);
      var abonements = abonementService.getAll();

      if(abonements.length < 1) {
        items.appendChild(renderer.render('<div class="item">Записей не найдено</div>'));
      } else {
        abonements.forEach(function(abonement){
          items.appendChild( renderer.render(abonementTpl, abonement) )
        });
      }

      updateForm()
    }

    function bindEvents() {

      /**
      * TABLE
      */
      sector.addEventListener('click', function(event) {

        if (event.target.classList.contains('remove')) {
          var item = event.target.parentNode;
          var id = parseInt(item.getAttribute('data-id'))
          App.Core.EventBus.fire('abonement_remove', id);
        }

        if (event.target.classList.contains('add')) {
          abonementForm.classList.add('in');
        }

      }, false);

      /**
      * Form
      */
      abonementForm.addEventListener('click', function(event) {

        if (event.target.classList.contains('submit')) {
           App.Core.EventBus.fire('abonement_add', getFormData());
           abonementForm.classList.remove('in');
        }

        if (event.target.classList.contains('abort')) {
          abonementForm.classList.remove('in');
        }
      }, false);

       App.Core.EventBus.on('abonements_update', render);
       App.Core.EventBus.on('students_update', updateForm);
    }

    function getFormData() {
      var form = {};
      form.client_id = d.querySelector('[name="client_id"]').value;
      form.till = d.querySelector('[name="till"]').value;
      return form;
    }

    function updateForm() {

      var students = studentService.getAll();
      var fragment = d.createDocumentFragment();
      var studentsSelectInput = abonementForm.querySelector('select');
      
      renderer.clear(studentsSelectInput);
      students.forEach(function(student) {
        fragment.appendChild(
          renderer.render('<option value="{{id}}">{{name}} {{lastname}}</option>', student)
          );
      });
      studentsSelectInput.appendChild(fragment);
    }

    function AbonementPage() {
      
    }


    function init() {
      abonementService = App.Services.AbonementService;
      studentService = App.Services.StudentService;
      renderer = new App.Core.Renderer();

      var wrapper = renderer.render(wrapperTpl);
      abonementForm = renderer.render(abonementFormTpl);
      wrapper.appendChild(abonementForm);
      node.appendChild(wrapper);

      items = node.querySelector('.items');
      abonementForm = node.querySelector('.abonement-form');
      sector = items.parentNode;

      render();
      bindEvents();
    }
    
    init();

    return {};

  };

  Abonements = AbonementsModule;

})(this, this.document);
'use strict';

var App = App || {};
App.Ux = App.Ux || {};

(function(w, d) {

	function Tab(id, name, content){
		this.id = id;
		this.name = name;	
		this.content = content;
	};

  var Tabs = function(node) {

  	var tabs = [],
  			id = 0,
  			renderer;

  	function addTab(name, content) {
  		tabs.push(new Tab(id, name, content));
  		id++;
  	}

  	function init() {
  		renderer = new App.Core.Renderer();
  	}

  	function render() {
  		var wrapper = renderer.render('<div class="tabs"></tab>'),
  				navigation = renderer.render('<nav></nav>'),
  				linkTpl = '<div class="link"><a href="#tab-{{id}}" class="tab-link">{{name}}</a></div>',
  				tabsHtml = renderer.render('<div class="tab-content"></div>'),
  				tabTpl = '<div class="tab" id="tab-{{id}}"></div>';

  		wrapper.appendChild(navigation);
  		wrapper.appendChild(tabsHtml);

      tabs.forEach(function(tab){
        var link = renderer.render(linkTpl, tab);
        navigation.appendChild(link);
        var tabContent = renderer.render(tabTpl, tab);
        tabContent.appendChild(tab.content);
        tabsHtml.appendChild(tabContent);
      });

  		node.appendChild(wrapper);
  		bindEvents();
  		App.Core.EventBus.fire('table_tab_click', d.querySelectorAll('.tab-link')[0]);
  	}

  	function navLinkClickEventHandler(el){

  			if(el.classList.contains('active'))
	  				return false;

	  			var activeLink = d.querySelector('.tab-link.active');
	  			var activeTab = d.querySelector('.tab.active');

	  			if(activeLink) {
	  				activeLink.classList.remove('active');
	  			}

	  			if(activeTab) {
	  				activeTab.classList.remove('active');
	  			}

	  			el.classList.add('active');
	  			var id = el.getAttribute('href');
	  			d.querySelector(id).classList.add('active');
		}

		function bindEvents() {
			var links = d.querySelectorAll('.tab-link');

  		App.Core.EventBus.on('table_tab_click', navLinkClickEventHandler);

  		[].map.call(links, function(link){
  			link.addEventListener('click', function(event) {
	  			event.preventDefault();

	  			App.Core.EventBus.fire('table_tab_click', event.target);
	  			return false;
	  		}, false);
  		});
		}

  	init();

  	return {
  		add: addTab,
  		render: render
  	}
  }

  App.Ux.Tabs = Tabs;

})(this, this.document);
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