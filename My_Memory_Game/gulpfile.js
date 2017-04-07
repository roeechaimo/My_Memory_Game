var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var maps = require('gulp-sourcemaps');

gulp.task('connect', () => {
    connect.server({
        livereload: true
    });
});

gulp.task('sass', function() {
    return gulp.src('./sass/style.scss')
        .pipe( maps.init() )
        .pipe( sass({ expended: true }).on( 'error', sass.logError ) )
        .pipe( maps.write('./') )
        .pipe( gulp.dest('./css') )
        .pipe( connect.reload() )
});

gulp.task('html', function () {
    gulp.src('./index.html')
        .pipe( connect.reload() );
});

gulp.task('js', function () {
    gulp.src('./js/**.js')
        .pipe( connect.reload() );
});

gulp.task('default', () =>
    gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('watch', () => {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./sass/*/**.scss', ['sass']);
    gulp.watch('./js/*/**.js', ['js']);
});

gulp.task('prefixer', () =>
    gulp.src('css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
);

gulp.task('default', ['watch', 'connect', 'sass']);
