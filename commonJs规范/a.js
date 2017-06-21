/**
 * Created by DL on 2017/5/16.
 */
/*
var x = 66;
function x_change(i) {
    x = i
}*/
var a =1;
function test(){

    console.log(a);// undefined
    a=4;
    console.log(a);// 4
    console.log(a);// 4
    var a;

}
test();
console.log(a);// 1