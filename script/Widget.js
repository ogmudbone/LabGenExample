var widgetSettings = {
    precision : 4
};

function normalizeNumbers(params, forbidKeys){

    if(!(forbidKeys instanceof Array))
        forbidKeys = [];

    for(var key in params)
        if(params.hasOwnProperty(key)){

            if(isNumeric(params[key]) && forbidKeys.indexOf(key) == -1)
                params[key] = parseFloat(params[key]).toFixed(widgetSettings.precision);

            else if(params[key] instanceof Matrix || params[key] instanceof Vector)
                params[key] = normalizeNumbers(params[key].toArray());

            else if(params[key] instanceof Object || params[key] instanceof Array)
                params[key] = normalizeNumbers(params[key], forbidKeys);

        }

    return params;

}

function widget(config){

    if(!config.hasOwnProperty('path'))
        throw new Error('Path parameter must be set');

    var params = config.hasOwnProperty('params') ? config.params : [];

    include(config['path'], params);

}

function latexWidget(template, params, tagAttributes){

    bufferStart();
    echo('<latex ' + tagAttributesBuilder(tagAttributes) + " >");
    widget({
        path : template,
        params : params
    });
    echo('</latex>');
    echo(bufferFlush());

}

function matrixWidget(matrix, before, after, tagAttr){

    if (before == undefined)
        before = "";

    if (after == undefined)
        after = "";

    var matrixArray = matrix.toArray();

    for(var key in matrixArray)
        if(matrixArray.hasOwnProperty(key))
            for(var rowKey in matrixArray[key])
                if(matrixArray[key].hasOwnProperty(rowKey))
                    matrixArray[key][rowKey] = matrixArray[key][rowKey].toFixed(widgetSettings.precision);

    latexWidget(
        'latex/matrix.tex',
        {
            matrix : matrixArray,
            before : before,
            after  : after
        },
        tagAttr
    );

}

function gershgorinCirclesWidget(profiler, tagAttributes){

    var oldPresission = widgetSettings.precision;

    widgetSettings.precision = 1;

    var profilerData = normalizeNumbers(profiler.getSteps(), ['index']);

    latexWidget('latex/gershgorinCircles.tex', {steps : profilerData}, tagAttributes);

    widgetSettings.precision = oldPresission;

}

function toTridiagonalWidget(steps){

    var profilerData = normalizeNumbers(steps, [
        'first_index_i', 'index', 'first_index_j', 'second_index_i', 'second_index_j'
    ]);

    include('templates/toTridiagonalTemplate.html', {steps : profilerData});

}

function qrAlgorythmWidget(steps){

    var profilerData = normalizeNumbers(steps, [
        'first_index_i', 'iteration', 'index', 'first_index_j', 'second_index_i', 'second_index_j'
    ]);

    include('templates/qrAlgorythmTemplate.html', {steps : profilerData});

}

function eigenCheckWidget(params, tagAttributes){

    latexWidget(
        'latex/eigenCheck.tex',
        normalizeNumbers(params, ['index']),
        tagAttributes
    );

}