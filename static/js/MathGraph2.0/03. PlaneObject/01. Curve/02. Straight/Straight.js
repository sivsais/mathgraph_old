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