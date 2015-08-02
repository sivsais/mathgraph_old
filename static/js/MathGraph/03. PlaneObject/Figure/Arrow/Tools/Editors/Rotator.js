Arrow.Rotator = function() {
    Arrow.Rotator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _ghostCircle = undefined;
    var _ghostArc = undefined;
    var _angle0 = undefined;
    var _g_angle0 =  undefined;
    var _g_from, _g_to;

    this.onEdit = function(point) {
        if (this.level == 0) {
            _ghost = (new Ghost(this.object)).path;

            _g_from = this.object.coordSystem.localToGlobal(this.object.from);
            _g_to = this.object.coordSystem.localToGlobal(this.object.to);

            _ghostCircle = (new Path.Circle({
                center: _g_from,
                radius: (_g_to - _g_from).length
            }));
            _ghostArc = new Path();
            _ghostArc.dashArray = [5, 5];

            colorGhostGroup(new Group([_ghost, _ghostCircle, _ghostArc]));
            _angle0 = this.object.angle;
            _g_angle0 = (_g_to - _g_from).angle;
        }
        if (this.level == 1 || this.level == 2) {
            var _p = _ghostCircle.getNearestPoint(point);
            this.object.to = this.object.coordSystem.globalToLocal(_p);

            var _ca = calcArcByAngles(_g_from, (_p - _g_from).length / 5, 0, (_p - _g_from).angle - _g_angle0, _g_angle0);
            var _style = _ghostArc.style;
            if (isDefined(_ghostArc)) {
                _ghostArc.remove();
            }

            _ghostArc = new Path.Arc(_ca);
            _ghostArc.style = _style;

            this.deltaAbs = this.object.angle - _angle0;
            if (_angle0 == 0) {
                this.deltaRel = 0;
            } else {
                this.deltaRel = this.object.angle / _angle0;
            }
            this.deltaBox.on();
            this.deltaBox.refresh(point,
                ['Δ: ' + this.deltaAbs.toFixed(3) + 'º', '[' + this.deltaRel.toFixed(3) + 'x]']);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            this.deltaBox.off();
            if (isDefined(_ghost)) {
                _ghost.remove();
                _ghostCircle.remove();
                _ghostArc.remove();
                _ghost = undefined;
            }
        }
    };

};
extend(Arrow.Rotator, Rotator);