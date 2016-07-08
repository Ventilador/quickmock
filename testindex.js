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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2U2NmQzYzdlZjE0MzIwM2E1YTI/ODk0MCIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanM/MTZhMSIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanM/MDNiMSIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcz9jYjFiIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzPzYyM2MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcz80MGU2Iiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzPzRjMTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanM/ZjU5YSIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanM/ZjdkZCIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzP2Q5NWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzP2NiYTIiLCJ3ZWJwYWNrOi8vLy4vYXBwL2NvbXBsZXRlTGlzdC5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUMzQkE7Ozs7OztBQVhBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSOztBQUVBLCtCOzs7Ozs7Ozs7Ozs7Ozs7O1NDSGdCLFcsR0FBQSxXO1NBV0EsZ0IsR0FBQSxnQjtTQVVBLG1CLEdBQUEsbUI7U0FRQSxLLEdBQUEsSztTQW1CQSxTLEdBQUEsUztTQWtCQSxTLEdBQUEsUztTQVdBLE0sR0FBQSxNO1NBZ0VBLGUsR0FBQSxlO1NBUUEsZSxH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O0FBQUEsU0FBdUIsb0JBQXZCO0FBQ0EsU0FBTSxjQUFjLDRCQUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFwQjtBQUNBLGdCQUFXLFlBQVc7QUFDbEIsNkJBQW9CLDRCQUFrQixLQUFsQixHQUEwQixVQUExQixDQUFxQyxNQUFyQyxFQUE2QyxVQUE3QyxDQUF3RCxpQkFBeEQsRUFBMkUsTUFBM0UsRUFBbUY7QUFDbkcsbUJBQU07QUFENkYsVUFBbkYsRUFFakIsSUFGaUIsQ0FBcEI7QUFHQSwyQkFBa0IsTUFBbEI7QUFDQSx1QkFBYyxZQUFZLE9BQVosQ0FBb0IsV0FBcEIsRUFBaUMsaUJBQWpDLENBQWQ7QUFDSCxNQU5EO0FBT0gsRUFWRCxFIiwiZmlsZSI6Ii4vdGVzdGluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3ZTY2ZDNjN2VmMTQzMjAzYTVhMlxuICoqLyIsInJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tb24uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5zcGVjLmpzJyk7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi8uLi9hcHAvY29tcGxldGVMaXN0LmpzJztcclxuY29uZmlnKCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2luZGV4LmxvYWRlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb21tb24uanMnKTtcclxuZXhwb3J0IHZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcclxuZXhwb3J0IHZhciBpc0V4cHJlc3Npb24gPSAvXnt7Lip9fSQvO1xyXG4vKiBTaG91bGQgcmV0dXJuIHRydWUgXHJcbiAqIGZvciBvYmplY3RzIHRoYXQgd291bGRuJ3QgZmFpbCBkb2luZ1xyXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobXlPYmopO1xyXG4gKiB3aGljaCByZXR1cm5zIGEgbmV3IGFycmF5IChyZWZlcmVuY2Utd2lzZSlcclxuICogUHJvYmFibHkgbmVlZHMgbW9yZSBzcGVjc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8XHJcbiAgICAgICAgKCEhaXRlbSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmxlbmd0aCA+PSAwXHJcbiAgICAgICAgKSB8fFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xyXG5cclxuICAgIGxldCBrZXk7XHJcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgWydcIicsIGtleSwgJ1wiIHByb3BlcnR5IGNhbm5vdCBiZSBudWxsJ10uam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xyXG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFtcclxuICAgICAgICAncGFyZW50U2NvcGUnLFxyXG4gICAgICAgICdiaW5kaW5ncycsXHJcbiAgICAgICAgJ2NvbnRyb2xsZXJTY29wZSdcclxuICAgIF0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XHJcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gb2JqZWN0Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKG9iamVjdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xyXG4gICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBsZXQgZW5kVGltZTtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gc3B5T24oe1xyXG4gICAgICAgIGE6ICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgdG9SZXR1cm4udG9vayA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZW5kVGltZSAtIHN0YXJ0VGltZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW2l0ZW1dO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgbGV0IHJlbW92ZSQgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XHJcbiAgICBsZXQgY3VycmVudDtcclxuICAgIHdoaWxlIChjdXJyZW50ID0gdmFsdWVzLnNoaWZ0KCkpIHtcclxuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuY29uc3Qgcm9vdFNjb3BlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHJvb3RTY29wZScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xyXG4gICAgaWYgKHNjb3BlLiRyb290KSB7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlLiRyb290O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXJlbnQ7XHJcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQuJHJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC4kcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3Mgc2NvcGVIZWxwZXIge1xyXG4gICAgc3RhdGljIGNyZWF0ZShzY29wZSkge1xyXG4gICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kKHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0FycmF5TGlrZShzY29wZSkpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Jvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNTY29wZShvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShyb290U2NvcGUpICYmIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XHJcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcclxuXHJcbiAgICBjb25zdCBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGlmIChcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJlxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2R1bGVzO1xyXG59XHJcbmNvbnNvbGUubG9nKCdjb21tb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb21tb24uanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuXHJcbnZhciBjb250cm9sbGVySGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5qcycpO1xyXG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICBsZXQgbXlNb2R1bGVzLCBjdHJsTmFtZSwgY0xvY2FscywgcFNjb3BlLCBjU2NvcGUsIGNOYW1lLCBiaW5kVG9Db250cm9sbGVyO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhbigpIHtcclxuICAgICAgICBteU1vZHVsZXMgPSBbXTtcclxuICAgICAgICBjdHJsTmFtZSA9IHBTY29wZSA9IGNMb2NhbHMgPSBjU2NvcGUgPSBiaW5kVG9Db250cm9sbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gJGNvbnRyb2xsZXJIYW5kbGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoIWN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQbGVhc2UgcHJvdmlkZSB0aGUgY29udHJvbGxlclxcJ3MgbmFtZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xyXG4gICAgICAgIGlmICghY1Njb3BlKSB7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHBTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgfSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBTY29wZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNTY29wZSA9IHRlbXBTY29wZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xyXG4gICAgICAgIGNsZWFuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24oYmluZGluZ3MpIHtcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSAkX0NPTlRST0xMRVI7XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uKG5ld1Njb3BlKSB7XHJcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgY0xvY2FscyA9IGxvY2FscztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoW21vZHVsZXNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShtb2R1bGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmlzSW50ZXJuYWwgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVybmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIHNjb3BlQ29udHJvbGxlcnNOYW1lLCBwYXJlbnRTY29wZSwgY2hpbGRTY29wZSkge1xyXG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xyXG4gICAgICAgICAgICBjTmFtZSA9ICdjb250cm9sbGVyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3U2VydmljZSA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyhjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSk7XHJcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9O1xyXG4gICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmpzIGVuZCcpO1xyXG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9uLmpzJyk7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgZGlyZWN0aXZlUHJvdmlkZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZGlyZWN0aXZlSGFuZGxlclxyXG59IGZyb20gJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgY3JlYXRlU3B5LFxyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBhc3NlcnRfJF9DT05UUk9MTEVSLFxyXG4gICAgY2xlYW5cclxufSBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyAkX0NPTlRST0xMRVIge1xyXG4gICAgc3RhdGljIGlzQ29udHJvbGxlcihvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgJF9DT05UUk9MTEVSO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoY3RybE5hbWUsIHBTY29wZSwgYmluZGluZ3MsIG1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKSB7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlck5hbWUgPSBjdHJsTmFtZTtcclxuICAgICAgICB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUgPSBjTmFtZSB8fCAnY29udHJvbGxlcic7XHJcbiAgICAgICAgdGhpcy51c2VkTW9kdWxlcyA9IG1vZHVsZXMuc2xpY2UoKTtcclxuICAgICAgICB0aGlzLnBhcmVudFNjb3BlID0gcFNjb3BlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlclNjb3BlID0gdGhpcy5wYXJlbnRTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHRoaXMubG9jYWxzID0gZXh0ZW5kKGNMb2NhbHMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICRzY29wZTogdGhpcy5jb250cm9sbGVyU2NvcGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzID0gW107XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLkludGVybmFsU3BpZXMgPSB7XHJcbiAgICAgICAgICAgIFNjb3BlOiB7fSxcclxuICAgICAgICAgICAgQ29udHJvbGxlcjoge31cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgJGFwcGx5KCkge1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgIH1cclxuICAgICRkZXN0cm95KCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgIGNsZWFuKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyAhPT0gbnVsbCA/IGJpbmRpbmdzIDogdGhpcy5iaW5kaW5ncztcclxuICAgICAgICBhc3NlcnRfJF9DT05UUk9MTEVSKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID1cclxuICAgICAgICAgICAgY29udHJvbGxlci4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHdhdGNoZXIsIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llciA9IHRoaXMud2F0Y2goa2V5LCB0aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyMiA9IHRoaXMud2F0Y2goc2NvcGVLZXksIHRoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIG5nQ2xpY2soZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICBjb25zdCBhcmdzID0gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xyXG4gICAgfVxyXG59XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5leHRlbnNpb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdkaXJlY3RpdmVQcm92aWRlcicpO1xyXG5pbXBvcnQge1xyXG4gICAgbmdCaW5kRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nQ2xpY2tEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nSWZEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nVHJhbnNsYXRlRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMnO1xyXG52YXIgZGlyZWN0aXZlUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxyXG4gICAgICAgIHRvUmV0dXJuID0ge30sXHJcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXHJcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pLmdldCgnJHRyYW5zbGF0ZScpLFxyXG4gICAgICAgIFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2csXHJcbiAgICAgICAgaW50ZXJuYWxzID0ge1xyXG4gICAgICAgICAgICBuZ0lmOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xpY2s6IG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdCaW5kOiBuZ0JpbmREaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdEaXNhYmxlZDogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUsICRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nUmVwZWF0OiB7XHJcbiAgICAgICAgICAgICAgICByZWdleDogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmdNb2RlbDoge1xyXG4gICAgICAgICAgICAgICAgcmVnZXg6ICc8aW5wdXQgdHlwZT1cInRleHRcIi8+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlVmFsdWU6IHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5nQ2xhc3M6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIHRvUmV0dXJuLnRvQ2FtZWxDYXNlID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lLlxyXG4gICAgICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9mZnNldCA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRnZXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVzLmdldChkaXJlY3RpdmVOYW1lKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kcHV0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IpIHtcclxuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ2RpcmVjdGl2ZUNvbnN0cnVjdG9yIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkgJiYgYXJndW1lbnRzWzJdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coWydkaXJlY3RpdmUnLCBkaXJlY3RpdmVOYW1lLCAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4nXS5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3Qgb3ZlcndyaXRlICcgKyBkaXJlY3RpdmVOYW1lICsgJy5cXG5Gb3JnZXRpbmcgdG8gY2xlYW4gbXVjaCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRjbGVhbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMuY2xlYXIoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5jb25zb2xlLmxvZygnZGlyZWN0aXZlUHJvdmlkZXIgZW5kJyk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuYmluZC5qcycpO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nQmluZERpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbihwYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzU3RyaW5nKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhcmd1bWVudHNbMV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4ocGFyYW1ldGVyLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0dGVyLmFzc2lnbihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUsIHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtb3J5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZUFycmF5KHBhcmFtZXRlcikuZm9yRWFjaCgoY3VycmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihtZW1vcnkgKz0gY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFsnRG9udCBrbm93IHdoYXQgdG8gZG8gd2l0aCAnLCAnW1wiJywgbWFrZUFycmF5KGFyZ3VtZW50cykuam9pbignXCIsIFwiJyksICdcIl0nXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuYmluZC5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuY2xpY2suanMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctY2xpY2s9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhleHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGNsaWNrID0gKHNjb3BlLCBsb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IGxvY2FscyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb24oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIEFwcGx5VG9DaGlsZHJlbjogdHJ1ZVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuY2xpY2suanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5pZi5qcycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdJZkRpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1pZj1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgc3Vic2NyaXB0b3JzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9yc1tpaV0uYXBwbHkoc3Vic2NyaXB0b3JzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmlmLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcudHJhbnNsYXRlLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBpc0V4cHJlc3Npb25cclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0V4cHJlc3Npb246IGZ1bmN0aW9uKG15VGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNFeHByZXNzaW9uLnRlc3QobXlUZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5pbnN0YW50KHRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGUudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ25nLnRyYW5zbGF0ZS5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxudmFyIGRpcmVjdGl2ZUhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGlyZWN0aXZlSGFuZGxlcicpO1xyXG5cclxuICAgIGxldCBwcm90byA9IGFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUgfHwgYW5ndWxhci5lbGVtZW50Ll9fcHJvdG9fXztcclxuICAgIHByb3RvLm5nRmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHtcclxuICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB0aGlzW2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xyXG4gICAgfTtcclxuICAgIHByb3RvLmNsaWNrID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1jbGljaycpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2sobG9jYWxzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctYmluZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbihjdXJyZW50KSB7XHJcbiAgICAvLyAgICAgbGV0IGV4cHJlc3Npb24gPSBjdXJyZW50WzBdICYmIGN1cnJlbnRbMF0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ25nLWNsaWNrJyk7XHJcbiAgICAvLyAgICAgaWYgKGV4cHJlc3Npb24gIT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uICE9PSBudWxsKSB7XHJcbiAgICAvLyAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnZhbHVlO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgZnVuY3Rpb24gam9pbihvYmopIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgb2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iamVjdCwgYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpIHtcclxuICAgICAgICBvYmplY3QgPSBhbmd1bGFyLmVsZW1lbnQob2JqZWN0KTtcclxuICAgICAgICBvYmplY3QuZGF0YShhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqZWN0LmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhjaGlsZHJlbnNbaWldLCBhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS5BcHBseVRvQ2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iaiwgZGlyZWN0aXZlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouZGF0YShkaXJlY3RpdmVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbnMgPSBvYmouY2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgY2hpbGRyZW5zLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBjb21waWxlKGNoaWxkcmVuc1tpaV0sIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udHJvbChjb250cm9sbGVyU2VydmljZSwgb2JqKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcclxuICAgICAgICBpZiAoIWN1cnJlbnQgfHwgIWNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21waWxlKGN1cnJlbnQsIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2RpcmVjdGl2ZUhhbmRsZXIgZW5kJyk7XHJcbiAgICByZXR1cm4gY29udHJvbDtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGlyZWN0aXZlSGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlclFNLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIHNhbml0aXplTW9kdWxlcyxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBpc0V4cHJlc3Npb25cclxuXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxudmFyICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgY29uc3QgYXNzaWduQmluZGluZ3MgPSAoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIG1vZGUpID0+IHtcclxuICAgICAgICAgICAgbW9kZSA9IG1vZGUgfHwgJz0nO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMobW9kZSk7XHJcbiAgICAgICAgICAgIG1vZGUgPSByZXN1bHRbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkS2V5ID0gY29udHJvbGxlckFzICsgJy4nICsga2V5O1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgbGFzdFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVXYXRjaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBjaGlsZEdldChkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRHZXQuYXNzaWduKHNjb3BlLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IChsb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShzY29wZVtwYXJlbnRLZXldKShzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQCc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0V4cCA9IGlzRXhwcmVzc2lvbi5leGVjKHNjb3BlW3BhcmVudEtleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRHZXQgPSAkcGFyc2UoaXNFeHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEdldCA9ICRwYXJzZShjaGlsZEtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVXYXRjaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gKHNjb3BlW3BhcmVudEtleV0gfHwgJycpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHNjb3BlSGVscGVyLmNyZWF0ZShpc29sYXRlU2NvcGUgfHwgc2NvcGUuJG5ldygpKTtcclxuICAgICAgICBpZiAoIWJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzID09PSB0cnVlIHx8IGFuZ3VsYXIuaXNTdHJpbmcoYmluZGluZ3MpICYmIGJpbmRpbmdzID09PSAnPScpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSAmJiBrZXkgIT09IGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBwYXJzZSBiaW5kaW5ncyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljICRnZXQobW9kdWxlTmFtZXMpIHtcclxuICAgICAgICBsZXQgJGNvbnRyb2xsZXI7XHJcbiAgICAgICAgYW5ndWxhci5pbmplY3RvcihzYW5pdGl6ZU1vZHVsZXMobW9kdWxlTmFtZXMpKS5pbnZva2UoXHJcbiAgICAgICAgICAgIFsnJGNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgKGNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBzY29wZSwgYmluZGluZ3MsIHNjb3BlQ29udHJvbGxlck5hbWUsIGV4dGVuZGVkTG9jYWxzKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKTtcclxuICAgICAgICAgICAgc2NvcGVDb250cm9sbGVyTmFtZSA9IHNjb3BlQ29udHJvbGxlck5hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgICAgICBsZXQgbG9jYWxzID0gZXh0ZW5kKGV4dGVuZGVkTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkuJG5ldygpXHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gJGNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIGxvY2FscywgdHJ1ZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncyA9IChiLCBteUxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxzID0gbXlMb2NhbHMgfHwgbG9jYWxzO1xyXG4gICAgICAgICAgICAgICAgYiA9IGIgfHwgYmluZGluZ3M7XHJcblxyXG4gICAgICAgICAgICAgICAgZXh0ZW5kKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXI7XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb250cm9sbGVyUU0uanNcbiAqKi8iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWcoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgndGVzdCcsIFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdlbXB0eUNvbnRyb2xsZXInLCBbZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICdlbXB0eUNvbnRyb2xsZXInO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCd3aXRoSW5qZWN0aW9ucycsIFsnJHEnLCBmdW5jdGlvbigkcSkge1xyXG4gICAgICAgICAgICB0aGlzLnEgPSAkcTtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEJpbmRpbmdzJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvdW5kUHJvcGVydHkgPSB0aGlzLmJvdW5kUHJvcGVydHkgKyAnIG1vZGlmaWVkJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29uZmlnKFsnJHRyYW5zbGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgVElUTEU6ICdIZWxsbycsXHJcbiAgICAgICAgICAgICAgICBGT086ICdUaGlzIGlzIGEgcGFyYWdyYXBoLicsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19FTjogJ2VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdnZXJtYW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGFsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnRGllcyBpc3QgZWluIFBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNjaCcsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19ERTogJ2RldXRzY2gnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgfV0pO1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9hcHAvY29tcGxldGVMaXN0LmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgICRfQ09OVFJPTExFUlxyXG59IGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIHNhbml0aXplTW9kdWxlc1xyXG59IGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxudmFyIGluamVjdGlvbnMgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdG9SZXR1cm4gPSB7XHJcbiAgICAgICAgJHJvb3RTY29wZTogc2NvcGVIZWxwZXIuJHJvb3RTY29wZVxyXG4gICAgfTtcclxuICAgIHJldHVybiB0b1JldHVybjtcclxufSkoKTtcclxuZGVzY3JpYmUoJ1V0aWwgbG9naWMnLCBmdW5jdGlvbigpIHtcclxuICAgIGRlc2NyaWJlKCdhcnJheS1saWtlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYXJyYXktbGlrZSBvYmplY3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0FycmF5TGlrZShhcmd1bWVudHMpKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UoW10pKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBjb25zdCB0ZXN0T2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAxLFxyXG4gICAgICAgICAgICAgICAgMDogJ2xhbGEnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0FycmF5TGlrZSh0ZXN0T2JqZWN0KSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHRlc3RPYmplY3QpKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRlc3RPYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2FuaXRpemVNb2RsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGVtcHR5IG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNhbml0aXplTW9kdWxlcyhbXSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNhbml0aXplTW9kdWxlcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWQgYWRkIG5nIG1vZHVsZSBpdCBpdHMgbm90IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcygpLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcyhbXSkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgICAgICB9KS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWRkIG5nIG5vciBhbmd1bGFyIHRvIHRoZSBhcnJheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCduZycpLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcygnYW5ndWxhcicpLmxlbmd0aCkudG9CZSgxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHBhc3NpbmcgYXJyYXlzLWxpa2Ugb2JqZWN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QxID0gWydtb2R1bGUxJywgJ21vZHVsZTInXTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0MiA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0MyA9IHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMixcclxuICAgICAgICAgICAgICAgIDA6ICdtb2R1bGUxJyxcclxuICAgICAgICAgICAgICAgIDE6ICdtb2R1bGUyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBbb2JqZWN0MSwgb2JqZWN0Miwgb2JqZWN0M10uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHNhbml0aXplTW9kdWxlcyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlc3VsdC5sZW5ndGgpLnRvQmUodmFsdWUubGVuZ3RoICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgZGVmYXVsdCBuZy9hbmd1bGFyIG1vZHVsZSB0byB0aGUgZmlyc3QgcG9zaXRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0MSA9IHNhbml0aXplTW9kdWxlcyhbJ21vZHVsZTEnLCAnbW9kdWxlMicsICduZyddKSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBzYW5pdGl6ZU1vZHVsZXMoWydtb2R1bGUxJywgJ21vZHVsZTInLCAnYW5ndWxhciddKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDFbMF0pLnRvQmUoJ25nJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQxLmxlbmd0aCkudG9CZSgzKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDJbMF0pLnRvQmUoJ25nJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyLmxlbmd0aCkudG9CZSgzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ3Njb3BlSGVscGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzY29wZSB3aGVuIG5vIGFyZ3VtZW50cyB3aGVyZSBnaXZlbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVIZWxwZXIuY3JlYXRlKCkuJHJvb3QpLnRvQmUoaW5qZWN0aW9ucy4kcm9vdFNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBzY29wZSByZWZlcmVuY2Ugd2hlbiBpdCByZWNlaXZlIGEgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBpbmplY3Rpb25zLiRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKSkudG9CZShzY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNhbWUgc2NvcGUgcmVmZXJlbmNlIHdoZW4gaXQgcmVjZWl2ZXMgYW4gaXNvbGF0ZWQgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBpbmplY3Rpb25zLiRyb290U2NvcGUuJG5ldyh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkpLnRvQmUoc2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGFuIHNjb3BlIHdpdGggdGhlIHByb3BlcnRpZXMgb2YgYSBwYXNzZWQgb2JqZWN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvUGFzcyA9IHtcclxuICAgICAgICAgICAgICAgIGE6IHt9LCAvLyBmb3IgcmVmZXJlbmNlIGNoZWNraW5nXHJcbiAgICAgICAgICAgICAgICBiOiB7fVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgcmV0dXJuZWRTY29wZTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuZWRTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZSh0b1Bhc3MpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QocmV0dXJuZWRTY29wZS5hKS50b0JlKHRvUGFzcy5hKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJldHVybmVkU2NvcGUuYikudG9CZSh0b1Bhc3MuYik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBrbm93IHdoZW4gYW4gb2JqZWN0IGlzIGEgY29udHJvbGxlciBDb25zdHJ1Y3RvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QoJF9DT05UUk9MTEVSLmlzQ29udHJvbGxlcihjb250cm9sbGVyT2JqKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgc2NvcGVIZWxwZXJcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmRlc2NyaWJlKCdjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGEgJGdldCBtZXRob2Qgd2hpY2ggcmV0dXJuIGEgY29udHJvbGxlciBnZW5lcmF0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci4kZ2V0KS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlci4kZ2V0KSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXIuJGdldCgpLmNyZWF0ZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCckZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJDcmVhdG9yO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJDcmVhdG9yID0gY29udHJvbGxlci4kZ2V0KCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5uYW1lKS50b0JlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250cm9sbGVycyB3aXRoIGluamVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEluamVjdGlvbnMnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5xKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBhbiBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7fSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywgc2NvcGUsIGZhbHNlKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQuY29udHJvbGxlcikudG9CZShjb250cm9sbGVyMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzZXQgYSBwcm9wZXJ0eSBpbiB0aGUgc2NvcGUgZm9yIHRoZSBjb250cm9sbGVyIHdpdGggdGhlIGdpdmVuIG5hbWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSwgJ215Q29udHJvbGxlcicpKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS4kJGNoaWxkSGVhZC5teUNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKCdiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgXCJ0cnVlXCIgYW5kIFwiPVwiIGFzIGJpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0sIHRydWUpKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjEuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMiA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCAnPScpKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIG5vdCBiaW5kIGlmIGJpbmRUb0NvbnRyb2xsZXIgaXMgXCJmYWxzZVwiIG9yIFwidW5kZWZpbmVkXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3VuZGVmaW5lZCBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMi5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkZXNjcmliZSgnYmluZFRvQ29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIj1cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkuYm91bmRQcm9wZXJ0eSkudG9CZSgnU29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCJAXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnQCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiJlwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KCkpLnRvQmUoJzEyMycpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ2V4cHJlc3Npb25zIHNob3VsZCBhbGxvdyBsb2NhbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnb3RoZXJQcm9wZXJ0eS5qb2luKFwiXCIpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWzEsIDIsIDNdXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnJidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmJvdW5kUHJvcGVydHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbJ2EnLCAnYicsICdjJ11cclxuICAgICAgICAgICAgICAgICAgICB9KSkudG9CZSgnYWJjJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5cclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJIYW5kbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVySGFuZGxlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhZGRpbmcgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29udHJvbGxlckhhbmRsZXIgd2hlbiBhZGRpbmcgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCdteU1vZHVsZScpKS50b0JlKGNvbnRyb2xsZXJIYW5kbGVyKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2NyZWF0aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGNyZWF0aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJHBhcmVudCkudG9CZShjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKS50b0JlVW5kZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnVzZWRNb2R1bGVzKS50b0VxdWFsKFsndGVzdCddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGNyZWF0aW5nIGEgY29udHJvbGxlciB3aXRoIGJpbmRpbmdzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnc29tZXRoaW5nJ1xyXG4gICAgICAgICAgICB9KS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgfSkubmV3KCd3aXRoQmluZGluZ3MnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY3JlYXRlKCkpLnRvQmUoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuYm91bmRQcm9wZXJ0eSkudG9CZSgnc29tZXRoaW5nIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyB0byBjaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIGJpbmRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXF1YWxzOiBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJ5VGV4dDogJ2J5VGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2J5VGV4dC50b1VwcGVyQ2FzZSgpJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsc1Jlc3VsdDogJz1lcXVhbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ5VGV4dFJlc3VsdDogJ0BieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25SZXN1bHQ6ICcmZXhwcmVzc2lvbidcclxuICAgICAgICAgICAgICAgIH0pLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5lcXVhbHNSZXN1bHQpLnRvQmUoc2NvcGUuZXF1YWxzKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJ5VGV4dFJlc3VsdCkudG9CZShzY29wZS5ieVRleHQpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXhwcmVzc2lvblJlc3VsdCgpKS50b0JlKHNjb3BlLmJ5VGV4dC50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnV2F0Y2hlcnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IHNjb3BlLCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIHdhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5ib3VuZFByb3BlcnR5ID0gJ2xhbGEnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlKHNjb3BlKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyT2JqLndhdGNoKCdjb250cm9sbGVyLmJvdW5kUHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSkuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdsYWxhJyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmJvdW5kUHJvcGVydHkgPSAnbG9sbyc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChhcmdzKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZWZsZWMgY2hhbmdlcyBvbiB0aGUgY29udHJvbGxlciBpbnRvIHRoZSBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyT2JqLndhdGNoKCdjb250cm9sbGVyLmJvdW5kUHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgfSkuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdsYWxhJyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmJvdW5kUHJvcGVydHkgPSAnbG9sbyc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSkudG9CZSgnbG9sbycpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5wYXJlbnRTY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCByZWZsZWMgY2hhbmdlcyBvbiB0aGUgc2NvcGUgaW50byB0aGUgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdwYXJlbnQnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBnaXZlIHRoZSBwYXJlbnQgc2NvcGUgcHJpdmlsZWdlIG92ZXIgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdwYXJlbnQnO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2NoaWxkJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2Rlc3Ryb3lpbmcgYSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKTtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygndGVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZGVzdHJveWluZyB0aGUgb2JqZWN0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyT2JqLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnY29udHJvbGxlclNwaWVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB1bmlxdWVPYmplY3QgPSBmdW5jdGlvbiB1bmlxdWVPYmplY3QoKSB7fTtcclxuICAgIGxldCBjb250cm9sbGVyQ29uc3RydWN0b3I7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgaWYgKGNvbnRyb2xsZXJDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yID0gY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygndGVzdCcpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgYTogJz0nLFxyXG4gICAgICAgICAgICBiOiAnQCcsXHJcbiAgICAgICAgICAgIGM6ICcmJ1xyXG4gICAgICAgIH0pLnNldFNjb3BlKHtcclxuICAgICAgICAgICAgYTogdW5pcXVlT2JqZWN0LFxyXG4gICAgICAgICAgICBiOiAnYicsXHJcbiAgICAgICAgICAgIGM6ICdhJ1xyXG4gICAgICAgIH0pLm5ldygnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgY3JlYXRlIHNwaWVzIGZvciBlYWNoIEJvdW5kZWQgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNvbnN0cnVjdG9yLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gY29udHJvbGxlckNvbnN0cnVjdG9yLkludGVybmFsU3BpZXMuU2NvcGVbJ2E6YSddO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyLmEgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QodHlwZW9mIG15U3B5LnRvb2soKSA9PT0gJ251bWJlcicpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LnRvb2soKSkudG9CZShteVNweS50b29rKCkpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvY29udHJvbGxlckhhbmRsZXIvc3BpZXMuc3BlYy5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ2RpcmVjdGl2ZVByb3ZpZGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVQcm92aWRlci4kZ2V0KSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGFuZCBub3QgdGhyb3cgaXMgdGhlIGRpcmVjdGl2ZSBkb2VzIG5vdCBleGlzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCByZXR1cm5lZCA9IHt9O1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuZWQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdub3QgZXhpc3RpbmcnKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChyZXR1cm5lZCkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBbXHJcbiAgICAgICAgJ25nLWlmJyxcclxuICAgICAgICAnbmc6aWYnLFxyXG4gICAgICAgICduZ0lmJyxcclxuICAgICAgICAnbmctcmVwZWF0JyxcclxuICAgICAgICAnbmctY2xpY2snLFxyXG4gICAgICAgICduZy1kaXNhYmxlZCcsXHJcbiAgICAgICAgJ25nLWJpbmQnLFxyXG4gICAgICAgICduZy1tb2RlbCcsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZScsXHJcbiAgICAgICAgJ3RyYW5zbGF0ZS12YWx1ZScsXHJcbiAgICAgICAgJ25nLWNsYXNzJ1xyXG4gICAgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsd2F5cyBjb250YWluIHRoZSAnICsgaXRlbSArICdkaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoaXRlbSkpLnRvQmVEZWZpbmVkKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3B1dHMgYW5kIHVzZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3B5O1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIHNweS5hbmQucmV0dXJuVmFsdWUoc3B5KTtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJGNsZWFuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhZGRpbmcgZGlyZWN0aXZlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXk6ZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215RGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFsbG93IG92ZXJ3cml0aW5nLCBidXQgcHJlc2VydmUgZmlyc3QgdmVyc2lvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7fSk7XHJcbiAgICAgICAgICAgIH0pLnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ2FsbG93IG1lIHRvIG92ZXJ3cml0ZSB3aXRoIGEgdGhpcmQgcGFyYW1ldGVyIGluIGEgZnVuY3Rpb24gdGhhdCByZXR1cm4gdHJ1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBzcHkpO1xyXG4gICAgICAgICAgICBjb25zdCBhbm90aGVyU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICAgICAgYW5vdGhlclNweS5hbmQucmV0dXJuVmFsdWUoYW5vdGhlclNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGFub3RoZXJTcHksIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkubm90LnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215LWRpcmVjdGl2ZScpKS50b0JlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChhbm90aGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmRlc2NyaWJlKCdkaXJlY3RpdmVIYW5kbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIHNweSwgY29udHJvbGxlcjtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NsaWNrJyk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJ2FWYWx1ZScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogc3B5LFxyXG4gICAgICAgICAgICBhS2V5OiAnSEVMTE8nLFxyXG4gICAgICAgICAgICBhSW50OiAwXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhU3RyaW5nOiAnPScsXHJcbiAgICAgICAgICAgIGFGdW5jdGlvbjogJyYnLFxyXG4gICAgICAgICAgICBhS2V5OiAnQCcsXHJcbiAgICAgICAgICAgIGFJbnQ6ICc9J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChkaXJlY3RpdmVIYW5kbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNyZWF0ZSBuZXcgaW5zdGFuY2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcigpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBjb21waWxlIGh0bWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdi8+Jyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ25nQ2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgbmctY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1jbGljaz1cImN0cmwuYVN0cmluZyA9IFxcJ2Fub3RoZXJWYWx1ZVxcJ1wiLz4nKTtcclxuICAgICAgICAgICAgaGFuZGxlci5jbGljaygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCdhbm90aGVyVmFsdWUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIGlmIHRoZSBzZWxlY3RlZCBpdGVtIGlzIGludmFsaWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiAvPicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnYScpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZmFpbCBpZiB0aGUgc2VsZWN0ZWQgZG9lcyBub3QgaGF2ZSB0aGUgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiAvPicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhcHBseSB0aGUgY2xpY2sgZXZlbnQgdG8gZWFjaCBvZiBpdHMgY2hpbGRyZW5zIChpZiBuZWVkZWQpJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBgICAgPGRpdiBuZy1jbGljaz1cImN0cmwuYUludCA9IGN0cmwuYUludCArIDFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdmaXJzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3NlY29uZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3RoaXJkJz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYvPmApO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI2ZpcnN0JykuY2xpY2soKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNzZWNvbmQnKS5jbGljaygpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI3RoaXJkJykuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgbG9jYWxzIChmb3IgdGVzdGluZyknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgYCAgIDxkaXYgbmctY2xpY2s9XCJjdHJsLmFJbnQgPSAgdmFsdWUgKyBjdHJsLmFJbnQgXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nZmlyc3QnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdzZWNvbmQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSd0aGlyZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Lz5gKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNmaXJzdCcpLmNsaWNrKHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAxMDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKDEwMDApO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI3NlY29uZCcpLmNsaWNrKHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTAwMCcpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI3RoaXJkJykuY2xpY2soe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoJzExMDAwJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNhbGwgdGV4dCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWJpbmQ9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLnRleHQoKSkudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjaGFuZ2UgdGhlIGNvbnRyb2xsZXIgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLnRleHQoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjaGFuZ2UgdGhlIGNvbnRyb2xsZXIgdmFsdWUsIG9uZSBsZXR0ZXIgYXQgdGhlIHRpbWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaCgnY3RybC5hU3RyaW5nJywgc3B5KTtcclxuICAgICAgICAgICAgaGFuZGxlci50ZXh0KCduZXdWYWx1ZScuc3BsaXQoJycpKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnbmV3VmFsdWUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKCduZXdWYWx1ZScubGVuZ3RoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15SWY7XHJcbiAgICBjb25zdCBuZ0lmID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmctaWYnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlJZiA9IG5nSWYuY29tcGlsZSgnY3RybC5teUJvb2xlYW4nLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlJZikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIG5vICRkaWdlc3Qgd2FzIGV4ZWN1dGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGF0ZXN0IGV2YWx1YXRlZCB2YWx1ZSBvbiBhIHdhdGNoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlLm15Qm9vbGVhbiA9IGFuZ3VsYXIubm9vcDtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS5ub3QudG9CZShhbmd1bGFyLm5vb3ApO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhdHRhY2hpbmcgc3B5cyB0byB0aGUgd2F0Y2hpbmcgY3ljbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgbXlJZihteVNweSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgZGVhdHRhY2hpbmcgc3BpZXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG9ubHkgZGVhdHRhY2ggdGhlIGNvcnJlY3BvbmRpbmcgc3B5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5MiA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IG15SWYobXlTcHkpO1xyXG4gICAgICAgIG15SWYobXlTcHkyKTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweTIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlCaW5kLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBjb25zdCBuZ0JpbmQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0JpbmQnKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnY3RybC5teVN0cmluZ1BhcmFtZXRlcic7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7fSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICBteUJpbmQgPSBuZ0JpbmQuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHRoZSBjb250cm9sbGVyIHdoZW4gcmVjZWl2aW5nIGEgc3RyaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbXlCaW5kKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgZmlyZSBhbiBkaWdlc3Qgd2hlbiBkb2luZyBhbmQgYXNzaWdtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgc3B5KTtcclxuICAgICAgICBleHBlY3Qoc3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBjdXJyZW50IHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnc29tZVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZpcmUgZGlnZXN0cyB3aGVuIGNvbnN1bHRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ3NvbWVWYWx1ZSc7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgc3B5KTtcclxuICAgICAgICBteUJpbmQoKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGFycmF5IHRvIGZpcmUgY2hhbmdlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHt9O1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtuZXdWYWx1ZV0gPSAhb2JqZWN0W25ld1ZhbHVlXSA/IDEgOiBvYmplY3RbbmV3VmFsdWVdICsgMTsgLy9jb3VudGluZyB0aGUgY2FsbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBteUJpbmQoWydhJywgJ1YnLCAnYScsICdsJywgJ3UnLCAnZSddKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWw6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1OiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdWU6IDEgLy9vbmx5IG9uY2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhIHNlY29uZCB0cnVlIHBhcmFtZXRlciwgdG8gc2ltdWxhdGUgdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJywgdHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVjogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHVlOiAxIC8vb25seSBvbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhIGNoYW5nZXMgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlCaW5kLmNoYW5nZXMpLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2NoYW5nZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnY2hhbmdlcyBzaG91bGQgb25seSBmaXJlIG9uY2UgcGVyIGNoYW5nZSAoaW5kZXBlbmRlbnQgb2Ygd2F0Y2hlciknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlclNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHdhdGNoZXJTcHkpO1xyXG4gICAgICAgICAgICBteUJpbmQuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgICAgICBteUJpbmQoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ2Fub3RoZXJWYWx1ZSc7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNik7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3YXRjaGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15Q2xpY2ssIHNweTtcclxuICAgIGNvbnN0IG5nQ2xpY2sgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0NsaWNrJyk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15U3B5OiBzcHlcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBteUNsaWNrID0gbmdDbGljay5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnY3RybC5teVNweShwYXJhbTEsIHBhcmFtMiknKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmluZWQgbXlJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUNsaWNrKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlDbGljaykudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGNhbGxpbmcgaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG15Q2xpY2soKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHNweSB3aGVuIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15Q2xpY2soKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgc3VwcG9ydCBsb2NhbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QxID0gZnVuY3Rpb24oKSB7fTtcclxuICAgICAgICBjb25zdCBvYmplY3QyID0gZnVuY3Rpb24oKSB7fTtcclxuICAgICAgICBjb25zdCBsb2NhbHMgPSB7XHJcbiAgICAgICAgICAgIHBhcmFtMTogb2JqZWN0MSxcclxuICAgICAgICAgICAgcGFyYW0yOiBvYmplY3QyXHJcbiAgICAgICAgfTtcclxuICAgICAgICBteUNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgob2JqZWN0MSwgb2JqZWN0Mik7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdUcmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlUcmFuc2xhdGU7XHJcbiAgICBjb25zdCBuZ1RyYW5zbGF0ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ3RyYW5zbGF0ZScpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBwcm9wOiAnSEVMTE8nXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUgPSBuZ1RyYW5zbGF0ZS5jb21waWxlKCdjdHJsLnByb3AnLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=