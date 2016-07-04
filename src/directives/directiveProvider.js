var directiveProvider = (function() {
    const directives = new Map(),
        toReturn = {},
        $parse = angular.injector(['ng']).get('$parse'),
        $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate'),
        SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        internals = {
            ngIf: ngIfDirective(),
            ngClick: ngClickDirective($parse),
            ngBind: ngBindDirective($parse),
            ngDisabled: ngIfDirective(),
            translate: ngTranslateDirective($translate, $parse),
            ngRepeat: {
                regex: '<div></div>',
                compile: function($element) {}
            },
            ngModel: {
                regex: '<input type"text"/>',
                compile: function($element) {}
            },
            translateValue: {

            },
            ngClass: {

            }
        };

    function toCamelCase(name) {
        return name.
        replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }
    toReturn.$get = function $get(directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = toCamelCase(directiveName);
            if (internals[directiveName]) {
                return internals[directiveName];
            }
        }
        const directiveData = directives.get(directiveName);
        return directiveData && directiveData();
    }
    return toReturn;
})();