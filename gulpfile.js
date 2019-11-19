var gulp = require("gulp");
var rename = require("gulp-rename");
var scss = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var browserSync = require("browser-sync").create();
var iconfont = require("gulp-iconfont");
var iconfontCss = require("gulp-iconfont-css");

function sync(cb) {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });

  cb();
}

gulp.task("sync", sync);

function compileStyle(cb) {
  gulp
    .src("./scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: "compressed",
        errLogToConsole: true
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./src"))
    .pipe(browserSync.stream());

  cb();
}
gulp.task("compileStyle", compileStyle);

function imageBuild(cb) {
  gulp.src("./components/img/**/*.*").pipe(
    imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    })
  );

  gulp
    .src("./components/img/**/*.*")
    .pipe(gulp.dest("./src/img"))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

gulp.task("imageBuild", imageBuild);

var fontName = "icons";

// add svg icons to the folder "icons" and use 'iconfont' task for generating icon font
function iconBuild(cb) {
 
    gulp
      .src("./src/icons/*.svg")
      .pipe(
        iconfontCss({
          // где будет наш scss файл
          targetPath: "../components/icons.scss",
          // пути подлючения шрифтов в _icons.scss
          fontPath: "./src/fonts/",
          fontName: fontName
        })
      )
      .pipe(
        iconfont({
          fontName: fontName,
          formats: ["svg", "ttf", "eot", "woff", "woff2"],
          normalize: true,
          fontHeight: 1001
        })
      )
      .pipe(gulp.dest("./src/fonts/"))
      .pipe(browserSync.reload({ stream: true }));

  cb();
}

gulp.task("iconBuild", iconBuild);

function watchFiles(cb) {
  gulp.watch("./scss/*.scss", compileStyle);
  gulp.watch("./src/icons/*.svg", iconBuild);
  cb();
}

function browserReload(cb) {
  browserSync.reload();
  cb();
}

function build(cb) {
  compileStyle(cb);
  imageBuild(cb);
  iconBuild(cb);

  cb();
}

gulp.task("build", build);

gulp.task("default", gulp.parallel(build, sync, watchFiles));
