module.exports = function (grunt) {

  grunt.initConfig({
    exec: {
      "run": {
        cmd: function (command) {
          return command;
        }
      }
    },
    svgstore: {
      options: {
        svg: {
          xmlns: 'http://www.w3.org/2000/svg',
          style: "display: none"
        }
      },
      default : {
        files: {
          'public/assets/emoji-one/emoji.svg': ['vendor/emoji-one/*.svg']
        }
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
        quiet: grunt.option('quiet')
      },
      target: ['addon', 'app', 'config', 'tests/integration', 'tests/unit', 'tests/acceptance']
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('bamboo-eslint', function() {
    grunt.config.set('eslint.options.format', 'junit');
    grunt.config.set('eslint.options.outputFile', 'linter-xunit.xml');
    grunt.config.set('eslint.options.quiet', true);
    grunt.task.run(['eslint']);
  });

  grunt.registerTask('test', function () {
    //for development
    var server = grunt.option("server") || grunt.option("s");

    var command = 'ember test';
    if (server) {
      command += " --server";
    }
    var testExecTask = 'exec:run:' + command;

    var tasks = [testExecTask];
    grunt.task.run(tasks);
  });

  grunt.registerTask('bamboo-test', function () {
    grunt.task.run(['exec:run:ember test --silent -r xunit > report-xunit.xml']);
  });

  grunt.registerTask('generateSVG', ['svgstore']);
};
