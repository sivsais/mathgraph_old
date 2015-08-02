function isDefined(obj) {
    return !(typeof(obj) === 'undefined');
}

function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype
}

function Switcher($container, states) {
    var $object = $('<div></div>');
    $object.appendTo($container);
    $object.addClass('switcher');

    var _selected = undefined;
    var $states = {};

    var _self = this;

    var _onChange = function (_selected) {};
    var _onClick = function () {};
    var _onDoubleClick = function () {};
    var _onLongClick = function () {};

    for (var i in states) {
        if (!states.hasOwnProperty(i)) {
            continue;
        }
        (function (_state, index) {
            if (!isDefined(_selected)) {
                _selected = states[i].id;
            }

            var $icon = $('<img>');
            $icon.attr('src', _state.icon);
            $icon.appendTo($object);
            $icon.addClass('icon');
            $icon.hide(0);
            $states[_state.id] = $icon;
        })(states[i], i);
    }

    $states[_selected].show(0);

    this.__defineGetter__('selected', function () {
        return _selected;
    });
    this.__defineSetter__('selected', function (p) {
        if ($states.hasOwnProperty(p)) {
            if (p != _selected) {
                if ($states.hasOwnProperty(_selected)) {
                    $states[_selected].hide(0);
                }
                $states[p].show(0);
                _selected = p;

                _self.onChange(_selected);
            }
        }
    });

    this.__defineGetter__('object', function () {
        return $object;
    });

    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });

    this.__defineGetter__('onClick', function () {
        return _onClick;
    });
    this.__defineSetter__('onClick', function (p) {
        _onClick = p;
        $object.unbind('click');
        $object.click(function (e) {
            _self.onClick();
        });
    });
    this.__defineGetter__('onDoubleClick', function () {
        return _onDoubleClick;
    });
    this.__defineSetter__('onDoubleClick', function (p) {
        _onDoubleClick = p;
        $object.unbind('dblclick');
        $object.dblclick(function (e) {
            _self.onDoubleClick();
        });
    });

    this.__defineGetter__('onLongClick', function () {
        return _onLongClick;
    });
    this.__defineSetter__('onLongClick', function (p) {
        _onLongClick = p;
        $object.unbind('longclick');
        $object.longclick(500, function (e) {
            _self.onLongClick();
        });
    });

    var _setIcon = function (id, new_icon) {
        $states[id].attr('src', new_icon);
    };
    this.__defineGetter__('setIcon', function () {
        return _setIcon;
    });

    this.__defineGetter__('currentIcon', function () {
        return $states[_selected].attr('src');
    });

    $object.click(function (e) {
        _self.onClick();
    });
    $object.dblclick(function (e) {
        _self.onDoubleClick();
    });
    $object.longclick(500, function (e) {
        _self.onLongClick();
    });

}

function CheckButton($container, icon0, icon1) {
    CheckButton.superclass.constructor.call(this, $container, [
        {
            id: 0,
            icon: icon0
        }, {
            id: 1,
            icon: icon1
        }]);

    this.onClick = function (e) {
        this.selected = (this.selected + 1) % 2;
    };

    this.__defineSetter__('onClick', function (p) {});

    this.__defineGetter__('getIcon', function () {
        return function (id) {
            if (id == 0) {
                return icon0;
            } else {
                return icon1;
            }
        }
    })
}
extend(CheckButton, Switcher);

