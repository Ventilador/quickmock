console.log('ng.click.js');
export function ngClickDirective($parse) {
    return {
        regex: /ng-click="(.*)"/,
        compile: (controllerService, expression) => {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (controllerService.create) {
                controllerService.create();
            }

            var click = (scope, locals) => {
                if (arguments.length === 1) {
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
        },
        ApplyToChildren: true
    };
}
console.log('ng.click.js end');