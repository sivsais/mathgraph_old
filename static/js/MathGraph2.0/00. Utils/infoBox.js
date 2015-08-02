Point.__fields__ = [
    {
        key: 'x'
    }, {
        key: 'y'
    }
];

function createStandardFields(obj, params) {
    if (!isDefined(params)) {
        params = {};
    }
    if (!isDefined(params.spinner)) {
        params.spinner = true;
    }
    if (!isDefined(params.text)) {
        params.text = true;
    }
    if (!isDefined(params.turn)) {
        params.turn = true;
    }
    if (!isDefined(params.bool)) {
        params.bool = true;
    }
    if (!isDefined(params.children)) {
        params.children = {
            colNum: 1,
            title: ' ',
            fold: true,
            close: true
        }
    }
    var _fields = [];
    if (!isDefined(obj.get)) {
        obj.get = function (key) {
            return this[key];
        }
    }
    if (!isDefined(obj.set)) {
        obj.set = function (key, val) {
            this[key] = val;
        }
    }
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
            continue;
        }
        if (isDefined(obj.get(i))) {
            if (typeof(obj.get(i)) == 'function' && !params.functions) {
                continue;
            }
            _fields.push({
                class: typeof(obj.get(i)) != 'function' ? 'Object' : 'function',
                name: i,
                key: i,
                spinner: params.spinner,
                min: params.min,
                max: params.max,
                step: params.step,
                text: params.text,
                turn: params.turn,
                bool: params.bool,
                children: params.children
            });
        }
    }
    return _fields;
}

function createField(object, field) {
    var $field = $('<div></div>');
    $field.addClass('field');

    var $spinner;
    var _spinner_max = Infinity;
    var _spinner_min = -Infinity;
    var _spinner_step = 0.1;

    var $text;

    var $childContainer;

    var $key = $('<div></div>');
    $key.addClass('key');
    $key.text(field.name || field.key);
    $key.appendTo($field);

    var $val = $('<div></div>');
    $val.addClass('value');
    $val.appendTo($field);

    var _type = typeof(object.get(field.key));
    if (_type == 'number' && field.spinner) {
        $field.addClass('editable');
        $spinner = $('<input/>', {
            type: 'number'
        });
        $spinner.addClass('spinner');
        $spinner.css('position', 'absolute');
        $spinner.appendTo($field);
        $spinner.hide();

        $val.mouseenter(function (e) {
            $spinner.show();
            $spinner.width($val.outerWidth());
            $spinner.height($val.outerHeight());
            var _offset = $val.offset();
            _offset.top += $val.height() / 2 - $spinner.height() / 2;
//                    _offset.left += $val.width() / 2 - $spinner.width() / 2;
            $spinner.offset(_offset);
            $spinner.focus();
        });

        $spinner.keypress(function (e) {
            var _ch = String.fromCharCode(e.which);
            if (_ch == '.') {
                if ($spinner.val().indexOf('.') != -1) {
                    e.preventDefault();
                }
            } else if (_ch == '-') {
                if ($spinner.val()[0] == '-') {
                    $spinner.val($spinner.val().substr(1));
                } else {
                    $spinner.val('-' + $spinner.val());
                }
                $spinner.trigger('change');
                e.preventDefault();
            } else if (e.which == 27) {
                e.preventDefault();
            } else if (e.which == 13) {
            } else if (_ch < '0' || _ch > '9') {
                e.preventDefault();
            }
        });

        $spinner.change(function (e) {
            var _val = $spinner[0].valueAsNumber;
            if (isNaN(_val)) {
                _val = (_spinner_max + _spinner_min) / 2;
            }
            _val = Math.max(_val, _spinner_min);
            _val = Math.min(_val, _spinner_max);
            object.set(field.key, _val);
            $field.trigger('refresh');
        });

        $spinner.blur(function (e) {
            $spinner.hide();
            $field.trigger('refresh');
        });
        $spinner.mouseleave(function (e) {
            $spinner.hide();
            $field.trigger('refresh');
        })
    }

    if (_type == 'string' && field.text) {
        $field.addClass('editable');
        $text = $('<input/>', {
            type: 'text'
        });
        $text.addClass('text');
        $text.css('position', 'absolute');
        $text.appendTo($field);
        $text.hide();

        $val.mouseenter(function (e) {
            $text.show();
            $text.width($val.outerWidth());
            $text.height($val.outerHeight());
            var _offset = $val.offset();
            _offset.top += $val.height() / 2 - $text.height() / 2;
//                    _offset.left += $val.width() / 2 - $text.width() / 2;
            $text.offset(_offset);
            $text.focus();
        });

        $text.change(function (e) {
            object.set(field.key, $text.val());
            $field.trigger('refresh');
        });

        $text.blur(function (e) {
            $text.hide();
            $field.trigger('refresh');
        });
        $text.mouseleave(function (e) {
            $text.hide();
            $field.trigger('refresh');
        })
    }

    if (_type == 'boolean' && field.bool) {
        // checkbox here
    }

    if (_type == 'object' && field.turn) {
        $val.addClass('turn');

        $childContainer = $('<div></div>');
        $childContainer.addClass('infoBox-child');
        $childContainer.appendTo($('body'));
        InfoPanel($childContainer, object.get(field.key), field.children || new Object({}));
        $childContainer.hide();

        $val.click(function (e) {
            if (isDefined($childContainer)) {
                if (!$childContainer.is(':visible')) {
                    $childContainer.show();
                    var _offset = $val.offset();
                    $childContainer.offset({
                        left: _offset.left,
                        top: _offset.top + $val.outerHeight()
                    });
                } else {
                    $childContainer.hide();
                }
            }
        });
    }

    var _refresh = function () {

        var _val = object.get(field.key);
        if (_type == 'object' || _type == 'function') {
            $val.text(field.class || _type);
        } else {
            $val.text(object.get(field.key));
        }

        if (field.spinner && isDefined($spinner)) {
            $spinner.val(object.get(field.key));
            if (typeof(field.min) === 'function') {
                _spinner_min = field.min();
                $spinner.attr('min', _spinner_min);
            }
            if (typeof(field.max) === 'function') {
                _spinner_max = field.max();
                $spinner.attr('max', _spinner_max);
            }
            if (typeof(field.step) === 'function') {
                _spinner_step = field.step();
                $spinner.attr('step', _spinner_step);
            }
        }

        if (field.text && isDefined($text)) {
            $text.val(object.get(field.key));
        }

        if (isDefined($childContainer)) {
            $childContainer.trigger('refresh');
        }
    };

    $field.on('refresh', function (e) {
        _refresh();
        e.stopPropagation();
    });

    _refresh();

    return $field;
}

