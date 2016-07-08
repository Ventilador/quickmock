var PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var isExpression = /^{{.*}}$/;
var controller = (function(angular) {
    var $parse, self = this;
    angular.injector(['ng']).invoke(['$parse', function(parse) {
        $parse = parse;
    }]);

    this.parseBindings = function parseBindings(bindings, scope, isolateScope, controllerAs) {
        function assignBindings(destination, scope, key, mode) {
            mode = mode || '=';
            var result = PARSE_BINDING_REGEX.exec(mode);
            mode = result[1];
            var parentKey = result[2] || key;
            var childKey = controllerAs + '.' + key;
            switch (mode) {
                case '=':
                    var parentGet = $parse(parentKey);
                    var childGet = $parse(childKey);
                    var lastValue;
                    childGet.assign(destination, lastValue = parentGet(scope));
                    var parentValueWatch = function() {
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
                    var unwatch = scope.$watch(parentValueWatch);
                    destination.$on('$destroy', unwatch);
                    break;
                case '&':
                    destination[key] = function(locals) {
                        return $parse(scope[parentKey])(scope, locals);
                    };
                    break;
                case '@':
                    var result = isExpression.exec(scope[parentKey]);
                    if (result) {
                        var parentGet = $parse(result[1]);
                        var childGet = $parse(childKey);
                        var parentValue, lastValue = parentValue = parentGet(scope);
                        var parentValueWatch = function() {
                            parentValue = parentGet(scope);
                            if (parentValue !== lastValue) {
                                childGet.assign(destination, lastValue = parentValue);
                            }
                            return lastValue;
                        };
                        scope.$watch(parentValueWatch);
                        var unwatch = scope.$watch(parentValueWatch);
                        destination.$on('$destroy', unwatch);
                    } else {
                        destination[key] = (scope[parentKey] || '').toString();
                    }
                    break;
                default:
                    throw 'Could not apply bindings';
            }
            return destination;
        }
        var destination = scopeHelper.create(isolateScope || scope.$new());
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
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    assignBindings(destination, scope, key, bindings[key]);
                }
            }
            return destination;
        }
        throw 'Could not parse bindings';

    }


    this.$get = function(moduleNames) {
        var $controller, $rootScope = scopeHelper.$rootScope;
        angular.injector(sanitizeModules(moduleNames)).invoke(
            ['$controller',
                function(controller) {
                    $controller = controller;
                }
            ]);

        function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
            scope = scopeHelper.create(scope);
            scopeControllerName = scopeControllerName || 'controller';
            var locals = extend(extendedLocals || {}, {
                $scope: scopeHelper.create(scope).$new()
            }, false);

            var constructor = $controller(controllerName, locals, true, scopeControllerName);
            constructor.provideBindings = function(b, myLocals) {
                locals = myLocals || locals;
                b = b || bindings;

                extend(constructor.instance, parseBindings(bindings, scope, locals.$scope, scopeControllerName));
                return constructor;
            };
            if (bindings) {
                constructor.provideBindings();
            }
            return constructor;
        };
        return {
            create: createController
        };
    };
    return this;
})(angular);