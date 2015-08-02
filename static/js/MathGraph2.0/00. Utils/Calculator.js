function convex(points) {
    var _convex = new ConvexHull();
    _convex.compute(points);
    var indices = _convex.indices;
    var _result = [];
    if (indices && indices.length > 0) {
        indices.forEach(function (item, index) {
            _result.push(points[item]);
        });
    }
    console.log(_result);
    return _result;
}

function Expression() {}

Expression.JS = function(expr) {

    expr = expr.replace(new RegExp('sin', 'g'), 'Math.sin');
    expr = expr.replace(new RegExp('cos', 'g'), 'Math.cos');
    expr = expr.replace(new RegExp('tan', 'g'), 'Math.tan');
    expr = expr.replace(new RegExp('Pi', 'g'), 'Math.PI');

    return expr;
};

Expression.Calc = function (expr, values) {
    var _f = expr.replace();
    for (var i in values) {
        if (!values.hasOwnProperty(i)) {
            continue;
        }
        _f = _f.replace(new RegExp(i, 'g'), '(' + values[i] + ')');
    }
    _f = Expression.JS(_f);
    return eval(_f);
};

function Parametric (Xt, Yt, variable, begin, end, params) {

    var _self = this;

    if (typeof(begin) === "string") {
        begin = Expression.Calc(begin);
    }
    if (typeof(end) === "string") {
        end = Expression.Calc(end);
    }

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

    var _begin = -1;
    if (isDefined(begin)) {
        _begin = begin;
    }
    this.__defineGetter__('begin', function () {
        return _begin;
    });
    this.__defineSetter__('begin', function (p) {
        _begin = p;
        _onChange();
    });

    var _end = 1;
    if (isDefined(end)) {
        _end = end;
    }
    this.__defineGetter__('end', function () {
        return _end;
    });
    this.__defineSetter__('end', function (p) {
        _end = p;
        _onChange();
    });

    var _params = {};
    if (isDefined(params)) {
        _params = params;
    }
    this.__defineGetter__('params', function () {
        var _clone = {};
        for (var i in _params) {
            _clone[i] = _params[i];
        }
        return _clone;
    });
    var _getParam = function (key) {
        if (_params.hasOwnProperty(key)) {
            return _params[key];
        } else {
            console.error('Unknown parameter -> "' + key + '"');
            return undefined;
        }
    };
    this.__defineGetter__('getParam', function () {
        return _getParam;
    });
    var _setParam = function (key, val) {
        if (_params.hasOwnProperty(key)) {
            _params[key] = val;
            _onChange();
        } else {
            console.error('Unknown parameter -> "' + key + '"');
        }
    };
    this.__defineGetter__('setParam', function () {
        return _setParam;
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
        var _bound = params.bound || new Rectangle(new Point(-10, -10), new Point(10, 10));
        var _nodes = [];
        var _cur = 0;
        _nodes[_cur] = [];
        var _flag = false;

        for (var i = _begin; i <= _end; i += _step) {
            var _values = _self.params;
            _values[_variable] = i;
            var _transformed = _conversion();
            var _p = new Point(Expression.Calc(_transformed.Xt, _values), Expression.Calc(_transformed.Yt, _values));
            if (_bound.contains(_p)) {
                _flag = false;
                _nodes[_cur].push(_p);
            } else {
                if (!_flag) {
                    _cur += 1;
                    _nodes[_cur] = [];
                    _flag = true;
                }
            }
        }
        return _nodes;
    };
    this.__defineGetter__('getNodes', function () {
        return _getNodes;
    });

    var _translationX = 0;
    var _translationY = 0;
    var _translate = function (delta) {
        _translationX += delta.x;
        _translationY += delta.y;
        _onChange();
    };
    this.__defineGetter__('translate', function () {
        return _translate;
    });

    var _scalingX = 1;
    var _scalingY = 1;
    var _scale = function (ratioX, ratioY) {
        _scalingX *= ratioX;
        _scalingY *= ratioY;
        _onChange();
    };

    var _rotation = 0;
    var _rotate = function (delta) {
        _rotation += delta;
        _onChange();
    };
    this.__defineGetter__('rotate', function () {
        return _rotate;
    });

    var _conversion = function () {
        var _newX = _Xt;
        var _newY = _Yt;
        if (_translationX != 0) {
            _newX += '+' + _translationX;
        }
        if (_translationY != 0) {
            _newY += '+' + _translationY;
        }
        if (_scalingX != 1) {
            _newX = _scalingX + '*(' + _newX + ')';
        }
        if (_scalingY != 1) {
            _newY = _scalingY + '*(' + _newY + ')';
        }
        if (_rotation != 0) {
            var _oldX = _newX;
            var _oldY = _newY;
            _newX = '(' + _oldX + ')*cos(' + _rotation + ')+(' + _oldY + ')*sin(' + _rotation + ')';
            _newY = '-(' + _oldX + ')*sin(' + _rotation + ')+(' + _oldY + ')*cos(' + _rotation + ')';
        }
        return {
            Xt: _newX,
            Yt: _newY
        }
    };
    this.__defineGetter__('conversion', function () {
        return _conversion();
    });

    var __fields__ = [
        {
            name: 'X(' + _self.variable + ')',
            key: 'Xt',
            text: true
        },  {
            name: 'Y(' + _self.variable + ')',
            key: 'Yt',
            text: true
        }, {
            name: 'Начало',
            key: 'begin',
            spinner: true
        }, {
            name: 'Конец',
            key: 'end',
            spinner: true
        }
    ];

    for (var i in _self.params) {
        __fields__.push({
            key: i,
            spinner: true
        });
    }

    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });
    this.__defineSetter__('__fields__', function (p) {
        __fields__ = p;
    });

    var _get = function (key) {
        if (isDefined(_self[key])) {
            return _self[key];
        } else if (isDefined(_self.params[key])) {
            return _self.getParam(key);
        }
        return undefined;
    };
    this.__defineGetter__('get', function () {
        return _get;
    });
    var _set = function (key, val) {
        if (isDefined(_self[key])) {
            _self[key] = val;
        } else if (isDefined(_self.params[key])) {
            _self.setParam(key, val);
        }
    };
    this.__defineGetter__('set', function () {
        return _set;
    });

    var _transform = function (new_basis, old_basis) {
        var a = old_basis[1].x;
        var b = old_basis[2].x;
        var c = old_basis[1].y;
        var d = old_basis[2].y;

        var xOld = _Xt, yOld = _Yt;

        if (a != 1) {
            _Xt = a + '*(' + xOld + ')';
        }
        if (b != 0) {
            _Xt = _Xt + '+' + b + '*(' + yOld + ')';
        }
        if (d != 1) {
            _Yt = d + '*(' + yOld + ')';
        }
        if (c != 0) {
            _Yt = _Yt + '+' + d + '*(' + xOld + ')';
        }
    };
    this.__defineGetter__('transform', function () {
        return _transform;
    });
}

