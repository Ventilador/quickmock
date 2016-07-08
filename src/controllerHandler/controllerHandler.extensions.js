var scopeHelper = require('./../controller/common.js').scopeHelper;
var $_CONTROLLER = (function() {
    const $parse = angular.injector(['ng']).get('$parse');
    let ngClick;

    function assertNotDefined(obj, args) {
<<<<<<< HEAD
        var key;
        while ((key = args.shift()))
=======
        let key;
        while (key = args.shift())
>>>>>>> parent of 259f405... Changed let const to var for proteus
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
<<<<<<< HEAD
            var watcher, self = this;
            while ((watcher = this.pendingWatchers.shift())) {
=======
            let watcher, self = this;
            while (watcher = this.pendingWatchers.shift()) {
>>>>>>> parent of 259f405... Changed let const to var for proteus
                this.watch.apply(this, watcher);
            }
            for (var key in this.bindings) {
                if (this.bindings.hasOwnProperty(key)) {
                    let result = PARSE_BINDING_REGEX.exec(this.bindings[key]),
                        scopeKey = result[2] || key,
                        spyKey = [scopeKey, ':', key].join('');
                    if (result[1] === '=' && !controllerHandler.isInternal()) {
<<<<<<< HEAD
                        var destroyer = this.watch(key, this.InternalSpies.Scope[spyKey] = createSpy(), self.controllerInstance);
                        var destroyer2 = this.watch(scopeKey, this.InternalSpies.Controller[spyKey] = createSpy(), self.parentScope);
                        /* jshint ignore:start */
=======
                        const destroyer = this.watch(key, this.InternalSpies.Scope[spyKey] = createSpy(), self.controllerInstance);
                        const destroyer2 = this.watch(scopeKey, this.InternalSpies.Controller[spyKey] = createSpy(), self.parentScope);
>>>>>>> parent of 259f405... Changed let const to var for proteus
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
<<<<<<< HEAD
        createDirective: function(name, expression) {
            var directive = directiveProvider.$get(arguments[0]);
            var args = makeArray(arguments);
            args[0] = this;
=======
        createDirective: function(name, expression, args) {
            const directive = directiveProvider.$get(arguments[0]);
            arguments[0] = this;
>>>>>>> parent of 259f405... Changed let const to var for proteus
            return directive.compile.apply(undefined, arguments);
        },
        compileHTML: function(htmlText) {
            return new directiveHandler(this, htmlText);
        }
    };
    return _$_CONTROLLER;
})();