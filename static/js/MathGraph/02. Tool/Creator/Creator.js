function Creator() {
    Creator.superclass.constructor.call(this);

    var _onCreate = function (data) {};
    this.__defineGetter__('onCreate', function() {
        return _onCreate;
    });
    this.__defineSetter__('onCreate', function(p) {
        _onCreate = p;
    });

    this.onLevelChange = function(data) {
        if (typeof(this.object) !== 'undefined') {
//            this.object.infoBox.activate(this.object);
            this.object.infoBox.refresh();
        }
    };
}
extend(Creator, TTool);