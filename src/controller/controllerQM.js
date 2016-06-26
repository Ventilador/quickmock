var PARSE_BINDING_REGEX = /([\=\@\&])(.+)?/;
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
        function assignBindings(destination, scope, key, mode) {
            mode = mode || '=';
            const result = PARSE_BINDING_REGEX.exec(mode);
            mode = result[1];
            let sourceKey = result[2] || key;
            switch (mode) {
                case '=':
                    destination[key] = scope[sourceKey];
                    break;
                case '&':
                    destination[key] = $parse(scope[sourceKey])(scope);
                    break;
                case '@':
                    destination[key] = (scope[sourceKey] || '').toString();
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

        function createController(controllerName, scope, bindings, scopeControllerName) {
            scope = scope || {};
            scopeControllerName = scopeControllerName || 'controller';
            const locals = {
                $scope: scopeHelper.create(scope)
            }
            const constructor = $controller(controllerName, locals, true, scopeControllerName);
            constructor.provideBindings = function(b) {
                b = b || bindings;
                extend(constructor.instance, parseBindings(bindings, scope));
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