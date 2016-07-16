'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngBindDirective = ngBindDirective;
function ngBindDirective() {
    return {
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            var lastValue = void 0;
            var watcher = controllerService.watch(expression, function (newValue) {
                lastValue = newValue;
                subscriptors.forEach(function (fn) {
                    fn(newValue);
                });
            });
            var toReturn = function toReturn() {
                return lastValue;
            };
            controllerService.controllerScope.$on('$destroy', function () {
                while (subscriptors.length) {
                    (subscriptors.shift() || angular.noop)();
                }
                watcher();
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
            var model = elem.data('ng-bind');
            elem.$text(model());
            model.changes(function (newValue) {
                elem.$text(newValue);
            });
        },
        name: 'ng-bind'
    };
}