Parametric.Segment = function(from, to) {
    Parametric.Segment.superclass.constructor.call(this, from.x + '+' + (to.x - from.x) + '*t', from.y + '+' + (to.y - from.y) + '*t', 't', 0, 1, {});
};
extend(Parametric.Segment, Parametric);

Parametric.Circle = function (center, radius) {
    var _Xt = 'radius*sin(t)+cx';
    var _Yt = 'radius*cos(t)+cy';
    Parametric.Circle.superclass.constructor.call(this, _Xt, _Yt, 't', 0, '2*Pi+Pi', {
        radius: radius,
        cx: center.x,
        cy: center.y
    });
};
extend(Parametric.Circle, Parametric);

function Direct(fn, variable, params) {
    Direct.superclass.constructor.call(this, variable, fn, variable, 0, 0, params);

    var _self = this;

    var _fn = fn;
    this.__defineGetter__('fn', function () {
        return _fn;
    });
    this.__defineSetter__('fn', function (p) {
        _self.Yt = fn.replace(new RegExp(_self.variable, 'g'), 't');
    });

    var _getNodes = function (params) {
        var _step = params.step || 1;
        var _bound = params.bound || new Rectangle(new Point(-10, -10), new Point(10, 10));
        var _nodes = [];
        var _cur = 0;
        _nodes[_cur] = [];
        var _flag = false;

        for (var i = _bound.getLeft(); i <= _bound.getRight(); i += _step) {
            var _values = _self.params;
            _values[_self.variable] = i;
            var _transformed = _self.conversion;
            var _p = new Point(Expression.Calc(_transformed.Xt, _values), Expression.Calc(_transformed.Yt, _values));
            if (_bound.contains(_p)) {
                _flag = false;
                _nodes[_cur].push(_p);
            } else {
                if (!_flag) {
                    _cur += 1;
                    _nodes[_cur] = [];
                    _flag = true;
                }
            }
        }
        return _nodes;
    };
    this.__defineGetter__('getNodes', function () {
        return _getNodes;
    });

    var __fields__ = [
        {
            name: 'Y(' + _self.variable + ')',
            key: 'fn',
            text: true
        }
    ];

    for (var i in _self.params) {
        __fields__.push({
            key: i,
            spinner: true
        });
    }
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });

    this.__defineSetter__('__fields__', function (p) {
        __fields__ = p;
    });

}
extend(Direct, Parametric);

