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
        this.scopeControllerName = cName;
        this.usedModules = modules.slice();
        this.parentScope = pScope;
        this.controllerScope = this.parentScope.$new();
        this.bindings = bindings;
        this.locals = cLocals;
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
            const constructor = controller.$get(this.usedModules);
            this.controllerConstructor = constructor.create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
            this.controllerInstance = this.controllerConstructor();
            let watcher, self = this;
            while (watcher = this.pendingWatchers.shift()) {
                this.watch.apply(this, watcher);
            }
            for (var key in this.bindings) {
                if (this.bindings.hasOwnProperty(key)) {
                    let result = PARSE_BINDING_REGEX.exec(this.bindings[key]),
                        ctrlkey = key,
                        scopeKey = result[2] || key,
                        expression = $parse(ctrlkey),
                        assign = $parse(scopeKey).assign,
                        spyKey = [scopeKey, ':', ctrlkey].join('');
                    if (result[1] === '=') {
                        if (!controllerHandler.isInternal()) {
                            this.InternalSpies.Controller[spyKey] = decorateSpy(function(newValue) {
                                expression.assign(self.controllerInstance, newValue);
                            });
                            this.InternalSpies.Scope[spyKey] = decorateSpy(function(newValue) {
                                assign(self.parentScope, newValue);
                            });
                        }
                        const destroyer = this.watch(expression, {}, this.InternalSpies.Scope[spyKey], function() {
                            return self.controllerInstance
                        }, 'internal');
                        this.parentScope.$on('$destroy', function() {
                            destroyer();
                            console.log('destroyed');
                        });
                    }
                }
            }
            return this.controllerInstance;
        },
        watch: function(expression, locals, callback, object, watchType) {
            object = object.call(this);
            return (scopeHelper.isScope(object) || this.controllerScope).$watch(function() {
                return expression(object, locals)
            }, callback);
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

            this.controllerToScopeSpies[expressionText] = decorateSpy(decorateCallback);
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