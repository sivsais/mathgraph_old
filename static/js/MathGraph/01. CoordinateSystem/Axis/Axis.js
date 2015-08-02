function Axis(unit, center) {

    var _unit = unit, _center = center;

    this.onChange = function () {};

    this.__defineGetter__('unit', function() {
        return _unit;
    });
    this.__defineSetter__('unit', function (p) {
        _unit = p;
        _update();
    });

    this.__defineGetter__('center', function () {
        return _center;
    });
    this.__defineSetter__('center', function (p) {
        _center = p;
        _update();
    });

    var _me = this;
    var _path, _start, _end;

    var _calc = function () {
        _end = new Point(1, 0);
        _end.angle = _unit.angle;
        _end.length = DIAGONAL;
        var _tmp = new Path.Line(_center, _end);
        _tmp.position = _center;
        var _pts = getViewIntersections(_tmp);
        var scale = 1;
        while (_pts.length < 2) {
            scale += 0.01;
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

    var _draw = function () {
        if (typeof(_path) !== 'undefined') {
            _path.remove();
        }
        _path = new Path.Line(_start, _end);
        var piece = _end - _start;
        var arrow = piece.normalize(AXIS_ARROW_LENGTH);
        _path.addSegments([_end, _end + arrow.rotate(AXIS_ARROW_ANGLE),
            _end, _end + arrow.rotate(-AXIS_ARROW_ANGLE), _end]);
        _me.style = currentCSStyle;
        _path.sendToBack();
    };

    var _updateAxis = function () {
        _calc();
        _draw();
    }

    var _style = undefined;

    this.__defineGetter__('style', function() {
        return _style;
    });
    this.__defineSetter__('style', function(p) {
        var pp = p.clone();
        if (typeof(_style) !== 'undefined') {
            _style.remove();
        }
        _style = pp.clone();
        pp.remove();
        if (typeof(_path)!== 'undefined') {
            for (var key in _style) {
                if (typeof(_style[key]) !== 'undefined' && typeof(_style[key]) != 'function') {
                    _path[key] = _style[key];
                }
            }
        }
    });

    var _rotate = function (delta) {
        this.unit = this.unit.rotate(delta);
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _translate = function (delta) {
        this.center = this.center + delta;
//        _center += delta;
//        _updateAxis()
//        _ticks.translate(delta);
//        _labels.translate(delta);
//        _grid.translate(delta);
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _scale = function (ratio) {
        this.unit = this.unit * ratio;
    };
    this.__defineGetter__('scale', function () {
        return _scale;
    });

    var _show = function () {
        _path.visible = true;
        _ticks.visible = _ticksVisible;
        _labels.visible = _labelsVisible;
    };
    this.__defineGetter__('show', function () {
        return _show;
    });

    var _hide = function () {
        _path.visible = false;
        _ticks.visible = false;
        _labels.visible = false;
    };
    this.__defineGetter__('hide', function () {
        return _hide;
    });

    var _toggle = function () {
        _path.visible = !_path.visible;
        if (_path.visible) {
            _ticks.visible = _ticksVisible;
            _labels.visible = _labelsVisible;
        }
    };
    this.__defineGetter__('toggle', function () {
        return _toggle;
    });

    var _right = 0, _left = 0, _middle = 0;
    this.__defineGetter__('right', function () {
        return parseFloat(((_end - _center).length / _unit.length).toFixed(2));
    });

    this.__defineGetter__('left', function () {
        return parseFloat(((_start - _center).length / _unit.length).toFixed(2));
    });

    this.__defineGetter__('middle', function () {
        return parseFloat((_me.right + _me.left) / 2);
    });



    var _ticks = undefined;

    var _tickStyle = undefined;

    this.__defineGetter__('tickStyle', function() {
        return _tickStyle;
    });
    this.__defineSetter__('tickStyle', function(p) {
        var pp = p.clone();
        if (typeof(_tickStyle) !== 'undefined') {
            _tickStyle.remove();
        }
        _tickStyle = pp.clone();
        pp.remove();
        if (typeof(_ticks)!== 'undefined') {
            for (var key in _tickStyle) {
                if (typeof(_tickStyle[key]) !== 'undefined' && typeof(_tickStyle[key]) != 'function') {
                    _ticks[key] = _tickStyle[key];
                }
            }
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
        _ticksPosNum = Math.floor((_end - _center).length / _tickVec.length) - 1;
        _ticksNegNum = Math.floor((_center - _start).length / _tickVec.length) - 1;
    };

    var _drawTicks = function () {
        if (typeof(_ticks) !== 'undefined') {
            _ticks.remove();
        }
        _ticks = new Group();
        var i, offset, n, p;

        for (i = 0; i <= _ticksPosNum; i++) {
            offset = (_center - _start).length + _tickVec.length * i;
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH;
            _ticks.addChild(new Path.Line(n + p, n.rotate(180) + p));
        }

        for (i = 0; i >= -_ticksNegNum; i--) {
            offset = (_center - _start).length + _tickVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
                continue;
            }
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH;
            _ticks.addChild(new Path.Line(n + p, n.rotate(180) + p));
        }

        _me.tickStyle = currentTickStyle;
        _ticks.visible = _ticksVisible;
    };

    var _updateTicks = function () {
        _calcTicks();
        _drawTicks();
    };

    var _ticksVisible = true;
    this.__defineGetter__('ticksVisible', function () {
        return _ticksVisible;
    });
    this.__defineSetter__('ticksVisible', function (p) {
        _ticksVisible = p;
        _ticks.visible = p;
        });



    var _labels = undefined;

    var _labelStyle = undefined;

    this.__defineGetter__('labelStyle', function() {
        return _labelStyle;
    });
    this.__defineSetter__('labelStyle', function(p) {
        var pp = p.clone();
        if (typeof(_labelStyle) !== 'undefined') {
            _labelStyle.remove();
        }
        _labelStyle = pp.clone();
        pp.remove();
        if (typeof(_labels)!== 'undefined') {
            for (var key in _labelStyle) {
                if (typeof(_labelStyle[key]) !== 'undefined' && typeof(_labelStyle[key]) != 'function') {
                    _labels[key] = _labelStyle[key];
                }
            }
        }
    });

    var _labelVec, _labelsPosNum, _labelsNegNum;
    var _labelZero = false;

    var _calcLabels = function () {
        _labelVec = _tickVec * 1;//_unit * Math.floor((AXIS_TICK_STEP / _unit.length)) * 2;
        _labelsPosNum = Math.floor((_end - _center).length / _labelVec.length) - 1;
        _labelsNegNum = Math.floor((_center - _start).length / _labelVec.length) - 1;
    };

    var _drawLabels = function () {
        if (typeof(_labels) !== 'undefined') {
            _labels.remove();
        }
        _labels = new Group();

        var i, offset, n, p;

        for (i = 0; i <= _labelsPosNum; i++) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_center - _start).length + _labelVec.length * i;
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH + currentLabelStyle.fontSize;
            _labels.addChild(new PointText({
                point: n.rotate(180) * 1.5 + p,
                content: ((p - _center).length / _unit.length).toFixed(_signs)
            }));
        }

        for (i = 0; i >= -_labelsNegNum; i--) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_center - _start).length + _labelVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
            }
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = AXIS_TICK_LENGTH + currentLabelStyle.fontSize;
            var tmp = new PointText({
                point: n.rotate(180) * 1.5 + p,
                content: -((p - _center).length / _unit.length).toFixed(_signs)
            });
//            var b = tmp.bounds;
//            var k = n.rotate(180);
//            k.length += Math.max(b.size.width, b.size.height);
//            tmp.translate(k);
            _labels.addChild(tmp);
        }

        _me.labelStyle = currentLabelStyle;
        _labels.visible = _labelsVisible;
    };

    var _updateLabels = function () {
        _calcTicks();
        _calcLabels();
        _drawLabels();
    };

    var _update = function () {
        _updateAxis();
        _updateTicks();
        _updateLabels();
        _updateGrid();
        _me.onChange();
    };

    var _labelsVisible = true;
    this.__defineGetter__('labelsVisible', function () {
        return _labelsVisible;
    });
    this.__defineSetter__('labelsVisible', function (p) {
        _labelsVisible = p;
        _labels.visible = p;
    });


    var _grid = undefined;

    var _gridStyle = undefined;

    this.__defineGetter__('gridStyle', function() {
        return _gridStyle;
    });
    this.__defineSetter__('gridStyle', function(p) {
        var pp = p.clone();
        if (typeof(_gridStyle) !== 'undefined') {
            _gridStyle.remove();
        }
        _gridStyle = pp.clone();
        pp.remove();
        if (typeof(_grid)!== 'undefined') {
            for (var key in _gridStyle) {
                if (typeof(_gridStyle[key]) !== 'undefined' && typeof(_gridStyle[key]) != 'function') {
                    _grid[key] = _gridStyle[key];
                }
            }
        }
    });

    var _gridVec, _gridPosNum, _gridNegNum;

    var _calcGrid = function () {
        _gridVec = _tickVec;//_unit * Math.floor((AXIS_TICK_STEP / _unit.length));
        _gridPosNum = Math.floor((_end - _center).length / _gridVec.length) - 1;
        _gridNegNum = Math.floor((_center - _start).length / _gridVec.length) - 1;
    };

    var _drawGrid = function () {
        if (typeof(_grid) !== 'undefined') {
            _grid.remove();
        }
        _grid = new Group();

        var i, offset, n, p;

        for (i = 0; i <= _gridPosNum; i++) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_center - _start).length + _gridVec.length * i;
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = DIAGONAL;
            var tmp = new Path.Line(n + p, n.rotate(180) + p);
            tmp.remove();
            var pts = getViewIntersections(tmp);
            _grid.addChild(new Path.Line(pts[0], pts[1]));
        }

        for (i = 0; i >= -_gridNegNum; i--) {
            if (i == 0 && !_labelZero) {
                continue;
            }
            offset = (_center - _start).length + _gridVec.length * i;
            if (offset < 0) {
                offset = (_end - _start).length + offset;
            }
            n = _path.getNormalAt(offset);
            p = _path.getPointAt(offset);
            n.length = DIAGONAL;
            var tmp = new Path.Line(n + p, n.rotate(180) + p);
            tmp.remove();
            var pts = getViewIntersections(tmp);
            _grid.addChild(new Path.Line(pts[0], pts[1]));
        }
        _grid.sendToBack();
        _me.gridStyle = currentGridStyle;
        _grid.visible = _gridVisible;
    };

    var _updateGrid = function () {
        _calcTicks();
        _calcGrid();
        _drawGrid();
    };

    var _gridVisible = true;
    this.__defineGetter__('gridVisible', function () {
        return _gridVisible;
    });
    this.__defineSetter__('gridVisible', function (p) {
        _gridVisible = p;
        _grid.visible = p;
    });

    _update();


    var _onRotate = function (delta) {
        _me.rotate(delta);
    };

    var _onScale = function (delta) {
        _me.scale(delta);
    };

    var _onTranslate = function (delta) {
        _me.translate(delta);
    };

    this.__defineGetter__('onRotate', function () {
        return _onRotate;
    });

    this.__defineGetter__('onScale', function () {
        return _onScale;
    });

    this.__defineGetter__('onTranslate', function () {
        return _onTranslate;
    });

    var _getPoint = function (x) {
        return _center + _unit * x;
    };
    this.__defineGetter__('getPoint', function () {
        return _getPoint;
    });
}