import {
    trim,
    makeArray,
    Tracker
} from './../../controller/common.js';
export function ngClassDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            const subscriptors = [];
            let lastValue = Object.create(null);
            let modifications = { add: [], remove: [] };
            const tracker = new Tracker();
            const getter = $parse(expression);
            const scope = controllerService.controllerScope;
            let newValue;
            let index;
            let currentValue;
            let watcher = controllerService.watch(() => {
                tracker.init();
                modifications.add.length = modifications.remove.length = 0;
                newValue = getter(scope);
                if (angular.isString(newValue)) {
                    modifications.add = newValue.split(' ');
                } else if (angular.isArray(newValue)) {
                    makeArray(newValue).forEach((key) => {
                        Array.prototype.push.apply(modifications.add, key.split(' '));
                    });
                } else if (angular.isObject(newValue)) {
                    for (let key in newValue) {
                        if (newValue.hasOwnProperty(key) && newValue[key]) {
                            Array.prototype.push.apply(modifications.add, key.split(' '));
                        }
                    }
                }
                index = modifications.add.length;
                currentValue = Object.create(null);
                while (index--) {
                    currentValue[modifications.add[index]] = true;
                    if (lastValue[modifications.add[index]]) {
                        delete lastValue[modifications.add[index]];
                    } else {
                        tracker.mutate();
                    }
                }
                for (let key in lastValue) {
                    tracker.mutate();
                    modifications.remove.push(key);
                }
                lastValue = currentValue;
                return tracker.value;
            }, function () {
                subscriptors.forEach((fn) => {
                    fn(modifications);
                });
            });
            controllerService.controllerScope.$on('$destroy', () => {
                watcher();
                subscriptors.length = 0;
            });
            const toReturn = () => {
                if (!lastValue) {
                    return '';
                }
                if (angular.isString(lastValue)) {
                    return lastValue;
                }
                const classes = [];
                Object.keys(lastValue).forEach((key) => {
                    if (lastValue[key]) {
                        classes.push(key);
                    }
                });
                return classes.join(' ');
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
            toReturn.hasClass = (toCheck) => {
                if (angular.isString(lastValue)) {
                    return lastValue.indexOf(trim(toCheck)) !== -1;
                } else if (!lastValue) {
                    return false;
                }
                return !!lastValue[toCheck];
            };
            return toReturn;
        },
        name: 'ng-class',
        attachToElement: function (controllerService, element) {
            element.data('ng-class').changes((modifications) => {
                modifications.remove.forEach((toRemove) => {
                    element.removeClass(toRemove);
                });
                modifications.add.forEach((toRemove) => {
                    element.addClass(toRemove);
                });
            });


        }
    };
}