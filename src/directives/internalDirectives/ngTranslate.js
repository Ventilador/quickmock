import {
    isExpression,
    expressionSanitizer
} from './../../controller/common.js';

export function ngTranslateDirective($translate, $parse) {
    let translateService = $translate;
    return {
        compile: function(controllerService, expression) {
            if (controllerService.create) {
                controllerService.create();
            }
            let value,
                key = expression,
                subscriptors = [];
            let watcher;
            controllerService.controllerScope.$on('$destroy', () => {
                while (subscriptors.length) {
                    (subscriptors.shift() || angular.noop)();
                }
                if (angular.isFunction(watcher)) {
                    watcher();
                }
                value = watcher = toReturn = subscriptors = undefined;
            });
            if (isExpression(expression)) {
                expression = expressionSanitizer(expression);
                key = $parse(expression)(controllerService.controllerScope);
                watcher = controllerService.watch(expression, (newValue) => {
                    key = newValue;
                    value = translateService.instant(newValue);
                    subscriptors.forEach((fn) => {
                        fn(value);
                    });
                });
            } else {
                value = translateService.instant(key);
            }
            var toReturn = function() {
                return value;
            };

            toReturn.changeLanguage = function(newLanguage) {
                translateService.use(newLanguage);
                const tempWatcher = controllerService.watch(() => {}, () => {
                    value = translateService.instant(key);
                    tempWatcher();
                    subscriptors.forEach((fn) => {
                        fn(value);
                    });
                });
            };
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
        translate: function(text) {
            return translateService.instant(text);
        },
        changeLanguage: function(newLanguage) {
            translateService.use(newLanguage);
        },
        changeService: function(newService) {
            translateService = newService;
        },
        attachToElement: (controllerService, elem) => {
            const model = elem.data('ng-translate');
            elem.text(model());
            model.changes((newValue) => {
                elem.text(newValue);
            });
        },
        name: 'ng-translate'

    };
}