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
	                return scopeHelper.decorateScopeCounter(extend(rootScope.$new(true), scope));
	            }
	            if (isArrayLike(scope)) {
	                scope = makeArray(scope);
	                return scopeHelper.decorateScopeCounter(extend.apply(undefined, [rootScope.$new(true)].concat(scope)));
	            }
	        }
	    }, {
	        key: 'isScope',
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
	            delete this.$rootScope;
	            this.parentScope.$destroy();
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
	        internals = {
	        ngIf: (0, _ngIf.ngIfDirective)(),
	        ngClick: (0, _ngClick.ngClickDirective)($parse),
	        ngModel: (0, _ngModel.ngModelDirective)($parse),
	        ngDisabled: (0, _ngIf.ngIfDirective)(),
	        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
	        ngBind: (0, _ngBind.ngBindDirective)(),
	        ngClass: (0, _ngClass.ngClassDirective)($parse),
	        ngRepeat: (0, _ngRepeat.ngRepeatDirective)(),
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	                return scopeHelper.decorateScopeCounter(extend(rootScope.$new(true), scope));
	            }
	            if (isArrayLike(scope)) {
	                scope = makeArray(scope);
	                return scopeHelper.decorateScopeCounter(extend.apply(undefined, [rootScope.$new(true)].concat(scope)));
	            }
	        }
	    }, {
	        key: 'isScope',
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length > 0);
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	
	function ngRepeatDirective($parse, $animate) {
	    var NG_REMOVED = '$$NG_REMOVED';
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
	
	    // const getBlockStart = function(block) {
	    //     return block.clone[0];
	    // };
	
	    // const getBlockEnd = function(block) {
	    //     return block.clone[block.clone.length - 1];
	    // };
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
	            var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
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
	            var lastValue = {
	                toAdd: [],
	                toRemove: []
	            };
	            var watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
	                lastValue = {
	                    toAdd: [],
	                    toRemove: []
	                };
	                var index,
	                    length,
	                    nextBlockMap = (0, _common.createMap)(),
	                    collectionLength,
	                    key,
	                    value,
	                    // key/value of iteration
	                trackById,
	                    trackByIdFn,
	                    collectionKeys,
	                    block,
	                    // last object information {scope, element, id}
	                nextBlockOrder,
	                    elementsToRemove;
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
	                nextBlockOrder = new Array(collectionLength); // locate existing items
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
	                        throw ["Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: ", expression, ", Duplicate key: ", trackById, ", Duplicate value: ", value].join('');
	                    } else {
	                        // new never before seen block
	                        lastValue.toAdd.push(nextBlockOrder[index] = {
	                            id: trackById,
	                            scope: $scope.$new(value),
	                            clone: undefined
	                        });
	                        nextBlockMap[trackById] = true;
	                    }
	                } // remove leftover items
	                for (var blockKey in lastBlockMap) {
	                    lastValue.toRemove.push(block = lastBlockMap[blockKey]);
	                    elementsToRemove = (0, _common.getBlockNodes)(block.clone);
	                    $animate.leave(elementsToRemove);
	                    if (elementsToRemove[0].parentNode) {
	                        // if the element was not removed yet because of pending animation, mark it as deleted
	                        // so that we can ignore it later
	                        for (index = 0, length = elementsToRemove.length; index < length; index++) {
	                            elementsToRemove[index][NG_REMOVED] = true;
	                        }
	                    }
	                    block.scope.$destroy();
	                } // we are not using forEach for perf reasons (trying to avoid #call)
	                for (index = 0; index < collectionLength; index++) {
	                    key = collection === collectionKeys ? index : collectionKeys[index];
	                    value = collection[key];
	                    block = nextBlockOrder[index];
	                    if (block.scope) {
	                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
	                    }
	                }
	                lastBlockMap = nextBlockMap;
	                subscriptors.forEach(function (fn) {
	                    fn(lastValue);
	                });
	            });
	            $scope.$on('$destroy', function () {
	                do {
	                    (subscriptors.shift || angular.noop)();
	                } while (subscriptors.length);
	                watcher();
	            });
	            var toReturn = function toReturn() {
	                return lastValue;
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
	
	    function clean() {
	        myModules = [];
	        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
	        return $controllerHandler;
	    }
	
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
	
	        var toReturn = new _controllerHandlerExtensions.$_CONTROLLER(ctrlName, pScope, bindToController, myModules, cName, cLocals);
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
	    it('should be defined', function () {
	        expect(myRepeat).toBeDefined();
	    });
	    it('should be a function', function () {
	        expect(myRepeat).toEqual(jasmine.any(Function));
	    });
	    it('should return an object before digest', function () {
	        expect(myRepeat()).toBeDefined();
	        expect(myRepeat()).toEqual(Object.create(null));
	    });
	    it('should return an object representing the array', function () {
	        controllerService.$apply();
	        expect(Object.keys(myRepeat()).length).toBe(6);
	    });
	    it('should detect changes', function () {
	        console.log(myRepeat());
	        controllerService.$apply();
	        var firstValue = myRepeat();
	        controllerService.$apply(); //no change
	        var secondValue = myRepeat();
	        expect(firstValue).toBe(secondValue);
	        controller.myArray[0] = {
	            a: 'changed'
	        };
	        controllerService.$apply();
	        secondValue = myRepeat();
	        expect(firstValue).not.toBe(secondValue);
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
	
	    function quickmock(options) {
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
	                    var toReturn = _controllerHandler2.default.clean().addModules(allModules.concat(opts.moduleName)).bindWith(opts.controller.bindToController).setScope(opts.controller.parentScope).setLocals(mocks).new(opts.providerName, opts.controller.controllerAs);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDNjNTRiOTg0YzhlMTM2ZDU1OWU/MDYyZCIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcz84MjJhIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsaWNrSFRNTC5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdJZkhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nTW9kZWxIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0JpbmRIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ1RyYW5zbGF0ZUhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nQ2xhc3NIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nTW9kZWwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nQ2xhc3Muc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdSZXBlYXQuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzIiwid2VicGFjazovLy8uL3NyYy9xdWlja21vY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzIiwid2VicGFjazovLy8uL2FwcC9jb21wbGV0ZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSLEVBQW9DLE9BQXBDLEc7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQsaUNBQWdDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQs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Z0JBQU8sUUFBUSxTQUFSLENBQWtCLGFBQWxCLENBQVA7QUFDSCxNQUZ3QixDQTlCekIsRUFnQ0ksSUFqQ1I7QUFvQ0gsRSIsImZpbGUiOiIuL3Rlc3QvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDQzYzU0Yjk4NGM4ZTEzNmQ1NTllXG4gKiovIiwicmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcycpO1xyXG5yZXF1aXJlKCcuL3F1aWNrbW9jay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vLi4vYXBwL2NvbXBsZXRlTGlzdC5qcycpLmRlZmF1bHQoKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvaW5kZXgubG9hZGVyLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmdldEJsb2NrTm9kZXMgPSBnZXRCbG9ja05vZGVzO1xuZXhwb3J0cy5oYXNoS2V5ID0gaGFzaEtleTtcbmV4cG9ydHMuY3JlYXRlTWFwID0gY3JlYXRlTWFwO1xuZXhwb3J0cy5zaGFsbG93Q29weSA9IHNoYWxsb3dDb3B5O1xuZXhwb3J0cy5pc0FycmF5TGlrZSA9IGlzQXJyYXlMaWtlO1xuZXhwb3J0cy50cmltID0gdHJpbTtcbmV4cG9ydHMuaXNFeHByZXNzaW9uID0gaXNFeHByZXNzaW9uO1xuZXhwb3J0cy5leHByZXNzaW9uU2FuaXRpemVyID0gZXhwcmVzc2lvblNhbml0aXplcjtcbmV4cG9ydHMuYXNzZXJ0Tm90RGVmaW5lZCA9IGFzc2VydE5vdERlZmluZWQ7XG5leHBvcnRzLmFzc2VydF8kX0NPTlRST0xMRVIgPSBhc3NlcnRfJF9DT05UUk9MTEVSO1xuZXhwb3J0cy5jbGVhbiA9IGNsZWFuO1xuZXhwb3J0cy5jcmVhdGVTcHkgPSBjcmVhdGVTcHk7XG5leHBvcnRzLm1ha2VBcnJheSA9IG1ha2VBcnJheTtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5nZXRGdW5jdGlvbk5hbWUgPSBnZXRGdW5jdGlvbk5hbWU7XG5leHBvcnRzLnNhbml0aXplTW9kdWxlcyA9IHNhbml0aXplTW9kdWxlcztcbmV4cG9ydHMudG9DYW1lbENhc2UgPSB0b0NhbWVsQ2FzZTtcbmV4cG9ydHMudG9TbmFrZUNhc2UgPSB0b1NuYWtlQ2FzZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSBleHBvcnRzLlBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xudmFyIEVYUFJFU1NJT05fUkVHRVggPSBleHBvcnRzLkVYUFJFU1NJT05fUkVHRVggPSAvXnt7Lip9fSQvO1xuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xuZnVuY3Rpb24gZ2V0QmxvY2tOb2Rlcyhub2Rlcykge1xuICAgIC8vIFRPRE8ocGVyZik6IHVwZGF0ZSBgbm9kZXNgIGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0P1xuICAgIHZhciBub2RlID0gbm9kZXNbMF07XG4gICAgdmFyIGVuZE5vZGUgPSBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXTtcbiAgICB2YXIgYmxvY2tOb2RlcztcblxuICAgIGZvciAodmFyIGkgPSAxOyBub2RlICE9PSBlbmROb2RlICYmIChub2RlID0gbm9kZS5uZXh0U2libGluZyk7IGkrKykge1xuICAgICAgICBpZiAoYmxvY2tOb2RlcyB8fCBub2Rlc1tpXSAhPT0gbm9kZSkge1xuICAgICAgICAgICAgaWYgKCFibG9ja05vZGVzKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tOb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChzbGljZS5jYWxsKG5vZGVzLCAwLCBpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9ja05vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2tOb2RlcyB8fCBub2Rlcztcbn1cblxudmFyIHVpZCA9IDA7XG52YXIgbmV4dFVpZCA9IGZ1bmN0aW9uIG5leHRVaWQoKSB7XG4gICAgcmV0dXJuICsrdWlkO1xufTtcblxuZnVuY3Rpb24gaGFzaEtleShvYmosIG5leHRVaWRGbikge1xuICAgIHZhciBrZXkgPSBvYmogJiYgb2JqLiQkaGFzaEtleTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgdmFyIG9ialR5cGUgPSB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopO1xuICAgIGlmIChvYmpUeXBlID09PSAnZnVuY3Rpb24nIHx8IG9ialR5cGUgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5ID0gb2JqVHlwZSArICc6JyArIChuZXh0VWlkRm4gfHwgbmV4dFVpZCkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgPSBvYmpUeXBlICsgJzonICsgb2JqO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KHNyYywgZHN0KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNBcnJheShzcmMpKSB7XG4gICAgICAgIGRzdCA9IGRzdCB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzcmMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZHN0W2ldID0gc3JjW2ldO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNyYykpIHtcbiAgICAgICAgZHN0ID0gZHN0IHx8IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGlmICghKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XG4gICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkc3QgfHwgc3JjO1xufVxuZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8ICEhaXRlbSAmJiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGl0ZW0pKSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBpdGVtLmxlbmd0aCA+PSAwIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIHRyaW0odmFsdWUpIHtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGlzRXhwcmVzc2lvbih2YWx1ZSkge1xuICAgIHJldHVybiBFWFBSRVNTSU9OX1JFR0VYLnRlc3QodHJpbSh2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBleHByZXNzaW9uU2FuaXRpemVyKGV4cHJlc3Npb24pIHtcbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgcmV0dXJuIGV4cHJlc3Npb24uc3Vic3RyaW5nKDIsIGV4cHJlc3Npb24ubGVuZ3RoIC0gMik7XG59XG5cbmZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XG5cbiAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFsncGFyZW50U2NvcGUnLCAnYmluZGluZ3MnLCAnY29udHJvbGxlclNjb3BlJ10pO1xufVxuXG5mdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhbihvYmplY3Rba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3B5KGNhbGxiYWNrKSB7XG4gICAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xuICAgIH1cbiAgICB2YXIgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIGVuZFRpbWUgPSB2b2lkIDA7XG4gICAgdmFyIHRvUmV0dXJuID0gc3B5T24oe1xuICAgICAgICBhOiBmdW5jdGlvbiBhKCkge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIF9hcmd1bWVudHMpO1xuICAgICAgICAgICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9XG4gICAgfSwgJ2EnKS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICB0b1JldHVybi50b29rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW5kVGltZSAtIHN0YXJ0VGltZTtcbiAgICB9O1xuICAgIHJldHVybiB0b1JldHVybjtcbn1cblxuZnVuY3Rpb24gbWFrZUFycmF5KGl0ZW0pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VBcnJheShhcmd1bWVudHMpO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChpdGVtKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVtKSkge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gW2l0ZW1dO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHJlbW92ZSQgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHJlbW92ZSQgfHwgIWtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWRlc3RpbmF0aW9uLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9IHZhbHVlcy5zaGlmdCgpIHx8IHt9O1xuICAgIHZhciBjdXJyZW50ID0gdm9pZCAwO1xuICAgIHdoaWxlIChjdXJyZW50ID0gdmFsdWVzLnNoaWZ0KCkpIHtcbiAgICAgICAgJCRleHRlbmQoZGVzdGluYXRpb24sIGN1cnJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzdGluYXRpb247XG59XG52YXIgcm9vdFNjb3BlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHJvb3RTY29wZScpO1xuXG5mdW5jdGlvbiBnZXRSb290RnJvbVNjb3BlKHNjb3BlKSB7XG4gICAgaWYgKHNjb3BlLiRyb290KSB7XG4gICAgICAgIHJldHVybiBzY29wZS4kcm9vdDtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50ID0gdm9pZCAwO1xuICAgIHdoaWxlIChwYXJlbnQgPSBzY29wZS4kcGFyZW50KSB7XG4gICAgICAgIGlmIChwYXJlbnQuJHJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuJHJvb3Q7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbn1cblxudmFyIHNjb3BlSGVscGVyID0gZXhwb3J0cy5zY29wZUhlbHBlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBzY29wZUhlbHBlcigpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIHNjb3BlSGVscGVyKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3Moc2NvcGVIZWxwZXIsIG51bGwsIFt7XG4gICAgICAgIGtleTogJ2RlY29yYXRlU2NvcGVDb3VudGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlY29yYXRlU2NvcGVDb3VudGVyKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS4kJGRpZ2VzdENvdW50ID0gMDtcbiAgICAgICAgICAgIHNjb3BlLiQkcG9zdERpZ2VzdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCsrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NyZWF0ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGUoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XG4gICAgICAgICAgICBpZiAodGhpcy5pc1Njb3BlKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZVtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlSGVscGVyLmRlY29yYXRlU2NvcGVDb3VudGVyKGV4dGVuZChyb290U2NvcGUuJG5ldyh0cnVlKSwgc2NvcGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICBzY29wZSA9IG1ha2VBcnJheShzY29wZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlSGVscGVyLmRlY29yYXRlU2NvcGVDb3VudGVyKGV4dGVuZC5hcHBseSh1bmRlZmluZWQsIFtyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdpc1Njb3BlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU2NvcGUob2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShyb290U2NvcGUpICYmIG9iamVjdDtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBzY29wZUhlbHBlcjtcbn0oKTtcblxuc2NvcGVIZWxwZXIuJHJvb3RTY29wZSA9IHJvb3RTY29wZTtcblxuZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKG15RnVuY3Rpb24pIHtcbiAgICB2YXIgdG9SZXR1cm4gPSAvXmZ1bmN0aW9uXFxzKyhbXFx3XFwkXSspXFxzKlxcKC8uZXhlYyhteUZ1bmN0aW9uLnRvU3RyaW5nKCkpWzFdO1xuICAgIGlmICh0b1JldHVybiA9PT0gJycgfHwgdG9SZXR1cm4gPT09ICdhbm9uJykge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZU1vZHVsZXMoKSB7XG5cbiAgICB2YXIgbW9kdWxlcyA9IG1ha2VBcnJheS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGluZGV4ID0gdm9pZCAwO1xuICAgIGlmICgoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJiAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ2FuZ3VsYXInKSkgPT09IC0xKSB7XG4gICAgICAgIG1vZHVsZXMudW5zaGlmdCgnbmcnKTtcbiAgICB9XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBtb2R1bGVzLnVuc2hpZnQobW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdICYmICduZycpO1xuICAgIH1cbiAgICByZXR1cm4gbW9kdWxlcztcbn1cbnZhciBTUEVDSUFMX0NIQVJTX1JFR0VYUCA9IC8oW1xcOlxcLVxcX10rKC4pKS9nO1xuZnVuY3Rpb24gdG9DYW1lbENhc2UobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uIChfLCBzZXBhcmF0b3IsIGxldHRlciwgb2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBvZmZzZXQgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRvU25ha2VDYXNlKHZhbHVlLCBrZXkpIHtcbiAgICBrZXkgPSBrZXkgfHwgJy0nO1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uICgkMSkge1xuICAgICAgICByZXR1cm4ga2V5ICsgJDEudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvY29udHJvbGxlci9jb21tb24uanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsImltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzYW5pdGl6ZU1vZHVsZXNcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbnZhciBpbmplY3Rpb25zID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRvUmV0dXJuID0ge1xyXG4gICAgICAgICRyb290U2NvcGU6IHNjb3BlSGVscGVyLiRyb290U2NvcGVcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmRlc2NyaWJlKCdVdGlsIGxvZ2ljJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkZXNjcmliZSgnYXJyYXktbGlrZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGFycmF5LWxpa2Ugb2JqZWN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UoYXJndW1lbnRzKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKFtdKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdGVzdE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMSxcclxuICAgICAgICAgICAgICAgIDA6ICdsYWxhJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZSh0ZXN0T2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ3Nhbml0aXplTW9kbGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBlbXB0eSBtb2R1bGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNhbml0aXplTW9kdWxlcygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoW10pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VkIGFkZCBuZyBtb2R1bGUgaXQgaXRzIG5vdCBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoW10pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcyh7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgfSkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFkZCBuZyBub3IgYW5ndWxhciB0byB0aGUgYXJyYXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcygnbmcnKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ2FuZ3VsYXInKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBwYXNzaW5nIGFycmF5cy1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0MSA9IFsnbW9kdWxlMScsICdtb2R1bGUyJ107XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDIgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDMgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDIsXHJcbiAgICAgICAgICAgICAgICAwOiAnbW9kdWxlMScsXHJcbiAgICAgICAgICAgICAgICAxOiAnbW9kdWxlMidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgW29iamVjdDEsIG9iamVjdDIsIG9iamVjdDNdLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzYW5pdGl6ZU1vZHVsZXModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKHZhbHVlLmxlbmd0aCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGRlZmF1bHQgbmcvYW5ndWxhciBtb2R1bGUgdG8gdGhlIGZpcnN0IHBvc2l0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDEgPSBzYW5pdGl6ZU1vZHVsZXMoWydtb2R1bGUxJywgJ21vZHVsZTInLCAnbmcnXSksXHJcbiAgICAgICAgICAgICAgICByZXN1bHQyID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ2FuZ3VsYXInXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQxWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MS5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0Mi5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzY29wZUhlbHBlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgc2NvcGUgd2hlbiBubyBhcmd1bWVudHMgd2hlcmUgZ2l2ZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZSgpLiRyb290KS50b0JlKGluamVjdGlvbnMuJHJvb3RTY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNhbWUgc2NvcGUgcmVmZXJlbmNlIHdoZW4gaXQgcmVjZWl2ZSBhIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkpLnRvQmUoc2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmVzIGFuIGlzb2xhdGVkIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBzY29wZSB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGEgcGFzc2VkIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b1Bhc3MgPSB7XHJcbiAgICAgICAgICAgICAgICBhOiB7fSwgLy8gZm9yIHJlZmVyZW5jZSBjaGVja2luZ1xyXG4gICAgICAgICAgICAgICAgYjoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHJldHVybmVkU2NvcGU7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybmVkU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUodG9QYXNzKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJldHVybmVkU2NvcGUuYSkudG9CZSh0b1Bhc3MuYSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmIpLnRvQmUodG9QYXNzLmIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQga25vdyB3aGVuIGFuIG9iamVjdCBpcyBhIGNvbnRyb2xsZXIgQ29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdzb21ldGhpbmcnXHJcbiAgICAgICAgICAgIH0pLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICB9KS5uZXcoJ3dpdGhCaW5kaW5ncycpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KCRfQ09OVFJPTExFUi5pc0NvbnRyb2xsZXIoY29udHJvbGxlck9iaikpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qc1xuICoqLyIsIlxyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZUhhbmRsZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGNyZWF0ZVNweSxcclxuICAgIG1ha2VBcnJheSxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgYXNzZXJ0XyRfQ09OVFJPTExFUixcclxuICAgIGNsZWFuXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgJF9DT05UUk9MTEVSIHtcclxuICAgIHN0YXRpYyBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRfQ09OVFJPTExFUjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lID0gY05hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJTY29wZSA9IHRoaXMucGFyZW50U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICB0aGlzLmxvY2FscyA9IGV4dGVuZChjTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHRoaXMuY29udHJvbGxlclNjb3BlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xyXG4gICAgICAgICAgICBTY29wZToge30sXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgICRhcHBseSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICAkZGVzdHJveSgpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICBjbGVhbih0aGlzKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZShiaW5kaW5ncykge1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBhbmd1bGFyLmlzRGVmaW5lZChiaW5kaW5ncykgJiYgYmluZGluZ3MgIT09IG51bGwgPyBiaW5kaW5ncyA6IHRoaXMuYmluZGluZ3M7XHJcbiAgICAgICAgYXNzZXJ0XyRfQ09OVFJPTExFUih0aGlzKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID1cclxuICAgICAgICAgICAgY29udHJvbGxlci4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHdhdGNoZXIsIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llciA9IHRoaXMud2F0Y2goa2V5LCB0aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyMiA9IHRoaXMud2F0Y2goc2NvcGVLZXksIHRoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIG5nQ2xpY2soZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICBjb25zdCBhcmdzID0gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBuZ01vZGVsRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsaWNrRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0lmRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ1RyYW5zbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nQmluZERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsYXNzRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGFzcy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICB0b0NhbWVsQ2FzZVxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdSZXBlYXREaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1JlcGVhdC5qcyc7XHJcbnZhciBkaXJlY3RpdmVQcm92aWRlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGxldCAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSkuZ2V0KCckdHJhbnNsYXRlJyk7XHJcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxyXG4gICAgICAgIHRvUmV0dXJuID0ge30sXHJcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXHJcbiAgICAgICAgaW50ZXJuYWxzID0ge1xyXG4gICAgICAgICAgICBuZ0lmOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xpY2s6IG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdNb2RlbDogbmdNb2RlbERpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0Rpc2FibGVkOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdCaW5kOiBuZ0JpbmREaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgbmdDbGFzczogbmdDbGFzc0RpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ1JlcGVhdDogbmdSZXBlYXREaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlVmFsdWU6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgaW50ZXJuYWxzLm5nVHJhbnNsYXRlID0gaW50ZXJuYWxzLnRyYW5zbGF0ZTtcclxuXHJcblxyXG4gICAgdG9SZXR1cm4uJGdldCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXMuZ2V0KGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRwdXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnZGlyZWN0aXZlQ29uc3RydWN0b3IgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oYXJndW1lbnRzWzJdKSAmJiBhcmd1bWVudHNbMl0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbJ2RpcmVjdGl2ZScsIGRpcmVjdGl2ZU5hbWUsICdoYXMgYmVlbiBvdmVyd3JpdHRlbiddLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBvdmVyd3JpdGUgJyArIGRpcmVjdGl2ZU5hbWUgKyAnLlxcbkZvcmdldGluZyB0byBjbGVhbiBtdWNoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGNsZWFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLnVzZU1vZHVsZSA9IChtb2R1bGVOYW1lKSA9PiB7XHJcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10uY29uY2F0KG1vZHVsZU5hbWUpKS5nZXQoJyR0cmFuc2xhdGUnKTtcclxuICAgICAgICBpbnRlcm5hbHMudHJhbnNsYXRlLmNoYW5nZVNlcnZpY2UoJHRyYW5zbGF0ZSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVQcm92aWRlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nTW9kZWxEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24ocGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1N0cmluZyhwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgYXJndW1lbnRzWzFdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKHBhcmFtZXRlci5zcGxpdCgnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdldHRlci5hc3NpZ24oY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLCBwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbihwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbW9yeSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ha2VBcnJheShwYXJhbWV0ZXIpLmZvckVhY2goKGN1cnJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4obWVtb3J5ICs9IGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBbJ0RvbnQga25vdyB3aGF0IHRvIGRvIHdpdGggJywgJ1tcIicsIG1ha2VBcnJheShhcmd1bWVudHMpLmpvaW4oJ1wiLCBcIicpLCAnXCJdJ10uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogKGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZWxlbS5kYXRhKCduZy1tb2RlbCcpO1xyXG4gICAgICAgICAgICBlbGVtLnRleHQobW9kZWwoKSk7XHJcbiAgICAgICAgICAgIG1vZGVsLmNoYW5nZXMoKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6ICduZy1tb2RlbCdcclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ01vZGVsLmpzXG4gKiovIiwiZXhwb3J0IHZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcclxuZXhwb3J0IHZhciBFWFBSRVNTSU9OX1JFR0VYID0gL157ey4qfX0kLztcclxuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXHJcblxyXG5cclxuY29uc3Qgc2xpY2UgPSBbXS5zbGljZTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJsb2NrTm9kZXMobm9kZXMpIHtcclxuICAgIC8vIFRPRE8ocGVyZik6IHVwZGF0ZSBgbm9kZXNgIGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0P1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1swXTtcclxuICAgIHZhciBlbmROb2RlID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICB2YXIgYmxvY2tOb2RlcztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMTsgbm9kZSAhPT0gZW5kTm9kZSAmJiAobm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpOyBpKyspIHtcclxuICAgICAgICBpZiAoYmxvY2tOb2RlcyB8fCBub2Rlc1tpXSAhPT0gbm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoIWJsb2NrTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGJsb2NrTm9kZXMgPSBhbmd1bGFyLmVsZW1lbnQoc2xpY2UuY2FsbChub2RlcywgMCwgaSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJsb2NrTm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJsb2NrTm9kZXMgfHwgbm9kZXM7XHJcbn1cclxuXHJcbnZhciB1aWQgPSAwO1xyXG5jb25zdCBuZXh0VWlkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKyt1aWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGFzaEtleShvYmosIG5leHRVaWRGbikge1xyXG4gICAgbGV0IGtleSA9IG9iaiAmJiBvYmouJCRoYXNoS2V5O1xyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGtleSA9IG9iai4kJGhhc2hLZXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH1cclxuICAgIGNvbnN0IG9ialR5cGUgPSB0eXBlb2Ygb2JqO1xyXG4gICAgaWYgKG9ialR5cGUgPT09ICdmdW5jdGlvbicgfHwgKG9ialR5cGUgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkpIHtcclxuICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5ID0gb2JqVHlwZSArICc6JyArIChuZXh0VWlkRm4gfHwgbmV4dFVpZCkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAga2V5ID0gb2JqVHlwZSArICc6JyArIG9iajtcclxuICAgIH1cclxuICAgIHJldHVybiBrZXk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXAoKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3dDb3B5KHNyYywgZHN0KSB7XHJcbiAgICBpZiAoYW5ndWxhci5pc0FycmF5KHNyYykpIHtcclxuICAgICAgICBkc3QgPSBkc3QgfHwgW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHNyYy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRzdFtpXSA9IHNyY1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc3JjKSkge1xyXG4gICAgICAgIGRzdCA9IGRzdCB8fCB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xyXG4gICAgICAgICAgICBpZiAoIShrZXkuY2hhckF0KDApID09PSAnJCcgJiYga2V5LmNoYXJBdCgxKSA9PT0gJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZHN0IHx8IHNyYztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSkgfHxcclxuICAgICAgICAoISFpdGVtICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoXCJsZW5ndGhcIikgJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0ubGVuZ3RoID09PSBcIm51bWJlclwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0ubGVuZ3RoID49IDBcclxuICAgICAgICApIHx8XHJcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRyaW0odmFsdWUpIHtcclxuICAgIHZhbHVlID0gdmFsdWUgfHwgJyc7XHJcbiAgICByZXR1cm4gdmFsdWUudHJpbSgpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRXhwcmVzc2lvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIEVYUFJFU1NJT05fUkVHRVgudGVzdCh0cmltKHZhbHVlKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHByZXNzaW9uU2FuaXRpemVyKGV4cHJlc3Npb24pIHtcclxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcclxuICAgIHJldHVybiBleHByZXNzaW9uLnN1YnN0cmluZygyLCBleHByZXNzaW9uLmxlbmd0aCAtIDIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Tm90RGVmaW5lZChvYmosIGFyZ3MpIHtcclxuXHJcbiAgICBsZXQga2V5O1xyXG4gICAgd2hpbGUgKGtleSA9IGFyZ3Muc2hpZnQoKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnIHx8IG9ialtrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0XyRfQ09OVFJPTExFUihvYmopIHtcclxuICAgIGFzc2VydE5vdERlZmluZWQob2JqLCBbXHJcbiAgICAgICAgJ3BhcmVudFNjb3BlJyxcclxuICAgICAgICAnYmluZGluZ3MnLFxyXG4gICAgICAgICdjb250cm9sbGVyU2NvcGUnXHJcbiAgICBdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKG9iamVjdCkge1xyXG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KG9iamVjdCwgW2luZGV4LCAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhbihvYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcclxuICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGVuZFRpbWU7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IHNweU9uKHtcclxuICAgICAgICBhOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJ2EnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgIHRvUmV0dXJuLnRvb2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFycmF5KGl0ZW0pIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtpdGVtXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCgpIHtcclxuICAgIGxldCByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlbW92ZSQgfHwgIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHZhbHVlcy5zaGlmdCgpIHx8IHt9O1xyXG4gICAgbGV0IGN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XHJcbiAgICAgICAgJCRleHRlbmQoZGVzdGluYXRpb24sIGN1cnJlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcbmNvbnN0IHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFJvb3RGcm9tU2NvcGUoc2NvcGUpIHtcclxuICAgIGlmIChzY29wZS4kcm9vdCkge1xyXG4gICAgICAgIHJldHVybiBzY29wZS4kcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyZW50O1xyXG4gICAgd2hpbGUgKHBhcmVudCA9IHNjb3BlLiRwYXJlbnQpIHtcclxuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuJHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIHNjb3BlSGVscGVyIHtcclxuICAgIHN0YXRpYyBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xyXG4gICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQgPSAwO1xyXG4gICAgICAgIHNjb3BlLiQkcG9zdERpZ2VzdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY3JlYXRlKHNjb3BlKSB7XHJcbiAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICBpZiAodGhpcy5pc1Njb3BlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kKHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNBcnJheUxpa2Uoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNjb3BlSGVscGVyLmRlY29yYXRlU2NvcGVDb3VudGVyKGV4dGVuZC5hcHBseSh1bmRlZmluZWQsIFtyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNTY29wZShvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShyb290U2NvcGUpICYmIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XHJcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcclxuXHJcbiAgICBjb25zdCBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGlmIChcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJlxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2R1bGVzO1xyXG59XHJcbmNvbnN0IFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2c7XHJcbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZShuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZS5cclxuICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcclxuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUsIGtleSkge1xyXG4gICAga2V5ID0ga2V5IHx8ICctJztcclxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uKCQxKSB7XHJcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIG1ha2VBcnJheVxyXG59IGZyb20gJy4vLi4vLi4vLi4vYnVpbHQvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuZnVuY3Rpb24gcmVjdXJzZU9iamVjdHMob2JqZWN0KSB7XHJcbiAgICBsZXQgdG9SZXR1cm4gPSBtYWtlQXJyYXkob2JqZWN0KTtcclxuICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBvYmplY3QuY2hpbGRyZW4oKS5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLmNvbmNhdChyZWN1cnNlT2JqZWN0cyhhbmd1bGFyLmVsZW1lbnQob2JqZWN0LmNoaWxkcmVuKClbaWldKSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvUmV0dXJuOyBcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1jbGljaz1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2sgPSAoc2NvcGUsIGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gbG9jYWxzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbihzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrRGF0YSA9ICRlbGVtZW50LmRhdGEoJ25nLWNsaWNrJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG15QXJyYXkgPSByZWN1cnNlT2JqZWN0cygkZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBteUFycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KG15QXJyYXlbaW5kZXhdKS5kYXRhKCduZy1jbGljaycsIGNsaWNrRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctY2xpY2snXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqLyIsImV4cG9ydCBmdW5jdGlvbiBuZ0lmRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWlmPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBzdWJzY3JpcHRvcnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzW2lpXS5hcHBseShzdWJzY3JpcHRvcnMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub3NvcCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKSxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGVkRGlyZWN0aXZlID0gJGVsZW1lbnQuZGF0YSgnbmctaWYnKTtcclxuICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUoKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmNhbGwoJGVsZW1lbnQsIDAsICRlbGVtZW50Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmRldGFjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsYXN0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSgkZWxlbWVudCwgbGFzdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQobGFzdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnQgPSBjb21waWxlZERpcmVjdGl2ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctaWYnXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBpc0V4cHJlc3Npb24sXHJcbiAgICBleHByZXNzaW9uU2FuaXRpemVyXHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSB7XHJcbiAgICBsZXQgdHJhbnNsYXRlU2VydmljZSA9ICR0cmFuc2xhdGU7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIGtleSA9IGV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHdhdGNoZXI7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHdhdGNoZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3YXRjaGVyID0gdG9SZXR1cm4gPSBzdWJzY3JpcHRvcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvblNhbml0aXplcihleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGtleSA9ICRwYXJzZShleHByZXNzaW9uKShjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcFdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaCgoKSA9PiB7fSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcFdhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KHRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZVNlcnZpY2U6IGZ1bmN0aW9uKG5ld1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZSA9IG5ld1NlcnZpY2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGVsZW0uZGF0YSgnbmctdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcclxuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcygobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLXRyYW5zbGF0ZSdcclxuXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanNcbiAqKi8iLCJleHBvcnQgZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIGxldCB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub29wKSgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogKGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZWxlbS5kYXRhKCduZy1iaW5kJyk7XHJcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcclxuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcygobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLWJpbmQnXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIHRyaW1cclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZXhwb3J0IGZ1bmN0aW9uIG5nQ2xhc3NEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IGdldHRlciA9ICRwYXJzZSh0cmltKGV4cHJlc3Npb24pKTtcclxuICAgICAgICAgICAgbGV0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGxldCBmaXJlQ2hhbmdlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9Ob3RpZnkgPSB7fTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG5ld1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBuZXdWYWx1ZS5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVba2V5XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KG5ld1ZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2tleV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLmhhc093blByb3BlcnR5KGtleSkgJiYgbmV3VmFsdWVba2V5XSAhPT0gbGFzdFZhbHVlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRvTm90aWZ5Lmhhc093blByb3BlcnR5KGtleSkgJiYgbGFzdFZhbHVlLmhhc093blByb3BlcnR5KGtleSkgJiYgbmV3VmFsdWVba2V5XSAhPT0gbGFzdFZhbHVlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChmaXJlQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlLCB0b05vdGlmeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGxhc3RWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobGFzdFZhbHVlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFZhbHVlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uaGFzQ2xhc3MgPSAodG9DaGVjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobGFzdFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWUuaW5kZXhPZih0cmltKHRvQ2hlY2spKSAhPT0gLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsYXN0VmFsdWVbdG9DaGVja107XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6ICduZy1jbGFzcycsXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsIGVsZW1lbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnbmctY2xhc3MnKS5jaGFuZ2VzKChsYXN0VmFsdWUsIG5ld0NoYW5nZXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBuZXdDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NoYW5nZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlc1trZXldLm5ldyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsYXNzLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIGNyZWF0ZU1hcCxcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgZ2V0QmxvY2tOb2RlcyxcclxuICAgIGhhc2hLZXlcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZXhwb3J0IGZ1bmN0aW9uIG5nUmVwZWF0RGlyZWN0aXZlKCRwYXJzZSwgJGFuaW1hdGUpIHtcclxuICAgIGNvbnN0IE5HX1JFTU9WRUQgPSAnJCROR19SRU1PVkVEJztcclxuICAgIGNvbnN0IHVwZGF0ZVNjb3BlID0gZnVuY3Rpb24oc2NvcGUsIGluZGV4LCB2YWx1ZUlkZW50aWZpZXIsIHZhbHVlLCBrZXlJZGVudGlmaWVyLCBrZXksIGFycmF5TGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gVE9ETyhwZXJmKTogZ2VuZXJhdGUgc2V0dGVycyB0byBzaGF2ZSBvZmYgfjQwbXMgb3IgMS0xLjUlXHJcbiAgICAgICAgc2NvcGVbdmFsdWVJZGVudGlmaWVyXSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIHNjb3BlW2tleUlkZW50aWZpZXJdID0ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzY29wZS4kaW5kZXggPSBpbmRleDtcclxuICAgICAgICBzY29wZS4kZmlyc3QgPSAoaW5kZXggPT09IDApO1xyXG4gICAgICAgIHNjb3BlLiRsYXN0ID0gKGluZGV4ID09PSAoYXJyYXlMZW5ndGggLSAxKSk7XHJcbiAgICAgICAgc2NvcGUuJG1pZGRsZSA9ICEoc2NvcGUuJGZpcnN0IHx8IHNjb3BlLiRsYXN0KTtcclxuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogZmFsc2VcclxuICAgICAgICBzY29wZS4kb2RkID0gIShzY29wZS4kZXZlbiA9IChpbmRleCAmIDEpID09PSAwKTtcclxuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjb25zdCBnZXRCbG9ja1N0YXJ0ID0gZnVuY3Rpb24oYmxvY2spIHtcclxuICAgIC8vICAgICByZXR1cm4gYmxvY2suY2xvbmVbMF07XHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbnN0IGdldEJsb2NrRW5kID0gZnVuY3Rpb24oYmxvY2spIHtcclxuICAgIC8vICAgICByZXR1cm4gYmxvY2suY2xvbmVbYmxvY2suY2xvbmUubGVuZ3RoIC0gMV07XHJcbiAgICAvLyB9O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiAnbmdSZXBlYXQnLFxyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0ICRzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaCgvXlxccyooW1xcc1xcU10rPylcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK2FzXFxzKyhbXFxzXFxTXSs/KSk/KD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzKiQvKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiRXhwZWN0ZWQgZXhwcmVzc2lvbiBpbiBmb3JtIG9mICdfaXRlbV8gaW4gX2NvbGxlY3Rpb25fWyB0cmFjayBieSBfaWRfXScgYnV0IGdvdCAnXCIsIGV4cHJlc3Npb24sIFwiJ1wiXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbGhzID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgIHZhciByaHMgPSBtYXRjaFsyXTtcclxuICAgICAgICAgICAgdmFyIGFsaWFzQXMgPSBtYXRjaFszXTtcclxuICAgICAgICAgICAgdmFyIHRyYWNrQnlFeHAgPSBtYXRjaFs0XTtcclxuICAgICAgICAgICAgbWF0Y2ggPSBsaHMubWF0Y2goL14oPzooXFxzKltcXCRcXHddKyl8XFwoXFxzKihbXFwkXFx3XSspXFxzKixcXHMqKFtcXCRcXHddKylcXHMqXFwpKSQvKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiJ19pdGVtXycgaW4gJ19pdGVtXyBpbiBfY29sbGVjdGlvbl8nIHNob3VsZCBiZSBhbiBpZGVudGlmaWVyIG9yICcoX2tleV8sIF92YWx1ZV8pJyBleHByZXNzaW9uLCBidXQgZ290ICdcIiwgbGhzLCBcIidcIl0uam9pbignJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHZhbHVlSWRlbnRpZmllciA9IG1hdGNoWzNdIHx8IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICB2YXIga2V5SWRlbnRpZmllciA9IG1hdGNoWzJdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFsaWFzQXMgJiYgKCEvXlskYS16QS1aX11bJGEtekEtWjAtOV9dKiQvLnRlc3QoYWxpYXNBcykgfHxcclxuICAgICAgICAgICAgICAgICAgICAvXihudWxsfHVuZGVmaW5lZHx0aGlzfFxcJGluZGV4fFxcJGZpcnN0fFxcJG1pZGRsZXxcXCRsYXN0fFxcJGV2ZW58XFwkb2RkfFxcJHBhcmVudHxcXCRyb290fFxcJGlkKSQvLnRlc3QoYWxpYXNBcykpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCJhbGlhcyAnXCIsIGFsaWFzQXMsIFwiJyBpcyBpbnZhbGlkIC0tLSBtdXN0IGJlIGEgdmFsaWQgSlMgaWRlbnRpZmllciB3aGljaCBpcyBub3QgYSByZXNlcnZlZCBuYW1lLlwiXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdHJhY2tCeUV4cEdldHRlciwgdHJhY2tCeUlkRXhwRm4sIHRyYWNrQnlJZEFycmF5Rm4sIHRyYWNrQnlJZE9iakZuO1xyXG4gICAgICAgICAgICB2YXIgaGFzaEZuTG9jYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgJGlkOiBoYXNoS2V5XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodHJhY2tCeUV4cCkge1xyXG4gICAgICAgICAgICAgICAgdHJhY2tCeUV4cEdldHRlciA9ICRwYXJzZSh0cmFja0J5RXhwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEFycmF5Rm4gPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc2hLZXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZE9iakZuID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYWNrQnlFeHBHZXR0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEV4cEZuID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24ga2V5LCB2YWx1ZSwgYW5kICRpbmRleCB0byB0aGUgbG9jYWxzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBpbiBoYXNoIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fsc1trZXlJZGVudGlmaWVyXSA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzW3ZhbHVlSWRlbnRpZmllcl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBoYXNoRm5Mb2NhbHMuJGluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrQnlFeHBHZXR0ZXIoJHNjb3BlLCBoYXNoRm5Mb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbGFzdEJsb2NrTWFwID0gY3JlYXRlTWFwKCk7XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICB0b0FkZDogW10sXHJcbiAgICAgICAgICAgICAgICB0b1JlbW92ZTogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlciA9ICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKHJocywgZnVuY3Rpb24gbmdSZXBlYXRBY3Rpb24oY29sbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQWRkOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICB0b1JlbW92ZTogW11cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXgsIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXAgPSBjcmVhdGVNYXAoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSwgdmFsdWUsIC8vIGtleS92YWx1ZSBvZiBpdGVyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4sXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMsXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2ssIC8vIGxhc3Qgb2JqZWN0IGluZm9ybWF0aW9uIHtzY29wZSwgZWxlbWVudCwgaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZTtcclxuICAgICAgICAgICAgICAgIGlmIChhbGlhc0FzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlW2FsaWFzQXNdID0gY29sbGVjdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gY29sbGVjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbiA9IHRyYWNrQnlJZEV4cEZuIHx8IHRyYWNrQnlJZEFycmF5Rm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuID0gdHJhY2tCeUlkRXhwRm4gfHwgdHJhY2tCeUlkT2JqRm47XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0LCBleHRyYWN0IGtleXMsIGluIGVudW1lcmF0aW9uIG9yZGVyLCB1bnNvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlbUtleSBpbiBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbGxlY3Rpb24sIGl0ZW1LZXkpICYmIGl0ZW1LZXkuY2hhckF0KDApICE9PSAnJCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzLnB1c2goaXRlbUtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoID0gY29sbGVjdGlvbktleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIgPSBuZXcgQXJyYXkoY29sbGVjdGlvbkxlbmd0aCk7IC8vIGxvY2F0ZSBleGlzdGluZyBpdGVtc1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgY29sbGVjdGlvbkxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IChjb2xsZWN0aW9uID09PSBjb2xsZWN0aW9uS2V5cykgPyBpbmRleCA6IGNvbGxlY3Rpb25LZXlzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbGxlY3Rpb25ba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWQgPSB0cmFja0J5SWRGbihrZXksIHZhbHVlLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RCbG9ja01hcFt0cmFja0J5SWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIHByZXZpb3VzbHkgc2VlbiBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jayA9IGxhc3RCbG9ja01hcFt0cmFja0J5SWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcFt0cmFja0J5SWRdID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyW2luZGV4XSA9IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY29sbGlzaW9uIGRldGVjdGVkLiByZXN0b3JlIGxhc3RCbG9ja01hcCBhbmQgdGhyb3cgYW4gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG5leHRCbG9ja09yZGVyLCBmdW5jdGlvbihibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmIGJsb2NrLnNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEJsb2NrTWFwW2Jsb2NrLmlkXSA9IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgW1wiRHVwbGljYXRlcyBpbiBhIHJlcGVhdGVyIGFyZSBub3QgYWxsb3dlZC4gVXNlICd0cmFjayBieScgZXhwcmVzc2lvbiB0byBzcGVjaWZ5IHVuaXF1ZSBrZXlzLiBSZXBlYXRlcjogXCIsIGV4cHJlc3Npb24sIFwiLCBEdXBsaWNhdGUga2V5OiBcIiwgdHJhY2tCeUlkLCBcIiwgRHVwbGljYXRlIHZhbHVlOiBcIiwgdmFsdWVdLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBuZXZlciBiZWZvcmUgc2VlbiBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUudG9BZGQucHVzaChuZXh0QmxvY2tPcmRlcltpbmRleF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdHJhY2tCeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KHZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcFt0cmFja0J5SWRdID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gLy8gcmVtb3ZlIGxlZnRvdmVyIGl0ZW1zXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBibG9ja0tleSBpbiBsYXN0QmxvY2tNYXApIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUudG9SZW1vdmUucHVzaChibG9jayA9IGxhc3RCbG9ja01hcFtibG9ja0tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmUgPSBnZXRCbG9ja05vZGVzKGJsb2NrLmNsb25lKTtcclxuICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZS5sZWF2ZShlbGVtZW50c1RvUmVtb3ZlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNUb1JlbW92ZVswXS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IHdhcyBub3QgcmVtb3ZlZCB5ZXQgYmVjYXVzZSBvZiBwZW5kaW5nIGFuaW1hdGlvbiwgbWFyayBpdCBhcyBkZWxldGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGlnbm9yZSBpdCBsYXRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gZWxlbWVudHNUb1JlbW92ZS5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvUmVtb3ZlW2luZGV4XVtOR19SRU1PVkVEXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suc2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH0gLy8gd2UgYXJlIG5vdCB1c2luZyBmb3JFYWNoIGZvciBwZXJmIHJlYXNvbnMgKHRyeWluZyB0byBhdm9pZCAjY2FsbClcclxuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNvbGxlY3Rpb25MZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPSAoY29sbGVjdGlvbiA9PT0gY29sbGVjdGlvbktleXMpID8gaW5kZXggOiBjb2xsZWN0aW9uS2V5c1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xsZWN0aW9uW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBuZXh0QmxvY2tPcmRlcltpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNjb3BlKGJsb2NrLnNjb3BlLCBpbmRleCwgdmFsdWVJZGVudGlmaWVyLCB2YWx1ZSwga2V5SWRlbnRpZmllciwga2V5LCBjb2xsZWN0aW9uTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QmxvY2tNYXAgPSBuZXh0QmxvY2tNYXA7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmbihsYXN0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0IHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCBBdHRyaWJ1dGVzIGZyb20gJy4vLi4vY29udHJvbGxlci9hdHRyaWJ1dGUuanMnO1xyXG52YXIgZGlyZWN0aXZlSGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsZXQgcHJvdG8gPSBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlIHx8IGFuZ3VsYXIuZWxlbWVudC5fX3Byb3RvX187XHJcbiAgICBwcm90by4kZmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHtcclxuICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpc1tpbmRleF0ucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xyXG4gICAgfTtcclxuICAgIHByb3RvLiRjbGljayA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctY2xpY2snKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHByb3RvLiR0ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLmRhdGEoJ25nLW1vZGVsJykgfHwgdGhpcy5kYXRhKCduZy1iaW5kJykgfHwgdGhpcy5kYXRhKCduZy10cmFuc2xhdGUnKSB8fCB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0ICYmIHRleHQuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBwcm90by4kaWYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgbmdJZiA9IHRoaXMuZGF0YSgnbmctaWYnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5nSWYgJiYgbmdJZi52YWx1ZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBqb2luKG9iaikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgb2JqLmRhdGEoZGlyZWN0aXZlLm5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlLmF0dGFjaFRvRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBhbmd1bGFyLmVsZW1lbnQob2JqKSwgbmV3IEF0dHJpYnV0ZXMob2JqKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iai5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoY2hpbGRyZW5zW2lpXSwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb250cm9sKGNvbnRyb2xsZXJTZXJ2aWNlLCBvYmopIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCAhY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBpbGUoY3VycmVudCwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb250cm9sO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIHRvQ2FtZWxDYXNlLFxyXG4gICAgdG9TbmFrZUNhc2UsXHJcbiAgICB0cmltXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxuZnVuY3Rpb24gQXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzVG9Db3B5KSB7XHJcbiAgICBpZiAoYXR0cmlidXRlc1RvQ29weSkge1xyXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlc1RvQ29weSk7XHJcbiAgICAgICAgdmFyIGksIGwsIGtleTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGF0dHJpYnV0ZXNUb0NvcHlba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGF0dHIgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiQkZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuY29uc3QgJGFuaW1hdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckYW5pbWF0ZScpO1xyXG5jb25zdCAkJHNhbml0aXplVXJpID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJCRzYW5pdGl6ZVVyaScpO1xyXG5BdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG5vcm1hbGl6ZVxyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnZlcnRzIGFuIGF0dHJpYnV0ZSBuYW1lIChlLmcuIGRhc2gvY29sb24vdW5kZXJzY29yZS1kZWxpbWl0ZWQgc3RyaW5nLCBvcHRpb25hbGx5IHByZWZpeGVkIHdpdGggYHgtYCBvclxyXG4gICAgICogYGRhdGEtYCkgdG8gaXRzIG5vcm1hbGl6ZWQsIGNhbWVsQ2FzZSBmb3JtLlxyXG4gICAgICpcclxuICAgICAqIEFsc28gdGhlcmUgaXMgc3BlY2lhbCBjYXNlIGZvciBNb3ogcHJlZml4IHN0YXJ0aW5nIHdpdGggdXBwZXIgY2FzZSBsZXR0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogRm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24gY2hlY2sgb3V0IHRoZSBndWlkZSBvbiB7QGxpbmsgZ3VpZGUvZGlyZWN0aXZlI21hdGNoaW5nLWRpcmVjdGl2ZXMgTWF0Y2hpbmcgRGlyZWN0aXZlc31cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIHRvIG5vcm1hbGl6ZVxyXG4gICAgICovXHJcbiAgICAkbm9ybWFsaXplOiB0b0NhbWVsQ2FzZSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkYWRkQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBBZGRzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgdG8gdGhlIGVsZW1lbnQuIElmIGFuaW1hdGlvbnNcclxuICAgICAqIGFyZSBlbmFibGVkIHRoZW4gYW4gYW5pbWF0aW9uIHdpbGwgYmUgdHJpZ2dlcmVkIGZvciB0aGUgY2xhc3MgYWRkaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzVmFsIFRoZSBjbGFzc05hbWUgdmFsdWUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgICRhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NWYWwpIHtcclxuICAgICAgICBpZiAoY2xhc3NWYWwgJiYgY2xhc3NWYWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCwgY2xhc3NWYWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkcmVtb3ZlQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgZnJvbSB0aGUgZWxlbWVudC4gSWZcclxuICAgICAqIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQgdGhlbiBhbiBhbmltYXRpb24gd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoZSBjbGFzcyByZW1vdmFsLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ZhbCBUaGUgY2xhc3NOYW1lIHZhbHVlIHRoYXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgJHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc1ZhbCkge1xyXG4gICAgICAgIGlmIChjbGFzc1ZhbCAmJiBjbGFzc1ZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCBjbGFzc1ZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyR1cGRhdGVDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIEFkZHMgYW5kIHJlbW92ZXMgdGhlIGFwcHJvcHJpYXRlIENTUyBjbGFzcyB2YWx1ZXMgdG8gdGhlIGVsZW1lbnQgYmFzZWQgb24gdGhlIGRpZmZlcmVuY2VcclxuICAgICAqIGJldHdlZW4gdGhlIG5ldyBhbmQgb2xkIENTUyBjbGFzcyB2YWx1ZXMgKHNwZWNpZmllZCBhcyBuZXdDbGFzc2VzIGFuZCBvbGRDbGFzc2VzKS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3Q2xhc3NlcyBUaGUgY3VycmVudCBDU1MgY2xhc3NOYW1lIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkQ2xhc3NlcyBUaGUgZm9ybWVyIENTUyBjbGFzc05hbWUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgJHVwZGF0ZUNsYXNzOiBmdW5jdGlvbihuZXdDbGFzc2VzLCBvbGRDbGFzc2VzKSB7XHJcbiAgICAgICAgdmFyIHRvQWRkID0gdG9rZW5EaWZmZXJlbmNlKG5ld0NsYXNzZXMsIG9sZENsYXNzZXMpO1xyXG4gICAgICAgIGlmICh0b0FkZCAmJiB0b0FkZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsIHRvQWRkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0b1JlbW92ZSA9IHRva2VuRGlmZmVyZW5jZShvbGRDbGFzc2VzLCBuZXdDbGFzc2VzKTtcclxuICAgICAgICBpZiAodG9SZW1vdmUgJiYgdG9SZW1vdmUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCB0b1JlbW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIG5vcm1hbGl6ZWQgYXR0cmlidXRlIG9uIHRoZSBlbGVtZW50IGluIGEgd2F5IHN1Y2ggdGhhdCBhbGwgZGlyZWN0aXZlc1xyXG4gICAgICogY2FuIHNoYXJlIHRoZSBhdHRyaWJ1dGUuIFRoaXMgZnVuY3Rpb24gcHJvcGVybHkgaGFuZGxlcyBib29sZWFuIGF0dHJpYnV0ZXMuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xib29sZWFufSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LiBJZiBgbnVsbGAgYXR0cmlidXRlIHdpbGwgYmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHdyaXRlQXR0ciBJZiBmYWxzZSwgZG9lcyBub3Qgd3JpdGUgdGhlIHZhbHVlIHRvIERPTSBlbGVtZW50IGF0dHJpYnV0ZS5cclxuICAgICAqICAgICBEZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBhdHRyTmFtZSBPcHRpb25hbCBub25lIG5vcm1hbGl6ZWQgbmFtZS4gRGVmYXVsdHMgdG8ga2V5LlxyXG4gICAgICovXHJcbiAgICAkc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlLCB3cml0ZUF0dHIsIGF0dHJOYW1lKSB7XHJcbiAgICAgICAgLy8gVE9ETzogZGVjaWRlIHdoZXRoZXIgb3Igbm90IHRvIHRocm93IGFuIGVycm9yIGlmIFwiY2xhc3NcIlxyXG4gICAgICAgIC8vaXMgc2V0IHRocm91Z2ggdGhpcyBmdW5jdGlvbiBzaW5jZSBpdCBtYXkgY2F1c2UgJHVwZGF0ZUNsYXNzIHRvXHJcbiAgICAgICAgLy9iZWNvbWUgdW5zdGFibGUuXHJcblxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy4kJGVsZW1lbnRbMF0sXHJcbiAgICAgICAgICAgIGJvb2xlYW5LZXkgPSBhbmd1bGFyLmdldEJvb2xlYW5BdHRyTmFtZShub2RlLCBrZXkpLFxyXG4gICAgICAgICAgICBhbGlhc2VkS2V5ID0gYW5ndWxhci5nZXRBbGlhc2VkQXR0ck5hbWUoa2V5KSxcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBrZXksXHJcbiAgICAgICAgICAgIG5vZGVOYW1lO1xyXG5cclxuICAgICAgICBpZiAoYm9vbGVhbktleSkge1xyXG4gICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5wcm9wKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICBhdHRyTmFtZSA9IGJvb2xlYW5LZXk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbGlhc2VkS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXNbYWxpYXNlZEtleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBhbGlhc2VkS2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBub3JtYWxpemVkIGtleSB0byBhY3R1YWwga2V5XHJcbiAgICAgICAgaWYgKGF0dHJOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGF0dHJba2V5XSA9IGF0dHJOYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGF0dHJOYW1lID0gdGhpcy4kYXR0cltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIWF0dHJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRhdHRyW2tleV0gPSBhdHRyTmFtZSA9IHRvU25ha2VDYXNlKGtleSwgJy0nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm9kZU5hbWUgPSBub2RlTmFtZV8odGhpcy4kJGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBpZiAoKG5vZGVOYW1lID09PSAnYScgJiYgKGtleSA9PT0gJ2hyZWYnIHx8IGtleSA9PT0gJ3hsaW5rSHJlZicpKSB8fFxyXG4gICAgICAgICAgICAobm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyYycpKSB7XHJcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGFbaHJlZl0gYW5kIGltZ1tzcmNdIHZhbHVlc1xyXG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZSA9ICQkc2FuaXRpemVVcmkodmFsdWUsIGtleSA9PT0gJ3NyYycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyY3NldCcgJiYgYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGltZ1tzcmNzZXRdIHZhbHVlc1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpcnN0IGNoZWNrIGlmIHRoZXJlIGFyZSBzcGFjZXMgYmVjYXVzZSBpdCdzIG5vdCB0aGUgc2FtZSBwYXR0ZXJuXHJcbiAgICAgICAgICAgIHZhciB0cmltbWVkU3Jjc2V0ID0gdHJpbSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICggICA5OTl4ICAgLHwgICA5OTl3ICAgLHwgICAsfCwgICApXHJcbiAgICAgICAgICAgIHZhciBzcmNQYXR0ZXJuID0gLyhcXHMrXFxkK3hcXHMqLHxcXHMrXFxkK3dcXHMqLHxcXHMrLHwsXFxzKykvO1xyXG4gICAgICAgICAgICB2YXIgcGF0dGVybiA9IC9cXHMvLnRlc3QodHJpbW1lZFNyY3NldCkgPyBzcmNQYXR0ZXJuIDogLygsKS87XHJcblxyXG4gICAgICAgICAgICAvLyBzcGxpdCBzcmNzZXQgaW50byB0dXBsZSBvZiB1cmkgYW5kIGRlc2NyaXB0b3IgZXhjZXB0IGZvciB0aGUgbGFzdCBpdGVtXHJcbiAgICAgICAgICAgIHZhciByYXdVcmlzID0gdHJpbW1lZFNyY3NldC5zcGxpdChwYXR0ZXJuKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHR1cGxlc1xyXG4gICAgICAgICAgICB2YXIgbmJyVXJpc1dpdGgycGFydHMgPSBNYXRoLmZsb29yKHJhd1VyaXMubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmJyVXJpc1dpdGgycGFydHM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlubmVySWR4ID0gaSAqIDI7XHJcbiAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgdXJpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJCRzYW5pdGl6ZVVyaSh0cmltKHJhd1VyaXNbaW5uZXJJZHhdKSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGRlc2NyaXB0b3JcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoXCIgXCIgKyB0cmltKHJhd1VyaXNbaW5uZXJJZHggKyAxXSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzcGxpdCB0aGUgbGFzdCBpdGVtIGludG8gdXJpIGFuZCBkZXNjcmlwdG9yXHJcbiAgICAgICAgICAgIHZhciBsYXN0VHVwbGUgPSB0cmltKHJhd1VyaXNbaSAqIDJdKS5zcGxpdCgvXFxzLyk7XHJcblxyXG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgbGFzdCB1cmlcclxuICAgICAgICAgICAgcmVzdWx0ICs9ICQkc2FuaXRpemVVcmkodHJpbShsYXN0VHVwbGVbMF0pLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuZCBhZGQgdGhlIGxhc3QgZGVzY3JpcHRvciBpZiBhbnlcclxuICAgICAgICAgICAgaWYgKGxhc3RUdXBsZS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoXCIgXCIgKyB0cmltKGxhc3RUdXBsZVsxXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdyaXRlQXR0ciAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5yZW1vdmVBdHRyKGF0dHJOYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChTSU1QTEVfQVRUUl9OQU1FLnRlc3QoYXR0ck5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kJGVsZW1lbnQuYXR0cihhdHRyTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRTcGVjaWFsQXR0cih0aGlzLiQkZWxlbWVudFswXSwgYXR0ck5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmlyZSBvYnNlcnZlcnNcclxuICAgICAgICB2YXIgJCRvYnNlcnZlcnMgPSB0aGlzLiQkb2JzZXJ2ZXJzO1xyXG4gICAgICAgIGlmICgkJG9ic2VydmVycykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJCRvYnNlcnZlcnNbb2JzZXJ2ZXJdLCBmdW5jdGlvbihmbikge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBmbih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG9ic2VydmVcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBPYnNlcnZlcyBhbiBpbnRlcnBvbGF0ZWQgYXR0cmlidXRlLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBvYnNlcnZlciBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgb25jZSBkdXJpbmcgdGhlIG5leHQgYCRkaWdlc3RgIGZvbGxvd2luZ1xyXG4gICAgICogY29tcGlsYXRpb24uIFRoZSBvYnNlcnZlciBpcyB0aGVuIGludm9rZWQgd2hlbmV2ZXIgdGhlIGludGVycG9sYXRlZCB2YWx1ZVxyXG4gICAgICogY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpIC5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oaW50ZXJwb2xhdGVkVmFsdWUpfSBmbiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyXHJcbiAgICAgICAgICAgICAgdGhlIGludGVycG9sYXRlZCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGNoYW5nZXMuXHJcbiAgICAgKiAgICAgICAgU2VlIHRoZSB7QGxpbmsgZ3VpZGUvaW50ZXJwb2xhdGlvbiNob3ctdGV4dC1hbmQtYXR0cmlidXRlLWJpbmRpbmdzLXdvcmsgSW50ZXJwb2xhdGlvblxyXG4gICAgICogICAgICAgIGd1aWRlfSBmb3IgbW9yZSBpbmZvLlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9uKCl9IFJldHVybnMgYSBkZXJlZ2lzdHJhdGlvbiBmdW5jdGlvbiBmb3IgdGhpcyBvYnNlcnZlci5cclxuICAgICAqL1xyXG4gICAgJG9ic2VydmU6IGZ1bmN0aW9uKGtleSwgZm4pIHtcclxuICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLFxyXG4gICAgICAgICAgICAkJG9ic2VydmVycyA9IChhdHRycy4kJG9ic2VydmVycyB8fCAoYXR0cnMuJCRvYnNlcnZlcnMgPSBuZXcgTWFwKCkpKSxcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gKCQkb2JzZXJ2ZXJzW2tleV0gfHwgKCQkb2JzZXJ2ZXJzW2tleV0gPSBbXSkpO1xyXG5cclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChmbik7XHJcbiAgICAgICAgc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycy4kJGludGVyICYmIGF0dHJzLmhhc093blByb3BlcnR5KGtleSkgJiYgIWFuZ3VsYXIuaXNVbmRlZmluZWQoYXR0cnNba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vIG9uZSByZWdpc3RlcmVkIGF0dHJpYnV0ZSBpbnRlcnBvbGF0aW9uIGZ1bmN0aW9uLCBzbyBsZXRzIGNhbGwgaXQgbWFudWFsbHlcclxuICAgICAgICAgICAgICAgIGZuKGF0dHJzW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5hcnJheVJlbW92ZShsaXN0ZW5lcnMsIGZuKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gdG9rZW5EaWZmZXJlbmNlKHN0cjEsIHN0cjIpIHtcclxuXHJcbiAgICB2YXIgdmFsdWVzID0gJycsXHJcbiAgICAgICAgdG9rZW5zMSA9IHN0cjEuc3BsaXQoL1xccysvKSxcclxuICAgICAgICB0b2tlbnMyID0gc3RyMi5zcGxpdCgvXFxzKy8pO1xyXG5cclxuICAgIG91dGVyOlxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSB0b2tlbnMxW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0b2tlbnMyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPT09IHRva2VuczJbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsdWVzICs9ICh2YWx1ZXMubGVuZ3RoID4gMCA/ICcgJyA6ICcnKSArIHRva2VuO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vZGVOYW1lXyhlbGVtZW50KSB7XHJcbiAgICBjb25zdCBteUVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF07XHJcbiAgICBpZiAobXlFbGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG15RWxlbS5ub2RlTmFtZTtcclxuICAgIH1cclxufVxyXG52YXIgc3BlY2lhbEF0dHJIb2xkZXIgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBTSU1QTEVfQVRUUl9OQU1FID0gL15cXHcvO1xyXG5cclxuZnVuY3Rpb24gc2V0U3BlY2lhbEF0dHIoZWxlbWVudCwgYXR0ck5hbWUsIHZhbHVlKSB7XHJcbiAgICAvLyBBdHRyaWJ1dGVzIG5hbWVzIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggbGV0dGVycyAoc3VjaCBhcyBgKGNsaWNrKWApIGNhbm5vdCBiZSBzZXQgdXNpbmcgYHNldEF0dHJpYnV0ZWBcclxuICAgIC8vIHNvIHdlIGhhdmUgdG8ganVtcCB0aHJvdWdoIHNvbWUgaG9vcHMgdG8gZ2V0IHN1Y2ggYW4gYXR0cmlidXRlXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL3B1bGwvMTMzMThcclxuICAgIHNwZWNpYWxBdHRySG9sZGVyLmlubmVySFRNTCA9IFwiPHNwYW4gXCIgKyBhdHRyTmFtZSArIFwiPlwiO1xyXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzcGVjaWFsQXR0ckhvbGRlci5maXJzdENoaWxkLmF0dHJpYnV0ZXM7XHJcbiAgICB2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1swXTtcclxuICAgIC8vIFdlIGhhdmUgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSBpdHMgY29udGFpbmVyIGVsZW1lbnQgYmVmb3JlIHdlIGNhbiBhZGQgaXQgdG8gdGhlIGRlc3RpbmF0aW9uIGVsZW1lbnRcclxuICAgIGF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKGF0dHJpYnV0ZS5uYW1lKTtcclxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShhdHRyaWJ1dGUpO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEF0dHJpYnV0ZXM7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9hdHRyaWJ1dGUuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgaXNFeHByZXNzaW9uLFxyXG4gICAgZXhwcmVzc2lvblNhbml0aXplclxyXG59IGZyb20gJy4vY29tbW9uLmpzJztcclxuXHJcbmNvbnN0ICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICAgICAgYmluZGluZ3MgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJz0nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMoYmluZGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSAkcGFyc2UocGFyZW50R2V0KHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAobG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhwID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNFeHAgPSBpc0V4cHJlc3Npb24oZXhwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJHBhcnNlKGV4cHJlc3Npb25TYW5pdGl6ZXIoZXhwKSkoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBpc29sYXRlU2NvcGUsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbkJpbmRpbmdzID0gKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBtb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlIHx8ICc9JztcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKG1vZGUpO1xyXG4gICAgICAgICAgICBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEtleSA9IGNvbnRyb2xsZXJBcyArICcuJyArIGtleTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICc9JzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQCc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhwID0gaXNFeHByZXNzaW9uKHNjb3BlW3BhcmVudEtleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSwgaXNvbGF0ZVNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSBzY29wZUhlbHBlci5jcmVhdGUoaXNvbGF0ZVNjb3BlIHx8IHNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgaWYgKCFiaW5kaW5ncykge1xyXG4gICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBhbmd1bGFyLmlzU3RyaW5nKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyA9PT0gJz0nKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWtleS5zdGFydHNXaXRoKCckJykgJiYga2V5ICE9PSBjb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBiaW5kaW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93ICdDb3VsZCBub3QgcGFyc2UgYmluZGluZ3MnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAkZ2V0KG1vZHVsZU5hbWVzKSB7XHJcbiAgICAgICAgbGV0ICRjb250cm9sbGVyO1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gbWFrZUFycmF5KG1vZHVsZU5hbWVzKTtcclxuICAgICAgICAvLyBjb25zdCBpbmRleE1vY2sgPSBhcnJheS5pbmRleE9mKCduZ01vY2snKTtcclxuICAgICAgICAvLyBjb25zdCBpbmRleE5nID0gYXJyYXkuaW5kZXhPZignbmcnKTtcclxuICAgICAgICAvLyBpZiAoaW5kZXhNb2NrICE9PSAtMSkge1xyXG4gICAgICAgIC8vICAgICBhcnJheVtpbmRleE1vY2tdID0gJ25nJztcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gaWYgKGluZGV4TmcgPT09IC0xKSB7XHJcbiAgICAgICAgLy8gICAgIGFycmF5LnB1c2goJ25nJyk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGFuZ3VsYXIuaW5qZWN0b3IoYXJyYXkpLmludm9rZShcclxuICAgICAgICAgICAgWyckY29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAoY29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIHNjb3BlLCBiaW5kaW5ncywgc2NvcGVDb250cm9sbGVyTmFtZSwgZXh0ZW5kZWRMb2NhbHMpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpO1xyXG4gICAgICAgICAgICBzY29wZUNvbnRyb2xsZXJOYW1lID0gc2NvcGVDb250cm9sbGVyTmFtZSB8fCAnY29udHJvbGxlcic7XHJcbiAgICAgICAgICAgIGxldCBsb2NhbHMgPSBleHRlbmQoZXh0ZW5kZWRMb2NhbHMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKS4kbmV3KClcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSAkY29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgbG9jYWxzLCB0cnVlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGV4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgY29udHJvbGxlci5nZXRWYWx1ZXMoc2NvcGUsIGJpbmRpbmdzKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzID0gKGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gYiB8fCBiaW5kaW5ncztcclxuICAgICAgICAgICAgICAgIC8vIGxvY2FscyA9IG15TG9jYWxzIHx8IGxvY2FscztcclxuICAgICAgICAgICAgICAgIC8vIGIgPSBiIHx8IGJpbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgLy9leHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGV4dGVuZGVkTG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlQ29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanMnO1xyXG5cclxudmFyIGNvbnRyb2xsZXJIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICBsZXQgbXlNb2R1bGVzLCBjdHJsTmFtZSwgY0xvY2FscywgcFNjb3BlLCBjU2NvcGUsIGNOYW1lLCBiaW5kVG9Db250cm9sbGVyO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhbigpIHtcclxuICAgICAgICBteU1vZHVsZXMgPSBbXTtcclxuICAgICAgICBjdHJsTmFtZSA9IHBTY29wZSA9IGNMb2NhbHMgPSBjU2NvcGUgPSBiaW5kVG9Db250cm9sbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gJGNvbnRyb2xsZXJIYW5kbGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoIWN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQbGVhc2UgcHJvdmlkZSB0aGUgY29udHJvbGxlclxcJ3MgbmFtZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xyXG4gICAgICAgIGlmICghY1Njb3BlKSB7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHBTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgfSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBTY29wZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNTY29wZSA9IHRlbXBTY29wZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xyXG4gICAgICAgIGNsZWFuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24oYmluZGluZ3MpIHtcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSAkX0NPTlRST0xMRVI7XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uKG5ld1Njb3BlKSB7XHJcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgY0xvY2FscyA9IGxvY2FscztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoW21vZHVsZXNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShtb2R1bGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmlzSW50ZXJuYWwgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVybmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIHNjb3BlQ29udHJvbGxlcnNOYW1lLCBwYXJlbnRTY29wZSwgY2hpbGRTY29wZSkge1xyXG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xyXG4gICAgICAgICAgICBjTmFtZSA9ICdjb250cm9sbGVyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3U2VydmljZSA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyhjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSk7XHJcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCB3aGljaCByZXR1cm4gYSBjb250cm9sbGVyIGdlbmVyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLiRnZXQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlci4kZ2V0KCduZycpLmNyZWF0ZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCckZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJDcmVhdG9yO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJDcmVhdG9yID0gY29udHJvbGxlci4kZ2V0KCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5uYW1lKS50b0JlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250cm9sbGVycyB3aXRoIGluamVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEluamVjdGlvbnMnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS4kcSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgYSBjb250cm9sbGVyIHdpdGggYW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge30pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhIHByb3BlcnR5IGluIHRoZSBzY29wZSBmb3IgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLiQkY2hpbGRIZWFkLmNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlciB3aXRoIHRoZSBnaXZlbiBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCBzY29wZSwgZmFsc2UsICdteUNvbnRyb2xsZXInKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQubXlDb250cm9sbGVyKS50b0JlKGNvbnRyb2xsZXIxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IFwidHJ1ZVwiIGFuZCBcIj1cIiBhcyBiaW5kVG9Db250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSwgJz0nKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmluZCBpZiBiaW5kVG9Db250cm9sbGVyIGlzIFwiZmFsc2VcIiBvciBcInVuZGVmaW5lZFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMS5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgndW5kZWZpbmVkIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVzY3JpYmUoJ2JpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCI9XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiQFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ0AnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5ib3VuZFByb3BlcnR5KS50b0JlKCdTb21ldGhpbmcgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIiZcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdvdGhlclByb3BlcnR5LmpvaW4oXCJcIiknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbMSwgMiwgM11cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICcmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSgpKS50b0JlKCcxMjMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdleHByZXNzaW9ucyBzaG91bGQgYWxsb3cgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWydhJywgJ2InLCAnYyddXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRvQmUoJ2FiYycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuXHJcbmRlc2NyaWJlKCdjb250cm9sbGVySGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ215TW9kdWxlJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvbnRyb2xsZXJIYW5kbGVyIHdoZW4gYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKSkudG9CZShjb250cm9sbGVySGFuZGxlcik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iaikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlLiRwYXJlbnQpLnRvQmUoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai51c2VkTW9kdWxlcykudG9FcXVhbChbJ3Rlc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNyZWF0ZSgpKS50b0JlKGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBiaW5kaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsczogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHQ6ICdieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246ICdieVRleHQudG9VcHBlckNhc2UoKSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVhbHNSZXN1bHQ6ICc9ZXF1YWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHRSZXN1bHQ6ICdAYnlUZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uUmVzdWx0OiAnJmV4cHJlc3Npb24nXHJcbiAgICAgICAgICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXF1YWxzUmVzdWx0KS50b0JlKHNjb3BlLmVxdWFscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5ieVRleHRSZXN1bHQpLnRvQmUoc2NvcGUuYnlUZXh0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmV4cHJlc3Npb25SZXN1bHQoKSkudG9CZShzY29wZS5ieVRleHQudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ1dhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzY29wZSwgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyB3YXRjaGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJncykudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIGNvbnRyb2xsZXIgaW50byB0aGUgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ2xvbG8nKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIHNjb3BlIGludG8gdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZ2l2ZSB0aGUgcGFyZW50IHNjb3BlIHByaXZpbGVnZSBvdmVyIHRoZSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSA9ICdjaGlsZCc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgncGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZS5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlc3Ryb3lpbmcgdGhlIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIubmV3KCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJTcGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdW5pcXVlT2JqZWN0ID0gZnVuY3Rpb24gdW5pcXVlT2JqZWN0KCkge307XHJcbiAgICBsZXQgY29udHJvbGxlckNvbnN0cnVjdG9yO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgIGlmIChjb250cm9sbGVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgIGE6ICc9JyxcclxuICAgICAgICAgICAgYjogJ0AnLFxyXG4gICAgICAgICAgICBjOiAnJidcclxuICAgICAgICB9KS5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgIGE6IHVuaXF1ZU9iamVjdCxcclxuICAgICAgICAgICAgYjogJ2InLFxyXG4gICAgICAgICAgICBjOiAnYSdcclxuICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzcGllcyBmb3IgZWFjaCBCb3VuZGVkIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBteVNweSA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5JbnRlcm5hbFNwaWVzLlNjb3BlWydhOmEnXTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBteVNweS50b29rKCkgPT09ICdudW1iZXInKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS50b29rKCkpLnRvQmUobXlTcHkudG9vaygpKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanNcbiAqKi8iLCJyZXF1aXJlKCcuL2h0bWxDb21waWxhdGlvbicpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0NsaWNrLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0lmLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ01vZGVsLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ1RyYW5zbGF0ZS5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vbmdDbGljay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vbmdCaW5kLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0NsYXNzLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ1JlcGVhdC5zcGVjLmpzJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaW5kZXguanNcbiAqKi8iLCJyZXF1aXJlKCcuL25nQ2xpY2tIVE1MLnNwZWMnKTtcclxucmVxdWlyZSgnLi9uZ0lmSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdNb2RlbEhUTUwuc3BlYycpO1xyXG5yZXF1aXJlKCcuL25nQmluZEhUTUwuc3BlYycpO1xyXG5yZXF1aXJlKCcuL25nVHJhbnNsYXRlSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdDbGFzc0hUTUwuc3BlYycpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgbmctY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWNsaWNrPVwiY3RybC5hU3RyaW5nID0gXFwnYW5vdGhlclZhbHVlXFwnXCIvPicpO1xyXG4gICAgICAgIGhhbmRsZXIuJGNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGl0ZW0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuJGZpbmQoJ2EnKS4kY2xpY2soKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIGlmIHRoZSBzZWxlY3RlZCBkb2VzIG5vdCBoYXZlIHRoZSBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuJGNsaWNrKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhcHBseSB0aGUgY2xpY2sgZXZlbnQgdG8gZWFjaCBvZiBpdHMgY2hpbGRyZW5zIChpZiBuZWVkZWQpJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSxcclxuICAgICAgICAgICAgYCAgIDxkaXYgbmctY2xpY2s9XCJjdHJsLmFJbnQgPSBjdHJsLmFJbnQgKyAxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nZmlyc3QnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdzZWNvbmQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSd0aGlyZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Lz5gKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjZmlyc3QnKS4kY2xpY2soKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjc2Vjb25kJykuJGNsaWNrKCk7XHJcbiAgICAgICAgaGFuZGxlci4kZmluZCgnI3RoaXJkJykuJGNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgzKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscyAoZm9yIHRlc3RpbmcpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICBgICAgPGRpdiBuZy1jbGljaz1cImN0cmwuYUludCA9ICB2YWx1ZSArIGN0cmwuYUludCBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdmaXJzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3NlY29uZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3RoaXJkJz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYvPmApO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyNmaXJzdCcpLiRjbGljayh7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgxMDAwKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjc2Vjb25kJykuJGNsaWNrKHtcclxuICAgICAgICAgICAgdmFsdWU6ICcnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTAwMCcpO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyN0aGlyZCcpLiRjbGljayh7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTEwMDAnKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdDbGlja0hUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2lmJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyB0byBjYWxsIG5nSWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2PjxkaXYgbmctaWY9XCJjdHJsLmFCb29sZWFuXCIvPjwvZGl2PicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSB0aGUgZWxlbWVudHMgZnJvbSB0aGUgZG9tJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdj48ZGl2IG5nLWlmPVwiY3RybC5hQm9vbGVhblwiLz48L2Rpdj4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIHRoZSBlbGVtZW50cyBmcm9tIHRoZSBkb20nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2PjxkaXYgY2xhc3M9XCJteS1jbGFzc1wiIG5nLWlmPVwiY3RybC5hQm9vbGVhblwiLz48L2Rpdj4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmNoaWxkcmVuKCkubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRmaW5kKCdkaXYnKS5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IHRoZSB1c2FnZSBvZiBuZXN0ZWQgZGlyZWN0aXZlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXY+PGRpdiBjbGFzcz1cIm15LWNsYXNzXCIgbmctaWY9XCJjdHJsLmFCb29sZWFuXCI+PGJ1dHRvbiBuZy1jbGljaz1cImN0cmwuYUZ1bmN0aW9uKClcIi8+PC9kaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJ2J1dHRvbicpLiRjbGljaygpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgdXNpbmcgbmdJZiBvbiB0aGUgdG9wIGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IGNsYXNzPVwibXktY2xhc3NcIiBuZy1pZj1cImN0cmwuYUJvb2xlYW5cIi8+Jyk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIubGVuZ3RoKS50b0JlKDApO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYUJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiRpZigpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdJZkhUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ01vZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPScsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgdGV4dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctbW9kZWw9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJHRleHQoKSkudG9CZSgnYVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1tb2RlbD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBoYW5kbGVyLiR0ZXh0KCduZXdWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlLCBvbmUgbGV0dGVyIGF0IHRoZSB0aW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1tb2RlbD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaCgnY3RybC5hU3RyaW5nJywgc3B5KTtcclxuICAgICAgICBoYW5kbGVyLiR0ZXh0KCduZXdWYWx1ZScuc3BsaXQoJycpKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCduZXdWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgnbmV3VmFsdWUnLmxlbmd0aCk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nTW9kZWxIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2JpbmQnKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBub3QgdGhyb3cnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8cCBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgZGVmaW5lZCBuZ0JpbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPHAgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kdGV4dCkudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBhcyBqUXVlcnltZXRob2QgLnRleHQoKScsICgpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8cCBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZShoYW5kbGVyLiR0ZXh0KCkpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0JpbmRIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdUcmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdUSVRMRScsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmVwbGFjZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSB0cmFuc2xhdGF0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxzcGFuIHRyYW5zbGF0ZT1cIlRJVExFXCI+PGRpdj5zb21ldGhpbmc8L2RpPjwvc3Bhbj4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ0hlbGxvJyk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLmxlbmd0aCkudG9CZSgwKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHRoZSBjb250ZW50IGFmdGVyIGEgJGRpZ2VzdCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8c3BhbiB0cmFuc2xhdGU9XCJ7e2N0cmwuYUtleX19XCI+PGRpdj5zb21ldGhpbmc8L2RpPjwvc3Bhbj4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ3NvbWV0aGluZycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdUcmFuc2xhdGVIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGFzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGFzcycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFzU3RyaW5nOiAnbXktY2xhc3MgbXktb3RoZXItY2xhc3MnLFxyXG4gICAgICAgICAgICBmaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgc2Vjb25kOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzZXQgdGhlIGNsYXNzIGF0dHJpYnV0ZSAoYWZ0ZXIgJGRpZ2VzdCknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWNsYXNzPVwiY3RybC5hc1N0cmluZ1wiLz4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsYXNzSFRNTC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZUhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2RpcmVjdGl2ZUhhbmRsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChkaXJlY3RpdmVIYW5kbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNyZWF0ZSBuZXcgaW5zdGFuY2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcigpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBjb21waWxlIGh0bWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdi8+Jyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gXHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ2RpcmVjdGl2ZVByb3ZpZGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVQcm92aWRlci4kZ2V0KSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGFuZCBub3QgdGhyb3cgaXMgdGhlIGRpcmVjdGl2ZSBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCByZXR1cm5lZCA9IHt9O1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuZWQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdub3QgZXhpc3RpbmcnKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChyZXR1cm5lZCkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBbXHJcbiAgICAgICAgJ25nLWlmJyxcclxuICAgICAgICAnbmc6aWYnLFxyXG4gICAgICAgICduZ0lmJyxcclxuICAgICAgICAnbmctcmVwZWF0JyxcclxuICAgICAgICAnbmctY2xpY2snLFxyXG4gICAgICAgICduZy1kaXNhYmxlZCcsXHJcbiAgICAgICAgJ25nLWJpbmQnLFxyXG4gICAgICAgICduZy1tb2RlbCcsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZScsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZS12YWx1ZScsXHJcbiAgICAgICAgJ25nLWNsYXNzJ1xyXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsd2F5cyBjb250YWluIHRoZSAnICsgaXRlbSArICdkaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoaXRlbSkpLnRvQmVEZWZpbmVkKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3B1dHMgYW5kIHVzZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3B5O1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIHNweS5hbmQucmV0dXJuVmFsdWUoc3B5KTtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJGNsZWFuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhZGRpbmcgZGlyZWN0aXZlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXk6ZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215RGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFsbG93IG92ZXJ3cml0aW5nLCBidXQgcHJlc2VydmUgZmlyc3QgdmVyc2lvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7fSk7XHJcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ2FsbG93IG1lIHRvIG92ZXJ3cml0ZSB3aXRoIGEgdGhpcmQgcGFyYW1ldGVyIGluIGEgZnVuY3Rpb24gdGhhdCByZXR1cm4gdHJ1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICBjb25zdCBhbm90aGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgYW5vdGhlclNweS5hbmQucmV0dXJuVmFsdWUoYW5vdGhlclNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGFub3RoZXJTcHksIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkubm90LnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbm90aGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nQ2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlDbGljaywgc3B5O1xyXG4gICAgY29uc3QgbmdDbGljayA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nQ2xpY2snKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlTcHk6IHNweVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIG15Q2xpY2sgPSBuZ0NsaWNrLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsICdjdHJsLm15U3B5KHBhcmFtMSwgcGFyYW0yKScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBteUlmJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xpY2spLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUNsaWNrKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgY2FsbGluZyBpdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbXlDbGljaygpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgc3B5IHdoZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbXlDbGljaygpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdDEgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgICAgIGNvbnN0IG9iamVjdDIgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgICAgIGNvbnN0IGxvY2FscyA9IHtcclxuICAgICAgICAgICAgcGFyYW0xOiBvYmplY3QxLFxyXG4gICAgICAgICAgICBwYXJhbTI6IG9iamVjdDJcclxuICAgICAgICB9O1xyXG4gICAgICAgIG15Q2xpY2sobG9jYWxzKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChvYmplY3QxLCBvYmplY3QyKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0NsaWNrLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15SWY7XHJcbiAgICBjb25zdCBuZ0lmID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmctaWYnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlJZiA9IG5nSWYuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2N0cmwubXlCb29sZWFuJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlJZikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIG5vICRkaWdlc3Qgd2FzIGV4ZWN1dGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGF0ZXN0IGV2YWx1YXRlZCB2YWx1ZSBvbiBhIHdhdGNoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlLm15Qm9vbGVhbiA9IGFuZ3VsYXIubm9vcDtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS5ub3QudG9CZShhbmd1bGFyLm5vb3ApO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhdHRhY2hpbmcgc3B5cyB0byB0aGUgd2F0Y2hpbmcgY3ljbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgbXlJZihteVNweSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgZGVhdHRhY2hpbmcgc3BpZXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG9ubHkgZGVhdHRhY2ggdGhlIGNvcnJlY3BvbmRpbmcgc3B5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5MiA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IG15SWYobXlTcHkpO1xyXG4gICAgICAgIG15SWYobXlTcHkyKTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweTIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gIFxyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ01vZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15TW9kZWwsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGNvbnN0IG5nTW9kZWwgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ01vZGVsJyk7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gJ2N0cmwubXlTdHJpbmdQYXJhbWV0ZXInO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge30sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlNb2RlbCA9IG5nTW9kZWwuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteU1vZGVsKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgY29udHJvbGxlciB3aGVuIHJlY2VpdmluZyBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15TW9kZWwoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBmaXJlIGFuIGRpZ2VzdCB3aGVuIGRvaW5nIGFuZCBhc3NpZ21lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBzcHkpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgbXlNb2RlbCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBjdXJyZW50IHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGV4cGVjdChteU1vZGVsKCkpLnRvQmUoJ3NvbWVWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmaXJlIGRpZ2VzdHMgd2hlbiBjb25zdWx0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgbXlNb2RlbCgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYXJyYXkgdG8gZmlyZSBjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15TW9kZWwoWydhJywgJ1YnLCAnYScsICdsJywgJ3UnLCAnZSddKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWw6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1OiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdWU6IDEgLy9vbmx5IG9uY2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhIHNlY29uZCB0cnVlIHBhcmFtZXRlciwgdG8gc2ltdWxhdGUgdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15TW9kZWwoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qob2JqZWN0KS50b0VxdWFsKHtcclxuICAgICAgICAgICAgYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVY6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbDogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHU6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1ZTogMSAvL29ubHkgb25jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSBjaGFuZ2VzIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15TW9kZWwuY2hhbmdlcykudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnY2hhbmdlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdjaGFuZ2VzIHNob3VsZCBvbmx5IGZpcmUgb25jZSBwZXIgY2hhbmdlIChpbmRlcGVuZGVudCBvZiB3YXRjaGVyKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgd2F0Y2hlclNweSk7XHJcbiAgICAgICAgICAgIG15TW9kZWwuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgICAgICBteU1vZGVsKCdhVmFsdWUnLCB0cnVlKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdhbm90aGVyVmFsdWUnO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDYpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2F0Y2hlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nTW9kZWwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nVHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15VHJhbnNsYXRlO1xyXG4gICAgY29uc3QgbmdUcmFuc2xhdGUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCd0cmFuc2xhdGUnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgcHJvcDogJ1RJVExFJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlID0gbmdUcmFuc2xhdGUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ3t7Y3RybC5wcm9wfX0nKTtcclxuICAgICAgICBuZ1RyYW5zbGF0ZS5jaGFuZ2VMYW5ndWFnZSgnZW4nKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjYWxsaW5nIHRoZSB0cmFuc2xhdGUgbWV0aG9kJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG15VHJhbnNsYXRlKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHRyYW5zbGF0ZWQgdmFsdWUgKG9uY2UgZXZhbHVhdGVkKScsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlUcmFuc2xhdGUoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIG9sZCB2YWx1ZSBpZiBpdCB3YXNuXFwndCBldmFsdWF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUuY2hhbmdlTGFuZ3VhZ2UoJ2RlJyk7XHJcbiAgICAgICAgZXhwZWN0KG15VHJhbnNsYXRlKCkpLnRvQmUoJ0hlbGxvJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15VHJhbnNsYXRlKCkpLnRvQmUoJ0hhbGxvJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gYXR0YWNoIHRvIGNoYW5nZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ3RyYW5zbGF0ZScpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlLmNoYW5nZXMoc3B5KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2UucHJvcCA9ICdGT08nO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdUaGlzIGlzIGEgcGFyYWdyYXBoLicpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nVHJhbnNsYXRlLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlCaW5kLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBjb25zdCBuZ0JpbmQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0JpbmQnKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnY3RybC5teVN0cmluZ1BhcmFtZXRlcic7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15U3RyaW5nUGFyYW1ldGVyOiAnYVZhbHVlJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlCaW5kID0gbmdCaW5kLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZCkudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQpLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgd2hlbiBjYWxsZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgbXlCaW5kKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHRoZSBmaXJzdCB0aW1lIGl0IHdhcyBhdHRhY2hlciAod2F0Y2hlcnMgZGlkblxcJ3QgcnVuKScsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGxhc3Qgd2F0Y2hlZCB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIgPSAnYW5vdGhlclZhbHVlJztcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gd2F0Y2ggY2hhbmdlcycsICgpID0+IHtcclxuICAgICAgICBteUJpbmQuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdhVmFsdWUnKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGFzcycsICgpID0+IHtcclxuICAgIGNvbnN0IG5nQ2xhc3MgPSBkaXJlY3RpdmVQcm92aWRlLiRnZXQoJ25nLWNsYXNzJyk7XHJcblxyXG4gICAgbGV0IGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTZXJ2aWNlLCBteUNsYXNzVGV4dCwgbXlDbGFzc0V4cHJlc3Npb247XHJcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteVN0cmluZ1BhcmFtZXRlcjogJ215LWNsYXNzJyxcclxuICAgICAgICAgICAgY2xhc3MxOiB0cnVlLFxyXG4gICAgICAgICAgICBjbGFzczI6IGZhbHNlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15Q2xhc3NUZXh0ID0gbmdDbGFzcy5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnY3RybC5teVN0cmluZ1BhcmFtZXRlcicpO1xyXG4gICAgICAgIG15Q2xhc3NFeHByZXNzaW9uID0gbmdDbGFzcy5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAneyBcIm15LWNsYXNzXCI6IGN0cmwuY2xhc3MxLCBcIm15LW90aGVyLWNsYXNzXCI6IGN0cmwuY2xhc3MyIH0nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dCkudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNsYXNzLCBidXQgb25seSBhZnRlciB0aGUgZmlyc3QgJGRpZ2VzdCcsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQoKSkudG9CZSgnJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0KCkpLnRvQmUoJ215LWNsYXNzJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWNjZXB0IHNlbWkgYnVpbGQgZXhwcmVzc2lvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uKCkpLnRvQmUoJycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbigpKS50b0JlKCdteS1jbGFzcycpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNoZWNrIGlmIGl0IGhhcyB0aGUgY2xhc3MsIHJlZ2FyZGxlc3Mgb2YgdGhlIGV4cHJlc3Npb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0Lmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0Lmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBjb250cm9sbGVyLmNsYXNzMiA9IHRydWU7XHJcbiAgICAgICAgY29udHJvbGxlci5jbGFzczEgPSBmYWxzZTtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ215LW90aGVyLWNsYXNzJztcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dC5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0NsYXNzLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ1JlcGVhdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteVJlcGVhdCwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgY29uc3QgbmdSZXBlYXQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ1JlcGVhdCcpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteUFycmF5OiBbe1xyXG4gICAgICAgICAgICAgICAgYTogJ2EnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGI6ICdiJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBjOiAnYydcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZDogJ2QnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGU6ICdlJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBmOiAnZidcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgICAgIG15UmVwZWF0ID0gbmdSZXBlYXQuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2l0ZW1zIGluIGN0cmwubXlBcnJheScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIG9iamVjdCBiZWZvcmUgZGlnZXN0JywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteVJlcGVhdCgpKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVJlcGVhdCgpKS50b0VxdWFsKE9iamVjdC5jcmVhdGUobnVsbCkpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhcnJheScsICgpID0+IHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMobXlSZXBlYXQoKSkubGVuZ3RoKS50b0JlKDYpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGRldGVjdCBjaGFuZ2VzJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG15UmVwZWF0KCkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0VmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpOyAvL25vIGNoYW5nZVxyXG4gICAgICAgIGxldCBzZWNvbmRWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUpLnRvQmUoc2Vjb25kVmFsdWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlBcnJheVswXSA9IHtcclxuICAgICAgICAgICAgYTogJ2NoYW5nZWQnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBzZWNvbmRWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUpLm5vdC50b0JlKHNlY29uZFZhbHVlKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ1JlcGVhdC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IHF1aWNrbW9jayBmcm9tICcuLy4uL3NyYy9xdWlja21vY2suanMnO1xyXG5kZXNjcmliZSgncXVpY2ttb2NrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlck1vY2tlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlck1vY2tlciA9IHF1aWNrbW9jayh7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3dpdGhJbmplY3Rpb25zJyxcclxuICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3Rlc3QnLFxyXG4gICAgICAgICAgICBtb2NrTW9kdWxlczogW11cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmluZWQgYSBjb250cm9sbGVyTW9ja2VyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBtb2RpZmllZCBhbmd1bGFyIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QocXVpY2ttb2NrLm1vY2tIZWxwZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaW5qZWN0IG1vY2tlZCBvYmplY3QgZmlyc3QsIHRoZW4gcmVhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0LmFuZC5pZGVudGl0eSgpKS50b0JlKCdfX18kdGltZW91dCcpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQoKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kdGltZW91dCkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGluamVjdCBtb2NrZWQgb2JqZWN0IGZpcnN0LCB0aGVuIHJlYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kdGltZW91dC5hbmQuaWRlbnRpdHkoKSkudG9CZSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kcS5hbmQuaWRlbnRpdHkoKSkudG9CZSgnX19fJHEnKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY29udHJvbGxlck1vY2tlci4kdGltZW91dCkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlck1vY2tlci4kdGltZW91dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kdGltZW91dFtrZXldKS50b0JlKGNvbnRyb2xsZXJNb2NrZXIuJG1vY2tzLiR0aW1lb3V0W2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBjb250cm9sbGVyTW9ja2VyLiRxKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyTW9ja2VyLiRxLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiRxW2tleV0pLnRvQmUoY29udHJvbGxlck1vY2tlci4kbW9ja3MuJHFba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHEpLnRvQmUoY29udHJvbGxlck1vY2tlci4kbW9ja3MuJHEpO1xyXG5cclxuICAgIH0pO1xyXG59KTtcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyTW9ja2VyLCBzcHk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdtYWdpY0NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlck1vY2tlciA9IHF1aWNrbW9jayh7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ2VtcHR5Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd0ZXN0JyxcclxuICAgICAgICAgICAgbW9ja01vZHVsZXM6IFtdLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRTY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvbWV0aGluZ1RvQ2FsbDogc3B5XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvbWV0aGluZ1RvQ2FsbDogJz0nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIHBlcmZvcm0gY2xpY2tzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIubmdDbGljaykudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgICAgIGNvbnN0IG15Q2xpY2sgPSBjb250cm9sbGVyTW9ja2VyLm5nQ2xpY2soJ2N0cmwuc29tZXRoaW5nVG9DYWxsKGFPYmosIGJPYmopJyksXHJcbiAgICAgICAgICAgIHJlZmVyZW5jZTEgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICAgICByZWZlcmVuY2UyID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgbG9jYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgYU9iajogcmVmZXJlbmNlMSxcclxuICAgICAgICAgICAgICAgIGJPYmo6IHJlZmVyZW5jZTJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBteUNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgocmVmZXJlbmNlMSwgcmVmZXJlbmNlMik7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9xdWlja21vY2suc3BlYy5qc1xuICoqLyIsImltcG9ydCBoZWxwZXIgZnJvbSAnLi9xdWlja21vY2subW9ja0hlbHBlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmRcclxufSBmcm9tICcuL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG52YXIgbW9ja2VyID0gKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcclxuICAgIHZhciBvcHRzLCBtb2NrUHJlZml4O1xyXG4gICAgdmFyIGNvbnRyb2xsZXJEZWZhdWx0cyA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBwYXJlbnRTY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBpc0RlZmF1bHQ6ICFmbGFnXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBxdWlja21vY2suTU9DS19QUkVGSVggPSBtb2NrUHJlZml4ID0gKHF1aWNrbW9jay5NT0NLX1BSRUZJWCB8fCAnX19fJyk7XHJcbiAgICBxdWlja21vY2suVVNFX0FDVFVBTCA9ICdVU0VfQUNUVUFMX0lNUExFTUVOVEFUSU9OJztcclxuICAgIHF1aWNrbW9jay5NVVRFX0xPR1MgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiBxdWlja21vY2sob3B0aW9ucykge1xyXG4gICAgICAgIG9wdHMgPSBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIG1vY2tQcm92aWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vY2tQcm92aWRlcigpIHtcclxuICAgICAgICB2YXIgYWxsTW9kdWxlcyA9IG9wdHMubW9ja01vZHVsZXMuY29uY2F0KFsnbmdNb2NrJ10pLFxyXG4gICAgICAgICAgICBpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IoYWxsTW9kdWxlcy5jb25jYXQoW29wdHMubW9kdWxlTmFtZV0pKSxcclxuICAgICAgICAgICAgbW9kT2JqID0gYW5ndWxhci5tb2R1bGUob3B0cy5tb2R1bGVOYW1lKSxcclxuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBtb2RPYmouX2ludm9rZVF1ZXVlIHx8IFtdLFxyXG4gICAgICAgICAgICBwcm92aWRlclR5cGUgPSBnZXRQcm92aWRlclR5cGUob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSxcclxuICAgICAgICAgICAgbW9ja3MgPSB7fSxcclxuICAgICAgICAgICAgcHJvdmlkZXIgPSB7fTtcclxuXHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFsbE1vZHVsZXMgfHwgW10sIGZ1bmN0aW9uKG1vZE5hbWUpIHtcclxuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBpbnZva2VRdWV1ZS5jb25jYXQoYW5ndWxhci5tb2R1bGUobW9kTmFtZSkuX2ludm9rZVF1ZXVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuaW5qZWN0KSB7XHJcbiAgICAgICAgICAgIGluamVjdG9yLmludm9rZShvcHRzLmluamVjdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBpbnZva2VRdWV1ZSwgZmluZCB0aGlzIHByb3ZpZGVyJ3MgZGVwZW5kZW5jaWVzIGFuZCBwcmVmaXhcclxuICAgICAgICAgICAgLy8gdGhlbSBzbyBBbmd1bGFyIHdpbGwgaW5qZWN0IHRoZSBtb2NrZWQgdmVyc2lvbnNcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJOYW1lID0gcHJvdmlkZXJEYXRhWzJdWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlck5hbWUgPT09IG9wdHMucHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwcyA9IGN1cnJQcm92aWRlckRlcHMuJGluamVjdCB8fCBpbmplY3Rvci5hbm5vdGF0ZShjdXJyUHJvdmlkZXJEZXBzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcE5hbWUgPSBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3NbZGVwTmFtZV0gPSBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSA9PT0gJ2RpcmVjdGl2ZScpIHtcclxuICAgICAgICAgICAgICAgIHNldHVwRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cEluaXRpYWxpemVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJlZml4ZWQgZGVwZW5kZW5jaWVzIHRoYXQgcGVyc2lzdGVkIGZyb20gYSBwcmV2aW91cyBjYWxsLFxyXG4gICAgICAgICAgICAvLyBhbmQgY2hlY2sgZm9yIGFueSBub24tYW5ub3RhdGVkIHNlcnZpY2VzXHJcbiAgICAgICAgICAgIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwSW5pdGlhbGl6ZXIoKSB7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0gaW5pdFByb3ZpZGVyKCk7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLnNweU9uUHJvdmlkZXJNZXRob2RzKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRpbml0aWFsaXplID0gc2V0dXBJbml0aWFsaXplcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQcm92aWRlcigpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRyb2xsZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gY29udHJvbGxlckhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsZWFuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZE1vZHVsZXMoYWxsTW9kdWxlcy5jb25jYXQob3B0cy5tb2R1bGVOYW1lKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmRXaXRoKG9wdHMuY29udHJvbGxlci5iaW5kVG9Db250cm9sbGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0U2NvcGUob3B0cy5jb250cm9sbGVyLnBhcmVudFNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0TG9jYWxzKG1vY2tzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubmV3KG9wdHMucHJvdmlkZXJOYW1lLCBvcHRzLmNvbnRyb2xsZXIuY29udHJvbGxlckFzKTtcclxuICAgICAgICAgICAgICAgICAgICB0b1JldHVybi5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbW9ja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vY2tzLmhhc093blByb3BlcnR5KGtleSkgJiYgdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2tleV0gPSB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jb250cm9sbGVyLmlzRGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgICAgICBjYXNlICdmaWx0ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZmlsdGVyID0gaW5qZWN0b3IuZ2V0KCckZmlsdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIob3B0cy5wcm92aWRlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYW5pbWF0aW9uJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZTogaW5qZWN0b3IuZ2V0KCckYW5pbWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdEFuaW1hdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubW9jay5tb2R1bGUoJ25nQW5pbWF0ZU1vY2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQob3B0cy5wcm92aWRlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cERpcmVjdGl2ZSgpIHtcclxuICAgICAgICAgICAgdmFyICRjb21waWxlID0gaW5qZWN0b3IuZ2V0KCckY29tcGlsZScpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kc2NvcGUgPSBpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKS4kbmV3KCk7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG5cclxuICAgICAgICAgICAgcHJvdmlkZXIuJGNvbXBpbGUgPSBmdW5jdGlvbiBxdWlja21vY2tDb21waWxlKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sIHx8IG9wdHMuaHRtbDtcclxuICAgICAgICAgICAgICAgIGlmICghaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIE5vIGh0bWwgc3RyaW5nL29iamVjdCBwcm92aWRlZC4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGh0bWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChodG1sKTtcclxuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgICAgICAgICAkY29tcGlsZShwcm92aWRlci4kZWxlbWVudCkocHJvdmlkZXIuJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kaXNvU2NvcGUgPSBwcm92aWRlci4kZWxlbWVudC5pc29sYXRlU2NvcGUoKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSkge1xyXG4gICAgICAgICAgICB2YXIgZGVwVHlwZSA9IGdldFByb3ZpZGVyVHlwZShkZXBOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBkZXBOYW1lO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAhPT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSA9PT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcclxuICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwVHlwZSA9PT0gJ3ZhbHVlJyB8fCBkZXBUeXBlID09PSAnY29uc3RhbnQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5qZWN0b3IuaGFzKG1vY2tQcmVmaXggKyBkZXBOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpbmplY3Rvci5oYXMobW9ja1NlcnZpY2VOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudXNlQWN0dWFsRGVwZW5kZW5jaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrU2VydmljZU5hbWUucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5qZWN0IG1vY2sgZm9yIFwiJyArIGRlcE5hbWUgKyAnXCIgYmVjYXVzZSBubyBzdWNoIG1vY2sgZXhpc3RzLiBQbGVhc2Ugd3JpdGUgYSBtb2NrICcgKyBkZXBUeXBlICsgJyBjYWxsZWQgXCInICsgbW9ja1NlcnZpY2VOYW1lICsgJ1wiIChvciBzZXQgdGhlIHVzZUFjdHVhbERlcGVuZGVuY2llcyB0byB0cnVlKSBhbmQgdHJ5IGFnYWluLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQobW9ja1NlcnZpY2VOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocHJvdmlkZXJEYXRhWzJdWzBdKSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm92aWRlckRhdGFbMl1bMV0pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlciBkZWNsYXJhdGlvbiBmdW5jdGlvbiBoYXMgYmVlbiBwcm92aWRlZCB3aXRob3V0IHRoZSBhcnJheSBhbm5vdGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhbm5vdGF0ZSBpdCBzbyB0aGUgaW52b2tlUXVldWUgY2FuIGJlIHByZWZpeGVkXHJcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGVkRGVwZW5kZW5jaWVzID0gaW5qZWN0b3IuYW5ub3RhdGUocHJvdmlkZXJEYXRhWzJdWzFdKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBwcm92aWRlckRhdGFbMl1bMV0uJGluamVjdDtcclxuICAgICAgICAgICAgICAgIGFubm90YXRlZERlcGVuZGVuY2llcy5wdXNoKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlckRhdGFbMl1bMV0gPSBhbm5vdGF0ZWREZXBlbmRlbmNpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbml0aWFsaXplIGJlY2F1c2UgYW5ndWxhciBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgbG9hZCBhbmd1bGFyIGJlZm9yZSBsb2FkaW5nIHF1aWNrbW9jay5qcy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnByb3ZpZGVyTmFtZSAmJiAhb3B0aW9ucy5jb25maWdCbG9ja3MgJiYgIW9wdGlvbnMucnVuQmxvY2tzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBwcm92aWRlck5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdCwgb3Igc2V0IHRoZSBjb25maWdCbG9ja3Mgb3IgcnVuQmxvY2tzIGZsYWdzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMubW9kdWxlTmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gbW9kdWxlTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0aW9ucy5tb2NrTW9kdWxlcyA9IG9wdGlvbnMubW9ja01vZHVsZXMgfHwgW107XHJcbiAgICAgICAgb3B0aW9ucy5tb2NrcyA9IG9wdGlvbnMubW9ja3MgfHwge307XHJcbiAgICAgICAgb3B0aW9ucy5jb250cm9sbGVyID0gZXh0ZW5kKG9wdGlvbnMuY29udHJvbGxlciwgY29udHJvbGxlckRlZmF1bHRzKGFuZ3VsYXIuaXNEZWZpbmVkKG9wdGlvbnMuY29udHJvbGxlcikpKTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcikge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm92aWRlciwgZnVuY3Rpb24ocHJvcGVydHksIHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5qYXNtaW5lICYmIHdpbmRvdy5zcHlPbiAmJiAhcHJvcGVydHkuY2FsbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3B5ID0gc3B5T24ocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNweS5hbmRDYWxsVGhyb3VnaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kQ2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuc2lub24gJiYgd2luZG93LnNpbm9uLnNweSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zaW5vbi5zcHkocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQcm92aWRlclR5cGUocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW52b2tlUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHByb3ZpZGVySW5mbyA9IGludm9rZVF1ZXVlW2ldO1xyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJJbmZvWzJdWzBdID09PSBwcm92aWRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJJbmZvWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJHByb3ZpZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdmlkZXJJbmZvWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb250cm9sbGVyUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb21waWxlUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2RpcmVjdGl2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGZpbHRlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmaWx0ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRhbmltYXRlUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2FuaW1hdGlvbic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdW5wcmVmaXgpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJEYXRhWzJdWzBdID09PSBwcm92aWRlck5hbWUgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1ByZWZpeCArIGN1cnJQcm92aWRlckRlcHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpIHtcclxuICAgICAgICBpZiAoIWh0bWwuJHRhZykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBIdG1sIG9iamVjdCBkb2VzIG5vdCBjb250YWluICR0YWcgcHJvcGVydHkuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBodG1sQXR0cnMgPSBodG1sLFxyXG4gICAgICAgICAgICB0YWdOYW1lID0gaHRtbEF0dHJzLiR0YWcsXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50ID0gaHRtbEF0dHJzLiRjb250ZW50O1xyXG4gICAgICAgIGh0bWwgPSAnPCcgKyB0YWdOYW1lICsgJyAnO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChodG1sQXR0cnMsIGZ1bmN0aW9uKHZhbCwgYXR0cikge1xyXG4gICAgICAgICAgICBpZiAoYXR0ciAhPT0gJyRjb250ZW50JyAmJiBhdHRyICE9PSAnJHRhZycpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gc25ha2VfY2FzZShhdHRyKSArICh2YWwgPyAoJz1cIicgKyB2YWwgKyAnXCIgJykgOiAnICcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaHRtbCArPSBodG1sQ29udGVudCA/ICgnPicgKyBodG1sQ29udGVudCkgOiAnPic7XHJcbiAgICAgICAgaHRtbCArPSAnPC8nICsgdGFnTmFtZSArICc+JztcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBxdWlja21vY2tMb2cobXNnKSB7XHJcbiAgICAgICAgaWYgKCFxdWlja21vY2suTVVURV9MT0dTKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBTTkFLRV9DQVNFX1JFR0VYUCA9IC9bQS1aXS9nO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNuYWtlX2Nhc2UobmFtZSwgc2VwYXJhdG9yKSB7XHJcbiAgICAgICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yIHx8ICctJztcclxuICAgICAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNOQUtFX0NBU0VfUkVHRVhQLCBmdW5jdGlvbihsZXR0ZXIsIHBvcykge1xyXG4gICAgICAgICAgICByZXR1cm4gKHBvcyA/IHNlcGFyYXRvciA6ICcnKSArIGxldHRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBxdWlja21vY2s7XHJcblxyXG59KShhbmd1bGFyKTtcclxuaGVscGVyKG1vY2tlcik7XHJcbmV4cG9ydCBkZWZhdWx0IG1vY2tlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWlja21vY2suanNcbiAqKi8iLCJcclxuZnVuY3Rpb24gbG9hZEhlbHBlcihtb2NrZXIpIHtcclxuICAgIChmdW5jdGlvbihxdWlja21vY2spIHtcclxuICAgICAgICB2YXIgaGFzQmVlbk1vY2tlZCA9IHt9LFxyXG4gICAgICAgICAgICBvcmlnTW9kdWxlRnVuYyA9IGFuZ3VsYXIubW9kdWxlO1xyXG4gICAgICAgIHF1aWNrbW9jay5vcmlnaW5hbE1vZHVsZXMgPSBhbmd1bGFyLm1vZHVsZTtcclxuICAgICAgICBhbmd1bGFyLm1vZHVsZSA9IGRlY29yYXRlQW5ndWxhck1vZHVsZTtcclxuXHJcbiAgICAgICAgcXVpY2ttb2NrLm1vY2tIZWxwZXIgPSB7XHJcbiAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWQ6IGhhc0JlZW5Nb2NrZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RPYmpbbWV0aG9kTmFtZV0gPSBtZXRob2Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbW9kT2JqO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbikge1xyXG4gICAgICAgICAgICB2YXIgbW9kT2JqID0gb3JpZ01vZHVsZUZ1bmMobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCBwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWRbcHJvdmlkZXJOYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3TW9kT2JqID0gbW9kT2JqW3Byb3ZpZGVyVHlwZV0ocXVpY2ttb2NrLk1PQ0tfUFJFRklYICsgcHJvdmlkZXJOYW1lLCBpbml0RnVuYyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG5ld01vZE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZTogZnVuY3Rpb24gbW9ja1NlcnZpY2UocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3NlcnZpY2UnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1vY2tGYWN0b3J5OiBmdW5jdGlvbiBtb2NrRmFjdG9yeShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmFjdG9yeScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tGaWx0ZXI6IGZ1bmN0aW9uIG1vY2tGaWx0ZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZpbHRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb250cm9sbGVyOiBmdW5jdGlvbiBtb2NrQ29udHJvbGxlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29udHJvbGxlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tQcm92aWRlcjogZnVuY3Rpb24gbW9ja1Byb3ZpZGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdwcm92aWRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tWYWx1ZTogZnVuY3Rpb24gbW9ja1ZhbHVlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICd2YWx1ZScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb25zdGFudDogZnVuY3Rpb24gbW9ja0NvbnN0YW50KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb25zdGFudCcsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tBbmltYXRpb246IGZ1bmN0aW9uIG1vY2tBbmltYXRpb24ocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2FuaW1hdGlvbicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pKG1vY2tlcik7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgbG9hZEhlbHBlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWlja21vY2subW9ja0hlbHBlci5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlnKCkge1xyXG4gICAgZGlyZWN0aXZlUHJvdmlkZXIudXNlTW9kdWxlKFxyXG4gICAgICAgIGFuZ3VsYXIubW9kdWxlKCd0ZXN0JywgWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2VtcHR5Q29udHJvbGxlcicsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gJ2VtcHR5Q29udHJvbGxlcic7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3dpdGhJbmplY3Rpb25zJywgWyckcScsICckdGltZW91dCcsIGZ1bmN0aW9uKCRxLCB0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHEgPSAkcTtcclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCA9IHQ7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3dpdGhCaW5kaW5ncycsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5ib3VuZFByb3BlcnR5ID0gdGhpcy5ib3VuZFByb3BlcnR5ICsgJyBtb2RpZmllZCc7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLmNvbmZpZyhbJyR0cmFuc2xhdGVQcm92aWRlcicsIGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGVsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnVGhpcyBpcyBhIHBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNoJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0RFOiAnZ2VybWFuJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZGUnLCB7XHJcbiAgICAgICAgICAgICAgICBUSVRMRTogJ0hhbGxvJyxcclxuICAgICAgICAgICAgICAgIEZPTzogJ0RpZXMgaXN0IGVpbiBQYXJhZ3JhcGguJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0VOOiAnZW5nbGlzY2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdkZXV0c2NoJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdlbicpO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlKCdlbicpO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5tb2NrU2VydmljZSgnJHEnLCBbZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqYXNtaW5lLmNyZWF0ZVNweSgnX19fJHEnKTtcclxuICAgICAgICB9XSlcclxuICAgICAgICAubW9ja1NlcnZpY2UoJyR0aW1lb3V0JywgWyckdGltZW91dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gamFzbWluZS5jcmVhdGVTcHkoJ19fXyR0aW1lb3V0Jyk7XHJcbiAgICAgICAgfV0pLm5hbWVcclxuICAgICk7XHJcblxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9hcHAvY29tcGxldGVMaXN0LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==