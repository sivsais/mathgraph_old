function Style(prop) {

    for (var key in prop) {
        if (typeof(prop[key])!== 'undefined') {
            this[key] = prop[key];
        }
    }

    this.clone = function () {
        return new Style(this);
    }

    this.remove = function () {
        delete this;
    }

}