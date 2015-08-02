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
    var len = (max - min) + 1;
    return '#'+((0x1000000 + min) + (Math.random()) * len).toString(16).substr(1,6)
}

function colorGhostGroup(group) {
    for (var i in group.children) {
        group.children[i].strokeColor = get_random_color(0x555555, 0xcccccc);
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