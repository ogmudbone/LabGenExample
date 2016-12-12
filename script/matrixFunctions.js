function gershgorinCircles(matrix, profiler){

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    var circles = [];

    for(var i = 0;i < matrix.height();i++){

        var R = 0;
        var a;
        var RNumbers = [];

        for(var j = 0;j < matrix.width();j++)
            if (j != i) {
                R += Math.abs(
                    matrix.get(i, j)
                );
                RNumbers.push(
                    matrix.get(i, j)
                );
            }
            else
                a = matrix.get(i, j);


        var range = new Range(R - a, R + a);

        profiler.newStep({
            range    : range.toArray(),
            R        : R,
            a        : a,
            rNumbers : RNumbers,
            index    : i
        });

        circles.push(new Range())

    }

    return circles;

}

function givensMatrix(matrix, first_i, second_i, profiler){

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    var first, second,
        first_j = 0,
        second_j = 0;

    while((first = matrix.get(first_i, first_j)) == 0)
        first_j++;

    while((second = matrix.get(second_i, second_j)) == 0)
        second_j++;

    profiler.addToStep({
        first_index_i : first_i,
        first_index_j : first_j,
        second_index_i : second_i,
        second_index_j : second_j,
        first_value : first,
        second_value : second
    });

    var s = first / Math.sqrt(first*first + second * second);
    var c = second / Math.sqrt(first*first + second * second);

    profiler.addToStep({
        s : s,
        c : c
    });

    var givensMatrix = OneMatrix(matrix.height());

    profiler.addToStep({
        givens_matrix : givensMatrix
    });

    givensMatrix.set(second_i, first_i, -s);
    givensMatrix.set(first_i, second_i, s);
    givensMatrix.set(second_i, second_i, c);
    givensMatrix.set(first_i, first_i, c);

    return givensMatrix;

}

function givensReduce(matrix, first_i, second_i, profiler) {

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    var first, second,
        first_j = 0,
        second_j = 0;

    while((first = matrix.get(first_i, first_j)) == 0)
        first_j++;

    while((second = matrix.get(second_i, second_j)) == 0)
        second_j++;

    profiler.addToStep({
        first_index_i : first_i,
        first_index_j : first_j,
        second_index_i : second_i,
        second_index_j : second_j,
        first_value : first,
        second_value : second
    });

    var s = first / Math.sqrt(first*first + second * second);
    var c = second / Math.sqrt(first*first + second * second);

    profiler.addToStep({
        s : s,
        c : c
    });

    var givensMatrix = OneMatrix(matrix.height());

    givensMatrix.set(second_i, first_i, -s);
    givensMatrix.set(first_i, second_i, s);
    givensMatrix.set(second_i, second_i, c);
    givensMatrix.set(first_i, first_i, c);

    profiler.addToStep({
        givens_matrix : givensMatrix,
        givens_matrix_transpose : givensMatrix.transpose(),
        initial_matrix : matrix
    });

    var resultMatrix = givensMatrix.transpose().multiply(matrix);

    resultMatrix.set(first_i, first_j, 0);


    profiler.addToStep({
        result_matrix : resultMatrix
    });

    return resultMatrix;

}

function givensReduceSymmetry(matrix, first_i, second_i, profiler) {

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    var first, second,
        first_j = 0,
        second_j = 0;

    while((first = matrix.get(first_i, first_j)) == 0)
        first_j++;

    while((second = matrix.get(second_i, second_j)) == 0)
        second_j++;

    profiler.addToStep({
        first_index_i : first_i,
        first_index_j : first_j,
        second_index_i : second_i,
        second_index_j : second_j,
        first_value : first,
        second_value : second
    });

    var s = first / Math.sqrt(first*first + second * second);
    var c = second / Math.sqrt(first*first + second * second);

    profiler.addToStep({
        s : s,
        c : c
    });

    var givensMatrix = OneMatrix(matrix.height());

    givensMatrix.set(second_i, first_i, -s);
    givensMatrix.set(first_i, second_i, s);
    givensMatrix.set(second_i, second_i, c);
    givensMatrix.set(first_i, first_i, c);

    profiler.addToStep({
        givens_matrix : givensMatrix,
        givens_matrix_transpose : givensMatrix.transpose(),
        initial_matrix : matrix
    });

    var resultMatrix = givensMatrix.transpose().multiply(matrix).multiply(givensMatrix);

    resultMatrix.set(first_i, first_j, 0);


    profiler.addToStep({
        result_matrix : resultMatrix
    });

    return resultMatrix;

}

