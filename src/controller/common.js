export var PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
export var EXPRESSION_REGEX = /^{{.*}}$/;
/* Should return true 
 * for objects that wouldn't fail doing
 * Array.prototype.slice.apply(myObj);
 * which returns a new array (reference-wise)
 * Probably needs more specs
 */


const slice = [].slice;
export function getBlockNodes(nodes) {
    // TODO(perf): update `nodes` instead of creating a new object?
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes;

    for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
        if (blockNodes || nodes[i] !== node) {
            if (!blockNodes) {
                blockNodes = angular.element(slice.call(nodes, 0, i));
            }
            blockNodes.push(node);
        }
    }

    return blockNodes || nodes;
}

var uid = 0;
const nextUid = function() {
    return ++uid;
};

export function hashKey(obj, nextUidFn) {
    let key = obj && obj.$$hashKey;
    if (key) {
        if (typeof key === 'function') {
            key = obj.$$hashKey();
        }
        return key;
    }
    const objType = typeof obj;
    if (objType === 'function' || (objType === 'object' && obj !== null)) {
        key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
    } else {
        key = objType + ':' + obj;
    }
    return key;
}

export function createMap() {
    return Object.create(null);
}

export function shallowCopy(src, dst) {
    if (angular.isArray(src)) {
        dst = dst || [];

        for (var i = 0, ii = src.length; i < ii; i++) {
            dst[i] = src[i];
        }
    } else if (angular.isObject(src)) {
        dst = dst || {};

        for (var key in src) {
            if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                dst[key] = src[key];
            }
        }
    }

    return dst || src;
}
export function isArrayLike(item) {
    return Array.isArray(item) ||
        (!!item &&
            typeof item === "object" &&
            item.hasOwnProperty("length") &&
            typeof item.length === "number" &&
            item.length >= 0
        ) ||
        Object.prototype.toString.call(item) === '[object Arguments]';
}

export function trim(value) {
    value = value || '';
    return value.trim();
}


export function isExpression(value) {
    return EXPRESSION_REGEX.test(trim(value));
}

export function expressionSanitizer(expression) {
    expression = expression.trim();
    return expression.substring(2, expression.length - 2);
}

export function assertNotDefined(obj, args) {

    let key;
    while (key = args.shift()) {
        if (typeof obj[key] === 'undefined' || obj[key] === null) {
            throw ['"', key, '" property cannot be null'].join("");
        }
    }
}

export function assert_$_CONTROLLER(obj) {
    assertNotDefined(obj, [
        'parentScope',
        'bindings',
        'controllerScope'
    ]);
}

export function clean(object) {
    if (isArrayLike(object)) {
        for (var index = object.length - 1; index >= 0; index--) {
            if (object.hasOwnProperty(index)) {
                Array.prototype.splice.apply(object, [index, 1]);
            }
        }
    } else if (angular.isObject(object)) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                object[key] = undefined;
            }
        }
    }
}

export function createSpy(callback) {
    if (!callback) {
        callback = angular.noop;
    }
    const startTime = new Date().getTime();
    let endTime;
    const toReturn = spyOn({
        a: () => {
            callback.apply(callback, arguments);
            endTime = new Date().getTime();
        }
    }, 'a').and.callThrough();
    toReturn.took = () => {
        return endTime - startTime;
    };
    return toReturn;
}

export function shift(array) {
    return Array.prototype.shift.call(array);
}

export function splice(array, start, count, newItems) {
    if (newItems) {
        Array.prototype.splice.call(array, start, count, newItems);
    } else {
        return Array.prototype.splice.call(array, start, count);
    }
}

export function makeArray(item) {
    if (arguments.length > 1) {
        return makeArray(arguments);
    } else if (angular.isUndefined(item)) {
        return [];
    } else if (isArrayLike(item)) {
        return Array.prototype.slice.apply(item);
    }
    return [item];
}

export function extend() {
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

    const values = Array.prototype.slice.apply(arguments);
    const destination = values.shift() || {};
    let current;
    while (current = values.shift()) {
        $$extend(destination, current);
    }
    return destination;
}



const rootScope = angular.injector(['ng']).get('$rootScope');

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

export class scopeHelper {
    static decorateScopeCounter(scope) {
        scope.$$digestCount = 0;
        scope.$$postDigest(() => {
            scope.$$digestCount++;
        });
        return scope;
    }
    static create(scope) {
        scope = scope || {};
        if (this.isScope(scope)) {
            return scopeHelper.decorateScopeCounter(scope);
        }
        for (var key in scope) {
            if (scope.hasOwnProperty(key) && key.startsWith('$')) {
                delete scope[key];
            }
        }

        if (angular.isObject(scope)) {
            return scopeHelper.decorateScopeCounter(extend(scopeHelper.$rootScope.$new(true), scope));
        }
        if (isArrayLike(scope)) {
            scope = makeArray(scope);
            return scopeHelper.decorateScopeCounter(extend.apply(undefined, [scopeHelper.$rootScope.$new(true)].concat(scope)));
        }

    }
    static isScope(object) {
        return object && getRootFromScope(object) === getRootFromScope(scopeHelper.$rootScope) && object;
    }
}
scopeHelper.$rootScope = rootScope;

export function getFunctionName(myFunction) {
    const toReturn = /^function\s+([\w\$]+)\s*\(/.exec(myFunction.toString())[1];
    if (toReturn === '' || toReturn === 'anon') {
        return new Date().getTime().toString();
    }
    return toReturn;
}

export function sanitizeModules() {

    const modules = makeArray.apply(undefined, arguments);
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
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
export function toCamelCase(name) {
    return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    });
}
export function toSnakeCase(value, key) {
    key = key || '-';
    return value.replace(/([A-Z])/g, function($1) {
        return key + $1.toLowerCase();
    });
}