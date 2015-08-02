function Toolbar($container) {

    var $elements = $container.children('.item');

    var _self = this;

    var $buttons = [];
    var $groups = [];
    var $children = [];
    var $childrenElems = [];

    var _checkParent = function (elem, candidate) {
        return $(elem).parents().is(candidate);
    };

    var _toggleSelect = function ($elems) {
        var _flags = {};
        $elems.forEach(function (item, index) {
            _flags[index] = item.hasClass('selected');
        });
        _deselectAll();
        $elems.forEach(function (item, index) {
            if (!_flags[index]) {
                item.toggleClass('selected');
            }
        });
    };

    var _deselectAll = function () {
        $buttons.forEach(function (elem) {
            $(elem).removeClass('selected');
        });
        $groups.forEach(function (elem) {
            $(elem).removeClass('selected');
        });
        $children.forEach(function (elem) {
            elem.deselectAll();
        });
    };
    this.__defineGetter__('deselectAll', function () {
        return _deselectAll;
    });

    $elements.each(function (index, elem) {
        var $ico;
        if ($(elem).hasClass('button')) {
            $ico = $($(elem).children('.icon')[0]);
            $ico.css({
                background: 'url(' + $ico.text() + ')',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            });
            $ico.text('');
            $(elem).click(function (e) {
                _toggleSelect([$(elem)]);
                _onChange($(elem));
            });
            $buttons.push($(elem));
        }
        if ($(elem).hasClass('group')) {
            var _child = $($(elem).children('.child')[0]);
            _child.hide(0);

            var $btn = $($(elem).children('.button')[0]);
            $ico = $($btn.children('.icon')[0]);

            _child.css({
                zIndex: $container.css('zIndex') + 1
            });

            var _childBar = new Toolbar(_child);
            $children.push(_childBar);
            $childrenElems.push(_child);
            var _carry = false;

            if ($ico.text() != '') {
                $ico.css({
                    background: 'url(' + $ico.text() + ')',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                });
                $ico.text('');
            } else {
                _carry = true;
                var _for_clone = $(_child.children('.button')[0]);
                $btn.replaceWith(_for_clone.clone(false, false));
                $btn = $($(elem).children('.button')[0]);
                $btn.click(function (e) {
                    _toggleSelect([$btn, _for_clone]);
                    _onChange($btn);
                });
            }
            $btn.longpress(function (e) {
                $childrenElems.forEach(function (item) {
                    $(item).hide(0);
                });
                _child.toggle(0);
            });

            $(document).click(function (e) {
                if (!_checkParent(e.target, _child) && _child.is(':visible')) {
                    _child.hide();
                }
            });

            $groups.push($btn);
            var _gid = $groups.length - 1;

            _childBar.onChange = function ($elem) {
                if (_carry) {
                    $btn.replaceWith($elem.clone(false, false));
                    $btn = $($(elem).children('.button')[0]);
                    $groups[_gid] = $btn;
                    $btn.click(function (e) {
                        _toggleSelect([$btn, $elem]);
//                        _toggleSelect($elem);
                        _onChange($btn);
                    });
                    $btn.longpress(function (e) {
                        $childrenElems.forEach(function (item) {
                            $(item).hide(0);
                        });
                        _child.toggle(0);
                    });
                    if (_child.is(':visible')) {
                        _child.hide();
                    }
                }
            };
        }
        if ($(elem).hasClass('checkbox')) {
            var $checked_ico = $($(elem).children('.icon.checked')[0]).text();
            var $unchecked_ico = $($(elem).children('.icon.unchecked')[0]).text();
            $ico = $($(elem).children('.icon.checked')[0]);
            $($(elem).children('.icon.unchecked')[0]).remove();
            $ico.text('');
            if ($(elem).hasClass('checked')) {
                $ico.css({
                    background: 'url(' + $checked_ico + ')',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                });
            } else {
                $ico.css({
                    background: 'url(' + $unchecked_ico + ')',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                });
            }
            $(elem).click(function (e) {
                $(this).toggleClass('checked');
                if ($(this).hasClass('checked')) {
                    $ico.css({
                        background: 'url(' + $checked_ico + ')',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    });
                } else {
                    $ico.css({
                        background: 'url(' + $unchecked_ico + ')',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    });
                }
            })
        }
        if ($(elem).hasClass('checkbox-group')) {
            var _child = $($(elem).children('.child')[0]);
            _child.hide(0);

            var $btn = $($(elem).children('.button')[0]);
            $ico = $($btn.children('.icon')[0]);

            _child.css({
                zIndex: $container.css('zIndex') + 1
            });

            var _childBar = new Toolbar(_child);
            _childBar.onChange = function ($elem) {

            };
            $childrenElems.push(_child);

            $ico.css({
                background: 'url(' + $ico.text() + ')',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            });
            $ico.text('');

            $btn.longpress(function (e) {
                $childrenElems.forEach(function (item) {
                    $(item).hide(0);
                });
                _child.toggle(0);
            });

            $(document).click(function (e) {
                if (!_checkParent(e.target, _child) && _child.is(':visible')) {
                    _child.hide();
                }
            });
        }
    });

    var _onChange = function ($elem) {};
    this.__defineGetter__('onChange', function () {
        return _onChange;
    });
    this.__defineSetter__('onChange', function (p) {
        _onChange = p;
    });
}