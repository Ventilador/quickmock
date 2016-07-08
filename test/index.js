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
	        this.q = $q;
	        this.t = t;
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
	        return jasmine.createSpy();
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
	        expect(controllerMocker.t.and.identity()).toBe('___$timeout');
	        controllerMocker.t();
	        expect(controllerMocker.t).toHaveBeenCalled();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMThkNDc5NDM5MjYxODQ4MGUyMDY/Mzc0MSIsIndlYnBhY2s6Ly8vLi90ZXN0L2luZGV4LmxvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpY2ttb2NrLmpzP2IxZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzPzEzZDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXIvY29tbW9uLmpzPzE2YTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzPzAzYjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanM/Y2IxYiIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcz82MjNjIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanM/NDBlNiIsIndlYnBhY2s6Ly8vLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcz80YzE2Iiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzP2Y1OWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzP2Y3ZGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcz9kOTViIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcz9jYmEyIiwid2VicGFjazovLy8uL2FwcC9jb21wbGV0ZUxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5zcGVjLmpzIiwid2VicGFjazovLy8uL3Rlc3QvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nSWYuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcyIsIndlYnBhY2s6Ly8vLi90ZXN0L3F1aWNrbW9jay5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUMxQkE7Ozs7OztBQVpBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjs7QUFFQSwrQjs7Ozs7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O0FBQ0EsZ0JBQU8saUJBQWlCLENBQXhCLEVBQTJCLGdCQUEzQjtBQUNILE1BSkQ7QUFLSCxFQXBCRDtBQXFCQSxVQUFTLFlBQVQsRUFBdUIsWUFBVztBQUM5QixTQUFJLHlCQUFKO0FBQUEsU0FBc0IsWUFBdEI7QUFDQSxnQkFBVyxZQUFXO0FBQ2xCLGVBQU0sUUFBUSxTQUFSLENBQWtCLFlBQWxCLENBQU47QUFDQSw0QkFBbUIseUJBQVU7QUFDekIsMkJBQWMsaUJBRFc7QUFFekIseUJBQVksTUFGYTtBQUd6QiwwQkFBYSxFQUhZO0FBSXpCLHlCQUFZO0FBQ1IsOEJBQWE7QUFDVCxzQ0FBaUI7QUFEUixrQkFETDtBQUlSLG1DQUFrQjtBQUNkLHNDQUFpQjtBQURILGtCQUpWO0FBT1IsK0JBQWM7QUFQTjtBQUphLFVBQVYsQ0FBbkI7QUFjSCxNQWhCRDtBQWlCQSxRQUFHLG1DQUFILEVBQXdDLFlBQVc7QUFDL0MsZ0JBQU8saUJBQWlCLE9BQXhCLEVBQWlDLE9BQWpDLENBQXlDLFFBQVEsR0FBUixDQUFZLFFBQVosQ0FBekM7QUFDQSxhQUFNLFVBQVUsaUJBQWlCLE9BQWpCLENBQXlCLGtDQUF6QixDQUFoQjtBQUFBLGFBQ0ksYUFBYSxTQUFiLFVBQWEsR0FBVyxDQUFFLENBRDlCO0FBQUEsYUFFSSxhQUFhLFNBQWIsVUFBYSxHQUFXLENBQUUsQ0FGOUI7QUFBQSxhQUdJLFNBQVM7QUFDTCxtQkFBTSxVQUREO0FBRUwsbUJBQU07QUFGRCxVQUhiO0FBT0EsaUJBQVEsTUFBUjtBQUNBLGdCQUFPLEdBQVAsRUFBWSxvQkFBWixDQUFpQyxVQUFqQyxFQUE2QyxVQUE3QztBQUNILE1BWEQ7QUFZSCxFQS9CRCxFIiwiZmlsZSI6Ii4vdGVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMThkNDc5NDM5MjYxODQ4MGUyMDZcbiAqKi8iLCJyZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29tbW9uLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1vbi5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29udHJvbGxlci9jb250cm9sbGVyUU0uc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9zcGllcy5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5zcGVjLmpzJyk7XHJcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL25nSWYuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdCaW5kLnNwZWMuanMnKTtcclxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuc3BlYy5qcycpO1xyXG5yZXF1aXJlKCcuL3F1aWNrbW9jay5zcGVjLmpzJyk7XHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi8uLi9hcHAvY29tcGxldGVMaXN0LmpzJztcclxuY29uZmlnKCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2luZGV4LmxvYWRlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdRTScpO1xyXG5pbXBvcnQgaGVscGVyIGZyb20gJy4vcXVpY2ttb2NrLm1vY2tIZWxwZXIuanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kXHJcbn0gZnJvbSAnLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxudmFyIG1vY2tlciA9IChmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICB2YXIgb3B0cywgbW9ja1ByZWZpeDtcclxuICAgIHZhciBjb250cm9sbGVyRGVmYXVsdHMgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcGFyZW50U2NvcGU6IHt9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhZmxhZ1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcXVpY2ttb2NrLk1PQ0tfUFJFRklYID0gbW9ja1ByZWZpeCA9IChxdWlja21vY2suTU9DS19QUkVGSVggfHwgJ19fXycpO1xyXG4gICAgcXVpY2ttb2NrLlVTRV9BQ1RVQUwgPSAnVVNFX0FDVFVBTF9JTVBMRU1FTlRBVElPTic7XHJcbiAgICBxdWlja21vY2suTVVURV9MT0dTID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRzID0gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdmFyIGFsbE1vZHVsZXMgPSBvcHRzLm1vY2tNb2R1bGVzLmNvbmNhdChbJ25nTW9jayddKSxcclxuICAgICAgICAgICAgaW5qZWN0b3IgPSBhbmd1bGFyLmluamVjdG9yKGFsbE1vZHVsZXMuY29uY2F0KFtvcHRzLm1vZHVsZU5hbWVdKSksXHJcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gbW9kT2JqLl9pbnZva2VRdWV1ZSB8fCBbXSxcclxuICAgICAgICAgICAgcHJvdmlkZXJUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSksXHJcbiAgICAgICAgICAgIG1vY2tzID0ge30sXHJcbiAgICAgICAgICAgIHByb3ZpZGVyID0ge307XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxNb2R1bGVzIHx8IFtdLCBmdW5jdGlvbihtb2ROYW1lKSB7XHJcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gaW52b2tlUXVldWUuY29uY2F0KGFuZ3VsYXIubW9kdWxlKG1vZE5hbWUpLl9pbnZva2VRdWV1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmluamVjdCkge1xyXG4gICAgICAgICAgICBpbmplY3Rvci5pbnZva2Uob3B0cy5pbmplY3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaW52b2tlUXVldWUsIGZpbmQgdGhpcyBwcm92aWRlcidzIGRlcGVuZGVuY2llcyBhbmQgcHJlZml4XHJcbiAgICAgICAgICAgIC8vIHRoZW0gc28gQW5ndWxhciB3aWxsIGluamVjdCB0aGUgbW9ja2VkIHZlcnNpb25zXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24ocHJvdmlkZXJEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyRGF0YVsyXVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJOYW1lID09PSBvcHRzLnByb3ZpZGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHMgPSBjdXJyUHJvdmlkZXJEZXBzLiRpbmplY3QgfHwgaW5qZWN0b3IuYW5ub3RhdGUoY3VyclByb3ZpZGVyRGVwcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBOYW1lID0gY3VyclByb3ZpZGVyRGVwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2RlcE5hbWVdID0gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm92aWRlclR5cGUgPT09ICdkaXJlY3RpdmUnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXR1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0dXBJbml0aWFsaXplcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uKHByb3ZpZGVyRGF0YSkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZWZpeGVkIGRlcGVuZGVuY2llcyB0aGF0IHBlcnNpc3RlZCBmcm9tIGEgcHJldmlvdXMgY2FsbCxcclxuICAgICAgICAgICAgLy8gYW5kIGNoZWNrIGZvciBhbnkgbm9uLWFubm90YXRlZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXR1cEluaXRpYWxpemVyKCkge1xyXG4gICAgICAgICAgICBwcm92aWRlciA9IGluaXRQcm92aWRlcigpO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5zcHlPblByb3ZpZGVyTWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kaW5pdGlhbGl6ZSA9IHNldHVwSW5pdGlhbGl6ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvdmlkZXIoKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGNvbnRyb2xsZXJIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGVhbigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRNb2R1bGVzKG9wdHMubW9ja01vZHVsZXMuY29uY2F0KG9wdHMubW9kdWxlTmFtZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5iaW5kV2l0aChvcHRzLmNvbnRyb2xsZXIuYmluZFRvQ29udHJvbGxlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFNjb3BlKG9wdHMuY29udHJvbGxlci5wYXJlbnRTY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldExvY2Fscyhtb2NrcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm5ldyhvcHRzLnByb3ZpZGVyTmFtZSwgb3B0cy5jb250cm9sbGVyLmNvbnRyb2xsZXJBcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udHJvbGxlci5pc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZpbHRlciA9IGluamVjdG9yLmdldCgnJGZpbHRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZmlsdGVyKG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGU6IGluamVjdG9yLmdldCgnJGFuaW1hdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm1vY2subW9kdWxlKCduZ0FuaW1hdGVNb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG9wdHMucHJvdmlkZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0dXBEaXJlY3RpdmUoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY29tcGlsZSA9IGluamVjdG9yLmdldCgnJGNvbXBpbGUnKTtcclxuICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlID0gaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJykuJG5ldygpO1xyXG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcclxuXHJcbiAgICAgICAgICAgIHByb3ZpZGVyLiRjb21waWxlID0gZnVuY3Rpb24gcXVpY2ttb2NrQ29tcGlsZShodG1sKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbCB8fCBvcHRzLmh0bWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBObyBodG1sIHN0cmluZy9vYmplY3QgcHJvdmlkZWQuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChodG1sKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpO1xyXG4gICAgICAgICAgICAgICAgJGNvbXBpbGUocHJvdmlkZXIuJGVsZW1lbnQpKHByb3ZpZGVyLiRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGlzb1Njb3BlID0gcHJvdmlkZXIuJGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kc2NvcGUuJGRpZ2VzdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpIHtcclxuICAgICAgICAgICAgdmFyIGRlcFR5cGUgPSBnZXRQcm92aWRlclR5cGUoZGVwTmFtZSwgaW52b2tlUXVldWUpLFxyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gZGVwTmFtZTtcclxuICAgICAgICAgICAgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gIT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gPT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XHJcbiAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcFR5cGUgPT09ICd2YWx1ZScgfHwgZGVwVHlwZSA9PT0gJ2NvbnN0YW50Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluamVjdG9yLmhhcyhtb2NrUHJlZml4ICsgZGVwTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUuaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XHJcbiAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IuaGFzKG1vY2tTZXJ2aWNlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnVzZUFjdHVhbERlcGVuZGVuY2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1NlcnZpY2VOYW1lLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluamVjdCBtb2NrIGZvciBcIicgKyBkZXBOYW1lICsgJ1wiIGJlY2F1c2Ugbm8gc3VjaCBtb2NrIGV4aXN0cy4gUGxlYXNlIHdyaXRlIGEgbW9jayAnICsgZGVwVHlwZSArICcgY2FsbGVkIFwiJyArIG1vY2tTZXJ2aWNlTmFtZSArICdcIiAob3Igc2V0IHRoZSB1c2VBY3R1YWxEZXBlbmRlbmNpZXMgdG8gdHJ1ZSkgYW5kIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG1vY2tTZXJ2aWNlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcikge1xyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHByb3ZpZGVyRGF0YVsyXVswXSkgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvdmlkZXJEYXRhWzJdWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZXIgZGVjbGFyYXRpb24gZnVuY3Rpb24gaGFzIGJlZW4gcHJvdmlkZWQgd2l0aG91dCB0aGUgYXJyYXkgYW5ub3RhdGlvbixcclxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gYW5ub3RhdGUgaXQgc28gdGhlIGludm9rZVF1ZXVlIGNhbiBiZSBwcmVmaXhlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRlZERlcGVuZGVuY2llcyA9IGluamVjdG9yLmFubm90YXRlKHByb3ZpZGVyRGF0YVsyXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJvdmlkZXJEYXRhWzJdWzFdLiRpbmplY3Q7XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0ZWREZXBlbmRlbmNpZXMucHVzaChwcm92aWRlckRhdGFbMl1bMV0pO1xyXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJEYXRhWzJdWzFdID0gYW5ub3RhdGVkRGVwZW5kZW5jaWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5pdGlhbGl6ZSBiZWNhdXNlIGFuZ3VsYXIgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGxvYWQgYW5ndWxhciBiZWZvcmUgbG9hZGluZyBxdWlja21vY2suanMuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghb3B0aW9ucy5wcm92aWRlck5hbWUgJiYgIW9wdGlvbnMuY29uZmlnQmxvY2tzICYmICFvcHRpb25zLnJ1bkJsb2Nrcykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gcHJvdmlkZXJOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QsIG9yIHNldCB0aGUgY29uZmlnQmxvY2tzIG9yIHJ1bkJsb2NrcyBmbGFncy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLm1vZHVsZU5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIG1vZHVsZU5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wdGlvbnMubW9ja01vZHVsZXMgPSBvcHRpb25zLm1vY2tNb2R1bGVzIHx8IFtdO1xyXG4gICAgICAgIG9wdGlvbnMubW9ja3MgPSBvcHRpb25zLm1vY2tzIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMuY29udHJvbGxlciA9IGV4dGVuZChvcHRpb25zLmNvbnRyb2xsZXIsIGNvbnRyb2xsZXJEZWZhdWx0cyhhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmNvbnRyb2xsZXIpKSk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvdmlkZXIsIGZ1bmN0aW9uKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuamFzbWluZSAmJiB3aW5kb3cuc3B5T24gJiYgIXByb3BlcnR5LmNhbGxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNweSA9IHNweU9uKHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcHkuYW5kQ2FsbFRocm91Z2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZENhbGxUaHJvdWdoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnNpbm9uICYmIHdpbmRvdy5zaW5vbi5zcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2lub24uc3B5KHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlkZXJUeXBlKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludm9rZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm92aWRlckluZm8gPSBpbnZva2VRdWV1ZVtpXTtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVySW5mb1syXVswXSA9PT0gcHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVySW5mb1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRwcm92aWRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVySW5mb1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29udHJvbGxlclByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29tcGlsZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRmaWx0ZXJQcm92aWRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZmlsdGVyJztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICckYW5pbWF0ZVByb3ZpZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb24nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHVucHJlZml4KSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbihwcm92aWRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyRGF0YVsyXVswXSA9PT0gcHJvdmlkZXJOYW1lICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tQcmVmaXggKyBjdXJyUHJvdmlkZXJEZXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKSB7XHJcbiAgICAgICAgaWYgKCFodG1sLiR0YWcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gSHRtbCBvYmplY3QgZG9lcyBub3QgY29udGFpbiAkdGFnIHByb3BlcnR5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaHRtbEF0dHJzID0gaHRtbCxcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGh0bWxBdHRycy4kdGFnLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudCA9IGh0bWxBdHRycy4kY29udGVudDtcclxuICAgICAgICBodG1sID0gJzwnICsgdGFnTmFtZSArICcgJztcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaHRtbEF0dHJzLCBmdW5jdGlvbih2YWwsIGF0dHIpIHtcclxuICAgICAgICAgICAgaWYgKGF0dHIgIT09ICckY29udGVudCcgJiYgYXR0ciAhPT0gJyR0YWcnKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IHNuYWtlX2Nhc2UoYXR0cikgKyAodmFsID8gKCc9XCInICsgdmFsICsgJ1wiICcpIDogJyAnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGh0bWwgKz0gaHRtbENvbnRlbnQgPyAoJz4nICsgaHRtbENvbnRlbnQpIDogJz4nO1xyXG4gICAgICAgIGh0bWwgKz0gJzwvJyArIHRhZ05hbWUgKyAnPic7XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrTG9nKG1zZykge1xyXG4gICAgICAgIGlmICghcXVpY2ttb2NrLk1VVEVfTE9HUykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgU05BS0VfQ0FTRV9SRUdFWFAgPSAvW0EtWl0vZztcclxuXHJcbiAgICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUsIHNlcGFyYXRvcikge1xyXG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLSc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZShTTkFLRV9DQVNFX1JFR0VYUCwgZnVuY3Rpb24obGV0dGVyLCBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcXVpY2ttb2NrO1xyXG5cclxufSkoYW5ndWxhcik7XHJcbmhlbHBlcihtb2NrZXIpO1xyXG5leHBvcnQgZGVmYXVsdCBtb2NrZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVpY2ttb2NrLmpzXG4gKiovIiwiY29uc29sZS5sb2coJ1FNLmhlbHBlcicpO1xyXG5cclxuZnVuY3Rpb24gbG9hZEhlbHBlcihtb2NrZXIpIHtcclxuICAgIChmdW5jdGlvbihxdWlja21vY2spIHtcclxuICAgICAgICB2YXIgaGFzQmVlbk1vY2tlZCA9IHt9LFxyXG4gICAgICAgICAgICBvcmlnTW9kdWxlRnVuYyA9IGFuZ3VsYXIubW9kdWxlO1xyXG4gICAgICAgIHF1aWNrbW9jay5vcmlnaW5hbE1vZHVsZXMgPSBhbmd1bGFyLm1vZHVsZTtcclxuICAgICAgICBhbmd1bGFyLm1vZHVsZSA9IGRlY29yYXRlQW5ndWxhck1vZHVsZTtcclxuXHJcbiAgICAgICAgcXVpY2ttb2NrLm1vY2tIZWxwZXIgPSB7XHJcbiAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWQ6IGhhc0JlZW5Nb2NrZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RPYmpbbWV0aG9kTmFtZV0gPSBtZXRob2Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbW9kT2JqO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbikge1xyXG4gICAgICAgICAgICB2YXIgbW9kT2JqID0gb3JpZ01vZHVsZUZ1bmMobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCBwcm92aWRlclR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWRbcHJvdmlkZXJOYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3TW9kT2JqID0gbW9kT2JqW3Byb3ZpZGVyVHlwZV0ocXVpY2ttb2NrLk1PQ0tfUFJFRklYICsgcHJvdmlkZXJOYW1lLCBpbml0RnVuYyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG5ld01vZE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZTogZnVuY3Rpb24gbW9ja1NlcnZpY2UocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3NlcnZpY2UnLCBtb2RPYmopO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1vY2tGYWN0b3J5OiBmdW5jdGlvbiBtb2NrRmFjdG9yeShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmFjdG9yeScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tGaWx0ZXI6IGZ1bmN0aW9uIG1vY2tGaWx0ZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZpbHRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb250cm9sbGVyOiBmdW5jdGlvbiBtb2NrQ29udHJvbGxlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29udHJvbGxlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tQcm92aWRlcjogZnVuY3Rpb24gbW9ja1Byb3ZpZGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdwcm92aWRlcicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tWYWx1ZTogZnVuY3Rpb24gbW9ja1ZhbHVlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICd2YWx1ZScsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tDb25zdGFudDogZnVuY3Rpb24gbW9ja0NvbnN0YW50KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb25zdGFudCcsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIG1vY2tBbmltYXRpb246IGZ1bmN0aW9uIG1vY2tBbmltYXRpb24ocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2FuaW1hdGlvbicsIG1vZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pKG1vY2tlcik7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgbG9hZEhlbHBlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWlja21vY2subW9ja0hlbHBlci5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdjb21tb24uanMnKTtcclxuZXhwb3J0IHZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcclxuZXhwb3J0IHZhciBpc0V4cHJlc3Npb24gPSAvXnt7Lip9fSQvO1xyXG4vKiBTaG91bGQgcmV0dXJuIHRydWUgXHJcbiAqIGZvciBvYmplY3RzIHRoYXQgd291bGRuJ3QgZmFpbCBkb2luZ1xyXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobXlPYmopO1xyXG4gKiB3aGljaCByZXR1cm5zIGEgbmV3IGFycmF5IChyZWZlcmVuY2Utd2lzZSlcclxuICogUHJvYmFibHkgbmVlZHMgbW9yZSBzcGVjc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8XHJcbiAgICAgICAgKCEhaXRlbSAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJlxyXG4gICAgICAgICAgICBpdGVtLmxlbmd0aCA+PSAwXHJcbiAgICAgICAgKSB8fFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xyXG5cclxuICAgIGxldCBrZXk7XHJcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgWydcIicsIGtleSwgJ1wiIHByb3BlcnR5IGNhbm5vdCBiZSBudWxsJ10uam9pbihcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xyXG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFtcclxuICAgICAgICAncGFyZW50U2NvcGUnLFxyXG4gICAgICAgICdiaW5kaW5ncycsXHJcbiAgICAgICAgJ2NvbnRyb2xsZXJTY29wZSdcclxuICAgIF0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XHJcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xyXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gb2JqZWN0Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKG9iamVjdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xyXG4gICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBsZXQgZW5kVGltZTtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0gc3B5T24oe1xyXG4gICAgICAgIGE6ICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xyXG4gICAgdG9SZXR1cm4udG9vayA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZW5kVGltZSAtIHN0YXJ0VGltZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VBcnJheShhcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpdGVtKSkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW2l0ZW1dO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKCkge1xyXG4gICAgbGV0IHJlbW92ZSQgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID09PSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XHJcbiAgICBsZXQgY3VycmVudDtcclxuICAgIHdoaWxlIChjdXJyZW50ID0gdmFsdWVzLnNoaWZ0KCkpIHtcclxuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn1cclxuY29uc3Qgcm9vdFNjb3BlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHJvb3RTY29wZScpO1xyXG5cclxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xyXG4gICAgaWYgKHNjb3BlLiRyb290KSB7XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlLiRyb290O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYXJlbnQ7XHJcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQuJHJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC4kcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3Mgc2NvcGVIZWxwZXIge1xyXG4gICAgc3RhdGljIGNyZWF0ZShzY29wZSkge1xyXG4gICAgICAgIHNjb3BlID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kKHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0FycmF5TGlrZShzY29wZSkpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Jvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNTY29wZShvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShyb290U2NvcGUpICYmIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XHJcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcclxuXHJcbiAgICBjb25zdCBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgIGxldCBpbmRleDtcclxuICAgIGlmIChcclxuICAgICAgICAoaW5kZXggPSBtb2R1bGVzLmluZGV4T2YoJ25nJykpID09PSAtMSAmJlxyXG4gICAgICAgIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcclxuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtb2R1bGVzO1xyXG59XHJcbmNvbnNvbGUubG9nKCdjb21tb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb21tb24uanNcbiAqKi8iLCJpbXBvcnQge1xyXG4gICAgbWFrZUFycmF5LFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzY29wZUhlbHBlclxyXG59IGZyb20gJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgJF9DT05UUk9MTEVSXHJcbn0gZnJvbSAnLi9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuXHJcbnZhciBjb250cm9sbGVySGFuZGxlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5qcycpO1xyXG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XHJcbiAgICBsZXQgbXlNb2R1bGVzLCBjdHJsTmFtZSwgY0xvY2FscywgcFNjb3BlLCBjU2NvcGUsIGNOYW1lLCBiaW5kVG9Db250cm9sbGVyO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhbigpIHtcclxuICAgICAgICBteU1vZHVsZXMgPSBbXTtcclxuICAgICAgICBjdHJsTmFtZSA9IHBTY29wZSA9IGNMb2NhbHMgPSBjU2NvcGUgPSBiaW5kVG9Db250cm9sbGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gJGNvbnRyb2xsZXJIYW5kbGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoIWN0cmxOYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdQbGVhc2UgcHJvdmlkZSB0aGUgY29udHJvbGxlclxcJ3MgbmFtZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBTY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xyXG4gICAgICAgIGlmICghY1Njb3BlKSB7XHJcbiAgICAgICAgICAgIGNTY29wZSA9IHBTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgfSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBTY29wZSA9IHNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBTY29wZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNTY29wZSA9IHRlbXBTY29wZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xyXG4gICAgICAgIGNsZWFuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgfVxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24oYmluZGluZ3MpIHtcclxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSAkX0NPTlRST0xMRVI7XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcclxuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uKG5ld1Njb3BlKSB7XHJcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XHJcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgY0xvY2FscyA9IGxvY2FscztcclxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcblxyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHB1c2hBcnJheShtYWtlQXJyYXkoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoW21vZHVsZXNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UobW9kdWxlcykpIHtcclxuICAgICAgICAgICAgcHVzaEFycmF5KG1ha2VBcnJheShtb2R1bGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XHJcbiAgICB9O1xyXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmlzSW50ZXJuYWwgPSBmdW5jdGlvbihmbGFnKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVybmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24oY29udHJvbGxlck5hbWUsIHNjb3BlQ29udHJvbGxlcnNOYW1lLCBwYXJlbnRTY29wZSwgY2hpbGRTY29wZSkge1xyXG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xyXG4gICAgICAgICAgICBjTmFtZSA9ICdjb250cm9sbGVyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcclxuICAgICAgICAgICAgY1Njb3BlID0gc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XHJcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcclxuICAgIH07XHJcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3U2VydmljZSA9IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xyXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyhjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckFzLCBwYXJlbnRTY29wZSk7XHJcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICB9O1xyXG4gICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXJIYW5kbGVyLmpzIGVuZCcpO1xyXG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9uLmpzJyk7XHJcblxyXG5pbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuaW1wb3J0IHtcclxuICAgIGRpcmVjdGl2ZUhhbmRsZXJcclxufSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vY29udHJvbGxlci9jb250cm9sbGVyUU0uanMnO1xyXG5pbXBvcnQge1xyXG4gICAgZXh0ZW5kLFxyXG4gICAgUEFSU0VfQklORElOR19SRUdFWCxcclxuICAgIGNyZWF0ZVNweSxcclxuICAgIG1ha2VBcnJheSxcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgYXNzZXJ0XyRfQ09OVFJPTExFUixcclxuICAgIGNsZWFuXHJcbn0gZnJvbSAnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgJF9DT05UUk9MTEVSIHtcclxuICAgIHN0YXRpYyBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mICRfQ09OVFJPTExFUjtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lID0gY05hbWUgfHwgJ2NvbnRyb2xsZXInO1xyXG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJTY29wZSA9IHRoaXMucGFyZW50U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcclxuICAgICAgICB0aGlzLmxvY2FscyA9IGV4dGVuZChjTG9jYWxzIHx8IHt9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGU6IHRoaXMuY29udHJvbGxlclNjb3BlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHNjb3BlSGVscGVyLiRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xyXG4gICAgICAgICAgICBTY29wZToge30sXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgICRhcHBseSgpIHtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICB9XHJcbiAgICAkZGVzdHJveSgpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy4kcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICBjbGVhbih0aGlzKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZShiaW5kaW5ncykge1xyXG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBhbmd1bGFyLmlzRGVmaW5lZChiaW5kaW5ncykgJiYgYmluZGluZ3MgIT09IG51bGwgPyBiaW5kaW5ncyA6IHRoaXMuYmluZGluZ3M7XHJcbiAgICAgICAgYXNzZXJ0XyRfQ09OVFJPTExFUih0aGlzKTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5sb2NhbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnVzZWRNb2R1bGVzLmluZGV4T2Yoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VkTW9kdWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID1cclxuICAgICAgICAgICAgY29udHJvbGxlci4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpXHJcbiAgICAgICAgICAgIC5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcclxuXHJcbiAgICAgICAgbGV0IHdhdGNoZXIsIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3Ryb3llciA9IHRoaXMud2F0Y2goa2V5LCB0aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9IGNyZWF0ZVNweSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdHJveWVyMiA9IHRoaXMud2F0Y2goc2NvcGVLZXksIHRoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSBjcmVhdGVTcHkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIG5nQ2xpY2soZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZURpcmVjdGl2ZSgpIHtcclxuICAgICAgICBjb25zdCBhcmdzID0gbWFrZUFycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldChhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xyXG4gICAgfVxyXG59XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVySGFuZGxlci5leHRlbnNpb24uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqLyIsImNvbnNvbGUubG9nKCdkaXJlY3RpdmVQcm92aWRlcicpO1xyXG5pbXBvcnQge1xyXG4gICAgbmdCaW5kRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nQ2xpY2tEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nSWZEaXJlY3RpdmVcclxufSBmcm9tICcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzJztcclxuaW1wb3J0IHtcclxuICAgIG5nVHJhbnNsYXRlRGlyZWN0aXZlXHJcbn0gZnJvbSAnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMnO1xyXG52YXIgZGlyZWN0aXZlUHJvdmlkZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxyXG4gICAgICAgIHRvUmV0dXJuID0ge30sXHJcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXHJcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pLmdldCgnJHRyYW5zbGF0ZScpLFxyXG4gICAgICAgIFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2csXHJcbiAgICAgICAgaW50ZXJuYWxzID0ge1xyXG4gICAgICAgICAgICBuZ0lmOiBuZ0lmRGlyZWN0aXZlKCksXHJcbiAgICAgICAgICAgIG5nQ2xpY2s6IG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdCaW5kOiBuZ0JpbmREaXJlY3RpdmUoJHBhcnNlKSxcclxuICAgICAgICAgICAgbmdEaXNhYmxlZDogbmdJZkRpcmVjdGl2ZSgpLFxyXG4gICAgICAgICAgICB0cmFuc2xhdGU6IG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUsICRwYXJzZSksXHJcbiAgICAgICAgICAgIG5nUmVwZWF0OiB7XHJcbiAgICAgICAgICAgICAgICByZWdleDogJzxkaXY+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmdNb2RlbDoge1xyXG4gICAgICAgICAgICAgICAgcmVnZXg6ICc8aW5wdXQgdHlwZT1cInRleHRcIi8+JyxcclxuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhbnNsYXRlVmFsdWU6IHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5nQ2xhc3M6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIHRvUmV0dXJuLnRvQ2FtZWxDYXNlID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgIHJldHVybiBuYW1lLlxyXG4gICAgICAgIHJlcGxhY2UoU1BFQ0lBTF9DSEFSU19SRUdFWFAsIGZ1bmN0aW9uKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9mZnNldCA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRnZXQgPSBmdW5jdGlvbihkaXJlY3RpdmVOYW1lKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVzLmdldChkaXJlY3RpdmVOYW1lKTtcclxuICAgIH07XHJcbiAgICB0b1JldHVybi4kcHV0ID0gZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IpIHtcclxuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmVDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ2RpcmVjdGl2ZUNvbnN0cnVjdG9yIGlzIG5vdCBhIGZ1bmN0aW9uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9IHRvUmV0dXJuLnRvQ2FtZWxDYXNlKGRpcmVjdGl2ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkgJiYgYXJndW1lbnRzWzJdKCkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coWydkaXJlY3RpdmUnLCBkaXJlY3RpdmVOYW1lLCAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4nXS5qb2luKCcgJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3Qgb3ZlcndyaXRlICcgKyBkaXJlY3RpdmVOYW1lICsgJy5cXG5Gb3JnZXRpbmcgdG8gY2xlYW4gbXVjaCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpcmVjdGl2ZXMuc2V0KGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKCkpO1xyXG4gICAgfTtcclxuICAgIHRvUmV0dXJuLiRjbGVhbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMuY2xlYXIoKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG59KSgpO1xyXG5jb25zb2xlLmxvZygnZGlyZWN0aXZlUHJvdmlkZXIgZW5kJyk7XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuYmluZC5qcycpO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGlzQXJyYXlMaWtlLFxyXG4gICAgbWFrZUFycmF5XHJcbn0gZnJvbSAnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5nQmluZERpcmVjdGl2ZSgkcGFyc2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY29tcGlsZTogKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbihwYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzU3RyaW5nKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhcmd1bWVudHNbMV0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4ocGFyYW1ldGVyLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0dGVyLmFzc2lnbihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUsIHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtZXRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHBhcmFtZXRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVtb3J5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZUFycmF5KHBhcmFtZXRlcikuZm9yRWFjaCgoY3VycmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihtZW1vcnkgKz0gY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFsnRG9udCBrbm93IHdoYXQgdG8gZG8gd2l0aCAnLCAnW1wiJywgbWFrZUFycmF5KGFyZ3VtZW50cykuam9pbignXCIsIFwiJyksICdcIl0nXS5qb2luKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuYmluZC5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcuY2xpY2suanMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlZ2V4OiAvbmctY2xpY2s9XCIoLiopXCIvLFxyXG4gICAgICAgIGNvbXBpbGU6IChjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhleHByZXNzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGNsaWNrID0gKHNjb3BlLCBsb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gc2NvcGUgfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IGxvY2FscyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4cHJlc3Npb24oc2NvcGUsIGxvY2Fscyk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBjbGljaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIEFwcGx5VG9DaGlsZHJlbjogdHJ1ZVxyXG4gICAgfTtcclxufVxyXG5jb25zb2xlLmxvZygnbmcuY2xpY2suanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqLyIsImNvbnNvbGUubG9nKCduZy5pZi5qcycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbmdJZkRpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVnZXg6IC9uZy1pZj1cIiguKilcIi8sXHJcbiAgICAgICAgY29tcGlsZTogKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgc3Vic2NyaXB0b3JzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9yc1tpaV0uYXBwbHkoc3Vic2NyaXB0b3JzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0b1JldHVybiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuY29uc29sZS5sb2coJ25nLmlmLmpzIGVuZCcpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnbmcudHJhbnNsYXRlLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBpc0V4cHJlc3Npb25cclxufSBmcm9tICcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGV4cHJlc3Npb24sIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihuZXdMYW5ndWFnZSkge1xyXG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobmV3TGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0V4cHJlc3Npb246IGZ1bmN0aW9uKG15VGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNFeHByZXNzaW9uLnRlc3QobXlUZXh0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5pbnN0YW50KHRleHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGUudXNlKG5ld0xhbmd1YWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ25nLnRyYW5zbGF0ZS5qcyBlbmQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qc1xuICoqLyIsImltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxudmFyIGRpcmVjdGl2ZUhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZGlyZWN0aXZlSGFuZGxlcicpO1xyXG5cclxuICAgIGxldCBwcm90byA9IGFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUgfHwgYW5ndWxhci5lbGVtZW50Ll9fcHJvdG9fXztcclxuICAgIHByb3RvLm5nRmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHtcclxuICAgICAgICAgICAgbGVuZ3RoOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB0aGlzW2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xyXG4gICAgfTtcclxuICAgIHByb3RvLmNsaWNrID0gZnVuY3Rpb24obG9jYWxzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gdGhpcy5kYXRhKCduZy1jbGljaycpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2sobG9jYWxzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBjbGljayA9IHRoaXMuZGF0YSgnbmctYmluZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbihjdXJyZW50KSB7XHJcbiAgICAvLyAgICAgbGV0IGV4cHJlc3Npb24gPSBjdXJyZW50WzBdICYmIGN1cnJlbnRbMF0uYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ25nLWNsaWNrJyk7XHJcbiAgICAvLyAgICAgaWYgKGV4cHJlc3Npb24gIT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uICE9PSBudWxsKSB7XHJcbiAgICAvLyAgICAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnZhbHVlO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgZnVuY3Rpb24gam9pbihvYmopIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgb2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iamVjdCwgYXR0cmlidXRlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpIHtcclxuICAgICAgICBvYmplY3QgPSBhbmd1bGFyLmVsZW1lbnQob2JqZWN0KTtcclxuICAgICAgICBvYmplY3QuZGF0YShhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW5zID0gb2JqZWN0LmNoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaWkgPSAwOyBpaSA8IGNoaWxkcmVucy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgYXBwbHlEaXJlY3RpdmVzVG9Ob2RlcyhjaGlsZHJlbnNbaWldLCBhdHRyaWJ1dGVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xyXG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS5BcHBseVRvQ2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBseURpcmVjdGl2ZXNUb05vZGVzKG9iaiwgZGlyZWN0aXZlTmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouZGF0YShkaXJlY3RpdmVOYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbnMgPSBvYmouY2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKGxldCBpaSA9IDA7IGlpIDwgY2hpbGRyZW5zLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBjb21waWxlKGNoaWxkcmVuc1tpaV0sIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udHJvbChjb250cm9sbGVyU2VydmljZSwgb2JqKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcclxuICAgICAgICBpZiAoIWN1cnJlbnQgfHwgIWNvbnRyb2xsZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb21waWxlKGN1cnJlbnQsIGNvbnRyb2xsZXJTZXJ2aWNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2RpcmVjdGl2ZUhhbmRsZXIgZW5kJyk7XHJcbiAgICByZXR1cm4gY29udHJvbDtcclxufSkoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGlyZWN0aXZlSGFuZGxlcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanNcbiAqKi8iLCJjb25zb2xlLmxvZygnY29udHJvbGxlclFNLmpzJyk7XHJcbmltcG9ydCB7XHJcbiAgICBleHRlbmQsXHJcbiAgICBzY29wZUhlbHBlcixcclxuICAgIHNhbml0aXplTW9kdWxlcyxcclxuICAgIFBBUlNFX0JJTkRJTkdfUkVHRVgsXHJcbiAgICBpc0V4cHJlc3Npb25cclxuXHJcbn0gZnJvbSAnLi9jb21tb24uanMnO1xyXG5cclxudmFyICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xyXG5cclxuY2xhc3MgY29udHJvbGxlciB7XHJcbiAgICBzdGF0aWMgcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzLCBsb2NhbHMpIHtcclxuICAgICAgICBjb25zdCBhc3NpZ25CaW5kaW5ncyA9IChkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgbW9kZSkgPT4ge1xyXG4gICAgICAgICAgICBtb2RlID0gbW9kZSB8fCAnPSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhtb2RlKTtcclxuICAgICAgICAgICAgbW9kZSA9IHJlc3VsdFsxXTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXkgPSBjb250cm9sbGVyQXMgKyAnLicgKyBrZXk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnPSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gKGxvY2FscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKHNjb3BlW3BhcmVudEtleV0pKHNjb3BlLCBsb2NhbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdAJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhwID0gaXNFeHByZXNzaW9uLmV4ZWMoc2NvcGVbcGFyZW50S2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEdldCA9ICRwYXJzZShpc0V4cFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRWYWx1ZVdhdGNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSAoc2NvcGVbcGFyZW50S2V5XSB8fCAnJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IG92ZXJ3cml0ZVdpdGhMb2NhbHMgPSAoZGVzdGluYXRpb24pID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGxvY2Fscykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2Fscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gY29udHJvbGxlckFzICYmIGtleSAhPT0gJyRzY29wZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gbG9jYWxzW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xyXG4gICAgICAgIGlmICghYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpICYmIGtleSAhPT0gY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3cml0ZVdpdGhMb2NhbHMoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIGJpbmRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3cml0ZVdpdGhMb2NhbHMoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93ICdDb3VsZCBub3QgcGFyc2UgYmluZGluZ3MnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAkZ2V0KG1vZHVsZU5hbWVzKSB7XHJcbiAgICAgICAgbGV0ICRjb250cm9sbGVyO1xyXG4gICAgICAgIGFuZ3VsYXIuaW5qZWN0b3Ioc2FuaXRpemVNb2R1bGVzKG1vZHVsZU5hbWVzKSkuaW52b2tlKFxyXG4gICAgICAgICAgICBbJyRjb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIChjb250cm9sbGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgc2NvcGUsIGJpbmRpbmdzLCBzY29wZUNvbnRyb2xsZXJOYW1lLCBleHRlbmRlZExvY2Fscykge1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XHJcbiAgICAgICAgICAgIHNjb3BlQ29udHJvbGxlck5hbWUgPSBzY29wZUNvbnRyb2xsZXJOYW1lIHx8ICdjb250cm9sbGVyJztcclxuICAgICAgICAgICAgbGV0IGxvY2FscyA9IGV4dGVuZChleHRlbmRlZExvY2FscyB8fCB7fSwge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlOiBzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5wcm92aWRlQmluZGluZ3MgPSAoYiwgbXlMb2NhbHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvY2FscyA9IG15TG9jYWxzIHx8IGxvY2FscztcclxuICAgICAgICAgICAgICAgIGIgPSBiIHx8IGJpbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSwgbG9jYWxzKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRyb2xsZXI7XHJcbmNvbnNvbGUubG9nKCdjb250cm9sbGVyUU0uanMgZW5kJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29udHJvbGxlci9jb250cm9sbGVyUU0uanNcbiAqKi8iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25maWcoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgndGVzdCcsIFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdlbXB0eUNvbnRyb2xsZXInLCBbZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICdlbXB0eUNvbnRyb2xsZXInO1xyXG4gICAgICAgIH1dKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCd3aXRoSW5qZWN0aW9ucycsIFsnJHEnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbigkcSwgdCkge1xyXG4gICAgICAgICAgICB0aGlzLnEgPSAkcTtcclxuICAgICAgICAgICAgdGhpcy50ID0gdDtcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29udHJvbGxlcignd2l0aEJpbmRpbmdzJywgW2Z1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvdW5kUHJvcGVydHkgPSB0aGlzLmJvdW5kUHJvcGVydHkgKyAnIG1vZGlmaWVkJztcclxuICAgICAgICB9XSlcclxuICAgICAgICAuY29uZmlnKFsnJHRyYW5zbGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICAgVElUTEU6ICdIZWxsbycsXHJcbiAgICAgICAgICAgICAgICBGT086ICdUaGlzIGlzIGEgcGFyYWdyYXBoLicsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19FTjogJ2VuZ2xpc2gnLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfREU6ICdnZXJtYW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdkZScsIHtcclxuICAgICAgICAgICAgICAgIFRJVExFOiAnSGFsbG8nLFxyXG4gICAgICAgICAgICAgICAgRk9POiAnRGllcyBpc3QgZWluIFBhcmFncmFwaC4nLFxyXG4gICAgICAgICAgICAgICAgQlVUVE9OX0xBTkdfRU46ICdlbmdsaXNjaCcsXHJcbiAgICAgICAgICAgICAgICBCVVRUT05fTEFOR19ERTogJ2RldXRzY2gnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2VuJyk7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLm1vY2tTZXJ2aWNlKCckcScsIFtmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgfV0pXHJcbiAgICAgICAgLm1vY2tTZXJ2aWNlKCckdGltZW91dCcsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGphc21pbmUuY3JlYXRlU3B5KCdfX18kdGltZW91dCcpO1xyXG4gICAgICAgIH1dKTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwL2NvbXBsZXRlTGlzdC5qc1xuICoqLyIsImltcG9ydCB7XHJcbiAgICAkX0NPTlRST0xMRVJcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyLFxyXG4gICAgaXNBcnJheUxpa2UsXHJcbiAgICBzYW5pdGl6ZU1vZHVsZXNcclxufSBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVyL2NvbW1vbi5qcyc7XHJcbmltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbnZhciBpbmplY3Rpb25zID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRvUmV0dXJuID0ge1xyXG4gICAgICAgICRyb290U2NvcGU6IHNjb3BlSGVscGVyLiRyb290U2NvcGVcclxuICAgIH07XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbn0pKCk7XHJcbmRlc2NyaWJlKCdVdGlsIGxvZ2ljJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkZXNjcmliZSgnYXJyYXktbGlrZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGFycmF5LWxpa2Ugb2JqZWN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UoYXJndW1lbnRzKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGlzQXJyYXlMaWtlKFtdKSkudG9CZSh0cnVlKTtcclxuICAgICAgICAgICAgY29uc3QgdGVzdE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogMSxcclxuICAgICAgICAgICAgICAgIDA6ICdsYWxhJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBleHBlY3QoaXNBcnJheUxpa2UodGVzdE9iamVjdCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZSh0ZXN0T2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0ZXN0T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgZGVzY3JpYmUoJ3Nhbml0aXplTW9kbGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBlbXB0eSBtb2R1bGVzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNhbml0aXplTW9kdWxlcygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoW10pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZU1vZHVsZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VkIGFkZCBuZyBtb2R1bGUgaXQgaXRzIG5vdCBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoKS5pbmRleE9mKCduZycpKS5ub3QudG9CZSgtMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoW10pLmluZGV4T2YoJ25nJykpLm5vdC50b0JlKC0xKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcyh7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDBcclxuICAgICAgICAgICAgfSkuaW5kZXhPZignbmcnKSkubm90LnRvQmUoLTEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFkZCBuZyBub3IgYW5ndWxhciB0byB0aGUgYXJyYXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNhbml0aXplTW9kdWxlcygnbmcnKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzYW5pdGl6ZU1vZHVsZXMoJ2FuZ3VsYXInKS5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBwYXNzaW5nIGFycmF5cy1saWtlIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0MSA9IFsnbW9kdWxlMScsICdtb2R1bGUyJ107XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDIgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdDMgPSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDIsXHJcbiAgICAgICAgICAgICAgICAwOiAnbW9kdWxlMScsXHJcbiAgICAgICAgICAgICAgICAxOiAnbW9kdWxlMidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgW29iamVjdDEsIG9iamVjdDIsIG9iamVjdDNdLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzYW5pdGl6ZU1vZHVsZXModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKHZhbHVlLmxlbmd0aCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGRlZmF1bHQgbmcvYW5ndWxhciBtb2R1bGUgdG8gdGhlIGZpcnN0IHBvc2l0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDEgPSBzYW5pdGl6ZU1vZHVsZXMoWydtb2R1bGUxJywgJ21vZHVsZTInLCAnbmcnXSksXHJcbiAgICAgICAgICAgICAgICByZXN1bHQyID0gc2FuaXRpemVNb2R1bGVzKFsnbW9kdWxlMScsICdtb2R1bGUyJywgJ2FuZ3VsYXInXSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQxWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0MS5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQyWzBdKS50b0JlKCduZycpO1xyXG4gICAgICAgICAgICBleHBlY3QocmVzdWx0Mi5sZW5ndGgpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdzY29wZUhlbHBlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgc2NvcGUgd2hlbiBubyBhcmd1bWVudHMgd2hlcmUgZ2l2ZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZSgpLiRyb290KS50b0JlKGluamVjdGlvbnMuJHJvb3RTY29wZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNhbWUgc2NvcGUgcmVmZXJlbmNlIHdoZW4gaXQgcmVjZWl2ZSBhIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkpLnRvQmUoc2NvcGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBzYW1lIHNjb3BlIHJlZmVyZW5jZSB3aGVuIGl0IHJlY2VpdmVzIGFuIGlzb2xhdGVkIHNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gaW5qZWN0aW9ucy4kcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpKS50b0JlKHNjb3BlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiBhbiBzY29wZSB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGEgcGFzc2VkIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b1Bhc3MgPSB7XHJcbiAgICAgICAgICAgICAgICBhOiB7fSwgLy8gZm9yIHJlZmVyZW5jZSBjaGVja2luZ1xyXG4gICAgICAgICAgICAgICAgYjoge31cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHJldHVybmVkU2NvcGU7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybmVkU2NvcGUgPSBzY29wZUhlbHBlci5jcmVhdGUodG9QYXNzKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHJldHVybmVkU2NvcGUuYSkudG9CZSh0b1Bhc3MuYSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChyZXR1cm5lZFNjb3BlLmIpLnRvQmUodG9QYXNzLmIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQga25vdyB3aGVuIGFuIG9iamVjdCBpcyBhIGNvbnRyb2xsZXIgQ29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlck9iaiA9IGNvbnRyb2xsZXJIYW5kbGVyLnNldFNjb3BlKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdzb21ldGhpbmcnXHJcbiAgICAgICAgICAgIH0pLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICc9J1xyXG4gICAgICAgICAgICB9KS5uZXcoJ3dpdGhCaW5kaW5ncycpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KCRfQ09OVFJPTExFUi5pc0NvbnRyb2xsZXIoY29udHJvbGxlck9iaikpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3Rlc3QvY29udHJvbGxlci9jb21tb24uc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJztcclxuaW1wb3J0IHtcclxuICAgIHNjb3BlSGVscGVyXHJcbn0gZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlci9jb21tb24uanMnO1xyXG5kZXNjcmliZSgnY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBhICRnZXQgbWV0aG9kIHdoaWNoIHJldHVybiBhIGNvbnRyb2xsZXIgZ2VuZXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuJGdldCkudG9CZURlZmluZWQoKTtcclxuICAgICAgICBleHBlY3QoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgICAgZXhwZWN0KGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyLiRnZXQoKS5jcmVhdGUpKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnJGdldCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyQ3JlYXRvcjtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyQ3JlYXRvciA9IGNvbnRyb2xsZXIuJGdldCgndGVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgdmFsaWQgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkubmFtZSkudG9CZSgnZW1wdHlDb250cm9sbGVyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29udHJvbGxlcnMgd2l0aCBpbmplY3Rpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhJbmplY3Rpb25zJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyKCkucSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3JlYXRpbmcgYSBjb250cm9sbGVyIHdpdGggYW4gc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnZW1wdHlDb250cm9sbGVyJywge30pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcikudG9CZURlZmluZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIHNldCBhIHByb3BlcnR5IGluIHRoZSBzY29wZSBmb3IgdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZUhlbHBlci4kcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjEgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHNjb3BlLCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLiQkY2hpbGRIZWFkLmNvbnRyb2xsZXIpLnRvQmUoY29udHJvbGxlcjEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgc2V0IGEgcHJvcGVydHkgaW4gdGhlIHNjb3BlIGZvciB0aGUgY29udHJvbGxlciB3aXRoIHRoZSBnaXZlbiBuYW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIxID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCBzY29wZSwgZmFsc2UsICdteUNvbnRyb2xsZXInKSgpO1xyXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUuJCRjaGlsZEhlYWQubXlDb250cm9sbGVyKS50b0JlKGNvbnRyb2xsZXIxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnYmluZGluZ3MnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IFwidHJ1ZVwiIGFuZCBcIj1cIiBhcyBiaW5kVG9Db250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIxLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlcjIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ3dpdGhCaW5kaW5ncycsIHtcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSwgJz0nKSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIyLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgYmluZCBpZiBiaW5kVG9Db250cm9sbGVyIGlzIFwiZmFsc2VcIiBvciBcInVuZGVmaW5lZFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyMSA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyMS5ib3VuZFByb3BlcnR5KS50b0JlKCd1bmRlZmluZWQgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ1NvbWV0aGluZydcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcjIuYm91bmRQcm9wZXJ0eSkudG9CZSgndW5kZWZpbmVkIG1vZGlmaWVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGVzY3JpYmUoJ2JpbmRUb0NvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBiaW5kVG9Db250cm9sbGVyIGFzIGFuIG9iamVjdCBmb3IgXCI9XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCd3aXRoQmluZGluZ3MnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdTb21ldGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlcigpLmJvdW5kUHJvcGVydHkpLnRvQmUoJ1NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYmluZFRvQ29udHJvbGxlciBhcyBhbiBvYmplY3QgZm9yIFwiQFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDcmVhdG9yLmNyZWF0ZSgnd2l0aEJpbmRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnU29tZXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ0AnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIoKS5ib3VuZFByb3BlcnR5KS50b0JlKCdTb21ldGhpbmcgbW9kaWZpZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGJpbmRUb0NvbnRyb2xsZXIgYXMgYW4gb2JqZWN0IGZvciBcIiZcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sbGVyID0gY29udHJvbGxlckNyZWF0b3IuY3JlYXRlKCdlbXB0eUNvbnRyb2xsZXInLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICdvdGhlclByb3BlcnR5LmpvaW4oXCJcIiknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclByb3BlcnR5OiBbMSwgMiwgM11cclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kUHJvcGVydHk6ICcmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSgpKS50b0JlKCcxMjMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGl0KCdleHByZXNzaW9ucyBzaG91bGQgYWxsb3cgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyQ3JlYXRvci5jcmVhdGUoJ2VtcHR5Q29udHJvbGxlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ290aGVyUHJvcGVydHkuam9pbihcIlwiKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyUHJvcGVydHk6IFsxLCAyLCAzXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJyYnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlciA9IGNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJQcm9wZXJ0eTogWydhJywgJ2InLCAnYyddXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRvQmUoJ2FiYycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuXHJcbmRlc2NyaWJlKCdjb250cm9sbGVySGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ215TW9kdWxlJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvbnRyb2xsZXJIYW5kbGVyIHdoZW4gYWRkaW5nIG1vZHVsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlckhhbmRsZXIuYWRkTW9kdWxlcygnbXlNb2R1bGUnKSkudG9CZShjb250cm9sbGVySGFuZGxlcik7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzKCd0ZXN0Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXJPYmo7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iaikudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJTY29wZSkudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlclNjb3BlLiRwYXJlbnQpLnRvQmUoY29udHJvbGxlck9iai5wYXJlbnRTY29wZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZSkudG9CZVVuZGVmaW5lZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai51c2VkTW9kdWxlcykudG9FcXVhbChbJ3Rlc3QnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyBhIGNvbnRyb2xsZXIgd2l0aCBiaW5kaW5ncycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJ3NvbWV0aGluZydcclxuICAgICAgICAgICAgfSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgIH0pLm5ldygnd2l0aEJpbmRpbmdzJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNyZWF0ZSgpKS50b0JlKGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ3NvbWV0aGluZyBtb2RpZmllZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgdG8gY2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBiaW5kaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWFsczogZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHQ6ICdieVRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246ICdieVRleHQudG9VcHBlckNhc2UoKSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVhbHNSZXN1bHQ6ICc9ZXF1YWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBieVRleHRSZXN1bHQ6ICdAYnlUZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uUmVzdWx0OiAnJmV4cHJlc3Npb24nXHJcbiAgICAgICAgICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5jb250cm9sbGVySW5zdGFuY2UuZXF1YWxzUmVzdWx0KS50b0JlKHNjb3BlLmVxdWFscyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLmNvbnRyb2xsZXJJbnN0YW5jZS5ieVRleHRSZXN1bHQpLnRvQmUoc2NvcGUuYnlUZXh0KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJPYmouY29udHJvbGxlckluc3RhbmNlLmV4cHJlc3Npb25SZXN1bHQoKSkudG9CZShzY29wZS5ieVRleHQudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ1dhdGNoZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzY29wZSwgY29udHJvbGxlck9iajtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGFkZGluZyB3YXRjaGVycycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRQcm9wZXJ0eSA9ICdsYWxhJztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmogPSBjb250cm9sbGVySGFuZGxlci5zZXRTY29wZShzY29wZSkuYmluZFdpdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BlcnR5OiAnPSdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai5jb250cm9sbGVyU2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoYXJncykudG9CZURlZmluZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIGNvbnRyb2xsZXIgaW50byB0aGUgc2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gY29udHJvbGxlck9iai53YXRjaCgnY29udHJvbGxlci5ib3VuZFByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIH0pLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgnbGFsYScpO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5ib3VuZFByb3BlcnR5ID0gJ2xvbG8nO1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlck9iai4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkpLnRvQmUoJ2xvbG8nKTtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmoucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgcmVmbGVjIGNoYW5nZXMgb24gdGhlIHNjb3BlIGludG8gdGhlIGNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kUHJvcGVydHkgPSAnbGFsYSc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJPYmouJGFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGl0KCdzaG91bGQgZ2l2ZSB0aGUgcGFyZW50IHNjb3BlIHByaXZpbGVnZSBvdmVyIHRoZSBjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUoc2NvcGUpLmJpbmRXaXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmRQcm9wZXJ0eTogJz0nXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAubmV3KCd3aXRoSW5qZWN0aW9ucycpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJPYmouY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLnBhcmVudFNjb3BlLmJvdW5kUHJvcGVydHkgPSAncGFyZW50JztcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSA9ICdjaGlsZCc7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYm91bmRQcm9wZXJ0eSkudG9CZSgncGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBleHBlY3QoY29udHJvbGxlck9iai5wYXJlbnRTY29wZS5ib3VuZFByb3BlcnR5KS50b0JlKCdwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdkZXN0cm95aW5nIGEgY29udHJvbGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBjb250cm9sbGVyT2JqO1xyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGRlc3Ryb3lpbmcgdGhlIG9iamVjdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyT2JqID0gY29udHJvbGxlckhhbmRsZXIubmV3KCdlbXB0eUNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgY29udHJvbGxlck9iai4kZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuZGVzY3JpYmUoJ2NvbnRyb2xsZXJTcGllcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgdW5pcXVlT2JqZWN0ID0gZnVuY3Rpb24gdW5pcXVlT2JqZWN0KCkge307XHJcbiAgICBsZXQgY29udHJvbGxlckNvbnN0cnVjdG9yO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVySGFuZGxlci5jbGVhbigpO1xyXG4gICAgICAgIGlmIChjb250cm9sbGVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlckNvbnN0cnVjdG9yLiRkZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMoJ3Rlc3QnKS5iaW5kV2l0aCh7XHJcbiAgICAgICAgICAgIGE6ICc9JyxcclxuICAgICAgICAgICAgYjogJ0AnLFxyXG4gICAgICAgICAgICBjOiAnJidcclxuICAgICAgICB9KS5zZXRTY29wZSh7XHJcbiAgICAgICAgICAgIGE6IHVuaXF1ZU9iamVjdCxcclxuICAgICAgICAgICAgYjogJ2InLFxyXG4gICAgICAgICAgICBjOiAnYSdcclxuICAgICAgICB9KS5uZXcoJ2VtcHR5Q29udHJvbGxlcicpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzcGllcyBmb3IgZWFjaCBCb3VuZGVkIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5jcmVhdGUoKTtcclxuICAgICAgICBjb25zdCBteVNweSA9IGNvbnRyb2xsZXJDb25zdHJ1Y3Rvci5JbnRlcm5hbFNwaWVzLlNjb3BlWydhOmEnXTtcclxuICAgICAgICBleHBlY3QobXlTcHkpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICAgICAgY29udHJvbGxlci5hID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBteVNweS50b29rKCkgPT09ICdudW1iZXInKS50b0JlKHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS50b29rKCkpLnRvQmUobXlTcHkudG9vaygpKTtcclxuICAgICAgICBleHBlY3QobXlTcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICBjb250cm9sbGVyQ29uc3RydWN0b3IuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15U3B5LmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2NvbnRyb2xsZXJIYW5kbGVyL3NwaWVzLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgZGlyZWN0aXZlUHJvdmlkZXIgZnJvbSAnLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcyc7XHJcbmRlc2NyaWJlKCdkaXJlY3RpdmVQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSAkZ2V0IG1ldGhvZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlUHJvdmlkZXIuJGdldCkpLnRvQmUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBhbmQgbm90IHRocm93IGlzIHRoZSBkaXJlY3RpdmUgZG9lcyBub3QgZXhpc3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgcmV0dXJuZWQgPSB7fTtcclxuICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybmVkID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbm90IGV4aXN0aW5nJyk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICBleHBlY3QocmV0dXJuZWQpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgW1xyXG4gICAgICAgICduZy1pZicsXHJcbiAgICAgICAgJ25nOmlmJyxcclxuICAgICAgICAnbmdJZicsXHJcbiAgICAgICAgJ25nLXJlcGVhdCcsXHJcbiAgICAgICAgJ25nLWNsaWNrJyxcclxuICAgICAgICAnbmctZGlzYWJsZWQnLFxyXG4gICAgICAgICduZy1iaW5kJyxcclxuICAgICAgICAnbmctbW9kZWwnLFxyXG4gICAgICAgICd0cmFuc2xhdGUnLFxyXG4gICAgICAgICd0cmFuc2xhdGUtdmFsdWUnLFxyXG4gICAgICAgICduZy1jbGFzcydcclxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbHdheXMgY29udGFpbiB0aGUgJyArIGl0ZW0gKyAnZGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KGl0ZW0pKS50b0JlRGVmaW5lZChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCdwdXRzIGFuZCB1c2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNweTtcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBzcHkuYW5kLnJldHVyblZhbHVlKHNweSk7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRjbGVhbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgYWRkaW5nIGRpcmVjdGl2ZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLnRvQmUoc3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ215OmRpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteURpcmVjdGl2ZScpKS50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBvdmVyd3JpdGluZywgYnV0IHByZXNlcnZlIGZpcnN0IHZlcnNpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVByb3ZpZGVyLiRwdXQoJ215LWRpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge30pO1xyXG4gICAgICAgICAgICB9KS50b1Rocm93KCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShzcHkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdhbGxvdyBtZSB0byBvdmVyd3JpdGUgd2l0aCBhIHRoaXJkIHBhcmFtZXRlciBpbiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIHRydWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGlyZWN0aXZlUHJvdmlkZXIuJHB1dCgnbXktZGlyZWN0aXZlJywgc3B5KTtcclxuICAgICAgICAgICAgY29uc3QgYW5vdGhlclNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XHJcbiAgICAgICAgICAgIGFub3RoZXJTcHkuYW5kLnJldHVyblZhbHVlKGFub3RoZXJTcHkpO1xyXG4gICAgICAgICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVQcm92aWRlci4kcHV0KCdteS1kaXJlY3RpdmUnLCBhbm90aGVyU3B5LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgICAgICBleHBlY3QoZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbXktZGlyZWN0aXZlJykpLm5vdC50b0JlKHNweSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCdteS1kaXJlY3RpdmUnKSkudG9CZShhbm90aGVyU3B5KTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgICAgICBleHBlY3QoYW5vdGhlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgY29udHJvbGxlckhhbmRsZXIgZnJvbSAnLi8uLi8uLi9zcmMvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnO1xyXG5pbXBvcnQgZGlyZWN0aXZlSGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnO1xyXG5kZXNjcmliZSgnZGlyZWN0aXZlSGFuZGxlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBzcHksIGNvbnRyb2xsZXI7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdjbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIGFTdHJpbmc6ICdhVmFsdWUnLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246IHNweSxcclxuICAgICAgICAgICAgYUtleTogJ0hFTExPJyxcclxuICAgICAgICAgICAgYUludDogMFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYVN0cmluZzogJz0nLFxyXG4gICAgICAgICAgICBhRnVuY3Rpb246ICcmJyxcclxuICAgICAgICAgICAgYUtleTogJ0AnLFxyXG4gICAgICAgICAgICBhSW50OiAnPSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcclxuICAgICAgICBjb250cm9sbGVyID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlckluc3RhbmNlO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZGlyZWN0aXZlSGFuZGxlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjcmVhdGUgbmV3IGluc3RhbmNlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV3IGRpcmVjdGl2ZUhhbmRsZXIoKTtcclxuICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gY29tcGlsZSBodG1sJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYvPicpO1xyXG4gICAgICAgIH0pLm5vdC50b1Rocm93KCk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCduZ0NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjYWxsIG5nLWNsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctY2xpY2s9XCJjdHJsLmFTdHJpbmcgPSBcXCdhbm90aGVyVmFsdWVcXCdcIi8+Jyk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuY2xpY2soKTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYVN0cmluZykudG9CZSgnYW5vdGhlclZhbHVlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgZmFpbCBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJ2EnKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgdGhlIHNlbGVjdGVkIGRvZXMgbm90IGhhdmUgdGhlIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgLz4nKTtcclxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5jbGljaygpO1xyXG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYXBwbHkgdGhlIGNsaWNrIGV2ZW50IHRvIGVhY2ggb2YgaXRzIGNoaWxkcmVucyAoaWYgbmVlZGVkKScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgYCAgIDxkaXYgbmctY2xpY2s9XCJjdHJsLmFJbnQgPSBjdHJsLmFJbnQgKyAxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nZmlyc3QnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdzZWNvbmQnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSd0aGlyZCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Lz5gKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNmaXJzdCcpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjc2Vjb25kJykuY2xpY2soKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyN0aGlyZCcpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoMyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGxvY2FscyAoZm9yIHRlc3RpbmcpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIGAgICA8ZGl2IG5nLWNsaWNrPVwiY3RybC5hSW50ID0gIHZhbHVlICsgY3RybC5hSW50IFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J2ZpcnN0Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nc2Vjb25kJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0ndGhpcmQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdi8+YCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIubmdGaW5kKCcjZmlyc3QnKS5jbGljayh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTAwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuYUludCkudG9CZSgxMDAwKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyNzZWNvbmQnKS5jbGljayh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogJydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFJbnQpLnRvQmUoJzEwMDAnKTtcclxuICAgICAgICAgICAgaGFuZGxlci5uZ0ZpbmQoJyN0aGlyZCcpLmNsaWNrKHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hSW50KS50b0JlKCcxMTAwMCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBkZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBjYWxsIHRleHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBkaXJlY3RpdmVIYW5kbGVyKGNvbnRyb2xsZXJTZXJ2aWNlLCAnPGRpdiBuZy1iaW5kPVwiY3RybC5hU3RyaW5nXCIvPicpO1xyXG4gICAgICAgICAgICBleHBlY3QoaGFuZGxlci50ZXh0KCkpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICAgICAgaGFuZGxlci50ZXh0KCduZXdWYWx1ZScpO1xyXG4gICAgICAgICAgICBleHBlY3QoY29udHJvbGxlci5hU3RyaW5nKS50b0JlKCduZXdWYWx1ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgbWUgdG8gY2hhbmdlIHRoZSBjb250cm9sbGVyIHZhbHVlLCBvbmUgbGV0dGVyIGF0IHRoZSB0aW1lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgZGlyZWN0aXZlSGFuZGxlcihjb250cm9sbGVyU2VydmljZSwgJzxkaXYgbmctYmluZD1cImN0cmwuYVN0cmluZ1wiLz4nKTtcclxuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2Uud2F0Y2goJ2N0cmwuYVN0cmluZycsIHNweSk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIudGV4dCgnbmV3VmFsdWUnLnNwbGl0KCcnKSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChjb250cm9sbGVyLmFTdHJpbmcpLnRvQmUoJ25ld1ZhbHVlJyk7XHJcbiAgICAgICAgICAgIGV4cGVjdChzcHkuY2FsbHMuY291bnQoKSkudG9CZSgnbmV3VmFsdWUnLmxlbmd0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdJZicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUlmO1xyXG4gICAgY29uc3QgbmdJZiA9IGRpcmVjdGl2ZVByb3ZpZGVyLiRnZXQoJ25nLWlmJyk7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlID0gY29udHJvbGxlckhhbmRsZXIuY2xlYW4oKS5hZGRNb2R1bGVzKCd0ZXN0JykubmV3U2VydmljZSgnZW1wdHlDb250cm9sbGVyJywgJ2N0cmwnLCB7XHJcbiAgICAgICAgICAgIG15Qm9vbGVhbjogdHJ1ZVxyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15SWYgPSBuZ0lmLmNvbXBpbGUoJ2N0cmwubXlCb29sZWFuJywgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBteUlmJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15SWYpLnRvQmVEZWZpbmVkKCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBpZiBubyAkZGlnZXN0IHdhcyBleGVjdXRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChteUlmLnZhbHVlKCkpLnRvQmVVbmRlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGxhdGVzdCBldmFsdWF0ZWQgdmFsdWUgb24gYSB3YXRjaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJJbnN0YW5jZS5teUJvb2xlYW4gPSBhbmd1bGFyLm5vb3A7XHJcbiAgICAgICAgZXhwZWN0KG15SWYudmFsdWUoKSkubm90LnRvQmUoYW5ndWxhci5ub29wKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICBleHBlY3QobXlJZi52YWx1ZSgpKS50b0JlKGFuZ3VsYXIubm9vcCk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYXR0YWNoaW5nIHNweXMgdG8gdGhlIHdhdGNoaW5nIGN5Y2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgbXlTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIG15SWYobXlTcHkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGFsbG93IGRlYXR0YWNoaW5nIHNwaWVzIHRvIHRoZSB3YXRjaGluZyBjeWNsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBjb25zdCB3YXRjaGVyID0gbXlJZihteVNweSk7XHJcbiAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBvbmx5IGRlYXR0YWNoIHRoZSBjb3JyZWNwb25kaW5nIHNweScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG15U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcclxuICAgICAgICBjb25zdCBteVNweTIgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgIGNvbnN0IHdhdGNoZXIgPSBteUlmKG15U3B5KTtcclxuICAgICAgICBteUlmKG15U3B5Mik7XHJcbiAgICAgICAgd2F0Y2hlcigpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xyXG4gICAgICAgIGV4cGVjdChteVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBleHBlY3QobXlTcHkyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi90ZXN0L2RpcmVjdGl2ZXMvbmdJZi5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdCaW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15QmluZCwgc3B5LCBjb250cm9sbGVyO1xyXG4gICAgY29uc3QgbmdCaW5kID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmdCaW5kJyk7XHJcbiAgICBjb25zdCBleHByZXNzaW9uID0gJ2N0cmwubXlTdHJpbmdQYXJhbWV0ZXInO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge30sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVySW5zdGFuY2U7XHJcbiAgICAgICAgbXlCaW5kID0gbmdCaW5kLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGJlIGRlZmluZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlCaW5kKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aGUgY29udHJvbGxlciB3aGVuIHJlY2VpdmluZyBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG15QmluZCgnYVZhbHVlJyk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGZpcmUgYW4gZGlnZXN0IHdoZW4gZG9pbmcgYW5kIGFzc2lnbWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICBteUJpbmQoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgY3VycmVudCBzdGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIgPSAnc29tZVZhbHVlJztcclxuICAgICAgICBleHBlY3QobXlCaW5kKCkpLnRvQmUoJ3NvbWVWYWx1ZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIG5vdCBmaXJlIGRpZ2VzdHMgd2hlbiBjb25zdWx0aW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdzb21lVmFsdWUnO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIHNweSk7XHJcbiAgICAgICAgbXlCaW5kKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBhcnJheSB0byBmaXJlIGNoYW5nZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBvYmplY3RbbmV3VmFsdWVdID0gIW9iamVjdFtuZXdWYWx1ZV0gPyAxIDogb2JqZWN0W25ld1ZhbHVlXSArIDE7IC8vY291bnRpbmcgdGhlIGNhbGxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXlCaW5kKFsnYScsICdWJywgJ2EnLCAnbCcsICd1JywgJ2UnXSk7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXIubXlTdHJpbmdQYXJhbWV0ZXIpLnRvQmUoJ2FWYWx1ZScpO1xyXG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVjogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsOiAxLCAvL29ubHkgb25jZVxyXG4gICAgICAgICAgICBhVmFsdTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHVlOiAxIC8vb25seSBvbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgYWxsb3cgYSBzZWNvbmQgdHJ1ZSBwYXJhbWV0ZXIsIHRvIHNpbXVsYXRlIHRoZSBhcnJheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHt9O1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtuZXdWYWx1ZV0gPSAhb2JqZWN0W25ld1ZhbHVlXSA/IDEgOiBvYmplY3RbbmV3VmFsdWVdICsgMTsgLy9jb3VudGluZyB0aGUgY2FsbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBteUJpbmQoJ2FWYWx1ZScsIHRydWUpO1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyLm15U3RyaW5nUGFyYW1ldGVyKS50b0JlKCdhVmFsdWUnKTtcclxuICAgICAgICBleHBlY3Qob2JqZWN0KS50b0VxdWFsKHtcclxuICAgICAgICAgICAgYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVY6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYTogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbDogMSwgLy9vbmx5IG9uY2VcclxuICAgICAgICAgICAgYVZhbHU6IDEsIC8vb25seSBvbmNlXHJcbiAgICAgICAgICAgIGFWYWx1ZTogMSAvL29ubHkgb25jZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSBjaGFuZ2VzIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15QmluZC5jaGFuZ2VzKS50b0VxdWFsKGphc21pbmUuYW55KEZ1bmN0aW9uKSk7XHJcbiAgICB9KTtcclxuICAgIGRlc2NyaWJlKCdjaGFuZ2VzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2NoYW5nZXMgc2hvdWxkIG9ubHkgZmlyZSBvbmNlIHBlciBjaGFuZ2UgKGluZGVwZW5kZW50IG9mIHdhdGNoZXIpJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGNoZXJTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCB3YXRjaGVyU3B5KTtcclxuICAgICAgICAgICAgbXlCaW5kLmNoYW5nZXMoc3B5KTtcclxuICAgICAgICAgICAgbXlCaW5kKCdhVmFsdWUnLCB0cnVlKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5teVN0cmluZ1BhcmFtZXRlciA9ICdhbm90aGVyVmFsdWUnO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgZXhwZWN0KHNweS5jYWxscy5jb3VudCgpKS50b0JlKDYpO1xyXG4gICAgICAgICAgICBleHBlY3Qod2F0Y2hlclNweS5jYWxscy5jb3VudCgpKS50b0JlKDcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQmluZC5zcGVjLmpzXG4gKiovIiwiaW1wb3J0IGNvbnRyb2xsZXJIYW5kbGVyIGZyb20gJy4vLi4vLi4vc3JjL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJztcclxuaW1wb3J0IGRpcmVjdGl2ZVByb3ZpZGVyIGZyb20gJy4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnO1xyXG5kZXNjcmliZSgnbmdDbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJTZXJ2aWNlLCBteUNsaWNrLCBzcHk7XHJcbiAgICBjb25zdCBuZ0NsaWNrID0gZGlyZWN0aXZlUHJvdmlkZXIuJGdldCgnbmdDbGljaycpO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2xpY2snKTtcclxuICAgICAgICBjb250cm9sbGVyU2VydmljZSA9IGNvbnRyb2xsZXJIYW5kbGVyLmNsZWFuKCkuYWRkTW9kdWxlcygndGVzdCcpLm5ld1NlcnZpY2UoJ2VtcHR5Q29udHJvbGxlcicsICdjdHJsJywge1xyXG4gICAgICAgICAgICBteVNweTogc3B5XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgbXlDbGljayA9IG5nQ2xpY2suY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgJ2N0cmwubXlTcHkocGFyYW0xLCBwYXJhbTIpJyk7XHJcbiAgICB9KTtcclxuICAgIGl0KCdzaG91bGQgaGF2ZSBkZWZpbmVkIG15SWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QobXlDbGljaykudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KG15Q2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjYWxsaW5nIGl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgfSkubm90LnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRoZSBzcHkgd2hlbiBjYWxsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBteUNsaWNrKCk7XHJcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgbG9jYWxzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MSA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MiA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge1xyXG4gICAgICAgICAgICBwYXJhbTE6IG9iamVjdDEsXHJcbiAgICAgICAgICAgIHBhcmFtMjogb2JqZWN0MlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG9iamVjdDEsIG9iamVjdDIpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nQ2xpY2suc3BlYy5qc1xuICoqLyIsImltcG9ydCBjb250cm9sbGVySGFuZGxlciBmcm9tICcuLy4uLy4uL3NyYy9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyc7XHJcbmltcG9ydCBkaXJlY3RpdmVQcm92aWRlciBmcm9tICcuLy4uLy4uL3NyYy9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJztcclxuZGVzY3JpYmUoJ25nVHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlclNlcnZpY2UsIG15VHJhbnNsYXRlO1xyXG4gICAgY29uc3QgbmdUcmFuc2xhdGUgPSBkaXJlY3RpdmVQcm92aWRlci4kZ2V0KCd0cmFuc2xhdGUnKTtcclxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29udHJvbGxlclNlcnZpY2UgPSBjb250cm9sbGVySGFuZGxlci5jbGVhbigpLmFkZE1vZHVsZXMoJ3Rlc3QnKS5uZXdTZXJ2aWNlKCdlbXB0eUNvbnRyb2xsZXInLCAnY3RybCcsIHtcclxuICAgICAgICAgICAgcHJvcDogJ0hFTExPJ1xyXG4gICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xyXG4gICAgICAgIG15VHJhbnNsYXRlID0gbmdUcmFuc2xhdGUuY29tcGlsZSgnY3RybC5wcm9wJywgY29udHJvbGxlclNlcnZpY2UpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9kaXJlY3RpdmVzL25nVHJhbnNsYXRlLnNwZWMuanNcbiAqKi8iLCJpbXBvcnQgcXVpY2ttb2NrIGZyb20gJy4vLi4vc3JjL3F1aWNrbW9jay5qcyc7XHJcbmRlc2NyaWJlKCdxdWlja21vY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBjb250cm9sbGVyTW9ja2VyO1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyID0gcXVpY2ttb2NrKHtcclxuICAgICAgICAgICAgcHJvdmlkZXJOYW1lOiAnd2l0aEluamVjdGlvbnMnLFxyXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGVzdCcsXHJcbiAgICAgICAgICAgIG1vY2tNb2R1bGVzOiBbXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgZGVmaW5lZCBhIGNvbnRyb2xsZXJNb2NrZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG1vZGlmaWVkIGFuZ3VsYXIgbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChxdWlja21vY2subW9ja0hlbHBlcikudG9CZURlZmluZWQoKTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBpbmplY3QgbW9ja2VkIG9iamVjdCBmaXJzdCwgdGhlbiByZWFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRyb2xsZXJNb2NrZXIudC5hbmQuaWRlbnRpdHkoKSkudG9CZSgnX19fJHRpbWVvdXQnKTtcclxuICAgICAgICBjb250cm9sbGVyTW9ja2VyLnQoKTtcclxuICAgICAgICBleHBlY3QoY29udHJvbGxlck1vY2tlci50KS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxufSk7XHJcbmRlc2NyaWJlKCdjb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgY29udHJvbGxlck1vY2tlciwgc3B5O1xyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbWFnaWNDbGljaycpO1xyXG4gICAgICAgIGNvbnRyb2xsZXJNb2NrZXIgPSBxdWlja21vY2soe1xyXG4gICAgICAgICAgICBwcm92aWRlck5hbWU6ICdlbXB0eUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGVzdCcsXHJcbiAgICAgICAgICAgIG1vY2tNb2R1bGVzOiBbXSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50U2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6IHNweVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBzb21ldGhpbmdUb0NhbGw6ICc9J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBtZSB0byBwZXJmb3JtIGNsaWNrcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV4cGVjdChjb250cm9sbGVyTW9ja2VyLm5nQ2xpY2spLnRvRXF1YWwoamFzbWluZS5hbnkoRnVuY3Rpb24pKTtcclxuICAgICAgICBjb25zdCBteUNsaWNrID0gY29udHJvbGxlck1vY2tlci5uZ0NsaWNrKCdjdHJsLnNvbWV0aGluZ1RvQ2FsbChhT2JqLCBiT2JqKScpLFxyXG4gICAgICAgICAgICByZWZlcmVuY2UxID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgcmVmZXJlbmNlMiA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIGxvY2FscyA9IHtcclxuICAgICAgICAgICAgICAgIGFPYmo6IHJlZmVyZW5jZTEsXHJcbiAgICAgICAgICAgICAgICBiT2JqOiByZWZlcmVuY2UyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgbXlDbGljayhsb2NhbHMpO1xyXG4gICAgICAgIGV4cGVjdChzcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlZmVyZW5jZTEsIHJlZmVyZW5jZTIpO1xyXG4gICAgfSk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vdGVzdC9xdWlja21vY2suc3BlYy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=