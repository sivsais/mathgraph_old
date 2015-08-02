function Transformer() {
    Transformer.superclass.constructor.call(this);

    var _me = this;

    var _init = function (elems) {

        for (var i in elems) {
            if (!elems.hasOwnProperty(i)) {
                continue;
            }
            (function (elem) {
                elem.button.onMouseDrag = function (event) {
                    this.selected = true;
    //                if ((event.point - event.getDownPoint()).length >= MIN_LENGTH) {
                    if (event.delta.length >= MIN_LENGTH) {
                        if (_me.level == -1) {
                            _me.level = 0;
    //                        elem.func(event.getDownPoint(), event.point);
                            elem.func(event.point - event.delta, event.point);
                        }
                        _me.level = 1;
                        elem.func(event.point - event.delta, event.point);
                    }
                };
                elem.button.onMouseUp = function(event) {
                    this.selected = false;
                    if (_me.level == 1) {
                        _me.level = 2;
//                        elem.func(event.point - event.delta, event.point);
                    }
                };
            })(elems[i]);
        }
    };

    this.__defineGetter__('init', function () {
        return _init;
    });

    this.onLevelChange = function() {
        if (typeof(this.object) !== 'undefined') {
//            this.object.infoBox.activate(this.object);
//            this.object.infoBox.refresh(this.object.infoBoxFields);
        }
        if (this.level == -1) {
            this.object.selectEnable = true;
            this.object.selected = false;
            currentTool = new Transformer();
        }
        if (this.level == 0) {
            this.object.selected = true;
            this.object.selectEnable = false;
        }
    };

}
extend(Transformer, TTool);