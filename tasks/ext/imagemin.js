module.exports = {
	name: 'task-imagemin',
	dependencies: [],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Check to see if autoprefixer is being used
	var useImagemin = grunt.config('config.imageMin');
	if (useImagemin === undefined || useImagemin === false) {
		grunt.registerTask('task-imagemin', 'Disabled.', []);
		return false;
	}

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-imagemin');

	// Set autoprefixer options
	grunt.config('imagemin', {
		png: {
			options: {
			optimizationLevel: 7
			},
			dynamic: {                         // Another target
	      files: [{
	        expand: true,                  // Enable dynamic expansion
	        cwd: 'assets/img',                   // Src matches are relative to this path
	        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
	        dest: 'assets/img/opt'                  // Destination path prefix
	      }]
	    }
	  }
	});

	

	
	

	// Register task
	grunt.registerTask('task-imagemin', 'Run image optimisation', ['imagemin']);

	return true;
};