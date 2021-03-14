var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    autoprefixer = require('autoprefixer');

function browserSyncTask() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
}

function sassTask() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
}

function watchTask(){
  gulp.watch('app/scss/**/*.scss', gulp.series(sassTask)); 
  gulp.watch("app/*.html").on('change', browserSync.reload);
  gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
}

function optTask(){
  var plugins = [
    autoprefixer({browsers: ['last 3 version']}),
    cssnano()
  ];
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', postcss(plugins)))
    .pipe(gulp.dest('dist'))
}

function htmlMinifyTask() {
  return gulp.src('dist/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'))
}

function imgTask(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
.pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
])))
  .pipe(gulp.dest('dist/images'))
};

function fontTask() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
};



exports.start = gulp.parallel(browserSyncTask, sassTask , watchTask);
exports.build = gulp.series(optTask, htmlMinifyTask, imgTask, fontTask);