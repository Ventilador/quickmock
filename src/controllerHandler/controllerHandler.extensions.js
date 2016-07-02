var $_CONTROLLER = (function() {
    const $parse = angular.injector(['ng']).get('$parse');

    function assertNotDefined(obj, args) {
        let key;
        while (key = args.shift())
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
        controllerToScopeSpies: {},
        create: function(bindings) {
            assert_$_CONTROLLER(this);
            this.controllerConstructor =
                controller.$get(this.usedModules)
                .create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
            this.controllerInstance = this.controllerConstructor();
            let watcher, self = this;
            while (watcher = this.pendingWatchers.shift()) {
                this.watch.apply(this, watcher);
            }
            for (var key in this.bindings) {
                if (this.bindings.hasOwnProperty(key)) {
                    let result = PARSE_BINDING_REGEX.exec(this.bindings[key]),
                        scopeKey = result[2] || key,
                        spyKey = [scopeKey, ':', key].join('');
                    if (result[1] === '=' && !controllerHandler.isInternal()) {
                        const destroyer = this.watch(key, this.InternalSpies.Scope[spyKey] = createSpy(), self.controllerInstance);
                        const destroyer2 = this.watch(scopeKey, this.InternalSpies.Controller[spyKey] = createSpy(), self.parentScope);
                        this.parentScope.$on('$destroy', function() {
                            destroyer();
                            destroyer2();
                        });
                    }
                }
            }
            return this.controllerInstance;
        },
        watch: function(expression, callback, object) {
            object = angular.isFunction(object) ? object.call(this) : object;
            const scope = scopeHelper.isScope(object) || this.controllerScope;
            const fn = scope === object ? expression : $parse(expression);
            return scope.$watch(fn, callback);
        },
        watchController: function(expression, locals, callback, spy) {
            let assign,
                expressionText = angular.isString(expression) ? expression : getFunctionName(expression);
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (angular.isFunction(locals)) {
                callback = locals;
                locals = {};
            }
            if (!angular.isFunction(callback)) {
                throw 'Callback is not a function';
            }
            const startingTime = new Date().getTime();
            let endTime;

            function decorateCallback() {
                if (angular.isFunction(spy)) {
                    spy.apply(spy, arguments);
                }

                callback.apply(callback, arguments);
                endTime = new Date().getTime();
            }

            this.controllerToScopeSpies[expressionText] = createSpy(decorateCallback);
            const data = [expression, locals, this.controllerToScopeSpies[expressionText], function() {
                return this.controllerInstance
            }, 'controller']
            if (!this.controllerInstance) {
                this.pendingWatchers.push(data);
                return this;
            }
            return Function.call(this.watch, data);
        }
    }
    return _$_CONTROLLER;
})();