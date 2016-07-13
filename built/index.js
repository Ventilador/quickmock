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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjQzMzI0ZjlhZThiMzhiNmU5ZWYiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvaW5kZXgubG9hZGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L3F1aWNrbW9jay5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9xdWlja21vY2subW9ja0hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBLHdCOzs7Ozs7QUNGQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx1Q0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBc0I7QUFDdEI7O0FBRUE7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBbUMsNkJBQTZCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsK0NBQStDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTJDLFlBQVk7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxFOzs7Ozs7QUM5U0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxFOzs7Ozs7QUN4SEE7O0FBRUE7QUFDQTtBQUNBLEVBQUM7QUFDRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBZ0Q7QUFDaEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esc0VBQXFFO0FBQ3JFO0FBQ0Esa0JBQWlCOztBQUVqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVELDhCIiwiZmlsZSI6Ii4vYnVpbHQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGY0MzMyNGY5YWU4YjM4YjZlOWVmXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL3F1aWNrbW9jay5qcycpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9pbmRleC5sb2FkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9xdWlja21vY2tNb2NrSGVscGVyID0gcmVxdWlyZSgnLi9xdWlja21vY2subW9ja0hlbHBlci5qcycpO1xuXG52YXIgX3F1aWNrbW9ja01vY2tIZWxwZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcXVpY2ttb2NrTW9ja0hlbHBlcik7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG52YXIgX2NvbnRyb2xsZXJIYW5kbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcycpO1xuXG52YXIgX2NvbnRyb2xsZXJIYW5kbGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbnRyb2xsZXJIYW5kbGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIG1vY2tlciA9IGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgdmFyIG9wdHMsIG1vY2tQcmVmaXg7XG4gICAgdmFyIGNvbnRyb2xsZXJEZWZhdWx0cyA9IGZ1bmN0aW9uIGNvbnRyb2xsZXJEZWZhdWx0cyhmbGFnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgcGFyZW50U2NvcGU6IHt9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29udHJvbGxlcicsXG4gICAgICAgICAgICBpc0RlZmF1bHQ6ICFmbGFnXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBxdWlja21vY2suTU9DS19QUkVGSVggPSBtb2NrUHJlZml4ID0gcXVpY2ttb2NrLk1PQ0tfUFJFRklYIHx8ICdfX18nO1xuICAgIHF1aWNrbW9jay5VU0VfQUNUVUFMID0gJ1VTRV9BQ1RVQUxfSU1QTEVNRU5UQVRJT04nO1xuICAgIHF1aWNrbW9jay5NVVRFX0xPR1MgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIHF1aWNrbW9jayhvcHRpb25zKSB7XG4gICAgICAgIG9wdHMgPSBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBtb2NrUHJvdmlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb2NrUHJvdmlkZXIoKSB7XG4gICAgICAgIHZhciBhbGxNb2R1bGVzID0gb3B0cy5tb2NrTW9kdWxlcy5jb25jYXQoWyduZ01vY2snXSksXG4gICAgICAgICAgICBpbmplY3RvciA9IGFuZ3VsYXIuaW5qZWN0b3IoYWxsTW9kdWxlcy5jb25jYXQoW29wdHMubW9kdWxlTmFtZV0pKSxcbiAgICAgICAgICAgIG1vZE9iaiA9IGFuZ3VsYXIubW9kdWxlKG9wdHMubW9kdWxlTmFtZSksXG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IG1vZE9iai5faW52b2tlUXVldWUgfHwgW10sXG4gICAgICAgICAgICBwcm92aWRlclR5cGUgPSBnZXRQcm92aWRlclR5cGUob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSxcbiAgICAgICAgICAgIG1vY2tzID0ge30sXG4gICAgICAgICAgICBwcm92aWRlciA9IHt9O1xuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxNb2R1bGVzIHx8IFtdLCBmdW5jdGlvbiAobW9kTmFtZSkge1xuICAgICAgICAgICAgaW52b2tlUXVldWUgPSBpbnZva2VRdWV1ZS5jb25jYXQoYW5ndWxhci5tb2R1bGUobW9kTmFtZSkuX2ludm9rZVF1ZXVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG9wdHMuaW5qZWN0KSB7XG4gICAgICAgICAgICBpbmplY3Rvci5pbnZva2Uob3B0cy5pbmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3ZpZGVyVHlwZSkge1xuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGludm9rZVF1ZXVlLCBmaW5kIHRoaXMgcHJvdmlkZXIncyBkZXBlbmRlbmNpZXMgYW5kIHByZWZpeFxuICAgICAgICAgICAgLy8gdGhlbSBzbyBBbmd1bGFyIHdpbGwgaW5qZWN0IHRoZSBtb2NrZWQgdmVyc2lvbnNcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24gKHByb3ZpZGVyRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJOYW1lID0gcHJvdmlkZXJEYXRhWzJdWzBdO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJOYW1lID09PSBvcHRzLnByb3ZpZGVyTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzID0gY3VyclByb3ZpZGVyRGVwcy4kaW5qZWN0IHx8IGluamVjdG9yLmFubm90YXRlKGN1cnJQcm92aWRlckRlcHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyUHJvdmlkZXJEZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNGdW5jdGlvbihjdXJyUHJvdmlkZXJEZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBOYW1lID0gY3VyclByb3ZpZGVyRGVwc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2Nrc1tkZXBOYW1lXSA9IGdldE1vY2tGb3JQcm92aWRlcihkZXBOYW1lLCBjdXJyUHJvdmlkZXJEZXBzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAocHJvdmlkZXJUeXBlID09PSAnZGlyZWN0aXZlJykge1xuICAgICAgICAgICAgICAgIHNldHVwRGlyZWN0aXZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldHVwSW5pdGlhbGl6ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZva2VRdWV1ZSwgZnVuY3Rpb24gKHByb3ZpZGVyRGF0YSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBwcmVmaXhlZCBkZXBlbmRlbmNpZXMgdGhhdCBwZXJzaXN0ZWQgZnJvbSBhIHByZXZpb3VzIGNhbGwsXG4gICAgICAgICAgICAvLyBhbmQgY2hlY2sgZm9yIGFueSBub24tYW5ub3RhdGVkIHNlcnZpY2VzXG4gICAgICAgICAgICBzYW5pdGl6ZVByb3ZpZGVyKHByb3ZpZGVyRGF0YSwgaW5qZWN0b3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBJbml0aWFsaXplcigpIHtcbiAgICAgICAgICAgIHByb3ZpZGVyID0gaW5pdFByb3ZpZGVyKCk7XG4gICAgICAgICAgICBpZiAob3B0cy5zcHlPblByb3ZpZGVyTWV0aG9kcykge1xuICAgICAgICAgICAgICAgIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xuICAgICAgICAgICAgcHJvdmlkZXIuJGluaXRpYWxpemUgPSBzZXR1cEluaXRpYWxpemVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdFByb3ZpZGVyKCkge1xuICAgICAgICAgICAgc3dpdGNoIChwcm92aWRlclR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gX2NvbnRyb2xsZXJIYW5kbGVyMi5kZWZhdWx0LmNsZWFuKCkuYWRkTW9kdWxlcyhhbGxNb2R1bGVzLmNvbmNhdChvcHRzLm1vZHVsZU5hbWUpKS5iaW5kV2l0aChvcHRzLmNvbnRyb2xsZXIuYmluZFRvQ29udHJvbGxlcikuc2V0U2NvcGUob3B0cy5jb250cm9sbGVyLnBhcmVudFNjb3BlKS5zZXRMb2NhbHMobW9ja3MpLm5ldyhvcHRzLnByb3ZpZGVyTmFtZSwgb3B0cy5jb250cm9sbGVyLmNvbnRyb2xsZXJBcyk7XG4gICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuLmNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbW9ja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2Nrcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja3Nba2V5XSA9IHRvUmV0dXJuLmNvbnRyb2xsZXJJbnN0YW5jZVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbnRyb2xsZXIuaXNEZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZpbHRlciA9IGluamVjdG9yLmdldCgnJGZpbHRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZpbHRlcihvcHRzLnByb3ZpZGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgY2FzZSAnYW5pbWF0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRhbmltYXRlOiBpbmplY3Rvci5nZXQoJyRhbmltYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLm1vY2subW9kdWxlKCduZ0FuaW1hdGVNb2NrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChvcHRzLnByb3ZpZGVyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXR1cERpcmVjdGl2ZSgpIHtcbiAgICAgICAgICAgIHZhciAkY29tcGlsZSA9IGluamVjdG9yLmdldCgnJGNvbXBpbGUnKTtcbiAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZSA9IGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpLiRuZXcoKTtcbiAgICAgICAgICAgIHByb3ZpZGVyLiRtb2NrcyA9IG1vY2tzO1xuXG4gICAgICAgICAgICBwcm92aWRlci4kY29tcGlsZSA9IGZ1bmN0aW9uIHF1aWNrbW9ja0NvbXBpbGUoaHRtbCkge1xuICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sIHx8IG9wdHMuaHRtbDtcbiAgICAgICAgICAgICAgICBpZiAoIWh0bWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gTm8gaHRtbCBzdHJpbmcvb2JqZWN0IHByb3ZpZGVkLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChodG1sKSkge1xuICAgICAgICAgICAgICAgICAgICBodG1sID0gZ2VuZXJhdGVIdG1sU3RyaW5nRnJvbU9iaihodG1sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoaHRtbCk7XG4gICAgICAgICAgICAgICAgcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMob3B0cy5wcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKTtcbiAgICAgICAgICAgICAgICAkY29tcGlsZShwcm92aWRlci4kZWxlbWVudCkocHJvdmlkZXIuJHNjb3BlKTtcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRpc29TY29wZSA9IHByb3ZpZGVyLiRlbGVtZW50Lmlzb2xhdGVTY29wZSgpO1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyLiRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpIHtcbiAgICAgICAgICAgIHZhciBkZXBUeXBlID0gZ2V0UHJvdmlkZXJUeXBlKGRlcE5hbWUsIGludm9rZVF1ZXVlKSxcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBkZXBOYW1lO1xuICAgICAgICAgICAgaWYgKG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAmJiBvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gIT09IHF1aWNrbW9jay5VU0VfQUNUVUFMKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSA9PT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcbiAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBUeXBlID09PSAndmFsdWUnIHx8IGRlcFR5cGUgPT09ICdjb25zdGFudCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5qZWN0b3IuaGFzKG1vY2tQcmVmaXggKyBkZXBOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1ByZWZpeCArIGRlcE5hbWU7XG4gICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tTZXJ2aWNlTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IuaGFzKG1vY2tTZXJ2aWNlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0cy51c2VBY3R1YWxEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVpY2ttb2NrTG9nKCdxdWlja21vY2s6IFVzaW5nIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBcIicgKyBkZXBOYW1lICsgJ1wiICcgKyBkZXBUeXBlICsgJyBpbnN0ZWFkIG9mIG1vY2snKTtcbiAgICAgICAgICAgICAgICAgICAgbW9ja1NlcnZpY2VOYW1lID0gbW9ja1NlcnZpY2VOYW1lLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgaW5qZWN0IG1vY2sgZm9yIFwiJyArIGRlcE5hbWUgKyAnXCIgYmVjYXVzZSBubyBzdWNoIG1vY2sgZXhpc3RzLiBQbGVhc2Ugd3JpdGUgYSBtb2NrICcgKyBkZXBUeXBlICsgJyBjYWxsZWQgXCInICsgbW9ja1NlcnZpY2VOYW1lICsgJ1wiIChvciBzZXQgdGhlIHVzZUFjdHVhbERlcGVuZGVuY2llcyB0byB0cnVlKSBhbmQgdHJ5IGFnYWluLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbmplY3Rvci5nZXQobW9ja1NlcnZpY2VOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcikge1xuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhwcm92aWRlckRhdGFbMl1bMF0pICYmIHByb3ZpZGVyRGF0YVsyXVswXS5pbmRleE9mKG1vY2tQcmVmaXgpID09PSAtMSkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwcm92aWRlckRhdGFbMl1bMV0pKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZXIgZGVjbGFyYXRpb24gZnVuY3Rpb24gaGFzIGJlZW4gcHJvdmlkZWQgd2l0aG91dCB0aGUgYXJyYXkgYW5ub3RhdGlvbixcbiAgICAgICAgICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGFubm90YXRlIGl0IHNvIHRoZSBpbnZva2VRdWV1ZSBjYW4gYmUgcHJlZml4ZWRcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGVkRGVwZW5kZW5jaWVzID0gaW5qZWN0b3IuYW5ub3RhdGUocHJvdmlkZXJEYXRhWzJdWzFdKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgcHJvdmlkZXJEYXRhWzJdWzFdLiRpbmplY3Q7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGVkRGVwZW5kZW5jaWVzLnB1c2gocHJvdmlkZXJEYXRhWzJdWzFdKTtcbiAgICAgICAgICAgICAgICBwcm92aWRlckRhdGFbMl1bMV0gPSBhbm5vdGF0ZWREZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoY3VyclByb3ZpZGVyRGVwcykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXNzZXJ0UmVxdWlyZWRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuYW5ndWxhcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbml0aWFsaXplIGJlY2F1c2UgYW5ndWxhciBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgbG9hZCBhbmd1bGFyIGJlZm9yZSBsb2FkaW5nIHF1aWNrbW9jay5qcy4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wdGlvbnMucHJvdmlkZXJOYW1lICYmICFvcHRpb25zLmNvbmZpZ0Jsb2NrcyAmJiAhb3B0aW9ucy5ydW5CbG9ja3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBwcm92aWRlck5hbWUgZ2l2ZW4uIFlvdSBtdXN0IGdpdmUgdGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdCwgb3Igc2V0IHRoZSBjb25maWdCbG9ja3Mgb3IgcnVuQmxvY2tzIGZsYWdzLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb3B0aW9ucy5tb2R1bGVOYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogTm8gbW9kdWxlTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgY29udGFpbnMgdGhlIHByb3ZpZGVyL3NlcnZpY2UgeW91IHdpc2ggdG8gdGVzdC4nKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLm1vY2tNb2R1bGVzID0gb3B0aW9ucy5tb2NrTW9kdWxlcyB8fCBbXTtcbiAgICAgICAgb3B0aW9ucy5tb2NrcyA9IG9wdGlvbnMubW9ja3MgfHwge307XG4gICAgICAgIG9wdGlvbnMuY29udHJvbGxlciA9ICgwLCBfY29tbW9uLmV4dGVuZCkob3B0aW9ucy5jb250cm9sbGVyLCBjb250cm9sbGVyRGVmYXVsdHMoYW5ndWxhci5pc0RlZmluZWQob3B0aW9ucy5jb250cm9sbGVyKSkpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHlPblByb3ZpZGVyTWV0aG9kcyhwcm92aWRlcikge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gocHJvdmlkZXIsIGZ1bmN0aW9uIChwcm9wZXJ0eSwgcHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuamFzbWluZSAmJiB3aW5kb3cuc3B5T24gJiYgIXByb3BlcnR5LmNhbGxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHkgPSBzcHlPbihwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNweS5hbmRDYWxsVGhyb3VnaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3B5LmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5zaW5vbiAmJiB3aW5kb3cuc2lub24uc3B5KSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zaW5vbi5zcHkocHJvdmlkZXIsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm92aWRlclR5cGUocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludm9rZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXJJbmZvID0gaW52b2tlUXVldWVbaV07XG4gICAgICAgICAgICBpZiAocHJvdmlkZXJJbmZvWzJdWzBdID09PSBwcm92aWRlck5hbWUpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVySW5mb1swXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICckcHJvdmlkZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdmlkZXJJbmZvWzFdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICckY29udHJvbGxlclByb3ZpZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnY29udHJvbGxlcic7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb21waWxlUHJvdmlkZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUnO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICckZmlsdGVyUHJvdmlkZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmaWx0ZXInO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICckYW5pbWF0ZVByb3ZpZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnYW5pbWF0aW9uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlZml4UHJvdmlkZXJEZXBlbmRlbmNpZXMocHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdW5wcmVmaXgpIHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbiAocHJvdmlkZXJEYXRhKSB7XG4gICAgICAgICAgICBpZiAocHJvdmlkZXJEYXRhWzJdWzBdID09PSBwcm92aWRlck5hbWUgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlckRlcHMgPSBwcm92aWRlckRhdGFbMl1bMV07XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5wcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gY3VyclByb3ZpZGVyRGVwc1tpXS5yZXBsYWNlKG1vY2tQcmVmaXgsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyclByb3ZpZGVyRGVwc1tpXS5pbmRleE9mKG1vY2tQcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IG1vY2tQcmVmaXggKyBjdXJyUHJvdmlkZXJEZXBzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpIHtcbiAgICAgICAgaWYgKCFodG1sLiR0YWcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBDYW5ub3QgY29tcGlsZSBcIicgKyBvcHRzLnByb3ZpZGVyTmFtZSArICdcIiBkaXJlY3RpdmUuIEh0bWwgb2JqZWN0IGRvZXMgbm90IGNvbnRhaW4gJHRhZyBwcm9wZXJ0eS4nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaHRtbEF0dHJzID0gaHRtbCxcbiAgICAgICAgICAgIHRhZ05hbWUgPSBodG1sQXR0cnMuJHRhZyxcbiAgICAgICAgICAgIGh0bWxDb250ZW50ID0gaHRtbEF0dHJzLiRjb250ZW50O1xuICAgICAgICBodG1sID0gJzwnICsgdGFnTmFtZSArICcgJztcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGh0bWxBdHRycywgZnVuY3Rpb24gKHZhbCwgYXR0cikge1xuICAgICAgICAgICAgaWYgKGF0dHIgIT09ICckY29udGVudCcgJiYgYXR0ciAhPT0gJyR0YWcnKSB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBzbmFrZV9jYXNlKGF0dHIpICsgKHZhbCA/ICc9XCInICsgdmFsICsgJ1wiICcgOiAnICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaHRtbCArPSBodG1sQ29udGVudCA/ICc+JyArIGh0bWxDb250ZW50IDogJz4nO1xuICAgICAgICBodG1sICs9ICc8LycgKyB0YWdOYW1lICsgJz4nO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWlja21vY2tMb2cobXNnKSB7XG4gICAgICAgIGlmICghcXVpY2ttb2NrLk1VVEVfTE9HUykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBTTkFLRV9DQVNFX1JFR0VYUCA9IC9bQS1aXS9nO1xuXG4gICAgZnVuY3Rpb24gc25ha2VfY2FzZShuYW1lLCBzZXBhcmF0b3IpIHtcbiAgICAgICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yIHx8ICctJztcbiAgICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZShTTkFLRV9DQVNFX1JFR0VYUCwgZnVuY3Rpb24gKGxldHRlciwgcG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gKHBvcyA/IHNlcGFyYXRvciA6ICcnKSArIGxldHRlci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcXVpY2ttb2NrO1xufShhbmd1bGFyKTtcbigwLCBfcXVpY2ttb2NrTW9ja0hlbHBlcjIuZGVmYXVsdCkobW9ja2VyKTtcbmV4cG9ydHMuZGVmYXVsdCA9IG1vY2tlcjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvcXVpY2ttb2NrLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIGxvYWRIZWxwZXIobW9ja2VyKSB7XG4gICAgKGZ1bmN0aW9uIChxdWlja21vY2spIHtcbiAgICAgICAgdmFyIGhhc0JlZW5Nb2NrZWQgPSB7fSxcbiAgICAgICAgICAgIG9yaWdNb2R1bGVGdW5jID0gYW5ndWxhci5tb2R1bGU7XG4gICAgICAgIHF1aWNrbW9jay5vcmlnaW5hbE1vZHVsZXMgPSBhbmd1bGFyLm1vZHVsZTtcbiAgICAgICAgYW5ndWxhci5tb2R1bGUgPSBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGU7XG5cbiAgICAgICAgcXVpY2ttb2NrLm1vY2tIZWxwZXIgPSB7XG4gICAgICAgICAgICBoYXNCZWVuTW9ja2VkOiBoYXNCZWVuTW9ja2VkXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaikge1xuICAgICAgICAgICAgdmFyIG1ldGhvZHMgPSBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaik7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobWV0aG9kcywgZnVuY3Rpb24gKG1ldGhvZCwgbWV0aG9kTmFtZSkge1xuICAgICAgICAgICAgICAgIG1vZE9ialttZXRob2ROYW1lXSA9IG1ldGhvZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1vZE9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlQW5ndWxhck1vZHVsZShuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pIHtcbiAgICAgICAgICAgIHZhciBtb2RPYmogPSBvcmlnTW9kdWxlRnVuYyhuYW1lLCByZXF1aXJlcywgY29uZmlnRm4pO1xuICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChtb2RPYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVjb3JhdGVkTWV0aG9kcyhtb2RPYmopIHtcblxuICAgICAgICAgICAgZnVuY3Rpb24gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsIHByb3ZpZGVyVHlwZSkge1xuICAgICAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWRbcHJvdmlkZXJOYW1lXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIG5ld01vZE9iaiA9IG1vZE9ialtwcm92aWRlclR5cGVdKHF1aWNrbW9jay5NT0NLX1BSRUZJWCArIHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobmV3TW9kT2JqKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZTogZnVuY3Rpb24gbW9ja1NlcnZpY2UocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdzZXJ2aWNlJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vY2tGYWN0b3J5OiBmdW5jdGlvbiBtb2NrRmFjdG9yeShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2ZhY3RvcnknLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrRmlsdGVyOiBmdW5jdGlvbiBtb2NrRmlsdGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmlsdGVyJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja0NvbnRyb2xsZXI6IGZ1bmN0aW9uIG1vY2tDb250cm9sbGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnY29udHJvbGxlcicsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tQcm92aWRlcjogZnVuY3Rpb24gbW9ja1Byb3ZpZGVyKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAncHJvdmlkZXInLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrVmFsdWU6IGZ1bmN0aW9uIG1vY2tWYWx1ZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3ZhbHVlJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja0NvbnN0YW50OiBmdW5jdGlvbiBtb2NrQ29uc3RhbnQocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb25zdGFudCcsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tBbmltYXRpb246IGZ1bmN0aW9uIG1vY2tBbmltYXRpb24ocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdhbmltYXRpb24nLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KShtb2NrZXIpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gbG9hZEhlbHBlcjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvcXVpY2ttb2NrLm1vY2tIZWxwZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZ2V0QmxvY2tOb2RlcyA9IGdldEJsb2NrTm9kZXM7XG5leHBvcnRzLmhhc2hLZXkgPSBoYXNoS2V5O1xuZXhwb3J0cy5jcmVhdGVNYXAgPSBjcmVhdGVNYXA7XG5leHBvcnRzLnNoYWxsb3dDb3B5ID0gc2hhbGxvd0NvcHk7XG5leHBvcnRzLmlzQXJyYXlMaWtlID0gaXNBcnJheUxpa2U7XG5leHBvcnRzLnRyaW0gPSB0cmltO1xuZXhwb3J0cy5pc0V4cHJlc3Npb24gPSBpc0V4cHJlc3Npb247XG5leHBvcnRzLmV4cHJlc3Npb25TYW5pdGl6ZXIgPSBleHByZXNzaW9uU2FuaXRpemVyO1xuZXhwb3J0cy5hc3NlcnROb3REZWZpbmVkID0gYXNzZXJ0Tm90RGVmaW5lZDtcbmV4cG9ydHMuYXNzZXJ0XyRfQ09OVFJPTExFUiA9IGFzc2VydF8kX0NPTlRST0xMRVI7XG5leHBvcnRzLmNsZWFuID0gY2xlYW47XG5leHBvcnRzLmNyZWF0ZVNweSA9IGNyZWF0ZVNweTtcbmV4cG9ydHMubWFrZUFycmF5ID0gbWFrZUFycmF5O1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5leHBvcnRzLmdldEZ1bmN0aW9uTmFtZSA9IGdldEZ1bmN0aW9uTmFtZTtcbmV4cG9ydHMuc2FuaXRpemVNb2R1bGVzID0gc2FuaXRpemVNb2R1bGVzO1xuZXhwb3J0cy50b0NhbWVsQ2FzZSA9IHRvQ2FtZWxDYXNlO1xuZXhwb3J0cy50b1NuYWtlQ2FzZSA9IHRvU25ha2VDYXNlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgUEFSU0VfQklORElOR19SRUdFWCA9IGV4cG9ydHMuUEFSU0VfQklORElOR19SRUdFWCA9IC9eKFtcXD1cXEBcXCZdKSguKik/JC87XG52YXIgRVhQUkVTU0lPTl9SRUdFWCA9IGV4cG9ydHMuRVhQUkVTU0lPTl9SRUdFWCA9IC9ee3suKn19JC87XG4vKiBTaG91bGQgcmV0dXJuIHRydWUgXHJcbiAqIGZvciBvYmplY3RzIHRoYXQgd291bGRuJ3QgZmFpbCBkb2luZ1xyXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkobXlPYmopO1xyXG4gKiB3aGljaCByZXR1cm5zIGEgbmV3IGFycmF5IChyZWZlcmVuY2Utd2lzZSlcclxuICogUHJvYmFibHkgbmVlZHMgbW9yZSBzcGVjc1xyXG4gKi9cblxudmFyIHNsaWNlID0gW10uc2xpY2U7XG5mdW5jdGlvbiBnZXRCbG9ja05vZGVzKG5vZGVzKSB7XG4gICAgLy8gVE9ETyhwZXJmKTogdXBkYXRlIGBub2Rlc2AgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBvYmplY3Q/XG4gICAgdmFyIG5vZGUgPSBub2Rlc1swXTtcbiAgICB2YXIgZW5kTm9kZSA9IG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdO1xuICAgIHZhciBibG9ja05vZGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IG5vZGUgIT09IGVuZE5vZGUgJiYgKG5vZGUgPSBub2RlLm5leHRTaWJsaW5nKTsgaSsrKSB7XG4gICAgICAgIGlmIChibG9ja05vZGVzIHx8IG5vZGVzW2ldICE9PSBub2RlKSB7XG4gICAgICAgICAgICBpZiAoIWJsb2NrTm9kZXMpIHtcbiAgICAgICAgICAgICAgICBibG9ja05vZGVzID0gYW5ndWxhci5lbGVtZW50KHNsaWNlLmNhbGwobm9kZXMsIDAsIGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrTm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBibG9ja05vZGVzIHx8IG5vZGVzO1xufVxuXG52YXIgdWlkID0gMDtcbnZhciBuZXh0VWlkID0gZnVuY3Rpb24gbmV4dFVpZCgpIHtcbiAgICByZXR1cm4gKyt1aWQ7XG59O1xuXG5mdW5jdGlvbiBoYXNoS2V5KG9iaiwgbmV4dFVpZEZuKSB7XG4gICAgdmFyIGtleSA9IG9iaiAmJiBvYmouJCRoYXNoS2V5O1xuICAgIGlmIChrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGtleSA9IG9iai4kJGhhc2hLZXkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICB2YXIgb2JqVHlwZSA9IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG9iaik7XG4gICAgaWYgKG9ialR5cGUgPT09ICdmdW5jdGlvbicgfHwgb2JqVHlwZSA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsKSB7XG4gICAgICAgIGtleSA9IG9iai4kJGhhc2hLZXkgPSBvYmpUeXBlICsgJzonICsgKG5leHRVaWRGbiB8fCBuZXh0VWlkKSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSA9IG9ialR5cGUgKyAnOicgKyBvYmo7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuZnVuY3Rpb24gc2hhbGxvd0NvcHkoc3JjLCBkc3QpIHtcbiAgICBpZiAoYW5ndWxhci5pc0FycmF5KHNyYykpIHtcbiAgICAgICAgZHN0ID0gZHN0IHx8IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHNyYy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBkc3RbaV0gPSBzcmNbaV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qoc3JjKSkge1xuICAgICAgICBkc3QgPSBkc3QgfHwge307XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgICAgICAgaWYgKCEoa2V5LmNoYXJBdCgwKSA9PT0gJyQnICYmIGtleS5jaGFyQXQoMSkgPT09ICckJykpIHtcbiAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRzdCB8fCBzcmM7XG59XG5mdW5jdGlvbiBpc0FycmF5TGlrZShpdGVtKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSkgfHwgISFpdGVtICYmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoaXRlbSkpID09PSBcIm9iamVjdFwiICYmIGl0ZW0uaGFzT3duUHJvcGVydHkoXCJsZW5ndGhcIikgJiYgdHlwZW9mIGl0ZW0ubGVuZ3RoID09PSBcIm51bWJlclwiICYmIGl0ZW0ubGVuZ3RoID49IDAgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gdHJpbSh2YWx1ZSkge1xuICAgIHZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gaXNFeHByZXNzaW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIEVYUFJFU1NJT05fUkVHRVgudGVzdCh0cmltKHZhbHVlKSk7XG59XG5cbmZ1bmN0aW9uIGV4cHJlc3Npb25TYW5pdGl6ZXIoZXhwcmVzc2lvbikge1xuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICByZXR1cm4gZXhwcmVzc2lvbi5zdWJzdHJpbmcoMiwgZXhwcmVzc2lvbi5sZW5ndGggLSAyKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0Tm90RGVmaW5lZChvYmosIGFyZ3MpIHtcblxuICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgd2hpbGUgKGtleSA9IGFyZ3Muc2hpZnQoKSkge1xuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJyB8fCBvYmpba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgWydcIicsIGtleSwgJ1wiIHByb3BlcnR5IGNhbm5vdCBiZSBudWxsJ10uam9pbihcIlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0XyRfQ09OVFJPTExFUihvYmopIHtcbiAgICBhc3NlcnROb3REZWZpbmVkKG9iaiwgWydwYXJlbnRTY29wZScsICdiaW5kaW5ncycsICdjb250cm9sbGVyU2NvcGUnXSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuKG9iamVjdCkge1xuICAgIGlmIChpc0FycmF5TGlrZShvYmplY3QpKSB7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gb2JqZWN0Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShvYmplY3QsIFtpbmRleCwgMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuKG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTcHkoY2FsbGJhY2spIHtcbiAgICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgfVxuICAgIHZhciBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgZW5kVGltZSA9IHZvaWQgMDtcbiAgICB2YXIgdG9SZXR1cm4gPSBzcHlPbih7XG4gICAgICAgIGE6IGZ1bmN0aW9uIGEoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgX2FyZ3VtZW50cyk7XG4gICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICB9LCAnYScpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgIHRvUmV0dXJuLnRvb2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIH07XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufVxuXG5mdW5jdGlvbiBtYWtlQXJyYXkoaXRlbSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gbWFrZUFycmF5KGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBbaXRlbV07XG59XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgcmVtb3ZlJCA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gJCRleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAocmVtb3ZlJCB8fCAha2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhZGVzdGluYXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gdmFsdWVzLnNoaWZ0KCkgfHwge307XG4gICAgdmFyIGN1cnJlbnQgPSB2b2lkIDA7XG4gICAgd2hpbGUgKGN1cnJlbnQgPSB2YWx1ZXMuc2hpZnQoKSkge1xuICAgICAgICAkJGV4dGVuZChkZXN0aW5hdGlvbiwgY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbnZhciByb290U2NvcGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcm9vdFNjb3BlJyk7XG5cbmZ1bmN0aW9uIGdldFJvb3RGcm9tU2NvcGUoc2NvcGUpIHtcbiAgICBpZiAoc2NvcGUuJHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLiRyb290O1xuICAgIH1cblxuICAgIHZhciBwYXJlbnQgPSB2b2lkIDA7XG4gICAgd2hpbGUgKHBhcmVudCA9IHNjb3BlLiRwYXJlbnQpIHtcbiAgICAgICAgaWYgKHBhcmVudC4kcm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC4kcm9vdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xufVxuXG52YXIgc2NvcGVIZWxwZXIgPSBleHBvcnRzLnNjb3BlSGVscGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIHNjb3BlSGVscGVyKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgc2NvcGVIZWxwZXIpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhzY29wZUhlbHBlciwgbnVsbCwgW3tcbiAgICAgICAga2V5OiAnZGVjb3JhdGVTY29wZUNvdW50ZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQgPSAwO1xuICAgICAgICAgICAgc2NvcGUuJCRwb3N0RGlnZXN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kJGRpZ2VzdENvdW50Kys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzY29wZTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY3JlYXRlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZShzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUgPSBzY29wZSB8fCB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU2NvcGUoc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlSGVscGVyLmRlY29yYXRlU2NvcGVDb3VudGVyKHNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNjb3BlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kKHJvb3RTY29wZS4kbmV3KHRydWUpLCBzY29wZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHNjb3BlID0gbWFrZUFycmF5KHNjb3BlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoZXh0ZW5kLmFwcGx5KHVuZGVmaW5lZCwgW3Jvb3RTY29wZS4kbmV3KHRydWUpXS5jb25jYXQoc2NvcGUpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2lzU2NvcGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNTY29wZShvYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QgJiYgZ2V0Um9vdEZyb21TY29wZShvYmplY3QpID09PSBnZXRSb290RnJvbVNjb3BlKHJvb3RTY29wZSkgJiYgb2JqZWN0O1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIHNjb3BlSGVscGVyO1xufSgpO1xuXG5zY29wZUhlbHBlci4kcm9vdFNjb3BlID0gcm9vdFNjb3BlO1xuXG5mdW5jdGlvbiBnZXRGdW5jdGlvbk5hbWUobXlGdW5jdGlvbikge1xuICAgIHZhciB0b1JldHVybiA9IC9eZnVuY3Rpb25cXHMrKFtcXHdcXCRdKylcXHMqXFwoLy5leGVjKG15RnVuY3Rpb24udG9TdHJpbmcoKSlbMV07XG4gICAgaWYgKHRvUmV0dXJuID09PSAnJyB8fCB0b1JldHVybiA9PT0gJ2Fub24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gdG9SZXR1cm47XG59XG5cbmZ1bmN0aW9uIHNhbml0aXplTW9kdWxlcygpIHtcblxuICAgIHZhciBtb2R1bGVzID0gbWFrZUFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB2YXIgaW5kZXggPSB2b2lkIDA7XG4gICAgaWYgKChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignbmcnKSkgPT09IC0xICYmIChpbmRleCA9IG1vZHVsZXMuaW5kZXhPZignYW5ndWxhcicpKSA9PT0gLTEpIHtcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZycpO1xuICAgIH1cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIG1vZHVsZXMudW5zaGlmdChtb2R1bGVzLnNwbGljZShpbmRleCwgMSlbMF0gJiYgJ25nJyk7XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGVzO1xufVxudmFyIFNQRUNJQUxfQ0hBUlNfUkVHRVhQID0gLyhbXFw6XFwtXFxfXSsoLikpL2c7XG5mdW5jdGlvbiB0b0NhbWVsQ2FzZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZShTUEVDSUFMX0NIQVJTX1JFR0VYUCwgZnVuY3Rpb24gKF8sIHNlcGFyYXRvciwgbGV0dGVyLCBvZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIG9mZnNldCA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gdG9TbmFrZUNhc2UodmFsdWUsIGtleSkge1xuICAgIGtleSA9IGtleSB8fCAnLSc7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKCQxKSB7XG4gICAgICAgIHJldHVybiBrZXkgKyAkMS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG52YXIgX2NvbnRyb2xsZXJIYW5kbGVyRXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qcycpO1xuXG52YXIgY29udHJvbGxlckhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGludGVybmFsID0gZmFsc2U7XG4gICAgdmFyIG15TW9kdWxlcyA9IHZvaWQgMCxcbiAgICAgICAgY3RybE5hbWUgPSB2b2lkIDAsXG4gICAgICAgIGNMb2NhbHMgPSB2b2lkIDAsXG4gICAgICAgIHBTY29wZSA9IHZvaWQgMCxcbiAgICAgICAgY1Njb3BlID0gdm9pZCAwLFxuICAgICAgICBjTmFtZSA9IHZvaWQgMCxcbiAgICAgICAgYmluZFRvQ29udHJvbGxlciA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIGNsZWFuKCkge1xuICAgICAgICBteU1vZHVsZXMgPSBbXTtcbiAgICAgICAgY3RybE5hbWUgPSBwU2NvcGUgPSBjTG9jYWxzID0gY1Njb3BlID0gYmluZFRvQ29udHJvbGxlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkY29udHJvbGxlckhhbmRsZXIoKSB7XG5cbiAgICAgICAgaWYgKCFjdHJsTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgJ1BsZWFzZSBwcm92aWRlIHRoZSBjb250cm9sbGVyXFwncyBuYW1lJztcbiAgICAgICAgfVxuICAgICAgICBwU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShwU2NvcGUgfHwge30pO1xuICAgICAgICBpZiAoIWNTY29wZSkge1xuICAgICAgICAgICAgY1Njb3BlID0gcFNjb3BlLiRuZXcoKTtcbiAgICAgICAgfXtcbiAgICAgICAgICAgIHZhciB0ZW1wU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmlzU2NvcGUoY1Njb3BlKTtcbiAgICAgICAgICAgIGlmICh0ZW1wU2NvcGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY1Njb3BlID0gdGVtcFNjb3BlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvUmV0dXJuID0gbmV3IF9jb250cm9sbGVySGFuZGxlckV4dGVuc2lvbnMuJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRUb0NvbnRyb2xsZXIsIG15TW9kdWxlcywgY05hbWUsIGNMb2NhbHMpO1xuICAgICAgICBjbGVhbigpO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfVxuICAgICRjb250cm9sbGVySGFuZGxlci5iaW5kV2l0aCA9IGZ1bmN0aW9uIChiaW5kaW5ncykge1xuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gYmluZGluZ3M7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XG4gICAgfTtcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY29udHJvbGxlclR5cGUgPSBfY29udHJvbGxlckhhbmRsZXJFeHRlbnNpb25zLiRfQ09OVFJPTExFUjtcbiAgICAkY29udHJvbGxlckhhbmRsZXIuY2xlYW4gPSBjbGVhbjtcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0U2NvcGUgPSBmdW5jdGlvbiAobmV3U2NvcGUpIHtcbiAgICAgICAgcFNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XG4gICAgfTtcbiAgICAkY29udHJvbGxlckhhbmRsZXIuc2V0TG9jYWxzID0gZnVuY3Rpb24gKGxvY2Fscykge1xuICAgICAgICBjTG9jYWxzID0gbG9jYWxzO1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xuICAgIH07XG5cbiAgICAkY29udHJvbGxlckhhbmRsZXIuJHJvb3RTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcblxuICAgICRjb250cm9sbGVySGFuZGxlci5hZGRNb2R1bGVzID0gZnVuY3Rpb24gKG1vZHVsZXMpIHtcbiAgICAgICAgZnVuY3Rpb24gcHVzaEFycmF5KGFycmF5KSB7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShteU1vZHVsZXMsIGFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhtb2R1bGVzKSkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KCgwLCBfY29tbW9uLm1ha2VBcnJheSkoYXJndW1lbnRzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHB1c2hBcnJheShbbW9kdWxlc10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCgwLCBfY29tbW9uLmlzQXJyYXlMaWtlKShtb2R1bGVzKSkge1xuICAgICAgICAgICAgcHVzaEFycmF5KCgwLCBfY29tbW9uLm1ha2VBcnJheSkobW9kdWxlcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XG4gICAgfTtcbiAgICAkY29udHJvbGxlckhhbmRsZXIuaXNJbnRlcm5hbCA9IGZ1bmN0aW9uIChmbGFnKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZsYWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJuYWw7XG4gICAgICAgIH1cbiAgICAgICAgaW50ZXJuYWwgPSAhIWZsYWc7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbnRlcm5hbCA9ICFmbGFnO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ldyA9IGZ1bmN0aW9uIChjb250cm9sbGVyTmFtZSwgc2NvcGVDb250cm9sbGVyc05hbWUsIHBhcmVudFNjb3BlLCBjaGlsZFNjb3BlKSB7XG4gICAgICAgIGN0cmxOYW1lID0gY29udHJvbGxlck5hbWU7XG4gICAgICAgIGlmIChzY29wZUNvbnRyb2xsZXJzTmFtZSAmJiAhYW5ndWxhci5pc1N0cmluZyhzY29wZUNvbnRyb2xsZXJzTmFtZSkpIHtcbiAgICAgICAgICAgIHBTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuaXNTY29wZShzY29wZUNvbnRyb2xsZXJzTmFtZSk7XG4gICAgICAgICAgICBjU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmlzU2NvcGUocGFyZW50U2NvcGUpIHx8IGNTY29wZTtcbiAgICAgICAgICAgIGNOYW1lID0gJ2NvbnRyb2xsZXInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUocGFyZW50U2NvcGUgfHwgcFNjb3BlKTtcbiAgICAgICAgICAgIGNTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuY3JlYXRlKGNoaWxkU2NvcGUgfHwgcFNjb3BlLiRuZXcoKSk7XG4gICAgICAgICAgICBjTmFtZSA9IHNjb3BlQ29udHJvbGxlcnNOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXIoKTtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5uZXdTZXJ2aWNlID0gZnVuY3Rpb24gKGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlLCBiaW5kaW5ncykge1xuICAgICAgICB2YXIgdG9SZXR1cm4gPSAkY29udHJvbGxlckhhbmRsZXIubmV3KGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQXMsIHBhcmVudFNjb3BlKTtcbiAgICAgICAgdG9SZXR1cm4uYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgIH07XG4gICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbn0oKTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNvbnRyb2xsZXJIYW5kbGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy4kX0NPTlRST0xMRVIgPSB1bmRlZmluZWQ7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfZGlyZWN0aXZlUHJvdmlkZXIgPSByZXF1aXJlKCcuLy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMnKTtcblxudmFyIF9kaXJlY3RpdmVQcm92aWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXJlY3RpdmVQcm92aWRlcik7XG5cbnZhciBfZGlyZWN0aXZlSGFuZGxlciA9IHJlcXVpcmUoJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzJyk7XG5cbnZhciBfY29udHJvbGxlclFNID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qcycpO1xuXG52YXIgX2NvbnRyb2xsZXJRTTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb250cm9sbGVyUU0pO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyICRfQ09OVFJPTExFUiA9IGV4cG9ydHMuJF9DT05UUk9MTEVSID0gZnVuY3Rpb24gKCkge1xuICAgIF9jcmVhdGVDbGFzcygkX0NPTlRST0xMRVIsIG51bGwsIFt7XG4gICAgICAgIGtleTogJ2lzQ29udHJvbGxlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0NvbnRyb2xsZXIob2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgJF9DT05UUk9MTEVSO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgZnVuY3Rpb24gJF9DT05UUk9MTEVSKGN0cmxOYW1lLCBwU2NvcGUsIGJpbmRpbmdzLCBtb2R1bGVzLCBjTmFtZSwgY0xvY2Fscykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgJF9DT05UUk9MTEVSKTtcblxuICAgICAgICB0aGlzLnByb3ZpZGVyTmFtZSA9IGN0cmxOYW1lO1xuICAgICAgICB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUgPSBjTmFtZSB8fCAnY29udHJvbGxlcic7XG4gICAgICAgIHRoaXMudXNlZE1vZHVsZXMgPSBtb2R1bGVzLnNsaWNlKCk7XG4gICAgICAgIHRoaXMucGFyZW50U2NvcGUgPSBwU2NvcGU7XG4gICAgICAgIHRoaXMuY29udHJvbGxlclNjb3BlID0gdGhpcy5wYXJlbnRTY29wZS4kbmV3KCk7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgICAgdGhpcy5sb2NhbHMgPSAoMCwgX2NvbW1vbi5leHRlbmQpKGNMb2NhbHMgfHwge30sIHtcbiAgICAgICAgICAgICRzY29wZTogdGhpcy5jb250cm9sbGVyU2NvcGVcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycyA9IFtdO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLiRyb290U2NvcGU7XG4gICAgICAgIHRoaXMuSW50ZXJuYWxTcGllcyA9IHtcbiAgICAgICAgICAgIFNjb3BlOiB7fSxcbiAgICAgICAgICAgIENvbnRyb2xsZXI6IHt9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKCRfQ09OVFJPTExFUiwgW3tcbiAgICAgICAga2V5OiAnJGFwcGx5JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICRhcHBseSgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnJGRlc3Ryb3knLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gJGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy4kcm9vdFNjb3BlO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgKDAsIF9jb21tb24uY2xlYW4pKHRoaXMpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKGJpbmRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLmJpbmRpbmdzID0gYW5ndWxhci5pc0RlZmluZWQoYmluZGluZ3MpICYmIGJpbmRpbmdzICE9PSBudWxsID8gYmluZGluZ3MgOiB0aGlzLmJpbmRpbmdzO1xuICAgICAgICAgICAgKDAsIF9jb21tb24uYXNzZXJ0XyRfQ09OVFJPTExFUikodGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yID0gX2NvbnRyb2xsZXJRTTIuZGVmYXVsdC4kZ2V0KHRoaXMudXNlZE1vZHVsZXMpLmNyZWF0ZSh0aGlzLnByb3ZpZGVyTmFtZSwgdGhpcy5wYXJlbnRTY29wZSwgdGhpcy5iaW5kaW5ncywgdGhpcy5zY29wZUNvbnRyb2xsZXJOYW1lLCB0aGlzLmxvY2Fscyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSA9IHRoaXMuY29udHJvbGxlckNvbnN0cnVjdG9yKCk7XG5cbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKHdhdGNoZXIgPSB0aGlzLnBlbmRpbmdXYXRjaGVycy5zaGlmdCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaC5hcHBseSh0aGlzLCB3YXRjaGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2NvbW1vbi5QQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWModGhpcy5iaW5kaW5nc1trZXldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlS2V5ID0gcmVzdWx0WzJdIHx8IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweUtleSA9IFtzY29wZUtleSwgJzonLCBrZXldLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0WzFdID09PSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdHJveWVyID0gX3RoaXMud2F0Y2goa2V5LCBfdGhpcy5JbnRlcm5hbFNwaWVzLlNjb3BlW3NweUtleV0gPSAoMCwgX2NvbW1vbi5jcmVhdGVTcHkpKCksIHNlbGYuY29udHJvbGxlckluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdHJveWVyMiA9IF90aGlzLndhdGNoKHNjb3BlS2V5LCBfdGhpcy5JbnRlcm5hbFNwaWVzLkNvbnRyb2xsZXJbc3B5S2V5XSA9ICgwLCBfY29tbW9uLmNyZWF0ZVNweSkoKSwgc2VsZi5wYXJlbnRTY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucGFyZW50U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3llcjIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnd2F0Y2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb250cm9sbGVySW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdXYXRjaGVycy5wdXNoKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyU2NvcGUuJHdhdGNoKGV4cHJlc3Npb24sIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnbmdDbGljaycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBuZ0NsaWNrKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURpcmVjdGl2ZSgnbmctY2xpY2snLCBleHByZXNzaW9uKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY3JlYXRlRGlyZWN0aXZlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gKDAsIF9jb21tb24ubWFrZUFycmF5KShhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IF9kaXJlY3RpdmVQcm92aWRlcjIuZGVmYXVsdC4kZ2V0KGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgICBhcmdzWzBdID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29tcGlsZS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21waWxlSFRNTCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21waWxlSFRNTChodG1sVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBfZGlyZWN0aXZlSGFuZGxlci5kaXJlY3RpdmVIYW5kbGVyKHRoaXMsIGh0bWxUZXh0KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiAkX0NPTlRST0xMRVI7XG59KCk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmV4dGVuc2lvbnMuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9uZ01vZGVsID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcycpO1xuXG52YXIgX25nQ2xpY2sgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzJyk7XG5cbnZhciBfbmdJZiA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMnKTtcblxudmFyIF9uZ1RyYW5zbGF0ZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzJyk7XG5cbnZhciBfbmdCaW5kID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzJyk7XG5cbnZhciBfbmdDbGFzcyA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMnKTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbnZhciBfbmdSZXBlYXQgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ1JlcGVhdC5qcycpO1xuXG52YXIgZGlyZWN0aXZlUHJvdmlkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddKS5nZXQoJyR0cmFuc2xhdGUnKTtcbiAgICB2YXIgZGlyZWN0aXZlcyA9IG5ldyBNYXAoKSxcbiAgICAgICAgdG9SZXR1cm4gPSB7fSxcbiAgICAgICAgJHBhcnNlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJHBhcnNlJyksXG4gICAgICAgICRhbmltYXRlID0gYW5ndWxhci5pbmplY3RvcihbJ25nJ10pLmdldCgnJGFuaW1hdGUnKSxcbiAgICAgICAgJHRyYW5zY2x1ZGUgPSBmdW5jdGlvbiBjb250cm9sbGVyc0JvdW5kVHJhbnNjbHVkZShzY29wZSwgY2xvbmVBdHRhY2hGbiwgZnV0dXJlUGFyZW50RWxlbWVudCkge1xuXG4gICAgICAgIC8vIE5vIHNjb3BlIHBhc3NlZCBpbjpcbiAgICAgICAgaWYgKCFfY29tbW9uLnNjb3BlSGVscGVyLmlzU2NvcGUoc2NvcGUpKSB7XG4gICAgICAgICAgICBmdXR1cmVQYXJlbnRFbGVtZW50ID0gY2xvbmVBdHRhY2hGbjtcbiAgICAgICAgICAgIGNsb25lQXR0YWNoRm4gPSBzY29wZTtcbiAgICAgICAgICAgIHNjb3BlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAgICAgaW50ZXJuYWxzID0ge1xuICAgICAgICBuZ0lmOiAoMCwgX25nSWYubmdJZkRpcmVjdGl2ZSkoKSxcbiAgICAgICAgbmdDbGljazogKDAsIF9uZ0NsaWNrLm5nQ2xpY2tEaXJlY3RpdmUpKCRwYXJzZSksXG4gICAgICAgIG5nTW9kZWw6ICgwLCBfbmdNb2RlbC5uZ01vZGVsRGlyZWN0aXZlKSgkcGFyc2UpLFxuICAgICAgICBuZ0Rpc2FibGVkOiAoMCwgX25nSWYubmdJZkRpcmVjdGl2ZSkoKSxcbiAgICAgICAgdHJhbnNsYXRlOiAoMCwgX25nVHJhbnNsYXRlLm5nVHJhbnNsYXRlRGlyZWN0aXZlKSgkdHJhbnNsYXRlLCAkcGFyc2UpLFxuICAgICAgICBuZ0JpbmQ6ICgwLCBfbmdCaW5kLm5nQmluZERpcmVjdGl2ZSkoKSxcbiAgICAgICAgbmdDbGFzczogKDAsIF9uZ0NsYXNzLm5nQ2xhc3NEaXJlY3RpdmUpKCRwYXJzZSksXG4gICAgICAgIG5nUmVwZWF0OiAoMCwgX25nUmVwZWF0Lm5nUmVwZWF0RGlyZWN0aXZlKSgkcGFyc2UsICRhbmltYXRlLCAkdHJhbnNjbHVkZSksXG4gICAgICAgIHRyYW5zbGF0ZVZhbHVlOiB7fVxuICAgIH07XG4gICAgaW50ZXJuYWxzLm5nVHJhbnNsYXRlID0gaW50ZXJuYWxzLnRyYW5zbGF0ZTtcblxuICAgIHRvUmV0dXJuLiRnZXQgPSBmdW5jdGlvbiAoZGlyZWN0aXZlTmFtZSkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9ICgwLCBfY29tbW9uLnRvQ2FtZWxDYXNlKShkaXJlY3RpdmVOYW1lKTtcbiAgICAgICAgICAgIGlmIChpbnRlcm5hbHNbZGlyZWN0aXZlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVzLmdldChkaXJlY3RpdmVOYW1lKTtcbiAgICB9O1xuICAgIHRvUmV0dXJuLiRwdXQgPSBmdW5jdGlvbiAoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzRnVuY3Rpb24oZGlyZWN0aXZlQ29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICB0aHJvdyAnZGlyZWN0aXZlQ29uc3RydWN0b3IgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGRpcmVjdGl2ZU5hbWUpKSB7XG4gICAgICAgICAgICBkaXJlY3RpdmVOYW1lID0gKDAsIF9jb21tb24udG9DYW1lbENhc2UpKGRpcmVjdGl2ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmhhcyhkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkgJiYgYXJndW1lbnRzWzJdKCkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbJ2RpcmVjdGl2ZScsIGRpcmVjdGl2ZU5hbWUsICdoYXMgYmVlbiBvdmVyd3JpdHRlbiddLmpvaW4oJyAnKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBvdmVyd3JpdGUgJyArIGRpcmVjdGl2ZU5hbWUgKyAnLlxcbkZvcmdldGluZyB0byBjbGVhbiBtdWNoJztcbiAgICAgICAgfVxuICAgICAgICBkaXJlY3RpdmVzLnNldChkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVDb25zdHJ1Y3RvcigpKTtcbiAgICB9O1xuICAgIHRvUmV0dXJuLiRjbGVhbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGlyZWN0aXZlcy5jbGVhcigpO1xuICAgIH07XG4gICAgdG9SZXR1cm4udXNlTW9kdWxlID0gZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10uY29uY2F0KG1vZHVsZU5hbWUpKS5nZXQoJyR0cmFuc2xhdGUnKTtcbiAgICAgICAgaW50ZXJuYWxzLnRyYW5zbGF0ZS5jaGFuZ2VTZXJ2aWNlKCR0cmFuc2xhdGUpO1xuICAgIH07XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufSgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGlyZWN0aXZlUHJvdmlkZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdNb2RlbERpcmVjdGl2ZSA9IG5nTW9kZWxEaXJlY3RpdmU7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBuZ01vZGVsRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZ2V0dGVyID0gJHBhcnNlKGV4cHJlc3Npb24pO1xuXG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybihwYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzU3RyaW5nKHBhcmFtZXRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgYXJndW1lbnRzWzFdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihwYXJhbWV0ZXIuc3BsaXQoJycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnZXR0ZXIuYXNzaWduKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSwgcGFyYW1ldGVyKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbihwYXJhbWV0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoMCwgX2NvbW1vbi5pc0FycmF5TGlrZSkocGFyYW1ldGVyKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVtb3J5ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICgwLCBfY29tbW9uLm1ha2VBcnJheSkocGFyYW1ldGVyKS5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybihtZW1vcnkgKz0gY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFsnRG9udCBrbm93IHdoYXQgdG8gZG8gd2l0aCAnLCAnW1wiJywgKDAsIF9jb21tb24ubWFrZUFycmF5KShhcmd1bWVudHMpLmpvaW4oJ1wiLCBcIicpLCAnXCJdJ10uam9pbignJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiBmdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pIHtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IGVsZW0uZGF0YSgnbmctbW9kZWwnKTtcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcbiAgICAgICAgICAgIG1vZGVsLmNoYW5nZXMoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS50ZXh0KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnbmctbW9kZWwnXG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ0NsaWNrRGlyZWN0aXZlID0gbmdDbGlja0RpcmVjdGl2ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uLy4uLy4uL2J1aWx0L2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIHJlY3Vyc2VPYmplY3RzKG9iamVjdCkge1xuICAgIHZhciB0b1JldHVybiA9ICgwLCBfY29tbW9uLm1ha2VBcnJheSkob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb2JqZWN0LmNoaWxkcmVuKCkubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4uY29uY2F0KHJlY3Vyc2VPYmplY3RzKGFuZ3VsYXIuZWxlbWVudChvYmplY3QuY2hpbGRyZW4oKVtpaV0pKSk7XG4gICAgfVxuICAgIHJldHVybiB0b1JldHVybjtcbn1cbmZ1bmN0aW9uIG5nQ2xpY2tEaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogL25nLWNsaWNrPVwiKC4qKVwiLyxcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJHBhcnNlKGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2xpY2sgPSBmdW5jdGlvbiBjbGljayhzY29wZSwgbG9jYWxzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9hcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FscyA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gbG9jYWxzIHx8IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZXhwcmVzc2lvbihzY29wZSwgbG9jYWxzKTtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBjbGljaztcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiBmdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY2xpY2tEYXRhID0gJGVsZW1lbnQuZGF0YSgnbmctY2xpY2snKTtcbiAgICAgICAgICAgIHZhciBteUFycmF5ID0gcmVjdXJzZU9iamVjdHMoJGVsZW1lbnQpO1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IG15QXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KG15QXJyYXlbaW5kZXhdKS5kYXRhKCduZy1jbGljaycsIGNsaWNrRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1jbGljaydcbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nSWZEaXJlY3RpdmUgPSBuZ0lmRGlyZWN0aXZlO1xuZnVuY3Rpb24gbmdJZkRpcmVjdGl2ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogL25nLWlmPVwiKC4qKVwiLyxcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgc3Vic2NyaXB0b3JzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnNbaWldLmFwcGx5KHN1YnNjcmlwdG9ycywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9zb3ApKCk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4udmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCAkZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSAkZWxlbWVudC5wYXJlbnQoKSxcbiAgICAgICAgICAgICAgICBjb21waWxlZERpcmVjdGl2ZSA9ICRlbGVtZW50LmRhdGEoJ25nLWlmJyk7XG4gICAgICAgICAgICBjb21waWxlZERpcmVjdGl2ZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCgkZWxlbWVudCwgMCwgJGVsZW1lbnQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9ICRlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsYXN0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoJGVsZW1lbnQsIGxhc3RWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQobGFzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gcGFyZW50ID0gY29tcGlsZWREaXJlY3RpdmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ25nLWlmJ1xuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdUcmFuc2xhdGVEaXJlY3RpdmUgPSBuZ1RyYW5zbGF0ZURpcmVjdGl2ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIG5nVHJhbnNsYXRlRGlyZWN0aXZlKCR0cmFuc2xhdGUsICRwYXJzZSkge1xuICAgIHZhciB0cmFuc2xhdGVTZXJ2aWNlID0gJHRyYW5zbGF0ZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAga2V5ID0gZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gdm9pZCAwO1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih3YXRjaGVyKSkge1xuICAgICAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlID0gd2F0Y2hlciA9IHRvUmV0dXJuID0gc3Vic2NyaXB0b3JzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoKDAsIF9jb21tb24uaXNFeHByZXNzaW9uKShleHByZXNzaW9uKSkge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAoMCwgX2NvbW1vbi5leHByZXNzaW9uU2FuaXRpemVyKShleHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBrZXkgPSAkcGFyc2UoZXhwcmVzc2lvbikoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcbiAgICAgICAgICAgICAgICB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24gKG5ld0xhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZS51c2UobmV3TGFuZ3VhZ2UpO1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wV2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGZ1bmN0aW9uICgpIHt9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KGtleSk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBXYXRjaGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uIHRyYW5zbGF0ZSh0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KHRleHQpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VMYW5ndWFnZTogZnVuY3Rpb24gY2hhbmdlTGFuZ3VhZ2UobmV3TGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlU2VydmljZTogZnVuY3Rpb24gY2hhbmdlU2VydmljZShuZXdTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGVTZXJ2aWNlID0gbmV3U2VydmljZTtcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiBmdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pIHtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IGVsZW0uZGF0YSgnbmctdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICBlbGVtLnRleHQobW9kZWwoKSk7XG4gICAgICAgICAgICBtb2RlbC5jaGFuZ2VzKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0udGV4dChuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ25nLXRyYW5zbGF0ZSdcblxuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nVHJhbnNsYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ0JpbmREaXJlY3RpdmUgPSBuZ0JpbmREaXJlY3RpdmU7XG5mdW5jdGlvbiBuZ0JpbmREaXJlY3RpdmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdG9ycyA9IFtdO1xuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciB3YXRjaGVyID0gY29udHJvbGxlclNlcnZpY2Uud2F0Y2goZXhwcmVzc2lvbiwgZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24gdG9SZXR1cm4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub29wKSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRvUmV0dXJuLmNoYW5nZXMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdWJzY3JpcHRvcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLWJpbmQnKTtcbiAgICAgICAgICAgIGVsZW0udGV4dChtb2RlbCgpKTtcbiAgICAgICAgICAgIG1vZGVsLmNoYW5nZXMoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS50ZXh0KG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnbmctYmluZCdcbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nQ2xhc3NEaXJlY3RpdmUgPSBuZ0NsYXNzRGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdDbGFzc0RpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSB7fTtcbiAgICAgICAgICAgIHZhciBnZXR0ZXIgPSAkcGFyc2UoKDAsIF9jb21tb24udHJpbSkoZXhwcmVzc2lvbikpO1xuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gZ2V0dGVyKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpcmVDaGFuZ2UgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgdmFyIHRvTm90aWZ5ID0ge307XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc2VzID0gbmV3VmFsdWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzQXJyYXkobmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRlbXAuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBuZXdWYWx1ZVtrZXldICE9PSBsYXN0VmFsdWVba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Ob3RpZnlba2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGQ6ICEhbGFzdFZhbHVlW2tleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3OiAhIW5ld1ZhbHVlW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfa2V5IGluIGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRvTm90aWZ5Lmhhc093blByb3BlcnR5KF9rZXkpICYmIGxhc3RWYWx1ZS5oYXNPd25Qcm9wZXJ0eShfa2V5KSAmJiBuZXdWYWx1ZVtfa2V5XSAhPT0gbGFzdFZhbHVlW19rZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b05vdGlmeVtfa2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGQ6ICEhbGFzdFZhbHVlW19rZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldzogISFuZXdWYWx1ZVtfa2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaXJlQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm4obmV3VmFsdWUsIHRvTm90aWZ5KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKCkge1xuICAgICAgICAgICAgICAgIGlmICghbGFzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobGFzdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NlcyA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGxhc3RWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VmFsdWVba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUmV0dXJuLmhhc0NsYXNzID0gZnVuY3Rpb24gKHRvQ2hlY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWUuaW5kZXhPZigoMCwgX2NvbW1vbi50cmltKSh0b0NoZWNrKSkgIT09IC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxhc3RWYWx1ZVt0b0NoZWNrXTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1jbGFzcycsXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnbmctY2xhc3MnKS5jaGFuZ2VzKGZ1bmN0aW9uIChsYXN0VmFsdWUsIG5ld0NoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3Q2hhbmdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlc1trZXldLm5ldyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3Moa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsYXNzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ1JlcGVhdERpcmVjdGl2ZSA9IG5nUmVwZWF0RGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdSZXBlYXREaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgLy8gY29uc3QgTkdfUkVNT1ZFRCA9ICckJE5HX1JFTU9WRUQnO1xuICAgIHZhciB1cGRhdGVTY29wZSA9IGZ1bmN0aW9uIHVwZGF0ZVNjb3BlKHNjb3BlLCBpbmRleCwgdmFsdWVJZGVudGlmaWVyLCB2YWx1ZSwga2V5SWRlbnRpZmllciwga2V5LCBhcnJheUxlbmd0aCkge1xuICAgICAgICAvLyBUT0RPKHBlcmYpOiBnZW5lcmF0ZSBzZXR0ZXJzIHRvIHNoYXZlIG9mZiB+NDBtcyBvciAxLTEuNSVcbiAgICAgICAgc2NvcGVbdmFsdWVJZGVudGlmaWVyXSA9IHZhbHVlO1xuICAgICAgICBpZiAoa2V5SWRlbnRpZmllcikge1xuICAgICAgICAgICAgc2NvcGVba2V5SWRlbnRpZmllcl0gPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGUuJGluZGV4ID0gaW5kZXg7XG4gICAgICAgIHNjb3BlLiRmaXJzdCA9IGluZGV4ID09PSAwO1xuICAgICAgICBzY29wZS4kbGFzdCA9IGluZGV4ID09PSBhcnJheUxlbmd0aCAtIDE7XG4gICAgICAgIHNjb3BlLiRtaWRkbGUgPSAhKHNjb3BlLiRmaXJzdCB8fCBzY29wZS4kbGFzdCk7XG4gICAgICAgIC8vIGpzaGludCBiaXR3aXNlOiBmYWxzZVxuICAgICAgICBzY29wZS4kb2RkID0gIShzY29wZS4kZXZlbiA9IChpbmRleCAmIDEpID09PSAwKTtcbiAgICAgICAgLy8ganNoaW50IGJpdHdpc2U6IHRydWVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogJ25nUmVwZWF0JyxcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdG9ycyA9IFtdO1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjb250cm9sbGVyU2VydmljZS5jcmVhdGUpKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgJHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaCgvXlxccyooW1xcc1xcU10rPylcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK2FzXFxzKyhbXFxzXFxTXSs/KSk/KD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzKiQvKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCJFeHBlY3RlZCBleHByZXNzaW9uIGluIGZvcm0gb2YgJ19pdGVtXyBpbiBfY29sbGVjdGlvbl9bIHRyYWNrIGJ5IF9pZF9dJyBidXQgZ290ICdcIiwgZXhwcmVzc2lvbiwgXCInXCJdLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxocyA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgdmFyIHJocyA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgdmFyIGFsaWFzQXMgPSBtYXRjaFszXTtcbiAgICAgICAgICAgIHZhciB0cmFja0J5RXhwID0gbWF0Y2hbNF07XG4gICAgICAgICAgICBtYXRjaCA9IGxocy5tYXRjaCgvXig/OihcXHMqW1xcJFxcd10rKXxcXChcXHMqKFtcXCRcXHddKylcXHMqLFxccyooW1xcJFxcd10rKVxccypcXCkpJC8pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHRocm93IFtcIidfaXRlbV8nIGluICdfaXRlbV8gaW4gX2NvbGxlY3Rpb25fJyBzaG91bGQgYmUgYW4gaWRlbnRpZmllciBvciAnKF9rZXlfLCBfdmFsdWVfKScgZXhwcmVzc2lvbiwgYnV0IGdvdCAnXCIsIGxocywgXCInXCJdLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlSWRlbnRpZmllciA9IG1hdGNoWzNdIHx8IG1hdGNoWzFdO1xuICAgICAgICAgICAgdmFyIGtleUlkZW50aWZpZXIgPSBtYXRjaFsyXTtcblxuICAgICAgICAgICAgaWYgKGFsaWFzQXMgJiYgKCEvXlskYS16QS1aX11bJGEtekEtWjAtOV9dKiQvLnRlc3QoYWxpYXNBcykgfHwgL14obnVsbHx1bmRlZmluZWR8dGhpc3xcXCRpbmRleHxcXCRmaXJzdHxcXCRtaWRkbGV8XFwkbGFzdHxcXCRldmVufFxcJG9kZHxcXCRwYXJlbnR8XFwkcm9vdHxcXCRpZCkkLy50ZXN0KGFsaWFzQXMpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFtcImFsaWFzICdcIiwgYWxpYXNBcywgXCInIGlzIGludmFsaWQgLS0tIG11c3QgYmUgYSB2YWxpZCBKUyBpZGVudGlmaWVyIHdoaWNoIGlzIG5vdCBhIHJlc2VydmVkIG5hbWUuXCJdLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRyYWNrQnlFeHBHZXR0ZXIgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkRXhwRm4gPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkQXJyYXlGbiA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICB0cmFja0J5SWRPYmpGbiA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBoYXNoRm5Mb2NhbHMgPSB7XG4gICAgICAgICAgICAgICAgJGlkOiBfY29tbW9uLmhhc2hLZXlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0cmFja0J5RXhwKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tCeUV4cEdldHRlciA9ICRwYXJzZSh0cmFja0J5RXhwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkQXJyYXlGbiA9IGZ1bmN0aW9uIHRyYWNrQnlJZEFycmF5Rm4oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9jb21tb24uaGFzaEtleSkodmFsdWUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkT2JqRm4gPSBmdW5jdGlvbiB0cmFja0J5SWRPYmpGbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyYWNrQnlFeHBHZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICB0cmFja0J5SWRFeHBGbiA9IGZ1bmN0aW9uIHRyYWNrQnlJZEV4cEZuKGtleSwgdmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBrZXksIHZhbHVlLCBhbmQgJGluZGV4IHRvIHRoZSBsb2NhbHMgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIGluIGhhc2ggZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoRm5Mb2NhbHNba2V5SWRlbnRpZmllcl0gPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzW3ZhbHVlSWRlbnRpZmllcl0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzLiRpbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2tCeUV4cEdldHRlcigkc2NvcGUsIGhhc2hGbkxvY2Fscyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0QmxvY2tNYXAgPSAoMCwgX2NvbW1vbi5jcmVhdGVNYXApKCk7XG4gICAgICAgICAgICB2YXIgZGlmZmVyZW5jZXMgPSAoMCwgX2NvbW1vbi5jcmVhdGVNYXApKCk7XG4gICAgICAgICAgICB2YXIgbXlPYmplY3RzID0gW107XG4gICAgICAgICAgICB2YXIgbmdSZXBlYXRNaW5FcnIgPSBmdW5jdGlvbiBuZ1JlcGVhdE1pbkVycigpIHt9O1xuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSAkc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihyaHMsIGZ1bmN0aW9uIG5nUmVwZWF0QWN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlbmNlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQ6IFtdLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWQ6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcCA9ICgwLCBfY29tbW9uLmNyZWF0ZU1hcCkoKSxcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbkxlbmd0aCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgLy8ga2V5L3ZhbHVlIG9mIGl0ZXJhdGlvblxuICAgICAgICAgICAgICAgIHRyYWNrQnlJZCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4gPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICBibG9jayA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgLy8gbGFzdCBvYmplY3QgaW5mb3JtYXRpb24ge3Njb3BlLCBlbGVtZW50LCBpZH1cbiAgICAgICAgICAgICAgICBuZXh0QmxvY2tPcmRlciA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZSA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgIGlmIChhbGlhc0FzKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZVthbGlhc0FzXSA9IGNvbGxlY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCgwLCBfY29tbW9uLmlzQXJyYXlMaWtlKShjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cyA9IGNvbGxlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZEZuID0gdHJhY2tCeUlkRXhwRm4gfHwgdHJhY2tCeUlkQXJyYXlGbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbiA9IHRyYWNrQnlJZEV4cEZuIHx8IHRyYWNrQnlJZE9iakZuO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvYmplY3QsIGV4dHJhY3Qga2V5cywgaW4gZW51bWVyYXRpb24gb3JkZXIsIHVuc29ydGVkXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZW1LZXkgaW4gY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwgaXRlbUtleSkgJiYgaXRlbUtleS5jaGFyQXQoMCkgIT09ICckJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25LZXlzLnB1c2goaXRlbUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoID0gY29sbGVjdGlvbktleXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyID0gbmV3IEFycmF5KGNvbGxlY3Rpb25MZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9jYXRlIGV4aXN0aW5nIGl0ZW1zXG4gICAgICAgICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgY29sbGVjdGlvbkxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBjb2xsZWN0aW9uID09PSBjb2xsZWN0aW9uS2V5cyA/IGluZGV4IDogY29sbGVjdGlvbktleXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbGxlY3Rpb25ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkID0gdHJhY2tCeUlkRm4oa2V5LCB2YWx1ZSwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIHByZXZpb3VzbHkgc2VlbiBibG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBsYXN0QmxvY2tNYXBbdHJhY2tCeUlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsYXN0QmxvY2tNYXBbdHJhY2tCeUlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRCbG9ja01hcFt0cmFja0J5SWRdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tPcmRlcltpbmRleF0gPSBibG9jaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY29sbGlzaW9uIGRldGVjdGVkLiByZXN0b3JlIGxhc3RCbG9ja01hcCBhbmQgdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChuZXh0QmxvY2tPcmRlciwgZnVuY3Rpb24gKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmIGJsb2NrLnNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RCbG9ja01hcFtibG9jay5pZF0gPSBibG9jaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5nUmVwZWF0TWluRXJyKCdkdXBlcycsIFwiRHVwbGljYXRlcyBpbiBhIHJlcGVhdGVyIGFyZSBub3QgYWxsb3dlZC4gVXNlICd0cmFjayBieScgZXhwcmVzc2lvbiB0byBzcGVjaWZ5IHVuaXF1ZSBrZXlzLiBSZXBlYXRlcjogezB9LCBEdXBsaWNhdGUga2V5OiB7MX0sIER1cGxpY2F0ZSB2YWx1ZTogezJ9XCIsIGV4cHJlc3Npb24sIHRyYWNrQnlJZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IG5ldmVyIGJlZm9yZSBzZWVuIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tPcmRlcltpbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRyYWNrQnlJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGxlZnRvdmVyIGl0ZW1zXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYmxvY2tLZXkgaW4gbGFzdEJsb2NrTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbGFzdEJsb2NrTWFwW2Jsb2NrS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZSA9IG15T2JqZWN0cy5pbmRleE9mKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgbXlPYmplY3RzLnNwbGljZShlbGVtZW50c1RvUmVtb3ZlLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW5jZXMucmVtb3ZlZC5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suc2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBhcmUgbm90IHVzaW5nIGZvckVhY2ggZm9yIHBlcmYgcmVhc29ucyAodHJ5aW5nIHRvIGF2b2lkICNjYWxsKVxuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNvbGxlY3Rpb25MZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gY29sbGVjdGlvbiA9PT0gY29sbGVjdGlvbktleXMgPyBpbmRleCA6IGNvbGxlY3Rpb25LZXlzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xsZWN0aW9uW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbmV4dEJsb2NrT3JkZXJbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYWxyZWFkeSBzZWVuIHRoaXMgb2JqZWN0LCB0aGVuIHdlIG5lZWQgdG8gcmV1c2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NvY2lhdGVkIHNjb3BlL2VsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNjb3BlKGJsb2NrLnNjb3BlLCBpbmRleCwgdmFsdWVJZGVudGlmaWVyLCB2YWx1ZSwga2V5SWRlbnRpZmllciwga2V5LCBjb2xsZWN0aW9uTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzLm1vZGlmaWVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGl0ZW0gd2hpY2ggd2UgZG9uJ3Qga25vdyBhYm91dFxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suc2NvcGUgPSAkc2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXlPYmplY3RzLnNwbGljZShpbmRleCwgMCwgYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW5jZXMuYWRkZWQucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTY29wZShibG9jay5zY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgY29sbGVjdGlvbkxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYmxvY2suaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdEJsb2NrTWFwID0gbmV4dEJsb2NrTWFwO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihteU9iamVjdHMsIGRpZmZlcmVuY2VzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKHN1YnNjcmlwdG9ycy5zaGlmdCgpIHx8IGFuZ3VsYXIubm9vcCkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RzOiBteU9iamVjdHMsXG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VzOiBkaWZmZXJlbmNlc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4ua2V5SWRlbnRpZmllciA9IGtleUlkZW50aWZpZXIgfHwgdmFsdWVJZGVudGlmaWVyO1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RpcmVjdGl2ZVByb3ZpZGVyID0gcmVxdWlyZSgnLi9kaXJlY3RpdmVQcm92aWRlci5qcycpO1xuXG52YXIgX2RpcmVjdGl2ZVByb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RpcmVjdGl2ZVByb3ZpZGVyKTtcblxudmFyIF9hdHRyaWJ1dGUgPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzJyk7XG5cbnZhciBfYXR0cmlidXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F0dHJpYnV0ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBkaXJlY3RpdmVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHByb3RvID0gYW5ndWxhci5lbGVtZW50LnByb3RvdHlwZSB8fCBhbmd1bGFyLmVsZW1lbnQuX19wcm90b19fO1xuICAgIHByb3RvLiRmaW5kID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciB2YWx1ZXMgPSB7XG4gICAgICAgICAgICBsZW5ndGg6IDBcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzW2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlc1t2YWx1ZXMubGVuZ3RoKytdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KGpvaW4odmFsdWVzKSk7XG4gICAgfTtcbiAgICBwcm90by4kY2xpY2sgPSBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNsaWNrID0gdGhpcy5kYXRhKCduZy1jbGljaycpO1xuICAgICAgICAgICAgcmV0dXJuIGNsaWNrICYmIGNsaWNrKGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb3RvLiR0ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5kYXRhKCduZy1tb2RlbCcpIHx8IHRoaXMuZGF0YSgnbmctYmluZCcpIHx8IHRoaXMuZGF0YSgnbmctdHJhbnNsYXRlJykgfHwgdGhpcy50ZXh0O1xuICAgICAgICAgICAgcmV0dXJuIHRleHQgJiYgdGV4dC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykgfHwgJyc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb3RvLiRpZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbmdJZiA9IHRoaXMuZGF0YSgnbmctaWYnKTtcbiAgICAgICAgICAgIHJldHVybiBuZ0lmICYmIG5nSWYudmFsdWUuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGpvaW4ob2JqKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBvYmopO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBpbGUob2JqLCBjb250cm9sbGVyU2VydmljZSkge1xuICAgICAgICBvYmogPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcblxuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb2JqWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlTmFtZSA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS5uYW1lO1xuICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBvYmpbMF0uYXR0cmlidXRlc1tpaV0udmFsdWU7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9IF9kaXJlY3RpdmVQcm92aWRlcjIuZGVmYXVsdC4kZ2V0KGRpcmVjdGl2ZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBpbGVkRGlyZWN0aXZlID0gZGlyZWN0aXZlLmNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgIG9iai5kYXRhKGRpcmVjdGl2ZS5uYW1lLCBjb21waWxlZERpcmVjdGl2ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBhbmd1bGFyLmVsZW1lbnQob2JqKSwgbmV3IF9hdHRyaWJ1dGUyLmRlZmF1bHQob2JqKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVucyA9IG9iai5jaGlsZHJlbigpO1xuICAgICAgICBmb3IgKHZhciBfaWkgPSAwOyBfaWkgPCBjaGlsZHJlbnMubGVuZ3RoOyBfaWkrKykge1xuICAgICAgICAgICAgY29tcGlsZShjaGlsZHJlbnNbX2lpXSwgY29udHJvbGxlclNlcnZpY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udHJvbChjb250cm9sbGVyU2VydmljZSwgb2JqKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gYW5ndWxhci5lbGVtZW50KG9iaik7XG4gICAgICAgIGlmICghY3VycmVudCB8fCAhY29udHJvbGxlclNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGUoY3VycmVudCwgY29udHJvbGxlclNlcnZpY2UpO1xuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn0oKTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRpcmVjdGl2ZUhhbmRsZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlSGFuZGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXNUb0NvcHkpIHtcbiAgICBpZiAoYXR0cmlidXRlc1RvQ29weSkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXNUb0NvcHkpO1xuICAgICAgICB2YXIgaSwgbCwga2V5O1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGF0dHJpYnV0ZXNUb0NvcHlba2V5XTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGF0dHIgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLiQkZWxlbWVudCA9IGVsZW1lbnQ7XG59XG52YXIgJGFuaW1hdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckYW5pbWF0ZScpO1xudmFyICQkc2FuaXRpemVVcmkgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckJHNhbml0aXplVXJpJyk7XG5BdHRyaWJ1dGVzLnByb3RvdHlwZSA9IHtcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRub3JtYWxpemVcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBDb252ZXJ0cyBhbiBhdHRyaWJ1dGUgbmFtZSAoZS5nLiBkYXNoL2NvbG9uL3VuZGVyc2NvcmUtZGVsaW1pdGVkIHN0cmluZywgb3B0aW9uYWxseSBwcmVmaXhlZCB3aXRoIGB4LWAgb3JcclxuICAgICAqIGBkYXRhLWApIHRvIGl0cyBub3JtYWxpemVkLCBjYW1lbENhc2UgZm9ybS5cclxuICAgICAqXHJcbiAgICAgKiBBbHNvIHRoZXJlIGlzIHNwZWNpYWwgY2FzZSBmb3IgTW96IHByZWZpeCBzdGFydGluZyB3aXRoIHVwcGVyIGNhc2UgbGV0dGVyLlxyXG4gICAgICpcclxuICAgICAqIEZvciBmdXJ0aGVyIGluZm9ybWF0aW9uIGNoZWNrIG91dCB0aGUgZ3VpZGUgb24ge0BsaW5rIGd1aWRlL2RpcmVjdGl2ZSNtYXRjaGluZy1kaXJlY3RpdmVzIE1hdGNoaW5nIERpcmVjdGl2ZXN9XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSB0byBub3JtYWxpemVcclxuICAgICAqL1xuICAgICRub3JtYWxpemU6IF9jb21tb24udG9DYW1lbENhc2UsXG5cbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRhZGRDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIEFkZHMgdGhlIENTUyBjbGFzcyB2YWx1ZSBzcGVjaWZpZWQgYnkgdGhlIGNsYXNzVmFsIHBhcmFtZXRlciB0byB0aGUgZWxlbWVudC4gSWYgYW5pbWF0aW9uc1xyXG4gICAgICogYXJlIGVuYWJsZWQgdGhlbiBhbiBhbmltYXRpb24gd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoZSBjbGFzcyBhZGRpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NWYWwgVGhlIGNsYXNzTmFtZSB2YWx1ZSB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnRcclxuICAgICAqL1xuICAgICRhZGRDbGFzczogZnVuY3Rpb24gJGFkZENsYXNzKGNsYXNzVmFsKSB7XG4gICAgICAgIGlmIChjbGFzc1ZhbCAmJiBjbGFzc1ZhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCwgY2xhc3NWYWwpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJHJlbW92ZUNsYXNzXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogUmVtb3ZlcyB0aGUgQ1NTIGNsYXNzIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgY2xhc3NWYWwgcGFyYW1ldGVyIGZyb20gdGhlIGVsZW1lbnQuIElmXHJcbiAgICAgKiBhbmltYXRpb25zIGFyZSBlbmFibGVkIHRoZW4gYW4gYW5pbWF0aW9uIHdpbGwgYmUgdHJpZ2dlcmVkIGZvciB0aGUgY2xhc3MgcmVtb3ZhbC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NWYWwgVGhlIGNsYXNzTmFtZSB2YWx1ZSB0aGF0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBlbGVtZW50XHJcbiAgICAgKi9cbiAgICAkcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uICRyZW1vdmVDbGFzcyhjbGFzc1ZhbCkge1xuICAgICAgICBpZiAoY2xhc3NWYWwgJiYgY2xhc3NWYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsIGNsYXNzVmFsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyR1cGRhdGVDbGFzc1xyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIEFkZHMgYW5kIHJlbW92ZXMgdGhlIGFwcHJvcHJpYXRlIENTUyBjbGFzcyB2YWx1ZXMgdG8gdGhlIGVsZW1lbnQgYmFzZWQgb24gdGhlIGRpZmZlcmVuY2VcclxuICAgICAqIGJldHdlZW4gdGhlIG5ldyBhbmQgb2xkIENTUyBjbGFzcyB2YWx1ZXMgKHNwZWNpZmllZCBhcyBuZXdDbGFzc2VzIGFuZCBvbGRDbGFzc2VzKS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3Q2xhc3NlcyBUaGUgY3VycmVudCBDU1MgY2xhc3NOYW1lIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkQ2xhc3NlcyBUaGUgZm9ybWVyIENTUyBjbGFzc05hbWUgdmFsdWVcclxuICAgICAqL1xuICAgICR1cGRhdGVDbGFzczogZnVuY3Rpb24gJHVwZGF0ZUNsYXNzKG5ld0NsYXNzZXMsIG9sZENsYXNzZXMpIHtcbiAgICAgICAgdmFyIHRvQWRkID0gdG9rZW5EaWZmZXJlbmNlKG5ld0NsYXNzZXMsIG9sZENsYXNzZXMpO1xuICAgICAgICBpZiAodG9BZGQgJiYgdG9BZGQubGVuZ3RoKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCwgdG9BZGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvUmVtb3ZlID0gdG9rZW5EaWZmZXJlbmNlKG9sZENsYXNzZXMsIG5ld0NsYXNzZXMpO1xuICAgICAgICBpZiAodG9SZW1vdmUgJiYgdG9SZW1vdmUubGVuZ3RoKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5yZW1vdmVDbGFzcyh0aGlzLiQkZWxlbWVudCwgdG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgbm9ybWFsaXplZCBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQgaW4gYSB3YXkgc3VjaCB0aGF0IGFsbCBkaXJlY3RpdmVzXHJcbiAgICAgKiBjYW4gc2hhcmUgdGhlIGF0dHJpYnV0ZS4gVGhpcyBmdW5jdGlvbiBwcm9wZXJseSBoYW5kbGVzIGJvb2xlYW4gYXR0cmlidXRlcy5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTm9ybWFsaXplZCBrZXkuIChpZSBuZ0F0dHJpYnV0ZSlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfGJvb2xlYW59IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuIElmIGBudWxsYCBhdHRyaWJ1dGUgd2lsbCBiZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFuPX0gd3JpdGVBdHRyIElmIGZhbHNlLCBkb2VzIG5vdCB3cml0ZSB0aGUgdmFsdWUgdG8gRE9NIGVsZW1lbnQgYXR0cmlidXRlLlxyXG4gICAgICogICAgIERlZmF1bHRzIHRvIHRydWUuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IGF0dHJOYW1lIE9wdGlvbmFsIG5vbmUgbm9ybWFsaXplZCBuYW1lLiBEZWZhdWx0cyB0byBrZXkuXHJcbiAgICAgKi9cbiAgICAkc2V0OiBmdW5jdGlvbiAkc2V0KGtleSwgdmFsdWUsIHdyaXRlQXR0ciwgYXR0ck5hbWUpIHtcbiAgICAgICAgLy8gVE9ETzogZGVjaWRlIHdoZXRoZXIgb3Igbm90IHRvIHRocm93IGFuIGVycm9yIGlmIFwiY2xhc3NcIlxuICAgICAgICAvL2lzIHNldCB0aHJvdWdoIHRoaXMgZnVuY3Rpb24gc2luY2UgaXQgbWF5IGNhdXNlICR1cGRhdGVDbGFzcyB0b1xuICAgICAgICAvL2JlY29tZSB1bnN0YWJsZS5cblxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuJCRlbGVtZW50WzBdLFxuICAgICAgICAgICAgYm9vbGVhbktleSA9IGFuZ3VsYXIuZ2V0Qm9vbGVhbkF0dHJOYW1lKG5vZGUsIGtleSksXG4gICAgICAgICAgICBhbGlhc2VkS2V5ID0gYW5ndWxhci5nZXRBbGlhc2VkQXR0ck5hbWUoa2V5KSxcbiAgICAgICAgICAgIG9ic2VydmVyID0ga2V5LFxuICAgICAgICAgICAgbm9kZU5hbWU7XG5cbiAgICAgICAgaWYgKGJvb2xlYW5LZXkpIHtcbiAgICAgICAgICAgIHRoaXMuJCRlbGVtZW50LnByb3Aoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGJvb2xlYW5LZXk7XG4gICAgICAgIH0gZWxzZSBpZiAoYWxpYXNlZEtleSkge1xuICAgICAgICAgICAgdGhpc1thbGlhc2VkS2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBhbGlhc2VkS2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XG5cbiAgICAgICAgLy8gdHJhbnNsYXRlIG5vcm1hbGl6ZWQga2V5IHRvIGFjdHVhbCBrZXlcbiAgICAgICAgaWYgKGF0dHJOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLiRhdHRyW2tleV0gPSBhdHRyTmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gdGhpcy4kYXR0cltrZXldO1xuICAgICAgICAgICAgaWYgKCFhdHRyTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGF0dHJba2V5XSA9IGF0dHJOYW1lID0gKDAsIF9jb21tb24udG9TbmFrZUNhc2UpKGtleSwgJy0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGVOYW1lID0gbm9kZU5hbWVfKHRoaXMuJCRlbGVtZW50KTtcblxuICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdhJyAmJiAoa2V5ID09PSAnaHJlZicgfHwga2V5ID09PSAneGxpbmtIcmVmJykgfHwgbm9kZU5hbWUgPT09ICdpbWcnICYmIGtleSA9PT0gJ3NyYycpIHtcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGFbaHJlZl0gYW5kIGltZ1tzcmNdIHZhbHVlc1xuICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWUgPSAkJHNhbml0aXplVXJpKHZhbHVlLCBrZXkgPT09ICdzcmMnKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlTmFtZSA9PT0gJ2ltZycgJiYga2V5ID09PSAnc3Jjc2V0JyAmJiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIHNhbml0aXplIGltZ1tzcmNzZXRdIHZhbHVlc1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vIGZpcnN0IGNoZWNrIGlmIHRoZXJlIGFyZSBzcGFjZXMgYmVjYXVzZSBpdCdzIG5vdCB0aGUgc2FtZSBwYXR0ZXJuXG4gICAgICAgICAgICB2YXIgdHJpbW1lZFNyY3NldCA9ICgwLCBfY29tbW9uLnRyaW0pKHZhbHVlKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICggICA5OTl4ICAgLHwgICA5OTl3ICAgLHwgICAsfCwgICApXG4gICAgICAgICAgICB2YXIgc3JjUGF0dGVybiA9IC8oXFxzK1xcZCt4XFxzKix8XFxzK1xcZCt3XFxzKix8XFxzKyx8LFxccyspLztcbiAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gL1xccy8udGVzdCh0cmltbWVkU3Jjc2V0KSA/IHNyY1BhdHRlcm4gOiAvKCwpLztcblxuICAgICAgICAgICAgLy8gc3BsaXQgc3Jjc2V0IGludG8gdHVwbGUgb2YgdXJpIGFuZCBkZXNjcmlwdG9yIGV4Y2VwdCBmb3IgdGhlIGxhc3QgaXRlbVxuICAgICAgICAgICAgdmFyIHJhd1VyaXMgPSB0cmltbWVkU3Jjc2V0LnNwbGl0KHBhdHRlcm4pO1xuXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCB0dXBsZXNcbiAgICAgICAgICAgIHZhciBuYnJVcmlzV2l0aDJwYXJ0cyA9IE1hdGguZmxvb3IocmF3VXJpcy5sZW5ndGggLyAyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmJyVXJpc1dpdGgycGFydHM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbm5lcklkeCA9IGkgKiAyO1xuICAgICAgICAgICAgICAgIC8vIHNhbml0aXplIHRoZSB1cmlcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJCRzYW5pdGl6ZVVyaSgoMCwgX2NvbW1vbi50cmltKShyYXdVcmlzW2lubmVySWR4XSksIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgZGVzY3JpcHRvclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIiBcIiArICgwLCBfY29tbW9uLnRyaW0pKHJhd1VyaXNbaW5uZXJJZHggKyAxXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBsYXN0IGl0ZW0gaW50byB1cmkgYW5kIGRlc2NyaXB0b3JcbiAgICAgICAgICAgIHZhciBsYXN0VHVwbGUgPSAoMCwgX2NvbW1vbi50cmltKShyYXdVcmlzW2kgKiAyXSkuc3BsaXQoL1xccy8pO1xuXG4gICAgICAgICAgICAvLyBzYW5pdGl6ZSB0aGUgbGFzdCB1cmlcbiAgICAgICAgICAgIHJlc3VsdCArPSAkJHNhbml0aXplVXJpKCgwLCBfY29tbW9uLnRyaW0pKGxhc3RUdXBsZVswXSksIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBhbmQgYWRkIHRoZSBsYXN0IGRlc2NyaXB0b3IgaWYgYW55XG4gICAgICAgICAgICBpZiAobGFzdFR1cGxlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIiBcIiArICgwLCBfY29tbW9uLnRyaW0pKGxhc3RUdXBsZVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3cml0ZUF0dHIgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgYW5ndWxhci5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5yZW1vdmVBdHRyKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKFNJTVBMRV9BVFRSX05BTUUudGVzdChhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kJGVsZW1lbnQuYXR0cihhdHRyTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNwZWNpYWxBdHRyKHRoaXMuJCRlbGVtZW50WzBdLCBhdHRyTmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpcmUgb2JzZXJ2ZXJzXG4gICAgICAgIHZhciAkJG9ic2VydmVycyA9IHRoaXMuJCRvYnNlcnZlcnM7XG4gICAgICAgIGlmICgkJG9ic2VydmVycykge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCQkb2JzZXJ2ZXJzW29ic2VydmVyXSwgZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZm4odmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkb2JzZXJ2ZVxyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIE9ic2VydmVzIGFuIGludGVycG9sYXRlZCBhdHRyaWJ1dGUuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG9ic2VydmVyIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBvbmNlIGR1cmluZyB0aGUgbmV4dCBgJGRpZ2VzdGAgZm9sbG93aW5nXHJcbiAgICAgKiBjb21waWxhdGlvbi4gVGhlIG9ic2VydmVyIGlzIHRoZW4gaW52b2tlZCB3aGVuZXZlciB0aGUgaW50ZXJwb2xhdGVkIHZhbHVlXHJcbiAgICAgKiBjaGFuZ2VzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgTm9ybWFsaXplZCBrZXkuIChpZSBuZ0F0dHJpYnV0ZSkgLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihpbnRlcnBvbGF0ZWRWYWx1ZSl9IGZuIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXJcclxuICAgICAgICAgICAgICB0aGUgaW50ZXJwb2xhdGVkIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgY2hhbmdlcy5cclxuICAgICAqICAgICAgICBTZWUgdGhlIHtAbGluayBndWlkZS9pbnRlcnBvbGF0aW9uI2hvdy10ZXh0LWFuZC1hdHRyaWJ1dGUtYmluZGluZ3Mtd29yayBJbnRlcnBvbGF0aW9uXHJcbiAgICAgKiAgICAgICAgZ3VpZGV9IGZvciBtb3JlIGluZm8uXHJcbiAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24oKX0gUmV0dXJucyBhIGRlcmVnaXN0cmF0aW9uIGZ1bmN0aW9uIGZvciB0aGlzIG9ic2VydmVyLlxyXG4gICAgICovXG4gICAgJG9ic2VydmU6IGZ1bmN0aW9uICRvYnNlcnZlKGtleSwgZm4pIHtcbiAgICAgICAgdmFyIGF0dHJzID0gdGhpcyxcbiAgICAgICAgICAgICQkb2JzZXJ2ZXJzID0gYXR0cnMuJCRvYnNlcnZlcnMgfHwgKGF0dHJzLiQkb2JzZXJ2ZXJzID0gbmV3IE1hcCgpKSxcbiAgICAgICAgICAgIGxpc3RlbmVycyA9ICQkb2JzZXJ2ZXJzW2tleV0gfHwgKCQkb2JzZXJ2ZXJzW2tleV0gPSBbXSk7XG5cbiAgICAgICAgbGlzdGVuZXJzLnB1c2goZm4pO1xuICAgICAgICBfY29tbW9uLnNjb3BlSGVscGVyLiRyb290U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycy4kJGludGVyICYmIGF0dHJzLmhhc093blByb3BlcnR5KGtleSkgJiYgIWFuZ3VsYXIuaXNVbmRlZmluZWQoYXR0cnNba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAvLyBubyBvbmUgcmVnaXN0ZXJlZCBhdHRyaWJ1dGUgaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiwgc28gbGV0cyBjYWxsIGl0IG1hbnVhbGx5XG4gICAgICAgICAgICAgICAgZm4oYXR0cnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmFycmF5UmVtb3ZlKGxpc3RlbmVycywgZm4pO1xuICAgICAgICB9O1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHRva2VuRGlmZmVyZW5jZShzdHIxLCBzdHIyKSB7XG5cbiAgICB2YXIgdmFsdWVzID0gJycsXG4gICAgICAgIHRva2VuczEgPSBzdHIxLnNwbGl0KC9cXHMrLyksXG4gICAgICAgIHRva2VuczIgPSBzdHIyLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBvdXRlcjogZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IHRva2VuczFbaV07XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0b2tlbnMyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodG9rZW4gPT09IHRva2VuczJbal0pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlcyArPSAodmFsdWVzLmxlbmd0aCA+IDAgPyAnICcgOiAnJykgKyB0b2tlbjtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbn1cblxuZnVuY3Rpb24gbm9kZU5hbWVfKGVsZW1lbnQpIHtcbiAgICB2YXIgbXlFbGVtID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpWzBdO1xuICAgIGlmIChteUVsZW0pIHtcbiAgICAgICAgcmV0dXJuIG15RWxlbS5ub2RlTmFtZTtcbiAgICB9XG59XG52YXIgc3BlY2lhbEF0dHJIb2xkZXIgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG52YXIgU0lNUExFX0FUVFJfTkFNRSA9IC9eXFx3LztcblxuZnVuY3Rpb24gc2V0U3BlY2lhbEF0dHIoZWxlbWVudCwgYXR0ck5hbWUsIHZhbHVlKSB7XG4gICAgLy8gQXR0cmlidXRlcyBuYW1lcyB0aGF0IGRvIG5vdCBzdGFydCB3aXRoIGxldHRlcnMgKHN1Y2ggYXMgYChjbGljaylgKSBjYW5ub3QgYmUgc2V0IHVzaW5nIGBzZXRBdHRyaWJ1dGVgXG4gICAgLy8gc28gd2UgaGF2ZSB0byBqdW1wIHRocm91Z2ggc29tZSBob29wcyB0byBnZXQgc3VjaCBhbiBhdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL3B1bGwvMTMzMThcbiAgICBzcGVjaWFsQXR0ckhvbGRlci5pbm5lckhUTUwgPSBcIjxzcGFuIFwiICsgYXR0ck5hbWUgKyBcIj5cIjtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHNwZWNpYWxBdHRySG9sZGVyLmZpcnN0Q2hpbGQuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1swXTtcbiAgICAvLyBXZSBoYXZlIHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGZyb20gaXRzIGNvbnRhaW5lciBlbGVtZW50IGJlZm9yZSB3ZSBjYW4gYWRkIGl0IHRvIHRoZSBkZXN0aW5hdGlvbiBlbGVtZW50XG4gICAgYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0oYXR0cmlidXRlLm5hbWUpO1xuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IHZhbHVlO1xuICAgIGVsZW1lbnQuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW0oYXR0cmlidXRlKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEF0dHJpYnV0ZXM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKTtcblxudmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gY29udHJvbGxlcigpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIGNvbnRyb2xsZXIpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhjb250cm9sbGVyLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICdnZXRWYWx1ZXMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykge1xuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0ge307XG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3QoYmluZGluZ3MpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzID09PSB0cnVlIHx8IGJpbmRpbmdzID09PSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSAnPSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBiaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBfY29tbW9uLlBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhiaW5kaW5nc1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGUgPSByZXN1bHRbMV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XG5cbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbiA9ICRwYXJzZShwYXJlbnRHZXQoc2NvcGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9IGZ1bmN0aW9uIChsb2NhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihzY29wZSwgbG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnQCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHAgPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNFeHAgPSAoMCwgX2NvbW1vbi5pc0V4cHJlc3Npb24pKGV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0V4cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9ICRwYXJzZSgoMCwgX2NvbW1vbi5leHByZXNzaW9uU2FuaXRpemVyKShleHApKShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGFwcGx5IGJpbmRpbmdzJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3BhcnNlQmluZGluZ3MnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGlzb2xhdGVTY29wZSwgY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgICB2YXIgYXNzaWduQmluZGluZ3MgPSBmdW5jdGlvbiBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSwgbW9kZSkge1xuICAgICAgICAgICAgICAgIG1vZGUgPSBtb2RlIHx8ICc9JztcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2NvbW1vbi5QQVJTRV9CSU5ESU5HX1JFR0VYLmV4ZWMobW9kZSk7XG4gICAgICAgICAgICAgICAgbW9kZSA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50S2V5ID0gcmVzdWx0WzJdIHx8IGtleTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRLZXkgPSBjb250cm9sbGVyQXMgKyAnLicgKyBrZXk7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudEdldCA9ICRwYXJzZShwYXJlbnRLZXkpO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZEdldCA9ICRwYXJzZShjaGlsZEtleSk7XG4gICAgICAgICAgICAgICAgdmFyIHVud2F0Y2g7XG5cbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRWYWx1ZVdhdGNoID0gZnVuY3Rpb24gcGFyZW50VmFsdWVXYXRjaCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFZhbHVlICE9PSBsYXN0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgcGFyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50VmFsdWUgPSBjaGlsZEdldChkZXN0aW5hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRHZXQuYXNzaWduKHNjb3BlLCBwYXJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gcGFyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdAJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNFeHAgPSAoMCwgX2NvbW1vbi5pc0V4cHJlc3Npb24pKHNjb3BlW3BhcmVudEtleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0V4cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRWYWx1ZVdhdGNoID0gZnVuY3Rpb24gcGFyZW50VmFsdWVXYXRjaCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IHBhcmVudEdldChzY29wZSwgaXNvbGF0ZVNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdldC5hc3NpZ24oZGVzdGluYXRpb24sIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW53YXRjaCA9IHNjb3BlLiR3YXRjaChwYXJlbnRWYWx1ZVdhdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLiRvbignJGRlc3Ryb3knLCB1bndhdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IF9jb21tb24uc2NvcGVIZWxwZXIuY3JlYXRlKGlzb2xhdGVTY29wZSB8fCBzY29wZS4kbmV3KCkpO1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYW5ndWxhci5pc1N0cmluZyhiaW5kaW5ncykgJiYgYmluZGluZ3MgPT09ICc9Jykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzY29wZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJyQnKSAmJiBrZXkgIT09IGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfa2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShfa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWduQmluZGluZ3MoZGVzdGluYXRpb24sIHNjb3BlLCBfa2V5LCBiaW5kaW5nc1tfa2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBwYXJzZSBiaW5kaW5ncyc7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJyRnZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gJGdldChtb2R1bGVOYW1lcykge1xuICAgICAgICAgICAgdmFyICRjb250cm9sbGVyID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gKDAsIF9jb21tb24ubWFrZUFycmF5KShtb2R1bGVOYW1lcyk7XG4gICAgICAgICAgICAvLyBjb25zdCBpbmRleE1vY2sgPSBhcnJheS5pbmRleE9mKCduZ01vY2snKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGluZGV4TmcgPSBhcnJheS5pbmRleE9mKCduZycpO1xuICAgICAgICAgICAgLy8gaWYgKGluZGV4TW9jayAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vICAgICBhcnJheVtpbmRleE1vY2tdID0gJ25nJztcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGlmIChpbmRleE5nID09PSAtMSkge1xuICAgICAgICAgICAgLy8gICAgIGFycmF5LnB1c2goJ25nJyk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBhbmd1bGFyLmluamVjdG9yKGFycmF5KS5pbnZva2UoWyckY29udHJvbGxlcicsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgICAgICAgICAgfV0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBzY29wZSwgYmluZGluZ3MsIHNjb3BlQ29udHJvbGxlck5hbWUsIGV4dGVuZGVkTG9jYWxzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSk7XG4gICAgICAgICAgICAgICAgc2NvcGVDb250cm9sbGVyTmFtZSA9IHNjb3BlQ29udHJvbGxlck5hbWUgfHwgJ2NvbnRyb2xsZXInO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbHMgPSAoMCwgX2NvbW1vbi5leHRlbmQpKGV4dGVuZGVkTG9jYWxzIHx8IHt9LCB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZTogX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUoc2NvcGUpLiRuZXcoKVxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RvciA9ICRjb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBsb2NhbHMsIHRydWUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAoMCwgX2NvbW1vbi5leHRlbmQpKGNvbnN0cnVjdG9yLmluc3RhbmNlLCBjb250cm9sbGVyLmdldFZhbHVlcyhzY29wZSwgYmluZGluZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5wYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgbG9jYWxzLiRzY29wZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncyA9IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gYiB8fCBiaW5kaW5ncztcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9jYWxzID0gbXlMb2NhbHMgfHwgbG9jYWxzO1xuICAgICAgICAgICAgICAgICAgICAvLyBiID0gYiB8fCBiaW5kaW5ncztcblxuICAgICAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgLy9leHRlbmQoY29uc3RydWN0b3IuaW5zdGFuY2UsIGV4dGVuZGVkTG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yLnByb3ZpZGVCaW5kaW5ncygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlQ29udHJvbGxlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBjb250cm9sbGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjb250cm9sbGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9jb250cm9sbGVyL2NvbnRyb2xsZXJRTS5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9