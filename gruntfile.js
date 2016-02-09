module.exports = function(grunt){
  grunt.initConfig({

    jasmine_nodejs: {
      options: {
         specNameSuffix: ".specs.js", // also accepts an array
         helperNameSuffix: ".helpers.js",
         useHelpers: true,
         reporters: {
           console: {
             colors: true,
             cleanStack: 1,       // (0|false)|(1|true)|2|3
             verbosity: 3,        // (0|false)|1|2|(3|true)
             listStyle: "indent", // "flat"|"indent"
             activity: false
           }
         },
      },

      rabbus: {
        helpers: ["specs/helpers/**"],
        specs: ["specs/**/*.specs.js"]
      }
    },

    jshint: {
      rabbus: {
        src: ["lib/**/*.js"],
        options: {
          jshintrc: ".jshintrc"
        }
      },
      specs: {
        src: ["specs/**/*.js"],
        options: {
          jshintrc: ".jshintrc-specs"
        }
      }
    },

    watch: {
      rabbus: {
        files: ["lib/**/*.js", "specs/**/*.js"],
        tasks: ["specs"]
      }
    }

  });

  grunt.registerNpmTasks("grunt-contrib-jshint");
  grunt.registerNpmTasks("grunt-contrib-watch");
  grunt.registerNpmTasks("grunt-jasmine-nodejs");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("specs", ["jshint", "jasmine_nodejs"]);
};
