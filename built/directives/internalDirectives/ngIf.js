'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngIfDirective = ngIfDirective;

var _common = require('./../../controller/common.js');

function ngIfDirective() {
    return {
        transclude: true,
        compile: function compile(controllerService, expression) {
            var lastValue = void 0;
            if (controllerService.create) {
                controllerService.create();
            }
            var subscriptors = [];
            var watcher = controllerService.watch(expression, function () {
                lastValue = arguments[0];
                for (var ii = 0; ii < subscriptors.length; ii++) {
                    subscriptors[ii].apply(controllerService.controllerScope, arguments);
                }
            });
            controllerService.controllerScope.$on('$destroy', function () {
                watcher();
                subscriptors.length = 0;
            });
            var toReturn = function toReturn() {
                return lastValue;
            };
            toReturn.changes = function (callback) {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return function () {
                        var index = subscriptors.indexOf(callback);
                        if (index !== -1) {
                            subscriptors.splice(index, 1);
                        }
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        attachToElement: function attachToElement(controllerService, $element, transclude, $animate) {
            var currentScope = void 0,
                compiledDirective = $element.data('ng-if');
            compiledDirective.changes(function (newValue) {
                if (!newValue) {
                    if (currentScope) {
                        currentScope.$destroy();
                    }
                    $animate.leave((0, _common.getBlockNodes)($element));
                } else {
                    transclude(function (clone, newScope) {
                        currentScope = newScope;
                        $element = clone;
                        $animate.enter(clone);
                    });
                }
            });
            controllerService.controllerScope.$on('$destroy', function () {
                currentScope = compiledDirective = undefined;
            });
        },
        name: 'ng-if'
    };
}