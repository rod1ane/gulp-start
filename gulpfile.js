let fileswatch = 'html,htm,json'

const {src, dest, series, watch, parallel}   = require('gulp')
const sass          = require('gulp-sass')
const sync          = require('browser-sync').create()
const del           = require('del')
const autoprefixer  = require('gulp-autoprefixer')
const rename        = require('gulp-rename')
const notify        = require('gulp-notify')
const concat        = require('gulp-concat')


function commonJs() {
  return src('app/js/common.js')
    .pipe(concat('common.min.js'))
    .pipe(dest('app/js'))
}

function scripts() {
	return src([
		'app/libs/jquery/dist/jquery.min.js',
		// 'app/libs/owl-carousel/owl.carousel.js',
		// 'app/libs/jquery.formstyler.js',
		'app/libs/jquery.matchHeight-min.js',
		// 'app/libs/ofi.min.js',
		// 'app/libs/swiper.js',
		// 'app/libs/jquery.fancybox.min.js',
		// 'app/libs/jquery.responsiveTabs.min.js',
		// 'app/libs/jquery.doubletaptogo.js',
		// 'app/libs/jquery.mmenu.all.min.js',
		// 'app/libs/rellax.min.js',
		// 'app/libs/handorgel.min.js',
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(dest('app/js'))
	.pipe(sync.stream());
}

function browsersync() {
	sync.init({
		server: { baseDir: 'app/' },
		notify: false,
		online: true,
		open: false
	})
}

function styles() {
	return src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(dest('app/css'))
	.pipe(sync.stream())
}

function startwatch() {
	watch('app/sass/**/*.sass', { usePolling: true }, styles)
	watch(['app/**/*.js', 'app/js/common.js'], { usePolling: true }, series(commonJs, scripts))
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', sync.reload)
}
function removedist() {
  return del('dist', { force: true })
}

function distHtml() {
  return src([
    'app/*.html',
    ]).pipe(dest('dist'))
}
function distStyle() {
  return src([
		'app/css/main.min.css',
		]).pipe(dest('dist/css'));
}
function distScripts() {
    return src([
      'app/js/scripts.min.js',
      ]).pipe(dest('dist/js'));
}
function distPictures() {
    return src([
      'app/img/**/*',
      ]).pipe(dest('dist/img'));
}

function distFonts() {
    return src([
		'app/fonts/**/*',
		]).pipe(dest('dist/fonts'));
    
}

// run server
exports.default = series(commonJs, scripts, styles, parallel(browsersync, startwatch));

// build project
exports.build = series(removedist, styles, scripts, parallel(distHtml, distStyle, distScripts, distPictures, distFonts));