var webpack = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-remap-coverage'),
      require('karma-sourcemap-loader'),
      require('karma-mocha-reporter'),
      require('karma-jasmine-html-reporter'),
    ],
    customLaunchers: {
      // Chrome setup for CI (Travis, Docker, ...)
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
	  '--no-sandbox',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      }
    },
    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': config.hasCoverage ? ['coverage', 'webpack', 'sourcemap'] : ['webpack', 'sourcemap']
    },

    webpack: webpack.getConfig(config.hasCoverage, config.autoWatch),

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i.e.
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e.
        chunks: true
      }
    },

    // save interim raw coverage report in memory
    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      lcovonly: './coverage/coverage.lcov',
      html: './coverage/html'
    },

    mochaReporter: {
      output: 'autowatch',
    },

    reporters: config.hasCoverage ? ['mocha', 'kjhtml', 'coverage', 'remap-coverage'] : ['mocha', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    failOnEmptyTestSuite: false,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true
  };

  config.set(_config);
};