function toTridiagonal(matrix, profiler){

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    profiler.setAction("to_tridiagonal");

    var resultMatrix = matrix.copy();

    if(matrix.height() < 3)
        return resultMatrix;

    var index = 0;

    for(var i = 1; i < matrix.height();i++)
        for(var j = i+1; j < matrix.height(); j++){

            profiler.newStep({index : index});
            resultMatrix = givensReduceSymmetry(resultMatrix, j, i, profiler);

            index++;

        }

    for(i = 0;i < resultMatrix.height();i++)
        for(j = 0;j < resultMatrix.width();j++)
            if(i != j && i+1 != j && i-1 != j)
                resultMatrix.set(i, j, 0);

    return resultMatrix;

}

function qrFactorization(matrix, profiler){

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    var givensMatrixes = [];
    var RMatrix = matrix.copy();

    if(matrix.height() < 2)
        throw new Error("Too small matrix for QR-factorization");

    profiler.setAction('qr_givens_reduce');

    var index = 0;

    for(var i = 0;i < matrix.height();i++)
        for (var j = i+1; j < matrix.height();j++){

            if(Math.abs(RMatrix.get(j, i)) != 0) {

                profiler.newStep({index : index});
                var currentGivensMatrix = givensMatrix(RMatrix, j, i);
                givensMatrixes.push(currentGivensMatrix);
                RMatrix = givensReduce(RMatrix, j, i, profiler);
                index++;

            }

        }

    var profilerQMatrixes = [];

    for(var key in givensMatrixes)
        if(givensMatrixes.hasOwnProperty(key))
            profilerQMatrixes.push(givensMatrixes[key].copy());

    profiler.setAction('qr_end');
    profiler.newStep({
        qMatrixes : profilerQMatrixes
    });

    givensMatrixes = givensMatrixes.reverse();

    var QMatrix = givensMatrixes.pop();

    while(givensMatrixes.length > 0)
        QMatrix = QMatrix.multiply(givensMatrixes.pop());

    profiler.addToStep({
        Q : QMatrix,
        R : RMatrix
    });

    return [QMatrix, RMatrix];

}

function qrAlgorythm(matrix, epsilon, profiler){

    if(epsilon == undefined)
        epsilon = 0.001;

    if(!(profiler instanceof EquationProfiler))
        profiler = new EquationProfiler();

    function checkPresision(matrix){

        for(var i = 0;i < matrix.height();i++)
            for(var j = 0;j < matrix.width();j++) {

                var elementsSum = 0;

                if (i != j)
                    elementsSum += Math.abs(matrix.get(i, j))

                if(elementsSum > epsilon)
                    return false;

            }

        return true;

    }

    var HMatrix = toTridiagonal(matrix, profiler);

    var iterationIndex = 0;

    while(!checkPresision(HMatrix)){

        var QRMatrixes = qrFactorization(HMatrix, profiler);

        HMatrix = QRMatrixes[1].multiply(QRMatrixes[0]);

        profiler.setAction('qr_algorythm_iteration');

        profiler.newStep({
            iteration : iterationIndex,
            Q : QRMatrixes[0],
            R : QRMatrixes[1],
            result : HMatrix
        });

        iterationIndex++;

    }

    return HMatrix;

}