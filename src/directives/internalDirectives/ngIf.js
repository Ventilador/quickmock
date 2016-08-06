import {getBlockNodes} from './../../controller/common.js';
export function ngIfDirective() {
    return {
        transclude: true,
        compile: function (controllerService, expression) {
            let lastValue;
            if (controllerService.create) {
                controllerService.create();
            }
            const subscriptors = [];
            const watcher = controllerService.watch(expression, function () {
                lastValue = arguments[0];
                for (let ii = 0; ii < subscriptors.length; ii++) {
                    subscriptors[ii].apply(controllerService.controllerScope, arguments);
                }
            });
            controllerService.controllerScope.$on('$destroy', () => {
                watcher();
                subscriptors.length = 0;
            });
            const toReturn = function () {
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
        attachToElement: function (controllerService, $element, transclude, $animate) {
            let currentScope,
                compiledDirective = $element.data('ng-if');
            compiledDirective.changes((newValue) => {
                if (!newValue) {
                    if (currentScope) {
                        currentScope.$destroy();
                    }
                    $animate.leave(getBlockNodes($element));
                } else {
                    transclude(function (clone, newScope) {
                        currentScope = newScope;
                        $element = clone;
                        $animate.enter(clone);
                    });

                }
            });
            controllerService.controllerScope.$on('$destroy', () => {
                currentScope = compiledDirective = undefined;
            });
        },
        name: 'ng-if'
    };
}