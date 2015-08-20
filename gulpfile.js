var gulp = require('gulp'),
    argv = require('yargs').argv,
    bump = require('gulp-bump'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify');

gulp.task('bump', function() {
  var version = argv.version;
  var type = argv.type || "Major";
  var bumpTo = {};

  if (version !== undefined) {
    bumpTo.version = version;
  } else {
    bumpTo.type = type;
  }

  gulp.src(['./package.json', './bower.json'])
    .pipe(bump(bumpTo))
    .pipe(gulp.dest('./'));
});

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('copy', function() {
  return gulp.src('src/*.{js,css}')
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src(["src/*.css"])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src(['src/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(['./src/*.js', './src/*.css'], ['lint']);
});

gulp.task('default', function() {
    gulp.start('lint', 'release');
});

gulp.task('release', ['clean', 'bump', 'css', 'js', 'copy']);
