'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.qmEqDirective = qmEqDirective;
function qmEqDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            var lastValue = function lastValue() {};
            var internalScope = Object.create(null);
            var getter = $parse(expression);
            var internalExp = $parse('value');
            internalScope.expression = expression;
            controllerService.watch(function () {
                if (lastValue !== (lastValue = getter(controllerService.controllerScope))) {
                    internalExp.assign(internalScope, lastValue);
                } else if (lastValue !== (lastValue = internalScope.value)) {
                    getter.assign(controllerService.controllerScope, lastValue);
                }
                return lastValue;
            });
            var toReturn = function toReturn() {
                return internalScope;
            };
            controllerService.controllerScope.$on('$destroy', function () {
                subscriptors.length = 0;
            });
            toReturn.changes = function (callback) {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return function () {
                        var index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        attachToElement: function attachToElement(controllerService, elem) {
            var internalScope = elem.data(controllerService.$$directiveName)();
            elem.data(controllerService.$$directiveName, {
                get: function get() {
                    return internalScope.value;
                },
                set: function set(newValue) {
                    internalScope.value = newValue;
                }
            });
        }
    };
}