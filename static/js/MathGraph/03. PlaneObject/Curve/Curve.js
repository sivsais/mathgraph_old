function Parametric (Xt, Yt, variable, begin, end) {

    var _Xt = Xt;
    this.__defineGetter__('Xt', function () {
        return _Xt;
    });
    this.__defineSetter__('Xt', function (p) {
        _Xt = p;
        _onChange();
    });

    var _Yt = Yt;
    this.__defineGetter__('Yt', function () {
        return _Yt;
    });
    this.__defineSetter__('Yt', function (p) {
        _Yt = p;
        _onChange();
    });

    var _variable = variable;
    this.__defineGetter__('variable', function () {
        return _variable;
    });
    this.__defineSetter__('variable', function (p) {
        _variable = p;
        _onChange();
    });

    var _begin = begin || -1;
    this.__defineGetter__('begin', function () {
        return _begin;
    });
    this.__defineSetter__('begin', function (p) {
        _begin = p;
        _onChange();
    });

    var _end = end || 1;
    this.__defineGetter__('end', function () {
        return _end;
    });
    this.__defineSetter__('end', function (p) {
        _end = p;
        _onChange();
    });

    var _onChange = function () {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });

    var _getNodes = function (params) {
        var _step = params.step || 1;
        var _bound = params.bounds || new Rectangle(0, 0, 10, 10);
        var _nodes = [];
        for (var i = _begin; i <= _end; i += _step) {
            var _values = {};
            if (isDefined(params.constants)) {
                _values = params.constants;
            }
            _values[_variable] = i;
            var _x = Parametric.calc(_Xt, _values);
            var _y = Parametric.calc(_Yt, _values);
            if (!isDefined(_x) || !isDefined(_y)) {
                continue;
            }
            var _p = new Point(_x, _y);
            console.log(_bound);
            if (_p.isInside(_bound)) {
                _nodes.push(_p);
            } else { }
        }
        return _nodes;
    };
    this.__defineGetter__('getNodes', function () {
        return _getNodes;
    });
}

Parametric.calc = function (func, values) {
    if (func == '') {
        return undefined;
    }
    var _f = func.replace();
    for (var i in values) {
        if (!values.hasOwnProperty(i)) {
            continue;
        }
        _f = _f.replace(new RegExp(i, 'g'), '(' + values[i] + ')');
    }
    _f = _f.replace(new RegExp('sin', 'g'), 'Math.sin');
    _f = _f.replace(new RegExp('cos', 'g'), 'Math.cos');
    _f = _f.replace(new RegExp('Pi', 'g'), 'Math.PI');
    return eval(_f);
};

Parametric.segment = function (from, to) {
    return new Parametric(from.x + '+' + (to.x - from.x) + '*t', from.y + '+' + (to.y - from.y) + '*t', 't', 0, 1);
};

function Curve() {
    Curve.superclass.constructor.call(this);

    var _self = this;

    var _function = new Parametric('', '', 't',  -1, 1);
    _function.onChange = function () {
        _update();
    };
    this.__defineGetter__('func', function () {
        return _function;
    });
    this.__defineSetter__('func', function (p) {
        _function = p;
        _function.onChange = function () {
            _update();
        }
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
        _draw();
        if (isDefined(_self.infoBox) && _self.infoBox.isActivated(_self)) {
            _self.infoBox.refresh();
        }
        view.update();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });

    var _translate = function (delta) {
        _function.Xt += '+' + delta.x;
        _function.Yt += '+' + delta.y;
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _rotate = function (delta) {
        delta = -delta;
        _function.Xt = '(' + _function.Xt +  ')*(' + Math.cos(delta) + ') + (' + _function.Yt +  ')*(' + Math.sin(delta) + ')';
        _function.Yt = '-(' + _function.Xt +  ')*(' + Math.sin(delta) + ') + (' + _function.Yt +  ')*(' + Math.cos(delta) + ')';
                                                                                                };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _resize = function (ratio) {
        _function.Xt = '(' + _function.Xt + ')*' + ratio;
        _function.Yt = '(' + _function.Yt + ')*' + ratio;
    };
    this.__defineGetter__('resize', function () {
        return _resize;
    });

    var _closed = false;

    var _length = function () {
        return this.path.length;
    };
    this.__defineGetter__('length', function () {
        return _length();
    });

    var _draw = function () {
        if (_self.path.segments.length > 0) {
            _self.path.removeSegments(0);
        }
        _self.path.addSegments(_function.getNodes({
            step: _self.coordSystem.step,
            bounds: _self.coordSystem.bounds,
            constants: {}
        }).map(_self.coordSystem.localToGlobal));
    };

}
extend(Curve, PlaneObject);