function Creator() {
    Creator.superclass.constructor.call(this);

    var _onCreate = function (data) {};
    this.__defineGetter__('onCreate', function() {
        return _onCreate;
    });
    this.__defineSetter__('onCreate', function(p) {
        _onCreate = p;
    });
}
extend(Creator, TTool);