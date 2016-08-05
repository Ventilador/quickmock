'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.getBlockNodes = getBlockNodes;
exports.hashKey = hashKey;
exports.createMap = createMap;
exports.shallowCopy = shallowCopy;
exports.isArrayLike = isArrayLike;
exports.trim = trim;
exports.isExpression = isExpression;
exports.expressionSanitizer = expressionSanitizer;
exports.assertNotDefined = assertNotDefined;
exports.assert_$_CONTROLLER = assert_$_CONTROLLER;
exports.clean = clean;
exports.createSpy = createSpy;
exports.shift = shift;
exports.splice = splice;
exports.makeArray = makeArray;
exports.extend = extend;
exports.getFunctionName = getFunctionName;
exports.sanitizeModules = sanitizeModules;
exports.toCamelCase = toCamelCase;
exports.toSnakeCase = toSnakeCase;
exports.Tracker = Tracker;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PARSE_BINDING_REGEX = exports.PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var EXPRESSION_REGEX = exports.EXPRESSION_REGEX = /^{{.*}}$/;
/* Should return true 
 * for objects that wouldn't fail doing
 * Array.prototype.slice.apply(myObj);
 * which returns a new array (reference-wise)
 * Probably needs more specs
 */

var slice = [].slice;
function getBlockNodes(nodes) {
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
var nextUid = function nextUid() {
    return ++uid;
};

function hashKey(obj, nextUidFn) {
    var key = obj && obj.$$hashKey;
    if (key) {
        if (typeof key === 'function') {
            key = obj.$$hashKey();
        }
        return key;
    }
    var objType = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    if (objType === 'function' || objType === 'object' && obj !== null) {
        key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
    } else {
        key = objType + ':' + obj;
    }
    return key;
}

function createMap() {
    return Object.create(null);
}

function shallowCopy(src, dst) {
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
function isArrayLike(item) {
    return Array.isArray(item) || !!item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && item.hasOwnProperty("length") && typeof item.length === "number" && item.length >= 0 || Object.prototype.toString.call(item) === '[object Arguments]';
}

function trim(value) {
    value = value || '';
    return value.trim();
}

function isExpression(value) {
    return EXPRESSION_REGEX.test(trim(value));
}

function expressionSanitizer(expression) {
    expression = expression.trim();
    return expression.substring(2, expression.length - 2);
}

function assertNotDefined(obj, args) {

    var key = void 0;
    while (key = args.shift()) {
        if (typeof obj[key] === 'undefined' || obj[key] === null) {
            throw ['"', key, '" property cannot be null'].join("");
        }
    }
}

function assert_$_CONTROLLER(obj) {
    assertNotDefined(obj, ['parentScope', 'bindings', 'controllerScope']);
}

function clean(object) {
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

function createSpy(callback) {
    var _arguments = arguments;

    if (!callback) {
        callback = angular.noop;
    }
    var startTime = new Date().getTime();
    var endTime = void 0;
    var toReturn = spyOn({
        a: function a() {
            callback.apply(callback, _arguments);
            endTime = new Date().getTime();
        }
    }, 'a').and.callThrough();
    toReturn.took = function () {
        return endTime - startTime;
    };
    return toReturn;
}

function shift(array) {
    return Array.prototype.shift.call(array);
}

function splice(array, start, count, newItems) {
    if (newItems) {
        Array.prototype.splice.call(array, start, count, newItems);
    } else {
        return Array.prototype.splice.call(array, start, count);
    }
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
    var remove$ = arguments[arguments.length - 1] === false;

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

    var values = Array.prototype.slice.apply(arguments);
    var destination = values.shift() || {};
    var current = void 0;
    while (current = values.shift()) {
        $$extend(destination, current);
    }
    return destination;
}

var rootScope = angular.injector(['ng']).get('$rootScope');

function getRootFromScope(scope) {
    if (scope.$root) {
        return scope.$root;
    }

    var parent = void 0;
    while (parent = scope.$parent) {
        if (parent.$root) {
            return parent.$root;
        }
    }
    return parent;
}

var scopeHelper = exports.scopeHelper = function () {
    function scopeHelper() {
        _classCallCheck(this, scopeHelper);
    }

    _createClass(scopeHelper, null, [{
        key: 'decorateScopeCounter',
        value: function decorateScopeCounter(scope) {
            scope.$$digestCount = 0;
            scope.$$postDigest(function () {
                scope.$$digestCount++;
            });
            return scope;
        }
    }, {
        key: 'create',
        value: function create(scope) {
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
    }, {
        key: 'isScope',
        value: function isScope(object) {
            return object && getRootFromScope(object) === getRootFromScope(scopeHelper.$rootScope) && object;
        }
    }]);

    return scopeHelper;
}();

scopeHelper.$rootScope = rootScope;

function getFunctionName(myFunction) {
    var toReturn = /^function\s+([\w\$]+)\s*\(/.exec(myFunction.toString())[1];
    if (toReturn === '' || toReturn === 'anon') {
        return new Date().getTime().toString();
    }
    return toReturn;
}

function sanitizeModules() {

    var modules = makeArray.apply(undefined, arguments);
    var index = void 0;
    if ((index = modules.indexOf('ng')) === -1 && (index = modules.indexOf('angular')) === -1) {
        modules.unshift('ng');
    }
    if (index !== -1) {
        modules.unshift(modules.splice(index, 1)[0] && 'ng');
    }
    return modules;
}
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
function toCamelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    });
}
function toSnakeCase(value, key) {
    key = key || '-';
    return value.replace(/([A-Z])/g, function ($1) {
        return key + $1.toLowerCase();
    });
}

function Tracker() {
    this.value = 0;
    this.lastvalue = this.value;
    this.mutate = undefined;
}
Tracker.prototype = {
    add: function add() {
        this.value++;
    },
    sub: function sub() {
        this.value--;
    },
    init: function init() {
        this.lastvalue = this.value;
        if (this.value > 0) {
            this.mutate = this.sub;
        } else {
            this.mutate = this.add;
        }
    }
};