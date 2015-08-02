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
function Changer($container, params) {
    if (typeof(params) === 'undefined') {
        params = {};
    }
    var _val = params.val || 0;
    var _min = params.min || -Infinity;
    var _max = params.max || Infinity;
    var _step = params.step || 1;
    var _object = params.object;
    var _key = params.key;
    _val = _object[_key];
    this.__defineGetter__('val', function () {
        return _val;
    });
    this.__defineSetter__('val', function (p) {
        _val = p;
    });
    var _onChange = function (new_val) {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });
    var _updateValue = function (nval) {
//        nval -= nval % _step;
        console.log(nval);
        if (_min <= nval && nval <= _max) {
            _val = nval;
            _onChange(nval);
        }
    };
    var $minus = $('<span></span>');
    $minus.text('-');
    $minus.addClass('minus');
    $minus.appendTo($container);
    var $plus = $('<span></span>');
    $plus.text('+');
    $plus.addClass('plus');
    $plus.appendTo($container);
    $plus
        .mousedown(function(e) {
            clearInterval(this.downTimer);
            _val = _object[_key];
            _updateValue(_val + _step);
            this.downTimer = setInterval(function() {
                _val = _object[_key];
                _updateValue(_val + _step);
            }, 300);
        })
        .mouseup(function(e) {
            clearInterval(this.downTimer);
        })
        .mouseleave(function (e) {
            clearInterval(this.downTimer);
        });
    $minus
        .mousedown(function(e) {
            clearInterval(this.downTimer);
            _updateValue(_val - _step);
            this.downTimer = setInterval(function() {
                _updateValue(_val - _step);
            }, 300);
        })
        .mouseup(function(e) {
            clearInterval(this.downTimer);
        })
        .mouseleave(function (e) {
            clearInterval(this.downTimer);
        });
}
var ARROW_ANGLE = 165;
var ARROW_LENGTH = 0.2;
var AXIS_ARROW_ANGLE = 170;
var AXIS_ARROW_LENGTH = 20;
var ARROW_LENGTH_MAX = 15;
var MIN_LENGTH = 1;
var LABEL_TRANSLATE_VECTOR = [0, -20];
var DIAGONAL = Math.pow(view.size.width, 2) + Math.pow(view.size.height,2) + 100;
var AXIS_TICK_LENGTH = 3;
var AXIS_TICK_STEP_MAX = 60;
var AXIS_TICK_STEP_MIN = 30;
var DOUBLE_CLICK_MAX_TIME = 300;
var MIN_DISTANCE = 0.1;
/** Class for computing a 2D convex hull for the given vertices. */
ConvexHullPoint = function(i, a, d) {
	this.index = i;
	this.angle = a;
	this.distance = d;
	
	this.compare=function(p) {
		if (this.angle<p.angle)
			return -1;
		else if (this.angle>p.angle)
			return 1;
		else {
			if (this.distance<p.distance)
				return -1;
			else if (this.distance>p.distance)
				return 1;
		}
		return 0;
	}
}
ConvexHull = function() {
	this.points = null;
	this.indices = null;
	
	this.getIndices=function() {
		return this.indices;
	}
	
	this.clear=function() {
		this.indices=null;
		this.points=null;
	}
	
	this.ccw=function(p1, p2, p3) {
		return (this.points[p2].x - this.points[p1].x)*(this.points[p3].y - this.points[p1].y) - (this.points[p2].y - this.points[p1].y)*(this.points[p3].x - this.points[p1].x);
	}
	
	this.angle=function(o, a) {
		return Math.atan((this.points[a].y-this.points[o].y) / (this.points[a].x - this.points[o].x));
	}
    
	this.distance=function(a, b) {
		return ((this.points[b].x-this.points[a].x)*(this.points[b].x-this.points[a].x)+(this.points[b].y-this.points[a].y)*(this.points[b].y-this.points[a].y));
	}
	
	this.compute=function(_points) {
		this.indices=null;
		if (_points.length<3)
			return;
		this.points=_points;
			
		// Find the lowest point
		var min = 0;
		for (var i = 1; i < this.points.length; i++) {
			if (this.points[i].y==this.points[min].y) {
				if (this.points[i].x<this.points[min].x)
					min = i;
			}
			else if (this.points[i].y<this.points[min].y)
				min = i;
		}
		
		// Calculate angle and distance from base
		var al = new Array();
		var ang = 0.0;
		var dist = 0.0;
		for (i = 0; i<this.points.length; i++) {
			if (i==min)
				continue;
			ang = this.angle(min, i);
			if (ang<0)
				ang += Math.PI;
			dist = this.distance(min, i);
			al.push(new ConvexHullPoint(i, ang, dist));
		}
		
		al.sort(function (a, b) { return a.compare(b); });
		
		// Create stack
		var stack = new Array(this.points.length+1);
		var j = 2;
		for (i = 0; i<this.points.length; i++) {
			if (i==min)
				continue;
			stack[j] = al[j-2].index;
			j++;
		}
		stack[0] = stack[this.points.length];
		stack[1] = min;
		
		var tmp;
		var M = 2;
		for (i = 3; i<=this.points.length; i++) {
			while(this.ccw(stack[M-1], stack[M], stack[i]) <= 0)
				M--;
			M++;
			tmp = stack[i];
			stack[i] = stack[M];
			stack[M] = tmp;
		}
		this.indices = new Array(M);
		for (i = 0; i<M; i++) {
			this.indices[i]=stack[i+1];
		}
	}
}
function DeltaBox() {
    var _defaultPoint = new Point(0, 0);
    this.__defineGetter__('defaultPoint', function() {
        return _defaultPoint;
    });
    this.__defineSetter__('defaultPoint', function(p) {
        _defaultPoint = p;
    });
    var _elem = new PointText({
        point: _defaultPoint,
        content: '',
        fillColor: 'gray',
        fontFamily: 'Courier New',
        fontSize: 15,
        visible: false,
        opacity: 0.9,
        justification: 'left'
    });
    this.on = function() {
        _elem.visible = true;
    };
    this.off = function() {
        _elem.visible = false;
    };
    this.refresh = function(point, data) {
        var s = '';
        for (var i in data) {
            s += data[i] + '\n';
        }
        s += '\n';
        if (typeof(point) !== 'undefined') {
            _elem.point = point + LABEL_TRANSLATE_VECTOR;
        } else {
            _elem.point = _defaultPoint;
        }
        _elem.content = s;
    }
}
function Ghost(obj) {
    this.path = obj.path.clone();
    this.remove = function () {
        this.path.remove();
    };
    this.clone = function () {
        return new Ghost(this);
    }
}
function HelpBox() {
    var _html = function (s) {};
    this.__defineGetter__('html', function () {
        return _html;
    });
    var _position = function () {};
    this.__defineGetter__('position', function () {
        return _position;
    });
    var _remove = function () {};
    this.__defineGetter__('remove', function () {
        return _remove;
    });
    var _follow = false;
    this.__defineGetter__('follow', function () {
        return _follow;
    });
    this.__defineSetter__('follow', function (p) {
        _follow = p;
    });
}
function InfoPanel(title, $container, object, fields) {
    var $wrapper = $('<div></div>');
    $wrapper
        .css({
            position: 'absolute'
        })
        .appendTo($container)
        .addClass('infoPanelWrapper');
    var $title = $('<span></span>');
    $title.text(title);
    $title.appendTo($wrapper);
    $title.addClass('title');
    var $fold = $('<span></span>');
    $fold
        .text('-')
        .addClass('fold')
        .click(function (e) {
            if (isDefined($table)) {
                if ($(this).text() == '-') {
                    $wrapper.resizable('disable');
                    var w = $wrapper.width();
                    hideElem($table);
                    $wrapper.width(w);
                    $(this).text('+');
                } else {
                    $(this).text('-');
                    showElem($table);
                    $wrapper.resizable('enable');
                }
            }
        })
       .appendTo($title);
    
    var $close = $('<span></span>');
    $close
        .text('x')
        .addClass('close')
        .click(function (e) {
            _hide();
        })
       .appendTo($title);
//    var $table = $('<table></table>');
    var $table = $('<div></div>');
    $table
        .css({
            position: 'relative'
        })
        .appendTo($wrapper)
        .addClass('infoPanel');
    var _dragging = false, _downPoint;
    $title.mousedown(function (e) {
        _dragging = true;
        _downPoint = [e.pageX, e.pageY];
        e.stopPropagation();
    });
    $('body')
        .mousemove(function (e) {
            if (_dragging) {
                var _offset = $container.offset();
                _offset.left += (e.pageX - _downPoint[0]);
                _offset.top += (e.pageY - _downPoint[1]);
                $container.offset(_offset);
                _downPoint = [e.pageX, e.pageY];
                e.stopPropagation();
            }
        })
        .mouseup(function (e) {
            if (_dragging) {
                _dragging = false;
                e.stopPropagation();
            }
        });
    var _convert = function (a, params) {
        var result = [];
        for (var i in a) {
            if (!a.hasOwnProperty(i)) {
                continue;
            }
            if (typeof(a[i]) === 'function') {
                continue;
            }
            var cell = {
                name: undefined,
                key: undefined,
                editable: undefined,
                changer: undefined,
                min: undefined,
                max: undefined,
                step: undefined,
                inadmissible: undefined
            };
            for (var j in params) {
                if (!params.hasOwnProperty(j)) {
                    continue;
                }
                cell[j] = params[j];
            }
            cell.key = i;
            cell.name = i;
            result.push(cell);
        }
        return result;
    };
    var _refreshValue = function ($value, ftype, val) {
        if (ftype == 'Point' || ftype == 'Array') {
            $value.text(ftype);
        } else {
            if (ftype == 'Number') {
                val = toFixedNoZeros(val, 3);
            }
            $value.text(val);
        }
    };
    var _onChange = function (object, field, ftype, new_val) {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });
    var _textFilter = function (field, ftype, val) {
//        var _re = new RegExp(field.mask, 'g');
//        var _arr = _re.exec(val);
//        val = _arr[0];
//        for (var i in _arr) {
//            if (!_arr.hasOwnProperty(i)) {
//                continue;
//            }
//            if (isDefined(_arr[i]) && _arr[i].length > val.length) {
//                val = _arr[i];
//            }
//        }
//        if (ftype == 'Number') {
//            val = parseFloat(val);
//        }
        return val;
    };
    var $children = undefined, _childIndex = -1;
    var _getType = function (obj) {
        if (typeof(obj) === 'number') {
            return 'Number';
        } else if (typeof(obj) === 'string') {
            return 'String';
        } else if (typeof(obj) === 'boolean') {
            return 'Boolean';
        } else if (obj instanceof Point) {
            return 'Point';
        } else if (obj instanceof Array) {
            return 'Array';
        }
        return undefined;
    };
    for (var i in fields) {
        if (!fields.hasOwnProperty(i)) {
            continue;
        }
        (function (_field, index) {
            var _ftype = _getType(object[_field.key]);
            if (!isDefined(_ftype)) {
                console.error('Not supported type if field ');
                console.error(_field);
                return;
            }
//            var $field = $('<tr></tr>');
            var $field = $('<div></div>');
            $field
                .addClass('field')
                .addClass(_ftype);
            if (_field.editable) {
                $field.addClass('editable');
            }
            $field.appendTo($table);
            if (index % 2 == 0) {
                $field.addClass('even');
            } else {
                $field.addClass('odd');
            }
//            var $key = $('<td></td>');
            var $key = $('<span></span>');
            $key
                .addClass('key')
                .appendTo($field)
                .text(_field.name);
            var $value = $('<span></span>');
            $value
                .addClass('value')
                .appendTo($field)
                .attr('_key', _field.key);
            var $interactive;
            if (_field.editable) {
                $value.dblclick(function (e) {
                    var $input = $('<input>', {
                        type: 'text',
                        value: object[_field.key],
                        maxLength: _field.max || 100
                    });
                    $input
                        .addClass('editVal')
                        .css({
                            position: 'absolute',
                            'text-align': 'center'
                        })
                        .appendTo($value)
                        .width($value.width())
                        .height($value.height())
                        .offset($value.offset())
                        .focus()
                        .keydown(function (e) {
                            if (e.which == 27) {
                                $input.remove();
                            }
                            if (e.which == 13) {
                                _onChange(object, _field, _ftype, $input.val());
                                _refreshValue($value, _ftype, object[_field.key]);
                                $input.remove();
                            }
                        })
                        .blur(function (e) {
                            _onChange(object, _field, _ftype, new_val);
                            _refreshValue($value, _ftype, object[_field.key]);
                            $input.remove();
                        });
                })
            }
            if (_ftype == 'String') {
                _refreshValue($value, _ftype, object[_field.key]);
                $value.attr('colspan', '2');
                $field.addClass('noInteractive');
            }
            if (_ftype == 'Number') {
                console.log(object[_field.key]);
                _refreshValue($value, _ftype, object[_field.key]);
                if (!_field.changer) {
                    $value.attr('colspan', '2');
                    $field.addClass('noInteractive');
                } else {
//                    $interactive = $('<td></td>');
                    $interactive = $('<span></span>');
                    $interactive
                        .addClass('interactive')
                        .appendTo($field);
                    var $changer = new Changer($interactive, {
                        object: object,
                        key: _field.key,
                        min: _field.min,
                        max: _field.max,
                        step: _field.step
                    });
                    $interactive.addClass('changer');
                    $changer.onChange = function (new_val) {
                        _onChange(object, _field, _ftype, new_val);
                        _refreshValue($value, _ftype, object[_field.key]);
                    };
                }
            }
            if (_ftype == 'Point' || _ftype == 'Array') {
                _refreshValue($value, _ftype);
                $interactive = $('<span></span>');
                $interactive
                    .addClass('interactive')
                    .appendTo($field)
                    .text('>')
                    .click(function (e) {
                        if (_childIndex == index) {
                            $children.remove();
                            _childIndex = -1;
                            return;
                        }
                        if (_childIndex != -1) {
                            $children.remove();
                            _childIndex = -1;
                        }
                        var _offset = $field.offset();
                        _offset.left += $field.width();
                        var $childContainer = $('<div></div>');
                        $childContainer.css({
                            position: 'absolute',
                            width: '150px'
                        });
                        $childContainer.appendTo($wrapper);
                        $childContainer.offset(_offset);
                        $children = new InfoPanel(
                            _field.name, $childContainer, object[_field.key], _convert(object[_field.key], _field));
                        $children.onChange = _onChange;
                        _childIndex = index;
                    });
            }
        })(fields[i], i);
    }
    $wrapper.resizable({
        minWidth: $wrapper.width(),
        maxWidth: $wrapper.width() * 3,
        minHeight: $wrapper.height() / 3,
        maxHeight: $wrapper.height(),
        grid: [$wrapper.width(), $wrapper.height()],
        autoHide: true,
        onResize: function (e) {
            $container.width($wrapper.width());
            $container.height($wrapper.height());
        }
    });
    var _hide = function (complete) {
        if (_childIndex != -1) {
            $children.hide(function () {
                hideElem($wrapper, function () {
                    if (isDefined(complete)) {
                        complete();
                    }
                });
            })
        } else {
            hideElem($wrapper, function () {
                if (isDefined(complete)) {
                    complete();
                }
            })
        }
    };
    this.__defineGetter__('hide', function () {
        return _hide;
    });
    var _show = function (complete) {
        showElem($wrapper, function () {
            if (_childIndex != -1) {
                $children.show();
            }
        })
    };
    this.__defineGetter__('show', function () {
        return _show;
    });
    var _remove = function () {
        this.hide();
        $wrapper.remove();
        delete this;
    };
    this.__defineGetter__('remove', function () {
        return _remove;
    });
    var _refresh = function () {
        //var $body = $($table.children('tbody')[0]);
        $table.children('.field').each(function (index, elem) {
            elem = $($(elem).children('.value')[0]);
            var _obj = object[$(elem).attr('_key')];
            _refreshValue(elem, _getType(_obj), _obj);
        });
        if (_childIndex != -1) {
            $children.refresh();
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    })
}
function InfoBox($container) {
    var _panel = undefined;
    var _refresh = function () {
        if (isDefined(_panel)) {
            _panel.refresh();
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    });
    var _clear = function () {
        if (isDefined(_panel)) {
            _panel.remove();
        }
    };
    this.__defineGetter__('clear', function () {
        return _clear;
    });
    var _currentObject = undefined;
    var _activate = function (obj) {
        if (_currentObject === obj) {
            this.refresh();
            return;
        }
        this.clear();
        _currentObject = obj;
        _panel = new InfoPanel(_currentObject.name, $container, _currentObject, _currentObject.infoBoxFields);
        _panel.onChange = function (object, field, ftype, new_val) {
            if (ftype != 'String' && ftype != 'Boolean') {
                new_val = parseFloat(new_val);
            }
            if (ftype == 'Boolean') {
                if (new_val == '1' || new_val == 'True' || new_val == 'true') {
                    new_val = true;
                }
            }
            if (object instanceof Point || object instanceof Array) {
                object.set(field.key, new_val);
            } else {
                object[field.key] = new_val;
            }
            _panel.refresh();
        }
    };
    this.__defineGetter__('activate', function () {
        return _activate;
    });
    var _deactivate = function () {
        if (isDefined(_panel)) {
            _panel.remove();
        }
        _currentObject = undefined;
    };
    this.__defineGetter__('deactivate', function () {
        return _deactivate;
    });
    var _isActivated = function (obj) {
        return _currentObject === obj;
    };
    this.__defineGetter__('isActivated', function () {
        return _isActivated;
    })
}
Point.__fields__ = [
    {
        key: 'x'
    }, {
        key: 'y'
    }
];
function createStandardFields(obj, params) {
    if (!isDefined(params)) {
        params = {};
    }
    if (!isDefined(params.spinner)) {
        params.spinner = true;
    }
    if (!isDefined(params.text)) {
        params.text = true;
    }
    if (!isDefined(params.turn)) {
        params.turn = true;
    }
    if (!isDefined(params.bool)) {
        params.bool = true;
    }
    if (!isDefined(params.children)) {
        params.children = {
            colNum: 1,
            title: ' ',
            fold: true,
            close: true
        }
    }
    var _fields = [];
    if (!isDefined(obj.get)) {
        obj.get = function (key) {
            return this[key];
        }
    }
    if (!isDefined(obj.set)) {
        obj.set = function (key, val) {
            this[key] = val;
        }
    }
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        if (isDefined(obj.get(i))) {
            if (typeof(obj.get(i)) == 'function' && !params.functions) {
                continue;
            }
            _fields.push({
                class: typeof(obj.get(i)) != 'function' ? 'Object' : 'function',
                name: i,
                key: i,
                spinner: params.spinner,
                min: params.min,
                max: params.max,
                step: params.step,
                text: params.text,
                turn: params.turn,
                bool: params.bool,
                children: params.children
            });
        }
    }
    return _fields;
}
function createField(object, field) {
    var $field = $('<div></div>');
    $field.addClass('field');
    var $spinner;
    var _spinner_max = Infinity;
    var _spinner_min = -Infinity;
    var _spinner_step = 0.1;
    var $text;
    var $childContainer;
    var $key = $('<div></div>');
    $key.addClass('key');
    $key.text(field.name || field.key);
    $key.appendTo($field);
    var $val = $('<div></div>');
    $val.addClass('value');
    $val.appendTo($field);
    var _type = typeof(object.get(field.key));
    if (_type == 'number' && field.spinner) {
        $field.addClass('editable');
        $spinner = $('<input/>', {
            type: 'number'
        });
        $spinner.addClass('spinner');
        $spinner.css('position', 'absolute');
        $spinner.appendTo($field);
        $spinner.hide();
        $val.mouseenter(function (e) {
            $spinner.show();
            $spinner.width($val.outerWidth());
            $spinner.height($val.outerHeight());
            var _offset = $val.offset();
            _offset.top += $val.height() / 2 - $spinner.height() / 2;
//                    _offset.left += $val.width() / 2 - $spinner.width() / 2;
            $spinner.offset(_offset);
            $spinner.focus();
        });
        $spinner.keypress(function (e) {
            var _ch = String.fromCharCode(e.which);
            if (_ch == '.') {
                if ($spinner.val().indexOf('.') != -1) {
                    e.preventDefault();
                }
            } else if (_ch == '-') {
                if ($spinner.val()[0] == '-') {
                    $spinner.val($spinner.val().substr(1));
                } else {
                    $spinner.val('-' + $spinner.val());
                }
                $spinner.trigger('change');
                e.preventDefault();
            } else if (e.which == 27) {
                e.preventDefault();
            } else if (e.which == 13) {
            } else if (_ch < '0' || _ch > '9') {
                e.preventDefault();
            }
        });
        $spinner.change(function (e) {
            var _val = $spinner[0].valueAsNumber;
            if (isNaN(_val)) {
                _val = (_spinner_max + _spinner_min) / 2;
            }
            _val = Math.max(_val, _spinner_min);
            _val = Math.min(_val, _spinner_max);
            object.set(field.key, _val);
            $field.trigger('refresh');
        });
        $spinner.blur(function (e) {
            $spinner.hide();
            $field.trigger('refresh');
        });
        $spinner.mouseleave(function (e) {
            $spinner.hide();
            $field.trigger('refresh');
        })
    }
    if (_type == 'string' && field.text) {
        $field.addClass('editable');
        $text = $('<input/>', {
            type: 'text'
        });
        $text.addClass('text');
        $text.css('position', 'absolute');
        $text.appendTo($field);
        $text.hide();
        $val.mouseenter(function (e) {
            $text.show();
            $text.width($val.outerWidth());
            $text.height($val.outerHeight());
            var _offset = $val.offset();
            _offset.top += $val.height() / 2 - $text.height() / 2;
//                    _offset.left += $val.width() / 2 - $text.width() / 2;
            $text.offset(_offset);
            $text.focus();
        });
        $text.change(function (e) {
            object.set(field.key, $text.val());
            $field.trigger('refresh');
        });
        $text.blur(function (e) {
            $text.hide();
            $field.trigger('refresh');
        });
        $text.mouseleave(function (e) {
            $text.hide();
            $field.trigger('refresh');
        })
    }
    if (_type == 'boolean' && field.bool) {
        // checkbox here
    }
    if (_type == 'object' && field.turn) {
        $val.addClass('turn');
        $childContainer = $('<div></div>');
        $childContainer.addClass('infoBox-child');
        $childContainer.appendTo($('body'));
        InfoPanel($childContainer, object.get(field.key), field.children || new Object({}));
        $childContainer.hide();
        $val.click(function (e) {
            if (isDefined($childContainer)) {
                if (!$childContainer.is(':visible')) {
                    $childContainer.show();
                    var _offset = $val.offset();
                    $childContainer.offset({
                        left: _offset.left,
                        top: _offset.top + $val.outerHeight()
                    });
                } else {
                    $childContainer.hide();
                }
            }
        });
    }
    var _refresh = function () {
        var _val = object.get(field.key);
        if (_type == 'object' || _type == 'function') {
            $val.text(field.class || _type);
        } else {
            $val.text(object.get(field.key));
        }
        if (field.spinner && isDefined($spinner)) {
            $spinner.val(object.get(field.key));
            if (typeof(field.min) === 'function') {
                _spinner_min = field.min();
                $spinner.attr('min', _spinner_min);
            }
            if (typeof(field.max) === 'function') {
                _spinner_max = field.max();
                $spinner.attr('max', _spinner_max);
            }
            if (typeof(field.step) === 'function') {
                _spinner_step = field.step();
                $spinner.attr('step', _spinner_step);
            }
        }
        if (field.text && isDefined($text)) {
            $text.val(object.get(field.key));
        }
        if (isDefined($childContainer)) {
            $childContainer.trigger('refresh');
        }
    };
    $field.on('refresh', function (e) {
        _refresh();
        e.stopPropagation();
    });
    _refresh();
    return $field;
}
function calcNum(product, a) {
    if (product % a == 0) {
        return product / a;
    } else {
        return (product - product % a) / a + 1;
    }
}
function InfoPanel($container, object, params) {
    var fields = [];
    if (isDefined(object.__fields__)) {
        fields = object.__fields__;
    } else {
        fields = createStandardFields(object);
    }
    var $title;
    var $fold;
    var $close;
    if (params.title || params.fold || params.close) {
        $title = $('<div></div>');
        $title.addClass('infoBox-title');
        $title.text(params.title || '');
        $title.appendTo($container);
        if (params.close) {
            $close = $('<div></div>');
            $close.addClass('infoBox-close');
            $close.text('X');
            $close.appendTo($title);
        }
        if (params.fold) {
            $fold = $('<div></div>');
            $fold.addClass('infoBox-fold');
            $fold.text('_');
            $fold.appendTo($title);
        }
    }
    var _length = fields.length;
    var _rowNum, _colNum;
    if (isDefined(params.colNum) && isDefined(params.rowNum)) {
        _rowNum = params.rowNum;
        _colNum = params.colNum;
        if (_rowNum * _colNum < _length) {
            _length = _rowNum * _colNum;
        }
    } else if (isDefined(params.colNum)) {
        _colNum = params.colNum;
        _rowNum = calcNum(_length, _colNum);
    } else if (isDefined(params.rowNum)) {
        _rowNum = params.rowNum;
        _colNum = calcNum(_length, _rowNum);
    } else {
        _rowNum = 3;
        _colNum = calcNum(_length, _rowNum);
    }
    var $wrapper = $('<div></div>');
    $wrapper.addClass('infoBox-wrapper');
    $wrapper.appendTo($container);
    var $table = $('<table></table>');
    $table.addClass('infoBox-table');
    $table.appendTo($wrapper);
    var $fields = [];
    var _count = 0;
    for (var i = 0; i < _rowNum; i++) {
        var $tr = $('<tr></tr>');
        $tr.appendTo($table);
        for (var j = 0; j < _colNum; j++) {
            var $td = $('<td></td>');
            $td.appendTo($tr);
            if (_count < _length) {
                var $newField = createField(object, fields[_count]);
                $fields.push($newField);
                $td.append($newField);
                _count++;
            }
        }
    }
    var _refreshTable = function () {
        $fields.forEach(function (item, index) {
            $(item).trigger('refresh');
        })
    };
    $fields.forEach(function (item) {
        $(item).on('change', function (e) {
            _refreshTable();
        });
        $(item).on('refresh', function (e) {
            e.stopPropagation();
        })
    });
    $table.on('refresh', function (e) {
        _refreshTable();
        e.stopPropagation();
    });
    $container.on('refresh', function () {
        _refreshTable();
    });
    _refreshTable();
}
function InfoBox() {
    var _currentObject;
    var _self = this;
    var $container = $('#infoBoxContainer');
    var _activate = function (obj) {
        _self.deactivate();
        if (isDefined(obj)) {
            _currentObject = obj;
            InfoPanel($container, _currentObject, {});
        }
    };
    this.__defineGetter__('activate', function () {
        return _activate;
    });
    var _isActivated = function (obj) {
        if (isDefined(obj)) {
            return (obj === _currentObject);
        } else {
            return isDefined(_currentObject);
        }
    };
    this.__defineGetter__('isActivated', function () {
        return _isActivated;
    });
    var _deactivate = function (obj) {
        $container.empty();
        _currentObject = undefined;
    };
    this.__defineGetter__('deactivate', function () {
        return _deactivate;
    });
    var _refresh = function () {
        if (_self.isActivated()) {
            $container.trigger('refresh');
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    });
}
function ParametricPrompt() {
    var _window = $('<div></div>');
    _window.appendTo($('body'));
    _window.attr('id', 'parametricPrompt');
    _window.addClass('prompt');
    _window.css('position', 'absolute');
}
function toFixedNoZeros(x, k) {
    var s = x.toFixed(k);
    if (s.indexOf('.') == 0) {
        return s;
    }
    while (s[s.length - 1] == '0') {
        s = s.substring(0, s.length - 1);
    }
    return s;
}
function get_random_color(min, max) {
    var v = 70;
    var s = 100;
    var h = Math.floor(Math.random() * (361));
    var h_i, a, v_min, v_inc, v_dec;
    h_i = Math.floor(h / 60.0);
    v_min = (100 - s) * v / 100.0;
    a = (v - v_min) * (h % 60) / 60.0;
    v_inc = v_min + a;
    v_dec = v - a;
    var r, g, b;
    switch (h_i) {
        case 0:
            r = v;
            g = v_inc;
            b = v_min;
            break;
        case 1:
            r = v_dec;
            g = v;
            b = v_min;
            break;
        case 2:
            r = v_min;
            g = v;
            b = v_inc;
            break;
        case 3:
            r = v_min;
            g = v_dec;
            b = v;
            break;
        case 4:
            r = v_inc;
            g = v_min;
            b = v;
            break;
        case 5:
            r = v;
            g = v_min;
            b = v_dec;
            break;
    }
    r = Math.round(r * 2.55).toString(16);
    g = Math.round(g * 2.55).toString(16);
    b = Math.round(b * 2.55).toString(16);
    if (r.length < 2) {
        r = '0' + r;
    }
    if (g.length < 2) {
        g = '0' + g;
    }
    if (b.length < 2) {
        b = '0' + b;
    }
    return '#' + r + g + b;
}
function colorGhostGroup(group) {
    for (var i in group.children) {
        group.children[i].strokeColor = get_random_color();
    }
    group.opacity = 0.6;
}
function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype
}
function getViewIntersections(path, scale) {
    if (typeof(scale) == 'undefined') {
        scale = 1;
    }
    var t = path.getIntersections(new Path.Rectangle(view.bounds).scale(scale));
    var res = [];
    for (var i = 0; i < t.length; i++) {
        var flag = true;
        for (var j = 0; j < res.length; j++) {
            if ((t[i].point - res[j].point).length < MIN_LENGTH) {
                flag = false;
                break;
            }
        }
        if (flag) {
            res.push(t[i].point);
        }
    }
    return res;
}
function getMsInterval(ms1, ms2) {
    var ms1 = time1[0] * 1000 + time1[1];
    var ms2 = time2[0] * 1000 + time2[1];
    return (ms2 - ms1);
}
function eval_expr(expr) {
}
function isDefined(x) {
    return (typeof(x) !== 'undefined');
}
function hideElem($elem, complete) {
    $elem.hide(0, complete);
}
function showElem($elem, complete) {
    $elem.show(0, complete);
}
function roundTo(x, k) {
    var i;
    for (i = 0; i < k; i++) {
        x *= 10;
    }
    x = Math.round(x);
    for (i = 0; i < k; i++) {
        x /= 10;
    }
    return x;
}
function calcArcByAngles(center, radius, angleFrom, angleTo, angleZero) {
    var _vec = new Point(radius, 0);
    if (typeof(angleZero) !== 'undefined') {
        _vec = _vec.rotate(angleZero);
    }
    var _from = _vec.rotate(angleFrom) + center;
    var _through = _vec.rotate((angleFrom + angleTo) / 2) + center;
    var _to = _vec.rotate(angleTo) + center;
    return {
        from: _from,
        through: _through,
        to: _to
    };
}
function calcArcByLen(center, radius, length, angleZero) {
    var angleFrom = - length / radius / 2 * 180 / 3.14;
    var angleTo = length / radius / 2 * 180 / 3.14;
    console.log(angleFrom, angleTo);
    return calcArcByAngles(center, radius, angleFrom, angleTo, angleZero);
}
function CoordinateSystem() {
    var _self = this;
    var _objects = [];
    var _append = function (object) {
        _objects.push(object);
        currentStyle.strokeColor = get_random_color();
        return _objects.length - 1;
    };
    this.__defineGetter__('append', function () {
        return _append;
    });
    var _subtract = function (k) {
        delete _objects[k];
    };
    this.__defineGetter__('subtract', function () {
        return _subtract;
    });
    var _apply = function (callback) {
        _objects.forEach(callback);
    };
    this.__defineGetter__('apply', function () {
        return _apply;
    });
    var _globalToLocal = function (point) {
        return point;
    };
    this.__defineGetter__('globalToLocal', function () {
        return _globalToLocal;
    });
    this.__defineSetter__('globalToLocal', function (p) {
        p = _globalToLocal;
    });
    var _localToGlobal = function (point) {
        return point;
    };
    this.__defineGetter__('localToGlobal', function () {
        return _localToGlobal;
    });
    this.__defineSetter__('localToGlobal', function (p) {
        p = _localToGlobal;
    });
    var _step = function () {return 1;};
    this.__defineGetter__('step', function () {
        return _step();
    });
    var _bound = function () {return new Rectangle(new Point(-10, -10), new Point(10, 10))};
    this.__defineGetter__('bound', function () {
        return _bound();
    });
    var _draw = function (elements) {
        var _result = new Group();
        for (var i in elements) {
            if (!elements.hasOwnProperty(i)) {
                continue;
            }
            if (elements[i] instanceof Parametric) {
                var _nodes = elements[i].getNodes({
                    step: _self.step,
                    bound: _self.bound
                });
                _nodes.forEach(function (item, index) {
                    _result.addChild(new Path(item.map(_self.localToGlobal)));
                });
            } else if (elements[i] instanceof Implicit) {
                var _nodes = elements[i].getNodes({
                    step: _self.step,
                    bound: _self.bound
                });
                var g_step = _self.localToGlobal(new Point(_self.step, 0)).x;
                _nodes = _nodes.map(_self.localToGlobal);
                _nodes.forEach(function (item, index) {
                    _result.addChild(new Path.Circle( {
                        center: item,
                        radius: g_step / 2
                    }))
                });
            } else if (elements[i] instanceof Point) {
            }
        }
        return _result;
    };
    this.__defineGetter__('draw', function () {
        return _draw;
    });
}
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
Affine.Transformer = function() {
    Affine.Transformer.superclass.constructor.call(this);
    this.object = currentCS;
//    this.object.ghost();
    var _me = this;
    var _rotateX, _rotateY, _rotateAll;
    var _scaleX, _scaleY, _scaleAll;
    var _translateX, _translateY, _translateAll;
    var p_rotateX, p_rotateY, p_rotateAll;
    var p_scaleX, p_scaleY, p_scaleAll;
    var p_translateX, p_translateY, p_translateAll;
    var _convert = function (point, bound) {
        return point;
//        if (point.x <= bound.getLeft()) {
//            point.x = bound.getLeft();
//        }
//        if (point.x >= bound.getRight()) {
//            point.x = bound.getRight();
//        }
//        if (point.y <= bound.getBottom()) {
//            point.y = bound.getBottom();
//        }
//        if (point.y >= bound.getTop()) {
//            point.y = bound.getTop();
//        }
//        return point;
    };
    var _calcPoints = function () {
        var _ts = _me.object.tickSize;
        var _p;
        _p = new Point(7 * _ts[0], 0);
        p_rotateX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 7 * _ts[1]);
        p_rotateY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(7 * _ts[0], 7 * _ts[1]);
        p_rotateAll = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(3 * _ts[0], 0);
        p_scaleX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 3 * _ts[1]);
        p_scaleY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(3 * _ts[0], 3 * _ts[1]);
        p_scaleAll = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(5 * _ts[0], 0);
        p_translateX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 5 * _ts[1]);
        p_translateY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        p_translateAll = _me.object.basis[0];
    };
    var _drawTransformPanel = function () {
        if (typeof(_rotateX) !== 'undefined') {
            _rotateX.remove();
        }
        if (typeof(_scaleX) !== 'undefined') {
            _scaleX.remove();
        }
        if (typeof(_translateX) !== 'undefined') {
            _translateX.remove();
        }
        if (typeof(_rotateY) !== 'undefined') {
            _rotateY.remove();
        }
        if (typeof(_scaleY) !== 'undefined') {
            _scaleY.remove();
        }
        if (typeof(_translateY) !== 'undefined') {
            _translateY.remove();
        }
        if (typeof(_rotateAll) !== 'undefined') {
            _rotateAll.remove();
        }
        if (typeof(_scaleAll) !== 'undefined') {
            _scaleAll.remove();
        }
        if (typeof(_translateAll) !== 'undefined') {
            _translateAll.remove();
        }
        _calcPoints();
        _rotateX = new Path.Circle({
            center: p_rotateX,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });
        _rotateY = new Path.Circle({
            center: p_rotateY,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });
        _rotateAll = new Path.Circle({
            center: p_rotateAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });
        _scaleX = new Path.Circle({
            center: p_scaleX,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });
        _scaleY = new Path.Circle({
            center: p_scaleY,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });
        _scaleAll = new Path.Circle({
            center: p_scaleAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });
//        _translateX = new Path.Circle({
//            center: p_translateX,
//            radius: currentTransformerStyle.radiusSmall,
//            strokeColor: currentTransformerStyle.translateColor,
//            strokeWidth: currentTransformerStyle.translateWidth,
//            fillColor: currentTransformerStyle.translateFill,
//            opacity: currentTransformerStyle.translateOpacity
//        });
//        _translateY = new Path.Circle({
//            center: p_translateY,
//            radius: currentTransformerStyle.radiusSmall,
//            strokeColor: currentTransformerStyle.translateColor,
//            strokeWidth: currentTransformerStyle.translateWidth,
//            fillColor: currentTransformerStyle.translateFill,
//            opacity: currentTransformerStyle.translateOpacity
//        });
        _translateAll = new Path.Circle({
            center: p_translateAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.translateColor,
            strokeWidth: currentTransformerStyle.translateWidth,
            fillColor: currentTransformerStyle.translateFill,
            opacity: currentTransformerStyle.translateOpacity
        });
        _rotateX.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateX.onMouseDown = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateX.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };
        _rotateY.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateY.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };
        _rotateAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };
        _scaleX.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleX.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        _scaleY.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleY.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        _scaleAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        
