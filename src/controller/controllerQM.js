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
            const result = PARSE_BINDING_REGEX.exec(mode);
            mode = result[1];
            const parentKey = result[2] || key;
            const childKey = controllerAs + '.' + key;
            switch (mode) {
                case '=':
                    const parentGet = $parse(parentKey);
                    const childGet = $parse(childKey);
                    let lastValue;
                    childGet.assign(destination, lastValue = parentGet(scope));
                    const parentValueWatch = function() {
                        let parentValue = parentGet(scope);
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
                    let result = isExpression.exec(scope[parentKey]);
                    if (result) {
                        const parentGet = $parse(result[1]);
                        const childGet = $parse(childKey);
                        const parentValueWatch = function() {
                            let parentValue = parentGet(scope);
                            childGet.assign(destination, parentValue);
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
        const toReturn = scopeHelper.create(isolateScope || {});
        if (!bindings) {
            return {};
        } else if (bindings === true || angular.isString(bindings) && bindings === '=') {
            for (var key in scope) {
                if (scope.hasOwnProperty(key) && !key.startsWith('$')) {
                    assignBindings(toReturn, scope, key);
                }
            }
            return toReturn;
        } else if (angular.isObject(bindings)) {
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    assignBindings(toReturn, scope, key, bindings[key]);
                }
            }
            return toReturn;
        } else if (isArrayLike(bindings)) {
            bindings = makeArray(bindings);
            for (var index = 0; index < bindings.length; index++) {
                const key = bindings[index];
                assignBindings(toReturn, scope, key);
            }
            return toReturn;
        }
        throw 'Could not parse bindings';

    }


    this.$get = function(moduleNames) {
        let $controller, $rootScope = scopeHelper.$rootScope;
        angular.injector(sanitizeModules(moduleNames)).invoke(
            ['$controller',
                function(controller) {
                    $controller = controller;
                }
            ]);

        function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
            scope = scopeHelper.create(scope);
            scopeControllerName = scopeControllerName || 'controller';
            let locals = extend(extendedLocals || {}, {
                $scope: scopeHelper.create(scope).$new()
            }, false);

            const constructor = $controller(controllerName, locals, true, scopeControllerName);
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