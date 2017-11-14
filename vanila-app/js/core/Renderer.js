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