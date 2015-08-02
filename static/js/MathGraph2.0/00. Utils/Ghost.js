function Ghost(obj) {
    this.path = obj.path.clone();

    this.remove = function () {
        this.path.remove();
    };
    this.clone = function () {
        return new Ghost(this);
    }
}