module.exports = function(grunt) {
	grunt.config('concat', {
		options: {
			separator: ';',
		}
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-concat');
	
	// Register a dud task to keep grunt happy
	grunt.registerTask('task-concat', 'Does nothing.', ['']);
};