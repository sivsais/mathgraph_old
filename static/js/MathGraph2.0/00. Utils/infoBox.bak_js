function InfoPanel(title, $container, object, fields) {

    var $wrapper = $('<div></div>');
    $wrapper
        .css({
            position: 'absolute'
        })
        .appendTo($container)
        .addClass('infoPanelWrapper');

    var $title = $('<span></span>');
    $title.text(title);
    $title.appendTo($wrapper);
    $title.addClass('title');

    var $fold = $('<span></span>');
    $fold
        .text('-')
        .addClass('fold')
        .click(function (e) {
            if (isDefined($table)) {
                if ($(this).text() == '-') {
                    $wrapper.resizable('disable');
                    var w = $wrapper.width();
                    hideElem($table);
                    $wrapper.width(w);
                    $(this).text('+');
                } else {
                    $(this).text('-');
                    showElem($table);
                    $wrapper.resizable('enable');
                }
            }
        })
       .appendTo($title);
    
    var $close = $('<span></span>');
    $close
        .text('x')
        .addClass('close')
        .click(function (e) {
            _hide();
        })
       .appendTo($title);

//    var $table = $('<table></table>');
    var $table = $('<div></div>');
    $table
        .css({
            position: 'relative'
        })
        .appendTo($wrapper)
        .addClass('infoPanel');

    var _dragging = false, _downPoint;
    $title.mousedown(function (e) {
        _dragging = true;
        _downPoint = [e.pageX, e.pageY];
        e.stopPropagation();
    });
    $('body')
        .mousemove(function (e) {
            if (_dragging) {
                var _offset = $container.offset();
                _offset.left += (e.pageX - _downPoint[0]);
                _offset.top += (e.pageY - _downPoint[1]);
                $container.offset(_offset);
                _downPoint = [e.pageX, e.pageY];
                e.stopPropagation();
            }
        })
        .mouseup(function (e) {
            if (_dragging) {
                _dragging = false;
                e.stopPropagation();
            }
        });

    var _convert = function (a, params) {
        var result = [];
        for (var i in a) {
            if (!a.hasOwnProperty(i)) {
                continue;
            }
            if (typeof(a[i]) === 'function') {
                continue;
            }
            var cell = {
                name: undefined,
                key: undefined,
                editable: undefined,
                changer: undefined,
                min: undefined,
                max: undefined,
                step: undefined,
                inadmissible: undefined
            };
            for (var j in params) {
                if (!params.hasOwnProperty(j)) {
                    continue;
                }
                cell[j] = params[j];
            }
            cell.key = i;
            cell.name = i;
            result.push(cell);
        }
        return result;
    };

    var _refreshValue = function ($value, ftype, val) {
        if (ftype == 'Point' || ftype == 'Array') {
            $value.text(ftype);
        } else {
            if (ftype == 'Number') {
                val = toFixedNoZeros(val, 3);
            }
            $value.text(val);
        }
    };

    var _onChange = function (object, field, ftype, new_val) {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });


    var _textFilter = function (field, ftype, val) {
//        var _re = new RegExp(field.mask, 'g');
//        var _arr = _re.exec(val);
//        val = _arr[0];
//        for (var i in _arr) {
//            if (!_arr.hasOwnProperty(i)) {
//                continue;
//            }
//            if (isDefined(_arr[i]) && _arr[i].length > val.length) {
//                val = _arr[i];
//            }
//        }
//        if (ftype == 'Number') {
//            val = parseFloat(val);
//        }
        return val;
    };

    var $children = undefined, _childIndex = -1;

    var _getType = function (obj) {
        if (typeof(obj) === 'number') {
            return 'Number';
        } else if (typeof(obj) === 'string') {
            return 'String';
        } else if (typeof(obj) === 'boolean') {
            return 'Boolean';
        } else if (obj instanceof Point) {
            return 'Point';
        } else if (obj instanceof Array) {
            return 'Array';
        }
        return undefined;
    };

    for (var i in fields) {
        if (!fields.hasOwnProperty(i)) {
            continue;
        }

        (function (_field, index) {
            var _ftype = _getType(object[_field.key]);
            if (!isDefined(_ftype)) {
                console.error('Not supported type if field ');
                console.error(_field);
                return;
            }

//            var $field = $('<tr></tr>');
            var $field = $('<div></div>');
            $field
                .addClass('field')
                .addClass(_ftype);
            if (_field.editable) {
                $field.addClass('editable');
            }
            $field.appendTo($table);
            if (index % 2 == 0) {
                $field.addClass('even');
            } else {
                $field.addClass('odd');
            }

//            var $key = $('<td></td>');
            var $key = $('<span></span>');
            $key
                .addClass('key')
                .appendTo($field)
                .text(_field.name);

            var $value = $('<span></span>');
            $value
                .addClass('value')
                .appendTo($field)
                .attr('_key', _field.key);

            var $interactive;

            if (_field.editable) {
                $value.dblclick(function (e) {
                    var $input = $('<input>', {
                        type: 'text',
                        value: object[_field.key],
                        maxLength: _field.max || 100
                    });
                    $input
                        .addClass('editVal')
                        .css({
                            position: 'absolute',
                            'text-align': 'center'
                        })
                        .appendTo($value)
                        .width($value.width())
                        .height($value.height())
                        .offset($value.offset())
                        .focus()
                        .keydown(function (e) {
                            if (e.which == 27) {
                                $input.remove();
                            }
                            if (e.which == 13) {
                                _onChange(object, _field, _ftype, $input.val());
                                _refreshValue($value, _ftype, object[_field.key]);
                                $input.remove();
                            }
                        })
                        .blur(function (e) {
                            _onChange(object, _field, _ftype, new_val);
                            _refreshValue($value, _ftype, object[_field.key]);
                            $input.remove();
                        });
                })
            }

            if (_ftype == 'String') {
                _refreshValue($value, _ftype, object[_field.key]);
                $value.attr('colspan', '2');
                $field.addClass('noInteractive');
            }

            if (_ftype == 'Number') {
                console.log(object[_field.key]);
                _refreshValue($value, _ftype, object[_field.key]);
                if (!_field.changer) {
                    $value.attr('colspan', '2');
                    $field.addClass('noInteractive');
                } else {

//                    $interactive = $('<td></td>');
                    $interactive = $('<span></span>');
                    $interactive
                        .addClass('interactive')
                        .appendTo($field);
                    var $changer = new Changer($interactive, {
                        object: object,
                        key: _field.key,
                        min: _field.min,
                        max: _field.max,
                        step: _field.step
                    });
                    $interactive.addClass('changer');
                    $changer.onChange = function (new_val) {
                        _onChange(object, _field, _ftype, new_val);
                        _refreshValue($value, _ftype, object[_field.key]);
                    };
                }
            }

            if (_ftype == 'Point' || _ftype == 'Array') {
                _refreshValue($value, _ftype);

                $interactive = $('<span></span>');
                $interactive
                    .addClass('interactive')
                    .appendTo($field)
                    .text('>')
                    .click(function (e) {
                        if (_childIndex == index) {
                            $children.remove();
                            _childIndex = -1;
                            return;
                        }
                        if (_childIndex != -1) {
                            $children.remove();
                            _childIndex = -1;
                        }

                        var _offset = $field.offset();
                        _offset.left += $field.width();
                        var $childContainer = $('<div></div>');
                        $childContainer.css({
                            position: 'absolute',
                            width: '150px'
                        });
                        $childContainer.appendTo($wrapper);
                        $childContainer.offset(_offset);
                        $children = new InfoPanel(
                            _field.name, $childContainer, object[_field.key], _convert(object[_field.key], _field));
                        $children.onChange = _onChange;
                        _childIndex = index;
                    });
            }
        })(fields[i], i);
    }

    $wrapper.resizable({
        minWidth: $wrapper.width(),
        maxWidth: $wrapper.width() * 3,
        minHeight: $wrapper.height() / 3,
        maxHeight: $wrapper.height(),
        grid: [$wrapper.width(), $wrapper.height()],
        autoHide: true,
        onResize: function (e) {
            $container.width($wrapper.width());
            $container.height($wrapper.height());
        }
    });

    var _hide = function (complete) {
        if (_childIndex != -1) {
            $children.hide(function () {
                hideElem($wrapper, function () {
                    if (isDefined(complete)) {
                        complete();
                    }
                });
            })
        } else {
            hideElem($wrapper, function () {
                if (isDefined(complete)) {
                    complete();
                }
            })
        }
    };
    this.__defineGetter__('hide', function () {
        return _hide;
    });

    var _show = function (complete) {
        showElem($wrapper, function () {
            if (_childIndex != -1) {
                $children.show();
            }
        })
    };
    this.__defineGetter__('show', function () {
        return _show;
    });

    var _remove = function () {
        this.hide();
        $wrapper.remove();
        delete this;
    };
    this.__defineGetter__('remove', function () {
        return _remove;
    });

    var _refresh = function () {
        //var $body = $($table.children('tbody')[0]);
        $table.children('.field').each(function (index, elem) {
            elem = $($(elem).children('.value')[0]);
            var _obj = object[$(elem).attr('_key')];
            _refreshValue(elem, _getType(_obj), _obj);
        });
        if (_childIndex != -1) {
            $children.refresh();
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    })
}

