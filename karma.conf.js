module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'fixture'],
        files: [
            "index.js",
            "testing/helpers/**/*.js",
            "testing/specs/**/*.js",
            "testing/**/*.html"
        ],
        browsers: [
            "Chrome",
            "Firefox",
            "Safari",
            "Opera"
        ],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'index.js': ['coverage'],
            "testing/**/*.html": ['html2js']
        },
        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage', 'kjhtml'],
        coverageReporter: {
            dir: 'coverage/',
            reporters: [{
                type: 'html',
                subdir: 'html'
            }, {
                type: 'lcov',
                subdir: 'lcov'
            }]
        },
        plugins: [
            'karma-fixture',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            "karma-opera-launcher",
            "karma-safari-launcher",
            'karma-jasmine-html-reporter',
            'karma-coverage',
            'karma-html2js-preprocessor'
        ]
    });
};
