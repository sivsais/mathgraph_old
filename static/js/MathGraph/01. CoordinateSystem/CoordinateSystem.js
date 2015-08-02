    function CoordinateSystem() {

    var _center = new Point(0, 0);
    this.__defineGetter__('center', function() {
        return _center;
    });
    this.__defineSetter__('center', function(p) {
        _center = p;
    });

    var _objects = [];
    this.__defineGetter__('objects', function() {
        return _objects;
    });
}