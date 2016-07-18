'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClickDirective = ngClickDirective;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _common = require('./../../../built/controller/common.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recurseObjects(object) {
    var toReturn = (0, _common.makeArray)(object);
    for (var ii = 0; ii < object.children().length; ii++) {
        toReturn = toReturn.concat(recurseObjects(angular.element(object.children()[ii])));
    }
    return toReturn;
}
function ngClickDirective($parse) {
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
                if (arguments.length === 1) {
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
                (0, _jquery2.default)(myArray[index]).data('ng-click', clickData);
            }
        },
        name: 'ng-click'
    };
}