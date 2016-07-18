'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClassDirective = ngClassDirective;

var _common = require('./../../controller/common.js');

function ngClassDirective() {
    return {
        compile: function compile(controllerService, expression) {
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            var subscriptors = [];
            var lastValue = {};
            var watcher = controllerService.watch(expression, function (newValue) {
                var fireChange = void 0;
                var toNotify = {};
                if (angular.isString(newValue)) {
                    var classes = newValue.split(' ');
                    newValue = {};
                    classes.forEach(function (key) {
                        newValue[key] = true;
                    });
                } else if (newValue === undefined || newValue === null) {
                    newValue = {};
                } else if (angular.isArray(newValue)) {
                    (function () {
                        var temp = (0, _common.makeArray)(newValue);
                        newValue = {};
                        temp.forEach(function (key) {
                            key.split(' ').forEach(function (item) {
                                newValue[item] = newValue[item] || !!temp[key];
                            });
                        });
                    })();
                } else if (angular.isObject(newValue)) {
                    (function () {
                        var temp = {};

                        var _loop = function _loop(key) {
                            if (newValue.hasOwnProperty(key)) {
                                key.split(' ').forEach(function (item) {
                                    temp[item] = temp[item] || !!newValue[key];
                                });
                            }
                        };

                        for (var key in newValue) {
                            _loop(key);
                        }
                        newValue = temp;
                    })();
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
                            if (!element.hasClass(key)) {
                                element.addClass(key);
                            }
                        } else {
                            if (element.hasClass(key)) {
                                element.removeClass(key);
                            }
                        }
                    }
                }
            });
        }
    };
}