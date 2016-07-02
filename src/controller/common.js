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


function decorateSpy(callback, context) {
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
    let remove$ = arguments[arguments.length - 1] === true;

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
    const values = Array.prototype.slice.apply(arguments);
    const destination = values.shift() || {};
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
        $rootScope: rootScope
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

var HashMap = (function() {
    let counter = 0;

    function hashKey(value) {
        var type = typeof value;
        var uid;
        if (type === 'function' ||
            (type === 'object' && value !== null)) {
            uid = value.$$hashKey;
            if (typeof uid === 'function') {
                uid = value.$$hashKey();
            } else if (uid === undefined) {
                uid = value.$$hashKey = counter++;
            }
        } else {
            uid = value;
        }
        return type + ':' + uid;
    }

    function HashMap() {}
    HashMap.prototype = {
        put: function(key, value) {
            this[hashKey(key)] = value;
        },
        get: function(key) {
            return this[hashKey(key)];
        },
        remove: function(key) {
            key = hashKey(key);
            var value = this[key];
            delete this[key];
            return value;
        }
    };
    return HashMap;
})();