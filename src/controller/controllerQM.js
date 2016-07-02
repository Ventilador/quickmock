var PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var controller = (function(angular) {
    var $parse, self = this;
    angular.injector(['ng']).invoke(['$parse', function(parse) {
        $parse = parse;
    }]);

    this.parseBindings = function parseBindings(bindings, scope) {
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
                    destination[key] = function(locals) {
                        return $parse(scope[sourceKey])(scope, locals);
                    };
                    break;
                case '@':
                    destination[key] = (scope[sourceKey] || '').toString();
                    break;
                default:
                    throw 'Could not apply bindings';
            }
            return destination;
        }
        const toReturn = {};
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
            scope = scope || {};
            scopeControllerName = scopeControllerName || 'controller';
            if (extendedLocals && extendedLocals.$scope) {
                delete extendedLocals.$scope;
            }
            const locals = extend({
                $scope: scopeHelper.create(scope)
            }, extendedLocals);

            const constructor = $controller(controllerName, locals, true, scopeControllerName);
            constructor.provideBindings = function(b, locals) {
                locals = locals || scope;
                b = b || bindings;
                extend(constructor.instance, parseBindings(bindings, locals));
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