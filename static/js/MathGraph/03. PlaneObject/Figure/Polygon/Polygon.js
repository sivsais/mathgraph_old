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