Segment.Resizer = function() {
    Segment.Resizer.superclass.constructor.call(this);

    var _ghost = undefined;
    var _length0 = undefined;

    this.onEdit = function(point) {                             // TODO: ������� �� ���������������� ��������
        if (this.level == 0) {
            if (typeof(_ghost) !== 'undefined') {
                _ghost.remove();
            }
            var _gh = new Ghost(this.object);
            var delta = this.object.g_to - this.object.g_from;
            _gh.opacity = 0;
            _gh.strokeColor = 'red';
            var _norm = this.object._from + (this.object.g_to - this.object.g_from).normalize(100).rotate(-90);
            //_gh.path.insertSegment(0, this.object.g_from);
            //_gh.path.insertSegment(0, _norm);
            _ghost = new Group();
            _ghost.addChild(_gh.path.clone());
            var _lineGhost = new Path(this.object.g_from);
            var i = 0;
            while (getViewIntersections(_lineGhost).length == 0) {
                i++;
                var _gpc = _gh.path.clone();
                //_lineGhost.add((_gpc.lastSegment.point - _gpc.firstSegment.point).normalize().rotate(90)); // fun
                _lineGhost.join(_gpc.translate(delta*i));

            }
            i = 0;
            while (getViewIntersections(_lineGhost).length == 1) {
                i--;
                _lineGhost.join(_gh.path.clone().translate(delta*i));
            }
            _gh.remove();
            _ghost.addChild(_lineGhost.clone());
            _lineGhost.remove();
            colorGhostGroup(_ghost);
            _length0 = this.object.length;
        }
        if (this.level == 1 || this.level == 2) {
            this.object.to = this.object.coordSystem.globalToLocal(_ghost.children[1].getNearestPoint(point));
            this.deltaAbs = this.object.length - _length0;
            if (_length0 != 0) {
                this.deltaRel = this.object.length / _length0;
            } else {
                this.deltaRel = 0;
            }
            this.deltaBox.on();
            this.deltaBox.refresh(point,
                ['?: ' + this.deltaAbs.toFixed(3), '[' + this.deltaRel.toFixed(3) + 'x]']);
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
extend(Segment.Resizer, Resizer);