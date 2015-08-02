function DeltaBox() {
    var _defaultPoint = new Point(0, 0);
    this.__defineGetter__('defaultPoint', function() {
        return _defaultPoint;
    });
    this.__defineSetter__('defaultPoint', function(p) {
        _defaultPoint = p;
    });

    var _elem = new PointText({
        point: _defaultPoint,
        content: '',
        fillColor: 'gray',
        fontFamily: 'Courier New',
        fontSize: 15,
        visible: false,
        opacity: 0.9,
        justification: 'left'
    });

    this.on = function() {
        _elem.visible = true;
    };

    this.off = function() {
        _elem.visible = false;
    };

    this.refresh = function(point, data) {
        var s = '';
        for (var i in data) {
            s += data[i] + '\n';
        }
        s += '\n';
        if (typeof(point) !== 'undefined') {
            _elem.point = point + LABEL_TRANSLATE_VECTOR;
        } else {
            _elem.point = _defaultPoint;
        }
        _elem.content = s;
    }

}