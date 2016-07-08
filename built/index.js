'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};
	/******/
	/******/ // The require function
	/******/function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;
		/******/
		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };
		/******/
		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		/******/
		/******/ // Flag the module as loaded
		/******/module.loaded = true;
		/******/
		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}
	/******/
	/******/
	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;
	/******/
	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;
	/******/
	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";
	/******/
	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	/***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _quickmockMockHelper = __webpack_require__(2);

	var _quickmockMockHelper2 = _interopRequireDefault(_quickmockMockHelper);

	var _common = __webpack_require__(3);

	var _controllerHandler = __webpack_require__(4);

	var _controllerHandler2 = _interopRequireDefault(_controllerHandler);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

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

	/***/
},
/* 2 */
/***/function (module, exports) {

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

	/***/
},
/* 3 */
/***/function (module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
		return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	};

	exports.isArrayLike = isArrayLike;
	exports.assertNotDefined = assertNotDefined;
	exports.assert_$_CONTROLLER = assert_$_CONTROLLER;
	exports.clean = clean;
	exports.createSpy = createSpy;
	exports.makeArray = makeArray;
	exports.extend = extend;
	exports.getFunctionName = getFunctionName;
	exports.sanitizeModules = sanitizeModules;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

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

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

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

	/***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.$_CONTROLLER = undefined;

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	var _directiveProvider = __webpack_require__(6);

	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

	var _directiveHandler = __webpack_require__(11);

	var _controllerQM = __webpack_require__(12);

	var _controllerQM2 = _interopRequireDefault(_controllerQM);

	var _common = __webpack_require__(3);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

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

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

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

	/***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

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

	/***/
},
/* 8 */
/***/function (module, exports) {

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

	/***/
},
/* 9 */
/***/function (module, exports) {

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

	/***/
},
/* 10 */
/***/function (module, exports, __webpack_require__) {

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

	/***/
},
/* 11 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _directiveProvider = __webpack_require__(6);

	var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

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

	/***/
},
/* 12 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	var _common = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

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
				var overwriteWithLocals = function overwriteWithLocals() {
					for (var key in locals) {
						if (locals.hasOwnProperty(key) && key !== controllerAs && key !== '$scope') {
							assignBindings(destination, locals, key);
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
					overwriteWithLocals();
					return destination;
				} else if (angular.isObject(bindings)) {
					for (var _key in bindings) {
						if (bindings.hasOwnProperty(_key)) {
							assignBindings(destination, scope, _key, bindings[_key]);
						}
					}
					overwriteWithLocals();
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

	/***/
}
/******/]);