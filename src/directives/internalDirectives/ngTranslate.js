function ngTranslateDirective($translate, $parse) {
    return {
        compile: function(expression, controllerService) {
            var subscriptors = [];
            var lastValue;
            if (scopeHelper.isController(controllerService)) {
                controllerService.create && controllerService.create();
                var getter = $parse(expression);

                function toReturn() {

                }
                toReturn.changeLanguage = function() {
                    $translate.use(newLanguage);
                    controllerService.$apply();
                }
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