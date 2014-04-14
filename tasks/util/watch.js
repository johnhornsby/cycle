module.exports = function(grunt) {
	grunt.config('watch', {
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-watch');

	// Configure our generic notification
	grunt.config('notify.watch', {
		options : {
			message: 'Watch assets updated.'
	}});

	grunt.registerTask('task-watch', 'Preprocess coffeescript files for the site.', ['watch']);
};