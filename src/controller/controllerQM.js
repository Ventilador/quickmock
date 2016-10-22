import {
    // extend,
    QMAngular,
    PARSE_BINDING_REGEX,
    // isExpression,
    // expressionSanitizer,
    annotate,
    compile
} from './common.js';
var a = { n: angular.nopp };
var d = {};

var $parse, $interpolate;
class controller {
    static assignBindings(destination, bindings, parentScope) {
        const watchRemoveArray = [];
        if (!angular.isObject(bindings)) {
            if (bindings === true || bindings === '=') {
                bindings = (() => {
                    const toReturn = {};
                    for (var key in parentScope) {
                        if (parentScope.hasOwnProperty(key) && !QMAngular.$rootScope[key] && !QMAngular.$rootScope.hasOwnProperty(key)) {
                            toReturn[key] = '=';
                        }
                    }
                    return toReturn;
                })();
            } else if (bindings === false) {
                return angular.noop;
            }
        }
        let result;
        for (var key in bindings) {
            if (bindings.hasOwnProperty(key) && (result = PARSE_BINDING_REGEX.exec(bindings[key]))) {
                const mode = result[1];
                const optional = result[2];
                const parentKey = result[3] || key;
                const childKey = key;
                const parentGet = $parse(parentKey);
                switch (mode) {
                    case '=':
                        let lastValue = parentGet(parentScope);
                        let parentValue = null;
                        if (!optional || lastValue) {
                            destination[childKey] = lastValue;
                        }
                        watchRemoveArray.push(parentScope.$watch(() => {
                            parentValue = parentGet(parentScope);
                            if (parentValue !== lastValue) {
                                destination[childKey] = lastValue = parentValue;
                            } else if (lastValue !== destination[childKey]) {
                                parentGet.assign(parentScope, lastValue = destination[childKey]);
                            }
                            return lastValue;
                        }));
                        break;
                    case '&':
                        let fn = parentGet(parentScope);
                        if ((fn === undefined || fn === null) && !optional) {
                            fn = function (s, l) { return a.n(s, l, d); };
                        } else if (typeof fn === 'function') {
                            fn = annotate(fn);
                        }
                        if (typeof fn === 'object') {
                            fn = compile(fn, $parse);
                        } else if (typeof fn === 'string') {
                            fn = $parse(fn);
                        }
                        if (typeof fn === 'function') {
                            destination[childKey] = (locals) => {
                                return fn(parentScope, locals);
                            };
                        }
                        break;
                    case '@':
                        let expression = $interpolate(parentGet(parentScope));
                        watchRemoveArray.push(parentScope.$watch(expression, function (newValue) {
                            destination[childKey] = newValue;
                        }));
                        const initialVal = expression(parentScope);
                        if (initialVal || !optional) {
                            destination[childKey] = initialVal;
                        }
                        break;
                    case '<':
                        let lastParentValue = parentGet(parentScope), currentValue;
                        if (!optional || lastParentValue) {
                            destination[childKey] = lastParentValue;
                        }
                        watchRemoveArray.push(parentScope.$watch(() => {
                            currentValue = parentGet(parentScope);
                            if (lastParentValue !== currentValue) {
                                destination[childKey] = lastParentValue = currentValue;
                            }
                            return currentValue;
                        }));
                        break;
                    default:
                        throw 'Could not apply bindings';
                }
            }
        }
        return function () {
            while (watchRemoveArray.length) {
                watchRemoveArray.shift()();
            }
        };
    }
    static $get() {
        if (!$parse) {
            $parse = QMAngular.injector.get('$parse');
        }
        if (!$interpolate) {
            $interpolate = QMAngular.injector.get('$interpolate');
        }
        let $controller;
        QMAngular.invoke(
            ['$controller',
                (controller) => {
                    $controller = controller;
                }
            ]);

        function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
            scope = QMAngular.create(scope);
            scopeControllerName = scopeControllerName || 'controller';
            extendedLocals = extendedLocals || {
                $scope: scope.$new()
            };
            const constructor = () => {
                while (QMAngular.$rootScope.$$childHead && QMAngular.$rootScope.$$childHead !== scope) {
                    QMAngular.$rootScope.$$childHead.$destroy();
                }
                while (QMAngular.$rootScope.$$childTail && QMAngular.$rootScope.$$childTail !== scope) {
                    QMAngular.$rootScope.$$childTail.$destroy();
                }

                const constructor = $controller(controllerName, extendedLocals, true, scopeControllerName);
                extendedLocals.$scope.$on('$destroy', controller.assignBindings(constructor.instance, bindings, scope));
                return constructor();
            };
            return constructor;
        }
        return {
            create: createController
        };
    }
}
export default controller;