module.exports = function(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-coffee', 'Disabled.', ['']);
		return;
	}

	// Load our required npm tasks
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

	// Use a clean script
	grunt.config('clean.coffee', [
		'.tmp/js'
	]);

	// Concatenate our temporary javascript files into the main app js file
	grunt.config('concat.coffee', {
		src: '.tmp/js/**/*.js',
		dest: '<%= config.js_folder %>/<%= config.coffee_appfile %>.js'
	});

	// Uglify our appfile when production is enabled
	grunt.config('uglify.coffee', {
		files: {
			'<%= config.js_folder %>/<%= config.coffee_appfile %>.min.js': '<%= config.js_folder %>/<%= config.coffee_appfile %>.js'
		}
	});

	// Keep an eye on our coffeescript folder
	grunt.config('watch.coffee', {
		files: ['<%= config.coffee_folder %>/**/*.coffee'],
		tasks: ['task-coffee', 'notify:watch'],
		options: {
			livereload: true
		}
	});

	// Assign our tasks based on production mode
	var taskList = (grunt.config.get('config.production') === true) ? 
									['clean:coffee', 'coffee:coffee', 'concat:coffee', 'uglify:coffee'] :
									['clean:coffee', 'coffee:coffee', 'concat:coffee'];

	grunt.registerTask('task-coffee', 'Preprocess coffeescript files for the site.', taskList);

	// Add our task to the build list
	var tasks = grunt.config('buildTasks');
	tasks.push('task-coffee');
	grunt.config('buildTasks', tasks);
};


function verifyConfig(grunt) {
	// Do we have a coffee folder assigned?
	var coffeeFolder = grunt.config('config.coffee_folder');
	if (coffeeFolder === undefined)
		return false;		// Don't use coffeescript functionality

	var config = {
		'coffee_folder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'coffee_folder' path given. Please specifiy a valid path, or remove the option to avoid compiling any coffeescript." ],

		'js_folder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"No 'js_folder' config option provided. Please specifiy a valid path, or disable coffeescript by removing the 'coffee_folder' setting." ],

		'coffee_appfile': [ ['type:string', 'notEmptyString'],
			"No 'coffee_appfile' config option provided. Please specifiy a valid name for the compiled javascript file, or disable coffeescript by removing the 'coffee_folder' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}