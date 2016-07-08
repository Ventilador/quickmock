console.log('controllerQM.js');
import {
    extend,
    scopeHelper,
    makeArray,
    PARSE_BINDING_REGEX,
    isExpression

} from './common.js';

var $parse = angular.injector(['ng']).get('$parse');

class controller {
    static parseBindings(bindings, scope, isolateScope, controllerAs, locals) {
        const assignBindings = (destination, scope, key, mode) => {
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
                    scope.$watch(parentValueWatch);
                    var unwatch = scope.$watch(parentValueWatch);
                    destination.$on('$destroy', unwatch);
                    break;
                case '&':
                    destination[key] = (locals) => {
                        return $parse(scope[parentKey])(scope, locals);
                    };
                    break;
                case '@':

                    let isExp = isExpression.exec(scope[parentKey]);
                    if (isExp) {
                        const parentGet = $parse(isExp[1]);
                        const childGet = $parse(childKey);
                        let parentValue = parentGet(scope);
                        let lastValue = parentValue;
                        const parentValueWatch = () => {
                            parentValue = parentGet(scope);
                            if (parentValue !== lastValue) {
                                childGet.assign(destination, lastValue = parentValue);
                            }
                            return lastValue;
                        };
                        scope.$watch(parentValueWatch);
                        const unwatch = scope.$watch(parentValueWatch);
                        destination.$on('$destroy', unwatch);
                    } else {
                        destination[key] = (scope[parentKey] || '').toString();
                    }
                    break;
                default:
                    throw 'Could not apply bindings';
            }
            return destination;
        };
        const overwriteWithLocals = (destination) => {
            for (var key in locals) {
                if (locals.hasOwnProperty(key) && key !== controllerAs && key !== '$scope') {
                    destination[key] = locals[key];
                }
            }
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
            overwriteWithLocals(destination);
            return destination;
        } else if (angular.isObject(bindings)) {
            for (let key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    assignBindings(destination, scope, key, bindings[key]);
                }
            }
            overwriteWithLocals(destination);
            return destination;
        }
        throw 'Could not parse bindings';
    }

    static $get(moduleNames) {
        let $controller;
        angular.injector(makeArray(moduleNames)).invoke(
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

            const constructor = $controller(controllerName, locals, true, scopeControllerName);
            constructor.provideBindings = (b, myLocals) => {
                locals = myLocals || locals;
                b = b || bindings;

                extend(constructor.instance, controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName, locals));
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
console.log('controllerQM.js end');