'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngTranslateDirective = ngTranslateDirective;

var _common = require('./../../controller/common.js');

function ngTranslateDirective($translate, $parse) {
    var translateService = $translate;
    return {
        compile: function compile(controllerService, expression) {
            if (controllerService.create) {
                controllerService.create();
            }
            var value = void 0,
                key = expression,
                subscriptors = [];
            var watcher = void 0;
            controllerService.controllerScope.$on('$destroy', function () {
                while (subscriptors.length) {
                    (subscriptors.shift() || angular.noop)();
                }
                if (angular.isFunction(watcher)) {
                    watcher();
                }
                value = watcher = toReturn = subscriptors = undefined;
            });
            if ((0, _common.isExpression)(expression)) {
                expression = (0, _common.expressionSanitizer)(expression);
                key = $parse(expression)(controllerService.controllerScope);
                watcher = controllerService.watch(expression, function (newValue) {
                    key = newValue;
                    value = translateService.instant(newValue);
                    subscriptors.forEach(function (fn) {
                        fn(value);
                    });
                });
            } else {
                watcher = controllerService.watch(function () {
                    value = translateService.instant(key);
                    watcher();
                    watcher = undefined;
                    subscriptors.forEach(function (fn) {
                        fn(value);
                    });
                });
            }
            var toReturn = function toReturn() {
                return value;
            };

            toReturn.changeLanguage = function (newLanguage) {
                translateService.use(newLanguage);
                var tempWatcher = controllerService.watch(function () {}, function () {
                    value = translateService.instant(key);
                    tempWatcher();
                    subscriptors.forEach(function (fn) {
                        fn(value);
                    });
                });
            };
            toReturn.changes = function (callback) {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return function () {
                        var index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        translate: function translate(text) {
            return translateService.instant(text);
        },
        changeLanguage: function changeLanguage(newLanguage) {
            translateService.use(newLanguage);
        },
        changeService: function changeService(newService) {
            translateService = newService;
        },
        attachToElement: function attachToElement(controllerService, elem) {
            var model = elem.data('ng-translate');
            elem.$text(model());
            model.changes(function (newValue) {
                elem.$text(newValue);
            });
        },
        name: 'ng-translate'

    };
}