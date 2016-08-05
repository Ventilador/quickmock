import {
    isArrayLike,
    makeArray
} from './../../controller/common.js';


export function ngModelDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            const subscriptors = [];
            let lastValue;
            let watcher = controllerService.watch(expression, (newValue) => {
                lastValue = newValue;
                subscriptors.forEach((fn) => {
                    fn(lastValue);
                });
            });
            controllerService.controllerScope.$on('$destroy', () => {
                subscriptors.length = 0;
                watcher();
                watcher = undefined;
            });
            if (controllerService.create) {
                controllerService.create();
            }
            const getter = $parse(expression);

            var toReturn = function (parameter) {
                if (arguments.length === 0) {
                    return lastValue;
                } else if (angular.isString(parameter)) {
                    if (arguments.length === 2 && arguments[1] === true) {
                        toReturn(parameter.split(''));
                        return;
                    }
                    getter.assign(controllerService.controllerScope, parameter);
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
        },
        attachToElement: function (controllerService, elem) {
            const model = elem.data('ng-model');
            elem.$text(model());
            model.changes((newValue) => {
                elem.$text(newValue);
            });
        },
        name: 'ng-model'
    };
}