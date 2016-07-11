export function ngBindDirective() {
    return {
        compile: (controllerService, expression) => {
            const subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            let lastValue;
            let watcher = controllerService.watch(expression, (newValue) => {
                lastValue = newValue;
                subscriptors.forEach((fn) => {
                    fn(newValue);
                });
            });
            var toReturn = function() {
                return lastValue;
            };
            controllerService.controllerScope.$on('$destroy', () => {
                do {
                    (subscriptors.shift() || angular.noop)();
                } while (subscriptors.length);
                watcher();
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
        attachToElement: (controllerService, elem) => {
            const model = elem.data('ng-bind');
            elem.text(model());
            model.changes((newValue) => {
                elem.text(newValue);
            });
        },
        name: 'ng-bind'
    };
}