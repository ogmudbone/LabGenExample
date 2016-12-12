function Matrix(first, second){

    var elements = [];
    var height;
    var width;

    if(second == undefined)
        width = height = first;
    else if(first instanceof Array) {

        if(first.length % second != 0)
            throw new Error("Invalid height in matrix constructor");

        height = second;
        width = first.length / second;
        elements = first;

    }
    else{

        height = first;
        width = second;

    }

    if(elements.length == 0)
        for(var i = 0; i < height;i++)
            for(var j = 0;j < width;j++)
                elements[i*width + j] = 0;

    function checkBounds(i, j){
        if(i > height)
            throw new Error("Invalid index i : " + i + " matrix height : " + height);
        if(j > width)
            throw new Error("Invalid index j : " + j + " matrix width : " + width);
    }

    this.height = function(){
        return height;
    };

    this.width = function(){
        return width;
    };

    this.get = function(i, j){

        checkBounds(i, j);
        return elements[i*width + j];

    };

    this.set = function(i, j, value){

        checkBounds(i, j);
        elements[i*width + j] = value;

    };

    this.toArray = function(){

        var elementsArray = [];

        for(i = 0; i < height;i++) {
            elementsArray[i] = [];
            for (j = 0; j < width; j++)
                elementsArray[i][j] = this.get(i, j);
        }

        return elementsArray;

    };

    this.isSquare = function(){
        return height == width;
    };

    this.multiply = function(argument){

        var result;

        if(argument instanceof Matrix){

            if(width != argument.height())
                throw new Error("Matrix with width " + width +
                    " can`not be multiplied on matrix with height "
                    + argument.height());

            result = new Matrix(height, argument.width());

            for(var i = 0;i < result.height();i++)
                for(var j = 0; j < result.width(); j++)
                    for (var k = 0; k < width;k++)
                        result.set(i, j,
                            result.get(i, j) + this.get(i,k)*argument.get(k, j)
                        );

        }
        else if(argument instanceof Vector){

            result = new Vector(argument.length());

            for(var i = 0;i < this.height();i++)
                for(var j = 0; j < argument.length();j++)
                    result.set(i,
                        result.get(i) + argument.get(j)*this.get(i,j)
                    );

        }
        else{

            result = new Matrix(height, width);

            for(var i = 0; i < height; i++)
                for(var j = 0;j < width; j++)
                    result.set(i,j, this.get(i, j)* argument);

        }

        return result;

    };

    this.transpose = function(){

        var transposedMatrix = new Matrix(width, height);

        for(var i = 0; i < transposedMatrix.height();i++)
            for(var j = 0;j < transposedMatrix.width();j++)
                transposedMatrix.set(i,j,
                    this.get(j, i)
                );

        return transposedMatrix;

    };

    this.copy = function(){

        var copy = new Matrix(height, width);

        for(var i = 0;i < height;i++)
            for(var j = 0;j < width;j++)
                copy.set(i, j,
                    this.get(i, j)
                );

        return copy;

    };

    return this;

}

function OneMatrix(size){

    var matrix = new Matrix(size, size);
    for (var i = 0;i < matrix.width();i++)
        matrix.set(i, i, 1);

    return matrix;

}