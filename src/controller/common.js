var controllerHandler = require('./../controllerHandler/controllerHandler.js');

/* Should return true 
 * for objects that wouldn't fail doing
 * Array.prototype.slice.apply(myObj);
 * which returns a new array (reference-wise)
 * Probably needs more specs
 */
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


function createSpy(callback) {
    if (!callback) {
        callback = angular.noop;
    }
    const startTime = new Date().getTime();
    let endTime;
    const toReturn = spyOn({
        a: function() {
            callback.apply(callback, arguments);
            endTime = new Date().getTime();
        }
    }, 'a').and.callThrough();
    toReturn.took = function() {
        return endTime - startTime;
    };
    return toReturn;
}

function makeArray(item) {
    if (arguments.length > 1) {
        return makeArray(arguments);
    } else if (angular.isUndefined(item)) {
        return [];
    } else if (isArrayLike(item)) {
        return Array.prototype.slice.apply(item);
    }
    return [item];
}

function extend() {
    let remove$ = arguments[arguments.length - 1] === false;

    function $$extend(destination, source) {
        for (var key in source) {
            if (remove$ || !key.startsWith('$')) {
                if (source.hasOwnProperty(key) && !destination.hasOwnProperty(key)) {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    }
<<<<<<< HEAD
    var values = Array.prototype.slice.apply(arguments);
    var destination = values.shift() || {};
    var current;
    while ((current = values.shift())) {
=======
    const values = Array.prototype.slice.apply(arguments);
    const destination = values.shift() || {};
    let current;
    while (current = values.shift()) {
>>>>>>> parent of 259f405... Changed let const to var for proteus
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
<<<<<<< HEAD
        var parent;
        while ((parent = scope.$parent)) {
=======
        let parent;
        while (parent = scope.$parent) {
>>>>>>> parent of 259f405... Changed let const to var for proteus
            if (parent.$root) {
                return parent.$root;
            }
        }
        return parent;
    }
    const toReturn = {
        create: function(scope) {
            scope = scope || {};
            if (toReturn.isScope(scope)) {
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
        isScope: function(object) {
            return object && getRootFromScope(object) === getRootFromScope(rootScope) && object;
        },
        $rootScope: rootScope,
        isController: function(object) {
            return object instanceof controllerHandler.controllerType;
        }
    };
    return toReturn;
})();

function getFunctionName(myFunction) {
    const toReturn = /^function\s+([\w\$]+)\s*\(/.exec(myFunction.toString())[1];
    if (toReturn === '' || toReturn === 'anon') {
        return new Date().getTime().toString();
    }
    return toReturn;
}

function sanitizeModules() {
<<<<<<< HEAD
    var modules = makeArray.apply(undefined, arguments);
    var index;
=======
    modules = makeArray.apply(undefined, arguments);
    let index;
>>>>>>> parent of 259f405... Changed let const to var for proteus
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

module.exports = {
    'sanitizeModules': sanitizeModules,
    'getFunctionName': getFunctionName,
    'scopeHelper': scopeHelper,
    'extend': extend,
    'makeArray': makeArray,
    'createSpy': createSpy,
    'isArrayLike': isArrayLike
};