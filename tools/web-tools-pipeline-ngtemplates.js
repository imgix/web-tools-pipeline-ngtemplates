module.exports = function setUpNgTemplatesPipeline(gulp) {
  gulp.pipelineCache.put('ngtemplates', require('./pipelines/pipeline.ngtemplates.js'));
};
