"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

const cssmin = require("gulp-cssmin");
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require("gulp-htmlmin");

const src = "./app";
const dest = "./dist";

gulp.task("js", () => {
    gulp.src(src + "/*.js")
        .pipe(babel({presets: ["es2015"]}))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task("html", () => {
    gulp.src(src + "/*.html")
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
    gulp.src(src + "/default.jpg")
        .pipe(gulp.dest(dest));
});

gulp.task("default", ["js", "html", "css", "etal"]);
