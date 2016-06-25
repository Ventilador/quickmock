function isArrayLike(item) {
    return Array.isArray(item) ||
        (!!item &&
            typeof item === "object" &&
            item.hasOwnProperty("length") &&
            typeof item.length === "number" &&
            item.length >= 0
        ) ||
        Object.prototype.toString.call(item) === '[object Arguments]';
}

function makeArray(item) {
    if (angular.isString(item)) {
        if (arguments.length > 1) {
            return makeArray(arguments);
        }
        return [item];
    } else if (isArrayLike(item)) {
        return Array.prototype.slice.apply(item);
    } else if (angular.isUndefined(item)) {
        return [];
    }
    throw 'moduleNames format invalid, please provide a single string or an array-like object';
}

function extend() {
    function $$extend(destination, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key) && !destination.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
        return destination;
    }
    const values = Array.prototype.slice.apply(arguments);
    const destination = values.shift();
    let current;
    while (current = values.shift()) {
        $$extend(destination, current);
    }
    return destination;
}

var scopeHelper = (function() {
    let rootScope = angular.injector(['ng']).get('$rootScope');

    function getRootFromScope(scope) {
        if (scope.$root) {
            return scope.$root;
        }
        let parent;
        while (parent = scope.$parent) {
            if (parent.$root) {
                return parent.$root;
            }
        }
        return parent;
    }
    return {
        create: function(scope) {
            scope = scope || {};
            if (scope && getRootFromScope(scope) === getRootFromScope(rootScope)) {
                return scope;
            }
            for (var key in scope) {
                if (scope.hasOwnProperty(key) && key.startsWith('$')) {
                    delete scope[key];
                }
            }

            if (angular.isObject(scope)) {
                return extend(rootScope.$new(true), scope);
            }
            if (isArrayLike(scope)) {
                scope = makeArray(scope);
                return extend.apply(undefined, [rootScope.$new(true)].concat(scope));
            }
        },
        $rootScope: rootScope

    };
})();

function sanitizeModules() {
    modules = makeArray.apply(undefined, arguments);
    let index;
    if (
        (index = modules.indexOf('ng')) === -1 &&
        (index = modules.indexOf('angular')) === -1) {
        modules.unshift('ng');
    }
    if (index !== -1) {
        modules.unshift(modules.splice(index, 1)[0] && 'ng');
    }
    return modules;
}