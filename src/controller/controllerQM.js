var controller = (function(angular) {
    var $parse, self = this;
    angular.injector(['ng']).invoke(['$parse', function(parse) {
        $parse = parse;
    }]);

    function $$controller(moduleNames) {
        var self = this;
        return {};
    };

    function parseBindings(bindings, scope) {
        function assignBindins(destination, value, key, mode) {
            mode = mode || '=';
            switch (mode) {
                case '=':
                    destination[key] = value;
                    break;
                case '&':
                    destination[key] = $parse(value)(scope);
                    break;
                case '@':
                    destination[key] = (value || '').toString();
                    break;
                default:
                    throw 'Could not apply bindings';
            }
        }
        const toReturn = scope;
        if (!bindings) {
            return {};
        } else if (bindings === true || angular.isString(bindings) && bindings === '=') {
            return toReturn;
        } else if (angular.isObject(bindings)) {
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    assignBindins(toReturn, scope[key], key, bindings[key]);
                }
            }
            return toReturn;
        } else if (isArrayLike(bindings)) {
            bindings = makeArray(bindings);
            for (var index = 0; index < bindings.length; index++) {
                const key = bindings[index];
                assignBindins(toReturn, scope[key], key);
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

        function createController(controllerName, scope, bindings, scopeControllerName) {
            scope = scope || {};
            scopeControllerName = scopeControllerName || 'controller';
            const locals = {
                $scope: scopeHelper.create(scope)
            }
            const constructor = $controller(controllerName, locals, true, scopeControllerName);
            extend(constructor.instance, parseBindings(bindings, scope));
            return constructor();
        };
        return {
            create: createController
        };
    };
    return this;
})(angular);