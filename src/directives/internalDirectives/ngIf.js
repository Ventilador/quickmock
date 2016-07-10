console.log('ng.if.js');
export function ngIfDirective() {
    return {
        regex: /ng-if="(.*)"/,
        compile: (controllerService, expression) => {
            const subscriptors = [];
            let lastValue;
            if (controllerService.create) {
                controllerService.create();
            }
            const watcher = controllerService.watch(expression, function() {
                lastValue = arguments[0];
                for (let ii = 0; ii < subscriptors.length; ii++) {
                    subscriptors[ii].apply(subscriptors, arguments);
                }
            });
            controllerService.parentScope.$on('$destroy', function() {
                do {
                    subscriptors.shift()();
                } while (subscriptors.length);
                watcher();
            });
            const toReturn = function(callback) {
                subscriptors.push(callback);
                return function() {
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
            const compiledDirective = $element.data('ng-if');
            let lastValue, parent;
            compiledDirective((newValue) => {
                if (!newValue) {
                    parent = $element.parent();
                    lastValue = $element;
                    $element.remove();
                } else {
                    parent.append(lastValue);
                }
            });
        }
    };
}
console.log('ng.if.js end');