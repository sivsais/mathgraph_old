function Segment() {
    Segment.superclass.constructor.call(this);

    this.name = 'Segment' + this.id;

    var _from = new Point(0, 0);
    this.__defineGetter__('from', function() {
        return this.coordSystem.globalToLocal(_from);
    });
    this.__defineSetter__('from', function(p) {
        p.x = p.x.toFixed(2); p.y = p.y.toFixed(2);;
        _from = this.coordSystem.localToGlobal(p);
        if (this.path.segments.length > 0) {
            this.path.removeSegment(0);
        }
        this.path.insertSegment(0, _from);
        _length = (_to - _from).length;
        _angle = (_to - _from).angle;
    });

    var _to = new Point(0, 0);
    this.__defineGetter__('to', function() {
        return this.coordSystem.globalToLocal(_to);
    });
    this.__defineSetter__('to', function(p) {
        p.x = p.x.toFixed(2); p.y = p.y.toFixed(2);;
        _to = this.coordSystem.localToGlobal(p);
        if (this.path.segments.length > 1) {
            this.path.removeSegments(1);
        }

        this.path.addSegment(_to);
        _length = (_to - _from).length;
        _angle = (_to - _from).angle;
    });

    var _length = 0;
    this.__defineGetter__('length', function() {
        return (this.to - this.from).length;
    });
    this.__defineSetter__('length', function(p) {
        p = p.toFixed(3);
        var piece = this.to - this.from;
        piece.length = p;
        piece += this.from;
        this.to = piece;
        _length = (_to - _from).length;
    });

    var _angle = 0;
    this.__defineGetter__('angle', function() {
        return this.coordSystem.globalToLocal((this.to - this.from).angle);
    });
    this.__defineSetter__('angle', function(p) {
        p = p.toFixed(2);
        p = this.coordSystem.localToGlobal(p);
        var piece = this.to - this.from;
        piece.angle = p;
        piece += this.from;
        this.to = piece;
        _angle = (_to - _from).angle;
    });

    this.rotate = function (angle, point) {
        angle = this.coordSystem.localToGlobal(angle);
        if (typeof(point) === 'undefined') {
            point = _from;
        } else {
            point = this.coordSystem.localToGlobal(point);
        }
        this.path.rotate(angle, point);
        _from = this.path.firstSegment.point;
        _to = this.path.lastSegment.point;
        _angle = (_to - _from).angle;
    };

    var _infoBoxFields = ['name', 'from', 'to', 'length', 'angle'];
    this.__defineGetter__('infoBoxFields', function() {
        return _infoBoxFields;
    });

    this.__defineGetter__('g_from', function() {
        return _from;
    });
    this.__defineGetter__('g_to', function() {
        return _to;
    });
    this.__defineGetter__('g_length', function() {
        return _length;
    });
    this.__defineGetter__('g_angle', function() {
        return _angle;
    });
}
extend(Segment, Figure);