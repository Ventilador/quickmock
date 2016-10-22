import $ from 'jquery';
import {
    recurseObjects
} from './../../controller/common.js';

export function ngDisabledDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            const subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            let lastValue;
            let getter = $parse(expression);
            controllerService.watch(() => {
                if (lastValue !== (lastValue = !!getter(controllerService.controllerScope))) {
                    subscriptors.forEach((fn) => {
                        fn(lastValue);
                    });
                }
            });
            var toReturn = function () {
                return lastValue;
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
            const model = elem.data('ng-disabled');
            model.changes((newValue) => {
                $(recurseObjects(elem)).prop('disabled', newValue);
            });
        },
        name: 'ng-disabled'
    };
}