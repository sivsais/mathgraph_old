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