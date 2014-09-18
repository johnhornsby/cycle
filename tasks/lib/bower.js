module.exports = {
	name: 'task-bower',
	dependencies: ['task-concat', 'task-uglify', 'task-watch'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-bower', 'Disabled.', []);
		return false;
	}

	defineBowerCSS(grunt);

	// Only load our bower module if we're running with no arguments (first load), or
	// if our watch script has triggered a task-bower run. This is because loading
	// bower through grunt is pretty heavy on load times.
	if (!isBowerLaunch(grunt)) {
		grunt.registerTask('task-bower', 'Disabled.', []);
		return false;
	}

	grunt.config('bower', {	
		dist: {
			dest: '.tmp/bower',
			options: {
				expand: true,
				packageSpecific: grunt.config('config.bower_files')
			}
		},
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-cssmin');

	var cwd = process.cwd();		// Trick bower into thinking it's in the project folder during setup
	var tasks = require('path').resolve('node_modules/grunt-bower/tasks');
	process.chdir(global.cyclecwd);

	grunt.loadTasks(tasks);

	process.chdir(cwd);

	// Use a clean script
	grunt.config('clean.bower', [
		'.tmp/bower',
		'<%= config.js_folder %>/vendor.js',
		'<%= config.js_folder %>/vendor.min.js',
		'<%= config.css_folder %>/vendor.css',
		'<%= config.css_folder %>/vendor.min.css'
	]);

	// Keep an eye on our bower script
	grunt.config('watch.bower', {
		files: ['bower.json'],
		tasks: ['task-bower', 'notify:watch'],
		options: {
			livereload: true
		}
	});

	// Concatenate our temporary javascript files into our vendor js file
	var priorities = grunt.config('config.bower_priorities');
	var srcFiles = [];

	priorities.forEach(function (val) {
		srcFiles.push('.tmp/bower/' + val);
	});

	srcFiles.push('.tmp/bower/**/*.js');

	grunt.config('concat.bowerjs', {
		src: srcFiles,
		dest: '<%= config.js_folder %>/vendor.js'
	});

	var taskList = ['clean:bower', 'bower:dist'];

	// Uglify our appfile when production is enabled
	var useRequire = grunt.config('config.use_requirejs') === true;

	if (!useRequire) {
		taskList.push('concat:bowerjs');

		grunt.config('uglify.bowerjs', {
			files: {
				'<%= config.js_folder %>/vendor.min.js': '<%= config.js_folder %>/vendor.js'
			}
		});

		if (grunt.config.get('config.production') === true)
			taskList.push('uglify:bowerjs');
	}

	// Concatenate our temporary stylesheets into our vendor css file
	grunt.config('concat.bowercss', {
		src: '.tmp/bower/**/*.css',
		dest: '<%= config.css_folder %>/vendor.css'
	});

	taskList.push('concat:bowercss');

	grunt.registerTask('task-bower', 'Prepare all vendor resources.', taskList);

	return true;
};

function defineBowerCSS(grunt) {
	// Merge and/or minify our css
	var taskList = [];
	var mergeCss = grunt.config('config.bower_merge_css');
	
	if (mergeCss !== undefined) {
		// Merge our css
		grunt.config('concat.mergecss', {
			src: ['<%= config.css_folder %>/vendor.css', '<%= config.css_folder %>/<%= config.bower_merge_css %>'],
			dest: '<%= config.css_folder %>/<%= config.bower_merge_css %>'
		});

		taskList.push('concat:mergecss');

		if (grunt.config.get('config.production') === true) {
			grunt.config('cssmin.bowercss', {
				files: [
					{
						expand: true,
						cwd: '<%= config.css_folder %>',
						src: '<%= config.bower_merge_css %>',
						dest: '<%= config.css_folder %>',
						ext: '.min.css'
					}
				]
			});

			taskList.push('cssmin:bowercss');
		}
	}
	else {
		// Minify our vendor stylesheets when production is enabled
		grunt.config('cssmin.bowercss', {
			files: {
				'<%= config.css_folder %>/vendor.min.css': '<%= config.css_folder %>/vendor.css'
			}
		});

		if (grunt.config.get('config.production') === true)
			taskList.push('cssmin:bowercss');
	}

	grunt.registerTask('task-bower-css', 'Post-prepare bower css.', taskList);
}

function verifyConfig(grunt) {
	var bowerEnabled = grunt.config('config.bower_enabled');
	if (bowerEnabled === undefined || bowerEnabled == false)
		return false;

	var config = {
		'bower_enabled': [ ['type:boolean'],
			"Invalid 'bower_enabled' config option provided. Please specify true or false." ]
	};

	if (!global.configutil.validateConfig(grunt, config))
		return false;

	// If bower_files exists, validate them too
	var bowerFiles = grunt.config('config.bower_files');
	if (bowerFiles !== undefined) {
		config = {
			'bower_files': [ ['type:object'],
				"Invalid 'bower_files' config option provided. Please use an object to describe bower files (you can leave this blank), or disable bower by removing the 'bower_path' setting." ]
		};

		if (!global.configutil.validateConfig(grunt, config))
			return false;
	}

	// If bower_priorities exists, validate them too
	var bowerPriorities = grunt.config('config.bower_priorities');
	if (bowerPriorities !== undefined) {
		config = {
			'bower_priorities': [ ['type:array'],
				"Invalid 'bower_priorities' config option provided. Please use an array to describe bower priority files (you can leave this blank), or disable bower by removing the 'bower_path' setting." ]
		};

		if (!global.configutil.validateConfig(grunt, config))
			return false;
	}

	return true;
}

function isBowerLaunch(grunt) {
	// On first-time launch we should run bower
	if (process.argv.length === 2)
		return true;

	// Otherwise we check whether task-bower is an argument, or if
	// we aren't running any specific tasks (default build).
	var bowerLaunch = false;
	var taskArg = false;

	process.argv.forEach(function (taskName, idx) {
		if (taskName === "task-bower")
			bowerLaunch = true;

		if (idx > 1 && taskName[0] !== '-')
			taskArg = true;
	});

	return bowerLaunch || !taskArg;
}