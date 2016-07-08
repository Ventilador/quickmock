'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngIfDirective = ngIfDirective;
console.log('ng.if.js');
function ngIfDirective() {
    return {
        regex: /ng-if="(.*)"/,
        compile: function compile(expression, controllerService) {
            var subscriptors = [];
            var lastValue = void 0;
            if (controllerService.create) {
                controllerService.create();
            }
            var watcher = controllerService.watch(expression, function () {
                lastValue = arguments[0];
                for (var ii = 0; ii < subscriptors.length; ii++) {
                    subscriptors[ii].apply(subscriptors, arguments);
                }
            });
            controllerService.parentScope.$on('$destroy', function () {
                do {
                    subscriptors.shift();
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
        }
    };
}
console.log('ng.if.js end');