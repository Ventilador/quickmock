'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClickDirective = ngClickDirective;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _common = require('./../../controller/common.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ngClickDirective($parse) {
    return {
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
            (0, _jquery2.default)((0, _common.recurseObjects)($element)).data('ng-click', clickData);
        },
        name: 'ng-click'
    };
}