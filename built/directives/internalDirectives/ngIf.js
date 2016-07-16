'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngIfDirective = ngIfDirective;
function ngIfDirective() {
    return {
        regex: /ng-if="(.*)"/,
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
                while (subscriptors.length) {
                    subscriptors.shift();
                }
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
        attachToElement: function attachToElement(controllerService, $element) {
            var lastValue = void 0,
                parent = $element.parent(),
                compiledDirective = $element.data('ng-if');
            compiledDirective.changes(function (newValue) {
                if (!newValue) {
                    if (parent && parent.children().length === 0) {
                        lastValue = Array.prototype.splice.call($element, 0, $element.length);
                    } else {
                        lastValue = $element;
                        $element.detach();
                    }
                } else {
                    if (parent) {
                        if (Array.isArray(lastValue)) {
                            Array.prototype.push.apply($element, lastValue);
                        } else {
                            parent.append(lastValue);
                        }
                        parent = undefined;
                    }
                }
            });
            controllerService.controllerScope.$on('$destroy', function () {
                lastValue = parent = compiledDirective = undefined;
            });
        },
        name: 'ng-if'
    };
}