Circle.Rotator = function() {
    Circle.Rotator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _ghostCircle = undefined;
    var _ghostArc = undefined;
    var _ghostLineFrom = undefined;
    var _ghostLineTo = undefined;
    var _angle0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    var _point0;
    var _g_center;

    this.onEdit = function(point) {
        if (this.level == 0) {
            _ghost = (new Ghost(this.object)).path;

            _g_center = this.object.coordinateSystem.localToGlobal(this.object.center);
            _angle0 = (this.object.coordinateSystem.globalToLocal(point) - this.object.center).angle;
            var _tmp = new Point(this.object.radius, 0);
            _tmp.angle = _angle0;
            _tmp += this.object.center;
            _tmp = this.object.coordinateSystem.localToGlobal(_tmp);

            _ghostCircle = (new Path.Circle({
                center: _g_center,
                radius: (_tmp - _g_center).length
            }));
            _ghostArc = new Path();
            _ghostArc.dashArray = [5, 5];

            _ghostLineFrom = new Path.Line(_g_center, _tmp);
            _ghostLineFrom.dashArray = [5, 5];
            _ghostLineTo = _ghostLineFrom.clone();

            colorGhostGroup(new Group([_ghost, _ghostCircle, _ghostArc, _ghostLineFrom, _ghostLineTo]));
            _point0 = point;

            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            var _p = _ghostCircle.getNearestPoint(point);

            var _ca = calcArcByAngles(_g_center, (_p - _g_center).length / 5, 0, (_p - _g_center).angle - _angle0, _angle0);
            var _style = _ghostArc.style;
            if (isDefined(_ghostArc)) {
                _ghostArc.remove();
            }

            _ghostArc = new Path.Arc(_ca);
            _ghostArc.style = _style;

            _ghostLineTo.removeSegment(_ghostLineTo.segments.length - 1);
            _ghostLineTo.addSegment(_p);

            _deltaAbs = (_p - _g_center).angle - _angle0 - _angle0;
            if (_angle0 == 0) {
                _deltaRel = 0;
            } else {
                _deltaRel = ((_p - _g_center).angle - _angle0) / _angle0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (isDefined(_ghost)) {
                _ghost.remove();
                _ghostCircle.remove();
                _ghostArc.remove();
                _ghostLineFrom.remove();
                _ghostLineTo.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };

};
extend(Circle.Rotator, Rotator);