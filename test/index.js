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
	
	var _completeList = __webpack_require__(13);
	
	var _completeList2 = _interopRequireDefault(_completeList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(14);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(24);
	
	(0, _completeList2.default)();

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

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Config;
	function Config() {
	    angular.module('test', ['ng', 'pascalprecht.translate']).controller('emptyController', [function () {
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
	    }]).mockService('$q', [function () {
	        return jasmine.createSpy('___$q');
	    }]).mockService('$timeout', ['$timeout', function () {
	        return jasmine.createSpy('___$timeout');
	    }]);
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandlerExtensions = __webpack_require__(5);
	
	var _common = __webpack_require__(3);
	
	var _controllerHandler = __webpack_require__(4);
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerQM = __webpack_require__(12);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(3);
	
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _directiveProvider = __webpack_require__(6);
	
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveHandler = __webpack_require__(11);
	
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
	    describe('ngIf', function () {
	        it('should allow to call ngIf', function () {
	            var handler = new _directiveHandler2.default(controllerService, '<div><div ng-if="ctrl.aBoolean"/></div>');
	            expect(handler.ngIf()).toBe(true);
	        });
	    });
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(6);
	
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(6);
	
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(6);
	
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controllerHandler = __webpack_require__(4);
	
	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);
	
	var _directiveProvider = __webpack_require__(6);
	
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

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _quickmock = __webpack_require__(1);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjg2OGM5ZmVlYjcwZWVmOTBhODU/ZjQwNSIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpY2ttb2NrLmpzP2IxZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzPzEzZDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzPzE2YTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzPzAzYjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanM/Y2IxYiIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcz82MjNjIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanM/NDBlNiIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcz80YzE2Iiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzP2Y1OWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzP2Y3ZGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcz9kOTViIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcz9jYmEyIiwid2VicGFjazovLy8uL2FwcC9jb21wbGV0ZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nSWYuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUMxQkE7Ozs7OztBQVpBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjs7QUFFQSwrQjs7Ozs7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LFVBREQ7QUFFTCxtQkFBTTtBQUZELFVBSGI7QUFPQSxpQkFBUSxNQUFSO0FBQ0EsZ0JBQU8sR0FBUCxFQUFZLG9CQUFaLENBQWlDLFVBQWpDLEVBQTZDLFVBQTdDO0FBQ0gsTUFYRDtBQWFILEVBaENELEUiLCJmaWxlIjoiLi90ZXN0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA2ODY4YzlmZWViNzBlZWY5MGE4NVxuICoqLyIsInJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tb24uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9uZ0JpbmQuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vcXVpY2ttb2NrLnNwZWMuanMnKTtcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuLy4uL2FwcC9jb21wbGV0ZUxpc3QuanMnO1xyXG5jb25maWcoKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvaW5kZXgubG9hZGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ1FNJyk7XHJcbmltcG9ydCBoZWxwZXIgZnJvbSAnLi9xdWlja21vY2subW9ja0hlbHBlci5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmRcclxufSBmcm9tICcuL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG52YXIgbW9ja2VyID0gKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcclxuICAgIHZhciBvcHRzLCBtb2NrUHJlZml4O1xyXG4gICAgdmFyIGNvbnRyb2xsZXJEZWZhdWx0cyA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBwYXJlbnRTY29wZToge30sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBpc0RlZmF1bHQ6ICFmbGFnXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBxdWlja21vY2suTU9DS19QUkVGSVggPSBtb2NrUHJlZml4ID0gKHF1aWNrbW9jay5NT0NLX1BSRUZJWCB8fCAnX19fJyk7XHJcbiAgICBxdWlja21vY2suVVNFX0FDVFVBTCA9ICdVU0VfQUNUVUFMX0lNUExFTUVOVEFUSU9OJztcclxuICAgIHF1aWNrbW9jay5NVVRFX0xPR1MgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiBxdWlja21vY2sob3B0aW9ucykge1xyXG4gICAgICAgIG9wdHMgPSBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIG1vY2tQcm92aWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1vY2tQcm92aWRlcigpIHtcclxuICAgICAgICB2YXIgYWxsTW9kdWxlcyA9IG9wdHMubW9ja01vZHVsZXMuY29uY2F0KFsnbmdNb2NrJ10pLFxyXG4gICAgICAgICAgICBpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IoYWxsTW9kdWxlcy5jb25jYXQoW29wdHMubW9kdWxlTmFtZV0pKSxcclxuICAgICAgICAgICAgbW9kT2JqID0gYW5ndWxhci5tb2R1bGUob3B0cy5tb2R1bGVOYW1lKSxcclxuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBtb2RPYmouX2ludm9rZVF1ZXVlIHx8IFtdLFxyXG4gICAgICAgICAgICBwcm92aWRlclR5cGUgPSBnZXRQcm92aWRlclR5cGUob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSxcclxuICAgICAgICAgICAgbW9ja3MgPSB7fSxcclxuICAgICAgICAgICAgcHJvdmlkZXIgPSB7fTtcclxuXHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFsbE1vZHVsZXMgfHwgW10sIGZ1bmN0aW9uKG1vZE5hbWUpIHtcclxuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBpbnZva2VRdWV1ZS5jb25jYXQoYW5ndWxhci5tb2R1bGUobW9kTmFtZSkuX2ludm9rZVF1ZXVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuaW5qZWN0KSB7XHJcbiAgICAgICAgICAgIGluamVjdG9yLmludm9rZShvcHRzLmluamVjdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBpbnZva2VRdWV1ZSwgZmluZCB0aGlzIHByb3ZpZGVyJ3MgZGVwZW5kZW5jaWVzIGFuZCBwcmVmaXhcclxuICAgICAgICAgICAgLy8gdGhlbSBzbyBBbmd1bGFyIHdpbGwgaW5qZWN0IHRoZSBtb2NrZWQgdmVyc2lvbnNcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJOYW1lID0gcHJvdmlkZXJEYXRhWzJdWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlck5hbWUgPT09IG9wdHMucHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwcyA9IGN1cnJQcm92aWRlckRlcHMuJGluamVjdCB8fCBpbmplY3Rvci5hbm5vdGF0ZShjdXJyUHJvdmlkZXJEZXBzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcE5hbWUgPSBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3NbZGVwTmFtZV0gPSBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSA9PT0gJ2RpcmVjdGl2ZScpIHtcclxuICAgICAgICAgICAgICAgIHNldHVwRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cEluaXRpYWxpemVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJlZml4ZWQgZGVwZW5kZW5jaWVzIHRoYXQgcGVyc2lzdGVkIGZyb20gYSBwcmV2aW91cyBjYWxsLFxyXG4gICAgICAgICAgICAvLyBhbmQgY2hlY2sgZm9yIGFueSBub24tYW5ub3RhdGVkIHNlcnZpY2VzXHJcbiAgICAgICAgICAgIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwSW5pdGlhbGl6ZXIoKSB7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0gaW5pdFByb3ZpZGVyKCk7XHJcbiAgICAgICAgICAgIGlmIChvcHRzLnNweU9uUHJvdmlkZXJNZXRob2RzKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRpbml0aWFsaXplID0gc2V0dXBJbml0aWFsaXplcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQcm92aWRlcigpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRyb2xsZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gY29udHJvbGxlckhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsZWFuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZE1vZHVsZXMoYWxsTW9kdWxlcy5jb25jYXQob3B0cy5tb2R1bGVOYW1lKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmRXaXRoKG9wdHMuY29udHJvbGxlci5iaW5kVG9Db250cm9sbGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0U2NvcGUob3B0cy5jb250cm9sbGVyLnBhcmVudFNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0TG9jYWxzKG1vY2tzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubmV3KG9wdHMucHJvdmlkZXJOYW1lLCBvcHRzLmNvbnRyb2xsZXIuY29udHJvbGxlckFzKTtcclxuICAgICAgICAgICAgICAgICAgICB0b1JldHVybi5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbW9ja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vY2tzLmhhc093blByb3BlcnR5KGtleSkgJiYgdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlW2tleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2tleV0gPSB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jb250cm9sbGVyLmlzRGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgICAgICBjYXNlICdmaWx0ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZmlsdGVyID0gaW5qZWN0b3IuZ2V0KCckZmlsdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIob3B0cy5wcm92aWRlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYW5pbWF0aW9uJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZTogaW5qZWN0b3IuZ2V0KCckYW5pbWF0ZScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdEFuaW1hdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubW9jay5tb2R1bGUoJ25nQW5pbWF0ZU1vY2snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQob3B0cy5wcm92aWRlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cERpcmVjdGl2ZSgpIHtcclxuICAgICAgICAgICAgdmFyICRjb21waWxlID0gaW5qZWN0b3IuZ2V0KCckY29tcGlsZScpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kc2NvcGUgPSBpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKS4kbmV3KCk7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG5cclxuICAgICAgICAgICAgcHJvdmlkZXIuJGNvbXBpbGUgPSBmdW5jdGlvbiBxdWlja21vY2tDb21waWxlKGh0bWwpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sIHx8IG9wdHMuaHRtbDtcclxuICAgICAgICAgICAgICAgIGlmICghaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIE5vIGh0bWwgc3RyaW5nL29iamVjdCBwcm92aWRlZC4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGh0bWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChodG1sKTtcclxuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgICAgICAgICAkY29tcGlsZShwcm92aWRlci4kZWxlbWVudCkocHJvdmlkZXIuJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kaXNvU2NvcGUgPSBwcm92aWRlci4kZWxlbWVudC5pc29sYXRlU2NvcGUoKTtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZS4kZGlnZXN0KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSkge1xyXG4gICAgICAgICAgICB2YXIgZGVwVHlwZSA9IGdldFByb3ZpZGVyVHlwZShkZXBOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBkZXBOYW1lO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAhPT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSA9PT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcclxuICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwVHlwZSA9PT0gJ3ZhbHVlJyB8fCBkZXBUeXBlID09PSAnY29uc3RhbnQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5qZWN0b3IuaGFzKG1vY2tQcmVmaXggKyBkZXBOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpbmplY3Rvci5oYXMobW9ja1NlcnZpY2VOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudXNlQWN0dWFsRGVwZW5kZW5jaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrU2VydmljZU5hbWUucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5qZWN0IG1vY2sgZm9yIFwiJyArIGRlcE5hbWUgKyAnXCIgYmVjYXVzZSBubyBzdWNoIG1vY2sgZXhpc3RzLiBQbGVhc2Ugd3JpdGUgYSBtb2NrICcgKyBkZXBUeXBlICsgJyBjYWxsZWQgXCInICsgbW9ja1NlcnZpY2VOYW1lICsgJ1wiIChvciBzZXQgdGhlIHVzZUFjdHVhbERlcGVuZGVuY2llcyB0byB0cnVlKSBhbmQgdHJ5IGFnYWluLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQobW9ja1NlcnZpY2VOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocHJvdmlkZXJEYXRhWzJdWzBdKSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm92aWRlckRhdGFbMl1bMV0pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlciBkZWNsYXJhdGlvbiBmdW5jdGlvbiBoYXMgYmVlbiBwcm92aWRlZCB3aXRob3V0IHRoZSBhcnJheSBhbm5vdGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhbm5vdGF0ZSBpdCBzbyB0aGUgaW52b2tlUXVldWUgY2FuIGJlIHByZWZpeGVkXHJcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGVkRGVwZW5kZW5jaWVzID0gaW5qZWN0b3IuYW5ub3RhdGUocHJvdmlkZXJEYXRhWzJdWzFdKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBwcm92aWRlckRhdGFbMl1bMV0uJGluamVjdDtcclxuICAgICAgICAgICAgICAgIGFubm90YXRlZERlcGVuZGVuY2llcy5wdXNoKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlckRhdGFbMl1bMV0gPSBhbm5vdGF0ZWREZXBlbmRlbmNpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbml0aWFsaXplIGJlY2F1c2UgYW5ndWxhciBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgbG9hZCBhbmd1bGFyIGJlZm9yZSBsb2FkaW5nIHF1aWNrbW9jay5qcy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnByb3ZpZGVyTmFtZSAmJiAhb3B0aW9ucy5jb25maWdCbG9ja3MgJiYgIW9wdGlvbnMucnVuQmxvY2tzKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBwcm92aWRlck5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdCwgb3Igc2V0IHRoZSBjb25maWdCbG9ja3Mgb3IgcnVuQmxvY2tzIGZsYWdzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW9wdGlvbnMubW9kdWxlTmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gbW9kdWxlTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0aW9ucy5tb2NrTW9kdWxlcyA9IG9wdGlvbnMubW9ja01vZHVsZXMgfHwgW107XHJcbiAgICAgICAgb3B0aW9ucy5tb2NrcyA9IG9wdGlvbnMubW9ja3MgfHwge307XHJcbiAgICAgICAgb3B0aW9ucy5jb250cm9sbGVyID0gZXh0ZW5kKG9wdGlvbnMuY29udHJvbGxlciwgY29udHJvbGxlckRlZmF1bHRzKGFuZ3VsYXIuaXNEZWZpbmVkKG9wdGlvbnMuY29udHJvbGxlcikpKTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcikge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm92aWRlciwgZnVuY3Rpb24ocHJvcGVydHksIHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5qYXNtaW5lICYmIHdpbmRvdy5zcHlPbiAmJiAhcHJvcGVydHkuY2FsbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3B5ID0gc3B5T24ocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNweS5hbmRDYWxsVGhyb3VnaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kQ2FsbFRocm91Z2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuc2lub24gJiYgd2luZG93LnNpbm9uLnNweSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zaW5vbi5zcHkocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQcm92aWRlclR5cGUocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW52b2tlUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHByb3ZpZGVySW5mbyA9IGludm9rZVF1ZXVlW2ldO1xyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJJbmZvWzJdWzBdID09PSBwcm92aWRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJJbmZvWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJHByb3ZpZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdmlkZXJJbmZvWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb250cm9sbGVyUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb21waWxlUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2RpcmVjdGl2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGZpbHRlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmaWx0ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRhbmltYXRlUHJvdmlkZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2FuaW1hdGlvbic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdW5wcmVmaXgpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJEYXRhWzJdWzBdID09PSBwcm92aWRlck5hbWUgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1ByZWZpeCArIGN1cnJQcm92aWRlckRlcHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpIHtcclxuICAgICAgICBpZiAoIWh0bWwuJHRhZykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBIdG1sIG9iamVjdCBkb2VzIG5vdCBjb250YWluICR0YWcgcHJvcGVydHkuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBodG1sQXR0cnMgPSBodG1sLFxyXG4gICAgICAgICAgICB0YWdOYW1lID0gaHRtbEF0dHJzLiR0YWcsXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50ID0gaHRtbEF0dHJzLiRjb250ZW50O1xyXG4gICAgICAgIGh0bWwgPSAnPCcgKyB0YWdOYW1lICsgJyAnO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChodG1sQXR0cnMsIGZ1bmN0aW9uKHZhbCwgYXR0cikge1xyXG4gICAgICAgICAgICBpZiAoYXR0ciAhPT0gJyRjb250ZW50JyAmJiBhdHRyICE9PSAnJHRhZycpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gc25ha2VfY2FzZShhdHRyKSArICh2YWwgPyAoJz1cIicgKyB2YWwgKyAnXCIgJykgOiAnICcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaHRtbCArPSBodG1sQ29udGVudCA/ICgnPicgKyBodG1sQ29udGVudCkgOiAnPic7XHJcbiAgICAgICAgaHRtbCArPSAnPC8nICsgdGFnTmFtZSArICc+JztcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBxdWlja21vY2tMb2cobXNnKSB7XHJcbiAgICAgICAgaWYgKCFxdWlja21vY2suTVVURV9MT0dTKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBTTkFLRV9DQVNFX1JFR0VYUCA9IC9bQS1aXS9nO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNuYWtlX2Nhc2UobmFtZSwgc2VwYXJhdG9yKSB7XHJcbiAgICAgICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yIHx8ICctJztcclxuICAgICAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNOQUtFX0NBU0VfUkVHRVhQLCBmdW5jdGlvbihsZXR0ZXIsIHBvcykge1xyXG4gICAgICAgICAgICByZXR1cm4gKHBvcyA/IHNlcGFyYXRvciA6ICcnKSArIGxldHRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBxdWlja21vY2s7XHJcblxyXG59KShhbmd1bGFyKTtcclxuaGVscGVyKG1vY2tlcik7XHJcbmV4cG9ydCBkZWZhdWx0IG1vY2tlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWlja21vY2suanNcbiAqKi8iLCJjb25zb2xlLmxvZygnUU0uaGVscGVyJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkSGVscGVyKG1vY2tlcikge1xyXG4gICAgKGZ1bmN0aW9uKHF1aWNrbW9jaykge1xyXG4gICAgICAgIHZhciBoYXNCZWVuTW9ja2VkID0ge30sXHJcbiAgICAgICAgICAgIG9yaWdNb2R1bGVGdW5jID0gYW5ndWxhci5tb2R1bGU7XHJcbiAgICAgICAgcXVpY2ttb2NrLm9yaWdpbmFsTW9kdWxlcyA9IGFuZ3VsYXIubW9kdWxlO1xyXG4gICAgICAgIGFuZ3VsYXIubW9kdWxlID0gZGVjb3JhdGVBbmd1bGFyTW9kdWxlO1xyXG5cclxuICAgICAgICBxdWlja21vY2subW9ja0hlbHBlciA9IHtcclxuICAgICAgICAgICAgaGFzQmVlbk1vY2tlZDogaGFzQmVlbk1vY2tlZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZHMgPSBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaik7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QsIG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG1vZE9ialttZXRob2ROYW1lXSA9IG1ldGhvZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtb2RPYmo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGUobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKSB7XHJcbiAgICAgICAgICAgIHZhciBtb2RPYmogPSBvcmlnTW9kdWxlRnVuYyhuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaikge1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsIHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaGFzQmVlbk1vY2tlZFtwcm92aWRlck5hbWVdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdNb2RPYmogPSBtb2RPYmpbcHJvdmlkZXJUeXBlXShxdWlja21vY2suTU9DS19QUkVGSVggKyBwcm92aWRlck5hbWUsIGluaXRGdW5jKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobmV3TW9kT2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlOiBmdW5jdGlvbiBtb2NrU2VydmljZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnc2VydmljZScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbW9ja0ZhY3Rvcnk6IGZ1bmN0aW9uIG1vY2tGYWN0b3J5KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmYWN0b3J5JywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0ZpbHRlcjogZnVuY3Rpb24gbW9ja0ZpbHRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmlsdGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0NvbnRyb2xsZXI6IGZ1bmN0aW9uIG1vY2tDb250cm9sbGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb250cm9sbGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja1Byb3ZpZGVyOiBmdW5jdGlvbiBtb2NrUHJvdmlkZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3Byb3ZpZGVyJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja1ZhbHVlOiBmdW5jdGlvbiBtb2NrVmFsdWUocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3ZhbHVlJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0NvbnN0YW50OiBmdW5jdGlvbiBtb2NrQ29uc3RhbnQocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnN0YW50JywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgbW9ja0FuaW1hdGlvbjogZnVuY3Rpb24gbW9ja0FuaW1hdGlvbihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnYW5pbWF0aW9uJywgbW9kT2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSkobW9ja2VyKTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBsb2FkSGVscGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2NvbW1vbi5qcycpO1xyXG5leHBvcnQgdmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xyXG5leHBvcnQgdmFyIGlzRXhwcmVzc2lvbiA9IC9ee3suKn19JC87XHJcbi8qIFNob3VsZCByZXR1cm4gdHJ1ZSBcclxuICogZm9yIG9iamVjdHMgdGhhdCB3b3VsZG4ndCBmYWlsIGRvaW5nXHJcbiAqIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShteU9iaik7XHJcbiAqIHdoaWNoIHJldHVybnMgYSBuZXcgYXJyYXkgKHJlZmVyZW5jZS13aXNlKVxyXG4gKiBQcm9iYWJseSBuZWVkcyBtb3JlIHNwZWNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSkgfHxcclxuICAgICAgICAoISFpdGVtICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoXCJsZW5ndGhcIikgJiZcclxuICAgICAgICAgICAgdHlwZW9mIGl0ZW0ubGVuZ3RoID09PSBcIm51bWJlclwiICYmXHJcbiAgICAgICAgICAgIGl0ZW0ubGVuZ3RoID49IDBcclxuICAgICAgICApIHx8XHJcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XHJcblxyXG4gICAgbGV0IGtleTtcclxuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJyB8fCBvYmpba2V5XSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBbJ1wiJywga2V5LCAnXCIgcHJvcGVydHkgY2Fubm90IGJlIG51bGwnXS5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XHJcbiAgICBhc3NlcnROb3REZWZpbmVkKG9iaiwgW1xyXG4gICAgICAgICdwYXJlbnRTY29wZScsXHJcbiAgICAgICAgJ2JpbmRpbmdzJyxcclxuICAgICAgICAnY29udHJvbGxlclNjb3BlJ1xyXG4gICAgXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcclxuICAgIGlmIChpc0FycmF5TGlrZShvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSBvYmplY3QubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShvYmplY3QsIFtpbmRleCwgMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KG9iamVjdCkpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4ob2JqZWN0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3B5KGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIGxldCBlbmRUaW1lO1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSBzcHlPbih7XHJcbiAgICAgICAgYTogKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sICdhJykuYW5kLmNhbGxUaHJvdWdoKCk7XHJcbiAgICB0b1JldHVybi50b29rID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBlbmRUaW1lIC0gc3RhcnRUaW1lO1xyXG4gICAgfTtcclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBcnJheShpdGVtKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiBbaXRlbV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQoKSB7XHJcbiAgICBsZXQgcmVtb3ZlJCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlO1xyXG5cclxuICAgIGZ1bmN0aW9uICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmUkIHx8ICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWRlc3RpbmF0aW9uLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xyXG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB2YWx1ZXMuc2hpZnQoKSB8fCB7fTtcclxuICAgIGxldCBjdXJyZW50O1xyXG4gICAgd2hpbGUgKGN1cnJlbnQgPSB2YWx1ZXMuc2hpZnQoKSkge1xyXG4gICAgICAgICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBjdXJyZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxufVxyXG5jb25zdCByb290U2NvcGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcm9vdFNjb3BlJyk7XHJcblxyXG5mdW5jdGlvbiBnZXRSb290RnJvbVNjb3BlKHNjb3BlKSB7XHJcbiAgICBpZiAoc2NvcGUuJHJvb3QpIHtcclxuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhcmVudDtcclxuICAgIHdoaWxlIChwYXJlbnQgPSBzY29wZS4kcGFyZW50KSB7XHJcbiAgICAgICAgaWYgKHBhcmVudC4kcm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBzY29wZUhlbHBlciB7XHJcbiAgICBzdGF0aWMgY3JlYXRlKHNjb3BlKSB7XHJcbiAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICBpZiAodGhpcy5pc1Njb3BlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc2NvcGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQocm9vdFNjb3BlLiRuZXcodHJ1ZSksIHNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xyXG4gICAgICAgICAgICBzY29wZSA9IG1ha2VBcnJheShzY29wZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQuYXBwbHkodW5kZWZpbmVkLCBbcm9vdFNjb3BlLiRuZXcodHJ1ZSldLmNvbmNhdChzY29wZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1Njb3BlKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgJiYgZ2V0Um9vdEZyb21TY29wZShvYmplY3QpID09PSBnZXRSb290RnJvbVNjb3BlKHJvb3RTY29wZSkgJiYgb2JqZWN0O1xyXG4gICAgfVxyXG59XHJcbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKG15RnVuY3Rpb24pIHtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcclxuICAgIGlmICh0b1JldHVybiA9PT0gJycgfHwgdG9SZXR1cm4gPT09ICdhbm9uJykge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xyXG5cclxuICAgIGNvbnN0IG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgbGV0IGluZGV4O1xyXG4gICAgaWYgKFxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignbmcnKSkgPT09IC0xICYmXHJcbiAgICAgICAgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xyXG4gICAgICAgIG1vZHVsZXMudW5zaGlmdCgnbmcnKTtcclxuICAgIH1cclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQobW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpWzBdICYmICduZycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vZHVsZXM7XHJcbn1cclxuY29uc29sZS5sb2coJ2NvbW1vbi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICBtYWtlQXJyYXksXHJcbiAgICBpc0FycmF5TGlrZSxcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanMnO1xyXG5cclxudmFyIGNvbnRyb2xsZXJIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmpzJyk7XHJcbiAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcclxuICAgIGxldCBteU1vZHVsZXMsIGN0cmxOYW1lLCBjTG9jYWxzLCBwU2NvcGUsIGNTY29wZSwgY05hbWUsIGJpbmRUb0NvbnRyb2xsZXI7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFuKCkge1xyXG4gICAgICAgIG15TW9kdWxlcyA9IFtdO1xyXG4gICAgICAgIGN0cmxOYW1lID0gcFNjb3BlID0gY0xvY2FscyA9IGNTY29wZSA9IGJpbmRUb0NvbnRyb2xsZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiAkY29udHJvbGxlckhhbmRsZXIoKSB7XHJcblxyXG4gICAgICAgIGlmICghY3RybE5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1BsZWFzZSBwcm92aWRlIHRoZSBjb250cm9sbGVyXFwncyBuYW1lJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHBTY29wZSB8fCB7fSk7XHJcbiAgICAgICAgaWYgKCFjU2NvcGUpIHtcclxuICAgICAgICAgICAgY1Njb3BlID0gcFNjb3BlLiRuZXcoKTtcclxuICAgICAgICB9IHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcFNjb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShjU2NvcGUpO1xyXG4gICAgICAgICAgICBpZiAodGVtcFNjb3BlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY1Njb3BlID0gdGVtcFNjb3BlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b1JldHVybiA9IG5ldyAkX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZFRvQ29udHJvbGxlciwgbXlNb2R1bGVzLCBjTmFtZSwgY0xvY2Fscyk7XHJcbiAgICAgICAgY2xlYW4oKTtcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYmluZFdpdGggPSBmdW5jdGlvbihiaW5kaW5ncykge1xyXG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jb250cm9sbGVyVHlwZSA9ICRfQ09OVFJPTExFUjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5jbGVhbiA9IGNsZWFuO1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlID0gZnVuY3Rpb24obmV3U2NvcGUpIHtcclxuICAgICAgICBwU2NvcGUgPSBuZXdTY29wZTtcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRMb2NhbHMgPSBmdW5jdGlvbihsb2NhbHMpIHtcclxuICAgICAgICBjTG9jYWxzID0gbG9jYWxzO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG5cclxuICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcyA9IGZ1bmN0aW9uKG1vZHVsZXMpIHtcclxuICAgICAgICBmdW5jdGlvbiBwdXNoQXJyYXkoYXJyYXkpIHtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobXlNb2R1bGVzLCBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG1vZHVsZXMpKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShhcmd1bWVudHMpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShbbW9kdWxlc10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBwdXNoQXJyYXkobWFrZUFycmF5KG1vZHVsZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuaXNJbnRlcm5hbCA9IGZ1bmN0aW9uKGZsYWcpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChmbGFnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJuYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGludGVybmFsID0gISFmbGFnO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW50ZXJuYWwgPSAhZmxhZztcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXcgPSBmdW5jdGlvbihjb250cm9sbGVyTmFtZSwgc2NvcGVDb250cm9sbGVyc05hbWUsIHBhcmVudFNjb3BlLCBjaGlsZFNjb3BlKSB7XHJcbiAgICAgICAgY3RybE5hbWUgPSBjb250cm9sbGVyTmFtZTtcclxuICAgICAgICBpZiAoc2NvcGVDb250cm9sbGVyc05hbWUgJiYgIWFuZ3VsYXIuaXNTdHJpbmcoc2NvcGVDb250cm9sbGVyc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoc2NvcGVDb250cm9sbGVyc05hbWUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHBhcmVudFNjb3BlKSB8fCBjU2NvcGU7XHJcbiAgICAgICAgICAgIGNOYW1lID0gJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwYXJlbnRTY29wZSB8fCBwU2NvcGUpO1xyXG4gICAgICAgICAgICBjU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUoY2hpbGRTY29wZSB8fCBwU2NvcGUuJG5ldygpKTtcclxuICAgICAgICAgICAgY05hbWUgPSBzY29wZUNvbnRyb2xsZXJzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcigpO1xyXG4gICAgfTtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5uZXdTZXJ2aWNlID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUsIGJpbmRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSAkY29udHJvbGxlckhhbmRsZXIubmV3KGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlKTtcclxuICAgICAgICB0b1JldHVybi5iaW5kaW5ncyA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuanMgZW5kJyk7XHJcbiAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVySGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5leHRlbnNpb24uanMnKTtcclxuXHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZGlyZWN0aXZlSGFuZGxlclxyXG59IGZyb20gJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJztcclxuaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBQQVJTRV9CSU5ESU5HX1JFR0VYLFxyXG4gICAgY3JlYXRlU3B5LFxyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgc2NvcGVIZWxwZXIsXHJcbiAgICBhc3NlcnRfJF9DT05UUk9MTEVSLFxyXG4gICAgY2xlYW5cclxufSBmcm9tICcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyAkX0NPTlRST0xMRVIge1xyXG4gICAgc3RhdGljIGlzQ29udHJvbGxlcihvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgJF9DT05UUk9MTEVSO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoY3RybE5hbWUsIHBTY29wZSwgYmluZGluZ3MsIG1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKSB7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlck5hbWUgPSBjdHJsTmFtZTtcclxuICAgICAgICB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUgPSBjTmFtZSB8fCAnY29udHJvbGxlcic7XHJcbiAgICAgICAgdGhpcy51c2VkTW9kdWxlcyA9IG1vZHVsZXMuc2xpY2UoKTtcclxuICAgICAgICB0aGlzLnBhcmVudFNjb3BlID0gcFNjb3BlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlclNjb3BlID0gdGhpcy5wYXJlbnRTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xyXG4gICAgICAgIHRoaXMubG9jYWxzID0gZXh0ZW5kKGNMb2NhbHMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICRzY29wZTogdGhpcy5jb250cm9sbGVyU2NvcGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzID0gW107XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLkludGVybmFsU3BpZXMgPSB7XHJcbiAgICAgICAgICAgIFNjb3BlOiB7fSxcclxuICAgICAgICAgICAgQ29udHJvbGxlcjoge31cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgJGFwcGx5KCkge1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgIH1cclxuICAgICRkZXN0cm95KCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kZGVzdHJveSgpO1xyXG4gICAgICAgIGNsZWFuKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKGJpbmRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyAhPT0gbnVsbCA/IGJpbmRpbmdzIDogdGhpcy5iaW5kaW5ncztcclxuICAgICAgICBhc3NlcnRfJF9DT05UUk9MTEVSKHRoaXMpO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IgPVxyXG4gICAgICAgICAgICBjb250cm9sbGVyLiRnZXQodGhpcy51c2VkTW9kdWxlcylcclxuICAgICAgICAgICAgLmNyZWF0ZSh0aGlzLnByb3ZpZGVyTmFtZSwgdGhpcy5wYXJlbnRTY29wZSwgdGhpcy5iaW5kaW5ncywgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lLCB0aGlzLmxvY2Fscyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVySW5zdGFuY2UgPSB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvcigpO1xyXG5cclxuICAgICAgICBsZXQgd2F0Y2hlciwgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKHdhdGNoZXIgPSB0aGlzLnBlbmRpbmdXYXRjaGVycy5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2F0Y2guYXBwbHkodGhpcywgd2F0Y2hlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBQQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWModGhpcy5iaW5kaW5nc1trZXldKSxcclxuICAgICAgICAgICAgICAgICAgICBzY29wZUtleSA9IHJlc3VsdFsyXSB8fCBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgc3B5S2V5ID0gW3Njb3BlS2V5LCAnOicsIGtleV0uam9pbignJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WzFdID09PSAnPScpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyID0gdGhpcy53YXRjaChrZXksIHRoaXMuSW50ZXJuYWxTcGllcy5TY29wZVtzcHlLZXldID0gY3JlYXRlU3B5KCksIHNlbGYuY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0cm95ZXIyID0gdGhpcy53YXRjaChzY29wZUtleSwgdGhpcy5JbnRlcm5hbFNwaWVzLkNvbnRyb2xsZXJbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLnBhcmVudFNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlckluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJTY29wZS4kd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgbmdDbGljayhleHByZXNzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRGlyZWN0aXZlKCduZy1jbGljaycsIGV4cHJlc3Npb24pO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlRGlyZWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBtYWtlQXJyYXkoYXJndW1lbnRzKTtcclxuICAgICAgICBjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGFyZ3VtZW50c1swXSk7XHJcbiAgICAgICAgYXJnc1swXSA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb21waWxlLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBjb21waWxlSFRNTChodG1sVGV4dCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgZGlyZWN0aXZlSGFuZGxlcih0aGlzLCBodG1sVGV4dCk7XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbi5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ2RpcmVjdGl2ZVByb3ZpZGVyJyk7XHJcbmltcG9ydCB7XHJcbiAgICBuZ0JpbmREaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdDbGlja0RpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdJZkRpcmVjdGl2ZVxyXG59IGZyb20gJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgbmdUcmFuc2xhdGVEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qcyc7XHJcbnZhciBkaXJlY3RpdmVQcm92aWRlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBuZXcgTWFwKCksXHJcbiAgICAgICAgdG9SZXR1cm4gPSB7fSxcclxuICAgICAgICAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKSxcclxuICAgICAgICAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSkuZ2V0KCckdHJhbnNsYXRlJyksXHJcbiAgICAgICAgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZyxcclxuICAgICAgICBpbnRlcm5hbHMgPSB7XHJcbiAgICAgICAgICAgIG5nSWY6IG5nSWZEaXJlY3RpdmUoKSxcclxuICAgICAgICAgICAgbmdDbGljazogbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0JpbmQ6IG5nQmluZERpcmVjdGl2ZSgkcGFyc2UpLFxyXG4gICAgICAgICAgICBuZ0Rpc2FibGVkOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZTogbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdSZXBlYXQ6IHtcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAnPGRpdj48L2Rpdj4nLFxyXG4gICAgICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oKSB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuZ01vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICByZWdleDogJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nLFxyXG4gICAgICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oKSB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0cmFuc2xhdGVWYWx1ZToge1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmdDbGFzczoge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgdG9SZXR1cm4udG9DYW1lbENhc2UgPSBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUuXHJcbiAgICAgICAgcmVwbGFjZShTUEVDSUFMX0NIQVJTX1JFR0VYUCwgZnVuY3Rpb24oXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGdldCA9IGZ1bmN0aW9uKGRpcmVjdGl2ZU5hbWUpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9SZXR1cm4udG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXMuZ2V0KGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRwdXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnZGlyZWN0aXZlQ29uc3RydWN0b3IgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gdG9SZXR1cm4udG9DYW1lbENhc2UoZGlyZWN0aXZlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhbmd1bGFyLmlzRnVuY3Rpb24oYXJndW1lbnRzWzJdKSAmJiBhcmd1bWVudHNbMl0oKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbJ2RpcmVjdGl2ZScsIGRpcmVjdGl2ZU5hbWUsICdoYXMgYmVlbiBvdmVyd3JpdHRlbiddLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBvdmVyd3JpdGUgJyArIGRpcmVjdGl2ZU5hbWUgKyAnLlxcbkZvcmdldGluZyB0byBjbGVhbiBtdWNoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XHJcbiAgICB9O1xyXG4gICAgdG9SZXR1cm4uJGNsZWFuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5jbGVhcigpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmNvbnNvbGUubG9nKCdkaXJlY3RpdmVQcm92aWRlciBlbmQnKTtcclxuZXhwb3J0IGRlZmF1bHQgZGlyZWN0aXZlUHJvdmlkZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5iaW5kLmpzJyk7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBtYWtlQXJyYXlcclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCRwYXJzZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKHBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFyZ3VtZW50c1sxXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihwYXJhbWV0ZXIuc3BsaXQoJycpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBnZXR0ZXIuYXNzaWduKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSwgcGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4ocGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocGFyYW1ldGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtZW1vcnkgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBtYWtlQXJyYXkocGFyYW1ldGVyKS5mb3JFYWNoKChjdXJyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKG1lbW9yeSArPSBjdXJyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgWydEb250IGtub3cgd2hhdCB0byBkbyB3aXRoICcsICdbXCInLCBtYWtlQXJyYXkoYXJndW1lbnRzKS5qb2luKCdcIiwgXCInKSwgJ1wiXSddLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5iaW5kLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5jbGljay5qcycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1jbGljaz1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGV4cHJlc3Npb24pKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2sgPSAoc2NvcGUsIGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBzY29wZSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gbG9jYWxzIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXhwcmVzc2lvbihzY29wZSwgbG9jYWxzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQXBwbHlUb0NoaWxkcmVuOiB0cnVlXHJcbiAgICB9O1xyXG59XHJcbmNvbnNvbGUubG9nKCduZy5jbGljay5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ25nLmlmLmpzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBuZ0lmRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZWdleDogL25nLWlmPVwiKC4qKVwiLyxcclxuICAgICAgICBjb21waWxlOiAoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0b3JzID0gW107XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBzdWJzY3JpcHRvcnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzW2lpXS5hcHBseShzdWJzY3JpcHRvcnMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNoaWZ0KCkoKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4udmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogKGNvbnRyb2xsZXJTZXJ2aWNlLCAkZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb21waWxlZERpcmVjdGl2ZSA9ICRlbGVtZW50LmRhdGEoJ25nLWlmJyk7XHJcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUsIHBhcmVudDtcclxuICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUoKG5ld1ZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQobGFzdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuaWYuanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy50cmFuc2xhdGUuanMnKTtcclxuaW1wb3J0IHtcclxuICAgIGlzRXhwcmVzc2lvblxyXG59IGZyb20gJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oZXhwcmVzc2lvbiwgY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc3QgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgICAgICAkdHJhbnNsYXRlLnVzZShuZXdMYW5ndWFnZSk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzRXhwcmVzc2lvbjogZnVuY3Rpb24obXlUZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc0V4cHJlc3Npb24udGVzdChteVRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdHJhbnNsYXRlLmluc3RhbnQodGV4dCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VMYW5ndWFnZTogZnVuY3Rpb24obmV3TGFuZ3VhZ2UpIHtcclxuICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zb2xlLmxvZygnbmcudHJhbnNsYXRlLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzXG4gKiovIiwiaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG52YXIgZGlyZWN0aXZlSGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdkaXJlY3RpdmVIYW5kbGVyJyk7XHJcblxyXG4gICAgbGV0IHByb3RvID0gYW5ndWxhci5lbGVtZW50LnByb3RvdHlwZSB8fCBhbmd1bGFyLmVsZW1lbnQuX19wcm90b19fO1xyXG4gICAgcHJvdG8ubmdGaW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWVzID0ge1xyXG4gICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICB2YWx1ZXNbdmFsdWVzLmxlbmd0aCsrXSA9IHRoaXNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KGpvaW4odmFsdWVzKSk7XHJcbiAgICB9O1xyXG4gICAgcHJvdG8uY2xpY2sgPSBmdW5jdGlvbihsb2NhbHMpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLmRhdGEoJ25nLWNsaWNrJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljayAmJiBjbGljayhsb2NhbHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBwcm90by50ZXh0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1iaW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljayAmJiBjbGljay5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBqb2luKG9iaikge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMob2JqZWN0LCBhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSkge1xyXG4gICAgICAgIG9iamVjdCA9IGFuZ3VsYXIuZWxlbWVudChvYmplY3QpO1xyXG4gICAgICAgIG9iamVjdC5kYXRhKGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbnMgPSBvYmplY3QuY2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgY2hpbGRyZW5zLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBhcHBseURpcmVjdGl2ZXNUb05vZGVzKGNoaWxkcmVuc1tpaV0sIGF0dHJpYnV0ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGlsZShvYmosIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgb2JqID0gYW5ndWxhci5lbGVtZW50KG9iaik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBvYmpbMF0uYXR0cmlidXRlcy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS5uYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLnZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aXZlO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChkaXJlY3RpdmVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGlsZWREaXJlY3RpdmUgPSBkaXJlY3RpdmUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aXZlLkFwcGx5VG9DaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RGlyZWN0aXZlc1RvTm9kZXMob2JqLCBkaXJlY3RpdmVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5kYXRhKGRpcmVjdGl2ZU5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlLmF0dGFjaFRvRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBhbmd1bGFyLmVsZW1lbnQob2JqKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVucyA9IG9iai5jaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAobGV0IGlpID0gMDsgaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbXBpbGUoY2hpbGRyZW5zW2lpXSwgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb250cm9sKGNvbnRyb2xsZXJTZXJ2aWNlLCBvYmopIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCAhY29udHJvbGxlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBpbGUoY3VycmVudCwgY29udHJvbGxlclNlcnZpY2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnZGlyZWN0aXZlSGFuZGxlciBlbmQnKTtcclxuICAgIHJldHVybiBjb250cm9sO1xyXG59KSgpO1xyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVIYW5kbGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMnKTtcclxuaW1wb3J0IHtcclxuICAgIGV4dGVuZCxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGlzRXhwcmVzc2lvblxyXG5cclxufSBmcm9tICcuL2NvbW1vbi5qcyc7XHJcblxyXG5jb25zdCAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKTtcclxuXHJcbmNsYXNzIGNvbnRyb2xsZXIge1xyXG4gICAgc3RhdGljIGdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpIHtcclxuICAgICAgICBjb25zdCB0b1JldHVybiA9IHt9O1xyXG4gICAgICAgIGlmICghYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmdzID09PSB0cnVlIHx8IGJpbmRpbmdzID09PSAnPScpIHtcclxuICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9ICc9JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBiaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW9kZSA9IHJlc3VsdFsxXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gJHBhcnNlKHBhcmVudEdldChzY29wZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gKGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4cCA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRXhwID0gaXNFeHByZXNzaW9uLmV4ZWMoZXhwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHAgPSBleHAudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwID0gZXhwLnN1YlN0cmluZygyLCBleHAubGVuZ3RoIC0gMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJHBhcnNlKGV4cCkoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBpc29sYXRlU2NvcGUsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbkJpbmRpbmdzID0gKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBtb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1vZGUgPSBtb2RlIHx8ICc9JztcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKG1vZGUpO1xyXG4gICAgICAgICAgICBtb2RlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEtleSA9IGNvbnRyb2xsZXJBcyArICcuJyArIGtleTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICc9JzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQCc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhwID0gaXNFeHByZXNzaW9uLmV4ZWMoc2NvcGVbcGFyZW50S2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVXYXRjaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlLCBpc29sYXRlU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHNjb3BlSGVscGVyLmNyZWF0ZShpc29sYXRlU2NvcGUgfHwgc2NvcGUuJG5ldygpKTtcclxuICAgICAgICBpZiAoIWJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzID09PSB0cnVlIHx8IGFuZ3VsYXIuaXNTdHJpbmcoYmluZGluZ3MpICYmIGJpbmRpbmdzID09PSAnPScpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSAmJiBrZXkgIT09IGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBwYXJzZSBiaW5kaW5ncyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljICRnZXQobW9kdWxlTmFtZXMpIHtcclxuICAgICAgICBsZXQgJGNvbnRyb2xsZXI7XHJcbiAgICAgICAgY29uc3QgYXJyYXkgPSBtYWtlQXJyYXkobW9kdWxlTmFtZXMpO1xyXG4gICAgICAgIC8vIGNvbnN0IGluZGV4TW9jayA9IGFycmF5LmluZGV4T2YoJ25nTW9jaycpO1xyXG4gICAgICAgIC8vIGNvbnN0IGluZGV4TmcgPSBhcnJheS5pbmRleE9mKCduZycpO1xyXG4gICAgICAgIC8vIGlmIChpbmRleE1vY2sgIT09IC0xKSB7XHJcbiAgICAgICAgLy8gICAgIGFycmF5W2luZGV4TW9ja10gPSAnbmcnO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBpZiAoaW5kZXhOZyA9PT0gLTEpIHtcclxuICAgICAgICAvLyAgICAgYXJyYXkucHVzaCgnbmcnKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgYW5ndWxhci5pbmplY3RvcihhcnJheSkuaW52b2tlKFxyXG4gICAgICAgICAgICBbJyRjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIChjb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgc2NvcGUsIGJpbmRpbmdzLCBzY29wZUNvbnRyb2xsZXJOYW1lLCBleHRlbmRlZExvY2Fscykge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XHJcbiAgICAgICAgICAgIHNjb3BlQ29udHJvbGxlck5hbWUgPSBzY29wZUNvbnRyb2xsZXJOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgbGV0IGxvY2FscyA9IGV4dGVuZChleHRlbmRlZExvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgZXh0ZW5kKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBjb250cm9sbGVyLmdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvUmV0dXJuID0gY29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MgPSAoYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmluZGluZ3MgPSBiIHx8IGJpbmRpbmdzO1xyXG4gICAgICAgICAgICAgICAgLy8gbG9jYWxzID0gbXlMb2NhbHMgfHwgbG9jYWxzO1xyXG4gICAgICAgICAgICAgICAgLy8gYiA9IGIgfHwgYmluZGluZ3M7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvL2V4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgZXh0ZW5kZWRMb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGVDb250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVyO1xyXG5jb25zb2xlLmxvZygnY29udHJvbGxlclFNLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzXG4gKiovIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlnKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3Rlc3QnLCBbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSlcclxuICAgICAgICAuY29udHJvbGxlcignZW1wdHlDb250cm9sbGVyJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnZW1wdHlDb250cm9sbGVyJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEluamVjdGlvbnMnLCBbJyRxJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHEsIHQpIHtcclxuICAgICAgICAgICAgdGhpcy4kcSA9ICRxO1xyXG4gICAgICAgICAgICB0aGlzLiR0aW1lb3V0ID0gdDtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEJpbmRpbmdzJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvdW5kUHJvcGVydHkgPSB0aGlzLmJvdW5kUHJvcGVydHkgKyAnIG1vZGlmaWVkJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29uZmlnKFsnJHRyYW5zbGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgVElUTEU6ICdIZWxsbycsXHJcbiAgICAgICAgICAgICAgICBGT086ICdUaGlzIGlzIGEgcGFyYWdyYXBoLicsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19FTjogJ2VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdnZXJtYW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGFsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnRGllcyBpc3QgZWluIFBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNjaCcsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19ERTogJ2RldXRzY2gnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLm1vY2tTZXJ2aWNlKCckcScsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGphc21pbmUuY3JlYXRlU3B5KCdfX18kcScpO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5tb2NrU2VydmljZSgnJHRpbWVvdXQnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqYXNtaW5lLmNyZWF0ZVNweSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICB9XSk7XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2FwcC9jb21wbGV0ZUxpc3QuanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgc2FuaXRpemVNb2R1bGVzXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG52YXIgaW5qZWN0aW9ucyA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciB0b1JldHVybiA9IHtcclxuICAgICAgICAkcm9vdFNjb3BlOiBzY29wZUhlbHBlci4kcm9vdFNjb3BlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5kZXNjcmliZSgnVXRpbCBsb2dpYycsIGZ1bmN0aW9uKCkge1xyXG4gICAgZGVzY3JpYmUoJ2FycmF5LWxpa2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhcnJheS1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKGFyZ3VtZW50cykpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChpc0FycmF5TGlrZShbXSkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDEsXHJcbiAgICAgICAgICAgICAgICAwOiAnbGFsYSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKHRlc3RPYmplY3QpKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGVzdE9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzYW5pdGl6ZU1vZGxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZW1wdHkgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKFtdKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2FuaXRpemVNb2R1bGVzKHtcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91ZCBhZGQgbmcgbW9kdWxlIGl0IGl0cyBub3QgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKFtdKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgICAgIH0pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhZGQgbmcgbm9yIGFuZ3VsYXIgdG8gdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ25nJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2FuaXRpemVNb2R1bGVzKCdhbmd1bGFyJykubGVuZ3RoKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgcGFzc2luZyBhcnJheXMtbGlrZSBvYmplY3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDEgPSBbJ21vZHVsZTEnLCAnbW9kdWxlMiddO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QyID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICBjb25zdCBvYmplY3QzID0ge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAyLFxyXG4gICAgICAgICAgICAgICAgMDogJ21vZHVsZTEnLFxyXG4gICAgICAgICAgICAgICAgMTogJ21vZHVsZTInXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFtvYmplY3QxLCBvYmplY3QyLCBvYmplY3QzXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVNb2R1bGVzKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9CZSh2YWx1ZS5sZW5ndGggKyAxKTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBkZWZhdWx0IG5nL2FuZ3VsYXIgbW9kdWxlIHRvIHRoZSBmaXJzdCBwb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQxID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ25nJ10pLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0MiA9IHNhbml0aXplTW9kdWxlcyhbJ21vZHVsZTEnLCAnbW9kdWxlMicsICdhbmd1bGFyJ10pO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MVswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDEubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MlswXSkudG9CZSgnbmcnKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdDIubGVuZ3RoKS50b0JlKDMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnc2NvcGVIZWxwZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhIHNjb3BlIHdoZW4gbm8gYXJndW1lbnRzIHdoZXJlIGdpdmVuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoKS4kcm9vdCkudG9CZShpbmplY3Rpb25zLiRyb290U2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmUgYSBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgc2FtZSBzY29wZSByZWZlcmVuY2Ugd2hlbiBpdCByZWNlaXZlcyBhbiBpc29sYXRlZCBzY29wZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IGluamVjdGlvbnMuJHJvb3RTY29wZS4kbmV3KHRydWUpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKSkudG9CZShzY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYW4gc2NvcGUgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBhIHBhc3NlZCBvYmplY3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9QYXNzID0ge1xyXG4gICAgICAgICAgICAgICAgYToge30sIC8vIGZvciByZWZlcmVuY2UgY2hlY2tpbmdcclxuICAgICAgICAgICAgICAgIGI6IHt9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCByZXR1cm5lZFNjb3BlO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5lZFNjb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKHRvUGFzcyk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmEpLnRvQmUodG9QYXNzLmEpO1xyXG4gICAgICAgICAgICBleHBlY3QocmV0dXJuZWRTY29wZS5iKS50b0JlKHRvUGFzcy5iKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGtub3cgd2hlbiBhbiBvYmplY3QgaXMgYSBjb250cm9sbGVyIENvbnN0cnVjdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnc29tZXRoaW5nJ1xyXG4gICAgICAgICAgICB9KS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgfSkubmV3KCd3aXRoQmluZGluZ3MnKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdCgkX0NPTlRST0xMRVIuaXNDb250cm9sbGVyKGNvbnRyb2xsZXJPYmopKS50b0JlKHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyT2JqLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcyc7XHJcbmltcG9ydCB7XHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCB3aGljaCByZXR1cm4gYSBjb250cm9sbGVyIGdlbmVyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLiRnZXQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQpKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlci4kZ2V0KCduZycpLmNyZWF0ZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCckZ2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGNvbnRyb2xsZXJDcmVhdG9yO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJDcmVhdG9yID0gY29udHJvbGxlci4kZ2V0KCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYSB2YWxpZCBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5uYW1lKS50b0JlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250cm9sbGVycyB3aXRoIGluamVjdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEluamVjdGlvbnMnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS4kcSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgYSBjb250cm9sbGVyIHdpdGggYW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge30pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhIHByb3BlcnR5IGluIHRoZSBzY29wZSBmb3IgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLiQkY2hpbGRIZWFkLmNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlciB3aXRoIHRoZSBnaXZlbiBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCBzY29wZSwgZmFsc2UsICdteUNvbnRyb2xsZXInKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQubXlDb250cm9sbGVyKS50b0JlKGNvbnRyb2xsZXIxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IFwidHJ1ZVwiIGFuZCBcIj1cIiBhcyBiaW5kVG9Db250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSwgJz0nKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmluZCBpZiBiaW5kVG9Db250cm9sbGVyIGlzIFwiZmFsc2VcIiBvciBcInVuZGVmaW5lZFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMS5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgndW5kZWZpbmVkIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVzY3JpYmUoJ2JpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCI9XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiQFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ0AnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5ib3VuZFByb3BlcnR5KS50b0JlKCdTb21ldGhpbmcgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIiZcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdvdGhlclByb3BlcnR5LmpvaW4oXCJcIiknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbMSwgMiwgM11cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICcmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSgpKS50b0JlKCcxMjMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdleHByZXNzaW9ucyBzaG91bGQgYWxsb3cgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWydhJywgJ2InLCAnYyddXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRvQmUoJ2FiYycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuXHJcbmRlc2NyaWJlKCdjb250cm9sbGVySGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ215TW9kdWxlJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvbnRyb2xsZXJIYW5kbGVyIHdoZW4gYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKSkudG9CZShjb250cm9sbGVySGFuZGxlcik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iaikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlLiRwYXJlbnQpLnRvQmUoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai51c2VkTW9kdWxlcykudG9FcXVhbChbJ3Rlc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNyZWF0ZSgpKS50b0JlKGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBiaW5kaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsczogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHQ6ICdieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246ICdieVRleHQudG9VcHBlckNhc2UoKSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVhbHNSZXN1bHQ6ICc9ZXF1YWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHRSZXN1bHQ6ICdAYnlUZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uUmVzdWx0OiAnJmV4cHJlc3Npb24nXHJcbiAgICAgICAgICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXF1YWxzUmVzdWx0KS50b0JlKHNjb3BlLmVxdWFscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5ieVRleHRSZXN1bHQpLnRvQmUoc2NvcGUuYnlUZXh0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmV4cHJlc3Npb25SZXN1bHQoKSkudG9CZShzY29wZS5ieVRleHQudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ1dhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzY29wZSwgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyB3YXRjaGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJncykudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIGNvbnRyb2xsZXIgaW50byB0aGUgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ2xvbG8nKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIHNjb3BlIGludG8gdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZ2l2ZSB0aGUgcGFyZW50IHNjb3BlIHByaXZpbGVnZSBvdmVyIHRoZSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSA9ICdjaGlsZCc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgncGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZS5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlc3Ryb3lpbmcgdGhlIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIubmV3KCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJTcGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdW5pcXVlT2JqZWN0ID0gZnVuY3Rpb24gdW5pcXVlT2JqZWN0KCkge307XHJcbiAgICBsZXQgY29udHJvbGxlckNvbnN0cnVjdG9yO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgIGlmIChjb250cm9sbGVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgIGE6ICc9JyxcclxuICAgICAgICAgICAgYjogJ0AnLFxyXG4gICAgICAgICAgICBjOiAnJidcclxuICAgICAgICB9KS5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgIGE6IHVuaXF1ZU9iamVjdCxcclxuICAgICAgICAgICAgYjogJ2InLFxyXG4gICAgICAgICAgICBjOiAnYSdcclxuICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzcGllcyBmb3IgZWFjaCBCb3VuZGVkIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBteVNweSA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5JbnRlcm5hbFNwaWVzLlNjb3BlWydhOmEnXTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBteVNweS50b29rKCkgPT09ICdudW1iZXInKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS50b29rKCkpLnRvQmUobXlTcHkudG9vaygpKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCdkaXJlY3RpdmVQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlUHJvdmlkZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBhbmQgbm90IHRocm93IGlzIHRoZSBkaXJlY3RpdmUgZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgcmV0dXJuZWQgPSB7fTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybmVkID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbm90IGV4aXN0aW5nJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICBleHBlY3QocmV0dXJuZWQpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgW1xyXG4gICAgICAgICduZy1pZicsXHJcbiAgICAgICAgJ25nOmlmJyxcclxuICAgICAgICAnbmdJZicsXHJcbiAgICAgICAgJ25nLXJlcGVhdCcsXHJcbiAgICAgICAgJ25nLWNsaWNrJyxcclxuICAgICAgICAnbmctZGlzYWJsZWQnLFxyXG4gICAgICAgICduZy1iaW5kJyxcclxuICAgICAgICAnbmctbW9kZWwnLFxyXG4gICAgICAgICd0cmFuc2xhdGUnLFxyXG4gICAgICAgICd0cmFuc2xhdGUtdmFsdWUnLFxyXG4gICAgICAgICduZy1jbGFzcydcclxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbHdheXMgY29udGFpbiB0aGUgJyArIGl0ZW0gKyAnZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGl0ZW0pKS50b0JlRGVmaW5lZChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdwdXRzIGFuZCB1c2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNweTtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBzcHkuYW5kLnJldHVyblZhbHVlKHNweSk7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRjbGVhbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIGRpcmVjdGl2ZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215OmRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteURpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBvdmVyd3JpdGluZywgYnV0IHByZXNlcnZlIGZpcnN0IHZlcnNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge30pO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdhbGxvdyBtZSB0byBvdmVyd3JpdGUgd2l0aCBhIHRoaXJkIHBhcmFtZXRlciBpbiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIHRydWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgY29uc3QgYW5vdGhlclNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIGFub3RoZXJTcHkuYW5kLnJldHVyblZhbHVlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBhbm90aGVyU3B5LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLm5vdC50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShhbm90aGVyU3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoYW5vdGhlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnZGlyZWN0aXZlSGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ0hFTExPJyxcclxuICAgICAgICAgICAgYUludDogMCxcclxuICAgICAgICAgICAgYUJvb2xlYW46IHRydWVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICc9JyxcclxuICAgICAgICAgICAgYUZ1bmN0aW9uOiAnJicsXHJcbiAgICAgICAgICAgIGFLZXk6ICdAJyxcclxuICAgICAgICAgICAgYUludDogJz0nLFxyXG4gICAgICAgICAgICBhQm9vbGVhbjogJz0nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZUhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY3JlYXRlIG5ldyBpbnN0YW5jZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5ldyBkaXJlY3RpdmVIYW5kbGVyKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNvbXBpbGUgaHRtbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2Lz4nKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnbmdDbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2FsbCBuZy1jbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWNsaWNrPVwiY3RybC5hU3RyaW5nID0gXFwnYW5vdGhlclZhbHVlXFwnXCIvPicpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ2Fub3RoZXJWYWx1ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGl0ZW0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IC8+Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCdhJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBmYWlsIGlmIHRoZSBzZWxlY3RlZCBkb2VzIG5vdCBoYXZlIHRoZSBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IC8+Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuY2xpY2soKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFwcGx5IHRoZSBjbGljayBldmVudCB0byBlYWNoIG9mIGl0cyBjaGlsZHJlbnMgKGlmIG5lZWRlZCknLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIGAgICA8ZGl2IG5nLWNsaWNrPVwiY3RybC5hSW50ID0gY3RybC5hSW50ICsgMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2ZpcnN0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nc2Vjb25kJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0ndGhpcmQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdi8+YCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjZmlyc3QnKS5jbGljaygpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI3NlY29uZCcpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjdGhpcmQnKS5jbGljaygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKDMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBsb2NhbHMgKGZvciB0ZXN0aW5nKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBgICAgPGRpdiBuZy1jbGljaz1cImN0cmwuYUludCA9ICB2YWx1ZSArIGN0cmwuYUludCBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdmaXJzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3NlY29uZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3RoaXJkJz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYvPmApO1xyXG4gICAgICAgICAgICBoYW5kbGVyLm5nRmluZCgnI2ZpcnN0JykuY2xpY2soe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDEwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoMTAwMCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjc2Vjb25kJykuY2xpY2soe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICcnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKCcxMDAwJyk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjdGhpcmQnKS5jbGljayh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgnMTEwMDAnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ25nQmluZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2FsbCB0ZXh0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIudGV4dCgpKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNoYW5nZSB0aGUgY29udHJvbGxlciB2YWx1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWJpbmQ9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIudGV4dCgnbmV3VmFsdWUnKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnbmV3VmFsdWUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IG1lIHRvIGNoYW5nZSB0aGUgY29udHJvbGxlciB2YWx1ZSwgb25lIGxldHRlciBhdCB0aGUgdGltZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IGRpcmVjdGl2ZUhhbmRsZXIoY29udHJvbGxlclNlcnZpY2UsICc8ZGl2IG5nLWJpbmQ9XCJjdHJsLmFTdHJpbmdcIi8+Jyk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKCdjdHJsLmFTdHJpbmcnLCBzcHkpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLnRleHQoJ25ld1ZhbHVlJy5zcGxpdCgnJykpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCduZXdWYWx1ZScpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoJ25ld1ZhbHVlJy5sZW5ndGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnbmdJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2FsbCBuZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXY+PGRpdiBuZy1pZj1cImN0cmwuYUJvb2xlYW5cIi8+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyLm5nSWYoKSkudG9CZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0lmJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15SWY7XHJcbiAgICBjb25zdCBuZ0lmID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmctaWYnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgbXlCb29sZWFuOiB0cnVlXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlJZiA9IG5nSWYuY29tcGlsZSgnY3RybC5teUJvb2xlYW4nLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlJZikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIG5vICRkaWdlc3Qgd2FzIGV4ZWN1dGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgbGF0ZXN0IGV2YWx1YXRlZCB2YWx1ZSBvbiBhIHdhdGNoJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlLm15Qm9vbGVhbiA9IGFuZ3VsYXIubm9vcDtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS5ub3QudG9CZShhbmd1bGFyLm5vb3ApO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhdHRhY2hpbmcgc3B5cyB0byB0aGUgd2F0Y2hpbmcgY3ljbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBteVNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgbXlJZihteVNweSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgZGVhdHRhY2hpbmcgc3BpZXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG9ubHkgZGVhdHRhY2ggdGhlIGNvcnJlY3BvbmRpbmcgc3B5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IG15U3B5MiA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgY29uc3Qgd2F0Y2hlciA9IG15SWYobXlTcHkpO1xyXG4gICAgICAgIG15SWYobXlTcHkyKTtcclxuICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweTIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvZGlyZWN0aXZlcy9uZ0lmLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0JpbmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlCaW5kLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBjb25zdCBuZ0JpbmQgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0JpbmQnKTtcclxuICAgIGNvbnN0IGV4cHJlc3Npb24gPSAnY3RybC5teVN0cmluZ1BhcmFtZXRlcic7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7fSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICBteUJpbmQgPSBuZ0JpbmQuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHRoZSBjb250cm9sbGVyIHdoZW4gcmVjZWl2aW5nIGEgc3RyaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbXlCaW5kKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgZmlyZSBhbiBkaWdlc3Qgd2hlbiBkb2luZyBhbmQgYXNzaWdtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgc3B5KTtcclxuICAgICAgICBleHBlY3Qoc3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBjdXJyZW50IHN0YXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGV4cGVjdChteUJpbmQoKSkudG9CZSgnc29tZVZhbHVlJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgbm90IGZpcmUgZGlnZXN0cyB3aGVuIGNvbnN1bHRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ3NvbWVWYWx1ZSc7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgc3B5KTtcclxuICAgICAgICBteUJpbmQoKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGFycmF5IHRvIGZpcmUgY2hhbmdlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHt9O1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtuZXdWYWx1ZV0gPSAhb2JqZWN0W25ld1ZhbHVlXSA/IDEgOiBvYmplY3RbbmV3VmFsdWVdICsgMTsgLy9jb3VudGluZyB0aGUgY2FsbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBteUJpbmQoWydhJywgJ1YnLCAnYScsICdsJywgJ3UnLCAnZSddKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlcikudG9CZSgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmE6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWw6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1OiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdWU6IDEgLy9vbmx5IG9uY2VcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhIHNlY29uZCB0cnVlIHBhcmFtZXRlciwgdG8gc2ltdWxhdGUgdGhlIGFycmF5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0ge307XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24obmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgb2JqZWN0W25ld1ZhbHVlXSA9ICFvYmplY3RbbmV3VmFsdWVdID8gMSA6IG9iamVjdFtuZXdWYWx1ZV0gKyAxOyAvL2NvdW50aW5nIHRoZSBjYWxsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJywgdHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVjogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHVlOiAxIC8vb25seSBvbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhIGNoYW5nZXMgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlCaW5kLmNoYW5nZXMpLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ2NoYW5nZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnY2hhbmdlcyBzaG91bGQgb25seSBmaXJlIG9uY2UgcGVyIGNoYW5nZSAoaW5kZXBlbmRlbnQgb2Ygd2F0Y2hlciknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2F0Y2hlclNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHdhdGNoZXJTcHkpO1xyXG4gICAgICAgICAgICBteUJpbmQuY2hhbmdlcyhzcHkpO1xyXG4gICAgICAgICAgICBteUJpbmQoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyID0gJ2Fub3RoZXJWYWx1ZSc7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNik7XHJcbiAgICAgICAgICAgIGV4cGVjdCh3YXRjaGVyU3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoNyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15Q2xpY2ssIHNweTtcclxuICAgIGNvbnN0IG5nQ2xpY2sgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCduZ0NsaWNrJyk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15U3B5OiBzcHlcclxuICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICBteUNsaWNrID0gbmdDbGljay5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCAnY3RybC5teVNweShwYXJhbTEsIHBhcmFtMiknKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGRlZmluZWQgbXlJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUNsaWNrKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlDbGljaykudG9FcXVhbChqYXNtaW5lLmFueShGdW5jdGlvbikpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGNhbGxpbmcgaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG15Q2xpY2soKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNhbGwgdGhlIHNweSB3aGVuIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15Q2xpY2soKTtcclxuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgc3VwcG9ydCBsb2NhbHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QxID0gZnVuY3Rpb24oKSB7fTtcclxuICAgICAgICBjb25zdCBvYmplY3QyID0gZnVuY3Rpb24oKSB7fTtcclxuICAgICAgICBjb25zdCBsb2NhbHMgPSB7XHJcbiAgICAgICAgICAgIHBhcmFtMTogb2JqZWN0MSxcclxuICAgICAgICAgICAgcGFyYW0yOiBvYmplY3QyXHJcbiAgICAgICAgfTtcclxuICAgICAgICBteUNsaWNrKGxvY2Fscyk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgob2JqZWN0MSwgb2JqZWN0Mik7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdDbGljay5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdUcmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyU2VydmljZSwgbXlUcmFuc2xhdGU7XHJcbiAgICBjb25zdCBuZ1RyYW5zbGF0ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ3RyYW5zbGF0ZScpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBwcm9wOiAnSEVMTE8nXHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XHJcbiAgICAgICAgbXlUcmFuc2xhdGUgPSBuZ1RyYW5zbGF0ZS5jb21waWxlKCdjdHJsLnByb3AnLCBjb250cm9sbGVyU2VydmljZSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qc1xuICoqLyIsImltcG9ydCBxdWlja21vY2sgZnJvbSAnLi8uLi9zcmMvcXVpY2ttb2NrLmpzJztcclxuZGVzY3JpYmUoJ3F1aWNrbW9jaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJNb2NrZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIgPSBxdWlja21vY2soe1xyXG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICd3aXRoSW5qZWN0aW9ucycsXHJcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd0ZXN0JyxcclxuICAgICAgICAgICAgbW9ja01vZHVsZXM6IFtdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIGEgY29udHJvbGxlck1vY2tlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgbW9kaWZpZWQgYW5ndWxhciBtb2R1bGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KHF1aWNrbW9jay5tb2NrSGVscGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGluamVjdCBtb2NrZWQgb2JqZWN0IGZpcnN0LCB0aGVuIHJlYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kdGltZW91dC5hbmQuaWRlbnRpdHkoKSkudG9CZSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyLiR0aW1lb3V0KCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBpbmplY3QgbW9ja2VkIG9iamVjdCBmaXJzdCwgdGhlbiByZWFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQuYW5kLmlkZW50aXR5KCkpLnRvQmUoJ19fXyR0aW1lb3V0Jyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHEuYW5kLmlkZW50aXR5KCkpLnRvQmUoJ19fXyRxJyk7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIuJHRpbWVvdXRba2V5XSkudG9CZShjb250cm9sbGVyTW9ja2VyLiRtb2Nrcy4kdGltZW91dFtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY29udHJvbGxlck1vY2tlci4kcSkge1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlck1vY2tlci4kcS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci4kcVtrZXldKS50b0JlKGNvbnRyb2xsZXJNb2NrZXIuJG1vY2tzLiRxW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLiRxKS50b0JlKGNvbnRyb2xsZXJNb2NrZXIuJG1vY2tzLiRxKTtcclxuXHJcbiAgICB9KTtcclxufSk7XHJcbmRlc2NyaWJlKCdjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlck1vY2tlciwgc3B5O1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbWFnaWNDbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIgPSBxdWlja21vY2soe1xyXG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICdlbXB0eUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGVzdCcsXHJcbiAgICAgICAgICAgIG1vY2tNb2R1bGVzOiBbXSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50U2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6IHNweVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6ICc9J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBwZXJmb3JtIGNsaWNrcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLm5nQ2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgICAgICBjb25zdCBteUNsaWNrID0gY29udHJvbGxlck1vY2tlci5uZ0NsaWNrKCdjdHJsLnNvbWV0aGluZ1RvQ2FsbChhT2JqLCBiT2JqKScpLFxyXG4gICAgICAgICAgICByZWZlcmVuY2UxID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgcmVmZXJlbmNlMiA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIGxvY2FscyA9IHtcclxuICAgICAgICAgICAgICAgIGFPYmo6IHJlZmVyZW5jZTEsXHJcbiAgICAgICAgICAgICAgICBiT2JqOiByZWZlcmVuY2UyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlZmVyZW5jZTEsIHJlZmVyZW5jZTIpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvcXVpY2ttb2NrLnNwZWMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9