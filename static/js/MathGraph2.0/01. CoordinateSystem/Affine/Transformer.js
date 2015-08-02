Affine.Transformer = function() {
    Affine.Transformer.superclass.constructor.call(this);

    this.object = currentCS;

//    this.object.ghost();

    var _me = this;

    var _rotateX, _rotateY, _rotateAll;
    var _scaleX, _scaleY, _scaleAll;
    var _translateX, _translateY, _translateAll;

    var p_rotateX, p_rotateY, p_rotateAll;
    var p_scaleX, p_scaleY, p_scaleAll;
    var p_translateX, p_translateY, p_translateAll;

    var _convert = function (point, bound) {
        return point;
//        if (point.x <= bound.getLeft()) {
//            point.x = bound.getLeft();
//        }
//        if (point.x >= bound.getRight()) {
//            point.x = bound.getRight();
//        }
//        if (point.y <= bound.getBottom()) {
//            point.y = bound.getBottom();
//        }
//        if (point.y >= bound.getTop()) {
//            point.y = bound.getTop();
//        }
//        return point;
    };

    var _calcPoints = function () {
        var _ts = _me.object.tickSize;
        var _p;

        _p = new Point(7 * _ts[0], 0);
        p_rotateX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 7 * _ts[1]);
        p_rotateY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(7 * _ts[0], 7 * _ts[1]);
        p_rotateAll = _me.object.localToGlobal(_convert(_p, _me.object.bound));

        _p = new Point(3 * _ts[0], 0);
        p_scaleX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 3 * _ts[1]);
        p_scaleY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(3 * _ts[0], 3 * _ts[1]);
        p_scaleAll = _me.object.localToGlobal(_convert(_p, _me.object.bound));

        _p = new Point(5 * _ts[0], 0);
        p_translateX = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        _p = new Point(0, 5 * _ts[1]);
        p_translateY = _me.object.localToGlobal(_convert(_p, _me.object.bound));
        p_translateAll = _me.object.basis[0];
    };

    var _drawTransformPanel = function () {

        if (typeof(_rotateX) !== 'undefined') {
            _rotateX.remove();
        }
        if (typeof(_scaleX) !== 'undefined') {
            _scaleX.remove();
        }
        if (typeof(_translateX) !== 'undefined') {
            _translateX.remove();
        }
        if (typeof(_rotateY) !== 'undefined') {
            _rotateY.remove();
        }
        if (typeof(_scaleY) !== 'undefined') {
            _scaleY.remove();
        }
        if (typeof(_translateY) !== 'undefined') {
            _translateY.remove();
        }
        if (typeof(_rotateAll) !== 'undefined') {
            _rotateAll.remove();
        }
        if (typeof(_scaleAll) !== 'undefined') {
            _scaleAll.remove();
        }
        if (typeof(_translateAll) !== 'undefined') {
            _translateAll.remove();
        }

        _calcPoints();

        _rotateX = new Path.Circle({
            center: p_rotateX,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });
        _rotateY = new Path.Circle({
            center: p_rotateY,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });
        _rotateAll = new Path.Circle({
            center: p_rotateAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.rotateColor,
            strokeWidth: currentTransformerStyle.rotateWidth,
            fillColor: currentTransformerStyle.rotateFill,
            opacity: currentTransformerStyle.rotateOpacity
        });

        _scaleX = new Path.Circle({
            center: p_scaleX,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });
        _scaleY = new Path.Circle({
            center: p_scaleY,
            radius: currentTransformerStyle.radiusSmall,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });
        _scaleAll = new Path.Circle({
            center: p_scaleAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.scaleColor,
            strokeWidth: currentTransformerStyle.scaleWidth,
            fillColor: currentTransformerStyle.scaleFill,
            opacity: currentTransformerStyle.scaleOpacity
        });

//        _translateX = new Path.Circle({
//            center: p_translateX,
//            radius: currentTransformerStyle.radiusSmall,
//            strokeColor: currentTransformerStyle.translateColor,
//            strokeWidth: currentTransformerStyle.translateWidth,
//            fillColor: currentTransformerStyle.translateFill,
//            opacity: currentTransformerStyle.translateOpacity
//        });
//        _translateY = new Path.Circle({
//            center: p_translateY,
//            radius: currentTransformerStyle.radiusSmall,
//            strokeColor: currentTransformerStyle.translateColor,
//            strokeWidth: currentTransformerStyle.translateWidth,
//            fillColor: currentTransformerStyle.translateFill,
//            opacity: currentTransformerStyle.translateOpacity
//        });
        _translateAll = new Path.Circle({
            center: p_translateAll,
            radius: currentTransformerStyle.radiusBig,
            strokeColor: currentTransformerStyle.translateColor,
            strokeWidth: currentTransformerStyle.translateWidth,
            fillColor: currentTransformerStyle.translateFill,
            opacity: currentTransformerStyle.translateOpacity
        });

        _rotateX.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateX.onMouseDown = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateX.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };
        _rotateY.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateY.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };
        _rotateAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _rotateAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.rotateOpacity;
            this.strokeWidth = currentTransformerStyle.rotateWidth;
            this.fillColor = currentTransformerStyle.rotateFill;
        };

        _scaleX.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleX.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        _scaleY.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleY.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        _scaleAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _scaleAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.scaleOpacity;
            this.strokeWidth = currentTransformerStyle.scaleWidth;
            this.fillColor = currentTransformerStyle.scaleFill;
        };
        
