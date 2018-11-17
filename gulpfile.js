let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    globbing = require('gulp-css-globbing'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    flatten = require('gulp-flatten'),
    newer = require('gulp-newer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    child = require('child_process'),
    gutil = require('gulp-util'),
    siteRoot = '_site',
    devTasks = ['styles', 'vendor-js', 'js', 'resources', 'resources-files', 'jekyll-watch', 'serve'],
    prodTasks = ['styles', 'vendor-js', 'js', 'resources', 'resources-files', 'jekyll-build'];

gulp.task('styles', function() {
    return gulp.src('_assets/styles/application.scss') // IMPORT ANY OTHER VENDOR LIBS FROM THAT SRC FILE
        .pipe(flatten())
        .pipe(newer('src/**/*'))
        .pipe(sourcemaps.init())
        .pipe(globbing({extensions: '.scss'}))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(sourcemaps.write())
        .on('error', handleError)
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('vendor-js', function() {
    return gulp.src([ // INCLUDE ANY OTHER VENDOR LIBS HERE
        '_assets/js/vendor/**/*.js'
    ])
        .pipe(concat('application-vendor.js'))
        .pipe(uglify())
        .on('error', handleError)
        .pipe(gulp.dest('assets/js'));
});

gulp.task('js', function() {
    return gulp.src([
        '_assets/js/scripts/**/*.js',
    ])
        .pipe(sourcemaps.init())
        .on('error', handleError)
        .pipe(concat('application.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/js'));
});

gulp.task('resources', function() {
    return gulp.src('_assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}')
        .pipe(flatten())
        .pipe(newer('assets/resources'))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            svgoPlugins: []
        }))
        .on('error', handleError)
        .pipe(gulp.dest('assets/resources'));
});

gulp.task('resources-files', function() {
    return gulp.src(['_assets/resources/**/*', '!_assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}'])
        .pipe(flatten())
        .pipe(newer('assets/resources'))
        .on('error', handleError)
        .pipe(gulp.dest('assets/resources'));
});

gulp.task('jekyll-watch', () => {
//   const jekyll = child.spawn('jekyll', ['build',
//     '--watch',
//     '--incremental',
//     '--drafts'
//   ]);

  const jekyll = child.exec('jekyll build --watch --incremental');

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);

});

gulp.task('jekyll-build', () => {

  const jekyll = child.exec('jekyll build');

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);

});

gulp.task('serve', function() {

    browserSync.init({
     injectChanges: true,
     watch: true,
     ignore: ['_site', 'gulpfile.js'],
     port: 4000,
     server: {
       baseDir: siteRoot
     }
   });

    gulp.watch(['src/markup/**/*.{nunjucks,html}', '!src/vendor'], ['markup']);
    gulp.watch(['_assets/styles/**/*.scss'], ['styles']);
    gulp.watch(['_assets/js/scripts/**/*.js'], ['js']);
    gulp.watch(['_assets/js/vendor/**/*.js'], ['vendor-js']);
    gulp.watch(['_assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}'], ['resources']);
    gulp.watch(['_assets/resources/**/*', '!_assets/resources/**/*.{jpg,jpeg,png,gif,ico,svg}'], ['resources-files']);

    gulp.watch(['**/*.md', '**/*.html', 'assets/js/*.js', '.{jpg,jpeg,png,gif,ico,svg}', 'assets/styles/*.css']).on('change', function() {
        browserSync.reload();
    });

});

// Error reporting function
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('default', devTasks);
gulp.task('build', prodTasks);
