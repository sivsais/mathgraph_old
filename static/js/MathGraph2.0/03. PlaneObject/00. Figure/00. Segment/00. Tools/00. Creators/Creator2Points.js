Segment.Creator2points = function () {
    Segment.Creator2points.superclass.constructor.call(this);

    this.onCreate = function(point) {
        if (typeof (this.object) !== 'undefined') {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Segment();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.from = point;
            this.object.selected = true;
        }

        if (this.level == 1 || this.level == 2) {
            this.object.to = point;
        }

        if (this.level == 2) {
            if (this.object.length == 0) {
                this.object.remove();
            }

            this.level = -1;
            this.object.selected = false;
            this.object = undefined;
        }
    };

    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
        }
        this.level = 1;
        this.onCreate(event.point);
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Segment.Creator2points, Creator);