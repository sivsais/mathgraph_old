function toFixedNoZeros(x, k) {
    var s = x.toFixed(k);
    if (s.indexOf('.') == 0) {
        return s;
    }
    while (s[s.length - 1] == '0') {
        s = s.substring(0, s.length - 1);
    }
    return s;
}

function get_random_color(min, max) {
    var v = 70;
    var s = 100;
    var h = Math.floor(Math.random() * (361));

    var h_i, a, v_min, v_inc, v_dec;

    h_i = Math.floor(h / 60.0);
    v_min = (100 - s) * v / 100.0;
    a = (v - v_min) * (h % 60) / 60.0;
    v_inc = v_min + a;
    v_dec = v - a;

    var r, g, b;
    switch (h_i) {
        case 0:
            r = v;
            g = v_inc;
            b = v_min;
            break;
        case 1:
            r = v_dec;
            g = v;
            b = v_min;
            break;
        case 2:
            r = v_min;
            g = v;
            b = v_inc;
            break;
        case 3:
            r = v_min;
            g = v_dec;
            b = v;
            break;
        case 4:
            r = v_inc;
            g = v_min;
            b = v;
            break;
        case 5:
            r = v;
            g = v_min;
            b = v_dec;
            break;
    }
    r = Math.round(r * 2.55).toString(16);
    g = Math.round(g * 2.55).toString(16);
    b = Math.round(b * 2.55).toString(16);
    if (r.length < 2) {
        r = '0' + r;
    }
    if (g.length < 2) {
        g = '0' + g;
    }
    if (b.length < 2) {
        b = '0' + b;
    }
    return '#' + r + g + b;
}

function colorGhostGroup(group) {
    for (var i in group.children) {
        group.children[i].strokeColor = get_random_color();
    }
    group.opacity = 0.6;
}

function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype
}

function getViewIntersections(path, scale) {
    if (typeof(scale) == 'undefined') {
        scale = 1;
    }
    var t = path.getIntersections(new Path.Rectangle(view.bounds).scale(scale));
    var res = [];
    for (var i = 0; i < t.length; i++) {
        var flag = true;
        for (var j = 0; j < res.length; j++) {
            if ((t[i].point - res[j].point).length < MIN_LENGTH) {
                flag = false;
                break;
            }
        }
        if (flag) {
            res.push(t[i].point);
        }
    }
    return res;
}

function getMsInterval(ms1, ms2) {
    var ms1 = time1[0] * 1000 + time1[1];
    var ms2 = time2[0] * 1000 + time2[1];
    return (ms2 - ms1);
}

function eval_expr(expr) {

}

function isDefined(x) {
    return (typeof(x) !== 'undefined');
}

function hideElem($elem, complete) {
    $elem.hide(0, complete);
}
function showElem($elem, complete) {
    $elem.show(0, complete);
}

function roundTo(x, k) {
    var i;
    for (i = 0; i < k; i++) {
        x *= 10;
    }
    x = Math.round(x);
    for (i = 0; i < k; i++) {
        x /= 10;
    }

    return x;
}

function calcArcByAngles(center, radius, angleFrom, angleTo, angleZero) {
    var _vec = new Point(radius, 0);
    if (typeof(angleZero) !== 'undefined') {
        _vec = _vec.rotate(angleZero);
    }
    var _from = _vec.rotate(angleFrom) + center;
    var _through = _vec.rotate((angleFrom + angleTo) / 2) + center;
    var _to = _vec.rotate(angleTo) + center;
    return {
        from: _from,
        through: _through,
        to: _to
    };
}

function calcArcByLen(center, radius, length, angleZero) {
    var angleFrom = - length / radius / 2 * 180 / 3.14;
    var angleTo = length / radius / 2 * 180 / 3.14;
    console.log(angleFrom, angleTo);
    return calcArcByAngles(center, radius, angleFrom, angleTo, angleZero);
}