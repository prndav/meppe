module.exports = function (grunt) {

  /*
      Grunt set-up:
        npm install -g grunt-cli
        npm install -g grunt-init
        npm init

      Requirements:
        npm install grunt@devel --save-dev
        npm install grunt-contrib-watch --save-dev
        npm install grunt-contrib-jshint --save-dev
            At time of testing I needed more up to date version of jshint: npm install https://github.com/gruntjs/grunt-contrib-jshint/archive/7fd70e86c5a8d489095fa81589d95dccb8eb3a46.tar.gz --save-dev
        npm install grunt-contrib-uglify --save-dev
        npm install grunt-contrib-requirejs --save-dev
        npm install grunt-contrib-sass --save-dev
        npm install grunt-contrib-imagemin --save-dev
        npm install grunt-contrib-htmlmin --save-dev

   */

  // Project configuration.
  grunt.initConfig({

    watch: {
      files: ['**/*.scss'],
      tasks: 'sass'
    },

    requirejs: {
    },

    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        src: ['styles/sass/main.scss'],
        dest: 'styles/main.css'
      }
    }

  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-karma');
  // Default Task
  grunt.registerTask('default', ['sass']);

};
