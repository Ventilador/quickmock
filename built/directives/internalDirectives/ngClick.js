'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClickDirective = ngClickDirective;

var _common = require('./../../../built/controller/common.js');

function recurseObjects(object) {
    var toReturn = (0, _common.makeArray)(object);
    for (var ii = 0; ii < object.children().length; ii++) {
        toReturn = toReturn.concat(recurseObjects(angular.element(object.children()[ii])));
    }
    return toReturn;
}
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
        attachToElement: function attachToElement(controllerService, $element) {
            var clickData = $element.data('ng-click');
            var myArray = recurseObjects($element);
            for (var index = 0; index < myArray.length; index++) {
                angular.element(myArray[index]).data('ng-click', clickData);
            }
        },
        name: 'ng-click'
    };
}