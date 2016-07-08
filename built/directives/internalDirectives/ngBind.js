'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngBindDirective = ngBindDirective;

var _common = require('./../../controller/common.js');

console.log('ng.bind.js');

function ngBindDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            var getter = $parse(expression);

            var toReturn = function toReturn(parameter) {
                if (arguments.length === 0) {
                    return getter(controllerService.controllerScope);
                } else if (angular.isString(parameter)) {
                    if (arguments.length === 2 && arguments[1] === true) {
                        toReturn(parameter.split(''));
                        return;
                    }
                    getter.assign(controllerService.controllerScope, parameter);
                    subscriptors.forEach(function (fn) {
                        fn(parameter);
                    });
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
        }
    };
}
console.log('ng.bind.js end');