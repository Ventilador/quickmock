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
                    subscriptors[ii].apply(subscriptors, arguments);
                }
            });
            controllerService.controllerScope.$on('$destroy', function () {
                do {
                    (subscriptors.shift() || angular.nosop)();
                } while (subscriptors.length);
                watcher();
            });
            var toReturn = function toReturn(callback) {
                subscriptors.push(callback);
                return function () {
                    var index = subscriptors.indexOf(callback);
                    subscriptors.splice(index, 1);
                };
            };
            toReturn.value = function () {
                return lastValue;
            };
            return toReturn;
        },
        attachToElement: function attachToElement(controllerService, $element) {
            var lastValue = void 0,
                parent = $element.parent(),
                compiledDirective = $element.data('ng-if');
            compiledDirective(function (newValue) {
                if (!newValue) {
                    if (parent.children().length === 0) {
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