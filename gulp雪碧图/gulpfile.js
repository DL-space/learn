/**
 * Created by DL on 2017/7/20.
 */
var gulp = require("gulp");
var spritesmith = require("gulp.spritesmith");

/*需要合并的图片地址*/
var spritesSrc = 'images/sprites/*.png';

gulp.task('sprite', function () {
    return gulp.src(spritesSrc)
        .pipe(spritesmith({
            imgName: 'images/sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:10,//合并时两个图片的间距
            algorithm: 'top-down',//注释1
            //cssTemplate:"css/handlebarsStr.css"//注释2
        }))
        .pipe(gulp.dest('dist/'));
});