//        _translateX.onMouseEnter = function (event) {
//            this.opacity = currentTransformerStyle.pointOpacity;
//            this.strokeWidth = currentTransformerStyle.pointWidth;
//            this.fillColor = currentTransformerStyle.pointFill;
//        };
//        _translateX.onMouseLeave = function (event) {
//            this.opacity = currentTransformerStyle.translateOpacity;
//            this.strokeWidth = currentTransformerStyle.translateWidth;
//            this.fillColor = currentTransformerStyle.translateFill;
//        };
//        _translateY.onMouseEnter = function (event) {
//            this.opacity = currentTransformerStyle.pointOpacity;
//            this.strokeWidth = currentTransformerStyle.pointWidth;
//            this.fillColor = currentTransformerStyle.pointFill;
//        };
//        _translateY.onMouseLeave = function (event) {
//            this.opacity = currentTransformerStyle.translateOpacity;
//            this.strokeWidth = currentTransformerStyle.translateWidth;
//            this.fillColor = currentTransformerStyle.translateFill;
//        };
        _translateAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _translateAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.translateOpacity;
            this.strokeWidth = currentTransformerStyle.translateWidth;
            this.fillColor = currentTransformerStyle.translateFill;
        };
        
    };
    var _redraw = function () {
        _calcPoints();
        _rotateX.position = p_rotateX;
        _rotateY.position = p_rotateY;
        _rotateAll.position = p_rotateAll;
        _scaleX.position = p_scaleX;
        _scaleY.position = p_scaleY;
        _scaleAll.position = p_scaleAll;
//        _translateX.position = p_translateX;
//        _translateY.position = p_translateY;
        _translateAll.position = p_translateAll;
    };
    _drawTransformPanel();
    var _init = function () {
        var _elems = [
            {
                button: _rotateX,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle, 'X');
                    _redraw();
                }
            },
            {
                button: _scaleX,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length, 'X');
                    _redraw();
                }
            },
