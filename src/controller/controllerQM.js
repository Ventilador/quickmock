import {
    extend,
    scopeHelper,
    makeArray,
    PARSE_BINDING_REGEX,
    isExpression,
    expressionSanitizer
} from './common.js';

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
                const parentKey = result[2] || key;
                const parentGet = $parse(parentKey);
                switch (mode) {
                    case '=':
                        toReturn[key] = parentGet(scope);
                        break;
                    case '&':
                        const fn = $parse(parentGet(scope));
                        toReturn[key] = (locals) => {
                            return fn(scope, locals);
                        };
                        break;
                    case '@':
                        let exp = parentGet(scope);
                        const isExp = isExpression(exp);
                        if (isExp) {
                            toReturn[key] = $parse(expressionSanitizer(exp))(scope);
                        } else {
                            toReturn[key] = parentGet(scope);
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
            const parentKey = result[2] || key;
            const childKey = controllerAs + '.' + key;
            let parentGet = $parse(parentKey);
            const childGet = $parse(childKey);
            switch (mode) {
                case '=':
                    let lastValue = parentGet(scope);
                    const parentValueWatch = () => {
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
                    var unwatch = scope.$watch(parentValueWatch);
                    destination.$on('$destroy', unwatch);
                    break;
                case '&':
                    break;
                case '@':
                    let isExp = isExpression(scope[parentKey]);
                    if (isExp) {
                        let exp = parentGet(scope);
                        parentGet = $parse(expressionSanitizer(exp));
                        let parentValue = parentGet(scope);
                        let lastValue = parentValue;
                        const parentValueWatch = () => {
                            parentValue = parentGet(scope, isolateScope);
                            if (parentValue !== lastValue) {
                                childGet.assign(destination, lastValue = parentValue);
                            }
                            return lastValue;
                        };
                        const unwatch = scope.$watch(parentValueWatch);
                        destination.$on('$destroy', unwatch);
                    }
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
        // const indexMock = array.indexOf('ngMock');
        // const indexNg = array.indexOf('ng');
        // if (indexMock !== -1) {
        //     array[indexMock] = 'ng';
        // }
        // if (indexNg === -1) {
        //     array.push('ng');
        // }
        angular.injector(array).invoke(
            ['$controller',
                (controller) => {
                    $controller = controller;
                }
            ]);

        function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
            scope = scopeHelper.create(scope);
            scopeControllerName = scopeControllerName || 'controller';
            let locals = extend(extendedLocals || {}, {
                $scope: scopeHelper.create(scope).$new()
            }, false);

            const constructor = () => {

                const constructor = $controller(controllerName, locals, true, scopeControllerName);
                extend(constructor.instance, controller.getValues(scope, bindings));
                const toReturn = constructor();
                controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName);
                return toReturn;
            };
            constructor.provideBindings = (b) => {
                bindings = b || bindings;
                // locals = myLocals || locals;
                // b = b || bindings;

                // controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName);
                //extend(constructor.instance, extendedLocals);
                return constructor;
            };
            if (bindings) {
                constructor.provideBindings();
            }
            return constructor;
        }
        return {
            create: createController
        };
    }
}
export default controller;