import {
    trim
} from './../../controller/common.js';
export function ngClassDirective($parse) {
    return {
        compile: (controllerService, expression) => {
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            const subscriptors = [];
            let lastValue = {};
            const getter = $parse(trim(expression));
            let watcher = controllerService.watch(() => {
                let newValue = getter(controllerService.controllerScope);
                let fireChange;
                const toNotify = {};
                if (angular.isString(newValue)) {
                    const classes = newValue.split(' ');
                    newValue = {};
                    classes.forEach((key) => {
                        newValue[key] = true;
                    });
                } else if (angular.isUndefined(newValue)) {
                    newValue = {};
                } else if (angular.isArray(newValue)) {
                    const temp = newValue;
                    newValue = {};
                    temp.forEach((key) => {
                        newValue[key] = true;
                    });
                }
                for (let key in newValue) {
                    if (newValue.hasOwnProperty(key) && newValue[key] !== lastValue[key]) {
                        toNotify[key] = {
                            old: !!lastValue[key],
                            new: !!newValue[key]
                        };
                        fireChange = true;
                    }
                }
                for (let key in lastValue) {
                    if (!toNotify.hasOwnProperty(key) && lastValue.hasOwnProperty(key) && newValue[key] !== lastValue[key]) {
                        toNotify[key] = {
                            old: !!lastValue[key],
                            new: !!newValue[key]
                        };
                        fireChange = true;
                    }
                }
                if (fireChange) {
                    subscriptors.forEach((fn) => {
                        fn(newValue, toNotify);
                    });
                    lastValue = newValue;
                }
                return lastValue;
            });
            controllerService.controllerScope.$on('$destroy', () => {
                watcher();
                while (subscriptors.length) {
                    subscriptors.shift();
                }
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
        attachToElement: (controllerService, element) => {

            element.data('ng-class').changes((lastValue, newChanges) => {
                for (let key in newChanges) {
                    if (newChanges.hasOwnProperty(key)) {
                        if (newChanges[key].new === true) {
                            element.addClass(key);
                        } else {
                            element.removeClass(key);
                        }
                    }
                }
            });


        }
    };
}