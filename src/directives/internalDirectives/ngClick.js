import $ from 'jquery';
import {
    makeArray
} from './../../../built/controller/common.js';

function recurseObjects(object) {
    let toReturn = makeArray(object);
    for (let ii = 0; ii < object.children().length; ii++) {
        toReturn = toReturn.concat(recurseObjects(angular.element(object.children()[ii])));
    }
    return toReturn;
}
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

            var click = function(scope, locals) {
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
        attachToElement: (controllerService, $element) => {
            const clickData = $element.data('ng-click');
            const myArray = recurseObjects($element);
            for (var index = 0; index < myArray.length; index++) {
                $(myArray[index]).data('ng-click', clickData);
            }

        },
        name: 'ng-click'
    };
}