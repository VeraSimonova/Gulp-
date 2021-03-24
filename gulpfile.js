const { src, dest, gulp, parallel, series, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const concat = require('gulp-concat');

const pathProject = {
	'src': "./src/",
	'dest': "./dest/"
};

function dropImages(){
	return src([pathProject.src + "images/**/*.jpg", pathProject.src + "images/**/*.png"])
		.pipe(imagemin())
		.pipe(dest(pathProject.dest + "images"));
}
// компиляции файлов less и перенос в папку css 
function less1(){
	return src(pathProject.src + "less/pages/*.less")
		.pipe(less())
		.pipe(dest(pathProject.src +"less/css"))
		.pipe(browserSync.stream());
}

function concatCSSexport(){
	return src(pathProject.src + 'less/css/*.css')
	.pipe(concat("style.min.css"))
	.pipe(dest(pathProject.dest + "css"))
	.pipe(browserSync.stream());
}

function html(){
	return src(pathProject.dest + "*.html")
		.pipe(dest(pathProject.dest ))
		.pipe(browserSync.stream());
}

function pugCompile(){
	return src(pathProject.src + "pug/index.pug")
		.pipe(pug())
		.pipe(dest(pathProject.dest ))
		.pipe(browserSync.stream());
}

function bootstrapCss(){
	return src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
		.pipe(dest(pathProject.src + "css"));
}

function bootstrapJS(){
	return src("./node_modules/bootstrap/dist/js/bootstrap.js")
		.pipe(dest(pathProject.dest + "js"));
}

function resetCss(){
	return src("./node_modules/reset.css/reset.css")
		.pipe(dest(pathProject.dest + "css"));
}

function autoReload(){
	browserSync.init({
		server: {
			baseDir: "./dest"
		},
		browser: 'chrome',
		notify: false
	});

	browserSync.watch(pathProject.src + "pug/**/*.pug", pugCompile);
	browserSync.watch(pathProject.src + "less/css/*.css", concatCSSexport);
	browserSync.watch(pathProject.src + "less/**/*.less", less1);
}
function fontawesomeFontsIco(){
    return src('./node_modules/@fortawesome/fontawesome-free/webfonts/*.*')
        .pipe(dest("./dest/webfonts"));
}
function fontawesomeIco(){
    return src('./node_modules/@fortawesome/fontawesome-free/css/all.min.css')
        .pipe(dest("./src/less/css"));
}




exports.build = series(resetCss, bootstrapCss, bootstrapJS, dropImages, less1, pugCompile);
//exports.drop = dropImages;
//exports.less = less1;
exports.watch = autoReload;
exports.font = fontawesomeFontsIco;
exports.ico = fontawesomeIco;
exports.concatCss = concatCSSexport;