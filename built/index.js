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
	        internals = {
	        ngIf: (0, _ngIf.ngIfDirective)(),
	        ngClick: (0, _ngClick.ngClickDirective)($parse),
	        ngModel: (0, _ngModel.ngModelDirective)($parse),
	        ngDisabled: (0, _ngIf.ngIfDirective)(),
	        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
	        ngBind: (0, _ngBind.ngBindDirective)(),
	        ngClass: (0, _ngClass.ngClassDirective)($parse),
	        ngRepeat: (0, _ngRepeat.ngRepeatDirective)(),
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length > 0);
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	                do {
	                    (subscriptors.shift() || angular.noop)();
	                } while (subscriptors.length);
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
	
	function ngRepeatDirective($parse, $animate) {
	    var NG_REMOVED = '$$NG_REMOVED';
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
	
	    // const getBlockStart = function(block) {
	    //     return block.clone[0];
	    // };
	
	    // const getBlockEnd = function(block) {
	    //     return block.clone[block.clone.length - 1];
	    // };
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
	            var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
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
	            var lastValue = {
	                toAdd: [],
	                toRemove: []
	            };
	            var watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
	                lastValue = {
	                    toAdd: [],
	                    toRemove: []
	                };
	                var index,
	                    length,
	                    nextBlockMap = (0, _common.createMap)(),
	                    collectionLength,
	                    key,
	                    value,
	                    // key/value of iteration
	                trackById,
	                    trackByIdFn,
	                    collectionKeys,
	                    block,
	                    // last object information {scope, element, id}
	                nextBlockOrder,
	                    elementsToRemove;
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
	                nextBlockOrder = new Array(collectionLength); // locate existing items
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
	                        throw ["Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: ", expression, ", Duplicate key: ", trackById, ", Duplicate value: ", value].join('');
	                    } else {
	                        // new never before seen block
	                        lastValue.toAdd.push(nextBlockOrder[index] = {
	                            id: trackById,
	                            scope: $scope.$new(value),
	                            clone: undefined
	                        });
	                        nextBlockMap[trackById] = true;
	                    }
	                } // remove leftover items
	                for (var blockKey in lastBlockMap) {
	                    lastValue.toRemove.push(block = lastBlockMap[blockKey]);
	                    elementsToRemove = (0, _common.getBlockNodes)(block.clone);
	                    $animate.leave(elementsToRemove);
	                    if (elementsToRemove[0].parentNode) {
	                        // if the element was not removed yet because of pending animation, mark it as deleted
	                        // so that we can ignore it later
	                        for (index = 0, length = elementsToRemove.length; index < length; index++) {
	                            elementsToRemove[index][NG_REMOVED] = true;
	                        }
	                    }
	                    block.scope.$destroy();
	                } // we are not using forEach for perf reasons (trying to avoid #call)
	                for (index = 0; index < collectionLength; index++) {
	                    key = collection === collectionKeys ? index : collectionKeys[index];
	                    value = collection[key];
	                    block = nextBlockOrder[index];
	                    if (block.scope) {
	                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
	                    }
	                }
	                lastBlockMap = nextBlockMap;
	                subscriptors.forEach(function (fn) {
	                    fn(lastValue);
	                });
	            });
	            $scope.$on('$destroy', function () {
	                do {
	                    (subscriptors.shift || angular.noop)();
	                } while (subscriptors.length);
	                watcher();
	            });
	            var toReturn = function toReturn() {
	                return lastValue;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDNjNTRiOTg0YzhlMTM2ZDU1OWUiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvaW5kZXgubG9hZGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L3F1aWNrbW9jay5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9xdWlja21vY2subW9ja0hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVyL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9jb250cm9sbGVySGFuZGxlci9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvZGlyZWN0aXZlUHJvdmlkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsaWNrLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nSWYuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdCaW5kLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbHQvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvYXR0cmlidXRlLmpzIiwid2VicGFjazovLy8uL2J1aWx0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBOztBQUVBLHdCOzs7Ozs7QUNGQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx1Q0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBc0I7QUFDdEI7O0FBRUE7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBbUMsNkJBQTZCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBbUIsK0NBQStDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlDQUF3QyxRQUFRO0FBQ2hEO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTJDLFlBQVk7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQSxFQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxFOzs7Ozs7QUM5U0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxzRUFBcUU7QUFDckU7QUFDQSxrQkFBaUI7O0FBRWpCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBLEVBQUM7O0FBRUQsOEIiLCJmaWxlIjoiLi9idWlsdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNDNjNTRiOTg0YzhlMTM2ZDU1OWVcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vcXVpY2ttb2NrLmpzJyk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2luZGV4LmxvYWRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3F1aWNrbW9ja01vY2tIZWxwZXIgPSByZXF1aXJlKCcuL3F1aWNrbW9jay5tb2NrSGVscGVyLmpzJyk7XG5cbnZhciBfcXVpY2ttb2NrTW9ja0hlbHBlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9xdWlja21vY2tNb2NrSGVscGVyKTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbnZhciBfY29udHJvbGxlckhhbmRsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzJyk7XG5cbnZhciBfY29udHJvbGxlckhhbmRsZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29udHJvbGxlckhhbmRsZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgbW9ja2VyID0gZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICB2YXIgb3B0cywgbW9ja1ByZWZpeDtcbiAgICB2YXIgY29udHJvbGxlckRlZmF1bHRzID0gZnVuY3Rpb24gY29udHJvbGxlckRlZmF1bHRzKGZsYWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBwYXJlbnRTY29wZToge30sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250cm9sbGVyJyxcbiAgICAgICAgICAgIGlzRGVmYXVsdDogIWZsYWdcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHF1aWNrbW9jay5NT0NLX1BSRUZJWCA9IG1vY2tQcmVmaXggPSBxdWlja21vY2suTU9DS19QUkVGSVggfHwgJ19fXyc7XG4gICAgcXVpY2ttb2NrLlVTRV9BQ1RVQUwgPSAnVVNFX0FDVFVBTF9JTVBMRU1FTlRBVElPTic7XG4gICAgcXVpY2ttb2NrLk1VVEVfTE9HUyA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gcXVpY2ttb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0cyA9IGFzc2VydFJlcXVpcmVkT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG1vY2tQcm92aWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vY2tQcm92aWRlcigpIHtcbiAgICAgICAgdmFyIGFsbE1vZHVsZXMgPSBvcHRzLm1vY2tNb2R1bGVzLmNvbmNhdChbJ25nTW9jayddKSxcbiAgICAgICAgICAgIGluamVjdG9yID0gYW5ndWxhci5pbmplY3RvcihhbGxNb2R1bGVzLmNvbmNhdChbb3B0cy5tb2R1bGVOYW1lXSkpLFxuICAgICAgICAgICAgbW9kT2JqID0gYW5ndWxhci5tb2R1bGUob3B0cy5tb2R1bGVOYW1lKSxcbiAgICAgICAgICAgIGludm9rZVF1ZXVlID0gbW9kT2JqLl9pbnZva2VRdWV1ZSB8fCBbXSxcbiAgICAgICAgICAgIHByb3ZpZGVyVHlwZSA9IGdldFByb3ZpZGVyVHlwZShvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpLFxuICAgICAgICAgICAgbW9ja3MgPSB7fSxcbiAgICAgICAgICAgIHByb3ZpZGVyID0ge307XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFsbE1vZHVsZXMgfHwgW10sIGZ1bmN0aW9uIChtb2ROYW1lKSB7XG4gICAgICAgICAgICBpbnZva2VRdWV1ZSA9IGludm9rZVF1ZXVlLmNvbmNhdChhbmd1bGFyLm1vZHVsZShtb2ROYW1lKS5faW52b2tlUXVldWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAob3B0cy5pbmplY3QpIHtcbiAgICAgICAgICAgIGluamVjdG9yLmludm9rZShvcHRzLmluamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvdmlkZXJUeXBlKSB7XG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggaW52b2tlUXVldWUsIGZpbmQgdGhpcyBwcm92aWRlcidzIGRlcGVuZGVuY2llcyBhbmQgcHJlZml4XG4gICAgICAgICAgICAvLyB0aGVtIHNvIEFuZ3VsYXIgd2lsbCBpbmplY3QgdGhlIG1vY2tlZCB2ZXJzaW9uc1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbiAocHJvdmlkZXJEYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJQcm92aWRlck5hbWUgPSBwcm92aWRlckRhdGFbMl1bMF07XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlck5hbWUgPT09IG9wdHMucHJvdmlkZXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY3VyclByb3ZpZGVyRGVwcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHMgPSBjdXJyUHJvdmlkZXJEZXBzLiRpbmplY3QgfHwgaW5qZWN0b3IuYW5ub3RhdGUoY3VyclByb3ZpZGVyRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJQcm92aWRlckRlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGN1cnJQcm92aWRlckRlcHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcE5hbWUgPSBjdXJyUHJvdmlkZXJEZXBzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vY2tzW2RlcE5hbWVdID0gZ2V0TW9ja0ZvclByb3ZpZGVyKGRlcE5hbWUsIGN1cnJQcm92aWRlckRlcHMsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChwcm92aWRlclR5cGUgPT09ICdkaXJlY3RpdmUnKSB7XG4gICAgICAgICAgICAgICAgc2V0dXBEaXJlY3RpdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0dXBJbml0aWFsaXplcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9rZVF1ZXVlLCBmdW5jdGlvbiAocHJvdmlkZXJEYXRhKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IHByZWZpeGVkIGRlcGVuZGVuY2llcyB0aGF0IHBlcnNpc3RlZCBmcm9tIGEgcHJldmlvdXMgY2FsbCxcbiAgICAgICAgICAgIC8vIGFuZCBjaGVjayBmb3IgYW55IG5vbi1hbm5vdGF0ZWQgc2VydmljZXNcbiAgICAgICAgICAgIHNhbml0aXplUHJvdmlkZXIocHJvdmlkZXJEYXRhLCBpbmplY3Rvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcblxuICAgICAgICBmdW5jdGlvbiBzZXR1cEluaXRpYWxpemVyKCkge1xuICAgICAgICAgICAgcHJvdmlkZXIgPSBpbml0UHJvdmlkZXIoKTtcbiAgICAgICAgICAgIGlmIChvcHRzLnNweU9uUHJvdmlkZXJNZXRob2RzKSB7XG4gICAgICAgICAgICAgICAgc3B5T25Qcm92aWRlck1ldGhvZHMocHJvdmlkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XG4gICAgICAgICAgICBwcm92aWRlci4kaW5pdGlhbGl6ZSA9IHNldHVwSW5pdGlhbGl6ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvdmlkZXIoKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHByb3ZpZGVyVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRyb2xsZXInOlxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBfY29udHJvbGxlckhhbmRsZXIyLmRlZmF1bHQuY2xlYW4oKS5hZGRNb2R1bGVzKGFsbE1vZHVsZXMuY29uY2F0KG9wdHMubW9kdWxlTmFtZSkpLmJpbmRXaXRoKG9wdHMuY29udHJvbGxlci5iaW5kVG9Db250cm9sbGVyKS5zZXRTY29wZShvcHRzLmNvbnRyb2xsZXIucGFyZW50U2NvcGUpLnNldExvY2Fscyhtb2NrcykubmV3KG9wdHMucHJvdmlkZXJOYW1lLCBvcHRzLmNvbnRyb2xsZXIuY29udHJvbGxlckFzKTtcbiAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm4uY3JlYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBtb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vY2tzLmhhc093blByb3BlcnR5KGtleSkgJiYgdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2Nrc1trZXldID0gdG9SZXR1cm4uY29udHJvbGxlckluc3RhbmNlW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udHJvbGxlci5pc0RlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b1JldHVybi5jb250cm9sbGVySW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbHRlcic6XG4gICAgICAgICAgICAgICAgICAgIHZhciAkZmlsdGVyID0gaW5qZWN0b3IuZ2V0KCckZmlsdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZmlsdGVyKG9wdHMucHJvdmlkZXJOYW1lKTtcbiAgICAgICAgICAgICAgICBjYXNlICdhbmltYXRpb24nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGU6IGluamVjdG9yLmdldCgnJGFuaW1hdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0QW5pbWF0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIubW9jay5tb2R1bGUoJ25nQW5pbWF0ZU1vY2snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KG9wdHMucHJvdmlkZXJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwRGlyZWN0aXZlKCkge1xuICAgICAgICAgICAgdmFyICRjb21waWxlID0gaW5qZWN0b3IuZ2V0KCckY29tcGlsZScpO1xuICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlID0gaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJykuJG5ldygpO1xuICAgICAgICAgICAgcHJvdmlkZXIuJG1vY2tzID0gbW9ja3M7XG5cbiAgICAgICAgICAgIHByb3ZpZGVyLiRjb21waWxlID0gZnVuY3Rpb24gcXVpY2ttb2NrQ29tcGlsZShodG1sKSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwgfHwgb3B0cy5odG1sO1xuICAgICAgICAgICAgICAgIGlmICghaHRtbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGNvbXBpbGUgXCInICsgb3B0cy5wcm92aWRlck5hbWUgKyAnXCIgZGlyZWN0aXZlLiBObyBodG1sIHN0cmluZy9vYmplY3QgcHJvdmlkZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGh0bWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBnZW5lcmF0ZUh0bWxTdHJpbmdGcm9tT2JqKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm92aWRlci4kZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChodG1sKTtcbiAgICAgICAgICAgICAgICBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhvcHRzLnByb3ZpZGVyTmFtZSwgaW52b2tlUXVldWUpO1xuICAgICAgICAgICAgICAgICRjb21waWxlKHByb3ZpZGVyLiRlbGVtZW50KShwcm92aWRlci4kc2NvcGUpO1xuICAgICAgICAgICAgICAgIHByZWZpeFByb3ZpZGVyRGVwZW5kZW5jaWVzKG9wdHMucHJvdmlkZXJOYW1lLCBpbnZva2VRdWV1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJGlzb1Njb3BlID0gcHJvdmlkZXIuJGVsZW1lbnQuaXNvbGF0ZVNjb3BlKCk7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXIuJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRNb2NrRm9yUHJvdmlkZXIoZGVwTmFtZSwgY3VyclByb3ZpZGVyRGVwcywgaSkge1xuICAgICAgICAgICAgdmFyIGRlcFR5cGUgPSBnZXRQcm92aWRlclR5cGUoZGVwTmFtZSwgaW52b2tlUXVldWUpLFxuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IGRlcE5hbWU7XG4gICAgICAgICAgICBpZiAob3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdICYmIG9wdHMubW9ja3NbbW9ja1NlcnZpY2VOYW1lXSAhPT0gcXVpY2ttb2NrLlVTRV9BQ1RVQUwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzLm1vY2tzW21vY2tTZXJ2aWNlTmFtZV0gJiYgb3B0cy5tb2Nrc1ttb2NrU2VydmljZU5hbWVdID09PSBxdWlja21vY2suVVNFX0FDVFVBTCkge1xuICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcFR5cGUgPT09ICd2YWx1ZScgfHwgZGVwVHlwZSA9PT0gJ2NvbnN0YW50Jykge1xuICAgICAgICAgICAgICAgIGlmIChpbmplY3Rvci5oYXMobW9ja1ByZWZpeCArIGRlcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlTmFtZSA9IG1vY2tQcmVmaXggKyBkZXBOYW1lO1xuICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHF1aWNrbW9ja0xvZygncXVpY2ttb2NrOiBVc2luZyBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgXCInICsgZGVwTmFtZSArICdcIiAnICsgZGVwVHlwZSArICcgaW5zdGVhZCBvZiBtb2NrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcbiAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrUHJlZml4ICsgZGVwTmFtZTtcbiAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1NlcnZpY2VOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpbmplY3Rvci5oYXMobW9ja1NlcnZpY2VOYW1lKSkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLnVzZUFjdHVhbERlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgICAgICAgICBxdWlja21vY2tMb2coJ3F1aWNrbW9jazogVXNpbmcgYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIFwiJyArIGRlcE5hbWUgKyAnXCIgJyArIGRlcFR5cGUgKyAnIGluc3RlYWQgb2YgbW9jaycpO1xuICAgICAgICAgICAgICAgICAgICBtb2NrU2VydmljZU5hbWUgPSBtb2NrU2VydmljZU5hbWUucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBpbmplY3QgbW9jayBmb3IgXCInICsgZGVwTmFtZSArICdcIiBiZWNhdXNlIG5vIHN1Y2ggbW9jayBleGlzdHMuIFBsZWFzZSB3cml0ZSBhIG1vY2sgJyArIGRlcFR5cGUgKyAnIGNhbGxlZCBcIicgKyBtb2NrU2VydmljZU5hbWUgKyAnXCIgKG9yIHNldCB0aGUgdXNlQWN0dWFsRGVwZW5kZW5jaWVzIHRvIHRydWUpIGFuZCB0cnkgYWdhaW4uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yLmdldChtb2NrU2VydmljZU5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2FuaXRpemVQcm92aWRlcihwcm92aWRlckRhdGEsIGluamVjdG9yKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHByb3ZpZGVyRGF0YVsyXVswXSkgJiYgcHJvdmlkZXJEYXRhWzJdWzBdLmluZGV4T2YobW9ja1ByZWZpeCkgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHByb3ZpZGVyRGF0YVsyXVsxXSkpIHtcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlciBkZWNsYXJhdGlvbiBmdW5jdGlvbiBoYXMgYmVlbiBwcm92aWRlZCB3aXRob3V0IHRoZSBhcnJheSBhbm5vdGF0aW9uLFxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gYW5ub3RhdGUgaXQgc28gdGhlIGludm9rZVF1ZXVlIGNhbiBiZSBwcmVmaXhlZFxuICAgICAgICAgICAgICAgIHZhciBhbm5vdGF0ZWREZXBlbmRlbmNpZXMgPSBpbmplY3Rvci5hbm5vdGF0ZShwcm92aWRlckRhdGFbMl1bMV0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBwcm92aWRlckRhdGFbMl1bMV0uJGluamVjdDtcbiAgICAgICAgICAgICAgICBhbm5vdGF0ZWREZXBlbmRlbmNpZXMucHVzaChwcm92aWRlckRhdGFbMl1bMV0pO1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyRGF0YVsyXVsxXSA9IGFubm90YXRlZERlcGVuZGVuY2llcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjdXJyUHJvdmlkZXJEZXBzID0gcHJvdmlkZXJEYXRhWzJdWzFdO1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShjdXJyUHJvdmlkZXJEZXBzKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJQcm92aWRlckRlcHNbaV0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyclByb3ZpZGVyRGVwc1tpXSA9IGN1cnJQcm92aWRlckRlcHNbaV0ucmVwbGFjZShtb2NrUHJlZml4LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3F1aWNrbW9jazogQ2Fubm90IGluaXRpYWxpemUgYmVjYXVzZSBhbmd1bGFyIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBsb2FkIGFuZ3VsYXIgYmVmb3JlIGxvYWRpbmcgcXVpY2ttb2NrLmpzLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb3B0aW9ucy5wcm92aWRlck5hbWUgJiYgIW9wdGlvbnMuY29uZmlnQmxvY2tzICYmICFvcHRpb25zLnJ1bkJsb2Nrcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IE5vIHByb3ZpZGVyTmFtZSBnaXZlbi4gWW91IG11c3QgZ2l2ZSB0aGUgbmFtZSBvZiB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LCBvciBzZXQgdGhlIGNvbmZpZ0Jsb2NrcyBvciBydW5CbG9ja3MgZmxhZ3MuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvcHRpb25zLm1vZHVsZU5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncXVpY2ttb2NrOiBObyBtb2R1bGVOYW1lIGdpdmVuLiBZb3UgbXVzdCBnaXZlIHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgdGhhdCBjb250YWlucyB0aGUgcHJvdmlkZXIvc2VydmljZSB5b3Ugd2lzaCB0byB0ZXN0LicpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMubW9ja01vZHVsZXMgPSBvcHRpb25zLm1vY2tNb2R1bGVzIHx8IFtdO1xuICAgICAgICBvcHRpb25zLm1vY2tzID0gb3B0aW9ucy5tb2NrcyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5jb250cm9sbGVyID0gKDAsIF9jb21tb24uZXh0ZW5kKShvcHRpb25zLmNvbnRyb2xsZXIsIGNvbnRyb2xsZXJEZWZhdWx0cyhhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmNvbnRyb2xsZXIpKSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNweU9uUHJvdmlkZXJNZXRob2RzKHByb3ZpZGVyKSB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcm92aWRlciwgZnVuY3Rpb24gKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5qYXNtaW5lICYmIHdpbmRvdy5zcHlPbiAmJiAhcHJvcGVydHkuY2FsbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNweSA9IHNweU9uKHByb3ZpZGVyLCBwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3B5LmFuZENhbGxUaHJvdWdoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcHkuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNweS5hbmQuY2FsbFRocm91Z2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnNpbm9uICYmIHdpbmRvdy5zaW5vbi5zcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNpbm9uLnNweShwcm92aWRlciwgcHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb3ZpZGVyVHlwZShwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW52b2tlUXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwcm92aWRlckluZm8gPSBpbnZva2VRdWV1ZVtpXTtcbiAgICAgICAgICAgIGlmIChwcm92aWRlckluZm9bMl1bMF0gPT09IHByb3ZpZGVyTmFtZSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvdmlkZXJJbmZvWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRwcm92aWRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm92aWRlckluZm9bMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRjb250cm9sbGVyUHJvdmlkZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdjb250cm9sbGVyJztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJGNvbXBpbGVQcm92aWRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2RpcmVjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRmaWx0ZXJQcm92aWRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2ZpbHRlcic7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyRhbmltYXRlUHJvdmlkZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb24nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVmaXhQcm92aWRlckRlcGVuZGVuY2llcyhwcm92aWRlck5hbWUsIGludm9rZVF1ZXVlLCB1bnByZWZpeCkge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2tlUXVldWUsIGZ1bmN0aW9uIChwcm92aWRlckRhdGEpIHtcbiAgICAgICAgICAgIGlmIChwcm92aWRlckRhdGFbMl1bMF0gPT09IHByb3ZpZGVyTmFtZSAmJiBwcm92aWRlckRhdGFbMl1bMF0uaW5kZXhPZihtb2NrUHJlZml4KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByb3ZpZGVyRGVwcyA9IHByb3ZpZGVyRGF0YVsyXVsxXTtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGN1cnJQcm92aWRlckRlcHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclByb3ZpZGVyRGVwcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJQcm92aWRlckRlcHNbaV0gPSBjdXJyUHJvdmlkZXJEZXBzW2ldLnJlcGxhY2UobW9ja1ByZWZpeCwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyUHJvdmlkZXJEZXBzW2ldLmluZGV4T2YobW9ja1ByZWZpeCkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyUHJvdmlkZXJEZXBzW2ldID0gbW9ja1ByZWZpeCArIGN1cnJQcm92aWRlckRlcHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlSHRtbFN0cmluZ0Zyb21PYmooaHRtbCkge1xuICAgICAgICBpZiAoIWh0bWwuJHRhZykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdxdWlja21vY2s6IENhbm5vdCBjb21waWxlIFwiJyArIG9wdHMucHJvdmlkZXJOYW1lICsgJ1wiIGRpcmVjdGl2ZS4gSHRtbCBvYmplY3QgZG9lcyBub3QgY29udGFpbiAkdGFnIHByb3BlcnR5LicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBodG1sQXR0cnMgPSBodG1sLFxuICAgICAgICAgICAgdGFnTmFtZSA9IGh0bWxBdHRycy4kdGFnLFxuICAgICAgICAgICAgaHRtbENvbnRlbnQgPSBodG1sQXR0cnMuJGNvbnRlbnQ7XG4gICAgICAgIGh0bWwgPSAnPCcgKyB0YWdOYW1lICsgJyAnO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goaHRtbEF0dHJzLCBmdW5jdGlvbiAodmFsLCBhdHRyKSB7XG4gICAgICAgICAgICBpZiAoYXR0ciAhPT0gJyRjb250ZW50JyAmJiBhdHRyICE9PSAnJHRhZycpIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IHNuYWtlX2Nhc2UoYXR0cikgKyAodmFsID8gJz1cIicgKyB2YWwgKyAnXCIgJyA6ICcgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBodG1sICs9IGh0bWxDb250ZW50ID8gJz4nICsgaHRtbENvbnRlbnQgOiAnPic7XG4gICAgICAgIGh0bWwgKz0gJzwvJyArIHRhZ05hbWUgKyAnPic7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1aWNrbW9ja0xvZyhtc2cpIHtcbiAgICAgICAgaWYgKCFxdWlja21vY2suTVVURV9MT0dTKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFNOQUtFX0NBU0VfUkVHRVhQID0gL1tBLVpdL2c7XG5cbiAgICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUsIHNlcGFyYXRvcikge1xuICAgICAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgfHwgJy0nO1xuICAgICAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNOQUtFX0NBU0VfUkVHRVhQLCBmdW5jdGlvbiAobGV0dGVyLCBwb3MpIHtcbiAgICAgICAgICAgIHJldHVybiAocG9zID8gc2VwYXJhdG9yIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBxdWlja21vY2s7XG59KGFuZ3VsYXIpO1xuKDAsIF9xdWlja21vY2tNb2NrSGVscGVyMi5kZWZhdWx0KShtb2NrZXIpO1xuZXhwb3J0cy5kZWZhdWx0ID0gbW9ja2VyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9xdWlja21vY2suanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gbG9hZEhlbHBlcihtb2NrZXIpIHtcbiAgICAoZnVuY3Rpb24gKHF1aWNrbW9jaykge1xuICAgICAgICB2YXIgaGFzQmVlbk1vY2tlZCA9IHt9LFxuICAgICAgICAgICAgb3JpZ01vZHVsZUZ1bmMgPSBhbmd1bGFyLm1vZHVsZTtcbiAgICAgICAgcXVpY2ttb2NrLm9yaWdpbmFsTW9kdWxlcyA9IGFuZ3VsYXIubW9kdWxlO1xuICAgICAgICBhbmd1bGFyLm1vZHVsZSA9IGRlY29yYXRlQW5ndWxhck1vZHVsZTtcblxuICAgICAgICBxdWlja21vY2subW9ja0hlbHBlciA9IHtcbiAgICAgICAgICAgIGhhc0JlZW5Nb2NrZWQ6IGhhc0JlZW5Nb2NrZWRcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBkZWNvcmF0ZUFuZ3VsYXJNb2R1bGVPYmplY3QobW9kT2JqKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kcyA9IGdldERlY29yYXRlZE1ldGhvZHMobW9kT2JqKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZXRob2RzLCBmdW5jdGlvbiAobWV0aG9kLCBtZXRob2ROYW1lKSB7XG4gICAgICAgICAgICAgICAgbW9kT2JqW21ldGhvZE5hbWVdID0gbWV0aG9kO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbW9kT2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVBbmd1bGFyTW9kdWxlKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbikge1xuICAgICAgICAgICAgdmFyIG1vZE9iaiA9IG9yaWdNb2R1bGVGdW5jKG5hbWUsIHJlcXVpcmVzLCBjb25maWdGbik7XG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmd1bGFyTW9kdWxlT2JqZWN0KG1vZE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXREZWNvcmF0ZWRNZXRob2RzKG1vZE9iaikge1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgcHJvdmlkZXJUeXBlKSB7XG4gICAgICAgICAgICAgICAgaGFzQmVlbk1vY2tlZFtwcm92aWRlck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3TW9kT2JqID0gbW9kT2JqW3Byb3ZpZGVyVHlwZV0ocXVpY2ttb2NrLk1PQ0tfUFJFRklYICsgcHJvdmlkZXJOYW1lLCBpbml0RnVuYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5ndWxhck1vZHVsZU9iamVjdChuZXdNb2RPYmopO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG1vY2tTZXJ2aWNlOiBmdW5jdGlvbiBtb2NrU2VydmljZShwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ3NlcnZpY2UnLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbW9ja0ZhY3Rvcnk6IGZ1bmN0aW9uIG1vY2tGYWN0b3J5KHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAnZmFjdG9yeScsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tGaWx0ZXI6IGZ1bmN0aW9uIG1vY2tGaWx0ZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdmaWx0ZXInLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrQ29udHJvbGxlcjogZnVuY3Rpb24gbW9ja0NvbnRyb2xsZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdjb250cm9sbGVyJywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja1Byb3ZpZGVyOiBmdW5jdGlvbiBtb2NrUHJvdmlkZXIocHJvdmlkZXJOYW1lLCBpbml0RnVuYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzaWNNb2NrKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMsICdwcm92aWRlcicsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG1vY2tWYWx1ZTogZnVuY3Rpb24gbW9ja1ZhbHVlKHByb3ZpZGVyTmFtZSwgaW5pdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2ljTW9jayhwcm92aWRlck5hbWUsIGluaXRGdW5jLCAndmFsdWUnLCBtb2RPYmopO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBtb2NrQ29uc3RhbnQ6IGZ1bmN0aW9uIG1vY2tDb25zdGFudChwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2NvbnN0YW50JywgbW9kT2JqKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbW9ja0FuaW1hdGlvbjogZnVuY3Rpb24gbW9ja0FuaW1hdGlvbihwcm92aWRlck5hbWUsIGluaXRGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNpY01vY2socHJvdmlkZXJOYW1lLCBpbml0RnVuYywgJ2FuaW1hdGlvbicsIG1vZE9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pKG1vY2tlcik7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBsb2FkSGVscGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9xdWlja21vY2subW9ja0hlbHBlci5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5nZXRCbG9ja05vZGVzID0gZ2V0QmxvY2tOb2RlcztcbmV4cG9ydHMuaGFzaEtleSA9IGhhc2hLZXk7XG5leHBvcnRzLmNyZWF0ZU1hcCA9IGNyZWF0ZU1hcDtcbmV4cG9ydHMuc2hhbGxvd0NvcHkgPSBzaGFsbG93Q29weTtcbmV4cG9ydHMuaXNBcnJheUxpa2UgPSBpc0FycmF5TGlrZTtcbmV4cG9ydHMudHJpbSA9IHRyaW07XG5leHBvcnRzLmlzRXhwcmVzc2lvbiA9IGlzRXhwcmVzc2lvbjtcbmV4cG9ydHMuZXhwcmVzc2lvblNhbml0aXplciA9IGV4cHJlc3Npb25TYW5pdGl6ZXI7XG5leHBvcnRzLmFzc2VydE5vdERlZmluZWQgPSBhc3NlcnROb3REZWZpbmVkO1xuZXhwb3J0cy5hc3NlcnRfJF9DT05UUk9MTEVSID0gYXNzZXJ0XyRfQ09OVFJPTExFUjtcbmV4cG9ydHMuY2xlYW4gPSBjbGVhbjtcbmV4cG9ydHMuY3JlYXRlU3B5ID0gY3JlYXRlU3B5O1xuZXhwb3J0cy5tYWtlQXJyYXkgPSBtYWtlQXJyYXk7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMuZ2V0RnVuY3Rpb25OYW1lID0gZ2V0RnVuY3Rpb25OYW1lO1xuZXhwb3J0cy5zYW5pdGl6ZU1vZHVsZXMgPSBzYW5pdGl6ZU1vZHVsZXM7XG5leHBvcnRzLnRvQ2FtZWxDYXNlID0gdG9DYW1lbENhc2U7XG5leHBvcnRzLnRvU25ha2VDYXNlID0gdG9TbmFrZUNhc2U7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBQQVJTRV9CSU5ESU5HX1JFR0VYID0gZXhwb3J0cy5QQVJTRV9CSU5ESU5HX1JFR0VYID0gL14oW1xcPVxcQFxcJl0pKC4qKT8kLztcbnZhciBFWFBSRVNTSU9OX1JFR0VYID0gZXhwb3J0cy5FWFBSRVNTSU9OX1JFR0VYID0gL157ey4qfX0kLztcbi8qIFNob3VsZCByZXR1cm4gdHJ1ZSBcclxuICogZm9yIG9iamVjdHMgdGhhdCB3b3VsZG4ndCBmYWlsIGRvaW5nXHJcbiAqIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShteU9iaik7XHJcbiAqIHdoaWNoIHJldHVybnMgYSBuZXcgYXJyYXkgKHJlZmVyZW5jZS13aXNlKVxyXG4gKiBQcm9iYWJseSBuZWVkcyBtb3JlIHNwZWNzXHJcbiAqL1xuXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcbmZ1bmN0aW9uIGdldEJsb2NrTm9kZXMobm9kZXMpIHtcbiAgICAvLyBUT0RPKHBlcmYpOiB1cGRhdGUgYG5vZGVzYCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG9iamVjdD9cbiAgICB2YXIgbm9kZSA9IG5vZGVzWzBdO1xuICAgIHZhciBlbmROb2RlID0gbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV07XG4gICAgdmFyIGJsb2NrTm9kZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgbm9kZSAhPT0gZW5kTm9kZSAmJiAobm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpOyBpKyspIHtcbiAgICAgICAgaWYgKGJsb2NrTm9kZXMgfHwgbm9kZXNbaV0gIT09IG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghYmxvY2tOb2Rlcykge1xuICAgICAgICAgICAgICAgIGJsb2NrTm9kZXMgPSBhbmd1bGFyLmVsZW1lbnQoc2xpY2UuY2FsbChub2RlcywgMCwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tOb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsb2NrTm9kZXMgfHwgbm9kZXM7XG59XG5cbnZhciB1aWQgPSAwO1xudmFyIG5leHRVaWQgPSBmdW5jdGlvbiBuZXh0VWlkKCkge1xuICAgIHJldHVybiArK3VpZDtcbn07XG5cbmZ1bmN0aW9uIGhhc2hLZXkob2JqLCBuZXh0VWlkRm4pIHtcbiAgICB2YXIga2V5ID0gb2JqICYmIG9iai4kJGhhc2hLZXk7XG4gICAgaWYgKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHZhciBvYmpUeXBlID0gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob2JqKTtcbiAgICBpZiAob2JqVHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCBvYmpUeXBlID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICAgICAga2V5ID0gb2JqLiQkaGFzaEtleSA9IG9ialR5cGUgKyAnOicgKyAobmV4dFVpZEZuIHx8IG5leHRVaWQpKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAga2V5ID0gb2JqVHlwZSArICc6JyArIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwKCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG5mdW5jdGlvbiBzaGFsbG93Q29weShzcmMsIGRzdCkge1xuICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoc3JjKSkge1xuICAgICAgICBkc3QgPSBkc3QgfHwgW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gc3JjLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGRzdFtpXSA9IHNyY1tpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChzcmMpKSB7XG4gICAgICAgIGRzdCA9IGRzdCB8fCB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBpZiAoIShrZXkuY2hhckF0KDApID09PSAnJCcgJiYga2V5LmNoYXJBdCgxKSA9PT0gJyQnKSkge1xuICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZHN0IHx8IHNyYztcbn1cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKGl0ZW0pIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpdGVtKSB8fCAhIWl0ZW0gJiYgKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihpdGVtKSkgPT09IFwib2JqZWN0XCIgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eShcImxlbmd0aFwiKSAmJiB0eXBlb2YgaXRlbS5sZW5ndGggPT09IFwibnVtYmVyXCIgJiYgaXRlbS5sZW5ndGggPj0gMCB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiB0cmltKHZhbHVlKSB7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICByZXR1cm4gdmFsdWUudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBpc0V4cHJlc3Npb24odmFsdWUpIHtcbiAgICByZXR1cm4gRVhQUkVTU0lPTl9SRUdFWC50ZXN0KHRyaW0odmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gZXhwcmVzc2lvblNhbml0aXplcihleHByZXNzaW9uKSB7XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIHJldHVybiBleHByZXNzaW9uLnN1YnN0cmluZygyLCBleHByZXNzaW9uLmxlbmd0aCAtIDIpO1xufVxuXG5mdW5jdGlvbiBhc3NlcnROb3REZWZpbmVkKG9iaiwgYXJncykge1xuXG4gICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICB3aGlsZSAoa2V5ID0gYXJncy5zaGlmdCgpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICd1bmRlZmluZWQnIHx8IG9ialtrZXldID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBbJ1wiJywga2V5LCAnXCIgcHJvcGVydHkgY2Fubm90IGJlIG51bGwnXS5qb2luKFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRfJF9DT05UUk9MTEVSKG9iaikge1xuICAgIGFzc2VydE5vdERlZmluZWQob2JqLCBbJ3BhcmVudFNjb3BlJywgJ2JpbmRpbmdzJywgJ2NvbnRyb2xsZXJTY29wZSddKTtcbn1cblxuZnVuY3Rpb24gY2xlYW4ob2JqZWN0KSB7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSBvYmplY3QubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KG9iamVjdCwgW2luZGV4LCAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4ob2JqZWN0W2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNweShjYWxsYmFjaykge1xuICAgIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHZhciBlbmRUaW1lID0gdm9pZCAwO1xuICAgIHZhciB0b1JldHVybiA9IHNweU9uKHtcbiAgICAgICAgYTogZnVuY3Rpb24gYSgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBfYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgIH0sICdhJykuYW5kLmNhbGxUaHJvdWdoKCk7XG4gICAgdG9SZXR1cm4udG9vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgfTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG59XG5cbmZ1bmN0aW9uIG1ha2VBcnJheShpdGVtKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiBtYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIFtpdGVtXTtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciByZW1vdmUkID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiAkJGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChyZW1vdmUkIHx8ICFrZXkuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFkZXN0aW5hdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcbiAgICB2YXIgZGVzdGluYXRpb24gPSB2YWx1ZXMuc2hpZnQoKSB8fCB7fTtcbiAgICB2YXIgY3VycmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAoY3VycmVudCA9IHZhbHVlcy5zaGlmdCgpKSB7XG4gICAgICAgICQkZXh0ZW5kKGRlc3RpbmF0aW9uLCBjdXJyZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxudmFyIHJvb3RTY29wZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRyb290U2NvcGUnKTtcblxuZnVuY3Rpb24gZ2V0Um9vdEZyb21TY29wZShzY29wZSkge1xuICAgIGlmIChzY29wZS4kcm9vdCkge1xuICAgICAgICByZXR1cm4gc2NvcGUuJHJvb3Q7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHZvaWQgMDtcbiAgICB3aGlsZSAocGFyZW50ID0gc2NvcGUuJHBhcmVudCkge1xuICAgICAgICBpZiAocGFyZW50LiRyb290KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50LiRyb290O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbnZhciBzY29wZUhlbHBlciA9IGV4cG9ydHMuc2NvcGVIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gc2NvcGVIZWxwZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBzY29wZUhlbHBlcik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKHNjb3BlSGVscGVyLCBudWxsLCBbe1xuICAgICAgICBrZXk6ICdkZWNvcmF0ZVNjb3BlQ291bnRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvcmF0ZVNjb3BlQ291bnRlcihzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuJCRkaWdlc3RDb3VudCA9IDA7XG4gICAgICAgICAgICBzY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiQkZGlnZXN0Q291bnQrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlIHx8IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNTY29wZShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGVIZWxwZXIuZGVjb3JhdGVTY29wZUNvdW50ZXIoc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5LnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQocm9vdFNjb3BlLiRuZXcodHJ1ZSksIHNjb3BlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2Uoc2NvcGUpKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUgPSBtYWtlQXJyYXkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZUhlbHBlci5kZWNvcmF0ZVNjb3BlQ291bnRlcihleHRlbmQuYXBwbHkodW5kZWZpbmVkLCBbcm9vdFNjb3BlLiRuZXcodHJ1ZSldLmNvbmNhdChzY29wZSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaXNTY29wZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc1Njb3BlKG9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCAmJiBnZXRSb290RnJvbVNjb3BlKG9iamVjdCkgPT09IGdldFJvb3RGcm9tU2NvcGUocm9vdFNjb3BlKSAmJiBvYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gc2NvcGVIZWxwZXI7XG59KCk7XG5cbnNjb3BlSGVscGVyLiRyb290U2NvcGUgPSByb290U2NvcGU7XG5cbmZ1bmN0aW9uIGdldEZ1bmN0aW9uTmFtZShteUZ1bmN0aW9uKSB7XG4gICAgdmFyIHRvUmV0dXJuID0gL15mdW5jdGlvblxccysoW1xcd1xcJF0rKVxccypcXCgvLmV4ZWMobXlGdW5jdGlvbi50b1N0cmluZygpKVsxXTtcbiAgICBpZiAodG9SZXR1cm4gPT09ICcnIHx8IHRvUmV0dXJuID09PSAnYW5vbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiB0b1JldHVybjtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVzKCkge1xuXG4gICAgdmFyIG1vZHVsZXMgPSBtYWtlQXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgIHZhciBpbmRleCA9IHZvaWQgMDtcbiAgICBpZiAoKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCduZycpKSA9PT0gLTEgJiYgKGluZGV4ID0gbW9kdWxlcy5pbmRleE9mKCdhbmd1bGFyJykpID09PSAtMSkge1xuICAgICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nJyk7XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbW9kdWxlcy51bnNoaWZ0KG1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVswXSAmJiAnbmcnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZHVsZXM7XG59XG52YXIgU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvKFtcXDpcXC1cXF9dKyguKSkvZztcbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKFNQRUNJQUxfQ0hBUlNfUkVHRVhQLCBmdW5jdGlvbiAoXywgc2VwYXJhdG9yLCBsZXR0ZXIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gb2Zmc2V0ID8gbGV0dGVyLnRvVXBwZXJDYXNlKCkgOiBsZXR0ZXI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b1NuYWtlQ2FzZSh2YWx1ZSwga2V5KSB7XG4gICAga2V5ID0ga2V5IHx8ICctJztcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgcmV0dXJuIGtleSArICQxLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvY29tbW9uLmpzJyk7XG5cbnZhciBfY29udHJvbGxlckhhbmRsZXJFeHRlbnNpb25zID0gcmVxdWlyZSgnLi9jb250cm9sbGVySGFuZGxlci5leHRlbnNpb25zLmpzJyk7XG5cbnZhciBjb250cm9sbGVySGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW50ZXJuYWwgPSBmYWxzZTtcbiAgICB2YXIgbXlNb2R1bGVzID0gdm9pZCAwLFxuICAgICAgICBjdHJsTmFtZSA9IHZvaWQgMCxcbiAgICAgICAgY0xvY2FscyA9IHZvaWQgMCxcbiAgICAgICAgcFNjb3BlID0gdm9pZCAwLFxuICAgICAgICBjU2NvcGUgPSB2b2lkIDAsXG4gICAgICAgIGNOYW1lID0gdm9pZCAwLFxuICAgICAgICBiaW5kVG9Db250cm9sbGVyID0gdm9pZCAwO1xuXG4gICAgZnVuY3Rpb24gY2xlYW4oKSB7XG4gICAgICAgIG15TW9kdWxlcyA9IFtdO1xuICAgICAgICBjdHJsTmFtZSA9IHBTY29wZSA9IGNMb2NhbHMgPSBjU2NvcGUgPSBiaW5kVG9Db250cm9sbGVyID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICRjb250cm9sbGVySGFuZGxlcigpIHtcblxuICAgICAgICBpZiAoIWN0cmxOYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyAnUGxlYXNlIHByb3ZpZGUgdGhlIGNvbnRyb2xsZXJcXCdzIG5hbWUnO1xuICAgICAgICB9XG4gICAgICAgIHBTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuY3JlYXRlKHBTY29wZSB8fCB7fSk7XG4gICAgICAgIGlmICghY1Njb3BlKSB7XG4gICAgICAgICAgICBjU2NvcGUgPSBwU2NvcGUuJG5ldygpO1xuICAgICAgICB9e1xuICAgICAgICAgICAgdmFyIHRlbXBTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuaXNTY29wZShjU2NvcGUpO1xuICAgICAgICAgICAgaWYgKHRlbXBTY29wZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjU2NvcGUgPSB0ZW1wU2NvcGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG9SZXR1cm4gPSBuZXcgX2NvbnRyb2xsZXJIYW5kbGVyRXh0ZW5zaW9ucy4kX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZFRvQ29udHJvbGxlciwgbXlNb2R1bGVzLCBjTmFtZSwgY0xvY2Fscyk7XG4gICAgICAgIGNsZWFuKCk7XG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9XG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmJpbmRXaXRoID0gZnVuY3Rpb24gKGJpbmRpbmdzKSB7XG4gICAgICAgIGJpbmRUb0NvbnRyb2xsZXIgPSBiaW5kaW5ncztcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5jb250cm9sbGVyVHlwZSA9IF9jb250cm9sbGVySGFuZGxlckV4dGVuc2lvbnMuJF9DT05UUk9MTEVSO1xuICAgICRjb250cm9sbGVySGFuZGxlci5jbGVhbiA9IGNsZWFuO1xuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRTY29wZSA9IGZ1bmN0aW9uIChuZXdTY29wZSkge1xuICAgICAgICBwU2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5zZXRMb2NhbHMgPSBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgICAgIGNMb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgIHJldHVybiAkY29udHJvbGxlckhhbmRsZXI7XG4gICAgfTtcblxuICAgICRjb250cm9sbGVySGFuZGxlci4kcm9vdFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci4kcm9vdFNjb3BlO1xuXG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLmFkZE1vZHVsZXMgPSBmdW5jdGlvbiAobW9kdWxlcykge1xuICAgICAgICBmdW5jdGlvbiBwdXNoQXJyYXkoYXJyYXkpIHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG15TW9kdWxlcywgYXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG1vZHVsZXMpKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBwdXNoQXJyYXkoKDAsIF9jb21tb24ubWFrZUFycmF5KShhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHVzaEFycmF5KFttb2R1bGVzXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKDAsIF9jb21tb24uaXNBcnJheUxpa2UpKG1vZHVsZXMpKSB7XG4gICAgICAgICAgICBwdXNoQXJyYXkoKDAsIF9jb21tb24ubWFrZUFycmF5KShtb2R1bGVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcjtcbiAgICB9O1xuICAgICRjb250cm9sbGVySGFuZGxlci5pc0ludGVybmFsID0gZnVuY3Rpb24gKGZsYWcpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZmxhZykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlcm5hbDtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcm5hbCA9ICEhZmxhZztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGludGVybmFsID0gIWZsYWc7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAkY29udHJvbGxlckhhbmRsZXIubmV3ID0gZnVuY3Rpb24gKGNvbnRyb2xsZXJOYW1lLCBzY29wZUNvbnRyb2xsZXJzTmFtZSwgcGFyZW50U2NvcGUsIGNoaWxkU2NvcGUpIHtcbiAgICAgICAgY3RybE5hbWUgPSBjb250cm9sbGVyTmFtZTtcbiAgICAgICAgaWYgKHNjb3BlQ29udHJvbGxlcnNOYW1lICYmICFhbmd1bGFyLmlzU3RyaW5nKHNjb3BlQ29udHJvbGxlcnNOYW1lKSkge1xuICAgICAgICAgICAgcFNjb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci5pc1Njb3BlKHNjb3BlQ29udHJvbGxlcnNOYW1lKTtcbiAgICAgICAgICAgIGNTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuaXNTY29wZShwYXJlbnRTY29wZSkgfHwgY1Njb3BlO1xuICAgICAgICAgICAgY05hbWUgPSAnY29udHJvbGxlcic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwU2NvcGUgPSBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShwYXJlbnRTY29wZSB8fCBwU2NvcGUpO1xuICAgICAgICAgICAgY1Njb3BlID0gX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUoY2hpbGRTY29wZSB8fCBwU2NvcGUuJG5ldygpKTtcbiAgICAgICAgICAgIGNOYW1lID0gc2NvcGVDb250cm9sbGVyc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICRjb250cm9sbGVySGFuZGxlcigpO1xuICAgIH07XG4gICAgJGNvbnRyb2xsZXJIYW5kbGVyLm5ld1NlcnZpY2UgPSBmdW5jdGlvbiAoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUsIGJpbmRpbmdzKSB7XG4gICAgICAgIHZhciB0b1JldHVybiA9ICRjb250cm9sbGVySGFuZGxlci5uZXcoY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJBcywgcGFyZW50U2NvcGUpO1xuICAgICAgICB0b1JldHVybi5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfTtcbiAgICByZXR1cm4gJGNvbnRyb2xsZXJIYW5kbGVyO1xufSgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gY29udHJvbGxlckhhbmRsZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXJIYW5kbGVyL2NvbnRyb2xsZXJIYW5kbGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLiRfQ09OVFJPTExFUiA9IHVuZGVmaW5lZDtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9kaXJlY3RpdmVQcm92aWRlciA9IHJlcXVpcmUoJy4vLi4vZGlyZWN0aXZlcy9kaXJlY3RpdmVQcm92aWRlci5qcycpO1xuXG52YXIgX2RpcmVjdGl2ZVByb3ZpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RpcmVjdGl2ZVByb3ZpZGVyKTtcblxudmFyIF9kaXJlY3RpdmVIYW5kbGVyID0gcmVxdWlyZSgnLi8uLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZUhhbmRsZXIuanMnKTtcblxudmFyIF9jb250cm9sbGVyUU0gPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzJyk7XG5cbnZhciBfY29udHJvbGxlclFNMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbnRyb2xsZXJRTSk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgJF9DT05UUk9MTEVSID0gZXhwb3J0cy4kX0NPTlRST0xMRVIgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2NyZWF0ZUNsYXNzKCRfQ09OVFJPTExFUiwgbnVsbCwgW3tcbiAgICAgICAga2V5OiAnaXNDb250cm9sbGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQ29udHJvbGxlcihvYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiAkX0NPTlRST0xMRVI7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBmdW5jdGlvbiAkX0NPTlRST0xMRVIoY3RybE5hbWUsIHBTY29wZSwgYmluZGluZ3MsIG1vZHVsZXMsIGNOYW1lLCBjTG9jYWxzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCAkX0NPTlRST0xMRVIpO1xuXG4gICAgICAgIHRoaXMucHJvdmlkZXJOYW1lID0gY3RybE5hbWU7XG4gICAgICAgIHRoaXMuc2NvcGVDb250cm9sbGVyTmFtZSA9IGNOYW1lIHx8ICdjb250cm9sbGVyJztcbiAgICAgICAgdGhpcy51c2VkTW9kdWxlcyA9IG1vZHVsZXMuc2xpY2UoKTtcbiAgICAgICAgdGhpcy5wYXJlbnRTY29wZSA9IHBTY29wZTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyU2NvcGUgPSB0aGlzLnBhcmVudFNjb3BlLiRuZXcoKTtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgICB0aGlzLmxvY2FscyA9ICgwLCBfY29tbW9uLmV4dGVuZCkoY0xvY2FscyB8fCB7fSwge1xuICAgICAgICAgICAgJHNjb3BlOiB0aGlzLmNvbnRyb2xsZXJTY29wZVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzID0gW107XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuJHJvb3RTY29wZTtcbiAgICAgICAgdGhpcy5JbnRlcm5hbFNwaWVzID0ge1xuICAgICAgICAgICAgU2NvcGU6IHt9LFxuICAgICAgICAgICAgQ29udHJvbGxlcjoge31cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoJF9DT05UUk9MTEVSLCBbe1xuICAgICAgICBrZXk6ICckYXBwbHknLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gJGFwcGx5KCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICckZGVzdHJveScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAkZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLiRyb290U2NvcGU7XG4gICAgICAgICAgICB0aGlzLnBhcmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICAoMCwgX2NvbW1vbi5jbGVhbikodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NyZWF0ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGUoYmluZGluZ3MpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMuYmluZGluZ3MgPSBhbmd1bGFyLmlzRGVmaW5lZChiaW5kaW5ncykgJiYgYmluZGluZ3MgIT09IG51bGwgPyBiaW5kaW5ncyA6IHRoaXMuYmluZGluZ3M7XG4gICAgICAgICAgICAoMCwgX2NvbW1vbi5hc3NlcnRfJF9DT05UUk9MTEVSKSh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IgPSBfY29udHJvbGxlclFNMi5kZWZhdWx0LiRnZXQodGhpcy51c2VkTW9kdWxlcykuY3JlYXRlKHRoaXMucHJvdmlkZXJOYW1lLCB0aGlzLnBhcmVudFNjb3BlLCB0aGlzLmJpbmRpbmdzLCB0aGlzLnNjb3BlQ29udHJvbGxlck5hbWUsIHRoaXMubG9jYWxzKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlID0gdGhpcy5jb250cm9sbGVyQ29uc3RydWN0b3IoKTtcblxuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB3aGlsZSAod2F0Y2hlciA9IHRoaXMucGVuZGluZ1dhdGNoZXJzLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoLmFwcGx5KHRoaXMsIHdhdGNoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBfY29tbW9uLlBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyh0aGlzLmJpbmRpbmdzW2tleV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVLZXkgPSByZXN1bHRbMl0gfHwga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3B5S2V5ID0gW3Njb3BlS2V5LCAnOicsIGtleV0uam9pbignJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMV0gPT09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXN0cm95ZXIgPSBfdGhpcy53YXRjaChrZXksIF90aGlzLkludGVybmFsU3BpZXMuU2NvcGVbc3B5S2V5XSA9ICgwLCBfY29tbW9uLmNyZWF0ZVNweSkoKSwgc2VsZi5jb250cm9sbGVySW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXN0cm95ZXIyID0gX3RoaXMud2F0Y2goc2NvcGVLZXksIF90aGlzLkludGVybmFsU3BpZXMuQ29udHJvbGxlcltzcHlLZXldID0gKDAsIF9jb21tb24uY3JlYXRlU3B5KSgpLCBzZWxmLnBhcmVudFNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5wYXJlbnRTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveWVyMigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICd3YXRjaCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB3YXRjaChleHByZXNzaW9uLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1dhdGNoZXJzLnB1c2goYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJTY29wZS4kd2F0Y2goZXhwcmVzc2lvbiwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICduZ0NsaWNrJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG5nQ2xpY2soZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRGlyZWN0aXZlKCduZy1jbGljaycsIGV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjcmVhdGVEaXJlY3RpdmUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlRGlyZWN0aXZlKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSAoMCwgX2NvbW1vbi5tYWtlQXJyYXkpKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gX2RpcmVjdGl2ZVByb3ZpZGVyMi5kZWZhdWx0LiRnZXQoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICAgIGFyZ3NbMF0gPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb21waWxlLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBpbGVIVE1MJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBpbGVIVE1MKGh0bWxUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IF9kaXJlY3RpdmVIYW5kbGVyLmRpcmVjdGl2ZUhhbmRsZXIodGhpcywgaHRtbFRleHQpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuICRfQ09OVFJPTExFUjtcbn0oKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvY29udHJvbGxlckhhbmRsZXIvY29udHJvbGxlckhhbmRsZXIuZXh0ZW5zaW9ucy5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX25nTW9kZWwgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ01vZGVsLmpzJyk7XG5cbnZhciBfbmdDbGljayA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanMnKTtcblxudmFyIF9uZ0lmID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qcycpO1xuXG52YXIgX25nVHJhbnNsYXRlID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdUcmFuc2xhdGUuanMnKTtcblxudmFyIF9uZ0JpbmQgPSByZXF1aXJlKCcuL2ludGVybmFsRGlyZWN0aXZlcy9uZ0JpbmQuanMnKTtcblxudmFyIF9uZ0NsYXNzID0gcmVxdWlyZSgnLi9pbnRlcm5hbERpcmVjdGl2ZXMvbmdDbGFzcy5qcycpO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxudmFyIF9uZ1JlcGVhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWxEaXJlY3RpdmVzL25nUmVwZWF0LmpzJyk7XG5cbnZhciBkaXJlY3RpdmVQcm92aWRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRyYW5zbGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZycsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pLmdldCgnJHRyYW5zbGF0ZScpO1xuICAgIHZhciBkaXJlY3RpdmVzID0gbmV3IE1hcCgpLFxuICAgICAgICB0b1JldHVybiA9IHt9LFxuICAgICAgICAkcGFyc2UgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnXSkuZ2V0KCckcGFyc2UnKSxcbiAgICAgICAgaW50ZXJuYWxzID0ge1xuICAgICAgICBuZ0lmOiAoMCwgX25nSWYubmdJZkRpcmVjdGl2ZSkoKSxcbiAgICAgICAgbmdDbGljazogKDAsIF9uZ0NsaWNrLm5nQ2xpY2tEaXJlY3RpdmUpKCRwYXJzZSksXG4gICAgICAgIG5nTW9kZWw6ICgwLCBfbmdNb2RlbC5uZ01vZGVsRGlyZWN0aXZlKSgkcGFyc2UpLFxuICAgICAgICBuZ0Rpc2FibGVkOiAoMCwgX25nSWYubmdJZkRpcmVjdGl2ZSkoKSxcbiAgICAgICAgdHJhbnNsYXRlOiAoMCwgX25nVHJhbnNsYXRlLm5nVHJhbnNsYXRlRGlyZWN0aXZlKSgkdHJhbnNsYXRlLCAkcGFyc2UpLFxuICAgICAgICBuZ0JpbmQ6ICgwLCBfbmdCaW5kLm5nQmluZERpcmVjdGl2ZSkoKSxcbiAgICAgICAgbmdDbGFzczogKDAsIF9uZ0NsYXNzLm5nQ2xhc3NEaXJlY3RpdmUpKCRwYXJzZSksXG4gICAgICAgIG5nUmVwZWF0OiAoMCwgX25nUmVwZWF0Lm5nUmVwZWF0RGlyZWN0aXZlKSgpLFxuICAgICAgICB0cmFuc2xhdGVWYWx1ZToge31cbiAgICB9O1xuICAgIGludGVybmFscy5uZ1RyYW5zbGF0ZSA9IGludGVybmFscy50cmFuc2xhdGU7XG5cbiAgICB0b1JldHVybi4kZ2V0ID0gZnVuY3Rpb24gKGRpcmVjdGl2ZU5hbWUpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZU5hbWUgPSAoMCwgX2NvbW1vbi50b0NhbWVsQ2FzZSkoZGlyZWN0aXZlTmFtZSk7XG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzW2RpcmVjdGl2ZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVybmFsc1tkaXJlY3RpdmVOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlcy5nZXQoZGlyZWN0aXZlTmFtZSk7XG4gICAgfTtcbiAgICB0b1JldHVybi4kcHV0ID0gZnVuY3Rpb24gKGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSB7XG4gICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZUNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgdGhyb3cgJ2RpcmVjdGl2ZUNvbnN0cnVjdG9yIGlzIG5vdCBhIGZ1bmN0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlTmFtZSA9ICgwLCBfY29tbW9uLnRvQ2FtZWxDYXNlKShkaXJlY3RpdmVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5oYXMoZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihhcmd1bWVudHNbMl0pICYmIGFyZ3VtZW50c1syXSgpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coWydkaXJlY3RpdmUnLCBkaXJlY3RpdmVOYW1lLCAnaGFzIGJlZW4gb3ZlcndyaXR0ZW4nXS5qb2luKCcgJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdDYW5ub3Qgb3ZlcndyaXRlICcgKyBkaXJlY3RpdmVOYW1lICsgJy5cXG5Gb3JnZXRpbmcgdG8gY2xlYW4gbXVjaCc7XG4gICAgICAgIH1cbiAgICAgICAgZGlyZWN0aXZlcy5zZXQoZGlyZWN0aXZlTmFtZSwgZGlyZWN0aXZlQ29uc3RydWN0b3IoKSk7XG4gICAgfTtcbiAgICB0b1JldHVybi4kY2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRpcmVjdGl2ZXMuY2xlYXIoKTtcbiAgICB9O1xuICAgIHRvUmV0dXJuLnVzZU1vZHVsZSA9IGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XG4gICAgICAgICR0cmFuc2xhdGUgPSBhbmd1bGFyLmluamVjdG9yKFsnbmcnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZSddLmNvbmNhdChtb2R1bGVOYW1lKSkuZ2V0KCckdHJhbnNsYXRlJyk7XG4gICAgICAgIGludGVybmFscy50cmFuc2xhdGUuY2hhbmdlU2VydmljZSgkdHJhbnNsYXRlKTtcbiAgICB9O1xuICAgIHJldHVybiB0b1JldHVybjtcbn0oKTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRpcmVjdGl2ZVByb3ZpZGVyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2RpcmVjdGl2ZVByb3ZpZGVyLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nTW9kZWxEaXJlY3RpdmUgPSBuZ01vZGVsRGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdNb2RlbERpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0b3JzID0gW107XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBnZXR0ZXIgPSAkcGFyc2UoZXhwcmVzc2lvbik7XG5cbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKHBhcmFtZXRlcikge1xuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNTdHJpbmcocGFyYW1ldGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhcmd1bWVudHNbMV0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKHBhcmFtZXRlci5zcGxpdCgnJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdldHRlci5hc3NpZ24oY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLCBwYXJhbWV0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtZXRlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCgwLCBfY29tbW9uLmlzQXJyYXlMaWtlKShwYXJhbWV0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZW1vcnkgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgKDAsIF9jb21tb24ubWFrZUFycmF5KShwYXJhbWV0ZXIpLmZvckVhY2goZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuKG1lbW9yeSArPSBjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgWydEb250IGtub3cgd2hhdCB0byBkbyB3aXRoICcsICdbXCInLCAoMCwgX2NvbW1vbi5tYWtlQXJyYXkpKGFyZ3VtZW50cykuam9pbignXCIsIFwiJyksICdcIl0nXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9LFxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IGZ1bmN0aW9uIGF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgZWxlbSkge1xuICAgICAgICAgICAgdmFyIG1vZGVsID0gZWxlbS5kYXRhKCduZy1tb2RlbCcpO1xuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcyhmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1tb2RlbCdcbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ01vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLm5nQ2xpY2tEaXJlY3RpdmUgPSBuZ0NsaWNrRGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYnVpbHQvY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gcmVjdXJzZU9iamVjdHMob2JqZWN0KSB7XG4gICAgdmFyIHRvUmV0dXJuID0gKDAsIF9jb21tb24ubWFrZUFycmF5KShvYmplY3QpO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBvYmplY3QuY2hpbGRyZW4oKS5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi5jb25jYXQocmVjdXJzZU9iamVjdHMoYW5ndWxhci5lbGVtZW50KG9iamVjdC5jaGlsZHJlbigpW2lpXSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xufVxuZnVuY3Rpb24gbmdDbGlja0RpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiAvbmctY2xpY2s9XCIoLiopXCIvLFxuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhleHByZXNzaW9uKSkge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAkcGFyc2UoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjbGljayA9IGZ1bmN0aW9uIGNsaWNrKHNjb3BlLCBsb2NhbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2FyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzID0gc2NvcGUgfHwge307XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUgfHwgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbHMgPSBsb2NhbHMgfHwge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBleHByZXNzaW9uKHNjb3BlLCBsb2NhbHMpO1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGNsaWNrO1xuICAgICAgICB9LFxuICAgICAgICBhdHRhY2hUb0VsZW1lbnQ6IGZ1bmN0aW9uIGF0dGFjaFRvRWxlbWVudChjb250cm9sbGVyU2VydmljZSwgJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjbGlja0RhdGEgPSAkZWxlbWVudC5kYXRhKCduZy1jbGljaycpO1xuICAgICAgICAgICAgdmFyIG15QXJyYXkgPSByZWN1cnNlT2JqZWN0cygkZWxlbWVudCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbXlBcnJheS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQobXlBcnJheVtpbmRleF0pLmRhdGEoJ25nLWNsaWNrJywgY2xpY2tEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogJ25nLWNsaWNrJ1xuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQ2xpY2suanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdJZkRpcmVjdGl2ZSA9IG5nSWZEaXJlY3RpdmU7XG5mdW5jdGlvbiBuZ0lmRGlyZWN0aXZlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiAvbmctaWY9XCIoLiopXCIvLFxuICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlKGNvbnRyb2xsZXJTZXJ2aWNlLCBleHByZXNzaW9uKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFZhbHVlID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdG9ycyA9IFtdO1xuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChleHByZXNzaW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBzdWJzY3JpcHRvcnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9yc1tpaV0uYXBwbHkoc3Vic2NyaXB0b3JzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub3NvcCkoKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChzdWJzY3JpcHRvcnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB3YXRjaGVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0b1JldHVybi52YWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiBmdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsICRlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgbGFzdFZhbHVlID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIHBhcmVudCA9ICRlbGVtZW50LnBhcmVudCgpLFxuICAgICAgICAgICAgICAgIGNvbXBpbGVkRGlyZWN0aXZlID0gJGVsZW1lbnQuZGF0YSgnbmctaWYnKTtcbiAgICAgICAgICAgIGNvbXBpbGVkRGlyZWN0aXZlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gQXJyYXkucHJvdG90eXBlLnNwbGljZS5jYWxsKCRlbGVtZW50LCAwLCAkZWxlbWVudC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gJGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxhc3RWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSgkZWxlbWVudCwgbGFzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZChsYXN0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnQgPSBjb21waWxlZERpcmVjdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiAnbmctaWYnXG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdJZi5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ1RyYW5zbGF0ZURpcmVjdGl2ZSA9IG5nVHJhbnNsYXRlRGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdUcmFuc2xhdGVEaXJlY3RpdmUoJHRyYW5zbGF0ZSwgJHBhcnNlKSB7XG4gICAgdmFyIHRyYW5zbGF0ZVNlcnZpY2UgPSAkdHJhbnNsYXRlO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICBrZXkgPSBleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycyA9IFtdO1xuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSB2b2lkIDA7XG4gICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jb250cm9sbGVyU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24od2F0Y2hlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdhdGNoZXIgPSB0b1JldHVybiA9IHN1YnNjcmlwdG9ycyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCgwLCBfY29tbW9uLmlzRXhwcmVzc2lvbikoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gKDAsIF9jb21tb24uZXhwcmVzc2lvblNhbml0aXplcikoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAga2V5ID0gJHBhcnNlKGV4cHJlc3Npb24pKGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZSk7XG4gICAgICAgICAgICAgICAgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJhbnNsYXRlU2VydmljZS5pbnN0YW50KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBmdW5jdGlvbiB0b1JldHVybigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uIChuZXdMYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVNlcnZpY2UudXNlKG5ld0xhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcFdhdGNoZXIgPSBjb250cm9sbGVyU2VydmljZS53YXRjaChmdW5jdGlvbiAoKSB7fSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wV2F0Y2hlcigpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiB0cmFuc2xhdGUodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudCh0ZXh0KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlTGFuZ3VhZ2U6IGZ1bmN0aW9uIGNoYW5nZUxhbmd1YWdlKG5ld0xhbmd1YWdlKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGVTZXJ2aWNlLnVzZShuZXdMYW5ndWFnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZVNlcnZpY2U6IGZ1bmN0aW9uIGNoYW5nZVNlcnZpY2UobmV3U2VydmljZSkge1xuICAgICAgICAgICAgdHJhbnNsYXRlU2VydmljZSA9IG5ld1NlcnZpY2U7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSBlbGVtLmRhdGEoJ25nLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcyhmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy10cmFuc2xhdGUnXG5cbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ1RyYW5zbGF0ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdCaW5kRGlyZWN0aXZlID0gbmdCaW5kRGlyZWN0aXZlO1xuZnVuY3Rpb24gbmdCaW5kRGlyZWN0aXZlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmIChjb250cm9sbGVyU2VydmljZS5jcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyU2VydmljZS5jcmVhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsYXN0VmFsdWUgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGV4cHJlc3Npb24sIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAoc3Vic2NyaXB0b3JzLnNoaWZ0KCkgfHwgYW5ndWxhci5ub29wKSgpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSxcbiAgICAgICAgYXR0YWNoVG9FbGVtZW50OiBmdW5jdGlvbiBhdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGVsZW0pIHtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IGVsZW0uZGF0YSgnbmctYmluZCcpO1xuICAgICAgICAgICAgZWxlbS50ZXh0KG1vZGVsKCkpO1xuICAgICAgICAgICAgbW9kZWwuY2hhbmdlcyhmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtLnRleHQobmV3VmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1iaW5kJ1xuICAgIH07XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2RpcmVjdGl2ZXMvaW50ZXJuYWxEaXJlY3RpdmVzL25nQmluZC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMubmdDbGFzc0RpcmVjdGl2ZSA9IG5nQ2xhc3NEaXJlY3RpdmU7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi8uLi8uLi9jb250cm9sbGVyL2NvbW1vbi5qcycpO1xuXG5mdW5jdGlvbiBuZ0NsYXNzRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdG9ycyA9IFtdO1xuICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgdmFyIGdldHRlciA9ICRwYXJzZSgoMCwgX2NvbW1vbi50cmltKShleHByZXNzaW9uKSk7XG4gICAgICAgICAgICB2YXIgd2F0Y2hlciA9IGNvbnRyb2xsZXJTZXJ2aWNlLndhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBnZXR0ZXIoY29udHJvbGxlclNlcnZpY2UuY29udHJvbGxlclNjb3BlKTtcbiAgICAgICAgICAgICAgICB2YXIgZmlyZUNoYW5nZSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB2YXIgdG9Ob3RpZnkgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSBuZXdWYWx1ZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNBcnJheShuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG5ld1ZhbHVlW2tleV0gIT09IGxhc3RWYWx1ZVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b05vdGlmeVtrZXldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXc6ICEhbmV3VmFsdWVba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcmVDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9rZXkgaW4gbGFzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdG9Ob3RpZnkuaGFzT3duUHJvcGVydHkoX2tleSkgJiYgbGFzdFZhbHVlLmhhc093blByb3BlcnR5KF9rZXkpICYmIG5ld1ZhbHVlW19rZXldICE9PSBsYXN0VmFsdWVbX2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvTm90aWZ5W19rZXldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZDogISFsYXN0VmFsdWVbX2tleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3OiAhIW5ld1ZhbHVlW19rZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZUNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZpcmVDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbihuZXdWYWx1ZSwgdG9Ob3RpZnkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQoKSB8fCBhbmd1bGFyLm5vb3ApKCk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoc3Vic2NyaXB0b3JzLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB0b1JldHVybiA9IGZ1bmN0aW9uIHRvUmV0dXJuKCkge1xuICAgICAgICAgICAgICAgIGlmICghbGFzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobGFzdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NlcyA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGxhc3RWYWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VmFsdWVba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9SZXR1cm4uY2hhbmdlcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN1YnNjcmlwdG9ycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyAnQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUmV0dXJuLmhhc0NsYXNzID0gZnVuY3Rpb24gKHRvQ2hlY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhsYXN0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0VmFsdWUuaW5kZXhPZigoMCwgX2NvbW1vbi50cmltKSh0b0NoZWNrKSkgIT09IC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIWxhc3RWYWx1ZVt0b0NoZWNrXTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6ICduZy1jbGFzcycsXG4gICAgICAgIGF0dGFjaFRvRWxlbWVudDogZnVuY3Rpb24gYXR0YWNoVG9FbGVtZW50KGNvbnRyb2xsZXJTZXJ2aWNlLCBlbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnbmctY2xhc3MnKS5jaGFuZ2VzKGZ1bmN0aW9uIChsYXN0VmFsdWUsIG5ld0NoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3Q2hhbmdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Q2hhbmdlc1trZXldLm5ldyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3Moa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9idWlsdC9kaXJlY3RpdmVzL2ludGVybmFsRGlyZWN0aXZlcy9uZ0NsYXNzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5uZ1JlcGVhdERpcmVjdGl2ZSA9IG5nUmVwZWF0RGlyZWN0aXZlO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vLi4vLi4vY29udHJvbGxlci9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gbmdSZXBlYXREaXJlY3RpdmUoJHBhcnNlLCAkYW5pbWF0ZSkge1xuICAgIHZhciBOR19SRU1PVkVEID0gJyQkTkdfUkVNT1ZFRCc7XG4gICAgdmFyIHVwZGF0ZVNjb3BlID0gZnVuY3Rpb24gdXBkYXRlU2NvcGUoc2NvcGUsIGluZGV4LCB2YWx1ZUlkZW50aWZpZXIsIHZhbHVlLCBrZXlJZGVudGlmaWVyLCBrZXksIGFycmF5TGVuZ3RoKSB7XG4gICAgICAgIC8vIFRPRE8ocGVyZik6IGdlbmVyYXRlIHNldHRlcnMgdG8gc2hhdmUgb2ZmIH40MG1zIG9yIDEtMS41JVxuICAgICAgICBzY29wZVt2YWx1ZUlkZW50aWZpZXJdID0gdmFsdWU7XG4gICAgICAgIGlmIChrZXlJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBzY29wZVtrZXlJZGVudGlmaWVyXSA9IGtleTtcbiAgICAgICAgfVxuICAgICAgICBzY29wZS4kaW5kZXggPSBpbmRleDtcbiAgICAgICAgc2NvcGUuJGZpcnN0ID0gaW5kZXggPT09IDA7XG4gICAgICAgIHNjb3BlLiRsYXN0ID0gaW5kZXggPT09IGFycmF5TGVuZ3RoIC0gMTtcbiAgICAgICAgc2NvcGUuJG1pZGRsZSA9ICEoc2NvcGUuJGZpcnN0IHx8IHNjb3BlLiRsYXN0KTtcbiAgICAgICAgLy8ganNoaW50IGJpdHdpc2U6IGZhbHNlXG4gICAgICAgIHNjb3BlLiRvZGQgPSAhKHNjb3BlLiRldmVuID0gKGluZGV4ICYgMSkgPT09IDApO1xuICAgICAgICAvLyBqc2hpbnQgYml0d2lzZTogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBjb25zdCBnZXRCbG9ja1N0YXJ0ID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICAvLyAgICAgcmV0dXJuIGJsb2NrLmNsb25lWzBdO1xuICAgIC8vIH07XG5cbiAgICAvLyBjb25zdCBnZXRCbG9ja0VuZCA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgLy8gICAgIHJldHVybiBibG9jay5jbG9uZVtibG9jay5jbG9uZS5sZW5ndGggLSAxXTtcbiAgICAvLyB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6ICduZ1JlcGVhdCcsXG4gICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbXBpbGUoY29udHJvbGxlclNlcnZpY2UsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciBzdWJzY3JpcHRvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oY29udHJvbGxlclNlcnZpY2UuY3JlYXRlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJTZXJ2aWNlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyICRzY29wZSA9IGNvbnRyb2xsZXJTZXJ2aWNlLmNvbnRyb2xsZXJTY29wZTtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccythc1xccysoW1xcc1xcU10rPykpPyg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgW1wiRXhwZWN0ZWQgZXhwcmVzc2lvbiBpbiBmb3JtIG9mICdfaXRlbV8gaW4gX2NvbGxlY3Rpb25fWyB0cmFjayBieSBfaWRfXScgYnV0IGdvdCAnXCIsIGV4cHJlc3Npb24sIFwiJ1wiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaHMgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIHZhciByaHMgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgIHZhciBhbGlhc0FzID0gbWF0Y2hbM107XG4gICAgICAgICAgICB2YXIgdHJhY2tCeUV4cCA9IG1hdGNoWzRdO1xuICAgICAgICAgICAgbWF0Y2ggPSBsaHMubWF0Y2goL14oPzooXFxzKltcXCRcXHddKyl8XFwoXFxzKihbXFwkXFx3XSspXFxzKixcXHMqKFtcXCRcXHddKylcXHMqXFwpKSQvKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCInX2l0ZW1fJyBpbiAnX2l0ZW1fIGluIF9jb2xsZWN0aW9uXycgc2hvdWxkIGJlIGFuIGlkZW50aWZpZXIgb3IgJyhfa2V5XywgX3ZhbHVlXyknIGV4cHJlc3Npb24sIGJ1dCBnb3QgJ1wiLCBsaHMsIFwiJ1wiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZUlkZW50aWZpZXIgPSBtYXRjaFszXSB8fCBtYXRjaFsxXTtcbiAgICAgICAgICAgIHZhciBrZXlJZGVudGlmaWVyID0gbWF0Y2hbMl07XG5cbiAgICAgICAgICAgIGlmIChhbGlhc0FzICYmICghL15bJGEtekEtWl9dWyRhLXpBLVowLTlfXSokLy50ZXN0KGFsaWFzQXMpIHx8IC9eKG51bGx8dW5kZWZpbmVkfHRoaXN8XFwkaW5kZXh8XFwkZmlyc3R8XFwkbWlkZGxlfFxcJGxhc3R8XFwkZXZlbnxcXCRvZGR8XFwkcGFyZW50fFxcJHJvb3R8XFwkaWQpJC8udGVzdChhbGlhc0FzKSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBbXCJhbGlhcyAnXCIsIGFsaWFzQXMsIFwiJyBpcyBpbnZhbGlkIC0tLSBtdXN0IGJlIGEgdmFsaWQgSlMgaWRlbnRpZmllciB3aGljaCBpcyBub3QgYSByZXNlcnZlZCBuYW1lLlwiXS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0cmFja0J5RXhwR2V0dGVyLCB0cmFja0J5SWRFeHBGbiwgdHJhY2tCeUlkQXJyYXlGbiwgdHJhY2tCeUlkT2JqRm47XG4gICAgICAgICAgICB2YXIgaGFzaEZuTG9jYWxzID0ge1xuICAgICAgICAgICAgICAgICRpZDogX2NvbW1vbi5oYXNoS2V5XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodHJhY2tCeUV4cCkge1xuICAgICAgICAgICAgICAgIHRyYWNrQnlFeHBHZXR0ZXIgPSAkcGFyc2UodHJhY2tCeUV4cCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYWNrQnlJZEFycmF5Rm4gPSBmdW5jdGlvbiB0cmFja0J5SWRBcnJheUZuKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfY29tbW9uLmhhc2hLZXkpKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRyYWNrQnlJZE9iakZuID0gZnVuY3Rpb24gdHJhY2tCeUlkT2JqRm4oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cmFja0J5RXhwR2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkRXhwRm4gPSBmdW5jdGlvbiB0cmFja0J5SWRFeHBGbihrZXksIHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24ga2V5LCB2YWx1ZSwgYW5kICRpbmRleCB0byB0aGUgbG9jYWxzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBpbiBoYXNoIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5SWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzaEZuTG9jYWxzW2tleUlkZW50aWZpZXJdID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fsc1t2YWx1ZUlkZW50aWZpZXJdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGhhc2hGbkxvY2Fscy4kaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrQnlFeHBHZXR0ZXIoJHNjb3BlLCBoYXNoRm5Mb2NhbHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdEJsb2NrTWFwID0gKDAsIF9jb21tb24uY3JlYXRlTWFwKSgpO1xuICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHtcbiAgICAgICAgICAgICAgICB0b0FkZDogW10sXG4gICAgICAgICAgICAgICAgdG9SZW1vdmU6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHdhdGNoZXIgPSAkc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihyaHMsIGZ1bmN0aW9uIG5nUmVwZWF0QWN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvQWRkOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgdG9SZW1vdmU6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrTWFwID0gKDAsIF9jb21tb24uY3JlYXRlTWFwKSgpLFxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAvLyBrZXkvdmFsdWUgb2YgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgdHJhY2tCeUlkLFxuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbixcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICAvLyBsYXN0IG9iamVjdCBpbmZvcm1hdGlvbiB7c2NvcGUsIGVsZW1lbnQsIGlkfVxuICAgICAgICAgICAgICAgIG5leHRCbG9ja09yZGVyLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvUmVtb3ZlO1xuICAgICAgICAgICAgICAgIGlmIChhbGlhc0FzKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZVthbGlhc0FzXSA9IGNvbGxlY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoMCwgX2NvbW1vbi5pc0FycmF5TGlrZSkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleXMgPSBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0cmFja0J5SWRGbiA9IHRyYWNrQnlJZEV4cEZuIHx8IHRyYWNrQnlJZEFycmF5Rm47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tCeUlkRm4gPSB0cmFja0J5SWRFeHBGbiB8fCB0cmFja0J5SWRPYmpGbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0LCBleHRyYWN0IGtleXMsIGluIGVudW1lcmF0aW9uIG9yZGVyLCB1bnNvcnRlZFxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtS2V5IGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbGxlY3Rpb24sIGl0ZW1LZXkpICYmIGl0ZW1LZXkuY2hhckF0KDApICE9PSAnJCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5cy5wdXNoKGl0ZW1LZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25MZW5ndGggPSBjb2xsZWN0aW9uS2V5cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXIgPSBuZXcgQXJyYXkoY29sbGVjdGlvbkxlbmd0aCk7IC8vIGxvY2F0ZSBleGlzdGluZyBpdGVtc1xuICAgICAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGNvbGxlY3Rpb25MZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gY29sbGVjdGlvbiA9PT0gY29sbGVjdGlvbktleXMgPyBpbmRleCA6IGNvbGxlY3Rpb25LZXlzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xsZWN0aW9uW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHRyYWNrQnlJZCA9IHRyYWNrQnlJZEZuKGtleSwgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RCbG9ja01hcFt0cmFja0J5SWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3VuZCBwcmV2aW91c2x5IHNlZW4gYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrID0gbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbGFzdEJsb2NrTWFwW3RyYWNrQnlJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEJsb2NrT3JkZXJbaW5kZXhdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEJsb2NrTWFwW3RyYWNrQnlJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGNvbGxpc2lvbiBkZXRlY3RlZC4gcmVzdG9yZSBsYXN0QmxvY2tNYXAgYW5kIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobmV4dEJsb2NrT3JkZXIsIGZ1bmN0aW9uIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiBibG9jay5zY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0QmxvY2tNYXBbYmxvY2suaWRdID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBbXCJEdXBsaWNhdGVzIGluIGEgcmVwZWF0ZXIgYXJlIG5vdCBhbGxvd2VkLiBVc2UgJ3RyYWNrIGJ5JyBleHByZXNzaW9uIHRvIHNwZWNpZnkgdW5pcXVlIGtleXMuIFJlcGVhdGVyOiBcIiwgZXhwcmVzc2lvbiwgXCIsIER1cGxpY2F0ZSBrZXk6IFwiLCB0cmFja0J5SWQsIFwiLCBEdXBsaWNhdGUgdmFsdWU6IFwiLCB2YWx1ZV0uam9pbignJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgbmV2ZXIgYmVmb3JlIHNlZW4gYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZS50b0FkZC5wdXNoKG5leHRCbG9ja09yZGVyW2luZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdHJhY2tCeUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldyh2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmU6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QmxvY2tNYXBbdHJhY2tCeUlkXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IC8vIHJlbW92ZSBsZWZ0b3ZlciBpdGVtc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGJsb2NrS2V5IGluIGxhc3RCbG9ja01hcCkge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUudG9SZW1vdmUucHVzaChibG9jayA9IGxhc3RCbG9ja01hcFtibG9ja0tleV0pO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvUmVtb3ZlID0gKDAsIF9jb21tb24uZ2V0QmxvY2tOb2RlcykoYmxvY2suY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZS5sZWF2ZShlbGVtZW50c1RvUmVtb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzVG9SZW1vdmVbMF0ucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgd2FzIG5vdCByZW1vdmVkIHlldCBiZWNhdXNlIG9mIHBlbmRpbmcgYW5pbWF0aW9uLCBtYXJrIGl0IGFzIGRlbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGlnbm9yZSBpdCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IGVsZW1lbnRzVG9SZW1vdmUubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmVbaW5kZXhdW05HX1JFTU9WRURdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBibG9jay5zY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0gLy8gd2UgYXJlIG5vdCB1c2luZyBmb3JFYWNoIGZvciBwZXJmIHJlYXNvbnMgKHRyeWluZyB0byBhdm9pZCAjY2FsbClcbiAgICAgICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjb2xsZWN0aW9uTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGNvbGxlY3Rpb24gPT09IGNvbGxlY3Rpb25LZXlzID8gaW5kZXggOiBjb2xsZWN0aW9uS2V5c1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29sbGVjdGlvbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBibG9jayA9IG5leHRCbG9ja09yZGVyW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTY29wZShibG9jay5zY29wZSwgaW5kZXgsIHZhbHVlSWRlbnRpZmllciwgdmFsdWUsIGtleUlkZW50aWZpZXIsIGtleSwgY29sbGVjdGlvbkxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdEJsb2NrTWFwID0gbmV4dEJsb2NrTWFwO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihsYXN0VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIChzdWJzY3JpcHRvcnMuc2hpZnQgfHwgYW5ndWxhci5ub29wKSgpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHN1YnNjcmlwdG9ycy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHdhdGNoZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHRvUmV0dXJuID0gZnVuY3Rpb24gdG9SZXR1cm4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0b1JldHVybi5jaGFuZ2VzID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc3Vic2NyaXB0b3JzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0b3JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93ICdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbic7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9pbnRlcm5hbERpcmVjdGl2ZXMvbmdSZXBlYXQuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGlyZWN0aXZlUHJvdmlkZXIgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZVByb3ZpZGVyLmpzJyk7XG5cbnZhciBfZGlyZWN0aXZlUHJvdmlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlyZWN0aXZlUHJvdmlkZXIpO1xuXG52YXIgX2F0dHJpYnV0ZSA9IHJlcXVpcmUoJy4vLi4vY29udHJvbGxlci9hdHRyaWJ1dGUuanMnKTtcblxudmFyIF9hdHRyaWJ1dGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXR0cmlidXRlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGRpcmVjdGl2ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcHJvdG8gPSBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlIHx8IGFuZ3VsYXIuZWxlbWVudC5fX3Byb3RvX187XG4gICAgcHJvdG8uJGZpbmQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHtcbiAgICAgICAgICAgIGxlbmd0aDogMFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzW3ZhbHVlcy5sZW5ndGgrK10gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoam9pbih2YWx1ZXMpKTtcbiAgICB9O1xuICAgIHByb3RvLiRjbGljayA9IGZ1bmN0aW9uIChsb2NhbHMpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY2xpY2sgPSB0aGlzLmRhdGEoJ25nLWNsaWNrJyk7XG4gICAgICAgICAgICByZXR1cm4gY2xpY2sgJiYgY2xpY2sobG9jYWxzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8uJHRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLmRhdGEoJ25nLW1vZGVsJykgfHwgdGhpcy5kYXRhKCduZy1iaW5kJykgfHwgdGhpcy5kYXRhKCduZy10cmFuc2xhdGUnKSB8fCB0aGlzLnRleHQ7XG4gICAgICAgICAgICByZXR1cm4gdGV4dCAmJiB0ZXh0LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKSB8fCAnJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8uJGlmID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBuZ0lmID0gdGhpcy5kYXRhKCduZy1pZicpO1xuICAgICAgICAgICAgcmV0dXJuIG5nSWYgJiYgbmdJZi52YWx1ZS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gam9pbihvYmopIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIG9iaik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGlsZShvYmosIGNvbnRyb2xsZXJTZXJ2aWNlKSB7XG4gICAgICAgIG9iaiA9IGFuZ3VsYXIuZWxlbWVudChvYmopO1xuXG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBvYmpbMF0uYXR0cmlidXRlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgIHZhciBkaXJlY3RpdmVOYW1lID0gb2JqWzBdLmF0dHJpYnV0ZXNbaWldLm5hbWU7XG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IG9ialswXS5hdHRyaWJ1dGVzW2lpXS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBkaXJlY3RpdmUgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlID0gX2RpcmVjdGl2ZVByb3ZpZGVyMi5kZWZhdWx0LiRnZXQoZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcGlsZWREaXJlY3RpdmUgPSBkaXJlY3RpdmUuY29tcGlsZShjb250cm9sbGVyU2VydmljZSwgZXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgb2JqLmRhdGEoZGlyZWN0aXZlLm5hbWUsIGNvbXBpbGVkRGlyZWN0aXZlKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKGRpcmVjdGl2ZS5hdHRhY2hUb0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5hdHRhY2hUb0VsZW1lbnQoY29udHJvbGxlclNlcnZpY2UsIGFuZ3VsYXIuZWxlbWVudChvYmopLCBuZXcgX2F0dHJpYnV0ZTIuZGVmYXVsdChvYmopKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW5zID0gb2JqLmNoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIF9paSA9IDA7IF9paSA8IGNoaWxkcmVucy5sZW5ndGg7IF9paSsrKSB7XG4gICAgICAgICAgICBjb21waWxlKGNoaWxkcmVuc1tfaWldLCBjb250cm9sbGVyU2VydmljZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb250cm9sKGNvbnRyb2xsZXJTZXJ2aWNlLCBvYmopIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSBhbmd1bGFyLmVsZW1lbnQob2JqKTtcbiAgICAgICAgaWYgKCFjdXJyZW50IHx8ICFjb250cm9sbGVyU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsZShjdXJyZW50LCBjb250cm9sbGVyU2VydmljZSk7XG4gICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBjb250cm9sO1xufSgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGlyZWN0aXZlSGFuZGxlcjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvZGlyZWN0aXZlcy9kaXJlY3RpdmVIYW5kbGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG5cbmZ1bmN0aW9uIEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlc1RvQ29weSkge1xuICAgIGlmIChhdHRyaWJ1dGVzVG9Db3B5KSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlc1RvQ29weSk7XG4gICAgICAgIHZhciBpLCBsLCBrZXk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgdGhpc1trZXldID0gYXR0cmlidXRlc1RvQ29weVtrZXldO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kYXR0ciA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuJCRlbGVtZW50ID0gZWxlbWVudDtcbn1cbnZhciAkYW5pbWF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRhbmltYXRlJyk7XG52YXIgJCRzYW5pdGl6ZVVyaSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyQkc2FuaXRpemVVcmknKTtcbkF0dHJpYnV0ZXMucHJvdG90eXBlID0ge1xuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJG5vcm1hbGl6ZVxyXG4gICAgICogQGtpbmQgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnZlcnRzIGFuIGF0dHJpYnV0ZSBuYW1lIChlLmcuIGRhc2gvY29sb24vdW5kZXJzY29yZS1kZWxpbWl0ZWQgc3RyaW5nLCBvcHRpb25hbGx5IHByZWZpeGVkIHdpdGggYHgtYCBvclxyXG4gICAgICogYGRhdGEtYCkgdG8gaXRzIG5vcm1hbGl6ZWQsIGNhbWVsQ2FzZSBmb3JtLlxyXG4gICAgICpcclxuICAgICAqIEFsc28gdGhlcmUgaXMgc3BlY2lhbCBjYXNlIGZvciBNb3ogcHJlZml4IHN0YXJ0aW5nIHdpdGggdXBwZXIgY2FzZSBsZXR0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogRm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24gY2hlY2sgb3V0IHRoZSBndWlkZSBvbiB7QGxpbmsgZ3VpZGUvZGlyZWN0aXZlI21hdGNoaW5nLWRpcmVjdGl2ZXMgTWF0Y2hpbmcgRGlyZWN0aXZlc31cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIHRvIG5vcm1hbGl6ZVxyXG4gICAgICovXG4gICAgJG5vcm1hbGl6ZTogX2NvbW1vbi50b0NhbWVsQ2FzZSxcblxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJGFkZENsYXNzXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQWRkcyB0aGUgQ1NTIGNsYXNzIHZhbHVlIHNwZWNpZmllZCBieSB0aGUgY2xhc3NWYWwgcGFyYW1ldGVyIHRvIHRoZSBlbGVtZW50LiBJZiBhbmltYXRpb25zXHJcbiAgICAgKiBhcmUgZW5hYmxlZCB0aGVuIGFuIGFuaW1hdGlvbiB3aWxsIGJlIHRyaWdnZXJlZCBmb3IgdGhlIGNsYXNzIGFkZGl0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ZhbCBUaGUgY2xhc3NOYW1lIHZhbHVlIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgZWxlbWVudFxyXG4gICAgICovXG4gICAgJGFkZENsYXNzOiBmdW5jdGlvbiAkYWRkQ2xhc3MoY2xhc3NWYWwpIHtcbiAgICAgICAgaWYgKGNsYXNzVmFsICYmIGNsYXNzVmFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKHRoaXMuJCRlbGVtZW50LCBjbGFzc1ZhbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgKiBAbmFtZSAkY29tcGlsZS5kaXJlY3RpdmUuQXR0cmlidXRlcyMkcmVtb3ZlQ2xhc3NcclxuICAgICAqIEBraW5kIGZ1bmN0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBDU1MgY2xhc3MgdmFsdWUgc3BlY2lmaWVkIGJ5IHRoZSBjbGFzc1ZhbCBwYXJhbWV0ZXIgZnJvbSB0aGUgZWxlbWVudC4gSWZcclxuICAgICAqIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQgdGhlbiBhbiBhbmltYXRpb24gd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoZSBjbGFzcyByZW1vdmFsLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc1ZhbCBUaGUgY2xhc3NOYW1lIHZhbHVlIHRoYXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnRcclxuICAgICAqL1xuICAgICRyZW1vdmVDbGFzczogZnVuY3Rpb24gJHJlbW92ZUNsYXNzKGNsYXNzVmFsKSB7XG4gICAgICAgIGlmIChjbGFzc1ZhbCAmJiBjbGFzc1ZhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5yZW1vdmVDbGFzcyh0aGlzLiQkZWxlbWVudCwgY2xhc3NWYWwpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICogQG5hbWUgJGNvbXBpbGUuZGlyZWN0aXZlLkF0dHJpYnV0ZXMjJHVwZGF0ZUNsYXNzXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQWRkcyBhbmQgcmVtb3ZlcyB0aGUgYXBwcm9wcmlhdGUgQ1NTIGNsYXNzIHZhbHVlcyB0byB0aGUgZWxlbWVudCBiYXNlZCBvbiB0aGUgZGlmZmVyZW5jZVxyXG4gICAgICogYmV0d2VlbiB0aGUgbmV3IGFuZCBvbGQgQ1NTIGNsYXNzIHZhbHVlcyAoc3BlY2lmaWVkIGFzIG5ld0NsYXNzZXMgYW5kIG9sZENsYXNzZXMpLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdDbGFzc2VzIFRoZSBjdXJyZW50IENTUyBjbGFzc05hbWUgdmFsdWVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbGRDbGFzc2VzIFRoZSBmb3JtZXIgQ1NTIGNsYXNzTmFtZSB2YWx1ZVxyXG4gICAgICovXG4gICAgJHVwZGF0ZUNsYXNzOiBmdW5jdGlvbiAkdXBkYXRlQ2xhc3MobmV3Q2xhc3Nlcywgb2xkQ2xhc3Nlcykge1xuICAgICAgICB2YXIgdG9BZGQgPSB0b2tlbkRpZmZlcmVuY2UobmV3Q2xhc3Nlcywgb2xkQ2xhc3Nlcyk7XG4gICAgICAgIGlmICh0b0FkZCAmJiB0b0FkZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKHRoaXMuJCRlbGVtZW50LCB0b0FkZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG9SZW1vdmUgPSB0b2tlbkRpZmZlcmVuY2Uob2xkQ2xhc3NlcywgbmV3Q2xhc3Nlcyk7XG4gICAgICAgIGlmICh0b1JlbW92ZSAmJiB0b1JlbW92ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LCB0b1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBub3JtYWxpemVkIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudCBpbiBhIHdheSBzdWNoIHRoYXQgYWxsIGRpcmVjdGl2ZXNcclxuICAgICAqIGNhbiBzaGFyZSB0aGUgYXR0cmlidXRlLiBUaGlzIGZ1bmN0aW9uIHByb3Blcmx5IGhhbmRsZXMgYm9vbGVhbiBhdHRyaWJ1dGVzLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBOb3JtYWxpemVkIGtleS4gKGllIG5nQXR0cmlidXRlKVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8Ym9vbGVhbn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC4gSWYgYG51bGxgIGF0dHJpYnV0ZSB3aWxsIGJlIGRlbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSB3cml0ZUF0dHIgSWYgZmFsc2UsIGRvZXMgbm90IHdyaXRlIHRoZSB2YWx1ZSB0byBET00gZWxlbWVudCBhdHRyaWJ1dGUuXHJcbiAgICAgKiAgICAgRGVmYXVsdHMgdG8gdHJ1ZS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYXR0ck5hbWUgT3B0aW9uYWwgbm9uZSBub3JtYWxpemVkIG5hbWUuIERlZmF1bHRzIHRvIGtleS5cclxuICAgICAqL1xuICAgICRzZXQ6IGZ1bmN0aW9uICRzZXQoa2V5LCB2YWx1ZSwgd3JpdGVBdHRyLCBhdHRyTmFtZSkge1xuICAgICAgICAvLyBUT0RPOiBkZWNpZGUgd2hldGhlciBvciBub3QgdG8gdGhyb3cgYW4gZXJyb3IgaWYgXCJjbGFzc1wiXG4gICAgICAgIC8vaXMgc2V0IHRocm91Z2ggdGhpcyBmdW5jdGlvbiBzaW5jZSBpdCBtYXkgY2F1c2UgJHVwZGF0ZUNsYXNzIHRvXG4gICAgICAgIC8vYmVjb21lIHVuc3RhYmxlLlxuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy4kJGVsZW1lbnRbMF0sXG4gICAgICAgICAgICBib29sZWFuS2V5ID0gYW5ndWxhci5nZXRCb29sZWFuQXR0ck5hbWUobm9kZSwga2V5KSxcbiAgICAgICAgICAgIGFsaWFzZWRLZXkgPSBhbmd1bGFyLmdldEFsaWFzZWRBdHRyTmFtZShrZXkpLFxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBrZXksXG4gICAgICAgICAgICBub2RlTmFtZTtcblxuICAgICAgICBpZiAoYm9vbGVhbktleSkge1xuICAgICAgICAgICAgdGhpcy4kJGVsZW1lbnQucHJvcChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYm9vbGVhbktleTtcbiAgICAgICAgfSBlbHNlIGlmIChhbGlhc2VkS2V5KSB7XG4gICAgICAgICAgICB0aGlzW2FsaWFzZWRLZXldID0gdmFsdWU7XG4gICAgICAgICAgICBvYnNlcnZlciA9IGFsaWFzZWRLZXk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAvLyB0cmFuc2xhdGUgbm9ybWFsaXplZCBrZXkgdG8gYWN0dWFsIGtleVxuICAgICAgICBpZiAoYXR0ck5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuJGF0dHJba2V5XSA9IGF0dHJOYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSB0aGlzLiRhdHRyW2tleV07XG4gICAgICAgICAgICBpZiAoIWF0dHJOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kYXR0cltrZXldID0gYXR0ck5hbWUgPSAoMCwgX2NvbW1vbi50b1NuYWtlQ2FzZSkoa2V5LCAnLScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbm9kZU5hbWUgPSBub2RlTmFtZV8odGhpcy4kJGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ2EnICYmIChrZXkgPT09ICdocmVmJyB8fCBrZXkgPT09ICd4bGlua0hyZWYnKSB8fCBub2RlTmFtZSA9PT0gJ2ltZycgJiYga2V5ID09PSAnc3JjJykge1xuICAgICAgICAgICAgLy8gc2FuaXRpemUgYVtocmVmXSBhbmQgaW1nW3NyY10gdmFsdWVzXG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZSA9ICQkc2FuaXRpemVVcmkodmFsdWUsIGtleSA9PT0gJ3NyYycpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGVOYW1lID09PSAnaW1nJyAmJiBrZXkgPT09ICdzcmNzZXQnICYmIGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gc2FuaXRpemUgaW1nW3NyY3NldF0gdmFsdWVzXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcblxuICAgICAgICAgICAgLy8gZmlyc3QgY2hlY2sgaWYgdGhlcmUgYXJlIHNwYWNlcyBiZWNhdXNlIGl0J3Mgbm90IHRoZSBzYW1lIHBhdHRlcm5cbiAgICAgICAgICAgIHZhciB0cmltbWVkU3Jjc2V0ID0gKDAsIF9jb21tb24udHJpbSkodmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKCAgIDk5OXggICAsfCAgIDk5OXcgICAsfCAgICx8LCAgIClcbiAgICAgICAgICAgIHZhciBzcmNQYXR0ZXJuID0gLyhcXHMrXFxkK3hcXHMqLHxcXHMrXFxkK3dcXHMqLHxcXHMrLHwsXFxzKykvO1xuICAgICAgICAgICAgdmFyIHBhdHRlcm4gPSAvXFxzLy50ZXN0KHRyaW1tZWRTcmNzZXQpID8gc3JjUGF0dGVybiA6IC8oLCkvO1xuXG4gICAgICAgICAgICAvLyBzcGxpdCBzcmNzZXQgaW50byB0dXBsZSBvZiB1cmkgYW5kIGRlc2NyaXB0b3IgZXhjZXB0IGZvciB0aGUgbGFzdCBpdGVtXG4gICAgICAgICAgICB2YXIgcmF3VXJpcyA9IHRyaW1tZWRTcmNzZXQuc3BsaXQocGF0dGVybik7XG5cbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHR1cGxlc1xuICAgICAgICAgICAgdmFyIG5iclVyaXNXaXRoMnBhcnRzID0gTWF0aC5mbG9vcihyYXdVcmlzLmxlbmd0aCAvIDIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYnJVcmlzV2l0aDJwYXJ0czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlubmVySWR4ID0gaSAqIDI7XG4gICAgICAgICAgICAgICAgLy8gc2FuaXRpemUgdGhlIHVyaVxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAkJHNhbml0aXplVXJpKCgwLCBfY29tbW9uLnRyaW0pKHJhd1VyaXNbaW5uZXJJZHhdKSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBkZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiIFwiICsgKDAsIF9jb21tb24udHJpbSkocmF3VXJpc1tpbm5lcklkeCArIDFdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3BsaXQgdGhlIGxhc3QgaXRlbSBpbnRvIHVyaSBhbmQgZGVzY3JpcHRvclxuICAgICAgICAgICAgdmFyIGxhc3RUdXBsZSA9ICgwLCBfY29tbW9uLnRyaW0pKHJhd1VyaXNbaSAqIDJdKS5zcGxpdCgvXFxzLyk7XG5cbiAgICAgICAgICAgIC8vIHNhbml0aXplIHRoZSBsYXN0IHVyaVxuICAgICAgICAgICAgcmVzdWx0ICs9ICQkc2FuaXRpemVVcmkoKDAsIF9jb21tb24udHJpbSkobGFzdFR1cGxlWzBdKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGFuZCBhZGQgdGhlIGxhc3QgZGVzY3JpcHRvciBpZiBhbnlcbiAgICAgICAgICAgIGlmIChsYXN0VHVwbGUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiIFwiICsgKDAsIF9jb21tb24udHJpbSkobGFzdFR1cGxlWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlID0gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdyaXRlQXR0ciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCBhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRlbGVtZW50LnJlbW92ZUF0dHIoYXR0ck5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU0lNUExFX0FUVFJfTkFNRS50ZXN0KGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiQkZWxlbWVudC5hdHRyKGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U3BlY2lhbEF0dHIodGhpcy4kJGVsZW1lbnRbMF0sIGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlyZSBvYnNlcnZlcnNcbiAgICAgICAgdmFyICQkb2JzZXJ2ZXJzID0gdGhpcy4kJG9ic2VydmVycztcbiAgICAgICAgaWYgKCQkb2JzZXJ2ZXJzKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJCRvYnNlcnZlcnNbb2JzZXJ2ZXJdLCBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAqIEBuYW1lICRjb21waWxlLmRpcmVjdGl2ZS5BdHRyaWJ1dGVzIyRvYnNlcnZlXHJcbiAgICAgKiBAa2luZCBmdW5jdGlvblxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogT2JzZXJ2ZXMgYW4gaW50ZXJwb2xhdGVkIGF0dHJpYnV0ZS5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgb2JzZXJ2ZXIgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIG9uY2UgZHVyaW5nIHRoZSBuZXh0IGAkZGlnZXN0YCBmb2xsb3dpbmdcclxuICAgICAqIGNvbXBpbGF0aW9uLiBUaGUgb2JzZXJ2ZXIgaXMgdGhlbiBpbnZva2VkIHdoZW5ldmVyIHRoZSBpbnRlcnBvbGF0ZWQgdmFsdWVcclxuICAgICAqIGNoYW5nZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBOb3JtYWxpemVkIGtleS4gKGllIG5nQXR0cmlidXRlKSAuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGludGVycG9sYXRlZFZhbHVlKX0gZm4gRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlclxyXG4gICAgICAgICAgICAgIHRoZSBpbnRlcnBvbGF0ZWQgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VzLlxyXG4gICAgICogICAgICAgIFNlZSB0aGUge0BsaW5rIGd1aWRlL2ludGVycG9sYXRpb24jaG93LXRleHQtYW5kLWF0dHJpYnV0ZS1iaW5kaW5ncy13b3JrIEludGVycG9sYXRpb25cclxuICAgICAqICAgICAgICBndWlkZX0gZm9yIG1vcmUgaW5mby5cclxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbigpfSBSZXR1cm5zIGEgZGVyZWdpc3RyYXRpb24gZnVuY3Rpb24gZm9yIHRoaXMgb2JzZXJ2ZXIuXHJcbiAgICAgKi9cbiAgICAkb2JzZXJ2ZTogZnVuY3Rpb24gJG9ic2VydmUoa2V5LCBmbikge1xuICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLFxuICAgICAgICAgICAgJCRvYnNlcnZlcnMgPSBhdHRycy4kJG9ic2VydmVycyB8fCAoYXR0cnMuJCRvYnNlcnZlcnMgPSBuZXcgTWFwKCkpLFxuICAgICAgICAgICAgbGlzdGVuZXJzID0gJCRvYnNlcnZlcnNba2V5XSB8fCAoJCRvYnNlcnZlcnNba2V5XSA9IFtdKTtcblxuICAgICAgICBsaXN0ZW5lcnMucHVzaChmbik7XG4gICAgICAgIF9jb21tb24uc2NvcGVIZWxwZXIuJHJvb3RTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzLiQkaW50ZXIgJiYgYXR0cnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhYW5ndWxhci5pc1VuZGVmaW5lZChhdHRyc1trZXldKSkge1xuICAgICAgICAgICAgICAgIC8vIG5vIG9uZSByZWdpc3RlcmVkIGF0dHJpYnV0ZSBpbnRlcnBvbGF0aW9uIGZ1bmN0aW9uLCBzbyBsZXRzIGNhbGwgaXQgbWFudWFsbHlcbiAgICAgICAgICAgICAgICBmbihhdHRyc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuYXJyYXlSZW1vdmUobGlzdGVuZXJzLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuZnVuY3Rpb24gdG9rZW5EaWZmZXJlbmNlKHN0cjEsIHN0cjIpIHtcblxuICAgIHZhciB2YWx1ZXMgPSAnJyxcbiAgICAgICAgdG9rZW5zMSA9IHN0cjEuc3BsaXQoL1xccysvKSxcbiAgICAgICAgdG9rZW5zMiA9IHN0cjIuc3BsaXQoL1xccysvKTtcblxuICAgIG91dGVyOiBmb3IgKHZhciBpID0gMDsgaSA8IHRva2VuczEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRva2VuID0gdG9rZW5zMVtpXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRva2VuczIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9PT0gdG9rZW5zMltqXSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWVzICs9ICh2YWx1ZXMubGVuZ3RoID4gMCA/ICcgJyA6ICcnKSArIHRva2VuO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xufVxuXG5mdW5jdGlvbiBub2RlTmFtZV8oZWxlbWVudCkge1xuICAgIHZhciBteUVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF07XG4gICAgaWYgKG15RWxlbSkge1xuICAgICAgICByZXR1cm4gbXlFbGVtLm5vZGVOYW1lO1xuICAgIH1cbn1cbnZhciBzcGVjaWFsQXR0ckhvbGRlciA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnZhciBTSU1QTEVfQVRUUl9OQU1FID0gL15cXHcvO1xuXG5mdW5jdGlvbiBzZXRTcGVjaWFsQXR0cihlbGVtZW50LCBhdHRyTmFtZSwgdmFsdWUpIHtcbiAgICAvLyBBdHRyaWJ1dGVzIG5hbWVzIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggbGV0dGVycyAoc3VjaCBhcyBgKGNsaWNrKWApIGNhbm5vdCBiZSBzZXQgdXNpbmcgYHNldEF0dHJpYnV0ZWBcbiAgICAvLyBzbyB3ZSBoYXZlIHRvIGp1bXAgdGhyb3VnaCBzb21lIGhvb3BzIHRvIGdldCBzdWNoIGFuIGF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvcHVsbC8xMzMxOFxuICAgIHNwZWNpYWxBdHRySG9sZGVyLmlubmVySFRNTCA9IFwiPHNwYW4gXCIgKyBhdHRyTmFtZSArIFwiPlwiO1xuICAgIHZhciBhdHRyaWJ1dGVzID0gc3BlY2lhbEF0dHJIb2xkZXIuZmlyc3RDaGlsZC5hdHRyaWJ1dGVzO1xuICAgIHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzWzBdO1xuICAgIC8vIFdlIGhhdmUgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZnJvbSBpdHMgY29udGFpbmVyIGVsZW1lbnQgYmVmb3JlIHdlIGNhbiBhZGQgaXQgdG8gdGhlIGRlc3RpbmF0aW9uIGVsZW1lbnRcbiAgICBhdHRyaWJ1dGVzLnJlbW92ZU5hbWVkSXRlbShhdHRyaWJ1dGUubmFtZSk7XG4gICAgYXR0cmlidXRlLnZhbHVlID0gdmFsdWU7XG4gICAgZWxlbWVudC5hdHRyaWJ1dGVzLnNldE5hbWVkSXRlbShhdHRyaWJ1dGUpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gQXR0cmlidXRlcztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYnVpbHQvY29udHJvbGxlci9hdHRyaWJ1dGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyICRwYXJzZSA9IGFuZ3VsYXIuaW5qZWN0b3IoWyduZyddKS5nZXQoJyRwYXJzZScpO1xuXG52YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgY29udHJvbGxlcik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKGNvbnRyb2xsZXIsIG51bGwsIFt7XG4gICAgICAgIGtleTogJ2dldFZhbHVlcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZXMoc2NvcGUsIGJpbmRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSB7fTtcbiAgICAgICAgICAgIGlmICghYW5ndWxhci5pc09iamVjdChiaW5kaW5ncykpIHtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MgPT09IHRydWUgfHwgYmluZGluZ3MgPT09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICBiaW5kaW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1JldHVybiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmhhc093blByb3BlcnR5KGtleSkgJiYgIWtleS5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9SZXR1cm5ba2V5XSA9ICc9JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmdzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9jb21tb24uUEFSU0VfQklORElOR19SRUdFWC5leGVjKGJpbmRpbmdzW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbW9kZSA9IHJlc3VsdFsxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudEtleSA9IHJlc3VsdFsyXSB8fCBrZXk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRHZXQgPSAkcGFyc2UocGFyZW50S2V5KTtcblxuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gJHBhcnNlKHBhcmVudEdldChzY29wZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gZnVuY3Rpb24gKGxvY2Fscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKHNjb3BlLCBsb2NhbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdAJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cCA9IHBhcmVudEdldChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0V4cCA9ICgwLCBfY29tbW9uLmlzRXhwcmVzc2lvbikoZXhwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1JldHVybltrZXldID0gJHBhcnNlKCgwLCBfY29tbW9uLmV4cHJlc3Npb25TYW5pdGl6ZXIpKGV4cCkpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvUmV0dXJuW2tleV0gPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdDb3VsZCBub3QgYXBwbHkgYmluZGluZ3MnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncGFyc2VCaW5kaW5ncycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZUJpbmRpbmdzKGJpbmRpbmdzLCBzY29wZSwgaXNvbGF0ZVNjb3BlLCBjb250cm9sbGVyQXMpIHtcbiAgICAgICAgICAgIHZhciBhc3NpZ25CaW5kaW5ncyA9IGZ1bmN0aW9uIGFzc2lnbkJpbmRpbmdzKGRlc3RpbmF0aW9uLCBzY29wZSwga2V5LCBtb2RlKSB7XG4gICAgICAgICAgICAgICAgbW9kZSA9IG1vZGUgfHwgJz0nO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBfY29tbW9uLlBBUlNFX0JJTkRJTkdfUkVHRVguZXhlYyhtb2RlKTtcbiAgICAgICAgICAgICAgICBtb2RlID0gcmVzdWx0WzFdO1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRLZXkgPSByZXN1bHRbMl0gfHwga2V5O1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZEtleSA9IGNvbnRyb2xsZXJBcyArICcuJyArIGtleTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50R2V0ID0gJHBhcnNlKHBhcmVudEtleSk7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkR2V0ID0gJHBhcnNlKGNoaWxkS2V5KTtcbiAgICAgICAgICAgICAgICB2YXIgdW53YXRjaDtcblxuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnPSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHBhcmVudEdldChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudFZhbHVlV2F0Y2ggPSBmdW5jdGlvbiBwYXJlbnRWYWx1ZVdhdGNoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgIT09IGxhc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRHZXQuYXNzaWduKGRlc3RpbmF0aW9uLCBwYXJlbnRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGNoaWxkR2V0KGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEdldC5hc3NpZ24oc2NvcGUsIHBhcmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBwYXJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVud2F0Y2ggPSBzY29wZS4kd2F0Y2gocGFyZW50VmFsdWVXYXRjaCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi4kb24oJyRkZXN0cm95JywgdW53YXRjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0AnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0V4cCA9ICgwLCBfY29tbW9uLmlzRXhwcmVzc2lvbikoc2NvcGVbcGFyZW50S2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRXhwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50VmFsdWUgPSBwYXJlbnRHZXQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RWYWx1ZSA9IHBhcmVudFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudFZhbHVlV2F0Y2ggPSBmdW5jdGlvbiBwYXJlbnRWYWx1ZVdhdGNoKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFZhbHVlID0gcGFyZW50R2V0KHNjb3BlLCBpc29sYXRlU2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWYWx1ZSAhPT0gbGFzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR2V0LmFzc2lnbihkZXN0aW5hdGlvbiwgbGFzdFZhbHVlID0gcGFyZW50VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bndhdGNoID0gc2NvcGUuJHdhdGNoKHBhcmVudFZhbHVlV2F0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uJG9uKCckZGVzdHJveScsIHVud2F0Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgJ0NvdWxkIG5vdCBhcHBseSBiaW5kaW5ncyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gX2NvbW1vbi5zY29wZUhlbHBlci5jcmVhdGUoaXNvbGF0ZVNjb3BlIHx8IHNjb3BlLiRuZXcoKSk7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5ncyA9PT0gdHJ1ZSB8fCBhbmd1bGFyLmlzU3RyaW5nKGJpbmRpbmdzKSAmJiBiaW5kaW5ncyA9PT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFrZXkuc3RhcnRzV2l0aCgnJCcpICYmIGtleSAhPT0gY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzT2JqZWN0KGJpbmRpbmdzKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9rZXkgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzLmhhc093blByb3BlcnR5KF9rZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25CaW5kaW5ncyhkZXN0aW5hdGlvbiwgc2NvcGUsIF9rZXksIGJpbmRpbmdzW19rZXldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzdGluYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IHBhcnNlIGJpbmRpbmdzJztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnJGdldCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAkZ2V0KG1vZHVsZU5hbWVzKSB7XG4gICAgICAgICAgICB2YXIgJGNvbnRyb2xsZXIgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSAoMCwgX2NvbW1vbi5tYWtlQXJyYXkpKG1vZHVsZU5hbWVzKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGluZGV4TW9jayA9IGFycmF5LmluZGV4T2YoJ25nTW9jaycpO1xuICAgICAgICAgICAgLy8gY29uc3QgaW5kZXhOZyA9IGFycmF5LmluZGV4T2YoJ25nJyk7XG4gICAgICAgICAgICAvLyBpZiAoaW5kZXhNb2NrICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gICAgIGFycmF5W2luZGV4TW9ja10gPSAnbmcnO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKGluZGV4TmcgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyAgICAgYXJyYXkucHVzaCgnbmcnKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGFuZ3VsYXIuaW5qZWN0b3IoYXJyYXkpLmludm9rZShbJyRjb250cm9sbGVyJywgZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICAkY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICAgICAgICB9XSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIHNjb3BlLCBiaW5kaW5ncywgc2NvcGVDb250cm9sbGVyTmFtZSwgZXh0ZW5kZWRMb2NhbHMpIHtcbiAgICAgICAgICAgICAgICBzY29wZSA9IF9jb21tb24uc2NvcGVIZWxwZXIuY3JlYXRlKHNjb3BlKTtcbiAgICAgICAgICAgICAgICBzY29wZUNvbnRyb2xsZXJOYW1lID0gc2NvcGVDb250cm9sbGVyTmFtZSB8fCAnY29udHJvbGxlcic7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FscyA9ICgwLCBfY29tbW9uLmV4dGVuZCkoZXh0ZW5kZWRMb2NhbHMgfHwge30sIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlOiBfY29tbW9uLnNjb3BlSGVscGVyLmNyZWF0ZShzY29wZSkuJG5ldygpXG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gZnVuY3Rpb24gY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gJGNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIGxvY2FscywgdHJ1ZSwgc2NvcGVDb250cm9sbGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBfY29tbW9uLmV4dGVuZCkoY29uc3RydWN0b3IuaW5zdGFuY2UsIGNvbnRyb2xsZXIuZ2V0VmFsdWVzKHNjb3BlLCBiaW5kaW5ncykpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBjb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLnBhcnNlQmluZGluZ3MoYmluZGluZ3MsIHNjb3BlLCBsb2NhbHMuJHNjb3BlLCBzY29wZUNvbnRyb2xsZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ3MgPSBiIHx8IGJpbmRpbmdzO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2NhbHMgPSBteUxvY2FscyB8fCBsb2NhbHM7XG4gICAgICAgICAgICAgICAgICAgIC8vIGIgPSBiIHx8IGJpbmRpbmdzO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIucGFyc2VCaW5kaW5ncyhiaW5kaW5ncywgc2NvcGUsIGxvY2Fscy4kc2NvcGUsIHNjb3BlQ29udHJvbGxlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL2V4dGVuZChjb25zdHJ1Y3Rvci5pbnN0YW5jZSwgZXh0ZW5kZWRMb2NhbHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3IucHJvdmlkZUJpbmRpbmdzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGVDb250cm9sbGVyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2xsZXI7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGNvbnRyb2xsZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2J1aWx0L2NvbnRyb2xsZXIvY29udHJvbGxlclFNLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=