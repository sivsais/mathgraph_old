function Translator() {
    Translator.superclass.constructor.call(this);

    this.onLevelChange = function() {
        if (typeof(this.object) !== 'undefined') {
            this.object.infoBox.activate(this.object);
            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Translator();
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
                this.onEdit(new Point(0, 0), event.point);
            }
            this.level = 1;
            this.onEdit(event.getLastPoint(), event.point);
        }
    };
    this.onMouseUp = function(event) {
        if (this.level == 1) {
            this.level = 2;
            this.onEdit(event.getLastPoint(), event.point);
        }
    };
}
extend(Translator, Editor);