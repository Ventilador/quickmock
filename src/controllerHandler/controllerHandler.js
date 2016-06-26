var controllerHandler = (function() {
    let myModules, ctrlName, pScope, cScope, cName, bindToController,
        watchers = {},
        pendingWatchers = [];
    const $parse = angular.injector(['ng']).get('$parse');

    function clean() {
        myModules = [];
        ctrlName = pScope = scopeControllerName = bindToController = undefined;
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
        pScope = pScope || $controllerHandler.$rootScope;
        if (!cScope) {
            cScope = pScope.$new();;
        }
        cScope = scopeHelper.create(cScope);
        const controllerConstructor = constructor.create(ctrlName, cScope, bindToController, cName);
        const toReturn = {
            controllerInstance: undefined,
            controllerConstructor: controllerConstructor,
            parentScope: pScope,
            controllerScope: cScope,
            bindings: bindToController,
            usedModules: myModules.slice(),
            scopeControllerName: cName,
            create: function(bindings) {
                bindings = bindings || toReturn.bindings;
                toReturn.controllerInstance = controllerConstructor.provideBindings(bindings)();
                let watcher;
                while (watcher = pendingWatchers.shift()) {
                    toReturn.watch.apply(undefined, watcher);
                }
                for (var key in bindings) {
                    if (bindings.hasOwnProperty(key)) {
                        let result = PARSE_BINDING_REGEX.exec(bindings[key]),
                            ctrlkey = key,
                            scopeKey = result[2] || key,
                            expression = $parse(ctrlkey),
                            assign = $parse(scopeKey).assign;
                        if (result[1] === '=') {
                            const destroyer = toReturn.watch(expression, {}, function(oldValue, newValue) {
                                assign(toReturn.controllerScope, newValue);
                            }, function() {
                                return toReturn.controllerInstance
                            }, 'internal');
                            toReturn.controllerScope.$on('$destroy', function() {
                                destroyer();
                                console.log('destroyed');
                            });
                        }
                    }
                }
                return toReturn.controllerInstance;
            },
            watch: function(expression, locals, callback, object, watchType) {
                object = object();
                const tempWatcher = addWatch((scopeHelper.isScope(object) || toReturn.controllerScope).$watch(function() {
                    return expression(object, locals)
                }, callback));
                return tempWatcher;
            },
            watchController: function(expression, locals, callback, spy) {
                let assign; //,scopeExpression = cleanExpressionForAssignment(expression, toReturn.ctrlName, toReturn.bindings);
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

                function decorateCallback() {
                    if (angular.isFunction(spy)) {
                        spy.apply(spy, arguments);
                    }
                    callback.apply(callback, arguments);
                    // if (angular.isObject(scopeExpression)) {
                    //     scopeExpression = cleanExpressionForAssignment(scopeExpression.value, toReturn.scopeControllerName, toReturn.bindings);
                    // }
                    // $parse(scopeExpression).assign(toReturn.controllerScope, arguments[1]);
                }
                const data = [expression, locals, decorateCallback, function() {
                    return toReturn.controllerInstance
                }, 'controller']
                if (!toReturn.controllerInstance) {
                    pendingWatchers.push(data);
                    return toReturn;
                }
                return Function.call(toReturn.watch, data);
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
        cScope = newScope;
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
    $controllerHandler.new = function(controllerName, scopeControllersName, parentScope, childScope) {
        ctrlName = controllerName;
        if (!angular.isString(scopeControllersName)) {
            pScope = scopeHelper.isScope(scopeControllersName);
            cScope = scopeHelper.isScope(parentScope) || cScope;
            cName = 'controller';
        } else {
            pScope = scopeHelper.isScope(parentScope);
            cScope = scopeHelper.isScope(childScope);
            cName = scopeControllersName;
        }
        return $controllerHandler();
    }
    return $controllerHandler;
})();