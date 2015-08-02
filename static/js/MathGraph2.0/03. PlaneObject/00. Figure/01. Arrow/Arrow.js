function Arrow() {
    Arrow.superclass.constructor.call(this);

    this.name = 'Arrow' + this.id;

    var _self = this;

    var _update = function () {
        var _functions = [];
         _functions.push(new Parametric.Segment(_self.from, _self.to));

        var _result = _self.coordinateSystem.draw(_functions);
        var _len = _result.firstChild.segments.length;
        if (_len >= 2) {
            var _to = _result.firstChild.segments[_len - 1].point;
            if ((_to - _self.coordinateSystem.localToGlobal(_self.to)).length < 0.01) {
                var _fullLen = _result.firstChild.length;
                var _piece = _to - _result.firstChild.segments[_len - 2].point;
                var _arrow = _piece.normalize(Math.min(_fullLen * ARROW_LENGTH,
                    ARROW_LENGTH_MAX));
                _result.addChild(new Path([_to, _to + _arrow.rotate(ARROW_ANGLE),
                    _to, _to + _arrow.rotate(-ARROW_ANGLE), _to]));
            }
        }
        _self.path = _result;
        _self.refreshInfoBoxes();
        _self.onUpdate();
        view.update();
    };
    this.__defineGetter__('update', function () {
        return _update;
    });
}
extend(Arrow, Segment);