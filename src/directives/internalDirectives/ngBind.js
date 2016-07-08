console.log('ng.bind.js');

import {
    isArrayLike,
    makeArray
} from './../../controller/common.js';


export function ngBindDirective($parse) {
    return {
        compile: (controllerService, expression) => {
            const subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            const getter = $parse(expression);

            var toReturn = function(parameter) {
                if (arguments.length === 0) {
                    return getter(controllerService.controllerScope);
                } else if (angular.isString(parameter)) {
                    if (arguments.length === 2 && arguments[1] === true) {
                        toReturn(parameter.split(''));
                        return;
                    }
                    getter.assign(controllerService.controllerScope, parameter);
                    subscriptors.forEach((fn) => {
                        fn(parameter);
                    });
                    controllerService.$apply();
                } else if (isArrayLike(parameter)) {
                    let memory = '';
                    makeArray(parameter).forEach((current) => {
                        toReturn(memory += current);
                    });
                } else {
                    throw ['Dont know what to do with ', '["', makeArray(arguments).join('", "'), '"]'].join('');
                }
            };
            toReturn.changes = (callback) => {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return () => {
                        const index = subscriptors.indexOf(callback);
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