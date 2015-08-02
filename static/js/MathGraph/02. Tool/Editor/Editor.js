function Editor() {
    Editor.superclass.constructor.call(this);

    var _onEdit = function (data) {};
    this.__defineGetter__('onEdit', function() {
        return _onEdit;
    });
    this.__defineSetter__('onEdit', function(p) {
        _onEdit = p;
    });

    var _deltaAbs = undefined;
    this.__defineGetter__('deltaAbs', function() {
        return _deltaAbs;
    });
    this.__defineSetter__('deltaAbs', function(p) {
        _deltaAbs = p;
        this.onDelta();
    });

    var _deltaRel = undefined;
    this.__defineGetter__('deltaRel', function() {
        return _deltaRel;
    });
    this.__defineSetter__('deltaRel', function(p) {
        _deltaRel = p;
        this.onDelta();
    });

    var _onDelta = function () {};
    this.__defineGetter__('onDelta', function() {
        return _onDelta;
    });
    this.__defineSetter__('onDelta', function(p) {
        _onDelta = p;
    });

    this.onLevelChange = function(data) {

    };
}
extend(Editor, TTool);