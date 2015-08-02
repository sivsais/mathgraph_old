Curve.Manual = function () {
    Curve.Manual.superclass.constructor.call(this);
    this.level = 0;
    this.object = new Curve();
    this.level = 1;
    var _Xt = window.prompt('Введите X(t)', 't');
    var _Yt = window.prompt('Введите Y(t)', 't');
    var _begin = Parametric.calc(window.prompt('Введите начальное значение', '0'));
    var _end = Parametric.calc(window.prompt('Введите конечное значение', '1'));
    this.object.func.Xt = _Xt;
    this.object.func.Yt = _Yt;
    this.object.func.begin = _begin;
    this.object.func.end = _end;
    this.level = 2;
    this.object.coordSystem.objects.push(this.object);
    this.level = -1;

};
extend(Curve.Manual, Creator);