module.exports = {
	name: 'task-sitecore',
	dependencies: ['task-sync', 'task-watch'],
	register: register,
	buildTask: true,
	catchTemplate: /(task-sitecore*)\w+/g
};

function register(grunt) {

	var path = require('path');

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-sitecore-css', 'Disabled.', []);
		grunt.registerTask('task-sitecore-js', 'Disabled.', []);
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
			src: ['**/*.ascx', '**/*.aspx'],
			dest: '<%= config.sitecore_path %>'
		}],
		verbose: false
	});

	// Keep an eye on our markup
	grunt.config('watch.asp', {
		files: ['**/*.ascx', '**/*.aspx'],
		tasks: ['task-sitecore-asp'],
		options: {
			livereload: true
		}
	});

	// Assign our tasks
	grunt.registerTask('task-sitecore-asp', 'Synchronizes assets for sitecore.', ['sync:asp']);
	grunt.registerTask('task-sitecore-css', 'Synchronizes assets for sitecore.', ['sync:sccss']);
	grunt.registerTask('task-sitecore-js', 'Synchronizes assets for sitecore.', ['sync:scjs']);
	grunt.registerTask('task-sitecore', 'Synchronizes assets for sitecore.', ['sync:asp', 'sync:scjs', 'sync:sccss']);

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