//        _translateX.onMouseEnter = function (event) {
//            this.opacity = currentTransformerStyle.pointOpacity;
//            this.strokeWidth = currentTransformerStyle.pointWidth;
//            this.fillColor = currentTransformerStyle.pointFill;
//        };
//        _translateX.onMouseLeave = function (event) {
//            this.opacity = currentTransformerStyle.translateOpacity;
//            this.strokeWidth = currentTransformerStyle.translateWidth;
//            this.fillColor = currentTransformerStyle.translateFill;
//        };
//        _translateY.onMouseEnter = function (event) {
//            this.opacity = currentTransformerStyle.pointOpacity;
//            this.strokeWidth = currentTransformerStyle.pointWidth;
//            this.fillColor = currentTransformerStyle.pointFill;
//        };
//        _translateY.onMouseLeave = function (event) {
//            this.opacity = currentTransformerStyle.translateOpacity;
//            this.strokeWidth = currentTransformerStyle.translateWidth;
//            this.fillColor = currentTransformerStyle.translateFill;
//        };
        _translateAll.onMouseEnter = function (event) {
            this.opacity = currentTransformerStyle.pointOpacity;
            this.strokeWidth = currentTransformerStyle.pointWidth;
            this.fillColor = currentTransformerStyle.pointFill;
        };
        _translateAll.onMouseLeave = function (event) {
            this.opacity = currentTransformerStyle.translateOpacity;
            this.strokeWidth = currentTransformerStyle.translateWidth;
            this.fillColor = currentTransformerStyle.translateFill;
        };
        
    };

    var _redraw = function () {
        _calcPoints();

        _rotateX.position = p_rotateX;
        _rotateY.position = p_rotateY;
        _rotateAll.position = p_rotateAll;

        _scaleX.position = p_scaleX;
        _scaleY.position = p_scaleY;
        _scaleAll.position = p_scaleAll;

//        _translateX.position = p_translateX;
//        _translateY.position = p_translateY;
        _translateAll.position = p_translateAll;
    };

    _drawTransformPanel();
    var _init = function () {
        var _elems = [
            {
                button: _rotateX,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle, 'X');
                    _redraw();
                }

            },
            {
                button: _scaleX,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length, 'X');
                    _redraw();
                }
            },
//            {
//                button: _translateX,
//                func: function (p0, p1) {
//                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
////                    delta.x = 0;
//                    _me.object.translate(delta, 'X');
//                    _redraw();
//                }
//            },
            {
                button: _rotateY,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle, 'Y');
                    _redraw();
                }
            },
            {
                button: _scaleY,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length, 'Y');
                    _redraw();
                }
            },
//            {
//                button: _translateY,
//                func: function (p0, p1) {
//                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
////                    delta.y = 0;
//                    _me.object.translate(delta, 'Y');
//                    _redraw();
//                }
//            },
            {
                button: _rotateAll,
                func: function (p0, p1) {
                    _me.object.rotate((p1 - _me.object.basis[0]).angle - (p0 - _me.object.basis[0]).angle);
                    _redraw();
                }

            },
            {
                button: _scaleAll,
                func: function (p0, p1) {
                    _me.object.scale((p1 - _me.object.basis[0]).length / (p0 - _me.object.basis[0]).length);
                    _redraw();
                }
            },
            {
                button: _translateAll,
                func: function (p0, p1) {
                    var delta = (p1 - _me.object.basis[0]) - (p0 - _me.object.basis[0]);
//                    delta.x = 0;
                    _me.object.translate(delta);
                    _redraw();
                }
            }
        ];
        _me.init(_elems);
    };

    _init();

    var _remove = function () {
        if (typeof(_rotateX) !== 'undefined') {
            _rotateX.remove();
        }
        if (typeof(_scaleX) !== 'undefined') {
            _scaleX.remove();
        }
        if (typeof(_translateX) !== 'undefined') {
            _translateX.remove();
        }
        if (typeof(_rotateY) !== 'undefined') {
            _rotateY.remove();
        }
        if (typeof(_scaleY) !== 'undefined') {
            _scaleY.remove();
        }
        if (typeof(_translateY) !== 'undefined') {
            _translateY.remove();
        }
        if (typeof(_rotateAll) !== 'undefined') {
            _rotateAll.remove();
        }
        if (typeof(_scaleAll) !== 'undefined') {
            _scaleAll.remove();
        }
        if (typeof(_translateAll) !== 'undefined') {
            _translateAll.remove();
        }
    };
    this.__defineGetter__('remove', function () {
        return _remove;
    })
};
extend(Affine.Transformer, Transformer);