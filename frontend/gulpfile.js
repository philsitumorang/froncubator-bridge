const gulp = require('gulp')
const less = require('gulp-less')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const replace = require('gulp-replace')

gulp.task('desktop_js', function() {
    gulp.src([
        './scripts/app.js',
        './scripts/components/*.js'
    ])
    .pipe(babel({
        presets: ['es2015'],
        plugins: [
            "transform-es2015-block-scoping",
            "transform-es2015-arrow-functions",
            "transform-runtime",
            "syntax-async-functions"
        ]
    }))
    .pipe(concat("build.js"))
    .pipe(gulp.dest('./build/scripts'))

    gulp.src(['./libs/*.js'])
    .pipe(concat("libs.js"))
    .pipe(gulp.dest('./build/scripts'))
});

gulp.task('desktop_fonts', function() {
    gulp.src(['./fonts/*'])
    .pipe(gulp.dest('./build/fonts'))
})

gulp.task('desktop_less', function() {
    gulp.src(['./styles/*.less'])
    .pipe(concat('build.less'))
    .pipe(less())
    .pipe(gulp.dest('./build/css'))

    gulp.src(['./libs/*.css'])
    .pipe(concat("libs.css"))
    .pipe(gulp.dest('./build/css'))
});

gulp.task('desktop_images', function() {
    gulp.src(['./images/**/*'])
    .pipe(gulp.dest('./build/images'))
});

gulp.task("desktop", function() {
    gulp.start('desktop_js')
    gulp.start('desktop_less')
    gulp.start('desktop_images')
    gulp.start('desktop_fonts')
})

gulp.task('start_watch', function() {
    gulp.watch(['./styles/**/*.less'], ['desktop_less'])
    gulp.watch(['./scripts/**/*.js'], ['desktop_js'])
})

gulp.task('default', function() {
    gulp.start('desktop')
})

gulp.task('watch', function() {
    gulp.start('start_watch')
})