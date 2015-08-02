function TTool() {
    var _level = -1;
    this.__defineGetter__('level', function() {
        return _level;
    });
    this.__defineSetter__('level', function(p) {
        _level = p;
        this.onLevelChange();
    });

    var _object = undefined;
    this.__defineGetter__('object', function() {
        return _object;
    });
    this.__defineSetter__('object', function(p) {
        _object = p;
    });

    var _data = undefined;
    this.__defineGetter__('data', function() {
        return _data;
    });
    this.__defineSetter__('data', function(p) {
        _data = p;
    });

    var _onClick = function(event) {};
    this.__defineGetter__('onClick', function() {
        return _onClick;
    });
    this.__defineSetter__('onClick', function(p) {
        _onClick = p;
    });

    var _onDoubleClick = function(event) {};
    this.__defineGetter__('onDoubleClick', function() {
        return _onDoubleClick;
    });
    this.__defineSetter__('onDoubleClick', function(p) {
        _onDoubleClick = p;
    });

    var _onMouseMove = function(event) {};
    this.__defineGetter__('onMouseMove', function() {
        return _onMouseMove;
    });
    this.__defineSetter__('onMouseMove', function(p) {
        _onMouseMove = p;
    });

    var _onMouseDown = function(event) {};
    this.__defineGetter__('onMouseDown', function() {
        return _onMouseDown;
    });
    this.__defineSetter__('onMouseDown', function(p) {
        _onMouseDown = p;
    });

    var _onMouseUp = function(event) {};
    this.__defineGetter__('onMouseUp', function() {
        return _onMouseUp;
    });
    this.__defineSetter__('onMouseUp', function(p) {
        _onMouseUp = p;
    });

    var _onMouseDrag = function(event) {};
    this.__defineGetter__('onMouseDrag', function() {
        return _onMouseDrag;
    });
    this.__defineSetter__('onMouseDrag', function(p) {
        _onMouseDrag = p;
    });

    var _onMouseEnter = function(event) {};
    this.__defineGetter__('onMouseEnter', function() {
        return _onMouseEnter;
    });
    this.__defineSetter__('onMouseEnter', function(p) {
        _onMouseEnter = p;
    });

    var _onMouseLeave = function(event) {};
    this.__defineGetter__('onMouseLeave', function() {
        return _onMouseLeave;
    });
    this.__defineSetter__('onMouseLeave', function(p) {
        _onMouseLeave = p;
    });

    var _onLevelChange = function(data) {};
    this.__defineGetter__('onLevelChange', function() {
        return _onLevelChange;
    });
    this.__defineSetter__('onLevelChange', function(p) {
        _onLevelChange = p;
    });

    var _deltaBox = currentDeltaBox;
    this.__defineGetter__('deltaBox', function() {
        return _deltaBox;
    });
    this.__defineSetter__('deltaBox', function(p) {
        _deltaBox = p;
    });
}