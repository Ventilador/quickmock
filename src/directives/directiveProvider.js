var directiveProvider = (function() {
    const directives = new Map(),
        toReturn = {},
        SNAKE_CASE_REGEXP = /[A-Z]/g,
        internals = {};

    function snake_case(name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }
    toReturn.$get = function $get(directiveName) {
        if (angular.isString(directiveName)) {
            if (internals[directiveName]) {
                return internals[directiveName];
            }
            directiveName = snake_case(directiveName);
        }
        const directiveData = directives.get(directiveName);
        return directiveData && directiveData();
    }
    return toReturn;
})();