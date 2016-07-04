function ngBindDirective($parse) {
    return {
        compile: function(expression, controllerService) {
            const subscriptors = [];
            let lastValue;
            if (scopeHelper.isController(controllerService)) {
                controllerService.create && controllerService.create();
                const getter = $parse(expression);

                function toReturn(parameter) {
                    if (arguments.length === 0) {
                        return getter(controllerService.controllerScope);
                    } else if (angular.isString(parameter)) {
                        if (arguments.length === 2 && arguments[1] === true) {
                            toReturn(parameter.split(''));
                            return;
                        }
                        getter.assign(controllerService.controllerScope, parameter);
                        subscriptors.forEach(function(fn) {
                            fn(parameter);
                        });
                        controllerService.$apply();
                    } else if (isArrayLike(parameter)) {
                        let memory = '';
                        makeArray(parameter).forEach(function(current) {
                            toReturn(memory += current);
                        });
                    } else {
                        throw ['Dont know what to do with ', '["', makeArray(arguments).join('", "'), '"]'].join('');
                    }
                }
                toReturn.changes = function(callback) {
                    if (angular.isFunction(callback)) {
                        subscriptors.push(callback);
                        return function() {
                            const index = subscriptors.indexOf(callback);
                            subscriptors.splice(index, 1);
                        };
                    }
                    throw 'Callback is not a function';
                }
                return toReturn;
            }
            throw 'Error in ngIf';
        }
    }
}