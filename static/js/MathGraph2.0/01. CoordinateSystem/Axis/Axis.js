function Axis(zero, unit) {

    var _self = this;

    var _unit = unit || new Point(0, 1);
    this.__defineGetter__('unit', function () {
        return _unit;
    });
    this.__defineSetter__('unit', function (p) {
        _unit = p;
        _update();
    });

    var _zero = zero || new Point(0, 0);
    this.__defineGetter__('zero', function () {
        return _zero;
    });
    this.__defineSetter__('zero', function (p) {
        _zero = p;
        _update();
    });


    var _start, _end;
    var _calcAxis = function () {
        _end = new Point(1, 0);
        _end.angle = _unit.angle;
        _end.length = DIAGONAL;
        var _tmp = new Path.Line(_zero, _end);
        _tmp.position = _zero;
        var _pts = getViewIntersections(_tmp);
        var scale = 1;
        while (_pts.length < 2) {
            scale += 0.1;
            console.error('No axis view intersections. Scale: ', scale);
            _pts = getViewIntersections(_tmp, scale);
        }
        _tmp.remove();
        var p0 = _pts[0];
        var p1 = _pts[_pts.length - 1];
        if (Math.abs((p1 - p0).angle - _unit.angle) <= Math.abs((p0 - p1).angle - _unit.angle)) {
            _start = p0;
            _end = p1;
        } else {
            _start = p1;
            _end = p0;
        }
    };
    var _pathAxis;
    var _drawAxis = function () {
        if (!isDefined(_pathAxis)) {
            _pathAxis = new Path();
        }
        _pathAxis.visible = _axisVisible && _visible;
        _pathAxis.removeSegments(0);
        _pathAxis.addSegments([_start, _end]);
        var piece = _end - _start;
        var arrow = piece.normalize(AXIS_ARROW_LENGTH);
        _pathAxis.addSegments([_end, _end + arrow.rotate(AXIS_ARROW_ANGLE),
            _end, _end + arrow.rotate(-AXIS_ARROW_ANGLE), _end]);
        _pathAxis.sendToBack();
        _pathAxis.style = _axisStyle;
    };
    var _updateAxis = function () {
        _calcAxis();
        _drawAxis();
    };
    var _axisStyle = currentAxisStyle;
    this.__defineGetter__('axisStyle', function () {
        return _axisStyle;
    });
    this.__defineSetter__('axisStyle', function (p) {
        _axisStyle = p;
        if (isDefined(_pathAxis)) {
            _pathAxis.style = _axisStyle;
        }
    });
    var _axisVisible = true;
    this.__defineGetter__('axisVisible', function () {
        return _axisVisible;
    });
    this.__defineSetter__('axisVisible', function (p) {
        _axisVisible = p;
        _pathAxis.visible = _axisVisible && _visible;
        if (_pathAxis.visible) {
            _updateAxis();
        }
    });

    var _tickVec, _ticksPosNum, _ticksNegNum;
    var _signs = 0;
    var _calcTicks = function () {
        _signs = 0;
        _tickVec = _unit;
        while (_tickVec.length < AXIS_TICK_STEP_MIN) {
            _tickVec *= 2;
        }
        while (_tickVec.length > AXIS_TICK_STEP_MAX) {
            _tickVec /= 2;
            _signs += 1;
        }
        _ticksPosNum = Math.floor((_end - _zero).length / _tickVec.length) - 1;
        _ticksNegNum = Math.floor((_zero - _start).length / _tickVec.length) - 1;
    };
    var _pathTicks;
    var _drawTicks = function () {
        if (typeof(_pathTicks) !== 'undefined') {
            _pathTicks.remove();
        }
        _pathTicks = new Group();
        _pathTicks.visible = _ticksVisible && _visible;
        var i, offset, n, p;

        for (i = 0; i <= _ticksPosNum; i++) {
            offset = (_zero - _start).length + _tickVec.length * i;
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH;
            _pathTicks.addChild(new Path.Line(n + p, n.rotate(180) + p));
        }

        for (i = 0; i >= -_ticksNegNum; i--) {
            offset = (_zero - _start).length + _tickVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
                continue;
            }
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH;
            _pathTicks.addChild(new Path.Line(n + p, n.rotate(180) + p));
        }
        _pathTicks.style = _tickStyle;
    };
    var _updateTicks = function () {
        _calcTicks();
        _drawTicks();
    };
    var _tickStyle = currentTickStyle;
    this.__defineGetter__('tickStyle', function () {
        return _tickStyle;
    });
    this.__defineSetter__('tickStyle', function (p) {
        _tickStyle = p;
        if (isDefined(_pathTicks)) {
            _pathTicks.style = _tickStyle;
        }
    });
    var _ticksVisible = true;
    this.__defineGetter__('ticksVisible', function () {
        return _ticksVisible;
    });
    this.__defineSetter__('ticksVisible', function (p) {
        _ticksVisible = p;
        _pathTicks.visible = _ticksVisible && _visible;
        if (_pathTicks.visible) {
            _updateTicks();
        }
    });

    var _labelVec, _labelsPosNum, _labelsNegNum;
    var _labelZero = false;
    var _calcLabels = function () {
        _labelVec = _tickVec * 1;//_unit * Math.floor((AXIS_TICK_STEP / _unit.length)) * 2;
        _labelsPosNum = Math.floor((_end - _zero).length / _labelVec.length) - 1;
        _labelsNegNum = Math.floor((_zero - _start).length / _labelVec.length) - 1;
    };
    var _pathLabels;
    var _drawLabels = function () {
        if (typeof(_pathLabels) !== 'undefined') {
            _pathLabels.remove();
        }
        _pathLabels = new Group();
        _pathLabels.visible = _labelsVisible && _visible;
        var i, offset, n, p;

        for (i = 0; i <= _labelsPosNum; i++) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_zero - _start).length + _labelVec.length * i;
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH + _labelStyle.fontSize;
            _pathLabels.addChild(new PointText({
                point: n.rotate(180) * 1.5 + p,
                content: ((p - _zero).length / _unit.length).toFixed(_signs)
            }));
        }

        for (i = 0; i >= -_labelsNegNum; i--) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_zero - _start).length + _labelVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
            }
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH + _labelStyle.fontSize;
            var tmp = new PointText({
                point: n.rotate(180) * 1.5 + p,
                content: -((p - _zero).length / _unit.length).toFixed(_signs)
            });
            _pathLabels.addChild(tmp);
        }
        _pathLabels.style = _labelStyle;
    };
    var _updateLabels = function () {
        _calcLabels();
        _drawLabels();
    };
    var _labelStyle = currentLabelStyle;
    this.__defineGetter__('labelStyle', function () {
        return _labelStyle;
    });
    this.__defineSetter__('labelStyle', function (p) {
        _labelStyle = p;
        if (isDefined(_pathLabels)) {
            _pathLabels.style = _labelStyle;
        }
    });
    var _labelsVisible = true;
    this.__defineGetter__('labelsVisible', function () {
        return _labelsVisible;
    });
    this.__defineSetter__('labelsVisible', function (p) {
        _labelsVisible = p;
        _pathLabels.visible = _labelsVisible && _visible;
        if (_pathLabels.visible) {
            _updateLabels();
        }
    });

    var _gridVec, _gridPosNum, _gridNegNum;
    var _calcGrid = function () {
        _gridVec = _tickVec;//_unit * Math.floor((AXIS_TICK_STEP / _unit.length));
        _gridPosNum = Math.floor((_end - _zero).length / _gridVec.length) - 1;
        _gridNegNum = Math.floor((_zero - _start).length / _gridVec.length) - 1;
    };
    var _pathGrid;
    var _drawGrid = function () {
        if (typeof(_pathGrid) !== 'undefined') {
            _pathGrid.remove();
        }
        _pathGrid = new Group();
        _pathGrid.visible = _gridVisible && _visible;
        var i, offset, n, p;

        for (i = 0; i <= _gridPosNum; i++) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_zero - _start).length + _gridVec.length * i;
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = DIAGONAL;
            var tmp = new Path.Line(n + p, n.rotate(180) + p);
            tmp.remove();
            var pts = getViewIntersections(tmp);
            _pathGrid.addChild(new Path.Line(pts[0], pts[1]));
        }

        for (i = 0; i >= -_gridNegNum; i--) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_zero - _start).length + _gridVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
            }
            n = _pathAxis.getNormalAt(offset);
            p = _pathAxis.getPointAt(offset);
            n.length = DIAGONAL;
            var tmp = new Path.Line(n + p, n.rotate(180) + p);
            tmp.remove();
            var pts = getViewIntersections(tmp);
            _pathGrid.addChild(new Path.Line(pts[0], pts[1]));
        }
        _pathGrid.sendToBack();
        _pathGrid.style = _gridStyle;
    };
    var _updateGrid = function () {
        _calcGrid();
        _drawGrid();
    };
    var _gridStyle = currentGridStyle;
    this.__defineGetter__('gridStyle', function () {
        return _gridStyle;
    });
    this.__defineSetter__('gridStyle', function (p) {
        _gridStyle = p;
        _pathGrid.style = _gridStyle;
    });
    var _gridVisible = true;
    this.__defineGetter__('gridVisible', function () {
        return _gridVisible;
    });
    this.__defineSetter__('gridVisible', function (p) {
        _gridVisible = p;
        _pathGrid.visible = _gridVisible && _visible;
        if (_pathGrid.visible) {
            _updateGrid();
        }
    });


    var _update = function () {
        if (_axisVisible && _visible) {
            _updateAxis();
        }
        if (_ticksVisible && _visible) {
            _updateTicks();
        }
        if (_labelsVisible && _visible) {
            _updateLabels();
        }
        if (_gridVisible && _visible) {
            _updateGrid();
        }
        _onUpdate();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });
    var _visible = true;
    this.__defineGetter__('visible', function () {
        return _visible;
    });
    this.__defineSetter__('visible', function (p) {
        _visible = p;
        _self.axisVisible = _axisVisible && _visible;
        _self.ticksVisible = _ticksVisible && _visible;
        _self.labelsVisible = _labelsVisible && _visible;
    });

    var _rotate = function (delta) {
        _self.unit = _self.unit.rotate(delta);
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _translate = function (delta) {
        _self.zero = _self.zero + delta;
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _scale = function (ratio) {
        _self.unit = _self.unit * ratio;
    };
    this.__defineGetter__('scale', function () {
        return _scale;
    });

    this.__defineGetter__('right', function () {
        return (_end - _zero).length / _unit.length;
    });
    this.__defineGetter__('left', function () {
        return -(_start - _zero).length / _unit.length;
    });
    this.__defineGetter__('middle', function () {
        return (_self.right + _self.left) / 2;
    });

    var _getPoint = function (x) {
        return _zero + _unit * x;
    };
    this.__defineGetter__('getPoint', function () {
        return _getPoint;
    });

    var _getTickPoint = function (x) {
        return _tickVec.length * x / _unit.length;
    };
    this.__defineGetter__('getTickPoint', function () {
        return _getTickPoint;
    });

    this.__defineGetter__('tickSize', function () {
        return _tickVec.length / _unit.length;
    });

    var _onUpdate = function () {};
    this.__defineGetter__('onUpdate', function () {
        return _onUpdate;
    });
    this.__defineSetter__('onUpdate', function (p) {
        _onUpdate = p;
    });

    var _get = function (key) {
        return _self[key];
    };
    this.__defineGetter__('get', function () {
        return _get;
    });
    var _set = function (key, val) {
        _self[key] = val;
    };
    this.__defineGetter__('set', function () {
        return _set;
    });

    this.__defineGetter__('ghost', function () {
        return _pathAxis.clone();
    });

    _update();
}