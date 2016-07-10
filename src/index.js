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
	
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _quickmockMockHelper = __webpack_require__(2);
	
	var _quickmockMockHelper2 = _interopRequireDefault(_quickmockMockHelper);
	
	var _common = __webpack_require__(3);
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	console.log('QM');
	
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
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	console.log('QM.helper');
	
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
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(3);
	
	var _controllerHandlerExtensions = __webpack_require__(5);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$_CONTROLLER = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _directiveProvider = __webpack_require__(6);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	var _directiveHandler = __webpack_require__(11);
	
	var _controllerQM = __webpack_require__(12);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(3);
	
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
	
	console.log('controllerHandler.extension.js end');

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ngBind = __webpack_require__(7);
	
	var _ngClick = __webpack_require__(8);
	
	var _ngIf = __webpack_require__(9);
	
	var _ngTranslate = __webpack_require__(10);
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngBindDirective = ngBindDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 8 */
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
/* 9 */
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
	        compile: function compile(controllerService, expression) {
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
	                    subscriptors.shift()();
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
	            var compiledDirective = $element.data('ng-if');
	            var lastValue = void 0,
	                parent = void 0;
	            compiledDirective(function (newValue) {
	                if (!newValue) {
	                    parent = $element.parent();
	                    lastValue = $element;
	                    $element.remove();
	                } else {
	                    parent.append(lastValue);
	                }
	            });
	        }
	    };
	}
	console.log('ng.if.js end');

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngTranslateDirective = ngTranslateDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _directiveProvider = __webpack_require__(6);
	
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
	                if (angular.isFunction(directive.attachToElement)) {
	                    directive.attachToElement(controllerService, angular.element(obj));
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _common = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	console.log('controllerQM.js');
	
	
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
	                                var isExp = _common.isExpression.exec(exp);
	                                if (isExp) {
	                                    exp = exp.trim();
	                                    exp = exp.subString(2, exp.length - 3);
	                                    toReturn[key] = $parse(exp)(scope);
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
	                            var isExp = _common.isExpression.exec(scope[parentKey]);
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
	
	console.log('controllerQM.js end');

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjg2OGM5ZmVlYjcwZWVmOTBhODUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpY2ttb2NrLmpzIiwid2VicGFjazovLy8uL3NyYy9xdWlja21vY2subW9ja0hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7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QUFETCxjQUFQO0FBR0g7Ozs7OzttQkFFVSxVOztBQUNmLFNBQVEsR0FBUixDQUFZLHFCQUFaLEUiLCJmaWxlIjoiLi9zcmMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDY4NjhjOWZlZWI3MGVlZjkwYTg1XG4gKiovIiwicmVxdWlyZSgnLi9xdWlja21vY2suanMnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbmRleC5sb2FkZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnUU0nKTtcclxuaW1wb3J0IGhlbHBlciBmcm9tICcuL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZFxyXG59IGZyb20gJy4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbnZhciBtb2NrZXIgPSAoZnVuY3Rpb24oYW5ndWxhcikge1xyXG4gICAgdmFyIG9wdHMsIG1vY2tQcmVmaXg7XHJcbiAgICB2YXIgY29udHJvbGxlckRlZmF1bHRzID0gZnVuY3Rpb24oZmxhZykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHBhcmVudFNjb3BlOiB7fSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGlzRGVmYXVsdDogIWZsYWdcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHF1aWNrbW9jay5NT0NLX1BSRUZJWCA9IG1vY2tQcmVmaXggPSAocXVpY2ttb2NrLk1PQ0tfUFJFRklYIHx8ICdfX18nKTtcclxuICAgIHF1aWNrbW9jay5VU0VfQUNUVUFMID0gJ1VTRV9BQ1RVQUxfSU1QTEVNRU5UQVRJT04nO1xyXG4gICAgcXVpY2ttb2NrLk1VVEVfTE9HUyA9IGZhbHNlO1xyXG5cclxuICAgIGZ1bmN0aW9uIHF1aWNrbW9jayhvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0cyA9IGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gbW9ja1Byb3ZpZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbW9ja1Byb3ZpZGVyKCkge1xyXG4gICAgICAgIHZhciBhbGxNb2R1bGVzID0gb3B0cy5tb2NrTW9kdWxlcy5jb25jYXQoWyduZ01vY2snXSksXHJcbiAgICAgICAgICAgIGluamVjdG9yID0gYW5ndWxhci5pbmplY3RvcihhbGxNb2R1bGVzLmNvbmNhdChbb3B0cy5tb2R1bGVOYW1lXSkpLFxyXG4gICAgICAgICAgICBtb2RPYmogPSBhbmd1bGFyLm1vZHVsZShvcHRzLm1vZHVsZU5hbWUpLFxyXG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IG1vZE9iai5faW52b2tlUXVldWUgfHwgW10sXHJcbiAgICAgICAgICAgIHByb3ZpZGVyVHlwZSA9IGdldFByb3ZpZGVyVHlwZShvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpLFxyXG4gICAgICAgICAgICBtb2NrcyA9IHt9LFxyXG4gICAgICAgICAgICBwcm92aWRlciA9IHt9O1xyXG5cclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goYWxsTW9kdWxlcyB8fCBbXSwgZnVuY3Rpb24obW9kTmFtZSkge1xyXG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IGludm9rZVF1ZXVlLmNvbmNhdChhbmd1bGFyLm1vZHVsZShtb2ROYW1lKS5faW52b2tlUXVldWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5pbmplY3QpIHtcclxuICAgICAgICAgICAgaW5qZWN0b3IuaW52b2tlKG9wdHMuaW5qZWN0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGludm9rZVF1ZXVlLCBmaW5kIHRoaXMgcHJvdmlkZXIncyBkZXBlbmRlbmNpZXMgYW5kIHByZWZpeFxyXG4gICAgICAgICAgICAvLyB0aGVtIHNvIEFuZ3VsYXIgd2lsbCBpbmplY3QgdGhlIG1vY2tlZCB2ZXJzaW9uc1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlck5hbWUgPSBwcm92aWRlckRhdGFbMl1bMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyTmFtZSA9PT0gb3B0cy5wcm92aWRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzID0gY3VyclByb3ZpZGVyRGVwcy4kaW5qZWN0IHx8IGluamVjdG9yLmFubm90YXRlKGN1cnJQcm92aWRlckRlcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVwTmFtZSA9IGN1cnJQcm92aWRlckRlcHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2Nrc1tkZXBOYW1lXSA9IGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJUeXBlID09PSAnZGlyZWN0aXZlJykge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBEaXJlY3RpdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldHVwSW5pdGlhbGl6ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBwcmVmaXhlZCBkZXBlbmRlbmNpZXMgdGhhdCBwZXJzaXN0ZWQgZnJvbSBhIHByZXZpb3VzIGNhbGwsXHJcbiAgICAgICAgICAgIC8vIGFuZCBjaGVjayBmb3IgYW55IG5vbi1hbm5vdGF0ZWQgc2VydmljZXNcclxuICAgICAgICAgICAgc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBJbml0aWFsaXplcigpIHtcclxuICAgICAgICAgICAgcHJvdmlkZXIgPSBpbml0UHJvdmlkZXIoKTtcclxuICAgICAgICAgICAgaWYgKG9wdHMuc3B5T25Qcm92aWRlck1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuICAgICAgICAgICAgcHJvdmlkZXIuJGluaXRpYWxpemUgPSBzZXR1cEluaXRpYWxpemVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFByb3ZpZGVyKCkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29udHJvbGxlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBjb250cm9sbGVySGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xlYW4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkTW9kdWxlcyhhbGxNb2R1bGVzLmNvbmNhdChvcHRzLm1vZHVsZU5hbWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmluZFdpdGgob3B0cy5jb250cm9sbGVyLmJpbmRUb0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRTY29wZShvcHRzLmNvbnRyb2xsZXIucGFyZW50U2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRMb2NhbHMobW9ja3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5uZXcob3B0cy5wcm92aWRlck5hbWUsIG9wdHMuY29udHJvbGxlci5jb250cm9sbGVyQXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ja3MuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3Nba2V5XSA9IHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbnRyb2xsZXIuaXNEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbHRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRmaWx0ZXIgPSBpbmplY3Rvci5nZXQoJyRmaWx0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZpbHRlcihvcHRzLnByb3ZpZGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhbmltYXRpb24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRhbmltYXRlOiBpbmplY3Rvci5nZXQoJyRhbmltYXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0QW5pbWF0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5tb2NrLm1vZHVsZSgnbmdBbmltYXRlTW9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChvcHRzLnByb3ZpZGVyTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwRGlyZWN0aXZlKCkge1xyXG4gICAgICAgICAgICB2YXIgJGNvbXBpbGUgPSBpbmplY3Rvci5nZXQoJyRjb21waWxlJyk7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZSA9IGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpLiRuZXcoKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XHJcblxyXG4gICAgICAgICAgICBwcm92aWRlci4kY29tcGlsZSA9IGZ1bmN0aW9uIHF1aWNrbW9ja0NvbXBpbGUoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwgfHwgb3B0cy5odG1sO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gTm8gaHRtbCBzdHJpbmcvb2JqZWN0IHByb3ZpZGVkLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoaHRtbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKTtcclxuICAgICAgICAgICAgICAgICRjb21waWxlKHByb3ZpZGVyLiRlbGVtZW50KShwcm92aWRlci4kc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRpc29TY29wZSA9IHByb3ZpZGVyLiRlbGVtZW50Lmlzb2xhdGVTY29wZSgpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZXBUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKGRlcE5hbWUsIGludm9rZVF1ZXVlKSxcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IGRlcE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICE9PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdID09PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xyXG4gICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBUeXBlID09PSAndmFsdWUnIHx8IGRlcFR5cGUgPT09ICdjb25zdGFudCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmplY3Rvci5oYXMobW9ja1ByZWZpeCArIGRlcE5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xyXG4gICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWluamVjdG9yLmhhcyhtb2NrU2VydmljZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy51c2VBY3R1YWxEZXBlbmRlbmNpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tTZXJ2aWNlTmFtZS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbmplY3QgbW9jayBmb3IgXCInICsgZGVwTmFtZSArICdcIiBiZWNhdXNlIG5vIHN1Y2ggbW9jayBleGlzdHMuIFBsZWFzZSB3cml0ZSBhIG1vY2sgJyArIGRlcFR5cGUgKyAnIGNhbGxlZCBcIicgKyBtb2NrU2VydmljZU5hbWUgKyAnXCIgKG9yIHNldCB0aGUgdXNlQWN0dWFsRGVwZW5kZW5jaWVzIHRvIHRydWUpIGFuZCB0cnkgYWdhaW4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChtb2NrU2VydmljZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhwcm92aWRlckRhdGFbMl1bMF0pICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3ZpZGVyRGF0YVsyXVsxXSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHByb3ZpZGVyIGRlY2xhcmF0aW9uIGZ1bmN0aW9uIGhhcyBiZWVuIHByb3ZpZGVkIHdpdGhvdXQgdGhlIGFycmF5IGFubm90YXRpb24sXHJcbiAgICAgICAgICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGFubm90YXRlIGl0IHNvIHRoZSBpbnZva2VRdWV1ZSBjYW4gYmUgcHJlZml4ZWRcclxuICAgICAgICAgICAgICAgIHZhciBhbm5vdGF0ZWREZXBlbmRlbmNpZXMgPSBpbmplY3Rvci5hbm5vdGF0ZShwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHByb3ZpZGVyRGF0YVsyXVsxXS4kaW5qZWN0O1xyXG4gICAgICAgICAgICAgICAgYW5ub3RhdGVkRGVwZW5kZW5jaWVzLnB1c2gocHJvdmlkZXJEYXRhWzJdWzFdKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyRGF0YVsyXVsxXSA9IGFubm90YXRlZERlcGVuZGVuY2llcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuYW5ndWxhcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluaXRpYWxpemUgYmVjYXVzZSBhbmd1bGFyIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBsb2FkIGFuZ3VsYXIgYmVmb3JlIGxvYWRpbmcgcXVpY2ttb2NrLmpzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMucHJvdmlkZXJOYW1lICYmICFvcHRpb25zLmNvbmZpZ0Jsb2NrcyAmJiAhb3B0aW9ucy5ydW5CbG9ja3MpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIHByb3ZpZGVyTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LCBvciBzZXQgdGhlIGNvbmZpZ0Jsb2NrcyBvciBydW5CbG9ja3MgZmxhZ3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5tb2R1bGVOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBtb2R1bGVOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcHRpb25zLm1vY2tNb2R1bGVzID0gb3B0aW9ucy5tb2NrTW9kdWxlcyB8fCBbXTtcclxuICAgICAgICBvcHRpb25zLm1vY2tzID0gb3B0aW9ucy5tb2NrcyB8fCB7fTtcclxuICAgICAgICBvcHRpb25zLmNvbnRyb2xsZXIgPSBleHRlbmQob3B0aW9ucy5jb250cm9sbGVyLCBjb250cm9sbGVyRGVmYXVsdHMoYW5ndWxhci5pc0RlZmluZWQob3B0aW9ucy5jb250cm9sbGVyKSkpO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb3ZpZGVyLCBmdW5jdGlvbihwcm9wZXJ0eSwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Lmphc21pbmUgJiYgd2luZG93LnNweU9uICYmICFwcm9wZXJ0eS5jYWxscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHkgPSBzcHlPbihwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3B5LmFuZENhbGxUaHJvdWdoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmRDYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5zaW5vbiAmJiB3aW5kb3cuc2lub24uc3B5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNpbm9uLnNweShwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFByb3ZpZGVyVHlwZShwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnZva2VRdWV1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcHJvdmlkZXJJbmZvID0gaW52b2tlUXVldWVbaV07XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlckluZm9bMl1bMF0gPT09IHByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlckluZm9bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckcHJvdmlkZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm92aWRlckluZm9bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbnRyb2xsZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29udHJvbGxlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbXBpbGVQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckZmlsdGVyUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2ZpbHRlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGFuaW1hdGVQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnYW5pbWF0aW9uJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB1bnByZWZpeCkge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlckRhdGFbMl1bMF0gPT09IHByb3ZpZGVyTmFtZSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrUHJlZml4ICsgY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCkge1xyXG4gICAgICAgIGlmICghaHRtbC4kdGFnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIEh0bWwgb2JqZWN0IGRvZXMgbm90IGNvbnRhaW4gJHRhZyBwcm9wZXJ0eS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGh0bWxBdHRycyA9IGh0bWwsXHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSBodG1sQXR0cnMuJHRhZyxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQgPSBodG1sQXR0cnMuJGNvbnRlbnQ7XHJcbiAgICAgICAgaHRtbCA9ICc8JyArIHRhZ05hbWUgKyAnICc7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGh0bWxBdHRycywgZnVuY3Rpb24odmFsLCBhdHRyKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRyICE9PSAnJGNvbnRlbnQnICYmIGF0dHIgIT09ICckdGFnJykge1xyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBzbmFrZV9jYXNlKGF0dHIpICsgKHZhbCA/ICgnPVwiJyArIHZhbCArICdcIiAnKSA6ICcgJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBodG1sICs9IGh0bWxDb250ZW50ID8gKCc+JyArIGh0bWxDb250ZW50KSA6ICc+JztcclxuICAgICAgICBodG1sICs9ICc8LycgKyB0YWdOYW1lICsgJz4nO1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHF1aWNrbW9ja0xvZyhtc2cpIHtcclxuICAgICAgICBpZiAoIXF1aWNrbW9jay5NVVRFX0xPR1MpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIFNOQUtFX0NBU0VfUkVHRVhQID0gL1tBLVpdL2c7XHJcblxyXG4gICAgZnVuY3Rpb24gc25ha2VfY2FzZShuYW1lLCBzZXBhcmF0b3IpIHtcclxuICAgICAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgJy0nO1xyXG4gICAgICAgIHJldHVybiBuYW1lLnJlcGxhY2UoU05BS0VfQ0FTRV9SRUdFWFAsIGZ1bmN0aW9uKGxldHRlciwgcG9zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocG9zID8gc2VwYXJhdG9yIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHF1aWNrbW9jaztcclxuXHJcbn0pKGFuZ3VsYXIpO1xyXG5oZWxwZXIobW9ja2VyKTtcclxuZXhwb3J0IGRlZmF1bHQgbW9ja2VyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1aWNrbW9jay5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdRTS5oZWxwZXInKTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRIZWxwZXIobW9ja2VyKSB7XHJcbiAgICAoZnVuY3Rpb24ocXVpY2ttb2NrKSB7XHJcbiAgICAgICAgdmFyIGhhc0JlZW5Nb2NrZWQgPSB7fSxcclxuICAgICAgICAgICAgb3JpZ01vZHVsZUZ1bmMgPSBhbmd1bGFyLm1vZHVsZTtcclxuICAgICAgICBxdWlja21vY2sub3JpZ2luYWxNb2R1bGVzID0gYW5ndWxhci5tb2R1bGU7XHJcbiAgICAgICAgYW5ndWxhci5tb2R1bGUgPSBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGU7XHJcblxyXG4gICAgICAgIHF1aWNrbW9jay5tb2NrSGVscGVyID0ge1xyXG4gICAgICAgICAgICBoYXNCZWVuTW9ja2VkOiBoYXNCZWVuTW9ja2VkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaikge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kcyA9IGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbW9kT2JqW21ldGhvZE5hbWVdID0gbWV0aG9kO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1vZE9iajtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZShuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pIHtcclxuICAgICAgICAgICAgdmFyIG1vZE9iaiA9IG9yaWdNb2R1bGVGdW5jKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbik7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKSB7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgcHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNCZWVuTW9ja2VkW3Byb3ZpZGVyTmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld01vZE9iaiA9IG1vZE9ialtwcm92aWRlclR5cGVdKHF1aWNrbW9jay5NT0NLX1BSRUZJWCArIHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChuZXdNb2RPYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2U6IGZ1bmN0aW9uIG1vY2tTZXJ2aWNlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdzZXJ2aWNlJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb2NrRmFjdG9yeTogZnVuY3Rpb24gbW9ja0ZhY3RvcnkocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZhY3RvcnknLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrRmlsdGVyOiBmdW5jdGlvbiBtb2NrRmlsdGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmaWx0ZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQ29udHJvbGxlcjogZnVuY3Rpb24gbW9ja0NvbnRyb2xsZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnRyb2xsZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrUHJvdmlkZXI6IGZ1bmN0aW9uIG1vY2tQcm92aWRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAncHJvdmlkZXInLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrVmFsdWU6IGZ1bmN0aW9uIG1vY2tWYWx1ZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAndmFsdWUnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQ29uc3RhbnQ6IGZ1bmN0aW9uIG1vY2tDb25zdGFudChwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29uc3RhbnQnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBtb2NrQW5pbWF0aW9uOiBmdW5jdGlvbiBtb2NrQW5pbWF0aW9uKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdhbmltYXRpb24nLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KShtb2NrZXIpO1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGxvYWRIZWxwZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLm1vY2tIZWxwZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29tbW9uLmpzJyk7XHJcbmV4cG9ydCB2YXIgUEFSU0VfQklORElOR19SRUdFWCA9IC9eKFtcXD1cXEBcXCZdKSguKik/JC87XHJcbmV4cG9ydCB2YXIgaXNFeHByZXNzaW9uID0gL157ey4qfX0kLztcclxuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZShpdGVtKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpdGVtKSB8fFxyXG4gICAgICAgICghIWl0ZW0gJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIgJiZcclxuICAgICAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eShcImxlbmd0aFwiKSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbS5sZW5ndGggPT09IFwibnVtYmVyXCIgJiZcclxuICAgICAgICAgICAgaXRlbS5sZW5ndGggPj0gMFxyXG4gICAgICAgICkgfHxcclxuICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Tm90RGVmaW5lZChvYmosIGFyZ3MpIHtcclxuXHJcbiAgICBsZXQga2V5O1xyXG4gICAgd2hpbGUgKGtleSA9IGFyZ3Muc2hpZnQoKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnIHx8IG9ialtrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0XyRfQ09OVFJPTExFUihvYmopIHtcclxuICAgIGFzc2VydE5vdERlZmluZWQob2JqLCBbXHJcbiAgICAgICAgJ3BhcmVudFNjb3BlJyxcclxuICAgICAgICAnYmluZGluZ3MnLFxyXG4gICAgICAgICdjb250cm9sbGVyU2NvcGUnXHJcbiAgICBdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKG9iamVjdCkge1xyXG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KG9iamVjdCwgW2luZGV4LCAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhbihvYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcclxuICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGVuZFRpbWU7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IHNweU9uKHtcclxuICAgICAgICBhOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJ2EnKS5hbmQuY2FsbFRocm91Z2goKTtcclxuICAgIHRvUmV0dXJuLnRvb2sgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFycmF5KGl0ZW0pIHtcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtpdGVtXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCgpIHtcclxuICAgIGxldCByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlbW92ZSQgfHwgIWtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHZhbHVlcy5zaGlmdCgpIHx8IHt9O1xyXG4gICAgbGV0IGN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XHJcbiAgICAgICAgJCRleHRlbmQoZGVzdGluYXRpb24sIGN1cnJlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG59XHJcbmNvbnN0IHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcclxuXHJcbmZ1bmN0aW9uIGdldFJvb3RGcm9tU2NvcGUoc2NvcGUpIHtcclxuICAgIGlmIChzY29wZS4kcm9vdCkge1xyXG4gICAgICAgIHJldHVybiBzY29wZS4kcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFyZW50O1xyXG4gICAgd2hpbGUgKHBhcmVudCA9IHNjb3BlLiRwYXJlbnQpIHtcclxuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuJHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIHNjb3BlSGVscGVyIHtcclxuICAgIHN0YXRpYyBjcmVhdGUoc2NvcGUpIHtcclxuICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2NvcGUoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleS5zdGFydHNXaXRoKCckJykpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChzY29wZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZChyb290U2NvcGUuJG5ldyh0cnVlKSwgc2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNBcnJheUxpa2Uoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZC5hcHBseSh1bmRlZmluZWQsIFtyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzU2NvcGUob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCAmJiBnZXRSb290RnJvbVNjb3BlKG9iamVjdCkgPT09IGdldFJvb3RGcm9tU2NvcGUocm9vdFNjb3BlKSAmJiBvYmplY3Q7XHJcbiAgICB9XHJcbn1cclxuc2NvcGVIZWxwZXIuJHJvb3RTY29wZSA9IHJvb3RTY29wZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUobXlGdW5jdGlvbikge1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSAvXmZ1bmN0aW9uXFxzKyhbXFx3XFwkXSspXFxzKlxcKC8uZXhlYyhteUZ1bmN0aW9uLnRvU3RyaW5nKCkpWzFdO1xyXG4gICAgaWYgKHRvUmV0dXJuID09PSAnJyB8fCB0b1JldHVybiA9PT0gJ2Fub24nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZU1vZHVsZXMoKSB7XHJcblxyXG4gICAgY29uc3QgbW9kdWxlcyA9IG1ha2VBcnJheS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICBsZXQgaW5kZXg7XHJcbiAgICBpZiAoXHJcbiAgICAgICAgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiZcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ2FuZ3VsYXInKSkgPT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZycpO1xyXG4gICAgfVxyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIG1vZHVsZXMudW5zaGlmdChtb2R1bGVzLnNwbGljZShpbmRleCwgMSlbMF0gJiYgJ25nJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbW9kdWxlcztcclxufVxyXG5jb25zb2xlLmxvZygnY29tbW9uLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiovIiwiaW1wb3J0IHtcclxuICAgIG1ha2VBcnJheSxcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2NvcGVIZWxwZXJcclxufSBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IHtcclxuICAgICRfQ09OVFJPTExFUlxyXG59IGZyb20gJy4vY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG52YXIgY29udHJvbGxlckhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuanMnKTtcclxuICAgIHZhciBpbnRlcm5hbCA9IGZhbHNlO1xyXG4gICAgbGV0IG15TW9kdWxlcywgY3RybE5hbWUsIGNMb2NhbHMsIHBTY29wZSwgY1Njb3BlLCBjTmFtZSwgYmluZFRvQ29udHJvbGxlcjtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYW4oKSB7XHJcbiAgICAgICAgbXlNb2R1bGVzID0gW107XHJcbiAgICAgICAgY3RybE5hbWUgPSBwU2NvcGUgPSBjTG9jYWxzID0gY1Njb3BlID0gYmluZFRvQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uICRjb250cm9sbGVySGFuZGxlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKCFjdHJsTmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUGxlYXNlIHByb3ZpZGUgdGhlIGNvbnRyb2xsZXJcXCdzIG5hbWUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocFNjb3BlIHx8IHt9KTtcclxuICAgICAgICBpZiAoIWNTY29wZSkge1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBwU2NvcGUuJG5ldygpO1xyXG4gICAgICAgIH0ge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKGNTY29wZSk7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wU2NvcGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjU2NvcGUgPSB0ZW1wU2NvcGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gbmV3ICRfQ09OVFJPTExFUihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kVG9Db250cm9sbGVyLCBteU1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKTtcclxuICAgICAgICBjbGVhbigpO1xyXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgIH1cclxuICAgICRjb250cm9sbGVySGFuZGxlci5iaW5kV2l0aCA9IGZ1bmN0aW9uKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmNvbnRyb2xsZXJUeXBlID0gJF9DT05UUk9MTEVSO1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuID0gY2xlYW47XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUgPSBmdW5jdGlvbihuZXdTY29wZSkge1xyXG4gICAgICAgIHBTY29wZSA9IG5ld1Njb3BlO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLnNldExvY2FscyA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGNMb2NhbHMgPSBsb2NhbHM7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLiRyb290U2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlO1xyXG5cclxuICAgICRjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzID0gZnVuY3Rpb24obW9kdWxlcykge1xyXG4gICAgICAgIGZ1bmN0aW9uIHB1c2hBcnJheShhcnJheSkge1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShteU1vZHVsZXMsIGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkobWFrZUFycmF5KGFyZ3VtZW50cykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KFttb2R1bGVzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKG1vZHVsZXMpKSB7XHJcbiAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkobW9kdWxlcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5pc0ludGVybmFsID0gZnVuY3Rpb24oZmxhZykge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZsYWcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW50ZXJuYWwgPSAhIWZsYWc7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnRlcm5hbCA9ICFmbGFnO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBzY29wZUNvbnRyb2xsZXJzTmFtZSwgcGFyZW50U2NvcGUsIGNoaWxkU2NvcGUpIHtcclxuICAgICAgICBjdHJsTmFtZSA9IGNvbnRyb2xsZXJOYW1lO1xyXG4gICAgICAgIGlmIChzY29wZUNvbnRyb2xsZXJzTmFtZSAmJiAhYW5ndWxhci5pc1N0cmluZyhzY29wZUNvbnRyb2xsZXJzTmFtZSkpIHtcclxuICAgICAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShzY29wZUNvbnRyb2xsZXJzTmFtZSk7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUocGFyZW50U2NvcGUpIHx8IGNTY29wZTtcclxuICAgICAgICAgICAgY05hbWUgPSAnY29udHJvbGxlcic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHBhcmVudFNjb3BlIHx8IHBTY29wZSk7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShjaGlsZFNjb3BlIHx8IHBTY29wZS4kbmV3KCkpO1xyXG4gICAgICAgICAgICBjTmFtZSA9IHNjb3BlQ29udHJvbGxlcnNOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyKCk7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ld1NlcnZpY2UgPSBmdW5jdGlvbihjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSwgYmluZGluZ3MpIHtcclxuICAgICAgICBjb25zdCB0b1JldHVybiA9ICRjb250cm9sbGVySGFuZGxlci5uZXcoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUpO1xyXG4gICAgICAgIHRvUmV0dXJuLmJpbmRpbmdzID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5qcyBlbmQnKTtcclxuICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXJIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbi5qcycpO1xyXG5cclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBkaXJlY3RpdmVIYW5kbGVyXHJcbn0gZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5pbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZCxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBjcmVhdGVTcHksXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGFzc2VydF8kX0NPTlRST0xMRVIsXHJcbiAgICBjbGVhblxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzICRfQ09OVFJPTExFUiB7XHJcbiAgICBzdGF0aWMgaXNDb250cm9sbGVyKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiAkX0NPTlRST0xMRVI7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kaW5ncywgbW9kdWxlcywgY05hbWUsIGNMb2NhbHMpIHtcclxuICAgICAgICB0aGlzLnByb3ZpZGVyTmFtZSA9IGN0cmxOYW1lO1xyXG4gICAgICAgIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSA9IGNOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICB0aGlzLnVzZWRNb2R1bGVzID0gbW9kdWxlcy5zbGljZSgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUgPSBwU2NvcGU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyU2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XHJcbiAgICAgICAgdGhpcy5sb2NhbHMgPSBleHRlbmQoY0xvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiB0aGlzLmNvbnRyb2xsZXJTY29wZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuSW50ZXJuYWxTcGllcyA9IHtcclxuICAgICAgICAgICAgU2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBDb250cm9sbGVyOiB7fVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAkYXBwbHkoKSB7XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgfVxyXG4gICAgJGRlc3Ryb3koKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRkZXN0cm95KCk7XHJcbiAgICAgICAgY2xlYW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoYmluZGluZ3MpIHtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0gYW5ndWxhci5pc0RlZmluZWQoYmluZGluZ3MpICYmIGJpbmRpbmdzICE9PSBudWxsID8gYmluZGluZ3MgOiB0aGlzLmJpbmRpbmdzO1xyXG4gICAgICAgIGFzc2VydF8kX0NPTlRST0xMRVIodGhpcyk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuJGdldCh0aGlzLnVzZWRNb2R1bGVzKVxyXG4gICAgICAgICAgICAuY3JlYXRlKHRoaXMucHJvdmlkZXJOYW1lLCB0aGlzLnBhcmVudFNjb3BlLCB0aGlzLmJpbmRpbmdzLCB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUsIHRoaXMubG9jYWxzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSA9IHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yKCk7XHJcblxyXG4gICAgICAgIGxldCB3YXRjaGVyLCBzZWxmID0gdGhpcztcclxuICAgICAgICB3aGlsZSAod2F0Y2hlciA9IHRoaXMucGVuZGluZ1dhdGNoZXJzLnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hcHBseSh0aGlzLCB3YXRjaGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyh0aGlzLmJpbmRpbmdzW2tleV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlS2V5ID0gcmVzdWx0WzJdIHx8IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBzcHlLZXkgPSBbc2NvcGVLZXksICc6Jywga2V5XS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMV0gPT09ICc9Jykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0cm95ZXIgPSB0aGlzLndhdGNoKGtleSwgdGhpcy5JbnRlcm5hbFNwaWVzLlNjb3BlW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5jb250cm9sbGVySW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llcjIgPSB0aGlzLndhdGNoKHNjb3BlS2V5LCB0aGlzLkludGVybmFsU3BpZXMuQ29udHJvbGxlcltzcHlLZXldID0gY3JlYXRlU3B5KCksIHNlbGYucGFyZW50U2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcjIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICB3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250cm9sbGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlclNjb3BlLiR3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBuZ0NsaWNrKGV4cHJlc3Npb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVEaXJlY3RpdmUoJ25nLWNsaWNrJywgZXhwcmVzc2lvbik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXJncyA9IG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoYXJndW1lbnRzWzBdKTtcclxuICAgICAgICBhcmdzWzBdID0gdGhpcztcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlLmNvbXBpbGUuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGNvbXBpbGVIVE1MKGh0bWxUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkaXJlY3RpdmVIYW5kbGVyKHRoaXMsIGh0bWxUZXh0KTtcclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9uLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnZGlyZWN0aXZlUHJvdmlkZXInKTtcclxuaW1wb3J0IHtcclxuICAgIG5nQmluZERpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0NsaWNrRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0lmRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBuZ1RyYW5zbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzJztcclxudmFyIGRpcmVjdGl2ZVByb3ZpZGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGlyZWN0aXZlcyA9IG5ldyBNYXAoKSxcclxuICAgICAgICB0b1JldHVybiA9IHt9LFxyXG4gICAgICAgICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpLFxyXG4gICAgICAgICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKS5nZXQoJyR0cmFuc2xhdGUnKSxcclxuICAgICAgICBTUEVDSUFMX0NIQVJTX1JFR0VYUCA9IC8oW1xcOlxcLVxcX10rKC4pKS9nLFxyXG4gICAgICAgIGludGVybmFscyA9IHtcclxuICAgICAgICAgICAgbmdJZjogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICBuZ0NsaWNrOiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nQmluZDogbmdCaW5kRGlyZWN0aXZlKCRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nRGlzYWJsZWQ6IG5nSWZEaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlOiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlLCAkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ1JlcGVhdDoge1xyXG4gICAgICAgICAgICAgICAgcmVnZXg6ICc8ZGl2PjwvZGl2PicsXHJcbiAgICAgICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbigpIHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5nTW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicsXHJcbiAgICAgICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbigpIHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVZhbHVlOiB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuZ0NsYXNzOiB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB0b1JldHVybi50b0NhbWVsQ2FzZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbmFtZS5cclxuICAgICAgICByZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbihfLCBzZXBhcmF0b3IsIGxldHRlciwgb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvZmZzZXQgPyBsZXR0ZXIudG9VcHBlckNhc2UoKSA6IGxldHRlcjtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kZ2V0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSkge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b1JldHVybi50b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICAgICAgaWYgKGludGVybmFsc1tkaXJlY3RpdmVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsc1tkaXJlY3RpdmVOYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5nZXQoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJHB1dCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlQ29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdkaXJlY3RpdmVDb25zdHJ1Y3RvciBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSB0b1JldHVybi50b0NhbWVsQ2FzZShkaXJlY3RpdmVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGl2ZXMuaGFzKGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihhcmd1bWVudHNbMl0pICYmIGFyZ3VtZW50c1syXSgpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFsnZGlyZWN0aXZlJywgZGlyZWN0aXZlTmFtZSwgJ2hhcyBiZWVuIG92ZXJ3cml0dGVuJ10uam9pbignICcpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IG92ZXJ3cml0ZSAnICsgZGlyZWN0aXZlTmFtZSArICcuXFxuRm9yZ2V0aW5nIHRvIGNsZWFuIG11Y2gnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kY2xlYW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBkaXJlY3RpdmVzLmNsZWFyKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufSkoKTtcclxuY29uc29sZS5sb2coJ2RpcmVjdGl2ZVByb3ZpZGVyIGVuZCcpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVQcm92aWRlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmJpbmQuanMnKTtcclxuXHJcbmltcG9ydCB7XHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIG1ha2VBcnJheVxyXG59IGZyb20gJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0JpbmREaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24ocGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1N0cmluZyhwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgYXJndW1lbnRzWzFdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKHBhcmFtZXRlci5zcGxpdCgnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdldHRlci5hc3NpZ24oY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLCBwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbihwYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShwYXJhbWV0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lbW9yeSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ha2VBcnJheShwYXJhbWV0ZXIpLmZvckVhY2goKGN1cnJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4obWVtb3J5ICs9IGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBbJ0RvbnQga25vdyB3aGF0IHRvIGRvIHdpdGggJywgJ1tcIicsIG1ha2VBcnJheShhcmd1bWVudHMpLmpvaW4oJ1wiLCBcIicpLCAnXCJdJ10uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmJpbmQuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmNsaWNrLmpzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWNsaWNrPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjbGljayA9IChzY29wZSwgbG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IHNjb3BlIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBsb2NhbHMgfHwge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBleHByZXNzaW9uKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2s7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBBcHBseVRvQ2hpbGRyZW46IHRydWVcclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmNsaWNrLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuaWYuanMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIG5nSWZEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctaWY9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRvcnMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IHN1YnNjcmlwdG9ycy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnNbaWldLmFwcGx5KHN1YnNjcmlwdG9ycywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLnBhcmVudFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc2hpZnQoKSgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiAoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gJGVsZW1lbnQuZGF0YSgnbmctaWYnKTtcclxuICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSwgcGFyZW50O1xyXG4gICAgICAgICAgICBjb21waWxlZERpcmVjdGl2ZSgobmV3VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZChsYXN0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5pZi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLnRyYW5zbGF0ZS5qcycpO1xyXG5pbXBvcnQge1xyXG4gICAgaXNFeHByZXNzaW9uXHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiBmdW5jdGlvbihleHByZXNzaW9uLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24obmV3TGFuZ3VhZ2UpIHtcclxuICAgICAgICAgICAgICAgICR0cmFuc2xhdGUudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNFeHByZXNzaW9uOiBmdW5jdGlvbihteVRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzRXhwcmVzc2lvbi50ZXN0KG15VGV4dCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0cmFuc2xhdGUuaW5zdGFudCh0ZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZUxhbmd1YWdlOiBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlLnVzZShuZXdMYW5ndWFnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnNvbGUubG9nKCduZy50cmFuc2xhdGUuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbnZhciBkaXJlY3RpdmVIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2RpcmVjdGl2ZUhhbmRsZXInKTtcclxuXHJcbiAgICBsZXQgcHJvdG8gPSBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlIHx8IGFuZ3VsYXIuZWxlbWVudC5fX3Byb3RvX187XHJcbiAgICBwcm90by5uZ0ZpbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB7XHJcbiAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlc1t2YWx1ZXMubGVuZ3RoKytdID0gdGhpc1tpbmRleF0ucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgfHwgJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoam9pbih2YWx1ZXMpKTtcclxuICAgIH07XHJcbiAgICBwcm90by5jbGljayA9IGZ1bmN0aW9uKGxvY2Fscykge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctY2xpY2snKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHByb3RvLnRleHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLmRhdGEoJ25nLWJpbmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGpvaW4ob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhvYmplY3QsIGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKSB7XHJcbiAgICAgICAgb2JqZWN0ID0gYW5ndWxhci5lbGVtZW50KG9iamVjdCk7XHJcbiAgICAgICAgb2JqZWN0LmRhdGEoYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iamVjdC5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMoY2hpbGRyZW5zW2lpXSwgYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21waWxlKG9iaiwgY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICBvYmogPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IG9ialswXS5hdHRyaWJ1dGVzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0udmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3RpdmU7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGRpcmVjdGl2ZU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21waWxlZERpcmVjdGl2ZSA9IGRpcmVjdGl2ZS5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3RpdmUuQXBwbHlUb0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhvYmosIGRpcmVjdGl2ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGEoZGlyZWN0aXZlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5hdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGFuZ3VsYXIuZWxlbWVudChvYmopKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29tcGlsZShjaGlsZHJlbnNbaWldLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRyb2woY29udHJvbGxlclNlcnZpY2UsIG9iaikge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8ICFjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGlsZShjdXJyZW50LCBjb250cm9sbGVyU2VydmljZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdkaXJlY3RpdmVIYW5kbGVyIGVuZCcpO1xyXG4gICAgcmV0dXJuIGNvbnRyb2w7XHJcbn0pKCk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZUhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbnRyb2xsZXJRTS5qcycpO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgaXNFeHByZXNzaW9uXHJcblxyXG59IGZyb20gJy4vY29tbW9uLmpzJztcclxuXHJcbmNvbnN0ICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICAgICAgYmluZGluZ3MgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJz0nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMoYmluZGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSAkcGFyc2UocGFyZW50R2V0KHNjb3BlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAobG9jYWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhwID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNFeHAgPSBpc0V4cHJlc3Npb24uZXhlYyhleHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cCA9IGV4cC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgPSBleHAuc3ViU3RyaW5nKDIsIGV4cC5sZW5ndGggLSAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAkcGFyc2UoZXhwKShzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgY29uc3QgYXNzaWduQmluZGluZ3MgPSAoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIG1vZGUpID0+IHtcclxuICAgICAgICAgICAgbW9kZSA9IG1vZGUgfHwgJz0nO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMobW9kZSk7XHJcbiAgICAgICAgICAgIG1vZGUgPSByZXN1bHRbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkS2V5ID0gY29udHJvbGxlckFzICsgJy4nICsga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudFZhbHVlV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gY2hpbGRHZXQoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50R2V0LmFzc2lnbihzY29wZSwgcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnJic6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNFeHAgPSBpc0V4cHJlc3Npb24uZXhlYyhzY29wZVtwYXJlbnRLZXldKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUsIGlzb2xhdGVTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgbGFzdFZhbHVlID0gcGFyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xyXG4gICAgICAgIGlmICghYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpICYmIGtleSAhPT0gY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3QoYmluZGluZ3MpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgYmluZGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyAnQ291bGQgbm90IHBhcnNlIGJpbmRpbmdzJztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgJGdldChtb2R1bGVOYW1lcykge1xyXG4gICAgICAgIGxldCAkY29udHJvbGxlcjtcclxuICAgICAgICBjb25zdCBhcnJheSA9IG1ha2VBcnJheShtb2R1bGVOYW1lcyk7XHJcbiAgICAgICAgLy8gY29uc3QgaW5kZXhNb2NrID0gYXJyYXkuaW5kZXhPZignbmdNb2NrJyk7XHJcbiAgICAgICAgLy8gY29uc3QgaW5kZXhOZyA9IGFycmF5LmluZGV4T2YoJ25nJyk7XHJcbiAgICAgICAgLy8gaWYgKGluZGV4TW9jayAhPT0gLTEpIHtcclxuICAgICAgICAvLyAgICAgYXJyYXlbaW5kZXhNb2NrXSA9ICduZyc7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGlmIChpbmRleE5nID09PSAtMSkge1xyXG4gICAgICAgIC8vICAgICBhcnJheS5wdXNoKCduZycpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBhbmd1bGFyLmluamVjdG9yKGFycmF5KS5pbnZva2UoXHJcbiAgICAgICAgICAgIFsnJGNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgKGNvbnRyb2xsZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBzY29wZSwgYmluZGluZ3MsIHNjb3BlQ29udHJvbGxlck5hbWUsIGV4dGVuZGVkTG9jYWxzKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKTtcclxuICAgICAgICAgICAgc2NvcGVDb250cm9sbGVyTmFtZSA9IHNjb3BlQ29udHJvbGxlck5hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgICAgICBsZXQgbG9jYWxzID0gZXh0ZW5kKGV4dGVuZGVkTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkuJG5ldygpXHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gJGNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIGxvY2FscywgdHJ1ZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBleHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGNvbnRyb2xsZXIuZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBjb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncyA9IChiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBiaW5kaW5ncyA9IGIgfHwgYmluZGluZ3M7XHJcbiAgICAgICAgICAgICAgICAvLyBsb2NhbHMgPSBteUxvY2FscyB8fCBsb2NhbHM7XHJcbiAgICAgICAgICAgICAgICAvLyBiID0gYiB8fCBiaW5kaW5ncztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vZXh0ZW5kKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBleHRlbmRlZExvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXI7XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb250cm9sbGVyUU0uanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9