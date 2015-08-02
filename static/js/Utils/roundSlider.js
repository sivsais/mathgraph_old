function roundSlider(params) {

    this.data = {};

	var $parent = $(document);
	if (typeof(params.$parent) !== 'undefined') {
		$parent = params.$parent;
	}
	
	var id = '';
	if (typeof(params.id) !== 'undefined') {
		id = params.id;
	}
	
	var radius_big = 20;
	if (typeof(params.radius_big) !== 'undefined') {
		radius_big = params.radius_big;
	}
	
	var radius_small = 5;
	if (typeof(params.radius_small) !== 'undefined') {
		radius_small = params.radius_small;
	}
	
	var start = 0;
	if (typeof(params.start) !== 'undefined') {
		start = params.start;
	}
	
	var min = -Infinity;
	if (typeof(params.min) !== 'undefined') {
		min = params.min;
	}
	
	var max = Infinity;
	if (typeof(params.max) !== 'undefined') {
		max = params.max;
	}
	
	var step = 0.001;
	if (typeof(params.step) !== 'undefined') {
		step = params.step;
	}

    var _focus = function () {};
    this.__defineGetter__('focus', function () {
        return _focus;
    });
    this.__defineSetter__('focus', function (p) {
        _focus = p;
    });

    var _blur = function () {};
    this.__defineGetter__('blur', function () {
        return _blur;
    });
    this.__defineSetter__('blur', function (p) {
        _blur = p;
    });

	var $container = $('<div />', {
		'id': id,
		'class': 'sliderContainer',
        'tabIndex': '0'
	});
	$container.css({
		'width': (radius_big * 2) + 'px',
		'height': (radius_big * 2) + 'px',
		'background': '#ddd',
		'border': '1px solid black',
		'border-radius': (radius_big * 2) + 'px',
        'z-index': $parent.attr('z-index')
	});
    $container.focus(function() {
        $(this).css('outline', '0');
        _focus();
    });
    $container.blur(function() {
        $(this).css('outline', '0');
        _blur();
    });
	
	var $slider = $('<div />', {
		'id': id + '_sSlider',
		'class': 'slider'
	});

	$slider.css({
		'position': 'relative',
		'height': (radius_small / 2 + radius_big) + 'px', //* 2) + 'px',
		'width': '1px',//(radius_small * 2) + 'px',
		'left': (radius_big - 1.5) + 'px', //radius_small) + 'px',
		'top': (-radius_small / 2 - 2) + 'px',
		'background': 'red',
		'border': '1px solid black',
		'border-radius': (radius_small * 2) + 'px',
        'z-index': $parent.attr('z-index')
	});
	
	$parent.append($container);
	$slider.appendTo($container);

	var deg = 0;
	var count = 0;
	var X = 0, Y = 0;
	var mdown = false;
	
	var atan_old = 0;
	var deg_old = 0;
	var count_old = 0;
	
	var _value = start;
	this.__defineGetter__('value', function() {
        return _value;
    });
    this.__defineSetter__('value', function(p) {
        _value = p;
        this.onValueChange(_value);
    });

    var _onValueChange = function (new_val) {};
    this.__defineGetter__('onValueChange', function() {
        return _onValueChange;
    });
    this.__defineSetter__('onValueChange', function(p) {
        _onValueChange = p;
    });

    var _me = this;
	$container
        .mousedown(function (e) {
            mdown = true;
         })
        .keypress(function(e) {
            if (e.which == 61 || e.which == 43 || e.which == 45) {
                var _nval;
                if (e.which == 45) {
                    _nval = _value - step;
                } else {
                    _nval = _value + step;
                }
                if (_nval < max && _nval > min) {
                    deg = (_nval - start) % 360;
                    var atan = (deg - 180) * Math.PI / 180;
                    var delta = ((Math.tan(atan) - Math.tan(atan_old)) / (1 + Math.tan(atan) * Math.tan(atan_old)));
                    if (delta > 0 && (deg - deg_old) < 0) {
                        count += 1;
                    }
                    if (delta < 0 && (deg - deg_old) > 0) {
                        count -= 1;
                    }

                    atan_old = atan;
                    deg_old = deg;
                    count_old = count;
                    _me.value = _nval;

                    X = Math.round(radius_big * Math.sin(deg * Math.PI / 180));
                    Y = Math.round(radius_big * -Math.cos(deg * Math.PI / 180));
                    $slider
                        .css({
                            '-webkit-transform-origin': '50% 100%',
                            '-moz-transform-origin': '50% 100%',
                            '-o-transform-origin': '50% 100%',
                            '-ms-transform-origin': '50% 100%',
                            'transform-origin:': '50% 100%',
                            /* Поворачиваем на 20 градусов против часовой стрелки */
                            '-webkit-transform': 'rotate(' + deg + 'deg)',
                            '-moz-transform:': 'rotate(' + deg + 'deg)',
                            '-o-transform:': 'rotate(' + deg + 'deg)',
                            '-ms-transform': 'rotate(' + deg + 'deg)',
                            'transform': 'rotate(' + deg + 'deg)'
                        });
                }
            }
        });
    $(document)
        .mouseup(function (e) {
            mdown = false;
        })
        .mousemove(function (e) {
            var elP = $container.offset();
            var elPos = {
                x: elP.left,
                y: elP.top
            };
            if (mdown) {
                var mPos = {
                        x: e.clientX - elPos.x,
                        y: e.clientY - elPos.y
                    };
                var atan = -Math.atan2(mPos.x - radius_big, mPos.y - radius_big);
                var delta = ((Math.tan(atan) - Math.tan(atan_old)) / (1 + Math.tan(atan) * Math.tan(atan_old)));

                deg = atan * 180 / Math.PI + 180;
                if (deg % step < step / 2) {
                    deg -= deg % step;
                } else {
                    deg -= deg % step - step;
                }
                if (delta > 0 && (deg - deg_old) < 0) {
                    count += 1;
                }
                if (delta < 0 && (deg - deg_old) > 0) {
                    count -= 1;
                }
                
                if (start + deg + 360 * count < max &&
                    start + deg + 360 * count > min) {
                    atan_old = atan;
                    deg_old = deg;
                    count_old = count;
                    _me.value = start + deg + 360 * count;
                } else {
                    atan = atan_old;
                    deg = deg_old;
                    count = count_old;
                }

                X = Math.round(radius_big * Math.sin(deg * Math.PI / 180));
                Y = Math.round(radius_big * -Math.cos(deg * Math.PI / 180));
                $slider
                    .css({
                        '-webkit-transform-origin': '50% 100%',
                        '-moz-transform-origin': '50% 100%',
                        '-o-transform-origin': '50% 100%',
                        '-ms-transform-origin': '50% 100%',
                        'transform-origin:': '50% 100%',
                        /* Поворачиваем на 20 градусов против часовой стрелки */
                        '-webkit-transform': 'rotate(' + deg + 'deg)',
                        '-moz-transform:': 'rotate(' + deg + 'deg)',
                        '-o-transform:': 'rotate(' + deg + 'deg)',
                        '-ms-transform': 'rotate(' + deg + 'deg)',
                        'transform': 'rotate(' + deg + 'deg)'
                    });

            }
        })
}