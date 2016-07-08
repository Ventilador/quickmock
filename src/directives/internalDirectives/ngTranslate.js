console.log('ng.translate.js');
import {
    isExpression
} from './../../controller/common.js';

export function ngTranslateDirective($translate) {
    return {
        compile: function(expression, controllerService) {
            if (controllerService.create) {
                controllerService.create();
            }
            // const getter = $parse(expression);

            var toReturn = function() {

            };
            toReturn.changeLanguage = function(newLanguage) {
                $translate.use(newLanguage);
                controllerService.$apply();
            };
            return toReturn;

        },
        isExpression: function(myText) {
            return isExpression.test(myText);
        },
        translate: function(text) {
            return $translate.instant(text);
        },
        changeLanguage: function(newLanguage) {
            $translate.use(newLanguage);
        }

    };
}

console.log('ng.translate.js end');