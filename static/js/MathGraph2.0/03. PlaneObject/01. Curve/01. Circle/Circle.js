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