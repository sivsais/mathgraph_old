function PlaneObject() {
    if (typeof(PlaneObject.lastId) == 'undefined') {
        PlaneObject.lastId = 0;
    }

    var _id = PlaneObject.lastId + 1;
    PlaneObject.lastId += 1;
    this.__defineGetter__('id', function() {
        return _id;
    });

    var _name = undefined;
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineSetter__('name', function(p) {
        _name = p;
    });

    var _path = new Path();
    var _me = this;
    var _mouseOnMe = false;
    var initPath = function () {
        _me.style = _defaultStyle;
        var _evFunc = function (type, event) {
            if (currentTool instanceof Editor && currentTool.level == -1) {
                if (currentTool instanceof Rotator) {
                    currentTool = new _me.__proto__.constructor.Rotator(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Resizer) {
                    currentTool = new _me.__proto__.constructor.Resizer(); //TODO: Проверить корректность
                }
                if (currentTool instanceof Translator) {
                    currentTool = new _me.__proto__.constructor.Translator(); //TODO: Проверить корректность
                }
                currentTool.object = _me;
                currentTool[type](event);
//                currentTool.object = _me;
//                currentTool[type](event);
            }
        };

        _path.onClick = function(event) {
            _me.selected = !_me.selected;
            _evFunc('onClick', event);
        };
        _path.onMouseDown = function(event) {
            _evFunc('onMouseDown', event);
        };
        _path.onDoubleClick = function(event) {
            _evFunc('onDoubleClick', event);
        };
        _path.onMouseEnter = function(event) {
            _me.pointed = true;
            _mouseOnMe = true;
        };
        _path.onMouseLeave = function(event) {
            _me.pointed = false;
            _mouseOnMe = false;
        };
    };
    initPath();
    this.__defineGetter__('path', function() {
        return _path;
    });
    this.__defineSetter__('path', function(p) {
        if (typeof(_path)!== 'undefined') {
            _path.remove();
        }
        _path = p;
        initPath();
    });

    var _style = undefined;
    var _defaultStyle = currentStyle;
    var _pointedStyle = new Style({strokeColor: 'skyblue', opacity: 0.5, strokeWidth: 4, strokeCap: 'round'});
    var _selectedStyle = new Style({strokeColor: 'green', opacity: 0.7, strokeWidth: 3, strokeCap: 'round'});
    this.__defineGetter__('style', function() {
        return _style;
    });
    this.__defineSetter__('style', function(p) {
        var pp = p.clone();
        if (typeof(_style) !== 'undefined') {
            _style.remove();
        }
        _style = pp.clone();
        pp.remove();
        if (typeof(this.path)!== 'undefined') {
            for (var key in _style) {
                if (typeof(_style[key])!== 'undefined' && typeof(_style[key]) != 'function') {
                    this.path[key] = _style[key];
                }
            }
        }


    });
    this.style = _defaultStyle;

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
        } else {
            this.style = _defaultStyle;
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
            var objs = this.coordSystem.objects;
            for (var i in objs) {
                if (objs[i].id != this.id) {
                    objs[i].selected = false;
                }
            }

            this.infoBox.activate(this);
            this.infoBox.refresh();
            this.pointed = false;
            this.style = _selectedStyle;
        } else {
            this.infoBox.deactivate();
            this.style = _defaultStyle;
            if (_mouseOnMe) {
                this.pointed = true;
            }
        }
    });

    var _coordSystem = currentCS;
    this.__defineGetter__('coordSystem', function() {
        return _coordSystem;
    });
    this.__defineSetter__('coordSystem', function(p) {
        _coordSystem = p;
        _coordSystem.addObject(this);
    });

    var _remove = function() {
        this.path.remove();
        delete this;
    };
    this.__defineGetter__('remove', function() {
        return _remove;
    });

    var _infoBox = currentInfoBox;
    this.__defineGetter__('infoBox', function() {
        return _infoBox;
    });
    this.__defineSetter__('infoBox', function(p) {
        _infoBox = p;
    });
}