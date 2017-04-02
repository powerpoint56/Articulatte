"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const htmlreplace = require("gulp-html-replace");

const cssmin = require("gulp-cssmin");
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require("gulp-htmlmin");

const src = "./app";
const dest = "./dist";

gulp.task("js", () => {
    gulp.src([`${src}/polyfills.js`, `${src}/jdom.js`, `${src}/chat.js`])
        .pipe(babel({presets: ["es2015"]}))
        .pipe(uglify())
        .pipe(concat("build.js"))
        .pipe(gulp.dest(dest));
});

gulp.task("html", () => {
    gulp.src(src + "/*.html")
        .pipe(htmlreplace({
          js: "build.js"
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dest));
});

gulp.task("css", () => {
    gulp.src(src + "/*.css")
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(dest));
});

gulp.task("etal", () => {
    gulp.src([src + "/default.jpg", src + "/fav.ico"])
        .pipe(gulp.dest(dest));
});

gulp.task("default", ["js", "html", "css", "etal"]);
