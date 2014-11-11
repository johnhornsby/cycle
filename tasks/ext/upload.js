var fs = require('fs');

module.exports = {
  name: 'task-upload',
  dependencies: ['task-export'],
  register: register,
  buildTask: false
};

function register(grunt) {

  // Get our directory name and Operating System
  grunt.config('prompt.createDirectory', {
    options: {
      questions: [
        {
          config: 'location',
          type: 'list',
          message: 'Where would you like to upload to?',
          choices: ["Pitch", "Wireframes"]
        },
        {
          config: 'os',
          type: 'list',
          message: 'Which Operating System are you using?',
          choices: ["MacOS", "Windows"]
        },
        {
          config: 'upload',
          type: 'input',
          message: 'What directory would you like to upload to?'
        }
      ],
      then: function(results, done) {
        var uploadDir = results.upload;
        var filePath = "";
        var uploadLocation = "";

        // Set the drive to upload to
        if (results.location === "Pitch") {
          uploadLocation = "pitch";
        } else {
          uploadLocation = "wireframes";
        }

        // Set the OS to create correct filepath
        if (results.os === "Windows") {
          filePath = "\\\\od1sharews058\\" + uploadLocation + "\\";
        } else {
          filePath = '/Volumes/' + uploadLocation + '/';
        }

        // Return false if the directory already exists
        if (fs.existsSync(filePath + results.upload)) {
          grunt.warn('Directory already exists, please choose a new directory');
          return false;
        }

        // Copy our exported folder to pitch-viewer
        grunt.config('copy.uploadStatic', {
          files: [
            { 
              expand: true,
              cwd: 'export',
              src: '**',
              dest: filePath + uploadDir,
              flatten: false
            }
          ]
        });
      }
    }
  });


  // Load our required npm tasks
  grunt.task.loadNpmTasks('grunt-prompt');

  // Assign task
  grunt.registerTask('task-upload', 'Uploads static to pitch viewer', 
    [
      'prompt:createDirectory',
      'task-export',
      'copy:uploadStatic'
  ]);

  return true;
};
