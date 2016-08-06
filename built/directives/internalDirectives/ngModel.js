'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngModelDirective = ngModelDirective;

var _common = require('./../../controller/common.js');

function ngModelDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            var lastValue = void 0;
            var watcher = controllerService.watch(expression, function (newValue) {
                lastValue = newValue;
                subscriptors.forEach(function (fn) {
                    fn(lastValue);
                });
            });
            controllerService.controllerScope.$on('$destroy', function () {
                subscriptors.length = 0;
                watcher();
                watcher = undefined;
            });
            if (controllerService.create) {
                controllerService.create();
            }
            var getter = $parse(expression);

            var toReturn = function toReturn(parameter) {
                if (arguments.length === 0) {
                    return lastValue;
                } else if (angular.isString(parameter)) {
                    if (arguments.length === 2 && arguments[1] === true) {
                        toReturn(parameter.split(''));
                        return;
                    }
                    getter.assign(controllerService.controllerScope, parameter);
                    controllerService.$apply();
                } else if ((0, _common.isArrayLike)(parameter)) {
                    var memory = '';
                    (0, _common.makeArray)(parameter).forEach(function (current) {
                        toReturn(memory += current);
                    });
                } else {
                    throw ['Dont know what to do with ', '["', (0, _common.makeArray)(arguments).join('", "'), '"]'].join('');
                }
            };

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
            var model = elem.data('ng-model');
            elem.$text(model());
            model.changes(function (newValue) {
                elem.$text(newValue);
            });
        },
        name: 'ng-model'
    };
}