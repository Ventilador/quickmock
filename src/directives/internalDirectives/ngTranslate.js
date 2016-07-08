module.export = ngTranslateDirective;

function ngTranslateDirective($translate, $parse) {
    return {
        compile: function(expression, controllerService) {
            const subscriptors = [];
            let lastValue;
            if (scopeHelper.isController(controllerService)) {
<<<<<<< HEAD
                if (controllerService.create) {
                    controllerService.create();
                }
                var getter = $parse(expression);
=======
                controllerService.create && controllerService.create();
                const getter = $parse(expression);
>>>>>>> parent of 259f405... Changed let const to var for proteus

                var toReturn = function() {

                };
                toReturn.changeLanguage = function() {
                    $translate.use(newLanguage);
                    controllerService.$apply();
                };
                return toReturn;

            }
            throw 'Could not parse the expression';
        },
        isExpression: function(myText) {
            return isExpression.test(expression);
        },
        translate: function(text) {
            return $translate.instant(text);
        },
        changeLanguage: function(newLanguage) {
            $translate.use(newLanguage);
        }

    };
}