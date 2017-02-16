module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'app/models/**/*.js', 'app/schemas/**/*.js'],
        // tasks: ['jslint'],
        options: {
          options: {
            livereload: true
          }
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3400
          },
          cwd: __dirname
        }
      }
    },



    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']        
      }

    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.option('force', true);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('test', ['mochaTest']);
}