Arrow.Translator = function() {
    Arrow.Translator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _from0 = undefined;
    var _to0 = undefined;
    var _delta = undefined;

    this.onEdit = function(point0, point1) {
        if (isDefined(this.object)) {
            _delta = this.object.coordSystem.globalToLocal(point1) - this.object.coordSystem.globalToLocal(point0);
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
        }
        if (this.level == 1) {
            this.object.translate(_delta);
            this.deltaRel = _delta;
            this.deltaBox.on();
            this.deltaBox.refresh(point1, ['Δx: ' + this.deltaRel.x.toFixed(3) + '\nΔy:' + this.deltaRel.y.toFixed(3)]);
            this.object.infoBox.refresh();
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
extend(Arrow.Translator, Translator);