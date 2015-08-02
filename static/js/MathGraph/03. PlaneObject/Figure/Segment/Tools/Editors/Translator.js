Segment.Translator = function() {
    Segment.Translator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _from0 = undefined;
    var _to0 = undefined;

    this.onEdit = function(delta, point) {
        if (typeof(this.object) !== 'undefined') {
            delta = this.object.coordSystem.globalToLocal(delta);
        }
        if (this.level == 0) {
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            colorGhostGroup(_ghost);
            _from0 = this.object.from;
            _to0 = this.object.to;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.from = _from0 + delta;
            this.object.to = _to0 + delta;
            this.deltaRel = delta;
            this.deltaBox.on();
            this.deltaBox.refresh(point, ['?x: ' + this.deltaRel.x.toFixed(3) + '\n?y:' + this.deltaRel.y.toFixed(3)]);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            this.deltaBox.off();
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
                _ghost = undefined;
            }
        }
    };
};
extend(Segment.Translator, Translator);