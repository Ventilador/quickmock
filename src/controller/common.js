export var PARSE_BINDING_REGEX = /^([\=\@\&<])(\?)?(.*)?$/;
export var EXPRESSION_REGEX = /^{{.*}}$/;
/* Should return true 
 * for objects that wouldn't fail doing
 * Array.prototype.slice.apply(myObj);
 * which returns a new array (reference-wise)
 * Probably needs more specs
 */

const defaultModules = ['ng', 'pascalprecht.translate'];
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
const nextUid = function () {
    return ++uid;
};

export function isSameComment(node, supposedComment) {
    return node && supposedComment &&
        node.nodeName === '#comment' &&
        supposedComment.length === 1 &&
        supposedComment[0].nodeName === node.nodeName &&
        node.nodeValue === supposedComment[0].nodeValue;
}

export function emptyObject(object) {
    if (isArrayLike(object)) {
        Array.prototype.splice.call(object, 0, object.length);
    }
}

function getArgs(func) {
    // First match everything inside the function argument parens.
    var args = func.toString().match(/(?:function)?(?:\s[^(]*)?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}

export function annotate(fn) {
    const args = getArgs(fn);
    const inj = {};
    for (var ii = 0; ii < args.length; ii++) {
        inj[args[ii]] = args[ii];
    }
    return {
        injections: inj,
        fn: fn
    };
}

export function compile(fnObj, $parse) {
    const injections = [];
    let fn;
    if (Array.isArray(fnObj)) {
        fn = fnObj.shift();
        if (typeof fn !== 'function') {
            throw 'fn is not a function';
        }
        while (fnObj.length) {
            const tempInjection = fnObj.shift();
            if (typeof tempInjection !== 'string') {
                throw 'injection is not string';
            }
            injections.unshift(tempInjection);
        }
    } else if (typeof fnObj === 'object') {
        const args = getArgs(fn = fnObj.fn);
        for (let ii = 0; ii < args.length; ii++) {
            injections.push(fnObj.injections[args[ii]]);
            if (typeof args[ii] !== 'string') {
                throw 'injection is not string';
            }
        }
    }

    const argsGetter = $parse(['[', injections.join(', '), ']'].join(''));
    let constructedFn;
    /* jshint ignore:start */
    constructedFn = Function('s', 'l', 'a', 'fn', [
        'var args = a(s,l);',
        'return fn.apply(s, args);'
    ].join('\r\n')
    );
    /* jshint ignore:end */
    return function (scope, locals) {
        return constructedFn(scope, locals, argsGetter, fn);
    };
}

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


export function recurseObjects(object) {
    let toReturn = makeArray(object);
    for (let ii = 0; ii < object.children().length; ii++) {
        toReturn = toReturn.concat(recurseObjects(angular.element(object.children()[ii])));
    }
    return toReturn;
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

export class QMAngular {
    static loadModules() {
        let modules;
        if (arguments.length === 1 && isArrayLike(arguments[0])) {
            modules = slice.call(arguments[0]);
        } else {
            modules = slice.call(arguments);
        }
        QMAngular.injector = angular.injector(QMAngular.usedModules = defaultModules.concat(modules));
        if (QMAngular.$rootScope) {
            QMAngular.$rootScope.$destroy();
        }
        QMAngular.$rootScope = QMAngular.injector.get('$rootScope');
    }
    static getService(name) {
        return QMAngular.injector.get(name);
    }
    static invoke(fn) {
        if (typeof fn === 'function') {
            fn = QMAngular.injector.annotate(fn);
        }
        return QMAngular.injector.invoke(fn);
    }
    static create(scope) {
        scope = scope || {};
        if (this.isScope(scope)) {
            return scope;
        }
        for (var key in scope) {
            if (scope.hasOwnProperty(key) && key.startsWith('$')) {
                delete scope[key];
            }
        }

        if (angular.isObject(scope)) {
            return extend(QMAngular.$rootScope.$new(true), scope);
        }
        if (isArrayLike(scope)) {
            scope = makeArray(scope);
            return extend.apply(undefined, [QMAngular.$rootScope.$new(true)].concat(scope));
        }

    }
    static isScope(object) {
        return object && getRootFromScope(object) === getRootFromScope(QMAngular.$rootScope) && object;
    }
}
// QMAngular.injector = angular.injector(defaultModules);

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
        replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
}
export function toSnakeCase(value, key) {
    key = key || '-';
    return value.replace(/([A-Z])/g, function ($1) {
        return key + $1.toLowerCase();
    });
}

export function Tracker() {
    this.value = 0;
    this.lastvalue = this.value;
    this.mutate = undefined;
}
Tracker.prototype = {
    add: function () {
        this.value++;
    },
    sub: function () {
        this.value--;
    },
    init: function () {
        this.lastvalue = this.value;
        if (this.value > 0) {
            this.mutate = this.sub;
        } else {
            this.mutate = this.add;
        }
    }
};
