Circle.Resizer = function() {
    Circle.Resizer.superclass.constructor.call(this);

    var _ghost = undefined;
    var _radius0 = undefined;
    var _deltaAbs, _deltaRel;
    var _helpBox;

    this.onEdit = function(point) {
        if (this.level == 0) {
            if (isDefined(_ghost)) {
                _ghost.remove();
            }
            _ghost = new Group([(new Ghost(this.object)).path]);
            colorGhostGroup(_ghost);
            _radius0 = this.object.radius;
            _helpBox = new HelpBox();
            _helpBox.follow = true;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.radius = (this.object.coordinateSystem.globalToLocal(point) -
                this.object.center).length;
            _deltaAbs = this.object.radius - _radius0;
            if (_radius0 != 0) {
                _deltaRel = this.object.radius / _radius0;
            } else {
                _deltaRel = 0;
            }
            _helpBox.html('abs: ' + _deltaAbs.toFixed(3) + '<br>rel: ' + _deltaRel.toFixed(3));
        }
        if (this.level == 2) {
            this.level = -1;
            this.object = undefined;
            if (isDefined(_ghost)) {
                _ghost.remove();
                _ghost = undefined;
            }
            _helpBox.remove();
        }
    };
};
extend(Circle.Resizer, Resizer);