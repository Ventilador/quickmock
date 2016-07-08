module.export = ngClickDirective;

function ngClickDirective($parse) {
    return {
        regex: /ng-click="(.*)"/,
        compile: function(controllerService, expression) {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (scopeHelper.isController(controllerService)) {
                if (controllerService.create) {
                    controllerService.create();
                }

                var click = function(scope, locals) {
                    if (arguments.length == 1) {
                        locals = scope || {};
                        scope = controllerService.controllerScope;
                    } else {
                        scope = scope || controllerService.controllerScope;
                        locals = locals || {};
                    }
                    const result = expression(scope, locals);
                    controllerService.$apply();
                    return result;
                };
                return click;
            }
            throw 'Error in ngClick';
        },
        ApplyToChildren: true
    };
}