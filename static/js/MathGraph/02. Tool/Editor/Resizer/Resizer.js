function Resizer() {
    Resizer.superclass.constructor.call(this);

    this.onLevelChange = function() {
        if (typeof(this.object) !== 'undefined') {
            this.object.infoBox.activate(this.object);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Resizer();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };

    this.onMouseDown = function(event) {
    };
    this.onMouseDrag = function(event) {
        if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
            if (this.level == -1) {
                this.level = 0;
                this.onEdit(event.point);
            }
            this.level = 1;
            this.onEdit(event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onEdit(event.point);
        }
    };
}
extend(Resizer, Editor);