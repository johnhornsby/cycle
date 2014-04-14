// This file is used to set up local HTML file prototyping.
module.exports = function(grunt) {

	if (grunt.config('config.prototyping') === false) {
		grunt.registerTask('task-prototype', 'Disabled.', ['']);
		return;
	}

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-prototype', 'Disabled.', ['']);
		return;
	}

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-connect');

	// Set up task
	var connect = require('connect');

	grunt.registerTask('task-prototype', 'Launches concurrent prototype server.', function () {
		loadExpress(grunt);
		grunt.task.run('notify:prototyping');
	});

	// Keep an eye on our html files
	grunt.config('watch.prototyping', {
		files: ['*.html'],
		tasks: ['notify:watch'],
		options: {
			livereload: true
		}
	});

	// Add our task to the build list
	var tasks = grunt.config('buildTasks');
	tasks.push('task-prototype');
	grunt.config('buildTasks', tasks);

	// Configure our notification
	grunt.config('notify.prototyping', {
		options : {
			message: 'Server running at http://localhost:' + grunt.config('config.prototypes.port')
		}
	});
};


function loadExpress(grunt) {
	grunt.log.writeln('Starting prototype web server - http://localhost:'  + grunt.config('config.prototypes.port'));

	var express = require('express');
	var app = express();

	// Live reload script
	if (grunt.config('config.prototypes.livereload')) {
		var excludeList = ['.woff', '.flv'];
		
		app.use(require('connect-livereload')({
			port: 35729,
			excludeList: excludeList
		}));
	}

	// Load static content before routing takes place
	app.use(express["static"](require('path').join(process.cwd(), grunt.config('config.prototypes.root'))));

	// Start the server
	var port = grunt.config('config.prototypes.port') || 3000;
	app.listen(port);
}


function verifyConfig(grunt) {
	var fs = require('fs');

	// Do we have a prototype object?
	if (grunt.config('config.prototypes') === undefined)
		return false;

	var config = {
		'prototypes.port': [ ['type:number', 'notZero'],
			"Invalid 'prototypes.port' option given. Please specifiy a valid port or disable prototyping." ],

		'prototypes.root': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'prototypes.root' option given. Please specifiy a valid path or disable prototyping." ],

		'prototypes.livereload': [ ['type:boolean'],
			"Invalid 'prototypes.livereload' option given. Please give a boolean or disable prototyping." ],
	};

	return global.configutil.validateConfig(grunt, config);
}