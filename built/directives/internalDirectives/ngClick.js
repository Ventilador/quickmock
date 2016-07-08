'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClickDirective = ngClickDirective;
console.log('ng.click.js');
function ngClickDirective($parse) {
    var _arguments = arguments;

    return {
        regex: /ng-click="(.*)"/,
        compile: function compile(controllerService, expression) {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (controllerService.create) {
                controllerService.create();
            }

            var click = function click(scope, locals) {
                if (_arguments.length === 1) {
                    locals = scope || {};
                    scope = controllerService.controllerScope;
                } else {
                    scope = scope || controllerService.controllerScope;
                    locals = locals || {};
                }
                var result = expression(scope, locals);
                controllerService.$apply();
                return result;
            };
            return click;
        },
        ApplyToChildren: true
    };
}
console.log('ng.click.js end');