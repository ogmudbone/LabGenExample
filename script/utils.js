function mergeObjects(obj1, obj2){

    var newObject = {};

    for (var key in obj1)
        newObject[key] = obj1[key];

    for (key in obj2)
        newObject[key] = obj2[key];

    return newObject;

}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function tagAttributesBuilder(attributes){

    if(attributes == undefined)
        return "";

    var attrString = "";

    for(var key in attributes)
        if(attributes.hasOwnProperty(key))
            attrString += key + '=' + '"' + attributes[key] + '" ';

    return attrString;

}

function var_dump(){

    for(var key in arguments)
        if(arguments.hasOwnProperty(key))
            echo(JSON.stringify(arguments[key]) + "\n");

}