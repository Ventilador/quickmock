/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var extend = __webpack_require__(2).extend;
	(function(angular) {

	    if (true) {
	        var controllerHandler = __webpack_require__(3);
	    }
	    var opts, mockPrefix;
	    var controllerDefaults = function(flag) {
	        return {
	            bindToController: true,
	            parentScope: {},
	            controllerAs: 'controller',
	            isDefault: !flag
	        };
	    };
	    quickmock.MOCK_PREFIX = mockPrefix = (quickmock.MOCK_PREFIX || '___');
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

	        angular.forEach(allModules || [], function(modName) {
	            invokeQueue = invokeQueue.concat(angular.module(modName)._invokeQueue);
	        });

	        if (opts.inject) {
	            injector.invoke(opts.inject);
	        }

	        if (providerType) {
	            // Loop through invokeQueue, find this provider's dependencies and prefix
	            // them so Angular will inject the mocked versions
	            angular.forEach(invokeQueue, function(providerData) {
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

	        angular.forEach(invokeQueue, function(providerData) {
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
	                    var toReturn = controllerHandler
	                        .addModules(opts.mockModules.concat(opts.moduleName))
	                        .bindWith(opts.controller.bindToController)
	                        .setScope(opts.controller.parentScope)
	                        .setLocals(mocks)
	                        .new(opts.providerName, opts.controller.controllerAs);
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
	        options.controller = extend(options.controller, controllerDefaults(angular.isDefined(options.controller)));
	        return options;
	    }

	    function spyOnProviderMethods(provider) {
	        angular.forEach(provider, function(property, propertyName) {
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
	        angular.forEach(invokeQueue, function(providerData) {
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
	        angular.forEach(htmlAttrs, function(val, attr) {
	            if (attr !== '$content' && attr !== '$tag') {
	                html += snake_case(attr) + (val ? ('="' + val + '" ') : ' ');
	            }
	        });
	        html += htmlContent ? ('>' + htmlContent) : '>';
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
	        return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
	            return (pos ? separator : '') + letter.toLowerCase();
	        });
	    }

	    window.quickmock = quickmock;

	    return quickmock;

	})(angular);

	module.export = window.quickmock;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var controllerHandler = __webpack_require__(3);

	/* Should return true 
	 * for objects that wouldn't fail doing
	 * Array.prototype.slice.apply(myObj);
	 * which returns a new array (reference-wise)
	 * Probably needs more specs
	 */
	function isArrayLike(item) {
	    return Array.isArray(item) ||
	        (!!item &&
	            typeof item === "object" &&
	            item.hasOwnProperty("length") &&
	            typeof item.length === "number" &&
	            item.length >= 0
	        ) ||
	        Object.prototype.toString.call(item) === '[object Arguments]';
	}


	function createSpy(callback) {
	    if (!callback) {
	        callback = angular.noop;
	    }
	    var startTime = new Date().getTime();
	    var endTime;
	    var toReturn = spyOn({
	        a: function() {
	            callback.apply(callback, arguments);
	            endTime = new Date().getTime();
	        }
	    }, 'a').and.callThrough();
	    toReturn.took = function() {
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
	    var current;
	    while ((current = values.shift())) {
	        $$extend(destination, current);
	    }
	    return destination;
	}

	var scopeHelper = (function() {
	    var rootScope = angular.injector(['ng']).get('$rootScope');

	    function getRootFromScope(scope) {
	        if (scope.$root) {
	            return scope.$root;
	        }
	        var parent;
	        while ((parent = scope.$parent)) {
	            if (parent.$root) {
	                return parent.$root;
	            }
	        }
	        return parent;
	    }
	    var toReturn = {
	        create: function(scope) {
	            scope = scope || {};
	            if (toReturn.isScope(scope)) {
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
	        },
	        isScope: function(object) {
	            return object && getRootFromScope(object) === getRootFromScope(rootScope) && object;
	        },
	        $rootScope: rootScope,
	        isController: function(object) {
	            return object instanceof controllerHandler.controllerType;
	        }
	    };
	    return toReturn;
	})();

	function getFunctionName(myFunction) {
	    var toReturn = /^function\s+([\w\$]+)\s*\(/.exec(myFunction.toString())[1];
	    if (toReturn === '' || toReturn === 'anon') {
	        return new Date().getTime().toString();
	    }
	    return toReturn;
	}

	function sanitizeModules() {
	    modules = makeArray.apply(undefined, arguments);
	    var index;
	    if (
	        (index = modules.indexOf('ng')) === -1 &&
	        (index = modules.indexOf('angular')) === -1) {
	        modules.unshift('ng');
	    }
	    if (index !== -1) {
	        modules.unshift(modules.splice(index, 1)[0] && 'ng');
	    }
	    return modules;
	}

	module.exports = {
	    'sanitizeModules': sanitizeModules,
	    'getFunctionName': getFunctionName,
	    'scopeHelper': scopeHelper,
	    'extend': extend,
	    'makeArray': makeArray,
	    'createSpy': createSpy,
	    'isArrayLike': isArrayLike
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var $_CONTROLLER = $_CONTROLLER;
	var scopeHelper = scopeHelper;
	if (true) {
	    $_CONTROLLER = __webpack_require__(4);
	    scopeHelper = __webpack_require__(2).scopeHelper;
	}
	var controllerHandler = (function() {
	    var internal = false;
	    var myModules, ctrlName, cLocals, pScope, cScope, cName, bindToController;

	    var $rootScope = angular.injector(['ng']).get('$rootScope');

	    function clean() {
	        myModules = [];
	        ctrlName = pScope = cLocals = cScope = scopeControllerName = bindToController = undefined;
	        return $controllerHandler;
	    }

	    function cleanExpressionForAssignment(expression, controllerName, bindings) {
	        if (!controllerName) {
	            return {
	                value: expression
	            };
	        }
	        expression = expression.replace(controllerName + '.', '');
	        for (var key in bindings) {
	            if (bindings.hasOwnProperty(key)) {
	                if (expression.indexOf(key) !== -1) {
	                    expression = expression.replace(key, PARSE_BINDING_REGEX.exec(bindings[key])[2] || key);
	                    return expression;
	                }
	            }
	        }
	    }


	    function $controllerHandler() {

	        if (!ctrlName) {
	            throw 'Please provide the controller\'s name';
	        }
	        pScope = scopeHelper.create(pScope || {});
	        if (!cScope) {
	            cScope = pScope.$new();
	        } {
	            var tempScope = scopeHelper.isScope(cScope);
	            if (tempScope !== false) {
	                cScope = tempScope;
	            }
	        }

	        var toReturn = new $_CONTROLLER(ctrlName, pScope, bindToController, myModules, cName, cLocals);
	        clean();
	        return toReturn;
	    }
	    $controllerHandler.bindWith = function(bindings) {
	        bindToController = bindings;
	        return $controllerHandler;
	    };
	    $controllerHandler.controllerType = $_CONTROLLER;
	    $controllerHandler.clean = clean;
	    $controllerHandler.setScope = function(newScope) {
	        pScope = newScope;
	        return $controllerHandler;
	    };
	    $controllerHandler.setLocals = function(locals) {
	        cLocals = locals;
	        return $controllerHandler;
	    };

	    $controllerHandler.$rootScope = scopeHelper.$rootScope;

	    $controllerHandler.addModules = function(modules) {
	        function pushArray(array) {
	            Array.prototype.push.apply(myModules, array);
	        }
	        if (angular.isString(modules)) {
	            if (arguments.length > 1) {
	                pushArray(makeArray(arguments));
	            } else {
	                pushArray([modules]);
	            }
	        } else if (isArrayLike(modules)) {
	            pushArray(makeArray(modules));
	        }
	        return $controllerHandler;
	    };
	    $controllerHandler.isInternal = function(flag) {
	        if (angular.isUndefined(flag)) {
	            return internal;
	        }
	        internal = !!flag;
	        return function() {
	            internal = !flag;
	        };
	    };
	    $controllerHandler.new = function(controllerName, scopeControllersName, parentScope, childScope) {
	        ctrlName = controllerName;
	        if (scopeControllersName && !angular.isString(scopeControllersName)) {
	            pScope = scopeHelper.isScope(scopeControllersName);
	            cScope = scopeHelper.isScope(parentScope) || cScope;
	            cName = 'controller';
	        } else {
	            pScope = scopeHelper.create(parentScope || pScope);
	            cScope = scopeHelper.create(childScope || pScope.$new());
	            cName = scopeControllersName;
	        }
	        return $controllerHandler();
	    };
	    $controllerHandler.newService = function(controllerName, controllerAs, parentScope, bindings) {
	        var toReturn = $controllerHandler.new(controllerName, controllerAs, parentScope);
	        toReturn.bindings = bindings;
	        return toReturn;
	    };
	    return $controllerHandler;
	})();

	module.export = controllerHandler;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var scopeHelper = __webpack_require__(2).scopeHelper;
	var $_CONTROLLER = (function() {
	    var $parse = angular.injector(['ng']).get('$parse');
	    var ngClick;

	    function assertNotDefined(obj, args) {
	        var key;
	        while ((key = args.shift()))
	            if (typeof obj[key] === 'undefined' || obj[key] === null)
	                throw ['"', key, '" property cannot be null'].join("");
	    }

	    function assert_$_CONTROLLER(obj) {
	        assertNotDefined(obj, [
	            'parentScope',
	            'bindings',
	            'controllerScope'
	        ]);
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

	    function _$_CONTROLLER(ctrlName, pScope, bindings, modules, cName, cLocals) {
	        this.providerName = ctrlName;
	        this.scopeControllerName = cName || 'controller';
	        this.usedModules = modules.slice();
	        this.parentScope = pScope;
	        this.controllerScope = this.parentScope.$new();
	        this.bindings = bindings;
	        this.locals = extend(cLocals || {}, {
	            $scope: this.controllerScope
	        }, false);
	        this.pendingWatchers = [];
	    }
	    _$_CONTROLLER.prototype = {
	        controllerInstance: undefined,
	        controllerConstructor: undefined,
	        bindings: undefined,
	        $rootScope: scopeHelper.$rootScope,
	        InternalSpies: {
	            Scope: {},
	            Controller: {}
	        },
	        $apply: function() {
	            this.$rootScope.$apply();
	        },
	        $destroy: function() {
	            delete this.$rootScope;
	            this.parentScope.$destroy();
	            clean(this);
	        },
	        create: function(bindings) {
	            this.bindings = angular.isDefined(bindings) && bindings !== null ? bindings : this.bindings;
	            assert_$_CONTROLLER(this);
	            this.controllerConstructor =
	                controller.$get(this.usedModules)
	                .create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
	            this.controllerInstance = this.controllerConstructor();
	            var watcher, self = this;
	            while ((watcher = this.pendingWatchers.shift())) {
	                this.watch.apply(this, watcher);
	            }
	            for (var key in this.bindings) {
	                if (this.bindings.hasOwnProperty(key)) {
	                    var result = PARSE_BINDING_REGEX.exec(this.bindings[key]),
	                        scopeKey = result[2] || key,
	                        spyKey = [scopeKey, ':', key].join('');
	                    if (result[1] === '=' && !controllerHandler.isInternal()) {
	                        var destroyer = this.watch(key, this.InternalSpies.Scope[spyKey] = createSpy(), self.controllerInstance);
	                        var destroyer2 = this.watch(scopeKey, this.InternalSpies.Controller[spyKey] = createSpy(), self.parentScope);
	                        /* jshint ignore:start */
	                        this.parentScope.$on('$destroy', function() {
	                            destroyer();
	                            destroyer2();
	                        });
	                        /* jshint ignore:end */
	                    }
	                }
	            }
	            this.create = undefined;
	            return this.controllerInstance;
	        },
	        watch: function(expression, callback, object) {
	            if (!this.controllerInstance) {
	                this.pendingWatchers.push(arguments);
	                return this;
	            }
	            return this.controllerScope.$watch(expression, callback);
	        },
	        ngClick: function(expression) {
	            return this.createDirective('ng-click', expression);
	        },
	        createDirective: function(name, expression) {
	            var directive = directiveProvider.$get(arguments[0]);
	            var args = makeArray(arguments);
	            args[0] = this;
	            return directive.compile.apply(undefined, arguments);
	        },
	        compileHTML: function(htmlText) {
	            return new directiveHandler(this, htmlText);
	        }
	    };
	    return _$_CONTROLLER;
	})();

/***/ }
/******/ ]);