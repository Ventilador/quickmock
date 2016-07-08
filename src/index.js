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
	                    var toReturn = _controllerHandler2.default.clean().addModules(opts.mockModules.concat(opts.moduleName)).bindWith(opts.controller.bindToController).setScope(opts.controller.parentScope).setLocals(mocks).new(opts.providerName, opts.controller.controllerAs);
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
	            for (var _key in this.locals) {
	                var index = this.usedModules.indexOf(_key);
	                if (index !== -1) {
	                    this.usedModules.splice(index, 1);
	                }
	            }
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
	        key: 'parseBindings',
	        value: function parseBindings(bindings, scope, isolateScope, controllerAs, locals) {
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
	            var overwriteWithLocals = function overwriteWithLocals(destination) {
	                for (var key in locals) {
	                    if (locals.hasOwnProperty(key) && key !== controllerAs && key !== '$scope') {
	                        destination[key] = locals[key];
	                    }
	                }
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
	                overwriteWithLocals(destination);
	                return destination;
	            } else if (angular.isObject(bindings)) {
	                for (var _key in bindings) {
	                    if (bindings.hasOwnProperty(_key)) {
	                        assignBindings(destination, scope, _key, bindings[_key]);
	                    }
	                }
	                overwriteWithLocals(destination);
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
	
	                    (0, _common.extend)(constructor.instance, controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName, locals));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMThkNDc5NDM5MjYxODQ4MGUyMDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpY2ttb2NrLmpzIiwid2VicGFjazovLy8uL3NyYy9xdWlja21vY2subW9ja0hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbGxlci9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7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QUFPQSxzQkFBUyxnQkFBVCxDQUEwQixjQUExQixFQUEwQyxLQUExQyxFQUFpRCxRQUFqRCxFQUEyRCxtQkFBM0QsRUFBZ0YsY0FBaEYsRUFBZ0c7QUFDNUYseUJBQVEsb0JBQVksTUFBWixDQUFtQixLQUFuQixDQUFSO0FBQ0EsdUNBQXNCLHVCQUF1QixZQUE3QztBQUNBLHFCQUFJLFNBQVMsb0JBQU8sa0JBQWtCLEVBQXpCLEVBQTZCO0FBQ3RDLDZCQUFRLG9CQUFZLE1BQVosQ0FBbUIsS0FBbkIsRUFBMEIsSUFBMUI7QUFEOEIsa0JBQTdCLEVBRVYsS0FGVSxDQUFiOztBQUlBLHFCQUFNLGNBQWMsWUFBWSxjQUFaLEVBQTRCLE1BQTVCLEVBQW9DLElBQXBDLEVBQTBDLG1CQUExQyxDQUFwQjtBQUNBLDZCQUFZLGVBQVosR0FBOEIsVUFBQyxDQUFELEVBQUksUUFBSixFQUFpQjtBQUMzQyw4QkFBUyxZQUFZLE1BQXJCO0FBQ0EseUJBQUksS0FBSyxRQUFUOztBQUVBLHlDQUFPLFlBQVksUUFBbkIsRUFBNkIsV0FBVyxhQUFYLENBQXlCLFFBQXpCLEVBQW1DLEtBQW5DLEVBQTBDLE9BQU8sTUFBakQsRUFBeUQsbUJBQXpELEVBQThFLE1BQTlFLENBQTdCO0FBQ0EsNEJBQU8sV0FBUDtBQUNILGtCQU5EO0FBT0EscUJBQUksUUFBSixFQUFjO0FBQ1YsaUNBQVksZUFBWjtBQUNIO0FBQ0Qsd0JBQU8sV0FBUDtBQUNIO0FBQ0Qsb0JBQU87QUFDSCx5QkFBUTtBQURMLGNBQVA7QUFHSDs7Ozs7O21CQUVVLFU7O0FBQ2YsU0FBUSxHQUFSLENBQVkscUJBQVosRSIsImZpbGUiOiIuL3NyYy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMThkNDc5NDM5MjYxODQ4MGUyMDZcbiAqKi8iLCJyZXF1aXJlKCcuL3F1aWNrbW9jay5qcycpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmxvYWRlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdRTScpO1xyXG5pbXBvcnQgaGVscGVyIGZyb20gJy4vcXVpY2ttb2NrLm1vY2tIZWxwZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kXHJcbn0gZnJvbSAnLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxudmFyIG1vY2tlciA9IChmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICB2YXIgb3B0cywgbW9ja1ByZWZpeDtcclxuICAgIHZhciBjb250cm9sbGVyRGVmYXVsdHMgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcGFyZW50U2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhZmxhZ1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcXVpY2ttb2NrLk1PQ0tfUFJFRklYID0gbW9ja1ByZWZpeCA9IChxdWlja21vY2suTU9DS19QUkVGSVggfHwgJ19fXycpO1xyXG4gICAgcXVpY2ttb2NrLlVTRV9BQ1RVQUwgPSAnVVNFX0FDVFVBTF9JTVBMRU1FTlRBVElPTic7XHJcbiAgICBxdWlja21vY2suTVVURV9MT0dTID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRzID0gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdmFyIGFsbE1vZHVsZXMgPSBvcHRzLm1vY2tNb2R1bGVzLmNvbmNhdChbJ25nTW9jayddKSxcclxuICAgICAgICAgICAgaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKGFsbE1vZHVsZXMuY29uY2F0KFtvcHRzLm1vZHVsZU5hbWVdKSksXHJcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gbW9kT2JqLl9pbnZva2VRdWV1ZSB8fCBbXSxcclxuICAgICAgICAgICAgcHJvdmlkZXJUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgIG1vY2tzID0ge30sXHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0ge307XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxNb2R1bGVzIHx8IFtdLCBmdW5jdGlvbihtb2ROYW1lKSB7XHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gaW52b2tlUXVldWUuY29uY2F0KGFuZ3VsYXIubW9kdWxlKG1vZE5hbWUpLl9pbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmluamVjdCkge1xyXG4gICAgICAgICAgICBpbmplY3Rvci5pbnZva2Uob3B0cy5pbmplY3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaW52b2tlUXVldWUsIGZpbmQgdGhpcyBwcm92aWRlcidzIGRlcGVuZGVuY2llcyBhbmQgcHJlZml4XHJcbiAgICAgICAgICAgIC8vIHRoZW0gc28gQW5ndWxhciB3aWxsIGluamVjdCB0aGUgbW9ja2VkIHZlcnNpb25zXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyRGF0YVsyXVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJOYW1lID09PSBvcHRzLnByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHMgPSBjdXJyUHJvdmlkZXJEZXBzLiRpbmplY3QgfHwgaW5qZWN0b3IuYW5ub3RhdGUoY3VyclByb3ZpZGVyRGVwcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBOYW1lID0gY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2RlcE5hbWVdID0gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlclR5cGUgPT09ICdkaXJlY3RpdmUnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBJbml0aWFsaXplcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZWZpeGVkIGRlcGVuZGVuY2llcyB0aGF0IHBlcnNpc3RlZCBmcm9tIGEgcHJldmlvdXMgY2FsbCxcclxuICAgICAgICAgICAgLy8gYW5kIGNoZWNrIGZvciBhbnkgbm9uLWFubm90YXRlZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cEluaXRpYWxpemVyKCkge1xyXG4gICAgICAgICAgICBwcm92aWRlciA9IGluaXRQcm92aWRlcigpO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5zcHlPblByb3ZpZGVyTWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kaW5pdGlhbGl6ZSA9IHNldHVwSW5pdGlhbGl6ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvdmlkZXIoKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnRyb2xsZXJIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGVhbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRNb2R1bGVzKG9wdHMubW9ja01vZHVsZXMuY29uY2F0KG9wdHMubW9kdWxlTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kV2l0aChvcHRzLmNvbnRyb2xsZXIuYmluZFRvQ29udHJvbGxlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFNjb3BlKG9wdHMuY29udHJvbGxlci5wYXJlbnRTY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldExvY2Fscyhtb2NrcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm5ldyhvcHRzLnByb3ZpZGVyTmFtZSwgb3B0cy5jb250cm9sbGVyLmNvbnRyb2xsZXJBcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udHJvbGxlci5pc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZpbHRlciA9IGluamVjdG9yLmdldCgnJGZpbHRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZmlsdGVyKG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGU6IGluamVjdG9yLmdldCgnJGFuaW1hdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm1vY2subW9kdWxlKCduZ0FuaW1hdGVNb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY29tcGlsZSA9IGluamVjdG9yLmdldCgnJGNvbXBpbGUnKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlID0gaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJykuJG5ldygpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuXHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRjb21waWxlID0gZnVuY3Rpb24gcXVpY2ttb2NrQ29tcGlsZShodG1sKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbCB8fCBvcHRzLmh0bWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBObyBodG1sIHN0cmluZy9vYmplY3QgcHJvdmlkZWQuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChodG1sKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgJGNvbXBpbGUocHJvdmlkZXIuJGVsZW1lbnQpKHByb3ZpZGVyLiRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGlzb1Njb3BlID0gcHJvdmlkZXIuJGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpIHtcclxuICAgICAgICAgICAgdmFyIGRlcFR5cGUgPSBnZXRQcm92aWRlclR5cGUoZGVwTmFtZSwgaW52b2tlUXVldWUpLFxyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gZGVwTmFtZTtcclxuICAgICAgICAgICAgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gIT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gPT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcFR5cGUgPT09ICd2YWx1ZScgfHwgZGVwVHlwZSA9PT0gJ2NvbnN0YW50Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluamVjdG9yLmhhcyhtb2NrUHJlZml4ICsgZGVwTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUuaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IuaGFzKG1vY2tTZXJ2aWNlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnVzZUFjdHVhbERlcGVuZGVuY2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1NlcnZpY2VOYW1lLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluamVjdCBtb2NrIGZvciBcIicgKyBkZXBOYW1lICsgJ1wiIGJlY2F1c2Ugbm8gc3VjaCBtb2NrIGV4aXN0cy4gUGxlYXNlIHdyaXRlIGEgbW9jayAnICsgZGVwVHlwZSArICcgY2FsbGVkIFwiJyArIG1vY2tTZXJ2aWNlTmFtZSArICdcIiAob3Igc2V0IHRoZSB1c2VBY3R1YWxEZXBlbmRlbmNpZXMgdG8gdHJ1ZSkgYW5kIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG1vY2tTZXJ2aWNlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcikge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHByb3ZpZGVyRGF0YVsyXVswXSkgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvdmlkZXJEYXRhWzJdWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZXIgZGVjbGFyYXRpb24gZnVuY3Rpb24gaGFzIGJlZW4gcHJvdmlkZWQgd2l0aG91dCB0aGUgYXJyYXkgYW5ub3RhdGlvbixcclxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gYW5ub3RhdGUgaXQgc28gdGhlIGludm9rZVF1ZXVlIGNhbiBiZSBwcmVmaXhlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRlZERlcGVuZGVuY2llcyA9IGluamVjdG9yLmFubm90YXRlKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJvdmlkZXJEYXRhWzJdWzFdLiRpbmplY3Q7XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0ZWREZXBlbmRlbmNpZXMucHVzaChwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJEYXRhWzJdWzFdID0gYW5ub3RhdGVkRGVwZW5kZW5jaWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5pdGlhbGl6ZSBiZWNhdXNlIGFuZ3VsYXIgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGxvYWQgYW5ndWxhciBiZWZvcmUgbG9hZGluZyBxdWlja21vY2suanMuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5wcm92aWRlck5hbWUgJiYgIW9wdGlvbnMuY29uZmlnQmxvY2tzICYmICFvcHRpb25zLnJ1bkJsb2Nrcykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gcHJvdmlkZXJOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QsIG9yIHNldCB0aGUgY29uZmlnQmxvY2tzIG9yIHJ1bkJsb2NrcyBmbGFncy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLm1vZHVsZU5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIG1vZHVsZU5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wdGlvbnMubW9ja01vZHVsZXMgPSBvcHRpb25zLm1vY2tNb2R1bGVzIHx8IFtdO1xyXG4gICAgICAgIG9wdGlvbnMubW9ja3MgPSBvcHRpb25zLm1vY2tzIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMuY29udHJvbGxlciA9IGV4dGVuZChvcHRpb25zLmNvbnRyb2xsZXIsIGNvbnRyb2xsZXJEZWZhdWx0cyhhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmNvbnRyb2xsZXIpKSk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvdmlkZXIsIGZ1bmN0aW9uKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuamFzbWluZSAmJiB3aW5kb3cuc3B5T24gJiYgIXByb3BlcnR5LmNhbGxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNweSA9IHNweU9uKHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcHkuYW5kQ2FsbFRocm91Z2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZENhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnNpbm9uICYmIHdpbmRvdy5zaW5vbi5zcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2lub24uc3B5KHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlkZXJUeXBlKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludm9rZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aWRlckluZm8gPSBpbnZva2VRdWV1ZVtpXTtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVySW5mb1syXVswXSA9PT0gcHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVySW5mb1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRwcm92aWRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVySW5mb1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29udHJvbGxlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29tcGlsZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRmaWx0ZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZmlsdGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckYW5pbWF0ZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHVucHJlZml4KSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyRGF0YVsyXVswXSA9PT0gcHJvdmlkZXJOYW1lICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tQcmVmaXggKyBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKSB7XHJcbiAgICAgICAgaWYgKCFodG1sLiR0YWcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gSHRtbCBvYmplY3QgZG9lcyBub3QgY29udGFpbiAkdGFnIHByb3BlcnR5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaHRtbEF0dHJzID0gaHRtbCxcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGh0bWxBdHRycy4kdGFnLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudCA9IGh0bWxBdHRycy4kY29udGVudDtcclxuICAgICAgICBodG1sID0gJzwnICsgdGFnTmFtZSArICcgJztcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaHRtbEF0dHJzLCBmdW5jdGlvbih2YWwsIGF0dHIpIHtcclxuICAgICAgICAgICAgaWYgKGF0dHIgIT09ICckY29udGVudCcgJiYgYXR0ciAhPT0gJyR0YWcnKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IHNuYWtlX2Nhc2UoYXR0cikgKyAodmFsID8gKCc9XCInICsgdmFsICsgJ1wiICcpIDogJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGh0bWwgKz0gaHRtbENvbnRlbnQgPyAoJz4nICsgaHRtbENvbnRlbnQpIDogJz4nO1xyXG4gICAgICAgIGh0bWwgKz0gJzwvJyArIHRhZ05hbWUgKyAnPic7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrTG9nKG1zZykge1xyXG4gICAgICAgIGlmICghcXVpY2ttb2NrLk1VVEVfTE9HUykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgU05BS0VfQ0FTRV9SRUdFWFAgPSAvW0EtWl0vZztcclxuXHJcbiAgICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUsIHNlcGFyYXRvcikge1xyXG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLSc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZShTTkFLRV9DQVNFX1JFR0VYUCwgZnVuY3Rpb24obGV0dGVyLCBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcXVpY2ttb2NrO1xyXG5cclxufSkoYW5ndWxhcik7XHJcbmhlbHBlcihtb2NrZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBtb2NrZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ1FNLmhlbHBlcicpO1xyXG5cclxuZnVuY3Rpb24gbG9hZEhlbHBlcihtb2NrZXIpIHtcclxuICAgIChmdW5jdGlvbihxdWlja21vY2spIHtcclxuICAgICAgICB2YXIgaGFzQmVlbk1vY2tlZCA9IHt9LFxyXG4gICAgICAgICAgICBvcmlnTW9kdWxlRnVuYyA9IGFuZ3VsYXIubW9kdWxlO1xyXG4gICAgICAgIHF1aWNrbW9jay5vcmlnaW5hbE1vZHVsZXMgPSBhbmd1bGFyLm1vZHVsZTtcclxuICAgICAgICBhbmd1bGFyLm1vZHVsZSA9IGRlY29yYXRlQW5ndWxhck1vZHVsZTtcclxuXHJcbiAgICAgICAgcXVpY2ttb2NrLm1vY2tIZWxwZXIgPSB7XHJcbiAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWQ6IGhhc0JlZW5Nb2NrZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RPYmpbbWV0aG9kTmFtZV0gPSBtZXRob2Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbW9kT2JqO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbikge1xyXG4gICAgICAgICAgICB2YXIgbW9kT2JqID0gb3JpZ01vZHVsZUZ1bmMobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCBwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWRbcHJvdmlkZXJOYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3TW9kT2JqID0gbW9kT2JqW3Byb3ZpZGVyVHlwZV0ocXVpY2ttb2NrLk1PQ0tfUFJFRklYICsgcHJvdmlkZXJOYW1lLCBpbml0RnVuYyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG5ld01vZE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZTogZnVuY3Rpb24gbW9ja1NlcnZpY2UocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3NlcnZpY2UnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1vY2tGYWN0b3J5OiBmdW5jdGlvbiBtb2NrRmFjdG9yeShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmFjdG9yeScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tGaWx0ZXI6IGZ1bmN0aW9uIG1vY2tGaWx0ZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZpbHRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb250cm9sbGVyOiBmdW5jdGlvbiBtb2NrQ29udHJvbGxlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29udHJvbGxlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tQcm92aWRlcjogZnVuY3Rpb24gbW9ja1Byb3ZpZGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdwcm92aWRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tWYWx1ZTogZnVuY3Rpb24gbW9ja1ZhbHVlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICd2YWx1ZScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb25zdGFudDogZnVuY3Rpb24gbW9ja0NvbnN0YW50KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb25zdGFudCcsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tBbmltYXRpb246IGZ1bmN0aW9uIG1vY2tBbmltYXRpb24ocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2FuaW1hdGlvbicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pKG1vY2tlcik7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgbG9hZEhlbHBlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWlja21vY2subW9ja0hlbHBlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb21tb24uanMnKTtcclxuZXhwb3J0IHZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcclxuZXhwb3J0IHZhciBpc0V4cHJlc3Npb24gPSAvXnt7Lip9fSQvO1xyXG4vKiBTaG91bGQgcmV0dXJuIHRydWUgXHJcbiAqIGZvciBvYmplY3RzIHRoYXQgd291bGRuJ3QgZmFpbCBkb2luZ1xyXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobXlPYmopO1xyXG4gKiB3aGljaCByZXR1cm5zIGEgbmV3IGFycmF5IChyZWZlcmVuY2Utd2lzZSlcclxuICogUHJvYmFibHkgbmVlZHMgbW9yZSBzcGVjc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8XHJcbiAgICAgICAgKCEhaXRlbSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmxlbmd0aCA+PSAwXHJcbiAgICAgICAgKSB8fFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xyXG5cclxuICAgIGxldCBrZXk7XHJcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgWydcIicsIGtleSwgJ1wiIHByb3BlcnR5IGNhbm5vdCBiZSBudWxsJ10uam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xyXG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFtcclxuICAgICAgICAncGFyZW50U2NvcGUnLFxyXG4gICAgICAgICdiaW5kaW5ncycsXHJcbiAgICAgICAgJ2NvbnRyb2xsZXJTY29wZSdcclxuICAgIF0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XHJcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gb2JqZWN0Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKG9iamVjdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xyXG4gICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBsZXQgZW5kVGltZTtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gc3B5T24oe1xyXG4gICAgICAgIGE6ICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgdG9SZXR1cm4udG9vayA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZW5kVGltZSAtIHN0YXJ0VGltZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW2l0ZW1dO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgbGV0IHJlbW92ZSQgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XHJcbiAgICBsZXQgY3VycmVudDtcclxuICAgIHdoaWxlIChjdXJyZW50ID0gdmFsdWVzLnNoaWZ0KCkpIHtcclxuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuY29uc3Qgcm9vdFNjb3BlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHJvb3RTY29wZScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xyXG4gICAgaWYgKHNjb3BlLiRyb290KSB7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlLiRyb290O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXJlbnQ7XHJcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQuJHJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC4kcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3Mgc2NvcGVIZWxwZXIge1xyXG4gICAgc3RhdGljIGNyZWF0ZShzY29wZSkge1xyXG4gICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kKHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0FycmF5TGlrZShzY29wZSkpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Jvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNTY29wZShvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShyb290U2NvcGUpICYmIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XHJcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcclxuXHJcbiAgICBjb25zdCBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGlmIChcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJlxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2R1bGVzO1xyXG59XHJcbmNvbnNvbGUubG9nKCdjb21tb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb21tb24uanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuXHJcbnZhciBjb250cm9sbGVySGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5qcycpO1xyXG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICBsZXQgbXlNb2R1bGVzLCBjdHJsTmFtZSwgY0xvY2FscywgcFNjb3BlLCBjU2NvcGUsIGNOYW1lLCBiaW5kVG9Db250cm9sbGVyO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhbigpIHtcclxuICAgICAgICBteU1vZHVsZXMgPSBbXTtcclxuICAgICAgICBjdHJsTmFtZSA9IHBTY29wZSA9IGNMb2NhbHMgPSBjU2NvcGUgPSBiaW5kVG9Db250cm9sbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gJGNvbnRyb2xsZXJIYW5kbGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoIWN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQbGVhc2UgcHJvdmlkZSB0aGUgY29udHJvbGxlclxcJ3MgbmFtZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xyXG4gICAgICAgIGlmICghY1Njb3BlKSB7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHBTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgfSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBTY29wZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNTY29wZSA9IHRlbXBTY29wZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xyXG4gICAgICAgIGNsZWFuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24oYmluZGluZ3MpIHtcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSAkX0NPTlRST0xMRVI7XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uKG5ld1Njb3BlKSB7XHJcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgY0xvY2FscyA9IGxvY2FscztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoW21vZHVsZXNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShtb2R1bGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmlzSW50ZXJuYWwgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVybmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIHNjb3BlQ29udHJvbGxlcnNOYW1lLCBwYXJlbnRTY29wZSwgY2hpbGRTY29wZSkge1xyXG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xyXG4gICAgICAgICAgICBjTmFtZSA9ICdjb250cm9sbGVyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3U2VydmljZSA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyhjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSk7XHJcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9O1xyXG4gICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmpzIGVuZCcpO1xyXG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9uLmpzJyk7XHJcblxyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZUhhbmRsZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGNyZWF0ZVNweSxcclxuICAgIG1ha2VBcnJheSxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgYXNzZXJ0XyRfQ09OVFJPTExFUixcclxuICAgIGNsZWFuXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgJF9DT05UUk9MTEVSIHtcclxuICAgIHN0YXRpYyBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRfQ09OVFJPTExFUjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lID0gY05hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJTY29wZSA9IHRoaXMucGFyZW50U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICB0aGlzLmxvY2FscyA9IGV4dGVuZChjTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHRoaXMuY29udHJvbGxlclNjb3BlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xyXG4gICAgICAgICAgICBTY29wZToge30sXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgICRhcHBseSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICAkZGVzdHJveSgpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICBjbGVhbih0aGlzKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZShiaW5kaW5ncykge1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBhbmd1bGFyLmlzRGVmaW5lZChiaW5kaW5ncykgJiYgYmluZGluZ3MgIT09IG51bGwgPyBiaW5kaW5ncyA6IHRoaXMuYmluZGluZ3M7XHJcbiAgICAgICAgYXNzZXJ0XyRfQ09OVFJPTExFUih0aGlzKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5sb2NhbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnVzZWRNb2R1bGVzLmluZGV4T2Yoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VkTW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID1cclxuICAgICAgICAgICAgY29udHJvbGxlci4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHdhdGNoZXIsIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llciA9IHRoaXMud2F0Y2goa2V5LCB0aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyMiA9IHRoaXMud2F0Y2goc2NvcGVLZXksIHRoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIG5nQ2xpY2soZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICBjb25zdCBhcmdzID0gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xyXG4gICAgfVxyXG59XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5leHRlbnNpb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdkaXJlY3RpdmVQcm92aWRlcicpO1xyXG5pbXBvcnQge1xyXG4gICAgbmdCaW5kRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nQ2xpY2tEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nSWZEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nVHJhbnNsYXRlRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMnO1xyXG52YXIgZGlyZWN0aXZlUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxyXG4gICAgICAgIHRvUmV0dXJuID0ge30sXHJcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXHJcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pLmdldCgnJHRyYW5zbGF0ZScpLFxyXG4gICAgICAgIFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2csXHJcbiAgICAgICAgaW50ZXJuYWxzID0ge1xyXG4gICAgICAgICAgICBuZ0lmOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xpY2s6IG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdCaW5kOiBuZ0JpbmREaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdEaXNhYmxlZDogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUsICRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nUmVwZWF0OiB7XHJcbiAgICAgICAgICAgICAgICByZWdleDogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmdNb2RlbDoge1xyXG4gICAgICAgICAgICAgICAgcmVnZXg6ICc8aW5wdXQgdHlwZT1cInRleHRcIi8+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlVmFsdWU6IHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5nQ2xhc3M6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIHRvUmV0dXJuLnRvQ2FtZWxDYXNlID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lLlxyXG4gICAgICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9mZnNldCA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRnZXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVzLmdldChkaXJlY3RpdmVOYW1lKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kcHV0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IpIHtcclxuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ2RpcmVjdGl2ZUNvbnN0cnVjdG9yIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkgJiYgYXJndW1lbnRzWzJdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coWydkaXJlY3RpdmUnLCBkaXJlY3RpdmVOYW1lLCAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4nXS5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3Qgb3ZlcndyaXRlICcgKyBkaXJlY3RpdmVOYW1lICsgJy5cXG5Gb3JnZXRpbmcgdG8gY2xlYW4gbXVjaCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRjbGVhbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMuY2xlYXIoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5jb25zb2xlLmxvZygnZGlyZWN0aXZlUHJvdmlkZXIgZW5kJyk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuYmluZC5qcycpO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nQmluZERpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbihwYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzU3RyaW5nKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhcmd1bWVudHNbMV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4ocGFyYW1ldGVyLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0dGVyLmFzc2lnbihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUsIHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtb3J5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZUFycmF5KHBhcmFtZXRlcikuZm9yRWFjaCgoY3VycmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihtZW1vcnkgKz0gY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFsnRG9udCBrbm93IHdoYXQgdG8gZG8gd2l0aCAnLCAnW1wiJywgbWFrZUFycmF5KGFyZ3VtZW50cykuam9pbignXCIsIFwiJyksICdcIl0nXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuYmluZC5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuY2xpY2suanMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctY2xpY2s9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhleHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGNsaWNrID0gKHNjb3BlLCBsb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IGxvY2FscyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb24oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIEFwcGx5VG9DaGlsZHJlbjogdHJ1ZVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuY2xpY2suanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5pZi5qcycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdJZkRpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1pZj1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgc3Vic2NyaXB0b3JzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9yc1tpaV0uYXBwbHkoc3Vic2NyaXB0b3JzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmlmLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcudHJhbnNsYXRlLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBpc0V4cHJlc3Npb25cclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0V4cHJlc3Npb246IGZ1bmN0aW9uKG15VGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNFeHByZXNzaW9uLnRlc3QobXlUZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5pbnN0YW50KHRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGUudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ25nLnRyYW5zbGF0ZS5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxudmFyIGRpcmVjdGl2ZUhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGlyZWN0aXZlSGFuZGxlcicpO1xyXG5cclxuICAgIGxldCBwcm90byA9IGFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUgfHwgYW5ndWxhci5lbGVtZW50Ll9fcHJvdG9fXztcclxuICAgIHByb3RvLm5nRmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHtcclxuICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB0aGlzW2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xyXG4gICAgfTtcclxuICAgIHByb3RvLmNsaWNrID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1jbGljaycpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2sobG9jYWxzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctYmluZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbihjdXJyZW50KSB7XHJcbiAgICAvLyAgICAgbGV0IGV4cHJlc3Npb24gPSBjdXJyZW50WzBdICYmIGN1cnJlbnRbMF0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ25nLWNsaWNrJyk7XHJcbiAgICAvLyAgICAgaWYgKGV4cHJlc3Npb24gIT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uICE9PSBudWxsKSB7XHJcbiAgICAvLyAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnZhbHVlO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgZnVuY3Rpb24gam9pbihvYmopIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgb2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iamVjdCwgYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpIHtcclxuICAgICAgICBvYmplY3QgPSBhbmd1bGFyLmVsZW1lbnQob2JqZWN0KTtcclxuICAgICAgICBvYmplY3QuZGF0YShhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqZWN0LmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhjaGlsZHJlbnNbaWldLCBhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS5BcHBseVRvQ2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iaiwgZGlyZWN0aXZlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouZGF0YShkaXJlY3RpdmVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbnMgPSBvYmouY2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgY2hpbGRyZW5zLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBjb21waWxlKGNoaWxkcmVuc1tpaV0sIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udHJvbChjb250cm9sbGVyU2VydmljZSwgb2JqKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcclxuICAgICAgICBpZiAoIWN1cnJlbnQgfHwgIWNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21waWxlKGN1cnJlbnQsIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2RpcmVjdGl2ZUhhbmRsZXIgZW5kJyk7XHJcbiAgICByZXR1cm4gY29udHJvbDtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGlyZWN0aXZlSGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlclFNLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIHNhbml0aXplTW9kdWxlcyxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBpc0V4cHJlc3Npb25cclxuXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxudmFyICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzLCBsb2NhbHMpIHtcclxuICAgICAgICBjb25zdCBhc3NpZ25CaW5kaW5ncyA9IChkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgbW9kZSkgPT4ge1xyXG4gICAgICAgICAgICBtb2RlID0gbW9kZSB8fCAnPSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhtb2RlKTtcclxuICAgICAgICAgICAgbW9kZSA9IHJlc3VsdFsxXTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXkgPSBjb250cm9sbGVyQXMgKyAnLicgKyBrZXk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gKGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKHNjb3BlW3BhcmVudEtleV0pKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhwID0gaXNFeHByZXNzaW9uLmV4ZWMoc2NvcGVbcGFyZW50S2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShpc0V4cFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSAoc2NvcGVbcGFyZW50S2V5XSB8fCAnJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG92ZXJ3cml0ZVdpdGhMb2NhbHMgPSAoZGVzdGluYXRpb24pID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGxvY2Fscykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2Fscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gY29udHJvbGxlckFzICYmIGtleSAhPT0gJyRzY29wZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gbG9jYWxzW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xyXG4gICAgICAgIGlmICghYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpICYmIGtleSAhPT0gY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3cml0ZVdpdGhMb2NhbHMoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3cml0ZVdpdGhMb2NhbHMoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93ICdDb3VsZCBub3QgcGFyc2UgYmluZGluZ3MnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAkZ2V0KG1vZHVsZU5hbWVzKSB7XHJcbiAgICAgICAgbGV0ICRjb250cm9sbGVyO1xyXG4gICAgICAgIGFuZ3VsYXIuaW5qZWN0b3Ioc2FuaXRpemVNb2R1bGVzKG1vZHVsZU5hbWVzKSkuaW52b2tlKFxyXG4gICAgICAgICAgICBbJyRjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIChjb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgc2NvcGUsIGJpbmRpbmdzLCBzY29wZUNvbnRyb2xsZXJOYW1lLCBleHRlbmRlZExvY2Fscykge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XHJcbiAgICAgICAgICAgIHNjb3BlQ29udHJvbGxlck5hbWUgPSBzY29wZUNvbnRyb2xsZXJOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgbGV0IGxvY2FscyA9IGV4dGVuZChleHRlbmRlZExvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MgPSAoYiwgbXlMb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvY2FscyA9IG15TG9jYWxzIHx8IGxvY2FscztcclxuICAgICAgICAgICAgICAgIGIgPSBiIHx8IGJpbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSwgbG9jYWxzKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXI7XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb250cm9sbGVyUU0uanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9