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