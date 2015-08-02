// TODO: 5) global and local points
// TODO: 7) при изменении planeobject.style.strokeColor не применяется стиль
// TODO: 8) Всеобщее округление
// TODO: 9) Маленькая окружность в Rotator
// TODO: 10) Ограничение длины на Resizer
// TODO: 11) Добавить changing в InfoBox

var tool = new Tool();

var currentStyle = {
    strokeColor: get_random_color(),
    strokeWidth: 2,
    strokeCap: 'round',
    opacity: 1,
    clone: function () {
        var _cl = {};
        for (var i in this) {
            if (!this.hasOwnProperty(i)) {
                continue;
            }
            _cl[i] = this[i];
        }
        return _cl;
    }
};

var currentAxisStyle = new Style({
    strokeColor: 'blue',
    strokeWidth: 2,
    opacity: 0.8
});

var currentTickStyle = new Style({
    strokeColor: 'gray',
    strokeWidth: 2
});

var currentLabelStyle = new Style({
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 10,
    fillColor: 'red',
    justification: 'center'
});

var currentTransformerStyle = {
    rotateColor: 'green',
    rotateFill: 'green',
    rotateWidth: 3,
    rotateOpacity: 0.7,
    scaleColor: 'purple',
    scaleFill: 'purple',
    scaleWidth: 2,
    scaleOpacity: 0.7,
    translateColor: 'red',
    translateFill: 'red',
    translateWidth: 1,
    translateOpacity: 0.7,
    radiusSmall: 7,
    radiusBig: 14,
    pointWidth: 4,
    pointOpacity: 0.7,
    pointFill: 'white'
};

var currentGridStyle = new Style({
    strokeColor: 'green',
    strokeWidth: 1,
    dashArray: [5, 5],
    opacity: 0.5
});
view.center = new Point(0, 0);
var currentCS = new Affine({
    center: new Point(-0, 0),
    unitX: new Point(40, 0),
    unitY: new Point(0, -40)
});
var currentInfoBox = new InfoBox($('#infoBoxContainer'));
//var currentDeltaBox = new DeltaBox();
//var currentTool = new Segment.Creator2points();

var evFunc = function (type, event) {
    if (currentTool instanceof Creator) {
        currentTool[type](event);
    }
    if (currentTool instanceof Editor && typeof(currentTool.object) !== 'undefined') {
        currentTool[type](event);
    }
};

var _dblClickTimerId = -1;

tool.onClick = function(event) {          //TODO: когда одинарный щелчок - двойной щелчок может неправильно работать
    var body = function(event) {
        _dblClickTimerId = -1;
        evFunc('onClick', event);
    };
    if (_dblClickTimerId != -1) {
        clearTimeout(_dblClickTimerId);
        _dblClickTimerId = -1;
        tool.onDoubleClick(event);
    } else {
        _dblClickTimerId = setTimeout(body, DOUBLE_CLICK_MAX_TIME, event);
    }
};
tool.onMouseDown = function(event) {
    if (event.event.which == 1) {
        evFunc('onMouseDown', event);
    }
};
tool.onMouseUp = function(event) {
    if ((event.getDownPoint() - event.point).length == 0) {
        tool.onClick(event);
    }
    evFunc('onMouseUp', event);
};
tool.onMouseDrag = function(event) {
    if (event.event.which == 1) {
        evFunc('onMouseDrag', event);
    }
};
tool.onMouseMove = function(event) {
    evFunc('onMouseMove', event);
};
tool.onMouseEnter = function(event) {
    evFunc('onMouseEnter', event);
};
tool.onMouseLeave = function(event) {
    evFunc('onMouseLeave', event);
};
tool.onDoubleClick = function(event) {
    evFunc('onDoubleClick', event);
};

window.MathGraph = function () {
    this.__defineGetter__('EmptyTool', function () {
        return TTool;
    });

    this.__defineGetter__('Rotator', function () {
        return Rotator;
    });
    this.__defineGetter__('Resizer', function () {
        return Resizer;
    });
    this.__defineGetter__('Translator', function () {
        return Translator;
    });

    this.__defineGetter__('Segment', function () {
        return Segment;
    });

    this.__defineGetter__('Arrow', function () {
        return Arrow;
    });

    this.__defineGetter__('Affine', function () {
        return Affine;
    });

    this.__defineGetter__('Circle', function () {
        return Circle;
    });

    this.__defineGetter__('Straight', function () {
        return Straight;
    });

    this.__defineGetter__('Curve', function () {
        return Curve;
    });
};

COMPLETE_PAPER = true;