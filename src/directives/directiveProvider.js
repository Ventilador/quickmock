var directiveProvider = (function() {
    const directives = new Map(),
        toReturn = {},
        $parse = angular.injector(['ng']).get('$parse'),
        SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        internals = {
            ngIf: ngIfDirective(),
            ngClick: ngClickDirective($parse),
            ngRepeat: {
                regex: '<div></div>',
                compile: function($element) {}
            },
            ngDisabled: {
                regex: '<div></div>',
                compile: function($element) {}
            },
            ngBind: {
                regex: '<div></div>',
                compile: function($element) {}
            },

            ngModel: {
                regex: '<input type"text"/>',
                compile: function($element) {}
            },
            translate: {

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