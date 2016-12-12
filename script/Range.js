function Range(left, right){

    var _left = left;
    var _right = right;

    this.getLeft = function(){
        return _left;
    };

    this.getRight = function(){
        return _right;
    };

    this.toArray = function(){
        return [_left, _right];
    };

    return this;

}