module.exports = {
	name: 'task-javascript',
	dependencies: ['task-concat', 'task-uglify', 'task-watch', 'task-sitecore'],
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

		grunt.config('requirejs', {
			compile: {
				options: {
					name: 'app',
	                baseUrl: '.tmp/js',
	                out: '<%= config.js_folder %>/<%= config.coffee_appfile %>.js'/*,
	                include:  ['lib/require'],

	                paths: {
	                    jquery: "lib/jquery-1.10.2"
	                }*/
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
			dest: '.tmp/js/tmp.js'
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