//            {
//                button: _translateX,
//                func: function (p0, p1) {
//                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
////                    delta.x = 0;
//                    _me.object.translate(delta, 'X');
//                    _redraw();
//                }
//            },
            {
                button: _rotateY,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle, 'Y');
                    _redraw();
                }
            },
            {
                button: _scaleY,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length, 'Y');
                    _redraw();
                }
            },
//            {
//                button: _translateY,
//                func: function (p0, p1) {
//                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
////                    delta.y = 0;
//                    _me.object.translate(delta, 'Y');
//                    _redraw();
//                }
//            },
            {
                button: _rotateAll,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle);
                    _redraw();
                }
            },
            {
                button: _scaleAll,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length);
                    _redraw();
                }
            },
            {
                button: _translateAll,
                func: function (p0, p1) {
                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
//                    delta.x = 0;
                    _me.object.translate(delta);
                    _redraw();
                }
            }
        ];
        _me.init(_elems);
    };
    _init();
    var _remove = function () {
        if (typeof(_rotateX) !== 'undefined') {
            _rotateX.remove();
        }
        if (typeof(_scaleX) !== 'undefined') {
            _scaleX.remove();
        }
        if (typeof(_translateX) !== 'undefined') {
            _translateX.remove();
        }
        if (typeof(_rotateY) !== 'undefined') {
            _rotateY.remove();
        }
        if (typeof(_scaleY) !== 'undefined') {
            _scaleY.remove();
        }
        if (typeof(_translateY) !== 'undefined') {
            _translateY.remove();
        }
        if (typeof(_rotateAll) !== 'undefined') {
            _rotateAll.remove();
        }
        if (typeof(_scaleAll) !== 'undefined') {
            _scaleAll.remove();
        }
        if (typeof(_translateAll) !== 'undefined') {
            _translateAll.remove();
        }
    };
    this.__defineGetter__('remove', function () {
        return _remove;
    })
};
extend(Affine.Transformer, Transformer);
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
function Polar(prop) {
    Polar.superclass.constructor.call(this);
    this.recalcMatrix = function () {};
    var _angle = 0;
    this.__defineGetter__('angle', function() {
        return _angle;
    });
    this.__defineSetter__('angle', function(p) {
        _angle = p;
        this.recalcMatrix();
    });
    var _scale = 10;
    this.__defineGetter__('scale', function() {
        return _scale;
    });
    this.__defineSetter__('scale', function(p) {
        _scale = p;
        this.recalcMatrix();
    });
    var _draw = function() {};
    this.__defineGetter__('draw', function () {
        return _draw;
    });
    for (key in prop) {
        if (typeof(prop[key])!== 'undefined') {
            this[key] = prop[key];
        }
    }
    this.draw();
}
extend(Polar, CoordinateSystem);
function TTool() {
    var _level = -1;
    this.__defineGetter__('level', function() {
        return _level;
    });
    this.__defineSetter__('level', function(p) {
        _level = p;
        this.onLevelChange();
    });
    var _object = undefined;
    this.__defineGetter__('object', function() {
        return _object;
    });
    this.__defineSetter__('object', function(p) {
        _object = p;
    });
    var _data = undefined;
    this.__defineGetter__('data', function() {
        return _data;
    });
    this.__defineSetter__('data', function(p) {
        _data = p;
    });
    var _onClick = function(event) {};
    this.__defineGetter__('onClick', function() {
        return _onClick;
    });
    this.__defineSetter__('onClick', function(p) {
        _onClick = p;
    });
    var _onDoubleClick = function(event) {};
    this.__defineGetter__('onDoubleClick', function() {
        return _onDoubleClick;
    });
    this.__defineSetter__('onDoubleClick', function(p) {
        _onDoubleClick = p;
    });
    var _onMouseMove = function(event) {};
    this.__defineGetter__('onMouseMove', function() {
        return _onMouseMove;
    });
    this.__defineSetter__('onMouseMove', function(p) {
        _onMouseMove = p;
    });
    var _onMouseDown = function(event) {};
    this.__defineGetter__('onMouseDown', function() {
        return _onMouseDown;
    });
    this.__defineSetter__('onMouseDown', function(p) {
        _onMouseDown = p;
    });
    var _onMouseUp = function(event) {};
    this.__defineGetter__('onMouseUp', function() {
        return _onMouseUp;
    });
    this.__defineSetter__('onMouseUp', function(p) {
        _onMouseUp = p;
    });
    var _onMouseDrag = function(event) {};
    this.__defineGetter__('onMouseDrag', function() {
        return _onMouseDrag;
    });
    this.__defineSetter__('onMouseDrag', function(p) {
        _onMouseDrag = p;
    });
    var _onMouseEnter = function(event) {};
    this.__defineGetter__('onMouseEnter', function() {
        return _onMouseEnter;
    });
    this.__defineSetter__('onMouseEnter', function(p) {
        _onMouseEnter = p;
    });
    var _onMouseLeave = function(event) {};
    this.__defineGetter__('onMouseLeave', function() {
        return _onMouseLeave;
    });
    this.__defineSetter__('onMouseLeave', function(p) {
        _onMouseLeave = p;
    });
    var _onLevelChange = function(data) {};
    this.__defineGetter__('onLevelChange', function() {
        return _onLevelChange;
    });
    this.__defineSetter__('onLevelChange', function(p) {
        _onLevelChange = p;
    });
}
function Creator() {
    Creator.superclass.constructor.call(this);
    var _onCreate = function (data) {};
    this.__defineGetter__('onCreate', function() {
        return _onCreate;
    });
    this.__defineSetter__('onCreate', function(p) {
        _onCreate = p;
    });
}
extend(Creator, TTool);
function Editor() {
    Editor.superclass.constructor.call(this);
    var _onEdit = function (data) {};
    this.__defineGetter__('onEdit', function() {
        return _onEdit;
    });
    this.__defineSetter__('onEdit', function(p) {
        _onEdit = p;
    });
}
extend(Editor, TTool);
function Resizer() {
    Resizer.superclass.constructor.call(this);
    this.onLevelChange = function() {
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Resizer();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };
    this.onMouseDown = function(event) {
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onEdit(event.point);
            }
            this.level = 1;
            this.onEdit(event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onEdit(event.point);
        }
    };
}
extend(Resizer, Editor);
function Rotator() {
    Rotator.superclass.constructor.call(this);
    this.onLevelChange = function() {
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Rotator();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };
    this.onMouseDown = function(event) {
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onEdit(event.point);
            }
            this.level = 1;
            this.onEdit(event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onEdit(event.point);
        }
    };
}
extend(Rotator, Editor);
function Translator() {
    Translator.superclass.constructor.call(this);
    this.onLevelChange = function() {
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Translator();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };
    this.onMouseDown = function(event) {
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onEdit(new Point(0, 0), event.point);
            }
            this.level = 1;
            this.onEdit(event.getLastPoint(), event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onEdit(event.getLastPoint(), event.point);
        }
    };
}
extend(Translator, Editor);
function Transformer() {
    Transformer.superclass.constructor.call(this);
    var _me = this;
    var _init = function (elems) {
        for (var i in elems) {
            if (!elems.hasOwnProperty(i)) {
                continue;
            }
            (function (elem) {
                elem.button.onMouseDrag = function (event) {
                    this.selected = true;
    //                if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
                    if (event.delta.length >= MIN_LENGTH) {
                        if (_me.level == -1) {
                            _me.level = 0;
    //                        elem.func(event.getDownPoint(), event.point);
                            elem.func(event.point - event.delta, event.point);
                        }
                        _me.level = 1;
                        elem.func(event.point - event.delta, event.point);
                    }
                };
                elem.button.onMouseUp = function(event) {
                    this.selected = false;
                    if (_me.level == 1) {
                        _me.level = 2;
//                        elem.func(event.point - event.delta, event.point);
                    }
                };
            })(elems[i]);
        }
    };
    this.__defineGetter__('init', function () {
        return _init;
    });
    this.onLevelChange = function() {
        if (typeof(this.object) !== 'undefined') {
//            this.object.infoBox.activate(this.object);
//            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Transformer();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };
}
extend(Transformer, TTool);
function PlaneObject() {
    var _name = undefined;
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineSetter__('name', function(p) {
        _name = p;
    });
    var _id;
    this.__defineGetter__('id', function () {
        return _id;
    });
    var _path = new Group();
    var _self = this;
    var _mouseOnMe = false;
    var initPath = function () {
        _self.style = _defaultStyle;
        var _evFunc = function (type, event) {
            if (currentTool instanceof Editor && currentTool.level == -1) {
                if (currentTool instanceof Rotator) {
                    currentTool = new _self.__proto__.constructor.Rotator(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Resizer) {
                    currentTool = new _self.__proto__.constructor.Resizer(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Translator) {
                    currentTool = new _self.__proto__.constructor.Translator(); //TODO: Проверить корректность
                }
                currentTool.object = _self;
                currentTool[type](event);
            }
        };
        _path.onClick = function(event) {
            if (event.event.which == 1) {
                _self.selected = !_self.selected;
                _evFunc('onClick', event);
            }
        };
        _path.onMouseDown = function(event) {
            if (event.event.which == 3) {
                if (!_att) {
                    this.style = _attention;
                    _att = true;
                } else {
                    this.style = _defaultStyle;
                    _att = false;
                }
            }
            if (event.event.which == 1) {
                _evFunc('onMouseDown', event);
            }
        };
        _path.onDoubleClick = function(event) {
            _evFunc('onDoubleClick', event);
        };
        _path.onMouseEnter = function(event) {
            _self.pointed = true;
            _mouseOnMe = true;
        };
        _path.onMouseLeave = function(event) {
            _self.pointed = false;
            _mouseOnMe = false;
        };
    };
    initPath();
    this.__defineGetter__('path', function() {
        return _path;
    });
    this.__defineSetter__('path', function(p) {
        if (isDefined(_path)) {
            _path.remove();
        }
        _path = p;
        initPath();
    });
    var _style = undefined;
    var _defaultStyle = currentStyle.clone();
    var _attention = {
        strokeColor: 'red',
        strokeWidth: 5,
        strokeCap: 'round'
    };
    var _att = false;
    var _pointedStyle = new Style({strokeColor: 'skyblue', opacity: 0.5, strokeWidth: 4, strokeCap: 'round'});
    var _selectedStyle = new Style({strokeColor: 'green', opacity: 0.7, strokeWidth: 3, strokeCap: 'round'});
    this.__defineGetter__('style', function() {
        return _style;
    });
    this.__defineSetter__('style', function(p) {
        _style = p;
        _path.style = _style;
    });
    _self.style = _defaultStyle;
    var _selectEnable = true;
    this.__defineGetter__('selectEnable', function() {
        return _selectEnable;
    });
    this.__defineSetter__('selectEnable', function(p) {
        _selectEnable = p;
    });
    var _pointEnable = true;
    this.__defineGetter__('pointEnable', function() {
        return _pointEnable;
    });
    this.__defineSetter__('pointEnable', function(p) {
        _pointEnable = p;
    });
    var _pointed = false;
    this.__defineGetter__('pointed', function () {
        return _pointed;
    });
    this.__defineSetter__('pointed', function (p) {
        if (!this.pointEnable || this.selected) {
            return;
        }
        _pointed = p;
        if (_pointed) {
            this.style = _pointedStyle;
        } else if (!_att) {
            this.style = _defaultStyle;
        } else {
            this.style = _attention;
        }
    });
    var _selected = false;
    this.__defineGetter__('selected', function () {
        return _selected;
    });
    this.__defineSetter__('selected', function (p) {
        if (!this.selectEnable) {
            return;
        }
        _selected = p;
        if (p) {
            _self.coordinateSystem.apply(function (item, index) {
                if (item.id != _self.id) {
                    item.selected = false;
                }
            });
            this.pointed = false;
            this.style = _selectedStyle;
            _infoBoxes[0].activate(_self);
        } else {
            if (!_att) {
                this.style = _defaultStyle;
            } else {
                this.style = _attention;
            }
            if (_mouseOnMe) {
                this.pointed = true;
            }
            _infoBoxes[0].deactivate(_self);
        }
    });
    var _coordinateSystem = undefined;
    this.__defineGetter__('coordinateSystem', function () {
        return _coordinateSystem;
    });
    this.__defineSetter__('coordinateSystem', function (p) {
        if (isDefined(_coordinateSystem)) {
            _coordinateSystem.subtract(_id);
        }
        _coordinateSystem = p;
        _id = _coordinateSystem.append(_self);
        _self.update();
    });
    var _remove = function() {
        _self.path.remove();
        delete _self;
    };
    this.__defineGetter__('remove', function() {
        return _remove;
    });
    var _update = function () {};
    this.__defineGetter__('update', function () {
        return _update;
    });
    var _infoBoxes = [];
    var _appendInfoBox = function (newBox) {
        _infoBoxes.push(newBox);
        return _infoBoxes.length - 1;
    };
    this.__defineGetter__('appendInfoBox', function () {
        return _appendInfoBox;
    });
    var _subtractInfoBox = function (box) {
        if (box instanceof InfoBox) {
            _infoBoxes.forEach(function (item, index) {
                if (item === box) {
                    delete _infoBoxes[index];
                }
            })
        } else if (typeof(box) === 'number') {
            delete _infoBoxes[box];
        }
    };
    this.__defineGetter__('subtractInfoBox', function () {
        return _subtractInfoBox;
    });
    var _refreshInfoBoxes = function () {
        _infoBoxes.forEach(function (item, index) {
            if (item.isActivated(_self)) {
                item.refresh();
            }
        });
    };
    this.__defineGetter__('refreshInfoBoxes', function () {
        return _refreshInfoBoxes;
    });
    _self.appendInfoBox(currentInfoBox);
    this.coordinateSystem = currentCS;
    var __fields__ = [{
        name: 'Имя',
        key: 'name'
    }];
    this.__defineGetter__('__fields__', function () {
        return __fields__;
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
}
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
function Segment() {
    Segment.superclass.constructor.call(this);
    var _self = this;
    this.name = 'Segment' + this.id;
    this.push(new Point(0, 0));
    this.push(new Point(0, 0));
    this.__defineGetter__('from', function () {
        return this.get(0);
    });
    this.__defineSetter__('from', function (p) {
        this.set(0, p);
    });
    this.__defineGetter__('to', function () {
        return this.get(1);
    });
    this.__defineSetter__('to', function (p) {
        this.set(1, p);
    });
    var _angle = function () {
        return (_self.get(1) - _self.get(0)).angle;
    };
    this.__defineGetter__('angle', function () {
        return _angle();
    });
    this.__defineSetter__('angle', function (p) {
        var _piece = this.get(1) - this.get(0);
        _piece.angle = p;
        this.set(1, _piece + this.get(0));
    });
    this.__defineSetter__('length', function (p) {
        var _piece = this.get(1) - this.get(0);
        _piece.length = Math.abs(p);
        if (p < 0) {
            _piece = _piece.rotate(180);
        }
        this.set(1, _piece + this.get(0));
    });
    var __fields__ = [
        {
            name: 'Имя',
            key: 'name',
            text: true
        },
        {
            name: 'Начало',
            key: 'from',
            class: 'Point',
            turn: true
        },
        {
            name: 'Конец',
            key: 'to',
            class: 'Point',
            turn: true
        },
        {
            name: 'Длина',
            key: 'length',
            spinner: true,
            step: function () { _self.coordinateSystem.step; },
            min: function () { return 0.1; }
        },
        {
            name: 'Угол',
            key: 'angle',
            spinner: true
        }
    ];
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });
}
extend(Segment, Figure);
Segment.Creator2points = function () {
    Segment.Creator2points.superclass.constructor.call(this);
    this.onCreate = function(point) {
        if (typeof (this.object) !== 'undefined') {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Segment();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.from = point;
            this.object.selected = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.to = point;
        }
        if (this.level == 2) {
            if (this.object.length == 0) {
                this.object.remove();
            }
            this.level = -1;
            this.object.selected = false;
            this.object = undefined;
        }
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
        }
        this.level = 1;
        this.onCreate(event.point);
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Segment.Creator2points, Creator);
Segment.Resizer = function() {
    Segment.Resizer.superclass.constructor.call(this);
    var _ghostArrow = undefined;
    var _ghostLine = undefined;
    var _length0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point) {
        if (this.level == 0) {
            if (isDefined(_ghostArrow)) {
                _ghostArrow.remove();
            }
            _ghostArrow = new Group();
            var _g_from = this.object.coordinateSystem.localToGlobal(this.object.from);
            var _g_to = this.object.coordinateSystem.localToGlobal(this.object.to);
            var _p, _arrow;
            var _piece = _g_to - _g_from;
            _ghostLine = new Path(_g_from);
            _ghostArrow = new Group();
            while (true) {
                _p = _ghostLine.lastSegment.point + _piece;
                _arrow = _piece.normalize(Math.min(_piece.length * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));
                _ghostArrow.addChild(new Path([_ghostLine.lastSegment.point, _p, _p + _arrow.rotate(90),
                    _p, _p + _arrow.rotate(-90), _p]));
                _ghostLine.add(_p);
                _piece = -_piece;
                _p = _ghostLine.firstSegment.point + _piece;
                _arrow = _piece.normalize(Math.min(_piece.length * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));
                _ghostArrow.addChild(new Path([_ghostLine.firstSegment.point, _p, _p + _arrow.rotate(90),
                    _p, _p + _arrow.rotate(-90), _p]));
                _ghostLine.insertSegment(0, _p);
                _piece = -_piece;
                if (getViewIntersections(_ghostLine).length > 1) {
                    break;
                }
            }
            colorGhostGroup(_ghostArrow);
            _length0 = this.object.length;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.to = this.object.coordinateSystem.globalToLocal(_ghostLine.getNearestPoint(point));
            _deltaAbs = this.object.length - _length0;
            if (_length0 != 0) {
                _deltaRel = this.object.length / _length0;
            } else {
                _deltaRel = 0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (typeof(_ghostArrow) !== 'undefined') {
                _ghostLine.remove();
                _ghostArrow.remove();
                _ghostArrow = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Segment.Resizer, Resizer);
Segment.Rotator = function() {
    Segment.Rotator.superclass.constructor.call(this);
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
            _g_from = this.object.coordinateSystem.localToGlobal(this.object.from);
            _g_to = this.object.coordinateSystem.localToGlobal(this.object.to);
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
            this.object.to = this.object.coordinateSystem.globalToLocal(_p);
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
extend(Segment.Rotator, Rotator);
Segment.Translator = function() {
    Segment.Translator.superclass.constructor.call(this);
    var _ghost = undefined;
    var _from0 = undefined;
    var _to0 = undefined;
    var _delta = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point0, point1) {
        if (isDefined(this.object)) {
            _delta = this.object.coordinateSystem.globalToLocal(point1) - this.object.coordinateSystem.globalToLocal(point0);
        }
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            colorGhostGroup(_ghost);
            _from0 = this.object.from;
            _to0 = this.object.to;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1) {
            this.object.translate(_delta);
            _deltaRel = this.object.from - _from0;
            _helpBox.html('relX: ' + _deltaRel.x.toFixed(3) + '<br>relY' + _deltaRel.y.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Segment.Translator, Translator);
function Arrow() {
    Arrow.superclass.constructor.call(this);
    this.name = 'Arrow' + this.id;
    var _self = this;
    var _update = function () {
        var _functions = [];
         _functions.push(new Parametric.Segment(_self.from, _self.to));
        var _result = _self.coordinateSystem.draw(_functions);
        var _len = _result.firstChild.segments.length;
        if (_len >= 2) {
            var _to = _result.firstChild.segments[_len - 1].point;
            if ((_to - _self.coordinateSystem.localToGlobal(_self.to)).length < 0.01) {
                var _fullLen = _result.firstChild.length;
                var _piece = _to - _result.firstChild.segments[_len - 2].point;
                var _arrow = _piece.normalize(Math.min(_fullLen * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));
                _result.addChild(new Path([_to, _to + _arrow.rotate(ARROW_ANGLE),
                    _to, _to + _arrow.rotate(-ARROW_ANGLE), _to]));
            }
        }
        _self.path = _result;
        _self.refreshInfoBoxes();
        _self.onUpdate();
        view.update();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });
}
extend(Arrow, Segment);
Arrow.Creator2points = function () {
    Arrow.Creator2points.superclass.constructor.call(this);
    this.onCreate = function(point) {
        if (typeof (this.object) !== 'undefined') {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Arrow();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.from = point;
            this.object.selected = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.to = point;
        }
        if (this.level == 2) {
            if (this.object.length == 0) {
                this.object.remove();
            }
            this.level = -1;
            this.object.selected = false;
            this.object = undefined;
        }
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
        }
        this.level = 1;
        this.onCreate(event.point);
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Arrow.Creator2points, Segment.Creator2points);
Arrow.Resizer = function() {
    Arrow.Resizer.superclass.constructor.call(this);
};
extend(Arrow.Resizer, Segment.Resizer);
Arrow.Rotator = function() {
    Arrow.Rotator.superclass.constructor.call(this);
};
extend(Arrow.Rotator, Segment.Rotator);
Arrow.Translator = function() {
    Arrow.Translator.superclass.constructor.call(this);
};
extend(Arrow.Translator, Segment.Translator);
function Polygon() {
    Polygon.superclass.constructor.call(this);
    this.name = 'Polygon' + this.id;
    this.path.closed = true;
    var _num = 0;
    this.__defineGetter__('num', function() {
        return _num;
    });
    var _vertices = [];
    this.__defineGetter__('vertices', function() {
        var clone = [];
        for (var i in _vertices) {
            clone.push(_vertices[i]);
        }
        return clone;
    });
    this.get = function (n) {
        return this.coordSystem.globalToLocal(_vertices[n]);
    };
    this.g_get = function (n) {
        return _vertices[n];
    };
    this.first = function (p) {
        if (typeof(p) !== 'undefined') {
            this.set(0, p);
        }
        return this.coordSystem.globalToLocal(_vertices[0]);
    };
    this.g_first = function (p) {
        if (typeof(p) !== 'undefined') {
            this.g_set(0, p);
        }
        return _vertices[0];
    };
    this.last = function (p) {
        if (typeof(p) !== 'undefined') {
            this.set(this.num - 1, p);
        }
        return this.coordSystem.globalToLocal(_vertices[this.num - 1]);
    };
    this.g_last = function (p) {
        if (typeof(p) !== 'undefined') {
            this.g_set(this.num - 1, p);
        }
        return _vertices[this.num - 1];
    };
    this.set = function (n, value) {
        _vertices[n] = this.coordSystem.localToGlobal(value);
        this.path.segments[n].point = _vertices[n];
    };
    this.g_set = function (n, value) {
        _vertices[n] = value;
        this.path.segments[n].point = _vertices[n];
    };
    this.add = function(point) {
        _vertices.push(this.coordSystem.localToGlobal(point));
        this.path.add(_vertices[_num]);
        _num++;
    };
    this.g_add = function(point) {
        _vertices.push(point);
        this.path.add(_vertices[_num]);
        _num++;
    };
    this.removePoints = function(from, to) {
        if (typeof(to) === 'undefined') {
            to = from + 1;
        }
        this.path.removeSegments(from, to);
        return _vertices.splice(from, (to - from))
    };
    this.insertPoints = function(start, points) {
        points = points.map(function (item) {
            return this.coordSystem.localToGlobal(item);
        });
        _vertices.splice(start, 0, points);
        this.path.insertSegments(start, points);
    };
    this.g_insertPoints = function(start, points) {
        _vertices.splice(start, 0, points);
        this.path.insertSegments(start, points);
    };
    var _length = 0;
    this.__defineGetter__('length', function() {
        var l = 0;
        for (var i = 0; i < this.num - 1; i++) {
            l += (this.get(i) - this.get(i + 1)).length;
        }
        l += (this.last() - this.first()).length;
        return l;
    });
    var _area = 0;
    this.__defineGetter__('area', function() {
        var p = new Path();
        p.visible = false;
        p.closed = true;
        for (var i = 0; i < this.num; i++) {
            p.add(this.get(i));
        }
        return p.area;
    }); //TODO: Неправильно считается
    this.rotate = function(angle, point) {
        angle = this.coordSystem.localToGlobal(angle);
        if (typeof(point) === 'undefined') {
            point = _vertices[0];
        } else {
            point = this.coordSystem.localToGlobal(point);
        }
        this.path.rotate(angle, point);
        for (var i = 0; i < this.path.segments.length - 1; i++) {
            _vertices[i] = this.path.segments[i].point;
        }
        var _infoBoxFields = ['name', 'length'];//'vertices', 'length'];
        this.__defineGetter__('infoBoxFields', function () {
            return _infoBoxFields;
        });
    } // TODO: Поворот отн-но "центра"
    this.infoBoxFields = ['name', 'length', 'area'];
}
extend(Polygon, Figure);
Polygon.CreatorNPoints = function () {
    Polygon.CreatorNPoints.superclass.constructor.call(this);
    this.onCreate = function(point) {
        if (typeof(this.object) !== 'undefined') {
            point = this.object.coordSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Polygon();
            point = this.object.coordSystem.globalToLocal(point);
            this.object.add(point);
            this.object.add(point);
            this.deltaBox.on();
            this.object.selected = true;
            this.object.selectEnable = false;
        }
        if (this.level == 1) {
            this.object.last(point);
            var piece1 = this.object.last() - this.object.get(this.object.num - 2);
            if (this.object.num >= 3) {
                var piece0 = this.object.get(this.object.num - 2) - this.object.get(this.object.num - 3);
            } else {
                piece0 = new Point(1, 0);
            }
            this.deltaBox.refresh(this.object.coordSystem.localToGlobal(point), ['length: ' + piece1.length,
                'angle: ' + piece0.getAngle(piece1)]);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == 2) {
            this.object.add(point);
        }
        if (this.level == 3) {
            if (this.object.length > 0) {
                this.object.coordSystem.objects.push(this.object);
            }
            this.deltaBox.off();
            this.level = -1;
            this.object.selectEnable = true;
            this.object.selected = false;
            this.object = undefined;
        }
    };
    this.onClick = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
            this.level = 1;
        }
    };
    this.onDoubleClick = function(event) {
        if (this.level == -1) {
            this.level = 0;
            this.onCreate(event.point);
            return;
        }
        if (this.level == 1) {
            this.level = 3;
            this.onCreate(event.point);
            return;
        }
    };
    this.onMouseMove = function(event) {
        if (this.level == 0) {
            this.level = 1;
        }
        if (this.level == 1) {
            this.onCreate(event.point);
        }
    }
};
extend(Polygon.CreatorNPoints, Creator);
function Curve() {
    Curve.superclass.constructor.call(this);
    this.name = 'Curve' + this.id;
    var _self = this;
    var _function;
    this.__defineGetter__('fn', function () {
        return _function;
    });
    this.__defineSetter__('fn', function (p) {
        _function = p;
        _function.onChange = function () {
            _self.update();
        };
        _self.update();
    });
    var _onUpdate = function () {};
    this.__defineGetter__('onUpdate', function () {
        return _onUpdate;
    });
    this.__defineSetter__('onUpdate', function (p) {
        _onUpdate = p;
    });
    var _update = function () {
        if (isDefined(_function)) {
            _self.path = _self.coordinateSystem.draw([_function]);
            _self.refreshInfoBoxes();
            _onUpdate();
        }
        view.update();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });
    var _transform = function (new_basis, old_basis) {
        if (isDefined(_function)) {
            _function.transform(new_basis, old_basis);
            _self.refreshInfoBoxes();
        }
        _update();
    };
    this.__defineGetter__('transform', function () {
        return _transform;
    });
    var _manual = function (fn) {
        _self.fn = fn;
    };
    this.__defineGetter__('manual', function () {
        return _manual;
    });
    var __fields__ = [
        {
            name: 'Имя',
            key: 'name',
            text: true
        }, {
            name: 'Функция',
            key: 'fn',
            get class() { return (_self.fn instanceof Parametric ? 'Parametric' : 'Implicit') } ,
            turn: true
        }
    ];
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    })
}
extend(Curve, PlaneObject);
Curve.CreatorImplicitManual = function () {
    Curve.CreatorImplicitManual.superclass.constructor.call(this);
    var $container = $('<div></div>');
    $container.addClass('prompt');
    $container.appendTo($('body'));
    var $table = $('<table></table>');
    $table.appendTo($container);
    var $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Левая часть: </td>');
    var $Left = $('<input/>', {
        type: 'text',
        value: 'x*x + y*y'
    });
    $row.append($('<td></td>').append($Left));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Знак неравенства: </td>');
    var $Sense = $('<input/>', {
        type: 'text',
        value: '<='
    });
    $row.append($('<td></td>').append($Sense));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Правая часть: </td>');
    var $Right = $('<input/>', {
        type: 'text',
        value: '4'
    });
    $row.append($('<td></td>').append($Right));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра 1: </td>');
    var $X = $('<input/>', {
        type: 'text',
        value: 'x'
    });
    $row.append($('<td></td>').append($X));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра 2: </td>');
    var $Y = $('<input/>', {
        type: 'text',
        value: 'y'
    });
    $row.append($('<td></td>').append($Y));
    var $Ok = $('<input/>', {
        type: 'button',
        value: 'Ok'
    });
    $Ok.appendTo($container);
    $Ok.addClass('Ok');
    var $Cancel = $('<input/>', {
        type: 'button',
        value: 'Cancel'
    });
    $Cancel.appendTo($container);
    $Cancel.addClass('Cancel');
    $Cancel.click(function (e) {
        $container.remove();
    });
    var _self = this;
    $Ok.click(function (e) {
        _self.object = new Curve();
        _self.object.fn = new Implicit($Left.val(), $Right.val(), $Sense.val(), $X.val(), $Y.val(), {});
        _self.object = undefined;
        $container.remove();
    });
};
extend(Curve.CreatorImplicitManual, Creator);
Curve.CreatorParametricManual = function () {
    Curve.CreatorParametricManual.superclass.constructor.call(this);
    var $container = $('<div></div>');
    $container.addClass('prompt');
    $container.appendTo($('body'));
    var $table = $('<table></table>');
    $table.appendTo($container);
    var $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>X(t): </td>');
    var $Xt = $('<input/>', {
        type: 'text',
        value: 'sin(t)'
    });
    $row.append($('<td></td>').append($Xt));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Y(t): </td>');
    var $Yt = $('<input/>', {
        type: 'text',
        value: 'cos(t)'
    });
    $row.append($('<td></td>').append($Yt));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра: </td>');
    var $t = $('<input/>', {
        type: 'text',
        value: 't'
    });
    $row.append($('<td></td>').append($t));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Начало: </td>');
    var $begin = $('<input/>', {
        type: 'text',
        value: '-10'
    });
    $row.append($('<td></td>').append($begin));
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Конец: </td>');
    var $end = $('<input/>', {
        type: 'text',
        value: '10'
    });
    $row.append($('<td></td>').append($end));
    var $params = $('<table></table>');
    $params.addClass('params');
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append($('<td colspan="2"></td>').append($params));
    $params.append('<caption>Дополнительные параметры: </caption>');
    var $parameters = [];
    for (var i = 0; i < 5; i++) {
        var _k = $('<input/>', {
            type: 'text',
            placeholder: 'Имя параметра'
        });
        var _v = $('<input/>', {
            type: 'text',
            placeholder: 'Значение по умолчанию'
        });
        $row = $('<tr></tr>');
        $row.append($('<td></td>').append(_k));
        $row.append($('<td></td>').append(_v));
        $params.append($row);
        $parameters.push([_k, _v]);
    }
    var $Ok = $('<input/>', {
        type: 'button',
        value: 'Ok'
    });
    $Ok.appendTo($container);
    $Ok.addClass('Ok');
    var $Cancel = $('<input/>', {
        type: 'button',
        value: 'Cancel'
    });
    $Cancel.appendTo($container);
    $Cancel.addClass('Cancel');
    $Cancel.click(function (e) {
        $container.remove();
    });
    var _self = this;
    $Ok.click(function (e) {
        var p = {};
        $parameters.forEach(function (item, index) {
            if ($(item[0]).val() != '' && $(item[1]).val() != '') {
                p[$(item[0]).val()] = parseFloat($(item[1]).val());
            }
        });
        _self.object = new Curve();
        _self.object.fn = new Parametric($Xt.val(), $Yt.val(), $t.val(), parseFloat($begin.val()), parseFloat($end.val()), p);
        _self.object = undefined;
        $container.remove();
    });
};
extend(Curve.CreatorParametricManual, Creator);
function Circle() {
    Circle.superclass.constructor.call(this);
    this.name = 'Circle' + this.id;
    var _self = this;
    var _radius = 0;
    this.__defineGetter__('radius', function () {
        return _radius;
    });
    this.__defineSetter__('radius', function (p) {
        _radius = p;
        _self.fn.setParam('radius', _radius);
    });
    var _center = new Point(0, 0);
    this.__defineGetter__('center', function () {
        return _center;
    });
    this.__defineSetter__('center', function (p) {
        _center = p;
        _center.set = function (k, val) {
            this[k] = val;
            _self.fn.setParam('c' + k, this[k])
        };
        _center.get = function (k) {
            return this[k];
        };
        _center.__fields__ = [
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
         ];
        _self.fn.setParam('cx', _center.x);
        _self.fn.setParam('cy', _center.y);
    });
    _self.fn = new Parametric.Circle(_center, _radius);
    _self.center = _center;
    var _manual = function (center, radius) {
        _self.center = center;
        _self.radius = radius;
    };
    this.__defineGetter__('manual', function () {
        return _manual;
    });
    var _transform = function (new_basis, old_basis) {
//        if (isDefined(_function)) {
//            _self.fn.transform(new_basis, old_basis);
//            _self.refreshInfoBoxes();
//        }
//        _self.fn.setParam('cx', _self.fn.getParam('cx') + old_basis[0].x);
//        _self.fn.setParam('cy', _self.fn.getParam('cy') + old_basis[0].y);
        _self.center += old_basis[0];
        _self.refreshInfoBoxes();
//        _self.update();
    };
    this.__defineGetter__('transform', function () {
        return _transform;
    });
    _self.fn.__fields__ = [
        {
            name: 'X(t)',
            key: 'Xt',
            text: false
        }, {
            name: 'Y(t)',
            key: 'Yt',
            text: false
        }, {
            name: 'Радиус',
            key: 'radius',
            spinner: false
        }, {
            name: 'Сдвиг X',
            key: 'cx',
            spinner: false
        }, {
            name: 'Сдвиг Y',
            key: 'cy',
            spinner: false
        }
    ];
    var __fields__ = [
        {
            name: 'Имя',
            key: 'name',
            text: true
        },
        {
            name: 'Уравнение',
            key: 'fn',
            class: 'Parametric',
            turn: true
        },
        {
            name: 'Центр',
            key: 'center',
            class: 'Point',
            turn: true
        }, {
            name: 'Радиус',
            key: 'radius',
            spinner: true
        }
    ];
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });
}
extend(Circle, Curve);
Circle.Creator2points = function () {
    Circle.Creator2points.superclass.constructor.call(this);
    this.onCreate = function (point) {
        if (isDefined(this.object)) {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Circle();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.center = point;
            this.object.selected = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.radius = (point - this.object.center).length;
        }
        if (this.level == 2) {
            if (this.object.radius == 0) {
                this.object.remove();
            }
            this.level = -1;
            this.object.selected = false;
            this.object = undefined;
        }
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
        }
        this.level = 1;
        this.onCreate(event.point);
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Circle.Creator2points, Creator);
Circle.Resizer = function() {
    Circle.Resizer.superclass.constructor.call(this);
    var _ghost = undefined;
    var _radius0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point) {
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group([(new Ghost(this.object)).path]);
            colorGhostGroup(_ghost);
            _radius0 = this.object.radius;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.radius = (this.object.coordinateSystem.globalToLocal(point) -
                this.object.center).length;
            _deltaAbs = this.object.radius - _radius0;
            if (_radius0 != 0) {
                _deltaRel = this.object.radius / _radius0;
            } else {
                _deltaRel = 0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (isDefined(_ghost)) {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Circle.Resizer, Resizer);
Circle.Rotator = function() {
    Circle.Rotator.superclass.constructor.call(this);
    var _ghost = undefined;
    var _ghostCircle = undefined;
    var _ghostArc = undefined;
    var _ghostLineFrom = undefined;
    var _ghostLineTo = undefined;
    var _angle0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    var _point0;
    var _g_center;
    this.onEdit = function(point) {
        if (this.level == 0) {
            _ghost = (new Ghost(this.object)).path;
            _g_center = this.object.coordinateSystem.localToGlobal(this.object.center);
            _angle0 = (this.object.coordinateSystem.globalToLocal(point) - this.object.center).angle;
            var _tmp = new Point(this.object.radius, 0);
            _tmp.angle = _angle0;
            _tmp += this.object.center;
            _tmp = this.object.coordinateSystem.localToGlobal(_tmp);
            _ghostCircle = (new Path.Circle({
                center: _g_center,
                radius: (_tmp - _g_center).length
            }));
            _ghostArc = new Path();
            _ghostArc.dashArray = [5, 5];
            _ghostLineFrom = new Path.Line(_g_center, _tmp);
            _ghostLineFrom.dashArray = [5, 5];
            _ghostLineTo = _ghostLineFrom.clone();
            colorGhostGroup(new Group([_ghost, _ghostCircle, _ghostArc, _ghostLineFrom, _ghostLineTo]));
            _point0 = point;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            var _p = _ghostCircle.getNearestPoint(point);
            var _ca = calcArcByAngles(_g_center, (_p - _g_center).length / 5, 0, (_p - _g_center).angle - _angle0, _angle0);
            var _style = _ghostArc.style;
            if (isDefined(_ghostArc)) {
                _ghostArc.remove();
            }
            _ghostArc = new Path.Arc(_ca);
            _ghostArc.style = _style;
            _ghostLineTo.removeSegment(_ghostLineTo.segments.length - 1);
            _ghostLineTo.addSegment(_p);
            _deltaAbs = (_p - _g_center).angle - _angle0 - _angle0;
            if (_angle0 == 0) {
                _deltaRel = 0;
            } else {
                _deltaRel = ((_p - _g_center).angle - _angle0) / _angle0;
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
                _ghostLineFrom.remove();
                _ghostLineTo.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Circle.Rotator, Rotator);
Circle.Translator = function() {
    Circle.Translator.superclass.constructor.call(this);
    var _ghost = undefined;
    var _center0 = undefined;
    var _delta = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point0, point1) {
        if (isDefined(this.object)) {
            _delta = this.object.coordinateSystem.globalToLocal(point1) - this.object.coordinateSystem.globalToLocal(point0);
        }
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            colorGhostGroup(_ghost);
            _center0 = this.object.center;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1) {
            this.object.center += _delta;
            _deltaRel = this.object.center - _center0;
            _helpBox.html('relX: ' + _deltaRel.x.toFixed(3) + '<br>relY' + _deltaRel.y.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (isDefined(_ghost)) {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Circle.Translator, Translator);
function Straight() {
    Straight.superclass.constructor.call(this);
    this.name = 'Straight' + this.id;
    var _self = this;
    var _point1 = new Point(0, 0);
    this.__defineGetter__('point1', function () {
        return _point1;
    });
    this.__defineSetter__('point1', function (p) {
        _point1 = p;
        _point1.set = function (k, val) {
            this[k] = val;
            _self.fn.setParam('angle', (_point2 - _point1).getAngleInRadians());
            _self.fn.setParam('b', _point1.y - _point1.x * (_point2.y - _point1.y) / (_point2.x - _point1.x));
        };
        _point1.get = function (k) {
            return this[k];
        };
        _point1.__fields__ = [
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
        ];
        _self.fn.setParam('angle', (_point2 - _point1).getAngleInRadians());
        _self.fn.setParam('b', _point1.y - _point1.x * (_point2.y - _point1.y) / (_point2.x - _point1.x));
    });
    var _point2 = new Point(0, 1);
    this.__defineGetter__('point2', function () {
        return _point2;
    });
    this.__defineSetter__('point2', function (p) {
        _point2 = p;
        _point2.set = function (k, val) {
            this[k] = val;
            _self.fn.setParam('angle', (_point2 - _point1).getAngleInRadians());
            _self.fn.setParam('b', _point1.y - _point1.x * (_point2.y - _point1.y) / (_point2.x - _point1.x));
        };
        _point2.get = function (k) {
            return this[k];
        };
        _point2.__fields__ = [
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
        ];
        _self.fn.setParam('angle', (_point2 - _point1).getAngleInRadians());
        _self.fn.setParam('b', _point1.y - _point1.x * (_point2.y - _point1.y) / (_point2.x - _point1.x));
    });
    _self.fn = new Direct.Straight(_point1, _point2);
    _self.point1 = new Point(0, 0);
    _self.point2 = new Point(0, 1);
    var _manual = function (point1, point2) {
        _self.point1 = point1;
        _self.point2 = point2;
    };
    this.__defineGetter__('manual', function () {
        return _manual;
    });
    _self.fn.__fields__ = [
        {
            name: 'Y(x)',
            key: 'fn',
            text: false
        }, {
            name: 'Угол (рад.)',
            key: 'angle',
            spinner: false
        }, {
            name: 'Сдвиг',
            key: 'b',
            spinner: false
        }
    ];
    var __fields__ = [
        {
            name: 'Имя',
            key: 'name',
            text: true
        },
        {
            name: 'Уравнение',
            key: 'fn',
            class: 'Direct',
            turn: true
        },
        {
            name: 'Точка 1',
            key: 'point1',
            class: 'Point',
            turn: true
        }, {
            name: 'Точка 2',
            key: 'point2',
            class: 'Point',
            turn: true
        }
    ];
    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });
    var _get = function (key) {
        return _self[key];
    };
    this.__defineGetter__('get', function () {
        return _get;
    });
    var _set = function(key, val) {
        _self[key] = val;
    };
    this.__defineGetter__('set', function () {
        return _set;
    });
}
extend(Straight, Curve);
Straight.Creator2points = function () {
    Straight.Creator2points.superclass.constructor.call(this);
    this.onCreate = function(point) {
        if (typeof (this.object) !== 'undefined') {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Straight();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.point1 = point;
            this.object.selected = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.point2 = point;
        }
        if (this.level == 2) {
            if (this.object.length == 0) {
                this.object.remove();
            }
            this.level = -1;
            this.object.selected = false;
            this.object = undefined;
        }
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
        }
        this.level = 1;
        this.onCreate(event.point);
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Straight.Creator2points, Creator);
Straight.Resizer = function() {
    Straight.Resizer.superclass.constructor.call(this);
    var _length0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point) {
        if (this.level == 0) {
            var _g_from = this.object.coordinateSystem.localToGlobal(this.object.point1);
            var _g_to = this.object.coordinateSystem.localToGlobal(this.object.point2);
            var _p, _arrow;
            var _piece = _g_to - _g_from;
            _length0 = this.object.length;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.point2 = this.object.coordinateSystem.globalToLocal(this.object.path.children[0].getNearestPoint(point));
            _deltaAbs = this.object.length - _length0;
            if (_length0 != 0) {
                _deltaRel = this.object.length / _length0;
            } else {
                _deltaRel = 0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            _helpBox.remove();
        }
    };
};
extend(Straight.Resizer, Resizer);
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
Straight.Translator = function() {
    Straight.Translator.superclass.constructor.call(this);
    var _ghost = undefined;
    var _from0 = undefined;
    var _to0 = undefined;
    var _delta = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;
    this.onEdit = function(point0, point1) {
        if (isDefined(this.object)) {
            _delta = this.object.coordinateSystem.globalToLocal(point1) - this.object.coordinateSystem.globalToLocal(point0);
        }
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            colorGhostGroup(_ghost);
            _from0 = this.object.point1;
            _to0 = this.object.point2;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1) {
            this.object.point1 += _delta;
            this.object.point2 += _delta;
            _deltaRel = this.object.point1 - _from0;
            _helpBox.html('relX: ' + _deltaRel.x.toFixed(3) + '<br>relY' + _deltaRel.y.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Straight.Translator, Translator);
// TODO: 5) global and local points
// TODO: 7) при изменении planeobject.style.strokeColor не применяется стиль
// TODO: 8) Всеобщее округление
// TODO: 9) Маленькая окружность в Rotator
// TODO: 10) Ограничение длины на Resizer
// TODO: 11) Добавить changing в InfoBox
var tool = new Tool();
var currentStyle = {
    strokeColor: get_random_color(),
    strokeWidth: 2,
    strokeCap: 'round',
    opacity: 1,
    clone: function () {
        var _cl = {};
        for (var i in this) {
            if (!this.hasOwnProperty(i)) {
                continue;
            }
            _cl[i] = this[i];
        }
        return _cl;
    }
};
var currentAxisStyle = new Style({
    strokeColor: 'blue',
    strokeWidth: 2,
    opacity: 0.8
});
var currentTickStyle = new Style({
    strokeColor: 'gray',
    strokeWidth: 2
});
var currentLabelStyle = new Style({
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 10,
    fillColor: 'red',
    justification: 'center'
});
var currentTransformerStyle = {
    rotateColor: 'green',
    rotateFill: 'green',
    rotateWidth: 3,
    rotateOpacity: 0.7,
    scaleColor: 'purple',
    scaleFill: 'purple',
    scaleWidth: 2,
    scaleOpacity: 0.7,
    translateColor: 'red',
    translateFill: 'red',
    translateWidth: 1,
    translateOpacity: 0.7,
    radiusSmall: 7,
    radiusBig: 14,
    pointWidth: 4,
    pointOpacity: 0.7,
    pointFill: 'white'
};
var currentGridStyle = new Style({
    strokeColor: 'green',
    strokeWidth: 1,
    dashArray: [5, 5],
    opacity: 0.5
});
view.center = new Point(0, 0);
var currentCS = new Affine({
    center: new Point(-0, 0),
    unitX: new Point(40, 0),
    unitY: new Point(0, -40)
});
var currentInfoBox = new InfoBox($('#infoBoxContainer'));
//var currentDeltaBox = new DeltaBox();
//var currentTool = new Segment.Creator2points();
var evFunc = function (type, event) {
    if (currentTool instanceof Creator) {
        currentTool[type](event);
    }
    if (currentTool instanceof Editor && typeof(currentTool.object) !== 'undefined') {
        currentTool[type](event);
    }
};
var _dblClickTimerId = -1;
tool.onClick = function(event) {          //TODO: когда одинарный щелчок - двойной щелчок может неправильно работать
    var body = function(event) {
        _dblClickTimerId = -1;
        evFunc('onClick', event);
    };
    if (_dblClickTimerId != -1) {
        clearTimeout(_dblClickTimerId);
        _dblClickTimerId = -1;
        tool.onDoubleClick(event);
    } else {
        _dblClickTimerId = setTimeout(body, DOUBLE_CLICK_MAX_TIME, event);
    }
};
tool.onMouseDown = function(event) {
    if (event.event.which == 1) {
        evFunc('onMouseDown', event);
    }
};
tool.onMouseUp = function(event) {
    if ((event.getDownPoint() - event.point).length == 0) {
        tool.onClick(event);
    }
    evFunc('onMouseUp', event);
};
tool.onMouseDrag = function(event) {
    if (event.event.which == 1) {
        evFunc('onMouseDrag', event);
    }
};
tool.onMouseMove = function(event) {
    evFunc('onMouseMove', event);
};
tool.onMouseEnter = function(event) {
    evFunc('onMouseEnter', event);
};
tool.onMouseLeave = function(event) {
    evFunc('onMouseLeave', event);
};
tool.onDoubleClick = function(event) {
    evFunc('onDoubleClick', event);
};
window.MathGraph = function () {
    this.__defineGetter__('EmptyTool', function () {
        return TTool;
    });
    this.__defineGetter__('Rotator', function () {
        return Rotator;
    });
    this.__defineGetter__('Resizer', function () {
        return Resizer;
    });
    this.__defineGetter__('Translator', function () {
        return Translator;
    });
    this.__defineGetter__('Segment', function () {
        return Segment;
    });
    this.__defineGetter__('Arrow', function () {
        return Arrow;
    });
    this.__defineGetter__('Affine', function () {
        return Affine;
    });
    this.__defineGetter__('Circle', function () {
        return Circle;
    });
    this.__defineGetter__('Straight', function () {
        return Straight;
    });
    this.__defineGetter__('Curve', function () {
        return Curve;
    });
};
COMPLETE_PAPER = true;
