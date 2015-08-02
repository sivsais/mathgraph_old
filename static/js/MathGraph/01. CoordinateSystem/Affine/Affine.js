function Affine(param) {
    Affine.superclass.constructor.call(this);

    var _axisX, _axisY;
    var _center = param.center;

    _axisX = new Axis(param.unitX, _center);
    _axisY = new Axis(param.unitY, _center);

    _axisX.onChange = function () {
        _center.x = _axisX.center.x;
    };
    _axisY.onChange = function () {
        _center.y = _axisY.center.y;
    };

    this.__defineGetter__('axisX', function () {
        return _axisX;
    });
    this.__defineGetter__('axisY', function () {
        return _axisY;
    });

    this.__defineGetter__('center', function () {
        return _center;
    });

//    _axisX.labelsVisible = false;
//    _axisY.labelsVisible = false;


    this.__defineGetter__('basis', function () {
        return [_center, _axisX.unit, _axisY.unit];
    });

    this.lay = function(point, basis) {
        if (typeof(basis) === 'undefined') {
            basis = this.basis;
        }
        var vx = (point - basis[0]).x;
        var vy = (point - basis[0]).y;
        var ix = basis[1].x;
        var iy = basis[1].y;
        var jx = basis[2].x;
        var jy = basis[2].y;
        var a = -(-vx * jy + jx * vy) / (ix * jy - iy * jx);
        var b = (ix * vy - iy * vx) / (ix * jy - iy * jx);
        return new Point(a, b);
    };

    var _me = this;

    var _matrix = function () {
        return [[_me.basis[1].x, _me.basis[2].x], [_me.basis[1].y, _me.basis[2].y]];
    };

    var _inverseMatrix = function () {
        var a, b, c, d;
        a = _matrix()[0][0];
        b = _matrix()[0][1];
        c = _matrix()[1][0];
        d = _matrix()[1][1];
        return [[d/(a*d-c*b), -b/(a*d-c*b)], [-c/(a*d-c*b), a/(a*d-c*b)]];
    };

    this.globalToLocal = function (point) {
        point = point - _me.basis[0];
        return new Point(point.x * _inverseMatrix()[0][0] + point.y * _inverseMatrix()[0][1], point.x * _inverseMatrix()[1][0] + point.y * _inverseMatrix()[1][1]);
//        return new Point(point.x * _matrix()[0][0] + point.y * _matrix()[0][1], point.x * _matrix()[1][0] + point.y * _matrix()[1][1]);
//        return this.lay(point);
    };

    this.localToGlobal = function (point) {
        point = point - _me.globalToLocal(new Point(0, 0));
        return new Point(point.x * _matrix()[0][0] + point.y * _matrix()[0][1], point.x * _matrix()[1][0] + point.y * _matrix()[1][1]);
//        return new Point(point.x * _inverseMatrix()[0][0] + point.y * _inverseMatrix()[0][1], point.x * _inverseMatrix()[1][0] + point.y * _inverseMatrix()[1][1]);
//        return this.lay(point, _me.globalBasis);
    };



    this.__defineGetter__('globalBasis', function () {
        var _gc = this.lay(new Point(0, 0));
        var _gi = this.lay(new Point(1, 0)) - _gc;
        var _gj = this.lay(new Point(0, 1)) - _gc;
        return [_gc, _gi, _gj];
    });

    var _getIntersection = function (mode) {
        var c1x = _me.axisX.center.x,
            c1y = _me.axisX.center.y,
            ix = (_me.axisX.center + _me.axisX.unit).x,
            iy = (_me.axisX.center + _me.axisX.unit).y;
        var c2x = _me.axisY.center.x,
            c2y = _me.axisY.center.y,
            jx = (_me.axisY.center + _me.axisY.unit).x,
            jy = (_me.axisY.center + _me.axisY.unit).y;
        var x = (ix*c1y*jx-ix*c1y*c2x-ix*c2y*jx+c1x*c2y*jx-c1x*c2x*jy+c1x*iy*c2x-c1x*iy*jx+ix*c2x*jy) /
            (-iy*jx+iy*c2x+c1y*jx-c1y*c2x-jy*c1x+jy*ix+c2y*c1x-c2y*ix);
        var y = (iy*c2x*jy+c2y*c1x*iy-jy*c1x*iy-iy*c2y*jx-c1y*c2x*jy+jy*c1y*ix+c1y*c2y*jx-c2y*c1y*ix) /
            (-iy*jx+iy*c2x+c1y*jx-c1y*c2x-jy*c1x+jy*ix+c2y*c1x-c2y*ix);
        if (typeof(mode) === 'undefined' || mode == 'g') {
            return new Point(x, y);
        } else {
            return _me.globalToLocal(new Point(x, y));
        }
    };
    this.__defineGetter__('getIntersection', function () {
        return _getIntersection;
    });

    var _translate = function (delta) {
        _axisX.translate(delta);
        _axisY.translate(delta);
    };

    var _scale = function (ratio) {
        _axisX.scale(ratio);
        _axisY.scale(ratio);
    };

    var _rotate = function (delta) {
        _axisX.rotate(delta);
        _axisY.rotate(delta);
    };

    this.__defineGetter__('rotate', function () {
        return _rotate;
    });
    this.__defineGetter__('scale', function () {
        return _scale;
    });
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _updateObjects = function () {
        for (var i in _me.objects) {
            if (!_me.objects.hasOwnProperty(i)) {
                continue;
            }
            _me.objects[i].update();
        }
    };

    var _onRotate = function (mode, delta) {
        if (mode == 'both') {
            _me.rotate(delta);
        } else if (mode == 'X') {
            _axisX.onRotate(delta);
        } else if (mode == 'Y') {
            _axisY.onRotate(delta);
        }
        _updateObjects();
    };

    var _onScale = function (mode, delta) {
        if (mode == 'both') {
            _me.scale(delta);
        } else if (mode == 'X') {
            _axisX.onScale(delta);
        } else if (mode == 'Y') {
            _axisY.onScale(delta);
        }
        _updateObjects();
    };

    var _onTranslate = function (mode, delta) {
        if (mode == 'both') {
            _me.translate(delta);
        } else if (mode == 'X') {
            _axisX.onTranslate(delta);
        } else if (mode == 'Y') {
            _axisY.onTranslate(delta);
        }
        _updateObjects();
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

    var _round = function (x) {
        if (x instanceof Point) {
            x.x = roundTo(x.x, 3);
            x.y = roundTo(x.y, 3);
        } else {
            x = roundTo(x, 3);
        }
        return x;
    };
    this.__defineGetter__('round', function () {
        return _round;
    });

    var _bounds = function () {
        return new Rectangle(new Point(-_axisX.left, -_axisY.left), new Point(_axisX.right, _axisY.right));
    };
    this.__defineGetter__('bounds', function () {
        return _bounds();
    });

    this.__defineGetter__('left', function () {
        return new Point(-_axisX.left, -_axisY.left);
    });
    this.__defineGetter__('right', function () {
        return new Point(_axisX.right, _axisY.right);
    });

    var _step = function () {
        return 1 / 10;
    };
    this.__defineGetter__('step', function () {
        return _step();
    });

}
extend(Affine, CoordinateSystem);