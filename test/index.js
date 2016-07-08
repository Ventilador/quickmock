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
	
	var _completeList = __webpack_require__(11);
	
	var _completeList2 = _interopRequireDefault(_completeList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(12);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	
	(0, _completeList2.default)();

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(1);
	
	var _controllerHandlerExtensions = __webpack_require__(3);
	
	var controllerHandler = function () {
	    console.log('controllerHandler.js');
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
	    console.log('controllerHandler.js end');
	    return $controllerHandler;
	}();
	exports.default = controllerHandler;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$_CONTROLLER = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _directiveProvider = __webpack_require__(4);
	
	var _directiveHandler = __webpack_require__(9);
	
	var _controllerQM = __webpack_require__(10);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	console.log('controllerHandler.extension.js');
	
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
	            var directive = _directiveProvider.directiveProvider.$get(arguments[0]);
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
	
	console.log('controllerHandler.extension.js end');

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ngBind = __webpack_require__(5);
	
	var _ngClick = __webpack_require__(6);
	
	var _ngIf = __webpack_require__(7);
	
	var _ngTranslate = __webpack_require__(8);
	
	console.log('directiveProvider');
	
	var directiveProvider = function () {
	    var directives = new Map(),
	        toReturn = {},
	        $parse = angular.injector(['ng']).get('$parse'),
	        $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate'),
	        SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
	        internals = {
	        ngIf: (0, _ngIf.ngIfDirective)(),
	        ngClick: (0, _ngClick.ngClickDirective)($parse),
	        ngBind: (0, _ngBind.ngBindDirective)($parse),
	        ngDisabled: (0, _ngIf.ngIfDirective)(),
	        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
	        ngRepeat: {
	            regex: '<div></div>',
	            compile: function compile() {}
	        },
	        ngModel: {
	            regex: '<input type="text"/>',
	            compile: function compile() {}
	        },
	        translateValue: {},
	        ngClass: {}
	    };
	
	    toReturn.toCamelCase = function (name) {
	        return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
	            return offset ? letter.toUpperCase() : letter;
	        });
	    };
	    toReturn.$get = function (directiveName) {
	        if (angular.isString(directiveName)) {
	            directiveName = toReturn.toCamelCase(directiveName);
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
	            directiveName = toReturn.toCamelCase(directiveName);
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
	
	    return toReturn;
	}();
	console.log('directiveProvider end');
	exports.default = directiveProvider;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngBindDirective = ngBindDirective;
	
	var _common = __webpack_require__(1);
	
	console.log('ng.bind.js');
	
	function ngBindDirective($parse) {
	    return {
	        compile: function compile(controllerService, expression) {
	            var subscriptors = [];
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
	        }
	    };
	}
	console.log('ng.bind.js end');

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngClickDirective = ngClickDirective;
	console.log('ng.click.js');
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
	        ApplyToChildren: true
	    };
	}
	console.log('ng.click.js end');

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngIfDirective = ngIfDirective;
	console.log('ng.if.js');
	function ngIfDirective() {
	    return {
	        regex: /ng-if="(.*)"/,
	        compile: function compile(expression, controllerService) {
	            var subscriptors = [];
	            var lastValue = void 0;
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            var watcher = controllerService.watch(expression, function () {
	                lastValue = arguments[0];
	                for (var ii = 0; ii < subscriptors.length; ii++) {
	                    subscriptors[ii].apply(subscriptors, arguments);
	                }
	            });
	            controllerService.parentScope.$on('$destroy', function () {
	                do {
	                    subscriptors.shift();
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
	        }
	    };
	}
	console.log('ng.if.js end');

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngTranslateDirective = ngTranslateDirective;
	
	var _common = __webpack_require__(1);
	
	console.log('ng.translate.js');
	function ngTranslateDirective($translate) {
	    return {
	        compile: function compile(expression, controllerService) {
	            if (controllerService.create) {
	                controllerService.create();
	            }
	            // const getter = $parse(expression);
	
	            var toReturn = function toReturn() {};
	            toReturn.changeLanguage = function (newLanguage) {
	                $translate.use(newLanguage);
	                controllerService.$apply();
	            };
	            return toReturn;
	        },
	        isExpression: function isExpression(myText) {
	            return _common.isExpression.test(myText);
	        },
	        translate: function translate(text) {
	            return $translate.instant(text);
	        },
	        changeLanguage: function changeLanguage(newLanguage) {
	            $translate.use(newLanguage);
	        }
	
	    };
	}
	
	console.log('ng.translate.js end');

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _directiveProvider = __webpack_require__(4);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var directiveHandler = function () {
	    console.log('directiveHandler');
	
	    var proto = angular.element.prototype || angular.element.__proto__;
	    proto.ngFind = function (selector) {
	        var values = {
	            length: 0
	        };
	        for (var index = 0; index < this.length; index++) {
	            values[values.length++] = this[index].querySelector(selector) || '';
	        }
	        return angular.element(join(values));
	    };
	    proto.click = function (locals) {
	        if (this.length) {
	            var click = this.data('ng-click');
	            return click && click(locals);
	        }
	    };
	    proto.text = function () {
	        if (this.length) {
	            var click = this.data('ng-bind');
	            return click && click.apply(undefined, arguments);
	        }
	    };
	
	    // function getExpression(current) {
	    //     let expression = current[0] && current[0].attributes.getNamedItem('ng-click');
	    //     if (expression !== undefined && expression !== null) {
	    //         expression = expression.value;
	    //         return expression;
	    //     }
	    // }
	
	    function join(obj) {
	        return Array.prototype.concat.apply([], obj);
	    }
	
	    function applyDirectivesToNodes(object, attributeName, compiledDirective) {
	        object = angular.element(object);
	        object.data(attributeName, compiledDirective);
	        var childrens = object.children();
	        for (var ii = 0; ii < childrens.length; ii++) {
	            applyDirectivesToNodes(childrens[ii], attributeName, compiledDirective);
	        }
	    }
	
	    function compile(obj, controllerService) {
	        obj = angular.element(obj);
	
	        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
	            var directiveName = obj[0].attributes[ii].name;
	            var expression = obj[0].attributes[ii].value;
	            var directive = void 0;
	            if (directive = _directiveProvider2.default.$get(directiveName)) {
	                var compiledDirective = directive.compile(controllerService, expression);
	                if (directive.ApplyToChildren) {
	                    applyDirectivesToNodes(obj, directiveName, compiledDirective);
	                } else {
	                    obj.data(directiveName, compiledDirective);
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
	
	    console.log('directiveHandler end');
	    return control;
	}();
	exports.default = directiveHandler;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _common = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	console.log('controllerQM.js');
	
	
	var $parse = angular.injector(['ng']).get('$parse');
	
	var controller = function () {
	    function controller() {
	        _classCallCheck(this, controller);
	    }
	
	    _createClass(controller, null, [{
	        key: 'parseBindings',
	        value: function parseBindings(bindings, scope, isolateScope, controllerAs) {
	            var assignBindings = function assignBindings(destination, scope, key, mode) {
	                mode = mode || '=';
	                var result = _common.PARSE_BINDING_REGEX.exec(mode);
	                mode = result[1];
	                var parentKey = result[2] || key;
	                var childKey = controllerAs + '.' + key;
	                var unwatch;
	
	                (function () {
	                    switch (mode) {
	                        case '=':
	                            var parentGet = $parse(parentKey);
	                            var childGet = $parse(childKey);
	                            var lastValue = void 0;
	                            childGet.assign(destination, lastValue = parentGet(scope));
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
	                            scope.$watch(parentValueWatch);
	                            unwatch = scope.$watch(parentValueWatch);
	
	                            destination.$on('$destroy', unwatch);
	                            break;
	                        case '&':
	                            destination[key] = function (locals) {
	                                return $parse(scope[parentKey])(scope, locals);
	                            };
	                            break;
	                        case '@':
	
	                            var isExp = _common.isExpression.exec(scope[parentKey]);
	                            if (isExp) {
	                                (function () {
	                                    var parentGet = $parse(isExp[1]);
	                                    var childGet = $parse(childKey);
	                                    var parentValue = parentGet(scope);
	                                    var lastValue = parentValue;
	                                    var parentValueWatch = function parentValueWatch() {
	                                        parentValue = parentGet(scope);
	                                        if (parentValue !== lastValue) {
	                                            childGet.assign(destination, lastValue = parentValue);
	                                        }
	                                        return lastValue;
	                                    };
	                                    scope.$watch(parentValueWatch);
	                                    var unwatch = scope.$watch(parentValueWatch);
	                                    destination.$on('$destroy', unwatch);
	                                })();
	                            } else {
	                                destination[key] = (scope[parentKey] || '').toString();
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
	            angular.injector((0, _common.sanitizeModules)(moduleNames)).invoke(['$controller', function (controller) {
	                $controller = controller;
	            }]);
	
	            function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
	                scope = _common.scopeHelper.create(scope);
	                scopeControllerName = scopeControllerName || 'controller';
	                var locals = (0, _common.extend)(extendedLocals || {}, {
	                    $scope: _common.scopeHelper.create(scope).$new()
	                }, false);
	
	                var constructor = $controller(controllerName, locals, true, scopeControllerName);
	                constructor.provideBindings = function (b, myLocals) {
	                    locals = myLocals || locals;
	                    b = b || bindings;
	
	                    (0, _common.extend)(constructor.instance, controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName));
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
	
	console.log('controllerQM.js end');

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Config;
	function Config() {
	    angular.module('test', ['ng', 'pascalprecht.translate']).controller('emptyController', [function () {
	        this.name = 'emptyController';
	    }]).controller('withInjections', ['$q', function ($q) {
	        this.q = $q;
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
	    }]);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandlerExtensions = __webpack_require__(3);
	
	var _common = __webpack_require__(1);
	
	var _controllerHandler = __webpack_require__(2);
	
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerQM = __webpack_require__(10);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('controller', function () {
	    it('should be defined', function () {
	        expect(_controllerQM2.default).toBeDefined();
	    });
	    it('should have a $get method which return a controller generator', function () {
	        expect(_controllerQM2.default.$get).toBeDefined();
	        expect(angular.isFunction(_controllerQM2.default.$get)).toBe(true);
	        expect(angular.isFunction(_controllerQM2.default.$get().create)).toBe(true);
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
	            expect(controller().q).toBeDefined();
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _directiveProvider = __webpack_require__(4);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(9);
	
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
	            aInt: 0
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '='
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
	    describe('ngClick', function () {
	        it('should allow me to call ng-click', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div ng-click="ctrl.aString = \'anotherValue\'"/>');
	            handler.click();
	            expect(controller.aString).toBe('anotherValue');
	        });
	        it('should not fail if the selected item is invalid', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div />');
	            expect(function () {
	                handler.ngFind('a').click();
	            }).not.toThrow();
	        });
	        it('should not fail if the selected does not have the property', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div />');
	            expect(function () {
	                handler.click();
	            }).not.toThrow();
	        });
	        it('should apply the click event to each of its childrens (if needed)', function () {
	
	            var handler = new _directiveHandler2.default(controllerService, '   <div ng-click="ctrl.aInt = ctrl.aInt + 1">\n                    <div id=\'first\'>\n                        <div id=\'second\'>\n                        </div>\n                    </div>\n                    <div id=\'third\'>\n                    </div>\n                <div/>');
	            handler.ngFind('#first').click();
	            handler.ngFind('#second').click();
	            handler.ngFind('#third').click();
	            expect(controller.aInt).toBe(3);
	        });
	        it('should support locals (for testing)', function () {
	            var handler = new _directiveHandler2.default(controllerService, '   <div ng-click="ctrl.aInt =  value + ctrl.aInt ">\n                    <div id=\'first\'>\n                        <div id=\'second\'>\n                        </div>\n                    </div>\n                    <div id=\'third\'>\n                    </div>\n                <div/>');
	            handler.ngFind('#first').click({
	                value: 1000
	            });
	            expect(controller.aInt).toBe(1000);
	            handler.ngFind('#second').click({
	                value: ''
	            });
	            expect(controller.aInt).toBe('1000');
	            handler.ngFind('#third').click({
	                value: 1
	            });
	            expect(controller.aInt).toBe('11000');
	        });
	    });
	    describe('ngBind', function () {
	        it('should allow me to call text', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div ng-bind="ctrl.aString"/>');
	            expect(handler.text()).toBe('aValue');
	        });
	        it('should allow me to change the controller value', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div ng-bind="ctrl.aString"/>');
	            handler.text('newValue');
	            expect(controller.aString).toBe('newValue');
	        });
	        it('should allow me to change the controller value, one letter at the time', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div ng-bind="ctrl.aString"/>');
	            controllerService.watch('ctrl.aString', spy);
	            handler.text('newValue'.split(''));
	            expect(controller.aString).toBe('newValue');
	            expect(spy.calls.count()).toBe('newValue'.length);
	        });
	    });
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(4);
	
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
	        myIf = ngIf.compile('ctrl.myBoolean', controllerService);
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(4);
	
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
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {}, true);
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	        myBind = ngBind.compile(controllerService, expression);
	    });
	    it('should be defined', function () {
	        expect(myBind).toBeDefined();
	    });
	    it('should update the controller when receiving a string', function () {
	        myBind('aValue');
	        expect(controller.myStringParameter).toBe('aValue');
	    });
	    it('should fire an digest when doing and assigment', function () {
	        controllerService.watch(expression, spy);
	        expect(spy).not.toHaveBeenCalled();
	        myBind('aValue');
	        expect(spy).toHaveBeenCalled();
	    });
	    it('should return the current value of current state', function () {
	        controller.myStringParameter = 'someValue';
	        expect(myBind()).toBe('someValue');
	    });
	    it('should not fire digests when consulting', function () {
	        controller.myStringParameter = 'someValue';
	        controllerService.watch(expression, spy);
	        myBind();
	        expect(spy).not.toHaveBeenCalled();
	    });
	    it('should allow array to fire changes', function () {
	        var object = {};
	        controllerService.watch(expression, function (newValue) {
	            object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
	        });
	        myBind(['a', 'V', 'a', 'l', 'u', 'e']);
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
	        myBind('aValue', true);
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
	        expect(myBind.changes).toEqual(jasmine.any(Function));
	    });
	    describe('changes', function () {
	        it('changes should only fire once per change (independent of watcher)', function () {
	            var watcherSpy = jasmine.createSpy();
	            controllerService.watch(expression, watcherSpy);
	            myBind.changes(spy);
	            myBind('aValue', true);
	            controller.myStringParameter = 'anotherValue';
	            controllerService.$apply();
	            expect(spy.calls.count()).toBe(6);
	            expect(watcherSpy.calls.count()).toBe(7);
	        });
	    });
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(4);
	
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(4);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('ngTranslate', function () {
	    var controllerService = void 0,
	        myTranslate = void 0;
	    var ngTranslate = _directiveProvider2.default.$get('translate');
	    beforeEach(function () {
	        controllerService = _controllerHandler2.default.clean().addModules('test').newService('emptyController', 'ctrl', {
	            prop: 'HELLO'
	        }, true);
	        controllerService.create();
	        myTranslate = ngTranslate.compile('ctrl.prop', controllerService);
	    });
	});

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODUwN2ZlODZmZGZkMDMxNGFiMmM/YjA1ZCIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanM/MTZhMSIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanM/MDNiMSIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcz9jYjFiIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzPzYyM2MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcz80MGU2Iiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzPzRjMTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanM/ZjU5YSIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanM/ZjdkZCIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzP2Q5NWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzP2NiYTIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBsZXRlTGlzdC5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUMzQkE7Ozs7OztBQVhBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSOztBQUVBLCtCOzs7Ozs7Ozs7Ozs7Ozs7O1NDSGdCLFcsR0FBQSxXO1NBV0EsZ0IsR0FBQSxnQjtTQVVBLG1CLEdBQUEsbUI7U0FRQSxLLEdBQUEsSztTQW1CQSxTLEdBQUEsUztTQWtCQSxTLEdBQUEsUztTQVdBLE0sR0FBQSxNO1NBZ0VBLGUsR0FBQSxlO1NBUUEsZSxH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O0FBQUEsU0FBdUIsb0JBQXZCO0FBQ0EsU0FBTSxjQUFjLDRCQUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFwQjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsbUJBQU07QUFENkYsVUFBbkYsRUFFakIsSUFGaUIsQ0FBcEI7QUFHQSwyQkFBa0IsTUFBbEI7QUFDQSx1QkFBYyxZQUFZLE9BQVosQ0FBb0IsV0FBcEIsRUFBaUMsaUJBQWpDLENBQWQ7QUFDSCxNQU5EO0FBT0gsRUFWRCxFIiwiZmlsZSI6Ii4vdGVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgODUwN2ZlODZmZGZkMDMxNGFiMmNcbiAqKi8iLCJyZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL25nSWYuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcycpO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vLi4vYXBwL2NvbXBsZXRlTGlzdC5qcyc7XHJcbmNvbmZpZygpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9pbmRleC5sb2FkZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29tbW9uLmpzJyk7XHJcbmV4cG9ydCB2YXIgUEFSU0VfQklORElOR19SRUdFWCA9IC9eKFtcXD1cXEBcXCZdKSguKik/JC87XHJcbmV4cG9ydCB2YXIgaXNFeHByZXNzaW9uID0gL157ey4qfX0kLztcclxuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZShpdGVtKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpdGVtKSB8fFxyXG4gICAgICAgICghIWl0ZW0gJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIgJiZcclxuICAgICAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eShcImxlbmd0aFwiKSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbS5sZW5ndGggPT09IFwibnVtYmVyXCIgJiZcclxuICAgICAgICAgICAgaXRlbS5sZW5ndGggPj0gMFxyXG4gICAgICAgICkgfHxcclxuICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Tm90RGVmaW5lZChvYmosIGFyZ3MpIHtcclxuXHJcbiAgICBsZXQga2V5O1xyXG4gICAgd2hpbGUgKGtleSA9IGFyZ3Muc2hpZnQoKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnIHx8IG9ialtrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0XyRfQ09OVFJPTExFUihvYmopIHtcclxuICAgIGFzc2VydE5vdERlZmluZWQob2JqLCBbXHJcbiAgICAgICAgJ3BhcmVudFNjb3BlJyxcclxuICAgICAgICAnYmluZGluZ3MnLFxyXG4gICAgICAgICdjb250cm9sbGVyU2NvcGUnXHJcbiAgICBdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKG9iamVjdCkge1xyXG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KG9iamVjdCwgW2luZGV4LCAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhbihvYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcclxuICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGVuZFRpbWU7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IHNweU9uKHtcclxuICAgICAgICBhOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJ2EnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgIHRvUmV0dXJuLnRvb2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFycmF5KGl0ZW0pIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtpdGVtXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCgpIHtcclxuICAgIGxldCByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlbW92ZSQgfHwgIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHZhbHVlcy5zaGlmdCgpIHx8IHt9O1xyXG4gICAgbGV0IGN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XHJcbiAgICAgICAgJCRleHRlbmQoZGVzdGluYXRpb24sIGN1cnJlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcbmNvbnN0IHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFJvb3RGcm9tU2NvcGUoc2NvcGUpIHtcclxuICAgIGlmIChzY29wZS4kcm9vdCkge1xyXG4gICAgICAgIHJldHVybiBzY29wZS4kcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyZW50O1xyXG4gICAgd2hpbGUgKHBhcmVudCA9IHNjb3BlLiRwYXJlbnQpIHtcclxuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuJHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIHNjb3BlSGVscGVyIHtcclxuICAgIHN0YXRpYyBjcmVhdGUoc2NvcGUpIHtcclxuICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2NvcGUoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChzY29wZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZChyb290U2NvcGUuJG5ldyh0cnVlKSwgc2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNBcnJheUxpa2Uoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZC5hcHBseSh1bmRlZmluZWQsIFtyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzU2NvcGUob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCAmJiBnZXRSb290RnJvbVNjb3BlKG9iamVjdCkgPT09IGdldFJvb3RGcm9tU2NvcGUocm9vdFNjb3BlKSAmJiBvYmplY3Q7XHJcbiAgICB9XHJcbn1cclxuc2NvcGVIZWxwZXIuJHJvb3RTY29wZSA9IHJvb3RTY29wZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUobXlGdW5jdGlvbikge1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSAvXmZ1bmN0aW9uXFxzKyhbXFx3XFwkXSspXFxzKlxcKC8uZXhlYyhteUZ1bmN0aW9uLnRvU3RyaW5nKCkpWzFdO1xyXG4gICAgaWYgKHRvUmV0dXJuID09PSAnJyB8fCB0b1JldHVybiA9PT0gJ2Fub24nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZU1vZHVsZXMoKSB7XHJcblxyXG4gICAgY29uc3QgbW9kdWxlcyA9IG1ha2VBcnJheS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICBsZXQgaW5kZXg7XHJcbiAgICBpZiAoXHJcbiAgICAgICAgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiZcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ2FuZ3VsYXInKSkgPT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZycpO1xyXG4gICAgfVxyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIG1vZHVsZXMudW5zaGlmdChtb2R1bGVzLnNwbGljZShpbmRleCwgMSlbMF0gJiYgJ25nJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbW9kdWxlcztcclxufVxyXG5jb25zb2xlLmxvZygnY29tbW9uLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIG1ha2VBcnJheSxcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2NvcGVIZWxwZXJcclxufSBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IHtcclxuICAgICRfQ09OVFJPTExFUlxyXG59IGZyb20gJy4vY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG52YXIgY29udHJvbGxlckhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuanMnKTtcclxuICAgIHZhciBpbnRlcm5hbCA9IGZhbHNlO1xyXG4gICAgbGV0IG15TW9kdWxlcywgY3RybE5hbWUsIGNMb2NhbHMsIHBTY29wZSwgY1Njb3BlLCBjTmFtZSwgYmluZFRvQ29udHJvbGxlcjtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYW4oKSB7XHJcbiAgICAgICAgbXlNb2R1bGVzID0gW107XHJcbiAgICAgICAgY3RybE5hbWUgPSBwU2NvcGUgPSBjTG9jYWxzID0gY1Njb3BlID0gYmluZFRvQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uICRjb250cm9sbGVySGFuZGxlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKCFjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUGxlYXNlIHByb3ZpZGUgdGhlIGNvbnRyb2xsZXJcXCdzIG5hbWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocFNjb3BlIHx8IHt9KTtcclxuICAgICAgICBpZiAoIWNTY29wZSkge1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBwU2NvcGUuJG5ldygpO1xyXG4gICAgICAgIH0ge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKGNTY29wZSk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wU2NvcGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjU2NvcGUgPSB0ZW1wU2NvcGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gbmV3ICRfQ09OVFJPTExFUihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kVG9Db250cm9sbGVyLCBteU1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKTtcclxuICAgICAgICBjbGVhbigpO1xyXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgIH1cclxuICAgICRjb250cm9sbGVySGFuZGxlci5iaW5kV2l0aCA9IGZ1bmN0aW9uKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmNvbnRyb2xsZXJUeXBlID0gJF9DT05UUk9MTEVSO1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuID0gY2xlYW47XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUgPSBmdW5jdGlvbihuZXdTY29wZSkge1xyXG4gICAgICAgIHBTY29wZSA9IG5ld1Njb3BlO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLnNldExvY2FscyA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGNMb2NhbHMgPSBsb2NhbHM7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLiRyb290U2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlO1xyXG5cclxuICAgICRjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzID0gZnVuY3Rpb24obW9kdWxlcykge1xyXG4gICAgICAgIGZ1bmN0aW9uIHB1c2hBcnJheShhcnJheSkge1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShteU1vZHVsZXMsIGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkobWFrZUFycmF5KGFyZ3VtZW50cykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KFttb2R1bGVzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKG1vZHVsZXMpKSB7XHJcbiAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkobW9kdWxlcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5pc0ludGVybmFsID0gZnVuY3Rpb24oZmxhZykge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZsYWcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW50ZXJuYWwgPSAhIWZsYWc7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnRlcm5hbCA9ICFmbGFnO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBzY29wZUNvbnRyb2xsZXJzTmFtZSwgcGFyZW50U2NvcGUsIGNoaWxkU2NvcGUpIHtcclxuICAgICAgICBjdHJsTmFtZSA9IGNvbnRyb2xsZXJOYW1lO1xyXG4gICAgICAgIGlmIChzY29wZUNvbnRyb2xsZXJzTmFtZSAmJiAhYW5ndWxhci5pc1N0cmluZyhzY29wZUNvbnRyb2xsZXJzTmFtZSkpIHtcclxuICAgICAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShzY29wZUNvbnRyb2xsZXJzTmFtZSk7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUocGFyZW50U2NvcGUpIHx8IGNTY29wZTtcclxuICAgICAgICAgICAgY05hbWUgPSAnY29udHJvbGxlcic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHBhcmVudFNjb3BlIHx8IHBTY29wZSk7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShjaGlsZFNjb3BlIHx8IHBTY29wZS4kbmV3KCkpO1xyXG4gICAgICAgICAgICBjTmFtZSA9IHNjb3BlQ29udHJvbGxlcnNOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyKCk7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ld1NlcnZpY2UgPSBmdW5jdGlvbihjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSwgYmluZGluZ3MpIHtcclxuICAgICAgICBjb25zdCB0b1JldHVybiA9ICRjb250cm9sbGVySGFuZGxlci5uZXcoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUpO1xyXG4gICAgICAgIHRvUmV0dXJuLmJpbmRpbmdzID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5qcyBlbmQnKTtcclxuICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXJIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbi5qcycpO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZVByb3ZpZGVyXHJcbn0gZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZUhhbmRsZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGNyZWF0ZVNweSxcclxuICAgIG1ha2VBcnJheSxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgYXNzZXJ0XyRfQ09OVFJPTExFUixcclxuICAgIGNsZWFuXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgJF9DT05UUk9MTEVSIHtcclxuICAgIHN0YXRpYyBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRfQ09OVFJPTExFUjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lID0gY05hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJTY29wZSA9IHRoaXMucGFyZW50U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICB0aGlzLmxvY2FscyA9IGV4dGVuZChjTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHRoaXMuY29udHJvbGxlclNjb3BlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xyXG4gICAgICAgICAgICBTY29wZToge30sXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgICRhcHBseSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICAkZGVzdHJveSgpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICBjbGVhbih0aGlzKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZShiaW5kaW5ncykge1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBhbmd1bGFyLmlzRGVmaW5lZChiaW5kaW5ncykgJiYgYmluZGluZ3MgIT09IG51bGwgPyBiaW5kaW5ncyA6IHRoaXMuYmluZGluZ3M7XHJcbiAgICAgICAgYXNzZXJ0XyRfQ09OVFJPTExFUih0aGlzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuJGdldCh0aGlzLnVzZWRNb2R1bGVzKVxyXG4gICAgICAgICAgICAuY3JlYXRlKHRoaXMucHJvdmlkZXJOYW1lLCB0aGlzLnBhcmVudFNjb3BlLCB0aGlzLmJpbmRpbmdzLCB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUsIHRoaXMubG9jYWxzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSA9IHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIGxldCB3YXRjaGVyLCBzZWxmID0gdGhpcztcclxuICAgICAgICB3aGlsZSAod2F0Y2hlciA9IHRoaXMucGVuZGluZ1dhdGNoZXJzLnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hcHBseSh0aGlzLCB3YXRjaGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyh0aGlzLmJpbmRpbmdzW2tleV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlS2V5ID0gcmVzdWx0WzJdIHx8IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBzcHlLZXkgPSBbc2NvcGVLZXksICc6Jywga2V5XS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMV0gPT09ICc9Jykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0cm95ZXIgPSB0aGlzLndhdGNoKGtleSwgdGhpcy5JbnRlcm5hbFNwaWVzLlNjb3BlW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5jb250cm9sbGVySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llcjIgPSB0aGlzLndhdGNoKHNjb3BlS2V5LCB0aGlzLkludGVybmFsU3BpZXMuQ29udHJvbGxlcltzcHlLZXldID0gY3JlYXRlU3B5KCksIHNlbGYucGFyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcjIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICB3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250cm9sbGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlclNjb3BlLiR3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBuZ0NsaWNrKGV4cHJlc3Npb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVEaXJlY3RpdmUoJ25nLWNsaWNrJywgZXhwcmVzc2lvbik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXJncyA9IG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICBhcmdzWzBdID0gdGhpcztcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlLmNvbXBpbGUuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGNvbXBpbGVIVE1MKGh0bWxUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkaXJlY3RpdmVIYW5kbGVyKHRoaXMsIGh0bWxUZXh0KTtcclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9uLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnZGlyZWN0aXZlUHJvdmlkZXInKTtcclxuaW1wb3J0IHtcclxuICAgIG5nQmluZERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsaWNrRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0lmRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ1RyYW5zbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzJztcclxudmFyIGRpcmVjdGl2ZVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IG5ldyBNYXAoKSxcclxuICAgICAgICB0b1JldHVybiA9IHt9LFxyXG4gICAgICAgICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpLFxyXG4gICAgICAgICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKS5nZXQoJyR0cmFuc2xhdGUnKSxcclxuICAgICAgICBTUEVDSUFMX0NIQVJTX1JFR0VYUCA9IC8oW1xcOlxcLVxcX10rKC4pKS9nLFxyXG4gICAgICAgIGludGVybmFscyA9IHtcclxuICAgICAgICAgICAgbmdJZjogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICBuZ0NsaWNrOiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nQmluZDogbmdCaW5kRGlyZWN0aXZlKCRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nRGlzYWJsZWQ6IG5nSWZEaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlOiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlLCAkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ1JlcGVhdDoge1xyXG4gICAgICAgICAgICAgICAgcmVnZXg6ICc8ZGl2PjwvZGl2PicsXHJcbiAgICAgICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbigpIHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5nTW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicsXHJcbiAgICAgICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbigpIHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVZhbHVlOiB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuZ0NsYXNzOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB0b1JldHVybi50b0NhbWVsQ2FzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmFtZS5cclxuICAgICAgICByZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbihfLCBzZXBhcmF0b3IsIGxldHRlciwgb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvZmZzZXQgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kZ2V0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSkge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b1JldHVybi50b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICAgICAgaWYgKGludGVybmFsc1tkaXJlY3RpdmVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsc1tkaXJlY3RpdmVOYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5nZXQoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJHB1dCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlQ29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdkaXJlY3RpdmVDb25zdHJ1Y3RvciBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b1JldHVybi50b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGl2ZXMuaGFzKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihhcmd1bWVudHNbMl0pICYmIGFyZ3VtZW50c1syXSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFsnZGlyZWN0aXZlJywgZGlyZWN0aXZlTmFtZSwgJ2hhcyBiZWVuIG92ZXJ3cml0dGVuJ10uam9pbignICcpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IG92ZXJ3cml0ZSAnICsgZGlyZWN0aXZlTmFtZSArICcuXFxuRm9yZ2V0aW5nIHRvIGNsZWFuIG11Y2gnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kY2xlYW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBkaXJlY3RpdmVzLmNsZWFyKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufSkoKTtcclxuY29uc29sZS5sb2coJ2RpcmVjdGl2ZVByb3ZpZGVyIGVuZCcpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVQcm92aWRlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmJpbmQuanMnKTtcclxuXHJcbmltcG9ydCB7XHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIG1ha2VBcnJheVxyXG59IGZyb20gJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0JpbmREaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24ocGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1N0cmluZyhwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgYXJndW1lbnRzWzFdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKHBhcmFtZXRlci5zcGxpdCgnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdldHRlci5hc3NpZ24oY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLCBwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbihwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbW9yeSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ha2VBcnJheShwYXJhbWV0ZXIpLmZvckVhY2goKGN1cnJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4obWVtb3J5ICs9IGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBbJ0RvbnQga25vdyB3aGF0IHRvIGRvIHdpdGggJywgJ1tcIicsIG1ha2VBcnJheShhcmd1bWVudHMpLmpvaW4oJ1wiLCBcIicpLCAnXCJdJ10uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmJpbmQuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmNsaWNrLmpzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWNsaWNrPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjbGljayA9IChzY29wZSwgbG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBsb2NhbHMgfHwge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBleHByZXNzaW9uKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2s7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBBcHBseVRvQ2hpbGRyZW46IHRydWVcclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmNsaWNrLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuaWYuanMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIG5nSWZEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctaWY9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChleHByZXNzaW9uLCBjb250cm9sbGVyU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IHN1YnNjcmlwdG9ycy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnNbaWldLmFwcGx5KHN1YnNjcmlwdG9ycywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLnBhcmVudFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4udmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5pZi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLnRyYW5zbGF0ZS5qcycpO1xyXG5pbXBvcnQge1xyXG4gICAgaXNFeHByZXNzaW9uXHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiBmdW5jdGlvbihleHByZXNzaW9uLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24obmV3TGFuZ3VhZ2UpIHtcclxuICAgICAgICAgICAgICAgICR0cmFuc2xhdGUudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNFeHByZXNzaW9uOiBmdW5jdGlvbihteVRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzRXhwcmVzc2lvbi50ZXN0KG15VGV4dCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0cmFuc2xhdGUuaW5zdGFudCh0ZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZUxhbmd1YWdlOiBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlLnVzZShuZXdMYW5ndWFnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnNvbGUubG9nKCduZy50cmFuc2xhdGUuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbnZhciBkaXJlY3RpdmVIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2RpcmVjdGl2ZUhhbmRsZXInKTtcclxuXHJcbiAgICBsZXQgcHJvdG8gPSBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlIHx8IGFuZ3VsYXIuZWxlbWVudC5fX3Byb3RvX187XHJcbiAgICBwcm90by5uZ0ZpbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB7XHJcbiAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlc1t2YWx1ZXMubGVuZ3RoKytdID0gdGhpc1tpbmRleF0ucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgfHwgJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoam9pbih2YWx1ZXMpKTtcclxuICAgIH07XHJcbiAgICBwcm90by5jbGljayA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctY2xpY2snKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHByb3RvLnRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLmRhdGEoJ25nLWJpbmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGdldEV4cHJlc3Npb24oY3VycmVudCkge1xyXG4gICAgLy8gICAgIGxldCBleHByZXNzaW9uID0gY3VycmVudFswXSAmJiBjdXJyZW50WzBdLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCduZy1jbGljaycpO1xyXG4gICAgLy8gICAgIGlmIChleHByZXNzaW9uICE9PSB1bmRlZmluZWQgJiYgZXhwcmVzc2lvbiAhPT0gbnVsbCkge1xyXG4gICAgLy8gICAgICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi52YWx1ZTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIGZ1bmN0aW9uIGpvaW4ob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhvYmplY3QsIGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKSB7XHJcbiAgICAgICAgb2JqZWN0ID0gYW5ndWxhci5lbGVtZW50KG9iamVjdCk7XHJcbiAgICAgICAgb2JqZWN0LmRhdGEoYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iamVjdC5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMoY2hpbGRyZW5zW2lpXSwgYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKG9iaiwgY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICBvYmogPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IG9ialswXS5hdHRyaWJ1dGVzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0udmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3RpdmU7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21waWxlZERpcmVjdGl2ZSA9IGRpcmVjdGl2ZS5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3RpdmUuQXBwbHlUb0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhvYmosIGRpcmVjdGl2ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGEoZGlyZWN0aXZlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29tcGlsZShjaGlsZHJlbnNbaWldLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRyb2woY29udHJvbGxlclNlcnZpY2UsIG9iaikge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8ICFjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGlsZShjdXJyZW50LCBjb250cm9sbGVyU2VydmljZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdkaXJlY3RpdmVIYW5kbGVyIGVuZCcpO1xyXG4gICAgcmV0dXJuIGNvbnRyb2w7XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZUhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbnRyb2xsZXJRTS5qcycpO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBzYW5pdGl6ZU1vZHVsZXMsXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgaXNFeHByZXNzaW9uXHJcblxyXG59IGZyb20gJy4vY29tbW9uLmpzJztcclxuXHJcbnZhciAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKTtcclxuXHJcbmNsYXNzIGNvbnRyb2xsZXIge1xyXG4gICAgc3RhdGljIHBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBpc29sYXRlU2NvcGUsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbkJpbmRpbmdzID0gKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBtb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlIHx8ICc9JztcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKG1vZGUpO1xyXG4gICAgICAgICAgICBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEtleSA9IGNvbnRyb2xsZXJBcyArICcuJyArIGtleTtcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICc9JzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEdldCA9ICRwYXJzZShjaGlsZEtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudEdldChzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gY2hpbGRHZXQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50R2V0LmFzc2lnbihzY29wZSwgcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSAobG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2Uoc2NvcGVbcGFyZW50S2V5XSkoc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNFeHAgPSBpc0V4cHJlc3Npb24uZXhlYyhzY29wZVtwYXJlbnRLZXldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKGlzRXhwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgbGFzdFZhbHVlID0gcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IChzY29wZVtwYXJlbnRLZXldIHx8ICcnKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSBzY29wZUhlbHBlci5jcmVhdGUoaXNvbGF0ZVNjb3BlIHx8IHNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgaWYgKCFiaW5kaW5ncykge1xyXG4gICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBhbmd1bGFyLmlzU3RyaW5nKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyA9PT0gJz0nKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWtleS5zdGFydHNXaXRoKCckJykgJiYga2V5ICE9PSBjb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBiaW5kaW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93ICdDb3VsZCBub3QgcGFyc2UgYmluZGluZ3MnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAkZ2V0KG1vZHVsZU5hbWVzKSB7XHJcbiAgICAgICAgbGV0ICRjb250cm9sbGVyO1xyXG4gICAgICAgIGFuZ3VsYXIuaW5qZWN0b3Ioc2FuaXRpemVNb2R1bGVzKG1vZHVsZU5hbWVzKSkuaW52b2tlKFxyXG4gICAgICAgICAgICBbJyRjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIChjb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgc2NvcGUsIGJpbmRpbmdzLCBzY29wZUNvbnRyb2xsZXJOYW1lLCBleHRlbmRlZExvY2Fscykge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XHJcbiAgICAgICAgICAgIHNjb3BlQ29udHJvbGxlck5hbWUgPSBzY29wZUNvbnRyb2xsZXJOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgbGV0IGxvY2FscyA9IGV4dGVuZChleHRlbmRlZExvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MgPSAoYiwgbXlMb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvY2FscyA9IG15TG9jYWxzIHx8IGxvY2FscztcclxuICAgICAgICAgICAgICAgIGIgPSBiIHx8IGJpbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGVDb250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVyO1xyXG5jb25zb2xlLmxvZygnY29udHJvbGxlclFNLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzXG4gKiovIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlnKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3Rlc3QnLCBbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSlcclxuICAgICAgICAuY29udHJvbGxlcignZW1wdHlDb250cm9sbGVyJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnZW1wdHlDb250cm9sbGVyJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEluamVjdGlvbnMnLCBbJyRxJywgZnVuY3Rpb24oJHEpIHtcclxuICAgICAgICAgICAgdGhpcy5xID0gJHE7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3dpdGhCaW5kaW5ncycsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5ib3VuZFByb3BlcnR5ID0gdGhpcy5ib3VuZFByb3BlcnR5ICsgJyBtb2RpZmllZCc7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLmNvbmZpZyhbJyR0cmFuc2xhdGVQcm92aWRlcicsIGZ1bmN0aW9uKCR0cmFuc2xhdGVQcm92aWRlcikge1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGVsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnVGhpcyBpcyBhIHBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNoJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0RFOiAnZ2VybWFuJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZGUnLCB7XHJcbiAgICAgICAgICAgICAgICBUSVRMRTogJ0hhbGxvJyxcclxuICAgICAgICAgICAgICAgIEZPTzogJ0RpZXMgaXN0IGVpbiBQYXJhZ3JhcGguJyxcclxuICAgICAgICAgICAgICAgIEJVVFRPTl9MQU5HX0VOOiAnZW5nbGlzY2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdkZXV0c2NoJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdlbicpO1xyXG4gICAgICAgIH1dKTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwL2NvbXBsZXRlTGlzdC5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzYW5pdGl6ZU1vZHVsZXNcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbnZhciBpbmplY3Rpb25zID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRvUmV0dXJuID0ge1xyXG4gICAgICAgICRyb290U2NvcGU6IHNjb3BlSGVscGVyLiRyb290U2NvcGVcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmRlc2NyaWJlKCdVdGlsIGxvZ2ljJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkZXNjcmliZSgnYXJyYXktbGlrZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGFycmF5LWxpa2Ugb2JqZWN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UoYXJndW1lbnRzKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKFtdKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdGVzdE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMSxcclxuICAgICAgICAgICAgICAgIDA6ICdsYWxhJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZSh0ZXN0T2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ3Nhbml0aXplTW9kbGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBlbXB0eSBtb2R1bGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNhbml0aXplTW9kdWxlcygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoW10pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VkIGFkZCBuZyBtb2R1bGUgaXQgaXRzIG5vdCBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoW10pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcyh7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgfSkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFkZCBuZyBub3IgYW5ndWxhciB0byB0aGUgYXJyYXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcygnbmcnKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ2FuZ3VsYXInKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBwYXNzaW5nIGFycmF5cy1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0MSA9IFsnbW9kdWxlMScsICdtb2R1bGUyJ107XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDIgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDMgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDIsXHJcbiAgICAgICAgICAgICAgICAwOiAnbW9kdWxlMScsXHJcbiAgICAgICAgICAgICAgICAxOiAnbW9kdWxlMidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgW29iamVjdDEsIG9iamVjdDIsIG9iamVjdDNdLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzYW5pdGl6ZU1vZHVsZXModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKHZhbHVlLmxlbmd0aCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGRlZmF1bHQgbmcvYW5ndWxhciBtb2R1bGUgdG8gdGhlIGZpcnN0IHBvc2l0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDEgPSBzYW5pdGl6ZU1vZHVsZXMoWydtb2R1bGUxJywgJ21vZHVsZTInLCAnbmcnXSksXHJcbiAgICAgICAgICAgICAgICByZXN1bHQyID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ2FuZ3VsYXInXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQxWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MS5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0Mi5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzY29wZUhlbHBlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgc2NvcGUgd2hlbiBubyBhcmd1bWVudHMgd2hlcmUgZ2l2ZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZSgpLiRyb290KS50b0JlKGluamVjdGlvbnMuJHJvb3RTY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNhbWUgc2NvcGUgcmVmZXJlbmNlIHdoZW4gaXQgcmVjZWl2ZSBhIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkpLnRvQmUoc2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmVzIGFuIGlzb2xhdGVkIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBzY29wZSB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGEgcGFzc2VkIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b1Bhc3MgPSB7XHJcbiAgICAgICAgICAgICAgICBhOiB7fSwgLy8gZm9yIHJlZmVyZW5jZSBjaGVja2luZ1xyXG4gICAgICAgICAgICAgICAgYjoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHJldHVybmVkU2NvcGU7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybmVkU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUodG9QYXNzKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJldHVybmVkU2NvcGUuYSkudG9CZSh0b1Bhc3MuYSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmIpLnRvQmUodG9QYXNzLmIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQga25vdyB3aGVuIGFuIG9iamVjdCBpcyBhIGNvbnRyb2xsZXIgQ29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdzb21ldGhpbmcnXHJcbiAgICAgICAgICAgIH0pLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICB9KS5uZXcoJ3dpdGhCaW5kaW5ncycpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KCRfQ09OVFJPTExFUi5pc0NvbnRyb2xsZXIoY29udHJvbGxlck9iaikpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5kZXNjcmliZSgnY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kIHdoaWNoIHJldHVybiBhIGNvbnRyb2xsZXIgZ2VuZXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuJGdldCkudG9CZURlZmluZWQoKTtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQoKS5jcmVhdGUpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnJGdldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyQ3JlYXRvcjtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyQ3JlYXRvciA9IGNvbnRyb2xsZXIuJGdldCgndGVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgdmFsaWQgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkubmFtZSkudG9CZSgnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29udHJvbGxlcnMgd2l0aCBpbmplY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkucSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgYSBjb250cm9sbGVyIHdpdGggYW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge30pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhIHByb3BlcnR5IGluIHRoZSBzY29wZSBmb3IgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLiQkY2hpbGRIZWFkLmNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlciB3aXRoIHRoZSBnaXZlbiBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCBzY29wZSwgZmFsc2UsICdteUNvbnRyb2xsZXInKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQubXlDb250cm9sbGVyKS50b0JlKGNvbnRyb2xsZXIxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IFwidHJ1ZVwiIGFuZCBcIj1cIiBhcyBiaW5kVG9Db250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSwgJz0nKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmluZCBpZiBiaW5kVG9Db250cm9sbGVyIGlzIFwiZmFsc2VcIiBvciBcInVuZGVmaW5lZFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMS5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgndW5kZWZpbmVkIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVzY3JpYmUoJ2JpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCI9XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiQFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ0AnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5ib3VuZFByb3BlcnR5KS50b0JlKCdTb21ldGhpbmcgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIiZcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdvdGhlclByb3BlcnR5LmpvaW4oXCJcIiknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbMSwgMiwgM11cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICcmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSgpKS50b0JlKCcxMjMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdleHByZXNzaW9ucyBzaG91bGQgYWxsb3cgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWydhJywgJ2InLCAnYyddXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRvQmUoJ2FiYycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuXHJcbmRlc2NyaWJlKCdjb250cm9sbGVySGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ215TW9kdWxlJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvbnRyb2xsZXJIYW5kbGVyIHdoZW4gYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKSkudG9CZShjb250cm9sbGVySGFuZGxlcik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iaikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlLiRwYXJlbnQpLnRvQmUoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai51c2VkTW9kdWxlcykudG9FcXVhbChbJ3Rlc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNyZWF0ZSgpKS50b0JlKGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBiaW5kaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsczogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHQ6ICdieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246ICdieVRleHQudG9VcHBlckNhc2UoKSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVhbHNSZXN1bHQ6ICc9ZXF1YWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHRSZXN1bHQ6ICdAYnlUZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uUmVzdWx0OiAnJmV4cHJlc3Npb24nXHJcbiAgICAgICAgICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXF1YWxzUmVzdWx0KS50b0JlKHNjb3BlLmVxdWFscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5ieVRleHRSZXN1bHQpLnRvQmUoc2NvcGUuYnlUZXh0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmV4cHJlc3Npb25SZXN1bHQoKSkudG9CZShzY29wZS5ieVRleHQudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ1dhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzY29wZSwgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyB3YXRjaGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJncykudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIGNvbnRyb2xsZXIgaW50byB0aGUgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ2xvbG8nKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIHNjb3BlIGludG8gdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZ2l2ZSB0aGUgcGFyZW50IHNjb3BlIHByaXZpbGVnZSBvdmVyIHRoZSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSA9ICdjaGlsZCc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgncGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZS5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlc3Ryb3lpbmcgdGhlIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIubmV3KCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJTcGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdW5pcXVlT2JqZWN0ID0gZnVuY3Rpb24gdW5pcXVlT2JqZWN0KCkge307XHJcbiAgICBsZXQgY29udHJvbGxlckNvbnN0cnVjdG9yO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgIGlmIChjb250cm9sbGVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgIGE6ICc9JyxcclxuICAgICAgICAgICAgYjogJ0AnLFxyXG4gICAgICAgICAgICBjOiAnJidcclxuICAgICAgICB9KS5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgIGE6IHVuaXF1ZU9iamVjdCxcclxuICAgICAgICAgICAgYjogJ2InLFxyXG4gICAgICAgICAgICBjOiAnYSdcclxuICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzcGllcyBmb3IgZWFjaCBCb3VuZGVkIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBteVNweSA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5JbnRlcm5hbFNwaWVzLlNjb3BlWydhOmEnXTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBteVNweS50b29rKCkgPT09ICdudW1iZXInKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS50b29rKCkpLnRvQmUobXlTcHkudG9vaygpKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCdkaXJlY3RpdmVQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlUHJvdmlkZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBhbmQgbm90IHRocm93IGlzIHRoZSBkaXJlY3RpdmUgZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgcmV0dXJuZWQgPSB7fTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybmVkID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbm90IGV4aXN0aW5nJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICBleHBlY3QocmV0dXJuZWQpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgW1xyXG4gICAgICAgICduZy1pZicsXHJcbiAgICAgICAgJ25nOmlmJyxcclxuICAgICAgICAnbmdJZicsXHJcbiAgICAgICAgJ25nLXJlcGVhdCcsXHJcbiAgICAgICAgJ25nLWNsaWNrJyxcclxuICAgICAgICAnbmctZGlzYWJsZWQnLFxyXG4gICAgICAgICduZy1iaW5kJyxcclxuICAgICAgICAnbmctbW9kZWwnLFxyXG4gICAgICAgICd0cmFuc2xhdGUnLFxyXG4gICAgICAgICd0cmFuc2xhdGUtdmFsdWUnLFxyXG4gICAgICAgICduZy1jbGFzcydcclxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbHdheXMgY29udGFpbiB0aGUgJyArIGl0ZW0gKyAnZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGl0ZW0pKS50b0JlRGVmaW5lZChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdwdXRzIGFuZCB1c2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNweTtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBzcHkuYW5kLnJldHVyblZhbHVlKHNweSk7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRjbGVhbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIGRpcmVjdGl2ZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215OmRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteURpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBvdmVyd3JpdGluZywgYnV0IHByZXNlcnZlIGZpcnN0IHZlcnNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge30pO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdhbGxvdyBtZSB0byBvdmVyd3JpdGUgd2l0aCBhIHRoaXJkIHBhcmFtZXRlciBpbiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIHRydWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgY29uc3QgYW5vdGhlclNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIGFub3RoZXJTcHkuYW5kLnJldHVyblZhbHVlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBhbm90aGVyU3B5LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLm5vdC50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShhbm90aGVyU3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoYW5vdGhlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnZGlyZWN0aXZlSGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ0hFTExPJyxcclxuICAgICAgICAgICAgYUludDogMFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZGlyZWN0aXZlSGFuZGxlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjcmVhdGUgbmV3IGluc3RhbmNlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gY29tcGlsZSBodG1sJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYvPicpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjYWxsIG5nLWNsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctY2xpY2s9XCJjdHJsLmFTdHJpbmcgPSBcXCdhbm90aGVyVmFsdWVcXCdcIi8+Jyk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZmFpbCBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJ2EnKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGRvZXMgbm90IGhhdmUgdGhlIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5jbGljaygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYXBwbHkgdGhlIGNsaWNrIGV2ZW50IHRvIGVhY2ggb2YgaXRzIGNoaWxkcmVucyAoaWYgbmVlZGVkKScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgYCAgIDxkaXYgbmctY2xpY2s9XCJjdHJsLmFJbnQgPSBjdHJsLmFJbnQgKyAxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nZmlyc3QnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdzZWNvbmQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSd0aGlyZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Lz5gKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNmaXJzdCcpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjc2Vjb25kJykuY2xpY2soKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyN0aGlyZCcpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscyAoZm9yIHRlc3RpbmcpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIGAgICA8ZGl2IG5nLWNsaWNrPVwiY3RybC5hSW50ID0gIHZhbHVlICsgY3RybC5hSW50IFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2ZpcnN0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nc2Vjb25kJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0ndGhpcmQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdi8+YCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjZmlyc3QnKS5jbGljayh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgxMDAwKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNzZWNvbmQnKS5jbGljayh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogJydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoJzEwMDAnKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyN0aGlyZCcpLmNsaWNrKHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKCcxMTAwMCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjYWxsIHRleHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICAgICAgaGFuZGxlci50ZXh0KCduZXdWYWx1ZScpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCduZXdWYWx1ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlLCBvbmUgbGV0dGVyIGF0IHRoZSB0aW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goJ2N0cmwuYVN0cmluZycsIHNweSk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIudGV4dCgnbmV3VmFsdWUnLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgnbmV3VmFsdWUnLmxlbmd0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUlmO1xyXG4gICAgY29uc3QgbmdJZiA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nLWlmJyk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15Qm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15SWYgPSBuZ0lmLmNvbXBpbGUoJ2N0cmwubXlCb29sZWFuJywgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBteUlmJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBpZiBubyAkZGlnZXN0IHdhcyBleGVjdXRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGxhdGVzdCBldmFsdWF0ZWQgdmFsdWUgb24gYSB3YXRjaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZS5teUJvb2xlYW4gPSBhbmd1bGFyLm5vb3A7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkubm90LnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKGFuZ3VsYXIubm9vcCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYXR0YWNoaW5nIHNweXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIG15SWYobXlTcHkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGRlYXR0YWNoaW5nIHNwaWVzIHRvIHRoZSB3YXRjaGluZyBjeWNsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBjb25zdCB3YXRjaGVyID0gbXlJZihteVNweSk7XHJcbiAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBvbmx5IGRlYXR0YWNoIHRoZSBjb3JyZWNwb25kaW5nIHNweScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBjb25zdCBteVNweTIgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICBteUlmKG15U3B5Mik7XHJcbiAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15QmluZCwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgY29uc3QgbmdCaW5kID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmdCaW5kJyk7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gJ2N0cmwubXlTdHJpbmdQYXJhbWV0ZXInO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge30sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlCaW5kID0gbmdCaW5kLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlCaW5kKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgY29udHJvbGxlciB3aGVuIHJlY2VpdmluZyBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGZpcmUgYW4gZGlnZXN0IHdoZW4gZG9pbmcgYW5kIGFzc2lnbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBteUJpbmQoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgY3VycmVudCBzdGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIgPSAnc29tZVZhbHVlJztcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ3NvbWVWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmaXJlIGRpZ2VzdHMgd2hlbiBjb25zdWx0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgbXlCaW5kKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhcnJheSB0byBmaXJlIGNoYW5nZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBvYmplY3RbbmV3VmFsdWVdID0gIW9iamVjdFtuZXdWYWx1ZV0gPyAxIDogb2JqZWN0W25ld1ZhbHVlXSArIDE7IC8vY291bnRpbmcgdGhlIGNhbGxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXlCaW5kKFsnYScsICdWJywgJ2EnLCAnbCcsICd1JywgJ2UnXSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVjogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHVlOiAxIC8vb25seSBvbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYSBzZWNvbmQgdHJ1ZSBwYXJhbWV0ZXIsIHRvIHNpbXVsYXRlIHRoZSBhcnJheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHt9O1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtuZXdWYWx1ZV0gPSAhb2JqZWN0W25ld1ZhbHVlXSA/IDEgOiBvYmplY3RbbmV3VmFsdWVdICsgMTsgLy9jb3VudGluZyB0aGUgY2FsbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBteUJpbmQoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qob2JqZWN0KS50b0VxdWFsKHtcclxuICAgICAgICAgICAgYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVY6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbDogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHU6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1ZTogMSAvL29ubHkgb25jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSBjaGFuZ2VzIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZC5jaGFuZ2VzKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2NoYW5nZXMgc2hvdWxkIG9ubHkgZmlyZSBvbmNlIHBlciBjaGFuZ2UgKGluZGVwZW5kZW50IG9mIHdhdGNoZXIpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXJTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCB3YXRjaGVyU3B5KTtcclxuICAgICAgICAgICAgbXlCaW5kLmNoYW5nZXMoc3B5KTtcclxuICAgICAgICAgICAgbXlCaW5kKCdhVmFsdWUnLCB0cnVlKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdhbm90aGVyVmFsdWUnO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDYpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2F0Y2hlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQmluZC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUNsaWNrLCBzcHk7XHJcbiAgICBjb25zdCBuZ0NsaWNrID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmdDbGljaycpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteVNweTogc3B5XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgbXlDbGljayA9IG5nQ2xpY2suY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2N0cmwubXlTcHkocGFyYW0xLCBwYXJhbTIpJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlDbGljaykudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjYWxsaW5nIGl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRoZSBzcHkgd2hlbiBjYWxsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MSA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MiA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge1xyXG4gICAgICAgICAgICBwYXJhbTE6IG9iamVjdDEsXHJcbiAgICAgICAgICAgIHBhcmFtMjogb2JqZWN0MlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG9iamVjdDEsIG9iamVjdDIpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nVHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15VHJhbnNsYXRlO1xyXG4gICAgY29uc3QgbmdUcmFuc2xhdGUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCd0cmFuc2xhdGUnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgcHJvcDogJ0hFTExPJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlID0gbmdUcmFuc2xhdGUuY29tcGlsZSgnY3RybC5wcm9wJywgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nVHJhbnNsYXRlLnNwZWMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9