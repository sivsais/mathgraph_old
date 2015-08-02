Arrow.Resizer = function() {
    Arrow.Resizer.superclass.constructor.call(this);

    var _ghostArrow = undefined;
    var _ghostLine = undefined;
    var _length0 = undefined;

    this.onEdit = function(point) {
        if (this.level == 0) {
            if (isDefined(_ghostArrow)) {
                _ghostArrow.remove();
            }
            _ghostArrow = new Group();
            var _g_from = this.object.coordSystem.localToGlobal(this.object.from);
            var _g_to = this.object.coordSystem.localToGlobal(this.object.to);
            var _p, _arrow;
            var _piece = _g_to - _g_from;
            _ghostLine = new Path(_g_from);
            _ghostArrow = new Group();
            while (true) {
                _p = _ghostLine.lastSegment.point + _piece;
                _arrow = _piece.normalize(Math.min(_piece.length * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));

                _ghostArrow.addChild(new Path([_ghostLine.lastSegment.point, _p, _p + _arrow.rotate(ARROW_ANGLE),
                    _p, _p + _arrow.rotate(-ARROW_ANGLE), _p]));
                _ghostLine.add(_p);

                _piece = -_piece;

                _p = _ghostLine.firstSegment.point + _piece;
                _arrow = _piece.normalize(Math.min(_piece.length * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));

                _ghostArrow.addChild(new Path([_ghostLine.firstSegment.point, _p, _p + _arrow.rotate(ARROW_ANGLE),
                    _p, _p + _arrow.rotate(-ARROW_ANGLE), _p]));
                _ghostLine.insertSegment(0, _p);

                _piece = -_piece;

                if (getViewIntersections(_ghostLine).length > 1) {
                    break;
                }
            }
            colorGhostGroup(_ghostArrow);
            _length0 = this.object.length;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.to = this.object.coordSystem.globalToLocal(_ghostLine.getNearestPoint(point));
            this.deltaAbs = this.object.length - _length0;
            if (_length0 != 0) {
                this.deltaRel = this.object.length / _length0;
            } else {
                this.deltaRel = 0;
            }
            this.deltaBox.on();
            this.deltaBox.refresh(point,
                ['Δ: ' + this.deltaAbs.toFixed(3), '[' + this.deltaRel.toFixed(3) + 'x]']);
            this.object.infoBox.refresh();
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            this.deltaBox.off();
            if (typeof(_ghostArrow) !== 'undefined') {
                _ghostLine.remove();
                _ghostArrow.remove();
                _ghostArrow = undefined;
            }
        }
    };
};
extend(Arrow.Resizer, Resizer);