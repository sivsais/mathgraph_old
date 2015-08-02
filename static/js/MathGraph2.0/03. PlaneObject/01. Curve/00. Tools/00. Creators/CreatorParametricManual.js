Curve.CreatorParametricManual = function () {
    Curve.CreatorParametricManual.superclass.constructor.call(this);

    var $container = $('<div></div>');
    $container.addClass('prompt');
    $container.appendTo($('body'));

    var $table = $('<table></table>');
    $table.appendTo($container);

    var $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>X(t): </td>');
    var $Xt = $('<input/>', {
        type: 'text',
        value: 'sin(t)'
    });
    $row.append($('<td></td>').append($Xt));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Y(t): </td>');
    var $Yt = $('<input/>', {
        type: 'text',
        value: 'cos(t)'
    });
    $row.append($('<td></td>').append($Yt));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра: </td>');
    var $t = $('<input/>', {
        type: 'text',
        value: 't'
    });
    $row.append($('<td></td>').append($t));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Начало: </td>');
    var $begin = $('<input/>', {
        type: 'text',
        value: '-10'
    });
    $row.append($('<td></td>').append($begin));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Конец: </td>');
    var $end = $('<input/>', {
        type: 'text',
        value: '10'
    });
    $row.append($('<td></td>').append($end));

    var $params = $('<table></table>');
    $params.addClass('params');
    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append($('<td colspan="2"></td>').append($params));

    $params.append('<caption>Дополнительные параметры: </caption>');
    var $parameters = [];
    for (var i = 0; i < 5; i++) {
        var _k = $('<input/>', {
            type: 'text',
            placeholder: 'Имя параметра'
        });
        var _v = $('<input/>', {
            type: 'text',
            placeholder: 'Значение по умолчанию'
        });
        $row = $('<tr></tr>');
        $row.append($('<td></td>').append(_k));
        $row.append($('<td></td>').append(_v));
        $params.append($row);
        $parameters.push([_k, _v]);
    }

    var $Ok = $('<input/>', {
        type: 'button',
        value: 'Ok'
    });
    $Ok.appendTo($container);
    $Ok.addClass('Ok');

    var $Cancel = $('<input/>', {
        type: 'button',
        value: 'Cancel'
    });
    $Cancel.appendTo($container);
    $Cancel.addClass('Cancel');

    $Cancel.click(function (e) {
        $container.remove();
    });

    var _self = this;

    $Ok.click(function (e) {
        var p = {};
        $parameters.forEach(function (item, index) {
            if ($(item[0]).val() != '' && $(item[1]).val() != '') {
                p[$(item[0]).val()] = parseFloat($(item[1]).val());
            }
        });

        _self.object = new Curve();
        _self.object.fn = new Parametric($Xt.val(), $Yt.val(), $t.val(), parseFloat($begin.val()), parseFloat($end.val()), p);
        _self.object = undefined;
        $container.remove();
    });

};
extend(Curve.CreatorParametricManual, Creator);