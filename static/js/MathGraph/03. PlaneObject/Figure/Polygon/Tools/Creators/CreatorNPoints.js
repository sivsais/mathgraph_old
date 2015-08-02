Polygon.CreatorNPoints = function () {
    Polygon.CreatorNPoints.superclass.constructor.call(this);

    this.onCreate = function(point) {
        if (typeof(this.object) !== 'undefined') {
            point = this.object.coordSystem.globalToLocal(point);
        }

        if (this.level == 0) {
            this.object = new Polygon();
            point = this.object.coordSystem.globalToLocal(point);
            this.object.add(point);
            this.object.add(point);
            this.deltaBox.on();
            this.object.selected = true;
            this.object.selectEnable = false;
        }
        if (this.level == 1) {
            this.object.last(point);
            var piece1 = this.object.last() - this.object.get(this.object.num - 2);
            if (this.object.num >= 3) {
                var piece0 = this.object.get(this.object.num - 2) - this.object.get(this.object.num - 3);
            } else {
                piece0 = new Point(1, 0);
            }
            this.deltaBox.refresh(this.object.coordSystem.localToGlobal(point), ['length: ' + piece1.length,
                'angle: ' + piece0.getAngle(piece1)]);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == 2) {
            this.object.add(point);
        }
        if (this.level == 3) {
            if (this.object.length > 0) {
                this.object.coordSystem.objects.push(this.object);
            }
            this.deltaBox.off();
            this.level = -1;
            this.object.selectEnable = true;
            this.object.selected = false;
            this.object = undefined;
        }

    };

    this.onClick = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
            this.level = 1;
        }

    };
    this.onDoubleClick = function(event) {
        if (this.level == -1) {
            this.level = 0;
            this.onCreate(event.point);
            return;
        }
        if (this.level == 1) {
            this.level = 3;
            this.onCreate(event.point);
            return;
        }
    };
    this.onMouseMove = function(event) {
        if (this.level == 0) {
            this.level = 1;
        }
        if (this.level == 1) {
            this.onCreate(event.point);
        }
    }
};
extend(Polygon.CreatorNPoints, Creator);