module.exports = function(grunt) {
	grunt.config('notify', {
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-notify');

	// Register a dud task to keep grunt happy
	grunt.registerTask('task-notify', 'Does nothing.', ['']);
};