module.exports = function(grunt) {

	if (grunt.config.get('config.production') === true) {
		grunt.config('uglify', {
			options: {
				mangle: false
			}
		});

		// Load our required npm tasks
		grunt.task.loadNpmTasks('grunt-contrib-uglify');
	}

	// Register a dud task to keep grunt happy
	grunt.registerTask('task-uglify', 'Does nothing.', ['']);
};