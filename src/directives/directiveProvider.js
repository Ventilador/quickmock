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

    toReturn.toCamelCase = function (name) {
        return name.
        replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    };
    toReturn.$get = function (directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = toReturn.toCamelCase(directiveName);
            if (internals[directiveName]) {
                return internals[directiveName];
            }
        }
        return directives.get(directiveName);
    };
    toReturn.$put = function (directiveName, directiveConstructor) {
        if (!angular.isFunction(directiveConstructor)) {
            throw 'directiveConstructor is not a function';
        }
        if (angular.isString(directiveName)) {
            directiveName = toReturn.toCamelCase(directiveName);
        }
        if (directives.has(directiveName)) {
            if (arguments.length === 3 && angular.isFunction(arguments[2]) && arguments[2]() === true) {
                directives.set(directiveName, directiveConstructor());
                console.log(['directive', directiveName, 'has been overwritten'].join(' '));
                return;
            }
            throw 'Cannot overwrite ' + directiveName + '.\nForgeting to clean much';
        }
        directives.set(directiveName, directiveConstructor());
    };
    toReturn.$clean = function() {
        directives.clear();
    }
    
    return toReturn;
})();