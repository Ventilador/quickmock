import $ from 'jquery';
import {
    recurseObjects
} from './../../controller/common.js';


export function ngClickDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (controllerService.create) {
                controllerService.create();
            }

            var click = function (scope, locals) {
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
        attachToElement: function (controllerService, $element) {
            const clickData = $element.data('ng-click');
            $(recurseObjects($element)).data('ng-click', clickData);
        },
        name: 'ng-click'
    };
}