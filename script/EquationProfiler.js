function EquationProfiler(){

    var steps = [];
    var action = "none";

    this.newStep = function(data){
        if(data == undefined)
            data = {};

        data['action'] = action;
        steps.push(data);

    };

    this.addToStep = function(data){
        if(steps.length == 0)
            steps.push(data);
        else
            steps.push(mergeObjects(steps.pop(), data));
    };

    this.setAction = function(newAction){
        action = newAction;
    };

    this.getSteps = function(action){

        if(action != undefined){

            var actionSteps = [];

            for(var key in steps)
                if(steps.hasOwnProperty(key))
                    if(steps[key]['action'] == action)
                        actionSteps.push(steps[key]);

            return actionSteps;

        }
        else
            return steps;

    };

    return this;

}