module.exports = {
	name: 'task-styles',
	dependencies: ['task-copy', 'task-watch', 'task-sitecore'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-styles', 'Disabled.', []);
		return false;
	}

	// Load our required npm tasks
	var useRuby = grunt.config('config.use_rubysass');

	if (useRuby)
		grunt.task.loadNpmTasks('grunt-contrib-sass');
	else
		grunt.task.loadNpmTasks('grunt-sass');

	if (grunt.config.get('config.production') === true)
		grunt.task.loadNpmTasks('grunt-contrib-cssmin');

	// Are we using icons?
	var useIcons = grunt.config('config.icon_folder') !== undefined;
	if (useIcons) {
		grunt.task.loadNpmTasks('grunt-grunticon');

		// Use a clean script
		grunt.config('clean.icons', [
			'.tmp/icons'
		]);

		grunt.config('grunticon', {
			icons: {
				files: [{
					expand: true,
					cwd: '<%= config.icon_folder %>',
					src: ['*.svg', '*.png'],
					dest: ".tmp/icons"
				}],
				options: {

				}
			}
		});

		// Create scss files also
		grunt.config('copy.icons', {
			files: [{ 
				expand: true, 
				src: "**/*.css", 
				dest: ".tmp/icons/", 
				cwd: ".tmp/icons/", 
				rename: function(dest, src) {
					console.log(dest);console.log(src);
	              return dest + src.substring(0, src.lastIndexOf('.')) + '.scss';
	            }
			}]
		});

		grunt.registerTask('icons', 'Preprocess icons for site.', ['clean:icons', 'grunticon:icons', 'copy:icons']);
	}

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
			],
			options: {
				quiet: true
			}
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
	var taskList = [];

	if (useIcons) 
		taskList.push('icons');

	taskList.push('sass:styles');

	if (grunt.config.get('config.production') === true)
		taskList.push('cssmin:styles');

	taskList.push('task-sitecore-css');
	
	grunt.registerTask('task-styles', 'Preprocess styles for site.', taskList);

	return true;
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