Direct.Straight = function (point1, point2) {
    var k = (point2 - point1).getAngleInRadians();
    var _Yx = 'tan(angle)*x+b';
    Direct.Straight.superclass.constructor.call(this, _Yx, 'x', {
        angle: k,
        b: point1.y - point1.x * (point2.y - point1.y) / (point2.x - point1.x)
    });
};
extend(Direct.Straight, Direct);

function Inverse(fn, variable, params) {
    Inverse.superclass.constructor.call(this, fn.replace(new RegExp(variable, 'g'), 't', 't'), 0, 0, params);

    var _self = this;

    var _fn = fn;
    this.__defineGetter__('fn', function () {
        return _fn;
    });
    this.__defineSetter__('fn', function (p) {
        _self.Xt = fn.replace(new RegExp(_self.variable, 'g'), 't');
    });

    var _getNodes = function (params) {
        var _step = params.step || 1;
        var _bound = params.bound || new Rectangle(new Point(-10, -10), new Point(10, 10));
        var _nodes = [];
        var _cur = 0;
        _nodes[_cur] = [];
        var _flag = false;

        for (var i = _bound.getBottom(); i <= _bound.getTop(); i += _step) {
            var _values = _self.params;
            _values[_self.variable] = i;
            var _transformed = _self.conversion;
            var _p = new Point(Expression.Calc(_transformed.Xt, _values), Expression.Calc(_transformed.Yt, _values));
            if (_bound.contains(_p)) {
                _flag = false;
                _nodes[_cur].push(_p);
            } else {
                if (!_flag) {
                    _cur += 1;
                    _nodes[_cur] = [];
                    _flag = true;
                }
            }
        }
        return _nodes;
    };
    this.__defineGetter__('getNodes', function () {
        return _getNodes;
    });

    var __fields__ = [
        {
            name: 'X(' + _self.variable + ')',
            key: 'fn',
            text: true
        }
    ];

    for (var i in _self.params) {
        __fields__.push({
            key: i,
            spinner: true
        });
    }
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });

    this.__defineSetter__('__fields__', function (p) {
        __fields__ = p;
    });
}
extend(Inverse, Parametric);

