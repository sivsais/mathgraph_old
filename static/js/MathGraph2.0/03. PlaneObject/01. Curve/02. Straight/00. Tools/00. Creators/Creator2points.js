Straight.Creator2points = function () {
    Straight.Creator2points.superclass.constructor.call(this);

    this.onCreate = function(point) {
        if (typeof (this.object) !== 'undefined') {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Straight();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.point1 = point;
            this.object.selected = true;
        }

        if (this.level == 1 || this.level == 2) {
            this.object.point2 = point;
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
extend(Straight.Creator2points, Creator);