// npm i --save-dev gulp gulp-print gulp-util rimraf

// Server JS
// npm i --save-dev gulp-babel

var gulp = require('gulp')
var gutil = require('gulp-util')

// Server JS
var babel = require('gulp-babel')

// Client JS
var named = require('vinyl-named')
var insert = require('gulp-insert')
var rename = require('gulp-rename')
var webpack = require('webpack-stream')

// Other
var rimraf = require('rimraf')

function tellerror(err) {
	console.error('ERROR', err.message)
	this.emit('end')
}

gulp.task('default', [ 'js', 'client-js' ])

gulp.task('js', function() {
	return gulp.src([ 'src/{index,test}.js' ])
		.pipe(babel())
		.on('error', tellerror)
		.pipe(gulp.dest('build'))
})

gulp.task('client-js', function(cb) {
	return gulp.src('src/client.js')
		.pipe(named())
		.pipe(webpack({
			output: {
				library: '__output',
				libraryTarget: 'var'
			},
			module: {
				loaders: [{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel',
				}]
			}
		})).on('error', e => console.error(e.stack))
		.pipe(insert.append(`
if (typeof window != 'undefined')
	window.apiify = { client: __output.default }
if (typeof module != 'undefined' && typeof module.exports != 'undefined')
	module.exports = __output
`))
		.pipe(rename('client.js'))
		.pipe(gulp.dest('build'))
})

gulp.task('watch', [ 'default' ], function() {
	gulp.watch('src/**/*.js', [ 'js' ])
})

gulp.task('clean', function() {
	rimraf.sync('build')
})
