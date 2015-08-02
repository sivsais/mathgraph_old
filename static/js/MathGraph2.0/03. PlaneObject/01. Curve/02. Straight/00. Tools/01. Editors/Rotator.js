Straight.Rotator = function() {
    Straight.Rotator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _ghostCircle = undefined;
    var _ghostArc = undefined;
    var _angle0 = undefined;
    var _g_angle0 =  undefined;
    var _g_from, _g_to;
    var _deltaAbs, _deltaRel;
    var _helpBox;

    this.onEdit = function(point) {
        if (this.level == 0) {
            _ghost = (new Ghost(this.object)).path;

            _g_from = this.object.coordinateSystem.localToGlobal(this.object.point1);
            _g_to = this.object.coordinateSystem.localToGlobal(this.object.point2);

            _ghostCircle = (new Path.Circle({
                center: _g_from,
                radius: (_g_to - _g_from).length
            }));
            _ghostArc = new Path();
            _ghostArc.dashArray = [5, 5];

            colorGhostGroup(new Group([_ghost, _ghostCircle, _ghostArc]));
            _angle0 = this.object.angle;
            _g_angle0 = (_g_to - _g_from).angle;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            var _p = _ghostCircle.getNearestPoint(point);
            this.object.point2 = this.object.coordinateSystem.globalToLocal(_p);

            var _ca = calcArcByAngles(_g_from, (_p - _g_from).length / 5, 0, (_p - _g_from).angle - _g_angle0, _g_angle0);
            var _style = _ghostArc.style;
            if (isDefined(_ghostArc)) {
                _ghostArc.remove();
            }

            _ghostArc = new Path.Arc(_ca);
            _ghostArc.style = _style;

            _deltaAbs = this.object.angle - _angle0;
            if (_angle0 == 0) {
                _deltaRel = 0;
            } else {
                _deltaRel = this.object.angle / _angle0;
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
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };

};
extend(Straight.Rotator, Rotator);