var _ = require('lodash'),
    path = require('path'),
    combine = require('stream-combiner'),
    htmlhintReporter = require('reporter-plus/htmlhint');

module.exports = function setupTemplatesPipeline(gulp) {
  return function templatesPipeline(options) {
    options = _.defaultsDeep({}, options, {
      doCheck: true,
      doMinify: false,
      doConcat: false,
      doBanner: false,
      doVersioning: false,

      concatName: 'override_me.tmpl.js',
      banner: '/* Built: ' + Date.now() + ' */\n',

      htmlMinifyOptions: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true
        },
      ngHtml2JsOptions: {
          declareModule: false,
          moduleName: 'override.me',
          rename: function (templateURL) {
              return path.parse(templateURL).base;
            }
        },
      renameOptions: {
          extname: '.tmpl.js'
        },
      minifyRenameOptions: {
          extname: '.min.js'
        }
    });

    return combine(_.compact([
      // Checking pipeline
      options.doCheck && require('gulp-htmlhint')({
          htmlhintrc: path.join('node_modules', 'web-tools', 'runcoms', 'rc.htmlhint.json')
        }),
      options.doCheck && require('gulp-htmlhint').reporter(htmlhintReporter),

      // Processing pipeline
      options.doMinify && require('gulp-htmlmin')(options.htmlMinifyOptions),
      require('gulp-trim')(),
      require('gulp-ng-html2js')(options.ngHtml2JsOptions),
      require('gulp-rename')(options.renameOptions),

      // Productionization pipeline
      options.doMinify && require('gulp-uglify')(),
      options.doConcat && require('gulp-concat')(options.concatName),
      options.doBanner && require('gulp-header')(options.banner),
      options.doVersioning && require('gulp-rev')(),
      options.doMinify && require('gulp-rename')(options.minifyRenameOptions)
    ]));
  };
};
