/**
 * Sets the type of metadata encoding to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * Requires jQuery core 1.0.4+!
 * 
 * There are three encoding types:
 *
 *   attr:  The data will be stored in an attribute. The second parameter of $.meta.setType
 *          will indicate *which* attribute.
 *          
 *   class: The data will be stored in the class, inside { } (default)
 *   
 *   elem:  Store the data in an element inside the current element (e.g. a script tag). The
 *          second parameter of $.meta.setType will indicate *which* element
 *          
 * The metadata for an element is loaded the first time the element is loaded via a jQuery query.
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 * 
 * @name $.meta.setType
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.meta.setType("class")
 * @after $("#one")[0].item_id == 1; $("#one")[0].item_label == "Label"
 * 
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.meta.setType("attr", "data")
 * @after $("#one")[0].item_id == 1; $("#one")[0].item_label == "Label"
 * 
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.meta.setType("elem", "script")
 * @after $("#one")[0].item_id == 1; $("#one")[0].item_label == "Label"
 * 
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @author John Resig
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 *
 * Revision: $Id$
 */

(function($) {
	// settings
	$.meta = {
	  type: "class",
	  name: "data",
	  setType: function(type,name){
	    this.type = type;
	    this.name = name;
	  },
	  cre: /({.*})/,
	  single: ''
	};
	
	// reference to original set()
	var set = $.fn.set;
	
	// define new set()
	$.fn.set = function(arr){
	    return set.apply( this, arguments ).each(function(){
	      if ( this.metaDone ) return;
	      
	      var data = "{}";
	      
	      if ( $.meta.type == "class" ) {
	        var m = $.meta.cre.exec( this.className );
	        if ( m )
	          data = m[1];
	      } else if ( $.meta.type == "elem" ) {
	        var e = this.getElementsByTagName($.meta.name);
	        if ( e.length )
	          data = $.trim(e[0].innerHTML);
	      } else if ( this.getAttribute != undefined ) {
	        var attr = this.getAttribute( $.meta.name );
	        if ( attr )
	          data = attr;
	      }
	      
	      if ( !/^{/.test( data ) )
	        data = "{" + data + "}";
	
	      eval("data = " + data);
	
	      if ( $.meta.single )
	        this[ $.meta.single ] = data;
	      else
	        $.extend( this, data );
	      
	      this.metaDone = true;
	    });
	};
	
	/**
	 * Returns the metadata object for the first member of the jQuery object.
	 *
	 * @name data
	 * @descr Return's element's metadata object
	 * @type jQuery
	 * @cat Plugins/Metadata
	 */
	$.fn.data = function(){
	  return this[0][$.meta.name];
	};
})(jQuery);