function calcNum(product, a) {
    if (product % a == 0) {
        return product / a;
    } else {
        return (product - product % a) / a + 1;
    }
}

function InfoPanel($container, object, params) {
    var fields = [];

    if (isDefined(object.__fields__)) {
        fields = object.__fields__;
    } else {
        fields = createStandardFields(object);
    }
    var $title;
    var $fold;
    var $close;

    if (params.title || params.fold || params.close) {
        $title = $('<div></div>');
        $title.addClass('infoBox-title');
        $title.text(params.title || '');
        $title.appendTo($container);

        if (params.close) {
            $close = $('<div></div>');
            $close.addClass('infoBox-close');
            $close.text('X');
            $close.appendTo($title);
        }

        if (params.fold) {
            $fold = $('<div></div>');
            $fold.addClass('infoBox-fold');
            $fold.text('_');
            $fold.appendTo($title);
        }
    }

    var _length = fields.length;
    var _rowNum, _colNum;

    if (isDefined(params.colNum) && isDefined(params.rowNum)) {
        _rowNum = params.rowNum;
        _colNum = params.colNum;
        if (_rowNum * _colNum < _length) {
            _length = _rowNum * _colNum;
        }
    } else if (isDefined(params.colNum)) {
        _colNum = params.colNum;
        _rowNum = calcNum(_length, _colNum);
    } else if (isDefined(params.rowNum)) {
        _rowNum = params.rowNum;
        _colNum = calcNum(_length, _rowNum);
    } else {
        _rowNum = 3;
        _colNum = calcNum(_length, _rowNum);
    }

    var $wrapper = $('<div></div>');
    $wrapper.addClass('infoBox-wrapper');
    $wrapper.appendTo($container);
    var $table = $('<table></table>');
    $table.addClass('infoBox-table');
    $table.appendTo($wrapper);

    var $fields = [];

    var _count = 0;
    for (var i = 0; i < _rowNum; i++) {
        var $tr = $('<tr></tr>');
        $tr.appendTo($table);
        for (var j = 0; j < _colNum; j++) {
            var $td = $('<td></td>');
            $td.appendTo($tr);
            if (_count < _length) {
                var $newField = createField(object, fields[_count]);
                $fields.push($newField);
                $td.append($newField);
                _count++;
            }
        }
    }

    var _refreshTable = function () {
        $fields.forEach(function (item, index) {
            $(item).trigger('refresh');
        })
    };

    $fields.forEach(function (item) {
        $(item).on('change', function (e) {
            _refreshTable();
        });
        $(item).on('refresh', function (e) {
            e.stopPropagation();
        })
    });

    $table.on('refresh', function (e) {
        _refreshTable();
        e.stopPropagation();
    });

    $container.on('refresh', function () {
        _refreshTable();
    });

    _refreshTable();

}

function InfoBox() {

    var _currentObject;

    var _self = this;
    var $container = $('#infoBoxContainer');

    var _activate = function (obj) {
        _self.deactivate();
        if (isDefined(obj)) {
            _currentObject = obj;
            InfoPanel($container, _currentObject, {});
        }
    };
    this.__defineGetter__('activate', function () {
        return _activate;
    });

    var _isActivated = function (obj) {
        if (isDefined(obj)) {
            return (obj === _currentObject);
        } else {
            return isDefined(_currentObject);
        }
    };
    this.__defineGetter__('isActivated', function () {
        return _isActivated;
    });

    var _deactivate = function (obj) {
        $container.empty();
        _currentObject = undefined;
    };
    this.__defineGetter__('deactivate', function () {
        return _deactivate;
    });

    var _refresh = function () {
        if (_self.isActivated()) {
            $container.trigger('refresh');
        }
    };
    this.__defineGetter__('refresh', function () {
        return _refresh;
    });

}