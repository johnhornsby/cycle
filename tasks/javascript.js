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

	// Use a clean script
	grunt.config('clean.js', [
		'<%= config.js_folder %>/<%= config.javascript_appfile %>.js',
		'<%= config.js_folder %>/<%= config.javascript_appfile %>.min.js'
	]);

	// Concatenate our temporary javascript files into the main app js file
	grunt.config('concat.js', {
		src: '<%= config.javascript_appfolder %>/**/*.js',
		dest: '<%= config.js_folder %>/<%= config.javascript_appfile %>.js'
	});

	// Uglify our appfile when production is enabled
	grunt.config('uglify.js', {
		files: {
			'<%= config.js_folder %>/<%= config.javascript_appfile %>.min.js': '<%= config.js_folder %>/<%= config.javascript_appfile %>.js'
		}
	});

	// Keep an eye on our coffeescript folder
	grunt.config('watch.js', {
		files: ['<%= config.javascript_appfolder %>/**/*.js'],
		tasks: ['task-javascript', 'notify:watch'],
		options: {
			livereload: true
		}
	});

	// Assign our tasks based on production mode
	var taskList = (grunt.config.get('config.production') === true) ? 
									['clean:js', 'concat:js', 'uglify:js', 'task-sitecore-js'] :
									['clean:js', 'concat:js', 'task-sitecore-js'];

	grunt.registerTask('task-javascript', 'Processes javascript files.', taskList);

	return true;
};


function verifyConfig(grunt) {
	// Do we have a js scripts folder assigned?
	var appFolder = grunt.config('config.javascript_appfolder');
	if (appFolder === undefined)
		return false;		// Don't use javascript functionality

	var config = {
		'javascript_appfolder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'javascript_appfolder' path given. Please specifiy a valid path, or remove the option to avoid compiling your javascript app." ],
		'javascript_appfile': [ ['type:string', 'notEmptyString'],
			"Invalid 'javascript_appfile' config option provided. Please specifiy a valid name for the compiled javascript file, or disable by removing the 'javascript_appfolder' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}