Arrow.Creator2points = function () {
    Arrow.Creator2points.superclass.constructor.call(this);
    var _from = 0;
    this.onCreate = function(point) {
        if (isDefined(this.object)) {
            point = this.object.coordSystem.globalToLocal(point);
        }
        if (this.level == 0) {
            this.object = new Arrow();
            point = this.object.coordSystem.globalToLocal(point);
            this.object.from = point;
            _from = point;
            this.object.selected = true;
        }

        if (this.level == 1 || this.level == 2) {
//            this.object.remove();
//            this.object = new Arrow();
//            this.object.from = _from;
            this.object.to = point;
            this.object.selected = true;
            this.object.infoBox.refresh();
        }

        if (this.level == 2) {
            if (this.object.length > 0) {
                this.object.coordSystem.objects.push(this.object);
            } else {
                this.object.remove();
            }

            this.level = -1;
            this.object = undefined;
        }
    };

    this.onMouseDown = function(event) {
        //this.level = 0;
        //this.onCreate(event.point);
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onCreate(event.getDownPoint());
            }
            this.level = 1;
            this.onCreate(event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onCreate(event.point);
        }
    };
};
extend(Arrow.Creator2points, Creator);