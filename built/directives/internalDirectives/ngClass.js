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
            var lastValue = {};
            var getter = $parse((0, _common.trim)(expression));
            var watcher = controllerService.watch(function () {
                var newValue = getter(controllerService.controllerScope);
                var fireChange = void 0;
                var toNotify = {};
                if (angular.isString(newValue)) {
                    var classes = newValue.split(' ');
                    newValue = {};
                    classes.forEach(function (key) {
                        newValue[key] = true;
                    });
                } else if (angular.isUndefined(newValue)) {
                    newValue = {};
                } else if (angular.isArray(newValue)) {
                    var temp = newValue;
                    newValue = {};
                    temp.forEach(function (key) {
                        newValue[key] = true;
                    });
                }
                for (var key in newValue) {
                    if (newValue.hasOwnProperty(key) && newValue[key] !== lastValue[key]) {
                        toNotify[key] = {
                            old: !!lastValue[key],
                            new: !!newValue[key]
                        };
                        fireChange = true;
                    }
                }
                for (var _key in lastValue) {
                    if (!toNotify.hasOwnProperty(_key) && lastValue.hasOwnProperty(_key) && newValue[_key] !== lastValue[_key]) {
                        toNotify[_key] = {
                            old: !!lastValue[_key],
                            new: !!newValue[_key]
                        };
                        fireChange = true;
                    }
                }
                if (fireChange) {
                    subscriptors.forEach(function (fn) {
                        fn(newValue, toNotify);
                    });
                    lastValue = newValue;
                }
                return lastValue;
            });
            controllerService.controllerScope.$on('$destroy', function () {
                watcher();
                while (subscriptors.length) {
                    subscriptors.shift();
                }
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

            element.data('ng-class').changes(function (lastValue, newChanges) {
                for (var key in newChanges) {
                    if (newChanges.hasOwnProperty(key)) {
                        if (newChanges[key].new === true) {
                            element.addClass(key);
                        } else {
                            element.removeClass(key);
                        }
                    }
                }
            });
        }
    };
}