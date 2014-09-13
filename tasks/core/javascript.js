var fs = require('fs'),
	path = require('path');


module.exports = {
	name: 'task-javascript',
	dependencies: ['task-copy', 'task-concat', 'task-uglify', 'task-watch', 'task-sitecore'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-javascript', 'Disabled.', []);
		return false;
	}

	// Configure grunt according to what we need
	var useRequire = grunt.config('config.use_requirejs') === true;
	var useCoffee = grunt.config('config.coffee_folder') !== undefined;
	var jsAppfolder = grunt.config('config.javascript_appfolder');

	if (useRequire) {
		grunt.task.loadNpmTasks('grunt-contrib-requirejs');

		// Copy all our bower components to our js root
		grunt.config('copy.bowerjs', {
			files: [
				{expand: true, cwd: '.tmp/bower', src: '**/*.js', dest: '.tmp/js'}
			]
		});

		// Define a task to determine which require libraries to load
		grunt.registerTask('task-javascript-rjs', 'Handles requirejs includes.', function () {
			var files = walk('.tmp/js', '.tmp/js');
			var includes = [];

			files.forEach(function (file) {
				if (path.extname(file) != '.js')
					return;

				// Don't include the main module
				if (path.basename(file, '.js') == 'main')
					return;

				var module = path.dirname(file) + '/' + path.basename(file, '.js');
				includes.push(module);
			});

			// Sort by bower priorities
			var priorities = grunt.config('config.bower_priorities');
			if (priorities) {
				includes.sort(function (a, b) {
					for (var i=0; i < priorities.length; ++i) {
						if (priorities[i].indexOf(path.basename(a) + '.js') != -1)
							return -1;
						if (priorities[i].indexOf(path.basename(b) + '.js') != -1)
							return 1;
					}

					return 0;
				});
			}

			grunt.config('requirejs.compile.options.include', includes);
		});

		// Define our requirejs config
		grunt.config('requirejs', {
			compile: {
				options: {
					name: 'main',
					baseUrl: '.tmp/js',
					out: '<%= config.js_folder %>/<%= config.script_appfile %>.js',
					optimize: 'none',
					generateSourceMaps: grunt.config('config.generate_require_sourcemap') === true
				}
			}
		});
	}

	if (useCoffee) {
		grunt.task.loadNpmTasks('grunt-contrib-coffee');

		grunt.config('coffee', {
			coffee: {
				options: {
					bare: false,
					sourceMap: false
				},
				files: [
					{	//Compile our coffeescript into the site js folder
						expand: true,
						cwd: '<%= config.coffee_folder %>',
						src: '**/*.coffee',
						dest: '.tmp/js/',
						ext: '.js'
					}
				]
			}
		});

		// Keep an eye on our coffeescript folder
		grunt.config('watch.coffee', {
			files: ['<%= config.coffee_folder %>/**/*.coffee'],
			tasks: ['task-javascript', 'notify:watch'],
			options: {
				livereload: true
			}
		});
	}

	if (jsAppfolder) {
		// Concatenate our temporary javascript files into a temporary js file
		grunt.config('concat.js', {
			src: '<%= config.javascript_appfolder %>/**/*.js',
			dest: '.tmp/js/_tmp.js'
		});

		// Keep an eye on our javascript folder
		grunt.config('watch.js', {
			files: ['<%= config.javascript_appfolder %>/**/*.js'],
			tasks: ['task-javascript', 'notify:watch'],
			options: {
				livereload: true
			}
		});
	}

	// Use a clean script
	grunt.config('clean.js', [
		'.tmp/js'
	]);

	// Concatenate all our javascript into our app file
	grunt.config('concat.app', {
		src: '.tmp/js/**/*.js',
		dest: '<%= config.js_folder %>/<%= config.script_appfile %>.js'
	});

	// Uglify our appfile when production is enabled
	grunt.config('uglify.app', {
		files: {
			'<%= config.js_folder %>/<%= config.script_appfile %>.min.js': '<%= config.js_folder %>/<%= config.script_appfile %>.js'
		}
	});

	// Build our task list depending on our settings
	var taskList = ['clean:js'];

	if (useCoffee)
		taskList.push('coffee:coffee');

	if (jsAppfolder)
		taskList.push('concat:js');

	if (useRequire) {
		taskList.push('copy:bowerjs');
		taskList.push('task-javascript-rjs');
		taskList.push('requirejs:compile');
		if (grunt.config.get('config.production') === true)
			taskList.push('uglify:app');
	} else {
		taskList.push('concat:app');
		if (grunt.config.get('config.production') === true)
			taskList.push('uglify:app');
	}

	taskList.push('task-sitecore-js');

	grunt.registerTask('task-javascript', 'Processes javascript files.', taskList);

	return true;
};


function verifyConfig(grunt) {
	// Do we have a js app file assigned?
	var appFile = grunt.config('config.script_appfile');
	if (appFile === undefined)
		return false;		// Don't use javascript functionality

	var config = {
		'script_appfile': [ ['type:string', 'notEmptyString'],
			"Invalid 'script_appfile' config option provided. Please specifiy a valid name for the compiled javascript file, or disable by removing the 'script_appfile' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}

function walk(basedir, dir) {
	var results = [];
	var list = fs.readdirSync(dir);

	list.forEach(function(file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);

		if (stat && stat.isDirectory()) 
			results = results.concat(walk(basedir, file));
		else 
			results.push(path.relative(basedir, file));
	});

	return results;
}