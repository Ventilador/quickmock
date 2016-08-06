'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClassDirective = ngClassDirective;

var _common = require('./../../controller/common.js');

function ngClassDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            var subscriptors = [];
            var lastValue = Object.create(null);
            var modifications = { add: [], remove: [] };
            var tracker = new _common.Tracker();
            var getter = $parse(expression);
            var scope = controllerService.controllerScope;
            var newValue = void 0;
            var index = void 0;
            var currentValue = void 0;
            var watcher = controllerService.watch(function () {
                tracker.init();
                modifications.add.length = modifications.remove.length = 0;
                newValue = getter(scope);
                if (angular.isString(newValue)) {
                    modifications.add = newValue.split(' ');
                } else if (angular.isArray(newValue)) {
                    (0, _common.makeArray)(newValue).forEach(function (key) {
                        Array.prototype.push.call(modifications.add, key.split(' '));
                    });
                } else if (angular.isObject(newValue)) {
                    for (var key in newValue) {
                        if (newValue.hasOwnProperty(key) && newValue[key]) {
                            Array.prototype.push.call(modifications.add, key.split(' '));
                        }
                    }
                }
                index = modifications.add.length;
                currentValue = Object.create(null);
                while (index--) {
                    currentValue[modifications.add[index]] = true;
                    if (lastValue[modifications.add[index]]) {
                        delete lastValue[modifications.add[index]];
                    } else {
                        tracker.mutate();
                    }
                }
                for (var _key in lastValue) {
                    tracker.mutate();
                    modifications.remove.push(_key);
                }
                lastValue = currentValue;
                return tracker.value;
            }, function () {
                subscriptors.forEach(function (fn) {
                    fn(modifications);
                });
            });
            controllerService.controllerScope.$on('$destroy', function () {
                watcher();
                subscriptors.length = 0;
            });
            var toReturn = function toReturn() {
                if (!lastValue) {
                    return '';
                }
                if (angular.isString(lastValue)) {
                    return lastValue;
                }
                var classes = [];
                Object.keys(lastValue).forEach(function (key) {
                    if (lastValue[key]) {
                        classes.push(key);
                    }
                });
                return classes.join(' ');
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
            toReturn.hasClass = function (toCheck) {
                if (angular.isString(lastValue)) {
                    return lastValue.indexOf((0, _common.trim)(toCheck)) !== -1;
                } else if (!lastValue) {
                    return false;
                }
                return !!lastValue[toCheck];
            };
            return toReturn;
        },
        name: 'ng-class',
        attachToElement: function attachToElement(controllerService, element) {
            element.data('ng-class').changes(function (modifications) {
                modifications.remove.forEach(function (toRemove) {
                    element.removeClass(toRemove);
                });
                modifications.add.forEach(function (toRemove) {
                    element.addClass(toRemove);
                });
            });
        }
    };
}