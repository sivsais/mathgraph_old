Segment.Translator = function() {
    Segment.Translator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _from0 = undefined;
    var _to0 = undefined;
    var _delta = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;

    this.onEdit = function(point0, point1) {
        if (isDefined(this.object)) {
            _delta = this.object.coordinateSystem.globalToLocal(point1) - this.object.coordinateSystem.globalToLocal(point0);
        }
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            colorGhostGroup(_ghost);
            _from0 = this.object.from;
            _to0 = this.object.to;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1) {
            this.object.translate(_delta);
            _deltaRel = this.object.from - _from0;
            _helpBox.html('relX: ' + _deltaRel.x.toFixed(3) + '<br>relY' + _deltaRel.y.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Segment.Translator, Translator);