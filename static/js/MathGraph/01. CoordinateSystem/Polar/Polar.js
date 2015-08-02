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
    })

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