function Implicit(left, right, sense, var1, var2, params) {

    var _self = this;

    var _left = left;
    this.__defineGetter__('left', function () {
        return _left;
    });
    this.__defineSetter__('left', function (p) {
        _left = p;
        _onChange();
    });

    var _right = right;
    this.__defineGetter__('right', function () {
        return _right;
    });
    this.__defineSetter__('right', function (p) {
        _right = p;
        _onChange();
    });

    var _sense = sense;
    this.__defineGetter__('sense', function () {
        return _sense;
    });
    this.__defineSetter__('sense', function (p) {
        _sense = p;
        _onChange();
    });

    var _X = var1;
    this.__defineGetter__('var1', function () {
        return _X;
    });
    this.__defineSetter__('var1', function (p) {
        _X = p;
        _onChange();
    });

    var _Y = var2;
    this.__defineGetter__('var2', function () {
        return _Y;
    });
    this.__defineSetter__('var2', function (p) {
        _Y = p;
        _onChange();
    });

    var _params = {};
    if (isDefined(params)) {
        _params = params;
    }
    this.__defineGetter__('params', function () {
        var _clone = {};
        for (var i in _params) {
            _clone[i] = _params[i];
        }
        return _clone;
    });
    var _getParam = function (key) {
        if (_params.hasOwnProperty(key)) {
            return _params[key];
        } else {
            console.error('Unknown parameter -> "' + key + '"');
            return undefined;
        }
    };
    this.__defineGetter__('getParam', function () {
        return _getParam;
    });
    var _setParam = function (key, val) {
        if (_params.hasOwnProperty(key)) {
            _params[key] = val;
            _onChange();
        } else {
            console.error('Unknown parameter -> "' + key + '"');
        }
    };
    this.__defineGetter__('setParam', function () {
        return _setParam;
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
        var _bound = params.bound || new Rectangle(new Point(-10, -10), new Point(10, 10));
        var _nodes = [];
//        var _cur = 0;
//        _nodes[_cur] = [];
        var _flag = false;
        var b_left = Math.min(_bound.getLeft(), _bound.getRight());
        var b_right = Math.max(_bound.getLeft(), _bound.getRight());
        var b_top = Math.max(_bound.getTop(), _bound.getBottom());
        var b_bottom = Math.min(_bound.getTop(), _bound.getBottom());
        for (var i = b_left; i <= b_right; i += _step) {
            for (var j = b_bottom; j <= b_top; j += _step) {
                var _values = _self.params;
                _values[_self.var1] = i;
                _values[_self.var2] = j;
                if (_sense == '<=' || _sense == '>=') {
                    if (Expression.Calc(_left + _sense + _right, _values)) {
                        var _p = new Point(i, j);
                        if (_bound.contains(_p)) {
//                            _flag = false;
//                            _nodes[_cur].push(_p);
                            _nodes.push(_p);
                        } else {
//                            if (!_flag) {
//                                _cur += 1;
//                                _nodes[_cur] = [];
//                                _flag = true;
//                            }
                        }
                    }
                } else if (_sense == '=' || _sense == '==') {
                    var _lvalue = Expression.Calc(_left, _values);
                    var _rvalue = Expression.Calc(_right, _values);
                    if (Math.abs(_lvalue - _rvalue) < _step) {
                        var _p = new Point(i, j);
                        if (_bound.contains(_p)) {
//                            _flag = false;
//                            _nodes[_cur] = [];
//                            _nodes[_cur].push(_p);
//                            _cur += 1;
                            _nodes.push(_p);
                        } else {
//                            if (!_flag) {
//                                _cur += 1;
//                                _nodes[_cur] = [];
//                                _flag = true;
//                            }
                        }
                    }
                }
            }
        }
//        var _result = [];
//        _nodes.forEach(function (item, index) {
//            _result.push(convex(item));
//        });
        return _nodes;
    };
    this.__defineGetter__('getNodes', function () {
        return _getNodes;
    });

    var __fields__ = [
        {
            name: 'Left',
            key: 'left',
            text: true
        },
        {
            name: 'Sense',
            key: 'sense',
            text: true
        },
        {
            name: 'Right',
            key: 'right',
            text: true
        }
    ];

    for (var i in _self.params) {
        __fields__.push({
            key: i,
            spinner: true
        });
    }
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });

    this.__defineSetter__('__fields__', function (p) {
        __fields__ = p;
    });

    var _get = function (key) {
        if (isDefined(_self[key])) {
            return _self[key];
        } else if (isDefined(_self.params[key])) {
            return _self.getParam(key);
        }
        return undefined;
    };
    this.__defineGetter__('get', function () {
        return _get;
    });
    var _set = function (key, val) {
        if (isDefined(_self[key])) {
            _self[key] = val;
        } else if (isDefined(_self.params[key])) {
            _self.setParam(key, val);
        }
    };
    this.__defineGetter__('set', function () {
        return _set;
    });
}

Implicit.Conic = function (A) {
    var _expr = 'a*x*x+b*y*y+2*c*x*y+2*d*x+2*e*y+f';
    Implicit.Conic.superclass.constructor.call(this, _expr, '0', '=', 'x', 'y', {
        a: A[0][0],
        b: A[1][1],
        c: A[0][1],
        d: A[0][2],
        e: A[1][2],
        f: A[2][2]
    })
};
extend(Implicit.Conic, Implicit);