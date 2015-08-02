function Editor() {
    Editor.superclass.constructor.call(this);

    var _onEdit = function (data) {};
    this.__defineGetter__('onEdit', function() {
        return _onEdit;
    });
    this.__defineSetter__('onEdit', function(p) {
        _onEdit = p;
    });
}
extend(Editor, TTool);