// npm i --save-dev gulp gulp-print gulp-util rimraf

// Server JS
// npm i --save-dev gulp-babel

var gulp = require('gulp')
var gutil = require('gulp-util')

// Server JS
var babel = require('gulp-babel')

// Client JS
var webpack = require('webpack')

// Other
var print = require('gulp-print')
var rimraf = require('rimraf')

function tellerror(err) {
	console.error('ERROR', err.message)
	this.emit('end')
}

gulp.task('default', [ 'js' ])

gulp.task('js', [ 'client-js' ], function() {
	return gulp.src([ 'src/**/*.js' ])
		.pipe(print())
		.pipe(babel({ stage: 1, optional: [ 'runtime' ] }))
		.on('error', tellerror)
		.pipe(gulp.dest('build'))
})

var clientJsCompiler = webpack(require('./webpack.config.js'))
gulp.task('client-js', function(cb) {
	clientJsCompiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError('client-js', err);
		gutil.log('client-js', stats.toString({
			colors: true,
			chunks: false,
			version: false,
			timings: false
		}))
		cb()	
	})
})

gulp.task('watch', [ 'default' ], function() {
	gulp.watch('src/**/*.js', [ 'js' ])
})

gulp.task('clean', function() {
	rimraf.sync('build')
})
