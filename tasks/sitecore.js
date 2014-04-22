module.exports = {
	name: 'task-sitecore',
	dependencies: ['task-sync'],
	register: register,
	buildTask: true
};

function register(grunt) {

	var path = require('path');

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-sitecore', 'Disabled.', []);
		return false;
	}

	// Synchronize our normal assets
	grunt.config('sync.scjs', {
		files: [{
			cwd: '<%= config.js_folder %>',
			src: ['**'],
			dest: path.join(grunt.config('config.sitecore_path'), grunt.config('config.js_folder'))
		}],
		verbose: false
	});

	grunt.config('sync.sccss', {
		files: [{
			cwd: '<%= config.css_folder %>',
			src: ['**'],
			dest: path.join(grunt.config('config.sitecore_path'), grunt.config('config.css_folder'))
		}],
		verbose: false
	});

	// Synchronize all the markup we can find
	grunt.config('sync.asp', {
		files: [{
			cwd: './',
			src: ['**/*.ascx', '**/*.aspx'],
			dest: '<%= config.sitecore_path %>'
		}],
		verbose: false
	});

	// Assign our tasks based on production mode
	grunt.registerTask('task-sitecore', 'Synchronizes assets for sitecore.', ['sync:scjs', 'sync:sccss', 'sync:asp']);

	return true;
};


function verifyConfig(grunt) {
	// Do we have a sitecore folder assigned?
	var sitecoreFolder = grunt.config('config.sitecore_path');
	if (sitecoreFolder === undefined)
		return false;		// Don't use sitecore functionality

	var config = {
		'sitecore_path': [ ['type:string', 'notEmptyString'],
			"Invalid 'sitecore_path' folder given. Please specifiy a valid path, or remove the option to avoid syncing your sitecore folder." ]
	};

	return global.configutil.validateConfig(grunt, config);
}