export function ngIfDirective() {
    return {
        regex: /ng-if="(.*)"/,
        compile: (controllerService, expression) => {
            let lastValue;
            if (controllerService.create) {
                controllerService.create();
            }
            const subscriptors = [];
            const watcher = controllerService.watch(expression, function() {
                lastValue = arguments[0];
                for (let ii = 0; ii < subscriptors.length; ii++) {
                    subscriptors[ii].apply(controllerService.controllerScope, arguments);
                }
            });
            controllerService.controllerScope.$on('$destroy', () => {
                watcher();
                while (subscriptors.length) {
                    subscriptors.shift();
                }
            });
            const toReturn = function() {
                return lastValue;
            };
            toReturn.changes = (callback) => {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return () => {
                        const index = subscriptors.indexOf(callback);
                        if (index !== -1) {
                            subscriptors.splice(index, 1);
                        }
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        attachToElement: (controllerService, $element) => {
            let lastValue,
                parent = $element.parent(),
                compiledDirective = $element.data('ng-if');
            compiledDirective.changes((newValue) => {
                if (!newValue) {
                    if (parent && parent.children().length === 0) {
                        lastValue = Array.prototype.splice.call($element, 0, $element.length);
                    } else {
                        lastValue = $element;
                        $element.detach();
                    }
                } else {
                    if (parent) {
                        if (Array.isArray(lastValue)) {
                            Array.prototype.push.apply($element, lastValue);
                        } else {
                            parent.append(lastValue);
                        }
                        parent = undefined;
                    }
                }
            });
            controllerService.controllerScope.$on('$destroy', () => {
                lastValue = parent = compiledDirective = undefined;
            });
        },
        name: 'ng-if'
    };
}