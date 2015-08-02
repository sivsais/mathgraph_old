function Affine(params) {
    Affine.superclass.constructor.call(this);

    var _self = this;

    var _axisX = new Axis(params.center, params.unitX);
    _axisX.onUpdate = function () {
        _old_basis = _basis;
        _basis[1] = _axisX.unit;
        _basis[0] = _axisX.zero;
    };

    var _axisY = new Axis(params.center, params.unitY);
    _axisY.onUpdate = function () {
        _old_basis = _basis;
        _basis[2] = _axisY.unit;
        _basis[0] = _axisY.zero;
    };

    var _basis = [params.center, params.unitX, params.unitY];
    this.__defineGetter__('basis', function () {
        return _basis;
    });
    this.__defineSetter__('basis', function (p) {
        _basis = p;
        _axisX.zero = _basis[0];
        _axisX.unit = _basis[1];
        _axisY.zero = _basis[0];
        _axisY.unit = _basis[2];
        _onChange();
    });

    var _old_basis = [_axisX.zero, _axisX.unit, _axisY.unit];
    this.__defineGetter__('old_basis', function () {
        return _old_basis.map(_globalToLocal);
    });

    var _matrix = function () {
        return new Matrix(_basis[1].x, _basis[1].y, _basis[2].x, _basis[2].y, 0, 0);
    };
    this.__defineGetter__('matrix', function () {
        return _matrix();
    });

    var _inverseMatrix = function () {
        var a, b, c, d;
        a = _matrix().a;
        b = _matrix().b;
        c = _matrix().c;
        d = _matrix().d;
        var _a, _b, _c, _d;
        _a = d/(a*d-c*b);
        _b = -b/(a*d-c*b);
        _c = -c/(a*d-c*b);
        _d = a/(a*d-c*b);

        return new Matrix(_a, _c, _b, _d, 0, 0);
    };
    this.__defineGetter__('inverseMatrix', function () {
        return _inverseMatrix();
    });

    var _globalToLocal = function (point) {
        return (point - _basis[0]).transform(_inverseMatrix());
    };
    this.__defineGetter__('globalToLocal', function (point) {
        return _globalToLocal;
    });

    var _localToGlobal = function (point) {
        return (point - _globalToLocal(new Point(0, 0))).transform(_matrix());
    };
    this.__defineGetter__('localToGlobal', function () {
        return _localToGlobal;
    });

    var _bound = function () {
        return new Rectangle(new Point(_axisX.left, _axisY.left), new Point(_axisX.right, _axisY.right));
    };
    this.__defineGetter__('bound', function () {
        return _bound();
    });

    var _step = function () {
        return 1/10;
    };
    this.__defineGetter__('step', function () {
        return _step();
    });

    var _translate = function (delta, target) {
        if (target == 'X' || target == 'x' || target == 0) {
            _axisX.translate(delta);
        } else if (target == 'Y' || target == 'y' || target == 1) {
            _axisY.translate(delta);
        } else {
            _axisX.translate(delta);
            _axisY.translate(delta);
        }
        _update();
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });
    
    var _rotate = function (delta, target) {
        if (target == 'X' || target == 'x' || target == 0) {
            _axisX.rotate(delta);
        } else if (target == 'Y' || target == 'y' || target == 1) {
            _axisY.rotate(delta);
        } else {
            _axisX.rotate(delta);
            _axisY.rotate(delta);
        }
        _update();
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });
    
    var _scale = function (ratio, target) {
        if (target == 'X' || target == 'x' || target == 0) {
            _axisX.scale(ratio);
        } else if (target == 'Y' || target == 'y' || target == 1) {
            _axisY.scale(ratio);
        } else {
            _axisX.scale(ratio);
            _axisY.scale(ratio);
        }
        _update();
    };
    this.__defineGetter__('scale', function () {
        return _scale;
    });

    var _getTickPoint = function (point) {
        return new Point(_axisX.getTickPoint(point.x), _axisY.getTickPoint(point.y));
    };
    this.__defineGetter__('getTickPoint', function () {
        return _getTickPoint;
    });

    var _tickSize = function () {
        return [_axisX.tickSize, _axisY.tickSize];
    };
    this.__defineGetter__('tickSize', function () {
        return _tickSize();
    });

    var _updatingMode = 'lf';
    this.__defineGetter__('updatingMode', function () {
        return _updatingMode;
    });
    this.__defineSetter__('updatingMode', function (p) {
        _updatingMode = p;
    });

    var _update = function () {
        if (_updatingMode == 'lf') {
            _self.apply(function (item, index) {
                item.update();
            });
        } else if (_updatingMode == 'gf') {
            _self.apply(function (item, index) {
                item.transform(_basis, _old_basis);
            });
        }
    };

    var _onChange = function () {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });

    var _gh;
    var _ghost = function () {
        if (isDefined(_gh)) {
            _gh.remove();
        }
        _gh = new Group();
        _gh.addChild(_axisX.ghost);
        _gh.addChild(_axisY.ghost);
        _self.apply(function (item, index) {
            _gh.addChild(item.path.clone());
        });
        _gh.opacity = 0.5;
        colorGhostGroup(_gh);
    };

    this.__defineGetter__('ghost', function () {
        return _ghost;
    });
}

extend(Affine, CoordinateSystem);