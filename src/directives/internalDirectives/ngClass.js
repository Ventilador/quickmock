import {
    trim,
    makeArray
} from './../../controller/common.js';
export function ngClassDirective() {
    return {
        compile: function(controllerService, expression) {
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            const subscriptors = [];
            let lastValue = {};
            let watcher = controllerService.watch(expression, (newValue) => {
                let fireChange;
                const toNotify = {};
                if (angular.isString(newValue)) {
                    const classes = newValue.split(' ');
                    newValue = {};
                    classes.forEach((key) => {
                        newValue[key] = true;
                    });
                } else if (newValue === undefined || newValue === null) {
                    newValue = {};
                } else if (angular.isArray(newValue)) {
                    const temp = makeArray(newValue);
                    newValue = {};
                    temp.forEach((key) => {
                        key.split(' ').forEach((item) => {
                            newValue[item] = newValue[item] || !!temp[key];
                        });
                    });
                } else if (angular.isObject(newValue)) {
                    const temp = {};
                    for (let key in newValue) {
                        if (newValue.hasOwnProperty(key)) {
                            key.split(' ').forEach((item) => {
                                temp[item] = temp[item] || !!newValue[key];
                            });
                        }
                    }
                    newValue = temp;
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
        attachToElement: function(controllerService, element) {

            element.data('ng-class').changes((lastValue, newChanges) => {
                for (let key in newChanges) {
                    if (newChanges.hasOwnProperty(key)) {
                        if (newChanges[key].new === true) {
                            if (!element.hasClass(key)) {
                                element.addClass(key);
                            }
                        } else {
                            if (element.hasClass(key)) {
                                element.removeClass(key);
                            }
                        }
                    }
                }
            });


        }
    };
}