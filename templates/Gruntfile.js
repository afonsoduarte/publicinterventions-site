module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/style.css': 'css/style.scss'
        }        
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      html: {
        files: ['**/*.html'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: 'css/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
}