Circle.Creator2points = function () {
    Circle.Creator2points.superclass.constructor.call(this);

    this.onCreate = function (point) {
        if (isDefined(this.object)) {
            point = this.object.coordinateSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Circle();
            point = this.object.coordinateSystem.globalToLocal(point);
            this.object.center = point;
            this.object.selected = true;
        }

        if (this.level == 1 || this.level == 2) {
            this.object.radius = (point - this.object.center).length;
        }

        if (this.level == 2) {
            if (this.object.radius == 0) {
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
extend(Circle.Creator2points, Creator);