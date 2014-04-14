module.exports = function(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-styles', 'Disabled.', ['']);
		return;
	}

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-sass');
	if (grunt.config.get('config.production') === true)
		grunt.task.loadNpmTasks('grunt-contrib-cssmin');

	grunt.config('sass', {
		styles: {
			files: [
				{	//Compile our sass into the site css folder
					expand: true,
					cwd: '<%= config.scss_folder %>',
					src: '**/*.scss',
					dest: '<%= config.css_folder %>',
					ext: '.css'
				}
			]
		}
	});

	// Keep an eye on our sass folder
	grunt.config('watch.styles', {
		files: ['<%= config.scss_folder %>/**/*.scss'],
		tasks: ['task-styles', 'notify:watch'],
		options: {
			livereload: true
		}
	});

	// Minify our css when production is enabled
	grunt.config('cssmin.styles', {
		files: [
			{	//Compile our sass into the site css folder
				expand: true,
				cwd: '<%= config.css_folder %>',
				src: ['**/*.css', '!vendor.*', '!**/*.min.css'],
				dest: '<%= config.css_folder %>',
				ext: '.min.css'
			}
		]
	});

	// Assign our tasks based on production mode
	var taskList = (grunt.config.get('config.production') === true) ? 
									['sass:styles', 'cssmin:styles'] :
									['sass:styles' ];

	grunt.registerTask('task-styles', 'Preprocess styles for site.', taskList);

	// Add our task to the build list
	var tasks = grunt.config('buildTasks');
	tasks.push('task-styles');
	grunt.config('buildTasks', tasks);
};


function verifyConfig(grunt) {
	// Do we have a scss folder assigned?
	var scssFolder = grunt.config('config.scss_folder');
	if (scssFolder === undefined)
		return false;		// Don't use sass functionality

	var config = {
		'scss_folder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'scss_folder' path given. Please specifiy a valid path, or remove the option to avoid compiling any sass stylesheets." ],

		'css_folder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"No 'css_folder' config option provided. Please specifiy a valid path, or disable sass by removing the 'scss_folder' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}