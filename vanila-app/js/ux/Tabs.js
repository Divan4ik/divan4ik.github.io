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