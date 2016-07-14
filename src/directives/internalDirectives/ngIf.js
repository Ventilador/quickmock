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
                    subscriptors[ii].apply(subscriptors, arguments);
                }
            });
            controllerService.controllerScope.$on('$destroy', () => {
                do {
                    (subscriptors.shift() || angular.nosop)();
                } while (subscriptors.length);
                watcher();
            });
            const toReturn = (callback) => {
                subscriptors.push(callback);
                return () => {
                    const index = subscriptors.indexOf(callback);
                    subscriptors.splice(index, 1);
                };
            };
            toReturn.value = function() {
                return lastValue;
            };
            return toReturn;
        },
        attachToElement: (controllerService, $element) => {
            let lastValue,
                parent = $element.parent(),
                compiledDirective = $element.data('ng-if');
            compiledDirective((newValue) => {
                if (!newValue) {
                    if (parent.children().length === 0) {
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