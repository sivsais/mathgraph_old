Segment.Rotator = function() {
    Segment.Rotator.superclass.constructor.call(this);

    var _ghost = undefined;
    var _rotationPoint = undefined;
    var _angle0 = undefined;

    this.onEdit = function(point) {
        var g_point;
        if (typeof(this.object) !== 'undefined') {
            g_point = point;
            point = this.object.coordSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            if (this.object.coordSystem.globalToLocal(this.object.path.getNearestPoint(g_point) - this.object.g_from).length
                <= this.object.length / 2) {
                _rotationPoint = 1;
            } else {
                _rotationPoint = 0;
            }
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
            }
            _ghost = new Group();
            _ghost.addChild((new Ghost(this.object)).path);
            if (_rotationPoint == 0) {
                _ghost.addChild(new Path.Circle({
                    center: this.object.g_from,
                    radius: this.object.g_length
                }));
            } else {
                _ghost.addChild(new Path.Circle({
                    center: this.object.g_to,
                    radius: this.object.g_length
                }));
            }
            colorGhostGroup(_ghost);
            _angle0 = this.object.angle;
        }
        if (this.level == 1 || this.level == 2) {
            var angle;
            if (_rotationPoint == 0) {
                angle = (point - this.object.from).angle - (this.object.to - this.object.from).angle;
                this.object.rotate(this.object.coordSystem.globalToLocal(angle), this.object.from);
            } else {
                angle = (point - this.object.to).angle - (this.object.from - this.object.to).angle;
                this.object.rotate(this.object.coordSystem.globalToLocal(angle), this.object.to);
            }
            this.deltaAbs = this.object.angle - _angle0;
            if (_angle0 == 0) {
                this.deltaRel = 0;
            } else {
                this.deltaRel = this.object.angle / _angle0;
            }
            this.deltaBox.on();
            this.deltaBox.refresh(this.object.coordSystem.localToGlobal(point),
                ['?: ' + this.deltaAbs.toFixed(3) + '°', '[' + this.deltaRel.toFixed(3) + 'x]']);
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
extend(Segment.Rotator, Rotator);