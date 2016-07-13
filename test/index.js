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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjQzMzI0ZjlhZThiMzhiNmU5ZWY/MGFhZCIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcz84MjJhIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsaWNrSFRNTC5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdJZkhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nTW9kZWxIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0JpbmRIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ1RyYW5zbGF0ZUhUTUwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nQ2xhc3NIVE1MLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nTW9kZWwuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nQ2xhc3Muc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdSZXBlYXQuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzIiwid2VicGFjazovLy8uL3NyYy9xdWlja21vY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzIiwid2VicGFjazovLy8uL2FwcC9jb21wbGV0ZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSLEVBQW9DLE9BQXBDLEc7Ozs7Ozs7O0FDTkE7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQsaUNBQWdDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQs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LEVBOEJDLFdBOUJELENBOEJhLFVBOUJiLEVBOEJ5QixDQUFDLFVBQUQsRUFBYSxZQUFXO0FBQzdDLGdCQUFPLFFBQVEsU0FBUixDQUFrQixhQUFsQixDQUFQO0FBQ0gsTUFGd0IsQ0E5QnpCLEVBZ0NJLElBakNSO0FBb0NILEUiLCJmaWxlIjoiLi90ZXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBmNDMzMjRmOWFlOGIzOGI2ZTllZlxuICoqLyIsInJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tb24uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlckhhbmRsZXIvc3BpZXMuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKTtcclxucmVxdWlyZSgnLi9xdWlja21vY2suc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuLy4uL2FwcC9jb21wbGV0ZUxpc3QuanMnKS5kZWZhdWx0KCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2luZGV4LmxvYWRlci5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5nZXRCbG9ja05vZGVzID0gZ2V0QmxvY2tOb2RlcztcbmV4cG9ydHMuaGFzaEtleSA9IGhhc2hLZXk7XG5leHBvcnRzLmNyZWF0ZU1hcCA9IGNyZWF0ZU1hcDtcbmV4cG9ydHMuc2hhbGxvd0NvcHkgPSBzaGFsbG93Q29weTtcbmV4cG9ydHMuaXNBcnJheUxpa2UgPSBpc0FycmF5TGlrZTtcbmV4cG9ydHMudHJpbSA9IHRyaW07XG5leHBvcnRzLmlzRXhwcmVzc2lvbiA9IGlzRXhwcmVzc2lvbjtcbmV4cG9ydHMuZXhwcmVzc2lvblNhbml0aXplciA9IGV4cHJlc3Npb25TYW5pdGl6ZXI7XG5leHBvcnRzLmFzc2VydE5vdERlZmluZWQgPSBhc3NlcnROb3REZWZpbmVkO1xuZXhwb3J0cy5hc3NlcnRfJF9DT05UUk9MTEVSID0gYXNzZXJ0XyRfQ09OVFJPTExFUjtcbmV4cG9ydHMuY2xlYW4gPSBjbGVhbjtcbmV4cG9ydHMuY3JlYXRlU3B5ID0gY3JlYXRlU3B5O1xuZXhwb3J0cy5tYWtlQXJyYXkgPSBtYWtlQXJyYXk7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMuZ2V0RnVuY3Rpb25OYW1lID0gZ2V0RnVuY3Rpb25OYW1lO1xuZXhwb3J0cy5zYW5pdGl6ZU1vZHVsZXMgPSBzYW5pdGl6ZU1vZHVsZXM7XG5leHBvcnRzLnRvQ2FtZWxDYXNlID0gdG9DYW1lbENhc2U7XG5leHBvcnRzLnRvU25ha2VDYXNlID0gdG9TbmFrZUNhc2U7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gZXhwb3J0cy5QQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcbnZhciBFWFBSRVNTSU9OX1JFR0VYID0gZXhwb3J0cy5FWFBSRVNTSU9OX1JFR0VYID0gL157ey4qfX0kLztcbi8qIFNob3VsZCByZXR1cm4gdHJ1ZSBcclxuICogZm9yIG9iamVjdHMgdGhhdCB3b3VsZG4ndCBmYWlsIGRvaW5nXHJcbiAqIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShteU9iaik7XHJcbiAqIHdoaWNoIHJldHVybnMgYSBuZXcgYXJyYXkgKHJlZmVyZW5jZS13aXNlKVxyXG4gKiBQcm9iYWJseSBuZWVkcyBtb3JlIHNwZWNzXHJcbiAqL1xuXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbmZ1bmN0aW9uIGdldEJsb2NrTm9kZXMobm9kZXMpIHtcbiAgICAvLyBUT0RPKHBlcmYpOiB1cGRhdGUgYG5vZGVzYCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdD9cbiAgICB2YXIgbm9kZSA9IG5vZGVzWzBdO1xuICAgIHZhciBlbmROb2RlID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XG4gICAgdmFyIGJsb2NrTm9kZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgbm9kZSAhPT0gZW5kTm9kZSAmJiAobm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpOyBpKyspIHtcbiAgICAgICAgaWYgKGJsb2NrTm9kZXMgfHwgbm9kZXNbaV0gIT09IG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghYmxvY2tOb2Rlcykge1xuICAgICAgICAgICAgICAgIGJsb2NrTm9kZXMgPSBhbmd1bGFyLmVsZW1lbnQoc2xpY2UuY2FsbChub2RlcywgMCwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tOb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsb2NrTm9kZXMgfHwgbm9kZXM7XG59XG5cbnZhciB1aWQgPSAwO1xudmFyIG5leHRVaWQgPSBmdW5jdGlvbiBuZXh0VWlkKCkge1xuICAgIHJldHVybiArK3VpZDtcbn07XG5cbmZ1bmN0aW9uIGhhc2hLZXkob2JqLCBuZXh0VWlkRm4pIHtcbiAgICB2YXIga2V5ID0gb2JqICYmIG9iai4kJGhhc2hLZXk7XG4gICAgaWYgKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHZhciBvYmpUeXBlID0gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKTtcbiAgICBpZiAob2JqVHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCBvYmpUeXBlID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSA9IG9ialR5cGUgKyAnOicgKyAobmV4dFVpZEZuIHx8IG5leHRVaWQpKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAga2V5ID0gb2JqVHlwZSArICc6JyArIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwKCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5mdW5jdGlvbiBzaGFsbG93Q29weShzcmMsIGRzdCkge1xuICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoc3JjKSkge1xuICAgICAgICBkc3QgPSBkc3QgfHwgW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gc3JjLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGRzdFtpXSA9IHNyY1tpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChzcmMpKSB7XG4gICAgICAgIGRzdCA9IGRzdCB8fCB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBpZiAoIShrZXkuY2hhckF0KDApID09PSAnJCcgJiYga2V5LmNoYXJBdCgxKSA9PT0gJyQnKSkge1xuICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHN0IHx8IHNyYztcbn1cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpdGVtKSB8fCAhIWl0ZW0gJiYgKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihpdGVtKSkgPT09IFwib2JqZWN0XCIgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eShcImxlbmd0aFwiKSAmJiB0eXBlb2YgaXRlbS5sZW5ndGggPT09IFwibnVtYmVyXCIgJiYgaXRlbS5sZW5ndGggPj0gMCB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiB0cmltKHZhbHVlKSB7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICByZXR1cm4gdmFsdWUudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBpc0V4cHJlc3Npb24odmFsdWUpIHtcbiAgICByZXR1cm4gRVhQUkVTU0lPTl9SRUdFWC50ZXN0KHRyaW0odmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gZXhwcmVzc2lvblNhbml0aXplcihleHByZXNzaW9uKSB7XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIHJldHVybiBleHByZXNzaW9uLnN1YnN0cmluZygyLCBleHByZXNzaW9uLmxlbmd0aCAtIDIpO1xufVxuXG5mdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xuXG4gICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnIHx8IG9ialtrZXldID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBbJ1wiJywga2V5LCAnXCIgcHJvcGVydHkgY2Fubm90IGJlIG51bGwnXS5qb2luKFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xuICAgIGFzc2VydE5vdERlZmluZWQob2JqLCBbJ3BhcmVudFNjb3BlJywgJ2JpbmRpbmdzJywgJ2NvbnRyb2xsZXJTY29wZSddKTtcbn1cblxuZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSBvYmplY3QubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KG9iamVjdCwgW2luZGV4LCAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4ob2JqZWN0W2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xuICAgIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHZhciBlbmRUaW1lID0gdm9pZCAwO1xuICAgIHZhciB0b1JldHVybiA9IHNweU9uKHtcbiAgICAgICAgYTogZnVuY3Rpb24gYSgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBfYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgIH0sICdhJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgdG9SZXR1cm4udG9vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgfTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG59XG5cbmZ1bmN0aW9uIG1ha2VBcnJheShpdGVtKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIFtpdGVtXTtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChyZW1vdmUkIHx8ICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcbiAgICB2YXIgZGVzdGluYXRpb24gPSB2YWx1ZXMuc2hpZnQoKSB8fCB7fTtcbiAgICB2YXIgY3VycmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XG4gICAgICAgICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBjdXJyZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxudmFyIHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcblxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xuICAgIGlmIChzY29wZS4kcm9vdCkge1xuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbnZhciBzY29wZUhlbHBlciA9IGV4cG9ydHMuc2NvcGVIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gc2NvcGVIZWxwZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBzY29wZUhlbHBlcik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKHNjb3BlSGVscGVyLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICdkZWNvcmF0ZVNjb3BlQ291bnRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCA9IDA7XG4gICAgICAgICAgICBzY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQocm9vdFNjb3BlLiRuZXcodHJ1ZSksIHNjb3BlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2Uoc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQuYXBwbHkodW5kZWZpbmVkLCBbcm9vdFNjb3BlLiRuZXcodHJ1ZSldLmNvbmNhdChzY29wZSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaXNTY29wZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc1Njb3BlKG9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCAmJiBnZXRSb290RnJvbVNjb3BlKG9iamVjdCkgPT09IGdldFJvb3RGcm9tU2NvcGUocm9vdFNjb3BlKSAmJiBvYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2NvcGVIZWxwZXI7XG59KCk7XG5cbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XG5cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XG4gICAgdmFyIHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiB0b1JldHVybjtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xuXG4gICAgdmFyIG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgIHZhciBpbmRleCA9IHZvaWQgMDtcbiAgICBpZiAoKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiYgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZHVsZXM7XG59XG52YXIgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZztcbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbiAoXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSwga2V5KSB7XG4gICAga2V5ID0ga2V5IHx8ICctJztcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2FuaXRpemVNb2R1bGVzXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG52YXIgaW5qZWN0aW9ucyA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciB0b1JldHVybiA9IHtcclxuICAgICAgICAkcm9vdFNjb3BlOiBzY29wZUhlbHBlci4kcm9vdFNjb3BlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5kZXNjcmliZSgnVXRpbCBsb2dpYycsIGZ1bmN0aW9uKCkge1xyXG4gICAgZGVzY3JpYmUoJ2FycmF5LWxpa2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhcnJheS1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKGFyZ3VtZW50cykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0FycmF5TGlrZShbXSkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDEsXHJcbiAgICAgICAgICAgICAgICAwOiAnbGFsYSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKHRlc3RPYmplY3QpKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzYW5pdGl6ZU1vZGxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZW1wdHkgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKFtdKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKHtcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91ZCBhZGQgbmcgbW9kdWxlIGl0IGl0cyBub3QgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKFtdKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgICAgIH0pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhZGQgbmcgbm9yIGFuZ3VsYXIgdG8gdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ25nJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCdhbmd1bGFyJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgcGFzc2luZyBhcnJheXMtbGlrZSBvYmplY3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDEgPSBbJ21vZHVsZTEnLCAnbW9kdWxlMiddO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QyID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QzID0ge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAyLFxyXG4gICAgICAgICAgICAgICAgMDogJ21vZHVsZTEnLFxyXG4gICAgICAgICAgICAgICAgMTogJ21vZHVsZTInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFtvYmplY3QxLCBvYmplY3QyLCBvYmplY3QzXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVNb2R1bGVzKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9CZSh2YWx1ZS5sZW5ndGggKyAxKTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBkZWZhdWx0IG5nL2FuZ3VsYXIgbW9kdWxlIHRvIHRoZSBmaXJzdCBwb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQxID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ25nJ10pLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0MiA9IHNhbml0aXplTW9kdWxlcyhbJ21vZHVsZTEnLCAnbW9kdWxlMicsICdhbmd1bGFyJ10pO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MVswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDEubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MlswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2NvcGVIZWxwZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhIHNjb3BlIHdoZW4gbm8gYXJndW1lbnRzIHdoZXJlIGdpdmVuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoKS4kcm9vdCkudG9CZShpbmplY3Rpb25zLiRyb290U2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmUgYSBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBzY29wZSByZWZlcmVuY2Ugd2hlbiBpdCByZWNlaXZlcyBhbiBpc29sYXRlZCBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKSkudG9CZShzY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYW4gc2NvcGUgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBhIHBhc3NlZCBvYmplY3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9QYXNzID0ge1xyXG4gICAgICAgICAgICAgICAgYToge30sIC8vIGZvciByZWZlcmVuY2UgY2hlY2tpbmdcclxuICAgICAgICAgICAgICAgIGI6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCByZXR1cm5lZFNjb3BlO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5lZFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHRvUGFzcyk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmEpLnRvQmUodG9QYXNzLmEpO1xyXG4gICAgICAgICAgICBleHBlY3QocmV0dXJuZWRTY29wZS5iKS50b0JlKHRvUGFzcy5iKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGtub3cgd2hlbiBhbiBvYmplY3QgaXMgYSBjb250cm9sbGVyIENvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnc29tZXRoaW5nJ1xyXG4gICAgICAgICAgICB9KS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgfSkubmV3KCd3aXRoQmluZGluZ3MnKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdCgkX0NPTlRST0xMRVIuaXNDb250cm9sbGVyKGNvbnRyb2xsZXJPYmopKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyT2JqLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanNcbiAqKi8iLCJcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBkaXJlY3RpdmVIYW5kbGVyXHJcbn0gZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5pbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZCxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBjcmVhdGVTcHksXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGFzc2VydF8kX0NPTlRST0xMRVIsXHJcbiAgICBjbGVhblxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzICRfQ09OVFJPTExFUiB7XHJcbiAgICBzdGF0aWMgaXNDb250cm9sbGVyKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiAkX0NPTlRST0xMRVI7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kaW5ncywgbW9kdWxlcywgY05hbWUsIGNMb2NhbHMpIHtcclxuICAgICAgICB0aGlzLnByb3ZpZGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSA9IGNOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICB0aGlzLnVzZWRNb2R1bGVzID0gbW9kdWxlcy5zbGljZSgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUgPSBwU2NvcGU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyU2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XHJcbiAgICAgICAgdGhpcy5sb2NhbHMgPSBleHRlbmQoY0xvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiB0aGlzLmNvbnRyb2xsZXJTY29wZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuSW50ZXJuYWxTcGllcyA9IHtcclxuICAgICAgICAgICAgU2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBDb250cm9sbGVyOiB7fVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAkYXBwbHkoKSB7XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgJGRlc3Ryb3koKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgY2xlYW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoYmluZGluZ3MpIHtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYW5ndWxhci5pc0RlZmluZWQoYmluZGluZ3MpICYmIGJpbmRpbmdzICE9PSBudWxsID8gYmluZGluZ3MgOiB0aGlzLmJpbmRpbmdzO1xyXG4gICAgICAgIGFzc2VydF8kX0NPTlRST0xMRVIodGhpcyk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuJGdldCh0aGlzLnVzZWRNb2R1bGVzKVxyXG4gICAgICAgICAgICAuY3JlYXRlKHRoaXMucHJvdmlkZXJOYW1lLCB0aGlzLnBhcmVudFNjb3BlLCB0aGlzLmJpbmRpbmdzLCB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUsIHRoaXMubG9jYWxzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSA9IHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIGxldCB3YXRjaGVyLCBzZWxmID0gdGhpcztcclxuICAgICAgICB3aGlsZSAod2F0Y2hlciA9IHRoaXMucGVuZGluZ1dhdGNoZXJzLnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hcHBseSh0aGlzLCB3YXRjaGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyh0aGlzLmJpbmRpbmdzW2tleV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlS2V5ID0gcmVzdWx0WzJdIHx8IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBzcHlLZXkgPSBbc2NvcGVLZXksICc6Jywga2V5XS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMV0gPT09ICc9Jykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0cm95ZXIgPSB0aGlzLndhdGNoKGtleSwgdGhpcy5JbnRlcm5hbFNwaWVzLlNjb3BlW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5jb250cm9sbGVySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llcjIgPSB0aGlzLndhdGNoKHNjb3BlS2V5LCB0aGlzLkludGVybmFsU3BpZXMuQ29udHJvbGxlcltzcHlLZXldID0gY3JlYXRlU3B5KCksIHNlbGYucGFyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcjIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICB3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250cm9sbGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlclNjb3BlLiR3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBuZ0NsaWNrKGV4cHJlc3Npb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVEaXJlY3RpdmUoJ25nLWNsaWNrJywgZXhwcmVzc2lvbik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXJncyA9IG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICBhcmdzWzBdID0gdGhpcztcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlLmNvbXBpbGUuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGNvbXBpbGVIVE1MKGh0bWxUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkaXJlY3RpdmVIYW5kbGVyKHRoaXMsIGh0bWxUZXh0KTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgbmdNb2RlbERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nTW9kZWwuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdDbGlja0RpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdJZkRpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdUcmFuc2xhdGVEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0JpbmREaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdDbGFzc0RpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgdG9DYW1lbENhc2UsXHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdSZXBlYXREaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1JlcGVhdC5qcyc7XHJcbnZhciBkaXJlY3RpdmVQcm92aWRlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGxldCAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSkuZ2V0KCckdHJhbnNsYXRlJyk7XHJcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxyXG4gICAgICAgIHRvUmV0dXJuID0ge30sXHJcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXHJcbiAgICAgICAgJGFuaW1hdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckYW5pbWF0ZScpLFxyXG4gICAgICAgICR0cmFuc2NsdWRlID0gZnVuY3Rpb24gY29udHJvbGxlcnNCb3VuZFRyYW5zY2x1ZGUoc2NvcGUsIGNsb25lQXR0YWNoRm4sIGZ1dHVyZVBhcmVudEVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIE5vIHNjb3BlIHBhc3NlZCBpbjpcclxuICAgICAgICAgICAgaWYgKCFzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICAgICAgZnV0dXJlUGFyZW50RWxlbWVudCA9IGNsb25lQXR0YWNoRm47XHJcbiAgICAgICAgICAgICAgICBjbG9uZUF0dGFjaEZuID0gc2NvcGU7XHJcbiAgICAgICAgICAgICAgICBzY29wZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGludGVybmFscyA9IHtcclxuICAgICAgICAgICAgbmdJZjogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICBuZ0NsaWNrOiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nTW9kZWw6IG5nTW9kZWxEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdEaXNhYmxlZDogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUsICRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nQmluZDogbmdCaW5kRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xhc3M6IG5nQ2xhc3NEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdSZXBlYXQ6IG5nUmVwZWF0RGlyZWN0aXZlKCRwYXJzZSwgJGFuaW1hdGUsICR0cmFuc2NsdWRlKSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlVmFsdWU6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgaW50ZXJuYWxzLm5nVHJhbnNsYXRlID0gaW50ZXJuYWxzLnRyYW5zbGF0ZTtcclxuXHJcblxyXG4gICAgdG9SZXR1cm4uJGdldCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXMuZ2V0KGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRwdXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnZGlyZWN0aXZlQ29uc3RydWN0b3IgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oYXJndW1lbnRzWzJdKSAmJiBhcmd1bWVudHNbMl0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbJ2RpcmVjdGl2ZScsIGRpcmVjdGl2ZU5hbWUsICdoYXMgYmVlbiBvdmVyd3JpdHRlbiddLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBvdmVyd3JpdGUgJyArIGRpcmVjdGl2ZU5hbWUgKyAnLlxcbkZvcmdldGluZyB0byBjbGVhbiBtdWNoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGNsZWFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLnVzZU1vZHVsZSA9IChtb2R1bGVOYW1lKSA9PiB7XHJcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10uY29uY2F0KG1vZHVsZU5hbWUpKS5nZXQoJyR0cmFuc2xhdGUnKTtcclxuICAgICAgICBpbnRlcm5hbHMudHJhbnNsYXRlLmNoYW5nZVNlcnZpY2UoJHRyYW5zbGF0ZSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVQcm92aWRlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nTW9kZWxEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbihwYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzU3RyaW5nKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhcmd1bWVudHNbMV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4ocGFyYW1ldGVyLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0dGVyLmFzc2lnbihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUsIHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtb3J5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZUFycmF5KHBhcmFtZXRlcikuZm9yRWFjaCgoY3VycmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihtZW1vcnkgKz0gY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFsnRG9udCBrbm93IHdoYXQgdG8gZG8gd2l0aCAnLCAnW1wiJywgbWFrZUFycmF5KGFyZ3VtZW50cykuam9pbignXCIsIFwiJyksICdcIl0nXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLW1vZGVsJyk7XHJcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcclxuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcygobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLW1vZGVsJ1xyXG4gICAgfTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nTW9kZWwuanNcbiAqKi8iLCJleHBvcnQgdmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xyXG5leHBvcnQgdmFyIEVYUFJFU1NJT05fUkVHRVggPSAvXnt7Lip9fSQvO1xyXG4vKiBTaG91bGQgcmV0dXJuIHRydWUgXHJcbiAqIGZvciBvYmplY3RzIHRoYXQgd291bGRuJ3QgZmFpbCBkb2luZ1xyXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobXlPYmopO1xyXG4gKiB3aGljaCByZXR1cm5zIGEgbmV3IGFycmF5IChyZWZlcmVuY2Utd2lzZSlcclxuICogUHJvYmFibHkgbmVlZHMgbW9yZSBzcGVjc1xyXG4gKi9cclxuXHJcblxyXG5jb25zdCBzbGljZSA9IFtdLnNsaWNlO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmxvY2tOb2Rlcyhub2Rlcykge1xyXG4gICAgLy8gVE9ETyhwZXJmKTogdXBkYXRlIGBub2Rlc2AgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3Q/XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzWzBdO1xyXG4gICAgdmFyIGVuZE5vZGUgPSBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXTtcclxuICAgIHZhciBibG9ja05vZGVzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAxOyBub2RlICE9PSBlbmROb2RlICYmIChub2RlID0gbm9kZS5uZXh0U2libGluZyk7IGkrKykge1xyXG4gICAgICAgIGlmIChibG9ja05vZGVzIHx8IG5vZGVzW2ldICE9PSBub2RlKSB7XHJcbiAgICAgICAgICAgIGlmICghYmxvY2tOb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgYmxvY2tOb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChzbGljZS5jYWxsKG5vZGVzLCAwLCBpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmxvY2tOb2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmxvY2tOb2RlcyB8fCBub2RlcztcclxufVxyXG5cclxudmFyIHVpZCA9IDA7XHJcbmNvbnN0IG5leHRVaWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiArK3VpZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoS2V5KG9iaiwgbmV4dFVpZEZuKSB7XHJcbiAgICBsZXQga2V5ID0gb2JqICYmIG9iai4kJGhhc2hLZXk7XHJcbiAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb2JqVHlwZSA9IHR5cGVvZiBvYmo7XHJcbiAgICBpZiAob2JqVHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCAob2JqVHlwZSA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsKSkge1xyXG4gICAgICAgIGtleSA9IG9iai4kJGhhc2hLZXkgPSBvYmpUeXBlICsgJzonICsgKG5leHRVaWRGbiB8fCBuZXh0VWlkKSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBrZXkgPSBvYmpUeXBlICsgJzonICsgb2JqO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGtleTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hcCgpIHtcclxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvd0NvcHkoc3JjLCBkc3QpIHtcclxuICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoc3JjKSkge1xyXG4gICAgICAgIGRzdCA9IGRzdCB8fCBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gc3JjLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgICAgZHN0W2ldID0gc3JjW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChzcmMpKSB7XHJcbiAgICAgICAgZHN0ID0gZHN0IHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XHJcbiAgICAgICAgICAgIGlmICghKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkc3QgfHwgc3JjO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZShpdGVtKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpdGVtKSB8fFxyXG4gICAgICAgICghIWl0ZW0gJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIgJiZcclxuICAgICAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eShcImxlbmd0aFwiKSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbS5sZW5ndGggPT09IFwibnVtYmVyXCIgJiZcclxuICAgICAgICAgICAgaXRlbS5sZW5ndGggPj0gMFxyXG4gICAgICAgICkgfHxcclxuICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdHJpbSh2YWx1ZSkge1xyXG4gICAgdmFsdWUgPSB2YWx1ZSB8fCAnJztcclxuICAgIHJldHVybiB2YWx1ZS50cmltKCk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFeHByZXNzaW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gRVhQUkVTU0lPTl9SRUdFWC50ZXN0KHRyaW0odmFsdWUpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cHJlc3Npb25TYW5pdGl6ZXIoZXhwcmVzc2lvbikge1xyXG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xyXG4gICAgcmV0dXJuIGV4cHJlc3Npb24uc3Vic3RyaW5nKDIsIGV4cHJlc3Npb24ubGVuZ3RoIC0gMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xyXG5cclxuICAgIGxldCBrZXk7XHJcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgWydcIicsIGtleSwgJ1wiIHByb3BlcnR5IGNhbm5vdCBiZSBudWxsJ10uam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xyXG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFtcclxuICAgICAgICAncGFyZW50U2NvcGUnLFxyXG4gICAgICAgICdiaW5kaW5ncycsXHJcbiAgICAgICAgJ2NvbnRyb2xsZXJTY29wZSdcclxuICAgIF0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XHJcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gb2JqZWN0Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKG9iamVjdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xyXG4gICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBsZXQgZW5kVGltZTtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gc3B5T24oe1xyXG4gICAgICAgIGE6ICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgdG9SZXR1cm4udG9vayA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZW5kVGltZSAtIHN0YXJ0VGltZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW2l0ZW1dO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgbGV0IHJlbW92ZSQgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XHJcbiAgICBsZXQgY3VycmVudDtcclxuICAgIHdoaWxlIChjdXJyZW50ID0gdmFsdWVzLnNoaWZ0KCkpIHtcclxuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuY29uc3Qgcm9vdFNjb3BlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHJvb3RTY29wZScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xyXG4gICAgaWYgKHNjb3BlLiRyb290KSB7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlLiRyb290O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXJlbnQ7XHJcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQuJHJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC4kcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3Mgc2NvcGVIZWxwZXIge1xyXG4gICAgc3RhdGljIGRlY29yYXRlU2NvcGVDb3VudGVyKHNjb3BlKSB7XHJcbiAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCA9IDA7XHJcbiAgICAgICAgc2NvcGUuJCRwb3N0RGlnZXN0KCgpID0+IHtcclxuICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjcmVhdGUoc2NvcGUpIHtcclxuICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2NvcGUoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQocm9vdFNjb3BlLiRuZXcodHJ1ZSksIHNjb3BlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0FycmF5TGlrZShzY29wZSkpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Jvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1Njb3BlKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgJiYgZ2V0Um9vdEZyb21TY29wZShvYmplY3QpID09PSBnZXRSb290RnJvbVNjb3BlKHJvb3RTY29wZSkgJiYgb2JqZWN0O1xyXG4gICAgfVxyXG59XHJcbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKG15RnVuY3Rpb24pIHtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcclxuICAgIGlmICh0b1JldHVybiA9PT0gJycgfHwgdG9SZXR1cm4gPT09ICdhbm9uJykge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xyXG5cclxuICAgIGNvbnN0IG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgbGV0IGluZGV4O1xyXG4gICAgaWYgKFxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignbmcnKSkgPT09IC0xICYmXHJcbiAgICAgICAgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xyXG4gICAgICAgIG1vZHVsZXMudW5zaGlmdCgnbmcnKTtcclxuICAgIH1cclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQobW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdICYmICduZycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vZHVsZXM7XHJcbn1cclxuY29uc3QgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZztcclxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2FtZWxDYXNlKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lLlxyXG4gICAgcmVwbGFjZShTUEVDSUFMX0NIQVJTX1JFR0VYUCwgZnVuY3Rpb24oXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xyXG4gICAgICAgIHJldHVybiBvZmZzZXQgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSwga2V5KSB7XHJcbiAgICBrZXkgPSBrZXkgfHwgJy0nO1xyXG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oJDEpIHtcclxuICAgICAgICByZXR1cm4ga2V5ICsgJDEudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb21tb24uanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi8uLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5mdW5jdGlvbiByZWN1cnNlT2JqZWN0cyhvYmplY3QpIHtcclxuICAgIGxldCB0b1JldHVybiA9IG1ha2VBcnJheShvYmplY3QpO1xyXG4gICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IG9iamVjdC5jaGlsZHJlbigpLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4uY29uY2F0KHJlY3Vyc2VPYmplY3RzKGFuZ3VsYXIuZWxlbWVudChvYmplY3QuY2hpbGRyZW4oKVtpaV0pKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9SZXR1cm47IFxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWNsaWNrPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjbGljayA9IChzY29wZSwgbG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBsb2NhbHMgfHwge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBleHByZXNzaW9uKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2s7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgJGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tEYXRhID0gJGVsZW1lbnQuZGF0YSgnbmctY2xpY2snKTtcclxuICAgICAgICAgICAgY29uc3QgbXlBcnJheSA9IHJlY3Vyc2VPYmplY3RzKCRlbGVtZW50KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG15QXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQobXlBcnJheVtpbmRleF0pLmRhdGEoJ25nLWNsaWNrJywgY2xpY2tEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6ICduZy1jbGljaydcclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzXG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIG5nSWZEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctaWY9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IHN1YnNjcmlwdG9ycy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnNbaWldLmFwcGx5KHN1YnNjcmlwdG9ycywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vc29wKSgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLnZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgJGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSxcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpLFxyXG4gICAgICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUgPSAkZWxlbWVudC5kYXRhKCduZy1pZicpO1xyXG4gICAgICAgICAgICBjb21waWxlZERpcmVjdGl2ZSgobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50LmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCgkZWxlbWVudCwgMCwgJGVsZW1lbnQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZGV0YWNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxhc3RWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KCRlbGVtZW50LCBsYXN0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZChsYXN0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudCA9IGNvbXBpbGVkRGlyZWN0aXZlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6ICduZy1pZidcclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIGlzRXhwcmVzc2lvbixcclxuICAgIGV4cHJlc3Npb25TYW5pdGl6ZXJcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlLCAkcGFyc2UpIHtcclxuICAgIGxldCB0cmFuc2xhdGVTZXJ2aWNlID0gJHRyYW5zbGF0ZTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAga2V5ID0gZXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgd2F0Y2hlcjtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHdhdGNoZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3YXRjaGVyID0gdG9SZXR1cm4gPSBzdWJzY3JpcHRvcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaXNFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvblNhbml0aXplcihleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGtleSA9ICRwYXJzZShleHByZXNzaW9uKShjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcFdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaCgoKSA9PiB7fSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcFdhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KHRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZVNlcnZpY2U6IGZ1bmN0aW9uKG5ld1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZSA9IG5ld1NlcnZpY2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IChjb250cm9sbGVyU2VydmljZSwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGVsZW0uZGF0YSgnbmctdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcclxuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcygobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogJ25nLXRyYW5zbGF0ZSdcclxuXHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanNcbiAqKi8iLCJleHBvcnQgZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIGxldCB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLWJpbmQnKTtcclxuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xyXG4gICAgICAgICAgICBtb2RlbC5jaGFuZ2VzKChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbS50ZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctYmluZCdcclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgdHJpbVxyXG59IGZyb20gJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdDbGFzc0RpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gJHBhcnNlKHRyaW0oZXhwcmVzc2lvbikpO1xyXG4gICAgICAgICAgICBsZXQgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpcmVDaGFuZ2U7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b05vdGlmeSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IG5ld1ZhbHVlLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVtrZXldID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChuZXdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzQXJyYXkobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVba2V5XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBuZXdWYWx1ZVtrZXldICE9PSBsYXN0VmFsdWVba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b05vdGlmeVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkOiAhIWxhc3RWYWx1ZVtrZXldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3OiAhIW5ld1ZhbHVlW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZUNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdG9Ob3RpZnkuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBsYXN0VmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBuZXdWYWx1ZVtrZXldICE9PSBsYXN0VmFsdWVba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b05vdGlmeVtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkOiAhIWxhc3RWYWx1ZVtrZXldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3OiAhIW5ld1ZhbHVlW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZUNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGZpcmVDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4obmV3VmFsdWUsIHRvTm90aWZ5KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGxhc3RWYWx1ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RWYWx1ZVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmhhc0NsYXNzID0gKHRvQ2hlY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGxhc3RWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlLmluZGV4T2YodHJpbSh0b0NoZWNrKSkgIT09IC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGFzdFZhbHVlW3RvQ2hlY2tdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiAnbmctY2xhc3MnLFxyXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogKGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ25nLWNsYXNzJykuY2hhbmdlcygobGFzdFZhbHVlLCBuZXdDaGFuZ2VzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbmV3Q2hhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdDaGFuZ2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NoYW5nZXNba2V5XS5uZXcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3Moa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3Moa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGFzcy5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBjcmVhdGVNYXAsXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIC8vZ2V0QmxvY2tOb2RlcyxcclxuICAgIGhhc2hLZXlcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZXhwb3J0IGZ1bmN0aW9uIG5nUmVwZWF0RGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgLy8gY29uc3QgTkdfUkVNT1ZFRCA9ICckJE5HX1JFTU9WRUQnO1xyXG4gICAgY29uc3QgdXBkYXRlU2NvcGUgPSBmdW5jdGlvbihzY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgYXJyYXlMZW5ndGgpIHtcclxuICAgICAgICAvLyBUT0RPKHBlcmYpOiBnZW5lcmF0ZSBzZXR0ZXJzIHRvIHNoYXZlIG9mZiB+NDBtcyBvciAxLTEuNSVcclxuICAgICAgICBzY29wZVt2YWx1ZUlkZW50aWZpZXJdID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKGtleUlkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgc2NvcGVba2V5SWRlbnRpZmllcl0gPSBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNjb3BlLiRpbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHNjb3BlLiRmaXJzdCA9IChpbmRleCA9PT0gMCk7XHJcbiAgICAgICAgc2NvcGUuJGxhc3QgPSAoaW5kZXggPT09IChhcnJheUxlbmd0aCAtIDEpKTtcclxuICAgICAgICBzY29wZS4kbWlkZGxlID0gIShzY29wZS4kZmlyc3QgfHwgc2NvcGUuJGxhc3QpO1xyXG4gICAgICAgIC8vIGpzaGludCBiaXR3aXNlOiBmYWxzZVxyXG4gICAgICAgIHNjb3BlLiRvZGQgPSAhKHNjb3BlLiRldmVuID0gKGluZGV4ICYgMSkgPT09IDApO1xyXG4gICAgICAgIC8vIGpzaGludCBiaXR3aXNlOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogJ25nUmVwZWF0JyxcclxuICAgICAgICBjb21waWxlOiBmdW5jdGlvbihjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyU2VydmljZS5jcmVhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCAkc2NvcGUgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccythc1xccysoW1xcc1xcU10rPykpPyg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyk7XHJcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFtcIkV4cGVjdGVkIGV4cHJlc3Npb24gaW4gZm9ybSBvZiAnX2l0ZW1fIGluIF9jb2xsZWN0aW9uX1sgdHJhY2sgYnkgX2lkX10nIGJ1dCBnb3QgJ1wiLCBleHByZXNzaW9uLCBcIidcIl0uam9pbignJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbGhzID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHJocyA9IG1hdGNoWzJdO1xyXG4gICAgICAgICAgICBjb25zdCBhbGlhc0FzID0gbWF0Y2hbM107XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYWNrQnlFeHAgPSBtYXRjaFs0XTtcclxuICAgICAgICAgICAgbWF0Y2ggPSBsaHMubWF0Y2goL14oPzooXFxzKltcXCRcXHddKyl8XFwoXFxzKihbXFwkXFx3XSspXFxzKixcXHMqKFtcXCRcXHddKylcXHMqXFwpKSQvKTtcclxuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiJ19pdGVtXycgaW4gJ19pdGVtXyBpbiBfY29sbGVjdGlvbl8nIHNob3VsZCBiZSBhbiBpZGVudGlmaWVyIG9yICcoX2tleV8sIF92YWx1ZV8pJyBleHByZXNzaW9uLCBidXQgZ290ICdcIiwgbGhzLCBcIidcIl0uam9pbignJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmFsdWVJZGVudGlmaWVyID0gbWF0Y2hbM10gfHwgbWF0Y2hbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IGtleUlkZW50aWZpZXIgPSBtYXRjaFsyXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhbGlhc0FzICYmICghL15bJGEtekEtWl9dWyRhLXpBLVowLTlfXSokLy50ZXN0KGFsaWFzQXMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgL14obnVsbHx1bmRlZmluZWR8dGhpc3xcXCRpbmRleHxcXCRmaXJzdHxcXCRtaWRkbGV8XFwkbGFzdHxcXCRldmVufFxcJG9kZHxcXCRwYXJlbnR8XFwkcm9vdHxcXCRpZCkkLy50ZXN0KGFsaWFzQXMpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiYWxpYXMgJ1wiLCBhbGlhc0FzLCBcIicgaXMgaW52YWxpZCAtLS0gbXVzdCBiZSBhIHZhbGlkIEpTIGlkZW50aWZpZXIgd2hpY2ggaXMgbm90IGEgcmVzZXJ2ZWQgbmFtZS5cIl0uam9pbignJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRyYWNrQnlFeHBHZXR0ZXIsIHRyYWNrQnlJZEV4cEZuLCB0cmFja0J5SWRBcnJheUZuLCB0cmFja0J5SWRPYmpGbjtcclxuICAgICAgICAgICAgY29uc3QgaGFzaEZuTG9jYWxzID0ge1xyXG4gICAgICAgICAgICAgICAgJGlkOiBoYXNoS2V5XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodHJhY2tCeUV4cCkge1xyXG4gICAgICAgICAgICAgICAgdHJhY2tCeUV4cEdldHRlciA9ICRwYXJzZSh0cmFja0J5RXhwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEFycmF5Rm4gPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc2hLZXkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZE9iakZuID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYWNrQnlFeHBHZXR0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEV4cEZuID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24ga2V5LCB2YWx1ZSwgYW5kICRpbmRleCB0byB0aGUgbG9jYWxzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBpbiBoYXNoIGZ1bmN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fsc1trZXlJZGVudGlmaWVyXSA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzW3ZhbHVlSWRlbnRpZmllcl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBoYXNoRm5Mb2NhbHMuJGluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrQnlFeHBHZXR0ZXIoJHNjb3BlLCBoYXNoRm5Mb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbGFzdEJsb2NrTWFwID0gY3JlYXRlTWFwKCk7XHJcbiAgICAgICAgICAgIGxldCBkaWZmZXJlbmNlcyA9IGNyZWF0ZU1hcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBteU9iamVjdHMgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgbmdSZXBlYXRNaW5FcnIgPSAoKSA9PiB7fTtcclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlciA9ICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKHJocywgZnVuY3Rpb24gbmdSZXBlYXRBY3Rpb24oY29sbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZGlmZmVyZW5jZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVkOiBbXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXAgPSBjcmVhdGVNYXAoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSwgdmFsdWUsIC8vIGtleS92YWx1ZSBvZiBpdGVyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4sXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMsXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2ssIC8vIGxhc3Qgb2JqZWN0IGluZm9ybWF0aW9uIHtzY29wZSwgZWxlbWVudCwgaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxpYXNBcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZVthbGlhc0FzXSA9IGNvbGxlY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMgPSBjb2xsZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuID0gdHJhY2tCeUlkRXhwRm4gfHwgdHJhY2tCeUlkQXJyYXlGbjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4gPSB0cmFja0J5SWRFeHBGbiB8fCB0cmFja0J5SWRPYmpGbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvYmplY3QsIGV4dHJhY3Qga2V5cywgaW4gZW51bWVyYXRpb24gb3JkZXIsIHVuc29ydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtS2V5IGluIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwgaXRlbUtleSkgJiYgaXRlbUtleS5jaGFyQXQoMCkgIT09ICckJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMucHVzaChpdGVtS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoID0gY29sbGVjdGlvbktleXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIgPSBuZXcgQXJyYXkoY29sbGVjdGlvbkxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbG9jYXRlIGV4aXN0aW5nIGl0ZW1zXHJcbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjb2xsZWN0aW9uTGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gKGNvbGxlY3Rpb24gPT09IGNvbGxlY3Rpb25LZXlzKSA/IGluZGV4IDogY29sbGVjdGlvbktleXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29sbGVjdGlvbltrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZCA9IHRyYWNrQnlJZEZuKGtleSwgdmFsdWUsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm91bmQgcHJldmlvdXNseSBzZWVuIGJsb2NrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsYXN0QmxvY2tNYXBbdHJhY2tCeUlkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0gPSBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXJbaW5kZXhdID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBjb2xsaXNpb24gZGV0ZWN0ZWQuIHJlc3RvcmUgbGFzdEJsb2NrTWFwIGFuZCB0aHJvdyBhbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobmV4dEJsb2NrT3JkZXIsIGZ1bmN0aW9uKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sgJiYgYmxvY2suc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0QmxvY2tNYXBbYmxvY2suaWRdID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZ1JlcGVhdE1pbkVycignZHVwZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJEdXBsaWNhdGVzIGluIGEgcmVwZWF0ZXIgYXJlIG5vdCBhbGxvd2VkLiBVc2UgJ3RyYWNrIGJ5JyBleHByZXNzaW9uIHRvIHNwZWNpZnkgdW5pcXVlIGtleXMuIFJlcGVhdGVyOiB7MH0sIER1cGxpY2F0ZSBrZXk6IHsxfSwgRHVwbGljYXRlIHZhbHVlOiB7Mn1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sIHRyYWNrQnlJZCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBuZXZlciBiZWZvcmUgc2VlbiBibG9ja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tPcmRlcltpbmRleF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdHJhY2tCeUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBsZWZ0b3ZlciBpdGVtc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYmxvY2tLZXkgaW4gbGFzdEJsb2NrTWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBsYXN0QmxvY2tNYXBbYmxvY2tLZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmUgPSBteU9iamVjdHMuaW5kZXhPZihibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlPYmplY3RzLnNwbGljZShlbGVtZW50c1RvUmVtb3ZlLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlcy5yZW1vdmVkLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gd2UgYXJlIG5vdCB1c2luZyBmb3JFYWNoIGZvciBwZXJmIHJlYXNvbnMgKHRyeWluZyB0byBhdm9pZCAjY2FsbClcclxuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNvbGxlY3Rpb25MZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPSAoY29sbGVjdGlvbiA9PT0gY29sbGVjdGlvbktleXMpID8gaW5kZXggOiBjb2xsZWN0aW9uS2V5c1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xsZWN0aW9uW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBuZXh0QmxvY2tPcmRlcltpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYWxyZWFkeSBzZWVuIHRoaXMgb2JqZWN0LCB0aGVuIHdlIG5lZWQgdG8gcmV1c2UgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgc2NvcGUvZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTY29wZShibG9jay5zY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgY29sbGVjdGlvbkxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzLm1vZGlmaWVkLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBpdGVtIHdoaWNoIHdlIGRvbid0IGtub3cgYWJvdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBteU9iamVjdHMuc3BsaWNlKGluZGV4LCAwLCBibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzLmFkZGVkLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbYmxvY2suaWRdID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNjb3BlKGJsb2NrLnNjb3BlLCBpbmRleCwgdmFsdWVJZGVudGlmaWVyLCB2YWx1ZSwga2V5SWRlbnRpZmllciwga2V5LCBjb2xsZWN0aW9uTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suaW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RCbG9ja01hcCA9IG5leHRCbG9ja01hcDtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKG15T2JqZWN0cywgZGlmZmVyZW5jZXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBteU9iamVjdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW5jZXM6IGRpZmZlcmVuY2VzXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5rZXlJZGVudGlmaWVyID0ga2V5SWRlbnRpZmllciB8fCB2YWx1ZUlkZW50aWZpZXI7XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1JlcGVhdC5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IEF0dHJpYnV0ZXMgZnJvbSAnLi8uLi9jb250cm9sbGVyL2F0dHJpYnV0ZS5qcyc7XHJcbnZhciBkaXJlY3RpdmVIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxldCBwcm90byA9IGFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUgfHwgYW5ndWxhci5lbGVtZW50Ll9fcHJvdG9fXztcclxuICAgIHByb3RvLiRmaW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWVzID0ge1xyXG4gICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNbdmFsdWVzLmxlbmd0aCsrXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KGpvaW4odmFsdWVzKSk7XHJcbiAgICB9O1xyXG4gICAgcHJvdG8uJGNsaWNrID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1jbGljaycpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2sobG9jYWxzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcHJvdG8uJHRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuZGF0YSgnbmctbW9kZWwnKSB8fCB0aGlzLmRhdGEoJ25nLWJpbmQnKSB8fCB0aGlzLmRhdGEoJ25nLXRyYW5zbGF0ZScpIHx8IHRoaXMudGV4dDtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQgJiYgdGV4dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykgfHwgJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHByb3RvLiRpZiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZ0lmID0gdGhpcy5kYXRhKCduZy1pZicpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmdJZiAmJiBuZ0lmLnZhbHVlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGpvaW4ob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGlsZShvYmosIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgb2JqID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBvYmpbMF0uYXR0cmlidXRlcy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS5uYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aXZlO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGlsZWREaXJlY3RpdmUgPSBkaXJlY3RpdmUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICBvYmouZGF0YShkaXJlY3RpdmUubmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5hdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGFuZ3VsYXIuZWxlbWVudChvYmopLCBuZXcgQXR0cmlidXRlcyhvYmopKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29tcGlsZShjaGlsZHJlbnNbaWldLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRyb2woY29udHJvbGxlclNlcnZpY2UsIG9iaikge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8ICFjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGlsZShjdXJyZW50LCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbnRyb2w7XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZUhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgdG9DYW1lbENhc2UsXHJcbiAgICB0b1NuYWtlQ2FzZSxcclxuICAgIHRyaW1cclxufSBmcm9tICcuL2NvbW1vbi5qcyc7XHJcblxyXG5mdW5jdGlvbiBBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXNUb0NvcHkpIHtcclxuICAgIGlmIChhdHRyaWJ1dGVzVG9Db3B5KSB7XHJcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzVG9Db3B5KTtcclxuICAgICAgICB2YXIgaSwgbCwga2V5O1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICAgICAgdGhpc1trZXldID0gYXR0cmlidXRlc1RvQ29weVtrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kYXR0ciA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJCRlbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5jb25zdCAkYW5pbWF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRhbmltYXRlJyk7XHJcbmNvbnN0ICQkc2FuaXRpemVVcmkgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckJHNhbml0aXplVXJpJyk7XHJcbkF0dHJpYnV0ZXMucHJvdG90eXBlID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkbm9ybWFsaXplXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQ29udmVydHMgYW4gYXR0cmlidXRlIG5hbWUgKGUuZy4gZGFzaC9jb2xvbi91bmRlcnNjb3JlLWRlbGltaXRlZCBzdHJpbmcsIG9wdGlvbmFsbHkgcHJlZml4ZWQgd2l0aCBgeC1gIG9yXHJcbiAgICAgKiBgZGF0YS1gKSB0byBpdHMgbm9ybWFsaXplZCwgY2FtZWxDYXNlIGZvcm0uXHJcbiAgICAgKlxyXG4gICAgICogQWxzbyB0aGVyZSBpcyBzcGVjaWFsIGNhc2UgZm9yIE1veiBwcmVmaXggc3RhcnRpbmcgd2l0aCB1cHBlciBjYXNlIGxldHRlci5cclxuICAgICAqXHJcbiAgICAgKiBGb3IgZnVydGhlciBpbmZvcm1hdGlvbiBjaGVjayBvdXQgdGhlIGd1aWRlIG9uIHtAbGluayBndWlkZS9kaXJlY3RpdmUjbWF0Y2hpbmctZGlyZWN0aXZlcyBNYXRjaGluZyBEaXJlY3RpdmVzfVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgdG8gbm9ybWFsaXplXHJcbiAgICAgKi9cclxuICAgICRub3JtYWxpemU6IHRvQ2FtZWxDYXNlLFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRhZGRDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIEFkZHMgdGhlIENTUyBjbGFzcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIGNsYXNzVmFsIHBhcmFtZXRlciB0byB0aGUgZWxlbWVudC4gSWYgYW5pbWF0aW9uc1xyXG4gICAgICogYXJlIGVuYWJsZWQgdGhlbiBhbiBhbmltYXRpb24gd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoZSBjbGFzcyBhZGRpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NWYWwgVGhlIGNsYXNzTmFtZSB2YWx1ZSB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgJGFkZENsYXNzOiBmdW5jdGlvbihjbGFzc1ZhbCkge1xyXG4gICAgICAgIGlmIChjbGFzc1ZhbCAmJiBjbGFzc1ZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKHRoaXMuJCRlbGVtZW50LCBjbGFzc1ZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRyZW1vdmVDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIFJlbW92ZXMgdGhlIENTUyBjbGFzcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIGNsYXNzVmFsIHBhcmFtZXRlciBmcm9tIHRoZSBlbGVtZW50LiBJZlxyXG4gICAgICogYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCB0aGVuIGFuIGFuaW1hdGlvbiB3aWxsIGJlIHRyaWdnZXJlZCBmb3IgdGhlIGNsYXNzIHJlbW92YWwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzVmFsIFRoZSBjbGFzc05hbWUgdmFsdWUgdGhhdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICAkcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzVmFsKSB7XHJcbiAgICAgICAgaWYgKGNsYXNzVmFsICYmIGNsYXNzVmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsIGNsYXNzVmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJHVwZGF0ZUNsYXNzXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQWRkcyBhbmQgcmVtb3ZlcyB0aGUgYXBwcm9wcmlhdGUgQ1NTIGNsYXNzIHZhbHVlcyB0byB0aGUgZWxlbWVudCBiYXNlZCBvbiB0aGUgZGlmZmVyZW5jZVxyXG4gICAgICogYmV0d2VlbiB0aGUgbmV3IGFuZCBvbGQgQ1NTIGNsYXNzIHZhbHVlcyAoc3BlY2lmaWVkIGFzIG5ld0NsYXNzZXMgYW5kIG9sZENsYXNzZXMpLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdDbGFzc2VzIFRoZSBjdXJyZW50IENTUyBjbGFzc05hbWUgdmFsdWVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbGRDbGFzc2VzIFRoZSBmb3JtZXIgQ1NTIGNsYXNzTmFtZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICAkdXBkYXRlQ2xhc3M6IGZ1bmN0aW9uKG5ld0NsYXNzZXMsIG9sZENsYXNzZXMpIHtcclxuICAgICAgICB2YXIgdG9BZGQgPSB0b2tlbkRpZmZlcmVuY2UobmV3Q2xhc3Nlcywgb2xkQ2xhc3Nlcyk7XHJcbiAgICAgICAgaWYgKHRvQWRkICYmIHRvQWRkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCwgdG9BZGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRvUmVtb3ZlID0gdG9rZW5EaWZmZXJlbmNlKG9sZENsYXNzZXMsIG5ld0NsYXNzZXMpO1xyXG4gICAgICAgIGlmICh0b1JlbW92ZSAmJiB0b1JlbW92ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsIHRvUmVtb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgbm9ybWFsaXplZCBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQgaW4gYSB3YXkgc3VjaCB0aGF0IGFsbCBkaXJlY3RpdmVzXHJcbiAgICAgKiBjYW4gc2hhcmUgdGhlIGF0dHJpYnV0ZS4gVGhpcyBmdW5jdGlvbiBwcm9wZXJseSBoYW5kbGVzIGJvb2xlYW4gYXR0cmlidXRlcy5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTm9ybWFsaXplZCBrZXkuIChpZSBuZ0F0dHJpYnV0ZSlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfGJvb2xlYW59IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuIElmIGBudWxsYCBhdHRyaWJ1dGUgd2lsbCBiZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gd3JpdGVBdHRyIElmIGZhbHNlLCBkb2VzIG5vdCB3cml0ZSB0aGUgdmFsdWUgdG8gRE9NIGVsZW1lbnQgYXR0cmlidXRlLlxyXG4gICAgICogICAgIERlZmF1bHRzIHRvIHRydWUuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IGF0dHJOYW1lIE9wdGlvbmFsIG5vbmUgbm9ybWFsaXplZCBuYW1lLiBEZWZhdWx0cyB0byBrZXkuXHJcbiAgICAgKi9cclxuICAgICRzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUsIHdyaXRlQXR0ciwgYXR0ck5hbWUpIHtcclxuICAgICAgICAvLyBUT0RPOiBkZWNpZGUgd2hldGhlciBvciBub3QgdG8gdGhyb3cgYW4gZXJyb3IgaWYgXCJjbGFzc1wiXHJcbiAgICAgICAgLy9pcyBzZXQgdGhyb3VnaCB0aGlzIGZ1bmN0aW9uIHNpbmNlIGl0IG1heSBjYXVzZSAkdXBkYXRlQ2xhc3MgdG9cclxuICAgICAgICAvL2JlY29tZSB1bnN0YWJsZS5cclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLiQkZWxlbWVudFswXSxcclxuICAgICAgICAgICAgYm9vbGVhbktleSA9IGFuZ3VsYXIuZ2V0Qm9vbGVhbkF0dHJOYW1lKG5vZGUsIGtleSksXHJcbiAgICAgICAgICAgIGFsaWFzZWRLZXkgPSBhbmd1bGFyLmdldEFsaWFzZWRBdHRyTmFtZShrZXkpLFxyXG4gICAgICAgICAgICBvYnNlcnZlciA9IGtleSxcclxuICAgICAgICAgICAgbm9kZU5hbWU7XHJcblxyXG4gICAgICAgIGlmIChib29sZWFuS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuJCRlbGVtZW50LnByb3Aoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYm9vbGVhbktleTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFsaWFzZWRLZXkpIHtcclxuICAgICAgICAgICAgdGhpc1thbGlhc2VkS2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IGFsaWFzZWRLZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNsYXRlIG5vcm1hbGl6ZWQga2V5IHRvIGFjdHVhbCBrZXlcclxuICAgICAgICBpZiAoYXR0ck5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy4kYXR0cltrZXldID0gYXR0ck5hbWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXR0ck5hbWUgPSB0aGlzLiRhdHRyW2tleV07XHJcbiAgICAgICAgICAgIGlmICghYXR0ck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGF0dHJba2V5XSA9IGF0dHJOYW1lID0gdG9TbmFrZUNhc2Uoa2V5LCAnLScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub2RlTmFtZSA9IG5vZGVOYW1lXyh0aGlzLiQkZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGlmICgobm9kZU5hbWUgPT09ICdhJyAmJiAoa2V5ID09PSAnaHJlZicgfHwga2V5ID09PSAneGxpbmtIcmVmJykpIHx8XHJcbiAgICAgICAgICAgIChub2RlTmFtZSA9PT0gJ2ltZycgJiYga2V5ID09PSAnc3JjJykpIHtcclxuICAgICAgICAgICAgLy8gc2FuaXRpemUgYVtocmVmXSBhbmQgaW1nW3NyY10gdmFsdWVzXHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlID0gJCRzYW5pdGl6ZVVyaSh2YWx1ZSwga2V5ID09PSAnc3JjJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlTmFtZSA9PT0gJ2ltZycgJiYga2V5ID09PSAnc3Jjc2V0JyAmJiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgLy8gc2FuaXRpemUgaW1nW3NyY3NldF0gdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLy8gZmlyc3QgY2hlY2sgaWYgdGhlcmUgYXJlIHNwYWNlcyBiZWNhdXNlIGl0J3Mgbm90IHRoZSBzYW1lIHBhdHRlcm5cclxuICAgICAgICAgICAgdmFyIHRyaW1tZWRTcmNzZXQgPSB0cmltKHZhbHVlKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKCAgIDk5OXggICAsfCAgIDk5OXcgICAsfCAgICx8LCAgIClcclxuICAgICAgICAgICAgdmFyIHNyY1BhdHRlcm4gPSAvKFxccytcXGQreFxccyosfFxccytcXGQrd1xccyosfFxccyssfCxcXHMrKS87XHJcbiAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gL1xccy8udGVzdCh0cmltbWVkU3Jjc2V0KSA/IHNyY1BhdHRlcm4gOiAvKCwpLztcclxuXHJcbiAgICAgICAgICAgIC8vIHNwbGl0IHNyY3NldCBpbnRvIHR1cGxlIG9mIHVyaSBhbmQgZGVzY3JpcHRvciBleGNlcHQgZm9yIHRoZSBsYXN0IGl0ZW1cclxuICAgICAgICAgICAgdmFyIHJhd1VyaXMgPSB0cmltbWVkU3Jjc2V0LnNwbGl0KHBhdHRlcm4pO1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggdHVwbGVzXHJcbiAgICAgICAgICAgIHZhciBuYnJVcmlzV2l0aDJwYXJ0cyA9IE1hdGguZmxvb3IocmF3VXJpcy5sZW5ndGggLyAyKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYnJVcmlzV2l0aDJwYXJ0czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJJZHggPSBpICogMjtcclxuICAgICAgICAgICAgICAgIC8vIHNhbml0aXplIHRoZSB1cmlcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAkJHNhbml0aXplVXJpKHRyaW0ocmF3VXJpc1tpbm5lcklkeF0pLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgZGVzY3JpcHRvclxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChcIiBcIiArIHRyaW0ocmF3VXJpc1tpbm5lcklkeCArIDFdKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBsYXN0IGl0ZW0gaW50byB1cmkgYW5kIGRlc2NyaXB0b3JcclxuICAgICAgICAgICAgdmFyIGxhc3RUdXBsZSA9IHRyaW0ocmF3VXJpc1tpICogMl0pLnNwbGl0KC9cXHMvKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNhbml0aXplIHRoZSBsYXN0IHVyaVxyXG4gICAgICAgICAgICByZXN1bHQgKz0gJCRzYW5pdGl6ZVVyaSh0cmltKGxhc3RUdXBsZVswXSksIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gYW5kIGFkZCB0aGUgbGFzdCBkZXNjcmlwdG9yIGlmIGFueVxyXG4gICAgICAgICAgICBpZiAobGFzdFR1cGxlLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChcIiBcIiArIHRyaW0obGFzdFR1cGxlWzFdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWUgPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod3JpdGVBdHRyICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgYW5ndWxhci5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJCRlbGVtZW50LnJlbW92ZUF0dHIoYXR0ck5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKFNJTVBMRV9BVFRSX05BTUUudGVzdChhdHRyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5hdHRyKGF0dHJOYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFNwZWNpYWxBdHRyKHRoaXMuJCRlbGVtZW50WzBdLCBhdHRyTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXJlIG9ic2VydmVyc1xyXG4gICAgICAgIHZhciAkJG9ic2VydmVycyA9IHRoaXMuJCRvYnNlcnZlcnM7XHJcbiAgICAgICAgaWYgKCQkb2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkJG9ic2VydmVyc1tvYnNlcnZlcl0sIGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkb2JzZXJ2ZVxyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIE9ic2VydmVzIGFuIGludGVycG9sYXRlZCBhdHRyaWJ1dGUuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG9ic2VydmVyIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBvbmNlIGR1cmluZyB0aGUgbmV4dCBgJGRpZ2VzdGAgZm9sbG93aW5nXHJcbiAgICAgKiBjb21waWxhdGlvbi4gVGhlIG9ic2VydmVyIGlzIHRoZW4gaW52b2tlZCB3aGVuZXZlciB0aGUgaW50ZXJwb2xhdGVkIHZhbHVlXHJcbiAgICAgKiBjaGFuZ2VzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTm9ybWFsaXplZCBrZXkuIChpZSBuZ0F0dHJpYnV0ZSkgLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihpbnRlcnBvbGF0ZWRWYWx1ZSl9IGZuIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXJcclxuICAgICAgICAgICAgICB0aGUgaW50ZXJwb2xhdGVkIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgY2hhbmdlcy5cclxuICAgICAqICAgICAgICBTZWUgdGhlIHtAbGluayBndWlkZS9pbnRlcnBvbGF0aW9uI2hvdy10ZXh0LWFuZC1hdHRyaWJ1dGUtYmluZGluZ3Mtd29yayBJbnRlcnBvbGF0aW9uXHJcbiAgICAgKiAgICAgICAgZ3VpZGV9IGZvciBtb3JlIGluZm8uXHJcbiAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24oKX0gUmV0dXJucyBhIGRlcmVnaXN0cmF0aW9uIGZ1bmN0aW9uIGZvciB0aGlzIG9ic2VydmVyLlxyXG4gICAgICovXHJcbiAgICAkb2JzZXJ2ZTogZnVuY3Rpb24oa2V5LCBmbikge1xyXG4gICAgICAgIHZhciBhdHRycyA9IHRoaXMsXHJcbiAgICAgICAgICAgICQkb2JzZXJ2ZXJzID0gKGF0dHJzLiQkb2JzZXJ2ZXJzIHx8IChhdHRycy4kJG9ic2VydmVycyA9IG5ldyBNYXAoKSkpLFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSAoJCRvYnNlcnZlcnNba2V5XSB8fCAoJCRvYnNlcnZlcnNba2V5XSA9IFtdKSk7XHJcblxyXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGZuKTtcclxuICAgICAgICBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRldmFsQXN5bmMoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzLiQkaW50ZXIgJiYgYXR0cnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhYW5ndWxhci5pc1VuZGVmaW5lZChhdHRyc1trZXldKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gb25lIHJlZ2lzdGVyZWQgYXR0cmlidXRlIGludGVycG9sYXRpb24gZnVuY3Rpb24sIHNvIGxldHMgY2FsbCBpdCBtYW51YWxseVxyXG4gICAgICAgICAgICAgICAgZm4oYXR0cnNba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmFycmF5UmVtb3ZlKGxpc3RlbmVycywgZm4pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0b2tlbkRpZmZlcmVuY2Uoc3RyMSwgc3RyMikge1xyXG5cclxuICAgIHZhciB2YWx1ZXMgPSAnJyxcclxuICAgICAgICB0b2tlbnMxID0gc3RyMS5zcGxpdCgvXFxzKy8pLFxyXG4gICAgICAgIHRva2VuczIgPSBzdHIyLnNwbGl0KC9cXHMrLyk7XHJcblxyXG4gICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHRva2VuczFbaV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRva2VuczIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gdG9rZW5zMltqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YWx1ZXMgKz0gKHZhbHVlcy5sZW5ndGggPiAwID8gJyAnIDogJycpICsgdG9rZW47XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbm9kZU5hbWVfKGVsZW1lbnQpIHtcclxuICAgIGNvbnN0IG15RWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KVswXTtcclxuICAgIGlmIChteUVsZW0pIHtcclxuICAgICAgICByZXR1cm4gbXlFbGVtLm5vZGVOYW1lO1xyXG4gICAgfVxyXG59XHJcbnZhciBzcGVjaWFsQXR0ckhvbGRlciA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxudmFyIFNJTVBMRV9BVFRSX05BTUUgPSAvXlxcdy87XHJcblxyXG5mdW5jdGlvbiBzZXRTcGVjaWFsQXR0cihlbGVtZW50LCBhdHRyTmFtZSwgdmFsdWUpIHtcclxuICAgIC8vIEF0dHJpYnV0ZXMgbmFtZXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBsZXR0ZXJzIChzdWNoIGFzIGAoY2xpY2spYCkgY2Fubm90IGJlIHNldCB1c2luZyBgc2V0QXR0cmlidXRlYFxyXG4gICAgLy8gc28gd2UgaGF2ZSB0byBqdW1wIHRocm91Z2ggc29tZSBob29wcyB0byBnZXQgc3VjaCBhbiBhdHRyaWJ1dGVcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvcHVsbC8xMzMxOFxyXG4gICAgc3BlY2lhbEF0dHJIb2xkZXIuaW5uZXJIVE1MID0gXCI8c3BhbiBcIiArIGF0dHJOYW1lICsgXCI+XCI7XHJcbiAgICB2YXIgYXR0cmlidXRlcyA9IHNwZWNpYWxBdHRySG9sZGVyLmZpcnN0Q2hpbGQuYXR0cmlidXRlcztcclxuICAgIHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzWzBdO1xyXG4gICAgLy8gV2UgaGF2ZSB0byByZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tIGl0cyBjb250YWluZXIgZWxlbWVudCBiZWZvcmUgd2UgY2FuIGFkZCBpdCB0byB0aGUgZGVzdGluYXRpb24gZWxlbWVudFxyXG4gICAgYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0oYXR0cmlidXRlLm5hbWUpO1xyXG4gICAgYXR0cmlidXRlLnZhbHVlID0gdmFsdWU7XHJcbiAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGF0dHJpYnV0ZSk7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQXR0cmlidXRlcztcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2F0dHJpYnV0ZS5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIG1ha2VBcnJheSxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBpc0V4cHJlc3Npb24sXHJcbiAgICBleHByZXNzaW9uU2FuaXRpemVyXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxuY29uc3QgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyk7XHJcblxyXG5jbGFzcyBjb250cm9sbGVyIHtcclxuICAgIHN0YXRpYyBnZXRWYWx1ZXMoc2NvcGUsIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSB7fTtcclxuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3QoYmluZGluZ3MpKSB7XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBiaW5kaW5ncyA9PT0gJz0nKSB7XHJcbiAgICAgICAgICAgICAgICBiaW5kaW5ncyA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAnPSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhiaW5kaW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGUgPSByZXN1bHRbMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICc9JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9ICRwYXJzZShwYXJlbnRHZXQoc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IChsb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHAgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0V4cCA9IGlzRXhwcmVzc2lvbihleHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAkcGFyc2UoZXhwcmVzc2lvblNhbml0aXplcihleHApKShzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgY29uc3QgYXNzaWduQmluZGluZ3MgPSAoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIG1vZGUpID0+IHtcclxuICAgICAgICAgICAgbW9kZSA9IG1vZGUgfHwgJz0nO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMobW9kZSk7XHJcbiAgICAgICAgICAgIG1vZGUgPSByZXN1bHRbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkS2V5ID0gY29udHJvbGxlckFzICsgJy4nICsga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gY2hpbGRHZXQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50R2V0LmFzc2lnbihzY29wZSwgcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNFeHAgPSBpc0V4cHJlc3Npb24oc2NvcGVbcGFyZW50S2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVXYXRjaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlLCBpc29sYXRlU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHNjb3BlSGVscGVyLmNyZWF0ZShpc29sYXRlU2NvcGUgfHwgc2NvcGUuJG5ldygpKTtcclxuICAgICAgICBpZiAoIWJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzID09PSB0cnVlIHx8IGFuZ3VsYXIuaXNTdHJpbmcoYmluZGluZ3MpICYmIGJpbmRpbmdzID09PSAnPScpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSAmJiBrZXkgIT09IGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBwYXJzZSBiaW5kaW5ncyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljICRnZXQobW9kdWxlTmFtZXMpIHtcclxuICAgICAgICBsZXQgJGNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29uc3QgYXJyYXkgPSBtYWtlQXJyYXkobW9kdWxlTmFtZXMpO1xyXG4gICAgICAgIC8vIGNvbnN0IGluZGV4TW9jayA9IGFycmF5LmluZGV4T2YoJ25nTW9jaycpO1xyXG4gICAgICAgIC8vIGNvbnN0IGluZGV4TmcgPSBhcnJheS5pbmRleE9mKCduZycpO1xyXG4gICAgICAgIC8vIGlmIChpbmRleE1vY2sgIT09IC0xKSB7XHJcbiAgICAgICAgLy8gICAgIGFycmF5W2luZGV4TW9ja10gPSAnbmcnO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBpZiAoaW5kZXhOZyA9PT0gLTEpIHtcclxuICAgICAgICAvLyAgICAgYXJyYXkucHVzaCgnbmcnKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgYW5ndWxhci5pbmplY3RvcihhcnJheSkuaW52b2tlKFxyXG4gICAgICAgICAgICBbJyRjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIChjb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgc2NvcGUsIGJpbmRpbmdzLCBzY29wZUNvbnRyb2xsZXJOYW1lLCBleHRlbmRlZExvY2Fscykge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XHJcbiAgICAgICAgICAgIHNjb3BlQ29udHJvbGxlck5hbWUgPSBzY29wZUNvbnRyb2xsZXJOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgbGV0IGxvY2FscyA9IGV4dGVuZChleHRlbmRlZExvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgZXh0ZW5kKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBjb250cm9sbGVyLmdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gY29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MgPSAoYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmluZGluZ3MgPSBiIHx8IGJpbmRpbmdzO1xyXG4gICAgICAgICAgICAgICAgLy8gbG9jYWxzID0gbXlMb2NhbHMgfHwgbG9jYWxzO1xyXG4gICAgICAgICAgICAgICAgLy8gYiA9IGIgfHwgYmluZGluZ3M7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvL2V4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgZXh0ZW5kZWRMb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGVDb250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIG1ha2VBcnJheSxcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2NvcGVIZWxwZXJcclxufSBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IHtcclxuICAgICRfQ09OVFJPTExFUlxyXG59IGZyb20gJy4vY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG52YXIgY29udHJvbGxlckhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcclxuICAgIGxldCBteU1vZHVsZXMsIGN0cmxOYW1lLCBjTG9jYWxzLCBwU2NvcGUsIGNTY29wZSwgY05hbWUsIGJpbmRUb0NvbnRyb2xsZXI7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFuKCkge1xyXG4gICAgICAgIG15TW9kdWxlcyA9IFtdO1xyXG4gICAgICAgIGN0cmxOYW1lID0gcFNjb3BlID0gY0xvY2FscyA9IGNTY29wZSA9IGJpbmRUb0NvbnRyb2xsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiAkY29udHJvbGxlckhhbmRsZXIoKSB7XHJcblxyXG4gICAgICAgIGlmICghY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1BsZWFzZSBwcm92aWRlIHRoZSBjb250cm9sbGVyXFwncyBuYW1lJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHBTY29wZSB8fCB7fSk7XHJcbiAgICAgICAgaWYgKCFjU2NvcGUpIHtcclxuICAgICAgICAgICAgY1Njb3BlID0gcFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB9IHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcFNjb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShjU2NvcGUpO1xyXG4gICAgICAgICAgICBpZiAodGVtcFNjb3BlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY1Njb3BlID0gdGVtcFNjb3BlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b1JldHVybiA9IG5ldyAkX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZFRvQ29udHJvbGxlciwgbXlNb2R1bGVzLCBjTmFtZSwgY0xvY2Fscyk7XHJcbiAgICAgICAgY2xlYW4oKTtcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYmluZFdpdGggPSBmdW5jdGlvbihiaW5kaW5ncykge1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jb250cm9sbGVyVHlwZSA9ICRfQ09OVFJPTExFUjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jbGVhbiA9IGNsZWFuO1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlID0gZnVuY3Rpb24obmV3U2NvcGUpIHtcclxuICAgICAgICBwU2NvcGUgPSBuZXdTY29wZTtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRMb2NhbHMgPSBmdW5jdGlvbihsb2NhbHMpIHtcclxuICAgICAgICBjTG9jYWxzID0gbG9jYWxzO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG5cclxuICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcyA9IGZ1bmN0aW9uKG1vZHVsZXMpIHtcclxuICAgICAgICBmdW5jdGlvbiBwdXNoQXJyYXkoYXJyYXkpIHtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobXlNb2R1bGVzLCBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG1vZHVsZXMpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShhcmd1bWVudHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShbbW9kdWxlc10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBwdXNoQXJyYXkobWFrZUFycmF5KG1vZHVsZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuaXNJbnRlcm5hbCA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbGFnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJuYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGludGVybmFsID0gISFmbGFnO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW50ZXJuYWwgPSAhZmxhZztcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXcgPSBmdW5jdGlvbihjb250cm9sbGVyTmFtZSwgc2NvcGVDb250cm9sbGVyc05hbWUsIHBhcmVudFNjb3BlLCBjaGlsZFNjb3BlKSB7XHJcbiAgICAgICAgY3RybE5hbWUgPSBjb250cm9sbGVyTmFtZTtcclxuICAgICAgICBpZiAoc2NvcGVDb250cm9sbGVyc05hbWUgJiYgIWFuZ3VsYXIuaXNTdHJpbmcoc2NvcGVDb250cm9sbGVyc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoc2NvcGVDb250cm9sbGVyc05hbWUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHBhcmVudFNjb3BlKSB8fCBjU2NvcGU7XHJcbiAgICAgICAgICAgIGNOYW1lID0gJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwYXJlbnRTY29wZSB8fCBwU2NvcGUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoY2hpbGRTY29wZSB8fCBwU2NvcGUuJG5ldygpKTtcclxuICAgICAgICAgICAgY05hbWUgPSBzY29wZUNvbnRyb2xsZXJzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcigpO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXdTZXJ2aWNlID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUsIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAkY29udHJvbGxlckhhbmRsZXIubmV3KGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlKTtcclxuICAgICAgICB0b1JldHVybi5iaW5kaW5ncyA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVySGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5kZXNjcmliZSgnY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kIHdoaWNoIHJldHVybiBhIGNvbnRyb2xsZXIgZ2VuZXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuJGdldCkudG9CZURlZmluZWQoKTtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQoJ25nJykuY3JlYXRlKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJyRnZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgY29udHJvbGxlckNyZWF0b3I7XHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNyZWF0b3IgPSBjb250cm9sbGVyLiRnZXQoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhIHZhbGlkIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLm5hbWUpLnRvQmUoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbnRyb2xsZXJzIHdpdGggaW5qZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLiRxKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBhbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7fSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywgc2NvcGUsIGZhbHNlKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQuY29udHJvbGxlcikudG9CZShjb250cm9sbGVyMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzZXQgYSBwcm9wZXJ0eSBpbiB0aGUgc2NvcGUgZm9yIHRoZSBjb250cm9sbGVyIHdpdGggdGhlIGdpdmVuIG5hbWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSwgJ215Q29udHJvbGxlcicpKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS4kJGNoaWxkSGVhZC5teUNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKCdiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgXCJ0cnVlXCIgYW5kIFwiPVwiIGFzIGJpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0sIHRydWUpKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjEuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMiA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCAnPScpKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCBiaW5kIGlmIGJpbmRUb0NvbnRyb2xsZXIgaXMgXCJmYWxzZVwiIG9yIFwidW5kZWZpbmVkXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3VuZGVmaW5lZCBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMi5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkZXNjcmliZSgnYmluZFRvQ29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIj1cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCJAXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnQCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiJlwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KCkpLnRvQmUoJzEyMycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ2V4cHJlc3Npb25zIHNob3VsZCBhbGxvdyBsb2NhbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnb3RoZXJQcm9wZXJ0eS5qb2luKFwiXCIpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWzEsIDIsIDNdXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnJidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmJvdW5kUHJvcGVydHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbJ2EnLCAnYicsICdjJ11cclxuICAgICAgICAgICAgICAgICAgICB9KSkudG9CZSgnYWJjJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5cclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJIYW5kbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVySGFuZGxlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhZGRpbmcgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29udHJvbGxlckhhbmRsZXIgd2hlbiBhZGRpbmcgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCdteU1vZHVsZScpKS50b0JlKGNvbnRyb2xsZXJIYW5kbGVyKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2NyZWF0aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGNyZWF0aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJHBhcmVudCkudG9CZShjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnVzZWRNb2R1bGVzKS50b0VxdWFsKFsndGVzdCddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGNyZWF0aW5nIGEgY29udHJvbGxlciB3aXRoIGJpbmRpbmdzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnc29tZXRoaW5nJ1xyXG4gICAgICAgICAgICB9KS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgfSkubmV3KCd3aXRoQmluZGluZ3MnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY3JlYXRlKCkpLnRvQmUoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuYm91bmRQcm9wZXJ0eSkudG9CZSgnc29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyB0byBjaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIGJpbmRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXF1YWxzOiBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJ5VGV4dDogJ2J5VGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2J5VGV4dC50b1VwcGVyQ2FzZSgpJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsc1Jlc3VsdDogJz1lcXVhbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ5VGV4dFJlc3VsdDogJ0BieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25SZXN1bHQ6ICcmZXhwcmVzc2lvbidcclxuICAgICAgICAgICAgICAgIH0pLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5lcXVhbHNSZXN1bHQpLnRvQmUoc2NvcGUuZXF1YWxzKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJ5VGV4dFJlc3VsdCkudG9CZShzY29wZS5ieVRleHQpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXhwcmVzc2lvblJlc3VsdCgpKS50b0JlKHNjb3BlLmJ5VGV4dC50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnV2F0Y2hlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IHNjb3BlLCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIHdhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5ib3VuZFByb3BlcnR5ID0gJ2xhbGEnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlKHNjb3BlKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyT2JqLndhdGNoKCdjb250cm9sbGVyLmJvdW5kUHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSkuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdsYWxhJyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmJvdW5kUHJvcGVydHkgPSAnbG9sbyc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhcmdzKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZWZsZWMgY2hhbmdlcyBvbiB0aGUgY29udHJvbGxlciBpbnRvIHRoZSBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyT2JqLndhdGNoKCdjb250cm9sbGVyLmJvdW5kUHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSkuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdsYWxhJyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmJvdW5kUHJvcGVydHkgPSAnbG9sbyc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSkudG9CZSgnbG9sbycpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5wYXJlbnRTY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZWZsZWMgY2hhbmdlcyBvbiB0aGUgc2NvcGUgaW50byB0aGUgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdwYXJlbnQnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBnaXZlIHRoZSBwYXJlbnQgc2NvcGUgcHJpdmlsZWdlIG92ZXIgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdwYXJlbnQnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2NoaWxkJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgYSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKTtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygndGVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZGVzdHJveWluZyB0aGUgb2JqZWN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyT2JqLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnY29udHJvbGxlclNwaWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB1bmlxdWVPYmplY3QgPSBmdW5jdGlvbiB1bmlxdWVPYmplY3QoKSB7fTtcclxuICAgIGxldCBjb250cm9sbGVyQ29uc3RydWN0b3I7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgaWYgKGNvbnRyb2xsZXJDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yID0gY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygndGVzdCcpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgYTogJz0nLFxyXG4gICAgICAgICAgICBiOiAnQCcsXHJcbiAgICAgICAgICAgIGM6ICcmJ1xyXG4gICAgICAgIH0pLnNldFNjb3BlKHtcclxuICAgICAgICAgICAgYTogdW5pcXVlT2JqZWN0LFxyXG4gICAgICAgICAgICBiOiAnYicsXHJcbiAgICAgICAgICAgIGM6ICdhJ1xyXG4gICAgICAgIH0pLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgY3JlYXRlIHNwaWVzIGZvciBlYWNoIEJvdW5kZWQgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNvbnN0cnVjdG9yLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gY29udHJvbGxlckNvbnN0cnVjdG9yLkludGVybmFsU3BpZXMuU2NvcGVbJ2E6YSddO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyLmEgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QodHlwZW9mIG15U3B5LnRvb2soKSA9PT0gJ251bWJlcicpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LnRvb2soKSkudG9CZShteVNweS50b29rKCkpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvc3BpZXMuc3BlYy5qc1xuICoqLyIsInJlcXVpcmUoJy4vaHRtbENvbXBpbGF0aW9uJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlSGFuZGxlci5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nQ2xpY2suc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nSWYuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nTW9kZWwuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nVHJhbnNsYXRlLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0NsaWNrLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9uZ0JpbmQuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nQ2xhc3Muc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL25nUmVwZWF0LnNwZWMuanMnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9pbmRleC5qc1xuICoqLyIsInJlcXVpcmUoJy4vbmdDbGlja0hUTUwuc3BlYycpO1xyXG5yZXF1aXJlKCcuL25nSWZIVE1MLnNwZWMnKTtcclxucmVxdWlyZSgnLi9uZ01vZGVsSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdCaW5kSFRNTC5zcGVjJyk7XHJcbnJlcXVpcmUoJy4vbmdUcmFuc2xhdGVIVE1MLnNwZWMnKTtcclxucmVxdWlyZSgnLi9uZ0NsYXNzSFRNTC5zcGVjJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZUhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ25nQ2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2FsbCBuZy1jbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctY2xpY2s9XCJjdHJsLmFTdHJpbmcgPSBcXCdhbm90aGVyVmFsdWVcXCdcIi8+Jyk7XHJcbiAgICAgICAgaGFuZGxlci4kY2xpY2soKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCdhbm90aGVyVmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBub3QgZmFpbCBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiAvPicpO1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlci4kZmluZCgnYScpLiRjbGljaygpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGRvZXMgbm90IGhhdmUgdGhlIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiAvPicpO1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlci4kY2xpY2soKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFwcGx5IHRoZSBjbGljayBldmVudCB0byBlYWNoIG9mIGl0cyBjaGlsZHJlbnMgKGlmIG5lZWRlZCknLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICBgICAgPGRpdiBuZy1jbGljaz1cImN0cmwuYUludCA9IGN0cmwuYUludCArIDFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdmaXJzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3NlY29uZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3RoaXJkJz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYvPmApO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyNmaXJzdCcpLiRjbGljaygpO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyNzZWNvbmQnKS4kY2xpY2soKTtcclxuICAgICAgICBoYW5kbGVyLiRmaW5kKCcjdGhpcmQnKS4kY2xpY2soKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKDMpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgbG9jYWxzIChmb3IgdGVzdGluZyknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsXHJcbiAgICAgICAgICAgIGAgICA8ZGl2IG5nLWNsaWNrPVwiY3RybC5hSW50ID0gIHZhbHVlICsgY3RybC5hSW50IFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2ZpcnN0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nc2Vjb25kJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0ndGhpcmQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdi8+YCk7XHJcbiAgICAgICAgaGFuZGxlci4kZmluZCgnI2ZpcnN0JykuJGNsaWNrKHtcclxuICAgICAgICAgICAgdmFsdWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKDEwMDApO1xyXG4gICAgICAgIGhhbmRsZXIuJGZpbmQoJyNzZWNvbmQnKS4kY2xpY2soe1xyXG4gICAgICAgICAgICB2YWx1ZTogJydcclxuICAgICAgICB9KTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKCcxMDAwJyk7XHJcbiAgICAgICAgaGFuZGxlci4kZmluZCgnI3RoaXJkJykuJGNsaWNrKHtcclxuICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICB9KTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKCcxMTAwMCcpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0NsaWNrSFRNTC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZUhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ25nSWYnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaWYnKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IHRvIGNhbGwgbmdJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXY+PGRpdiBuZy1pZj1cImN0cmwuYUJvb2xlYW5cIi8+PC9kaXY+Jyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGlmKCkpLnRvQmUodW5kZWZpbmVkKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kZmluZCgnZGl2JykuJGlmKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIHRoZSBlbGVtZW50cyBmcm9tIHRoZSBkb20nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2PjxkaXYgbmctaWY9XCJjdHJsLmFCb29sZWFuXCIvPjwvZGl2PicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYUJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kZmluZCgnZGl2JykuJGlmKCkpLnRvQmUodW5kZWZpbmVkKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5jaGlsZHJlbigpLmxlbmd0aCkudG9CZSgwKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgdGhlIGVsZW1lbnRzIGZyb20gdGhlIGRvbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXY+PGRpdiBjbGFzcz1cIm15LWNsYXNzXCIgbmctaWY9XCJjdHJsLmFCb29sZWFuXCIvPjwvZGl2PicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYUJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kZmluZCgnZGl2JykuJGlmKCkpLnRvQmUodW5kZWZpbmVkKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5jaGlsZHJlbigpLmxlbmd0aCkudG9CZSgwKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kZmluZCgnZGl2JykuJGlmKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGZpbmQoJ2RpdicpLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHByZXZlbnQgdGhlIHVzYWdlIG9mIG5lc3RlZCBkaXJlY3RpdmVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdj48ZGl2IGNsYXNzPVwibXktY2xhc3NcIiBuZy1pZj1cImN0cmwuYUJvb2xlYW5cIj48YnV0dG9uIG5nLWNsaWNrPVwiY3RybC5hRnVuY3Rpb24oKVwiLz48L2Rpdj48L2Rpdj4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgaGFuZGxlci4kZmluZCgnYnV0dG9uJykuJGNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyB1c2luZyBuZ0lmIG9uIHRoZSB0b3AgZWxlbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgY2xhc3M9XCJteS1jbGFzc1wiIG5nLWlmPVwiY3RybC5hQm9vbGVhblwiLz4nKTtcclxuICAgICAgICBjb250cm9sbGVyLmFCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGlmKCkpLnRvQmUodW5kZWZpbmVkKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hQm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuJGlmKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ0lmSFRNTC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZUhhbmRsZXIgZnJvbSAnLi8uLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ25nTW9kZWwnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnYVZhbHVlJyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiBzcHksXHJcbiAgICAgICAgICAgIGFLZXk6ICdIRUxMTycsXHJcbiAgICAgICAgICAgIGFJbnQ6IDAsXHJcbiAgICAgICAgICAgIGFCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9JyxcclxuICAgICAgICAgICAgYUJvb2xlYW46ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2FsbCB0ZXh0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1tb2RlbD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kdGV4dCgpKS50b0JlKCdhVmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjaGFuZ2UgdGhlIGNvbnRyb2xsZXIgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLW1vZGVsPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGhhbmRsZXIuJHRleHQoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnbmV3VmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjaGFuZ2UgdGhlIGNvbnRyb2xsZXIgdmFsdWUsIG9uZSBsZXR0ZXIgYXQgdGhlIHRpbWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLW1vZGVsPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKCdjdHJsLmFTdHJpbmcnLCBzcHkpO1xyXG4gICAgICAgIGhhbmRsZXIuJHRleHQoJ25ld1ZhbHVlJy5zcGxpdCgnJykpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKCduZXdWYWx1ZScubGVuZ3RoKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9odG1sQ29tcGlsYXRpb24vbmdNb2RlbEhUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnYmluZCcpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ0hFTExPJyxcclxuICAgICAgICAgICAgYUludDogMCxcclxuICAgICAgICAgICAgYUJvb2xlYW46IHRydWVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICc9JyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgIGFLZXk6ICdAJyxcclxuICAgICAgICAgICAgYUludDogJz0nLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogJz0nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIG5vdCB0aHJvdycsICgpID0+IHtcclxuICAgICAgICBleHBlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxwIG5nLWJpbmQ9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBkZWZpbmVkIG5nQmluZCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8cCBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLiR0ZXh0KS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIGFzIGpRdWVyeW1ldGhvZCAudGV4dCgpJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxwIG5nLWJpbmQ9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIudGV4dCgpKS50b0JlKGhhbmRsZXIuJHRleHQoKSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nQmluZEhUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ1RyYW5zbGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ1RJVExFJyxcclxuICAgICAgICAgICAgYUludDogMCxcclxuICAgICAgICAgICAgYUJvb2xlYW46IHRydWVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICc9JyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgIGFLZXk6ICdAJyxcclxuICAgICAgICAgICAgYUludDogJz0nLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogJz0nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdpdGggdGhlIHRyYW5zbGF0YXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPHNwYW4gdHJhbnNsYXRlPVwiVElUTEVcIj48ZGl2PnNvbWV0aGluZzwvZGk+PC9zcGFuPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci4kZmluZCgnZGl2JykubGVuZ3RoKS50b0JlKDApO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgdGhlIGNvbnRlbnQgYWZ0ZXIgYSAkZGlnZXN0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxzcGFuIHRyYW5zbGF0ZT1cInt7Y3RybC5hS2V5fX1cIj48ZGl2PnNvbWV0aGluZzwvZGk+PC9zcGFuPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZSgnc29tZXRoaW5nJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIudGV4dCgpKS50b0JlKCdIZWxsbycpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2h0bWxDb21waWxhdGlvbi9uZ1RyYW5zbGF0ZUhUTUwuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsYXNzJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsYXNzJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYXNTdHJpbmc6ICdteS1jbGFzcyBteS1vdGhlci1jbGFzcycsXHJcbiAgICAgICAgICAgIGZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICBzZWNvbmQ6IHRydWVcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlIChhZnRlciAkZGlnZXN0KScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctY2xhc3M9XCJjdHJsLmFzU3RyaW5nXCIvPicpO1xyXG4gICAgICAgIGV4cGVjdChoYW5kbGVyLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QoaGFuZGxlci5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGhhbmRsZXIuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvaHRtbENvbXBpbGF0aW9uL25nQ2xhc3NIVE1MLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnZGlyZWN0aXZlSGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ0hFTExPJyxcclxuICAgICAgICAgICAgYUludDogMCxcclxuICAgICAgICAgICAgYUJvb2xlYW46IHRydWVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICc9JyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgIGFLZXk6ICdAJyxcclxuICAgICAgICAgICAgYUludDogJz0nLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogJz0nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZUhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY3JlYXRlIG5ldyBpbnN0YW5jZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5ldyBkaXJlY3RpdmVIYW5kbGVyKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNvbXBpbGUgaHRtbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2Lz4nKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiBcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnZGlyZWN0aXZlUHJvdmlkZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGEgJGdldCBtZXRob2QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgYW5kIG5vdCB0aHJvdyBpcyB0aGUgZGlyZWN0aXZlIGRvZXMgbm90IGV4aXN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHJldHVybmVkID0ge307XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm5lZCA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25vdCBleGlzdGluZycpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgZXhwZWN0KHJldHVybmVkKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIFtcclxuICAgICAgICAnbmctaWYnLFxyXG4gICAgICAgICduZzppZicsXHJcbiAgICAgICAgJ25nSWYnLFxyXG4gICAgICAgICduZy1yZXBlYXQnLFxyXG4gICAgICAgICduZy1jbGljaycsXHJcbiAgICAgICAgJ25nLWRpc2FibGVkJyxcclxuICAgICAgICAnbmctYmluZCcsXHJcbiAgICAgICAgJ25nLW1vZGVsJyxcclxuICAgICAgICAndHJhbnNsYXRlJyxcclxuICAgICAgICAndHJhbnNsYXRlLXZhbHVlJyxcclxuICAgICAgICAnbmctY2xhc3MnXHJcbiAgICBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWx3YXlzIGNvbnRhaW4gdGhlICcgKyBpdGVtICsgJ2RpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldChpdGVtKSkudG9CZURlZmluZWQoaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgncHV0cyBhbmQgdXNlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzcHk7XHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgc3B5LmFuZC5yZXR1cm5WYWx1ZShzcHkpO1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kY2xlYW4oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyBkaXJlY3RpdmVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIHNweSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteTpkaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXlEaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgb3ZlcndyaXRpbmcsIGJ1dCBwcmVzZXJ2ZSBmaXJzdCB2ZXJzaW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBmdW5jdGlvbigpIHt9KTtcclxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnYWxsb3cgbWUgdG8gb3ZlcndyaXRlIHdpdGggYSB0aGlyZCBwYXJhbWV0ZXIgaW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybiB0cnVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIHNweSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFub3RoZXJTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBhbm90aGVyU3B5LmFuZC5yZXR1cm5WYWx1ZShhbm90aGVyU3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgYW5vdGhlclNweSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS5ub3QudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLnRvQmUoYW5vdGhlclNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KGFub3RoZXJTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUNsaWNrLCBzcHk7XHJcbiAgICBjb25zdCBuZ0NsaWNrID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmdDbGljaycpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteVNweTogc3B5XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgbXlDbGljayA9IG5nQ2xpY2suY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2N0cmwubXlTcHkocGFyYW0xLCBwYXJhbTIpJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlDbGljaykudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjYWxsaW5nIGl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRoZSBzcHkgd2hlbiBjYWxsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MSA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MiA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge1xyXG4gICAgICAgICAgICBwYXJhbTE6IG9iamVjdDEsXHJcbiAgICAgICAgICAgIHBhcmFtMjogb2JqZWN0MlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG9iamVjdDEsIG9iamVjdDIpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nSWYnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlJZjtcclxuICAgIGNvbnN0IG5nSWYgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZy1pZicpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteUJvb2xlYW46IHRydWVcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBteUlmID0gbmdJZi5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnY3RybC5teUJvb2xlYW4nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmluZWQgbXlJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUlmKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgaWYgbm8gJGRpZ2VzdCB3YXMgZXhlY3V0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgZXhwcmVzc2lvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBsYXRlc3QgZXZhbHVhdGVkIHZhbHVlIG9uIGEgd2F0Y2gnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2UubXlCb29sZWFuID0gYW5ndWxhci5ub29wO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLm5vdC50b0JlKGFuZ3VsYXIubm9vcCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZShhbmd1bGFyLm5vb3ApO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGF0dGFjaGluZyBzcHlzIHRvIHRoZSB3YXRjaGluZyBjeWNsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBteUlmKG15U3B5KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBkZWF0dGFjaGluZyBzcGllcyB0byB0aGUgd2F0Y2hpbmcgY3ljbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IG15SWYobXlTcHkpO1xyXG4gICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgb25seSBkZWF0dGFjaCB0aGUgY29ycmVjcG9uZGluZyBzcHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3QgbXlTcHkyID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBjb25zdCB3YXRjaGVyID0gbXlJZihteVNweSk7XHJcbiAgICAgICAgbXlJZihteVNweTIpO1xyXG4gICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5MikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgXHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nSWYuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nTW9kZWwnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlNb2RlbCwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgY29uc3QgbmdNb2RlbCA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nTW9kZWwnKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnY3RybC5teVN0cmluZ1BhcmFtZXRlcic7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7fSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICBteU1vZGVsID0gbmdNb2RlbC5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15TW9kZWwpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHRoZSBjb250cm9sbGVyIHdoZW4gcmVjZWl2aW5nIGEgc3RyaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbXlNb2RlbCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGZpcmUgYW4gZGlnZXN0IHdoZW4gZG9pbmcgYW5kIGFzc2lnbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBteU1vZGVsKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjdXJyZW50IHZhbHVlIG9mIGN1cnJlbnQgc3RhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ3NvbWVWYWx1ZSc7XHJcbiAgICAgICAgZXhwZWN0KG15TW9kZWwoKSkudG9CZSgnc29tZVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZpcmUgZGlnZXN0cyB3aGVuIGNvbnN1bHRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ3NvbWVWYWx1ZSc7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgc3B5KTtcclxuICAgICAgICBteU1vZGVsKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhcnJheSB0byBmaXJlIGNoYW5nZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBvYmplY3RbbmV3VmFsdWVdID0gIW9iamVjdFtuZXdWYWx1ZV0gPyAxIDogb2JqZWN0W25ld1ZhbHVlXSArIDE7IC8vY291bnRpbmcgdGhlIGNhbGxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXlNb2RlbChbJ2EnLCAnVicsICdhJywgJ2wnLCAndScsICdlJ10pO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qob2JqZWN0KS50b0VxdWFsKHtcclxuICAgICAgICAgICAgYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVY6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbDogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHU6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1ZTogMSAvL29ubHkgb25jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGEgc2Vjb25kIHRydWUgcGFyYW1ldGVyLCB0byBzaW11bGF0ZSB0aGUgYXJyYXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBvYmplY3RbbmV3VmFsdWVdID0gIW9iamVjdFtuZXdWYWx1ZV0gPyAxIDogb2JqZWN0W25ld1ZhbHVlXSArIDE7IC8vY291bnRpbmcgdGhlIGNhbGxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXlNb2RlbCgnYVZhbHVlJywgdHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVjogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHVlOiAxIC8vb25seSBvbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhIGNoYW5nZXMgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlNb2RlbC5jaGFuZ2VzKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2NoYW5nZXMgc2hvdWxkIG9ubHkgZmlyZSBvbmNlIHBlciBjaGFuZ2UgKGluZGVwZW5kZW50IG9mIHdhdGNoZXIpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXJTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCB3YXRjaGVyU3B5KTtcclxuICAgICAgICAgICAgbXlNb2RlbC5jaGFuZ2VzKHNweSk7XHJcbiAgICAgICAgICAgIG15TW9kZWwoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ2Fub3RoZXJWYWx1ZSc7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNik7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3YXRjaGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdNb2RlbC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdUcmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlUcmFuc2xhdGU7XHJcbiAgICBjb25zdCBuZ1RyYW5zbGF0ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ3RyYW5zbGF0ZScpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBwcm9wOiAnVElUTEUnXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUgPSBuZ1RyYW5zbGF0ZS5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAne3tjdHJsLnByb3B9fScpO1xyXG4gICAgICAgIG5nVHJhbnNsYXRlLmNoYW5nZUxhbmd1YWdlKCdlbicpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGNhbGxpbmcgdGhlIHRyYW5zbGF0ZSBtZXRob2QnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgbXlUcmFuc2xhdGUoKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdHJhbnNsYXRlZCB2YWx1ZSAob25jZSBldmFsdWF0ZWQpJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteVRyYW5zbGF0ZSgpKS50b0JlKCdIZWxsbycpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgb2xkIHZhbHVlIGlmIGl0IHdhc25cXCd0IGV2YWx1YXRlZCcsICgpID0+IHtcclxuICAgICAgICBteVRyYW5zbGF0ZS5jaGFuZ2VMYW5ndWFnZSgnZGUnKTtcclxuICAgICAgICBleHBlY3QobXlUcmFuc2xhdGUoKSkudG9CZSgnSGVsbG8nKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlUcmFuc2xhdGUoKSkudG9CZSgnSGFsbG8nKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBhdHRhY2ggdG8gY2hhbmdlcycsICgpID0+IHtcclxuICAgICAgICBjb25zdCBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgndHJhbnNsYXRlJyk7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZS5wcm9wID0gJ0ZPTyc7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RoaXMgaXMgYSBwYXJhZ3JhcGguJyk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nQmluZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUJpbmQsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGNvbnN0IG5nQmluZCA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nQmluZCcpO1xyXG4gICAgY29uc3QgZXhwcmVzc2lvbiA9ICdjdHJsLm15U3RyaW5nUGFyYW1ldGVyJztcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlTdHJpbmdQYXJhbWV0ZXI6ICdhVmFsdWUnXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICBteUJpbmQgPSBuZ0JpbmQuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlCaW5kKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZCkudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyB3aGVuIGNhbGxlZCcsICgpID0+IHtcclxuICAgICAgICBleHBlY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBteUJpbmQoKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgdGhlIGZpcnN0IHRpbWUgaXQgd2FzIGF0dGFjaGVyICh3YXRjaGVycyBkaWRuXFwndCBydW4pJywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGFzdCB3YXRjaGVkIHZhbHVlJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdhbm90aGVyVmFsdWUnO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZCgpKS50b0JlKCdhbm90aGVyVmFsdWUnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byB3YXRjaCBjaGFuZ2VzJywgKCkgPT4ge1xyXG4gICAgICAgIG15QmluZC5jaGFuZ2VzKHNweSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2FWYWx1ZScpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQmluZC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGUgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsYXNzJywgKCkgPT4ge1xyXG4gICAgY29uc3QgbmdDbGFzcyA9IGRpcmVjdGl2ZVByb3ZpZGUuJGdldCgnbmctY2xhc3MnKTtcclxuXHJcbiAgICBsZXQgY29udHJvbGxlciwgY29udHJvbGxlclNlcnZpY2UsIG15Q2xhc3NUZXh0LCBteUNsYXNzRXhwcmVzc2lvbjtcclxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15U3RyaW5nUGFyYW1ldGVyOiAnbXktY2xhc3MnLFxyXG4gICAgICAgICAgICBjbGFzczE6IHRydWUsXHJcbiAgICAgICAgICAgIGNsYXNzMjogZmFsc2VcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlDbGFzc1RleHQgPSBuZ0NsYXNzLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsICdjdHJsLm15U3RyaW5nUGFyYW1ldGVyJyk7XHJcbiAgICAgICAgbXlDbGFzc0V4cHJlc3Npb24gPSBuZ0NsYXNzLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsICd7IFwibXktY2xhc3NcIjogY3RybC5jbGFzczEsIFwibXktb3RoZXItY2xhc3NcIjogY3RybC5jbGFzczIgfScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0KS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY2xhc3MsIGJ1dCBvbmx5IGFmdGVyIHRoZSBmaXJzdCAkZGlnZXN0JywgKCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dCgpKS50b0JlKCcnKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQoKSkudG9CZSgnbXktY2xhc3MnKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgc2VtaSBidWlsZCBleHByZXNzaW9ucycsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24oKSkudG9CZSgnJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uKCkpLnRvQmUoJ215LWNsYXNzJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgY2hlY2sgaWYgaXQgaGFzIHRoZSBjbGFzcywgcmVnYXJkbGVzcyBvZiB0aGUgZXhwcmVzc2lvbicsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dC5oYXNDbGFzcygnbXktb3RoZXItY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1jbGFzcycpKS50b0JlKGZhbHNlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dC5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc1RleHQuaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QobXlDbGFzc0V4cHJlc3Npb24uaGFzQ2xhc3MoJ215LW90aGVyLWNsYXNzJykpLnRvQmUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2xhc3MyID0gdHJ1ZTtcclxuICAgICAgICBjb250cm9sbGVyLmNsYXNzMSA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIgPSAnbXktb3RoZXItY2xhc3MnO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzVGV4dC5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NUZXh0Lmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteUNsYXNzRXhwcmVzc2lvbi5oYXNDbGFzcygnbXktY2xhc3MnKSkudG9CZShmYWxzZSk7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xhc3NFeHByZXNzaW9uLmhhc0NsYXNzKCdteS1vdGhlci1jbGFzcycpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQ2xhc3Muc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nUmVwZWF0JywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15UmVwZWF0LCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBjb25zdCBuZ1JlcGVhdCA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nUmVwZWF0Jyk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15QXJyYXk6IFt7XHJcbiAgICAgICAgICAgICAgICBhOiAnYSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYjogJ2InXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGM6ICdjJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBkOiAnZCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZTogJ2UnXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGY6ICdmJ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlSZXBlYXQgPSBuZ1JlcGVhdC5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnaXRlbXMgaW4gY3RybC5teUFycmF5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGRlc3Ryb3koKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlSZXBlYXQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgICBleHBlY3QobXlSZXBlYXQpLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYW4gb2JqZWN0IGJlZm9yZSBkaWdlc3QnLCAoKSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KCkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15UmVwZWF0KCkpLnRvRXF1YWwoamFzbWluZS5hbnkoT2JqZWN0KSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGFycmF5JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhteVJlcGVhdCgpLmRpZmZlcmVuY2VzLmFkZGVkKS5sZW5ndGgpLnRvQmUoNik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXRlY3QgY2hhbmdlcycsICgpID0+IHtcclxuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gc3RhcnRpbmcgdGhlIGNvbGxlY3Rpb25cclxuICAgICAgICAgICAgY29udHJvbGxlci5teUFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAxMDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5teUFycmF5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxLZXk6IGluZGV4XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGRldGVjdCByZWZlcmVuY2UgY2hhbmdlcycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlyc3RWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpOyAvL25vIGNoYW5nZVxyXG4gICAgICAgICAgICBsZXQgc2Vjb25kVmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5hZGRlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teUFycmF5WzBdID0ge1xyXG4gICAgICAgICAgICAgICAgYTogJ2NoYW5nZWQnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpOyAvL2NoYW5nZXMgY2hhbmdlXHJcbiAgICAgICAgICAgIHNlY29uZFZhbHVlID0gbXlSZXBlYXQoKTtcclxuICAgICAgICAgICAgLy8gYWx0aG91Z2ggdGhlIHJlc3VsdHMgc2VlbSB3cm9uZyB0aGV5IGFyZSByaWdodFxyXG4gICAgICAgICAgICAvLyB3aGF0IHRoZSBuZyByZXBlYXQgZG9lcyBpdCB3YXRjaCB0aGUgY29sbGVjdGlvbixcclxuICAgICAgICAgICAgLy8gc28gXCJuZXcgcmVmZXJlbmNlc1wiIHdpbGwgYmUgbWFya2VkIGFzIGFkZGVkIGFuZFxyXG4gICAgICAgICAgICAvLyByZW1vdmVkIGF0IHRoZSBzYW1lIHRpbWUgYW5kIGl0ZW1zIHRoYXQgTUlHSFRcclxuICAgICAgICAgICAgLy8gaGF2ZSBjaGFuZ2VkLCBhcyBtb2RpZmllZC5cclxuICAgICAgICAgICAgLy8gSXMgZWFjaCBzcGVjaWZpYyBpdGVtJ3Mgc2NvcGUgcmVzcG9uc2FiaWxpdHkgdG9cclxuICAgICAgICAgICAgLy8gd2F0Y2ggaXRzZWxmLCBhbmQgcmVzcG9uZCBwcm9wZXJseVxyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5hZGRlZC5sZW5ndGgpLnRvQmUoMTApO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5yZW1vdmVkLmxlbmd0aCkudG9CZSgwKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNlY29uZFZhbHVlLmRpZmZlcmVuY2VzLnJlbW92ZWQubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpLnRvQmUoMCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzZWNvbmRWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpLnRvQmUoOSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZGV0ZWN0IGludGVybmFsIGNoYW5nZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0VmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLm15QXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5pdGlhbEtleSA9IGluZGV4ICsgNTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmRWYWx1ZSA9IG15UmVwZWF0KCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgYmVjYXVzZSBzaW5jZSB0aGUgbm90IHJlZmVybmNlIG9mIHRoZSBhcnJheVxyXG4gICAgICAgICAgICAvLyBub3IgYW55IHJlZmVyZW5jZSBvZiBlYWNoIG9mIHRoZSBpbW1lZGlhdGUgY2hpbGRyZW5zIGhhcyBjaGFuZ2VkXHJcbiAgICAgICAgICAgIC8vIHRoZSB3YXRjaCBkaWRuJ3QgZmlyZVxyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5hZGRlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMuYWRkZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZpcnN0VmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMucmVtb3ZlZC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpLnRvQmUoc2Vjb25kVmFsdWUuZGlmZmVyZW5jZXMubW9kaWZpZWQubGVuZ3RoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhvd2V2ZXIsIGZpcmUgaW50ZXJuYWwgc2NvcGVzIHdhdGNoZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0VmFsdWUgPSBteVJlcGVhdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBteVNwaWVzID0gW107XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIubXlBcnJheS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbml0aWFsS2V5ID0gaW5kZXggKyA1O1xyXG4gICAgICAgICAgICAgICAgbXlTcGllcy5wdXNoKGphc21pbmUuY3JlYXRlU3B5KCdzcHknICsgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIGZpcnN0VmFsdWUub2JqZWN0c1tpbmRleF0uc2NvcGUuJHdhdGNoKG15UmVwZWF0LmtleUlkZW50aWZpZXIgKyAnLmluaXRpYWxLZXknLCAobmV3VmFsdWUsIG9sZFZhbHVlLCBzY29wZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG15U3BpZXNbaW5kZXhdKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTsgLy8gd2F0Y2hlcyBmaXJlIHRoZSBmaXJzdCB0aW1lIHdpdGggdGhlIG5ldyB2YWx1ZSBvbiBib3RoIHBhcmFtZXRlcnMgKGFuZCB0aGUgc2NvcGUpXHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZFZhbHVlID0gbXlSZXBlYXQoKTtcclxuICAgICAgICAgICAgLy8gYXMgYmVmb3JlXHJcbiAgICAgICAgICAgIGV4cGVjdChmaXJzdFZhbHVlLmRpZmZlcmVuY2VzLmFkZGVkLmxlbmd0aCkudG9CZShzZWNvbmRWYWx1ZS5kaWZmZXJlbmNlcy5hZGRlZC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZmlyc3RWYWx1ZS5kaWZmZXJlbmNlcy5yZW1vdmVkLmxlbmd0aCkudG9CZShzZWNvbmRWYWx1ZS5kaWZmZXJlbmNlcy5yZW1vdmVkLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmaXJzdFZhbHVlLmRpZmZlcmVuY2VzLm1vZGlmaWVkLmxlbmd0aCkudG9CZShzZWNvbmRWYWx1ZS5kaWZmZXJlbmNlcy5tb2RpZmllZC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBteVNwaWVzLmZvckVhY2goKHNweSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGluZGV4ICsgNSwgaW5kZXggKyA1LCBmaXJzdFZhbHVlLm9iamVjdHNbaW5kZXhdLnNjb3BlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdSZXBlYXQuc3BlYy5qc1xuICoqLyIsImltcG9ydCBxdWlja21vY2sgZnJvbSAnLi8uLi9zcmMvcXVpY2ttb2NrLmpzJztcclxuZGVzY3JpYmUoJ3F1aWNrbW9jaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJNb2NrZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIgPSBxdWlja21vY2soe1xyXG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd3aXRoSW5qZWN0aW9ucycsXHJcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd0ZXN0JyxcclxuICAgICAgICAgICAgbW9ja01vZHVsZXM6IFtdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIGEgY29udHJvbGxlck1vY2tlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgbW9kaWZpZWQgYW5ndWxhciBtb2R1bGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHF1aWNrbW9jay5tb2NrSGVscGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGluamVjdCBtb2NrZWQgb2JqZWN0IGZpcnN0LCB0aGVuIHJlYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kdGltZW91dC5hbmQuaWRlbnRpdHkoKSkudG9CZSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0KCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBpbmplY3QgbW9ja2VkIG9iamVjdCBmaXJzdCwgdGhlbiByZWFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQuYW5kLmlkZW50aXR5KCkpLnRvQmUoJ19fXyR0aW1lb3V0Jyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHEuYW5kLmlkZW50aXR5KCkpLnRvQmUoJ19fXyRxJyk7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXRba2V5XSkudG9CZShjb250cm9sbGVyTW9ja2VyLiRtb2Nrcy4kdGltZW91dFtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY29udHJvbGxlck1vY2tlci4kcSkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlck1vY2tlci4kcS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kcVtrZXldKS50b0JlKGNvbnRyb2xsZXJNb2NrZXIuJG1vY2tzLiRxW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiRxKS50b0JlKGNvbnRyb2xsZXJNb2NrZXIuJG1vY2tzLiRxKTtcclxuXHJcbiAgICB9KTtcclxufSk7XHJcbmRlc2NyaWJlKCdjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlck1vY2tlciwgc3B5O1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbWFnaWNDbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIgPSBxdWlja21vY2soe1xyXG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICdlbXB0eUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGVzdCcsXHJcbiAgICAgICAgICAgIG1vY2tNb2R1bGVzOiBbXSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50U2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6IHNweVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6ICc9J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBwZXJmb3JtIGNsaWNrcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLm5nQ2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgICAgICBjb25zdCBteUNsaWNrID0gY29udHJvbGxlck1vY2tlci5uZ0NsaWNrKCdjdHJsLnNvbWV0aGluZ1RvQ2FsbChhT2JqLCBiT2JqKScpLFxyXG4gICAgICAgICAgICByZWZlcmVuY2UxID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgcmVmZXJlbmNlMiA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIGxvY2FscyA9IHtcclxuICAgICAgICAgICAgICAgIGFPYmo6IHJlZmVyZW5jZTEsXHJcbiAgICAgICAgICAgICAgICBiT2JqOiByZWZlcmVuY2UyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlZmVyZW5jZTEsIHJlZmVyZW5jZTIpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvcXVpY2ttb2NrLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgaGVscGVyIGZyb20gJy4vcXVpY2ttb2NrLm1vY2tIZWxwZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kXHJcbn0gZnJvbSAnLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxudmFyIG1vY2tlciA9IChmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICB2YXIgb3B0cywgbW9ja1ByZWZpeDtcclxuICAgIHZhciBjb250cm9sbGVyRGVmYXVsdHMgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcGFyZW50U2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhZmxhZ1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcXVpY2ttb2NrLk1PQ0tfUFJFRklYID0gbW9ja1ByZWZpeCA9IChxdWlja21vY2suTU9DS19QUkVGSVggfHwgJ19fXycpO1xyXG4gICAgcXVpY2ttb2NrLlVTRV9BQ1RVQUwgPSAnVVNFX0FDVFVBTF9JTVBMRU1FTlRBVElPTic7XHJcbiAgICBxdWlja21vY2suTVVURV9MT0dTID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRzID0gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdmFyIGFsbE1vZHVsZXMgPSBvcHRzLm1vY2tNb2R1bGVzLmNvbmNhdChbJ25nTW9jayddKSxcclxuICAgICAgICAgICAgaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKGFsbE1vZHVsZXMuY29uY2F0KFtvcHRzLm1vZHVsZU5hbWVdKSksXHJcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gbW9kT2JqLl9pbnZva2VRdWV1ZSB8fCBbXSxcclxuICAgICAgICAgICAgcHJvdmlkZXJUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgIG1vY2tzID0ge30sXHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0ge307XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxNb2R1bGVzIHx8IFtdLCBmdW5jdGlvbihtb2ROYW1lKSB7XHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gaW52b2tlUXVldWUuY29uY2F0KGFuZ3VsYXIubW9kdWxlKG1vZE5hbWUpLl9pbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmluamVjdCkge1xyXG4gICAgICAgICAgICBpbmplY3Rvci5pbnZva2Uob3B0cy5pbmplY3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaW52b2tlUXVldWUsIGZpbmQgdGhpcyBwcm92aWRlcidzIGRlcGVuZGVuY2llcyBhbmQgcHJlZml4XHJcbiAgICAgICAgICAgIC8vIHRoZW0gc28gQW5ndWxhciB3aWxsIGluamVjdCB0aGUgbW9ja2VkIHZlcnNpb25zXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyRGF0YVsyXVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJOYW1lID09PSBvcHRzLnByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHMgPSBjdXJyUHJvdmlkZXJEZXBzLiRpbmplY3QgfHwgaW5qZWN0b3IuYW5ub3RhdGUoY3VyclByb3ZpZGVyRGVwcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBOYW1lID0gY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2RlcE5hbWVdID0gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlclR5cGUgPT09ICdkaXJlY3RpdmUnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBJbml0aWFsaXplcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZWZpeGVkIGRlcGVuZGVuY2llcyB0aGF0IHBlcnNpc3RlZCBmcm9tIGEgcHJldmlvdXMgY2FsbCxcclxuICAgICAgICAgICAgLy8gYW5kIGNoZWNrIGZvciBhbnkgbm9uLWFubm90YXRlZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cEluaXRpYWxpemVyKCkge1xyXG4gICAgICAgICAgICBwcm92aWRlciA9IGluaXRQcm92aWRlcigpO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5zcHlPblByb3ZpZGVyTWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kaW5pdGlhbGl6ZSA9IHNldHVwSW5pdGlhbGl6ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvdmlkZXIoKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnRyb2xsZXJIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGVhbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRNb2R1bGVzKGFsbE1vZHVsZXMuY29uY2F0KG9wdHMubW9kdWxlTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kV2l0aChvcHRzLmNvbnRyb2xsZXIuYmluZFRvQ29udHJvbGxlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFNjb3BlKG9wdHMuY29udHJvbGxlci5wYXJlbnRTY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldExvY2Fscyhtb2NrcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm5ldyhvcHRzLnByb3ZpZGVyTmFtZSwgb3B0cy5jb250cm9sbGVyLmNvbnRyb2xsZXJBcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG1vY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2Nrcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2Nrc1trZXldID0gdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udHJvbGxlci5pc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZpbHRlciA9IGluamVjdG9yLmdldCgnJGZpbHRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZmlsdGVyKG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGU6IGluamVjdG9yLmdldCgnJGFuaW1hdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm1vY2subW9kdWxlKCduZ0FuaW1hdGVNb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY29tcGlsZSA9IGluamVjdG9yLmdldCgnJGNvbXBpbGUnKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlID0gaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJykuJG5ldygpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuXHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRjb21waWxlID0gZnVuY3Rpb24gcXVpY2ttb2NrQ29tcGlsZShodG1sKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbCB8fCBvcHRzLmh0bWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBObyBodG1sIHN0cmluZy9vYmplY3QgcHJvdmlkZWQuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChodG1sKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgJGNvbXBpbGUocHJvdmlkZXIuJGVsZW1lbnQpKHByb3ZpZGVyLiRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGlzb1Njb3BlID0gcHJvdmlkZXIuJGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpIHtcclxuICAgICAgICAgICAgdmFyIGRlcFR5cGUgPSBnZXRQcm92aWRlclR5cGUoZGVwTmFtZSwgaW52b2tlUXVldWUpLFxyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gZGVwTmFtZTtcclxuICAgICAgICAgICAgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gIT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gPT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcFR5cGUgPT09ICd2YWx1ZScgfHwgZGVwVHlwZSA9PT0gJ2NvbnN0YW50Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluamVjdG9yLmhhcyhtb2NrUHJlZml4ICsgZGVwTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUuaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IuaGFzKG1vY2tTZXJ2aWNlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnVzZUFjdHVhbERlcGVuZGVuY2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1NlcnZpY2VOYW1lLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluamVjdCBtb2NrIGZvciBcIicgKyBkZXBOYW1lICsgJ1wiIGJlY2F1c2Ugbm8gc3VjaCBtb2NrIGV4aXN0cy4gUGxlYXNlIHdyaXRlIGEgbW9jayAnICsgZGVwVHlwZSArICcgY2FsbGVkIFwiJyArIG1vY2tTZXJ2aWNlTmFtZSArICdcIiAob3Igc2V0IHRoZSB1c2VBY3R1YWxEZXBlbmRlbmNpZXMgdG8gdHJ1ZSkgYW5kIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG1vY2tTZXJ2aWNlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcikge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHByb3ZpZGVyRGF0YVsyXVswXSkgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvdmlkZXJEYXRhWzJdWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZXIgZGVjbGFyYXRpb24gZnVuY3Rpb24gaGFzIGJlZW4gcHJvdmlkZWQgd2l0aG91dCB0aGUgYXJyYXkgYW5ub3RhdGlvbixcclxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gYW5ub3RhdGUgaXQgc28gdGhlIGludm9rZVF1ZXVlIGNhbiBiZSBwcmVmaXhlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRlZERlcGVuZGVuY2llcyA9IGluamVjdG9yLmFubm90YXRlKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJvdmlkZXJEYXRhWzJdWzFdLiRpbmplY3Q7XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0ZWREZXBlbmRlbmNpZXMucHVzaChwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJEYXRhWzJdWzFdID0gYW5ub3RhdGVkRGVwZW5kZW5jaWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5pdGlhbGl6ZSBiZWNhdXNlIGFuZ3VsYXIgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGxvYWQgYW5ndWxhciBiZWZvcmUgbG9hZGluZyBxdWlja21vY2suanMuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5wcm92aWRlck5hbWUgJiYgIW9wdGlvbnMuY29uZmlnQmxvY2tzICYmICFvcHRpb25zLnJ1bkJsb2Nrcykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gcHJvdmlkZXJOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QsIG9yIHNldCB0aGUgY29uZmlnQmxvY2tzIG9yIHJ1bkJsb2NrcyBmbGFncy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLm1vZHVsZU5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIG1vZHVsZU5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wdGlvbnMubW9ja01vZHVsZXMgPSBvcHRpb25zLm1vY2tNb2R1bGVzIHx8IFtdO1xyXG4gICAgICAgIG9wdGlvbnMubW9ja3MgPSBvcHRpb25zLm1vY2tzIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMuY29udHJvbGxlciA9IGV4dGVuZChvcHRpb25zLmNvbnRyb2xsZXIsIGNvbnRyb2xsZXJEZWZhdWx0cyhhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmNvbnRyb2xsZXIpKSk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvdmlkZXIsIGZ1bmN0aW9uKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuamFzbWluZSAmJiB3aW5kb3cuc3B5T24gJiYgIXByb3BlcnR5LmNhbGxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNweSA9IHNweU9uKHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcHkuYW5kQ2FsbFRocm91Z2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZENhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnNpbm9uICYmIHdpbmRvdy5zaW5vbi5zcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2lub24uc3B5KHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlkZXJUeXBlKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludm9rZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aWRlckluZm8gPSBpbnZva2VRdWV1ZVtpXTtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVySW5mb1syXVswXSA9PT0gcHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVySW5mb1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRwcm92aWRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVySW5mb1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29udHJvbGxlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29tcGlsZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRmaWx0ZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZmlsdGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckYW5pbWF0ZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHVucHJlZml4KSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyRGF0YVsyXVswXSA9PT0gcHJvdmlkZXJOYW1lICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tQcmVmaXggKyBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKSB7XHJcbiAgICAgICAgaWYgKCFodG1sLiR0YWcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gSHRtbCBvYmplY3QgZG9lcyBub3QgY29udGFpbiAkdGFnIHByb3BlcnR5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaHRtbEF0dHJzID0gaHRtbCxcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGh0bWxBdHRycy4kdGFnLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudCA9IGh0bWxBdHRycy4kY29udGVudDtcclxuICAgICAgICBodG1sID0gJzwnICsgdGFnTmFtZSArICcgJztcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaHRtbEF0dHJzLCBmdW5jdGlvbih2YWwsIGF0dHIpIHtcclxuICAgICAgICAgICAgaWYgKGF0dHIgIT09ICckY29udGVudCcgJiYgYXR0ciAhPT0gJyR0YWcnKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IHNuYWtlX2Nhc2UoYXR0cikgKyAodmFsID8gKCc9XCInICsgdmFsICsgJ1wiICcpIDogJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGh0bWwgKz0gaHRtbENvbnRlbnQgPyAoJz4nICsgaHRtbENvbnRlbnQpIDogJz4nO1xyXG4gICAgICAgIGh0bWwgKz0gJzwvJyArIHRhZ05hbWUgKyAnPic7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrTG9nKG1zZykge1xyXG4gICAgICAgIGlmICghcXVpY2ttb2NrLk1VVEVfTE9HUykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgU05BS0VfQ0FTRV9SRUdFWFAgPSAvW0EtWl0vZztcclxuXHJcbiAgICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUsIHNlcGFyYXRvcikge1xyXG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLSc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZShTTkFLRV9DQVNFX1JFR0VYUCwgZnVuY3Rpb24obGV0dGVyLCBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcXVpY2ttb2NrO1xyXG5cclxufSkoYW5ndWxhcik7XHJcbmhlbHBlcihtb2NrZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBtb2NrZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLmpzXG4gKiovIiwiXHJcbmZ1bmN0aW9uIGxvYWRIZWxwZXIobW9ja2VyKSB7XHJcbiAgICAoZnVuY3Rpb24ocXVpY2ttb2NrKSB7XHJcbiAgICAgICAgdmFyIGhhc0JlZW5Nb2NrZWQgPSB7fSxcclxuICAgICAgICAgICAgb3JpZ01vZHVsZUZ1bmMgPSBhbmd1bGFyLm1vZHVsZTtcclxuICAgICAgICBxdWlja21vY2sub3JpZ2luYWxNb2R1bGVzID0gYW5ndWxhci5tb2R1bGU7XHJcbiAgICAgICAgYW5ndWxhci5tb2R1bGUgPSBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGU7XHJcblxyXG4gICAgICAgIHF1aWNrbW9jay5tb2NrSGVscGVyID0ge1xyXG4gICAgICAgICAgICBoYXNCZWVuTW9ja2VkOiBoYXNCZWVuTW9ja2VkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaikge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kcyA9IGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbW9kT2JqW21ldGhvZE5hbWVdID0gbWV0aG9kO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1vZE9iajtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZShuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pIHtcclxuICAgICAgICAgICAgdmFyIG1vZE9iaiA9IG9yaWdNb2R1bGVGdW5jKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbik7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKSB7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgcHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNCZWVuTW9ja2VkW3Byb3ZpZGVyTmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld01vZE9iaiA9IG1vZE9ialtwcm92aWRlclR5cGVdKHF1aWNrbW9jay5NT0NLX1BSRUZJWCArIHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChuZXdNb2RPYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2U6IGZ1bmN0aW9uIG1vY2tTZXJ2aWNlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdzZXJ2aWNlJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb2NrRmFjdG9yeTogZnVuY3Rpb24gbW9ja0ZhY3RvcnkocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZhY3RvcnknLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrRmlsdGVyOiBmdW5jdGlvbiBtb2NrRmlsdGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmaWx0ZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQ29udHJvbGxlcjogZnVuY3Rpb24gbW9ja0NvbnRyb2xsZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnRyb2xsZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrUHJvdmlkZXI6IGZ1bmN0aW9uIG1vY2tQcm92aWRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAncHJvdmlkZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrVmFsdWU6IGZ1bmN0aW9uIG1vY2tWYWx1ZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAndmFsdWUnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQ29uc3RhbnQ6IGZ1bmN0aW9uIG1vY2tDb25zdGFudChwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29uc3RhbnQnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQW5pbWF0aW9uOiBmdW5jdGlvbiBtb2NrQW5pbWF0aW9uKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdhbmltYXRpb24nLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KShtb2NrZXIpO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxvYWRIZWxwZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLm1vY2tIZWxwZXIuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbmZpZygpIHtcclxuICAgIGRpcmVjdGl2ZVByb3ZpZGVyLnVzZU1vZHVsZShcclxuICAgICAgICBhbmd1bGFyLm1vZHVsZSgndGVzdCcsIFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdlbXB0eUNvbnRyb2xsZXInLCBbZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICdlbXB0eUNvbnRyb2xsZXInO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCd3aXRoSW5qZWN0aW9ucycsIFsnJHEnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbigkcSwgdCkge1xyXG4gICAgICAgICAgICB0aGlzLiRxID0gJHE7XHJcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQgPSB0O1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCd3aXRoQmluZGluZ3MnLCBbZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm91bmRQcm9wZXJ0eSA9IHRoaXMuYm91bmRQcm9wZXJ0eSArICcgbW9kaWZpZWQnO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5jb25maWcoWyckdHJhbnNsYXRlUHJvdmlkZXInLCBmdW5jdGlvbigkdHJhbnNsYXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgICAgICAgICBUSVRMRTogJ0hlbGxvJyxcclxuICAgICAgICAgICAgICAgIEZPTzogJ1RoaXMgaXMgYSBwYXJhZ3JhcGguJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0VOOiAnZW5nbGlzaCcsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19ERTogJ2dlcm1hbidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2RlJywge1xyXG4gICAgICAgICAgICAgICAgVElUTEU6ICdIYWxsbycsXHJcbiAgICAgICAgICAgICAgICBGT086ICdEaWVzIGlzdCBlaW4gUGFyYWdyYXBoLicsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19FTjogJ2VuZ2xpc2NoJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0RFOiAnZGV1dHNjaCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgnZW4nKTtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZSgnZW4nKTtcclxuICAgICAgICB9XSlcclxuICAgICAgICAubW9ja1NlcnZpY2UoJyRxJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gamFzbWluZS5jcmVhdGVTcHkoJ19fXyRxJyk7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLm1vY2tTZXJ2aWNlKCckdGltZW91dCcsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGphc21pbmUuY3JlYXRlU3B5KCdfX18kdGltZW91dCcpO1xyXG4gICAgICAgIH1dKS5uYW1lXHJcbiAgICApO1xyXG5cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwL2NvbXBsZXRlTGlzdC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=