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
	var useLint = grunt.config('config.scss_lint_config') !== undefined;

	if (useRuby)
		grunt.task.loadNpmTasks('grunt-contrib-sass');
	else
		grunt.task.loadNpmTasks('grunt-sass');

	if (useLint)
		grunt.task.loadNpmTasks('grunt-scss-lint');

	if (grunt.config.get('config.production') === true)
		grunt.task.loadNpmTasks('grunt-contrib-cssmin');

	// Perform the linting?
	if (useLint) {
		grunt.config('scsslint', {
			allFiles: [
				'<%= config.scss_folder %>/**/*.scss'
			],
			options: {
				config: '<%= config.scss_lint_config %>'
			}
		});
	}

	// Are we using icons?
	var useIcons = grunt.config('config.icon_folder') !== undefined;
	if (useIcons && global.firstBuild) {
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

		// Implement proper IE8 fallback
		grunt.loadNpmTasks('grunt-text-replace');
		grunt.config('replace', {
			icons: {
				src: ['.tmp/icons/*.svg.css'], 
				dest: '.tmp/icons/',
				replacements: [{
					from: "-image: url",
					to: ": rgba(255, 255, 255, 0) url"
				}]
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

		grunt.registerTask('icons', 'Preprocess icons for site.', ['clean:icons', 'grunticon:icons', 'replace:icons', 'copy:icons']);
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

	if (useLint)
		taskList.push('scsslint');

	if (useIcons && global.firstBuild) 
		taskList.push('icons');

	taskList.push('sass:styles');

	if (grunt.config.get('config.production') === true)
		taskList.push('cssmin:styles');

	taskList.push('task-sitecore-css');
	taskList.push('task-bower-css');
	
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