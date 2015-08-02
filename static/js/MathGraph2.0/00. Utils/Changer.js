function Changer($container, params) {
    if (typeof(params) === 'undefined') {
        params = {};
    }
    var _val = params.val || 0;
    var _min = params.min || -Infinity;
    var _max = params.max || Infinity;
    var _step = params.step || 1;
    var _object = params.object;
    var _key = params.key;

    _val = _object[_key];

    this.__defineGetter__('val', function () {
        return _val;
    });
    this.__defineSetter__('val', function (p) {
        _val = p;
    });

    var _onChange = function (new_val) {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });

    var _updateValue = function (nval) {
//        nval -= nval % _step;
        console.log(nval);
        if (_min <= nval && nval <= _max) {
            _val = nval;
            _onChange(nval);
        }
    };

    var $minus = $('<span></span>');
    $minus.text('-');
    $minus.addClass('minus');
    $minus.appendTo($container);

    var $plus = $('<span></span>');
    $plus.text('+');
    $plus.addClass('plus');
    $plus.appendTo($container);

    $plus
        .mousedown(function(e) {
            clearInterval(this.downTimer);
            _val = _object[_key];
            _updateValue(_val + _step);
            this.downTimer = setInterval(function() {
                _val = _object[_key];
                _updateValue(_val + _step);
            }, 300);
        })
        .mouseup(function(e) {
            clearInterval(this.downTimer);
        })
        .mouseleave(function (e) {
            clearInterval(this.downTimer);
        });
    $minus
        .mousedown(function(e) {
            clearInterval(this.downTimer);
            _updateValue(_val - _step);
            this.downTimer = setInterval(function() {
                _updateValue(_val - _step);
            }, 300);
        })
        .mouseup(function(e) {
            clearInterval(this.downTimer);
        })
        .mouseleave(function (e) {
            clearInterval(this.downTimer);
        });
}