function Figure() {
    Figure.superclass.constructor.call(this);

    this.name = 'Figure' + this.id;

    var _self = this;

    var _vertices = [];

    var _push = function (val) {
        _vertices.push(new Point(0, 0));
        _set(_vertices.length - 1, val);
        _vertices[_vertices.length - 1].set = function (k, val) {
            this[k] = val;
            _self.update();
        };
        _vertices[_vertices.length - 1].get = function (k) {
            return this[k];
        };
        _vertices[_vertices.length - 1].__fields__ = [
            {
                key: 'x',
                spinner: true,
                step: function () { return _self.coordinateSystem.step; }
            },
            {
                key: 'y',
                spinner: true,
                step: function () { return _self.coordinateSystem.step; }
            }
        ]
    };
    this.__defineGetter__('push', function () {
        return _push;
    });

    var _set = function (k, val) {
        if (typeof(k) === 'number') {
            _vertices[k].x = val.x;
            _vertices[k].y = val.y;
            _self.update();
        } else {
            _self[k] = val;
        }
    };
    this.__defineGetter__('set', function () {
        return _set;
    });

    var _get = function (x) {
        if (typeof(x) === 'number') {
            return _vertices[x];
        } else {
            return _self[x];
        }
    };
    this.__defineGetter__('get', function () {
        return _get;
    });

    var _onUpdate = function () {};
    this.__defineGetter__('onUpdate', function () {
        return _onUpdate;
    });
    this.__defineSetter__('onUpdate', function (p) {
        _onUpdate = p;
    });

    var _update = function () {
        var _functions = [];
        for (var i = 0; i < _vertices.length - 1; i++) {
            _functions.push(new Parametric.Segment(_vertices[i], _vertices[i + 1]));
        }
        if (_closed) {
            _functions.push(new Parametric.Segment(_vertices[_vertices.length - 1], _vertices[0]));
        }
        _self.path = _self.coordinateSystem.draw(_functions);
        _self.refreshInfoBoxes();
        _onUpdate();
        view.update();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });


    var _middle = function () {
        var sum = new Point(0, 0);
        for (var i in _vertices) {
            if (!_vertices.hasOwnProperty(i)) {
                continue;
            }
            sum += _vertices[i];
        }
        sum /= _vertices.length;
        return sum;
    };
    this.__defineGetter__('middle', function () {
        return _middle();
    });

    var _translate = function (delta) {
        for (var i in _vertices) {
            if (!_vertices.hasOwnProperty(i)) {
                continue;
            }
            _vertices[i] += delta;
        }
        _self.update();
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _rotate = function (delta, point) {
        if (!isDefined(point)) {
            point = _middle();
        }
        for (var i in _vertices) {
            if (!_vertices.hasOwnProperty(i)) {
                continue;
            }
            _vertices[i] = _vertices[i].rotate(delta, point);
        }
        _self.update();
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _scale = function (ratio, point) {
        if (!isDefined(point)) {
            point = _middle();
        }
        for (var i in _vertices) {
            if (!_vertices.hasOwnProperty(i)) {
                continue;
            }
            var _piece = _vertices[i] - point;
            _piece.length *= ratio;
            _vertices[i] = _piece + point;
        }
        _self.update();
    };
    this.__defineGetter__('scale', function () {
        return _scale;
    });

    var _closed = false;

    var _length = function () {
        var sum = 0;
        for (var i = 0; i < _vertices.length - 1; i++) {
            sum += (_vertices[i + 1] - _vertices[i]).length;
        }
        if (_closed) {
            sum += (_vertices[_vertices.length - 1] - _vertices[0]).length;
        }
        return sum;
    };
    this.__defineGetter__('length', function () {
        return _length();
    });

    var _manual = function (points) {
        points.forEach(function (item, index) {
            _self.push(item);
        });
    };
    this.__defineGetter__('manual', function () {
        return _manual;
    });
}
extend(Figure, PlaneObject);