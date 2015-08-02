Straight.Resizer = function() {
    Straight.Resizer.superclass.constructor.call(this);

    var _length0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;

    this.onEdit = function(point) {
        if (this.level == 0) {
            var _g_from = this.object.coordinateSystem.localToGlobal(this.object.point1);
            var _g_to = this.object.coordinateSystem.localToGlobal(this.object.point2);
            var _p, _arrow;
            var _piece = _g_to - _g_from;
            _length0 = this.object.length;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.point2 = this.object.coordinateSystem.globalToLocal(this.object.path.children[0].getNearestPoint(point));
            _deltaAbs = this.object.length - _length0;
            if (_length0 != 0) {
                _deltaRel = this.object.length / _length0;
            } else {
                _deltaRel = 0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            _helpBox.remove();
        }
    };
};
extend(Straight.Resizer, Resizer);