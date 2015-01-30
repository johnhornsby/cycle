module.exports = {
  name: 'task-export',
  dependencies: ['task-copy', 'task-prototype'],
  register: register,
  buildTask: false
};



function register(grunt) {

  // Clean the .tmp folder
  grunt.config('clean.export', [
    '.tmp/html',
    '.tmp/js',
    'export/'
  ]);

  // Copy each of our assets folders to new export directory
  grunt.config('copy.exportCss', {
    files: [
      { expand: true, cwd: '<%= config.css_folder %>', src: '**/*.css', dest: 'export/assets/css' }
    ]
  });

  grunt.config('copy.exportJs', {
    files: [
      { expand: true, cwd: '<%= config.js_folder %>', src: '**/*.js', dest: 'export/assets/js' }
    ]
  });

  grunt.config('copy.exportImg', {
    files: [
      { expand: true, cwd: '<%= config.img_folder %>', src: '**/*', dest: 'export/assets/img' }
    ]
  });




  // Copy our HTML pages to the root of the export directory 
  grunt.config('copy.exportTemplates', {
    files: [
      { expand: true, cwd: '.tmp/html', src: '*.html', dest: 'export/' }
    ]
  });

  // Assign task
  grunt.registerTask('task-export', 'Generates static site from prototype build', ['task-prototype-build', 'copy:exportCss', 'copy:exportJs', 'copy:exportImg', 'copy:exportTemplates']);
  return true;
};