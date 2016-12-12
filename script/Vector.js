function Vector(arg){

    var elements;

    if(arg instanceof Array)
        elements = arg;

    else if(isNumeric(arg)){
        elements = [];

        for(var i = 0;i < arg;i++)
            elements.push(0);

    }

    function checkBounds(i){
        if(i >= elements.length)
            throw new Error('Invalid index to access vector. Index : ' + i + ' Vector length : ' + elements.length);
    }

    this.get = function(i){
        checkBounds(i);
        return elements[i];
    };

    this.set = function(i, value){
        checkBounds(i);
        elements[i] =  value;
    };

    this.length = function(){
        return elements.length;
    };

    this.copy = function(){

        var newVector = new Vector(this.length());

        for(var i = 0;i < this.length();i++)
            newVector.set(i, this.get(i));

        return newVector;

    };

    this.toArray = function(){

        var elementsArray = [];

        for(var i = 0;i < this.length();i++)
            elementsArray.push(this.get(i));

        return elementsArray;

    };

    this.multiply = function(arg){

        var newVector;

        if(isNumeric(arg)){

            newVector = this.copy();

            for(var i = 0;i < newVector.length();i++)
                newVector.set(i,
                    newVector.get(i) * arg
                );

        }

        return newVector;

    };

    return this;

}