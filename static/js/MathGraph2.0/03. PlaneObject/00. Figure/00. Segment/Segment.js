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