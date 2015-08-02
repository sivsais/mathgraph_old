function PlaneObject() {
    var _name = undefined;
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineSetter__('name', function(p) {
        _name = p;
    });
    var _id;

    this.__defineGetter__('id', function () {
        return _id;
    });

    var _path = new Group();
    var _self = this;
    var _mouseOnMe = false;
    var initPath = function () {
        _self.style = _defaultStyle;
        var _evFunc = function (type, event) {
            if (currentTool instanceof Editor && currentTool.level == -1) {
                if (currentTool instanceof Rotator) {
                    currentTool = new _self.__proto__.constructor.Rotator(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Resizer) {
                    currentTool = new _self.__proto__.constructor.Resizer(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Translator) {
                    currentTool = new _self.__proto__.constructor.Translator(); //TODO: Проверить корректность
                }
                currentTool.object = _self;
                currentTool[type](event);
            }
        };

        _path.onClick = function(event) {
            if (event.event.which == 1) {
                _self.selected = !_self.selected;
                _evFunc('onClick', event);
            }
        };
        _path.onMouseDown = function(event) {
            if (event.event.which == 3) {
                if (!_att) {
                    this.style = _attention;
                    _att = true;
                } else {
                    this.style = _defaultStyle;
                    _att = false;
                }
            }
            if (event.event.which == 1) {
                _evFunc('onMouseDown', event);
            }
        };
        _path.onDoubleClick = function(event) {
            _evFunc('onDoubleClick', event);
        };
        _path.onMouseEnter = function(event) {
            _self.pointed = true;
            _mouseOnMe = true;
        };
        _path.onMouseLeave = function(event) {
            _self.pointed = false;
            _mouseOnMe = false;
        };
    };
    initPath();
    this.__defineGetter__('path', function() {
        return _path;
    });
    this.__defineSetter__('path', function(p) {
        if (isDefined(_path)) {
            _path.remove();
        }
        _path = p;
        initPath();
    });

    var _style = undefined;
    var _defaultStyle = currentStyle.clone();
    var _attention = {
        strokeColor: 'red',
        strokeWidth: 5,
        strokeCap: 'round'
    };
    var _att = false;
    var _pointedStyle = new Style({strokeColor: 'skyblue', opacity: 0.5, strokeWidth: 4, strokeCap: 'round'});
    var _selectedStyle = new Style({strokeColor: 'green', opacity: 0.7, strokeWidth: 3, strokeCap: 'round'});
    this.__defineGetter__('style', function() {
        return _style;
    });
    this.__defineSetter__('style', function(p) {
        _style = p;
        _path.style = _style;
    });

    _self.style = _defaultStyle;

    var _selectEnable = true;
    this.__defineGetter__('selectEnable', function() {
        return _selectEnable;
    });
    this.__defineSetter__('selectEnable', function(p) {
        _selectEnable = p;
    });

    var _pointEnable = true;
    this.__defineGetter__('pointEnable', function() {
        return _pointEnable;
    });
    this.__defineSetter__('pointEnable', function(p) {
        _pointEnable = p;
    });

    var _pointed = false;
    this.__defineGetter__('pointed', function () {
        return _pointed;
    });
    this.__defineSetter__('pointed', function (p) {
        if (!this.pointEnable || this.selected) {
            return;
        }
        _pointed = p;
        if (_pointed) {
            this.style = _pointedStyle;
        } else if (!_att) {
            this.style = _defaultStyle;
        } else {
            this.style = _attention;
        }
    });

    var _selected = false;
    this.__defineGetter__('selected', function () {
        return _selected;
    });
    this.__defineSetter__('selected', function (p) {
        if (!this.selectEnable) {
            return;
        }
        _selected = p;
        if (p) {
            _self.coordinateSystem.apply(function (item, index) {
                if (item.id != _self.id) {
                    item.selected = false;
                }
            });
            this.pointed = false;
            this.style = _selectedStyle;
            _infoBoxes[0].activate(_self);
        } else {
            if (!_att) {
                this.style = _defaultStyle;
            } else {
                this.style = _attention;
            }
            if (_mouseOnMe) {
                this.pointed = true;
            }
            _infoBoxes[0].deactivate(_self);
        }
    });

    var _coordinateSystem = undefined;
    this.__defineGetter__('coordinateSystem', function () {
        return _coordinateSystem;
    });
    this.__defineSetter__('coordinateSystem', function (p) {
        if (isDefined(_coordinateSystem)) {
            _coordinateSystem.subtract(_id);
        }
        _coordinateSystem = p;
        _id = _coordinateSystem.append(_self);
        _self.update();
    });

    var _remove = function() {
        _self.path.remove();
        delete _self;
    };
    this.__defineGetter__('remove', function() {
        return _remove;
    });

    var _update = function () {};
    this.__defineGetter__('update', function () {
        return _update;
    });

    var _infoBoxes = [];

    var _appendInfoBox = function (newBox) {
        _infoBoxes.push(newBox);
        return _infoBoxes.length - 1;
    };
    this.__defineGetter__('appendInfoBox', function () {
        return _appendInfoBox;
    });

    var _subtractInfoBox = function (box) {
        if (box instanceof InfoBox) {
            _infoBoxes.forEach(function (item, index) {
                if (item === box) {
                    delete _infoBoxes[index];
                }
            })
        } else if (typeof(box) === 'number') {
            delete _infoBoxes[box];
        }
    };
    this.__defineGetter__('subtractInfoBox', function () {
        return _subtractInfoBox;
    });

    var _refreshInfoBoxes = function () {
        _infoBoxes.forEach(function (item, index) {
            if (item.isActivated(_self)) {
                item.refresh();
            }
        });
    };
    this.__defineGetter__('refreshInfoBoxes', function () {
        return _refreshInfoBoxes;
    });

    _self.appendInfoBox(currentInfoBox);

    this.coordinateSystem = currentCS;

    var __fields__ = [{
        name: 'Имя',
        key: 'name'
    }];

    this.__defineGetter__('__fields__', function () {
        return __fields__;
    });

    var _get = function (key) {
        return _self[key];
    };
    this.__defineGetter__('get', function () {
        return _get;
    });

    var _set = function (key, val) {
        _self[key] = val;
    };
    this.__defineGetter__('set', function () {
        return _set;
    });
}