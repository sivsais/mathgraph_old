function Figure() {
    Figure.superclass.constructor.call(this);

    var _self = this;

    var _vertices = [];

    var _push = function (val) {
        _vertices.push(new Point(0, 0));
        _set(_vertices.length - 1, val);
        _vertices[_vertices.length - 1].set = function (k, val) {
            val = _self.coordSystem.round(val);
            this[k] = val;
            _update();
        }
    };
    this.__defineGetter__('push', function () {
        return _push;
    });

    var _set = function (k, val) {
        val = _self.coordSystem.round(val);
        _vertices[k].x = val.x;
        _vertices[k].y = val.y;
        _update();
    };
    this.__defineGetter__('set', function () {
        return _set;
    });

    var _get = function (x) {
        return _vertices[x];
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
        _onUpdate();
        if (isDefined(_self.infoBox) && _self.infoBox.isActivated(_self)) {
            _self.infoBox.refresh();
        }
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
        _update();
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
            _vertices[i] = _vertices.rotate(delta, point);
        }
        _update();
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _resize = function (ratio, point) {
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
        _update();
    };
    this.__defineGetter__('resize', function () {
        return _resize;
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
        return _self.coordSystem.round(sum);
    };
    this.__defineGetter__('length', function () {
        return _length();
    });

}
extend(Figure, PlaneObject);