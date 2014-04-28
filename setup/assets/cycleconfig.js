module.exports = {
	// When production is disabled minification isn't performed.
	"production": true,

	// Prototyping is used to develop static HTML files before the back-end is
	// deployed. http://localhost:3000 should point to your HTML files in the 
	// root of your project.
	"prototyping": true,
	"prototypes": {
		"root": "./",			// The path to our static HTML files
		"port": 3000,			// The port to run the webserver on
		"livereload": true,		// Whether to use livereload to refresh content
		"templates": ""			// The template engine to use, blank for none.

		// See https://github.com/visionmedia/consolidate.js/#supported-template-engines for supported template engine list.
		// Any template engines need to be installed globally, i.e. 'npm install hamljs -g', 'npm install jade -g'
	},

	// Automatically check out files that are under TFS source control and need to be written to 
	"useTFS": true,

	// Folder paths to relevant assets.
	"scss_folder": "assets/scss",		// Remove me to disable sass
	"css_folder": "assets/css",
	"coffee_folder": "assets/coffee",	// Remove me to disable coffeescript
	"js_folder": "assets/js",
	"img_folder": "assets/img",
	
	// If you want to use rubysass (albeit slower) for compatibility reasons, then enable this option.
	"use_rubysass": false,

	// The name of the concatenated app file to generate. 
	//'app' will generate app.js and app.min.js in production.
	"coffee_appfile": "app",
	
	// If you want your javascript concatenated and minified into a single app file, you
	// can specific a scripts folder and the output filename to be added to the js folder.
	//"javascript_appfolder": "assets/scripts",
	//"javascript_appfile": "app",

	// The path to the sitecore project for syncing changes.
	// If this is removed then no syncing will be performed.
	"sitecore_path" : "C:/Sitecore/HelloWorld/Website",

	// Set to false to avoid using bower altogether. This will speed up cycle a decent amount.
	// Bower will copy all your required .css and .js files into vendor.css and vendor.js.
	// Your bower.json must be present in your project root (the directory you run cycle from).
	"bower_enabled": true,

	// Use this to override cycle if it isn't copying the particular 
	// bower components that you require.
	"bower_files": {
		// Example
		/*"modernizr": {
			files: [ 
				"modernizr.js" 
			]
		}*/
	},

	// Use this to specific bower components which should be included before anything else.
	"bower_priorities": [
		"jquery.js"
	]
};
