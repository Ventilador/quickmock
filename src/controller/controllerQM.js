import {
    extend,
    scopeHelper,
    makeArray,
    PARSE_BINDING_REGEX,
    isExpression,
    expressionSanitizer,
    annotate,
    compile
} from './common.js';
var a = { n: angular.nopp };
var d = {};
const $parse = angular.injector(['ng']).get('$parse');

class controller {
    static getValues(scope, bindings) {
        const toReturn = {};
        if (!angular.isObject(bindings)) {
            if (bindings === true || bindings === '=') {
                bindings = (() => {
                    const toReturn = {};
                    for (var key in scope) {
                        if (scope.hasOwnProperty(key) && !key.startsWith('$')) {
                            toReturn[key] = '=';
                        }
                    }
                    return toReturn;
                })();
            } else if (bindings === false) {
                return toReturn;
            }
        }
        for (var key in bindings) {
            if (bindings.hasOwnProperty(key)) {
                const result = PARSE_BINDING_REGEX.exec(bindings[key]);
                const mode = result[1];
                const optional = result[2];
                const parentKey = result[3] || key;
                const parentGet = $parse(parentKey);
                let tempValue;
                switch (mode) {
                    case '<':
                    case '=':
                        tempValue = parentGet(scope);
                        if (optional && (tempValue === undefined || tempValue === null)) {
                            break;
                        }
                        toReturn[key] = parentGet(scope);
                        break;
                    case '&':
                        let parentValue = parentGet(scope);
                        let fn;
                        if ((parentValue === undefined || parentValue === null) && !optional) {
                            fn = function (s, l) { return a.n(s, l, d); };
                        } else if (typeof parentValue === 'function') {
                            parentValue = annotate(parentValue);
                        }
                        if (typeof parentValue === 'object') {
                            fn = compile(parentValue, $parse);
                        } else if (typeof parentValue === 'string') {
                            fn = $parse(parentValue);
                        }
                        if (typeof fn === 'function') {
                            toReturn[key] = (locals) => {
                                return fn(scope, locals);
                            };
                        }
                        break;
                    case '@':
                        let exp = parentGet(scope);
                        const notExp = !isExpression(exp);
                        if (notExp && (exp || !optional)) {
                            toReturn[key] = exp;
                        }
                        break;
                    default:
                        throw 'Could not apply bindings';
                }
            }
        }
        return toReturn;
    }
    static parseBindings(bindings, scope, isolateScope, controllerAs) {
        const assignBindings = (destination, scope, key, mode) => {
            mode = mode || '=';
            const result = PARSE_BINDING_REGEX.exec(mode);
            mode = result[1];
            const parentKey = result[3] || key;
            const childKey = controllerAs + '.' + key;
            let parentGet = $parse(parentKey);
            const childGet = $parse(childKey);
            switch (mode) {
                case '=':
                    let lastValue = parentGet(scope);
                    destination.$watch(() => {
                        let parentValue = parentGet(scope);
                        if (parentValue !== lastValue) {
                            childGet.assign(destination, parentValue);
                        } else if (parentValue !== (parentValue = childGet(destination))) {
                            parentGet.assign(scope, parentValue);
                        }
                        lastValue = parentValue;
                        return lastValue;
                    });
                    break;
                case '&':
                    break;
                case '@':
                    let isExp = isExpression(scope[parentKey]);
                    if (isExp) {
                        let exp = parentGet(scope);
                        parentGet = $parse(expressionSanitizer(exp));
                        let lastValue = function () { };
                        destination.$watch(() => {
                            if (lastValue !== (lastValue = parentGet(scope))) {
                                childGet.assign(destination, lastValue);
                            } else if (lastValue !== childGet(destination)) {
                                childGet.assign(destination, lastValue);

                            }
                            return lastValue;
                        });
                    }
                    break;
                case '<':
                    let lastParentValue = parentGet(scope);
                    let lastChildValue = lastParentValue;
                    let watcher = destination.$watch(() => {
                        let lastValue = parentGet(scope);
                        if (lastValue !== lastParentValue) {
                            childGet.assign(destination, lastChildValue = lastParentValue = lastValue);
                        } else if (lastChildValue !== (lastChildValue = childGet(destination))) {
                            watcher = watcher();
                        }
                        return lastValue;
                    });
                    break;
                default:
                    throw 'Could not apply bindings';
            }
            return destination;
        };

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
            for (let key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    assignBindings(destination, scope, key, bindings[key]);
                }
            }
            return destination;
        }
        throw 'Could not parse bindings';
    }

    static $get(moduleNames) {
        let $controller;
        const array = makeArray(moduleNames);
        angular.injector(array).invoke(
            ['$controller',
                (controller) => {
                    $controller = controller;
                }
            ]);
        let lastScope;

        function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
            scope = scopeHelper.create(scope);
            scopeControllerName = scopeControllerName || 'controller';
            extendedLocals = extendedLocals || {
                $scope: scopeHelper.create(scope).$new()
            };
            const constructor = () => {
                if (lastScope) {
                    lastScope.$destroy();
                }
                lastScope = scope;
                const constructor = $controller(controllerName, extendedLocals, true, scopeControllerName);
                extend(constructor.instance, controller.getValues(scope, bindings));
                const toReturn = constructor();
                controller.parseBindings(bindings, scope, extendedLocals.$scope, scopeControllerName);
                return toReturn;
            };
            return constructor;
        }
        return {
            create: createController
        };
    }
}
export default controller;