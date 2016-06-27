var controllerHandler = (function() {
    var internal = false;
    let myModules, ctrlName, cLocals, pScope, cScope, cName, bindToController,
        watchers = {},
        pendingWatchers = [];
    const $parse = angular.injector(['ng']).get('$parse');
    const $rootScope = angular.injector(['ng']).get('$rootScope');

    function clean() {
        myModules = [];
        ctrlName = pScope = cLocals = cScope = scopeControllerName = bindToController = undefined;
        watchers = {};
        pendingWatchers.length = 0;
    }

    function cleanExpressionForAssignment(expression, controllerName, bindings) {
        if (!controllerName) {
            return {
                value: expression
            }
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

    function addWatch(watchDestructor, watchType) {
        watchers[watchType] = watchers[watchType] || new HashMap();

        const decoratedWatcher = function() {
            const toDestroy = watchers[watchType].remove(decoratedWatcher);
            toDestroy.destructor();
        }
        watchers[watchType].put(decoratedWatcher, {
            destructor: watchDestructor
        });
        return decoratedWatcher;
    }

    function $controllerHandler() {
        const constructor = controller.$get(myModules);
        if (!ctrlName) {
            throw 'Please provide the controller\'s name';
        }
        pScope = pScope || $rootScope;
        if (!cScope) {
            cScope = pScope.$new();;
        } {
            const tempScope = scopeHelper.isScope(cScope);
            if (tempScope !== false) {
                cScope = tempScope;
            }
        }

        function $digest(onObject) {
            if (angular.isFunction(onObject.$apply)) {
                onObject.$apply();
            }
        }


        const toReturn = {
            controllerInstance: undefined,
            controllerConstructor: undefined,
            parentScope: pScope,
            controllerScope: cScope,
            bindings: bindToController,
            usedModules: myModules.slice(),
            InternalSpies: {
                Scope: {},
                Controller: {}
            },
            scopeControllerName: cName,
            $apply: function() {
                if (this.controllerScope) {
                    $digest(this.controllerScope)
                }
            },
            $rootApply: function() {
                $rootScope.$apply();
            },
            providerName: ctrlName,
            controllerToScopeSpies: {},
            create: function(bindings, scope) {
                this.parentScope = scope ? scopeHelper.create(scope) : scopeHelper.create(this.parentScope);
                this.controllerScope = this.parentScope.$new();
                this.bindings = this.bindings || bindings;
                this.controllerConstructor = constructor.create(this.providerName, this.controllerScope, this.bindings, this.scopeControllerName, cLocals);
                this.controllerInstance = this.controllerConstructor();
                let watcher;
                while (watcher = pendingWatchers.shift()) {
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
                            if (!$controllerHandler.isInternal()) {
                                this.InternalSpies.Scope[spyKey] = decorateSpy(function(oldValue, newValue) {
                                    assign(toReturn.parentScope, newValue);
                                });
                                this.InternalSpies.Controller[spyKey] = decorateSpy(function(oldValue, newValue) {
                                    expression.assign(toReturn.controllerInstance, newValue);
                                });
                            }
                            const destroyer = this.watch(expression, {}, this.InternalSpies.Scope[spyKey], function() {
                                return this.controllerInstance
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
                const tempWatcher = addWatch((scopeHelper.isScope(object) || this.controllerScope).$watch(function() {
                    return expression(object, locals)
                }, callback), watchType);
                return tempWatcher;
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
                    pendingWatchers.push(data);
                    return this;
                }
                return Function.call(this.watch, data);
            }
        };
        clean();
        return toReturn;
    }
    $controllerHandler.bindWith = function(bindings) {
        bindToController = bindings;
        return $controllerHandler;
    };
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
        }
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
    }
    return $controllerHandler;
})();