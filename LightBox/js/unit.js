/**
 * Created by DL on 2017/6/23.
 */
;(function () {
    var Unit = function () {
        var self = this;
        console.log(self);
        console.log(this);
        this.ceshi()
    };
    Unit.prototype = {
        ceshi:function () {
            console.log(self);
            console.log(this);
        }
    };
    window["Unit"] = Unit;
})(window);