function HelpBox() {

    var _html = function (s) {};
    this.__defineGetter__('html', function () {
        return _html;
    });

    var _position = function () {};
    this.__defineGetter__('position', function () {
        return _position;
    });

    var _remove = function () {};
    this.__defineGetter__('remove', function () {
        return _remove;
    });

    var _follow = false;
    this.__defineGetter__('follow', function () {
        return _follow;
    });
    this.__defineSetter__('follow', function (p) {
        _follow = p;
    });
}