var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var browserify   = require('browserify');
var debowerify   = require('debowerify');
var source       = require('vinyl-source-stream');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var sass         = require('gulp-sass');
var watch        = require('gulp-watch');
var minifycss    = require('gulp-minify-css');
var uglify       = require('gulp-uglify');
var streamify    = require('gulp-streamify');
var prod         = gutil.env.prod;

var onError = function(err) {
  console.log(err.message);
  this.emit('end');
};

// bundling js with browserify and watchify
var b = watchify(browserify('./assets/js/main', {
  cache: {},
  packageCache: {},
  fullPaths: true,
  transform: [debowerify]
}));

gulp.task('js', gulpSequence(['bundle', 'vendor']) );
b.on('log', gutil.log);

gulp.task('bundle', function() {
  return b.bundle()
    .on('error', onError)
    .pipe(source('bundle.js'))
    .pipe(prod ? streamify(uglify()) : gutil.noop())
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(browserSync.stream());
});

// Raphael doesn't like being required, this is a hacky workaround
gulp.task('vendor', function() {
  return gulp.src('./assets/js/vendor/*.js')
    .pipe(gulp.dest('./dist/scripts/vendor'));
});

// sass
gulp.task('sass', function() {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass({
      includePaths: []
    }))
    .on('error', onError)
    .pipe(prod ? minifycss() : gutil.noop())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.stream());
});


// browser sync server for live reload
gulp.task('serve', function() {
  browserSync.init({
    // browser: "Google Chrome Canary",
    proxy: "http://publicinterventions.dev"
  });

  gulp.watch('./assets/scss/**/*.scss', ['sass']);
  gulp.watch('./assets/js/**/*.js', ['bundle']);

});

// use gulp-sequence to finish building sass and js before first page load
gulp.task('default', gulpSequence(['sass', 'js'], 'serve'));

// Build task for production
gulp.task('build', ['sass', 'js']);