var scopeHelper = require('./../controller/common.js').scopeHelper;
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