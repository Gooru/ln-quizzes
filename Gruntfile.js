module.exports = function (grunt) {

  grunt.initConfig({
    exec: {
      "run": {
        cmd: function (command) {
          return command;
        }
      },
      "ember-serve": 'QUIZZES_EMBEDDED=true ember serve',
    },
    stubby: {
      test: {
        options: {
          relativeFilesPath: true,
          persistent: false,
          mute: true,
          location: "0.0.0.0"
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
      },
      server: {
        options: {
          relativeFilesPath: true,
          persistent: true,
          mute: false,
          location: "0.0.0.0"
        },
        files: [{
          src: ['tests/stubs/**/*-endpoint.json']
        }]
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

  grunt.loadNpmTasks('grunt-stubby');
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
    var noStubby = grunt.option("no-stubby") || grunt.option("ns"),
      server = grunt.option("server") || grunt.option("s");

    var command = 'ember test';
    if (server) {
      command += " --server";
    }
    var testExecTask = 'exec:run:' + command;

    var tasks = noStubby ? [testExecTask] : ['stubby:test', testExecTask];
    grunt.task.run(tasks);
  });

  grunt.registerTask('bamboo-test', function () {
    grunt.task.run(['stubby:test', 'exec:run:ember test --silent -r xunit > report-xunit.xml']);
  });

  grunt.registerTask('run', function (target) {
    var serverExecTask = 'exec:ember-serve';

    var tasks = ['generateSVG'];
    tasks.push(serverExecTask);
    grunt.task.run(tasks);
  });

  grunt.registerTask('generateSVG', ['svgstore']);
};