function CheckGroupButton($container, params, checks) {

    var _last = -1;
    var _currentIcon = params.icon;
    var _iconFlag = false;

    if (!isDefined(params.icon) || params.icon == '') {
        _currentIcon = checks[0].icon0;
        _iconFlag = true;
    }

//    var mainBtn = new Switcher($container, [
//        {
//            id: 0,
//            icon: _currentIcon
//        }
//    ]);
    var mainBtn = new CheckButton($container, _currentIcon, _currentIcon);

    var $child = $('<div></div>');
    $child.appendTo(mainBtn.object);
    $child.addClass('tool-panel-child');

    var _boxes = {};

    for (var i in checks) {
        if (!checks.hasOwnProperty(i)) {
            continue;
        }
        (function (_check, index) {
            var $box = $('<div></div>');
            $box.appendTo($child);
            $box.addClass('box');

            var $label = $('<span></span>');
            $label.text(_check.label);
            $label.appendTo($box);
            $label.addClass('label');

            var btn = new CheckButton($box, _check.icon0, _check.icon1);
            btn.selected = 0;
            _boxes[index] = btn;
            btn.object.addClass(params.btnClass);
            btn.onChange = function (currentState) {
                if (currentState == 1) {
                    this.object.addClass('selected');
                } else {
                    this.object.removeClass('selected');
                }
                if (currentState == 1) {
                    if (!params.multiple) {
                        for (var i in _boxes) {
                            if (!_boxes.hasOwnProperty(i) || i == index) {
                                continue;
                            }
                            _boxes[i].selected = 0;
                        }
                    }
                }
//                if (currentState == 0 && !params.multiple) {
//                    var _flag = false;
//                    for (var i in _boxes) {
//                        if (!_boxes.hasOwnProperty(i)) {
//                            continue;
//                        }
//                        if (_boxes[i].selected == 1) {
//                            _flag = true;
//                            break;
//                        }
//                    }
//                    if (!_flag) {
//                        this.selected = 1;
//                        return;
//                    }
//                }
                _last = index;
                if (!params.multiple) {
                    _check.onChange(currentState);
                }
                if (params.carry) {
                    mainBtn.onChange = function (currentState) {
                        if (currentState == 1) {
                            mainBtn.object.addClass('selected');
                        } else {
                            mainBtn.object.removeClass('selected');
                        }
                        _check.onChange(currentState);
                    };
                    mainBtn.selected = currentState;
                }
                if (_iconFlag) {
                    mainBtn.setIcon(0, this.getIcon(0));
                    mainBtn.setIcon(1, this.getIcon(1));
                }
                if (!params.multiple) {
                    $child.hide(0);
                }
                if (params.carry) {

                    console.log(currentState);
                }
            }
        })(checks[i], i);
    }

    if (isDefined(params.selected) && params.selected >= 0) {
        _last = params.selected;
        _boxes[params.selected].selected = 1;
    } else {
        _boxes[0].selected = 1;
        _boxes[0].selected = 0;
    }

    $child.hide(0);

    $(document).mousedown(function (e) {
        if (!$(e.target).is($child.find('*'))) {
            $child.hide(0);
        }
    });


    mainBtn.onLongClick = function (e) {
        $child.toggle();
    };

    return mainBtn;
}

function ToolPanel($container, buttons) {

    var _tools = {};
    var _checks = {};

    for (var i in buttons) {
        if (!buttons.hasOwnProperty(i)) {
            continue;
        }
        (function (button, index) {
            var btn;
            if (button.type == 'tool') {
                btn = CheckGroupButton($container,
                    {
                        multiple: false,
                        carry: true,
                        icon: '',
                        btnClass: 'tool'
                    }, button.elements
                );
                btn.object.addClass('tool');
                _tools[index] = btn;
                var f = btn.onChange;
                btn.onChange = function (currentState) {
                    if (currentState == 1) {
                        for (var i in _tools) {
                            if (!_tools.hasOwnProperty(i) || i == index) {
                                continue;
                            }
                            _tools[i].selected = 0;
                        }
                    }
                    f(currentState);
                }
            }
            if (button.type == 'checks') {
                btn = CheckGroupButton($container,
                    {
                        multiple: true,
                        carry: false,
                        icon: button.icon,
                        btnClass: 'check'
                    }, button.elements
                );
                btn.object.addClass('check');
                _checks[index] = btn;
            }
        })(buttons[i], i);
    }
}