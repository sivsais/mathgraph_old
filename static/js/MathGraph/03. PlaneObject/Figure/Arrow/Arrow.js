function Arrow() {
    Arrow.superclass.constructor.call(this);

    var _self = this;

    this.name = 'Arrow' + this.id;

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
        return _self.coordSystem.round((_self.get(1) - _self.get(0)).angle);
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
        p = this.coordSystem.round(p);
        var _piece = this.get(1) - this.get(0);
        _piece.length = Math.abs(p);
        if (p < 0) {
            _piece = _piece.rotate(180);
        }
        this.set(1, _piece + this.get(0));
    });

    var _draw = function () {
        if (_self.path.segments.length > 0) {
            _self.path.removeSegments(0);
        }
        var _from = _self.coordSystem.localToGlobal(_self.get(0));
        var _to = _self.coordSystem.localToGlobal(_self.get(1));

        var _piece = _to - _from;
        var _arrow = _piece.normalize(Math.min(_piece.length * ARROW_LENGTH,
            ARROW_LENGTH_MAX));
        _self.path.addSegments([_from,  _to, _to + _arrow.rotate(ARROW_ANGLE),
            _to, _to + _arrow.rotate(-ARROW_ANGLE), _to]);
    };

    var _update = function () {
        _draw();
    };
    this.onUpdate = _update;

    var _infoBoxFields = [{
        type: 'String',
        name: 'Name',
        editable: true,
        slider: false,
        inadmissible: '!@#$%^&*()-=+',
        key: 'name',
        max: 10,
        min: 1
    }, {
        type: 'Point',
        name: 'Start',
        editable: true,
        changer: true,
        key: 'from',
        max: 100,
        min: -100,
        step: 0.1
    }, {
        type: 'Point',
        name: 'End',
        editable: true,
        slider: false,
        key: 'to',
        max: 100,
        min: -100,
        step: 0.1
    }, {
        type: 'Number',
        name: 'Length',
        editable: true,
        changer: true,
        key: 'length',
        step: 0.5
    }, {
        type: 'Number',
        name: 'Angle',
        editable: false,
        slider: false,
        key: 'angle',
        max: 360,
        min: 0,
        step: 0.1
    }];
    this.__defineGetter__('infoBoxFields', function() {
        return _infoBoxFields;
    });
}
extend(Arrow, Figure);