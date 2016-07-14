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
/* 2 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(3);
	
	var _controllerHandlerExtensions = __webpack_require__(5);
	
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
	
	var _directiveHandler = __webpack_require__(14);
	
	var _controllerQM = __webpack_require__(16);
	
	var _controllerQM2 = _interopRequireDefault(_controllerQM);
	
	var _common = __webpack_require__(3);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ngModel = __webpack_require__(7);
	
	var _ngClick = __webpack_require__(8);
	
	var _ngIf = __webpack_require__(9);
	
	var _ngTranslate = __webpack_require__(10);
	
	var _ngBind = __webpack_require__(11);
	
	var _ngClass = __webpack_require__(12);
	
	var _common = __webpack_require__(3);
	
	var _ngRepeat = __webpack_require__(13);
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngModelDirective = ngModelDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngTranslateDirective = ngTranslateDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngClassDirective = ngClassDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ngRepeatDirective = ngRepeatDirective;
	
	var _common = __webpack_require__(3);
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _directiveProvider = __webpack_require__(6);
	
	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);
	
	var _attribute = __webpack_require__(15);
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _common = __webpack_require__(3);
	
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _common = __webpack_require__(3);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTc4MDlhMGJkNmNhYWY0MTAyZTUiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvaW5kZXgubG9hZGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L3F1aWNrbW9jay5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9xdWlja21vY2subW9ja0hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBLHdCOzs7Ozs7QUNGQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx1Q0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBbUMsNkJBQTZCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsK0NBQStDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTJDLFlBQVk7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsRUFBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsRTs7Ozs7O0FDNVNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNB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LGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLHNFQUFxRTtBQUNyRTtBQUNBLGtCQUFpQjs7QUFFakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0EsRUFBQzs7QUFFRCw4QiIsImZpbGUiOiIuL2J1aWx0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBhNzgwOWEwYmQ2Y2FhZjQxMDJlNVxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9xdWlja21vY2suanMnKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvaW5kZXgubG9hZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcXVpY2ttb2NrTW9ja0hlbHBlciA9IHJlcXVpcmUoJy4vcXVpY2ttb2NrLm1vY2tIZWxwZXIuanMnKTtcblxudmFyIF9xdWlja21vY2tNb2NrSGVscGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3F1aWNrbW9ja01vY2tIZWxwZXIpO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxudmFyIF9jb250cm9sbGVySGFuZGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuanMnKTtcblxudmFyIF9jb250cm9sbGVySGFuZGxlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb250cm9sbGVySGFuZGxlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBtb2NrZXIgPSBmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIHZhciBvcHRzLCBtb2NrUHJlZml4O1xuICAgIHZhciBjb250cm9sbGVyRGVmYXVsdHMgPSBmdW5jdGlvbiBjb250cm9sbGVyRGVmYXVsdHMoZmxhZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIHBhcmVudFNjb3BlOiB7fSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRyb2xsZXInLFxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhZmxhZ1xuICAgICAgICB9O1xuICAgIH07XG4gICAgcXVpY2ttb2NrLk1PQ0tfUFJFRklYID0gbW9ja1ByZWZpeCA9IHF1aWNrbW9jay5NT0NLX1BSRUZJWCB8fCAnX19fJztcbiAgICBxdWlja21vY2suVVNFX0FDVFVBTCA9ICdVU0VfQUNUVUFMX0lNUExFTUVOVEFUSU9OJztcbiAgICBxdWlja21vY2suTVVURV9MT0dTID0gZmFsc2U7XG4gICAgdmFyIHJvb3RTY29wZSA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIHF1aWNrbW9jayhvcHRpb25zLCByb290KSB7XG4gICAgICAgIHJvb3RTY29wZSA9IHJvb3Q7XG4gICAgICAgIG9wdHMgPSBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XG4gICAgICAgIHZhciBhbGxNb2R1bGVzID0gb3B0cy5tb2NrTW9kdWxlcy5jb25jYXQoWyduZ01vY2snXSksXG4gICAgICAgICAgICBpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IoYWxsTW9kdWxlcy5jb25jYXQoW29wdHMubW9kdWxlTmFtZV0pKSxcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IG1vZE9iai5faW52b2tlUXVldWUgfHwgW10sXG4gICAgICAgICAgICBwcm92aWRlclR5cGUgPSBnZXRQcm92aWRlclR5cGUob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSxcbiAgICAgICAgICAgIG1vY2tzID0ge30sXG4gICAgICAgICAgICBwcm92aWRlciA9IHt9O1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goYWxsTW9kdWxlcyB8fCBbXSwgZnVuY3Rpb24gKG1vZE5hbWUpIHtcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gaW52b2tlUXVldWUuY29uY2F0KGFuZ3VsYXIubW9kdWxlKG1vZE5hbWUpLl9pbnZva2VRdWV1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChvcHRzLmluamVjdCkge1xuICAgICAgICAgICAgaW5qZWN0b3IuaW52b2tlKG9wdHMuaW5qZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm92aWRlclR5cGUpIHtcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBpbnZva2VRdWV1ZSwgZmluZCB0aGlzIHByb3ZpZGVyJ3MgZGVwZW5kZW5jaWVzIGFuZCBwcmVmaXhcbiAgICAgICAgICAgIC8vIHRoZW0gc28gQW5ndWxhciB3aWxsIGluamVjdCB0aGUgbW9ja2VkIHZlcnNpb25zXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uIChwcm92aWRlckRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyRGF0YVsyXVswXTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyTmFtZSA9PT0gb3B0cy5wcm92aWRlck5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwcyA9IGN1cnJQcm92aWRlckRlcHMuJGluamVjdCB8fCBpbmplY3Rvci5hbm5vdGF0ZShjdXJyUHJvdmlkZXJEZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVwTmFtZSA9IGN1cnJQcm92aWRlckRlcHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3NbZGVwTmFtZV0gPSBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSA9PT0gJ2RpcmVjdGl2ZScpIHtcbiAgICAgICAgICAgICAgICBzZXR1cERpcmVjdGl2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXR1cEluaXRpYWxpemVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uIChwcm92aWRlckRhdGEpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgcHJlZml4ZWQgZGVwZW5kZW5jaWVzIHRoYXQgcGVyc2lzdGVkIGZyb20gYSBwcmV2aW91cyBjYWxsLFxuICAgICAgICAgICAgLy8gYW5kIGNoZWNrIGZvciBhbnkgbm9uLWFubm90YXRlZCBzZXJ2aWNlc1xuICAgICAgICAgICAgc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwSW5pdGlhbGl6ZXIoKSB7XG4gICAgICAgICAgICBwcm92aWRlciA9IGluaXRQcm92aWRlcigpO1xuICAgICAgICAgICAgaWYgKG9wdHMuc3B5T25Qcm92aWRlck1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcbiAgICAgICAgICAgIHByb3ZpZGVyLiRpbml0aWFsaXplID0gc2V0dXBJbml0aWFsaXplcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQcm92aWRlcigpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udHJvbGxlcic6XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b1JldHVybiA9IF9jb250cm9sbGVySGFuZGxlcjIuZGVmYXVsdC5jbGVhbihyb290U2NvcGUpLmFkZE1vZHVsZXMoYWxsTW9kdWxlcy5jb25jYXQob3B0cy5tb2R1bGVOYW1lKSkuYmluZFdpdGgob3B0cy5jb250cm9sbGVyLmJpbmRUb0NvbnRyb2xsZXIpLnNldFNjb3BlKG9wdHMuY29udHJvbGxlci5wYXJlbnRTY29wZSkuc2V0TG9jYWxzKG1vY2tzKS5uZXcob3B0cy5wcm92aWRlck5hbWUsIG9wdHMuY29udHJvbGxlci5jb250cm9sbGVyQXMpO1xuICAgICAgICAgICAgICAgICAgICB0b1JldHVybi5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG1vY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9ja3MuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2tleV0gPSB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2Vba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jb250cm9sbGVyLmlzRGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyICRmaWx0ZXIgPSBpbmplY3Rvci5nZXQoJyRmaWx0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIob3B0cy5wcm92aWRlck5hbWUpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FuaW1hdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZTogaW5qZWN0b3IuZ2V0KCckYW5pbWF0ZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5tb2NrLm1vZHVsZSgnbmdBbmltYXRlTW9jaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQob3B0cy5wcm92aWRlck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBEaXJlY3RpdmUoKSB7XG4gICAgICAgICAgICB2YXIgJGNvbXBpbGUgPSBpbmplY3Rvci5nZXQoJyRjb21waWxlJyk7XG4gICAgICAgICAgICBwcm92aWRlci4kc2NvcGUgPSBpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKS4kbmV3KCk7XG4gICAgICAgICAgICBwcm92aWRlci4kbW9ja3MgPSBtb2NrcztcblxuICAgICAgICAgICAgcHJvdmlkZXIuJGNvbXBpbGUgPSBmdW5jdGlvbiBxdWlja21vY2tDb21waWxlKGh0bWwpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbCB8fCBvcHRzLmh0bWw7XG4gICAgICAgICAgICAgICAgaWYgKCFodG1sKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIE5vIGh0bWwgc3RyaW5nL29iamVjdCBwcm92aWRlZC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoaHRtbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGh0bWwpO1xuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSk7XG4gICAgICAgICAgICAgICAgJGNvbXBpbGUocHJvdmlkZXIuJGVsZW1lbnQpKHByb3ZpZGVyLiRzY29wZSk7XG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kaXNvU2NvcGUgPSBwcm92aWRlci4kZWxlbWVudC5pc29sYXRlU2NvcGUoKTtcbiAgICAgICAgICAgICAgICBwcm92aWRlci4kc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKSB7XG4gICAgICAgICAgICB2YXIgZGVwVHlwZSA9IGdldFByb3ZpZGVyVHlwZShkZXBOYW1lLCBpbnZva2VRdWV1ZSksXG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gZGVwTmFtZTtcbiAgICAgICAgICAgIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICE9PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gPT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XG4gICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwVHlwZSA9PT0gJ3ZhbHVlJyB8fCBkZXBUeXBlID09PSAnY29uc3RhbnQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluamVjdG9yLmhhcyhtb2NrUHJlZml4ICsgZGVwTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUuaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xuICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrU2VydmljZU5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWluamVjdG9yLmhhcyhtb2NrU2VydmljZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudXNlQWN0dWFsRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tTZXJ2aWNlTmFtZS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluamVjdCBtb2NrIGZvciBcIicgKyBkZXBOYW1lICsgJ1wiIGJlY2F1c2Ugbm8gc3VjaCBtb2NrIGV4aXN0cy4gUGxlYXNlIHdyaXRlIGEgbW9jayAnICsgZGVwVHlwZSArICcgY2FsbGVkIFwiJyArIG1vY2tTZXJ2aWNlTmFtZSArICdcIiAob3Igc2V0IHRoZSB1c2VBY3R1YWxEZXBlbmRlbmNpZXMgdG8gdHJ1ZSkgYW5kIHRyeSBhZ2Fpbi4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG1vY2tTZXJ2aWNlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocHJvdmlkZXJEYXRhWzJdWzBdKSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvdmlkZXJEYXRhWzJdWzFdKSkge1xuICAgICAgICAgICAgICAgIC8vIHByb3ZpZGVyIGRlY2xhcmF0aW9uIGZ1bmN0aW9uIGhhcyBiZWVuIHByb3ZpZGVkIHdpdGhvdXQgdGhlIGFycmF5IGFubm90YXRpb24sXG4gICAgICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhbm5vdGF0ZSBpdCBzbyB0aGUgaW52b2tlUXVldWUgY2FuIGJlIHByZWZpeGVkXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRlZERlcGVuZGVuY2llcyA9IGluamVjdG9yLmFubm90YXRlKHByb3ZpZGVyRGF0YVsyXVsxXSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHByb3ZpZGVyRGF0YVsyXVsxXS4kaW5qZWN0O1xuICAgICAgICAgICAgICAgIGFubm90YXRlZERlcGVuZGVuY2llcy5wdXNoKHByb3ZpZGVyRGF0YVsyXVsxXSk7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXJEYXRhWzJdWzFdID0gYW5ub3RhdGVkRGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5pdGlhbGl6ZSBiZWNhdXNlIGFuZ3VsYXIgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGxvYWQgYW5ndWxhciBiZWZvcmUgbG9hZGluZyBxdWlja21vY2suanMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvcHRpb25zLnByb3ZpZGVyTmFtZSAmJiAhb3B0aW9ucy5jb25maWdCbG9ja3MgJiYgIW9wdGlvbnMucnVuQmxvY2tzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gcHJvdmlkZXJOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QsIG9yIHNldCB0aGUgY29uZmlnQmxvY2tzIG9yIHJ1bkJsb2NrcyBmbGFncy4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wdGlvbnMubW9kdWxlTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIG1vZHVsZU5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5zIHRoZSBwcm92aWRlci9zZXJ2aWNlIHlvdSB3aXNoIHRvIHRlc3QuJyk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5tb2NrTW9kdWxlcyA9IG9wdGlvbnMubW9ja01vZHVsZXMgfHwgW107XG4gICAgICAgIG9wdGlvbnMubW9ja3MgPSBvcHRpb25zLm1vY2tzIHx8IHt9O1xuICAgICAgICBvcHRpb25zLmNvbnRyb2xsZXIgPSAoMCwgX2NvbW1vbi5leHRlbmQpKG9wdGlvbnMuY29udHJvbGxlciwgY29udHJvbGxlckRlZmF1bHRzKGFuZ3VsYXIuaXNEZWZpbmVkKG9wdGlvbnMuY29udHJvbGxlcikpKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpIHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHByb3ZpZGVyLCBmdW5jdGlvbiAocHJvcGVydHksIHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Lmphc21pbmUgJiYgd2luZG93LnNweU9uICYmICFwcm9wZXJ0eS5jYWxscykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3B5ID0gc3B5T24ocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcHkuYW5kQ2FsbFRocm91Z2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuc2lub24gJiYgd2luZG93LnNpbm9uLnNweSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2lub24uc3B5KHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvdmlkZXJUeXBlKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnZva2VRdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHByb3ZpZGVySW5mbyA9IGludm9rZVF1ZXVlW2ldO1xuICAgICAgICAgICAgaWYgKHByb3ZpZGVySW5mb1syXVswXSA9PT0gcHJvdmlkZXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlckluZm9bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJHByb3ZpZGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVySW5mb1sxXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbnRyb2xsZXJQcm92aWRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2NvbnRyb2xsZXInO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29tcGlsZVByb3ZpZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGZpbHRlclByb3ZpZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnZmlsdGVyJztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGFuaW1hdGVQcm92aWRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2FuaW1hdGlvbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKHByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHVucHJlZml4KSB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24gKHByb3ZpZGVyRGF0YSkge1xuICAgICAgICAgICAgaWYgKHByb3ZpZGVyRGF0YVsyXVswXSA9PT0gcHJvdmlkZXJOYW1lICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVucHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBtb2NrUHJlZml4ICsgY3VyclByb3ZpZGVyRGVwc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKSB7XG4gICAgICAgIGlmICghaHRtbC4kdGFnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBIdG1sIG9iamVjdCBkb2VzIG5vdCBjb250YWluICR0YWcgcHJvcGVydHkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGh0bWxBdHRycyA9IGh0bWwsXG4gICAgICAgICAgICB0YWdOYW1lID0gaHRtbEF0dHJzLiR0YWcsXG4gICAgICAgICAgICBodG1sQ29udGVudCA9IGh0bWxBdHRycy4kY29udGVudDtcbiAgICAgICAgaHRtbCA9ICc8JyArIHRhZ05hbWUgKyAnICc7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChodG1sQXR0cnMsIGZ1bmN0aW9uICh2YWwsIGF0dHIpIHtcbiAgICAgICAgICAgIGlmIChhdHRyICE9PSAnJGNvbnRlbnQnICYmIGF0dHIgIT09ICckdGFnJykge1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gc25ha2VfY2FzZShhdHRyKSArICh2YWwgPyAnPVwiJyArIHZhbCArICdcIiAnIDogJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGh0bWwgKz0gaHRtbENvbnRlbnQgPyAnPicgKyBodG1sQ29udGVudCA6ICc+JztcbiAgICAgICAgaHRtbCArPSAnPC8nICsgdGFnTmFtZSArICc+JztcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrTG9nKG1zZykge1xuICAgICAgICBpZiAoIXF1aWNrbW9jay5NVVRFX0xPR1MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgU05BS0VfQ0FTRV9SRUdFWFAgPSAvW0EtWl0vZztcblxuICAgIGZ1bmN0aW9uIHNuYWtlX2Nhc2UobmFtZSwgc2VwYXJhdG9yKSB7XG4gICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLSc7XG4gICAgICAgIHJldHVybiBuYW1lLnJlcGxhY2UoU05BS0VfQ0FTRV9SRUdFWFAsIGZ1bmN0aW9uIChsZXR0ZXIsIHBvcykge1xuICAgICAgICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1aWNrbW9jaztcbn0oYW5ndWxhcik7XG4oMCwgX3F1aWNrbW9ja01vY2tIZWxwZXIyLmRlZmF1bHQpKG1vY2tlcik7XG5leHBvcnRzLmRlZmF1bHQgPSBtb2NrZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L3F1aWNrbW9jay5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBsb2FkSGVscGVyKG1vY2tlcikge1xuICAgIChmdW5jdGlvbiAocXVpY2ttb2NrKSB7XG4gICAgICAgIHZhciBoYXNCZWVuTW9ja2VkID0ge30sXG4gICAgICAgICAgICBvcmlnTW9kdWxlRnVuYyA9IGFuZ3VsYXIubW9kdWxlO1xuICAgICAgICBxdWlja21vY2sub3JpZ2luYWxNb2R1bGVzID0gYW5ndWxhci5tb2R1bGU7XG4gICAgICAgIGFuZ3VsYXIubW9kdWxlID0gZGVjb3JhdGVBbmd1bGFyTW9kdWxlO1xuXG4gICAgICAgIHF1aWNrbW9jay5tb2NrSGVscGVyID0ge1xuICAgICAgICAgICAgaGFzQmVlbk1vY2tlZDogaGFzQmVlbk1vY2tlZFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopIHtcbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1ldGhvZHMsIGZ1bmN0aW9uIChtZXRob2QsIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgICAgICAgICBtb2RPYmpbbWV0aG9kTmFtZV0gPSBtZXRob2Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBtb2RPYmo7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGUobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKSB7XG4gICAgICAgICAgICB2YXIgbW9kT2JqID0gb3JpZ01vZHVsZUZ1bmMobmFtZSwgcmVxdWlyZXMsIGNvbmZpZ0ZuKTtcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCBwcm92aWRlclR5cGUpIHtcbiAgICAgICAgICAgICAgICBoYXNCZWVuTW9ja2VkW3Byb3ZpZGVyTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBuZXdNb2RPYmogPSBtb2RPYmpbcHJvdmlkZXJUeXBlXShxdWlja21vY2suTU9DS19QUkVGSVggKyBwcm92aWRlck5hbWUsIGluaXRGdW5jKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG5ld01vZE9iaik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2U6IGZ1bmN0aW9uIG1vY2tTZXJ2aWNlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnc2VydmljZScsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtb2NrRmFjdG9yeTogZnVuY3Rpb24gbW9ja0ZhY3RvcnkocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmYWN0b3J5JywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja0ZpbHRlcjogZnVuY3Rpb24gbW9ja0ZpbHRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZpbHRlcicsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tDb250cm9sbGVyOiBmdW5jdGlvbiBtb2NrQ29udHJvbGxlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnRyb2xsZXInLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrUHJvdmlkZXI6IGZ1bmN0aW9uIG1vY2tQcm92aWRlcihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3Byb3ZpZGVyJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja1ZhbHVlOiBmdW5jdGlvbiBtb2NrVmFsdWUocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICd2YWx1ZScsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tDb25zdGFudDogZnVuY3Rpb24gbW9ja0NvbnN0YW50KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29uc3RhbnQnLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrQW5pbWF0aW9uOiBmdW5jdGlvbiBtb2NrQW5pbWF0aW9uKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnYW5pbWF0aW9uJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkobW9ja2VyKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGxvYWRIZWxwZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L3F1aWNrbW9jay5tb2NrSGVscGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzLmdldEJsb2NrTm9kZXMgPSBnZXRCbG9ja05vZGVzO1xuZXhwb3J0cy5oYXNoS2V5ID0gaGFzaEtleTtcbmV4cG9ydHMuY3JlYXRlTWFwID0gY3JlYXRlTWFwO1xuZXhwb3J0cy5zaGFsbG93Q29weSA9IHNoYWxsb3dDb3B5O1xuZXhwb3J0cy5pc0FycmF5TGlrZSA9IGlzQXJyYXlMaWtlO1xuZXhwb3J0cy50cmltID0gdHJpbTtcbmV4cG9ydHMuaXNFeHByZXNzaW9uID0gaXNFeHByZXNzaW9uO1xuZXhwb3J0cy5leHByZXNzaW9uU2FuaXRpemVyID0gZXhwcmVzc2lvblNhbml0aXplcjtcbmV4cG9ydHMuYXNzZXJ0Tm90RGVmaW5lZCA9IGFzc2VydE5vdERlZmluZWQ7XG5leHBvcnRzLmFzc2VydF8kX0NPTlRST0xMRVIgPSBhc3NlcnRfJF9DT05UUk9MTEVSO1xuZXhwb3J0cy5jbGVhbiA9IGNsZWFuO1xuZXhwb3J0cy5jcmVhdGVTcHkgPSBjcmVhdGVTcHk7XG5leHBvcnRzLm1ha2VBcnJheSA9IG1ha2VBcnJheTtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5nZXRGdW5jdGlvbk5hbWUgPSBnZXRGdW5jdGlvbk5hbWU7XG5leHBvcnRzLnNhbml0aXplTW9kdWxlcyA9IHNhbml0aXplTW9kdWxlcztcbmV4cG9ydHMudG9DYW1lbENhc2UgPSB0b0NhbWVsQ2FzZTtcbmV4cG9ydHMudG9TbmFrZUNhc2UgPSB0b1NuYWtlQ2FzZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFBBUlNFX0JJTkRJTkdfUkVHRVggPSBleHBvcnRzLlBBUlNFX0JJTkRJTkdfUkVHRVggPSAvXihbXFw9XFxAXFwmXSkoLiopPyQvO1xudmFyIEVYUFJFU1NJT05fUkVHRVggPSBleHBvcnRzLkVYUFJFU1NJT05fUkVHRVggPSAvXnt7Lip9fSQvO1xuLyogU2hvdWxkIHJldHVybiB0cnVlIFxyXG4gKiBmb3Igb2JqZWN0cyB0aGF0IHdvdWxkbid0IGZhaWwgZG9pbmdcclxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG15T2JqKTtcclxuICogd2hpY2ggcmV0dXJucyBhIG5ldyBhcnJheSAocmVmZXJlbmNlLXdpc2UpXHJcbiAqIFByb2JhYmx5IG5lZWRzIG1vcmUgc3BlY3NcclxuICovXG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xuZnVuY3Rpb24gZ2V0QmxvY2tOb2Rlcyhub2Rlcykge1xuICAgIC8vIFRPRE8ocGVyZik6IHVwZGF0ZSBgbm9kZXNgIGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb2JqZWN0P1xuICAgIHZhciBub2RlID0gbm9kZXNbMF07XG4gICAgdmFyIGVuZE5vZGUgPSBub2Rlc1tub2Rlcy5sZW5ndGggLSAxXTtcbiAgICB2YXIgYmxvY2tOb2RlcztcblxuICAgIGZvciAodmFyIGkgPSAxOyBub2RlICE9PSBlbmROb2RlICYmIChub2RlID0gbm9kZS5uZXh0U2libGluZyk7IGkrKykge1xuICAgICAgICBpZiAoYmxvY2tOb2RlcyB8fCBub2Rlc1tpXSAhPT0gbm9kZSkge1xuICAgICAgICAgICAgaWYgKCFibG9ja05vZGVzKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tOb2RlcyA9IGFuZ3VsYXIuZWxlbWVudChzbGljZS5jYWxsKG5vZGVzLCAwLCBpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9ja05vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2tOb2RlcyB8fCBub2Rlcztcbn1cblxudmFyIHVpZCA9IDA7XG52YXIgbmV4dFVpZCA9IGZ1bmN0aW9uIG5leHRVaWQoKSB7XG4gICAgcmV0dXJuICsrdWlkO1xufTtcblxuZnVuY3Rpb24gaGFzaEtleShvYmosIG5leHRVaWRGbikge1xuICAgIHZhciBrZXkgPSBvYmogJiYgb2JqLiQkaGFzaEtleTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgdmFyIG9ialR5cGUgPSB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvYmopO1xuICAgIGlmIChvYmpUeXBlID09PSAnZnVuY3Rpb24nIHx8IG9ialR5cGUgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgICAgICBrZXkgPSBvYmouJCRoYXNoS2V5ID0gb2JqVHlwZSArICc6JyArIChuZXh0VWlkRm4gfHwgbmV4dFVpZCkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgPSBvYmpUeXBlICsgJzonICsgb2JqO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KHNyYywgZHN0KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNBcnJheShzcmMpKSB7XG4gICAgICAgIGRzdCA9IGRzdCB8fCBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzcmMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZHN0W2ldID0gc3JjW2ldO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNyYykpIHtcbiAgICAgICAgZHN0ID0gZHN0IHx8IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGlmICghKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XG4gICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkc3QgfHwgc3JjO1xufVxuZnVuY3Rpb24gaXNBcnJheUxpa2UoaXRlbSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGl0ZW0pIHx8ICEhaXRlbSAmJiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGl0ZW0pKSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtLmhhc093blByb3BlcnR5KFwibGVuZ3RoXCIpICYmIHR5cGVvZiBpdGVtLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBpdGVtLmxlbmd0aCA+PSAwIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVtKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIHRyaW0odmFsdWUpIHtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGlzRXhwcmVzc2lvbih2YWx1ZSkge1xuICAgIHJldHVybiBFWFBSRVNTSU9OX1JFR0VYLnRlc3QodHJpbSh2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBleHByZXNzaW9uU2FuaXRpemVyKGV4cHJlc3Npb24pIHtcbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgcmV0dXJuIGV4cHJlc3Npb24uc3Vic3RyaW5nKDIsIGV4cHJlc3Npb24ubGVuZ3RoIC0gMik7XG59XG5cbmZ1bmN0aW9uIGFzc2VydE5vdERlZmluZWQob2JqLCBhcmdzKSB7XG5cbiAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgIHdoaWxlIChrZXkgPSBhcmdzLnNoaWZ0KCkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFsnXCInLCBrZXksICdcIiBwcm9wZXJ0eSBjYW5ub3QgYmUgbnVsbCddLmpvaW4oXCJcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydF8kX0NPTlRST0xMRVIob2JqKSB7XG4gICAgYXNzZXJ0Tm90RGVmaW5lZChvYmosIFsncGFyZW50U2NvcGUnLCAnYmluZGluZ3MnLCAnY29udHJvbGxlclNjb3BlJ10pO1xufVxuXG5mdW5jdGlvbiBjbGVhbihvYmplY3QpIHtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqZWN0KSkge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IG9iamVjdC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkob2JqZWN0LCBbaW5kZXgsIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcbiAgICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgfVxuICAgIHZhciBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgZW5kVGltZSA9IHZvaWQgMDtcbiAgICB2YXIgdG9SZXR1cm4gPSBzcHlPbih7XG4gICAgICAgIGE6IGZ1bmN0aW9uIGEoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgX2FyZ3VtZW50cyk7XG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgIHRvUmV0dXJuLnRvb2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIH07XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufVxuXG5mdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gbWFrZUFycmF5KGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBbaXRlbV07XG59XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgcmVtb3ZlJCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XG4gICAgdmFyIGN1cnJlbnQgPSB2b2lkIDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPSB2YWx1ZXMuc2hpZnQoKSkge1xuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cblxudmFyIHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcblxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xuICAgIGlmIChzY29wZS4kcm9vdCkge1xuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbnZhciBzY29wZUhlbHBlciA9IGV4cG9ydHMuc2NvcGVIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gc2NvcGVIZWxwZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBzY29wZUhlbHBlcik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKHNjb3BlSGVscGVyLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICdkZWNvcmF0ZVNjb3BlQ291bnRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCA9IDA7XG4gICAgICAgICAgICBzY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQoc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Njb3BlSGVscGVyLiRyb290U2NvcGUuJG5ldyh0cnVlKV0uY29uY2F0KHNjb3BlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdpc1Njb3BlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU2NvcGUob2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0ICYmIGdldFJvb3RGcm9tU2NvcGUob2JqZWN0KSA9PT0gZ2V0Um9vdEZyb21TY29wZShzY29wZUhlbHBlci4kcm9vdFNjb3BlKSAmJiBvYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2NvcGVIZWxwZXI7XG59KCk7XG5cbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XG5cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XG4gICAgdmFyIHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiB0b1JldHVybjtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xuXG4gICAgdmFyIG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgIHZhciBpbmRleCA9IHZvaWQgMDtcbiAgICBpZiAoKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiYgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZHVsZXM7XG59XG52YXIgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZztcbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbiAoXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSwga2V5KSB7XG4gICAga2V5ID0ga2V5IHx8ICctJztcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbnZhciBfY29udHJvbGxlckhhbmRsZXJFeHRlbnNpb25zID0gcmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJyk7XG5cbnZhciBjb250cm9sbGVySGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcbiAgICB2YXIgbXlNb2R1bGVzID0gdm9pZCAwLFxuICAgICAgICBjdHJsTmFtZSA9IHZvaWQgMCxcbiAgICAgICAgY0xvY2FscyA9IHZvaWQgMCxcbiAgICAgICAgcFNjb3BlID0gdm9pZCAwLFxuICAgICAgICBjU2NvcGUgPSB2b2lkIDAsXG4gICAgICAgIGNOYW1lID0gdm9pZCAwLFxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdm9pZCAwO1xuXG4gICAgZnVuY3Rpb24gY2xlYW4ocm9vdCkge1xuICAgICAgICBteU1vZHVsZXMgPSBbXTtcbiAgICAgICAgY3RybE5hbWUgPSBwU2NvcGUgPSBjTG9jYWxzID0gY1Njb3BlID0gYmluZFRvQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xuICAgIH1cblxuICAgIHZhciBsYXN0SW5zdGFuY2UgPSB2b2lkIDA7XG5cbiAgICBmdW5jdGlvbiAkY29udHJvbGxlckhhbmRsZXIoKSB7XG5cbiAgICAgICAgaWYgKCFjdHJsTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgJ1BsZWFzZSBwcm92aWRlIHRoZSBjb250cm9sbGVyXFwncyBuYW1lJztcbiAgICAgICAgfVxuICAgICAgICBwU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xuICAgICAgICBpZiAoIWNTY29wZSkge1xuICAgICAgICAgICAgY1Njb3BlID0gcFNjb3BlLiRuZXcoKTtcbiAgICAgICAgfXtcbiAgICAgICAgICAgIHZhciB0ZW1wU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcbiAgICAgICAgICAgIGlmICh0ZW1wU2NvcGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY1Njb3BlID0gdGVtcFNjb3BlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGxhc3RJbnN0YW5jZS4kZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0b1JldHVybiA9IG5ldyBfY29udHJvbGxlckhhbmRsZXJFeHRlbnNpb25zLiRfQ09OVFJPTExFUihjdHJsTmFtZSwgcFNjb3BlLCBiaW5kVG9Db250cm9sbGVyLCBteU1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKTtcbiAgICAgICAgbGFzdEluc3RhbmNlID0gdG9SZXR1cm47XG4gICAgICAgIGNsZWFuKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9XG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24gKGJpbmRpbmdzKSB7XG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSBiaW5kaW5ncztcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5jb250cm9sbGVyVHlwZSA9IF9jb250cm9sbGVySGFuZGxlckV4dGVuc2lvbnMuJF9DT05UUk9MTEVSO1xuICAgICRjb250cm9sbGVySGFuZGxlci5jbGVhbiA9IGNsZWFuO1xuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uIChuZXdTY29wZSkge1xuICAgICAgICBwU2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRMb2NhbHMgPSBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgICAgIGNMb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XG4gICAgfTtcblxuICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci4kcm9vdFNjb3BlO1xuXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbiAobW9kdWxlcykge1xuICAgICAgICBmdW5jdGlvbiBwdXNoQXJyYXkoYXJyYXkpIHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG1vZHVsZXMpKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoKDAsIF9jb21tb24ubWFrZUFycmF5KShhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KFttb2R1bGVzXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKDAsIF9jb21tb24uaXNBcnJheUxpa2UpKG1vZHVsZXMpKSB7XG4gICAgICAgICAgICBwdXNoQXJyYXkoKDAsIF9jb21tb24ubWFrZUFycmF5KShtb2R1bGVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5pc0ludGVybmFsID0gZnVuY3Rpb24gKGZsYWcpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbDtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24gKGNvbnRyb2xsZXJOYW1lLCBzY29wZUNvbnRyb2xsZXJzTmFtZSwgcGFyZW50U2NvcGUsIGNoaWxkU2NvcGUpIHtcbiAgICAgICAgY3RybE5hbWUgPSBjb250cm9sbGVyTmFtZTtcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xuICAgICAgICAgICAgcFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcbiAgICAgICAgICAgIGNTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xuICAgICAgICAgICAgY05hbWUgPSAnY29udHJvbGxlcic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShwYXJlbnRTY29wZSB8fCBwU2NvcGUpO1xuICAgICAgICAgICAgY1Njb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUoY2hpbGRTY29wZSB8fCBwU2NvcGUuJG5ldygpKTtcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcigpO1xuICAgIH07XG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ld1NlcnZpY2UgPSBmdW5jdGlvbiAoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciB0b1JldHVybiA9ICRjb250cm9sbGVySGFuZGxlci5uZXcoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUpO1xuICAgICAgICB0b1JldHVybi5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfTtcbiAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xufSgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLiRfQ09OVFJPTExFUiA9IHVuZGVmaW5lZDtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9kaXJlY3RpdmVQcm92aWRlciA9IHJlcXVpcmUoJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcycpO1xuXG52YXIgX2RpcmVjdGl2ZVByb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RpcmVjdGl2ZVByb3ZpZGVyKTtcblxudmFyIF9kaXJlY3RpdmVIYW5kbGVyID0gcmVxdWlyZSgnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnKTtcblxudmFyIF9jb250cm9sbGVyUU0gPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJyk7XG5cbnZhciBfY29udHJvbGxlclFNMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbnRyb2xsZXJRTSk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgJF9DT05UUk9MTEVSID0gZXhwb3J0cy4kX0NPTlRST0xMRVIgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2NyZWF0ZUNsYXNzKCRfQ09OVFJPTExFUiwgbnVsbCwgW3tcbiAgICAgICAga2V5OiAnaXNDb250cm9sbGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQ29udHJvbGxlcihvYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiAkX0NPTlRST0xMRVI7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBmdW5jdGlvbiAkX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZGluZ3MsIG1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCAkX0NPTlRST0xMRVIpO1xuXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XG4gICAgICAgIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSA9IGNOYW1lIHx8ICdjb250cm9sbGVyJztcbiAgICAgICAgdGhpcy51c2VkTW9kdWxlcyA9IG1vZHVsZXMuc2xpY2UoKTtcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyU2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlLiRuZXcoKTtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgICB0aGlzLmxvY2FscyA9ICgwLCBfY29tbW9uLmV4dGVuZCkoY0xvY2FscyB8fCB7fSwge1xuICAgICAgICAgICAgJHNjb3BlOiB0aGlzLmNvbnRyb2xsZXJTY29wZVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzID0gW107XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xuICAgICAgICAgICAgU2NvcGU6IHt9LFxuICAgICAgICAgICAgQ29udHJvbGxlcjoge31cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoJF9DT05UUk9MTEVSLCBbe1xuICAgICAgICBrZXk6ICckYXBwbHknLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gJGFwcGx5KCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICckZGVzdHJveScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAkZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudFNjb3BlICYmIGFuZ3VsYXIuaXNGdW5jdGlvbih0aGlzLnBhcmVudFNjb3BlLiRkZXN0cm95KSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICgwLCBfY29tbW9uLmNsZWFuKSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY3JlYXRlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZShiaW5kaW5ncykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyAhPT0gbnVsbCA/IGJpbmRpbmdzIDogdGhpcy5iaW5kaW5ncztcbiAgICAgICAgICAgICgwLCBfY29tbW9uLmFzc2VydF8kX0NPTlRST0xMRVIpKHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvciA9IF9jb250cm9sbGVyUU0yLmRlZmF1bHQuJGdldCh0aGlzLnVzZWRNb2R1bGVzKS5jcmVhdGUodGhpcy5wcm92aWRlck5hbWUsIHRoaXMucGFyZW50U2NvcGUsIHRoaXMuYmluZGluZ3MsIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSwgdGhpcy5sb2NhbHMpO1xuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVySW5zdGFuY2UgPSB0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3RvcigpO1xuXG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICh3YXRjaGVyID0gdGhpcy5wZW5kaW5nV2F0Y2hlcnMuc2hpZnQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMud2F0Y2guYXBwbHkodGhpcywgd2F0Y2hlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5iaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9jb21tb24uUEFSU0VfQklORElOR19SRUdFWC5leGVjKHRoaXMuYmluZGluZ3Nba2V5XSksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZUtleSA9IHJlc3VsdFsyXSB8fCBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHlLZXkgPSBbc2NvcGVLZXksICc6Jywga2V5XS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsxXSA9PT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3Ryb3llciA9IF90aGlzLndhdGNoKGtleSwgX3RoaXMuSW50ZXJuYWxTcGllcy5TY29wZVtzcHlLZXldID0gKDAsIF9jb21tb24uY3JlYXRlU3B5KSgpLCBzZWxmLmNvbnRyb2xsZXJJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3Ryb3llcjIgPSBfdGhpcy53YXRjaChzY29wZUtleSwgX3RoaXMuSW50ZXJuYWxTcGllcy5Db250cm9sbGVyW3NweUtleV0gPSAoMCwgX2NvbW1vbi5jcmVhdGVTcHkpKCksIHNlbGYucGFyZW50U2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBhcmVudFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jcmVhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVySW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3dhdGNoJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlckluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nV2F0Y2hlcnMucHVzaChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlclNjb3BlLiR3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ25nQ2xpY2snLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbmdDbGljayhleHByZXNzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVEaXJlY3RpdmUoJ25nLWNsaWNrJywgZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NyZWF0ZURpcmVjdGl2ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVEaXJlY3RpdmUoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9ICgwLCBfY29tbW9uLm1ha2VBcnJheSkoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBkaXJlY3RpdmUgPSBfZGlyZWN0aXZlUHJvdmlkZXIyLmRlZmF1bHQuJGdldChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgYXJnc1swXSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlLmNvbXBpbGUuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcGlsZUhUTUwnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGlsZUhUTUwoaHRtbFRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgX2RpcmVjdGl2ZUhhbmRsZXIuZGlyZWN0aXZlSGFuZGxlcih0aGlzLCBodG1sVGV4dCk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gJF9DT05UUk9MTEVSO1xufSgpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbmdNb2RlbCA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nTW9kZWwuanMnKTtcblxudmFyIF9uZ0NsaWNrID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qcycpO1xuXG52YXIgX25nSWYgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzJyk7XG5cbnZhciBfbmdUcmFuc2xhdGUgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qcycpO1xuXG52YXIgX25nQmluZCA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qcycpO1xuXG52YXIgX25nQ2xhc3MgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsYXNzLmpzJyk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG52YXIgX25nUmVwZWF0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanMnKTtcblxudmFyIGRpcmVjdGl2ZVByb3ZpZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdHJhbnNsYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSkuZ2V0KCckdHJhbnNsYXRlJyk7XG4gICAgdmFyIGRpcmVjdGl2ZXMgPSBuZXcgTWFwKCksXG4gICAgICAgIHRvUmV0dXJuID0ge30sXG4gICAgICAgICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpLFxuICAgICAgICAkYW5pbWF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRhbmltYXRlJyksXG4gICAgICAgICR0cmFuc2NsdWRlID0gZnVuY3Rpb24gY29udHJvbGxlcnNCb3VuZFRyYW5zY2x1ZGUoc2NvcGUsIGNsb25lQXR0YWNoRm4sIGZ1dHVyZVBhcmVudEVsZW1lbnQpIHtcblxuICAgICAgICAvLyBObyBzY29wZSBwYXNzZWQgaW46XG4gICAgICAgIGlmICghX2NvbW1vbi5zY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlKSkge1xuICAgICAgICAgICAgZnV0dXJlUGFyZW50RWxlbWVudCA9IGNsb25lQXR0YWNoRm47XG4gICAgICAgICAgICBjbG9uZUF0dGFjaEZuID0gc2NvcGU7XG4gICAgICAgICAgICBzY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgICAgIGludGVybmFscyA9IHtcbiAgICAgICAgbmdJZjogKDAsIF9uZ0lmLm5nSWZEaXJlY3RpdmUpKCksXG4gICAgICAgIG5nQ2xpY2s6ICgwLCBfbmdDbGljay5uZ0NsaWNrRGlyZWN0aXZlKSgkcGFyc2UpLFxuICAgICAgICBuZ01vZGVsOiAoMCwgX25nTW9kZWwubmdNb2RlbERpcmVjdGl2ZSkoJHBhcnNlKSxcbiAgICAgICAgbmdEaXNhYmxlZDogKDAsIF9uZ0lmLm5nSWZEaXJlY3RpdmUpKCksXG4gICAgICAgIHRyYW5zbGF0ZTogKDAsIF9uZ1RyYW5zbGF0ZS5uZ1RyYW5zbGF0ZURpcmVjdGl2ZSkoJHRyYW5zbGF0ZSwgJHBhcnNlKSxcbiAgICAgICAgbmdCaW5kOiAoMCwgX25nQmluZC5uZ0JpbmREaXJlY3RpdmUpKCksXG4gICAgICAgIG5nQ2xhc3M6ICgwLCBfbmdDbGFzcy5uZ0NsYXNzRGlyZWN0aXZlKSgkcGFyc2UpLFxuICAgICAgICBuZ1JlcGVhdDogKDAsIF9uZ1JlcGVhdC5uZ1JlcGVhdERpcmVjdGl2ZSkoJHBhcnNlLCAkYW5pbWF0ZSwgJHRyYW5zY2x1ZGUpLFxuICAgICAgICB0cmFuc2xhdGVWYWx1ZToge31cbiAgICB9O1xuICAgIGludGVybmFscy5uZ1RyYW5zbGF0ZSA9IGludGVybmFscy50cmFuc2xhdGU7XG5cbiAgICB0b1JldHVybi4kZ2V0ID0gZnVuY3Rpb24gKGRpcmVjdGl2ZU5hbWUpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSAoMCwgX2NvbW1vbi50b0NhbWVsQ2FzZSkoZGlyZWN0aXZlTmFtZSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsc1tkaXJlY3RpdmVOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5nZXQoZGlyZWN0aXZlTmFtZSk7XG4gICAgfTtcbiAgICB0b1JldHVybi4kcHV0ID0gZnVuY3Rpb24gKGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgdGhyb3cgJ2RpcmVjdGl2ZUNvbnN0cnVjdG9yIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9ICgwLCBfY29tbW9uLnRvQ2FtZWxDYXNlKShkaXJlY3RpdmVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihhcmd1bWVudHNbMl0pICYmIGFyZ3VtZW50c1syXSgpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coWydkaXJlY3RpdmUnLCBkaXJlY3RpdmVOYW1lLCAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4nXS5qb2luKCcgJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdDYW5ub3Qgb3ZlcndyaXRlICcgKyBkaXJlY3RpdmVOYW1lICsgJy5cXG5Gb3JnZXRpbmcgdG8gY2xlYW4gbXVjaCc7XG4gICAgICAgIH1cbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XG4gICAgfTtcbiAgICB0b1JldHVybi4kY2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRpcmVjdGl2ZXMuY2xlYXIoKTtcbiAgICB9O1xuICAgIHRvUmV0dXJuLnVzZU1vZHVsZSA9IGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XG4gICAgICAgICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddLmNvbmNhdChtb2R1bGVOYW1lKSkuZ2V0KCckdHJhbnNsYXRlJyk7XG4gICAgICAgIGludGVybmFscy50cmFuc2xhdGUuY2hhbmdlU2VydmljZSgkdHJhbnNsYXRlKTtcbiAgICB9O1xuICAgIHJldHVybiB0b1JldHVybjtcbn0oKTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nTW9kZWxEaXJlY3RpdmUgPSBuZ01vZGVsRGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdNb2RlbERpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0b3JzID0gW107XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub29wKSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGdldHRlciA9ICRwYXJzZShleHByZXNzaW9uKTtcblxuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24gdG9SZXR1cm4ocGFyYW1ldGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1N0cmluZyhwYXJhbWV0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFyZ3VtZW50c1sxXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4ocGFyYW1ldGVyLnNwbGl0KCcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ2V0dGVyLmFzc2lnbihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUsIHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4ocGFyYW1ldGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKDAsIF9jb21tb24uaXNBcnJheUxpa2UpKHBhcmFtZXRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lbW9yeSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAoMCwgX2NvbW1vbi5tYWtlQXJyYXkpKHBhcmFtZXRlcikuZm9yRWFjaChmdW5jdGlvbiAoY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4obWVtb3J5ICs9IGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBbJ0RvbnQga25vdyB3aGF0IHRvIGRvIHdpdGggJywgJ1tcIicsICgwLCBfY29tbW9uLm1ha2VBcnJheSkoYXJndW1lbnRzKS5qb2luKCdcIiwgXCInKSwgJ1wiXSddLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLW1vZGVsJyk7XG4gICAgICAgICAgICBlbGVtLnRleHQobW9kZWwoKSk7XG4gICAgICAgICAgICBtb2RlbC5jaGFuZ2VzKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ25nLW1vZGVsJ1xuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nTW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdDbGlja0RpcmVjdGl2ZSA9IG5nQ2xpY2tEaXJlY3RpdmU7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiByZWN1cnNlT2JqZWN0cyhvYmplY3QpIHtcbiAgICB2YXIgdG9SZXR1cm4gPSAoMCwgX2NvbW1vbi5tYWtlQXJyYXkpKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG9iamVjdC5jaGlsZHJlbigpLmxlbmd0aDsgaWkrKykge1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLmNvbmNhdChyZWN1cnNlT2JqZWN0cyhhbmd1bGFyLmVsZW1lbnQob2JqZWN0LmNoaWxkcmVuKClbaWldKSkpO1xuICAgIH1cbiAgICByZXR1cm4gdG9SZXR1cm47XG59XG5mdW5jdGlvbiBuZ0NsaWNrRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IC9uZy1jbGljaz1cIiguKilcIi8sXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICRwYXJzZShleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNsaWNrID0gZnVuY3Rpb24gY2xpY2soc2NvcGUsIGxvY2Fscykge1xuICAgICAgICAgICAgICAgIGlmIChfYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBzY29wZSB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGU7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IGxvY2FscyB8fCB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGV4cHJlc3Npb24oc2NvcGUsIGxvY2Fscyk7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gY2xpY2s7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCAkZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGNsaWNrRGF0YSA9ICRlbGVtZW50LmRhdGEoJ25nLWNsaWNrJyk7XG4gICAgICAgICAgICB2YXIgbXlBcnJheSA9IHJlY3Vyc2VPYmplY3RzKCRlbGVtZW50KTtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBteUFycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChteUFycmF5W2luZGV4XSkuZGF0YSgnbmctY2xpY2snLCBjbGlja0RhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnbmctY2xpY2snXG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGljay5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ0lmRGlyZWN0aXZlID0gbmdJZkRpcmVjdGl2ZTtcbmZ1bmN0aW9uIG5nSWZEaXJlY3RpdmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IC9uZy1pZj1cIiguKilcIi8sXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0b3JzID0gW107XG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN1YnNjcmlwdG9ycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzW2lpXS5hcHBseShzdWJzY3JpcHRvcnMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vc29wKSgpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24gdG9SZXR1cm4oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUmV0dXJuLnZhbHVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IGZ1bmN0aW9uIGF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gJGVsZW1lbnQucGFyZW50KCksXG4gICAgICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUgPSAkZWxlbWVudC5kYXRhKCduZy1pZicpO1xuICAgICAgICAgICAgY29tcGlsZWREaXJlY3RpdmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50LmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmNhbGwoJGVsZW1lbnQsIDAsICRlbGVtZW50Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSAkZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmRldGFjaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGFzdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KCRlbGVtZW50LCBsYXN0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kKGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudCA9IGNvbXBpbGVkRGlyZWN0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1pZidcbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0lmLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nVHJhbnNsYXRlRGlyZWN0aXZlID0gbmdUcmFuc2xhdGVEaXJlY3RpdmU7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBuZ1RyYW5zbGF0ZURpcmVjdGl2ZSgkdHJhbnNsYXRlLCAkcGFyc2UpIHtcbiAgICB2YXIgdHJhbnNsYXRlU2VydmljZSA9ICR0cmFuc2xhdGU7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIGtleSA9IGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzID0gW107XG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IHZvaWQgMDtcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24od2F0Y2hlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdhdGNoZXIgPSB0b1JldHVybiA9IHN1YnNjcmlwdG9ycyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCgwLCBfY29tbW9uLmlzRXhwcmVzc2lvbikoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gKDAsIF9jb21tb24uZXhwcmVzc2lvblNhbml0aXplcikoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAga2V5ID0gJHBhcnNlKGV4cHJlc3Npb24pKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XG4gICAgICAgICAgICAgICAgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uIChuZXdMYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcFdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChmdW5jdGlvbiAoKSB7fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wV2F0Y2hlcigpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiB0cmFuc2xhdGUodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudCh0ZXh0KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uIGNoYW5nZUxhbmd1YWdlKG5ld0xhbmd1YWdlKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGVTZXJ2aWNlLnVzZShuZXdMYW5ndWFnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZVNlcnZpY2U6IGZ1bmN0aW9uIGNoYW5nZVNlcnZpY2UobmV3U2VydmljZSkge1xuICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZSA9IG5ld1NlcnZpY2U7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcyhmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy10cmFuc2xhdGUnXG5cbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdCaW5kRGlyZWN0aXZlID0gbmdCaW5kRGlyZWN0aXZlO1xuZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IGZ1bmN0aW9uIGF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgZWxlbSkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gZWxlbS5kYXRhKCduZy1iaW5kJyk7XG4gICAgICAgICAgICBlbGVtLnRleHQobW9kZWwoKSk7XG4gICAgICAgICAgICBtb2RlbC5jaGFuZ2VzKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ25nLWJpbmQnXG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ0NsYXNzRGlyZWN0aXZlID0gbmdDbGFzc0RpcmVjdGl2ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIG5nQ2xhc3NEaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyU2VydmljZS5jcmVhdGUpKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0b3JzID0gW107XG4gICAgICAgICAgICB2YXIgbGFzdFZhbHVlID0ge307XG4gICAgICAgICAgICB2YXIgZ2V0dGVyID0gJHBhcnNlKCgwLCBfY29tbW9uLnRyaW0pKGV4cHJlc3Npb24pKTtcbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGdldHRlcihjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUpO1xuICAgICAgICAgICAgICAgIHZhciBmaXJlQ2hhbmdlID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIHZhciB0b05vdGlmeSA9IHt9O1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2xhc3NlcyA9IG5ld1ZhbHVlLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLmhhc093blByb3BlcnR5KGtleSkgJiYgbmV3VmFsdWVba2V5XSAhPT0gbGFzdFZhbHVlW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90aWZ5W2tleV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkOiAhIWxhc3RWYWx1ZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtrZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZUNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2tleSBpbiBsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0b05vdGlmeS5oYXNPd25Qcm9wZXJ0eShfa2V5KSAmJiBsYXN0VmFsdWUuaGFzT3duUHJvcGVydHkoX2tleSkgJiYgbmV3VmFsdWVbX2tleV0gIT09IGxhc3RWYWx1ZVtfa2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlbX2tleV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkOiAhIWxhc3RWYWx1ZVtfa2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXc6ICEhbmV3VmFsdWVbX2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmlyZUNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlLCB0b05vdGlmeSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGxhc3RWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhsYXN0VmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFZhbHVlW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0b1JldHVybi5oYXNDbGFzcyA9IGZ1bmN0aW9uICh0b0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobGFzdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlLmluZGV4T2YoKDAsIF9jb21tb24udHJpbSkodG9DaGVjaykpICE9PSAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISFsYXN0VmFsdWVbdG9DaGVja107XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnbmctY2xhc3MnLFxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IGZ1bmN0aW9uIGF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgZWxlbWVudCkge1xuXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ25nLWNsYXNzJykuY2hhbmdlcyhmdW5jdGlvbiAobGFzdFZhbHVlLCBuZXdDaGFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG5ld0NoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NoYW5nZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NoYW5nZXNba2V5XS5uZXcgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3Moa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGFzcy5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdSZXBlYXREaXJlY3RpdmUgPSBuZ1JlcGVhdERpcmVjdGl2ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIG5nUmVwZWF0RGlyZWN0aXZlKCRwYXJzZSkge1xuICAgIC8vIGNvbnN0IE5HX1JFTU9WRUQgPSAnJCROR19SRU1PVkVEJztcbiAgICB2YXIgdXBkYXRlU2NvcGUgPSBmdW5jdGlvbiB1cGRhdGVTY29wZShzY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgYXJyYXlMZW5ndGgpIHtcbiAgICAgICAgLy8gVE9ETyhwZXJmKTogZ2VuZXJhdGUgc2V0dGVycyB0byBzaGF2ZSBvZmYgfjQwbXMgb3IgMS0xLjUlXG4gICAgICAgIHNjb3BlW3ZhbHVlSWRlbnRpZmllcl0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKGtleUlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIHNjb3BlW2tleUlkZW50aWZpZXJdID0ga2V5O1xuICAgICAgICB9XG4gICAgICAgIHNjb3BlLiRpbmRleCA9IGluZGV4O1xuICAgICAgICBzY29wZS4kZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgc2NvcGUuJGxhc3QgPSBpbmRleCA9PT0gYXJyYXlMZW5ndGggLSAxO1xuICAgICAgICBzY29wZS4kbWlkZGxlID0gIShzY29wZS4kZmlyc3QgfHwgc2NvcGUuJGxhc3QpO1xuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogZmFsc2VcbiAgICAgICAgc2NvcGUuJG9kZCA9ICEoc2NvcGUuJGV2ZW4gPSAoaW5kZXggJiAxKSA9PT0gMCk7XG4gICAgICAgIC8vIGpzaGludCBiaXR3aXNlOiB0cnVlXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6ICduZ1JlcGVhdCcsXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyICRzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccythc1xccysoW1xcc1xcU10rPykpPyg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiRXhwZWN0ZWQgZXhwcmVzc2lvbiBpbiBmb3JtIG9mICdfaXRlbV8gaW4gX2NvbGxlY3Rpb25fWyB0cmFjayBieSBfaWRfXScgYnV0IGdvdCAnXCIsIGV4cHJlc3Npb24sIFwiJ1wiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaHMgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIHZhciByaHMgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIHZhciBhbGlhc0FzID0gbWF0Y2hbM107XG4gICAgICAgICAgICB2YXIgdHJhY2tCeUV4cCA9IG1hdGNoWzRdO1xuICAgICAgICAgICAgbWF0Y2ggPSBsaHMubWF0Y2goL14oPzooXFxzKltcXCRcXHddKyl8XFwoXFxzKihbXFwkXFx3XSspXFxzKixcXHMqKFtcXCRcXHddKylcXHMqXFwpKSQvKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCInX2l0ZW1fJyBpbiAnX2l0ZW1fIGluIF9jb2xsZWN0aW9uXycgc2hvdWxkIGJlIGFuIGlkZW50aWZpZXIgb3IgJyhfa2V5XywgX3ZhbHVlXyknIGV4cHJlc3Npb24sIGJ1dCBnb3QgJ1wiLCBsaHMsIFwiJ1wiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZUlkZW50aWZpZXIgPSBtYXRjaFszXSB8fCBtYXRjaFsxXTtcbiAgICAgICAgICAgIHZhciBrZXlJZGVudGlmaWVyID0gbWF0Y2hbMl07XG5cbiAgICAgICAgICAgIGlmIChhbGlhc0FzICYmICghL15bJGEtekEtWl9dWyRhLXpBLVowLTlfXSokLy50ZXN0KGFsaWFzQXMpIHx8IC9eKG51bGx8dW5kZWZpbmVkfHRoaXN8XFwkaW5kZXh8XFwkZmlyc3R8XFwkbWlkZGxlfFxcJGxhc3R8XFwkZXZlbnxcXCRvZGR8XFwkcGFyZW50fFxcJHJvb3R8XFwkaWQpJC8udGVzdChhbGlhc0FzKSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCJhbGlhcyAnXCIsIGFsaWFzQXMsIFwiJyBpcyBpbnZhbGlkIC0tLSBtdXN0IGJlIGEgdmFsaWQgSlMgaWRlbnRpZmllciB3aGljaCBpcyBub3QgYSByZXNlcnZlZCBuYW1lLlwiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0cmFja0J5RXhwR2V0dGVyID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEV4cEZuID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEFycmF5Rm4gPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkT2JqRm4gPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgaGFzaEZuTG9jYWxzID0ge1xuICAgICAgICAgICAgICAgICRpZDogX2NvbW1vbi5oYXNoS2V5XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodHJhY2tCeUV4cCkge1xuICAgICAgICAgICAgICAgIHRyYWNrQnlFeHBHZXR0ZXIgPSAkcGFyc2UodHJhY2tCeUV4cCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEFycmF5Rm4gPSBmdW5jdGlvbiB0cmFja0J5SWRBcnJheUZuKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfY29tbW9uLmhhc2hLZXkpKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRyYWNrQnlJZE9iakZuID0gZnVuY3Rpb24gdHJhY2tCeUlkT2JqRm4oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cmFja0J5RXhwR2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkRXhwRm4gPSBmdW5jdGlvbiB0cmFja0J5SWRFeHBGbihrZXksIHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24ga2V5LCB2YWx1ZSwgYW5kICRpbmRleCB0byB0aGUgbG9jYWxzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBpbiBoYXNoIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5SWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzW2tleUlkZW50aWZpZXJdID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fsc1t2YWx1ZUlkZW50aWZpZXJdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fscy4kaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrQnlFeHBHZXR0ZXIoJHNjb3BlLCBoYXNoRm5Mb2NhbHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdEJsb2NrTWFwID0gKDAsIF9jb21tb24uY3JlYXRlTWFwKSgpO1xuICAgICAgICAgICAgdmFyIGRpZmZlcmVuY2VzID0gKDAsIF9jb21tb24uY3JlYXRlTWFwKSgpO1xuICAgICAgICAgICAgdmFyIG15T2JqZWN0cyA9IFtdO1xuICAgICAgICAgICAgdmFyIG5nUmVwZWF0TWluRXJyID0gZnVuY3Rpb24gbmdSZXBlYXRNaW5FcnIoKSB7fTtcbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24ocmhzLCBmdW5jdGlvbiBuZ1JlcGVhdEFjdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZW5jZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZDogW10sXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVkOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXAgPSAoMCwgX2NvbW1vbi5jcmVhdGVNYXApKCksXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25MZW5ndGggPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIC8vIGtleS92YWx1ZSBvZiBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICB0cmFja0J5SWQgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cyA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIC8vIGxhc3Qgb2JqZWN0IGluZm9ybWF0aW9uIHtzY29wZSwgZWxlbWVudCwgaWR9XG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmUgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxpYXNBcykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGVbYWxpYXNBc10gPSBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgoMCwgX2NvbW1vbi5pc0FycmF5TGlrZSkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMgPSBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbiA9IHRyYWNrQnlJZEV4cEZuIHx8IHRyYWNrQnlJZEFycmF5Rm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4gPSB0cmFja0J5SWRFeHBGbiB8fCB0cmFja0J5SWRPYmpGbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0LCBleHRyYWN0IGtleXMsIGluIGVudW1lcmF0aW9uIG9yZGVyLCB1bnNvcnRlZFxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtS2V5IGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbGxlY3Rpb24sIGl0ZW1LZXkpICYmIGl0ZW1LZXkuY2hhckF0KDApICE9PSAnJCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cy5wdXNoKGl0ZW1LZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbkxlbmd0aCA9IGNvbGxlY3Rpb25LZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBuZXh0QmxvY2tPcmRlciA9IG5ldyBBcnJheShjb2xsZWN0aW9uTGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIC8vIGxvY2F0ZSBleGlzdGluZyBpdGVtc1xuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNvbGxlY3Rpb25MZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gY29sbGVjdGlvbiA9PT0gY29sbGVjdGlvbktleXMgPyBpbmRleCA6IGNvbGxlY3Rpb25LZXlzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xsZWN0aW9uW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZCA9IHRyYWNrQnlJZEZuKGtleSwgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RCbG9ja01hcFt0cmFja0J5SWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3VuZCBwcmV2aW91c2x5IHNlZW4gYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXJbaW5kZXhdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGNvbGxpc2lvbiBkZXRlY3RlZC4gcmVzdG9yZSBsYXN0QmxvY2tNYXAgYW5kIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobmV4dEJsb2NrT3JkZXIsIGZ1bmN0aW9uIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiBibG9jay5zY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0QmxvY2tNYXBbYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZ1JlcGVhdE1pbkVycignZHVwZXMnLCBcIkR1cGxpY2F0ZXMgaW4gYSByZXBlYXRlciBhcmUgbm90IGFsbG93ZWQuIFVzZSAndHJhY2sgYnknIGV4cHJlc3Npb24gdG8gc3BlY2lmeSB1bmlxdWUga2V5cy4gUmVwZWF0ZXI6IHswfSwgRHVwbGljYXRlIGtleTogezF9LCBEdXBsaWNhdGUgdmFsdWU6IHsyfVwiLCBleHByZXNzaW9uLCB0cmFja0J5SWQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBuZXZlciBiZWZvcmUgc2VlbiBibG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXJbaW5kZXhdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0cmFja0J5SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcFt0cmFja0J5SWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBsZWZ0b3ZlciBpdGVtc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGJsb2NrS2V5IGluIGxhc3RCbG9ja01hcCkge1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IGxhc3RCbG9ja01hcFtibG9ja0tleV07XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmUgPSBteU9iamVjdHMuaW5kZXhPZihibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIG15T2JqZWN0cy5zcGxpY2UoZWxlbWVudHNUb1JlbW92ZSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzLnJlbW92ZWQucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gd2UgYXJlIG5vdCB1c2luZyBmb3JFYWNoIGZvciBwZXJmIHJlYXNvbnMgKHRyeWluZyB0byBhdm9pZCAjY2FsbClcbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjb2xsZWN0aW9uTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGNvbGxlY3Rpb24gPT09IGNvbGxlY3Rpb25LZXlzID8gaW5kZXggOiBjb2xsZWN0aW9uS2V5c1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29sbGVjdGlvbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IG5leHRCbG9ja09yZGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGFscmVhZHkgc2VlbiB0aGlzIG9iamVjdCwgdGhlbiB3ZSBuZWVkIHRvIHJldXNlIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzb2NpYXRlZCBzY29wZS9lbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTY29wZShibG9jay5zY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgY29sbGVjdGlvbkxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlcy5tb2RpZmllZC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBpdGVtIHdoaWNoIHdlIGRvbid0IGtub3cgYWJvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnNjb3BlID0gJHNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15T2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzLmFkZGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwW2Jsb2NrLmlkXSA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2NvcGUoYmxvY2suc2NvcGUsIGluZGV4LCB2YWx1ZUlkZW50aWZpZXIsIHZhbHVlLCBrZXlJZGVudGlmaWVyLCBrZXksIGNvbGxlY3Rpb25MZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RCbG9ja01hcCA9IG5leHRCbG9ja01hcDtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm4obXlPYmplY3RzLCBkaWZmZXJlbmNlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24gdG9SZXR1cm4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0czogbXlPYmplY3RzLFxuICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlczogZGlmZmVyZW5jZXNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUmV0dXJuLmtleUlkZW50aWZpZXIgPSBrZXlJZGVudGlmaWVyIHx8IHZhbHVlSWRlbnRpZmllcjtcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1JlcGVhdC5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kaXJlY3RpdmVQcm92aWRlciA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlUHJvdmlkZXIuanMnKTtcblxudmFyIF9kaXJlY3RpdmVQcm92aWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXJlY3RpdmVQcm92aWRlcik7XG5cbnZhciBfYXR0cmlidXRlID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2F0dHJpYnV0ZS5qcycpO1xuXG52YXIgX2F0dHJpYnV0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hdHRyaWJ1dGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZGlyZWN0aXZlSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBwcm90byA9IGFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUgfHwgYW5ndWxhci5lbGVtZW50Ll9fcHJvdG9fXztcbiAgICBwcm90by4kZmluZCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICB2YXIgdmFsdWVzID0ge1xuICAgICAgICAgICAgbGVuZ3RoOiAwXG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpc1tpbmRleF0ucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNbdmFsdWVzLmxlbmd0aCsrXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChqb2luKHZhbHVlcykpO1xuICAgIH07XG4gICAgcHJvdG8uJGNsaWNrID0gZnVuY3Rpb24gKGxvY2Fscykge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBjbGljayA9IHRoaXMuZGF0YSgnbmctY2xpY2snKTtcbiAgICAgICAgICAgIHJldHVybiBjbGljayAmJiBjbGljayhsb2NhbHMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm90by4kdGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuZGF0YSgnbmctbW9kZWwnKSB8fCB0aGlzLmRhdGEoJ25nLWJpbmQnKSB8fCB0aGlzLmRhdGEoJ25nLXRyYW5zbGF0ZScpIHx8IHRoaXMudGV4dDtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0ICYmIHRleHQuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpIHx8ICcnO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm90by4kaWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIG5nSWYgPSB0aGlzLmRhdGEoJ25nLWlmJyk7XG4gICAgICAgICAgICByZXR1cm4gbmdJZiAmJiBuZ0lmLnZhbHVlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBqb2luKG9iaikge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgb2JqKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21waWxlKG9iaiwgY29udHJvbGxlclNlcnZpY2UpIHtcbiAgICAgICAgb2JqID0gYW5ndWxhci5lbGVtZW50KG9iaik7XG5cbiAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG9ialswXS5hdHRyaWJ1dGVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZU5hbWUgPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0ubmFtZTtcbiAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUgPSBfZGlyZWN0aXZlUHJvdmlkZXIyLmRlZmF1bHQuJGdldChkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgICAgICAgICAgIHZhciBjb21waWxlZERpcmVjdGl2ZSA9IGRpcmVjdGl2ZS5jb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBvYmouZGF0YShkaXJlY3RpdmUubmFtZSwgY29tcGlsZWREaXJlY3RpdmUpO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlLmF0dGFjaFRvRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlLmF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgYW5ndWxhci5lbGVtZW50KG9iaiksIG5ldyBfYXR0cmlidXRlMi5kZWZhdWx0KG9iaikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbnMgPSBvYmouY2hpbGRyZW4oKTtcbiAgICAgICAgZm9yICh2YXIgX2lpID0gMDsgX2lpIDwgY2hpbGRyZW5zLmxlbmd0aDsgX2lpKyspIHtcbiAgICAgICAgICAgIGNvbXBpbGUoY2hpbGRyZW5zW19paV0sIGNvbnRyb2xsZXJTZXJ2aWNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnRyb2woY29udHJvbGxlclNlcnZpY2UsIG9iaikge1xuICAgICAgICB2YXIgY3VycmVudCA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xuICAgICAgICBpZiAoIWN1cnJlbnQgfHwgIWNvbnRyb2xsZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfVxuICAgICAgICBjb21waWxlKGN1cnJlbnQsIGNvbnRyb2xsZXJTZXJ2aWNlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59KCk7XG5leHBvcnRzLmRlZmF1bHQgPSBkaXJlY3RpdmVIYW5kbGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gQXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzVG9Db3B5KSB7XG4gICAgaWYgKGF0dHJpYnV0ZXNUb0NvcHkpIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzVG9Db3B5KTtcbiAgICAgICAgdmFyIGksIGwsIGtleTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBhdHRyaWJ1dGVzVG9Db3B5W2tleV07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRhdHRyID0ge307XG4gICAgfVxuXG4gICAgdGhpcy4kJGVsZW1lbnQgPSBlbGVtZW50O1xufVxudmFyICRhbmltYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJGFuaW1hdGUnKTtcbnZhciAkJHNhbml0aXplVXJpID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJCRzYW5pdGl6ZVVyaScpO1xuQXR0cmlidXRlcy5wcm90b3R5cGUgPSB7XG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkbm9ybWFsaXplXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQ29udmVydHMgYW4gYXR0cmlidXRlIG5hbWUgKGUuZy4gZGFzaC9jb2xvbi91bmRlcnNjb3JlLWRlbGltaXRlZCBzdHJpbmcsIG9wdGlvbmFsbHkgcHJlZml4ZWQgd2l0aCBgeC1gIG9yXHJcbiAgICAgKiBgZGF0YS1gKSB0byBpdHMgbm9ybWFsaXplZCwgY2FtZWxDYXNlIGZvcm0uXHJcbiAgICAgKlxyXG4gICAgICogQWxzbyB0aGVyZSBpcyBzcGVjaWFsIGNhc2UgZm9yIE1veiBwcmVmaXggc3RhcnRpbmcgd2l0aCB1cHBlciBjYXNlIGxldHRlci5cclxuICAgICAqXHJcbiAgICAgKiBGb3IgZnVydGhlciBpbmZvcm1hdGlvbiBjaGVjayBvdXQgdGhlIGd1aWRlIG9uIHtAbGluayBndWlkZS9kaXJlY3RpdmUjbWF0Y2hpbmctZGlyZWN0aXZlcyBNYXRjaGluZyBEaXJlY3RpdmVzfVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgdG8gbm9ybWFsaXplXHJcbiAgICAgKi9cbiAgICAkbm9ybWFsaXplOiBfY29tbW9uLnRvQ2FtZWxDYXNlLFxuXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkYWRkQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBBZGRzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgdG8gdGhlIGVsZW1lbnQuIElmIGFuaW1hdGlvbnNcclxuICAgICAqIGFyZSBlbmFibGVkIHRoZW4gYW4gYW5pbWF0aW9uIHdpbGwgYmUgdHJpZ2dlcmVkIGZvciB0aGUgY2xhc3MgYWRkaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzVmFsIFRoZSBjbGFzc05hbWUgdmFsdWUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgKi9cbiAgICAkYWRkQ2xhc3M6IGZ1bmN0aW9uICRhZGRDbGFzcyhjbGFzc1ZhbCkge1xuICAgICAgICBpZiAoY2xhc3NWYWwgJiYgY2xhc3NWYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsIGNsYXNzVmFsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRyZW1vdmVDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIFJlbW92ZXMgdGhlIENTUyBjbGFzcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIGNsYXNzVmFsIHBhcmFtZXRlciBmcm9tIHRoZSBlbGVtZW50LiBJZlxyXG4gICAgICogYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCB0aGVuIGFuIGFuaW1hdGlvbiB3aWxsIGJlIHRyaWdnZXJlZCBmb3IgdGhlIGNsYXNzIHJlbW92YWwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzVmFsIFRoZSBjbGFzc05hbWUgdmFsdWUgdGhhdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZWxlbWVudFxyXG4gICAgICovXG4gICAgJHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAkcmVtb3ZlQ2xhc3MoY2xhc3NWYWwpIHtcbiAgICAgICAgaWYgKGNsYXNzVmFsICYmIGNsYXNzVmFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCBjbGFzc1ZhbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkdXBkYXRlQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBBZGRzIGFuZCByZW1vdmVzIHRoZSBhcHByb3ByaWF0ZSBDU1MgY2xhc3MgdmFsdWVzIHRvIHRoZSBlbGVtZW50IGJhc2VkIG9uIHRoZSBkaWZmZXJlbmNlXHJcbiAgICAgKiBiZXR3ZWVuIHRoZSBuZXcgYW5kIG9sZCBDU1MgY2xhc3MgdmFsdWVzIChzcGVjaWZpZWQgYXMgbmV3Q2xhc3NlcyBhbmQgb2xkQ2xhc3NlcykuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld0NsYXNzZXMgVGhlIGN1cnJlbnQgQ1NTIGNsYXNzTmFtZSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9sZENsYXNzZXMgVGhlIGZvcm1lciBDU1MgY2xhc3NOYW1lIHZhbHVlXHJcbiAgICAgKi9cbiAgICAkdXBkYXRlQ2xhc3M6IGZ1bmN0aW9uICR1cGRhdGVDbGFzcyhuZXdDbGFzc2VzLCBvbGRDbGFzc2VzKSB7XG4gICAgICAgIHZhciB0b0FkZCA9IHRva2VuRGlmZmVyZW5jZShuZXdDbGFzc2VzLCBvbGRDbGFzc2VzKTtcbiAgICAgICAgaWYgKHRvQWRkICYmIHRvQWRkLmxlbmd0aCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsIHRvQWRkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b1JlbW92ZSA9IHRva2VuRGlmZmVyZW5jZShvbGRDbGFzc2VzLCBuZXdDbGFzc2VzKTtcbiAgICAgICAgaWYgKHRvUmVtb3ZlICYmIHRvUmVtb3ZlLmxlbmd0aCkge1xuICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsIHRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcclxuICAgICAqIFNldCBhIG5vcm1hbGl6ZWQgYXR0cmlidXRlIG9uIHRoZSBlbGVtZW50IGluIGEgd2F5IHN1Y2ggdGhhdCBhbGwgZGlyZWN0aXZlc1xyXG4gICAgICogY2FuIHNoYXJlIHRoZSBhdHRyaWJ1dGUuIFRoaXMgZnVuY3Rpb24gcHJvcGVybHkgaGFuZGxlcyBib29sZWFuIGF0dHJpYnV0ZXMuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xib29sZWFufSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LiBJZiBgbnVsbGAgYXR0cmlidXRlIHdpbGwgYmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHdyaXRlQXR0ciBJZiBmYWxzZSwgZG9lcyBub3Qgd3JpdGUgdGhlIHZhbHVlIHRvIERPTSBlbGVtZW50IGF0dHJpYnV0ZS5cclxuICAgICAqICAgICBEZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBhdHRyTmFtZSBPcHRpb25hbCBub25lIG5vcm1hbGl6ZWQgbmFtZS4gRGVmYXVsdHMgdG8ga2V5LlxyXG4gICAgICovXG4gICAgJHNldDogZnVuY3Rpb24gJHNldChrZXksIHZhbHVlLCB3cml0ZUF0dHIsIGF0dHJOYW1lKSB7XG4gICAgICAgIC8vIFRPRE86IGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byB0aHJvdyBhbiBlcnJvciBpZiBcImNsYXNzXCJcbiAgICAgICAgLy9pcyBzZXQgdGhyb3VnaCB0aGlzIGZ1bmN0aW9uIHNpbmNlIGl0IG1heSBjYXVzZSAkdXBkYXRlQ2xhc3MgdG9cbiAgICAgICAgLy9iZWNvbWUgdW5zdGFibGUuXG5cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLiQkZWxlbWVudFswXSxcbiAgICAgICAgICAgIGJvb2xlYW5LZXkgPSBhbmd1bGFyLmdldEJvb2xlYW5BdHRyTmFtZShub2RlLCBrZXkpLFxuICAgICAgICAgICAgYWxpYXNlZEtleSA9IGFuZ3VsYXIuZ2V0QWxpYXNlZEF0dHJOYW1lKGtleSksXG4gICAgICAgICAgICBvYnNlcnZlciA9IGtleSxcbiAgICAgICAgICAgIG5vZGVOYW1lO1xuXG4gICAgICAgIGlmIChib29sZWFuS2V5KSB7XG4gICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5wcm9wKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBib29sZWFuS2V5O1xuICAgICAgICB9IGVsc2UgaWYgKGFsaWFzZWRLZXkpIHtcbiAgICAgICAgICAgIHRoaXNbYWxpYXNlZEtleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIG9ic2VydmVyID0gYWxpYXNlZEtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNba2V5XSA9IHZhbHVlO1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBub3JtYWxpemVkIGtleSB0byBhY3R1YWwga2V5XG4gICAgICAgIGlmIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgdGhpcy4kYXR0cltrZXldID0gYXR0ck5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IHRoaXMuJGF0dHJba2V5XTtcbiAgICAgICAgICAgIGlmICghYXR0ck5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRhdHRyW2tleV0gPSBhdHRyTmFtZSA9ICgwLCBfY29tbW9uLnRvU25ha2VDYXNlKShrZXksICctJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBub2RlTmFtZSA9IG5vZGVOYW1lXyh0aGlzLiQkZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKG5vZGVOYW1lID09PSAnYScgJiYgKGtleSA9PT0gJ2hyZWYnIHx8IGtleSA9PT0gJ3hsaW5rSHJlZicpIHx8IG5vZGVOYW1lID09PSAnaW1nJyAmJiBrZXkgPT09ICdzcmMnKSB7XG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSBhW2hyZWZdIGFuZCBpbWdbc3JjXSB2YWx1ZXNcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlID0gJCRzYW5pdGl6ZVVyaSh2YWx1ZSwga2V5ID09PSAnc3JjJyk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyY3NldCcgJiYgYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSBpbWdbc3Jjc2V0XSB2YWx1ZXNcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAvLyBmaXJzdCBjaGVjayBpZiB0aGVyZSBhcmUgc3BhY2VzIGJlY2F1c2UgaXQncyBub3QgdGhlIHNhbWUgcGF0dGVyblxuICAgICAgICAgICAgdmFyIHRyaW1tZWRTcmNzZXQgPSAoMCwgX2NvbW1vbi50cmltKSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoICAgOTk5eCAgICx8ICAgOTk5dyAgICx8ICAgLHwsICAgKVxuICAgICAgICAgICAgdmFyIHNyY1BhdHRlcm4gPSAvKFxccytcXGQreFxccyosfFxccytcXGQrd1xccyosfFxccyssfCxcXHMrKS87XG4gICAgICAgICAgICB2YXIgcGF0dGVybiA9IC9cXHMvLnRlc3QodHJpbW1lZFNyY3NldCkgPyBzcmNQYXR0ZXJuIDogLygsKS87XG5cbiAgICAgICAgICAgIC8vIHNwbGl0IHNyY3NldCBpbnRvIHR1cGxlIG9mIHVyaSBhbmQgZGVzY3JpcHRvciBleGNlcHQgZm9yIHRoZSBsYXN0IGl0ZW1cbiAgICAgICAgICAgIHZhciByYXdVcmlzID0gdHJpbW1lZFNyY3NldC5zcGxpdChwYXR0ZXJuKTtcblxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggdHVwbGVzXG4gICAgICAgICAgICB2YXIgbmJyVXJpc1dpdGgycGFydHMgPSBNYXRoLmZsb29yKHJhd1VyaXMubGVuZ3RoIC8gMik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5iclVyaXNXaXRoMnBhcnRzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJJZHggPSBpICogMjtcbiAgICAgICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgdXJpXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICQkc2FuaXRpemVVcmkoKDAsIF9jb21tb24udHJpbSkocmF3VXJpc1tpbm5lcklkeF0pLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGRlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCIgXCIgKyAoMCwgX2NvbW1vbi50cmltKShyYXdVcmlzW2lubmVySWR4ICsgMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzcGxpdCB0aGUgbGFzdCBpdGVtIGludG8gdXJpIGFuZCBkZXNjcmlwdG9yXG4gICAgICAgICAgICB2YXIgbGFzdFR1cGxlID0gKDAsIF9jb21tb24udHJpbSkocmF3VXJpc1tpICogMl0pLnNwbGl0KC9cXHMvKTtcblxuICAgICAgICAgICAgLy8gc2FuaXRpemUgdGhlIGxhc3QgdXJpXG4gICAgICAgICAgICByZXN1bHQgKz0gJCRzYW5pdGl6ZVVyaSgoMCwgX2NvbW1vbi50cmltKShsYXN0VHVwbGVbMF0pLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gYW5kIGFkZCB0aGUgbGFzdCBkZXNjcmlwdG9yIGlmIGFueVxuICAgICAgICAgICAgaWYgKGxhc3RUdXBsZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCIgXCIgKyAoMCwgX2NvbW1vbi50cmltKShsYXN0VHVwbGVbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod3JpdGVBdHRyICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJGVsZW1lbnQucmVtb3ZlQXR0cihhdHRyTmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChTSU1QTEVfQVRUUl9OQU1FLnRlc3QoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJCRlbGVtZW50LmF0dHIoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRTcGVjaWFsQXR0cih0aGlzLiQkZWxlbWVudFswXSwgYXR0ck5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXJlIG9ic2VydmVyc1xuICAgICAgICB2YXIgJCRvYnNlcnZlcnMgPSB0aGlzLiQkb2JzZXJ2ZXJzO1xuICAgICAgICBpZiAoJCRvYnNlcnZlcnMpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkJG9ic2VydmVyc1tvYnNlcnZlcl0sIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG9ic2VydmVcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBPYnNlcnZlcyBhbiBpbnRlcnBvbGF0ZWQgYXR0cmlidXRlLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBvYnNlcnZlciBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgb25jZSBkdXJpbmcgdGhlIG5leHQgYCRkaWdlc3RgIGZvbGxvd2luZ1xyXG4gICAgICogY29tcGlsYXRpb24uIFRoZSBvYnNlcnZlciBpcyB0aGVuIGludm9rZWQgd2hlbmV2ZXIgdGhlIGludGVycG9sYXRlZCB2YWx1ZVxyXG4gICAgICogY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE5vcm1hbGl6ZWQga2V5LiAoaWUgbmdBdHRyaWJ1dGUpIC5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oaW50ZXJwb2xhdGVkVmFsdWUpfSBmbiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyXHJcbiAgICAgICAgICAgICAgdGhlIGludGVycG9sYXRlZCB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGNoYW5nZXMuXHJcbiAgICAgKiAgICAgICAgU2VlIHRoZSB7QGxpbmsgZ3VpZGUvaW50ZXJwb2xhdGlvbiNob3ctdGV4dC1hbmQtYXR0cmlidXRlLWJpbmRpbmdzLXdvcmsgSW50ZXJwb2xhdGlvblxyXG4gICAgICogICAgICAgIGd1aWRlfSBmb3IgbW9yZSBpbmZvLlxyXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9uKCl9IFJldHVybnMgYSBkZXJlZ2lzdHJhdGlvbiBmdW5jdGlvbiBmb3IgdGhpcyBvYnNlcnZlci5cclxuICAgICAqL1xuICAgICRvYnNlcnZlOiBmdW5jdGlvbiAkb2JzZXJ2ZShrZXksIGZuKSB7XG4gICAgICAgIHZhciBhdHRycyA9IHRoaXMsXG4gICAgICAgICAgICAkJG9ic2VydmVycyA9IGF0dHJzLiQkb2JzZXJ2ZXJzIHx8IChhdHRycy4kJG9ic2VydmVycyA9IG5ldyBNYXAoKSksXG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSAkJG9ic2VydmVyc1trZXldIHx8ICgkJG9ic2VydmVyc1trZXldID0gW10pO1xuXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGZuKTtcbiAgICAgICAgX2NvbW1vbi5zY29wZUhlbHBlci4kcm9vdFNjb3BlLiRldmFsQXN5bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFsaXN0ZW5lcnMuJCRpbnRlciAmJiBhdHRycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFhbmd1bGFyLmlzVW5kZWZpbmVkKGF0dHJzW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gb25lIHJlZ2lzdGVyZWQgYXR0cmlidXRlIGludGVycG9sYXRpb24gZnVuY3Rpb24sIHNvIGxldHMgY2FsbCBpdCBtYW51YWxseVxuICAgICAgICAgICAgICAgIGZuKGF0dHJzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYW5ndWxhci5hcnJheVJlbW92ZShsaXN0ZW5lcnMsIGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiB0b2tlbkRpZmZlcmVuY2Uoc3RyMSwgc3RyMikge1xuXG4gICAgdmFyIHZhbHVlcyA9ICcnLFxuICAgICAgICB0b2tlbnMxID0gc3RyMS5zcGxpdCgvXFxzKy8pLFxuICAgICAgICB0b2tlbnMyID0gc3RyMi5zcGxpdCgvXFxzKy8pO1xuXG4gICAgb3V0ZXI6IGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zMS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdG9rZW4gPSB0b2tlbnMxW2ldO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG9rZW5zMi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHRva2VuID09PSB0b2tlbnMyW2pdKSB7XG4gICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXMgKz0gKHZhbHVlcy5sZW5ndGggPiAwID8gJyAnIDogJycpICsgdG9rZW47XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG59XG5cbmZ1bmN0aW9uIG5vZGVOYW1lXyhlbGVtZW50KSB7XG4gICAgdmFyIG15RWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KVswXTtcbiAgICBpZiAobXlFbGVtKSB7XG4gICAgICAgIHJldHVybiBteUVsZW0ubm9kZU5hbWU7XG4gICAgfVxufVxudmFyIHNwZWNpYWxBdHRySG9sZGVyID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xudmFyIFNJTVBMRV9BVFRSX05BTUUgPSAvXlxcdy87XG5cbmZ1bmN0aW9uIHNldFNwZWNpYWxBdHRyKGVsZW1lbnQsIGF0dHJOYW1lLCB2YWx1ZSkge1xuICAgIC8vIEF0dHJpYnV0ZXMgbmFtZXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBsZXR0ZXJzIChzdWNoIGFzIGAoY2xpY2spYCkgY2Fubm90IGJlIHNldCB1c2luZyBgc2V0QXR0cmlidXRlYFxuICAgIC8vIHNvIHdlIGhhdmUgdG8ganVtcCB0aHJvdWdoIHNvbWUgaG9vcHMgdG8gZ2V0IHN1Y2ggYW4gYXR0cmlidXRlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9wdWxsLzEzMzE4XG4gICAgc3BlY2lhbEF0dHJIb2xkZXIuaW5uZXJIVE1MID0gXCI8c3BhbiBcIiArIGF0dHJOYW1lICsgXCI+XCI7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzcGVjaWFsQXR0ckhvbGRlci5maXJzdENoaWxkLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbMF07XG4gICAgLy8gV2UgaGF2ZSB0byByZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tIGl0cyBjb250YWluZXIgZWxlbWVudCBiZWZvcmUgd2UgY2FuIGFkZCBpdCB0byB0aGUgZGVzdGluYXRpb24gZWxlbWVudFxuICAgIGF0dHJpYnV0ZXMucmVtb3ZlTmFtZWRJdGVtKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICBhdHRyaWJ1dGUudmFsdWUgPSB2YWx1ZTtcbiAgICBlbGVtZW50LmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGF0dHJpYnV0ZSk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBdHRyaWJ1dGVzO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVyL2F0dHJpYnV0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyk7XG5cbnZhciBjb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBjb250cm9sbGVyKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoY29udHJvbGxlciwgbnVsbCwgW3tcbiAgICAgICAga2V5OiAnZ2V0VmFsdWVzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpIHtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IHt9O1xuICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBiaW5kaW5ncyA9PT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJz0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2NvbW1vbi5QQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMoYmluZGluZ3Nba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2RlID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICc9JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSAkcGFyc2UocGFyZW50R2V0KHNjb3BlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oc2NvcGUsIGxvY2Fscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRXhwID0gKDAsIF9jb21tb24uaXNFeHByZXNzaW9uKShleHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAkcGFyc2UoKDAsIF9jb21tb24uZXhwcmVzc2lvblNhbml0aXplcikoZXhwKSkoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IHBhcmVudEdldChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdwYXJzZUJpbmRpbmdzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBpc29sYXRlU2NvcGUsIGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgdmFyIGFzc2lnbkJpbmRpbmdzID0gZnVuY3Rpb24gYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXksIG1vZGUpIHtcbiAgICAgICAgICAgICAgICBtb2RlID0gbW9kZSB8fCAnPSc7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9jb21tb24uUEFSU0VfQklORElOR19SRUdFWC5leGVjKG1vZGUpO1xuICAgICAgICAgICAgICAgIG1vZGUgPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkS2V5ID0gY29udHJvbGxlckFzICsgJy4nICsga2V5O1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRHZXQgPSAkcGFyc2UoY2hpbGRLZXkpO1xuICAgICAgICAgICAgICAgIHZhciB1bndhdGNoO1xuXG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICc9JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50VmFsdWVXYXRjaCA9IGZ1bmN0aW9uIHBhcmVudFZhbHVlV2F0Y2goKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIHBhcmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gY2hpbGRHZXQoZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50R2V0LmFzc2lnbihzY29wZSwgcGFyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnQCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRXhwID0gKDAsIF9jb21tb24uaXNFeHByZXNzaW9uKShzY29wZVtwYXJlbnRLZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFeHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHAgPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50R2V0ID0gJHBhcnNlKCgwLCBfY29tbW9uLmV4cHJlc3Npb25TYW5pdGl6ZXIpKGV4cCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRWYWx1ZVdhdGNoID0gZnVuY3Rpb24gcGFyZW50VmFsdWVXYXRjaCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSwgaXNvbGF0ZVNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IF9jb21tb24uc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSAmJiBrZXkgIT09IGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfa2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShfa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBfa2V5LCBiaW5kaW5nc1tfa2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBwYXJzZSBiaW5kaW5ncyc7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJyRnZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gJGdldChtb2R1bGVOYW1lcykge1xuICAgICAgICAgICAgdmFyICRjb250cm9sbGVyID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gKDAsIF9jb21tb24ubWFrZUFycmF5KShtb2R1bGVOYW1lcyk7XG4gICAgICAgICAgICAvLyBjb25zdCBpbmRleE1vY2sgPSBhcnJheS5pbmRleE9mKCduZ01vY2snKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGluZGV4TmcgPSBhcnJheS5pbmRleE9mKCduZycpO1xuICAgICAgICAgICAgLy8gaWYgKGluZGV4TW9jayAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vICAgICBhcnJheVtpbmRleE1vY2tdID0gJ25nJztcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGlmIChpbmRleE5nID09PSAtMSkge1xuICAgICAgICAgICAgLy8gICAgIGFycmF5LnB1c2goJ25nJyk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBhbmd1bGFyLmluamVjdG9yKGFycmF5KS5pbnZva2UoWyckY29udHJvbGxlcicsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgICAgICAgICAgfV0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBzY29wZSwgYmluZGluZ3MsIHNjb3BlQ29udHJvbGxlck5hbWUsIGV4dGVuZGVkTG9jYWxzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XG4gICAgICAgICAgICAgICAgc2NvcGVDb250cm9sbGVyTmFtZSA9IHNjb3BlQ29udHJvbGxlck5hbWUgfHwgJ2NvbnRyb2xsZXInO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSAoMCwgX2NvbW1vbi5leHRlbmQpKGV4dGVuZGVkTG9jYWxzIHx8IHt9LCB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZTogX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAoMCwgX2NvbW1vbi5leHRlbmQpKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBjb250cm9sbGVyLmdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncyA9IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gYiB8fCBiaW5kaW5ncztcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9jYWxzID0gbXlMb2NhbHMgfHwgbG9jYWxzO1xuICAgICAgICAgICAgICAgICAgICAvLyBiID0gYiB8fCBiaW5kaW5ncztcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy9leHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGV4dGVuZGVkTG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlQ29udHJvbGxlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjb250cm9sbGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9