export function qmEqDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            const subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            let lastValue = function(){};
            const internalScope = Object.create(null);
            const getter = $parse(expression);
            const internalExp = $parse('value');
            internalScope.expression = expression;
            controllerService.watch(() => {
                if (lastValue !== (lastValue = getter(controllerService.controllerScope))) {
                    internalExp.assign(internalScope, lastValue);
                } else if (lastValue !== (lastValue = internalScope.value)) {
                    getter.assign(controllerService.controllerScope, lastValue);
                }
                return lastValue;
            });
            var toReturn = function () {
                return internalScope;
            };
            controllerService.controllerScope.$on('$destroy', () => {
                subscriptors.length = 0;
            });
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
            const internalScope = elem.data(controllerService.$$directiveName)();
            elem.data(controllerService.$$directiveName, {
                get: function () {
                    return internalScope.value;
                },
                set: function (newValue) {
                    internalScope.value = newValue;
                }
            });
        }
    };
}