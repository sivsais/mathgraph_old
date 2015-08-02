Curve.CreatorImplicitManual = function () {
    Curve.CreatorImplicitManual.superclass.constructor.call(this);

    var $container = $('<div></div>');
    $container.addClass('prompt');
    $container.appendTo($('body'));

    var $table = $('<table></table>');
    $table.appendTo($container);

    var $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Левая часть: </td>');
    var $Left = $('<input/>', {
        type: 'text',
        value: 'x*x + y*y'
    });
    $row.append($('<td></td>').append($Left));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Знак неравенства: </td>');
    var $Sense = $('<input/>', {
        type: 'text',
        value: '<='
    });
    $row.append($('<td></td>').append($Sense));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Правая часть: </td>');
    var $Right = $('<input/>', {
        type: 'text',
        value: '4'
    });
    $row.append($('<td></td>').append($Right));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра 1: </td>');
    var $X = $('<input/>', {
        type: 'text',
        value: 'x'
    });
    $row.append($('<td></td>').append($X));

    $row = $('<tr></tr>');
    $row.appendTo($table);
    $row.append('<td>Имя параметра 2: </td>');
    var $Y = $('<input/>', {
        type: 'text',
        value: 'y'
    });
    $row.append($('<td></td>').append($Y));

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
        _self.object = new Curve();
        _self.object.fn = new Implicit($Left.val(), $Right.val(), $Sense.val(), $X.val(), $Y.val(), {});
        _self.object = undefined;
        $container.remove();
    });
};
extend(Curve.CreatorImplicitManual, Creator);