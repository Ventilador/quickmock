"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.isArrayLike = isArrayLike;
exports.assertNotDefined = assertNotDefined;
exports.assert_$_CONTROLLER = assert_$_CONTROLLER;
exports.clean = clean;
exports.createSpy = createSpy;
exports.makeArray = makeArray;
exports.extend = extend;
exports.getFunctionName = getFunctionName;
exports.sanitizeModules = sanitizeModules;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('common.js');
var PARSE_BINDING_REGEX = exports.PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var isExpression = exports.isExpression = /^{{.*}}$/;
/* Should return true 
 * for objects that wouldn't fail doing
 * Array.prototype.slice.apply(myObj);
 * which returns a new array (reference-wise)
 * Probably needs more specs
 */
function isArrayLike(item) {
    return Array.isArray(item) || !!item && (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && item.hasOwnProperty("length") && typeof item.length === "number" && item.length >= 0 || Object.prototype.toString.call(item) === '[object Arguments]';
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
                if (!key.startsWith('$')) {
                    clean(object[key]);
                }
                delete object[key];
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
        key: "create",
        value: function create(scope) {
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
                return extend(rootScope.$new(true), scope);
            }
            if (isArrayLike(scope)) {
                scope = makeArray(scope);
                return extend.apply(undefined, [rootScope.$new(true)].concat(scope));
            }
        }
    }, {
        key: "isScope",
        value: function isScope(object) {
            return object && getRootFromScope(object) === getRootFromScope(rootScope) && object;
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
console.log('common.js end');