function InfoBox($container) {
    var _panel = undefined;

    var _refresh = function () {
        if (isDefined(_panel)) {
            _panel.refresh();
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    });

    var _clear = function () {
        if (isDefined(_panel)) {
            _panel.remove();
        }
    };
    this.__defineGetter__('clear', function () {
        return _clear;
    });

    var _currentObject = undefined;

    var _activate = function (obj) {
        if (_currentObject === obj) {
            this.refresh();
            return;
        }
        this.clear();
        _currentObject = obj;
        _panel = new InfoPanel(_currentObject.name, $container, _currentObject, _currentObject.infoBoxFields);
        _panel.onChange = function (object, field, ftype, new_val) {
            if (ftype != 'String' && ftype != 'Boolean') {
                new_val = parseFloat(new_val);
            }
            if (ftype == 'Boolean') {
                if (new_val == '1' || new_val == 'True' || new_val == 'true') {
                    new_val = true;
                }
            }
            if (object instanceof Point || object instanceof Array) {
                object.set(field.key, new_val);
            } else {
                object[field.key] = new_val;
            }
            _panel.refresh();
        }
    };
    this.__defineGetter__('activate', function () {
        return _activate;
    });

    var _deactivate = function () {
        if (isDefined(_panel)) {
            _panel.remove();
        }
        _currentObject = undefined;
    };
    this.__defineGetter__('deactivate', function () {
        return _deactivate;
    });

    var _isActivated = function (obj) {
        return _currentObject === obj;
    };
    this.__defineGetter__('isActivated', function () {
        return _isActivated;
    })
}