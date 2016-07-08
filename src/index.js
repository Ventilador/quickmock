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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(1);
	
	var _controllerHandler = __webpack_require__(2);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	console.log('QM');
	
	(function (angular) {
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
	                    var toReturn = _controllerHandler2.default.addModules(opts.mockModules.concat(opts.moduleName)).bindWith(opts.controller.bindToController).setScope(opts.controller.parentScope).setLocals(mocks).new(opts.providerName, opts.controller.controllerAs);
	                    toReturn.create();
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
	
	    window.quickmock = quickmock;
	
	    return quickmock;
	})(angular);
	
	exports.default = window.quickmock;

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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODUwN2ZlODZmZGZkMDMxNGFiMmMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckNBOztBQUdBOzs7Ozs7QUFKQSxTQUFRLEdBQVIsQ0FBWSxJQUFaOztB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QUFSLENBQVkscUJBQVosRSIsImZpbGUiOiIuL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgODUwN2ZlODZmZGZkMDMxNGFiMmNcbiAqKi8iLCJjb25zb2xlLmxvZygnUU0nKTtcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZFxyXG59IGZyb20gJy4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbihmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICB2YXIgb3B0cywgbW9ja1ByZWZpeDtcclxuICAgIHZhciBjb250cm9sbGVyRGVmYXVsdHMgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcGFyZW50U2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhZmxhZ1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcXVpY2ttb2NrLk1PQ0tfUFJFRklYID0gbW9ja1ByZWZpeCA9IChxdWlja21vY2suTU9DS19QUkVGSVggfHwgJ19fXycpO1xyXG4gICAgcXVpY2ttb2NrLlVTRV9BQ1RVQUwgPSAnVVNFX0FDVFVBTF9JTVBMRU1FTlRBVElPTic7XHJcbiAgICBxdWlja21vY2suTVVURV9MT0dTID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRzID0gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdmFyIGFsbE1vZHVsZXMgPSBvcHRzLm1vY2tNb2R1bGVzLmNvbmNhdChbJ25nTW9jayddKSxcclxuICAgICAgICAgICAgaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKGFsbE1vZHVsZXMuY29uY2F0KFtvcHRzLm1vZHVsZU5hbWVdKSksXHJcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gbW9kT2JqLl9pbnZva2VRdWV1ZSB8fCBbXSxcclxuICAgICAgICAgICAgcHJvdmlkZXJUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgIG1vY2tzID0ge30sXHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0ge307XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxNb2R1bGVzIHx8IFtdLCBmdW5jdGlvbihtb2ROYW1lKSB7XHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gaW52b2tlUXVldWUuY29uY2F0KGFuZ3VsYXIubW9kdWxlKG1vZE5hbWUpLl9pbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmluamVjdCkge1xyXG4gICAgICAgICAgICBpbmplY3Rvci5pbnZva2Uob3B0cy5pbmplY3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaW52b2tlUXVldWUsIGZpbmQgdGhpcyBwcm92aWRlcidzIGRlcGVuZGVuY2llcyBhbmQgcHJlZml4XHJcbiAgICAgICAgICAgIC8vIHRoZW0gc28gQW5ndWxhciB3aWxsIGluamVjdCB0aGUgbW9ja2VkIHZlcnNpb25zXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyRGF0YVsyXVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJOYW1lID09PSBvcHRzLnByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHMgPSBjdXJyUHJvdmlkZXJEZXBzLiRpbmplY3QgfHwgaW5qZWN0b3IuYW5ub3RhdGUoY3VyclByb3ZpZGVyRGVwcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBOYW1lID0gY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2RlcE5hbWVdID0gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlclR5cGUgPT09ICdkaXJlY3RpdmUnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBJbml0aWFsaXplcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZWZpeGVkIGRlcGVuZGVuY2llcyB0aGF0IHBlcnNpc3RlZCBmcm9tIGEgcHJldmlvdXMgY2FsbCxcclxuICAgICAgICAgICAgLy8gYW5kIGNoZWNrIGZvciBhbnkgbm9uLWFubm90YXRlZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cEluaXRpYWxpemVyKCkge1xyXG4gICAgICAgICAgICBwcm92aWRlciA9IGluaXRQcm92aWRlcigpO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5zcHlPblByb3ZpZGVyTWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kaW5pdGlhbGl6ZSA9IHNldHVwSW5pdGlhbGl6ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvdmlkZXIoKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnRyb2xsZXJIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRNb2R1bGVzKG9wdHMubW9ja01vZHVsZXMuY29uY2F0KG9wdHMubW9kdWxlTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kV2l0aChvcHRzLmNvbnRyb2xsZXIuYmluZFRvQ29udHJvbGxlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFNjb3BlKG9wdHMuY29udHJvbGxlci5wYXJlbnRTY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldExvY2Fscyhtb2NrcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm5ldyhvcHRzLnByb3ZpZGVyTmFtZSwgb3B0cy5jb250cm9sbGVyLmNvbnRyb2xsZXJBcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udHJvbGxlci5pc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZpbHRlciA9IGluamVjdG9yLmdldCgnJGZpbHRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZmlsdGVyKG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGU6IGluamVjdG9yLmdldCgnJGFuaW1hdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm1vY2subW9kdWxlKCduZ0FuaW1hdGVNb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY29tcGlsZSA9IGluamVjdG9yLmdldCgnJGNvbXBpbGUnKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlID0gaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJykuJG5ldygpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuXHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRjb21waWxlID0gZnVuY3Rpb24gcXVpY2ttb2NrQ29tcGlsZShodG1sKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbCB8fCBvcHRzLmh0bWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBObyBodG1sIHN0cmluZy9vYmplY3QgcHJvdmlkZWQuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChodG1sKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgJGNvbXBpbGUocHJvdmlkZXIuJGVsZW1lbnQpKHByb3ZpZGVyLiRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGlzb1Njb3BlID0gcHJvdmlkZXIuJGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpIHtcclxuICAgICAgICAgICAgdmFyIGRlcFR5cGUgPSBnZXRQcm92aWRlclR5cGUoZGVwTmFtZSwgaW52b2tlUXVldWUpLFxyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gZGVwTmFtZTtcclxuICAgICAgICAgICAgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gIT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gPT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcFR5cGUgPT09ICd2YWx1ZScgfHwgZGVwVHlwZSA9PT0gJ2NvbnN0YW50Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluamVjdG9yLmhhcyhtb2NrUHJlZml4ICsgZGVwTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUuaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IuaGFzKG1vY2tTZXJ2aWNlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnVzZUFjdHVhbERlcGVuZGVuY2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1NlcnZpY2VOYW1lLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluamVjdCBtb2NrIGZvciBcIicgKyBkZXBOYW1lICsgJ1wiIGJlY2F1c2Ugbm8gc3VjaCBtb2NrIGV4aXN0cy4gUGxlYXNlIHdyaXRlIGEgbW9jayAnICsgZGVwVHlwZSArICcgY2FsbGVkIFwiJyArIG1vY2tTZXJ2aWNlTmFtZSArICdcIiAob3Igc2V0IHRoZSB1c2VBY3R1YWxEZXBlbmRlbmNpZXMgdG8gdHJ1ZSkgYW5kIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG1vY2tTZXJ2aWNlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcikge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHByb3ZpZGVyRGF0YVsyXVswXSkgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvdmlkZXJEYXRhWzJdWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZXIgZGVjbGFyYXRpb24gZnVuY3Rpb24gaGFzIGJlZW4gcHJvdmlkZWQgd2l0aG91dCB0aGUgYXJyYXkgYW5ub3RhdGlvbixcclxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gYW5ub3RhdGUgaXQgc28gdGhlIGludm9rZVF1ZXVlIGNhbiBiZSBwcmVmaXhlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRlZERlcGVuZGVuY2llcyA9IGluamVjdG9yLmFubm90YXRlKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJvdmlkZXJEYXRhWzJdWzFdLiRpbmplY3Q7XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0ZWREZXBlbmRlbmNpZXMucHVzaChwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJEYXRhWzJdWzFdID0gYW5ub3RhdGVkRGVwZW5kZW5jaWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5pdGlhbGl6ZSBiZWNhdXNlIGFuZ3VsYXIgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGxvYWQgYW5ndWxhciBiZWZvcmUgbG9hZGluZyBxdWlja21vY2suanMuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5wcm92aWRlck5hbWUgJiYgIW9wdGlvbnMuY29uZmlnQmxvY2tzICYmICFvcHRpb25zLnJ1bkJsb2Nrcykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gcHJvdmlkZXJOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QsIG9yIHNldCB0aGUgY29uZmlnQmxvY2tzIG9yIHJ1bkJsb2NrcyBmbGFncy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLm1vZHVsZU5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIG1vZHVsZU5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wdGlvbnMubW9ja01vZHVsZXMgPSBvcHRpb25zLm1vY2tNb2R1bGVzIHx8IFtdO1xyXG4gICAgICAgIG9wdGlvbnMubW9ja3MgPSBvcHRpb25zLm1vY2tzIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMuY29udHJvbGxlciA9IGV4dGVuZChvcHRpb25zLmNvbnRyb2xsZXIsIGNvbnRyb2xsZXJEZWZhdWx0cyhhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmNvbnRyb2xsZXIpKSk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvdmlkZXIsIGZ1bmN0aW9uKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuamFzbWluZSAmJiB3aW5kb3cuc3B5T24gJiYgIXByb3BlcnR5LmNhbGxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNweSA9IHNweU9uKHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcHkuYW5kQ2FsbFRocm91Z2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZENhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnNpbm9uICYmIHdpbmRvdy5zaW5vbi5zcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2lub24uc3B5KHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlkZXJUeXBlKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludm9rZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aWRlckluZm8gPSBpbnZva2VRdWV1ZVtpXTtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVySW5mb1syXVswXSA9PT0gcHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVySW5mb1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRwcm92aWRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVySW5mb1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29udHJvbGxlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29tcGlsZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRmaWx0ZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZmlsdGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckYW5pbWF0ZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHVucHJlZml4KSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyRGF0YVsyXVswXSA9PT0gcHJvdmlkZXJOYW1lICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tQcmVmaXggKyBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKSB7XHJcbiAgICAgICAgaWYgKCFodG1sLiR0YWcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gSHRtbCBvYmplY3QgZG9lcyBub3QgY29udGFpbiAkdGFnIHByb3BlcnR5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaHRtbEF0dHJzID0gaHRtbCxcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGh0bWxBdHRycy4kdGFnLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudCA9IGh0bWxBdHRycy4kY29udGVudDtcclxuICAgICAgICBodG1sID0gJzwnICsgdGFnTmFtZSArICcgJztcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaHRtbEF0dHJzLCBmdW5jdGlvbih2YWwsIGF0dHIpIHtcclxuICAgICAgICAgICAgaWYgKGF0dHIgIT09ICckY29udGVudCcgJiYgYXR0ciAhPT0gJyR0YWcnKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IHNuYWtlX2Nhc2UoYXR0cikgKyAodmFsID8gKCc9XCInICsgdmFsICsgJ1wiICcpIDogJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGh0bWwgKz0gaHRtbENvbnRlbnQgPyAoJz4nICsgaHRtbENvbnRlbnQpIDogJz4nO1xyXG4gICAgICAgIGh0bWwgKz0gJzwvJyArIHRhZ05hbWUgKyAnPic7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrTG9nKG1zZykge1xyXG4gICAgICAgIGlmICghcXVpY2ttb2NrLk1VVEVfTE9HUykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgU05BS0VfQ0FTRV9SRUdFWFAgPSAvW0EtWl0vZztcclxuXHJcbiAgICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUsIHNlcGFyYXRvcikge1xyXG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLSc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZShTTkFLRV9DQVNFX1JFR0VYUCwgZnVuY3Rpb24obGV0dGVyLCBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cucXVpY2ttb2NrID0gcXVpY2ttb2NrO1xyXG5cclxuICAgIHJldHVybiBxdWlja21vY2s7XHJcblxyXG59KShhbmd1bGFyKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdpbmRvdy5xdWlja21vY2s7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbW1vbi5qcycpO1xyXG5leHBvcnQgdmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xyXG5leHBvcnQgdmFyIGlzRXhwcmVzc2lvbiA9IC9ee3suKn19JC87XHJcbi8qIFNob3VsZCByZXR1cm4gdHJ1ZSBcclxuICogZm9yIG9iamVjdHMgdGhhdCB3b3VsZG4ndCBmYWlsIGRvaW5nXHJcbiAqIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShteU9iaik7XHJcbiAqIHdoaWNoIHJldHVybnMgYSBuZXcgYXJyYXkgKHJlZmVyZW5jZS13aXNlKVxyXG4gKiBQcm9iYWJseSBuZWVkcyBtb3JlIHNwZWNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSkgfHxcclxuICAgICAgICAoISFpdGVtICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoXCJsZW5ndGhcIikgJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0ubGVuZ3RoID09PSBcIm51bWJlclwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0ubGVuZ3RoID49IDBcclxuICAgICAgICApIHx8XHJcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XHJcblxyXG4gICAgbGV0IGtleTtcclxuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJyB8fCBvYmpba2V5XSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBbJ1wiJywga2V5LCAnXCIgcHJvcGVydHkgY2Fubm90IGJlIG51bGwnXS5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XHJcbiAgICBhc3NlcnROb3REZWZpbmVkKG9iaiwgW1xyXG4gICAgICAgICdwYXJlbnRTY29wZScsXHJcbiAgICAgICAgJ2JpbmRpbmdzJyxcclxuICAgICAgICAnY29udHJvbGxlclNjb3BlJ1xyXG4gICAgXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcclxuICAgIGlmIChpc0FycmF5TGlrZShvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSBvYmplY3QubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShvYmplY3QsIFtpbmRleCwgMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4ob2JqZWN0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3B5KGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIGxldCBlbmRUaW1lO1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSBzcHlPbih7XHJcbiAgICAgICAgYTogKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sICdhJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICB0b1JldHVybi50b29rID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBlbmRUaW1lIC0gc3RhcnRUaW1lO1xyXG4gICAgfTtcclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBcnJheShpdGVtKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiBbaXRlbV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoKSB7XHJcbiAgICBsZXQgcmVtb3ZlJCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlO1xyXG5cclxuICAgIGZ1bmN0aW9uICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmUkIHx8ICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWRlc3RpbmF0aW9uLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xyXG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB2YWx1ZXMuc2hpZnQoKSB8fCB7fTtcclxuICAgIGxldCBjdXJyZW50O1xyXG4gICAgd2hpbGUgKGN1cnJlbnQgPSB2YWx1ZXMuc2hpZnQoKSkge1xyXG4gICAgICAgICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBjdXJyZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxufVxyXG5jb25zdCByb290U2NvcGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcm9vdFNjb3BlJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRSb290RnJvbVNjb3BlKHNjb3BlKSB7XHJcbiAgICBpZiAoc2NvcGUuJHJvb3QpIHtcclxuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhcmVudDtcclxuICAgIHdoaWxlIChwYXJlbnQgPSBzY29wZS4kcGFyZW50KSB7XHJcbiAgICAgICAgaWYgKHBhcmVudC4kcm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBzY29wZUhlbHBlciB7XHJcbiAgICBzdGF0aWMgY3JlYXRlKHNjb3BlKSB7XHJcbiAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICBpZiAodGhpcy5pc1Njb3BlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQocm9vdFNjb3BlLiRuZXcodHJ1ZSksIHNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICBzY29wZSA9IG1ha2VBcnJheShzY29wZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQuYXBwbHkodW5kZWZpbmVkLCBbcm9vdFNjb3BlLiRuZXcodHJ1ZSldLmNvbmNhdChzY29wZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1Njb3BlKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgJiYgZ2V0Um9vdEZyb21TY29wZShvYmplY3QpID09PSBnZXRSb290RnJvbVNjb3BlKHJvb3RTY29wZSkgJiYgb2JqZWN0O1xyXG4gICAgfVxyXG59XHJcbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKG15RnVuY3Rpb24pIHtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcclxuICAgIGlmICh0b1JldHVybiA9PT0gJycgfHwgdG9SZXR1cm4gPT09ICdhbm9uJykge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xyXG5cclxuICAgIGNvbnN0IG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgbGV0IGluZGV4O1xyXG4gICAgaWYgKFxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignbmcnKSkgPT09IC0xICYmXHJcbiAgICAgICAgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xyXG4gICAgICAgIG1vZHVsZXMudW5zaGlmdCgnbmcnKTtcclxuICAgIH1cclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQobW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdICYmICduZycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vZHVsZXM7XHJcbn1cclxuY29uc29sZS5sb2coJ2NvbW1vbi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanMnO1xyXG5cclxudmFyIGNvbnRyb2xsZXJIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmpzJyk7XHJcbiAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcclxuICAgIGxldCBteU1vZHVsZXMsIGN0cmxOYW1lLCBjTG9jYWxzLCBwU2NvcGUsIGNTY29wZSwgY05hbWUsIGJpbmRUb0NvbnRyb2xsZXI7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFuKCkge1xyXG4gICAgICAgIG15TW9kdWxlcyA9IFtdO1xyXG4gICAgICAgIGN0cmxOYW1lID0gcFNjb3BlID0gY0xvY2FscyA9IGNTY29wZSA9IGJpbmRUb0NvbnRyb2xsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiAkY29udHJvbGxlckhhbmRsZXIoKSB7XHJcblxyXG4gICAgICAgIGlmICghY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1BsZWFzZSBwcm92aWRlIHRoZSBjb250cm9sbGVyXFwncyBuYW1lJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHBTY29wZSB8fCB7fSk7XHJcbiAgICAgICAgaWYgKCFjU2NvcGUpIHtcclxuICAgICAgICAgICAgY1Njb3BlID0gcFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB9IHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcFNjb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShjU2NvcGUpO1xyXG4gICAgICAgICAgICBpZiAodGVtcFNjb3BlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY1Njb3BlID0gdGVtcFNjb3BlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b1JldHVybiA9IG5ldyAkX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZFRvQ29udHJvbGxlciwgbXlNb2R1bGVzLCBjTmFtZSwgY0xvY2Fscyk7XHJcbiAgICAgICAgY2xlYW4oKTtcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYmluZFdpdGggPSBmdW5jdGlvbihiaW5kaW5ncykge1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jb250cm9sbGVyVHlwZSA9ICRfQ09OVFJPTExFUjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jbGVhbiA9IGNsZWFuO1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlID0gZnVuY3Rpb24obmV3U2NvcGUpIHtcclxuICAgICAgICBwU2NvcGUgPSBuZXdTY29wZTtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRMb2NhbHMgPSBmdW5jdGlvbihsb2NhbHMpIHtcclxuICAgICAgICBjTG9jYWxzID0gbG9jYWxzO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG5cclxuICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcyA9IGZ1bmN0aW9uKG1vZHVsZXMpIHtcclxuICAgICAgICBmdW5jdGlvbiBwdXNoQXJyYXkoYXJyYXkpIHtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobXlNb2R1bGVzLCBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG1vZHVsZXMpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShhcmd1bWVudHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShbbW9kdWxlc10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBwdXNoQXJyYXkobWFrZUFycmF5KG1vZHVsZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuaXNJbnRlcm5hbCA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbGFnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJuYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGludGVybmFsID0gISFmbGFnO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW50ZXJuYWwgPSAhZmxhZztcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXcgPSBmdW5jdGlvbihjb250cm9sbGVyTmFtZSwgc2NvcGVDb250cm9sbGVyc05hbWUsIHBhcmVudFNjb3BlLCBjaGlsZFNjb3BlKSB7XHJcbiAgICAgICAgY3RybE5hbWUgPSBjb250cm9sbGVyTmFtZTtcclxuICAgICAgICBpZiAoc2NvcGVDb250cm9sbGVyc05hbWUgJiYgIWFuZ3VsYXIuaXNTdHJpbmcoc2NvcGVDb250cm9sbGVyc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoc2NvcGVDb250cm9sbGVyc05hbWUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHBhcmVudFNjb3BlKSB8fCBjU2NvcGU7XHJcbiAgICAgICAgICAgIGNOYW1lID0gJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwYXJlbnRTY29wZSB8fCBwU2NvcGUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoY2hpbGRTY29wZSB8fCBwU2NvcGUuJG5ldygpKTtcclxuICAgICAgICAgICAgY05hbWUgPSBzY29wZUNvbnRyb2xsZXJzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcigpO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXdTZXJ2aWNlID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUsIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAkY29udHJvbGxlckhhbmRsZXIubmV3KGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlKTtcclxuICAgICAgICB0b1JldHVybi5iaW5kaW5ncyA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuanMgZW5kJyk7XHJcbiAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVySGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5leHRlbnNpb24uanMnKTtcclxuXHJcbmltcG9ydCB7XHJcbiAgICBkaXJlY3RpdmVQcm92aWRlclxyXG59IGZyb20gJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBkaXJlY3RpdmVIYW5kbGVyXHJcbn0gZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5pbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZCxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBjcmVhdGVTcHksXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGFzc2VydF8kX0NPTlRST0xMRVIsXHJcbiAgICBjbGVhblxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzICRfQ09OVFJPTExFUiB7XHJcbiAgICBzdGF0aWMgaXNDb250cm9sbGVyKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiAkX0NPTlRST0xMRVI7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kaW5ncywgbW9kdWxlcywgY05hbWUsIGNMb2NhbHMpIHtcclxuICAgICAgICB0aGlzLnByb3ZpZGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSA9IGNOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICB0aGlzLnVzZWRNb2R1bGVzID0gbW9kdWxlcy5zbGljZSgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUgPSBwU2NvcGU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyU2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XHJcbiAgICAgICAgdGhpcy5sb2NhbHMgPSBleHRlbmQoY0xvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiB0aGlzLmNvbnRyb2xsZXJTY29wZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuSW50ZXJuYWxTcGllcyA9IHtcclxuICAgICAgICAgICAgU2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBDb250cm9sbGVyOiB7fVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAkYXBwbHkoKSB7XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgJGRlc3Ryb3koKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgY2xlYW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoYmluZGluZ3MpIHtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYW5ndWxhci5pc0RlZmluZWQoYmluZGluZ3MpICYmIGJpbmRpbmdzICE9PSBudWxsID8gYmluZGluZ3MgOiB0aGlzLmJpbmRpbmdzO1xyXG4gICAgICAgIGFzc2VydF8kX0NPTlRST0xMRVIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IgPVxyXG4gICAgICAgICAgICBjb250cm9sbGVyLiRnZXQodGhpcy51c2VkTW9kdWxlcylcclxuICAgICAgICAgICAgLmNyZWF0ZSh0aGlzLnByb3ZpZGVyTmFtZSwgdGhpcy5wYXJlbnRTY29wZSwgdGhpcy5iaW5kaW5ncywgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lLCB0aGlzLmxvY2Fscyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVySW5zdGFuY2UgPSB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBsZXQgd2F0Y2hlciwgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKHdhdGNoZXIgPSB0aGlzLnBlbmRpbmdXYXRjaGVycy5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2F0Y2guYXBwbHkodGhpcywgd2F0Y2hlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWModGhpcy5iaW5kaW5nc1trZXldKSxcclxuICAgICAgICAgICAgICAgICAgICBzY29wZUtleSA9IHJlc3VsdFsyXSB8fCBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgc3B5S2V5ID0gW3Njb3BlS2V5LCAnOicsIGtleV0uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WzFdID09PSAnPScpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyID0gdGhpcy53YXRjaChrZXksIHRoaXMuSW50ZXJuYWxTcGllcy5TY29wZVtzcHlLZXldID0gY3JlYXRlU3B5KCksIHNlbGYuY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0cm95ZXIyID0gdGhpcy53YXRjaChzY29wZUtleSwgdGhpcy5JbnRlcm5hbFNwaWVzLkNvbnRyb2xsZXJbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLnBhcmVudFNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlckluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJTY29wZS4kd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgbmdDbGljayhleHByZXNzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRGlyZWN0aXZlKCduZy1jbGljaycsIGV4cHJlc3Npb24pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgICAgICBjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgYXJnc1swXSA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb21waWxlLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBjb21waWxlSFRNTChodG1sVGV4dCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgZGlyZWN0aXZlSGFuZGxlcih0aGlzLCBodG1sVGV4dCk7XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2RpcmVjdGl2ZVByb3ZpZGVyJyk7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0JpbmREaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdDbGlja0RpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdJZkRpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdUcmFuc2xhdGVEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qcyc7XHJcbnZhciBkaXJlY3RpdmVQcm92aWRlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBuZXcgTWFwKCksXHJcbiAgICAgICAgdG9SZXR1cm4gPSB7fSxcclxuICAgICAgICAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKSxcclxuICAgICAgICAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSkuZ2V0KCckdHJhbnNsYXRlJyksXHJcbiAgICAgICAgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZyxcclxuICAgICAgICBpbnRlcm5hbHMgPSB7XHJcbiAgICAgICAgICAgIG5nSWY6IG5nSWZEaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgbmdDbGljazogbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0JpbmQ6IG5nQmluZERpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0Rpc2FibGVkOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdSZXBlYXQ6IHtcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAnPGRpdj48L2Rpdj4nLFxyXG4gICAgICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oKSB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuZ01vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICByZWdleDogJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nLFxyXG4gICAgICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oKSB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0cmFuc2xhdGVWYWx1ZToge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmdDbGFzczoge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgdG9SZXR1cm4udG9DYW1lbENhc2UgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUuXHJcbiAgICAgICAgcmVwbGFjZShTUEVDSUFMX0NIQVJTX1JFR0VYUCwgZnVuY3Rpb24oXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGdldCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9SZXR1cm4udG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXMuZ2V0KGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRwdXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnZGlyZWN0aXZlQ29uc3RydWN0b3IgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9SZXR1cm4udG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oYXJndW1lbnRzWzJdKSAmJiBhcmd1bWVudHNbMl0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbJ2RpcmVjdGl2ZScsIGRpcmVjdGl2ZU5hbWUsICdoYXMgYmVlbiBvdmVyd3JpdHRlbiddLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBvdmVyd3JpdGUgJyArIGRpcmVjdGl2ZU5hbWUgKyAnLlxcbkZvcmdldGluZyB0byBjbGVhbiBtdWNoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGNsZWFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5jbGVhcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmNvbnNvbGUubG9nKCdkaXJlY3RpdmVQcm92aWRlciBlbmQnKTtcclxuZXhwb3J0IGRlZmF1bHQgZGlyZWN0aXZlUHJvdmlkZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5iaW5kLmpzJyk7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBtYWtlQXJyYXlcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKHBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFyZ3VtZW50c1sxXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihwYXJhbWV0ZXIuc3BsaXQoJycpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBnZXR0ZXIuYXNzaWduKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSwgcGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4ocGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW1vcnkgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBtYWtlQXJyYXkocGFyYW1ldGVyKS5mb3JFYWNoKChjdXJyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKG1lbW9yeSArPSBjdXJyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgWydEb250IGtub3cgd2hhdCB0byBkbyB3aXRoICcsICdbXCInLCBtYWtlQXJyYXkoYXJndW1lbnRzKS5qb2luKCdcIiwgXCInKSwgJ1wiXSddLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5iaW5kLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5jbGljay5qcycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1jbGljaz1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2sgPSAoc2NvcGUsIGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gbG9jYWxzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbihzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQXBwbHlUb0NoaWxkcmVuOiB0cnVlXHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5jbGljay5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmlmLmpzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0lmRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWlmPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoZXhwcmVzc2lvbiwgY29udHJvbGxlclNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBzdWJzY3JpcHRvcnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzW2lpXS5hcHBseShzdWJzY3JpcHRvcnMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLnZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuaWYuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy50cmFuc2xhdGUuanMnKTtcclxuaW1wb3J0IHtcclxuICAgIGlzRXhwcmVzc2lvblxyXG59IGZyb20gJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oZXhwcmVzc2lvbiwgY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc3QgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgICAgICAkdHJhbnNsYXRlLnVzZShuZXdMYW5ndWFnZSk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzRXhwcmVzc2lvbjogZnVuY3Rpb24obXlUZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc0V4cHJlc3Npb24udGVzdChteVRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdHJhbnNsYXRlLmluc3RhbnQodGV4dCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VMYW5ndWFnZTogZnVuY3Rpb24obmV3TGFuZ3VhZ2UpIHtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zb2xlLmxvZygnbmcudHJhbnNsYXRlLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzXG4gKiovIiwiaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG52YXIgZGlyZWN0aXZlSGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdkaXJlY3RpdmVIYW5kbGVyJyk7XHJcblxyXG4gICAgbGV0IHByb3RvID0gYW5ndWxhci5lbGVtZW50LnByb3RvdHlwZSB8fCBhbmd1bGFyLmVsZW1lbnQuX19wcm90b19fO1xyXG4gICAgcHJvdG8ubmdGaW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWVzID0ge1xyXG4gICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICB2YWx1ZXNbdmFsdWVzLmxlbmd0aCsrXSA9IHRoaXNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KGpvaW4odmFsdWVzKSk7XHJcbiAgICB9O1xyXG4gICAgcHJvdG8uY2xpY2sgPSBmdW5jdGlvbihsb2NhbHMpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLmRhdGEoJ25nLWNsaWNrJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljayAmJiBjbGljayhsb2NhbHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBwcm90by50ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1iaW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljayAmJiBjbGljay5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBmdW5jdGlvbiBnZXRFeHByZXNzaW9uKGN1cnJlbnQpIHtcclxuICAgIC8vICAgICBsZXQgZXhwcmVzc2lvbiA9IGN1cnJlbnRbMF0gJiYgY3VycmVudFswXS5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnbmctY2xpY2snKTtcclxuICAgIC8vICAgICBpZiAoZXhwcmVzc2lvbiAhPT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24gIT09IG51bGwpIHtcclxuICAgIC8vICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udmFsdWU7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICBmdW5jdGlvbiBqb2luKG9iaikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMob2JqZWN0LCBhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSkge1xyXG4gICAgICAgIG9iamVjdCA9IGFuZ3VsYXIuZWxlbWVudChvYmplY3QpO1xyXG4gICAgICAgIG9iamVjdC5kYXRhKGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbnMgPSBvYmplY3QuY2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgY2hpbGRyZW5zLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBhcHBseURpcmVjdGl2ZXNUb05vZGVzKGNoaWxkcmVuc1tpaV0sIGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGlsZShvYmosIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgb2JqID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBvYmpbMF0uYXR0cmlidXRlcy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS5uYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aXZlO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGlsZWREaXJlY3RpdmUgPSBkaXJlY3RpdmUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aXZlLkFwcGx5VG9DaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMob2JqLCBkaXJlY3RpdmVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5kYXRhKGRpcmVjdGl2ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iai5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoY2hpbGRyZW5zW2lpXSwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb250cm9sKGNvbnRyb2xsZXJTZXJ2aWNlLCBvYmopIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCAhY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBpbGUoY3VycmVudCwgY29udHJvbGxlclNlcnZpY2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnZGlyZWN0aXZlSGFuZGxlciBlbmQnKTtcclxuICAgIHJldHVybiBjb250cm9sO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMnKTtcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZCxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgc2FuaXRpemVNb2R1bGVzLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGlzRXhwcmVzc2lvblxyXG5cclxufSBmcm9tICcuL2NvbW1vbi5qcyc7XHJcblxyXG52YXIgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyk7XHJcblxyXG5jbGFzcyBjb250cm9sbGVyIHtcclxuICAgIHN0YXRpYyBwYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgaXNvbGF0ZVNjb3BlLCBjb250cm9sbGVyQXMpIHtcclxuICAgICAgICBjb25zdCBhc3NpZ25CaW5kaW5ncyA9IChkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgbW9kZSkgPT4ge1xyXG4gICAgICAgICAgICBtb2RlID0gbW9kZSB8fCAnPSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhtb2RlKTtcclxuICAgICAgICAgICAgbW9kZSA9IHJlc3VsdFsxXTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXkgPSBjb250cm9sbGVyQXMgKyAnLicgKyBrZXk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gKGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKHNjb3BlW3BhcmVudEtleV0pKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhwID0gaXNFeHByZXNzaW9uLmV4ZWMoc2NvcGVbcGFyZW50S2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShpc0V4cFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSAoc2NvcGVbcGFyZW50S2V5XSB8fCAnJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xyXG4gICAgICAgIGlmICghYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpICYmIGtleSAhPT0gY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYmluZGluZ3MpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgYmluZGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyAnQ291bGQgbm90IHBhcnNlIGJpbmRpbmdzJztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgJGdldChtb2R1bGVOYW1lcykge1xyXG4gICAgICAgIGxldCAkY29udHJvbGxlcjtcclxuICAgICAgICBhbmd1bGFyLmluamVjdG9yKHNhbml0aXplTW9kdWxlcyhtb2R1bGVOYW1lcykpLmludm9rZShcclxuICAgICAgICAgICAgWyckY29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAoY29udHJvbGxlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRjb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIHNjb3BlLCBiaW5kaW5ncywgc2NvcGVDb250cm9sbGVyTmFtZSwgZXh0ZW5kZWRMb2NhbHMpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpO1xyXG4gICAgICAgICAgICBzY29wZUNvbnRyb2xsZXJOYW1lID0gc2NvcGVDb250cm9sbGVyTmFtZSB8fCAnY29udHJvbGxlcic7XHJcbiAgICAgICAgICAgIGxldCBsb2NhbHMgPSBleHRlbmQoZXh0ZW5kZWRMb2NhbHMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICRzY29wZTogc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKS4kbmV3KClcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29uc3RydWN0b3IgPSAkY29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgbG9jYWxzLCB0cnVlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzID0gKGIsIG15TG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbHMgPSBteUxvY2FscyB8fCBsb2NhbHM7XHJcbiAgICAgICAgICAgICAgICBiID0gYiB8fCBiaW5kaW5ncztcclxuXHJcbiAgICAgICAgICAgICAgICBleHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlQ29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlcjtcclxuY29uc29sZS5sb2coJ2NvbnRyb2xsZXJRTS5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=