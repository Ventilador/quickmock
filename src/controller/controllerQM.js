var PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var isExpression = /^{{.*}}$/;
var sanitizeModules = require('./common.js').sanitizeModules;
var controller = (function(angular) {
    var $parse = this;
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
<<<<<<< HEAD
                    result = isExpression.exec(scope[parentKey]);
=======
                    let result = isExpression.exec(scope[parentKey]);
>>>>>>> parent of 259f405... Changed let const to var for proteus
                    if (result) {
                        const parentGet = $parse(result[1]);
                        const childGet = $parse(childKey);
                        let parentValue, lastValue = parentValue = parentGet(scope);
                        const parentValueWatch = function() {
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
        const destination = scopeHelper.create(isolateScope || scope.$new());
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
var PARSE_BINDING_REGEX = /^([\=\@\&])(.*)?$/;
var isExpression = /^{{.*}}$/;
module.export = {
    'controller': controller,
    'PARSE_BINDING_REGEX': PARSE_BINDING_REGEX,
    'isExpression': isExpression
};