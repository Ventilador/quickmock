'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngTranslateDirective = ngTranslateDirective;

var _common = require('./../../controller/common.js');

console.log('ng.translate.js');
function ngTranslateDirective($translate) {
    return {
        compile: function compile(expression, controllerService) {
            if (controllerService.create) {
                controllerService.create();
            }
            // const getter = $parse(expression);

            var toReturn = function toReturn() {};
            toReturn.changeLanguage = function (newLanguage) {
                $translate.use(newLanguage);
                controllerService.$apply();
            };
            return toReturn;
        },
        isExpression: function isExpression(myText) {
            return _common.isExpression.test(myText);
        },
        translate: function translate(text) {
            return $translate.instant(text);
        },
        changeLanguage: function changeLanguage(newLanguage) {
            $translate.use(newLanguage);
        }

    };
}

console.log('ng.translate.js end');