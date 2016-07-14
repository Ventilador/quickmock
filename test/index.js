/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(17);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(52);
	__webpack_require__(55).default();

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

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
	exports.makeArray = makeArray;
	exports.extend = extend;
	exports.getFunctionName = getFunctionName;
	exports.sanitizeModules = sanitizeModules;
	exports.toCamelCase = toCamelCase;
	exports.toSnakeCase = toSnakeCase;
	
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

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandlerExtensions = __webpack_require__(18);
	
	var _common = __webpack_require__(21);
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var injections = function () {
	    var toReturn = {
	        $rootScope: _common.scopeHelper.$rootScope
	    };
	    return toReturn;
	}();
	describe('Util logic', function () {
	    describe('array-like', function () {
	        it('should return true for array-like objects', function () {
	            expect((0, _common.isArrayLike)(arguments)).toBe(true);
	            expect((0, _common.isArrayLike)([])).toBe(true);
	            var testObject = {
	                length: 1,
	                0: 'lala'
	            };
	            expect((0, _common.isArrayLike)(testObject)).toBe(true);
	            if ((0, _common.isArrayLike)(testObject)) {
	                expect(function () {
	                    Array.prototype.slice.apply(testObject);
	                }).not.toThrow();
	            }
	        });
	    });
	    describe('sanitizeModles', function () {
	        it('should allow empty modules', function () {
	            expect(function () {
	                (0, _common.sanitizeModules)();
	            }).not.toThrow();
	            expect(function () {
	                (0, _common.sanitizeModules)([]);
	            }).not.toThrow();
	            expect(function () {
	                (0, _common.sanitizeModules)({
	                    length: 0
	                });
	            }).not.toThrow();
	        });
	        it('shoud add ng module it its not present', function () {
	            expect((0, _common.sanitizeModules)().indexOf('ng')).not.toBe(-1);
	            expect((0, _common.sanitizeModules)([]).indexOf('ng')).not.toBe(-1);
	            expect((0, _common.sanitizeModules)({
	                length: 0
	            }).indexOf('ng')).not.toBe(-1);
	        });
	        it('should not add ng nor angular to the array', function () {
	            expect((0, _common.sanitizeModules)('ng').length).toBe(1);
	            expect((0, _common.sanitizeModules)('angular').length).toBe(1);
	        });
	        it('should allow passing arrays-like objects', function () {
	            var object1 = ['module1', 'module2'];
	            var object2 = arguments;
	            var object3 = {
	                length: 2,
	                0: 'module1',
	                1: 'module2'
	            };
	            [object1, object2, object3].forEach(function (value) {
	                expect(function () {
	                    var result = (0, _common.sanitizeModules)(value);
	                    expect(result.length).toBe(value.length + 1);
	                }).not.toThrow();
	            });
	        });
	        it('should move default ng/angular module to the first position', function () {
	            var result1 = (0, _common.sanitizeModules)(['module1', 'module2', 'ng']),
	                result2 = (0, _common.sanitizeModules)(['module1', 'module2', 'angular']);
	            expect(result1[0]).toBe('ng');
	            expect(result1.length).toBe(3);
	            expect(result2[0]).toBe('ng');
	            expect(result2.length).toBe(3);
	        });
	    });
	    describe('scopeHelper', function () {
	        it('should return a scope when no arguments where given', function () {
	            expect(_common.scopeHelper.create().$root).toBe(injections.$rootScope);
	        });
	        it('should return the same scope reference when it receive a scope', function () {
	            var scope = injections.$rootScope.$new();
	            expect(_common.scopeHelper.create(scope)).toBe(scope);
	        });
	        it('should return the same scope reference when it receives an isolated scope', function () {
	            var scope = injections.$rootScope.$new(true);
	            expect(_common.scopeHelper.create(scope)).toBe(scope);
	        });
	        it('should return an scope with the properties of a passed object', function () {
	            var toPass = {
	                a: {}, // for reference checking
	                b: {}
	            };
	            var returnedScope = void 0;
	            expect(function () {
	                returnedScope = _common.scopeHelper.create(toPass);
	            }).not.toThrow();
	            expect(returnedScope.a).toBe(toPass.a);
	            expect(returnedScope.b).toBe(toPass.b);
	        });
	        it('should know when an object is a controller Constructor', function () {
	            _controllerHandler2.default.clean();
	            var controllerObj = _controllerHandler2.default.setScope({
	                boundProperty: 'something'
	            }).bindWith({
	                boundProperty: '='
	            }).new('withBindings');
	
	            expect(_controllerHandlerExtensions.$_CONTROLLER.isController(controllerObj)).toBe(true);
	            controllerObj.$destroy();
	        });
	    });
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$_CONTROLLER = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _controllerQM = __webpack_require__(30);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var $_CONTROLLER = exports.$_CONTROLLER = function () {
	    _createClass($_CONTROLLER, null, [{
	        key: 'isController',
	        value: function isController(object) {
	            return object instanceof $_CONTROLLER;
	        }
	    }]);
	
	    function $_CONTROLLER(ctrlName, pScope, bindings, modules, cName, cLocals) {
	        _classCallCheck(this, $_CONTROLLER);
	
	        this.providerName = ctrlName;
	        this.scopeControllerName = cName || 'controller';
	        this.usedModules = modules.slice();
	        this.parentScope = pScope;
	        this.controllerScope = this.parentScope.$new();
	        this.bindings = bindings;
	        this.locals = (0, _common.extend)(cLocals || {}, {
	            $scope: this.controllerScope
	        }, false);
	        this.pendingWatchers = [];
	        this.$rootScope = _common.scopeHelper.$rootScope;
	        this.InternalSpies = {
	            Scope: {},
	            Controller: {}
	        };
	    }
	
	    _createClass($_CONTROLLER, [{
	        key: '$apply',
	        value: function $apply() {
	            this.$rootScope.$apply();
	        }
	    }, {
	        key: '$destroy',
	        value: function $destroy() {
	            this.$rootScope = undefined;
	            if (this.parentScope && angular.isFunction(this.parentScope.$destroy)) {
	                this.parentScope.$destroy();
	            }
	            (0, _common.clean)(this);
	        }
	    }, {
	        key: 'create',
	        value: function create(bindings) {
	            var _this = this;
	
	            this.bindings = angular.isDefined(bindings) && bindings !== null ? bindings : this.bindings;
	            (0, _common.assert_$_CONTROLLER)(this);
	
	            this.controllerConstructor = _controllerQM2.default.$get(this.usedModules).create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
	            this.controllerInstance = this.controllerConstructor();
	
	            var watcher = void 0,
	                self = this;
	            while (watcher = this.pendingWatchers.shift()) {
	                this.watch.apply(this, watcher);
	            }
	            for (var key in this.bindings) {
	                if (this.bindings.hasOwnProperty(key)) {
	                    var result = _common.PARSE_BINDING_REGEX.exec(this.bindings[key]),
	                        scopeKey = result[2] || key,
	                        spyKey = [scopeKey, ':', key].join('');
	                    if (result[1] === '=') {
	                        (function () {
	
	                            var destroyer = _this.watch(key, _this.InternalSpies.Scope[spyKey] = (0, _common.createSpy)(), self.controllerInstance);
	                            var destroyer2 = _this.watch(scopeKey, _this.InternalSpies.Controller[spyKey] = (0, _common.createSpy)(), self.parentScope);
	                            _this.parentScope.$on('$destroy', function () {
	                                destroyer();
	                                destroyer2();
	                            });
	                        })();
	                    }
	                }
	            }
	            this.create = undefined;
	            return this.controllerInstance;
	        }
	    }, {
	        key: 'watch',
	        value: function watch(expression, callback) {
	            if (!this.controllerInstance) {
	                this.pendingWatchers.push(arguments);
	                return this;
	            }
	            return this.controllerScope.$watch(expression, callback);
	        }
	    }, {
	        key: 'ngClick',
	        value: function ngClick(expression) {
	            return this.createDirective('ng-click', expression);
	        }
	    }, {
	        key: 'createDirective',
	        value: function createDirective() {
	            var args = (0, _common.makeArray)(arguments);
	            var directive = _directiveProvider2.default.$get(arguments[0]);
	            args[0] = this;
	            return directive.compile.apply(undefined, args);
	        }
	    }, {
	        key: 'compileHTML',
	        value: function compileHTML(htmlText) {
	            return new _directiveHandler.directiveHandler(this, htmlText);
	        }
	    }]);

	    return $_CONTROLLER;
	}();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ngModel = __webpack_require__(20);
	
	var _ngClick = __webpack_require__(22);
	
	var _ngIf = __webpack_require__(23);
	
	var _ngTranslate = __webpack_require__(24);
	
	var _ngBind = __webpack_require__(25);
	
	var _ngClass = __webpack_require__(26);
	
	var _common = __webpack_require__(21);
	
	var _ngRepeat = __webpack_require__(27);
	
	var directiveProvider = function () {
	    var $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate');
	    var directives = new Map(),
	        toReturn = {},
	        $parse = angular.injector(['ng']).get('$parse'),
	        $animate = angular.injector(['ng']).get('$animate'),
	        $transclude = function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
	
	        // No scope passed in:
	        if (!_common.scopeHelper.isScope(scope)) {
	            futureParentElement = cloneAttachFn;
	            cloneAttachFn = scope;
	            scope = undefined;
	        }
	    },
	        internals = {
	        ngIf: (0, _ngIf.ngIfDirective)(),
	        ngClick: (0, _ngClick.ngClickDirective)($parse),
	        ngModel: (0, _ngModel.ngModelDirective)($parse),
	        ngDisabled: (0, _ngIf.ngIfDirective)(),
	        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
	        ngBind: (0, _ngBind.ngBindDirective)(),
	        ngClass: (0, _ngClass.ngClassDirective)($parse),
	        ngRepeat: (0, _ngRepeat.ngRepeatDirective)($parse, $animate, $transclude),
	        translateValue: {}
	    };
	    internals.ngTranslate = internals.translate;
	
	    toReturn.$get = function (directiveName) {
	        if (angular.isString(directiveName)) {
	            directiveName = (0, _common.toCamelCase)(directiveName);
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
	            directiveName = (0, _common.toCamelCase)(directiveName);
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
	    toReturn.$clean = function () {
	        directives.clear();
	    };
	    toReturn.useModule = function (moduleName) {
	        $translate = angular.injector(['ng', 'pascalprecht.translate'].concat(moduleName)).get('$translate');
	        internals.translate.changeService($translate);
	    };
	    return toReturn;
	}();
	exports.default = directiveProvider;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngModelDirective = ngModelDirective;
	
	var _common = __webpack_require__(21);
	
	function ngModelDirective($parse) {
	    return {
	        compile: function compile(controllerService, expression) {
	            var subscriptors = [];
	            controllerService.controllerScope.$on('$destroy', function () {
	                while (subscriptors.length) {
	                    (subscriptors.shift() || angular.noop)();
	                }
	            });
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            var getter = $parse(expression);
	
	            var toReturn = function toReturn(parameter) {
	                if (arguments.length === 0) {
	                    return getter(controllerService.controllerScope);
	                } else if (angular.isString(parameter)) {
	                    if (arguments.length === 2 && arguments[1] === true) {
	                        toReturn(parameter.split(''));
	                        return;
	                    }
	                    getter.assign(controllerService.controllerScope, parameter);
	                    subscriptors.forEach(function (fn) {
	                        fn(parameter);
	                    });
	                    controllerService.$apply();
	                } else if ((0, _common.isArrayLike)(parameter)) {
	                    var memory = '';
	                    (0, _common.makeArray)(parameter).forEach(function (current) {
	                        toReturn(memory += current);
	                    });
	                } else {
	                    throw ['Dont know what to do with ', '["', (0, _common.makeArray)(arguments).join('", "'), '"]'].join('');
	                }
	            };
	
	            toReturn.changes = function (callback) {
	                if (angular.isFunction(callback)) {
	                    subscriptors.push(callback);
	                    return function () {
	                        var index = subscriptors.indexOf(callback);
	                        subscriptors.splice(index, 1);
	                    };
	                }
	                throw 'Callback is not a function';
	            };
	            return toReturn;
	        },
	        attachToElement: function attachToElement(controllerService, elem) {
	            var model = elem.data('ng-model');
	            elem.text(model());
	            model.changes(function (newValue) {
	                elem.text(newValue);
	            });
	        },
	        name: 'ng-model'
	    };
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

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
	exports.makeArray = makeArray;
	exports.extend = extend;
	exports.getFunctionName = getFunctionName;
	exports.sanitizeModules = sanitizeModules;
	exports.toCamelCase = toCamelCase;
	exports.toSnakeCase = toSnakeCase;
	
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

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngClickDirective = ngClickDirective;
	
	var _common = __webpack_require__(3);
	
	function recurseObjects(object) {
	    var toReturn = (0, _common.makeArray)(object);
	    for (var ii = 0; ii < object.children().length; ii++) {
	        toReturn = toReturn.concat(recurseObjects(angular.element(object.children()[ii])));
	    }
	    return toReturn;
	}
	function ngClickDirective($parse) {
	    var _arguments = arguments;
	
	    return {
	        regex: /ng-click="(.*)"/,
	        compile: function compile(controllerService, expression) {
	            if (angular.isString(expression)) {
	                expression = $parse(expression);
	            }
	            if (controllerService.create) {
	                controllerService.create();
	            }
	
	            var click = function click(scope, locals) {
	                if (_arguments.length === 1) {
	                    locals = scope || {};
	                    scope = controllerService.controllerScope;
	                } else {
	                    scope = scope || controllerService.controllerScope;
	                    locals = locals || {};
	                }
	                var result = expression(scope, locals);
	                controllerService.$apply();
	                return result;
	            };
	            return click;
	        },
	        attachToElement: function attachToElement(controllerService, $element) {
	            var clickData = $element.data('ng-click');
	            var myArray = recurseObjects($element);
	            for (var index = 0; index < myArray.length; index++) {
	                angular.element(myArray[index]).data('ng-click', clickData);
	            }
	        },
	        name: 'ng-click'
	    };
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngIfDirective = ngIfDirective;
	function ngIfDirective() {
	    return {
	        regex: /ng-if="(.*)"/,
	        compile: function compile(controllerService, expression) {
	            var lastValue = void 0;
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            var subscriptors = [];
	            var watcher = controllerService.watch(expression, function () {
	                lastValue = arguments[0];
	                for (var ii = 0; ii < subscriptors.length; ii++) {
	                    subscriptors[ii].apply(subscriptors, arguments);
	                }
	            });
	            controllerService.controllerScope.$on('$destroy', function () {
	                do {
	                    (subscriptors.shift() || angular.nosop)();
	                } while (subscriptors.length);
	                watcher();
	            });
	            var toReturn = function toReturn(callback) {
	                subscriptors.push(callback);
	                return function () {
	                    var index = subscriptors.indexOf(callback);
	                    subscriptors.splice(index, 1);
	                };
	            };
	            toReturn.value = function () {
	                return lastValue;
	            };
	            return toReturn;
	        },
	        attachToElement: function attachToElement(controllerService, $element) {
	            var lastValue = void 0,
	                parent = $element.parent(),
	                compiledDirective = $element.data('ng-if');
	            compiledDirective(function (newValue) {
	                if (!newValue) {
	                    if (parent.children().length === 0) {
	                        lastValue = Array.prototype.splice.call($element, 0, $element.length);
	                    } else {
	                        lastValue = $element;
	                        $element.detach();
	                    }
	                } else {
	                    if (parent) {
	                        if (Array.isArray(lastValue)) {
	                            Array.prototype.push.apply($element, lastValue);
	                        } else {
	                            parent.append(lastValue);
	                        }
	                        parent = undefined;
	                    }
	                }
	            });
	            controllerService.controllerScope.$on('$destroy', function () {
	                lastValue = parent = compiledDirective = undefined;
	            });
	        },
	        name: 'ng-if'
	    };
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngTranslateDirective = ngTranslateDirective;
	
	var _common = __webpack_require__(21);
	
	function ngTranslateDirective($translate, $parse) {
	    var translateService = $translate;
	    return {
	        compile: function compile(controllerService, expression) {
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            var value = void 0,
	                key = expression,
	                subscriptors = [];
	            var watcher = void 0;
	            controllerService.controllerScope.$on('$destroy', function () {
	                while (subscriptors.length) {
	                    (subscriptors.shift() || angular.noop)();
	                }
	                if (angular.isFunction(watcher)) {
	                    watcher();
	                }
	                value = watcher = toReturn = subscriptors = undefined;
	            });
	            if ((0, _common.isExpression)(expression)) {
	                expression = (0, _common.expressionSanitizer)(expression);
	                key = $parse(expression)(controllerService.controllerScope);
	                watcher = controllerService.watch(expression, function (newValue) {
	                    key = newValue;
	                    value = translateService.instant(newValue);
	                    subscriptors.forEach(function (fn) {
	                        fn(value);
	                    });
	                });
	            } else {
	                value = translateService.instant(key);
	            }
	            var toReturn = function toReturn() {
	                return value;
	            };
	
	            toReturn.changeLanguage = function (newLanguage) {
	                translateService.use(newLanguage);
	                var tempWatcher = controllerService.watch(function () {}, function () {
	                    value = translateService.instant(key);
	                    tempWatcher();
	                    subscriptors.forEach(function (fn) {
	                        fn(value);
	                    });
	                });
	            };
	            toReturn.changes = function (callback) {
	                if (angular.isFunction(callback)) {
	                    subscriptors.push(callback);
	                    return function () {
	                        var index = subscriptors.indexOf(callback);
	                        subscriptors.splice(index, 1);
	                    };
	                }
	                throw 'Callback is not a function';
	            };
	            return toReturn;
	        },
	        translate: function translate(text) {
	            return translateService.instant(text);
	        },
	        changeLanguage: function changeLanguage(newLanguage) {
	            translateService.use(newLanguage);
	        },
	        changeService: function changeService(newService) {
	            translateService = newService;
	        },
	        attachToElement: function attachToElement(controllerService, elem) {
	            var model = elem.data('ng-translate');
	            elem.text(model());
	            model.changes(function (newValue) {
	                elem.text(newValue);
	            });
	        },
	        name: 'ng-translate'
	
	    };
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngBindDirective = ngBindDirective;
	function ngBindDirective() {
	    return {
	        compile: function compile(controllerService, expression) {
	            var subscriptors = [];
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            var lastValue = void 0;
	            var watcher = controllerService.watch(expression, function (newValue) {
	                lastValue = newValue;
	                subscriptors.forEach(function (fn) {
	                    fn(newValue);
	                });
	            });
	            var toReturn = function toReturn() {
	                return lastValue;
	            };
	            controllerService.controllerScope.$on('$destroy', function () {
	                while (subscriptors.length) {
	                    (subscriptors.shift() || angular.noop)();
	                }
	                watcher();
	            });
	            toReturn.changes = function (callback) {
	                if (angular.isFunction(callback)) {
	                    subscriptors.push(callback);
	                    return function () {
	                        var index = subscriptors.indexOf(callback);
	                        subscriptors.splice(index, 1);
	                    };
	                }
	                throw 'Callback is not a function';
	            };
	            return toReturn;
	        },
	        attachToElement: function attachToElement(controllerService, elem) {
	            var model = elem.data('ng-bind');
	            elem.text(model());
	            model.changes(function (newValue) {
	                elem.text(newValue);
	            });
	        },
	        name: 'ng-bind'
	    };
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngClassDirective = ngClassDirective;
	
	var _common = __webpack_require__(21);
	
	function ngClassDirective($parse) {
	    return {
	        compile: function compile(controllerService, expression) {
	            if (angular.isFunction(controllerService.create)) {
	                controllerService.create();
	            }
	            var subscriptors = [];
	            var lastValue = {};
	            var getter = $parse((0, _common.trim)(expression));
	            var watcher = controllerService.watch(function () {
	                var newValue = getter(controllerService.controllerScope);
	                var fireChange = void 0;
	                var toNotify = {};
	                if (angular.isString(newValue)) {
	                    var classes = newValue.split(' ');
	                    newValue = {};
	                    classes.forEach(function (key) {
	                        newValue[key] = true;
	                    });
	                } else if (angular.isUndefined(newValue)) {
	                    newValue = {};
	                } else if (angular.isArray(newValue)) {
	                    var temp = newValue;
	                    newValue = {};
	                    temp.forEach(function (key) {
	                        newValue[key] = true;
	                    });
	                }
	                for (var key in newValue) {
	                    if (newValue.hasOwnProperty(key) && newValue[key] !== lastValue[key]) {
	                        toNotify[key] = {
	                            old: !!lastValue[key],
	                            new: !!newValue[key]
	                        };
	                        fireChange = true;
	                    }
	                }
	                for (var _key in lastValue) {
	                    if (!toNotify.hasOwnProperty(_key) && lastValue.hasOwnProperty(_key) && newValue[_key] !== lastValue[_key]) {
	                        toNotify[_key] = {
	                            old: !!lastValue[_key],
	                            new: !!newValue[_key]
	                        };
	                        fireChange = true;
	                    }
	                }
	                if (fireChange) {
	                    subscriptors.forEach(function (fn) {
	                        fn(newValue, toNotify);
	                    });
	                    lastValue = newValue;
	                }
	                return lastValue;
	            });
	            controllerService.controllerScope.$on('$destroy', function () {
	                watcher();
	                while (subscriptors.length) {
	                    (subscriptors.shift() || angular.noop)();
	                }
	            });
	            var toReturn = function toReturn() {
	                if (!lastValue) {
	                    return '';
	                }
	                if (angular.isString(lastValue)) {
	                    return lastValue;
	                }
	                var classes = [];
	                Object.keys(lastValue).forEach(function (key) {
	                    if (lastValue[key]) {
	                        classes.push(key);
	                    }
	                });
	                return classes.join(' ');
	            };
	            toReturn.changes = function (callback) {
	                if (angular.isFunction(callback)) {
	                    subscriptors.push(callback);
	                    return function () {
	                        var index = subscriptors.indexOf(callback);
	                        subscriptors.splice(index, 1);
	                    };
	                }
	                throw 'Callback is not a function';
	            };
	            toReturn.hasClass = function (toCheck) {
	                if (angular.isString(lastValue)) {
	                    return lastValue.indexOf((0, _common.trim)(toCheck)) !== -1;
	                } else if (!lastValue) {
	                    return false;
	                }
	                return !!lastValue[toCheck];
	            };
	            return toReturn;
	        },
	        name: 'ng-class',
	        attachToElement: function attachToElement(controllerService, element) {
	
	            element.data('ng-class').changes(function (lastValue, newChanges) {
	                for (var key in newChanges) {
	                    if (newChanges.hasOwnProperty(key)) {
	                        if (newChanges[key].new === true) {
	                            element.addClass(key);
	                        } else {
	                            element.removeClass(key);
	                        }
	                    }
	                }
	            });
	        }
	    };
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngRepeatDirective = ngRepeatDirective;
	
	var _common = __webpack_require__(21);
	
	function ngRepeatDirective($parse) {
	    // const NG_REMOVED = '$$NG_REMOVED';
	    var updateScope = function updateScope(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
	        // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
	        scope[valueIdentifier] = value;
	        if (keyIdentifier) {
	            scope[keyIdentifier] = key;
	        }
	        scope.$index = index;
	        scope.$first = index === 0;
	        scope.$last = index === arrayLength - 1;
	        scope.$middle = !(scope.$first || scope.$last);
	        // jshint bitwise: false
	        scope.$odd = !(scope.$even = (index & 1) === 0);
	        // jshint bitwise: true
	    };
	
	    return {
	        name: 'ngRepeat',
	        compile: function compile(controllerService, expression) {
	            var subscriptors = [];
	            if (angular.isFunction(controllerService.create)) {
	                controllerService.create();
	            }
	            var $scope = controllerService.controllerScope;
	            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
	            if (!match) {
	                throw ["Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '", expression, "'"].join('');
	            }
	            var lhs = match[1];
	            var rhs = match[2];
	            var aliasAs = match[3];
	            var trackByExp = match[4];
	            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
	            if (!match) {
	                throw ["'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '", lhs, "'"].join('');
	            }
	            var valueIdentifier = match[3] || match[1];
	            var keyIdentifier = match[2];
	
	            if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
	                throw ["alias '", aliasAs, "' is invalid --- must be a valid JS identifier which is not a reserved name."].join('');
	            }
	            var trackByExpGetter = void 0,
	                trackByIdExpFn = void 0,
	                trackByIdArrayFn = void 0,
	                trackByIdObjFn = void 0;
	            var hashFnLocals = {
	                $id: _common.hashKey
	            };
	
	            if (trackByExp) {
	                trackByExpGetter = $parse(trackByExp);
	            } else {
	                trackByIdArrayFn = function trackByIdArrayFn(key, value) {
	                    return (0, _common.hashKey)(value);
	                };
	                trackByIdObjFn = function trackByIdObjFn(key) {
	                    return key;
	                };
	            }
	            if (trackByExpGetter) {
	                trackByIdExpFn = function trackByIdExpFn(key, value, index) {
	                    // assign key, value, and $index to the locals so that they can be used in hash functions
	                    if (keyIdentifier) {
	                        hashFnLocals[keyIdentifier] = key;
	                    }
	                    hashFnLocals[valueIdentifier] = value;
	                    hashFnLocals.$index = index;
	                    return trackByExpGetter($scope, hashFnLocals);
	                };
	            }
	            var lastBlockMap = (0, _common.createMap)();
	            var differences = (0, _common.createMap)();
	            var myObjects = [];
	            var ngRepeatMinErr = function ngRepeatMinErr() {};
	            var watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
	                differences = {
	                    added: [],
	                    removed: [],
	                    modified: []
	                };
	                var index = void 0,
	                    nextBlockMap = (0, _common.createMap)(),
	                    collectionLength = void 0,
	                    key = void 0,
	                    value = void 0,
	                    // key/value of iteration
	                trackById = void 0,
	                    trackByIdFn = void 0,
	                    collectionKeys = void 0,
	                    block = void 0,
	                    // last object information {scope, element, id}
	                nextBlockOrder = void 0,
	                    elementsToRemove = void 0;
	
	                if (aliasAs) {
	                    $scope[aliasAs] = collection;
	                }
	
	                if ((0, _common.isArrayLike)(collection)) {
	                    collectionKeys = collection;
	                    trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
	                } else {
	                    trackByIdFn = trackByIdExpFn || trackByIdObjFn;
	                    // if object, extract keys, in enumeration order, unsorted
	                    collectionKeys = [];
	                    for (var itemKey in collection) {
	                        if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
	                            collectionKeys.push(itemKey);
	                        }
	                    }
	                }
	
	                collectionLength = collectionKeys.length;
	                nextBlockOrder = new Array(collectionLength);
	
	                // locate existing items
	                for (index = 0; index < collectionLength; index++) {
	                    key = collection === collectionKeys ? index : collectionKeys[index];
	                    value = collection[key];
	                    trackById = trackByIdFn(key, value, index);
	                    if (lastBlockMap[trackById]) {
	                        // found previously seen block
	                        block = lastBlockMap[trackById];
	                        delete lastBlockMap[trackById];
	                        nextBlockMap[trackById] = block;
	                        nextBlockOrder[index] = block;
	                    } else if (nextBlockMap[trackById]) {
	                        // if collision detected. restore lastBlockMap and throw an error
	                        angular.forEach(nextBlockOrder, function (block) {
	                            if (block && block.scope) {
	                                lastBlockMap[block.id] = block;
	                            }
	                        });
	                        throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
	                    } else {
	                        // new never before seen block
	                        nextBlockOrder[index] = {
	                            id: trackById,
	                            scope: undefined
	                        };
	                        nextBlockMap[trackById] = true;
	                    }
	                }
	
	                // remove leftover items
	                for (var blockKey in lastBlockMap) {
	                    block = lastBlockMap[blockKey];
	                    elementsToRemove = myObjects.indexOf(block);
	                    myObjects.splice(elementsToRemove, 1);
	                    differences.removed.push(block);
	                    block.scope.$destroy();
	                }
	
	                // we are not using forEach for perf reasons (trying to avoid #call)
	                for (index = 0; index < collectionLength; index++) {
	                    key = collection === collectionKeys ? index : collectionKeys[index];
	                    value = collection[key];
	                    block = nextBlockOrder[index];
	                    if (block.scope) {
	                        // if we have already seen this object, then we need to reuse the
	                        // associated scope/element
	                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
	                        differences.modified.push(block);
	                    } else {
	                        // new item which we don't know about
	                        block.scope = $scope.$new();
	                        myObjects.splice(index, 0, block);
	                        differences.added.push(block);
	                        nextBlockMap[block.id] = block;
	                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
	                    }
	                    block.index = index;
	                }
	                lastBlockMap = nextBlockMap;
	                subscriptors.forEach(function (fn) {
	                    fn(myObjects, differences);
	                });
	            });
	            $scope.$on('$destroy', function () {
	                while (subscriptors.length) {
	                    (subscriptors.shift() || angular.noop)();
	                }
	                watcher();
	            });
	            var toReturn = function toReturn() {
	                return {
	                    objects: myObjects,
	                    differences: differences
	                };
	            };
	            toReturn.keyIdentifier = keyIdentifier || valueIdentifier;
	            toReturn.changes = function (callback) {
	                if (angular.isFunction(callback)) {
	                    subscriptors.push(callback);
	                    return function () {
	                        var index = subscriptors.indexOf(callback);
	                        subscriptors.splice(index, 1);
	                    };
	                }
	                throw 'Callback is not a function';
	            };
	            return toReturn;
	        }
	    };
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	var _attribute = __webpack_require__(29);
	
	var _attribute2 = _interopRequireDefault(_attribute);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var directiveHandler = function () {
	
	    var proto = angular.element.prototype || angular.element.__proto__;
	    proto.$find = function (selector) {
	        var values = {
	            length: 0
	        };
	        for (var index = 0; index < this.length; index++) {
	            var value = this[index].querySelector(selector);
	            if (value) {
	                values[values.length++] = value;
	            }
	        }
	
	        return angular.element(join(values));
	    };
	    proto.$click = function (locals) {
	        if (this.length) {
	            var click = this.data('ng-click');
	            return click && click(locals);
	        }
	    };
	    proto.$text = function () {
	        if (this.length) {
	            var text = this.data('ng-model') || this.data('ng-bind') || this.data('ng-translate') || this.text;
	            return text && text.apply(undefined, arguments) || '';
	        }
	    };
	    proto.$if = function () {
	        if (this.length) {
	            var ngIf = this.data('ng-if');
	            return ngIf && ngIf.value.apply(undefined, arguments);
	        }
	    };
	
	    function join(obj) {
	        return Array.prototype.concat.apply([], obj);
	    }
	
	    function compile(obj, controllerService) {
	        obj = angular.element(obj);
	
	        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
	            var directiveName = obj[0].attributes[ii].name;
	            var expression = obj[0].attributes[ii].value;
	            var directive = void 0;
	            if (directive = _directiveProvider2.default.$get(directiveName)) {
	                var compiledDirective = directive.compile(controllerService, expression);
	                obj.data(directive.name, compiledDirective);
	                if (angular.isFunction(directive.attachToElement)) {
	                    directive.attachToElement(controllerService, angular.element(obj), new _attribute2.default(obj));
	                }
	            }
	        }
	
	        var childrens = obj.children();
	        for (var _ii = 0; _ii < childrens.length; _ii++) {
	            compile(childrens[_ii], controllerService);
	        }
	    }
	
	    function control(controllerService, obj) {
	        var current = angular.element(obj);
	        if (!current || !controllerService) {
	            return current;
	        }
	        compile(current, controllerService);
	        return current;
	    }
	
	    return control;
	}();
	exports.default = directiveHandler;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(21);
	
	function Attributes(element, attributesToCopy) {
	    if (attributesToCopy) {
	        var keys = Object.keys(attributesToCopy);
	        var i, l, key;
	
	        for (i = 0, l = keys.length; i < l; i++) {
	            key = keys[i];
	            this[key] = attributesToCopy[key];
	        }
	    } else {
	        this.$attr = {};
	    }
	
	    this.$$element = element;
	}
	var $animate = angular.injector(['ng']).get('$animate');
	var $$sanitizeUri = angular.injector(['ng']).get('$$sanitizeUri');
	Attributes.prototype = {
	    /**
	     * @ngdoc method
	     * @name $compile.directive.Attributes#$normalize
	     * @kind function
	     *
	     * @description
	     * Converts an attribute name (e.g. dash/colon/underscore-delimited string, optionally prefixed with `x-` or
	     * `data-`) to its normalized, camelCase form.
	     *
	     * Also there is special case for Moz prefix starting with upper case letter.
	     *
	     * For further information check out the guide on {@link guide/directive#matching-directives Matching Directives}
	     *
	     * @param {string} name Name to normalize
	     */
	    $normalize: _common.toCamelCase,
	
	    /**
	     * @ngdoc method
	     * @name $compile.directive.Attributes#$addClass
	     * @kind function
	     *
	     * @description
	     * Adds the CSS class value specified by the classVal parameter to the element. If animations
	     * are enabled then an animation will be triggered for the class addition.
	     *
	     * @param {string} classVal The className value that will be added to the element
	     */
	    $addClass: function $addClass(classVal) {
	        if (classVal && classVal.length > 0) {
	            $animate.addClass(this.$$element, classVal);
	        }
	    },
	
	    /**
	     * @ngdoc method
	     * @name $compile.directive.Attributes#$removeClass
	     * @kind function
	     *
	     * @description
	     * Removes the CSS class value specified by the classVal parameter from the element. If
	     * animations are enabled then an animation will be triggered for the class removal.
	     *
	     * @param {string} classVal The className value that will be removed from the element
	     */
	    $removeClass: function $removeClass(classVal) {
	        if (classVal && classVal.length > 0) {
	            $animate.removeClass(this.$$element, classVal);
	        }
	    },
	
	    /**
	     * @ngdoc method
	     * @name $compile.directive.Attributes#$updateClass
	     * @kind function
	     *
	     * @description
	     * Adds and removes the appropriate CSS class values to the element based on the difference
	     * between the new and old CSS class values (specified as newClasses and oldClasses).
	     *
	     * @param {string} newClasses The current CSS className value
	     * @param {string} oldClasses The former CSS className value
	     */
	    $updateClass: function $updateClass(newClasses, oldClasses) {
	        var toAdd = tokenDifference(newClasses, oldClasses);
	        if (toAdd && toAdd.length) {
	            $animate.addClass(this.$$element, toAdd);
	        }
	
	        var toRemove = tokenDifference(oldClasses, newClasses);
	        if (toRemove && toRemove.length) {
	            $animate.removeClass(this.$$element, toRemove);
	        }
	    },
	
	    /**
	     * Set a normalized attribute on the element in a way such that all directives
	     * can share the attribute. This function properly handles boolean attributes.
	     * @param {string} key Normalized key. (ie ngAttribute)
	     * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
	     * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
	     *     Defaults to true.
	     * @param {string=} attrName Optional none normalized name. Defaults to key.
	     */
	    $set: function $set(key, value, writeAttr, attrName) {
	        // TODO: decide whether or not to throw an error if "class"
	        //is set through this function since it may cause $updateClass to
	        //become unstable.
	
	        var node = this.$$element[0],
	            booleanKey = angular.getBooleanAttrName(node, key),
	            aliasedKey = angular.getAliasedAttrName(key),
	            observer = key,
	            nodeName;
	
	        if (booleanKey) {
	            this.$$element.prop(key, value);
	            attrName = booleanKey;
	        } else if (aliasedKey) {
	            this[aliasedKey] = value;
	            observer = aliasedKey;
	        }
	
	        this[key] = value;
	
	        // translate normalized key to actual key
	        if (attrName) {
	            this.$attr[key] = attrName;
	        } else {
	            attrName = this.$attr[key];
	            if (!attrName) {
	                this.$attr[key] = attrName = (0, _common.toSnakeCase)(key, '-');
	            }
	        }
	
	        nodeName = nodeName_(this.$$element);
	
	        if (nodeName === 'a' && (key === 'href' || key === 'xlinkHref') || nodeName === 'img' && key === 'src') {
	            // sanitize a[href] and img[src] values
	            this[key] = value = $$sanitizeUri(value, key === 'src');
	        } else if (nodeName === 'img' && key === 'srcset' && angular.isDefined(value)) {
	            // sanitize img[srcset] values
	            var result = "";
	
	            // first check if there are spaces because it's not the same pattern
	            var trimmedSrcset = (0, _common.trim)(value);
	            //                (   999x   ,|   999w   ,|   ,|,   )
	            var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
	            var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
	
	            // split srcset into tuple of uri and descriptor except for the last item
	            var rawUris = trimmedSrcset.split(pattern);
	
	            // for each tuples
	            var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
	            for (var i = 0; i < nbrUrisWith2parts; i++) {
	                var innerIdx = i * 2;
	                // sanitize the uri
	                result += $$sanitizeUri((0, _common.trim)(rawUris[innerIdx]), true);
	                // add the descriptor
	                result += " " + (0, _common.trim)(rawUris[innerIdx + 1]);
	            }
	
	            // split the last item into uri and descriptor
	            var lastTuple = (0, _common.trim)(rawUris[i * 2]).split(/\s/);
	
	            // sanitize the last uri
	            result += $$sanitizeUri((0, _common.trim)(lastTuple[0]), true);
	
	            // and add the last descriptor if any
	            if (lastTuple.length === 2) {
	                result += " " + (0, _common.trim)(lastTuple[1]);
	            }
	            this[key] = value = result;
	        }
	
	        if (writeAttr !== false) {
	            if (value === null || angular.isUndefined(value)) {
	                this.$$element.removeAttr(attrName);
	            } else {
	                if (SIMPLE_ATTR_NAME.test(attrName)) {
	                    this.$$element.attr(attrName, value);
	                } else {
	                    setSpecialAttr(this.$$element[0], attrName, value);
	                }
	            }
	        }
	
	        // fire observers
	        var $$observers = this.$$observers;
	        if ($$observers) {
	            angular.forEach($$observers[observer], function (fn) {
	                try {
	                    fn(value);
	                } catch (e) {
	                    console.log(e);
	                }
	            });
	        }
	    },
	
	    /**
	     * @ngdoc method
	     * @name $compile.directive.Attributes#$observe
	     * @kind function
	     *
	     * @description
	     * Observes an interpolated attribute.
	     *
	     * The observer function will be invoked once during the next `$digest` following
	     * compilation. The observer is then invoked whenever the interpolated value
	     * changes.
	     *
	     * @param {string} key Normalized key. (ie ngAttribute) .
	     * @param {function(interpolatedValue)} fn Function that will be called whenever
	              the interpolated value of the attribute changes.
	     *        See the {@link guide/interpolation#how-text-and-attribute-bindings-work Interpolation
	     *        guide} for more info.
	     * @returns {function()} Returns a deregistration function for this observer.
	     */
	    $observe: function $observe(key, fn) {
	        var attrs = this,
	            $$observers = attrs.$$observers || (attrs.$$observers = new Map()),
	            listeners = $$observers[key] || ($$observers[key] = []);
	
	        listeners.push(fn);
	        _common.scopeHelper.$rootScope.$evalAsync(function () {
	            if (!listeners.$$inter && attrs.hasOwnProperty(key) && !angular.isUndefined(attrs[key])) {
	                // no one registered attribute interpolation function, so lets call it manually
	                fn(attrs[key]);
	            }
	        });
	
	        return function () {
	            angular.arrayRemove(listeners, fn);
	        };
	    }
	};
	
	function tokenDifference(str1, str2) {
	
	    var values = '',
	        tokens1 = str1.split(/\s+/),
	        tokens2 = str2.split(/\s+/);
	
	    outer: for (var i = 0; i < tokens1.length; i++) {
	        var token = tokens1[i];
	
	        for (var j = 0; j < tokens2.length; j++) {
	            if (token === tokens2[j]) {
	                continue outer;
	            }
	        }
	
	        values += (values.length > 0 ? ' ' : '') + token;
	    }
	    return values;
	}
	
	function nodeName_(element) {
	    var myElem = angular.element(element)[0];
	    if (myElem) {
	        return myElem.nodeName;
	    }
	}
	var specialAttrHolder = window.document.createElement('div');
	var SIMPLE_ATTR_NAME = /^\w/;
	
	function setSpecialAttr(element, attrName, value) {
	    // Attributes names that do not start with letters (such as `(click)`) cannot be set using `setAttribute`
	    // so we have to jump through some hoops to get such an attribute
	    // https://github.com/angular/angular.js/pull/13318
	    specialAttrHolder.innerHTML = "<span " + attrName + ">";
	    var attributes = specialAttrHolder.firstChild.attributes;
	    var attribute = attributes[0];
	    // We have to remove the attribute from its container element before we can add it to the destination element
	    attributes.removeNamedItem(attribute.name);
	    attribute.value = value;
	    element.attributes.setNamedItem(attribute);
	}
	exports.default = Attributes;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _common = __webpack_require__(21);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var $parse = angular.injector(['ng']).get('$parse');
	
	var controller = function () {
	    function controller() {
	        _classCallCheck(this, controller);
	    }
	
	    _createClass(controller, null, [{
	        key: 'getValues',
	        value: function getValues(scope, bindings) {
	            var toReturn = {};
	            if (!angular.isObject(bindings)) {
	                if (bindings === true || bindings === '=') {
	                    bindings = function () {
	                        var toReturn = {};
	                        for (var key in scope) {
	                            if (scope.hasOwnProperty(key) && !key.startsWith('$')) {
	                                toReturn[key] = '=';
	                            }
	                        }
	                        return toReturn;
	                    }();
	                } else if (bindings === false) {
	                    return toReturn;
	                }
	            }
	            for (var key in bindings) {
	                if (bindings.hasOwnProperty(key)) {
	                    var result = _common.PARSE_BINDING_REGEX.exec(bindings[key]);
	                    var mode = result[1];
	                    var parentKey = result[2] || key;
	                    var parentGet = $parse(parentKey);
	
	                    (function () {
	                        switch (mode) {
	                            case '=':
	                                toReturn[key] = parentGet(scope);
	                                break;
	                            case '&':
	                                var fn = $parse(parentGet(scope));
	                                toReturn[key] = function (locals) {
	                                    return fn(scope, locals);
	                                };
	                                break;
	                            case '@':
	                                var exp = parentGet(scope);
	                                var isExp = (0, _common.isExpression)(exp);
	                                if (isExp) {
	                                    toReturn[key] = $parse((0, _common.expressionSanitizer)(exp))(scope);
	                                } else {
	                                    toReturn[key] = parentGet(scope);
	                                }
	                                break;
	                            default:
	                                throw 'Could not apply bindings';
	                        }
	                    })();
	                }
	            }
	            return toReturn;
	        }
	    }, {
	        key: 'parseBindings',
	        value: function parseBindings(bindings, scope, isolateScope, controllerAs) {
	            var assignBindings = function assignBindings(destination, scope, key, mode) {
	                mode = mode || '=';
	                var result = _common.PARSE_BINDING_REGEX.exec(mode);
	                mode = result[1];
	                var parentKey = result[2] || key;
	                var childKey = controllerAs + '.' + key;
	                var parentGet = $parse(parentKey);
	                var childGet = $parse(childKey);
	                var unwatch;
	
	                (function () {
	                    switch (mode) {
	                        case '=':
	                            var lastValue = parentGet(scope);
	                            var parentValueWatch = function parentValueWatch() {
	                                var parentValue = parentGet(scope);
	                                if (parentValue !== lastValue) {
	                                    childGet.assign(destination, parentValue);
	                                } else {
	                                    parentValue = childGet(destination);
	                                    parentGet.assign(scope, parentValue);
	                                }
	                                lastValue = parentValue;
	                                return lastValue;
	                            };
	                            unwatch = scope.$watch(parentValueWatch);
	
	                            destination.$on('$destroy', unwatch);
	                            break;
	                        case '&':
	                            break;
	                        case '@':
	                            var isExp = (0, _common.isExpression)(scope[parentKey]);
	                            if (isExp) {
	                                (function () {
	                                    var exp = parentGet(scope);
	                                    parentGet = $parse((0, _common.expressionSanitizer)(exp));
	                                    var parentValue = parentGet(scope);
	                                    var lastValue = parentValue;
	                                    var parentValueWatch = function parentValueWatch() {
	                                        parentValue = parentGet(scope, isolateScope);
	                                        if (parentValue !== lastValue) {
	                                            childGet.assign(destination, lastValue = parentValue);
	                                        }
	                                        return lastValue;
	                                    };
	                                    var unwatch = scope.$watch(parentValueWatch);
	                                    destination.$on('$destroy', unwatch);
	                                })();
	                            }
	                            break;
	                        default:
	                            throw 'Could not apply bindings';
	                    }
	                })();
	
	                return destination;
	            };
	
	            var destination = _common.scopeHelper.create(isolateScope || scope.$new());
	            if (!bindings) {
	                return {};
	            } else if (bindings === true || angular.isString(bindings) && bindings === '=') {
	                for (var key in scope) {
	                    if (scope.hasOwnProperty(key) && !key.startsWith('$') && key !== controllerAs) {
	                        assignBindings(destination, scope, key);
	                    }
	                }
	                return destination;
	            } else if (angular.isObject(bindings)) {
	                for (var _key in bindings) {
	                    if (bindings.hasOwnProperty(_key)) {
	                        assignBindings(destination, scope, _key, bindings[_key]);
	                    }
	                }
	                return destination;
	            }
	            throw 'Could not parse bindings';
	        }
	    }, {
	        key: '$get',
	        value: function $get(moduleNames) {
	            var $controller = void 0;
	            var array = (0, _common.makeArray)(moduleNames);
	            // const indexMock = array.indexOf('ngMock');
	            // const indexNg = array.indexOf('ng');
	            // if (indexMock !== -1) {
	            //     array[indexMock] = 'ng';
	            // }
	            // if (indexNg === -1) {
	            //     array.push('ng');
	            // }
	            angular.injector(array).invoke(['$controller', function (controller) {
	                $controller = controller;
	            }]);
	
	            function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
	                scope = _common.scopeHelper.create(scope);
	                scopeControllerName = scopeControllerName || 'controller';
	                var locals = (0, _common.extend)(extendedLocals || {}, {
	                    $scope: _common.scopeHelper.create(scope).$new()
	                }, false);
	
	                var constructor = function constructor() {
	
	                    var constructor = $controller(controllerName, locals, true, scopeControllerName);
	                    (0, _common.extend)(constructor.instance, controller.getValues(scope, bindings));
	                    var toReturn = constructor();
	                    controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName);
	                    return toReturn;
	                };
	                constructor.provideBindings = function (b) {
	                    bindings = b || bindings;
	                    // locals = myLocals || locals;
	                    // b = b || bindings;
	
	                    // controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName);
	                    //extend(constructor.instance, extendedLocals);
	                    return constructor;
	                };
	                if (bindings) {
	                    constructor.provideBindings();
	                }
	                return constructor;
	            }
	            return {
	                create: createController
	            };
	        }
	    }]);
	
	    return controller;
	}();
	
	exports.default = controller;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(21);
	
	var _controllerHandlerExtensions = __webpack_require__(18);
	
	var controllerHandler = function () {
	    var internal = false;
	    var myModules = void 0,
	        ctrlName = void 0,
	        cLocals = void 0,
	        pScope = void 0,
	        cScope = void 0,
	        cName = void 0,
	        bindToController = void 0;
	
	    function clean(root) {
	        myModules = [];
	        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
	        if (root) {
	            $controllerHandler.$rootScope = _common.scopeHelper.$rootScope = root;
	        }
	        return $controllerHandler;
	    }
	
	    var lastInstance = void 0;
	
	    function $controllerHandler() {
	
	        if (!ctrlName) {
	            throw 'Please provide the controller\'s name';
	        }
	        pScope = _common.scopeHelper.create(pScope || {});
	        if (!cScope) {
	            cScope = pScope.$new();
	        }{
	            var tempScope = _common.scopeHelper.isScope(cScope);
	            if (tempScope !== false) {
	                cScope = tempScope;
	            }
	        }
	        if (lastInstance) {
	            lastInstance.$destroy();
	        }
	        var toReturn = new _controllerHandlerExtensions.$_CONTROLLER(ctrlName, pScope, bindToController, myModules, cName, cLocals);
	        lastInstance = toReturn;
	        clean();
	        return toReturn;
	    }
	    $controllerHandler.bindWith = function (bindings) {
	        bindToController = bindings;
	        return $controllerHandler;
	    };
	    $controllerHandler.controllerType = _controllerHandlerExtensions.$_CONTROLLER;
	    $controllerHandler.clean = clean;
	    $controllerHandler.setScope = function (newScope) {
	        pScope = newScope;
	        return $controllerHandler;
	    };
	    $controllerHandler.setLocals = function (locals) {
	        cLocals = locals;
	        return $controllerHandler;
	    };
	
	    $controllerHandler.$rootScope = _common.scopeHelper.$rootScope;
	
	    $controllerHandler.addModules = function (modules) {
	        function pushArray(array) {
	            Array.prototype.push.apply(myModules, array);
	        }
	        if (angular.isString(modules)) {
	            if (arguments.length > 1) {
	                pushArray((0, _common.makeArray)(arguments));
	            } else {
	                pushArray([modules]);
	            }
	        } else if ((0, _common.isArrayLike)(modules)) {
	            pushArray((0, _common.makeArray)(modules));
	        }
	        return $controllerHandler;
	    };
	    $controllerHandler.isInternal = function (flag) {
	        if (angular.isUndefined(flag)) {
	            return internal;
	        }
	        internal = !!flag;
	        return function () {
	            internal = !flag;
	        };
	    };
	    $controllerHandler.new = function (controllerName, scopeControllersName, parentScope, childScope) {
	        ctrlName = controllerName;
	        if (scopeControllersName && !angular.isString(scopeControllersName)) {
	            pScope = _common.scopeHelper.isScope(scopeControllersName);
	            cScope = _common.scopeHelper.isScope(parentScope) || cScope;
	            cName = 'controller';
	        } else {
	            pScope = _common.scopeHelper.create(parentScope || pScope);
	            cScope = _common.scopeHelper.create(childScope || pScope.$new());
	            cName = scopeControllersName;
	        }
	        return $controllerHandler();
	    };
	    $controllerHandler.newService = function (controllerName, controllerAs, parentScope, bindings) {
	        var toReturn = $controllerHandler.new(controllerName, controllerAs, parentScope);
	        toReturn.bindings = bindings;
	        return toReturn;
	    };
	    return $controllerHandler;
	}();
	exports.default = controllerHandler;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerQM = __webpack_require__(30);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('controller', function () {
	    it('should be defined', function () {
	        expect(_controllerQM2.default).toBeDefined();
	    });
	    it('should have a $get method which return a controller generator', function () {
	        expect(_controllerQM2.default.$get).toBeDefined();
	        expect(angular.isFunction(_controllerQM2.default.$get)).toBe(true);
	        expect(angular.isFunction(_controllerQM2.default.$get('ng').create)).toBe(true);
	    });
	    describe('$get', function () {
	        var controllerCreator = void 0;
	        beforeEach(function () {
	            controllerCreator = _controllerQM2.default.$get('test');
	        });
	        it('should return a valid controller', function () {
	            var controller = controllerCreator.create('emptyController');
	            expect(controller).toBeDefined();
	            expect(controller().name).toBe('emptyController');
	        });
	        it('should handle controllers with injections', function () {
	            var controller = controllerCreator.create('withInjections');
	            expect(controller().$q).toBeDefined();
	        });
	        it('should support creating a controller with an scope', function () {
	            var controller = controllerCreator.create('emptyController', {});
	            expect(controller).toBeDefined();
	        });
	        it('should set a property in the scope for the controller', function () {
	            var scope = _common.scopeHelper.$rootScope.$new();
	            var controller1 = controllerCreator.create('withBindings', scope, false)();
	            expect(scope.$$childHead.controller).toBe(controller1);
	        });
	        it('should set a property in the scope for the controller with the given name', function () {
	            var scope = _common.scopeHelper.$rootScope.$new();
	            var controller1 = controllerCreator.create('withBindings', scope, false, 'myController')();
	            expect(scope.$$childHead.myController).toBe(controller1);
	        });
	        describe('bindings', function () {
	            it('should support "true" and "=" as bindToController', function () {
	                var controller1 = controllerCreator.create('withBindings', {
	                    boundProperty: 'Something'
	                }, true)();
	                expect(controller1.boundProperty).toBe('Something modified');
	                var controller2 = controllerCreator.create('withBindings', {
	                    boundProperty: 'Something'
	                }, '=')();
	                expect(controller2.boundProperty).toBe('Something modified');
	            });
	            it('should not bind if bindToController is "false" or "undefined"', function () {
	                var controller1 = controllerCreator.create('withBindings', {
	                    boundProperty: 'Something'
	                }, false)();
	                expect(controller1.boundProperty).toBe('undefined modified');
	                var controller2 = controllerCreator.create('withBindings', {
	                    boundProperty: 'Something'
	                })();
	                expect(controller2.boundProperty).toBe('undefined modified');
	            });
	
	            describe('bindToController', function () {
	                it('should support bindToController as an object for "="', function () {
	                    var controller = controllerCreator.create('withBindings', {
	                        boundProperty: 'Something'
	                    }, {
	                        boundProperty: '='
	                    });
	                    expect(controller().boundProperty).toBe('Something modified');
	                });
	                it('should support bindToController as an object for "@"', function () {
	                    var controller = controllerCreator.create('withBindings', {
	                        boundProperty: 'Something'
	                    }, {
	                        boundProperty: '@'
	                    });
	                    expect(controller().boundProperty).toBe('Something modified');
	                });
	                it('should support bindToController as an object for "&"', function () {
	                    var controller = controllerCreator.create('emptyController', {
	                        boundProperty: 'otherProperty.join("")',
	                        otherProperty: [1, 2, 3]
	                    }, {
	                        boundProperty: '&'
	                    });
	                    controller = controller();
	                    expect(controller.boundProperty()).toBe('123');
	                });
	                it('expressions should allow locals', function () {
	                    var controller = controllerCreator.create('emptyController', {
	                        boundProperty: 'otherProperty.join("")',
	                        otherProperty: [1, 2, 3]
	                    }, {
	                        boundProperty: '&'
	                    });
	                    controller = controller();
	                    expect(controller.boundProperty({
	                        otherProperty: ['a', 'b', 'c']
	                    })).toBe('abc');
	                });
	            });
	        });
	    });
	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('controllerHandler', function () {
	    beforeEach(function () {
	        _controllerHandler2.default.clean();
	    });
	    it('should be defined', function () {
	        expect(_controllerHandler2.default).toBeDefined();
	    });
	    it('should allow adding modules', function () {
	        expect(function () {
	            _controllerHandler2.default.addModules('myModule');
	        }).not.toThrow();
	    });
	    it('should return the controllerHandler when adding modules', function () {
	        expect(_controllerHandler2.default.addModules('myModule')).toBe(_controllerHandler2.default);
	    });
	    describe('creating a controller', function () {
	        beforeEach(function () {
	            _controllerHandler2.default.addModules('test');
	        });
	        it('should allow creating a controller', function () {
	            var controllerObj = void 0;
	            expect(function () {
	                controllerObj = _controllerHandler2.default.new('emptyController');
	            }).not.toThrow();
	            expect(controllerObj).toBeDefined();
	            expect(controllerObj.parentScope).toBeDefined();
	            expect(controllerObj.controllerScope).toBeDefined();
	            expect(controllerObj.controllerScope.$parent).toBe(controllerObj.parentScope);
	            expect(controllerObj.controllerInstance).toBeUndefined();
	            expect(controllerObj.usedModules).toEqual(['test']);
	        });
	        it('should allow creating a controller with bindings', function () {
	            var controllerObj = _controllerHandler2.default.setScope({
	                boundProperty: 'something'
	            }).bindWith({
	                boundProperty: '='
	            }).new('withBindings');
	            expect(controllerObj.create()).toBe(controllerObj.controllerInstance);
	            expect(controllerObj.controllerInstance.boundProperty).toBe('something modified');
	        });
	        it('should allow to change the name of the binding', function () {
	            var scope = {
	                equals: function equals() {},
	                byText: 'byText',
	                expression: 'byText.toUpperCase()'
	            },
	                controllerObj = _controllerHandler2.default.setScope(scope).bindWith({
	                equalsResult: '=equals',
	                byTextResult: '@byText',
	                expressionResult: '&expression'
	            }).new('emptyController');
	            expect(function () {
	                controllerObj.create();
	            }).not.toThrow();
	            expect(controllerObj.controllerInstance.equalsResult).toBe(scope.equals);
	            expect(controllerObj.controllerInstance.byTextResult).toBe(scope.byText);
	            expect(controllerObj.controllerInstance.expressionResult()).toBe(scope.byText.toUpperCase());
	        });
	        describe('Watchers', function () {
	            var scope = void 0,
	                controllerObj = void 0;
	            beforeEach(function () {
	                scope = _controllerHandler2.default.$rootScope.$new();
	            });
	            it('should allow adding watchers', function () {
	                scope.boundProperty = 'lala';
	                controllerObj = _controllerHandler2.default.setScope(scope).bindWith({
	                    boundProperty: '='
	                }).new('emptyController');
	                var args = void 0;
	                var controller = controllerObj.watch('controller.boundProperty', function () {
	                    args = arguments;
	                }).create();
	                expect(controller.boundProperty).toBe('lala');
	                controller.boundProperty = 'lolo';
	                controllerObj.controllerScope.$apply();
	                expect(args).toBeDefined();
	            });
	            it('should reflec changes on the controller into the scope', function () {
	                scope.boundProperty = 'lala';
	                controllerObj = _controllerHandler2.default.setScope(scope).bindWith({
	                    boundProperty: '='
	                }).new('withInjections');
	                var args = void 0;
	                var controller = controllerObj.watch('controller.boundProperty', function () {
	                    args = arguments;
	                }).create();
	                expect(controller.boundProperty).toBe('lala');
	                controller.boundProperty = 'lolo';
	                controllerObj.$apply();
	                expect(controllerObj.parentScope.boundProperty).toBe('lolo');
	                controllerObj.parentScope.$destroy();
	            });
	            it('should reflec changes on the scope into the controller', function () {
	                scope.boundProperty = 'lala';
	                controllerObj = _controllerHandler2.default.setScope(scope).bindWith({
	                    boundProperty: '='
	                }).new('withInjections');
	                var controller = controllerObj.create();
	                controllerObj.parentScope.boundProperty = 'parent';
	                controllerObj.$apply();
	                expect(controller.boundProperty).toBe('parent');
	            });
	            it('should give the parent scope privilege over the controller', function () {
	                controllerObj = _controllerHandler2.default.setScope(scope).bindWith({
	                    boundProperty: '='
	                }).new('withInjections');
	                var controller = controllerObj.create();
	                controllerObj.parentScope.boundProperty = 'parent';
	                controller.boundProperty = 'child';
	                controllerObj.$apply();
	                expect(controller.boundProperty).toBe('parent');
	                expect(controllerObj.parentScope.boundProperty).toBe('parent');
	            });
	        });
	    });
	    describe('destroying a controller', function () {
	        var controllerObj = void 0;
	        beforeEach(function () {
	            _controllerHandler2.default.clean();
	            _controllerHandler2.default.addModules('test');
	        });
	        it('should allow destroying the object', function () {
	            expect(function () {
	                controllerObj = _controllerHandler2.default.new('emptyController');
	            }).not.toThrow();
	            controllerObj.$destroy();
	        });
	    });
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('controllerSpies', function () {
	    var uniqueObject = function uniqueObject() {};
	    var controllerConstructor = void 0;
	    beforeEach(function () {
	        _controllerHandler2.default.clean();
	        if (controllerConstructor) {
	            controllerConstructor.$destroy();
	        }
	        controllerConstructor = _controllerHandler2.default.addModules('test').bindWith({
	            a: '=',
	            b: '@',
	            c: '&'
	        }).setScope({
	            a: uniqueObject,
	            b: 'b',
	            c: 'a'
	        }).new('emptyController');
	    });
	    it('should create spies for each Bounded property', function () {
	        var controller = controllerConstructor.create();
	        var mySpy = controllerConstructor.InternalSpies.Scope['a:a'];
	        expect(mySpy).toBeDefined();
	        controller.a = undefined;
	        expect(mySpy).not.toHaveBeenCalled();
	        controllerConstructor.$apply();
	        expect(mySpy).toHaveBeenCalled();
	        expect(typeof mySpy.took() === 'number').toBe(true);
	        expect(mySpy.took()).toBe(mySpy.took());
	        expect(mySpy.calls.count()).toBe(1);
	        controllerConstructor.$apply();
	        expect(mySpy.calls.count()).toBe(1);
	    });
	});

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(36);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(45);
	__webpack_require__(46);
	__webpack_require__(47);
	__webpack_require__(48);
	__webpack_require__(45);
	__webpack_require__(49);
	__webpack_require__(50);
	__webpack_require__(51);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngClick', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should allow me to call ng-click', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div ng-click="ctrl.aString = \'anotherValue\'"/>');
	        handler.$click();
	        expect(controller.aString).toBe('anotherValue');
	    });
	    it('should not fail if the selected item is invalid', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div />');
	        expect(function () {
	            handler.$find('a').$click();
	        }).not.toThrow();
	    });
	    it('should not fail if the selected does not have the property', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div />');
	        expect(function () {
	            handler.$click();
	        }).not.toThrow();
	    });
	    it('should apply the click event to each of its childrens (if needed)', function () {
	
	        var handler = new _directiveHandler2.default(controllerService, '   <div ng-click="ctrl.aInt = ctrl.aInt + 1">\n                    <div id=\'first\'>\n                        <div id=\'second\'>\n                        </div>\n                    </div>\n                    <div id=\'third\'>\n                    </div>\n                <div/>');
	        handler.$find('#first').$click();
	        handler.$find('#second').$click();
	        handler.$find('#third').$click();
	        expect(controller.aInt).toBe(3);
	    });
	    it('should support locals (for testing)', function () {
	        var handler = new _directiveHandler2.default(controllerService, '   <div ng-click="ctrl.aInt =  value + ctrl.aInt ">\n                    <div id=\'first\'>\n                        <div id=\'second\'>\n                        </div>\n                    </div>\n                    <div id=\'third\'>\n                    </div>\n                <div/>');
	        handler.$find('#first').$click({
	            value: 1000
	        });
	        expect(controller.aInt).toBe(1000);
	        handler.$find('#second').$click({
	            value: ''
	        });
	        expect(controller.aInt).toBe('1000');
	        handler.$find('#third').$click({
	            value: 1
	        });
	        expect(controller.aInt).toBe('11000');
	    });
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngIf', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('if');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	
	    it('should allow to call ngIf', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div><div ng-if="ctrl.aBoolean"/></div>');
	        controllerService.$apply();
	        expect(handler.$if()).toBe(undefined);
	        expect(handler.$find('div').$if()).toBe(true);
	    });
	    it('should remove the elements from the dom', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div><div ng-if="ctrl.aBoolean"/></div>');
	        controller.aBoolean = false;
	        controllerService.$apply();
	        expect(handler.$find('div').$if()).toBe(undefined);
	        expect(handler.children().length).toBe(0);
	    });
	    it('should remove the elements from the dom', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div><div class="my-class" ng-if="ctrl.aBoolean"/></div>');
	        controller.aBoolean = false;
	        controllerService.$apply();
	        expect(handler.$find('div').$if()).toBe(undefined);
	        expect(handler.children().length).toBe(0);
	        controller.aBoolean = true;
	        controllerService.$apply();
	        expect(handler.$find('div').$if()).toBe(true);
	        expect(handler.children().length).toBe(1);
	        expect(handler.$find('div').hasClass('my-class')).toBe(true);
	    });
	    it('should prevent the usage of nested directives', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div><div class="my-class" ng-if="ctrl.aBoolean"><button ng-click="ctrl.aFunction()"/></div></div>');
	        controller.aBoolean = false;
	        controllerService.$apply();
	        handler.$find('button').$click();
	        expect(spy).not.toHaveBeenCalled();
	    });
	    it('should allow using ngIf on the top element', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div class="my-class" ng-if="ctrl.aBoolean"/>');
	        controller.aBoolean = false;
	        controllerService.$apply();
	        expect(handler.$if()).toBe(undefined);
	        expect(handler.length).toBe(0);
	        controller.aBoolean = true;
	        controllerService.$apply();
	        expect(handler.$if()).toBe(true);
	        expect(handler.length).toBe(1);
	        expect(handler.hasClass('my-class')).toBe(true);
	    });
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngModel', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should allow me to call text', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div ng-model="ctrl.aString"/>');
	        expect(handler.$text()).toBe('aValue');
	    });
	    it('should allow me to change the controller value', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div ng-model="ctrl.aString"/>');
	        handler.$text('newValue');
	        expect(controller.aString).toBe('newValue');
	    });
	    it('should allow me to change the controller value, one letter at the time', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div ng-model="ctrl.aString"/>');
	        controllerService.watch('ctrl.aString', spy);
	        handler.$text('newValue'.split(''));
	        expect(controller.aString).toBe('newValue');
	        expect(spy.calls.count()).toBe('newValue'.length);
	    });
	});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngBind', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('bind');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controller = controllerService.create();
	    });
	    it('should be not throw', function () {
	        expect(function () {
	            new _directiveHandler2.default(controllerService, '<p ng-bind="ctrl.aString"/>');
	        }).not.toThrow();
	    });
	    it('should defined ngBind', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<p ng-bind="ctrl.aString"/>');
	        expect(handler.$text).toEqual(jasmine.any(Function));
	    });
	    it('should return the same as jQuerymethod .text()', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<p ng-bind="ctrl.aString"/>');
	        expect(handler.text()).toBe(handler.$text());
	    });
	});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngTranslate', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'TITLE',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should replace the content of the element with the translatation', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<span translate="TITLE"><div>something</di></span>');
	        expect(handler.text()).toBe('Hello');
	        expect(handler.$find('div').length).toBe(0);
	    });
	    it('should replace the content after a $digest', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<span translate="{{ctrl.aKey}}"><div>something</di></span>');
	        expect(handler.text()).toBe('something');
	        controllerService.$apply();
	        expect(handler.text()).toBe('Hello');
	    });
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngClass', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('class');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            asString: 'my-class my-other-class',
	            first: true,
	            second: true
	        }, true);
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should set the class attribute (after $digest)', function () {
	        var handler = new _directiveHandler2.default(controllerService, '<div ng-class="ctrl.asString"/>');
	        expect(handler.hasClass('my-class')).toBe(false);
	        expect(handler.hasClass('my-other-class')).toBe(false);
	        controllerService.$apply();
	        controllerService.$apply();
	        expect(handler.hasClass('my-class')).toBe(true);
	        expect(handler.hasClass('my-other-class')).toBe(true);
	    });
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(28);
	
	var _directiveHandler2 = _interopRequireDefault(_directiveHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('directiveHandler', function () {
	    var controllerService = void 0,
	        spy = void 0,
	        controller = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0,
	            aBoolean: true
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '=',
	            aBoolean: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should be defined', function () {
	        expect(_directiveHandler2.default).toBeDefined();
	    });
	    it('should allow me to create new instances', function () {
	        expect(function () {
	            new _directiveHandler2.default();
	        }).not.toThrow();
	    });
	    it('should be able to compile html', function () {
	        expect(function () {
	            new _directiveHandler2.default(controllerService, '<div/>');
	        }).not.toThrow();
	    });
	});

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('directiveProvider', function () {
	    it('should be defined', function () {
	        expect(_directiveProvider2.default).toBeDefined();
	    });
	    it('should have a $get method', function () {
	        expect(angular.isFunction(_directiveProvider2.default.$get)).toBe(true);
	    });
	    it('should return undefined and not throw is the directive does not exist', function () {
	        var returned = {};
	        expect(function () {
	            returned = _directiveProvider2.default.$get('not existing');
	        }).not.toThrow();
	        expect(returned).toBeUndefined();
	    });
	    ['ng-if', 'ng:if', 'ngIf', 'ng-repeat', 'ng-click', 'ng-disabled', 'ng-bind', 'ng-model', 'translate', 'translate-value', 'ng-class'].forEach(function (item) {
	        it('should always contain the ' + item + 'directive', function () {
	            expect(_directiveProvider2.default.$get(item)).toBeDefined(item);
	        });
	    });
	
	    describe('puts and uses', function () {
	        var spy = void 0;
	        beforeEach(function () {
	            spy = jasmine.createSpy();
	            spy.and.returnValue(spy);
	            _directiveProvider2.default.$clean();
	        });
	        it('should allow adding directives', function () {
	            expect(function () {
	                _directiveProvider2.default.$put('my-directive', spy);
	            }).not.toThrow();
	            expect(spy).toHaveBeenCalled();
	            expect(_directiveProvider2.default.$get('my-directive')).toBe(spy);
	            expect(_directiveProvider2.default.$get('my:directive')).toBe(spy);
	            expect(_directiveProvider2.default.$get('myDirective')).toBe(spy);
	            expect(spy.calls.count()).toBe(1);
	        });
	        it('should not allow overwriting, but preserve first versions', function () {
	            _directiveProvider2.default.$put('my-directive', spy);
	            expect(function () {
	                _directiveProvider2.default.$put('my-directive', function () {});
	            }).toThrow();
	            expect(_directiveProvider2.default.$get('my-directive')).toBe(spy);
	        });
	        it('allow me to overwrite with a third parameter in a function that return true', function () {
	            _directiveProvider2.default.$put('my-directive', spy);
	            var anotherSpy = jasmine.createSpy();
	            anotherSpy.and.returnValue(anotherSpy);
	            expect(function () {
	                _directiveProvider2.default.$put('my-directive', anotherSpy, function () {
	                    return true;
	                });
	            }).not.toThrow();
	            expect(_directiveProvider2.default.$get('my-directive')).not.toBe(spy);
	            expect(_directiveProvider2.default.$get('my-directive')).toBe(anotherSpy);
	            expect(spy.calls.count()).toBe(1);
	            expect(anotherSpy.calls.count()).toBe(1);
	        });
	    });
	});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngClick', function () {
	    var controllerService = void 0,
	        myClick = void 0,
	        spy = void 0;
	    var ngClick = _directiveProvider2.default.$get('ngClick');
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            mySpy: spy
	        }, true);
	        myClick = ngClick.compile(controllerService, 'ctrl.mySpy(param1, param2)');
	    });
	    it('should have defined myIf', function () {
	        expect(myClick).toBeDefined();
	    });
	    it('should be a function', function () {
	        expect(myClick).toEqual(jasmine.any(Function));
	    });
	    it('should allow calling it', function () {
	        expect(function () {
	            myClick();
	        }).not.toThrow();
	    });
	    it('should call the spy when called', function () {
	        myClick();
	        expect(spy).toHaveBeenCalled();
	    });
	    it('should support locals', function () {
	        var object1 = function object1() {};
	        var object2 = function object2() {};
	        var locals = {
	            param1: object1,
	            param2: object2
	        };
	        myClick(locals);
	        expect(spy).toHaveBeenCalledWith(object1, object2);
	    });
	});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngIf', function () {
	    var controllerService = void 0,
	        myIf = void 0;
	    var ngIf = _directiveProvider2.default.$get('ng-if');
	    beforeEach(function () {
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            myBoolean: true
	        }, true);
	        controllerService.create();
	        myIf = ngIf.compile(controllerService, 'ctrl.myBoolean');
	    });
	    it('should have defined myIf', function () {
	        expect(myIf).toBeDefined();
	    });
	    it('should return undefined if no $digest was executed', function () {
	        expect(myIf.value()).toBeUndefined();
	    });
	    it('should return the value of the expression', function () {
	        controllerService.$apply();
	        expect(myIf.value()).toBe(true);
	    });
	    it('should return the latest evaluated value on a watch', function () {
	        controllerService.$apply();
	        controllerService.controllerInstance.myBoolean = angular.noop;
	        expect(myIf.value()).not.toBe(angular.noop);
	        controllerService.$apply();
	        expect(myIf.value()).toBe(angular.noop);
	    });
	    it('should allow attaching spys to the watching cycle', function () {
	        var mySpy = jasmine.createSpy();
	        myIf(mySpy);
	        controllerService.$apply();
	        expect(mySpy).toHaveBeenCalled();
	        expect(mySpy.calls.count()).toBe(1);
	    });
	    it('should allow deattaching spies to the watching cycle', function () {
	        var mySpy = jasmine.createSpy();
	        var watcher = myIf(mySpy);
	        watcher();
	        controllerService.$apply();
	        expect(mySpy).not.toHaveBeenCalled();
	    });
	    it('should only deattach the correcponding spy', function () {
	        var mySpy = jasmine.createSpy();
	        var mySpy2 = jasmine.createSpy();
	        var watcher = myIf(mySpy);
	        myIf(mySpy2);
	        watcher();
	        controllerService.$apply();
	        expect(mySpy).not.toHaveBeenCalled();
	        expect(mySpy2).toHaveBeenCalled();
	    });
	});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngModel', function () {
	    var controllerService = void 0,
	        myModel = void 0,
	        spy = void 0,
	        controller = void 0;
	    var ngModel = _directiveProvider2.default.$get('ngModel');
	    var expression = 'ctrl.myStringParameter';
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {}, true);
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	        myModel = ngModel.compile(controllerService, expression);
	    });
	    it('should be defined', function () {
	        expect(myModel).toBeDefined();
	    });
	    it('should update the controller when receiving a string', function () {
	        myModel('aValue');
	        expect(controller.myStringParameter).toBe('aValue');
	    });
	    it('should fire an digest when doing and assigment', function () {
	        controllerService.watch(expression, spy);
	        expect(spy).not.toHaveBeenCalled();
	        myModel('aValue');
	        expect(spy).toHaveBeenCalled();
	    });
	    it('should return the current value of current state', function () {
	        controller.myStringParameter = 'someValue';
	        expect(myModel()).toBe('someValue');
	    });
	    it('should not fire digests when consulting', function () {
	        controller.myStringParameter = 'someValue';
	        controllerService.watch(expression, spy);
	        myModel();
	        expect(spy).not.toHaveBeenCalled();
	    });
	    it('should allow array to fire changes', function () {
	        var object = {};
	        controllerService.watch(expression, function (newValue) {
	            object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
	        });
	        myModel(['a', 'V', 'a', 'l', 'u', 'e']);
	        expect(controller.myStringParameter).toBe('aValue');
	        expect(object).toEqual({
	            a: 1, //only once
	            aV: 1, //only once
	            aVa: 1, //only once
	            aVal: 1, //only once
	            aValu: 1, //only once
	            aValue: 1 //only once
	        });
	    });
	    it('should allow a second true parameter, to simulate the array', function () {
	        var object = {};
	        controllerService.watch(expression, function (newValue) {
	            object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
	        });
	        myModel('aValue', true);
	        expect(controller.myStringParameter).toBe('aValue');
	        expect(object).toEqual({
	            a: 1, //only once
	            aV: 1, //only once
	            aVa: 1, //only once
	            aVal: 1, //only once
	            aValu: 1, //only once
	            aValue: 1 //only once
	        });
	    });
	    it('should have a changes function', function () {
	        expect(myModel.changes).toEqual(jasmine.any(Function));
	    });
	    describe('changes', function () {
	        it('changes should only fire once per change (independent of watcher)', function () {
	            var watcherSpy = jasmine.createSpy();
	            controllerService.watch(expression, watcherSpy);
	            myModel.changes(spy);
	            myModel('aValue', true);
	            controller.myStringParameter = 'anotherValue';
	            controllerService.$apply();
	            expect(spy.calls.count()).toBe(6);
	            expect(watcherSpy.calls.count()).toBe(7);
	        });
	    });
	});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngTranslate', function () {
	    var controllerService = void 0,
	        myTranslate = void 0;
	    var ngTranslate = _directiveProvider2.default.$get('translate');
	    beforeEach(function () {
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            prop: 'TITLE'
	        }, true);
	        controllerService.create();
	        myTranslate = ngTranslate.compile(controllerService, '{{ctrl.prop}}');
	        ngTranslate.changeLanguage('en');
	        controllerService.$apply();
	    });
	    it('should allow calling the translate method', function () {
	        expect(function () {
	            myTranslate();
	        }).not.toThrow();
	    });
	    it('should return the translated value (once evaluated)', function () {
	        expect(myTranslate()).toBe('Hello');
	    });
	    it('should return the old value if it wasn\'t evaluated', function () {
	        myTranslate.changeLanguage('de');
	        expect(myTranslate()).toBe('Hello');
	        controllerService.$apply();
	        expect(myTranslate()).toBe('Hallo');
	    });
	    it('should allow me to attach to changes', function () {
	        var spy = jasmine.createSpy('translate');
	        myTranslate.changes(spy);
	        controllerService.controllerInstance.prop = 'FOO';
	        controllerService.$apply();
	        expect(spy).toHaveBeenCalledWith('This is a paragraph.');
	    });
	});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngBind', function () {
	    var controllerService = void 0,
	        myBind = void 0,
	        spy = void 0,
	        controller = void 0;
	    var ngBind = _directiveProvider2.default.$get('ngBind');
	    var expression = 'ctrl.myStringParameter';
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            myStringParameter: 'aValue'
	        }, true);
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	        myBind = ngBind.compile(controllerService, expression);
	    });
	    it('should be defined', function () {
	        expect(myBind).toBeDefined();
	    });
	    it('should be a function', function () {
	        expect(myBind).toEqual(jasmine.any(Function));
	    });
	    it('should not throw when called', function () {
	        expect(function () {
	            myBind();
	        }).not.toThrow();
	    });
	    it('should return undefined the first time it was attacher (watchers didn\'t run)', function () {
	        expect(myBind()).toBeUndefined();
	    });
	    it('should return the last watched value', function () {
	        controllerService.$apply();
	        expect(myBind()).toBe('aValue');
	        controller.myStringParameter = 'anotherValue';
	        expect(myBind()).toBe('aValue');
	        controllerService.$apply();
	        expect(myBind()).toBe('anotherValue');
	    });
	    it('should allow me to watch changes', function () {
	        myBind.changes(spy);
	        controllerService.$apply();
	        expect(spy).toHaveBeenCalledWith('aValue');
	    });
	});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngClass', function () {
	    var ngClass = _directiveProvider2.default.$get('ng-class');
	
	    var controller = void 0,
	        controllerService = void 0,
	        myClassText = void 0,
	        myClassExpression = void 0;
	    beforeEach(function () {
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            myStringParameter: 'my-class',
	            class1: true,
	            class2: false
	        }, true);
	        controller = controllerService.create();
	        myClassText = ngClass.compile(controllerService, 'ctrl.myStringParameter');
	        myClassExpression = ngClass.compile(controllerService, '{ "my-class": ctrl.class1, "my-other-class": ctrl.class2 }');
	    });
	    it('should be defined', function () {
	        expect(myClassText).toBeDefined();
	    });
	    it('should return the class, but only after the first $digest', function () {
	        expect(myClassText()).toBe('');
	        controllerService.$apply();
	        expect(myClassText()).toBe('my-class');
	    });
	    it('should accept semi build expressions', function () {
	        expect(myClassExpression()).toBe('');
	        controllerService.$apply();
	        expect(myClassExpression()).toBe('my-class');
	    });
	    it('should check if it has the class, regardless of the expression', function () {
	        expect(myClassText.hasClass('my-class')).toBe(false);
	        expect(myClassText.hasClass('my-other-class')).toBe(false);
	        expect(myClassExpression.hasClass('my-class')).toBe(false);
	        expect(myClassExpression.hasClass('my-other-class')).toBe(false);
	        controllerService.$apply();
	        expect(myClassText.hasClass('my-class')).toBe(true);
	        expect(myClassText.hasClass('my-other-class')).toBe(false);
	        expect(myClassExpression.hasClass('my-class')).toBe(true);
	        expect(myClassExpression.hasClass('my-other-class')).toBe(false);
	        controller.class2 = true;
	        controller.class1 = false;
	        controller.myStringParameter = 'my-other-class';
	        controllerService.$apply();
	        expect(myClassText.hasClass('my-class')).toBe(false);
	        expect(myClassText.hasClass('my-other-class')).toBe(true);
	        expect(myClassExpression.hasClass('my-class')).toBe(false);
	        expect(myClassExpression.hasClass('my-other-class')).toBe(true);
	    });
	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngRepeat', function () {
	    var controllerService = void 0,
	        myRepeat = void 0,
	        spy = void 0,
	        controller = void 0;
	    var ngRepeat = _directiveProvider2.default.$get('ngRepeat');
	    beforeEach(function () {
	        spy = jasmine.createSpy('click');
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            myArray: [{
	                a: 'a'
	            }, {
	                b: 'b'
	            }, {
	                c: 'c'
	            }, {
	                d: 'd'
	            }, {
	                e: 'e'
	            }, {
	                f: 'f'
	            }]
	        }, true);
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	        myRepeat = ngRepeat.compile(controllerService, 'items in ctrl.myArray');
	    });
	
	    afterEach(function () {
	        controllerService.$destroy();
	    });
	
	    it('should be defined', function () {
	        expect(myRepeat).toBeDefined();
	    });
	    it('should be a function', function () {
	        expect(myRepeat).toEqual(jasmine.any(Function));
	    });
	    it('should return an object before digest', function () {
	        expect(myRepeat()).toBeDefined();
	        expect(myRepeat()).toEqual(jasmine.any(Object));
	    });
	    it('should return an object representing the array', function () {
	        controllerService.$apply();
	        expect(Object.keys(myRepeat().differences.added).length).toBe(6);
	    });
	    describe('detect changes', function () {
	        beforeEach(function () {
	            // starting the collection
	            controller.myArray = [];
	            for (var index = 0; index < 10; index++) {
	                controller.myArray.push({
	                    initialKey: index
	                });
	            }
	            controllerService.$apply();
	        });
	        it('should detect reference changes', function () {
	            var firstValue = myRepeat();
	            controllerService.$apply(); //no change
	            var secondValue = myRepeat();
	            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
	            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
	            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
	            controller.myArray[0] = {
	                a: 'changed'
	            };
	            controllerService.$apply(); //changes change
	            secondValue = myRepeat();
	            // although the results seem wrong they are right
	            // what the ng repeat does it watch the collection,
	            // so "new references" will be marked as added and
	            // removed at the same time and items that MIGHT
	            // have changed, as modified.
	            // Is each specific item's scope responsability to
	            // watch itself, and respond properly
	            expect(firstValue.differences.added.length).toBe(10);
	            expect(secondValue.differences.added.length).toBe(1);
	            expect(firstValue.differences.removed.length).toBe(0);
	            expect(secondValue.differences.removed.length).toBe(1);
	            expect(firstValue.differences.modified.length).toBe(0);
	            expect(secondValue.differences.modified.length).toBe(9);
	        });
	        it('should not detect internal changes', function () {
	            var firstValue = myRepeat();
	            controller.myArray.forEach(function (element, index) {
	                element.initialKey = index + 5;
	            });
	            controllerService.$apply();
	            var secondValue = myRepeat();
	            // this is because since the not refernce of the array
	            // nor any reference of each of the immediate childrens has changed
	            // the watch didn't fire
	            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
	            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
	            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
	        });
	        it('should however, fire internal scopes watches', function () {
	            var firstValue = myRepeat();
	            var mySpies = [];
	            controller.myArray.forEach(function (element, index) {
	                element.initialKey = index + 5;
	                mySpies.push(jasmine.createSpy('spy' + index));
	                firstValue.objects[index].scope.$watch(myRepeat.keyIdentifier + '.initialKey', function (newValue, oldValue, scope) {
	                    mySpies[index](newValue, oldValue, scope);
	                });
	            });
	            controllerService.$apply(); // watches fire the first time with the new value on both parameters (and the scope)
	            var secondValue = myRepeat();
	            // as before
	            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
	            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
	            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
	            mySpies.forEach(function (spy, index) {
	                expect(spy).toHaveBeenCalledWith(index + 5, index + 5, firstValue.objects[index].scope);
	            });
	        });
	    });
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _quickmock = __webpack_require__(53);
	
	var _quickmock2 = _interopRequireDefault(_quickmock);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('quickmock', function () {
	    var controllerMocker = void 0;
	    beforeEach(function () {
	        controllerMocker = (0, _quickmock2.default)({
	            providerName: 'withInjections',
	            moduleName: 'test',
	            mockModules: []
	        });
	    });
	    it('should have defined a controllerMocker', function () {
	        expect(controllerMocker).toBeDefined();
	    });
	    it('should have modified angular modules', function () {
	        expect(_quickmock2.default.mockHelper).toBeDefined();
	    });
	    it('should inject mocked object first, then real', function () {
	        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
	        controllerMocker.$timeout();
	        expect(controllerMocker.$timeout).toHaveBeenCalled();
	    });
	    it('should inject mocked object first, then real', function () {
	        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
	        expect(controllerMocker.$q.and.identity()).toBe('___$q');
	        for (var key in controllerMocker.$timeout) {
	            if (controllerMocker.$timeout.hasOwnProperty(key)) {
	                expect(controllerMocker.$timeout[key]).toBe(controllerMocker.$mocks.$timeout[key]);
	            }
	        }
	        for (var _key in controllerMocker.$q) {
	            if (controllerMocker.$q.hasOwnProperty(_key)) {
	                expect(controllerMocker.$q[_key]).toBe(controllerMocker.$mocks.$q[_key]);
	            }
	        }
	        expect(controllerMocker.$q).toBe(controllerMocker.$mocks.$q);
	    });
	});
	describe('controller', function () {
	    var controllerMocker = void 0,
	        spy = void 0;
	    beforeEach(function () {
	        spy = jasmine.createSpy('magicClick');
	        controllerMocker = (0, _quickmock2.default)({
	            providerName: 'emptyController',
	            moduleName: 'test',
	            mockModules: [],
	            controller: {
	                parentScope: {
	                    somethingToCall: spy
	                },
	                bindToController: {
	                    somethingToCall: '='
	                },
	                controllerAs: 'ctrl'
	            }
	        });
	    });
	    it('should allow me to perform clicks', function () {
	        expect(controllerMocker.ngClick).toEqual(jasmine.any(Function));
	        var myClick = controllerMocker.ngClick('ctrl.somethingToCall(aObj, bObj)'),
	            reference1 = function reference1() {},
	            reference2 = function reference2() {},
	            locals = {
	            aObj: reference1,
	            bObj: reference2
	        };
	        myClick(locals);
	        expect(spy).toHaveBeenCalledWith(reference1, reference2);
	    });
	});

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _quickmockMockHelper = __webpack_require__(54);
	
	var _quickmockMockHelper2 = _interopRequireDefault(_quickmockMockHelper);
	
	var _common = __webpack_require__(21);
	
	var _controllerHandler = __webpack_require__(31);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mocker = function (angular) {
	    var opts, mockPrefix;
	    var controllerDefaults = function controllerDefaults(flag) {
	        return {
	            bindToController: true,
	            parentScope: {},
	            controllerAs: 'controller',
	            isDefault: !flag
	        };
	    };
	    quickmock.MOCK_PREFIX = mockPrefix = quickmock.MOCK_PREFIX || '___';
	    quickmock.USE_ACTUAL = 'USE_ACTUAL_IMPLEMENTATION';
	    quickmock.MUTE_LOGS = false;
	    var rootScope = void 0;
	
	    function quickmock(options, root) {
	        rootScope = root;
	        opts = assertRequiredOptions(options);
	        return mockProvider();
	    }
	
	    function mockProvider() {
	        var allModules = opts.mockModules.concat(['ngMock']),
	            injector = angular.injector(allModules.concat([opts.moduleName])),
	            modObj = angular.module(opts.moduleName),
	            invokeQueue = modObj._invokeQueue || [],
	            providerType = getProviderType(opts.providerName, invokeQueue),
	            mocks = {},
	            provider = {};
	        angular.forEach(allModules || [], function (modName) {
	            invokeQueue = invokeQueue.concat(angular.module(modName)._invokeQueue);
	        });
	
	        if (opts.inject) {
	            injector.invoke(opts.inject);
	        }
	
	        if (providerType) {
	            // Loop through invokeQueue, find this provider's dependencies and prefix
	            // them so Angular will inject the mocked versions
	            angular.forEach(invokeQueue, function (providerData) {
	                var currProviderName = providerData[2][0];
	                if (currProviderName === opts.providerName) {
	                    var currProviderDeps = providerData[2][1];
	
	                    if (angular.isFunction(currProviderDeps)) {
	                        currProviderDeps = currProviderDeps.$inject || injector.annotate(currProviderDeps);
	                    }
	
	                    for (var i = 0; i < currProviderDeps.length; i++) {
	                        if (!angular.isFunction(currProviderDeps[i])) {
	                            var depName = currProviderDeps[i];
	                            mocks[depName] = getMockForProvider(depName, currProviderDeps, i);
	                        }
	                    }
	                }
	            });
	
	            if (providerType === 'directive') {
	                setupDirective();
	            } else {
	                setupInitializer();
	            }
	        }
	
	        angular.forEach(invokeQueue, function (providerData) {
	            // Remove any prefixed dependencies that persisted from a previous call,
	            // and check for any non-annotated services
	            sanitizeProvider(providerData, injector);
	        });
	
	        return provider;
	
	        function setupInitializer() {
	            provider = initProvider();
	            if (opts.spyOnProviderMethods) {
	                spyOnProviderMethods(provider);
	            }
	            provider.$mocks = mocks;
	            provider.$initialize = setupInitializer;
	        }
	
	        function initProvider() {
	            switch (providerType) {
	                case 'controller':
	                    var toReturn = _controllerHandler2.default.clean(rootScope).addModules(allModules.concat(opts.moduleName)).bindWith(opts.controller.bindToController).setScope(opts.controller.parentScope).setLocals(mocks).new(opts.providerName, opts.controller.controllerAs);
	                    toReturn.create();
	                    for (var key in mocks) {
	                        if (mocks.hasOwnProperty(key) && toReturn.controllerInstance[key]) {
	                            mocks[key] = toReturn.controllerInstance[key];
	                        }
	                    }
	                    if (opts.controller.isDefault) {
	                        return toReturn.controllerInstance;
	                    }
	                    return toReturn;
	                case 'filter':
	                    var $filter = injector.get('$filter');
	                    return $filter(opts.providerName);
	                case 'animation':
	                    return {
	                        $animate: injector.get('$animate'),
	                        $initialize: function initAnimation() {
	                            angular.mock.module('ngAnimateMock');
	                        }
	                    };
	                default:
	                    return injector.get(opts.providerName);
	            }
	        }
	
	        function setupDirective() {
	            var $compile = injector.get('$compile');
	            provider.$scope = injector.get('$rootScope').$new();
	            provider.$mocks = mocks;
	
	            provider.$compile = function quickmockCompile(html) {
	                html = html || opts.html;
	                if (!html) {
	                    throw new Error('quickmock: Cannot compile "' + opts.providerName + '" directive. No html string/object provided.');
	                }
	                if (angular.isObject(html)) {
	                    html = generateHtmlStringFromObj(html);
	                }
	                provider.$element = angular.element(html);
	                prefixProviderDependencies(opts.providerName, invokeQueue);
	                $compile(provider.$element)(provider.$scope);
	                prefixProviderDependencies(opts.providerName, invokeQueue, true);
	                provider.$isoScope = provider.$element.isolateScope();
	                provider.$scope.$digest();
	            };
	        }
	
	        function getMockForProvider(depName, currProviderDeps, i) {
	            var depType = getProviderType(depName, invokeQueue),
	                mockServiceName = depName;
	            if (opts.mocks[mockServiceName] && opts.mocks[mockServiceName] !== quickmock.USE_ACTUAL) {
	                return opts.mocks[mockServiceName];
	            } else if (opts.mocks[mockServiceName] && opts.mocks[mockServiceName] === quickmock.USE_ACTUAL) {
	                quickmockLog('quickmock: Using actual implementation of "' + depName + '" ' + depType + ' instead of mock');
	            } else if (depType === 'value' || depType === 'constant') {
	                if (injector.has(mockPrefix + depName)) {
	                    mockServiceName = mockPrefix + depName;
	                    currProviderDeps[i] = mockServiceName;
	                } else {
	                    quickmockLog('quickmock: Using actual implementation of "' + depName + '" ' + depType + ' instead of mock');
	                }
	            } else if (depName.indexOf(mockPrefix) !== 0) {
	                mockServiceName = mockPrefix + depName;
	                currProviderDeps[i] = mockServiceName;
	            }
	            if (!injector.has(mockServiceName)) {
	                if (opts.useActualDependencies) {
	                    quickmockLog('quickmock: Using actual implementation of "' + depName + '" ' + depType + ' instead of mock');
	                    mockServiceName = mockServiceName.replace(mockPrefix, '');
	                } else {
	                    throw new Error('quickmock: Cannot inject mock for "' + depName + '" because no such mock exists. Please write a mock ' + depType + ' called "' + mockServiceName + '" (or set the useActualDependencies to true) and try again.');
	                }
	            }
	            return injector.get(mockServiceName);
	        }
	    }
	
	    function sanitizeProvider(providerData, injector) {
	        if (angular.isString(providerData[2][0]) && providerData[2][0].indexOf(mockPrefix) === -1) {
	            if (angular.isFunction(providerData[2][1])) {
	                // provider declaration function has been provided without the array annotation,
	                // so we need to annotate it so the invokeQueue can be prefixed
	                var annotatedDependencies = injector.annotate(providerData[2][1]);
	                delete providerData[2][1].$inject;
	                annotatedDependencies.push(providerData[2][1]);
	                providerData[2][1] = annotatedDependencies;
	            }
	            var currProviderDeps = providerData[2][1];
	            if (angular.isArray(currProviderDeps)) {
	                for (var i = 0; i < currProviderDeps.length - 1; i++) {
	                    if (currProviderDeps[i].indexOf(mockPrefix) === 0) {
	                        currProviderDeps[i] = currProviderDeps[i].replace(mockPrefix, '');
	                    }
	                }
	            }
	        }
	    }
	
	    function assertRequiredOptions(options) {
	        if (!window.angular) {
	            throw new Error('quickmock: Cannot initialize because angular is not available. Please load angular before loading quickmock.js.');
	        }
	        if (!options.providerName && !options.configBlocks && !options.runBlocks) {
	            throw new Error('quickmock: No providerName given. You must give the name of the provider/service you wish to test, or set the configBlocks or runBlocks flags.');
	        }
	        if (!options.moduleName) {
	            throw new Error('quickmock: No moduleName given. You must give the name of the module that contains the provider/service you wish to test.');
	        }
	        options.mockModules = options.mockModules || [];
	        options.mocks = options.mocks || {};
	        options.controller = (0, _common.extend)(options.controller, controllerDefaults(angular.isDefined(options.controller)));
	        return options;
	    }
	
	    function spyOnProviderMethods(provider) {
	        angular.forEach(provider, function (property, propertyName) {
	            if (angular.isFunction(property)) {
	                if (window.jasmine && window.spyOn && !property.calls) {
	                    var spy = spyOn(provider, propertyName);
	                    if (spy.andCallThrough) {
	                        spy.andCallThrough();
	                    } else {
	                        spy.and.callThrough();
	                    }
	                } else if (window.sinon && window.sinon.spy) {
	                    window.sinon.spy(provider, propertyName);
	                }
	            }
	        });
	    }
	
	    function getProviderType(providerName, invokeQueue) {
	        for (var i = 0; i < invokeQueue.length; i++) {
	            var providerInfo = invokeQueue[i];
	            if (providerInfo[2][0] === providerName) {
	                switch (providerInfo[0]) {
	                    case '$provide':
	                        return providerInfo[1];
	                    case '$controllerProvider':
	                        return 'controller';
	                    case '$compileProvider':
	                        return 'directive';
	                    case '$filterProvider':
	                        return 'filter';
	                    case '$animateProvider':
	                        return 'animation';
	                }
	            }
	        }
	        return null;
	    }
	
	    function prefixProviderDependencies(providerName, invokeQueue, unprefix) {
	        angular.forEach(invokeQueue, function (providerData) {
	            if (providerData[2][0] === providerName && providerData[2][0].indexOf(mockPrefix) === -1) {
	                var currProviderDeps = providerData[2][1];
	                if (angular.isArray(currProviderDeps)) {
	                    for (var i = 0; i < currProviderDeps.length - 1; i++) {
	                        if (unprefix) {
	                            currProviderDeps[i] = currProviderDeps[i].replace(mockPrefix, '');
	                        } else if (currProviderDeps[i].indexOf(mockPrefix) !== 0) {
	                            currProviderDeps[i] = mockPrefix + currProviderDeps[i];
	                        }
	                    }
	                }
	            }
	        });
	    }
	
	    function generateHtmlStringFromObj(html) {
	        if (!html.$tag) {
	            throw new Error('quickmock: Cannot compile "' + opts.providerName + '" directive. Html object does not contain $tag property.');
	        }
	        var htmlAttrs = html,
	            tagName = htmlAttrs.$tag,
	            htmlContent = htmlAttrs.$content;
	        html = '<' + tagName + ' ';
	        angular.forEach(htmlAttrs, function (val, attr) {
	            if (attr !== '$content' && attr !== '$tag') {
	                html += snake_case(attr) + (val ? '="' + val + '" ' : ' ');
	            }
	        });
	        html += htmlContent ? '>' + htmlContent : '>';
	        html += '</' + tagName + '>';
	        return html;
	    }
	
	    function quickmockLog(msg) {
	        if (!quickmock.MUTE_LOGS) {
	            console.log(msg);
	        }
	    }
	
	    var SNAKE_CASE_REGEXP = /[A-Z]/g;
	
	    function snake_case(name, separator) {
	        separator = separator || '-';
	        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
	            return (pos ? separator : '') + letter.toLowerCase();
	        });
	    }
	
	    return quickmock;
	}(angular);
	(0, _quickmockMockHelper2.default)(mocker);
	exports.default = mocker;

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function loadHelper(mocker) {
	    (function (quickmock) {
	        var hasBeenMocked = {},
	            origModuleFunc = angular.module;
	        quickmock.originalModules = angular.module;
	        angular.module = decorateAngularModule;
	
	        quickmock.mockHelper = {
	            hasBeenMocked: hasBeenMocked
	        };
	
	        function decorateAngularModuleObject(modObj) {
	            var methods = getDecoratedMethods(modObj);
	            angular.forEach(methods, function (method, methodName) {
	                modObj[methodName] = method;
	            });
	            return modObj;
	        }
	
	        function decorateAngularModule(name, requires, configFn) {
	            var modObj = origModuleFunc(name, requires, configFn);
	            return decorateAngularModuleObject(modObj);
	        }
	
	        function getDecoratedMethods(modObj) {
	
	            function basicMock(providerName, initFunc, providerType) {
	                hasBeenMocked[providerName] = true;
	                var newModObj = modObj[providerType](quickmock.MOCK_PREFIX + providerName, initFunc);
	                return decorateAngularModuleObject(newModObj);
	            }
	
	            return {
	                mockService: function mockService(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'service', modObj);
	                },
	                mockFactory: function mockFactory(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'factory', modObj);
	                },
	
	                mockFilter: function mockFilter(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'filter', modObj);
	                },
	
	                mockController: function mockController(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'controller', modObj);
	                },
	
	                mockProvider: function mockProvider(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'provider', modObj);
	                },
	
	                mockValue: function mockValue(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'value', modObj);
	                },
	
	                mockConstant: function mockConstant(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'constant', modObj);
	                },
	
	                mockAnimation: function mockAnimation(providerName, initFunc) {
	                    return basicMock(providerName, initFunc, 'animation', modObj);
	                }
	            };
	        }
	    })(mocker);
	}
	exports.default = loadHelper;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Config;
	
	var _directiveProvider = __webpack_require__(19);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Config() {
	    _directiveProvider2.default.useModule(angular.module('test', ['ng', 'pascalprecht.translate']).controller('emptyController', [function () {
	        this.name = 'emptyController';
	    }]).controller('withInjections', ['$q', '$timeout', function ($q, t) {
	        this.$q = $q;
	        this.$timeout = t;
	    }]).controller('withBindings', [function () {
	        this.boundProperty = this.boundProperty + ' modified';
	    }]).config(['$translateProvider', function ($translateProvider) {
	        $translateProvider.translations('en', {
	            TITLE: 'Hello',
	            FOO: 'This is a paragraph.',
	            BUTTON_LANG_EN: 'english',
	            BUTTON_LANG_DE: 'german'
	        });
	        $translateProvider.translations('de', {
	            TITLE: 'Hallo',
	            FOO: 'Dies ist ein Paragraph.',
	            BUTTON_LANG_EN: 'englisch',
	            BUTTON_LANG_DE: 'deutsch'
	        });
	        $translateProvider.preferredLanguage('en');
	        $translateProvider.use('en');
	    }]).mockService('$q', [function () {
	        return jasmine.createSpy('___$q');
	    }]).mockService('$timeout', ['$timeout', function () {
	        return jasmine.createSpy('___$timeout');
	    }]).name);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTc4MDlhMGJkNmNhYWY0MTAyZTU/YWE1OSIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcz84MjJhIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsaWNrSFRNTC5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdJZkhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nTW9kZWxIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0JpbmRIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ1RyYW5zbGF0ZUhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nQ2xhc3NIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nTW9kZWwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nQ2xhc3Muc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdSZXBlYXQuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzIiwid2VicGFjazovLy8uL3NyYy9xdWlja21vY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzIiwid2VicGFjazovLy8uL2FwcC9jb21wbGV0ZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSLEVBQW9DLE9BQXBDLEc7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQsaUNBQWdDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQsb0JBQW9CLEdBQUcsRUFBRTs7QUFFampCLHFHQUFvRyxtQkFBbUIsRUFBRSxtQkFBbUIsa0dBQWtHOztBQUU5TztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0RBQWlELDBDQUEwQywwREFBMEQsRUFBRTs7QUFFdko7QUFDQSx1REFBc0QsSUFBSTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFtQiwrQ0FBK0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUNBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBMkMsWUFBWTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1U0E7O0FBR0E7O0FBS0E7Ozs7OztBQUNBLEtBQUksYUFBYyxZQUFXO0FBQ3pCLFNBQUksV0FBVztBQUNYLHFCQUFZLG9CQUFZO0FBRGIsTUFBZjtBQUdBLFlBQU8sUUFBUDtBQUNILEVBTGdCLEVBQWpCO0FBTUEsVUFBUyxZQUFULEVBQXVCLFlBQVc7QUFDOUIsY0FBUyxZQUFULEVBQXVCLFlBQVc7QUFDOUIsWUFBRywyQ0FBSCxFQUFnRCxZQUFXO0FBQ3ZELG9CQUFPLHlCQUFZLFNBQVosQ0FBUCxFQUErQixJQUEvQixDQUFvQyxJQUFwQztBQUNBLG9CQUFPLHlCQUFZLEVBQVosQ0FBUCxFQUF3QixJQUF4QixDQUE2QixJQUE3QjtBQUNBLGlCQUFNLGFBQWE7QUFDZix5QkFBUSxDQURPO0FBRWYsb0JBQUc7QUFGWSxjQUFuQjtBQUlBLG9CQUFPLHlCQUFZLFVBQVosQ0FBUCxFQUFnQyxJQUFoQyxDQUFxQyxJQUFyQztBQUNBLGlCQUFJLHlCQUFZLFVBQVosQ0FBSixFQUE2QjtBQUN6Qix3QkFBTyxZQUFXO0FBQ2QsMkJBQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixLQUF0QixDQUE0QixVQUE1QjtBQUNILGtCQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHSDtBQUNKLFVBYkQ7QUFjSCxNQWZEO0FBZ0JBLGNBQVMsZ0JBQVQsRUFBMkIsWUFBVztBQUNsQyxZQUFHLDRCQUFILEVBQWlDLFlBQVc7QUFDeEMsb0JBQU8sWUFBVztBQUNkO0FBQ0gsY0FGRCxFQUVHLEdBRkgsQ0FFTyxPQUZQO0FBR0Esb0JBQU8sWUFBVztBQUNkLDhDQUFnQixFQUFoQjtBQUNILGNBRkQsRUFFRyxHQUZILENBRU8sT0FGUDtBQUdBLG9CQUFPLFlBQVc7QUFDZCw4Q0FBZ0I7QUFDWiw2QkFBUTtBQURJLGtCQUFoQjtBQUdILGNBSkQsRUFJRyxHQUpILENBSU8sT0FKUDtBQUtILFVBWkQ7QUFhQSxZQUFHLHdDQUFILEVBQTZDLFlBQVc7QUFDcEQsb0JBQU8sK0JBQWtCLE9BQWxCLENBQTBCLElBQTFCLENBQVAsRUFBd0MsR0FBeEMsQ0FBNEMsSUFBNUMsQ0FBaUQsQ0FBQyxDQUFsRDtBQUNBLG9CQUFPLDZCQUFnQixFQUFoQixFQUFvQixPQUFwQixDQUE0QixJQUE1QixDQUFQLEVBQTBDLEdBQTFDLENBQThDLElBQTlDLENBQW1ELENBQUMsQ0FBcEQ7QUFDQSxvQkFBTyw2QkFBZ0I7QUFDbkIseUJBQVE7QUFEVyxjQUFoQixFQUVKLE9BRkksQ0FFSSxJQUZKLENBQVAsRUFFa0IsR0FGbEIsQ0FFc0IsSUFGdEIsQ0FFMkIsQ0FBQyxDQUY1QjtBQUdILFVBTkQ7QUFPQSxZQUFHLDRDQUFILEVBQWlELFlBQVc7QUFDeEQsb0JBQU8sNkJBQWdCLElBQWhCLEVBQXNCLE1BQTdCLEVBQXFDLElBQXJDLENBQTBDLENBQTFDO0FBQ0Esb0JBQU8sNkJBQWdCLFNBQWhCLEVBQTJCLE1BQWxDLEVBQTBDLElBQTFDLENBQStDLENBQS9DO0FBQ0gsVUFIRDtBQUlBLFlBQUcsMENBQUgsRUFBK0MsWUFBVztBQUN0RCxpQkFBTSxVQUFVLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBaEI7QUFDQSxpQkFBTSxVQUFVLFNBQWhCO0FBQ0EsaUJBQU0sVUFBVTtBQUNaLHlCQUFRLENBREk7QUFFWixvQkFBRyxTQUZTO0FBR1osb0JBQUc7QUFIUyxjQUFoQjtBQUtBLGNBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsT0FBbkIsRUFBNEIsT0FBNUIsQ0FBb0MsVUFBUyxLQUFULEVBQWdCO0FBQ2hELHdCQUFPLFlBQVc7QUFDZCx5QkFBTSxTQUFTLDZCQUFnQixLQUFoQixDQUFmO0FBQ0EsNEJBQU8sT0FBTyxNQUFkLEVBQXNCLElBQXRCLENBQTJCLE1BQU0sTUFBTixHQUFlLENBQTFDO0FBQ0gsa0JBSEQsRUFHRyxHQUhILENBR08sT0FIUDtBQUlILGNBTEQ7QUFNSCxVQWREO0FBZUEsWUFBRyw2REFBSCxFQUFrRSxZQUFXO0FBQ3pFLGlCQUFNLFVBQVUsNkJBQWdCLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsSUFBdkIsQ0FBaEIsQ0FBaEI7QUFBQSxpQkFDSSxVQUFVLDZCQUFnQixDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLENBQWhCLENBRGQ7QUFFQSxvQkFBTyxRQUFRLENBQVIsQ0FBUCxFQUFtQixJQUFuQixDQUF3QixJQUF4QjtBQUNBLG9CQUFPLFFBQVEsTUFBZixFQUF1QixJQUF2QixDQUE0QixDQUE1QjtBQUNBLG9CQUFPLFFBQVEsQ0FBUixDQUFQLEVBQW1CLElBQW5CLENBQXdCLElBQXhCO0FBQ0Esb0JBQU8sUUFBUSxNQUFmLEVBQXVCLElBQXZCLENBQTRCLENBQTVCO0FBQ0gsVUFQRDtBQVFILE1BaEREO0FBaURBLGNBQVMsYUFBVCxFQUF3QixZQUFXO0FBQy9CLFlBQUcscURBQUgsRUFBMEQsWUFBVztBQUNqRSxvQkFBTyxvQkFBWSxNQUFaLEdBQXFCLEtBQTVCLEVBQW1DLElBQW5DLENBQXdDLFdBQVcsVUFBbkQ7QUFDSCxVQUZEO0FBR0EsWUFBRyxnRUFBSCxFQUFxRSxZQUFXO0FBQzVFLGlCQUFNLFFBQVEsV0FBVyxVQUFYLENBQXNCLElBQXRCLEVBQWQ7QUFDQSxvQkFBTyxvQkFBWSxNQUFaLENBQW1CLEtBQW5CLENBQVAsRUFBa0MsSUFBbEMsQ0FBdUMsS0FBdkM7QUFDSCxVQUhEO0FBSUEsWUFBRywyRUFBSCxFQUFnRixZQUFXO0FBQ3ZGLGlCQUFNLFFBQVEsV0FBVyxVQUFYLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQWQ7QUFDQSxvQkFBTyxvQkFBWSxNQUFaLENBQW1CLEtBQW5CLENBQVAsRUFBa0MsSUFBbEMsQ0FBdUMsS0FBdkM7QUFDSCxVQUhEO0FBSUEsWUFBRywrREFBSCxFQUFvRSxZQUFXO0FBQzNFLGlCQUFNLFNBQVM7QUFDWCxvQkFBRyxFQURRLEU7QUFFWCxvQkFBRztBQUZRLGNBQWY7QUFJQSxpQkFBSSxzQkFBSjtBQUNBLG9CQUFPLFlBQVc7QUFDZCxpQ0FBZ0Isb0JBQVksTUFBWixDQUFtQixNQUFuQixDQUFoQjtBQUNILGNBRkQsRUFFRyxHQUZILENBRU8sT0FGUDtBQUdBLG9CQUFPLGNBQWMsQ0FBckIsRUFBd0IsSUFBeEIsQ0FBNkIsT0FBTyxDQUFwQztBQUNBLG9CQUFPLGNBQWMsQ0FBckIsRUFBd0IsSUFBeEIsQ0FBNkIsT0FBTyxDQUFwQztBQUNILFVBWEQ7QUFZQSxZQUFHLHdEQUFILEVBQTZELFlBQVc7QUFDcEUseUNBQWtCLEtBQWxCO0FBQ0EsaUJBQU0sZ0JBQWdCLDRCQUFrQixRQUFsQixDQUEyQjtBQUM3QyxnQ0FBZTtBQUQ4QixjQUEzQixFQUVuQixRQUZtQixDQUVWO0FBQ1IsZ0NBQWU7QUFEUCxjQUZVLEVBSW5CLEdBSm1CLENBSWYsY0FKZSxDQUF0Qjs7QUFNQSxvQkFBTywwQ0FBYSxZQUFiLENBQTBCLGFBQTFCLENBQVAsRUFBaUQsSUFBakQsQ0FBc0QsSUFBdEQ7QUFDQSwyQkFBYyxRQUFkO0FBQ0gsVUFWRDtBQVdILE1BbkNEO0FBb0NILEVBdEdELEU7Ozs7Ozs7Ozs7Ozs7OztBQ2ZBOzs7O0FBQ0E7O0FBR0E7Ozs7QUFDQTs7Ozs7O0tBYWEsWSxXQUFBLFk7OztzQ0FDVyxNLEVBQVE7QUFDeEIsb0JBQU8sa0JBQWtCLFlBQXpCO0FBQ0g7OztBQUNELDJCQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEIsUUFBOUIsRUFBd0MsT0FBeEMsRUFBaUQsS0FBakQsRUFBd0QsT0FBeEQsRUFBaUU7QUFBQTs7QUFDN0QsY0FBSyxZQUFMLEdBQW9CLFFBQXBCO0FBQ0EsY0FBSyxtQkFBTCxHQUEyQixTQUFTLFlBQXBDO0FBQ0EsY0FBSyxXQUFMLEdBQW1CLFFBQVEsS0FBUixFQUFuQjtBQUNBLGNBQUssV0FBTCxHQUFtQixNQUFuQjtBQUNBLGNBQUssZUFBTCxHQUF1QixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsRUFBdkI7QUFDQSxjQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxjQUFLLE1BQUwsR0FBYyxvQkFBTyxXQUFXLEVBQWxCLEVBQXNCO0FBQzVCLHFCQUFRLEtBQUs7QUFEZSxVQUF0QixFQUdWLEtBSFUsQ0FBZDtBQUlBLGNBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNBLGNBQUssVUFBTCxHQUFrQixvQkFBWSxVQUE5QjtBQUNBLGNBQUssYUFBTCxHQUFxQjtBQUNqQixvQkFBTyxFQURVO0FBRWpCLHlCQUFZO0FBRkssVUFBckI7QUFJSDs7OztrQ0FDUTtBQUNMLGtCQUFLLFVBQUwsQ0FBZ0IsTUFBaEI7QUFDSDs7O29DQUNVO0FBQ1Asa0JBQUssVUFBTCxHQUFrQixTQUFsQjtBQUNBLGlCQUFJLEtBQUssV0FBTCxJQUFvQixRQUFRLFVBQVIsQ0FBbUIsS0FBSyxXQUFMLENBQWlCLFFBQXBDLENBQXhCLEVBQXVFO0FBQ25FLHNCQUFLLFdBQUwsQ0FBaUIsUUFBakI7QUFDSDtBQUNELGdDQUFNLElBQU47QUFDSDs7O2dDQUNNLFEsRUFBVTtBQUFBOztBQUNiLGtCQUFLLFFBQUwsR0FBZ0IsUUFBUSxTQUFSLENBQWtCLFFBQWxCLEtBQStCLGFBQWEsSUFBNUMsR0FBbUQsUUFBbkQsR0FBOEQsS0FBSyxRQUFuRjtBQUNBLDhDQUFvQixJQUFwQjs7QUFFQSxrQkFBSyxxQkFBTCxHQUNJLHVCQUFXLElBQVgsQ0FBZ0IsS0FBSyxXQUFyQixFQUNDLE1BREQsQ0FDUSxLQUFLLFlBRGIsRUFDMkIsS0FBSyxXQURoQyxFQUM2QyxLQUFLLFFBRGxELEVBQzRELEtBQUssbUJBRGpFLEVBQ3NGLEtBQUssTUFEM0YsQ0FESjtBQUdBLGtCQUFLLGtCQUFMLEdBQTBCLEtBQUsscUJBQUwsRUFBMUI7O0FBRUEsaUJBQUksZ0JBQUo7QUFBQSxpQkFBYSxPQUFPLElBQXBCO0FBQ0Esb0JBQU8sVUFBVSxLQUFLLGVBQUwsQ0FBcUIsS0FBckIsRUFBakIsRUFBK0M7QUFDM0Msc0JBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkI7QUFDSDtBQUNELGtCQUFLLElBQUksR0FBVCxJQUFnQixLQUFLLFFBQXJCLEVBQStCO0FBQzNCLHFCQUFJLEtBQUssUUFBTCxDQUFjLGNBQWQsQ0FBNkIsR0FBN0IsQ0FBSixFQUF1QztBQUNuQyx5QkFBSSxTQUFTLDRCQUFvQixJQUFwQixDQUF5QixLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQXpCLENBQWI7QUFBQSx5QkFDSSxXQUFXLE9BQU8sQ0FBUCxLQUFhLEdBRDVCO0FBQUEseUJBRUksU0FBUyxDQUFDLFFBQUQsRUFBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLElBQXJCLENBQTBCLEVBQTFCLENBRmI7QUFHQSx5QkFBSSxPQUFPLENBQVAsTUFBYyxHQUFsQixFQUF1QjtBQUFBOztBQUVuQixpQ0FBTSxZQUFZLE1BQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsTUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLE1BQXpCLElBQW1DLHdCQUFuRCxFQUFnRSxLQUFLLGtCQUFyRSxDQUFsQjtBQUNBLGlDQUFNLGFBQWEsTUFBSyxLQUFMLENBQVcsUUFBWCxFQUFxQixNQUFLLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBOEIsTUFBOUIsSUFBd0Msd0JBQTdELEVBQTBFLEtBQUssV0FBL0UsQ0FBbkI7QUFDQSxtQ0FBSyxXQUFMLENBQWlCLEdBQWpCLENBQXFCLFVBQXJCLEVBQWlDLFlBQU07QUFDbkM7QUFDQTtBQUNILDhCQUhEO0FBSm1CO0FBUXRCO0FBQ0o7QUFDSjtBQUNELGtCQUFLLE1BQUwsR0FBYyxTQUFkO0FBQ0Esb0JBQU8sS0FBSyxrQkFBWjtBQUNIOzs7K0JBQ0ssVSxFQUFZLFEsRUFBVTtBQUN4QixpQkFBSSxDQUFDLEtBQUssa0JBQVYsRUFBOEI7QUFDMUIsc0JBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixTQUExQjtBQUNBLHdCQUFPLElBQVA7QUFDSDtBQUNELG9CQUFPLEtBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixVQUE1QixFQUF3QyxRQUF4QyxDQUFQO0FBQ0g7OztpQ0FDTyxVLEVBQVk7QUFDaEIsb0JBQU8sS0FBSyxlQUFMLENBQXFCLFVBQXJCLEVBQWlDLFVBQWpDLENBQVA7QUFDSDs7OzJDQUNpQjtBQUNkLGlCQUFNLE9BQU8sdUJBQVUsU0FBVixDQUFiO0FBQ0EsaUJBQU0sWUFBWSw0QkFBa0IsSUFBbEIsQ0FBdUIsVUFBVSxDQUFWLENBQXZCLENBQWxCO0FBQ0Esa0JBQUssQ0FBTCxJQUFVLElBQVY7QUFDQSxvQkFBTyxVQUFVLE9BQVYsQ0FBa0IsS0FBbEIsQ0FBd0IsU0FBeEIsRUFBbUMsSUFBbkMsQ0FBUDtBQUNIOzs7cUNBQ1csUSxFQUFVO0FBQ2xCLG9CQUFPLHVDQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR0w7O0FBR0E7O0FBR0E7O0FBR0E7O0FBR0E7O0FBR0E7O0FBR0E7O0FBSUE7O0FBR0EsS0FBSSxvQkFBcUIsWUFBVztBQUNoQyxTQUFJLGFBQWEsUUFBUSxRQUFSLENBQWlCLENBQUMsSUFBRCxFQUFPLHdCQUFQLENBQWpCLEVBQW1ELEdBQW5ELENBQXVELFlBQXZELENBQWpCO0FBQ0EsU0FBTSxhQUFhLElBQUksR0FBSixFQUFuQjtBQUFBLFNBQ0ksV0FBVyxFQURmO0FBQUEsU0FFSSxTQUFTLFFBQVEsUUFBUixDQUFpQixDQUFDLElBQUQsQ0FBakIsRUFBeUIsR0FBekIsQ0FBNkIsUUFBN0IsQ0FGYjtBQUFBLFNBR0ksV0FBVyxRQUFRLFFBQVIsQ0FBaUIsQ0FBQyxJQUFELENBQWpCLEVBQXlCLEdBQXpCLENBQTZCLFVBQTdCLENBSGY7QUFBQSxTQUlJLGNBQWMsU0FBUywwQkFBVCxDQUFvQyxLQUFwQyxFQUEyQyxhQUEzQyxFQUEwRCxtQkFBMUQsRUFBK0U7OztBQUd6RixhQUFJLENBQUMsb0JBQVksT0FBWixDQUFvQixLQUFwQixDQUFMLEVBQWlDO0FBQzdCLG1DQUFzQixhQUF0QjtBQUNBLDZCQUFnQixLQUFoQjtBQUNBLHFCQUFRLFNBQVI7QUFDSDtBQUVKLE1BYkw7QUFBQSxTQWNJLFlBQVk7QUFDUixlQUFNLDBCQURFO0FBRVIsa0JBQVMsK0JBQWlCLE1BQWpCLENBRkQ7QUFHUixrQkFBUywrQkFBaUIsTUFBakIsQ0FIRDtBQUlSLHFCQUFZLDBCQUpKO0FBS1Isb0JBQVcsdUNBQXFCLFVBQXJCLEVBQWlDLE1BQWpDLENBTEg7QUFNUixpQkFBUSw4QkFOQTtBQU9SLGtCQUFTLCtCQUFpQixNQUFqQixDQVBEO0FBUVIsbUJBQVUsaUNBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLEVBQW9DLFdBQXBDLENBUkY7QUFTUix5QkFBZ0I7QUFUUixNQWRoQjtBQTJCQSxlQUFVLFdBQVYsR0FBd0IsVUFBVSxTQUFsQzs7QUFHQSxjQUFTLElBQVQsR0FBZ0IsVUFBUyxhQUFULEVBQXdCO0FBQ3BDLGFBQUksUUFBUSxRQUFSLENBQWlCLGFBQWpCLENBQUosRUFBcUM7QUFDakMsNkJBQWdCLHlCQUFZLGFBQVosQ0FBaEI7QUFDQSxpQkFBSSxVQUFVLGFBQVYsQ0FBSixFQUE4QjtBQUMxQix3QkFBTyxVQUFVLGFBQVYsQ0FBUDtBQUNIO0FBQ0o7QUFDRCxnQkFBTyxXQUFXLEdBQVgsQ0FBZSxhQUFmLENBQVA7QUFDSCxNQVJEO0FBU0EsY0FBUyxJQUFULEdBQWdCLFVBQVMsYUFBVCxFQUF3QixvQkFBeEIsRUFBOEM7QUFDMUQsYUFBSSxDQUFDLFFBQVEsVUFBUixDQUFtQixvQkFBbkIsQ0FBTCxFQUErQztBQUMzQyxtQkFBTSx3Q0FBTjtBQUNIO0FBQ0QsYUFBSSxRQUFRLFFBQVIsQ0FBaUIsYUFBakIsQ0FBSixFQUFxQztBQUNqQyw2QkFBZ0IseUJBQVksYUFBWixDQUFoQjtBQUNIO0FBQ0QsYUFBSSxXQUFXLEdBQVgsQ0FBZSxhQUFmLENBQUosRUFBbUM7QUFDL0IsaUJBQUksVUFBVSxNQUFWLEtBQXFCLENBQXJCLElBQTBCLFFBQVEsVUFBUixDQUFtQixVQUFVLENBQVYsQ0FBbkIsQ0FBMUIsSUFBOEQsVUFBVSxDQUFWLFFBQW1CLElBQXJGLEVBQTJGO0FBQ3ZGLDRCQUFXLEdBQVgsQ0FBZSxhQUFmLEVBQThCLHNCQUE5QjtBQUNBLHlCQUFRLEdBQVIsQ0FBWSxDQUFDLFdBQUQsRUFBYyxhQUFkLEVBQTZCLHNCQUE3QixFQUFxRCxJQUFyRCxDQUEwRCxHQUExRCxDQUFaO0FBQ0E7QUFDSDtBQUNELG1CQUFNLHNCQUFzQixhQUF0QixHQUFzQyw0QkFBNUM7QUFDSDtBQUNELG9CQUFXLEdBQVgsQ0FBZSxhQUFmLEVBQThCLHNCQUE5QjtBQUNILE1BaEJEO0FBaUJBLGNBQVMsTUFBVCxHQUFrQixZQUFXO0FBQ3pCLG9CQUFXLEtBQVg7QUFDSCxNQUZEO0FBR0EsY0FBUyxTQUFULEdBQXFCLFVBQUMsVUFBRCxFQUFnQjtBQUNqQyxzQkFBYSxRQUFRLFFBQVIsQ0FBaUIsQ0FBQyxJQUFELEVBQU8sd0JBQVAsRUFBaUMsTUFBakMsQ0FBd0MsVUFBeEMsQ0FBakIsRUFBc0UsR0FBdEUsQ0FBMEUsWUFBMUUsQ0FBYjtBQUNBLG1CQUFVLFNBQVYsQ0FBb0IsYUFBcEIsQ0FBa0MsVUFBbEM7QUFDSCxNQUhEO0FBSUEsWUFBTyxRQUFQO0FBQ0gsRUFsRXVCLEVBQXhCO21CQW1FZSxpQjs7Ozs7Ozs7Ozs7U0N0RkMsZ0IsR0FBQSxnQjs7QUFOaEI7O0FBTU8sVUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQztBQUNyQyxZQUFPO0FBQ0gsa0JBQVMsaUJBQUMsaUJBQUQsRUFBb0IsVUFBcEIsRUFBbUM7QUFDeEMsaUJBQU0sZUFBZSxFQUFyQjtBQUNBLCtCQUFrQixlQUFsQixDQUFrQyxHQUFsQyxDQUFzQyxVQUF0QyxFQUFrRCxZQUFNO0FBQ3BELHdCQUFPLGFBQWEsTUFBcEIsRUFBNEI7QUFDeEIsc0JBQUMsYUFBYSxLQUFiLE1BQXdCLFFBQVEsSUFBakM7QUFDSDtBQUNKLGNBSkQ7QUFLQSxpQkFBSSxrQkFBa0IsTUFBdEIsRUFBOEI7QUFDMUIsbUNBQWtCLE1BQWxCO0FBQ0g7QUFDRCxpQkFBTSxTQUFTLE9BQU8sVUFBUCxDQUFmOztBQUVBLGlCQUFJLFdBQVcsU0FBWCxRQUFXLENBQVMsU0FBVCxFQUFvQjtBQUMvQixxQkFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDeEIsNEJBQU8sT0FBTyxrQkFBa0IsZUFBekIsQ0FBUDtBQUNILGtCQUZELE1BRU8sSUFBSSxRQUFRLFFBQVIsQ0FBaUIsU0FBakIsQ0FBSixFQUFpQztBQUNwQyx5QkFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBckIsSUFBMEIsVUFBVSxDQUFWLE1BQWlCLElBQS9DLEVBQXFEO0FBQ2pELGtDQUFTLFVBQVUsS0FBVixDQUFnQixFQUFoQixDQUFUO0FBQ0E7QUFDSDtBQUNELDRCQUFPLE1BQVAsQ0FBYyxrQkFBa0IsZUFBaEMsRUFBaUQsU0FBakQ7QUFDQSxrQ0FBYSxPQUFiLENBQXFCLFVBQUMsRUFBRCxFQUFRO0FBQ3pCLDRCQUFHLFNBQUg7QUFDSCxzQkFGRDtBQUdBLHVDQUFrQixNQUFsQjtBQUNILGtCQVZNLE1BVUEsSUFBSSx5QkFBWSxTQUFaLENBQUosRUFBNEI7QUFDL0IseUJBQUksU0FBUyxFQUFiO0FBQ0EsNENBQVUsU0FBVixFQUFxQixPQUFyQixDQUE2QixVQUFDLE9BQUQsRUFBYTtBQUN0QyxrQ0FBUyxVQUFVLE9BQW5CO0FBQ0gsc0JBRkQ7QUFHSCxrQkFMTSxNQUtBO0FBQ0gsMkJBQU0sQ0FBQyw0QkFBRCxFQUErQixJQUEvQixFQUFxQyx1QkFBVSxTQUFWLEVBQXFCLElBQXJCLENBQTBCLE1BQTFCLENBQXJDLEVBQXdFLElBQXhFLEVBQThFLElBQTlFLENBQW1GLEVBQW5GLENBQU47QUFDSDtBQUNKLGNBckJEOztBQXVCQSxzQkFBUyxPQUFULEdBQW1CLFVBQUMsUUFBRCxFQUFjO0FBQzdCLHFCQUFJLFFBQVEsVUFBUixDQUFtQixRQUFuQixDQUFKLEVBQWtDO0FBQzlCLGtDQUFhLElBQWIsQ0FBa0IsUUFBbEI7QUFDQSw0QkFBTyxZQUFNO0FBQ1QsNkJBQU0sUUFBUSxhQUFhLE9BQWIsQ0FBcUIsUUFBckIsQ0FBZDtBQUNBLHNDQUFhLE1BQWIsQ0FBb0IsS0FBcEIsRUFBMkIsQ0FBM0I7QUFDSCxzQkFIRDtBQUlIO0FBQ0QsdUJBQU0sNEJBQU47QUFDSCxjQVREO0FBVUEsb0JBQU8sUUFBUDtBQUNILFVBL0NFO0FBZ0RILDBCQUFpQix5QkFBQyxpQkFBRCxFQUFvQixJQUFwQixFQUE2QjtBQUMxQyxpQkFBTSxRQUFRLEtBQUssSUFBTCxDQUFVLFVBQVYsQ0FBZDtBQUNBLGtCQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ0EsbUJBQU0sT0FBTixDQUFjLFVBQUMsUUFBRCxFQUFjO0FBQ3hCLHNCQUFLLElBQUwsQ0FBVSxRQUFWO0FBQ0gsY0FGRDtBQUdILFVBdERFO0FBdURILGVBQU07QUF2REgsTUFBUDtBQXlESCxFOzs7Ozs7Ozs7Ozs7Ozs7O1NDckRlLGEsR0FBQSxhO1NBdUJBLE8sR0FBQSxPO1NBaUJBLFMsR0FBQSxTO1NBSUEsVyxHQUFBLFc7U0FtQkEsVyxHQUFBLFc7U0FXQSxJLEdBQUEsSTtTQU1BLFksR0FBQSxZO1NBSUEsbUIsR0FBQSxtQjtTQUtBLGdCLEdBQUEsZ0I7U0FVQSxtQixHQUFBLG1CO1NBUUEsSyxHQUFBLEs7U0FnQkEsUyxHQUFBLFM7U0FrQkEsUyxHQUFBLFM7U0FXQSxNLEdBQUEsTTtTQTJFQSxlLEdBQUEsZTtTQVFBLGUsR0FBQSxlO1NBZUEsVyxHQUFBLFc7U0FNQSxXLEdBQUEsVzs7OztBQTNRVCxLQUFJLG9EQUFzQixtQkFBMUI7QUFDQSxLQUFJLDhDQUFtQixVQUF2Qjs7Ozs7Ozs7QUFTUCxLQUFNLFFBQVEsR0FBRyxLQUFqQjtBQUNPLFVBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4Qjs7QUFFakMsU0FBSSxPQUFPLE1BQU0sQ0FBTixDQUFYO0FBQ0EsU0FBSSxVQUFVLE1BQU0sTUFBTSxNQUFOLEdBQWUsQ0FBckIsQ0FBZDtBQUNBLFNBQUksVUFBSjs7QUFFQSxVQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLFNBQVMsT0FBVCxLQUFxQixPQUFPLEtBQUssV0FBakMsQ0FBaEIsRUFBK0QsR0FBL0QsRUFBb0U7QUFDaEUsYUFBSSxjQUFjLE1BQU0sQ0FBTixNQUFhLElBQS9CLEVBQXFDO0FBQ2pDLGlCQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNiLDhCQUFhLFFBQVEsT0FBUixDQUFnQixNQUFNLElBQU4sQ0FBVyxLQUFYLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQWhCLENBQWI7QUFDSDtBQUNELHdCQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFDSDtBQUNKOztBQUVELFlBQU8sY0FBYyxLQUFyQjtBQUNIOztBQUVELEtBQUksTUFBTSxDQUFWO0FBQ0EsS0FBTSxVQUFVLFNBQVYsT0FBVSxHQUFXO0FBQ3ZCLFlBQU8sRUFBRSxHQUFUO0FBQ0gsRUFGRDs7QUFJTyxVQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsU0FBdEIsRUFBaUM7QUFDcEMsU0FBSSxNQUFNLE9BQU8sSUFBSSxTQUFyQjtBQUNBLFNBQUksR0FBSixFQUFTO0FBQ0wsYUFBSSxPQUFPLEdBQVAsS0FBZSxVQUFuQixFQUErQjtBQUMzQixtQkFBTSxJQUFJLFNBQUosRUFBTjtBQUNIO0FBQ0QsZ0JBQU8sR0FBUDtBQUNIO0FBQ0QsU0FBTSxpQkFBaUIsR0FBakIseUNBQWlCLEdBQWpCLENBQU47QUFDQSxTQUFJLFlBQVksVUFBWixJQUEyQixZQUFZLFFBQVosSUFBd0IsUUFBUSxJQUEvRCxFQUFzRTtBQUNsRSxlQUFNLElBQUksU0FBSixHQUFnQixVQUFVLEdBQVYsR0FBZ0IsQ0FBQyxhQUFhLE9BQWQsR0FBdEM7QUFDSCxNQUZELE1BRU87QUFDSCxlQUFNLFVBQVUsR0FBVixHQUFnQixHQUF0QjtBQUNIO0FBQ0QsWUFBTyxHQUFQO0FBQ0g7O0FBRU0sVUFBUyxTQUFULEdBQXFCO0FBQ3hCLFlBQU8sT0FBTyxNQUFQLENBQWMsSUFBZCxDQUFQO0FBQ0g7O0FBRU0sVUFBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCLEdBQTFCLEVBQStCO0FBQ2xDLFNBQUksUUFBUSxPQUFSLENBQWdCLEdBQWhCLENBQUosRUFBMEI7QUFDdEIsZUFBTSxPQUFPLEVBQWI7O0FBRUEsY0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssSUFBSSxNQUF6QixFQUFpQyxJQUFJLEVBQXJDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzFDLGlCQUFJLENBQUosSUFBUyxJQUFJLENBQUosQ0FBVDtBQUNIO0FBQ0osTUFORCxNQU1PLElBQUksUUFBUSxRQUFSLENBQWlCLEdBQWpCLENBQUosRUFBMkI7QUFDOUIsZUFBTSxPQUFPLEVBQWI7O0FBRUEsY0FBSyxJQUFJLEdBQVQsSUFBZ0IsR0FBaEIsRUFBcUI7QUFDakIsaUJBQUksRUFBRSxJQUFJLE1BQUosQ0FBVyxDQUFYLE1BQWtCLEdBQWxCLElBQXlCLElBQUksTUFBSixDQUFXLENBQVgsTUFBa0IsR0FBN0MsQ0FBSixFQUF1RDtBQUNuRCxxQkFBSSxHQUFKLElBQVcsSUFBSSxHQUFKLENBQVg7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsWUFBTyxPQUFPLEdBQWQ7QUFDSDtBQUNNLFVBQVMsV0FBVCxDQUFxQixJQUFyQixFQUEyQjtBQUM5QixZQUFPLE1BQU0sT0FBTixDQUFjLElBQWQsS0FDRixDQUFDLENBQUMsSUFBRixJQUNHLFFBQU8sSUFBUCx5Q0FBTyxJQUFQLE9BQWdCLFFBRG5CLElBRUcsS0FBSyxjQUFMLENBQW9CLFFBQXBCLENBRkgsSUFHRyxPQUFPLEtBQUssTUFBWixLQUF1QixRQUgxQixJQUlHLEtBQUssTUFBTCxJQUFlLENBTGhCLElBT0gsT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLElBQTFCLENBQStCLElBQS9CLE1BQXlDLG9CQVA3QztBQVFIOztBQUVNLFVBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUI7QUFDeEIsYUFBUSxTQUFTLEVBQWpCO0FBQ0EsWUFBTyxNQUFNLElBQU4sRUFBUDtBQUNIOztBQUdNLFVBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUNoQyxZQUFPLGlCQUFpQixJQUFqQixDQUFzQixLQUFLLEtBQUwsQ0FBdEIsQ0FBUDtBQUNIOztBQUVNLFVBQVMsbUJBQVQsQ0FBNkIsVUFBN0IsRUFBeUM7QUFDNUMsa0JBQWEsV0FBVyxJQUFYLEVBQWI7QUFDQSxZQUFPLFdBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixXQUFXLE1BQVgsR0FBb0IsQ0FBNUMsQ0FBUDtBQUNIOztBQUVNLFVBQVMsZ0JBQVQsQ0FBMEIsR0FBMUIsRUFBK0IsSUFBL0IsRUFBcUM7O0FBRXhDLFNBQUksWUFBSjtBQUNBLFlBQU8sTUFBTSxLQUFLLEtBQUwsRUFBYixFQUEyQjtBQUN2QixhQUFJLE9BQU8sSUFBSSxHQUFKLENBQVAsS0FBb0IsV0FBcEIsSUFBbUMsSUFBSSxHQUFKLE1BQWEsSUFBcEQsRUFBMEQ7QUFDdEQsbUJBQU0sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLDJCQUFYLEVBQXdDLElBQXhDLENBQTZDLEVBQTdDLENBQU47QUFDSDtBQUNKO0FBQ0o7O0FBRU0sVUFBUyxtQkFBVCxDQUE2QixHQUE3QixFQUFrQztBQUNyQyxzQkFBaUIsR0FBakIsRUFBc0IsQ0FDbEIsYUFEa0IsRUFFbEIsVUFGa0IsRUFHbEIsaUJBSGtCLENBQXRCO0FBS0g7O0FBRU0sVUFBUyxLQUFULENBQWUsTUFBZixFQUF1QjtBQUMxQixTQUFJLFlBQVksTUFBWixDQUFKLEVBQXlCO0FBQ3JCLGNBQUssSUFBSSxRQUFRLE9BQU8sTUFBUCxHQUFnQixDQUFqQyxFQUFvQyxTQUFTLENBQTdDLEVBQWdELE9BQWhELEVBQXlEO0FBQ3JELGlCQUFJLE9BQU8sY0FBUCxDQUFzQixLQUF0QixDQUFKLEVBQWtDO0FBQzlCLHVCQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsS0FBdkIsQ0FBNkIsTUFBN0IsRUFBcUMsQ0FBQyxLQUFELEVBQVEsQ0FBUixDQUFyQztBQUNIO0FBQ0o7QUFDSixNQU5ELE1BTU8sSUFBSSxRQUFRLFFBQVIsQ0FBaUIsTUFBakIsQ0FBSixFQUE4QjtBQUNqQyxjQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUNwQixpQkFBSSxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FBSixFQUFnQztBQUM1Qix3QkFBTyxHQUFQLElBQWMsU0FBZDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUVNLFVBQVMsU0FBVCxDQUFtQixRQUFuQixFQUE2QjtBQUFBOztBQUNoQyxTQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1gsb0JBQVcsUUFBUSxJQUFuQjtBQUNIO0FBQ0QsU0FBTSxZQUFZLElBQUksSUFBSixHQUFXLE9BQVgsRUFBbEI7QUFDQSxTQUFJLGdCQUFKO0FBQ0EsU0FBTSxXQUFXLE1BQU07QUFDbkIsWUFBRyxhQUFNO0FBQ0wsc0JBQVMsS0FBVCxDQUFlLFFBQWY7QUFDQSx1QkFBVSxJQUFJLElBQUosR0FBVyxPQUFYLEVBQVY7QUFDSDtBQUprQixNQUFOLEVBS2QsR0FMYyxFQUtULEdBTFMsQ0FLTCxXQUxLLEVBQWpCO0FBTUEsY0FBUyxJQUFULEdBQWdCLFlBQU07QUFDbEIsZ0JBQU8sVUFBVSxTQUFqQjtBQUNILE1BRkQ7QUFHQSxZQUFPLFFBQVA7QUFDSDs7QUFFTSxVQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDNUIsU0FBSSxVQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEIsZ0JBQU8sVUFBVSxTQUFWLENBQVA7QUFDSCxNQUZELE1BRU8sSUFBSSxRQUFRLFdBQVIsQ0FBb0IsSUFBcEIsQ0FBSixFQUErQjtBQUNsQyxnQkFBTyxFQUFQO0FBQ0gsTUFGTSxNQUVBLElBQUksWUFBWSxJQUFaLENBQUosRUFBdUI7QUFDMUIsZ0JBQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLEtBQXRCLENBQTRCLElBQTVCLENBQVA7QUFDSDtBQUNELFlBQU8sQ0FBQyxJQUFELENBQVA7QUFDSDs7QUFFTSxVQUFTLE1BQVQsR0FBa0I7QUFDckIsU0FBSSxVQUFVLFVBQVUsVUFBVSxNQUFWLEdBQW1CLENBQTdCLE1BQW9DLEtBQWxEOztBQUVBLGNBQVMsUUFBVCxDQUFrQixXQUFsQixFQUErQixNQUEvQixFQUF1QztBQUNuQyxjQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUNwQixpQkFBSSxXQUFXLENBQUMsSUFBSSxVQUFKLENBQWUsR0FBZixDQUFoQixFQUFxQztBQUNqQyxxQkFBSSxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsS0FBOEIsQ0FBQyxZQUFZLGNBQVosQ0FBMkIsR0FBM0IsQ0FBbkMsRUFBb0U7QUFDaEUsaUNBQVksR0FBWixJQUFtQixPQUFPLEdBQVAsQ0FBbkI7QUFDSDtBQUNKO0FBQ0o7QUFDRCxnQkFBTyxXQUFQO0FBQ0g7O0FBRUQsU0FBTSxTQUFTLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixLQUF0QixDQUE0QixTQUE1QixDQUFmO0FBQ0EsU0FBTSxjQUFjLE9BQU8sS0FBUCxNQUFrQixFQUF0QztBQUNBLFNBQUksZ0JBQUo7QUFDQSxZQUFPLFVBQVUsT0FBTyxLQUFQLEVBQWpCLEVBQWlDO0FBQzdCLGtCQUFTLFdBQVQsRUFBc0IsT0FBdEI7QUFDSDtBQUNELFlBQU8sV0FBUDtBQUNIOztBQUlELEtBQU0sWUFBWSxRQUFRLFFBQVIsQ0FBaUIsQ0FBQyxJQUFELENBQWpCLEVBQXlCLEdBQXpCLENBQTZCLFlBQTdCLENBQWxCOztBQUVBLFVBQVMsZ0JBQVQsQ0FBMEIsS0FBMUIsRUFBaUM7QUFDN0IsU0FBSSxNQUFNLEtBQVYsRUFBaUI7QUFDYixnQkFBTyxNQUFNLEtBQWI7QUFDSDs7QUFFRCxTQUFJLGVBQUo7QUFDQSxZQUFPLFNBQVMsTUFBTSxPQUF0QixFQUErQjtBQUMzQixhQUFJLE9BQU8sS0FBWCxFQUFrQjtBQUNkLG9CQUFPLE9BQU8sS0FBZDtBQUNIO0FBQ0o7QUFDRCxZQUFPLE1BQVA7QUFDSDs7S0FFWSxXLFdBQUEsVzs7Ozs7Ozs4Q0FDbUIsSyxFQUFPO0FBQy9CLG1CQUFNLGFBQU4sR0FBc0IsQ0FBdEI7QUFDQSxtQkFBTSxZQUFOLENBQW1CLFlBQU07QUFDckIsdUJBQU0sYUFBTjtBQUNILGNBRkQ7QUFHQSxvQkFBTyxLQUFQO0FBQ0g7OztnQ0FDYSxLLEVBQU87QUFDakIscUJBQVEsU0FBUyxFQUFqQjtBQUNBLGlCQUFJLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBSixFQUF5QjtBQUNyQix3QkFBTyxZQUFZLG9CQUFaLENBQWlDLEtBQWpDLENBQVA7QUFDSDtBQUNELGtCQUFLLElBQUksR0FBVCxJQUFnQixLQUFoQixFQUF1QjtBQUNuQixxQkFBSSxNQUFNLGNBQU4sQ0FBcUIsR0FBckIsS0FBNkIsSUFBSSxVQUFKLENBQWUsR0FBZixDQUFqQyxFQUFzRDtBQUNsRCw0QkFBTyxNQUFNLEdBQU4sQ0FBUDtBQUNIO0FBQ0o7O0FBRUQsaUJBQUksUUFBUSxRQUFSLENBQWlCLEtBQWpCLENBQUosRUFBNkI7QUFDekIsd0JBQU8sWUFBWSxvQkFBWixDQUFpQyxPQUFPLFlBQVksVUFBWixDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUFQLEVBQTBDLEtBQTFDLENBQWpDLENBQVA7QUFDSDtBQUNELGlCQUFJLFlBQVksS0FBWixDQUFKLEVBQXdCO0FBQ3BCLHlCQUFRLFVBQVUsS0FBVixDQUFSO0FBQ0Esd0JBQU8sWUFBWSxvQkFBWixDQUFpQyxPQUFPLEtBQVAsQ0FBYSxTQUFiLEVBQXdCLENBQUMsWUFBWSxVQUFaLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQUQsRUFBb0MsTUFBcEMsQ0FBMkMsS0FBM0MsQ0FBeEIsQ0FBakMsQ0FBUDtBQUNIO0FBRUo7OztpQ0FDYyxNLEVBQVE7QUFDbkIsb0JBQU8sVUFBVSxpQkFBaUIsTUFBakIsTUFBNkIsaUJBQWlCLFlBQVksVUFBN0IsQ0FBdkMsSUFBbUYsTUFBMUY7QUFDSDs7Ozs7O0FBRUwsYUFBWSxVQUFaLEdBQXlCLFNBQXpCOztBQUVPLFVBQVMsZUFBVCxDQUF5QixVQUF6QixFQUFxQztBQUN4QyxTQUFNLFdBQVcsNkJBQTZCLElBQTdCLENBQWtDLFdBQVcsUUFBWCxFQUFsQyxFQUF5RCxDQUF6RCxDQUFqQjtBQUNBLFNBQUksYUFBYSxFQUFiLElBQW1CLGFBQWEsTUFBcEMsRUFBNEM7QUFDeEMsZ0JBQU8sSUFBSSxJQUFKLEdBQVcsT0FBWCxHQUFxQixRQUFyQixFQUFQO0FBQ0g7QUFDRCxZQUFPLFFBQVA7QUFDSDs7QUFFTSxVQUFTLGVBQVQsR0FBMkI7O0FBRTlCLFNBQU0sVUFBVSxVQUFVLEtBQVYsQ0FBZ0IsU0FBaEIsRUFBMkIsU0FBM0IsQ0FBaEI7QUFDQSxTQUFJLGNBQUo7QUFDQSxTQUNJLENBQUMsUUFBUSxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBVCxNQUFvQyxDQUFDLENBQXJDLElBQ0EsQ0FBQyxRQUFRLFFBQVEsT0FBUixDQUFnQixTQUFoQixDQUFULE1BQXlDLENBQUMsQ0FGOUMsRUFFaUQ7QUFDN0MsaUJBQVEsT0FBUixDQUFnQixJQUFoQjtBQUNIO0FBQ0QsU0FBSSxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUNkLGlCQUFRLE9BQVIsQ0FBZ0IsUUFBUSxNQUFSLENBQWUsS0FBZixFQUFzQixDQUF0QixFQUF5QixDQUF6QixLQUErQixJQUEvQztBQUNIO0FBQ0QsWUFBTyxPQUFQO0FBQ0g7QUFDRCxLQUFNLHVCQUF1QixpQkFBN0I7QUFDTyxVQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFBMkI7QUFDOUIsWUFBTyxLQUNQLE9BRE8sQ0FDQyxvQkFERCxFQUN1QixVQUFTLENBQVQsRUFBWSxTQUFaLEVBQXVCLE1BQXZCLEVBQStCLE1BQS9CLEVBQXVDO0FBQ2pFLGdCQUFPLFNBQVMsT0FBTyxXQUFQLEVBQVQsR0FBZ0MsTUFBdkM7QUFDSCxNQUhNLENBQVA7QUFJSDtBQUNNLFVBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QixHQUE1QixFQUFpQztBQUNwQyxXQUFNLE9BQU8sR0FBYjtBQUNBLFlBQU8sTUFBTSxPQUFOLENBQWMsVUFBZCxFQUEwQixVQUFTLEVBQVQsRUFBYTtBQUMxQyxnQkFBTyxNQUFNLEdBQUcsV0FBSCxFQUFiO0FBQ0gsTUFGTSxDQUFQO0FBR0gsRTs7Ozs7Ozs7Ozs7U0NyUWUsZ0IsR0FBQSxnQjs7QUFYaEI7O0FBSUEsVUFBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDO0FBQzVCLFNBQUksV0FBVyx1QkFBVSxNQUFWLENBQWY7QUFDQSxVQUFLLElBQUksS0FBSyxDQUFkLEVBQWlCLEtBQUssT0FBTyxRQUFQLEdBQWtCLE1BQXhDLEVBQWdELElBQWhELEVBQXNEO0FBQ2xELG9CQUFXLFNBQVMsTUFBVCxDQUFnQixlQUFlLFFBQVEsT0FBUixDQUFnQixPQUFPLFFBQVAsR0FBa0IsRUFBbEIsQ0FBaEIsQ0FBZixDQUFoQixDQUFYO0FBQ0g7QUFDRCxZQUFPLFFBQVA7QUFDSDtBQUNNLFVBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0M7QUFBQTs7QUFDckMsWUFBTztBQUNILGdCQUFPLGlCQURKO0FBRUgsa0JBQVMsaUJBQUMsaUJBQUQsRUFBb0IsVUFBcEIsRUFBbUM7QUFDeEMsaUJBQUksUUFBUSxRQUFSLENBQWlCLFVBQWpCLENBQUosRUFBa0M7QUFDOUIsOEJBQWEsT0FBTyxVQUFQLENBQWI7QUFDSDtBQUNELGlCQUFJLGtCQUFrQixNQUF0QixFQUE4QjtBQUMxQixtQ0FBa0IsTUFBbEI7QUFDSDs7QUFFRCxpQkFBSSxRQUFRLFNBQVIsS0FBUSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQzNCLHFCQUFJLFdBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUN4Qiw4QkFBUyxTQUFTLEVBQWxCO0FBQ0EsNkJBQVEsa0JBQWtCLGVBQTFCO0FBQ0gsa0JBSEQsTUFHTztBQUNILDZCQUFRLFNBQVMsa0JBQWtCLGVBQW5DO0FBQ0EsOEJBQVMsVUFBVSxFQUFuQjtBQUNIO0FBQ0QscUJBQU0sU0FBUyxXQUFXLEtBQVgsRUFBa0IsTUFBbEIsQ0FBZjtBQUNBLG1DQUFrQixNQUFsQjtBQUNBLHdCQUFPLE1BQVA7QUFDSCxjQVhEO0FBWUEsb0JBQU8sS0FBUDtBQUNILFVBdkJFO0FBd0JILDBCQUFpQix5QkFBQyxpQkFBRCxFQUFvQixRQUFwQixFQUFpQztBQUM5QyxpQkFBTSxZQUFZLFNBQVMsSUFBVCxDQUFjLFVBQWQsQ0FBbEI7QUFDQSxpQkFBTSxVQUFVLGVBQWUsUUFBZixDQUFoQjtBQUNBLGtCQUFLLElBQUksUUFBUSxDQUFqQixFQUFvQixRQUFRLFFBQVEsTUFBcEMsRUFBNEMsT0FBNUMsRUFBcUQ7QUFDakQseUJBQVEsT0FBUixDQUFnQixRQUFRLEtBQVIsQ0FBaEIsRUFBZ0MsSUFBaEMsQ0FBcUMsVUFBckMsRUFBaUQsU0FBakQ7QUFDSDtBQUVKLFVBL0JFO0FBZ0NILGVBQU07QUFoQ0gsTUFBUDtBQWtDSCxFOzs7Ozs7Ozs7OztTQzlDZSxhLEdBQUEsYTtBQUFULFVBQVMsYUFBVCxHQUF5QjtBQUM1QixZQUFPO0FBQ0gsZ0JBQU8sY0FESjtBQUVILGtCQUFTLGlCQUFDLGlCQUFELEVBQW9CLFVBQXBCLEVBQW1DO0FBQ3hDLGlCQUFJLGtCQUFKO0FBQ0EsaUJBQUksa0JBQWtCLE1BQXRCLEVBQThCO0FBQzFCLG1DQUFrQixNQUFsQjtBQUNIO0FBQ0QsaUJBQU0sZUFBZSxFQUFyQjtBQUNBLGlCQUFNLFVBQVUsa0JBQWtCLEtBQWxCLENBQXdCLFVBQXhCLEVBQW9DLFlBQVc7QUFDM0QsNkJBQVksVUFBVSxDQUFWLENBQVo7QUFDQSxzQkFBSyxJQUFJLEtBQUssQ0FBZCxFQUFpQixLQUFLLGFBQWEsTUFBbkMsRUFBMkMsSUFBM0MsRUFBaUQ7QUFDN0Msa0NBQWEsRUFBYixFQUFpQixLQUFqQixDQUF1QixZQUF2QixFQUFxQyxTQUFyQztBQUNIO0FBQ0osY0FMZSxDQUFoQjtBQU1BLCtCQUFrQixlQUFsQixDQUFrQyxHQUFsQyxDQUFzQyxVQUF0QyxFQUFrRCxZQUFNO0FBQ3BELG9CQUFHO0FBQ0Msc0JBQUMsYUFBYSxLQUFiLE1BQXdCLFFBQVEsS0FBakM7QUFDSCxrQkFGRCxRQUVTLGFBQWEsTUFGdEI7QUFHQTtBQUNILGNBTEQ7QUFNQSxpQkFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLFFBQUQsRUFBYztBQUMzQiw4QkFBYSxJQUFiLENBQWtCLFFBQWxCO0FBQ0Esd0JBQU8sWUFBTTtBQUNULHlCQUFNLFFBQVEsYUFBYSxPQUFiLENBQXFCLFFBQXJCLENBQWQ7QUFDQSxrQ0FBYSxNQUFiLENBQW9CLEtBQXBCLEVBQTJCLENBQTNCO0FBQ0gsa0JBSEQ7QUFJSCxjQU5EO0FBT0Esc0JBQVMsS0FBVCxHQUFpQixZQUFXO0FBQ3hCLHdCQUFPLFNBQVA7QUFDSCxjQUZEO0FBR0Esb0JBQU8sUUFBUDtBQUNILFVBL0JFO0FBZ0NILDBCQUFpQix5QkFBQyxpQkFBRCxFQUFvQixRQUFwQixFQUFpQztBQUM5QyxpQkFBSSxrQkFBSjtBQUFBLGlCQUNJLFNBQVMsU0FBUyxNQUFULEVBRGI7QUFBQSxpQkFFSSxvQkFBb0IsU0FBUyxJQUFULENBQWMsT0FBZCxDQUZ4QjtBQUdBLCtCQUFrQixVQUFDLFFBQUQsRUFBYztBQUM1QixxQkFBSSxDQUFDLFFBQUwsRUFBZTtBQUNYLHlCQUFJLE9BQU8sUUFBUCxHQUFrQixNQUFsQixLQUE2QixDQUFqQyxFQUFvQztBQUNoQyxxQ0FBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsSUFBdkIsQ0FBNEIsUUFBNUIsRUFBc0MsQ0FBdEMsRUFBeUMsU0FBUyxNQUFsRCxDQUFaO0FBQ0gsc0JBRkQsTUFFTztBQUNILHFDQUFZLFFBQVo7QUFDQSxrQ0FBUyxNQUFUO0FBQ0g7QUFDSixrQkFQRCxNQU9PO0FBQ0gseUJBQUksTUFBSixFQUFZO0FBQ1IsNkJBQUksTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFKLEVBQThCO0FBQzFCLG1DQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBckIsQ0FBMkIsUUFBM0IsRUFBcUMsU0FBckM7QUFDSCwwQkFGRCxNQUVPO0FBQ0gsb0NBQU8sTUFBUCxDQUFjLFNBQWQ7QUFDSDtBQUNELGtDQUFTLFNBQVQ7QUFDSDtBQUNKO0FBQ0osY0FsQkQ7QUFtQkEsK0JBQWtCLGVBQWxCLENBQWtDLEdBQWxDLENBQXNDLFVBQXRDLEVBQWtELFlBQU07QUFDcEQsNkJBQVksU0FBUyxvQkFBb0IsU0FBekM7QUFDSCxjQUZEO0FBR0gsVUExREU7QUEyREgsZUFBTTtBQTNESCxNQUFQO0FBNkRILEU7Ozs7Ozs7Ozs7O1NDekRlLG9CLEdBQUEsb0I7O0FBTGhCOztBQUtPLFVBQVMsb0JBQVQsQ0FBOEIsVUFBOUIsRUFBMEMsTUFBMUMsRUFBa0Q7QUFDckQsU0FBSSxtQkFBbUIsVUFBdkI7QUFDQSxZQUFPO0FBQ0gsa0JBQVMsaUJBQVMsaUJBQVQsRUFBNEIsVUFBNUIsRUFBd0M7QUFDN0MsaUJBQUksa0JBQWtCLE1BQXRCLEVBQThCO0FBQzFCLG1DQUFrQixNQUFsQjtBQUNIO0FBQ0QsaUJBQUksY0FBSjtBQUFBLGlCQUNJLE1BQU0sVUFEVjtBQUFBLGlCQUVJLGVBQWUsRUFGbkI7QUFHQSxpQkFBSSxnQkFBSjtBQUNBLCtCQUFrQixlQUFsQixDQUFrQyxHQUFsQyxDQUFzQyxVQUF0QyxFQUFrRCxZQUFNO0FBQ3BELHdCQUFPLGFBQWEsTUFBcEIsRUFBNEI7QUFDeEIsc0JBQUMsYUFBYSxLQUFiLE1BQXdCLFFBQVEsSUFBakM7QUFDSDtBQUNELHFCQUFJLFFBQVEsVUFBUixDQUFtQixPQUFuQixDQUFKLEVBQWlDO0FBQzdCO0FBQ0g7QUFDRCx5QkFBUSxVQUFVLFdBQVcsZUFBZSxTQUE1QztBQUNILGNBUkQ7QUFTQSxpQkFBSSwwQkFBYSxVQUFiLENBQUosRUFBOEI7QUFDMUIsOEJBQWEsaUNBQW9CLFVBQXBCLENBQWI7QUFDQSx1QkFBTSxPQUFPLFVBQVAsRUFBbUIsa0JBQWtCLGVBQXJDLENBQU47QUFDQSwyQkFBVSxrQkFBa0IsS0FBbEIsQ0FBd0IsVUFBeEIsRUFBb0MsVUFBQyxRQUFELEVBQWM7QUFDeEQsMkJBQU0sUUFBTjtBQUNBLDZCQUFRLGlCQUFpQixPQUFqQixDQUF5QixRQUF6QixDQUFSO0FBQ0Esa0NBQWEsT0FBYixDQUFxQixVQUFDLEVBQUQsRUFBUTtBQUN6Qiw0QkFBRyxLQUFIO0FBQ0gsc0JBRkQ7QUFHSCxrQkFOUyxDQUFWO0FBT0gsY0FWRCxNQVVPO0FBQ0gseUJBQVEsaUJBQWlCLE9BQWpCLENBQXlCLEdBQXpCLENBQVI7QUFDSDtBQUNELGlCQUFJLFdBQVcsb0JBQVc7QUFDdEIsd0JBQU8sS0FBUDtBQUNILGNBRkQ7O0FBSUEsc0JBQVMsY0FBVCxHQUEwQixVQUFTLFdBQVQsRUFBc0I7QUFDNUMsa0NBQWlCLEdBQWpCLENBQXFCLFdBQXJCO0FBQ0EscUJBQU0sY0FBYyxrQkFBa0IsS0FBbEIsQ0FBd0IsWUFBTSxDQUFFLENBQWhDLEVBQWtDLFlBQU07QUFDeEQsNkJBQVEsaUJBQWlCLE9BQWpCLENBQXlCLEdBQXpCLENBQVI7QUFDQTtBQUNBLGtDQUFhLE9BQWIsQ0FBcUIsVUFBQyxFQUFELEVBQVE7QUFDekIsNEJBQUcsS0FBSDtBQUNILHNCQUZEO0FBR0gsa0JBTm1CLENBQXBCO0FBT0gsY0FURDtBQVVBLHNCQUFTLE9BQVQsR0FBbUIsVUFBQyxRQUFELEVBQWM7QUFDN0IscUJBQUksUUFBUSxVQUFSLENBQW1CLFFBQW5CLENBQUosRUFBa0M7QUFDOUIsa0NBQWEsSUFBYixDQUFrQixRQUFsQjtBQUNBLDRCQUFPLFlBQU07QUFDVCw2QkFBTSxRQUFRLGFBQWEsT0FBYixDQUFxQixRQUFyQixDQUFkO0FBQ0Esc0NBQWEsTUFBYixDQUFvQixLQUFwQixFQUEyQixDQUEzQjtBQUNILHNCQUhEO0FBSUg7QUFDRCx1QkFBTSw0QkFBTjtBQUNILGNBVEQ7QUFVQSxvQkFBTyxRQUFQO0FBRUgsVUF6REU7QUEwREgsb0JBQVcsbUJBQVMsSUFBVCxFQUFlO0FBQ3RCLG9CQUFPLGlCQUFpQixPQUFqQixDQUF5QixJQUF6QixDQUFQO0FBQ0gsVUE1REU7QUE2REgseUJBQWdCLHdCQUFTLFdBQVQsRUFBc0I7QUFDbEMsOEJBQWlCLEdBQWpCLENBQXFCLFdBQXJCO0FBQ0gsVUEvREU7QUFnRUgsd0JBQWUsdUJBQVMsVUFBVCxFQUFxQjtBQUNoQyxnQ0FBbUIsVUFBbkI7QUFDSCxVQWxFRTtBQW1FSCwwQkFBaUIseUJBQUMsaUJBQUQsRUFBb0IsSUFBcEIsRUFBNkI7QUFDMUMsaUJBQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxjQUFWLENBQWQ7QUFDQSxrQkFBSyxJQUFMLENBQVUsT0FBVjtBQUNBLG1CQUFNLE9BQU4sQ0FBYyxVQUFDLFFBQUQsRUFBYztBQUN4QixzQkFBSyxJQUFMLENBQVUsUUFBVjtBQUNILGNBRkQ7QUFHSCxVQXpFRTtBQTBFSCxlQUFNOztBQTFFSCxNQUFQO0FBNkVILEU7Ozs7Ozs7Ozs7O1NDcEZlLGUsR0FBQSxlO0FBQVQsVUFBUyxlQUFULEdBQTJCO0FBQzlCLFlBQU87QUFDSCxrQkFBUyxpQkFBQyxpQkFBRCxFQUFvQixVQUFwQixFQUFtQztBQUN4QyxpQkFBTSxlQUFlLEVBQXJCO0FBQ0EsaUJBQUksa0JBQWtCLE1BQXRCLEVBQThCO0FBQzFCLG1DQUFrQixNQUFsQjtBQUNIO0FBQ0QsaUJBQUksa0JBQUo7QUFDQSxpQkFBSSxVQUFVLGtCQUFrQixLQUFsQixDQUF3QixVQUF4QixFQUFvQyxVQUFDLFFBQUQsRUFBYztBQUM1RCw2QkFBWSxRQUFaO0FBQ0EsOEJBQWEsT0FBYixDQUFxQixVQUFDLEVBQUQsRUFBUTtBQUN6Qix3QkFBRyxRQUFIO0FBQ0gsa0JBRkQ7QUFHSCxjQUxhLENBQWQ7QUFNQSxpQkFBSSxXQUFXLFNBQVgsUUFBVyxHQUFXO0FBQ3RCLHdCQUFPLFNBQVA7QUFDSCxjQUZEO0FBR0EsK0JBQWtCLGVBQWxCLENBQWtDLEdBQWxDLENBQXNDLFVBQXRDLEVBQWtELFlBQU07QUFDcEQsd0JBQU8sYUFBYSxNQUFwQixFQUE0QjtBQUN4QixzQkFBQyxhQUFhLEtBQWIsTUFBd0IsUUFBUSxJQUFqQztBQUNIO0FBQ0Q7QUFDSCxjQUxEO0FBTUEsc0JBQVMsT0FBVCxHQUFtQixVQUFDLFFBQUQsRUFBYztBQUM3QixxQkFBSSxRQUFRLFVBQVIsQ0FBbUIsUUFBbkIsQ0FBSixFQUFrQztBQUM5QixrQ0FBYSxJQUFiLENBQWtCLFFBQWxCO0FBQ0EsNEJBQU8sWUFBTTtBQUNULDZCQUFNLFFBQVEsYUFBYSxPQUFiLENBQXFCLFFBQXJCLENBQWQ7QUFDQSxzQ0FBYSxNQUFiLENBQW9CLEtBQXBCLEVBQTJCLENBQTNCO0FBQ0gsc0JBSEQ7QUFJSDtBQUNELHVCQUFNLDRCQUFOO0FBQ0gsY0FURDtBQVVBLG9CQUFPLFFBQVA7QUFDSCxVQWpDRTtBQWtDSCwwQkFBaUIseUJBQUMsaUJBQUQsRUFBb0IsSUFBcEIsRUFBNkI7QUFDMUMsaUJBQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQWQ7QUFDQSxrQkFBSyxJQUFMLENBQVUsT0FBVjtBQUNBLG1CQUFNLE9BQU4sQ0FBYyxVQUFDLFFBQUQsRUFBYztBQUN4QixzQkFBSyxJQUFMLENBQVUsUUFBVjtBQUNILGNBRkQ7QUFHSCxVQXhDRTtBQXlDSCxlQUFNO0FBekNILE1BQVA7QUEyQ0gsRTs7Ozs7Ozs7Ozs7U0N6Q2UsZ0IsR0FBQSxnQjs7QUFIaEI7O0FBR08sVUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQztBQUNyQyxZQUFPO0FBQ0gsa0JBQVMsaUJBQUMsaUJBQUQsRUFBb0IsVUFBcEIsRUFBbUM7QUFDeEMsaUJBQUksUUFBUSxVQUFSLENBQW1CLGtCQUFrQixNQUFyQyxDQUFKLEVBQWtEO0FBQzlDLG1DQUFrQixNQUFsQjtBQUNIO0FBQ0QsaUJBQU0sZUFBZSxFQUFyQjtBQUNBLGlCQUFJLFlBQVksRUFBaEI7QUFDQSxpQkFBTSxTQUFTLE9BQU8sa0JBQUssVUFBTCxDQUFQLENBQWY7QUFDQSxpQkFBSSxVQUFVLGtCQUFrQixLQUFsQixDQUF3QixZQUFNO0FBQ3hDLHFCQUFJLFdBQVcsT0FBTyxrQkFBa0IsZUFBekIsQ0FBZjtBQUNBLHFCQUFJLG1CQUFKO0FBQ0EscUJBQU0sV0FBVyxFQUFqQjtBQUNBLHFCQUFJLFFBQVEsUUFBUixDQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQzVCLHlCQUFNLFVBQVUsU0FBUyxLQUFULENBQWUsR0FBZixDQUFoQjtBQUNBLGdDQUFXLEVBQVg7QUFDQSw2QkFBUSxPQUFSLENBQWdCLFVBQUMsR0FBRCxFQUFTO0FBQ3JCLGtDQUFTLEdBQVQsSUFBZ0IsSUFBaEI7QUFDSCxzQkFGRDtBQUdILGtCQU5ELE1BTU8sSUFBSSxRQUFRLFdBQVIsQ0FBb0IsUUFBcEIsQ0FBSixFQUFtQztBQUN0QyxnQ0FBVyxFQUFYO0FBQ0gsa0JBRk0sTUFFQSxJQUFJLFFBQVEsT0FBUixDQUFnQixRQUFoQixDQUFKLEVBQStCO0FBQ2xDLHlCQUFNLE9BQU8sUUFBYjtBQUNBLGdDQUFXLEVBQVg7QUFDQSwwQkFBSyxPQUFMLENBQWEsVUFBQyxHQUFELEVBQVM7QUFDbEIsa0NBQVMsR0FBVCxJQUFnQixJQUFoQjtBQUNILHNCQUZEO0FBR0g7QUFDRCxzQkFBSyxJQUFJLEdBQVQsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDdEIseUJBQUksU0FBUyxjQUFULENBQXdCLEdBQXhCLEtBQWdDLFNBQVMsR0FBVCxNQUFrQixVQUFVLEdBQVYsQ0FBdEQsRUFBc0U7QUFDbEUsa0NBQVMsR0FBVCxJQUFnQjtBQUNaLGtDQUFLLENBQUMsQ0FBQyxVQUFVLEdBQVYsQ0FESztBQUVaLGtDQUFLLENBQUMsQ0FBQyxTQUFTLEdBQVQ7QUFGSywwQkFBaEI7QUFJQSxzQ0FBYSxJQUFiO0FBQ0g7QUFDSjtBQUNELHNCQUFLLElBQUksSUFBVCxJQUFnQixTQUFoQixFQUEyQjtBQUN2Qix5QkFBSSxDQUFDLFNBQVMsY0FBVCxDQUF3QixJQUF4QixDQUFELElBQWlDLFVBQVUsY0FBVixDQUF5QixJQUF6QixDQUFqQyxJQUFrRSxTQUFTLElBQVQsTUFBa0IsVUFBVSxJQUFWLENBQXhGLEVBQXdHO0FBQ3BHLGtDQUFTLElBQVQsSUFBZ0I7QUFDWixrQ0FBSyxDQUFDLENBQUMsVUFBVSxJQUFWLENBREs7QUFFWixrQ0FBSyxDQUFDLENBQUMsU0FBUyxJQUFUO0FBRkssMEJBQWhCO0FBSUEsc0NBQWEsSUFBYjtBQUNIO0FBQ0o7QUFDRCxxQkFBSSxVQUFKLEVBQWdCO0FBQ1osa0NBQWEsT0FBYixDQUFxQixVQUFDLEVBQUQsRUFBUTtBQUN6Qiw0QkFBRyxRQUFILEVBQWEsUUFBYjtBQUNILHNCQUZEO0FBR0EsaUNBQVksUUFBWjtBQUNIO0FBQ0Qsd0JBQU8sU0FBUDtBQUNILGNBNUNhLENBQWQ7QUE2Q0EsK0JBQWtCLGVBQWxCLENBQWtDLEdBQWxDLENBQXNDLFVBQXRDLEVBQWtELFlBQU07QUFDcEQ7QUFDQSx3QkFBTyxhQUFhLE1BQXBCLEVBQTRCO0FBQ3hCLHNCQUFDLGFBQWEsS0FBYixNQUF3QixRQUFRLElBQWpDO0FBQ0g7QUFDSixjQUxEO0FBTUEsaUJBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTtBQUNuQixxQkFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDWiw0QkFBTyxFQUFQO0FBQ0g7QUFDRCxxQkFBSSxRQUFRLFFBQVIsQ0FBaUIsU0FBakIsQ0FBSixFQUFpQztBQUM3Qiw0QkFBTyxTQUFQO0FBQ0g7QUFDRCxxQkFBTSxVQUFVLEVBQWhCO0FBQ0Esd0JBQU8sSUFBUCxDQUFZLFNBQVosRUFBdUIsT0FBdkIsQ0FBK0IsVUFBQyxHQUFELEVBQVM7QUFDcEMseUJBQUksVUFBVSxHQUFWLENBQUosRUFBb0I7QUFDaEIsaUNBQVEsSUFBUixDQUFhLEdBQWI7QUFDSDtBQUNKLGtCQUpEO0FBS0Esd0JBQU8sUUFBUSxJQUFSLENBQWEsR0FBYixDQUFQO0FBQ0gsY0FkRDtBQWVBLHNCQUFTLE9BQVQsR0FBbUIsVUFBQyxRQUFELEVBQWM7QUFDN0IscUJBQUksUUFBUSxVQUFSLENBQW1CLFFBQW5CLENBQUosRUFBa0M7QUFDOUIsa0NBQWEsSUFBYixDQUFrQixRQUFsQjtBQUNBLDRCQUFPLFlBQU07QUFDVCw2QkFBTSxRQUFRLGFBQWEsT0FBYixDQUFxQixRQUFyQixDQUFkO0FBQ0Esc0NBQWEsTUFBYixDQUFvQixLQUFwQixFQUEyQixDQUEzQjtBQUNILHNCQUhEO0FBSUg7QUFDRCx1QkFBTSw0QkFBTjtBQUNILGNBVEQ7QUFVQSxzQkFBUyxRQUFULEdBQW9CLFVBQUMsT0FBRCxFQUFhO0FBQzdCLHFCQUFJLFFBQVEsUUFBUixDQUFpQixTQUFqQixDQUFKLEVBQWlDO0FBQzdCLDRCQUFPLFVBQVUsT0FBVixDQUFrQixrQkFBSyxPQUFMLENBQWxCLE1BQXFDLENBQUMsQ0FBN0M7QUFDSCxrQkFGRCxNQUVPLElBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ25CLDRCQUFPLEtBQVA7QUFDSDtBQUNELHdCQUFPLENBQUMsQ0FBQyxVQUFVLE9BQVYsQ0FBVDtBQUNILGNBUEQ7QUFRQSxvQkFBTyxRQUFQO0FBQ0gsVUE3RkU7QUE4RkgsZUFBTSxVQTlGSDtBQStGSCwwQkFBaUIseUJBQUMsaUJBQUQsRUFBb0IsT0FBcEIsRUFBZ0M7O0FBRTdDLHFCQUFRLElBQVIsQ0FBYSxVQUFiLEVBQXlCLE9BQXpCLENBQWlDLFVBQUMsU0FBRCxFQUFZLFVBQVosRUFBMkI7QUFDeEQsc0JBQUssSUFBSSxHQUFULElBQWdCLFVBQWhCLEVBQTRCO0FBQ3hCLHlCQUFJLFdBQVcsY0FBWCxDQUEwQixHQUExQixDQUFKLEVBQW9DO0FBQ2hDLDZCQUFJLFdBQVcsR0FBWCxFQUFnQixHQUFoQixLQUF3QixJQUE1QixFQUFrQztBQUM5QixxQ0FBUSxRQUFSLENBQWlCLEdBQWpCO0FBQ0gsMEJBRkQsTUFFTztBQUNILHFDQUFRLFdBQVIsQ0FBb0IsR0FBcEI7QUFDSDtBQUNKO0FBQ0o7QUFDSixjQVZEO0FBYUg7QUE5R0UsTUFBUDtBQWdISCxFOzs7Ozs7Ozs7OztTQzlHZSxpQixHQUFBLGlCOztBQU5oQjs7QUFNTyxVQUFTLGlCQUFULENBQTJCLE1BQTNCLEVBQW1DOztBQUV0QyxTQUFNLGNBQWMsU0FBZCxXQUFjLENBQVMsS0FBVCxFQUFnQixLQUFoQixFQUF1QixlQUF2QixFQUF3QyxLQUF4QyxFQUErQyxhQUEvQyxFQUE4RCxHQUE5RCxFQUFtRSxXQUFuRSxFQUFnRjs7QUFFaEcsZUFBTSxlQUFOLElBQXlCLEtBQXpCO0FBQ0EsYUFBSSxhQUFKLEVBQW1CO0FBQ2YsbUJBQU0sYUFBTixJQUF1QixHQUF2QjtBQUNIO0FBQ0QsZUFBTSxNQUFOLEdBQWUsS0FBZjtBQUNBLGVBQU0sTUFBTixHQUFnQixVQUFVLENBQTFCO0FBQ0EsZUFBTSxLQUFOLEdBQWUsVUFBVyxjQUFjLENBQXhDO0FBQ0EsZUFBTSxPQUFOLEdBQWdCLEVBQUUsTUFBTSxNQUFOLElBQWdCLE1BQU0sS0FBeEIsQ0FBaEI7O0FBRUEsZUFBTSxJQUFOLEdBQWEsRUFBRSxNQUFNLEtBQU4sR0FBYyxDQUFDLFFBQVEsQ0FBVCxNQUFnQixDQUFoQyxDQUFiOztBQUVILE1BYkQ7O0FBZUEsWUFBTztBQUNILGVBQU0sVUFESDtBQUVILGtCQUFTLGlCQUFTLGlCQUFULEVBQTRCLFVBQTVCLEVBQXdDO0FBQzdDLGlCQUFNLGVBQWUsRUFBckI7QUFDQSxpQkFBSSxRQUFRLFVBQVIsQ0FBbUIsa0JBQWtCLE1BQXJDLENBQUosRUFBa0Q7QUFDOUMsbUNBQWtCLE1BQWxCO0FBQ0g7QUFDRCxpQkFBTSxTQUFTLGtCQUFrQixlQUFqQztBQUNBLGlCQUFJLFFBQVEsV0FBVyxLQUFYLENBQWlCLDRGQUFqQixDQUFaO0FBQ0EsaUJBQUksQ0FBQyxLQUFMLEVBQVk7QUFDUix1QkFBTSxDQUFDLG1GQUFELEVBQXNGLFVBQXRGLEVBQWtHLEdBQWxHLEVBQXVHLElBQXZHLENBQTRHLEVBQTVHLENBQU47QUFDSDtBQUNELGlCQUFNLE1BQU0sTUFBTSxDQUFOLENBQVo7QUFDQSxpQkFBTSxNQUFNLE1BQU0sQ0FBTixDQUFaO0FBQ0EsaUJBQU0sVUFBVSxNQUFNLENBQU4sQ0FBaEI7QUFDQSxpQkFBTSxhQUFhLE1BQU0sQ0FBTixDQUFuQjtBQUNBLHFCQUFRLElBQUksS0FBSixDQUFVLHdEQUFWLENBQVI7QUFDQSxpQkFBSSxDQUFDLEtBQUwsRUFBWTtBQUNSLHVCQUFNLENBQUMsMEdBQUQsRUFBNkcsR0FBN0csRUFBa0gsR0FBbEgsRUFBdUgsSUFBdkgsQ0FBNEgsRUFBNUgsQ0FBTjtBQUNIO0FBQ0QsaUJBQU0sa0JBQWtCLE1BQU0sQ0FBTixLQUFZLE1BQU0sQ0FBTixDQUFwQztBQUNBLGlCQUFNLGdCQUFnQixNQUFNLENBQU4sQ0FBdEI7O0FBRUEsaUJBQUksWUFBWSxDQUFDLDZCQUE2QixJQUE3QixDQUFrQyxPQUFsQyxDQUFELElBQ1IsNEZBQTRGLElBQTVGLENBQWlHLE9BQWpHLENBREosQ0FBSixFQUNvSDtBQUNoSCx1QkFBTSxDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLDhFQUFyQixFQUFxRyxJQUFyRyxDQUEwRyxFQUExRyxDQUFOO0FBQ0g7QUFDRCxpQkFBSSx5QkFBSjtBQUFBLGlCQUFzQix1QkFBdEI7QUFBQSxpQkFBc0MseUJBQXRDO0FBQUEsaUJBQXdELHVCQUF4RDtBQUNBLGlCQUFNLGVBQWU7QUFDakI7QUFEaUIsY0FBckI7O0FBSUEsaUJBQUksVUFBSixFQUFnQjtBQUNaLG9DQUFtQixPQUFPLFVBQVAsQ0FBbkI7QUFDSCxjQUZELE1BRU87QUFDSCxvQ0FBbUIsMEJBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDcEMsNEJBQU8scUJBQVEsS0FBUixDQUFQO0FBQ0gsa0JBRkQ7QUFHQSxrQ0FBaUIsd0JBQVMsR0FBVCxFQUFjO0FBQzNCLDRCQUFPLEdBQVA7QUFDSCxrQkFGRDtBQUdIO0FBQ0QsaUJBQUksZ0JBQUosRUFBc0I7QUFDbEIsa0NBQWlCLHdCQUFTLEdBQVQsRUFBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCOztBQUV6Qyx5QkFBSSxhQUFKLEVBQW1CO0FBQ2Ysc0NBQWEsYUFBYixJQUE4QixHQUE5QjtBQUNIO0FBQ0Qsa0NBQWEsZUFBYixJQUFnQyxLQUFoQztBQUNBLGtDQUFhLE1BQWIsR0FBc0IsS0FBdEI7QUFDQSw0QkFBTyxpQkFBaUIsTUFBakIsRUFBeUIsWUFBekIsQ0FBUDtBQUNILGtCQVJEO0FBU0g7QUFDRCxpQkFBSSxlQUFlLHdCQUFuQjtBQUNBLGlCQUFJLGNBQWMsd0JBQWxCO0FBQ0EsaUJBQU0sWUFBWSxFQUFsQjtBQUNBLGlCQUFNLGlCQUFpQixTQUFqQixjQUFpQixHQUFNLENBQUUsQ0FBL0I7QUFDQSxpQkFBTSxVQUFVLE9BQU8sZ0JBQVAsQ0FBd0IsR0FBeEIsRUFBNkIsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DO0FBQzdFLCtCQUFjO0FBQ1YsNEJBQU8sRUFERztBQUVWLDhCQUFTLEVBRkM7QUFHViwrQkFBVTtBQUhBLGtCQUFkO0FBS0EscUJBQUksY0FBSjtBQUFBLHFCQUNJLGVBQWUsd0JBRG5CO0FBQUEscUJBRUkseUJBRko7QUFBQSxxQkFHSSxZQUhKO0FBQUEscUJBR1MsY0FIVDtBQUFBLHFCO0FBSUksbUNBSko7QUFBQSxxQkFLSSxvQkFMSjtBQUFBLHFCQU1JLHVCQU5KO0FBQUEscUJBT0ksY0FQSjtBQUFBLHFCO0FBUUksd0NBUko7QUFBQSxxQkFTSSx5QkFUSjs7QUFXQSxxQkFBSSxPQUFKLEVBQWE7QUFDVCw0QkFBTyxPQUFQLElBQWtCLFVBQWxCO0FBQ0g7O0FBRUQscUJBQUkseUJBQVksVUFBWixDQUFKLEVBQTZCO0FBQ3pCLHNDQUFpQixVQUFqQjtBQUNBLG1DQUFjLGtCQUFrQixnQkFBaEM7QUFDSCxrQkFIRCxNQUdPO0FBQ0gsbUNBQWMsa0JBQWtCLGNBQWhDOztBQUVBLHNDQUFpQixFQUFqQjtBQUNBLDBCQUFLLElBQUksT0FBVCxJQUFvQixVQUFwQixFQUFnQztBQUM1Qiw2QkFBSSxlQUFlLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0MsT0FBaEMsS0FBNEMsUUFBUSxNQUFSLENBQWUsQ0FBZixNQUFzQixHQUF0RSxFQUEyRTtBQUN2RSw0Q0FBZSxJQUFmLENBQW9CLE9BQXBCO0FBQ0g7QUFDSjtBQUNKOztBQUVELG9DQUFtQixlQUFlLE1BQWxDO0FBQ0Esa0NBQWlCLElBQUksS0FBSixDQUFVLGdCQUFWLENBQWpCOzs7QUFHQSxzQkFBSyxRQUFRLENBQWIsRUFBZ0IsUUFBUSxnQkFBeEIsRUFBMEMsT0FBMUMsRUFBbUQ7QUFDL0MsMkJBQU8sZUFBZSxjQUFoQixHQUFrQyxLQUFsQyxHQUEwQyxlQUFlLEtBQWYsQ0FBaEQ7QUFDQSw2QkFBUSxXQUFXLEdBQVgsQ0FBUjtBQUNBLGlDQUFZLFlBQVksR0FBWixFQUFpQixLQUFqQixFQUF3QixLQUF4QixDQUFaO0FBQ0EseUJBQUksYUFBYSxTQUFiLENBQUosRUFBNkI7O0FBRXpCLGlDQUFRLGFBQWEsU0FBYixDQUFSO0FBQ0EsZ0NBQU8sYUFBYSxTQUFiLENBQVA7QUFDQSxzQ0FBYSxTQUFiLElBQTBCLEtBQTFCO0FBQ0Esd0NBQWUsS0FBZixJQUF3QixLQUF4QjtBQUNILHNCQU5ELE1BTU8sSUFBSSxhQUFhLFNBQWIsQ0FBSixFQUE2Qjs7QUFFaEMsaUNBQVEsT0FBUixDQUFnQixjQUFoQixFQUFnQyxVQUFTLEtBQVQsRUFBZ0I7QUFDNUMsaUNBQUksU0FBUyxNQUFNLEtBQW5CLEVBQTBCO0FBQ3RCLDhDQUFhLE1BQU0sRUFBbkIsSUFBeUIsS0FBekI7QUFDSDtBQUNKLDBCQUpEO0FBS0EsK0JBQU0sZUFBZSxPQUFmLEVBQ0YscUpBREUsRUFFRixVQUZFLEVBRVUsU0FGVixFQUVxQixLQUZyQixDQUFOO0FBR0gsc0JBVk0sTUFVQTs7QUFFSCx3Q0FBZSxLQUFmLElBQXdCO0FBQ3BCLGlDQUFJLFNBRGdCO0FBRXBCLG9DQUFPO0FBRmEsMEJBQXhCO0FBSUEsc0NBQWEsU0FBYixJQUEwQixJQUExQjtBQUNIO0FBQ0o7OztBQUdELHNCQUFLLElBQUksUUFBVCxJQUFxQixZQUFyQixFQUFtQztBQUMvQiw2QkFBUSxhQUFhLFFBQWIsQ0FBUjtBQUNBLHdDQUFtQixVQUFVLE9BQVYsQ0FBa0IsS0FBbEIsQ0FBbkI7QUFDQSwrQkFBVSxNQUFWLENBQWlCLGdCQUFqQixFQUFtQyxDQUFuQztBQUNBLGlDQUFZLE9BQVosQ0FBb0IsSUFBcEIsQ0FBeUIsS0FBekI7QUFDQSwyQkFBTSxLQUFOLENBQVksUUFBWjtBQUNIOzs7QUFHRCxzQkFBSyxRQUFRLENBQWIsRUFBZ0IsUUFBUSxnQkFBeEIsRUFBMEMsT0FBMUMsRUFBbUQ7QUFDL0MsMkJBQU8sZUFBZSxjQUFoQixHQUFrQyxLQUFsQyxHQUEwQyxlQUFlLEtBQWYsQ0FBaEQ7QUFDQSw2QkFBUSxXQUFXLEdBQVgsQ0FBUjtBQUNBLDZCQUFRLGVBQWUsS0FBZixDQUFSO0FBQ0EseUJBQUksTUFBTSxLQUFWLEVBQWlCOzs7QUFHYixxQ0FBWSxNQUFNLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDLGVBQWhDLEVBQWlELEtBQWpELEVBQXdELGFBQXhELEVBQXVFLEdBQXZFLEVBQTRFLGdCQUE1RTtBQUNBLHFDQUFZLFFBQVosQ0FBcUIsSUFBckIsQ0FBMEIsS0FBMUI7QUFDSCxzQkFMRCxNQUtPOztBQUVILCtCQUFNLEtBQU4sR0FBYyxPQUFPLElBQVAsRUFBZDtBQUNBLG1DQUFVLE1BQVYsQ0FBaUIsS0FBakIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7QUFDQSxxQ0FBWSxLQUFaLENBQWtCLElBQWxCLENBQXVCLEtBQXZCO0FBQ0Esc0NBQWEsTUFBTSxFQUFuQixJQUF5QixLQUF6QjtBQUNBLHFDQUFZLE1BQU0sS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsZUFBaEMsRUFBaUQsS0FBakQsRUFBd0QsYUFBeEQsRUFBdUUsR0FBdkUsRUFBNEUsZ0JBQTVFO0FBQ0g7QUFDRCwyQkFBTSxLQUFOLEdBQWMsS0FBZDtBQUNIO0FBQ0QsZ0NBQWUsWUFBZjtBQUNBLDhCQUFhLE9BQWIsQ0FBcUIsVUFBQyxFQUFELEVBQVE7QUFDekIsd0JBQUcsU0FBSCxFQUFjLFdBQWQ7QUFDSCxrQkFGRDtBQUdILGNBdEdlLENBQWhCO0FBdUdBLG9CQUFPLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLFlBQU07QUFDekIsd0JBQU8sYUFBYSxNQUFwQixFQUE0QjtBQUN4QixzQkFBQyxhQUFhLEtBQWIsTUFBd0IsUUFBUSxJQUFqQztBQUNIO0FBQ0Q7QUFDSCxjQUxEO0FBTUEsaUJBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTtBQUNuQix3QkFBTztBQUNILDhCQUFTLFNBRE47QUFFSCxrQ0FBYTtBQUZWLGtCQUFQO0FBSUgsY0FMRDtBQU1BLHNCQUFTLGFBQVQsR0FBeUIsaUJBQWlCLGVBQTFDO0FBQ0Esc0JBQVMsT0FBVCxHQUFtQixVQUFDLFFBQUQsRUFBYztBQUM3QixxQkFBSSxRQUFRLFVBQVIsQ0FBbUIsUUFBbkIsQ0FBSixFQUFrQztBQUM5QixrQ0FBYSxJQUFiLENBQWtCLFFBQWxCO0FBQ0EsNEJBQU8sWUFBTTtBQUNULDZCQUFNLFFBQVEsYUFBYSxPQUFiLENBQXFCLFFBQXJCLENBQWQ7QUFDQSxzQ0FBYSxNQUFiLENBQW9CLEtBQXBCLEVBQTJCLENBQTNCO0FBQ0gsc0JBSEQ7QUFJSDtBQUNELHVCQUFNLDRCQUFOO0FBQ0gsY0FURDtBQVVBLG9CQUFPLFFBQVA7QUFDSDtBQXhMRSxNQUFQO0FBMExILEU7Ozs7Ozs7Ozs7OztBQ2pORDs7OztBQUNBOzs7Ozs7QUFDQSxLQUFJLG1CQUFvQixZQUFXOztBQUUvQixTQUFJLFFBQVEsUUFBUSxPQUFSLENBQWdCLFNBQWhCLElBQTZCLFFBQVEsT0FBUixDQUFnQixTQUF6RDtBQUNBLFdBQU0sS0FBTixHQUFjLFVBQVMsUUFBVCxFQUFtQjtBQUM3QixhQUFJLFNBQVM7QUFDVCxxQkFBUTtBQURDLFVBQWI7QUFHQSxjQUFLLElBQUksUUFBUSxDQUFqQixFQUFvQixRQUFRLEtBQUssTUFBakMsRUFBeUMsT0FBekMsRUFBa0Q7QUFDOUMsaUJBQUksUUFBUSxLQUFLLEtBQUwsRUFBWSxhQUFaLENBQTBCLFFBQTFCLENBQVo7QUFDQSxpQkFBSSxLQUFKLEVBQVc7QUFDUCx3QkFBTyxPQUFPLE1BQVAsRUFBUCxJQUEwQixLQUExQjtBQUNIO0FBQ0o7O0FBRUQsZ0JBQU8sUUFBUSxPQUFSLENBQWdCLEtBQUssTUFBTCxDQUFoQixDQUFQO0FBQ0gsTUFaRDtBQWFBLFdBQU0sTUFBTixHQUFlLFVBQVMsTUFBVCxFQUFpQjtBQUM1QixhQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLGlCQUFNLFFBQVEsS0FBSyxJQUFMLENBQVUsVUFBVixDQUFkO0FBQ0Esb0JBQU8sU0FBUyxNQUFNLE1BQU4sQ0FBaEI7QUFDSDtBQUNKLE1BTEQ7QUFNQSxXQUFNLEtBQU4sR0FBYyxZQUFXO0FBQ3JCLGFBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2IsaUJBQU0sT0FBTyxLQUFLLElBQUwsQ0FBVSxVQUFWLEtBQXlCLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBekIsSUFBaUQsS0FBSyxJQUFMLENBQVUsY0FBVixDQUFqRCxJQUE4RSxLQUFLLElBQWhHO0FBQ0Esb0JBQU8sUUFBUSxLQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQXNCLFNBQXRCLENBQVIsSUFBNEMsRUFBbkQ7QUFDSDtBQUNKLE1BTEQ7QUFNQSxXQUFNLEdBQU4sR0FBWSxZQUFXO0FBQ25CLGFBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2IsaUJBQU0sT0FBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWI7QUFDQSxvQkFBTyxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsU0FBakIsRUFBNEIsU0FBNUIsQ0FBZjtBQUNIO0FBQ0osTUFMRDs7QUFPQSxjQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CO0FBQ2YsZ0JBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLEtBQXZCLENBQTZCLEVBQTdCLEVBQWlDLEdBQWpDLENBQVA7QUFDSDs7QUFFRCxjQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsaUJBQXRCLEVBQXlDO0FBQ3JDLGVBQU0sUUFBUSxPQUFSLENBQWdCLEdBQWhCLENBQU47O0FBRUEsY0FBSyxJQUFJLEtBQUssQ0FBZCxFQUFpQixLQUFLLElBQUksQ0FBSixFQUFPLFVBQVAsQ0FBa0IsTUFBeEMsRUFBZ0QsSUFBaEQsRUFBc0Q7QUFDbEQsaUJBQU0sZ0JBQWdCLElBQUksQ0FBSixFQUFPLFVBQVAsQ0FBa0IsRUFBbEIsRUFBc0IsSUFBNUM7QUFDQSxpQkFBTSxhQUFhLElBQUksQ0FBSixFQUFPLFVBQVAsQ0FBa0IsRUFBbEIsRUFBc0IsS0FBekM7QUFDQSxpQkFBSSxrQkFBSjtBQUNBLGlCQUFJLFlBQVksNEJBQWtCLElBQWxCLENBQXVCLGFBQXZCLENBQWhCLEVBQXVEO0FBQ25ELHFCQUFNLG9CQUFvQixVQUFVLE9BQVYsQ0FBa0IsaUJBQWxCLEVBQXFDLFVBQXJDLENBQTFCO0FBQ0EscUJBQUksSUFBSixDQUFTLFVBQVUsSUFBbkIsRUFBeUIsaUJBQXpCO0FBQ0EscUJBQUksUUFBUSxVQUFSLENBQW1CLFVBQVUsZUFBN0IsQ0FBSixFQUFtRDtBQUMvQywrQkFBVSxlQUFWLENBQTBCLGlCQUExQixFQUE2QyxRQUFRLE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBN0MsRUFBbUUsd0JBQWUsR0FBZixDQUFuRTtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxhQUFNLFlBQVksSUFBSSxRQUFKLEVBQWxCO0FBQ0EsY0FBSyxJQUFJLE1BQUssQ0FBZCxFQUFpQixNQUFLLFVBQVUsTUFBaEMsRUFBd0MsS0FBeEMsRUFBOEM7QUFDMUMscUJBQVEsVUFBVSxHQUFWLENBQVIsRUFBdUIsaUJBQXZCO0FBQ0g7QUFDSjs7QUFFRCxjQUFTLE9BQVQsQ0FBaUIsaUJBQWpCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGFBQUksVUFBVSxRQUFRLE9BQVIsQ0FBZ0IsR0FBaEIsQ0FBZDtBQUNBLGFBQUksQ0FBQyxPQUFELElBQVksQ0FBQyxpQkFBakIsRUFBb0M7QUFDaEMsb0JBQU8sT0FBUDtBQUNIO0FBQ0QsaUJBQVEsT0FBUixFQUFpQixpQkFBakI7QUFDQSxnQkFBTyxPQUFQO0FBQ0g7O0FBRUQsWUFBTyxPQUFQO0FBQ0gsRUF2RXNCLEVBQXZCO21CQXdFZSxnQjs7Ozs7Ozs7Ozs7O0FDMUVmOztBQU9BLFVBQVMsVUFBVCxDQUFvQixPQUFwQixFQUE2QixnQkFBN0IsRUFBK0M7QUFDM0MsU0FBSSxnQkFBSixFQUFzQjtBQUNsQixhQUFJLE9BQU8sT0FBTyxJQUFQLENBQVksZ0JBQVosQ0FBWDtBQUNBLGFBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWOztBQUVBLGNBQUssSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE1BQXJCLEVBQTZCLElBQUksQ0FBakMsRUFBb0MsR0FBcEMsRUFBeUM7QUFDckMsbUJBQU0sS0FBSyxDQUFMLENBQU47QUFDQSxrQkFBSyxHQUFMLElBQVksaUJBQWlCLEdBQWpCLENBQVo7QUFDSDtBQUNKLE1BUkQsTUFRTztBQUNILGNBQUssS0FBTCxHQUFhLEVBQWI7QUFDSDs7QUFFRCxVQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDSDtBQUNELEtBQU0sV0FBVyxRQUFRLFFBQVIsQ0FBaUIsQ0FBQyxJQUFELENBQWpCLEVBQXlCLEdBQXpCLENBQTZCLFVBQTdCLENBQWpCO0FBQ0EsS0FBTSxnQkFBZ0IsUUFBUSxRQUFSLENBQWlCLENBQUMsSUFBRCxDQUFqQixFQUF5QixHQUF6QixDQUE2QixlQUE3QixDQUF0QjtBQUNBLFlBQVcsU0FBWCxHQUF1Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCbkIsb0NBaEJtQjs7Ozs7Ozs7Ozs7OztBQThCbkIsZ0JBQVcsbUJBQVMsUUFBVCxFQUFtQjtBQUMxQixhQUFJLFlBQVksU0FBUyxNQUFULEdBQWtCLENBQWxDLEVBQXFDO0FBQ2pDLHNCQUFTLFFBQVQsQ0FBa0IsS0FBSyxTQUF2QixFQUFrQyxRQUFsQztBQUNIO0FBQ0osTUFsQ2tCOzs7Ozs7Ozs7Ozs7O0FBK0NuQixtQkFBYyxzQkFBUyxRQUFULEVBQW1CO0FBQzdCLGFBQUksWUFBWSxTQUFTLE1BQVQsR0FBa0IsQ0FBbEMsRUFBcUM7QUFDakMsc0JBQVMsV0FBVCxDQUFxQixLQUFLLFNBQTFCLEVBQXFDLFFBQXJDO0FBQ0g7QUFDSixNQW5Ea0I7Ozs7Ozs7Ozs7Ozs7O0FBaUVuQixtQkFBYyxzQkFBUyxVQUFULEVBQXFCLFVBQXJCLEVBQWlDO0FBQzNDLGFBQUksUUFBUSxnQkFBZ0IsVUFBaEIsRUFBNEIsVUFBNUIsQ0FBWjtBQUNBLGFBQUksU0FBUyxNQUFNLE1BQW5CLEVBQTJCO0FBQ3ZCLHNCQUFTLFFBQVQsQ0FBa0IsS0FBSyxTQUF2QixFQUFrQyxLQUFsQztBQUNIOztBQUVELGFBQUksV0FBVyxnQkFBZ0IsVUFBaEIsRUFBNEIsVUFBNUIsQ0FBZjtBQUNBLGFBQUksWUFBWSxTQUFTLE1BQXpCLEVBQWlDO0FBQzdCLHNCQUFTLFdBQVQsQ0FBcUIsS0FBSyxTQUExQixFQUFxQyxRQUFyQztBQUNIO0FBQ0osTUEzRWtCOzs7Ozs7Ozs7OztBQXNGbkIsV0FBTSxjQUFTLEdBQVQsRUFBYyxLQUFkLEVBQXFCLFNBQXJCLEVBQWdDLFFBQWhDLEVBQTBDOzs7OztBQUs1QyxhQUFJLE9BQU8sS0FBSyxTQUFMLENBQWUsQ0FBZixDQUFYO0FBQUEsYUFDSSxhQUFhLFFBQVEsa0JBQVIsQ0FBMkIsSUFBM0IsRUFBaUMsR0FBakMsQ0FEakI7QUFBQSxhQUVJLGFBQWEsUUFBUSxrQkFBUixDQUEyQixHQUEzQixDQUZqQjtBQUFBLGFBR0ksV0FBVyxHQUhmO0FBQUEsYUFJSSxRQUpKOztBQU1BLGFBQUksVUFBSixFQUFnQjtBQUNaLGtCQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLEdBQXBCLEVBQXlCLEtBQXpCO0FBQ0Esd0JBQVcsVUFBWDtBQUNILFVBSEQsTUFHTyxJQUFJLFVBQUosRUFBZ0I7QUFDbkIsa0JBQUssVUFBTCxJQUFtQixLQUFuQjtBQUNBLHdCQUFXLFVBQVg7QUFDSDs7QUFFRCxjQUFLLEdBQUwsSUFBWSxLQUFaOzs7QUFHQSxhQUFJLFFBQUosRUFBYztBQUNWLGtCQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLFFBQWxCO0FBQ0gsVUFGRCxNQUVPO0FBQ0gsd0JBQVcsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFYO0FBQ0EsaUJBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxzQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixXQUFXLHlCQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBN0I7QUFDSDtBQUNKOztBQUVELG9CQUFXLFVBQVUsS0FBSyxTQUFmLENBQVg7O0FBRUEsYUFBSyxhQUFhLEdBQWIsS0FBcUIsUUFBUSxNQUFSLElBQWtCLFFBQVEsV0FBL0MsQ0FBRCxJQUNDLGFBQWEsS0FBYixJQUFzQixRQUFRLEtBRG5DLEVBQzJDOztBQUV2QyxrQkFBSyxHQUFMLElBQVksUUFBUSxjQUFjLEtBQWQsRUFBcUIsUUFBUSxLQUE3QixDQUFwQjtBQUNILFVBSkQsTUFJTyxJQUFJLGFBQWEsS0FBYixJQUFzQixRQUFRLFFBQTlCLElBQTBDLFFBQVEsU0FBUixDQUFrQixLQUFsQixDQUE5QyxFQUF3RTs7QUFFM0UsaUJBQUksU0FBUyxFQUFiOzs7QUFHQSxpQkFBSSxnQkFBZ0Isa0JBQUssS0FBTCxDQUFwQjs7QUFFQSxpQkFBSSxhQUFhLHFDQUFqQjtBQUNBLGlCQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsYUFBVixJQUEyQixVQUEzQixHQUF3QyxLQUF0RDs7O0FBR0EsaUJBQUksVUFBVSxjQUFjLEtBQWQsQ0FBb0IsT0FBcEIsQ0FBZDs7O0FBR0EsaUJBQUksb0JBQW9CLEtBQUssS0FBTCxDQUFXLFFBQVEsTUFBUixHQUFpQixDQUE1QixDQUF4QjtBQUNBLGtCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksaUJBQXBCLEVBQXVDLEdBQXZDLEVBQTRDO0FBQ3hDLHFCQUFJLFdBQVcsSUFBSSxDQUFuQjs7QUFFQSwyQkFBVSxjQUFjLGtCQUFLLFFBQVEsUUFBUixDQUFMLENBQWQsRUFBdUMsSUFBdkMsQ0FBVjs7QUFFQSwyQkFBVyxNQUFNLGtCQUFLLFFBQVEsV0FBVyxDQUFuQixDQUFMLENBQWpCO0FBQ0g7OztBQUdELGlCQUFJLFlBQVksa0JBQUssUUFBUSxJQUFJLENBQVosQ0FBTCxFQUFxQixLQUFyQixDQUEyQixJQUEzQixDQUFoQjs7O0FBR0EsdUJBQVUsY0FBYyxrQkFBSyxVQUFVLENBQVYsQ0FBTCxDQUFkLEVBQWtDLElBQWxDLENBQVY7OztBQUdBLGlCQUFJLFVBQVUsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUN4QiwyQkFBVyxNQUFNLGtCQUFLLFVBQVUsQ0FBVixDQUFMLENBQWpCO0FBQ0g7QUFDRCxrQkFBSyxHQUFMLElBQVksUUFBUSxNQUFwQjtBQUNIOztBQUVELGFBQUksY0FBYyxLQUFsQixFQUF5QjtBQUNyQixpQkFBSSxVQUFVLElBQVYsSUFBa0IsUUFBUSxXQUFSLENBQW9CLEtBQXBCLENBQXRCLEVBQWtEO0FBQzlDLHNCQUFLLFNBQUwsQ0FBZSxVQUFmLENBQTBCLFFBQTFCO0FBQ0gsY0FGRCxNQUVPO0FBQ0gscUJBQUksaUJBQWlCLElBQWpCLENBQXNCLFFBQXRCLENBQUosRUFBcUM7QUFDakMsMEJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsUUFBcEIsRUFBOEIsS0FBOUI7QUFDSCxrQkFGRCxNQUVPO0FBQ0gsb0NBQWUsS0FBSyxTQUFMLENBQWUsQ0FBZixDQUFmLEVBQWtDLFFBQWxDLEVBQTRDLEtBQTVDO0FBQ0g7QUFDSjtBQUNKOzs7QUFHRCxhQUFJLGNBQWMsS0FBSyxXQUF2QjtBQUNBLGFBQUksV0FBSixFQUFpQjtBQUNiLHFCQUFRLE9BQVIsQ0FBZ0IsWUFBWSxRQUFaLENBQWhCLEVBQXVDLFVBQVMsRUFBVCxFQUFhO0FBQ2hELHFCQUFJO0FBQ0Esd0JBQUcsS0FBSDtBQUNILGtCQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDUiw2QkFBUSxHQUFSLENBQVksQ0FBWjtBQUNIO0FBQ0osY0FORDtBQU9IO0FBQ0osTUF0TGtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0TW5CLGVBQVUsa0JBQVMsR0FBVCxFQUFjLEVBQWQsRUFBa0I7QUFDeEIsYUFBSSxRQUFRLElBQVo7QUFBQSxhQUNJLGNBQWUsTUFBTSxXQUFOLEtBQXNCLE1BQU0sV0FBTixHQUFvQixJQUFJLEdBQUosRUFBMUMsQ0FEbkI7QUFBQSxhQUVJLFlBQWEsWUFBWSxHQUFaLE1BQXFCLFlBQVksR0FBWixJQUFtQixFQUF4QyxDQUZqQjs7QUFJQSxtQkFBVSxJQUFWLENBQWUsRUFBZjtBQUNBLDZCQUFZLFVBQVosQ0FBdUIsVUFBdkIsQ0FBa0MsWUFBVztBQUN6QyxpQkFBSSxDQUFDLFVBQVUsT0FBWCxJQUFzQixNQUFNLGNBQU4sQ0FBcUIsR0FBckIsQ0FBdEIsSUFBbUQsQ0FBQyxRQUFRLFdBQVIsQ0FBb0IsTUFBTSxHQUFOLENBQXBCLENBQXhELEVBQXlGOztBQUVyRixvQkFBRyxNQUFNLEdBQU4sQ0FBSDtBQUNIO0FBQ0osVUFMRDs7QUFPQSxnQkFBTyxZQUFXO0FBQ2QscUJBQVEsV0FBUixDQUFvQixTQUFwQixFQUErQixFQUEvQjtBQUNILFVBRkQ7QUFHSDtBQTVOa0IsRUFBdkI7O0FBK05BLFVBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQzs7QUFFakMsU0FBSSxTQUFTLEVBQWI7QUFBQSxTQUNJLFVBQVUsS0FBSyxLQUFMLENBQVcsS0FBWCxDQURkO0FBQUEsU0FFSSxVQUFVLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FGZDs7QUFJQSxZQUNJLEtBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLGFBQUksUUFBUSxRQUFRLENBQVIsQ0FBWjs7QUFFQSxjQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUNyQyxpQkFBSSxVQUFVLFFBQVEsQ0FBUixDQUFkLEVBQTBCO0FBQ3RCLDBCQUFTLEtBQVQ7QUFDSDtBQUNKOztBQUVELG1CQUFVLENBQUMsT0FBTyxNQUFQLEdBQWdCLENBQWhCLEdBQW9CLEdBQXBCLEdBQTBCLEVBQTNCLElBQWlDLEtBQTNDO0FBQ0g7QUFDTCxZQUFPLE1BQVA7QUFDSDs7QUFFRCxVQUFTLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEI7QUFDeEIsU0FBTSxTQUFTLFFBQVEsT0FBUixDQUFnQixPQUFoQixFQUF5QixDQUF6QixDQUFmO0FBQ0EsU0FBSSxNQUFKLEVBQVk7QUFDUixnQkFBTyxPQUFPLFFBQWQ7QUFDSDtBQUNKO0FBQ0QsS0FBSSxvQkFBb0IsT0FBTyxRQUFQLENBQWdCLGFBQWhCLENBQThCLEtBQTlCLENBQXhCO0FBQ0EsS0FBSSxtQkFBbUIsS0FBdkI7O0FBRUEsVUFBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLFFBQWpDLEVBQTJDLEtBQTNDLEVBQWtEOzs7O0FBSTlDLHVCQUFrQixTQUFsQixHQUE4QixXQUFXLFFBQVgsR0FBc0IsR0FBcEQ7QUFDQSxTQUFJLGFBQWEsa0JBQWtCLFVBQWxCLENBQTZCLFVBQTlDO0FBQ0EsU0FBSSxZQUFZLFdBQVcsQ0FBWCxDQUFoQjs7QUFFQSxnQkFBVyxlQUFYLENBQTJCLFVBQVUsSUFBckM7QUFDQSxlQUFVLEtBQVYsR0FBa0IsS0FBbEI7QUFDQSxhQUFRLFVBQVIsQ0FBbUIsWUFBbkIsQ0FBZ0MsU0FBaEM7QUFDSDttQkFDYyxVOzs7Ozs7Ozs7Ozs7OztBQ2pTZjs7OztBQVNBLEtBQU0sU0FBUyxRQUFRLFFBQVIsQ0FBaUIsQ0FBQyxJQUFELENBQWpCLEVBQXlCLEdBQXpCLENBQTZCLFFBQTdCLENBQWY7O0tBRU0sVTs7Ozs7OzttQ0FDZSxLLEVBQU8sUSxFQUFVO0FBQzlCLGlCQUFNLFdBQVcsRUFBakI7QUFDQSxpQkFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixRQUFqQixDQUFMLEVBQWlDO0FBQzdCLHFCQUFJLGFBQWEsSUFBYixJQUFxQixhQUFhLEdBQXRDLEVBQTJDO0FBQ3ZDLGdDQUFZLFlBQU07QUFDZCw2QkFBTSxXQUFXLEVBQWpCO0FBQ0EsOEJBQUssSUFBSSxHQUFULElBQWdCLEtBQWhCLEVBQXVCO0FBQ25CLGlDQUFJLE1BQU0sY0FBTixDQUFxQixHQUFyQixLQUE2QixDQUFDLElBQUksVUFBSixDQUFlLEdBQWYsQ0FBbEMsRUFBdUQ7QUFDbkQsMENBQVMsR0FBVCxJQUFnQixHQUFoQjtBQUNIO0FBQ0o7QUFDRCxnQ0FBTyxRQUFQO0FBQ0gsc0JBUlUsRUFBWDtBQVNILGtCQVZELE1BVU8sSUFBSSxhQUFhLEtBQWpCLEVBQXdCO0FBQzNCLDRCQUFPLFFBQVA7QUFDSDtBQUNKO0FBQ0Qsa0JBQUssSUFBSSxHQUFULElBQWdCLFFBQWhCLEVBQTBCO0FBQ3RCLHFCQUFJLFNBQVMsY0FBVCxDQUF3QixHQUF4QixDQUFKLEVBQWtDO0FBQzlCLHlCQUFNLFNBQVMsNEJBQW9CLElBQXBCLENBQXlCLFNBQVMsR0FBVCxDQUF6QixDQUFmO0FBQ0EseUJBQU0sT0FBTyxPQUFPLENBQVAsQ0FBYjtBQUNBLHlCQUFNLFlBQVksT0FBTyxDQUFQLEtBQWEsR0FBL0I7QUFDQSx5QkFBTSxZQUFZLE9BQU8sU0FBUCxDQUFsQjs7QUFKOEI7QUFLOUIsaUNBQVEsSUFBUjtBQUNJLGtDQUFLLEdBQUw7QUFDSSwwQ0FBUyxHQUFULElBQWdCLFVBQVUsS0FBVixDQUFoQjtBQUNBO0FBQ0osa0NBQUssR0FBTDtBQUNJLHFDQUFNLEtBQUssT0FBTyxVQUFVLEtBQVYsQ0FBUCxDQUFYO0FBQ0EsMENBQVMsR0FBVCxJQUFnQixVQUFDLE1BQUQsRUFBWTtBQUN4Qiw0Q0FBTyxHQUFHLEtBQUgsRUFBVSxNQUFWLENBQVA7QUFDSCxrQ0FGRDtBQUdBO0FBQ0osa0NBQUssR0FBTDtBQUNJLHFDQUFJLE1BQU0sVUFBVSxLQUFWLENBQVY7QUFDQSxxQ0FBTSxRQUFRLDBCQUFhLEdBQWIsQ0FBZDtBQUNBLHFDQUFJLEtBQUosRUFBVztBQUNQLDhDQUFTLEdBQVQsSUFBZ0IsT0FBTyxpQ0FBb0IsR0FBcEIsQ0FBUCxFQUFpQyxLQUFqQyxDQUFoQjtBQUNILGtDQUZELE1BRU87QUFDSCw4Q0FBUyxHQUFULElBQWdCLFVBQVUsS0FBVixDQUFoQjtBQUNIO0FBQ0Q7QUFDSjtBQUNJLHVDQUFNLDBCQUFOO0FBcEJSO0FBTDhCO0FBMkJqQztBQUNKO0FBQ0Qsb0JBQU8sUUFBUDtBQUNIOzs7dUNBQ29CLFEsRUFBVSxLLEVBQU8sWSxFQUFjLFksRUFBYztBQUM5RCxpQkFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBQyxXQUFELEVBQWMsS0FBZCxFQUFxQixHQUFyQixFQUEwQixJQUExQixFQUFtQztBQUN0RCx3QkFBTyxRQUFRLEdBQWY7QUFDQSxxQkFBTSxTQUFTLDRCQUFvQixJQUFwQixDQUF5QixJQUF6QixDQUFmO0FBQ0Esd0JBQU8sT0FBTyxDQUFQLENBQVA7QUFDQSxxQkFBTSxZQUFZLE9BQU8sQ0FBUCxLQUFhLEdBQS9CO0FBQ0EscUJBQU0sV0FBVyxlQUFlLEdBQWYsR0FBcUIsR0FBdEM7QUFDQSxxQkFBSSxZQUFZLE9BQU8sU0FBUCxDQUFoQjtBQUNBLHFCQUFNLFdBQVcsT0FBTyxRQUFQLENBQWpCO0FBUHNELHFCQXNCMUMsT0F0QjBDOztBQUFBO0FBUXRELDZCQUFRLElBQVI7QUFDSSw4QkFBSyxHQUFMO0FBQ0ksaUNBQUksWUFBWSxVQUFVLEtBQVYsQ0FBaEI7QUFDQSxpQ0FBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CLEdBQU07QUFDM0IscUNBQUksY0FBYyxVQUFVLEtBQVYsQ0FBbEI7QUFDQSxxQ0FBSSxnQkFBZ0IsU0FBcEIsRUFBK0I7QUFDM0IsOENBQVMsTUFBVCxDQUFnQixXQUFoQixFQUE2QixXQUE3QjtBQUNILGtDQUZELE1BRU87QUFDSCxtREFBYyxTQUFTLFdBQVQsQ0FBZDtBQUNBLCtDQUFVLE1BQVYsQ0FBaUIsS0FBakIsRUFBd0IsV0FBeEI7QUFDSDtBQUNELDZDQUFZLFdBQVo7QUFDQSx3Q0FBTyxTQUFQO0FBQ0gsOEJBVkQ7QUFXSSx1Q0FBVSxNQUFNLE1BQU4sQ0FBYSxnQkFBYixDQWJsQjs7QUFjSSx5Q0FBWSxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLE9BQTVCO0FBQ0E7QUFDSiw4QkFBSyxHQUFMO0FBQ0k7QUFDSiw4QkFBSyxHQUFMO0FBQ0ksaUNBQUksUUFBUSwwQkFBYSxNQUFNLFNBQU4sQ0FBYixDQUFaO0FBQ0EsaUNBQUksS0FBSixFQUFXO0FBQUE7QUFDUCx5Q0FBSSxNQUFNLFVBQVUsS0FBVixDQUFWO0FBQ0EsaURBQVksT0FBTyxpQ0FBb0IsR0FBcEIsQ0FBUCxDQUFaO0FBQ0EseUNBQUksY0FBYyxVQUFVLEtBQVYsQ0FBbEI7QUFDQSx5Q0FBSSxZQUFZLFdBQWhCO0FBQ0EseUNBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixHQUFNO0FBQzNCLHVEQUFjLFVBQVUsS0FBVixFQUFpQixZQUFqQixDQUFkO0FBQ0EsNkNBQUksZ0JBQWdCLFNBQXBCLEVBQStCO0FBQzNCLHNEQUFTLE1BQVQsQ0FBZ0IsV0FBaEIsRUFBNkIsWUFBWSxXQUF6QztBQUNIO0FBQ0QsZ0RBQU8sU0FBUDtBQUNILHNDQU5EO0FBT0EseUNBQU0sVUFBVSxNQUFNLE1BQU4sQ0FBYSxnQkFBYixDQUFoQjtBQUNBLGlEQUFZLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsT0FBNUI7QUFiTztBQWNWO0FBQ0Q7QUFDSjtBQUNJLG1DQUFNLDBCQUFOO0FBdENSO0FBUnNEOztBQWdEdEQsd0JBQU8sV0FBUDtBQUNILGNBakREOztBQW1EQSxpQkFBTSxjQUFjLG9CQUFZLE1BQVosQ0FBbUIsZ0JBQWdCLE1BQU0sSUFBTixFQUFuQyxDQUFwQjtBQUNBLGlCQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1gsd0JBQU8sRUFBUDtBQUNILGNBRkQsTUFFTyxJQUFJLGFBQWEsSUFBYixJQUFxQixRQUFRLFFBQVIsQ0FBaUIsUUFBakIsS0FBOEIsYUFBYSxHQUFwRSxFQUF5RTtBQUM1RSxzQkFBSyxJQUFJLEdBQVQsSUFBZ0IsS0FBaEIsRUFBdUI7QUFDbkIseUJBQUksTUFBTSxjQUFOLENBQXFCLEdBQXJCLEtBQTZCLENBQUMsSUFBSSxVQUFKLENBQWUsR0FBZixDQUE5QixJQUFxRCxRQUFRLFlBQWpFLEVBQStFO0FBQzNFLHdDQUFlLFdBQWYsRUFBNEIsS0FBNUIsRUFBbUMsR0FBbkM7QUFDSDtBQUNKO0FBQ0Qsd0JBQU8sV0FBUDtBQUNILGNBUE0sTUFPQSxJQUFJLFFBQVEsUUFBUixDQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQ25DLHNCQUFLLElBQUksSUFBVCxJQUFnQixRQUFoQixFQUEwQjtBQUN0Qix5QkFBSSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsQ0FBSixFQUFrQztBQUM5Qix3Q0FBZSxXQUFmLEVBQTRCLEtBQTVCLEVBQW1DLElBQW5DLEVBQXdDLFNBQVMsSUFBVCxDQUF4QztBQUNIO0FBQ0o7QUFDRCx3QkFBTyxXQUFQO0FBQ0g7QUFDRCxtQkFBTSwwQkFBTjtBQUNIOzs7OEJBRVcsVyxFQUFhO0FBQ3JCLGlCQUFJLG9CQUFKO0FBQ0EsaUJBQU0sUUFBUSx1QkFBVSxXQUFWLENBQWQ7Ozs7Ozs7OztBQVNBLHFCQUFRLFFBQVIsQ0FBaUIsS0FBakIsRUFBd0IsTUFBeEIsQ0FDSSxDQUFDLGFBQUQsRUFDSSxVQUFDLFVBQUQsRUFBZ0I7QUFDWiwrQkFBYyxVQUFkO0FBQ0gsY0FITCxDQURKOztBQU9BLHNCQUFTLGdCQUFULENBQTBCLGNBQTFCLEVBQTBDLEtBQTFDLEVBQWlELFFBQWpELEVBQTJELG1CQUEzRCxFQUFnRixjQUFoRixFQUFnRztBQUM1Rix5QkFBUSxvQkFBWSxNQUFaLENBQW1CLEtBQW5CLENBQVI7QUFDQSx1Q0FBc0IsdUJBQXVCLFlBQTdDO0FBQ0EscUJBQUksU0FBUyxvQkFBTyxrQkFBa0IsRUFBekIsRUFBNkI7QUFDdEMsNkJBQVEsb0JBQVksTUFBWixDQUFtQixLQUFuQixFQUEwQixJQUExQjtBQUQ4QixrQkFBN0IsRUFFVixLQUZVLENBQWI7O0FBSUEscUJBQU0sY0FBYyx1QkFBTTs7QUFFdEIseUJBQU0sY0FBYyxZQUFZLGNBQVosRUFBNEIsTUFBNUIsRUFBb0MsSUFBcEMsRUFBMEMsbUJBQTFDLENBQXBCO0FBQ0EseUNBQU8sWUFBWSxRQUFuQixFQUE2QixXQUFXLFNBQVgsQ0FBcUIsS0FBckIsRUFBNEIsUUFBNUIsQ0FBN0I7QUFDQSx5QkFBTSxXQUFXLGFBQWpCO0FBQ0EsZ0NBQVcsYUFBWCxDQUF5QixRQUF6QixFQUFtQyxLQUFuQyxFQUEwQyxPQUFPLE1BQWpELEVBQXlELG1CQUF6RDtBQUNBLDRCQUFPLFFBQVA7QUFDSCxrQkFQRDtBQVFBLDZCQUFZLGVBQVosR0FBOEIsVUFBQyxDQUFELEVBQU87QUFDakMsZ0NBQVcsS0FBSyxRQUFoQjs7Ozs7O0FBTUEsNEJBQU8sV0FBUDtBQUNILGtCQVJEO0FBU0EscUJBQUksUUFBSixFQUFjO0FBQ1YsaUNBQVksZUFBWjtBQUNIO0FBQ0Qsd0JBQU8sV0FBUDtBQUNIO0FBQ0Qsb0JBQU87QUFDSCx5QkFBUTtBQURMLGNBQVA7QUFHSDs7Ozs7O21CQUVVLFU7Ozs7Ozs7Ozs7OztBQzFMZjs7QUFLQTs7QUFJQSxLQUFJLG9CQUFxQixZQUFXO0FBQ2hDLFNBQUksV0FBVyxLQUFmO0FBQ0EsU0FBSSxrQkFBSjtBQUFBLFNBQWUsaUJBQWY7QUFBQSxTQUF5QixnQkFBekI7QUFBQSxTQUFrQyxlQUFsQztBQUFBLFNBQTBDLGVBQTFDO0FBQUEsU0FBa0QsY0FBbEQ7QUFBQSxTQUF5RCx5QkFBekQ7O0FBR0EsY0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUNqQixxQkFBWSxFQUFaO0FBQ0Esb0JBQVcsU0FBUyxVQUFVLFNBQVMsbUJBQW1CLFNBQTFEO0FBQ0EsYUFBSSxJQUFKLEVBQVU7QUFDUCxnQ0FBbUIsVUFBbkIsR0FBZ0Msb0JBQVksVUFBWixHQUF5QixJQUF6RDtBQUNGO0FBQ0QsZ0JBQU8sa0JBQVA7QUFDSDs7QUFFRCxTQUFJLHFCQUFKOztBQUlBLGNBQVMsa0JBQVQsR0FBOEI7O0FBRTFCLGFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDWCxtQkFBTSx1Q0FBTjtBQUNIO0FBQ0Qsa0JBQVMsb0JBQVksTUFBWixDQUFtQixVQUFVLEVBQTdCLENBQVQ7QUFDQSxhQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1Qsc0JBQVMsT0FBTyxJQUFQLEVBQVQ7QUFDSCxVQUFDO0FBQ0UsaUJBQU0sWUFBWSxvQkFBWSxPQUFaLENBQW9CLE1BQXBCLENBQWxCO0FBQ0EsaUJBQUksY0FBYyxLQUFsQixFQUF5QjtBQUNyQiwwQkFBUyxTQUFUO0FBQ0g7QUFDSjtBQUNELGFBQUksWUFBSixFQUFrQjtBQUNkLDBCQUFhLFFBQWI7QUFDSDtBQUNELGFBQU0sV0FBVyw4Q0FBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsZ0JBQW5DLEVBQXFELFNBQXJELEVBQWdFLEtBQWhFLEVBQXVFLE9BQXZFLENBQWpCO0FBQ0Esd0JBQWUsUUFBZjtBQUNBO0FBQ0EsZ0JBQU8sUUFBUDtBQUNIO0FBQ0Qsd0JBQW1CLFFBQW5CLEdBQThCLFVBQVMsUUFBVCxFQUFtQjtBQUM3Qyw0QkFBbUIsUUFBbkI7QUFDQSxnQkFBTyxrQkFBUDtBQUNILE1BSEQ7QUFJQSx3QkFBbUIsY0FBbkI7QUFDQSx3QkFBbUIsS0FBbkIsR0FBMkIsS0FBM0I7QUFDQSx3QkFBbUIsUUFBbkIsR0FBOEIsVUFBUyxRQUFULEVBQW1CO0FBQzdDLGtCQUFTLFFBQVQ7QUFDQSxnQkFBTyxrQkFBUDtBQUNILE1BSEQ7QUFJQSx3QkFBbUIsU0FBbkIsR0FBK0IsVUFBUyxNQUFULEVBQWlCO0FBQzVDLG1CQUFVLE1BQVY7QUFDQSxnQkFBTyxrQkFBUDtBQUNILE1BSEQ7O0FBS0Esd0JBQW1CLFVBQW5CLEdBQWdDLG9CQUFZLFVBQTVDOztBQUVBLHdCQUFtQixVQUFuQixHQUFnQyxVQUFTLE9BQVQsRUFBa0I7QUFDOUMsa0JBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN0QixtQkFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLEtBQXJCLENBQTJCLFNBQTNCLEVBQXNDLEtBQXRDO0FBQ0g7QUFDRCxhQUFJLFFBQVEsUUFBUixDQUFpQixPQUFqQixDQUFKLEVBQStCO0FBQzNCLGlCQUFJLFVBQVUsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN0QiwyQkFBVSx1QkFBVSxTQUFWLENBQVY7QUFDSCxjQUZELE1BRU87QUFDSCwyQkFBVSxDQUFDLE9BQUQsQ0FBVjtBQUNIO0FBQ0osVUFORCxNQU1PLElBQUkseUJBQVksT0FBWixDQUFKLEVBQTBCO0FBQzdCLHVCQUFVLHVCQUFVLE9BQVYsQ0FBVjtBQUNIO0FBQ0QsZ0JBQU8sa0JBQVA7QUFDSCxNQWREO0FBZUEsd0JBQW1CLFVBQW5CLEdBQWdDLFVBQVMsSUFBVCxFQUFlO0FBQzNDLGFBQUksUUFBUSxXQUFSLENBQW9CLElBQXBCLENBQUosRUFBK0I7QUFDM0Isb0JBQU8sUUFBUDtBQUNIO0FBQ0Qsb0JBQVcsQ0FBQyxDQUFDLElBQWI7QUFDQSxnQkFBTyxZQUFXO0FBQ2Qsd0JBQVcsQ0FBQyxJQUFaO0FBQ0gsVUFGRDtBQUdILE1BUkQ7QUFTQSx3QkFBbUIsR0FBbkIsR0FBeUIsVUFBUyxjQUFULEVBQXlCLG9CQUF6QixFQUErQyxXQUEvQyxFQUE0RCxVQUE1RCxFQUF3RTtBQUM3RixvQkFBVyxjQUFYO0FBQ0EsYUFBSSx3QkFBd0IsQ0FBQyxRQUFRLFFBQVIsQ0FBaUIsb0JBQWpCLENBQTdCLEVBQXFFO0FBQ2pFLHNCQUFTLG9CQUFZLE9BQVosQ0FBb0Isb0JBQXBCLENBQVQ7QUFDQSxzQkFBUyxvQkFBWSxPQUFaLENBQW9CLFdBQXBCLEtBQW9DLE1BQTdDO0FBQ0EscUJBQVEsWUFBUjtBQUNILFVBSkQsTUFJTztBQUNILHNCQUFTLG9CQUFZLE1BQVosQ0FBbUIsZUFBZSxNQUFsQyxDQUFUO0FBQ0Esc0JBQVMsb0JBQVksTUFBWixDQUFtQixjQUFjLE9BQU8sSUFBUCxFQUFqQyxDQUFUO0FBQ0EscUJBQVEsb0JBQVI7QUFDSDtBQUNELGdCQUFPLG9CQUFQO0FBQ0gsTUFaRDtBQWFBLHdCQUFtQixVQUFuQixHQUFnQyxVQUFTLGNBQVQsRUFBeUIsWUFBekIsRUFBdUMsV0FBdkMsRUFBb0QsUUFBcEQsRUFBOEQ7QUFDMUYsYUFBTSxXQUFXLG1CQUFtQixHQUFuQixDQUF1QixjQUF2QixFQUF1QyxZQUF2QyxFQUFxRCxXQUFyRCxDQUFqQjtBQUNBLGtCQUFTLFFBQVQsR0FBb0IsUUFBcEI7QUFDQSxnQkFBTyxRQUFQO0FBQ0gsTUFKRDtBQUtBLFlBQU8sa0JBQVA7QUFDSCxFQXBHdUIsRUFBeEI7bUJBcUdlLGlCOzs7Ozs7OztBQzlHZjs7OztBQUNBOzs7O0FBR0EsVUFBUyxZQUFULEVBQXVCLFlBQVc7QUFDOUIsUUFBRyxtQkFBSCxFQUF3QixZQUFXO0FBQy9CLHdDQUFtQixXQUFuQjtBQUNILE1BRkQ7QUFHQSxRQUFHLCtEQUFILEVBQW9FLFlBQVc7QUFDM0UsZ0JBQU8sdUJBQVcsSUFBbEIsRUFBd0IsV0FBeEI7QUFDQSxnQkFBTyxRQUFRLFVBQVIsQ0FBbUIsdUJBQVcsSUFBOUIsQ0FBUCxFQUE0QyxJQUE1QyxDQUFpRCxJQUFqRDtBQUNBLGdCQUFPLFFBQVEsVUFBUixDQUFtQix1QkFBVyxJQUFYLENBQWdCLElBQWhCLEVBQXNCLE1BQXpDLENBQVAsRUFBeUQsSUFBekQsQ0FBOEQsSUFBOUQ7QUFDSCxNQUpEO0FBS0EsY0FBUyxNQUFULEVBQWlCLFlBQVc7QUFDeEIsYUFBSSwwQkFBSjtBQUNBLG9CQUFXLFlBQVc7QUFDbEIsaUNBQW9CLHVCQUFXLElBQVgsQ0FBZ0IsTUFBaEIsQ0FBcEI7QUFDSCxVQUZEO0FBR0EsWUFBRyxrQ0FBSCxFQUF1QyxZQUFXO0FBQzlDLGlCQUFNLGFBQWEsa0JBQWtCLE1BQWxCLENBQXlCLGlCQUF6QixDQUFuQjtBQUNBLG9CQUFPLFVBQVAsRUFBbUIsV0FBbkI7QUFDQSxvQkFBTyxhQUFhLElBQXBCLEVBQTBCLElBQTFCLENBQStCLGlCQUEvQjtBQUNILFVBSkQ7QUFLQSxZQUFHLDJDQUFILEVBQWdELFlBQVc7QUFDdkQsaUJBQU0sYUFBYSxrQkFBa0IsTUFBbEIsQ0FBeUIsZ0JBQXpCLENBQW5CO0FBQ0Esb0JBQU8sYUFBYSxFQUFwQixFQUF3QixXQUF4QjtBQUNILFVBSEQ7QUFJQSxZQUFHLG9EQUFILEVBQXlELFlBQVc7QUFDaEUsaUJBQU0sYUFBYSxrQkFBa0IsTUFBbEIsQ0FBeUIsaUJBQXpCLEVBQTRDLEVBQTVDLENBQW5CO0FBQ0Esb0JBQU8sVUFBUCxFQUFtQixXQUFuQjtBQUNILFVBSEQ7QUFJQSxZQUFHLHVEQUFILEVBQTRELFlBQVc7QUFDbkUsaUJBQU0sUUFBUSxvQkFBWSxVQUFaLENBQXVCLElBQXZCLEVBQWQ7QUFDQSxpQkFBTSxjQUFjLGtCQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxFQUFnRCxLQUFoRCxHQUFwQjtBQUNBLG9CQUFPLE1BQU0sV0FBTixDQUFrQixVQUF6QixFQUFxQyxJQUFyQyxDQUEwQyxXQUExQztBQUNILFVBSkQ7QUFLQSxZQUFHLDJFQUFILEVBQWdGLFlBQVc7QUFDdkYsaUJBQU0sUUFBUSxvQkFBWSxVQUFaLENBQXVCLElBQXZCLEVBQWQ7QUFDQSxpQkFBTSxjQUFjLGtCQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QyxLQUF6QyxFQUFnRCxLQUFoRCxFQUF1RCxjQUF2RCxHQUFwQjtBQUNBLG9CQUFPLE1BQU0sV0FBTixDQUFrQixZQUF6QixFQUF1QyxJQUF2QyxDQUE0QyxXQUE1QztBQUNILFVBSkQ7QUFLQSxrQkFBUyxVQUFULEVBQXFCLFlBQVc7QUFDNUIsZ0JBQUcsbURBQUgsRUFBd0QsWUFBVztBQUMvRCxxQkFBTSxjQUFjLGtCQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QztBQUN6RCxvQ0FBZTtBQUQwQyxrQkFBekMsRUFFakIsSUFGaUIsR0FBcEI7QUFHQSx3QkFBTyxZQUFZLGFBQW5CLEVBQWtDLElBQWxDLENBQXVDLG9CQUF2QztBQUNBLHFCQUFNLGNBQWMsa0JBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDO0FBQ3pELG9DQUFlO0FBRDBDLGtCQUF6QyxFQUVqQixHQUZpQixHQUFwQjtBQUdBLHdCQUFPLFlBQVksYUFBbkIsRUFBa0MsSUFBbEMsQ0FBdUMsb0JBQXZDO0FBQ0gsY0FURDtBQVVBLGdCQUFHLCtEQUFILEVBQW9FLFlBQVc7QUFDM0UscUJBQU0sY0FBYyxrQkFBa0IsTUFBbEIsQ0FBeUIsY0FBekIsRUFBeUM7QUFDekQsb0NBQWU7QUFEMEMsa0JBQXpDLEVBRWpCLEtBRmlCLEdBQXBCO0FBR0Esd0JBQU8sWUFBWSxhQUFuQixFQUFrQyxJQUFsQyxDQUF1QyxvQkFBdkM7QUFDQSxxQkFBTSxjQUFjLGtCQUFrQixNQUFsQixDQUF5QixjQUF6QixFQUF5QztBQUN6RCxvQ0FBZTtBQUQwQyxrQkFBekMsR0FBcEI7QUFHQSx3QkFBTyxZQUFZLGFBQW5CLEVBQWtDLElBQWxDLENBQXVDLG9CQUF2QztBQUNILGNBVEQ7O0FBV0Esc0JBQVMsa0JBQVQsRUFBNkIsWUFBVztBQUNwQyxvQkFBRyxzREFBSCxFQUEyRCxZQUFXO0FBQ2xFLHlCQUFNLGFBQWEsa0JBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDO0FBQ3hELHdDQUFlO0FBRHlDLHNCQUF6QyxFQUVoQjtBQUNDLHdDQUFlO0FBRGhCLHNCQUZnQixDQUFuQjtBQUtBLDRCQUFPLGFBQWEsYUFBcEIsRUFBbUMsSUFBbkMsQ0FBd0Msb0JBQXhDO0FBQ0gsa0JBUEQ7QUFRQSxvQkFBRyxzREFBSCxFQUEyRCxZQUFXO0FBQ2xFLHlCQUFNLGFBQWEsa0JBQWtCLE1BQWxCLENBQXlCLGNBQXpCLEVBQXlDO0FBQ3hELHdDQUFlO0FBRHlDLHNCQUF6QyxFQUVoQjtBQUNDLHdDQUFlO0FBRGhCLHNCQUZnQixDQUFuQjtBQUtBLDRCQUFPLGFBQWEsYUFBcEIsRUFBbUMsSUFBbkMsQ0FBd0Msb0JBQXhDO0FBQ0gsa0JBUEQ7QUFRQSxvQkFBRyxzREFBSCxFQUEyRCxZQUFXO0FBQ2xFLHlCQUFJLGFBQWEsa0JBQWtCLE1BQWxCLENBQXlCLGlCQUF6QixFQUE0QztBQUN6RCx3Q0FBZSx3QkFEMEM7QUFFekQsd0NBQWUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFGMEMsc0JBQTVDLEVBR2Q7QUFDQyx3Q0FBZTtBQURoQixzQkFIYyxDQUFqQjtBQU1BLGtDQUFhLFlBQWI7QUFDQSw0QkFBTyxXQUFXLGFBQVgsRUFBUCxFQUFtQyxJQUFuQyxDQUF3QyxLQUF4QztBQUVILGtCQVZEO0FBV0Esb0JBQUcsaUNBQUgsRUFBc0MsWUFBVztBQUM3Qyx5QkFBSSxhQUFhLGtCQUFrQixNQUFsQixDQUF5QixpQkFBekIsRUFBNEM7QUFDekQsd0NBQWUsd0JBRDBDO0FBRXpELHdDQUFlLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBRjBDLHNCQUE1QyxFQUdkO0FBQ0Msd0NBQWU7QUFEaEIsc0JBSGMsQ0FBakI7QUFNQSxrQ0FBYSxZQUFiO0FBQ0EsNEJBQU8sV0FBVyxhQUFYLENBQXlCO0FBQzVCLHdDQUFlLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYO0FBRGEsc0JBQXpCLENBQVAsRUFFSSxJQUZKLENBRVMsS0FGVDtBQUdILGtCQVhEO0FBWUgsY0F4Q0Q7QUF5Q0gsVUEvREQ7QUFnRUgsTUE1RkQ7QUE2RkgsRUF0R0QsRTs7Ozs7Ozs7QUNKQTs7Ozs7O0FBRUEsVUFBUyxtQkFBVCxFQUE4QixZQUFXO0FBQ3JDLGdCQUFXLFlBQVc7QUFDbEIscUNBQWtCLEtBQWxCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsbUJBQUgsRUFBd0IsWUFBVztBQUMvQiw2Q0FBMEIsV0FBMUI7QUFDSCxNQUZEO0FBR0EsUUFBRyw2QkFBSCxFQUFrQyxZQUFXO0FBQ3pDLGdCQUFPLFlBQVc7QUFDZCx5Q0FBa0IsVUFBbEIsQ0FBNkIsVUFBN0I7QUFDSCxVQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHSCxNQUpEO0FBS0EsUUFBRyx5REFBSCxFQUE4RCxZQUFXO0FBQ3JFLGdCQUFPLDRCQUFrQixVQUFsQixDQUE2QixVQUE3QixDQUFQLEVBQWlELElBQWpEO0FBQ0gsTUFGRDtBQUdBLGNBQVMsdUJBQVQsRUFBa0MsWUFBVztBQUN6QyxvQkFBVyxZQUFXO0FBQ2xCLHlDQUFrQixVQUFsQixDQUE2QixNQUE3QjtBQUNILFVBRkQ7QUFHQSxZQUFHLG9DQUFILEVBQXlDLFlBQVc7QUFDaEQsaUJBQUksc0JBQUo7QUFDQSxvQkFBTyxZQUFXO0FBQ2QsaUNBQWdCLDRCQUFrQixHQUFsQixDQUFzQixpQkFBdEIsQ0FBaEI7QUFDSCxjQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHQSxvQkFBTyxhQUFQLEVBQXNCLFdBQXRCO0FBQ0Esb0JBQU8sY0FBYyxXQUFyQixFQUFrQyxXQUFsQztBQUNBLG9CQUFPLGNBQWMsZUFBckIsRUFBc0MsV0FBdEM7QUFDQSxvQkFBTyxjQUFjLGVBQWQsQ0FBOEIsT0FBckMsRUFBOEMsSUFBOUMsQ0FBbUQsY0FBYyxXQUFqRTtBQUNBLG9CQUFPLGNBQWMsa0JBQXJCLEVBQXlDLGFBQXpDO0FBQ0Esb0JBQU8sY0FBYyxXQUFyQixFQUFrQyxPQUFsQyxDQUEwQyxDQUFDLE1BQUQsQ0FBMUM7QUFDSCxVQVhEO0FBWUEsWUFBRyxrREFBSCxFQUF1RCxZQUFXO0FBQzlELGlCQUFNLGdCQUFnQiw0QkFBa0IsUUFBbEIsQ0FBMkI7QUFDN0MsZ0NBQWU7QUFEOEIsY0FBM0IsRUFFbkIsUUFGbUIsQ0FFVjtBQUNSLGdDQUFlO0FBRFAsY0FGVSxFQUluQixHQUptQixDQUlmLGNBSmUsQ0FBdEI7QUFLQSxvQkFBTyxjQUFjLE1BQWQsRUFBUCxFQUErQixJQUEvQixDQUFvQyxjQUFjLGtCQUFsRDtBQUNBLG9CQUFPLGNBQWMsa0JBQWQsQ0FBaUMsYUFBeEMsRUFBdUQsSUFBdkQsQ0FBNEQsb0JBQTVEO0FBQ0gsVUFSRDtBQVNBLFlBQUcsZ0RBQUgsRUFBcUQsWUFBVztBQUM1RCxpQkFBTSxRQUFRO0FBQ04seUJBQVEsa0JBQVcsQ0FBRSxDQURmO0FBRU4seUJBQVEsUUFGRjtBQUdOLDZCQUFZO0FBSE4sY0FBZDtBQUFBLGlCQUtJLGdCQUFnQiw0QkFBa0IsUUFBbEIsQ0FBMkIsS0FBM0IsRUFBa0MsUUFBbEMsQ0FBMkM7QUFDdkQsK0JBQWMsU0FEeUM7QUFFdkQsK0JBQWMsU0FGeUM7QUFHdkQsbUNBQWtCO0FBSHFDLGNBQTNDLEVBSWIsR0FKYSxDQUlULGlCQUpTLENBTHBCO0FBVUEsb0JBQU8sWUFBVztBQUNkLCtCQUFjLE1BQWQ7QUFDSCxjQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHQSxvQkFBTyxjQUFjLGtCQUFkLENBQWlDLFlBQXhDLEVBQXNELElBQXRELENBQTJELE1BQU0sTUFBakU7QUFDQSxvQkFBTyxjQUFjLGtCQUFkLENBQWlDLFlBQXhDLEVBQXNELElBQXRELENBQTJELE1BQU0sTUFBakU7QUFDQSxvQkFBTyxjQUFjLGtCQUFkLENBQWlDLGdCQUFqQyxFQUFQLEVBQTRELElBQTVELENBQWlFLE1BQU0sTUFBTixDQUFhLFdBQWIsRUFBakU7QUFDSCxVQWpCRDtBQWtCQSxrQkFBUyxVQUFULEVBQXFCLFlBQVc7QUFDNUIsaUJBQUksY0FBSjtBQUFBLGlCQUFXLHNCQUFYO0FBQ0Esd0JBQVcsWUFBVztBQUNsQix5QkFBUSw0QkFBa0IsVUFBbEIsQ0FBNkIsSUFBN0IsRUFBUjtBQUNILGNBRkQ7QUFHQSxnQkFBRyw4QkFBSCxFQUFtQyxZQUFXO0FBQzFDLHVCQUFNLGFBQU4sR0FBc0IsTUFBdEI7QUFDQSxpQ0FBZ0IsNEJBQWtCLFFBQWxCLENBQTJCLEtBQTNCLEVBQWtDLFFBQWxDLENBQTJDO0FBQ25ELG9DQUFlO0FBRG9DLGtCQUEzQyxFQUdYLEdBSFcsQ0FHUCxpQkFITyxDQUFoQjtBQUlBLHFCQUFJLGFBQUo7QUFDQSxxQkFBTSxhQUFhLGNBQWMsS0FBZCxDQUFvQiwwQkFBcEIsRUFBZ0QsWUFBVztBQUMxRSw0QkFBTyxTQUFQO0FBQ0gsa0JBRmtCLEVBRWhCLE1BRmdCLEVBQW5CO0FBR0Esd0JBQU8sV0FBVyxhQUFsQixFQUFpQyxJQUFqQyxDQUFzQyxNQUF0QztBQUNBLDRCQUFXLGFBQVgsR0FBMkIsTUFBM0I7QUFDQSwrQkFBYyxlQUFkLENBQThCLE1BQTlCO0FBQ0Esd0JBQU8sSUFBUCxFQUFhLFdBQWI7QUFDSCxjQWREO0FBZUEsZ0JBQUcsd0RBQUgsRUFBNkQsWUFBVztBQUNwRSx1QkFBTSxhQUFOLEdBQXNCLE1BQXRCO0FBQ0EsaUNBQWdCLDRCQUFrQixRQUFsQixDQUEyQixLQUEzQixFQUFrQyxRQUFsQyxDQUEyQztBQUNuRCxvQ0FBZTtBQURvQyxrQkFBM0MsRUFHWCxHQUhXLENBR1AsZ0JBSE8sQ0FBaEI7QUFJQSxxQkFBSSxhQUFKO0FBQ0EscUJBQU0sYUFBYSxjQUFjLEtBQWQsQ0FBb0IsMEJBQXBCLEVBQWdELFlBQVc7QUFDMUUsNEJBQU8sU0FBUDtBQUNILGtCQUZrQixFQUVoQixNQUZnQixFQUFuQjtBQUdBLHdCQUFPLFdBQVcsYUFBbEIsRUFBaUMsSUFBakMsQ0FBc0MsTUFBdEM7QUFDQSw0QkFBVyxhQUFYLEdBQTJCLE1BQTNCO0FBQ0EsK0JBQWMsTUFBZDtBQUNBLHdCQUFPLGNBQWMsV0FBZCxDQUEwQixhQUFqQyxFQUFnRCxJQUFoRCxDQUFxRCxNQUFyRDtBQUNBLCtCQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDSCxjQWZEO0FBZ0JBLGdCQUFHLHdEQUFILEVBQTZELFlBQVc7QUFDcEUsdUJBQU0sYUFBTixHQUFzQixNQUF0QjtBQUNBLGlDQUFnQiw0QkFBa0IsUUFBbEIsQ0FBMkIsS0FBM0IsRUFBa0MsUUFBbEMsQ0FBMkM7QUFDbkQsb0NBQWU7QUFEb0Msa0JBQTNDLEVBR1gsR0FIVyxDQUdQLGdCQUhPLENBQWhCO0FBSUEscUJBQU0sYUFBYSxjQUFjLE1BQWQsRUFBbkI7QUFDQSwrQkFBYyxXQUFkLENBQTBCLGFBQTFCLEdBQTBDLFFBQTFDO0FBQ0EsK0JBQWMsTUFBZDtBQUNBLHdCQUFPLFdBQVcsYUFBbEIsRUFBaUMsSUFBakMsQ0FBc0MsUUFBdEM7QUFDSCxjQVZEO0FBV0EsZ0JBQUcsNERBQUgsRUFBaUUsWUFBVztBQUN4RSxpQ0FBZ0IsNEJBQWtCLFFBQWxCLENBQTJCLEtBQTNCLEVBQWtDLFFBQWxDLENBQTJDO0FBQ25ELG9DQUFlO0FBRG9DLGtCQUEzQyxFQUdYLEdBSFcsQ0FHUCxnQkFITyxDQUFoQjtBQUlBLHFCQUFNLGFBQWEsY0FBYyxNQUFkLEVBQW5CO0FBQ0EsK0JBQWMsV0FBZCxDQUEwQixhQUExQixHQUEwQyxRQUExQztBQUNBLDRCQUFXLGFBQVgsR0FBMkIsT0FBM0I7QUFDQSwrQkFBYyxNQUFkO0FBQ0Esd0JBQU8sV0FBVyxhQUFsQixFQUFpQyxJQUFqQyxDQUFzQyxRQUF0QztBQUNBLHdCQUFPLGNBQWMsV0FBZCxDQUEwQixhQUFqQyxFQUFnRCxJQUFoRCxDQUFxRCxRQUFyRDtBQUNILGNBWEQ7QUFZSCxVQTNERDtBQTRESCxNQXZHRDtBQXdHQSxjQUFTLHlCQUFULEVBQW9DLFlBQVc7QUFDM0MsYUFBSSxzQkFBSjtBQUNBLG9CQUFXLFlBQVc7QUFDbEIseUNBQWtCLEtBQWxCO0FBQ0EseUNBQWtCLFVBQWxCLENBQTZCLE1BQTdCO0FBQ0gsVUFIRDtBQUlBLFlBQUcsb0NBQUgsRUFBeUMsWUFBVztBQUNoRCxvQkFBTyxZQUFXO0FBQ2QsaUNBQWdCLDRCQUFrQixHQUFsQixDQUFzQixpQkFBdEIsQ0FBaEI7QUFDSCxjQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHQSwyQkFBYyxRQUFkO0FBQ0gsVUFMRDtBQU1ILE1BWkQ7QUFhSCxFQXBJRCxFOzs7Ozs7OztBQ0ZBOzs7Ozs7QUFDQSxVQUFTLGlCQUFULEVBQTRCLFlBQVc7QUFDbkMsU0FBTSxlQUFlLFNBQVMsWUFBVCxHQUF3QixDQUFFLENBQS9DO0FBQ0EsU0FBSSw4QkFBSjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIscUNBQWtCLEtBQWxCO0FBQ0EsYUFBSSxxQkFBSixFQUEyQjtBQUN2QixtQ0FBc0IsUUFBdEI7QUFDSDtBQUNELGlDQUF3Qiw0QkFBa0IsVUFBbEIsQ0FBNkIsTUFBN0IsRUFBcUMsUUFBckMsQ0FBOEM7QUFDbEUsZ0JBQUcsR0FEK0Q7QUFFbEUsZ0JBQUcsR0FGK0Q7QUFHbEUsZ0JBQUc7QUFIK0QsVUFBOUMsRUFJckIsUUFKcUIsQ0FJWjtBQUNSLGdCQUFHLFlBREs7QUFFUixnQkFBRyxHQUZLO0FBR1IsZ0JBQUc7QUFISyxVQUpZLEVBUXJCLEdBUnFCLENBUWpCLGlCQVJpQixDQUF4QjtBQVNILE1BZEQ7QUFlQSxRQUFHLCtDQUFILEVBQW9ELFlBQVc7QUFDM0QsYUFBTSxhQUFhLHNCQUFzQixNQUF0QixFQUFuQjtBQUNBLGFBQU0sUUFBUSxzQkFBc0IsYUFBdEIsQ0FBb0MsS0FBcEMsQ0FBMEMsS0FBMUMsQ0FBZDtBQUNBLGdCQUFPLEtBQVAsRUFBYyxXQUFkO0FBQ0Esb0JBQVcsQ0FBWCxHQUFlLFNBQWY7QUFDQSxnQkFBTyxLQUFQLEVBQWMsR0FBZCxDQUFrQixnQkFBbEI7QUFDQSwrQkFBc0IsTUFBdEI7QUFDQSxnQkFBTyxLQUFQLEVBQWMsZ0JBQWQ7QUFDQSxnQkFBTyxPQUFPLE1BQU0sSUFBTixFQUFQLEtBQXdCLFFBQS9CLEVBQXlDLElBQXpDLENBQThDLElBQTlDO0FBQ0EsZ0JBQU8sTUFBTSxJQUFOLEVBQVAsRUFBcUIsSUFBckIsQ0FBMEIsTUFBTSxJQUFOLEVBQTFCO0FBQ0EsZ0JBQU8sTUFBTSxLQUFOLENBQVksS0FBWixFQUFQLEVBQTRCLElBQTVCLENBQWlDLENBQWpDO0FBQ0EsK0JBQXNCLE1BQXRCO0FBQ0EsZ0JBQU8sTUFBTSxLQUFOLENBQVksS0FBWixFQUFQLEVBQTRCLElBQTVCLENBQWlDLENBQWpDO0FBQ0gsTUFiRDtBQWNILEVBaENELEU7Ozs7Ozs7O0FDREEscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVIsRTs7Ozs7Ozs7QUNWQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVIsRTs7Ozs7Ozs7QUNMQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLFNBQVQsRUFBb0IsWUFBVztBQUMzQixTQUFJLDBCQUFKO0FBQUEsU0FBdUIsWUFBdkI7QUFBQSxTQUE0QixtQkFBNUI7QUFDQSxnQkFBVyxZQUFXO0FBQ2xCLGVBQU0sUUFBUSxTQUFSLENBQWtCLE9BQWxCLENBQU47QUFDQSw2QkFBb0IsNEJBQWtCLEtBQWxCLEdBQTBCLFVBQTFCLENBQXFDLE1BQXJDLEVBQTZDLFVBQTdDLENBQXdELGlCQUF4RCxFQUEyRSxNQUEzRSxFQUFtRjtBQUNuRyxzQkFBUyxRQUQwRjtBQUVuRyx3QkFBVyxHQUZ3RjtBQUduRyxtQkFBTSxPQUg2RjtBQUluRyxtQkFBTSxDQUo2RjtBQUtuRyx1QkFBVTtBQUx5RixVQUFuRixFQU1qQjtBQUNDLHNCQUFTLEdBRFY7QUFFQyx3QkFBVyxHQUZaO0FBR0MsbUJBQU0sR0FIUDtBQUlDLG1CQUFNLEdBSlA7QUFLQyx1QkFBVTtBQUxYLFVBTmlCLENBQXBCO0FBYUEsMkJBQWtCLE1BQWxCO0FBQ0Esc0JBQWEsa0JBQWtCLGtCQUEvQjtBQUNILE1BakJEO0FBa0JBLFFBQUcsa0NBQUgsRUFBdUMsWUFBVztBQUM5QyxhQUFNLFVBQVUsK0JBQXFCLGlCQUFyQixFQUF3QyxtREFBeEMsQ0FBaEI7QUFDQSxpQkFBUSxNQUFSO0FBQ0EsZ0JBQU8sV0FBVyxPQUFsQixFQUEyQixJQUEzQixDQUFnQyxjQUFoQztBQUNILE1BSkQ7QUFLQSxRQUFHLGlEQUFILEVBQXNELFlBQVc7QUFDN0QsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MsU0FBeEMsQ0FBaEI7QUFDQSxnQkFBTyxZQUFXO0FBQ2QscUJBQVEsS0FBUixDQUFjLEdBQWQsRUFBbUIsTUFBbkI7QUFDSCxVQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHSCxNQUxEO0FBTUEsUUFBRyw0REFBSCxFQUFpRSxZQUFXO0FBQ3hFLGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLFNBQXhDLENBQWhCO0FBQ0EsZ0JBQU8sWUFBVztBQUNkLHFCQUFRLE1BQVI7QUFDSCxVQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHSCxNQUxEO0FBTUEsUUFBRyxtRUFBSCxFQUF3RSxZQUFXOztBQUUvRSxhQUFNLFVBQVUsK0JBQXFCLGlCQUFyQiwrUkFBaEI7QUFTQSxpQkFBUSxLQUFSLENBQWMsUUFBZCxFQUF3QixNQUF4QjtBQUNBLGlCQUFRLEtBQVIsQ0FBYyxTQUFkLEVBQXlCLE1BQXpCO0FBQ0EsaUJBQVEsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBeEI7QUFDQSxnQkFBTyxXQUFXLElBQWxCLEVBQXdCLElBQXhCLENBQTZCLENBQTdCO0FBQ0gsTUFmRDtBQWdCQSxRQUFHLHFDQUFILEVBQTBDLFlBQVc7QUFDakQsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIscVNBQWhCO0FBU0EsaUJBQVEsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBeEIsQ0FBK0I7QUFDM0Isb0JBQU87QUFEb0IsVUFBL0I7QUFHQSxnQkFBTyxXQUFXLElBQWxCLEVBQXdCLElBQXhCLENBQTZCLElBQTdCO0FBQ0EsaUJBQVEsS0FBUixDQUFjLFNBQWQsRUFBeUIsTUFBekIsQ0FBZ0M7QUFDNUIsb0JBQU87QUFEcUIsVUFBaEM7QUFHQSxnQkFBTyxXQUFXLElBQWxCLEVBQXdCLElBQXhCLENBQTZCLE1BQTdCO0FBQ0EsaUJBQVEsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBeEIsQ0FBK0I7QUFDM0Isb0JBQU87QUFEb0IsVUFBL0I7QUFHQSxnQkFBTyxXQUFXLElBQWxCLEVBQXdCLElBQXhCLENBQTZCLE9BQTdCO0FBQ0gsTUF0QkQ7QUF1QkgsRUE1RUQsRTs7Ozs7Ozs7QUNGQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLE1BQVQsRUFBaUIsWUFBVztBQUN4QixTQUFJLDBCQUFKO0FBQUEsU0FBdUIsWUFBdkI7QUFBQSxTQUE0QixtQkFBNUI7QUFDQSxnQkFBVyxZQUFXO0FBQ2xCLGVBQU0sUUFBUSxTQUFSLENBQWtCLElBQWxCLENBQU47QUFDQSw2QkFBb0IsNEJBQWtCLEtBQWxCLEdBQTBCLFVBQTFCLENBQXFDLE1BQXJDLEVBQTZDLFVBQTdDLENBQXdELGlCQUF4RCxFQUEyRSxNQUEzRSxFQUFtRjtBQUNuRyxzQkFBUyxRQUQwRjtBQUVuRyx3QkFBVyxHQUZ3RjtBQUduRyxtQkFBTSxPQUg2RjtBQUluRyxtQkFBTSxDQUo2RjtBQUtuRyx1QkFBVTtBQUx5RixVQUFuRixFQU1qQjtBQUNDLHNCQUFTLEdBRFY7QUFFQyx3QkFBVyxHQUZaO0FBR0MsbUJBQU0sR0FIUDtBQUlDLG1CQUFNLEdBSlA7QUFLQyx1QkFBVTtBQUxYLFVBTmlCLENBQXBCO0FBYUEsMkJBQWtCLE1BQWxCO0FBQ0Esc0JBQWEsa0JBQWtCLGtCQUEvQjtBQUNILE1BakJEOztBQW1CQSxRQUFHLDJCQUFILEVBQWdDLFlBQVc7QUFDdkMsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MseUNBQXhDLENBQWhCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sUUFBUSxHQUFSLEVBQVAsRUFBc0IsSUFBdEIsQ0FBMkIsU0FBM0I7QUFDQSxnQkFBTyxRQUFRLEtBQVIsQ0FBYyxLQUFkLEVBQXFCLEdBQXJCLEVBQVAsRUFBbUMsSUFBbkMsQ0FBd0MsSUFBeEM7QUFDSCxNQUxEO0FBTUEsUUFBRyx5Q0FBSCxFQUE4QyxZQUFXO0FBQ3JELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLHlDQUF4QyxDQUFoQjtBQUNBLG9CQUFXLFFBQVgsR0FBc0IsS0FBdEI7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFRLEtBQVIsQ0FBYyxLQUFkLEVBQXFCLEdBQXJCLEVBQVAsRUFBbUMsSUFBbkMsQ0FBd0MsU0FBeEM7QUFDQSxnQkFBTyxRQUFRLFFBQVIsR0FBbUIsTUFBMUIsRUFBa0MsSUFBbEMsQ0FBdUMsQ0FBdkM7QUFDSCxNQU5EO0FBT0EsUUFBRyx5Q0FBSCxFQUE4QyxZQUFXO0FBQ3JELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLDBEQUF4QyxDQUFoQjtBQUNBLG9CQUFXLFFBQVgsR0FBc0IsS0FBdEI7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFRLEtBQVIsQ0FBYyxLQUFkLEVBQXFCLEdBQXJCLEVBQVAsRUFBbUMsSUFBbkMsQ0FBd0MsU0FBeEM7QUFDQSxnQkFBTyxRQUFRLFFBQVIsR0FBbUIsTUFBMUIsRUFBa0MsSUFBbEMsQ0FBdUMsQ0FBdkM7QUFDQSxvQkFBVyxRQUFYLEdBQXNCLElBQXRCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sUUFBUSxLQUFSLENBQWMsS0FBZCxFQUFxQixHQUFyQixFQUFQLEVBQW1DLElBQW5DLENBQXdDLElBQXhDO0FBQ0EsZ0JBQU8sUUFBUSxRQUFSLEdBQW1CLE1BQTFCLEVBQWtDLElBQWxDLENBQXVDLENBQXZDO0FBQ0EsZ0JBQU8sUUFBUSxLQUFSLENBQWMsS0FBZCxFQUFxQixRQUFyQixDQUE4QixVQUE5QixDQUFQLEVBQWtELElBQWxELENBQXVELElBQXZEO0FBQ0gsTUFYRDtBQVlBLFFBQUcsK0NBQUgsRUFBb0QsWUFBVztBQUMzRCxhQUFNLFVBQVUsK0JBQXFCLGlCQUFyQixFQUF3QyxvR0FBeEMsQ0FBaEI7QUFDQSxvQkFBVyxRQUFYLEdBQXNCLEtBQXRCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsaUJBQVEsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBeEI7QUFDQSxnQkFBTyxHQUFQLEVBQVksR0FBWixDQUFnQixnQkFBaEI7QUFDSCxNQU5EO0FBT0EsUUFBRyw0Q0FBSCxFQUFpRCxZQUFXO0FBQ3hELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLCtDQUF4QyxDQUFoQjtBQUNBLG9CQUFXLFFBQVgsR0FBc0IsS0FBdEI7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFRLEdBQVIsRUFBUCxFQUFzQixJQUF0QixDQUEyQixTQUEzQjtBQUNBLGdCQUFPLFFBQVEsTUFBZixFQUF1QixJQUF2QixDQUE0QixDQUE1QjtBQUNBLG9CQUFXLFFBQVgsR0FBc0IsSUFBdEI7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFRLEdBQVIsRUFBUCxFQUFzQixJQUF0QixDQUEyQixJQUEzQjtBQUNBLGdCQUFPLFFBQVEsTUFBZixFQUF1QixJQUF2QixDQUE0QixDQUE1QjtBQUNBLGdCQUFPLFFBQVEsUUFBUixDQUFpQixVQUFqQixDQUFQLEVBQXFDLElBQXJDLENBQTBDLElBQTFDO0FBQ0gsTUFYRDtBQVlILEVBakVELEU7Ozs7Ozs7O0FDRkE7Ozs7QUFDQTs7Ozs7O0FBQ0EsVUFBUyxTQUFULEVBQW9CLFlBQVc7QUFDM0IsU0FBSSwwQkFBSjtBQUFBLFNBQXVCLFlBQXZCO0FBQUEsU0FBNEIsbUJBQTVCO0FBQ0EsZ0JBQVcsWUFBVztBQUNsQixlQUFNLFFBQVEsU0FBUixDQUFrQixPQUFsQixDQUFOO0FBQ0EsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsc0JBQVMsUUFEMEY7QUFFbkcsd0JBQVcsR0FGd0Y7QUFHbkcsbUJBQU0sT0FINkY7QUFJbkcsbUJBQU0sQ0FKNkY7QUFLbkcsdUJBQVU7QUFMeUYsVUFBbkYsRUFNakI7QUFDQyxzQkFBUyxHQURWO0FBRUMsd0JBQVcsR0FGWjtBQUdDLG1CQUFNLEdBSFA7QUFJQyxtQkFBTSxHQUpQO0FBS0MsdUJBQVU7QUFMWCxVQU5pQixDQUFwQjtBQWFBLDJCQUFrQixNQUFsQjtBQUNBLHNCQUFhLGtCQUFrQixrQkFBL0I7QUFDSCxNQWpCRDtBQWtCQSxRQUFHLDhCQUFILEVBQW1DLFlBQVc7QUFDMUMsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MsZ0NBQXhDLENBQWhCO0FBQ0EsZ0JBQU8sUUFBUSxLQUFSLEVBQVAsRUFBd0IsSUFBeEIsQ0FBNkIsUUFBN0I7QUFDSCxNQUhEO0FBSUEsUUFBRyxnREFBSCxFQUFxRCxZQUFXO0FBQzVELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLGdDQUF4QyxDQUFoQjtBQUNBLGlCQUFRLEtBQVIsQ0FBYyxVQUFkO0FBQ0EsZ0JBQU8sV0FBVyxPQUFsQixFQUEyQixJQUEzQixDQUFnQyxVQUFoQztBQUNILE1BSkQ7QUFLQSxRQUFHLHdFQUFILEVBQTZFLFlBQVc7QUFDcEYsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MsZ0NBQXhDLENBQWhCO0FBQ0EsMkJBQWtCLEtBQWxCLENBQXdCLGNBQXhCLEVBQXdDLEdBQXhDO0FBQ0EsaUJBQVEsS0FBUixDQUFjLFdBQVcsS0FBWCxDQUFpQixFQUFqQixDQUFkO0FBQ0EsZ0JBQU8sV0FBVyxPQUFsQixFQUEyQixJQUEzQixDQUFnQyxVQUFoQztBQUNBLGdCQUFPLElBQUksS0FBSixDQUFVLEtBQVYsRUFBUCxFQUEwQixJQUExQixDQUErQixXQUFXLE1BQTFDO0FBQ0gsTUFORDtBQU9ILEVBcENELEU7Ozs7Ozs7O0FDRkE7Ozs7QUFDQTs7Ozs7O0FBQ0EsVUFBUyxRQUFULEVBQW1CLFlBQVc7QUFDMUIsU0FBSSwwQkFBSjtBQUFBLFNBQXVCLFlBQXZCO0FBQUEsU0FBNEIsbUJBQTVCO0FBQ0EsZ0JBQVcsWUFBVztBQUNsQixlQUFNLFFBQVEsU0FBUixDQUFrQixNQUFsQixDQUFOO0FBQ0EsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsc0JBQVMsUUFEMEY7QUFFbkcsd0JBQVcsR0FGd0Y7QUFHbkcsbUJBQU0sT0FINkY7QUFJbkcsbUJBQU0sQ0FKNkY7QUFLbkcsdUJBQVU7QUFMeUYsVUFBbkYsRUFNakI7QUFDQyxzQkFBUyxHQURWO0FBRUMsd0JBQVcsR0FGWjtBQUdDLG1CQUFNLEdBSFA7QUFJQyxtQkFBTSxHQUpQO0FBS0MsdUJBQVU7QUFMWCxVQU5pQixDQUFwQjtBQWFBLHNCQUFhLGtCQUFrQixNQUFsQixFQUFiO0FBQ0gsTUFoQkQ7QUFpQkEsUUFBRyxxQkFBSCxFQUEwQixZQUFNO0FBQzVCLGdCQUFPLFlBQU07QUFDVCw0Q0FBcUIsaUJBQXJCLEVBQXdDLDZCQUF4QztBQUNILFVBRkQsRUFFRyxHQUZILENBRU8sT0FGUDtBQUdILE1BSkQ7QUFLQSxRQUFHLHVCQUFILEVBQTRCLFlBQU07QUFDOUIsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MsNkJBQXhDLENBQWhCO0FBQ0EsZ0JBQU8sUUFBUSxLQUFmLEVBQXNCLE9BQXRCLENBQThCLFFBQVEsR0FBUixDQUFZLFFBQVosQ0FBOUI7QUFDSCxNQUhEO0FBSUEsUUFBRyxnREFBSCxFQUFxRCxZQUFNO0FBQ3ZELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLDZCQUF4QyxDQUFoQjtBQUNBLGdCQUFPLFFBQVEsSUFBUixFQUFQLEVBQXVCLElBQXZCLENBQTRCLFFBQVEsS0FBUixFQUE1QjtBQUNILE1BSEQ7QUFJSCxFQWhDRCxFOzs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7OztBQUNBLFVBQVMsYUFBVCxFQUF3QixZQUFXO0FBQy9CLFNBQUksMEJBQUo7QUFBQSxTQUF1QixZQUF2QjtBQUFBLFNBQTRCLG1CQUE1QjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsZUFBTSxRQUFRLFNBQVIsQ0FBa0IsT0FBbEIsQ0FBTjtBQUNBLDZCQUFvQiw0QkFBa0IsS0FBbEIsR0FBMEIsVUFBMUIsQ0FBcUMsTUFBckMsRUFBNkMsVUFBN0MsQ0FBd0QsaUJBQXhELEVBQTJFLE1BQTNFLEVBQW1GO0FBQ25HLHNCQUFTLFFBRDBGO0FBRW5HLHdCQUFXLEdBRndGO0FBR25HLG1CQUFNLE9BSDZGO0FBSW5HLG1CQUFNLENBSjZGO0FBS25HLHVCQUFVO0FBTHlGLFVBQW5GLEVBTWpCO0FBQ0Msc0JBQVMsR0FEVjtBQUVDLHdCQUFXLEdBRlo7QUFHQyxtQkFBTSxHQUhQO0FBSUMsbUJBQU0sR0FKUDtBQUtDLHVCQUFVO0FBTFgsVUFOaUIsQ0FBcEI7QUFhQSwyQkFBa0IsTUFBbEI7QUFDQSxzQkFBYSxrQkFBa0Isa0JBQS9CO0FBQ0gsTUFqQkQ7QUFrQkEsUUFBRyxrRUFBSCxFQUF1RSxZQUFNO0FBQ3pFLGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLG9EQUF4QyxDQUFoQjtBQUNBLGdCQUFPLFFBQVEsSUFBUixFQUFQLEVBQXVCLElBQXZCLENBQTRCLE9BQTVCO0FBQ0EsZ0JBQU8sUUFBUSxLQUFSLENBQWMsS0FBZCxFQUFxQixNQUE1QixFQUFvQyxJQUFwQyxDQUF5QyxDQUF6QztBQUNILE1BSkQ7QUFLQSxRQUFHLDRDQUFILEVBQWlELFlBQU07QUFDbkQsYUFBTSxVQUFVLCtCQUFxQixpQkFBckIsRUFBd0MsNERBQXhDLENBQWhCO0FBQ0EsZ0JBQU8sUUFBUSxJQUFSLEVBQVAsRUFBdUIsSUFBdkIsQ0FBNEIsV0FBNUI7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFRLElBQVIsRUFBUCxFQUF1QixJQUF2QixDQUE0QixPQUE1QjtBQUNILE1BTEQ7QUFNSCxFQS9CRCxFOzs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7OztBQUNBLFVBQVMsU0FBVCxFQUFvQixZQUFXO0FBQzNCLFNBQUksMEJBQUo7QUFBQSxTQUF1QixZQUF2QjtBQUFBLFNBQTRCLG1CQUE1QjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsZUFBTSxRQUFRLFNBQVIsQ0FBa0IsT0FBbEIsQ0FBTjtBQUNBLDZCQUFvQiw0QkFBa0IsS0FBbEIsR0FBMEIsVUFBMUIsQ0FBcUMsTUFBckMsRUFBNkMsVUFBN0MsQ0FBd0QsaUJBQXhELEVBQTJFLE1BQTNFLEVBQW1GO0FBQ25HLHVCQUFVLHlCQUR5RjtBQUVuRyxvQkFBTyxJQUY0RjtBQUduRyxxQkFBUTtBQUgyRixVQUFuRixFQUlqQixJQUppQixDQUFwQjtBQUtBLDJCQUFrQixNQUFsQjtBQUNBLHNCQUFhLGtCQUFrQixrQkFBL0I7QUFDSCxNQVREO0FBVUEsUUFBRyxnREFBSCxFQUFxRCxZQUFXO0FBQzVELGFBQU0sVUFBVSwrQkFBcUIsaUJBQXJCLEVBQXdDLGlDQUF4QyxDQUFoQjtBQUNBLGdCQUFPLFFBQVEsUUFBUixDQUFpQixVQUFqQixDQUFQLEVBQXFDLElBQXJDLENBQTBDLEtBQTFDO0FBQ0EsZ0JBQU8sUUFBUSxRQUFSLENBQWlCLGdCQUFqQixDQUFQLEVBQTJDLElBQTNDLENBQWdELEtBQWhEO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sUUFBUSxRQUFSLENBQWlCLFVBQWpCLENBQVAsRUFBcUMsSUFBckMsQ0FBMEMsSUFBMUM7QUFDQSxnQkFBTyxRQUFRLFFBQVIsQ0FBaUIsZ0JBQWpCLENBQVAsRUFBMkMsSUFBM0MsQ0FBZ0QsSUFBaEQ7QUFDSCxNQVJEO0FBU0gsRUFyQkQsRTs7Ozs7Ozs7QUNGQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLGtCQUFULEVBQTZCLFlBQVc7QUFDcEMsU0FBSSwwQkFBSjtBQUFBLFNBQXVCLFlBQXZCO0FBQUEsU0FBNEIsbUJBQTVCO0FBQ0EsZ0JBQVcsWUFBVztBQUNsQixlQUFNLFFBQVEsU0FBUixDQUFrQixPQUFsQixDQUFOO0FBQ0EsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsc0JBQVMsUUFEMEY7QUFFbkcsd0JBQVcsR0FGd0Y7QUFHbkcsbUJBQU0sT0FINkY7QUFJbkcsbUJBQU0sQ0FKNkY7QUFLbkcsdUJBQVU7QUFMeUYsVUFBbkYsRUFNakI7QUFDQyxzQkFBUyxHQURWO0FBRUMsd0JBQVcsR0FGWjtBQUdDLG1CQUFNLEdBSFA7QUFJQyxtQkFBTSxHQUpQO0FBS0MsdUJBQVU7QUFMWCxVQU5pQixDQUFwQjtBQWFBLDJCQUFrQixNQUFsQjtBQUNBLHNCQUFhLGtCQUFrQixrQkFBL0I7QUFDSCxNQWpCRDtBQWtCQSxRQUFHLG1CQUFILEVBQXdCLFlBQVc7QUFDL0IsNENBQXlCLFdBQXpCO0FBQ0gsTUFGRDtBQUdBLFFBQUcseUNBQUgsRUFBOEMsWUFBVztBQUNyRCxnQkFBTyxZQUFXO0FBQ2Q7QUFDSCxVQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHSCxNQUpEO0FBS0EsUUFBRyxnQ0FBSCxFQUFxQyxZQUFXO0FBQzVDLGdCQUFPLFlBQVc7QUFDZCw0Q0FBcUIsaUJBQXJCLEVBQXdDLFFBQXhDO0FBQ0gsVUFGRCxFQUVHLEdBRkgsQ0FFTyxPQUZQO0FBR0gsTUFKRDtBQU1ILEVBbENELEU7Ozs7Ozs7O0FDRkE7Ozs7OztBQUNBLFVBQVMsbUJBQVQsRUFBOEIsWUFBVztBQUNyQyxRQUFHLG1CQUFILEVBQXdCLFlBQVc7QUFDL0IsNkNBQTBCLFdBQTFCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsMkJBQUgsRUFBZ0MsWUFBVztBQUN2QyxnQkFBTyxRQUFRLFVBQVIsQ0FBbUIsNEJBQWtCLElBQXJDLENBQVAsRUFBbUQsSUFBbkQsQ0FBd0QsSUFBeEQ7QUFDSCxNQUZEO0FBR0EsUUFBRyx1RUFBSCxFQUE0RSxZQUFXO0FBQ25GLGFBQUksV0FBVyxFQUFmO0FBQ0EsZ0JBQU8sWUFBVztBQUNkLHdCQUFXLDRCQUFrQixJQUFsQixDQUF1QixjQUF2QixDQUFYO0FBQ0gsVUFGRCxFQUVHLEdBRkgsQ0FFTyxPQUZQO0FBR0EsZ0JBQU8sUUFBUCxFQUFpQixhQUFqQjtBQUNILE1BTkQ7QUFPQSxNQUNJLE9BREosRUFFSSxPQUZKLEVBR0ksTUFISixFQUlJLFdBSkosRUFLSSxVQUxKLEVBTUksYUFOSixFQU9JLFNBUEosRUFRSSxVQVJKLEVBU0ksV0FUSixFQVVJLGlCQVZKLEVBV0ksVUFYSixFQVlFLE9BWkYsQ0FZVSxVQUFTLElBQVQsRUFBZTtBQUNyQixZQUFHLCtCQUErQixJQUEvQixHQUFzQyxXQUF6QyxFQUFzRCxZQUFXO0FBQzdELG9CQUFPLDRCQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFQLEVBQXFDLFdBQXJDLENBQWlELElBQWpEO0FBQ0gsVUFGRDtBQUdILE1BaEJEOztBQWtCQSxjQUFTLGVBQVQsRUFBMEIsWUFBVztBQUNqQyxhQUFJLFlBQUo7QUFDQSxvQkFBVyxZQUFXO0FBQ2xCLG1CQUFNLFFBQVEsU0FBUixFQUFOO0FBQ0EsaUJBQUksR0FBSixDQUFRLFdBQVIsQ0FBb0IsR0FBcEI7QUFDQSx5Q0FBa0IsTUFBbEI7QUFDSCxVQUpEO0FBS0EsWUFBRyxnQ0FBSCxFQUFxQyxZQUFXO0FBQzVDLG9CQUFPLFlBQVc7QUFDZCw2Q0FBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsRUFBdUMsR0FBdkM7QUFDSCxjQUZELEVBRUcsR0FGSCxDQUVPLE9BRlA7QUFHQSxvQkFBTyxHQUFQLEVBQVksZ0JBQVo7QUFDQSxvQkFBTyw0QkFBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsQ0FBUCxFQUErQyxJQUEvQyxDQUFvRCxHQUFwRDtBQUNBLG9CQUFPLDRCQUFrQixJQUFsQixDQUF1QixjQUF2QixDQUFQLEVBQStDLElBQS9DLENBQW9ELEdBQXBEO0FBQ0Esb0JBQU8sNEJBQWtCLElBQWxCLENBQXVCLGFBQXZCLENBQVAsRUFBOEMsSUFBOUMsQ0FBbUQsR0FBbkQ7QUFDQSxvQkFBTyxJQUFJLEtBQUosQ0FBVSxLQUFWLEVBQVAsRUFBMEIsSUFBMUIsQ0FBK0IsQ0FBL0I7QUFDSCxVQVREO0FBVUEsWUFBRywyREFBSCxFQUFnRSxZQUFXO0FBQ3ZFLHlDQUFrQixJQUFsQixDQUF1QixjQUF2QixFQUF1QyxHQUF2QztBQUNBLG9CQUFPLFlBQVc7QUFDZCw2Q0FBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsRUFBdUMsWUFBVyxDQUFFLENBQXBEO0FBQ0gsY0FGRCxFQUVHLE9BRkg7QUFHQSxvQkFBTyw0QkFBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsQ0FBUCxFQUErQyxJQUEvQyxDQUFvRCxHQUFwRDtBQUNILFVBTkQ7QUFPQSxZQUFHLDZFQUFILEVBQWtGLFlBQVc7QUFDekYseUNBQWtCLElBQWxCLENBQXVCLGNBQXZCLEVBQXVDLEdBQXZDO0FBQ0EsaUJBQU0sYUFBYSxRQUFRLFNBQVIsRUFBbkI7QUFDQSx3QkFBVyxHQUFYLENBQWUsV0FBZixDQUEyQixVQUEzQjtBQUNBLG9CQUFPLFlBQVc7QUFDZCw2Q0FBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsRUFBdUMsVUFBdkMsRUFBbUQsWUFBVztBQUMxRCw0QkFBTyxJQUFQO0FBQ0gsa0JBRkQ7QUFHSCxjQUpELEVBSUcsR0FKSCxDQUlPLE9BSlA7QUFLQSxvQkFBTyw0QkFBa0IsSUFBbEIsQ0FBdUIsY0FBdkIsQ0FBUCxFQUErQyxHQUEvQyxDQUFtRCxJQUFuRCxDQUF3RCxHQUF4RDtBQUNBLG9CQUFPLDRCQUFrQixJQUFsQixDQUF1QixjQUF2QixDQUFQLEVBQStDLElBQS9DLENBQW9ELFVBQXBEO0FBQ0Esb0JBQU8sSUFBSSxLQUFKLENBQVUsS0FBVixFQUFQLEVBQTBCLElBQTFCLENBQStCLENBQS9CO0FBQ0Esb0JBQU8sV0FBVyxLQUFYLENBQWlCLEtBQWpCLEVBQVAsRUFBaUMsSUFBakMsQ0FBc0MsQ0FBdEM7QUFDSCxVQWJEO0FBY0gsTUF0Q0Q7QUF1Q0gsRUF2RUQsRTs7Ozs7Ozs7QUNEQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLFNBQVQsRUFBb0IsWUFBVztBQUMzQixTQUFJLDBCQUFKO0FBQUEsU0FBdUIsZ0JBQXZCO0FBQUEsU0FBZ0MsWUFBaEM7QUFDQSxTQUFNLFVBQVUsNEJBQWtCLElBQWxCLENBQXVCLFNBQXZCLENBQWhCO0FBQ0EsZ0JBQVcsWUFBVztBQUNsQixlQUFNLFFBQVEsU0FBUixDQUFrQixPQUFsQixDQUFOO0FBQ0EsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsb0JBQU87QUFENEYsVUFBbkYsRUFFakIsSUFGaUIsQ0FBcEI7QUFHQSxtQkFBVSxRQUFRLE9BQVIsQ0FBZ0IsaUJBQWhCLEVBQW1DLDRCQUFuQyxDQUFWO0FBQ0gsTUFORDtBQU9BLFFBQUcsMEJBQUgsRUFBK0IsWUFBVztBQUN0QyxnQkFBTyxPQUFQLEVBQWdCLFdBQWhCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsc0JBQUgsRUFBMkIsWUFBVztBQUNsQyxnQkFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQXdCLFFBQVEsR0FBUixDQUFZLFFBQVosQ0FBeEI7QUFDSCxNQUZEO0FBR0EsUUFBRyx5QkFBSCxFQUE4QixZQUFXO0FBQ3JDLGdCQUFPLFlBQVc7QUFDZDtBQUNILFVBRkQsRUFFRyxHQUZILENBRU8sT0FGUDtBQUdILE1BSkQ7QUFLQSxRQUFHLGlDQUFILEVBQXNDLFlBQVc7QUFDN0M7QUFDQSxnQkFBTyxHQUFQLEVBQVksZ0JBQVo7QUFDSCxNQUhEO0FBSUEsUUFBRyx1QkFBSCxFQUE0QixZQUFXO0FBQ25DLGFBQU0sVUFBVSxTQUFWLE9BQVUsR0FBVyxDQUFFLENBQTdCO0FBQ0EsYUFBTSxVQUFVLFNBQVYsT0FBVSxHQUFXLENBQUUsQ0FBN0I7QUFDQSxhQUFNLFNBQVM7QUFDWCxxQkFBUSxPQURHO0FBRVgscUJBQVE7QUFGRyxVQUFmO0FBSUEsaUJBQVEsTUFBUjtBQUNBLGdCQUFPLEdBQVAsRUFBWSxvQkFBWixDQUFpQyxPQUFqQyxFQUEwQyxPQUExQztBQUNILE1BVEQ7QUFVSCxFQW5DRCxFOzs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7OztBQUNBLFVBQVMsTUFBVCxFQUFpQixZQUFXO0FBQ3hCLFNBQUksMEJBQUo7QUFBQSxTQUF1QixhQUF2QjtBQUNBLFNBQU0sT0FBTyw0QkFBa0IsSUFBbEIsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsd0JBQVc7QUFEd0YsVUFBbkYsRUFFakIsSUFGaUIsQ0FBcEI7QUFHQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxLQUFLLE9BQUwsQ0FBYSxpQkFBYixFQUFnQyxnQkFBaEMsQ0FBUDtBQUNILE1BTkQ7QUFPQSxRQUFHLDBCQUFILEVBQStCLFlBQVc7QUFDdEMsZ0JBQU8sSUFBUCxFQUFhLFdBQWI7QUFDSCxNQUZEO0FBR0EsUUFBRyxvREFBSCxFQUF5RCxZQUFXO0FBQ2hFLGdCQUFPLEtBQUssS0FBTCxFQUFQLEVBQXFCLGFBQXJCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsMkNBQUgsRUFBZ0QsWUFBVztBQUN2RCwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxLQUFLLEtBQUwsRUFBUCxFQUFxQixJQUFyQixDQUEwQixJQUExQjtBQUNILE1BSEQ7QUFJQSxRQUFHLHFEQUFILEVBQTBELFlBQVc7QUFDakUsMkJBQWtCLE1BQWxCO0FBQ0EsMkJBQWtCLGtCQUFsQixDQUFxQyxTQUFyQyxHQUFpRCxRQUFRLElBQXpEO0FBQ0EsZ0JBQU8sS0FBSyxLQUFMLEVBQVAsRUFBcUIsR0FBckIsQ0FBeUIsSUFBekIsQ0FBOEIsUUFBUSxJQUF0QztBQUNBLDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLEtBQUssS0FBTCxFQUFQLEVBQXFCLElBQXJCLENBQTBCLFFBQVEsSUFBbEM7QUFDSCxNQU5EO0FBT0EsUUFBRyxtREFBSCxFQUF3RCxZQUFXO0FBQy9ELGFBQU0sUUFBUSxRQUFRLFNBQVIsRUFBZDtBQUNBLGNBQUssS0FBTDtBQUNBLDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLEtBQVAsRUFBYyxnQkFBZDtBQUNBLGdCQUFPLE1BQU0sS0FBTixDQUFZLEtBQVosRUFBUCxFQUE0QixJQUE1QixDQUFpQyxDQUFqQztBQUNILE1BTkQ7QUFPQSxRQUFHLHNEQUFILEVBQTJELFlBQVc7QUFDbEUsYUFBTSxRQUFRLFFBQVEsU0FBUixFQUFkO0FBQ0EsYUFBTSxVQUFVLEtBQUssS0FBTCxDQUFoQjtBQUNBO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sS0FBUCxFQUFjLEdBQWQsQ0FBa0IsZ0JBQWxCO0FBQ0gsTUFORDtBQU9BLFFBQUcsNENBQUgsRUFBaUQsWUFBVztBQUN4RCxhQUFNLFFBQVEsUUFBUSxTQUFSLEVBQWQ7QUFDQSxhQUFNLFNBQVMsUUFBUSxTQUFSLEVBQWY7QUFDQSxhQUFNLFVBQVUsS0FBSyxLQUFMLENBQWhCO0FBQ0EsY0FBSyxNQUFMO0FBQ0E7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxLQUFQLEVBQWMsR0FBZCxDQUFrQixnQkFBbEI7QUFDQSxnQkFBTyxNQUFQLEVBQWUsZ0JBQWY7QUFDSCxNQVREO0FBV0gsRUFwREQsRTs7Ozs7Ozs7QUNGQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLFNBQVQsRUFBb0IsWUFBVztBQUMzQixTQUFJLDBCQUFKO0FBQUEsU0FBdUIsZ0JBQXZCO0FBQUEsU0FBZ0MsWUFBaEM7QUFBQSxTQUFxQyxtQkFBckM7QUFDQSxTQUFNLFVBQVUsNEJBQWtCLElBQWxCLENBQXVCLFNBQXZCLENBQWhCO0FBQ0EsU0FBTSxhQUFhLHdCQUFuQjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsZUFBTSxRQUFRLFNBQVIsQ0FBa0IsT0FBbEIsQ0FBTjtBQUNBLDZCQUFvQiw0QkFBa0IsS0FBbEIsR0FBMEIsVUFBMUIsQ0FBcUMsTUFBckMsRUFBNkMsVUFBN0MsQ0FBd0QsaUJBQXhELEVBQTJFLE1BQTNFLEVBQW1GLEVBQW5GLEVBQXVGLElBQXZGLENBQXBCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0Esc0JBQWEsa0JBQWtCLGtCQUEvQjtBQUNBLG1CQUFVLFFBQVEsT0FBUixDQUFnQixpQkFBaEIsRUFBbUMsVUFBbkMsQ0FBVjtBQUNILE1BTkQ7QUFPQSxRQUFHLG1CQUFILEVBQXdCLFlBQVc7QUFDL0IsZ0JBQU8sT0FBUCxFQUFnQixXQUFoQjtBQUNILE1BRkQ7QUFHQSxRQUFHLHNEQUFILEVBQTJELFlBQVc7QUFDbEUsaUJBQVEsUUFBUjtBQUNBLGdCQUFPLFdBQVcsaUJBQWxCLEVBQXFDLElBQXJDLENBQTBDLFFBQTFDO0FBQ0gsTUFIRDtBQUlBLFFBQUcsZ0RBQUgsRUFBcUQsWUFBVztBQUM1RCwyQkFBa0IsS0FBbEIsQ0FBd0IsVUFBeEIsRUFBb0MsR0FBcEM7QUFDQSxnQkFBTyxHQUFQLEVBQVksR0FBWixDQUFnQixnQkFBaEI7QUFDQSxpQkFBUSxRQUFSO0FBQ0EsZ0JBQU8sR0FBUCxFQUFZLGdCQUFaO0FBQ0gsTUFMRDtBQU1BLFFBQUcsa0RBQUgsRUFBdUQsWUFBVztBQUM5RCxvQkFBVyxpQkFBWCxHQUErQixXQUEvQjtBQUNBLGdCQUFPLFNBQVAsRUFBa0IsSUFBbEIsQ0FBdUIsV0FBdkI7QUFDSCxNQUhEO0FBSUEsUUFBRyx5Q0FBSCxFQUE4QyxZQUFXO0FBQ3JELG9CQUFXLGlCQUFYLEdBQStCLFdBQS9CO0FBQ0EsMkJBQWtCLEtBQWxCLENBQXdCLFVBQXhCLEVBQW9DLEdBQXBDO0FBQ0E7QUFDQSxnQkFBTyxHQUFQLEVBQVksR0FBWixDQUFnQixnQkFBaEI7QUFDSCxNQUxEO0FBTUEsUUFBRyxvQ0FBSCxFQUF5QyxZQUFXO0FBQ2hELGFBQU0sU0FBUyxFQUFmO0FBQ0EsMkJBQWtCLEtBQWxCLENBQXdCLFVBQXhCLEVBQW9DLFVBQVMsUUFBVCxFQUFtQjtBQUNuRCxvQkFBTyxRQUFQLElBQW1CLENBQUMsT0FBTyxRQUFQLENBQUQsR0FBb0IsQ0FBcEIsR0FBd0IsT0FBTyxRQUFQLElBQW1CLENBQTlELEM7QUFDSCxVQUZEO0FBR0EsaUJBQVEsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FBUjtBQUNBLGdCQUFPLFdBQVcsaUJBQWxCLEVBQXFDLElBQXJDLENBQTBDLFFBQTFDO0FBQ0EsZ0JBQU8sTUFBUCxFQUFlLE9BQWYsQ0FBdUI7QUFDbkIsZ0JBQUcsQ0FEZ0IsRTtBQUVuQixpQkFBSSxDQUZlLEU7QUFHbkIsa0JBQUssQ0FIYyxFO0FBSW5CLG1CQUFNLENBSmEsRTtBQUtuQixvQkFBTyxDQUxZLEU7QUFNbkIscUJBQVEsQztBQU5XLFVBQXZCO0FBUUgsTUFmRDtBQWdCQSxRQUFHLDZEQUFILEVBQWtFLFlBQVc7QUFDekUsYUFBTSxTQUFTLEVBQWY7QUFDQSwyQkFBa0IsS0FBbEIsQ0FBd0IsVUFBeEIsRUFBb0MsVUFBUyxRQUFULEVBQW1CO0FBQ25ELG9CQUFPLFFBQVAsSUFBbUIsQ0FBQyxPQUFPLFFBQVAsQ0FBRCxHQUFvQixDQUFwQixHQUF3QixPQUFPLFFBQVAsSUFBbUIsQ0FBOUQsQztBQUNILFVBRkQ7QUFHQSxpQkFBUSxRQUFSLEVBQWtCLElBQWxCO0FBQ0EsZ0JBQU8sV0FBVyxpQkFBbEIsRUFBcUMsSUFBckMsQ0FBMEMsUUFBMUM7QUFDQSxnQkFBTyxNQUFQLEVBQWUsT0FBZixDQUF1QjtBQUNuQixnQkFBRyxDQURnQixFO0FBRW5CLGlCQUFJLENBRmUsRTtBQUduQixrQkFBSyxDQUhjLEU7QUFJbkIsbUJBQU0sQ0FKYSxFO0FBS25CLG9CQUFPLENBTFksRTtBQU1uQixxQkFBUSxDO0FBTlcsVUFBdkI7QUFRSCxNQWZEO0FBZ0JBLFFBQUcsZ0NBQUgsRUFBcUMsWUFBVztBQUM1QyxnQkFBTyxRQUFRLE9BQWYsRUFBd0IsT0FBeEIsQ0FBZ0MsUUFBUSxHQUFSLENBQVksUUFBWixDQUFoQztBQUNILE1BRkQ7QUFHQSxjQUFTLFNBQVQsRUFBb0IsWUFBVztBQUMzQixZQUFHLG1FQUFILEVBQXdFLFlBQVc7QUFDL0UsaUJBQU0sYUFBYSxRQUFRLFNBQVIsRUFBbkI7QUFDQSwrQkFBa0IsS0FBbEIsQ0FBd0IsVUFBeEIsRUFBb0MsVUFBcEM7QUFDQSxxQkFBUSxPQUFSLENBQWdCLEdBQWhCO0FBQ0EscUJBQVEsUUFBUixFQUFrQixJQUFsQjtBQUNBLHdCQUFXLGlCQUFYLEdBQStCLGNBQS9CO0FBQ0EsK0JBQWtCLE1BQWxCO0FBQ0Esb0JBQU8sSUFBSSxLQUFKLENBQVUsS0FBVixFQUFQLEVBQTBCLElBQTFCLENBQStCLENBQS9CO0FBQ0Esb0JBQU8sV0FBVyxLQUFYLENBQWlCLEtBQWpCLEVBQVAsRUFBaUMsSUFBakMsQ0FBc0MsQ0FBdEM7QUFDSCxVQVREO0FBVUgsTUFYRDtBQVlILEVBakZELEU7Ozs7Ozs7O0FDRkE7Ozs7QUFDQTs7Ozs7O0FBQ0EsVUFBUyxhQUFULEVBQXdCLFlBQVc7QUFDL0IsU0FBSSwwQkFBSjtBQUFBLFNBQXVCLG9CQUF2QjtBQUNBLFNBQU0sY0FBYyw0QkFBa0IsSUFBbEIsQ0FBdUIsV0FBdkIsQ0FBcEI7QUFDQSxnQkFBVyxZQUFXO0FBQ2xCLDZCQUFvQiw0QkFBa0IsS0FBbEIsR0FBMEIsVUFBMUIsQ0FBcUMsTUFBckMsRUFBNkMsVUFBN0MsQ0FBd0QsaUJBQXhELEVBQTJFLE1BQTNFLEVBQW1GO0FBQ25HLG1CQUFNO0FBRDZGLFVBQW5GLEVBRWpCLElBRmlCLENBQXBCO0FBR0EsMkJBQWtCLE1BQWxCO0FBQ0EsdUJBQWMsWUFBWSxPQUFaLENBQW9CLGlCQUFwQixFQUF1QyxlQUF2QyxDQUFkO0FBQ0EscUJBQVksY0FBWixDQUEyQixJQUEzQjtBQUNBLDJCQUFrQixNQUFsQjtBQUNILE1BUkQ7QUFTQSxRQUFHLDJDQUFILEVBQWdELFlBQU07QUFDbEQsZ0JBQU8sWUFBTTtBQUNUO0FBQ0gsVUFGRCxFQUVHLEdBRkgsQ0FFTyxPQUZQO0FBR0gsTUFKRDtBQUtBLFFBQUcscURBQUgsRUFBMEQsWUFBTTtBQUM1RCxnQkFBTyxhQUFQLEVBQXNCLElBQXRCLENBQTJCLE9BQTNCO0FBQ0gsTUFGRDtBQUdBLFFBQUcscURBQUgsRUFBMEQsWUFBTTtBQUM1RCxxQkFBWSxjQUFaLENBQTJCLElBQTNCO0FBQ0EsZ0JBQU8sYUFBUCxFQUFzQixJQUF0QixDQUEyQixPQUEzQjtBQUNBLDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLGFBQVAsRUFBc0IsSUFBdEIsQ0FBMkIsT0FBM0I7QUFDSCxNQUxEO0FBTUEsUUFBRyxzQ0FBSCxFQUEyQyxZQUFNO0FBQzdDLGFBQU0sTUFBTSxRQUFRLFNBQVIsQ0FBa0IsV0FBbEIsQ0FBWjtBQUNBLHFCQUFZLE9BQVosQ0FBb0IsR0FBcEI7QUFDQSwyQkFBa0Isa0JBQWxCLENBQXFDLElBQXJDLEdBQTRDLEtBQTVDO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sR0FBUCxFQUFZLG9CQUFaLENBQWlDLHNCQUFqQztBQUNILE1BTkQ7QUFPSCxFQWpDRCxFOzs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7OztBQUNBLFVBQVMsUUFBVCxFQUFtQixZQUFXO0FBQzFCLFNBQUksMEJBQUo7QUFBQSxTQUF1QixlQUF2QjtBQUFBLFNBQStCLFlBQS9CO0FBQUEsU0FBb0MsbUJBQXBDO0FBQ0EsU0FBTSxTQUFTLDRCQUFrQixJQUFsQixDQUF1QixRQUF2QixDQUFmO0FBQ0EsU0FBTSxhQUFhLHdCQUFuQjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsZUFBTSxRQUFRLFNBQVIsQ0FBa0IsT0FBbEIsQ0FBTjtBQUNBLDZCQUFvQiw0QkFBa0IsS0FBbEIsR0FBMEIsVUFBMUIsQ0FBcUMsTUFBckMsRUFBNkMsVUFBN0MsQ0FBd0QsaUJBQXhELEVBQTJFLE1BQTNFLEVBQW1GO0FBQ25HLGdDQUFtQjtBQURnRixVQUFuRixFQUVqQixJQUZpQixDQUFwQjtBQUdBLDJCQUFrQixNQUFsQjtBQUNBLHNCQUFhLGtCQUFrQixrQkFBL0I7QUFDQSxrQkFBUyxPQUFPLE9BQVAsQ0FBZSxpQkFBZixFQUFrQyxVQUFsQyxDQUFUO0FBQ0gsTUFSRDtBQVNBLFFBQUcsbUJBQUgsRUFBd0IsWUFBTTtBQUMxQixnQkFBTyxNQUFQLEVBQWUsV0FBZjtBQUNILE1BRkQ7QUFHQSxRQUFHLHNCQUFILEVBQTJCLFlBQU07QUFDN0IsZ0JBQU8sTUFBUCxFQUFlLE9BQWYsQ0FBdUIsUUFBUSxHQUFSLENBQVksUUFBWixDQUF2QjtBQUNILE1BRkQ7QUFHQSxRQUFHLDhCQUFILEVBQW1DLFlBQU07QUFDckMsZ0JBQU8sWUFBTTtBQUNUO0FBQ0gsVUFGRCxFQUVHLEdBRkgsQ0FFTyxPQUZQO0FBR0gsTUFKRDtBQUtBLFFBQUcsK0VBQUgsRUFBb0YsWUFBTTtBQUN0RixnQkFBTyxRQUFQLEVBQWlCLGFBQWpCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsc0NBQUgsRUFBMkMsWUFBTTtBQUM3QywyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxRQUFQLEVBQWlCLElBQWpCLENBQXNCLFFBQXRCO0FBQ0Esb0JBQVcsaUJBQVgsR0FBK0IsY0FBL0I7QUFDQSxnQkFBTyxRQUFQLEVBQWlCLElBQWpCLENBQXNCLFFBQXRCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sUUFBUCxFQUFpQixJQUFqQixDQUFzQixjQUF0QjtBQUNILE1BUEQ7QUFRQSxRQUFHLGtDQUFILEVBQXVDLFlBQU07QUFDekMsZ0JBQU8sT0FBUCxDQUFlLEdBQWY7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxHQUFQLEVBQVksb0JBQVosQ0FBaUMsUUFBakM7QUFDSCxNQUpEO0FBS0gsRUF4Q0QsRTs7Ozs7Ozs7QUNGQTs7OztBQUNBOzs7Ozs7QUFDQSxVQUFTLFNBQVQsRUFBb0IsWUFBTTtBQUN0QixTQUFNLFVBQVUsNEJBQWlCLElBQWpCLENBQXNCLFVBQXRCLENBQWhCOztBQUVBLFNBQUksbUJBQUo7QUFBQSxTQUFnQiwwQkFBaEI7QUFBQSxTQUFtQyxvQkFBbkM7QUFBQSxTQUFnRCwwQkFBaEQ7QUFDQSxnQkFBVyxZQUFNO0FBQ2IsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsZ0NBQW1CLFVBRGdGO0FBRW5HLHFCQUFRLElBRjJGO0FBR25HLHFCQUFRO0FBSDJGLFVBQW5GLEVBSWpCLElBSmlCLENBQXBCO0FBS0Esc0JBQWEsa0JBQWtCLE1BQWxCLEVBQWI7QUFDQSx1QkFBYyxRQUFRLE9BQVIsQ0FBZ0IsaUJBQWhCLEVBQW1DLHdCQUFuQyxDQUFkO0FBQ0EsNkJBQW9CLFFBQVEsT0FBUixDQUFnQixpQkFBaEIsRUFBbUMsNERBQW5DLENBQXBCO0FBQ0gsTUFURDtBQVVBLFFBQUcsbUJBQUgsRUFBd0IsWUFBTTtBQUMxQixnQkFBTyxXQUFQLEVBQW9CLFdBQXBCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsMkRBQUgsRUFBZ0UsWUFBTTtBQUNsRSxnQkFBTyxhQUFQLEVBQXNCLElBQXRCLENBQTJCLEVBQTNCO0FBQ0EsMkJBQWtCLE1BQWxCO0FBQ0EsZ0JBQU8sYUFBUCxFQUFzQixJQUF0QixDQUEyQixVQUEzQjtBQUNILE1BSkQ7QUFLQSxRQUFHLHNDQUFILEVBQTJDLFlBQU07QUFDN0MsZ0JBQU8sbUJBQVAsRUFBNEIsSUFBNUIsQ0FBaUMsRUFBakM7QUFDQSwyQkFBa0IsTUFBbEI7QUFDQSxnQkFBTyxtQkFBUCxFQUE0QixJQUE1QixDQUFpQyxVQUFqQztBQUNILE1BSkQ7QUFLQSxRQUFHLGdFQUFILEVBQXFFLFlBQU07QUFDdkUsZ0JBQU8sWUFBWSxRQUFaLENBQXFCLFVBQXJCLENBQVAsRUFBeUMsSUFBekMsQ0FBOEMsS0FBOUM7QUFDQSxnQkFBTyxZQUFZLFFBQVosQ0FBcUIsZ0JBQXJCLENBQVAsRUFBK0MsSUFBL0MsQ0FBb0QsS0FBcEQ7QUFDQSxnQkFBTyxrQkFBa0IsUUFBbEIsQ0FBMkIsVUFBM0IsQ0FBUCxFQUErQyxJQUEvQyxDQUFvRCxLQUFwRDtBQUNBLGdCQUFPLGtCQUFrQixRQUFsQixDQUEyQixnQkFBM0IsQ0FBUCxFQUFxRCxJQUFyRCxDQUEwRCxLQUExRDtBQUNBLDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLFlBQVksUUFBWixDQUFxQixVQUFyQixDQUFQLEVBQXlDLElBQXpDLENBQThDLElBQTlDO0FBQ0EsZ0JBQU8sWUFBWSxRQUFaLENBQXFCLGdCQUFyQixDQUFQLEVBQStDLElBQS9DLENBQW9ELEtBQXBEO0FBQ0EsZ0JBQU8sa0JBQWtCLFFBQWxCLENBQTJCLFVBQTNCLENBQVAsRUFBK0MsSUFBL0MsQ0FBb0QsSUFBcEQ7QUFDQSxnQkFBTyxrQkFBa0IsUUFBbEIsQ0FBMkIsZ0JBQTNCLENBQVAsRUFBcUQsSUFBckQsQ0FBMEQsS0FBMUQ7QUFDQSxvQkFBVyxNQUFYLEdBQW9CLElBQXBCO0FBQ0Esb0JBQVcsTUFBWCxHQUFvQixLQUFwQjtBQUNBLG9CQUFXLGlCQUFYLEdBQStCLGdCQUEvQjtBQUNBLDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLFlBQVksUUFBWixDQUFxQixVQUFyQixDQUFQLEVBQXlDLElBQXpDLENBQThDLEtBQTlDO0FBQ0EsZ0JBQU8sWUFBWSxRQUFaLENBQXFCLGdCQUFyQixDQUFQLEVBQStDLElBQS9DLENBQW9ELElBQXBEO0FBQ0EsZ0JBQU8sa0JBQWtCLFFBQWxCLENBQTJCLFVBQTNCLENBQVAsRUFBK0MsSUFBL0MsQ0FBb0QsS0FBcEQ7QUFDQSxnQkFBTyxrQkFBa0IsUUFBbEIsQ0FBMkIsZ0JBQTNCLENBQVAsRUFBcUQsSUFBckQsQ0FBMEQsSUFBMUQ7QUFDSCxNQWxCRDtBQW1CSCxFQTlDRCxFOzs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7OztBQUNBLFVBQVMsVUFBVCxFQUFxQixZQUFXO0FBQzVCLFNBQUksMEJBQUo7QUFBQSxTQUF1QixpQkFBdkI7QUFBQSxTQUFpQyxZQUFqQztBQUFBLFNBQXNDLG1CQUF0QztBQUNBLFNBQU0sV0FBVyw0QkFBa0IsSUFBbEIsQ0FBdUIsVUFBdkIsQ0FBakI7QUFDQSxnQkFBVyxZQUFXO0FBQ2xCLGVBQU0sUUFBUSxTQUFSLENBQWtCLE9BQWxCLENBQU47QUFDQSw2QkFBb0IsNEJBQWtCLEtBQWxCLEdBQTBCLFVBQTFCLENBQXFDLE1BQXJDLEVBQTZDLFVBQTdDLENBQXdELGlCQUF4RCxFQUEyRSxNQUEzRSxFQUFtRjtBQUNuRyxzQkFBUyxDQUFDO0FBQ04sb0JBQUc7QUFERyxjQUFELEVBRU47QUFDQyxvQkFBRztBQURKLGNBRk0sRUFJTjtBQUNDLG9CQUFHO0FBREosY0FKTSxFQU1OO0FBQ0Msb0JBQUc7QUFESixjQU5NLEVBUU47QUFDQyxvQkFBRztBQURKLGNBUk0sRUFVTjtBQUNDLG9CQUFHO0FBREosY0FWTTtBQUQwRixVQUFuRixFQWNqQixJQWRpQixDQUFwQjtBQWVBLDJCQUFrQixNQUFsQjtBQUNBLHNCQUFhLGtCQUFrQixrQkFBL0I7QUFDQSxvQkFBVyxTQUFTLE9BQVQsQ0FBaUIsaUJBQWpCLEVBQW9DLHVCQUFwQyxDQUFYO0FBQ0gsTUFwQkQ7O0FBc0JBLGVBQVUsWUFBVztBQUNqQiwyQkFBa0IsUUFBbEI7QUFDSCxNQUZEOztBQUlBLFFBQUcsbUJBQUgsRUFBd0IsWUFBTTtBQUMxQixnQkFBTyxRQUFQLEVBQWlCLFdBQWpCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsc0JBQUgsRUFBMkIsWUFBTTtBQUM3QixnQkFBTyxRQUFQLEVBQWlCLE9BQWpCLENBQXlCLFFBQVEsR0FBUixDQUFZLFFBQVosQ0FBekI7QUFDSCxNQUZEO0FBR0EsUUFBRyx1Q0FBSCxFQUE0QyxZQUFNO0FBQzlDLGdCQUFPLFVBQVAsRUFBbUIsV0FBbkI7QUFDQSxnQkFBTyxVQUFQLEVBQW1CLE9BQW5CLENBQTJCLFFBQVEsR0FBUixDQUFZLE1BQVosQ0FBM0I7QUFDSCxNQUhEO0FBSUEsUUFBRyxnREFBSCxFQUFxRCxZQUFNO0FBQ3ZELDJCQUFrQixNQUFsQjtBQUNBLGdCQUFPLE9BQU8sSUFBUCxDQUFZLFdBQVcsV0FBWCxDQUF1QixLQUFuQyxFQUEwQyxNQUFqRCxFQUF5RCxJQUF6RCxDQUE4RCxDQUE5RDtBQUNILE1BSEQ7QUFJQSxjQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDN0Isb0JBQVcsWUFBTTs7QUFFYix3QkFBVyxPQUFYLEdBQXFCLEVBQXJCO0FBQ0Esa0JBQUssSUFBSSxRQUFRLENBQWpCLEVBQW9CLFFBQVEsRUFBNUIsRUFBZ0MsT0FBaEMsRUFBeUM7QUFDckMsNEJBQVcsT0FBWCxDQUFtQixJQUFuQixDQUF3QjtBQUNwQixpQ0FBWTtBQURRLGtCQUF4QjtBQUdIO0FBQ0QsK0JBQWtCLE1BQWxCO0FBQ0gsVUFURDtBQVVBLFlBQUcsaUNBQUgsRUFBc0MsWUFBTTtBQUN4QyxpQkFBTSxhQUFhLFVBQW5CO0FBQ0EsK0JBQWtCLE1BQWxCLEc7QUFDQSxpQkFBSSxjQUFjLFVBQWxCO0FBQ0Esb0JBQU8sV0FBVyxXQUFYLENBQXVCLEtBQXZCLENBQTZCLE1BQXBDLEVBQTRDLElBQTVDLENBQWlELFlBQVksV0FBWixDQUF3QixLQUF4QixDQUE4QixNQUEvRTtBQUNBLG9CQUFPLFdBQVcsV0FBWCxDQUF1QixPQUF2QixDQUErQixNQUF0QyxFQUE4QyxJQUE5QyxDQUFtRCxZQUFZLFdBQVosQ0FBd0IsT0FBeEIsQ0FBZ0MsTUFBbkY7QUFDQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsUUFBdkIsQ0FBZ0MsTUFBdkMsRUFBK0MsSUFBL0MsQ0FBb0QsWUFBWSxXQUFaLENBQXdCLFFBQXhCLENBQWlDLE1BQXJGO0FBQ0Esd0JBQVcsT0FBWCxDQUFtQixDQUFuQixJQUF3QjtBQUNwQixvQkFBRztBQURpQixjQUF4QjtBQUdBLCtCQUFrQixNQUFsQixHO0FBQ0EsMkJBQWMsVUFBZDs7Ozs7Ozs7QUFRQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsS0FBdkIsQ0FBNkIsTUFBcEMsRUFBNEMsSUFBNUMsQ0FBaUQsRUFBakQ7QUFDQSxvQkFBTyxZQUFZLFdBQVosQ0FBd0IsS0FBeEIsQ0FBOEIsTUFBckMsRUFBNkMsSUFBN0MsQ0FBa0QsQ0FBbEQ7QUFDQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsT0FBdkIsQ0FBK0IsTUFBdEMsRUFBOEMsSUFBOUMsQ0FBbUQsQ0FBbkQ7QUFDQSxvQkFBTyxZQUFZLFdBQVosQ0FBd0IsT0FBeEIsQ0FBZ0MsTUFBdkMsRUFBK0MsSUFBL0MsQ0FBb0QsQ0FBcEQ7QUFDQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsUUFBdkIsQ0FBZ0MsTUFBdkMsRUFBK0MsSUFBL0MsQ0FBb0QsQ0FBcEQ7QUFDQSxvQkFBTyxZQUFZLFdBQVosQ0FBd0IsUUFBeEIsQ0FBaUMsTUFBeEMsRUFBZ0QsSUFBaEQsQ0FBcUQsQ0FBckQ7QUFDSCxVQXpCRDtBQTBCQSxZQUFHLG9DQUFILEVBQXlDLFlBQU07QUFDM0MsaUJBQU0sYUFBYSxVQUFuQjtBQUNBLHdCQUFXLE9BQVgsQ0FBbUIsT0FBbkIsQ0FBMkIsVUFBQyxPQUFELEVBQVUsS0FBVixFQUFvQjtBQUMzQyx5QkFBUSxVQUFSLEdBQXFCLFFBQVEsQ0FBN0I7QUFDSCxjQUZEO0FBR0EsK0JBQWtCLE1BQWxCO0FBQ0EsaUJBQU0sY0FBYyxVQUFwQjs7OztBQUlBLG9CQUFPLFdBQVcsV0FBWCxDQUF1QixLQUF2QixDQUE2QixNQUFwQyxFQUE0QyxJQUE1QyxDQUFpRCxZQUFZLFdBQVosQ0FBd0IsS0FBeEIsQ0FBOEIsTUFBL0U7QUFDQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsT0FBdkIsQ0FBK0IsTUFBdEMsRUFBOEMsSUFBOUMsQ0FBbUQsWUFBWSxXQUFaLENBQXdCLE9BQXhCLENBQWdDLE1BQW5GO0FBQ0Esb0JBQU8sV0FBVyxXQUFYLENBQXVCLFFBQXZCLENBQWdDLE1BQXZDLEVBQStDLElBQS9DLENBQW9ELFlBQVksV0FBWixDQUF3QixRQUF4QixDQUFpQyxNQUFyRjtBQUNILFVBYkQ7QUFjQSxZQUFHLDhDQUFILEVBQW1ELFlBQU07QUFDckQsaUJBQU0sYUFBYSxVQUFuQjtBQUNBLGlCQUFNLFVBQVUsRUFBaEI7QUFDQSx3QkFBVyxPQUFYLENBQW1CLE9BQW5CLENBQTJCLFVBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDM0MseUJBQVEsVUFBUixHQUFxQixRQUFRLENBQTdCO0FBQ0EseUJBQVEsSUFBUixDQUFhLFFBQVEsU0FBUixDQUFrQixRQUFRLEtBQTFCLENBQWI7QUFDQSw0QkFBVyxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEtBQTFCLENBQWdDLE1BQWhDLENBQXVDLFNBQVMsYUFBVCxHQUF5QixhQUFoRSxFQUErRSxVQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLEtBQXJCLEVBQStCO0FBQzFHLDZCQUFRLEtBQVIsRUFBZSxRQUFmLEVBQXlCLFFBQXpCLEVBQW1DLEtBQW5DO0FBQ0gsa0JBRkQ7QUFHSCxjQU5EO0FBT0EsK0JBQWtCLE1BQWxCLEc7QUFDQSxpQkFBTSxjQUFjLFVBQXBCOztBQUVBLG9CQUFPLFdBQVcsV0FBWCxDQUF1QixLQUF2QixDQUE2QixNQUFwQyxFQUE0QyxJQUE1QyxDQUFpRCxZQUFZLFdBQVosQ0FBd0IsS0FBeEIsQ0FBOEIsTUFBL0U7QUFDQSxvQkFBTyxXQUFXLFdBQVgsQ0FBdUIsT0FBdkIsQ0FBK0IsTUFBdEMsRUFBOEMsSUFBOUMsQ0FBbUQsWUFBWSxXQUFaLENBQXdCLE9BQXhCLENBQWdDLE1BQW5GO0FBQ0Esb0JBQU8sV0FBVyxXQUFYLENBQXVCLFFBQXZCLENBQWdDLE1BQXZDLEVBQStDLElBQS9DLENBQW9ELFlBQVksV0FBWixDQUF3QixRQUF4QixDQUFpQyxNQUFyRjtBQUNBLHFCQUFRLE9BQVIsQ0FBZ0IsVUFBQyxHQUFELEVBQU0sS0FBTixFQUFnQjtBQUM1Qix3QkFBTyxHQUFQLEVBQVksb0JBQVosQ0FBaUMsUUFBUSxDQUF6QyxFQUE0QyxRQUFRLENBQXBELEVBQXVELFdBQVcsT0FBWCxDQUFtQixLQUFuQixFQUEwQixLQUFqRjtBQUNILGNBRkQ7QUFHSCxVQW5CRDtBQW9CSCxNQXZFRDtBQXdFSCxFQW5IRCxFOzs7Ozs7OztBQ0ZBOzs7Ozs7QUFDQSxVQUFTLFdBQVQsRUFBc0IsWUFBVztBQUM3QixTQUFJLHlCQUFKO0FBQ0EsZ0JBQVcsWUFBVztBQUNsQiw0QkFBbUIseUJBQVU7QUFDekIsMkJBQWMsZ0JBRFc7QUFFekIseUJBQVksTUFGYTtBQUd6QiwwQkFBYTtBQUhZLFVBQVYsQ0FBbkI7QUFLSCxNQU5EO0FBT0EsUUFBRyx3Q0FBSCxFQUE2QyxZQUFXO0FBQ3BELGdCQUFPLGdCQUFQLEVBQXlCLFdBQXpCO0FBQ0gsTUFGRDtBQUdBLFFBQUcsc0NBQUgsRUFBMkMsWUFBVztBQUNsRCxnQkFBTyxvQkFBVSxVQUFqQixFQUE2QixXQUE3QjtBQUNILE1BRkQ7QUFHQSxRQUFHLDhDQUFILEVBQW1ELFlBQVc7QUFDMUQsZ0JBQU8saUJBQWlCLFFBQWpCLENBQTBCLEdBQTFCLENBQThCLFFBQTlCLEVBQVAsRUFBaUQsSUFBakQsQ0FBc0QsYUFBdEQ7QUFDQSwwQkFBaUIsUUFBakI7QUFDQSxnQkFBTyxpQkFBaUIsUUFBeEIsRUFBa0MsZ0JBQWxDO0FBQ0gsTUFKRDtBQUtBLFFBQUcsOENBQUgsRUFBbUQsWUFBVztBQUMxRCxnQkFBTyxpQkFBaUIsUUFBakIsQ0FBMEIsR0FBMUIsQ0FBOEIsUUFBOUIsRUFBUCxFQUFpRCxJQUFqRCxDQUFzRCxhQUF0RDtBQUNBLGdCQUFPLGlCQUFpQixFQUFqQixDQUFvQixHQUFwQixDQUF3QixRQUF4QixFQUFQLEVBQTJDLElBQTNDLENBQWdELE9BQWhEO0FBQ0EsY0FBSyxJQUFJLEdBQVQsSUFBZ0IsaUJBQWlCLFFBQWpDLEVBQTJDO0FBQ3ZDLGlCQUFJLGlCQUFpQixRQUFqQixDQUEwQixjQUExQixDQUF5QyxHQUF6QyxDQUFKLEVBQW1EO0FBQy9DLHdCQUFPLGlCQUFpQixRQUFqQixDQUEwQixHQUExQixDQUFQLEVBQXVDLElBQXZDLENBQTRDLGlCQUFpQixNQUFqQixDQUF3QixRQUF4QixDQUFpQyxHQUFqQyxDQUE1QztBQUNIO0FBQ0o7QUFDRCxjQUFLLElBQUksSUFBVCxJQUFnQixpQkFBaUIsRUFBakMsRUFBcUM7QUFDakMsaUJBQUksaUJBQWlCLEVBQWpCLENBQW9CLGNBQXBCLENBQW1DLElBQW5DLENBQUosRUFBNkM7QUFDekMsd0JBQU8saUJBQWlCLEVBQWpCLENBQW9CLElBQXBCLENBQVAsRUFBaUMsSUFBakMsQ0FBc0MsaUJBQWlCLE1BQWpCLENBQXdCLEVBQXhCLENBQTJCLElBQTNCLENBQXRDO0FBQ0g7QUFDSjtBQUNELGdCQUFPLGlCQUFpQixFQUF4QixFQUE0QixJQUE1QixDQUFpQyxpQkFBaUIsTUFBakIsQ0FBd0IsRUFBekQ7QUFFSCxNQWZEO0FBZ0JILEVBcENEO0FBcUNBLFVBQVMsWUFBVCxFQUF1QixZQUFXO0FBQzlCLFNBQUkseUJBQUo7QUFBQSxTQUFzQixZQUF0QjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsZUFBTSxRQUFRLFNBQVIsQ0FBa0IsWUFBbEIsQ0FBTjtBQUNBLDRCQUFtQix5QkFBVTtBQUN6QiwyQkFBYyxpQkFEVztBQUV6Qix5QkFBWSxNQUZhO0FBR3pCLDBCQUFhLEVBSFk7QUFJekIseUJBQVk7QUFDUiw4QkFBYTtBQUNULHNDQUFpQjtBQURSLGtCQURMO0FBSVIsbUNBQWtCO0FBQ2Qsc0NBQWlCO0FBREgsa0JBSlY7QUFPUiwrQkFBYztBQVBOO0FBSmEsVUFBVixDQUFuQjtBQWNILE1BaEJEO0FBaUJBLFFBQUcsbUNBQUgsRUFBd0MsWUFBVztBQUMvQyxnQkFBTyxpQkFBaUIsT0FBeEIsRUFBaUMsT0FBakMsQ0FBeUMsUUFBUSxHQUFSLENBQVksUUFBWixDQUF6QztBQUNBLGFBQU0sVUFBVSxpQkFBaUIsT0FBakIsQ0FBeUIsa0NBQXpCLENBQWhCO0FBQUEsYUFDSSxhQUFhLFNBQWIsVUFBYSxHQUFXLENBQUUsQ0FEOUI7QUFBQSxhQUVJLGFBQWEsU0FBYixVQUFhLEdBQVcsQ0FBRSxDQUY5QjtBQUFBLGFBR0ksU0FBUztBQUNMLG1CQUFNLFVBREQ7QUFFTCxtQkFBTTtBQUZELFVBSGI7QUFPQSxpQkFBUSxNQUFSO0FBQ0EsZ0JBQU8sR0FBUCxFQUFZLG9CQUFaLENBQWlDLFVBQWpDLEVBQTZDLFVBQTdDO0FBQ0gsTUFYRDtBQWFILEVBaENELEU7Ozs7Ozs7Ozs7OztBQ3RDQTs7OztBQUNBOztBQUdBOzs7Ozs7QUFDQSxLQUFJLFNBQVUsVUFBUyxPQUFULEVBQWtCO0FBQzVCLFNBQUksSUFBSixFQUFVLFVBQVY7QUFDQSxTQUFJLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBUyxJQUFULEVBQWU7QUFDcEMsZ0JBQU87QUFDSCwrQkFBa0IsSUFEZjtBQUVILDBCQUFhLEVBRlY7QUFHSCwyQkFBYyxZQUhYO0FBSUgsd0JBQVcsQ0FBQztBQUpULFVBQVA7QUFNSCxNQVBEO0FBUUEsZUFBVSxXQUFWLEdBQXdCLGFBQWMsVUFBVSxXQUFWLElBQXlCLEtBQS9EO0FBQ0EsZUFBVSxVQUFWLEdBQXVCLDJCQUF2QjtBQUNBLGVBQVUsU0FBVixHQUFzQixLQUF0QjtBQUNBLFNBQUksa0JBQUo7O0FBRUEsY0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLElBQTVCLEVBQWtDO0FBQzlCLHFCQUFZLElBQVo7QUFDQSxnQkFBTyxzQkFBc0IsT0FBdEIsQ0FBUDtBQUNBLGdCQUFPLGNBQVA7QUFDSDs7QUFHRCxjQUFTLFlBQVQsR0FBd0I7QUFDcEIsYUFBSSxhQUFhLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUF3QixDQUFDLFFBQUQsQ0FBeEIsQ0FBakI7QUFBQSxhQUNJLFdBQVcsUUFBUSxRQUFSLENBQWlCLFdBQVcsTUFBWCxDQUFrQixDQUFDLEtBQUssVUFBTixDQUFsQixDQUFqQixDQURmO0FBQUEsYUFFSSxTQUFTLFFBQVEsTUFBUixDQUFlLEtBQUssVUFBcEIsQ0FGYjtBQUFBLGFBR0ksY0FBYyxPQUFPLFlBQVAsSUFBdUIsRUFIekM7QUFBQSxhQUlJLGVBQWUsZ0JBQWdCLEtBQUssWUFBckIsRUFBbUMsV0FBbkMsQ0FKbkI7QUFBQSxhQUtJLFFBQVEsRUFMWjtBQUFBLGFBTUksV0FBVyxFQU5mO0FBT0EsaUJBQVEsT0FBUixDQUFnQixjQUFjLEVBQTlCLEVBQWtDLFVBQVMsT0FBVCxFQUFrQjtBQUNoRCwyQkFBYyxZQUFZLE1BQVosQ0FBbUIsUUFBUSxNQUFSLENBQWUsT0FBZixFQUF3QixZQUEzQyxDQUFkO0FBQ0gsVUFGRDs7QUFJQSxhQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLHNCQUFTLE1BQVQsQ0FBZ0IsS0FBSyxNQUFyQjtBQUNIOztBQUVELGFBQUksWUFBSixFQUFrQjs7O0FBR2QscUJBQVEsT0FBUixDQUFnQixXQUFoQixFQUE2QixVQUFTLFlBQVQsRUFBdUI7QUFDaEQscUJBQUksbUJBQW1CLGFBQWEsQ0FBYixFQUFnQixDQUFoQixDQUF2QjtBQUNBLHFCQUFJLHFCQUFxQixLQUFLLFlBQTlCLEVBQTRDO0FBQ3hDLHlCQUFJLG1CQUFtQixhQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBdkI7O0FBRUEseUJBQUksUUFBUSxVQUFSLENBQW1CLGdCQUFuQixDQUFKLEVBQTBDO0FBQ3RDLDRDQUFtQixpQkFBaUIsT0FBakIsSUFBNEIsU0FBUyxRQUFULENBQWtCLGdCQUFsQixDQUEvQztBQUNIOztBQUVELDBCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksaUJBQWlCLE1BQXJDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQzlDLDZCQUFJLENBQUMsUUFBUSxVQUFSLENBQW1CLGlCQUFpQixDQUFqQixDQUFuQixDQUFMLEVBQThDO0FBQzFDLGlDQUFJLFVBQVUsaUJBQWlCLENBQWpCLENBQWQ7QUFDQSxtQ0FBTSxPQUFOLElBQWlCLG1CQUFtQixPQUFuQixFQUE0QixnQkFBNUIsRUFBOEMsQ0FBOUMsQ0FBakI7QUFDSDtBQUNKO0FBQ0o7QUFDSixjQWhCRDs7QUFrQkEsaUJBQUksaUJBQWlCLFdBQXJCLEVBQWtDO0FBQzlCO0FBQ0gsY0FGRCxNQUVPO0FBQ0g7QUFDSDtBQUNKOztBQUVELGlCQUFRLE9BQVIsQ0FBZ0IsV0FBaEIsRUFBNkIsVUFBUyxZQUFULEVBQXVCOzs7QUFHaEQsOEJBQWlCLFlBQWpCLEVBQStCLFFBQS9CO0FBQ0gsVUFKRDs7QUFNQSxnQkFBTyxRQUFQOztBQUdBLGtCQUFTLGdCQUFULEdBQTRCO0FBQ3hCLHdCQUFXLGNBQVg7QUFDQSxpQkFBSSxLQUFLLG9CQUFULEVBQStCO0FBQzNCLHNDQUFxQixRQUFyQjtBQUNIO0FBQ0Qsc0JBQVMsTUFBVCxHQUFrQixLQUFsQjtBQUNBLHNCQUFTLFdBQVQsR0FBdUIsZ0JBQXZCO0FBQ0g7O0FBRUQsa0JBQVMsWUFBVCxHQUF3QjtBQUNwQixxQkFBUSxZQUFSO0FBQ0ksc0JBQUssWUFBTDtBQUNJLHlCQUFNLFdBQVcsNEJBQ1osS0FEWSxDQUNOLFNBRE0sRUFFWixVQUZZLENBRUQsV0FBVyxNQUFYLENBQWtCLEtBQUssVUFBdkIsQ0FGQyxFQUdaLFFBSFksQ0FHSCxLQUFLLFVBQUwsQ0FBZ0IsZ0JBSGIsRUFJWixRQUpZLENBSUgsS0FBSyxVQUFMLENBQWdCLFdBSmIsRUFLWixTQUxZLENBS0YsS0FMRSxFQU1aLEdBTlksQ0FNUixLQUFLLFlBTkcsRUFNVyxLQUFLLFVBQUwsQ0FBZ0IsWUFOM0IsQ0FBakI7QUFPQSw4QkFBUyxNQUFUO0FBQ0EsMEJBQUssSUFBSSxHQUFULElBQWdCLEtBQWhCLEVBQXVCO0FBQ25CLDZCQUFJLE1BQU0sY0FBTixDQUFxQixHQUFyQixLQUE2QixTQUFTLGtCQUFULENBQTRCLEdBQTVCLENBQWpDLEVBQW1FO0FBQy9ELG1DQUFNLEdBQU4sSUFBYSxTQUFTLGtCQUFULENBQTRCLEdBQTVCLENBQWI7QUFDSDtBQUNKO0FBQ0QseUJBQUksS0FBSyxVQUFMLENBQWdCLFNBQXBCLEVBQStCO0FBQzNCLGdDQUFPLFNBQVMsa0JBQWhCO0FBQ0g7QUFDRCw0QkFBTyxRQUFQO0FBQ0osc0JBQUssUUFBTDtBQUNJLHlCQUFJLFVBQVUsU0FBUyxHQUFULENBQWEsU0FBYixDQUFkO0FBQ0EsNEJBQU8sUUFBUSxLQUFLLFlBQWIsQ0FBUDtBQUNKLHNCQUFLLFdBQUw7QUFDSSw0QkFBTztBQUNILG1DQUFVLFNBQVMsR0FBVCxDQUFhLFVBQWIsQ0FEUDtBQUVILHNDQUFhLFNBQVMsYUFBVCxHQUF5QjtBQUNsQyxxQ0FBUSxJQUFSLENBQWEsTUFBYixDQUFvQixlQUFwQjtBQUNIO0FBSkUsc0JBQVA7QUFNSjtBQUNJLDRCQUFPLFNBQVMsR0FBVCxDQUFhLEtBQUssWUFBbEIsQ0FBUDtBQTlCUjtBQWdDSDs7QUFFRCxrQkFBUyxjQUFULEdBQTBCO0FBQ3RCLGlCQUFJLFdBQVcsU0FBUyxHQUFULENBQWEsVUFBYixDQUFmO0FBQ0Esc0JBQVMsTUFBVCxHQUFrQixTQUFTLEdBQVQsQ0FBYSxZQUFiLEVBQTJCLElBQTNCLEVBQWxCO0FBQ0Esc0JBQVMsTUFBVCxHQUFrQixLQUFsQjs7QUFFQSxzQkFBUyxRQUFULEdBQW9CLFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDaEQsd0JBQU8sUUFBUSxLQUFLLElBQXBCO0FBQ0EscUJBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCwyQkFBTSxJQUFJLEtBQUosQ0FBVSxnQ0FBZ0MsS0FBSyxZQUFyQyxHQUFvRCw4Q0FBOUQsQ0FBTjtBQUNIO0FBQ0QscUJBQUksUUFBUSxRQUFSLENBQWlCLElBQWpCLENBQUosRUFBNEI7QUFDeEIsNEJBQU8sMEJBQTBCLElBQTFCLENBQVA7QUFDSDtBQUNELDBCQUFTLFFBQVQsR0FBb0IsUUFBUSxPQUFSLENBQWdCLElBQWhCLENBQXBCO0FBQ0EsNENBQTJCLEtBQUssWUFBaEMsRUFBOEMsV0FBOUM7QUFDQSwwQkFBUyxTQUFTLFFBQWxCLEVBQTRCLFNBQVMsTUFBckM7QUFDQSw0Q0FBMkIsS0FBSyxZQUFoQyxFQUE4QyxXQUE5QyxFQUEyRCxJQUEzRDtBQUNBLDBCQUFTLFNBQVQsR0FBcUIsU0FBUyxRQUFULENBQWtCLFlBQWxCLEVBQXJCO0FBQ0EsMEJBQVMsTUFBVCxDQUFnQixPQUFoQjtBQUNILGNBZEQ7QUFlSDs7QUFFRCxrQkFBUyxrQkFBVCxDQUE0QixPQUE1QixFQUFxQyxnQkFBckMsRUFBdUQsQ0FBdkQsRUFBMEQ7QUFDdEQsaUJBQUksVUFBVSxnQkFBZ0IsT0FBaEIsRUFBeUIsV0FBekIsQ0FBZDtBQUFBLGlCQUNJLGtCQUFrQixPQUR0QjtBQUVBLGlCQUFJLEtBQUssS0FBTCxDQUFXLGVBQVgsS0FBK0IsS0FBSyxLQUFMLENBQVcsZUFBWCxNQUFnQyxVQUFVLFVBQTdFLEVBQXlGO0FBQ3JGLHdCQUFPLEtBQUssS0FBTCxDQUFXLGVBQVgsQ0FBUDtBQUNILGNBRkQsTUFFTyxJQUFJLEtBQUssS0FBTCxDQUFXLGVBQVgsS0FBK0IsS0FBSyxLQUFMLENBQVcsZUFBWCxNQUFnQyxVQUFVLFVBQTdFLEVBQXlGO0FBQzVGLDhCQUFhLGdEQUFnRCxPQUFoRCxHQUEwRCxJQUExRCxHQUFpRSxPQUFqRSxHQUEyRSxrQkFBeEY7QUFDSCxjQUZNLE1BRUEsSUFBSSxZQUFZLE9BQVosSUFBdUIsWUFBWSxVQUF2QyxFQUFtRDtBQUN0RCxxQkFBSSxTQUFTLEdBQVQsQ0FBYSxhQUFhLE9BQTFCLENBQUosRUFBd0M7QUFDcEMsdUNBQWtCLGFBQWEsT0FBL0I7QUFDQSxzQ0FBaUIsQ0FBakIsSUFBc0IsZUFBdEI7QUFDSCxrQkFIRCxNQUdPO0FBQ0gsa0NBQWEsZ0RBQWdELE9BQWhELEdBQTBELElBQTFELEdBQWlFLE9BQWpFLEdBQTJFLGtCQUF4RjtBQUNIO0FBQ0osY0FQTSxNQU9BLElBQUksUUFBUSxPQUFSLENBQWdCLFVBQWhCLE1BQWdDLENBQXBDLEVBQXVDO0FBQzFDLG1DQUFrQixhQUFhLE9BQS9CO0FBQ0Esa0NBQWlCLENBQWpCLElBQXNCLGVBQXRCO0FBQ0g7QUFDRCxpQkFBSSxDQUFDLFNBQVMsR0FBVCxDQUFhLGVBQWIsQ0FBTCxFQUFvQztBQUNoQyxxQkFBSSxLQUFLLHFCQUFULEVBQWdDO0FBQzVCLGtDQUFhLGdEQUFnRCxPQUFoRCxHQUEwRCxJQUExRCxHQUFpRSxPQUFqRSxHQUEyRSxrQkFBeEY7QUFDQSx1Q0FBa0IsZ0JBQWdCLE9BQWhCLENBQXdCLFVBQXhCLEVBQW9DLEVBQXBDLENBQWxCO0FBQ0gsa0JBSEQsTUFHTztBQUNILDJCQUFNLElBQUksS0FBSixDQUFVLHdDQUF3QyxPQUF4QyxHQUFrRCxxREFBbEQsR0FBMEcsT0FBMUcsR0FBb0gsV0FBcEgsR0FBa0ksZUFBbEksR0FBb0osNkRBQTlKLENBQU47QUFDSDtBQUNKO0FBQ0Qsb0JBQU8sU0FBUyxHQUFULENBQWEsZUFBYixDQUFQO0FBQ0g7QUFDSjs7QUFFRCxjQUFTLGdCQUFULENBQTBCLFlBQTFCLEVBQXdDLFFBQXhDLEVBQWtEO0FBQzlDLGFBQUksUUFBUSxRQUFSLENBQWlCLGFBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFqQixLQUF3QyxhQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsT0FBbkIsQ0FBMkIsVUFBM0IsTUFBMkMsQ0FBQyxDQUF4RixFQUEyRjtBQUN2RixpQkFBSSxRQUFRLFVBQVIsQ0FBbUIsYUFBYSxDQUFiLEVBQWdCLENBQWhCLENBQW5CLENBQUosRUFBNEM7OztBQUd4QyxxQkFBSSx3QkFBd0IsU0FBUyxRQUFULENBQWtCLGFBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFsQixDQUE1QjtBQUNBLHdCQUFPLGFBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixPQUExQjtBQUNBLHVDQUFzQixJQUF0QixDQUEyQixhQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBM0I7QUFDQSw4QkFBYSxDQUFiLEVBQWdCLENBQWhCLElBQXFCLHFCQUFyQjtBQUNIO0FBQ0QsaUJBQUksbUJBQW1CLGFBQWEsQ0FBYixFQUFnQixDQUFoQixDQUF2QjtBQUNBLGlCQUFJLFFBQVEsT0FBUixDQUFnQixnQkFBaEIsQ0FBSixFQUF1QztBQUNuQyxzQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGlCQUFpQixNQUFqQixHQUEwQixDQUE5QyxFQUFpRCxHQUFqRCxFQUFzRDtBQUNsRCx5QkFBSSxpQkFBaUIsQ0FBakIsRUFBb0IsT0FBcEIsQ0FBNEIsVUFBNUIsTUFBNEMsQ0FBaEQsRUFBbUQ7QUFDL0MsMENBQWlCLENBQWpCLElBQXNCLGlCQUFpQixDQUFqQixFQUFvQixPQUFwQixDQUE0QixVQUE1QixFQUF3QyxFQUF4QyxDQUF0QjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsY0FBUyxxQkFBVCxDQUErQixPQUEvQixFQUF3QztBQUNwQyxhQUFJLENBQUMsT0FBTyxPQUFaLEVBQXFCO0FBQ2pCLG1CQUFNLElBQUksS0FBSixDQUFVLGlIQUFWLENBQU47QUFDSDtBQUNELGFBQUksQ0FBQyxRQUFRLFlBQVQsSUFBeUIsQ0FBQyxRQUFRLFlBQWxDLElBQWtELENBQUMsUUFBUSxTQUEvRCxFQUEwRTtBQUN0RSxtQkFBTSxJQUFJLEtBQUosQ0FBVSxnSkFBVixDQUFOO0FBQ0g7QUFDRCxhQUFJLENBQUMsUUFBUSxVQUFiLEVBQXlCO0FBQ3JCLG1CQUFNLElBQUksS0FBSixDQUFVLDJIQUFWLENBQU47QUFDSDtBQUNELGlCQUFRLFdBQVIsR0FBc0IsUUFBUSxXQUFSLElBQXVCLEVBQTdDO0FBQ0EsaUJBQVEsS0FBUixHQUFnQixRQUFRLEtBQVIsSUFBaUIsRUFBakM7QUFDQSxpQkFBUSxVQUFSLEdBQXFCLG9CQUFPLFFBQVEsVUFBZixFQUEyQixtQkFBbUIsUUFBUSxTQUFSLENBQWtCLFFBQVEsVUFBMUIsQ0FBbkIsQ0FBM0IsQ0FBckI7QUFDQSxnQkFBTyxPQUFQO0FBQ0g7O0FBRUQsY0FBUyxvQkFBVCxDQUE4QixRQUE5QixFQUF3QztBQUNwQyxpQkFBUSxPQUFSLENBQWdCLFFBQWhCLEVBQTBCLFVBQVMsUUFBVCxFQUFtQixZQUFuQixFQUFpQztBQUN2RCxpQkFBSSxRQUFRLFVBQVIsQ0FBbUIsUUFBbkIsQ0FBSixFQUFrQztBQUM5QixxQkFBSSxPQUFPLE9BQVAsSUFBa0IsT0FBTyxLQUF6QixJQUFrQyxDQUFDLFNBQVMsS0FBaEQsRUFBdUQ7QUFDbkQseUJBQUksTUFBTSxNQUFNLFFBQU4sRUFBZ0IsWUFBaEIsQ0FBVjtBQUNBLHlCQUFJLElBQUksY0FBUixFQUF3QjtBQUNwQiw2QkFBSSxjQUFKO0FBQ0gsc0JBRkQsTUFFTztBQUNILDZCQUFJLEdBQUosQ0FBUSxXQUFSO0FBQ0g7QUFDSixrQkFQRCxNQU9PLElBQUksT0FBTyxLQUFQLElBQWdCLE9BQU8sS0FBUCxDQUFhLEdBQWpDLEVBQXNDO0FBQ3pDLDRCQUFPLEtBQVAsQ0FBYSxHQUFiLENBQWlCLFFBQWpCLEVBQTJCLFlBQTNCO0FBQ0g7QUFDSjtBQUNKLFVBYkQ7QUFjSDs7QUFFRCxjQUFTLGVBQVQsQ0FBeUIsWUFBekIsRUFBdUMsV0FBdkMsRUFBb0Q7QUFDaEQsY0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFlBQVksTUFBaEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDekMsaUJBQUksZUFBZSxZQUFZLENBQVosQ0FBbkI7QUFDQSxpQkFBSSxhQUFhLENBQWIsRUFBZ0IsQ0FBaEIsTUFBdUIsWUFBM0IsRUFBeUM7QUFDckMseUJBQVEsYUFBYSxDQUFiLENBQVI7QUFDSSwwQkFBSyxVQUFMO0FBQ0ksZ0NBQU8sYUFBYSxDQUFiLENBQVA7QUFDSiwwQkFBSyxxQkFBTDtBQUNJLGdDQUFPLFlBQVA7QUFDSiwwQkFBSyxrQkFBTDtBQUNJLGdDQUFPLFdBQVA7QUFDSiwwQkFBSyxpQkFBTDtBQUNJLGdDQUFPLFFBQVA7QUFDSiwwQkFBSyxrQkFBTDtBQUNJLGdDQUFPLFdBQVA7QUFWUjtBQVlIO0FBQ0o7QUFDRCxnQkFBTyxJQUFQO0FBQ0g7O0FBRUQsY0FBUywwQkFBVCxDQUFvQyxZQUFwQyxFQUFrRCxXQUFsRCxFQUErRCxRQUEvRCxFQUF5RTtBQUNyRSxpQkFBUSxPQUFSLENBQWdCLFdBQWhCLEVBQTZCLFVBQVMsWUFBVCxFQUF1QjtBQUNoRCxpQkFBSSxhQUFhLENBQWIsRUFBZ0IsQ0FBaEIsTUFBdUIsWUFBdkIsSUFBdUMsYUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLE9BQW5CLENBQTJCLFVBQTNCLE1BQTJDLENBQUMsQ0FBdkYsRUFBMEY7QUFDdEYscUJBQUksbUJBQW1CLGFBQWEsQ0FBYixFQUFnQixDQUFoQixDQUF2QjtBQUNBLHFCQUFJLFFBQVEsT0FBUixDQUFnQixnQkFBaEIsQ0FBSixFQUF1QztBQUNuQywwQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGlCQUFpQixNQUFqQixHQUEwQixDQUE5QyxFQUFpRCxHQUFqRCxFQUFzRDtBQUNsRCw2QkFBSSxRQUFKLEVBQWM7QUFDViw4Q0FBaUIsQ0FBakIsSUFBc0IsaUJBQWlCLENBQWpCLEVBQW9CLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDLEVBQXhDLENBQXRCO0FBQ0gsMEJBRkQsTUFFTyxJQUFJLGlCQUFpQixDQUFqQixFQUFvQixPQUFwQixDQUE0QixVQUE1QixNQUE0QyxDQUFoRCxFQUFtRDtBQUN0RCw4Q0FBaUIsQ0FBakIsSUFBc0IsYUFBYSxpQkFBaUIsQ0FBakIsQ0FBbkM7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKLFVBYkQ7QUFjSDs7QUFFRCxjQUFTLHlCQUFULENBQW1DLElBQW5DLEVBQXlDO0FBQ3JDLGFBQUksQ0FBQyxLQUFLLElBQVYsRUFBZ0I7QUFDWixtQkFBTSxJQUFJLEtBQUosQ0FBVSxnQ0FBZ0MsS0FBSyxZQUFyQyxHQUFvRCwwREFBOUQsQ0FBTjtBQUNIO0FBQ0QsYUFBSSxZQUFZLElBQWhCO0FBQUEsYUFDSSxVQUFVLFVBQVUsSUFEeEI7QUFBQSxhQUVJLGNBQWMsVUFBVSxRQUY1QjtBQUdBLGdCQUFPLE1BQU0sT0FBTixHQUFnQixHQUF2QjtBQUNBLGlCQUFRLE9BQVIsQ0FBZ0IsU0FBaEIsRUFBMkIsVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFvQjtBQUMzQyxpQkFBSSxTQUFTLFVBQVQsSUFBdUIsU0FBUyxNQUFwQyxFQUE0QztBQUN4Qyx5QkFBUSxXQUFXLElBQVgsS0FBb0IsTUFBTyxPQUFPLEdBQVAsR0FBYSxJQUFwQixHQUE0QixHQUFoRCxDQUFSO0FBQ0g7QUFDSixVQUpEO0FBS0EsaUJBQVEsY0FBZSxNQUFNLFdBQXJCLEdBQW9DLEdBQTVDO0FBQ0EsaUJBQVEsT0FBTyxPQUFQLEdBQWlCLEdBQXpCO0FBQ0EsZ0JBQU8sSUFBUDtBQUNIOztBQUVELGNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUN2QixhQUFJLENBQUMsVUFBVSxTQUFmLEVBQTBCO0FBQ3RCLHFCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0g7QUFDSjs7QUFFRCxTQUFJLG9CQUFvQixRQUF4Qjs7QUFFQSxjQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUM7QUFDakMscUJBQVksYUFBYSxHQUF6QjtBQUNBLGdCQUFPLEtBQUssT0FBTCxDQUFhLGlCQUFiLEVBQWdDLFVBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQjtBQUN6RCxvQkFBTyxDQUFDLE1BQU0sU0FBTixHQUFrQixFQUFuQixJQUF5QixPQUFPLFdBQVAsRUFBaEM7QUFDSCxVQUZNLENBQVA7QUFHSDs7QUFFRCxZQUFPLFNBQVA7QUFFSCxFQTFTWSxDQTBTVixPQTFTVSxDQUFiO0FBMlNBLG9DQUFPLE1BQVA7bUJBQ2UsTTs7Ozs7Ozs7Ozs7O0FDaFRmLFVBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUN4QixNQUFDLFVBQVMsU0FBVCxFQUFvQjtBQUNqQixhQUFJLGdCQUFnQixFQUFwQjtBQUFBLGFBQ0ksaUJBQWlCLFFBQVEsTUFEN0I7QUFFQSxtQkFBVSxlQUFWLEdBQTRCLFFBQVEsTUFBcEM7QUFDQSxpQkFBUSxNQUFSLEdBQWlCLHFCQUFqQjs7QUFFQSxtQkFBVSxVQUFWLEdBQXVCO0FBQ25CLDRCQUFlO0FBREksVUFBdkI7O0FBSUEsa0JBQVMsMkJBQVQsQ0FBcUMsTUFBckMsRUFBNkM7QUFDekMsaUJBQUksVUFBVSxvQkFBb0IsTUFBcEIsQ0FBZDtBQUNBLHFCQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUIsVUFBUyxNQUFULEVBQWlCLFVBQWpCLEVBQTZCO0FBQ2xELHdCQUFPLFVBQVAsSUFBcUIsTUFBckI7QUFDSCxjQUZEO0FBR0Esb0JBQU8sTUFBUDtBQUNIOztBQUVELGtCQUFTLHFCQUFULENBQStCLElBQS9CLEVBQXFDLFFBQXJDLEVBQStDLFFBQS9DLEVBQXlEO0FBQ3JELGlCQUFJLFNBQVMsZUFBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLFFBQS9CLENBQWI7QUFDQSxvQkFBTyw0QkFBNEIsTUFBNUIsQ0FBUDtBQUNIOztBQUVELGtCQUFTLG1CQUFULENBQTZCLE1BQTdCLEVBQXFDOztBQUVqQyxzQkFBUyxTQUFULENBQW1CLFlBQW5CLEVBQWlDLFFBQWpDLEVBQTJDLFlBQTNDLEVBQXlEO0FBQ3JELCtCQUFjLFlBQWQsSUFBOEIsSUFBOUI7QUFDQSxxQkFBSSxZQUFZLE9BQU8sWUFBUCxFQUFxQixVQUFVLFdBQVYsR0FBd0IsWUFBN0MsRUFBMkQsUUFBM0QsQ0FBaEI7QUFDQSx3QkFBTyw0QkFBNEIsU0FBNUIsQ0FBUDtBQUNIOztBQUVELG9CQUFPO0FBQ0gsOEJBQWEsU0FBUyxXQUFULENBQXFCLFlBQXJCLEVBQW1DLFFBQW5DLEVBQTZDO0FBQ3RELDRCQUFPLFVBQVUsWUFBVixFQUF3QixRQUF4QixFQUFrQyxTQUFsQyxFQUE2QyxNQUE3QyxDQUFQO0FBQ0gsa0JBSEU7QUFJSCw4QkFBYSxTQUFTLFdBQVQsQ0FBcUIsWUFBckIsRUFBbUMsUUFBbkMsRUFBNkM7QUFDdEQsNEJBQU8sVUFBVSxZQUFWLEVBQXdCLFFBQXhCLEVBQWtDLFNBQWxDLEVBQTZDLE1BQTdDLENBQVA7QUFDSCxrQkFORTs7QUFRSCw2QkFBWSxTQUFTLFVBQVQsQ0FBb0IsWUFBcEIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDcEQsNEJBQU8sVUFBVSxZQUFWLEVBQXdCLFFBQXhCLEVBQWtDLFFBQWxDLEVBQTRDLE1BQTVDLENBQVA7QUFDSCxrQkFWRTs7QUFZSCxpQ0FBZ0IsU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLFFBQXRDLEVBQWdEO0FBQzVELDRCQUFPLFVBQVUsWUFBVixFQUF3QixRQUF4QixFQUFrQyxZQUFsQyxFQUFnRCxNQUFoRCxDQUFQO0FBQ0gsa0JBZEU7O0FBZ0JILCtCQUFjLFNBQVMsWUFBVCxDQUFzQixZQUF0QixFQUFvQyxRQUFwQyxFQUE4QztBQUN4RCw0QkFBTyxVQUFVLFlBQVYsRUFBd0IsUUFBeEIsRUFBa0MsVUFBbEMsRUFBOEMsTUFBOUMsQ0FBUDtBQUNILGtCQWxCRTs7QUFvQkgsNEJBQVcsU0FBUyxTQUFULENBQW1CLFlBQW5CLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ2xELDRCQUFPLFVBQVUsWUFBVixFQUF3QixRQUF4QixFQUFrQyxPQUFsQyxFQUEyQyxNQUEzQyxDQUFQO0FBQ0gsa0JBdEJFOztBQXdCSCwrQkFBYyxTQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0MsUUFBcEMsRUFBOEM7QUFDeEQsNEJBQU8sVUFBVSxZQUFWLEVBQXdCLFFBQXhCLEVBQWtDLFVBQWxDLEVBQThDLE1BQTlDLENBQVA7QUFDSCxrQkExQkU7O0FBNEJILGdDQUFlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxRQUFyQyxFQUErQztBQUMxRCw0QkFBTyxVQUFVLFlBQVYsRUFBd0IsUUFBeEIsRUFBa0MsV0FBbEMsRUFBK0MsTUFBL0MsQ0FBUDtBQUNIO0FBOUJFLGNBQVA7QUFnQ0g7QUFFSixNQWpFRCxFQWlFRyxNQWpFSDtBQWtFSDttQkFDYyxVOzs7Ozs7Ozs7OzttQkNwRVMsTTs7QUFEeEI7Ozs7OztBQUNlLFVBQVMsTUFBVCxHQUFrQjtBQUM3QixpQ0FBa0IsU0FBbEIsQ0FDSSxRQUFRLE1BQVIsQ0FBZSxNQUFmLEVBQXVCLENBQUMsSUFBRCxFQUFPLHdCQUFQLENBQXZCLEVBQ0MsVUFERCxDQUNZLGlCQURaLEVBQytCLENBQUMsWUFBVztBQUN2QyxjQUFLLElBQUwsR0FBWSxpQkFBWjtBQUNILE1BRjhCLENBRC9CLEVBSUMsVUFKRCxDQUlZLGdCQUpaLEVBSThCLENBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsVUFBUyxFQUFULEVBQWEsQ0FBYixFQUFnQjtBQUM3RCxjQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0EsY0FBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0gsTUFINkIsQ0FKOUIsRUFRQyxVQVJELENBUVksY0FSWixFQVE0QixDQUFDLFlBQVc7QUFDcEMsY0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxHQUFxQixXQUExQztBQUNILE1BRjJCLENBUjVCLEVBV0MsTUFYRCxDQVdRLENBQUMsb0JBQUQsRUFBdUIsVUFBUyxrQkFBVCxFQUE2QjtBQUN4RCw0QkFBbUIsWUFBbkIsQ0FBZ0MsSUFBaEMsRUFBc0M7QUFDbEMsb0JBQU8sT0FEMkI7QUFFbEMsa0JBQUssc0JBRjZCO0FBR2xDLDZCQUFnQixTQUhrQjtBQUlsQyw2QkFBZ0I7QUFKa0IsVUFBdEM7QUFNQSw0QkFBbUIsWUFBbkIsQ0FBZ0MsSUFBaEMsRUFBc0M7QUFDbEMsb0JBQU8sT0FEMkI7QUFFbEMsa0JBQUsseUJBRjZCO0FBR2xDLDZCQUFnQixVQUhrQjtBQUlsQyw2QkFBZ0I7QUFKa0IsVUFBdEM7QUFNQSw0QkFBbUIsaUJBQW5CLENBQXFDLElBQXJDO0FBQ0EsNEJBQW1CLEdBQW5CLENBQXVCLElBQXZCO0FBQ0gsTUFmTyxDQVhSLEVBMkJDLFdBM0JELENBMkJhLElBM0JiLEVBMkJtQixDQUFDLFlBQVc7QUFDM0IsZ0JBQU8sUUFBUSxTQUFSLENBQWtCLE9BQWxCLENBQVA7QUFDSCxNQUZrQixDQTNCbkIsRUE4QkMsV0E5QkQsQ0E4QmEsVUE5QmIsRUE4QnlCLENBQUMsVUFBRCxFQUFhLFlBQVc7QUFDN0MsZ0JBQU8sUUFBUSxTQUFSLENBQWtCLGFBQWxCLENBQVA7QUFDSCxNQUZ3QixDQTlCekIsRUFnQ0ksSUFqQ1I7QUFvQ0gsRSIsImZpbGUiOiIuL3Rlc3QvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGE3ODA5YTBiZDZjYWFmNDEwMmU1XG4gKiovIiwicmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcycpO1xyXG5yZXF1aXJlKCcuL3F1aWNrbW9jay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vLi4vYXBwL2NvbXBsZXRlTGlzdC5qcycpLmRlZmF1bHQoKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvaW5kZXgubG9hZGVyLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmdldEJsb2NrTm9kZXMgPSBnZXRCbG9ja05vZGVzO1xuZXhwb3J0cy5oYXNoS2V5ID0gaGFzaEtleTtcbmV4cG9ydHMuY3JlYXRlTWFwID0gY3JlYXRlTWFwO1xuZXhwb3J0cy5zaGFsbG93Q29weSA9IHNoYWxsb3dDb3B5O1xuZXhwb3J0cy5pc0FycmF5TGlrZSA9IGlzQXJyYXlMaWtlO1xuZXhwb3J0cy50cmltID0gdHJpbTtcbmV4cG9ydHMuaXNFeHByZXNzaW9uID0gaXNFeHByZXNzaW9uO1xuZXhwb3J0cy5leHByZXNzaW9uU2FuaXRpemVyID0gZXhwcmVzc2lvblNhbml0aXplcjtcbmV4cG9ydHMuYXNzZXJ0Tm90RGVmaW5lZCA9IGFzc2VydE5vdERlZmluZWQ7XG5leHBvcnRzLmFzc2VydF8kX0NPTlRST0xMRVIgPSBhc3NlcnRfJF9DT05UUk9MTEVSO1xuZXhwb3J0cy5jbGVhbiA9IGNsZWFuO1xuZXhwb3J0cy5jcmVhdGVTcHkgPSBjcmVhdGVTcHk7XG5leHBvcnRzLm1ha2VBcnJheSA9IG1ha2VBcnJheTtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5nZXRGdW5jdGlvbk5hbWUgPSBnZXRGdW5jdGlvbk5hbWU7XG5leHBvcnRzLnNhbml0aXplTW9kdWxlcyA9IHNhbml0aXplTW9kdWxlcztcbmV4cG9ydHMudG9DYW1lbENhc2UgPSB0b0NhbWVsQ2FzZTtcbmV4cG9ydHMudG9TbmFrZUNhc2UgPSB0b1NuYWtlQ2FzZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSBleHBvcnRzLlBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xudmFyIEVYUFJFU1NJT05fUkVHRVggPSBleHBvcnRzLkVYUFJFU1NJT05fUkVHRVggPSAvXnt7Lip9fSQvO1xuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xuZnVuY3Rpb24gZ2V0QmxvY2tOb2Rlcyhub2Rlcykge1xuICAgIC8vIFRPRE8ocGVyZik6IHVwZGF0ZSBgbm9kZXNgIGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0P1xuICAgIHZhciBub2RlID0gbm9kZXNbMF07XG4gICAgdmFyIGVuZE5vZGUgPSBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXTtcbiAgICB2YXIgYmxvY2tOb2RlcztcblxuICAgIGZvciAodmFyIGkgPSAxOyBub2RlICE9PSBlbmROb2RlICYmIChub2RlID0gbm9kZS5uZXh0U2libGluZyk7IGkrKykge1xuICAgICAgICBpZiAoYmxvY2tOb2RlcyB8fCBub2Rlc1tpXSAhPT0gbm9kZSkge1xuICAgICAgICAgICAgaWYgKCFibG9ja05vZGVzKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tOb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChzbGljZS5jYWxsKG5vZGVzLCAwLCBpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9ja05vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2tOb2RlcyB8fCBub2Rlcztcbn1cblxudmFyIHVpZCA9IDA7XG52YXIgbmV4dFVpZCA9IGZ1bmN0aW9uIG5leHRVaWQoKSB7XG4gICAgcmV0dXJuICsrdWlkO1xufTtcblxuZnVuY3Rpb24gaGFzaEtleShvYmosIG5leHRVaWRGbikge1xuICAgIHZhciBrZXkgPSBvYmogJiYgb2JqLiQkaGFzaEtleTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgdmFyIG9ialR5cGUgPSB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopO1xuICAgIGlmIChvYmpUeXBlID09PSAnZnVuY3Rpb24nIHx8IG9ialR5cGUgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5ID0gb2JqVHlwZSArICc6JyArIChuZXh0VWlkRm4gfHwgbmV4dFVpZCkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgPSBvYmpUeXBlICsgJzonICsgb2JqO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KHNyYywgZHN0KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNBcnJheShzcmMpKSB7XG4gICAgICAgIGRzdCA9IGRzdCB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzcmMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZHN0W2ldID0gc3JjW2ldO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNyYykpIHtcbiAgICAgICAgZHN0ID0gZHN0IHx8IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGlmICghKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XG4gICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkc3QgfHwgc3JjO1xufVxuZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8ICEhaXRlbSAmJiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGl0ZW0pKSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBpdGVtLmxlbmd0aCA+PSAwIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIHRyaW0odmFsdWUpIHtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGlzRXhwcmVzc2lvbih2YWx1ZSkge1xuICAgIHJldHVybiBFWFBSRVNTSU9OX1JFR0VYLnRlc3QodHJpbSh2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBleHByZXNzaW9uU2FuaXRpemVyKGV4cHJlc3Npb24pIHtcbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgcmV0dXJuIGV4cHJlc3Npb24uc3Vic3RyaW5nKDIsIGV4cHJlc3Npb24ubGVuZ3RoIC0gMik7XG59XG5cbmZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XG5cbiAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFsncGFyZW50U2NvcGUnLCAnYmluZGluZ3MnLCAnY29udHJvbGxlclNjb3BlJ10pO1xufVxuXG5mdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcbiAgICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgfVxuICAgIHZhciBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgZW5kVGltZSA9IHZvaWQgMDtcbiAgICB2YXIgdG9SZXR1cm4gPSBzcHlPbih7XG4gICAgICAgIGE6IGZ1bmN0aW9uIGEoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgX2FyZ3VtZW50cyk7XG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgIHRvUmV0dXJuLnRvb2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIH07XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufVxuXG5mdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gbWFrZUFycmF5KGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBbaXRlbV07XG59XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgcmVtb3ZlJCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XG4gICAgdmFyIGN1cnJlbnQgPSB2b2lkIDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPSB2YWx1ZXMuc2hpZnQoKSkge1xuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxudmFyIHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcblxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xuICAgIGlmIChzY29wZS4kcm9vdCkge1xuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbnZhciBzY29wZUhlbHBlciA9IGV4cG9ydHMuc2NvcGVIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gc2NvcGVIZWxwZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBzY29wZUhlbHBlcik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKHNjb3BlSGVscGVyLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICdkZWNvcmF0ZVNjb3BlQ291bnRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCA9IDA7XG4gICAgICAgICAgICBzY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQoc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Njb3BlSGVscGVyLiRyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdpc1Njb3BlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU2NvcGUob2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShzY29wZUhlbHBlci4kcm9vdFNjb3BlKSAmJiBvYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2NvcGVIZWxwZXI7XG59KCk7XG5cbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XG5cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XG4gICAgdmFyIHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiB0b1JldHVybjtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xuXG4gICAgdmFyIG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgIHZhciBpbmRleCA9IHZvaWQgMDtcbiAgICBpZiAoKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiYgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZHVsZXM7XG59XG52YXIgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZztcbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbiAoXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSwga2V5KSB7XG4gICAga2V5ID0ga2V5IHx8ICctJztcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2FuaXRpemVNb2R1bGVzXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG52YXIgaW5qZWN0aW9ucyA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciB0b1JldHVybiA9IHtcclxuICAgICAgICAkcm9vdFNjb3BlOiBzY29wZUhlbHBlci4kcm9vdFNjb3BlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5kZXNjcmliZSgnVXRpbCBsb2dpYycsIGZ1bmN0aW9uKCkge1xyXG4gICAgZGVzY3JpYmUoJ2FycmF5LWxpa2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhcnJheS1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKGFyZ3VtZW50cykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0FycmF5TGlrZShbXSkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDEsXHJcbiAgICAgICAgICAgICAgICAwOiAnbGFsYSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKHRlc3RPYmplY3QpKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzYW5pdGl6ZU1vZGxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZW1wdHkgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKFtdKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKHtcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91ZCBhZGQgbmcgbW9kdWxlIGl0IGl0cyBub3QgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKFtdKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgICAgIH0pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhZGQgbmcgbm9yIGFuZ3VsYXIgdG8gdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ25nJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCdhbmd1bGFyJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgcGFzc2luZyBhcnJheXMtbGlrZSBvYmplY3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDEgPSBbJ21vZHVsZTEnLCAnbW9kdWxlMiddO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QyID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QzID0ge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAyLFxyXG4gICAgICAgICAgICAgICAgMDogJ21vZHVsZTEnLFxyXG4gICAgICAgICAgICAgICAgMTogJ21vZHVsZTInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFtvYmplY3QxLCBvYmplY3QyLCBvYmplY3QzXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVNb2R1bGVzKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9CZSh2YWx1ZS5sZW5ndGggKyAxKTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBkZWZhdWx0IG5nL2FuZ3VsYXIgbW9kdWxlIHRvIHRoZSBmaXJzdCBwb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQxID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ25nJ10pLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0MiA9IHNhbml0aXplTW9kdWxlcyhbJ21vZHVsZTEnLCAnbW9kdWxlMicsICdhbmd1bGFyJ10pO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MVswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDEubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MlswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2NvcGVIZWxwZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhIHNjb3BlIHdoZW4gbm8gYXJndW1lbnRzIHdoZXJlIGdpdmVuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoKS4kcm9vdCkudG9CZShpbmplY3Rpb25zLiRyb290U2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmUgYSBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBzY29wZSByZWZlcmVuY2Ugd2hlbiBpdCByZWNlaXZlcyBhbiBpc29sYXRlZCBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKSkudG9CZShzY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYW4gc2NvcGUgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBhIHBhc3NlZCBvYmplY3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9QYXNzID0ge1xyXG4gICAgICAgICAgICAgICAgYToge30sIC8vIGZvciByZWZlcmVuY2UgY2hlY2tpbmdcclxuICAgICAgICAgICAgICAgIGI6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCByZXR1cm5lZFNjb3BlO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5lZFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHRvUGFzcyk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmEpLnRvQmUodG9QYXNzLmEpO1xyXG4gICAgICAgICAgICBleHBlY3QocmV0dXJuZWRTY29wZS5iKS50b0JlKHRvUGFzcy5iKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGtub3cgd2hlbiBhbiBvYmplY3QgaXMgYSBjb250cm9sbGVyIENvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnc29tZXRoaW5nJ1xyXG4gICAgICAgICAgICB9KS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgfSkubmV3KCd3aXRoQmluZGluZ3MnKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdCgkX0NPTlRST0xMRVIuaXNDb250cm9sbGVyKGNvbnRyb2xsZXJPYmopKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyT2JqLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZUhhbmRsZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGNyZWF0ZVNweSxcclxuICAgIG1ha2VBcnJheSxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgYXNzZXJ0XyRfQ09OVFJPTExFUixcclxuICAgIGNsZWFuXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgJF9DT05UUk9MTEVSIHtcclxuICAgIHN0YXRpYyBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRfQ09OVFJPTExFUjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lID0gY05hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJTY29wZSA9IHRoaXMucGFyZW50U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICB0aGlzLmxvY2FscyA9IGV4dGVuZChjTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHRoaXMuY29udHJvbGxlclNjb3BlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xyXG4gICAgICAgICAgICBTY29wZToge30sXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgICRhcHBseSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICAkZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50U2NvcGUgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3kpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xlYW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoYmluZGluZ3MpIHtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYW5ndWxhci5pc0RlZmluZWQoYmluZGluZ3MpICYmIGJpbmRpbmdzICE9PSBudWxsID8gYmluZGluZ3MgOiB0aGlzLmJpbmRpbmdzO1xyXG4gICAgICAgIGFzc2VydF8kX0NPTlRST0xMRVIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID1cclxuICAgICAgICAgICAgY29udHJvbGxlci4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHdhdGNoZXIsIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llciA9IHRoaXMud2F0Y2goa2V5LCB0aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyMiA9IHRoaXMud2F0Y2goc2NvcGVLZXksIHRoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIG5nQ2xpY2soZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICBjb25zdCBhcmdzID0gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBuZ01vZGVsRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsaWNrRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0lmRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ1RyYW5zbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nQmluZERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsYXNzRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGFzcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICB0b0NhbWVsQ2FzZSxcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ1JlcGVhdERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzJztcclxudmFyIGRpcmVjdGl2ZVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0ICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKS5nZXQoJyR0cmFuc2xhdGUnKTtcclxuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBuZXcgTWFwKCksXHJcbiAgICAgICAgdG9SZXR1cm4gPSB7fSxcclxuICAgICAgICAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKSxcclxuICAgICAgICAkYW5pbWF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRhbmltYXRlJyksXHJcbiAgICAgICAgJHRyYW5zY2x1ZGUgPSBmdW5jdGlvbiBjb250cm9sbGVyc0JvdW5kVHJhbnNjbHVkZShzY29wZSwgY2xvbmVBdHRhY2hGbiwgZnV0dXJlUGFyZW50RWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgLy8gTm8gc2NvcGUgcGFzc2VkIGluOlxyXG4gICAgICAgICAgICBpZiAoIXNjb3BlSGVscGVyLmlzU2NvcGUoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgICAgICBmdXR1cmVQYXJlbnRFbGVtZW50ID0gY2xvbmVBdHRhY2hGbjtcclxuICAgICAgICAgICAgICAgIGNsb25lQXR0YWNoRm4gPSBzY29wZTtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW50ZXJuYWxzID0ge1xyXG4gICAgICAgICAgICBuZ0lmOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xpY2s6IG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdNb2RlbDogbmdNb2RlbERpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0Rpc2FibGVkOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdCaW5kOiBuZ0JpbmREaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgbmdDbGFzczogbmdDbGFzc0RpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ1JlcGVhdDogbmdSZXBlYXREaXJlY3RpdmUoJHBhcnNlLCAkYW5pbWF0ZSwgJHRyYW5zY2x1ZGUpLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGVWYWx1ZToge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICBpbnRlcm5hbHMubmdUcmFuc2xhdGUgPSBpbnRlcm5hbHMudHJhbnNsYXRlO1xyXG5cclxuXHJcbiAgICB0b1JldHVybi4kZ2V0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSkge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICAgICAgaWYgKGludGVybmFsc1tkaXJlY3RpdmVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsc1tkaXJlY3RpdmVOYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5nZXQoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJHB1dCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlQ29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdkaXJlY3RpdmVDb25zdHJ1Y3RvciBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGl2ZXMuaGFzKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihhcmd1bWVudHNbMl0pICYmIGFyZ3VtZW50c1syXSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFsnZGlyZWN0aXZlJywgZGlyZWN0aXZlTmFtZSwgJ2hhcyBiZWVuIG92ZXJ3cml0dGVuJ10uam9pbignICcpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IG92ZXJ3cml0ZSAnICsgZGlyZWN0aXZlTmFtZSArICcuXFxuRm9yZ2V0aW5nIHRvIGNsZWFuIG11Y2gnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kY2xlYW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBkaXJlY3RpdmVzLmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4udXNlTW9kdWxlID0gKG1vZHVsZU5hbWUpID0+IHtcclxuICAgICAgICAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXS5jb25jYXQobW9kdWxlTmFtZSkpLmdldCgnJHRyYW5zbGF0ZScpO1xyXG4gICAgICAgIGludGVybmFscy50cmFuc2xhdGUuY2hhbmdlU2VydmljZSgkdHJhbnNsYXRlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBtYWtlQXJyYXlcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdNb2RlbERpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKHBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFyZ3VtZW50c1sxXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihwYXJhbWV0ZXIuc3BsaXQoJycpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBnZXR0ZXIuYXNzaWduKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSwgcGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4ocGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW1vcnkgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBtYWtlQXJyYXkocGFyYW1ldGVyKS5mb3JFYWNoKChjdXJyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKG1lbW9yeSArPSBjdXJyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgWydEb250IGtub3cgd2hhdCB0byBkbyB3aXRoICcsICdbXCInLCBtYWtlQXJyYXkoYXJndW1lbnRzKS5qb2luKCdcIiwgXCInKSwgJ1wiXSddLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGVsZW0uZGF0YSgnbmctbW9kZWwnKTtcclxuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xyXG4gICAgICAgICAgICBtb2RlbC5jaGFuZ2VzKChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbS50ZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctbW9kZWwnXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qc1xuICoqLyIsImV4cG9ydCB2YXIgUEFSU0VfQklORElOR19SRUdFWCA9IC9eKFtcXD1cXEBcXCZdKSguKik/JC87XHJcbmV4cG9ydCB2YXIgRVhQUkVTU0lPTl9SRUdFWCA9IC9ee3suKn19JC87XHJcbi8qIFNob3VsZCByZXR1cm4gdHJ1ZSBcclxuICogZm9yIG9iamVjdHMgdGhhdCB3b3VsZG4ndCBmYWlsIGRvaW5nXHJcbiAqIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShteU9iaik7XHJcbiAqIHdoaWNoIHJldHVybnMgYSBuZXcgYXJyYXkgKHJlZmVyZW5jZS13aXNlKVxyXG4gKiBQcm9iYWJseSBuZWVkcyBtb3JlIHNwZWNzXHJcbiAqL1xyXG5cclxuXHJcbmNvbnN0IHNsaWNlID0gW10uc2xpY2U7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCbG9ja05vZGVzKG5vZGVzKSB7XHJcbiAgICAvLyBUT0RPKHBlcmYpOiB1cGRhdGUgYG5vZGVzYCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdD9cclxuICAgIHZhciBub2RlID0gbm9kZXNbMF07XHJcbiAgICB2YXIgZW5kTm9kZSA9IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgdmFyIGJsb2NrTm9kZXM7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDE7IG5vZGUgIT09IGVuZE5vZGUgJiYgKG5vZGUgPSBub2RlLm5leHRTaWJsaW5nKTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGJsb2NrTm9kZXMgfHwgbm9kZXNbaV0gIT09IG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKCFibG9ja05vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBibG9ja05vZGVzID0gYW5ndWxhci5lbGVtZW50KHNsaWNlLmNhbGwobm9kZXMsIDAsIGkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBibG9ja05vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBibG9ja05vZGVzIHx8IG5vZGVzO1xyXG59XHJcblxyXG52YXIgdWlkID0gMDtcclxuY29uc3QgbmV4dFVpZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuICsrdWlkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hLZXkob2JqLCBuZXh0VWlkRm4pIHtcclxuICAgIGxldCBrZXkgPSBvYmogJiYgb2JqLiQkaGFzaEtleTtcclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBvYmpUeXBlID0gdHlwZW9mIG9iajtcclxuICAgIGlmIChvYmpUeXBlID09PSAnZnVuY3Rpb24nIHx8IChvYmpUeXBlID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpKSB7XHJcbiAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSA9IG9ialR5cGUgKyAnOicgKyAobmV4dFVpZEZuIHx8IG5leHRVaWQpKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGtleSA9IG9ialR5cGUgKyAnOicgKyBvYmo7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ga2V5O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFwKCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93Q29weShzcmMsIGRzdCkge1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNBcnJheShzcmMpKSB7XHJcbiAgICAgICAgZHN0ID0gZHN0IHx8IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzcmMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgICAgICBkc3RbaV0gPSBzcmNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNyYykpIHtcclxuICAgICAgICBkc3QgPSBkc3QgfHwge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgaWYgKCEoa2V5LmNoYXJBdCgwKSA9PT0gJyQnICYmIGtleS5jaGFyQXQoMSkgPT09ICckJykpIHtcclxuICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRzdCB8fCBzcmM7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8XHJcbiAgICAgICAgKCEhaXRlbSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmxlbmd0aCA+PSAwXHJcbiAgICAgICAgKSB8fFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmltKHZhbHVlKSB7XHJcbiAgICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xyXG4gICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0V4cHJlc3Npb24odmFsdWUpIHtcclxuICAgIHJldHVybiBFWFBSRVNTSU9OX1JFR0VYLnRlc3QodHJpbSh2YWx1ZSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhwcmVzc2lvblNhbml0aXplcihleHByZXNzaW9uKSB7XHJcbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XHJcbiAgICByZXR1cm4gZXhwcmVzc2lvbi5zdWJzdHJpbmcoMiwgZXhwcmVzc2lvbi5sZW5ndGggLSAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XHJcblxyXG4gICAgbGV0IGtleTtcclxuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJyB8fCBvYmpba2V5XSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBbJ1wiJywga2V5LCAnXCIgcHJvcGVydHkgY2Fubm90IGJlIG51bGwnXS5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XHJcbiAgICBhc3NlcnROb3REZWZpbmVkKG9iaiwgW1xyXG4gICAgICAgICdwYXJlbnRTY29wZScsXHJcbiAgICAgICAgJ2JpbmRpbmdzJyxcclxuICAgICAgICAnY29udHJvbGxlclNjb3BlJ1xyXG4gICAgXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcclxuICAgIGlmIChpc0FycmF5TGlrZShvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSBvYmplY3QubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShvYmplY3QsIFtpbmRleCwgMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcclxuICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGVuZFRpbWU7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IHNweU9uKHtcclxuICAgICAgICBhOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJ2EnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgIHRvUmV0dXJuLnRvb2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFycmF5KGl0ZW0pIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtpdGVtXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCgpIHtcclxuICAgIGxldCByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlbW92ZSQgfHwgIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHZhbHVlcy5zaGlmdCgpIHx8IHt9O1xyXG4gICAgbGV0IGN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XHJcbiAgICAgICAgJCRleHRlbmQoZGVzdGluYXRpb24sIGN1cnJlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcblxyXG5cclxuXHJcbmNvbnN0IHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFJvb3RGcm9tU2NvcGUoc2NvcGUpIHtcclxuICAgIGlmIChzY29wZS4kcm9vdCkge1xyXG4gICAgICAgIHJldHVybiBzY29wZS4kcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyZW50O1xyXG4gICAgd2hpbGUgKHBhcmVudCA9IHNjb3BlLiRwYXJlbnQpIHtcclxuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuJHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIHNjb3BlSGVscGVyIHtcclxuICAgIHN0YXRpYyBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xyXG4gICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQgPSAwO1xyXG4gICAgICAgIHNjb3BlLiQkcG9zdERpZ2VzdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY3JlYXRlKHNjb3BlKSB7XHJcbiAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICBpZiAodGhpcy5pc1Njb3BlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kKHNjb3BlSGVscGVyLiRyb290U2NvcGUuJG5ldyh0cnVlKSwgc2NvcGUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICBzY29wZSA9IG1ha2VBcnJheShzY29wZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQuYXBwbHkodW5kZWZpbmVkLCBbc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1Njb3BlKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgJiYgZ2V0Um9vdEZyb21TY29wZShvYmplY3QpID09PSBnZXRSb290RnJvbVNjb3BlKHNjb3BlSGVscGVyLiRyb290U2NvcGUpICYmIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XHJcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcclxuXHJcbiAgICBjb25zdCBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGlmIChcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJlxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2R1bGVzO1xyXG59XHJcbmNvbnN0IFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2c7XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZShuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZS5cclxuICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcclxuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUsIGtleSkge1xyXG4gICAga2V5ID0ga2V5IHx8ICctJztcclxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uKCQxKSB7XHJcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIG1ha2VBcnJheVxyXG59IGZyb20gJy4vLi4vLi4vLi4vYnVpbHQvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuZnVuY3Rpb24gcmVjdXJzZU9iamVjdHMob2JqZWN0KSB7XHJcbiAgICBsZXQgdG9SZXR1cm4gPSBtYWtlQXJyYXkob2JqZWN0KTtcclxuICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBvYmplY3QuY2hpbGRyZW4oKS5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLmNvbmNhdChyZWN1cnNlT2JqZWN0cyhhbmd1bGFyLmVsZW1lbnQob2JqZWN0LmNoaWxkcmVuKClbaWldKSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvUmV0dXJuOyBcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1jbGljaz1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2sgPSAoc2NvcGUsIGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gbG9jYWxzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbihzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrRGF0YSA9ICRlbGVtZW50LmRhdGEoJ25nLWNsaWNrJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG15QXJyYXkgPSByZWN1cnNlT2JqZWN0cygkZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBteUFycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KG15QXJyYXlbaW5kZXhdKS5kYXRhKCduZy1jbGljaycsIGNsaWNrRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctY2xpY2snXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBuZ0lmRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWlmPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBzdWJzY3JpcHRvcnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzW2lpXS5hcHBseShzdWJzY3JpcHRvcnMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub3NvcCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKSxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGVkRGlyZWN0aXZlID0gJGVsZW1lbnQuZGF0YSgnbmctaWYnKTtcclxuICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUoKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmNhbGwoJGVsZW1lbnQsIDAsICRlbGVtZW50Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmRldGFjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsYXN0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSgkZWxlbWVudCwgbGFzdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQobGFzdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnQgPSBjb21waWxlZERpcmVjdGl2ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctaWYnXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBpc0V4cHJlc3Npb24sXHJcbiAgICBleHByZXNzaW9uU2FuaXRpemVyXHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSB7XHJcbiAgICBsZXQgdHJhbnNsYXRlU2VydmljZSA9ICR0cmFuc2xhdGU7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGtleSA9IGV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHdhdGNoZXI7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub29wKSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih3YXRjaGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gd2F0Y2hlciA9IHRvUmV0dXJuID0gc3Vic2NyaXB0b3JzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGlzRXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25TYW5pdGl6ZXIoZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSAkcGFyc2UoZXhwcmVzc2lvbikoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCAobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24obmV3TGFuZ3VhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBXYXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goKCkgPT4ge30sICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBXYXRjaGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudCh0ZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZUxhbmd1YWdlOiBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVTZXJ2aWNlLnVzZShuZXdMYW5ndWFnZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VTZXJ2aWNlOiBmdW5jdGlvbihuZXdTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UgPSBuZXdTZXJ2aWNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICBlbGVtLnRleHQobW9kZWwoKSk7XHJcbiAgICAgICAgICAgIG1vZGVsLmNoYW5nZXMoKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6ICduZy10cmFuc2xhdGUnXHJcblxyXG4gICAgfTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzXG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIG5nQmluZERpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmbihuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogKGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZWxlbS5kYXRhKCduZy1iaW5kJyk7XHJcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcclxuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcygobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLWJpbmQnXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIHRyaW1cclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZXhwb3J0IGZ1bmN0aW9uIG5nQ2xhc3NEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IGdldHRlciA9ICRwYXJzZSh0cmltKGV4cHJlc3Npb24pKTtcclxuICAgICAgICAgICAgbGV0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGxldCBmaXJlQ2hhbmdlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9Ob3RpZnkgPSB7fTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG5ld1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBuZXdWYWx1ZS5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVba2V5XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KG5ld1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2tleV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLmhhc093blByb3BlcnR5KGtleSkgJiYgbmV3VmFsdWVba2V5XSAhPT0gbGFzdFZhbHVlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRvTm90aWZ5Lmhhc093blByb3BlcnR5KGtleSkgJiYgbGFzdFZhbHVlLmhhc093blByb3BlcnR5KGtleSkgJiYgbmV3VmFsdWVba2V5XSAhPT0gbGFzdFZhbHVlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChmaXJlQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlLCB0b05vdGlmeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobGFzdFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhsYXN0VmFsdWUpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VmFsdWVba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5oYXNDbGFzcyA9ICh0b0NoZWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZS5pbmRleE9mKHRyaW0odG9DaGVjaykpICE9PSAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxhc3RWYWx1ZVt0b0NoZWNrXTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLWNsYXNzJyxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgZWxlbWVudCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCduZy1jbGFzcycpLmNoYW5nZXMoKGxhc3RWYWx1ZSwgbmV3Q2hhbmdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5ld0NoYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdDaGFuZ2VzW2tleV0ubmV3ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgY3JlYXRlTWFwLFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICAvL2dldEJsb2NrTm9kZXMsXHJcbiAgICBoYXNoS2V5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ1JlcGVhdERpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIC8vIGNvbnN0IE5HX1JFTU9WRUQgPSAnJCROR19SRU1PVkVEJztcclxuICAgIGNvbnN0IHVwZGF0ZVNjb3BlID0gZnVuY3Rpb24oc2NvcGUsIGluZGV4LCB2YWx1ZUlkZW50aWZpZXIsIHZhbHVlLCBrZXlJZGVudGlmaWVyLCBrZXksIGFycmF5TGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gVE9ETyhwZXJmKTogZ2VuZXJhdGUgc2V0dGVycyB0byBzaGF2ZSBvZmYgfjQwbXMgb3IgMS0xLjUlXHJcbiAgICAgICAgc2NvcGVbdmFsdWVJZGVudGlmaWVyXSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIHNjb3BlW2tleUlkZW50aWZpZXJdID0ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzY29wZS4kaW5kZXggPSBpbmRleDtcclxuICAgICAgICBzY29wZS4kZmlyc3QgPSAoaW5kZXggPT09IDApO1xyXG4gICAgICAgIHNjb3BlLiRsYXN0ID0gKGluZGV4ID09PSAoYXJyYXlMZW5ndGggLSAxKSk7XHJcbiAgICAgICAgc2NvcGUuJG1pZGRsZSA9ICEoc2NvcGUuJGZpcnN0IHx8IHNjb3BlLiRsYXN0KTtcclxuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogZmFsc2VcclxuICAgICAgICBzY29wZS4kb2RkID0gIShzY29wZS4kZXZlbiA9IChpbmRleCAmIDEpID09PSAwKTtcclxuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6ICduZ1JlcGVhdCcsXHJcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgJHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKC9eXFxzKihbXFxzXFxTXSs/KVxccytpblxccysoW1xcc1xcU10rPykoPzpcXHMrYXNcXHMrKFtcXHNcXFNdKz8pKT8oPzpcXHMrdHJhY2tcXHMrYnlcXHMrKFtcXHNcXFNdKz8pKT9cXHMqJC8pO1xyXG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCJFeHBlY3RlZCBleHByZXNzaW9uIGluIGZvcm0gb2YgJ19pdGVtXyBpbiBfY29sbGVjdGlvbl9bIHRyYWNrIGJ5IF9pZF9dJyBidXQgZ290ICdcIiwgZXhwcmVzc2lvbiwgXCInXCJdLmpvaW4oJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGxocyA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICBjb25zdCByaHMgPSBtYXRjaFsyXTtcclxuICAgICAgICAgICAgY29uc3QgYWxpYXNBcyA9IG1hdGNoWzNdO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFja0J5RXhwID0gbWF0Y2hbNF07XHJcbiAgICAgICAgICAgIG1hdGNoID0gbGhzLm1hdGNoKC9eKD86KFxccypbXFwkXFx3XSspfFxcKFxccyooW1xcJFxcd10rKVxccyosXFxzKihbXFwkXFx3XSspXFxzKlxcKSkkLyk7XHJcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFtcIidfaXRlbV8nIGluICdfaXRlbV8gaW4gX2NvbGxlY3Rpb25fJyBzaG91bGQgYmUgYW4gaWRlbnRpZmllciBvciAnKF9rZXlfLCBfdmFsdWVfKScgZXhwcmVzc2lvbiwgYnV0IGdvdCAnXCIsIGxocywgXCInXCJdLmpvaW4oJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlSWRlbnRpZmllciA9IG1hdGNoWzNdIHx8IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBrZXlJZGVudGlmaWVyID0gbWF0Y2hbMl07XHJcblxyXG4gICAgICAgICAgICBpZiAoYWxpYXNBcyAmJiAoIS9eWyRhLXpBLVpfXVskYS16QS1aMC05X10qJC8udGVzdChhbGlhc0FzKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIC9eKG51bGx8dW5kZWZpbmVkfHRoaXN8XFwkaW5kZXh8XFwkZmlyc3R8XFwkbWlkZGxlfFxcJGxhc3R8XFwkZXZlbnxcXCRvZGR8XFwkcGFyZW50fFxcJHJvb3R8XFwkaWQpJC8udGVzdChhbGlhc0FzKSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFtcImFsaWFzICdcIiwgYWxpYXNBcywgXCInIGlzIGludmFsaWQgLS0tIG11c3QgYmUgYSB2YWxpZCBKUyBpZGVudGlmaWVyIHdoaWNoIGlzIG5vdCBhIHJlc2VydmVkIG5hbWUuXCJdLmpvaW4oJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0cmFja0J5RXhwR2V0dGVyLCB0cmFja0J5SWRFeHBGbiwgdHJhY2tCeUlkQXJyYXlGbiwgdHJhY2tCeUlkT2JqRm47XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc2hGbkxvY2FscyA9IHtcclxuICAgICAgICAgICAgICAgICRpZDogaGFzaEtleVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRyYWNrQnlFeHApIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlFeHBHZXR0ZXIgPSAkcGFyc2UodHJhY2tCeUV4cCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFja0J5SWRBcnJheUZuID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNoS2V5KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0cmFja0J5SWRPYmpGbiA9IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cmFja0J5RXhwR2V0dGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFja0J5SWRFeHBGbiA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGtleSwgdmFsdWUsIGFuZCAkaW5kZXggdG8gdGhlIGxvY2FscyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgaW4gaGFzaCBmdW5jdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5SWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoRm5Mb2NhbHNba2V5SWRlbnRpZmllcl0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fsc1t2YWx1ZUlkZW50aWZpZXJdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzLiRpbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmFja0J5RXhwR2V0dGVyKCRzY29wZSwgaGFzaEZuTG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGxhc3RCbG9ja01hcCA9IGNyZWF0ZU1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgZGlmZmVyZW5jZXMgPSBjcmVhdGVNYXAoKTtcclxuICAgICAgICAgICAgY29uc3QgbXlPYmplY3RzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IG5nUmVwZWF0TWluRXJyID0gKCkgPT4ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXIgPSAkc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihyaHMsIGZ1bmN0aW9uIG5nUmVwZWF0QWN0aW9uKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllZDogW11cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwID0gY3JlYXRlTWFwKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbkxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBrZXksIHZhbHVlLCAvLyBrZXkvdmFsdWUgb2YgaXRlcmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzLFxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLCAvLyBsYXN0IG9iamVjdCBpbmZvcm1hdGlvbiB7c2NvcGUsIGVsZW1lbnQsIGlkfVxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFsaWFzQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGVbYWxpYXNBc10gPSBjb2xsZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gY29sbGVjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbiA9IHRyYWNrQnlJZEV4cEZuIHx8IHRyYWNrQnlJZEFycmF5Rm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuID0gdHJhY2tCeUlkRXhwRm4gfHwgdHJhY2tCeUlkT2JqRm47XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0LCBleHRyYWN0IGtleXMsIGluIGVudW1lcmF0aW9uIG9yZGVyLCB1bnNvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlbUtleSBpbiBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbGxlY3Rpb24sIGl0ZW1LZXkpICYmIGl0ZW1LZXkuY2hhckF0KDApICE9PSAnJCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzLnB1c2goaXRlbUtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbkxlbmd0aCA9IGNvbGxlY3Rpb25LZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyID0gbmV3IEFycmF5KGNvbGxlY3Rpb25MZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGxvY2F0ZSBleGlzdGluZyBpdGVtc1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgY29sbGVjdGlvbkxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IChjb2xsZWN0aW9uID09PSBjb2xsZWN0aW9uS2V5cykgPyBpbmRleCA6IGNvbGxlY3Rpb25LZXlzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbGxlY3Rpb25ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWQgPSB0cmFja0J5SWRGbihrZXksIHZhbHVlLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RCbG9ja01hcFt0cmFja0J5SWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIHByZXZpb3VzbHkgc2VlbiBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jayA9IGxhc3RCbG9ja01hcFt0cmFja0J5SWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcFt0cmFja0J5SWRdID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyW2luZGV4XSA9IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY29sbGlzaW9uIGRldGVjdGVkLiByZXN0b3JlIGxhc3RCbG9ja01hcCBhbmQgdGhyb3cgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5leHRCbG9ja09yZGVyLCBmdW5jdGlvbihibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmIGJsb2NrLnNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEJsb2NrTWFwW2Jsb2NrLmlkXSA9IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmdSZXBlYXRNaW5FcnIoJ2R1cGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRHVwbGljYXRlcyBpbiBhIHJlcGVhdGVyIGFyZSBub3QgYWxsb3dlZC4gVXNlICd0cmFjayBieScgZXhwcmVzc2lvbiB0byBzcGVjaWZ5IHVuaXF1ZSBrZXlzLiBSZXBlYXRlcjogezB9LCBEdXBsaWNhdGUga2V5OiB7MX0sIER1cGxpY2F0ZSB2YWx1ZTogezJ9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uLCB0cmFja0J5SWQsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgbmV2ZXIgYmVmb3JlIHNlZW4gYmxvY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXJbaW5kZXhdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRyYWNrQnlJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgbGVmdG92ZXIgaXRlbXNcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGJsb2NrS2V5IGluIGxhc3RCbG9ja01hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbGFzdEJsb2NrTWFwW2Jsb2NrS2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvUmVtb3ZlID0gbXlPYmplY3RzLmluZGV4T2YoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIG15T2JqZWN0cy5zcGxpY2UoZWxlbWVudHNUb1JlbW92ZSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW5jZXMucmVtb3ZlZC5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5zY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHdlIGFyZSBub3QgdXNpbmcgZm9yRWFjaCBmb3IgcGVyZiByZWFzb25zICh0cnlpbmcgdG8gYXZvaWQgI2NhbGwpXHJcbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjb2xsZWN0aW9uTGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gKGNvbGxlY3Rpb24gPT09IGNvbGxlY3Rpb25LZXlzKSA/IGluZGV4IDogY29sbGVjdGlvbktleXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29sbGVjdGlvbltrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbmV4dEJsb2NrT3JkZXJbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5zY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFscmVhZHkgc2VlbiB0aGlzIG9iamVjdCwgdGhlbiB3ZSBuZWVkIHRvIHJldXNlIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHNjb3BlL2VsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2NvcGUoYmxvY2suc2NvcGUsIGluZGV4LCB2YWx1ZUlkZW50aWZpZXIsIHZhbHVlLCBrZXlJZGVudGlmaWVyLCBrZXksIGNvbGxlY3Rpb25MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlcy5tb2RpZmllZC5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgaXRlbSB3aGljaCB3ZSBkb24ndCBrbm93IGFib3V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXlPYmplY3RzLnNwbGljZShpbmRleCwgMCwgYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlcy5hZGRlZC5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwW2Jsb2NrLmlkXSA9IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTY29wZShibG9jay5zY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgY29sbGVjdGlvbkxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QmxvY2tNYXAgPSBuZXh0QmxvY2tNYXA7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmbihteU9iamVjdHMsIGRpZmZlcmVuY2VzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0czogbXlPYmplY3RzLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzOiBkaWZmZXJlbmNlc1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4ua2V5SWRlbnRpZmllciA9IGtleUlkZW50aWZpZXIgfHwgdmFsdWVJZGVudGlmaWVyO1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCBBdHRyaWJ1dGVzIGZyb20gJy4vLi4vY29udHJvbGxlci9hdHRyaWJ1dGUuanMnO1xyXG52YXIgZGlyZWN0aXZlSGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsZXQgcHJvdG8gPSBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlIHx8IGFuZ3VsYXIuZWxlbWVudC5fX3Byb3RvX187XHJcbiAgICBwcm90by4kZmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHtcclxuICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpc1tpbmRleF0ucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xyXG4gICAgfTtcclxuICAgIHByb3RvLiRjbGljayA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctY2xpY2snKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHByb3RvLiR0ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmRhdGEoJ25nLW1vZGVsJykgfHwgdGhpcy5kYXRhKCduZy1iaW5kJykgfHwgdGhpcy5kYXRhKCduZy10cmFuc2xhdGUnKSB8fCB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0ICYmIHRleHQuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBwcm90by4kaWYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgbmdJZiA9IHRoaXMuZGF0YSgnbmctaWYnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5nSWYgJiYgbmdJZi52YWx1ZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBqb2luKG9iaikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgb2JqLmRhdGEoZGlyZWN0aXZlLm5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlLmF0dGFjaFRvRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBhbmd1bGFyLmVsZW1lbnQob2JqKSwgbmV3IEF0dHJpYnV0ZXMob2JqKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iai5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoY2hpbGRyZW5zW2lpXSwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb250cm9sKGNvbnRyb2xsZXJTZXJ2aWNlLCBvYmopIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCAhY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBpbGUoY3VycmVudCwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb250cm9sO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIHRvQ2FtZWxDYXNlLFxyXG4gICAgdG9TbmFrZUNhc2UsXHJcbiAgICB0cmltXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxuZnVuY3Rpb24gQXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzVG9Db3B5KSB7XHJcbiAgICBpZiAoYXR0cmlidXRlc1RvQ29weSkge1xyXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlc1RvQ29weSk7XHJcbiAgICAgICAgdmFyIGksIGwsIGtleTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGF0dHJpYnV0ZXNUb0NvcHlba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGF0dHIgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiQkZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuY29uc3QgJGFuaW1hdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckYW5pbWF0ZScpO1xyXG5jb25zdCAkJHNhbml0aXplVXJpID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJCRzYW5pdGl6ZVVyaScpO1xyXG5BdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG5vcm1hbGl6ZVxyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnZlcnRzIGFuIGF0dHJpYnV0ZSBuYW1lIChlLmcuIGRhc2gvY29sb24vdW5kZXJzY29yZS1kZWxpbWl0ZWQgc3RyaW5nLCBvcHRpb25hbGx5IHByZWZpeGVkIHdpdGggYHgtYCBvclxyXG4gICAgICogYGRhdGEtYCkgdG8gaXRzIG5vcm1hbGl6ZWQsIGNhbWVsQ2FzZSBmb3JtLlxyXG4gICAgICpcclxuICAgICAqIEFsc28gdGhlcmUgaXMgc3BlY2lhbCBjYXNlIGZvciBNb3ogcHJlZml4IHN0YXJ0aW5nIHdpdGggdXBwZXIgY2FzZSBsZXR0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogRm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24gY2hlY2sgb3V0IHRoZSBndWlkZSBvbiB7QGxpbmsgZ3VpZGUvZGlyZWN0aXZlI21hdGNoaW5nLWRpcmVjdGl2ZXMgTWF0Y2hpbmcgRGlyZWN0aXZlc31cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIHRvIG5vcm1hbGl6ZVxyXG4gICAgICovXHJcbiAgICAkbm9ybWFsaXplOiB0b0NhbWVsQ2FzZSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkYWRkQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBBZGRzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgdG8gdGhlIGVsZW1lbnQuIElmIGFuaW1hdGlvbnNcclxuICAgICAqIGFyZSBlbmFibGVkIHRoZW4gYW4gYW5pbWF0aW9uIHdpbGwgYmUgdHJpZ2dlcmVkIGZvciB0aGUgY2xhc3MgYWRkaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzVmFsIFRoZSBjbGFzc05hbWUgdmFsdWUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgICRhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NWYWwpIHtcclxuICAgICAgICBpZiAoY2xhc3NWYWwgJiYgY2xhc3NWYWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCwgY2xhc3NWYWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkcmVtb3ZlQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgZnJvbSB0aGUgZWxlbWVudC4gSWZcclxuICAgICAqIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQgdGhlbiBhbiBhbmltYXRpb24gd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoZSBjbGFzcyByZW1vdmFsLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ZhbCBUaGUgY2xhc3NOYW1lIHZhbHVlIHRoYXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgJHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc1ZhbCkge1xyXG4gICAgICAgIGlmIChjbGFzc1ZhbCAmJiBjbGFzc1ZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCBjbGFzc1ZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyR1cGRhdGVDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIEFkZHMgYW5kIHJlbW92ZXMgdGhlIGFwcHJvcHJpYXRlIENTUyBjbGFzcyB2YWx1ZXMgdG8gdGhlIGVsZW1lbnQgYmFzZWQgb24gdGhlIGRpZmZlcmVuY2VcclxuICAgICAqIGJldHdlZW4gdGhlIG5ldyBhbmQgb2xkIENTUyBjbGFzcyB2YWx1ZXMgKHNwZWNpZmllZCBhcyBuZXdDbGFzc2VzIGFuZCBvbGRDbGFzc2VzKS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3Q2xhc3NlcyBUaGUgY3VycmVudCBDU1MgY2xhc3NOYW1lIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkQ2xhc3NlcyBUaGUgZm9ybWVyIENTUyBjbGFzc05hbWUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgJHVwZGF0ZUNsYXNzOiBmdW5jdGlvbihuZXdDbGFzc2VzLCBvbGRDbGFzc2VzKSB7XHJcbiAgICAgICAgdmFyIHRvQWRkID0gdG9rZW5EaWZmZXJlbmNlKG5ld0NsYXNzZXMsIG9sZENsYXNzZXMpO1xyXG4gICAgICAgIGlmICh0b0FkZCAmJiB0b0FkZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsIHRvQWRkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0b1JlbW92ZSA9IHRva2VuRGlmZmVyZW5jZShvbGRDbGFzc2VzLCBuZXdDbGFzc2VzKTtcclxuICAgICAgICBpZiAodG9SZW1vdmUgJiYgdG9SZW1vdmUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCB0b1JlbW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIG5vcm1hbGl6ZWQgYXR0cmlidXRlIG9uIHRoZSBlbGVtZW50IGluIGEgd2F5IHN1Y2ggdGhhdCBhbGwgZGlyZWN0aXZlc1xyXG4gICAgICogY2FuIHNoYXJlIHRoZSBhdHRyaWJ1dGUuIFRoaXMgZnVuY3Rpb24gcHJvcGVybHkgaGFuZGxlcyBib29sZWFuIGF0dHJpYnV0ZXMuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xib29sZWFufSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LiBJZiBgbnVsbGAgYXR0cmlidXRlIHdpbGwgYmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHdyaXRlQXR0ciBJZiBmYWxzZSwgZG9lcyBub3Qgd3JpdGUgdGhlIHZhbHVlIHRvIERPTSBlbGVtZW50IGF0dHJpYnV0ZS5cclxuICAgICAqICAgICBEZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBhdHRyTmFtZSBPcHRpb25hbCBub25lIG5vcm1hbGl6ZWQgbmFtZS4gRGVmYXVsdHMgdG8ga2V5LlxyXG4gICAgICovXHJcbiAgICAkc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlLCB3cml0ZUF0dHIsIGF0dHJOYW1lKSB7XHJcbiAgICAgICAgLy8gVE9ETzogZGVjaWRlIHdoZXRoZXIgb3Igbm90IHRvIHRocm93IGFuIGVycm9yIGlmIFwiY2xhc3NcIlxyXG4gICAgICAgIC8vaXMgc2V0IHRocm91Z2ggdGhpcyBmdW5jdGlvbiBzaW5jZSBpdCBtYXkgY2F1c2UgJHVwZGF0ZUNsYXNzIHRvXHJcbiAgICAgICAgLy9iZWNvbWUgdW5zdGFibGUuXHJcblxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy4kJGVsZW1lbnRbMF0sXHJcbiAgICAgICAgICAgIGJvb2xlYW5LZXkgPSBhbmd1bGFyLmdldEJvb2xlYW5BdHRyTmFtZShub2RlLCBrZXkpLFxyXG4gICAgICAgICAgICBhbGlhc2VkS2V5ID0gYW5ndWxhci5nZXRBbGlhc2VkQXR0ck5hbWUoa2V5KSxcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBrZXksXHJcbiAgICAgICAgICAgIG5vZGVOYW1lO1xyXG5cclxuICAgICAgICBpZiAoYm9vbGVhbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5wcm9wKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICBhdHRyTmFtZSA9IGJvb2xlYW5LZXk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbGlhc2VkS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXNbYWxpYXNlZEtleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBhbGlhc2VkS2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBub3JtYWxpemVkIGtleSB0byBhY3R1YWwga2V5XHJcbiAgICAgICAgaWYgKGF0dHJOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGF0dHJba2V5XSA9IGF0dHJOYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGF0dHJOYW1lID0gdGhpcy4kYXR0cltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIWF0dHJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRhdHRyW2tleV0gPSBhdHRyTmFtZSA9IHRvU25ha2VDYXNlKGtleSwgJy0nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm9kZU5hbWUgPSBub2RlTmFtZV8odGhpcy4kJGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBpZiAoKG5vZGVOYW1lID09PSAnYScgJiYgKGtleSA9PT0gJ2hyZWYnIHx8IGtleSA9PT0gJ3hsaW5rSHJlZicpKSB8fFxyXG4gICAgICAgICAgICAobm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyYycpKSB7XHJcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGFbaHJlZl0gYW5kIGltZ1tzcmNdIHZhbHVlc1xyXG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZSA9ICQkc2FuaXRpemVVcmkodmFsdWUsIGtleSA9PT0gJ3NyYycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyY3NldCcgJiYgYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGltZ1tzcmNzZXRdIHZhbHVlc1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpcnN0IGNoZWNrIGlmIHRoZXJlIGFyZSBzcGFjZXMgYmVjYXVzZSBpdCdzIG5vdCB0aGUgc2FtZSBwYXR0ZXJuXHJcbiAgICAgICAgICAgIHZhciB0cmltbWVkU3Jjc2V0ID0gdHJpbSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICggICA5OTl4ICAgLHwgICA5OTl3ICAgLHwgICAsfCwgICApXHJcbiAgICAgICAgICAgIHZhciBzcmNQYXR0ZXJuID0gLyhcXHMrXFxkK3hcXHMqLHxcXHMrXFxkK3dcXHMqLHxcXHMrLHwsXFxzKykvO1xyXG4gICAgICAgICAgICB2YXIgcGF0dGVybiA9IC9cXHMvLnRlc3QodHJpbW1lZFNyY3NldCkgPyBzcmNQYXR0ZXJuIDogLygsKS87XHJcblxyXG4gICAgICAgICAgICAvLyBzcGxpdCBzcmNzZXQgaW50byB0dXBsZSBvZiB1cmkgYW5kIGRlc2NyaXB0b3IgZXhjZXB0IGZvciB0aGUgbGFzdCBpdGVtXHJcbiAgICAgICAgICAgIHZhciByYXdVcmlzID0gdHJpbW1lZFNyY3NldC5zcGxpdChwYXR0ZXJuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHR1cGxlc1xyXG4gICAgICAgICAgICB2YXIgbmJyVXJpc1dpdGgycGFydHMgPSBNYXRoLmZsb29yKHJhd1VyaXMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmJyVXJpc1dpdGgycGFydHM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlubmVySWR4ID0gaSAqIDI7XHJcbiAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgdXJpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJCRzYW5pdGl6ZVVyaSh0cmltKHJhd1VyaXNbaW5uZXJJZHhdKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGRlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoXCIgXCIgKyB0cmltKHJhd1VyaXNbaW5uZXJJZHggKyAxXSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzcGxpdCB0aGUgbGFzdCBpdGVtIGludG8gdXJpIGFuZCBkZXNjcmlwdG9yXHJcbiAgICAgICAgICAgIHZhciBsYXN0VHVwbGUgPSB0cmltKHJhd1VyaXNbaSAqIDJdKS5zcGxpdCgvXFxzLyk7XHJcblxyXG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgbGFzdCB1cmlcclxuICAgICAgICAgICAgcmVzdWx0ICs9ICQkc2FuaXRpemVVcmkodHJpbShsYXN0VHVwbGVbMF0pLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuZCBhZGQgdGhlIGxhc3QgZGVzY3JpcHRvciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKGxhc3RUdXBsZS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoXCIgXCIgKyB0cmltKGxhc3RUdXBsZVsxXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdyaXRlQXR0ciAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5yZW1vdmVBdHRyKGF0dHJOYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChTSU1QTEVfQVRUUl9OQU1FLnRlc3QoYXR0ck5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kJGVsZW1lbnQuYXR0cihhdHRyTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRTcGVjaWFsQXR0cih0aGlzLiQkZWxlbWVudFswXSwgYXR0ck5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmlyZSBvYnNlcnZlcnNcclxuICAgICAgICB2YXIgJCRvYnNlcnZlcnMgPSB0aGlzLiQkb2JzZXJ2ZXJzO1xyXG4gICAgICAgIGlmICgkJG9ic2VydmVycykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJCRvYnNlcnZlcnNbb2JzZXJ2ZXJdLCBmdW5jdGlvbihmbikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBmbih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG9ic2VydmVcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBPYnNlcnZlcyBhbiBpbnRlcnBvbGF0ZWQgYXR0cmlidXRlLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBvYnNlcnZlciBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgb25jZSBkdXJpbmcgdGhlIG5leHQgYCRkaWdlc3RgIGZvbGxvd2luZ1xyXG4gICAgICogY29tcGlsYXRpb24uIFRoZSBvYnNlcnZlciBpcyB0aGVuIGludm9rZWQgd2hlbmV2ZXIgdGhlIGludGVycG9sYXRlZCB2YWx1ZVxyXG4gICAgICogY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpIC5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oaW50ZXJwb2xhdGVkVmFsdWUpfSBmbiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyXHJcbiAgICAgICAgICAgICAgdGhlIGludGVycG9sYXRlZCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGNoYW5nZXMuXHJcbiAgICAgKiAgICAgICAgU2VlIHRoZSB7QGxpbmsgZ3VpZGUvaW50ZXJwb2xhdGlvbiNob3ctdGV4dC1hbmQtYXR0cmlidXRlLWJpbmRpbmdzLXdvcmsgSW50ZXJwb2xhdGlvblxyXG4gICAgICogICAgICAgIGd1aWRlfSBmb3IgbW9yZSBpbmZvLlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9uKCl9IFJldHVybnMgYSBkZXJlZ2lzdHJhdGlvbiBmdW5jdGlvbiBmb3IgdGhpcyBvYnNlcnZlci5cclxuICAgICAqL1xyXG4gICAgJG9ic2VydmU6IGZ1bmN0aW9uKGtleSwgZm4pIHtcclxuICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLFxyXG4gICAgICAgICAgICAkJG9ic2VydmVycyA9IChhdHRycy4kJG9ic2VydmVycyB8fCAoYXR0cnMuJCRvYnNlcnZlcnMgPSBuZXcgTWFwKCkpKSxcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gKCQkb2JzZXJ2ZXJzW2tleV0gfHwgKCQkb2JzZXJ2ZXJzW2tleV0gPSBbXSkpO1xyXG5cclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChmbik7XHJcbiAgICAgICAgc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycy4kJGludGVyICYmIGF0dHJzLmhhc093blByb3BlcnR5KGtleSkgJiYgIWFuZ3VsYXIuaXNVbmRlZmluZWQoYXR0cnNba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vIG9uZSByZWdpc3RlcmVkIGF0dHJpYnV0ZSBpbnRlcnBvbGF0aW9uIGZ1bmN0aW9uLCBzbyBsZXRzIGNhbGwgaXQgbWFudWFsbHlcclxuICAgICAgICAgICAgICAgIGZuKGF0dHJzW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5hcnJheVJlbW92ZShsaXN0ZW5lcnMsIGZuKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gdG9rZW5EaWZmZXJlbmNlKHN0cjEsIHN0cjIpIHtcclxuXHJcbiAgICB2YXIgdmFsdWVzID0gJycsXHJcbiAgICAgICAgdG9rZW5zMSA9IHN0cjEuc3BsaXQoL1xccysvKSxcclxuICAgICAgICB0b2tlbnMyID0gc3RyMi5zcGxpdCgvXFxzKy8pO1xyXG5cclxuICAgIG91dGVyOlxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0b2tlbnMxW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0b2tlbnMyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IHRva2VuczJbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsdWVzICs9ICh2YWx1ZXMubGVuZ3RoID4gMCA/ICcgJyA6ICcnKSArIHRva2VuO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vZGVOYW1lXyhlbGVtZW50KSB7XHJcbiAgICBjb25zdCBteUVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF07XHJcbiAgICBpZiAobXlFbGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG15RWxlbS5ub2RlTmFtZTtcclxuICAgIH1cclxufVxyXG52YXIgc3BlY2lhbEF0dHJIb2xkZXIgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBTSU1QTEVfQVRUUl9OQU1FID0gL15cXHcvO1xyXG5cclxuZnVuY3Rpb24gc2V0U3BlY2lhbEF0dHIoZWxlbWVudCwgYXR0ck5hbWUsIHZhbHVlKSB7XHJcbiAgICAvLyBBdHRyaWJ1dGVzIG5hbWVzIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggbGV0dGVycyAoc3VjaCBhcyBgKGNsaWNrKWApIGNhbm5vdCBiZSBzZXQgdXNpbmcgYHNldEF0dHJpYnV0ZWBcclxuICAgIC8vIHNvIHdlIGhhdmUgdG8ganVtcCB0aHJvdWdoIHNvbWUgaG9vcHMgdG8gZ2V0IHN1Y2ggYW4gYXR0cmlidXRlXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL3B1bGwvMTMzMThcclxuICAgIHNwZWNpYWxBdHRySG9sZGVyLmlubmVySFRNTCA9IFwiPHNwYW4gXCIgKyBhdHRyTmFtZSArIFwiPlwiO1xyXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzcGVjaWFsQXR0ckhvbGRlci5maXJzdENoaWxkLmF0dHJpYnV0ZXM7XHJcbiAgICB2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1swXTtcclxuICAgIC8vIFdlIGhhdmUgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSBpdHMgY29udGFpbmVyIGVsZW1lbnQgYmVmb3JlIHdlIGNhbiBhZGQgaXQgdG8gdGhlIGRlc3RpbmF0aW9uIGVsZW1lbnRcclxuICAgIGF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKGF0dHJpYnV0ZS5uYW1lKTtcclxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShhdHRyaWJ1dGUpO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEF0dHJpYnV0ZXM7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9hdHRyaWJ1dGUuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgaXNFeHByZXNzaW9uLFxyXG4gICAgZXhwcmVzc2lvblNhbml0aXplclxyXG59IGZyb20gJy4vY29tbW9uLmpzJztcclxuXHJcbmNvbnN0ICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICAgICAgYmluZGluZ3MgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJz0nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMoYmluZGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSAkcGFyc2UocGFyZW50R2V0KHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAobG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhwID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNFeHAgPSBpc0V4cHJlc3Npb24oZXhwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJHBhcnNlKGV4cHJlc3Npb25TYW5pdGl6ZXIoZXhwKSkoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBpc29sYXRlU2NvcGUsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbkJpbmRpbmdzID0gKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBtb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlIHx8ICc9JztcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKG1vZGUpO1xyXG4gICAgICAgICAgICBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEtleSA9IGNvbnRyb2xsZXJBcyArICcuJyArIGtleTtcclxuICAgICAgICAgICAgbGV0IHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEdldCA9ICRwYXJzZShjaGlsZEtleSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVXYXRjaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBjaGlsZEdldChkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRHZXQuYXNzaWduKHNjb3BlLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0V4cCA9IGlzRXhwcmVzc2lvbihzY29wZVtwYXJlbnRLZXldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4cCA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldCA9ICRwYXJzZShleHByZXNzaW9uU2FuaXRpemVyKGV4cCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSwgaXNvbGF0ZVNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSBzY29wZUhlbHBlci5jcmVhdGUoaXNvbGF0ZVNjb3BlIHx8IHNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgaWYgKCFiaW5kaW5ncykge1xyXG4gICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBhbmd1bGFyLmlzU3RyaW5nKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyA9PT0gJz0nKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWtleS5zdGFydHNXaXRoKCckJykgJiYga2V5ICE9PSBjb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBiaW5kaW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93ICdDb3VsZCBub3QgcGFyc2UgYmluZGluZ3MnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAkZ2V0KG1vZHVsZU5hbWVzKSB7XHJcbiAgICAgICAgbGV0ICRjb250cm9sbGVyO1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gbWFrZUFycmF5KG1vZHVsZU5hbWVzKTtcclxuICAgICAgICAvLyBjb25zdCBpbmRleE1vY2sgPSBhcnJheS5pbmRleE9mKCduZ01vY2snKTtcclxuICAgICAgICAvLyBjb25zdCBpbmRleE5nID0gYXJyYXkuaW5kZXhPZignbmcnKTtcclxuICAgICAgICAvLyBpZiAoaW5kZXhNb2NrICE9PSAtMSkge1xyXG4gICAgICAgIC8vICAgICBhcnJheVtpbmRleE1vY2tdID0gJ25nJztcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gaWYgKGluZGV4TmcgPT09IC0xKSB7XHJcbiAgICAgICAgLy8gICAgIGFycmF5LnB1c2goJ25nJyk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGFuZ3VsYXIuaW5qZWN0b3IoYXJyYXkpLmludm9rZShcclxuICAgICAgICAgICAgWyckY29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAoY29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIHNjb3BlLCBiaW5kaW5ncywgc2NvcGVDb250cm9sbGVyTmFtZSwgZXh0ZW5kZWRMb2NhbHMpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpO1xyXG4gICAgICAgICAgICBzY29wZUNvbnRyb2xsZXJOYW1lID0gc2NvcGVDb250cm9sbGVyTmFtZSB8fCAnY29udHJvbGxlcic7XHJcbiAgICAgICAgICAgIGxldCBsb2NhbHMgPSBleHRlbmQoZXh0ZW5kZWRMb2NhbHMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKS4kbmV3KClcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSAkY29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgbG9jYWxzLCB0cnVlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGV4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgY29udHJvbGxlci5nZXRWYWx1ZXMoc2NvcGUsIGJpbmRpbmdzKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzID0gKGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gYiB8fCBiaW5kaW5ncztcclxuICAgICAgICAgICAgICAgIC8vIGxvY2FscyA9IG15TG9jYWxzIHx8IGxvY2FscztcclxuICAgICAgICAgICAgICAgIC8vIGIgPSBiIHx8IGJpbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgLy9leHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGV4dGVuZGVkTG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlQ29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanMnO1xyXG5cclxudmFyIGNvbnRyb2xsZXJIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICBsZXQgbXlNb2R1bGVzLCBjdHJsTmFtZSwgY0xvY2FscywgcFNjb3BlLCBjU2NvcGUsIGNOYW1lLCBiaW5kVG9Db250cm9sbGVyO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhbihyb290KSB7XHJcbiAgICAgICAgbXlNb2R1bGVzID0gW107XHJcbiAgICAgICAgY3RybE5hbWUgPSBwU2NvcGUgPSBjTG9jYWxzID0gY1Njb3BlID0gYmluZFRvQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAocm9vdCkge1xyXG4gICAgICAgICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZSA9IHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGxhc3RJbnN0YW5jZTtcclxuXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uICRjb250cm9sbGVySGFuZGxlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKCFjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUGxlYXNlIHByb3ZpZGUgdGhlIGNvbnRyb2xsZXJcXCdzIG5hbWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocFNjb3BlIHx8IHt9KTtcclxuICAgICAgICBpZiAoIWNTY29wZSkge1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBwU2NvcGUuJG5ldygpO1xyXG4gICAgICAgIH0ge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKGNTY29wZSk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wU2NvcGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjU2NvcGUgPSB0ZW1wU2NvcGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxhc3RJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBsYXN0SW5zdGFuY2UuJGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xyXG4gICAgICAgIGxhc3RJbnN0YW5jZSA9IHRvUmV0dXJuO1xyXG4gICAgICAgIGNsZWFuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24oYmluZGluZ3MpIHtcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSAkX0NPTlRST0xMRVI7XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uKG5ld1Njb3BlKSB7XHJcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgY0xvY2FscyA9IGxvY2FscztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoW21vZHVsZXNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShtb2R1bGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmlzSW50ZXJuYWwgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVybmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIHNjb3BlQ29udHJvbGxlcnNOYW1lLCBwYXJlbnRTY29wZSwgY2hpbGRTY29wZSkge1xyXG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xyXG4gICAgICAgICAgICBjTmFtZSA9ICdjb250cm9sbGVyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3U2VydmljZSA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyhjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSk7XHJcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCB3aGljaCByZXR1cm4gYSBjb250cm9sbGVyIGdlbmVyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLiRnZXQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlci4kZ2V0KCduZycpLmNyZWF0ZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCckZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJDcmVhdG9yO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJDcmVhdG9yID0gY29udHJvbGxlci4kZ2V0KCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5uYW1lKS50b0JlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250cm9sbGVycyB3aXRoIGluamVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEluamVjdGlvbnMnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS4kcSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgYSBjb250cm9sbGVyIHdpdGggYW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge30pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhIHByb3BlcnR5IGluIHRoZSBzY29wZSBmb3IgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLiQkY2hpbGRIZWFkLmNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlciB3aXRoIHRoZSBnaXZlbiBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCBzY29wZSwgZmFsc2UsICdteUNvbnRyb2xsZXInKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQubXlDb250cm9sbGVyKS50b0JlKGNvbnRyb2xsZXIxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IFwidHJ1ZVwiIGFuZCBcIj1cIiBhcyBiaW5kVG9Db250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSwgJz0nKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmluZCBpZiBiaW5kVG9Db250cm9sbGVyIGlzIFwiZmFsc2VcIiBvciBcInVuZGVmaW5lZFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMS5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgndW5kZWZpbmVkIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVzY3JpYmUoJ2JpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCI9XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiQFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ0AnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5ib3VuZFByb3BlcnR5KS50b0JlKCdTb21ldGhpbmcgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIiZcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdvdGhlclByb3BlcnR5LmpvaW4oXCJcIiknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbMSwgMiwgM11cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICcmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSgpKS50b0JlKCcxMjMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdleHByZXNzaW9ucyBzaG91bGQgYWxsb3cgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWydhJywgJ2InLCAnYyddXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRvQmUoJ2FiYycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuXHJcbmRlc2NyaWJlKCdjb250cm9sbGVySGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ215TW9kdWxlJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvbnRyb2xsZXJIYW5kbGVyIHdoZW4gYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKSkudG9CZShjb250cm9sbGVySGFuZGxlcik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iaikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlLiRwYXJlbnQpLnRvQmUoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai51c2VkTW9kdWxlcykudG9FcXVhbChbJ3Rlc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNyZWF0ZSgpKS50b0JlKGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBiaW5kaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsczogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHQ6ICdieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246ICdieVRleHQudG9VcHBlckNhc2UoKSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVhbHNSZXN1bHQ6ICc9ZXF1YWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHRSZXN1bHQ6ICdAYnlUZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uUmVzdWx0OiAnJmV4cHJlc3Npb24nXHJcbiAgICAgICAgICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXF1YWxzUmVzdWx0KS50b0JlKHNjb3BlLmVxdWFscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5ieVRleHRSZXN1bHQpLnRvQmUoc2NvcGUuYnlUZXh0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmV4cHJlc3Npb25SZXN1bHQoKSkudG9CZShzY29wZS5ieVRleHQudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ1dhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzY29wZSwgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyB3YXRjaGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJncykudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIGNvbnRyb2xsZXIgaW50byB0aGUgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ2xvbG8nKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIHNjb3BlIGludG8gdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZ2l2ZSB0aGUgcGFyZW50IHNjb3BlIHByaXZpbGVnZSBvdmVyIHRoZSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSA9ICdjaGlsZCc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgncGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZS5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlc3Ryb3lpbmcgdGhlIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIubmV3KCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJTcGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdW5pcXVlT2JqZWN0ID0gZnVuY3Rpb24gdW5pcXVlT2JqZWN0KCkge307XHJcbiAgICBsZXQgY29udHJvbGxlckNvbnN0cnVjdG9yO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgIGlmIChjb250cm9sbGVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgIGE6ICc9JyxcclxuICAgICAgICAgICAgYjogJ0AnLFxyXG4gICAgICAgICAgICBjOiAnJidcclxuICAgICAgICB9KS5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgIGE6IHVuaXF1ZU9iamVjdCxcclxuICAgICAgICAgICAgYjogJ2InLFxyXG4gICAgICAgICAgICBjOiAnYSdcclxuICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzcGllcyBmb3IgZWFjaCBCb3VuZGVkIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBteVNweSA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5JbnRlcm5hbFNwaWVzLlNjb3BlWydhOmEnXTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBteVNweS50b29rKCkgPT09ICdudW1iZXInKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS50b29rKCkpLnRvQmUobXlTcHkudG9vaygpKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanNcbiAqKi8iLCJyZXF1aXJlKCcuL2h0bWxDb21waWxhdGlvbicpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0NsaWNrLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0lmLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ01vZGVsLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ1RyYW5zbGF0ZS5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vbmdDbGljay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vbmdCaW5kLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0NsYXNzLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ1JlcGVhdC5zcGVjLmpzJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaW5kZXguanNcbiAqKi8iLCJyZXF1aXJlKCcuL25nQ2xpY2tIVE1MLnNwZWMnKTtcclxucmVxdWlyZSgnLi9uZ0lmSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdNb2RlbEhUTUwuc3BlYycpO1xyXG5yZXF1aXJlKCcuL25nQmluZEhUTUwuc3BlYycpO1xyXG5yZXF1aXJlKCcuL25nVHJhbnNsYXRlSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdDbGFzc0hUTUwuc3BlYycpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgbmctY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWNsaWNrPVwiY3RybC5hU3RyaW5nID0gXFwnYW5vdGhlclZhbHVlXFwnXCIvPicpO1xyXG4gICAgICAgIGhhbmRsZXIuJGNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGl0ZW0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuJGZpbmQoJ2EnKS4kY2xpY2soKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIGlmIHRoZSBzZWxlY3RlZCBkb2VzIG5vdCBoYXZlIHRoZSBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuJGNsaWNrKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhcHBseSB0aGUgY2xpY2sgZXZlbnQgdG8gZWFjaCBvZiBpdHMgY2hpbGRyZW5zIChpZiBuZWVkZWQpJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSxcclxuICAgICAgICAgICAgYCAgIDxkaXYgbmctY2xpY2s9XCJjdHJsLmFJbnQgPSBjdHJsLmFJbnQgKyAxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nZmlyc3QnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdzZWNvbmQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSd0aGlyZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Lz5gKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjZmlyc3QnKS4kY2xpY2soKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjc2Vjb25kJykuJGNsaWNrKCk7XHJcbiAgICAgICAgaGFuZGxlci4kZmluZCgnI3RoaXJkJykuJGNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgzKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscyAoZm9yIHRlc3RpbmcpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICBgICAgPGRpdiBuZy1jbGljaz1cImN0cmwuYUludCA9ICB2YWx1ZSArIGN0cmwuYUludCBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdmaXJzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3NlY29uZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3RoaXJkJz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYvPmApO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyNmaXJzdCcpLiRjbGljayh7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgxMDAwKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjc2Vjb25kJykuJGNsaWNrKHtcclxuICAgICAgICAgICAgdmFsdWU6ICcnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTAwMCcpO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyN0aGlyZCcpLiRjbGljayh7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTEwMDAnKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdDbGlja0hUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2lmJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyB0byBjYWxsIG5nSWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2PjxkaXYgbmctaWY9XCJjdHJsLmFCb29sZWFuXCIvPjwvZGl2PicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSB0aGUgZWxlbWVudHMgZnJvbSB0aGUgZG9tJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdj48ZGl2IG5nLWlmPVwiY3RybC5hQm9vbGVhblwiLz48L2Rpdj4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIHRoZSBlbGVtZW50cyBmcm9tIHRoZSBkb20nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2PjxkaXYgY2xhc3M9XCJteS1jbGFzc1wiIG5nLWlmPVwiY3RybC5hQm9vbGVhblwiLz48L2Rpdj4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmNoaWxkcmVuKCkubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRmaW5kKCdkaXYnKS5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IHRoZSB1c2FnZSBvZiBuZXN0ZWQgZGlyZWN0aXZlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXY+PGRpdiBjbGFzcz1cIm15LWNsYXNzXCIgbmctaWY9XCJjdHJsLmFCb29sZWFuXCI+PGJ1dHRvbiBuZy1jbGljaz1cImN0cmwuYUZ1bmN0aW9uKClcIi8+PC9kaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJ2J1dHRvbicpLiRjbGljaygpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgdXNpbmcgbmdJZiBvbiB0aGUgdG9wIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IGNsYXNzPVwibXktY2xhc3NcIiBuZy1pZj1cImN0cmwuYUJvb2xlYW5cIi8+Jyk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIubGVuZ3RoKS50b0JlKDApO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYUJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdJZkhUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ01vZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgdGV4dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctbW9kZWw9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJHRleHQoKSkudG9CZSgnYVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1tb2RlbD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBoYW5kbGVyLiR0ZXh0KCduZXdWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlLCBvbmUgbGV0dGVyIGF0IHRoZSB0aW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1tb2RlbD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaCgnY3RybC5hU3RyaW5nJywgc3B5KTtcclxuICAgICAgICBoYW5kbGVyLiR0ZXh0KCduZXdWYWx1ZScuc3BsaXQoJycpKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCduZXdWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgnbmV3VmFsdWUnLmxlbmd0aCk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nTW9kZWxIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2JpbmQnKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBub3QgdGhyb3cnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8cCBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgZGVmaW5lZCBuZ0JpbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPHAgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kdGV4dCkudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBhcyBqUXVlcnltZXRob2QgLnRleHQoKScsICgpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8cCBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZShoYW5kbGVyLiR0ZXh0KCkpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0JpbmRIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdUcmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdUSVRMRScsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmVwbGFjZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSB0cmFuc2xhdGF0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxzcGFuIHRyYW5zbGF0ZT1cIlRJVExFXCI+PGRpdj5zb21ldGhpbmc8L2RpPjwvc3Bhbj4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ0hlbGxvJyk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLmxlbmd0aCkudG9CZSgwKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHRoZSBjb250ZW50IGFmdGVyIGEgJGRpZ2VzdCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8c3BhbiB0cmFuc2xhdGU9XCJ7e2N0cmwuYUtleX19XCI+PGRpdj5zb21ldGhpbmc8L2RpPjwvc3Bhbj4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ3NvbWV0aGluZycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdUcmFuc2xhdGVIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGFzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGFzcycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFzU3RyaW5nOiAnbXktY2xhc3MgbXktb3RoZXItY2xhc3MnLFxyXG4gICAgICAgICAgICBmaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc2Vjb25kOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzZXQgdGhlIGNsYXNzIGF0dHJpYnV0ZSAoYWZ0ZXIgJGRpZ2VzdCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWNsYXNzPVwiY3RybC5hc1N0cmluZ1wiLz4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsYXNzSFRNTC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZUhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2RpcmVjdGl2ZUhhbmRsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChkaXJlY3RpdmVIYW5kbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNyZWF0ZSBuZXcgaW5zdGFuY2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcigpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBjb21waWxlIGh0bWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdi8+Jyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gXHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ2RpcmVjdGl2ZVByb3ZpZGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVQcm92aWRlci4kZ2V0KSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGFuZCBub3QgdGhyb3cgaXMgdGhlIGRpcmVjdGl2ZSBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCByZXR1cm5lZCA9IHt9O1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuZWQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdub3QgZXhpc3RpbmcnKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChyZXR1cm5lZCkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBbXHJcbiAgICAgICAgJ25nLWlmJyxcclxuICAgICAgICAnbmc6aWYnLFxyXG4gICAgICAgICduZ0lmJyxcclxuICAgICAgICAnbmctcmVwZWF0JyxcclxuICAgICAgICAnbmctY2xpY2snLFxyXG4gICAgICAgICduZy1kaXNhYmxlZCcsXHJcbiAgICAgICAgJ25nLWJpbmQnLFxyXG4gICAgICAgICduZy1tb2RlbCcsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZScsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZS12YWx1ZScsXHJcbiAgICAgICAgJ25nLWNsYXNzJ1xyXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsd2F5cyBjb250YWluIHRoZSAnICsgaXRlbSArICdkaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoaXRlbSkpLnRvQmVEZWZpbmVkKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3B1dHMgYW5kIHVzZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3B5O1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIHNweS5hbmQucmV0dXJuVmFsdWUoc3B5KTtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJGNsZWFuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhZGRpbmcgZGlyZWN0aXZlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXk6ZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215RGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFsbG93IG92ZXJ3cml0aW5nLCBidXQgcHJlc2VydmUgZmlyc3QgdmVyc2lvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7fSk7XHJcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ2FsbG93IG1lIHRvIG92ZXJ3cml0ZSB3aXRoIGEgdGhpcmQgcGFyYW1ldGVyIGluIGEgZnVuY3Rpb24gdGhhdCByZXR1cm4gdHJ1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICBjb25zdCBhbm90aGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgYW5vdGhlclNweS5hbmQucmV0dXJuVmFsdWUoYW5vdGhlclNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGFub3RoZXJTcHksIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkubm90LnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbm90aGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nQ2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlDbGljaywgc3B5O1xyXG4gICAgY29uc3QgbmdDbGljayA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nQ2xpY2snKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlTcHk6IHNweVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIG15Q2xpY2sgPSBuZ0NsaWNrLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsICdjdHJsLm15U3B5KHBhcmFtMSwgcGFyYW0yKScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBteUlmJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xpY2spLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUNsaWNrKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgY2FsbGluZyBpdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbXlDbGljaygpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgc3B5IHdoZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbXlDbGljaygpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdDEgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgICAgIGNvbnN0IG9iamVjdDIgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgICAgIGNvbnN0IGxvY2FscyA9IHtcclxuICAgICAgICAgICAgcGFyYW0xOiBvYmplY3QxLFxyXG4gICAgICAgICAgICBwYXJhbTI6IG9iamVjdDJcclxuICAgICAgICB9O1xyXG4gICAgICAgIG15Q2xpY2sobG9jYWxzKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChvYmplY3QxLCBvYmplY3QyKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0NsaWNrLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15SWY7XHJcbiAgICBjb25zdCBuZ0lmID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmctaWYnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlJZiA9IG5nSWYuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2N0cmwubXlCb29sZWFuJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlJZikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIG5vICRkaWdlc3Qgd2FzIGV4ZWN1dGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGF0ZXN0IGV2YWx1YXRlZCB2YWx1ZSBvbiBhIHdhdGNoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlLm15Qm9vbGVhbiA9IGFuZ3VsYXIubm9vcDtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS5ub3QudG9CZShhbmd1bGFyLm5vb3ApO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhdHRhY2hpbmcgc3B5cyB0byB0aGUgd2F0Y2hpbmcgY3ljbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgbXlJZihteVNweSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgZGVhdHRhY2hpbmcgc3BpZXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG9ubHkgZGVhdHRhY2ggdGhlIGNvcnJlY3BvbmRpbmcgc3B5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5MiA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IG15SWYobXlTcHkpO1xyXG4gICAgICAgIG15SWYobXlTcHkyKTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweTIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gIFxyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ01vZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15TW9kZWwsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGNvbnN0IG5nTW9kZWwgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ01vZGVsJyk7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gJ2N0cmwubXlTdHJpbmdQYXJhbWV0ZXInO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge30sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlNb2RlbCA9IG5nTW9kZWwuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteU1vZGVsKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgY29udHJvbGxlciB3aGVuIHJlY2VpdmluZyBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15TW9kZWwoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBmaXJlIGFuIGRpZ2VzdCB3aGVuIGRvaW5nIGFuZCBhc3NpZ21lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBzcHkpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgbXlNb2RlbCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBjdXJyZW50IHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGV4cGVjdChteU1vZGVsKCkpLnRvQmUoJ3NvbWVWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmaXJlIGRpZ2VzdHMgd2hlbiBjb25zdWx0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgbXlNb2RlbCgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYXJyYXkgdG8gZmlyZSBjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15TW9kZWwoWydhJywgJ1YnLCAnYScsICdsJywgJ3UnLCAnZSddKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWw6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1OiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdWU6IDEgLy9vbmx5IG9uY2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhIHNlY29uZCB0cnVlIHBhcmFtZXRlciwgdG8gc2ltdWxhdGUgdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15TW9kZWwoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qob2JqZWN0KS50b0VxdWFsKHtcclxuICAgICAgICAgICAgYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVY6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbDogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHU6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1ZTogMSAvL29ubHkgb25jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSBjaGFuZ2VzIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15TW9kZWwuY2hhbmdlcykudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnY2hhbmdlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdjaGFuZ2VzIHNob3VsZCBvbmx5IGZpcmUgb25jZSBwZXIgY2hhbmdlIChpbmRlcGVuZGVudCBvZiB3YXRjaGVyKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgd2F0Y2hlclNweSk7XHJcbiAgICAgICAgICAgIG15TW9kZWwuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgICAgICBteU1vZGVsKCdhVmFsdWUnLCB0cnVlKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdhbm90aGVyVmFsdWUnO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDYpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2F0Y2hlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nTW9kZWwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nVHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15VHJhbnNsYXRlO1xyXG4gICAgY29uc3QgbmdUcmFuc2xhdGUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCd0cmFuc2xhdGUnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgcHJvcDogJ1RJVExFJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlID0gbmdUcmFuc2xhdGUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ3t7Y3RybC5wcm9wfX0nKTtcclxuICAgICAgICBuZ1RyYW5zbGF0ZS5jaGFuZ2VMYW5ndWFnZSgnZW4nKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjYWxsaW5nIHRoZSB0cmFuc2xhdGUgbWV0aG9kJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG15VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHRyYW5zbGF0ZWQgdmFsdWUgKG9uY2UgZXZhbHVhdGVkKScsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlUcmFuc2xhdGUoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIG9sZCB2YWx1ZSBpZiBpdCB3YXNuXFwndCBldmFsdWF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUuY2hhbmdlTGFuZ3VhZ2UoJ2RlJyk7XHJcbiAgICAgICAgZXhwZWN0KG15VHJhbnNsYXRlKCkpLnRvQmUoJ0hlbGxvJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15VHJhbnNsYXRlKCkpLnRvQmUoJ0hhbGxvJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gYXR0YWNoIHRvIGNoYW5nZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ3RyYW5zbGF0ZScpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlLmNoYW5nZXMoc3B5KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2UucHJvcCA9ICdGT08nO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdUaGlzIGlzIGEgcGFyYWdyYXBoLicpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nVHJhbnNsYXRlLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlCaW5kLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBjb25zdCBuZ0JpbmQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0JpbmQnKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnY3RybC5teVN0cmluZ1BhcmFtZXRlcic7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15U3RyaW5nUGFyYW1ldGVyOiAnYVZhbHVlJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlCaW5kID0gbmdCaW5kLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZCkudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQpLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgd2hlbiBjYWxsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgbXlCaW5kKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHRoZSBmaXJzdCB0aW1lIGl0IHdhcyBhdHRhY2hlciAod2F0Y2hlcnMgZGlkblxcJ3QgcnVuKScsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGxhc3Qgd2F0Y2hlZCB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIgPSAnYW5vdGhlclZhbHVlJztcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gd2F0Y2ggY2hhbmdlcycsICgpID0+IHtcclxuICAgICAgICBteUJpbmQuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdhVmFsdWUnKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGFzcycsICgpID0+IHtcclxuICAgIGNvbnN0IG5nQ2xhc3MgPSBkaXJlY3RpdmVQcm92aWRlLiRnZXQoJ25nLWNsYXNzJyk7XHJcblxyXG4gICAgbGV0IGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTZXJ2aWNlLCBteUNsYXNzVGV4dCwgbXlDbGFzc0V4cHJlc3Npb247XHJcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteVN0cmluZ1BhcmFtZXRlcjogJ215LWNsYXNzJyxcclxuICAgICAgICAgICAgY2xhc3MxOiB0cnVlLFxyXG4gICAgICAgICAgICBjbGFzczI6IGZhbHNlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15Q2xhc3NUZXh0ID0gbmdDbGFzcy5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnY3RybC5teVN0cmluZ1BhcmFtZXRlcicpO1xyXG4gICAgICAgIG15Q2xhc3NFeHByZXNzaW9uID0gbmdDbGFzcy5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAneyBcIm15LWNsYXNzXCI6IGN0cmwuY2xhc3MxLCBcIm15LW90aGVyLWNsYXNzXCI6IGN0cmwuY2xhc3MyIH0nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dCkudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNsYXNzLCBidXQgb25seSBhZnRlciB0aGUgZmlyc3QgJGRpZ2VzdCcsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQoKSkudG9CZSgnJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0KCkpLnRvQmUoJ215LWNsYXNzJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWNjZXB0IHNlbWkgYnVpbGQgZXhwcmVzc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uKCkpLnRvQmUoJycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbigpKS50b0JlKCdteS1jbGFzcycpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNoZWNrIGlmIGl0IGhhcyB0aGUgY2xhc3MsIHJlZ2FyZGxlc3Mgb2YgdGhlIGV4cHJlc3Npb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0Lmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0Lmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBjb250cm9sbGVyLmNsYXNzMiA9IHRydWU7XHJcbiAgICAgICAgY29udHJvbGxlci5jbGFzczEgPSBmYWxzZTtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ215LW90aGVyLWNsYXNzJztcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dC5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0NsYXNzLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ1JlcGVhdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteVJlcGVhdCwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgY29uc3QgbmdSZXBlYXQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ1JlcGVhdCcpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteUFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgYTogJ2EnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGI6ICdiJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBjOiAnYydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZDogJ2QnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGU6ICdlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBmOiAnZidcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgICAgIG15UmVwZWF0ID0gbmdSZXBlYXQuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2l0ZW1zIGluIGN0cmwubXlBcnJheScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRkZXN0cm95KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIG9iamVjdCBiZWZvcmUgZGlnZXN0JywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteVJlcGVhdCgpKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVJlcGVhdCgpKS50b0VxdWFsKGphc21pbmUuYW55KE9iamVjdCkpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhcnJheScsICgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMobXlSZXBlYXQoKS5kaWZmZXJlbmNlcy5hZGRlZCkubGVuZ3RoKS50b0JlKDYpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnZGV0ZWN0IGNoYW5nZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHN0YXJ0aW5nIHRoZSBjb2xsZWN0aW9uXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIubXlBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMTA7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIubXlBcnJheS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsS2V5OiBpbmRleFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBkZXRlY3QgcmVmZXJlbmNlIGNoYW5nZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0VmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTsgLy9ubyBjaGFuZ2VcclxuICAgICAgICAgICAgbGV0IHNlY29uZFZhbHVlID0gbXlSZXBlYXQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLmFkZGVkLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmaXJzdFZhbHVlLmRpZmZlcmVuY2VzLnJlbW92ZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLnJlbW92ZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLm1vZGlmaWVkLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIubXlBcnJheVswXSA9IHtcclxuICAgICAgICAgICAgICAgIGE6ICdjaGFuZ2VkJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTsgLy9jaGFuZ2VzIGNoYW5nZVxyXG4gICAgICAgICAgICBzZWNvbmRWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgICAgIC8vIGFsdGhvdWdoIHRoZSByZXN1bHRzIHNlZW0gd3JvbmcgdGhleSBhcmUgcmlnaHRcclxuICAgICAgICAgICAgLy8gd2hhdCB0aGUgbmcgcmVwZWF0IGRvZXMgaXQgd2F0Y2ggdGhlIGNvbGxlY3Rpb24sXHJcbiAgICAgICAgICAgIC8vIHNvIFwibmV3IHJlZmVyZW5jZXNcIiB3aWxsIGJlIG1hcmtlZCBhcyBhZGRlZCBhbmRcclxuICAgICAgICAgICAgLy8gcmVtb3ZlZCBhdCB0aGUgc2FtZSB0aW1lIGFuZCBpdGVtcyB0aGF0IE1JR0hUXHJcbiAgICAgICAgICAgIC8vIGhhdmUgY2hhbmdlZCwgYXMgbW9kaWZpZWQuXHJcbiAgICAgICAgICAgIC8vIElzIGVhY2ggc3BlY2lmaWMgaXRlbSdzIHNjb3BlIHJlc3BvbnNhYmlsaXR5IHRvXHJcbiAgICAgICAgICAgIC8vIHdhdGNoIGl0c2VsZiwgYW5kIHJlc3BvbmQgcHJvcGVybHlcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKS50b0JlKDEwKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLmFkZGVkLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWNvbmRWYWx1ZS5kaWZmZXJlbmNlcy5yZW1vdmVkLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKS50b0JlKDApO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKS50b0JlKDkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGRldGVjdCBpbnRlcm5hbCBjaGFuZ2VzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdFZhbHVlID0gbXlSZXBlYXQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teUFycmF5LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmluaXRpYWxLZXkgPSBpbmRleCArIDU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kVmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGJlY2F1c2Ugc2luY2UgdGhlIG5vdCByZWZlcm5jZSBvZiB0aGUgYXJyYXlcclxuICAgICAgICAgICAgLy8gbm9yIGFueSByZWZlcmVuY2Ugb2YgZWFjaCBvZiB0aGUgaW1tZWRpYXRlIGNoaWxkcmVucyBoYXMgY2hhbmdlZFxyXG4gICAgICAgICAgICAvLyB0aGUgd2F0Y2ggZGlkbid0IGZpcmVcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLmFkZGVkLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmaXJzdFZhbHVlLmRpZmZlcmVuY2VzLnJlbW92ZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLnJlbW92ZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKS50b0JlKHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLm1vZGlmaWVkLmxlbmd0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBob3dldmVyLCBmaXJlIGludGVybmFsIHNjb3BlcyB3YXRjaGVzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdFZhbHVlID0gbXlSZXBlYXQoKTtcclxuICAgICAgICAgICAgY29uc3QgbXlTcGllcyA9IFtdO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLm15QXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5pdGlhbEtleSA9IGluZGV4ICsgNTtcclxuICAgICAgICAgICAgICAgIG15U3BpZXMucHVzaChqYXNtaW5lLmNyZWF0ZVNweSgnc3B5JyArIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICBmaXJzdFZhbHVlLm9iamVjdHNbaW5kZXhdLnNjb3BlLiR3YXRjaChteVJlcGVhdC5rZXlJZGVudGlmaWVyICsgJy5pbml0aWFsS2V5JywgKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgc2NvcGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBteVNwaWVzW2luZGV4XShuZXdWYWx1ZSwgb2xkVmFsdWUsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7IC8vIHdhdGNoZXMgZmlyZSB0aGUgZmlyc3QgdGltZSB3aXRoIHRoZSBuZXcgdmFsdWUgb24gYm90aCBwYXJhbWV0ZXJzIChhbmQgdGhlIHNjb3BlKVxyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmRWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgICAgIC8vIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5hZGRlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgbXlTcGllcy5mb3JFYWNoKChzcHksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpbmRleCArIDUsIGluZGV4ICsgNSwgZmlyc3RWYWx1ZS5vYmplY3RzW2luZGV4XS5zY29wZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nUmVwZWF0LnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgcXVpY2ttb2NrIGZyb20gJy4vLi4vc3JjL3F1aWNrbW9jay5qcyc7XHJcbmRlc2NyaWJlKCdxdWlja21vY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyTW9ja2VyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyID0gcXVpY2ttb2NrKHtcclxuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAnd2l0aEluamVjdGlvbnMnLFxyXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGVzdCcsXHJcbiAgICAgICAgICAgIG1vY2tNb2R1bGVzOiBbXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBhIGNvbnRyb2xsZXJNb2NrZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG1vZGlmaWVkIGFuZ3VsYXIgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChxdWlja21vY2subW9ja0hlbHBlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBpbmplY3QgbW9ja2VkIG9iamVjdCBmaXJzdCwgdGhlbiByZWFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQuYW5kLmlkZW50aXR5KCkpLnRvQmUoJ19fXyR0aW1lb3V0Jyk7XHJcbiAgICAgICAgY29udHJvbGxlck1vY2tlci4kdGltZW91dCgpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaW5qZWN0IG1vY2tlZCBvYmplY3QgZmlyc3QsIHRoZW4gcmVhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0LmFuZC5pZGVudGl0eSgpKS50b0JlKCdfX18kdGltZW91dCcpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiRxLmFuZC5pZGVudGl0eSgpKS50b0JlKCdfX18kcScpO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0KSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0W2tleV0pLnRvQmUoY29udHJvbGxlck1vY2tlci4kbW9ja3MuJHRpbWVvdXRba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRyb2xsZXJNb2NrZXIuJHEpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJNb2NrZXIuJHEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHFba2V5XSkudG9CZShjb250cm9sbGVyTW9ja2VyLiRtb2Nrcy4kcVtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kcSkudG9CZShjb250cm9sbGVyTW9ja2VyLiRtb2Nrcy4kcSk7XHJcblxyXG4gICAgfSk7XHJcbn0pO1xyXG5kZXNjcmliZSgnY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJNb2NrZXIsIHNweTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ21hZ2ljQ2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyID0gcXVpY2ttb2NrKHtcclxuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAnZW1wdHlDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3Rlc3QnLFxyXG4gICAgICAgICAgICBtb2NrTW9kdWxlczogW10sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc29tZXRoaW5nVG9DYWxsOiBzcHlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc29tZXRoaW5nVG9DYWxsOiAnPSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gcGVyZm9ybSBjbGlja3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci5uZ0NsaWNrKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICAgICAgY29uc3QgbXlDbGljayA9IGNvbnRyb2xsZXJNb2NrZXIubmdDbGljaygnY3RybC5zb21ldGhpbmdUb0NhbGwoYU9iaiwgYk9iaiknKSxcclxuICAgICAgICAgICAgcmVmZXJlbmNlMSA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIHJlZmVyZW5jZTIgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICAgICBsb2NhbHMgPSB7XHJcbiAgICAgICAgICAgICAgICBhT2JqOiByZWZlcmVuY2UxLFxyXG4gICAgICAgICAgICAgICAgYk9iajogcmVmZXJlbmNlMlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIG15Q2xpY2sobG9jYWxzKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChyZWZlcmVuY2UxLCByZWZlcmVuY2UyKTtcclxuICAgIH0pO1xyXG5cclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGhlbHBlciBmcm9tICcuL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZFxyXG59IGZyb20gJy4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbnZhciBtb2NrZXIgPSAoZnVuY3Rpb24oYW5ndWxhcikge1xyXG4gICAgdmFyIG9wdHMsIG1vY2tQcmVmaXg7XHJcbiAgICB2YXIgY29udHJvbGxlckRlZmF1bHRzID0gZnVuY3Rpb24oZmxhZykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHBhcmVudFNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGlzRGVmYXVsdDogIWZsYWdcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHF1aWNrbW9jay5NT0NLX1BSRUZJWCA9IG1vY2tQcmVmaXggPSAocXVpY2ttb2NrLk1PQ0tfUFJFRklYIHx8ICdfX18nKTtcclxuICAgIHF1aWNrbW9jay5VU0VfQUNUVUFMID0gJ1VTRV9BQ1RVQUxfSU1QTEVNRU5UQVRJT04nO1xyXG4gICAgcXVpY2ttb2NrLk1VVEVfTE9HUyA9IGZhbHNlO1xyXG4gICAgbGV0IHJvb3RTY29wZTtcclxuXHJcbiAgICBmdW5jdGlvbiBxdWlja21vY2sob3B0aW9ucywgcm9vdCkge1xyXG4gICAgICAgIHJvb3RTY29wZSA9IHJvb3Q7XHJcbiAgICAgICAgb3B0cyA9IGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gbW9ja1Byb3ZpZGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG1vY2tQcm92aWRlcigpIHtcclxuICAgICAgICB2YXIgYWxsTW9kdWxlcyA9IG9wdHMubW9ja01vZHVsZXMuY29uY2F0KFsnbmdNb2NrJ10pLFxyXG4gICAgICAgICAgICBpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IoYWxsTW9kdWxlcy5jb25jYXQoW29wdHMubW9kdWxlTmFtZV0pKSxcclxuICAgICAgICAgICAgbW9kT2JqID0gYW5ndWxhci5tb2R1bGUob3B0cy5tb2R1bGVOYW1lKSxcclxuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBtb2RPYmouX2ludm9rZVF1ZXVlIHx8IFtdLFxyXG4gICAgICAgICAgICBwcm92aWRlclR5cGUgPSBnZXRQcm92aWRlclR5cGUob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSxcclxuICAgICAgICAgICAgbW9ja3MgPSB7fSxcclxuICAgICAgICAgICAgcHJvdmlkZXIgPSB7fTtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYWxsTW9kdWxlcyB8fCBbXSwgZnVuY3Rpb24obW9kTmFtZSkge1xyXG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IGludm9rZVF1ZXVlLmNvbmNhdChhbmd1bGFyLm1vZHVsZShtb2ROYW1lKS5faW52b2tlUXVldWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5pbmplY3QpIHtcclxuICAgICAgICAgICAgaW5qZWN0b3IuaW52b2tlKG9wdHMuaW5qZWN0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGludm9rZVF1ZXVlLCBmaW5kIHRoaXMgcHJvdmlkZXIncyBkZXBlbmRlbmNpZXMgYW5kIHByZWZpeFxyXG4gICAgICAgICAgICAvLyB0aGVtIHNvIEFuZ3VsYXIgd2lsbCBpbmplY3QgdGhlIG1vY2tlZCB2ZXJzaW9uc1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlck5hbWUgPSBwcm92aWRlckRhdGFbMl1bMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyTmFtZSA9PT0gb3B0cy5wcm92aWRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzID0gY3VyclByb3ZpZGVyRGVwcy4kaW5qZWN0IHx8IGluamVjdG9yLmFubm90YXRlKGN1cnJQcm92aWRlckRlcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVwTmFtZSA9IGN1cnJQcm92aWRlckRlcHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2Nrc1tkZXBOYW1lXSA9IGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJUeXBlID09PSAnZGlyZWN0aXZlJykge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBEaXJlY3RpdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldHVwSW5pdGlhbGl6ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBwcmVmaXhlZCBkZXBlbmRlbmNpZXMgdGhhdCBwZXJzaXN0ZWQgZnJvbSBhIHByZXZpb3VzIGNhbGwsXHJcbiAgICAgICAgICAgIC8vIGFuZCBjaGVjayBmb3IgYW55IG5vbi1hbm5vdGF0ZWQgc2VydmljZXNcclxuICAgICAgICAgICAgc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBJbml0aWFsaXplcigpIHtcclxuICAgICAgICAgICAgcHJvdmlkZXIgPSBpbml0UHJvdmlkZXIoKTtcclxuICAgICAgICAgICAgaWYgKG9wdHMuc3B5T25Qcm92aWRlck1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuICAgICAgICAgICAgcHJvdmlkZXIuJGluaXRpYWxpemUgPSBzZXR1cEluaXRpYWxpemVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFByb3ZpZGVyKCkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29udHJvbGxlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBjb250cm9sbGVySGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xlYW4ocm9vdFNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkTW9kdWxlcyhhbGxNb2R1bGVzLmNvbmNhdChvcHRzLm1vZHVsZU5hbWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmluZFdpdGgob3B0cy5jb250cm9sbGVyLmJpbmRUb0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRTY29wZShvcHRzLmNvbnRyb2xsZXIucGFyZW50U2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRMb2NhbHMobW9ja3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5uZXcob3B0cy5wcm92aWRlck5hbWUsIG9wdHMuY29udHJvbGxlci5jb250cm9sbGVyQXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ja3MuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3Nba2V5XSA9IHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbnRyb2xsZXIuaXNEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbHRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRmaWx0ZXIgPSBpbmplY3Rvci5nZXQoJyRmaWx0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZpbHRlcihvcHRzLnByb3ZpZGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhbmltYXRpb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRhbmltYXRlOiBpbmplY3Rvci5nZXQoJyRhbmltYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0QW5pbWF0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5tb2NrLm1vZHVsZSgnbmdBbmltYXRlTW9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChvcHRzLnByb3ZpZGVyTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwRGlyZWN0aXZlKCkge1xyXG4gICAgICAgICAgICB2YXIgJGNvbXBpbGUgPSBpbmplY3Rvci5nZXQoJyRjb21waWxlJyk7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZSA9IGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpLiRuZXcoKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XHJcblxyXG4gICAgICAgICAgICBwcm92aWRlci4kY29tcGlsZSA9IGZ1bmN0aW9uIHF1aWNrbW9ja0NvbXBpbGUoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwgfHwgb3B0cy5odG1sO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gTm8gaHRtbCBzdHJpbmcvb2JqZWN0IHByb3ZpZGVkLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoaHRtbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKTtcclxuICAgICAgICAgICAgICAgICRjb21waWxlKHByb3ZpZGVyLiRlbGVtZW50KShwcm92aWRlci4kc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRpc29TY29wZSA9IHByb3ZpZGVyLiRlbGVtZW50Lmlzb2xhdGVTY29wZSgpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKGRlcE5hbWUsIGludm9rZVF1ZXVlKSxcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IGRlcE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICE9PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdID09PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xyXG4gICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBUeXBlID09PSAndmFsdWUnIHx8IGRlcFR5cGUgPT09ICdjb25zdGFudCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmplY3Rvci5oYXMobW9ja1ByZWZpeCArIGRlcE5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xyXG4gICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWluamVjdG9yLmhhcyhtb2NrU2VydmljZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy51c2VBY3R1YWxEZXBlbmRlbmNpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tTZXJ2aWNlTmFtZS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbmplY3QgbW9jayBmb3IgXCInICsgZGVwTmFtZSArICdcIiBiZWNhdXNlIG5vIHN1Y2ggbW9jayBleGlzdHMuIFBsZWFzZSB3cml0ZSBhIG1vY2sgJyArIGRlcFR5cGUgKyAnIGNhbGxlZCBcIicgKyBtb2NrU2VydmljZU5hbWUgKyAnXCIgKG9yIHNldCB0aGUgdXNlQWN0dWFsRGVwZW5kZW5jaWVzIHRvIHRydWUpIGFuZCB0cnkgYWdhaW4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChtb2NrU2VydmljZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhwcm92aWRlckRhdGFbMl1bMF0pICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3ZpZGVyRGF0YVsyXVsxXSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHByb3ZpZGVyIGRlY2xhcmF0aW9uIGZ1bmN0aW9uIGhhcyBiZWVuIHByb3ZpZGVkIHdpdGhvdXQgdGhlIGFycmF5IGFubm90YXRpb24sXHJcbiAgICAgICAgICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGFubm90YXRlIGl0IHNvIHRoZSBpbnZva2VRdWV1ZSBjYW4gYmUgcHJlZml4ZWRcclxuICAgICAgICAgICAgICAgIHZhciBhbm5vdGF0ZWREZXBlbmRlbmNpZXMgPSBpbmplY3Rvci5hbm5vdGF0ZShwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHByb3ZpZGVyRGF0YVsyXVsxXS4kaW5qZWN0O1xyXG4gICAgICAgICAgICAgICAgYW5ub3RhdGVkRGVwZW5kZW5jaWVzLnB1c2gocHJvdmlkZXJEYXRhWzJdWzFdKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyRGF0YVsyXVsxXSA9IGFubm90YXRlZERlcGVuZGVuY2llcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuYW5ndWxhcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluaXRpYWxpemUgYmVjYXVzZSBhbmd1bGFyIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBsb2FkIGFuZ3VsYXIgYmVmb3JlIGxvYWRpbmcgcXVpY2ttb2NrLmpzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMucHJvdmlkZXJOYW1lICYmICFvcHRpb25zLmNvbmZpZ0Jsb2NrcyAmJiAhb3B0aW9ucy5ydW5CbG9ja3MpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIHByb3ZpZGVyTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LCBvciBzZXQgdGhlIGNvbmZpZ0Jsb2NrcyBvciBydW5CbG9ja3MgZmxhZ3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5tb2R1bGVOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBtb2R1bGVOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcHRpb25zLm1vY2tNb2R1bGVzID0gb3B0aW9ucy5tb2NrTW9kdWxlcyB8fCBbXTtcclxuICAgICAgICBvcHRpb25zLm1vY2tzID0gb3B0aW9ucy5tb2NrcyB8fCB7fTtcclxuICAgICAgICBvcHRpb25zLmNvbnRyb2xsZXIgPSBleHRlbmQob3B0aW9ucy5jb250cm9sbGVyLCBjb250cm9sbGVyRGVmYXVsdHMoYW5ndWxhci5pc0RlZmluZWQob3B0aW9ucy5jb250cm9sbGVyKSkpO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb3ZpZGVyLCBmdW5jdGlvbihwcm9wZXJ0eSwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Lmphc21pbmUgJiYgd2luZG93LnNweU9uICYmICFwcm9wZXJ0eS5jYWxscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHkgPSBzcHlPbihwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3B5LmFuZENhbGxUaHJvdWdoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmRDYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5zaW5vbiAmJiB3aW5kb3cuc2lub24uc3B5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNpbm9uLnNweShwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFByb3ZpZGVyVHlwZShwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnZva2VRdWV1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcHJvdmlkZXJJbmZvID0gaW52b2tlUXVldWVbaV07XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlckluZm9bMl1bMF0gPT09IHByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlckluZm9bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckcHJvdmlkZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm92aWRlckluZm9bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbnRyb2xsZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29udHJvbGxlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbXBpbGVQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckZmlsdGVyUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2ZpbHRlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGFuaW1hdGVQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnYW5pbWF0aW9uJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB1bnByZWZpeCkge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlckRhdGFbMl1bMF0gPT09IHByb3ZpZGVyTmFtZSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrUHJlZml4ICsgY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCkge1xyXG4gICAgICAgIGlmICghaHRtbC4kdGFnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIEh0bWwgb2JqZWN0IGRvZXMgbm90IGNvbnRhaW4gJHRhZyBwcm9wZXJ0eS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGh0bWxBdHRycyA9IGh0bWwsXHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSBodG1sQXR0cnMuJHRhZyxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQgPSBodG1sQXR0cnMuJGNvbnRlbnQ7XHJcbiAgICAgICAgaHRtbCA9ICc8JyArIHRhZ05hbWUgKyAnICc7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGh0bWxBdHRycywgZnVuY3Rpb24odmFsLCBhdHRyKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRyICE9PSAnJGNvbnRlbnQnICYmIGF0dHIgIT09ICckdGFnJykge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBzbmFrZV9jYXNlKGF0dHIpICsgKHZhbCA/ICgnPVwiJyArIHZhbCArICdcIiAnKSA6ICcgJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBodG1sICs9IGh0bWxDb250ZW50ID8gKCc+JyArIGh0bWxDb250ZW50KSA6ICc+JztcclxuICAgICAgICBodG1sICs9ICc8LycgKyB0YWdOYW1lICsgJz4nO1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHF1aWNrbW9ja0xvZyhtc2cpIHtcclxuICAgICAgICBpZiAoIXF1aWNrbW9jay5NVVRFX0xPR1MpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIFNOQUtFX0NBU0VfUkVHRVhQID0gL1tBLVpdL2c7XHJcblxyXG4gICAgZnVuY3Rpb24gc25ha2VfY2FzZShuYW1lLCBzZXBhcmF0b3IpIHtcclxuICAgICAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgJy0nO1xyXG4gICAgICAgIHJldHVybiBuYW1lLnJlcGxhY2UoU05BS0VfQ0FTRV9SRUdFWFAsIGZ1bmN0aW9uKGxldHRlciwgcG9zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocG9zID8gc2VwYXJhdG9yIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHF1aWNrbW9jaztcclxuXHJcbn0pKGFuZ3VsYXIpO1xyXG5oZWxwZXIobW9ja2VyKTtcclxuZXhwb3J0IGRlZmF1bHQgbW9ja2VyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1aWNrbW9jay5qc1xuICoqLyIsIlxyXG5mdW5jdGlvbiBsb2FkSGVscGVyKG1vY2tlcikge1xyXG4gICAgKGZ1bmN0aW9uKHF1aWNrbW9jaykge1xyXG4gICAgICAgIHZhciBoYXNCZWVuTW9ja2VkID0ge30sXHJcbiAgICAgICAgICAgIG9yaWdNb2R1bGVGdW5jID0gYW5ndWxhci5tb2R1bGU7XHJcbiAgICAgICAgcXVpY2ttb2NrLm9yaWdpbmFsTW9kdWxlcyA9IGFuZ3VsYXIubW9kdWxlO1xyXG4gICAgICAgIGFuZ3VsYXIubW9kdWxlID0gZGVjb3JhdGVBbmd1bGFyTW9kdWxlO1xyXG5cclxuICAgICAgICBxdWlja21vY2subW9ja0hlbHBlciA9IHtcclxuICAgICAgICAgICAgaGFzQmVlbk1vY2tlZDogaGFzQmVlbk1vY2tlZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZHMgPSBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaik7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QsIG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG1vZE9ialttZXRob2ROYW1lXSA9IG1ldGhvZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtb2RPYmo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGUobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKSB7XHJcbiAgICAgICAgICAgIHZhciBtb2RPYmogPSBvcmlnTW9kdWxlRnVuYyhuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaikge1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsIHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaGFzQmVlbk1vY2tlZFtwcm92aWRlck5hbWVdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdNb2RPYmogPSBtb2RPYmpbcHJvdmlkZXJUeXBlXShxdWlja21vY2suTU9DS19QUkVGSVggKyBwcm92aWRlck5hbWUsIGluaXRGdW5jKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobmV3TW9kT2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlOiBmdW5jdGlvbiBtb2NrU2VydmljZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnc2VydmljZScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbW9ja0ZhY3Rvcnk6IGZ1bmN0aW9uIG1vY2tGYWN0b3J5KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmYWN0b3J5JywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0ZpbHRlcjogZnVuY3Rpb24gbW9ja0ZpbHRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmlsdGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0NvbnRyb2xsZXI6IGZ1bmN0aW9uIG1vY2tDb250cm9sbGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb250cm9sbGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja1Byb3ZpZGVyOiBmdW5jdGlvbiBtb2NrUHJvdmlkZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3Byb3ZpZGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja1ZhbHVlOiBmdW5jdGlvbiBtb2NrVmFsdWUocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3ZhbHVlJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0NvbnN0YW50OiBmdW5jdGlvbiBtb2NrQ29uc3RhbnQocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnN0YW50JywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0FuaW1hdGlvbjogZnVuY3Rpb24gbW9ja0FuaW1hdGlvbihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnYW5pbWF0aW9uJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSkobW9ja2VyKTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBsb2FkSGVscGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzXG4gKiovIiwiaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWcoKSB7XHJcbiAgICBkaXJlY3RpdmVQcm92aWRlci51c2VNb2R1bGUoXHJcbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ3Rlc3QnLCBbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSlcclxuICAgICAgICAuY29udHJvbGxlcignZW1wdHlDb250cm9sbGVyJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnZW1wdHlDb250cm9sbGVyJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEluamVjdGlvbnMnLCBbJyRxJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHEsIHQpIHtcclxuICAgICAgICAgICAgdGhpcy4kcSA9ICRxO1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0ID0gdDtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEJpbmRpbmdzJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvdW5kUHJvcGVydHkgPSB0aGlzLmJvdW5kUHJvcGVydHkgKyAnIG1vZGlmaWVkJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29uZmlnKFsnJHRyYW5zbGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgVElUTEU6ICdIZWxsbycsXHJcbiAgICAgICAgICAgICAgICBGT086ICdUaGlzIGlzIGEgcGFyYWdyYXBoLicsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19FTjogJ2VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdnZXJtYW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGFsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnRGllcyBpc3QgZWluIFBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNjaCcsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19ERTogJ2RldXRzY2gnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2UoJ2VuJyk7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLm1vY2tTZXJ2aWNlKCckcScsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGphc21pbmUuY3JlYXRlU3B5KCdfX18kcScpO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5tb2NrU2VydmljZSgnJHRpbWVvdXQnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqYXNtaW5lLmNyZWF0ZVNweSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICB9XSkubmFtZVxyXG4gICAgKTtcclxuXHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2FwcC9jb21wbGV0ZUxpc3QuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9