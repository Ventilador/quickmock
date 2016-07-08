'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('controllerQM.js');


var $parse = angular.injector(['ng']).get('$parse');

var controller = function () {
    function controller() {
        _classCallCheck(this, controller);
    }

    _createClass(controller, null, [{
        key: 'parseBindings',
        value: function parseBindings(bindings, scope, isolateScope, controllerAs, locals) {
            var assignBindings = function assignBindings(destination, scope, key, mode) {
                mode = mode || '=';
                var result = _common.PARSE_BINDING_REGEX.exec(mode);
                mode = result[1];
                var parentKey = result[2] || key;
                var childKey = controllerAs + '.' + key;
                var unwatch;

                (function () {
                    switch (mode) {
                        case '=':
                            var parentGet = $parse(parentKey);
                            var childGet = $parse(childKey);
                            var lastValue = void 0;
                            childGet.assign(destination, lastValue = parentGet(scope));
                            var parentValueWatch = function parentValueWatch() {
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
                            unwatch = scope.$watch(parentValueWatch);

                            destination.$on('$destroy', unwatch);
                            break;
                        case '&':
                            destination[key] = function (locals) {
                                return $parse(scope[parentKey])(scope, locals);
                            };
                            break;
                        case '@':

                            var isExp = _common.isExpression.exec(scope[parentKey]);
                            if (isExp) {
                                (function () {
                                    var parentGet = $parse(isExp[1]);
                                    var childGet = $parse(childKey);
                                    var parentValue = parentGet(scope);
                                    var lastValue = parentValue;
                                    var parentValueWatch = function parentValueWatch() {
                                        parentValue = parentGet(scope);
                                        if (parentValue !== lastValue) {
                                            childGet.assign(destination, lastValue = parentValue);
                                        }
                                        return lastValue;
                                    };
                                    scope.$watch(parentValueWatch);
                                    var unwatch = scope.$watch(parentValueWatch);
                                    destination.$on('$destroy', unwatch);
                                })();
                            } else {
                                destination[key] = (scope[parentKey] || '').toString();
                            }
                            break;
                        default:
                            throw 'Could not apply bindings';
                    }
                })();

                return destination;
            };
            var overwriteWithLocals = function overwriteWithLocals(destination) {
                for (var key in locals) {
                    if (locals.hasOwnProperty(key) && key !== controllerAs && key !== '$scope') {
                        destination[key] = locals[key];
                    }
                }
            };
            var destination = _common.scopeHelper.create(isolateScope || scope.$new());
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
                for (var _key in bindings) {
                    if (bindings.hasOwnProperty(_key)) {
                        assignBindings(destination, scope, _key, bindings[_key]);
                    }
                }
                overwriteWithLocals(destination);
                return destination;
            }
            throw 'Could not parse bindings';
        }
    }, {
        key: '$get',
        value: function $get(moduleNames) {
            var $controller = void 0;
            angular.injector((0, _common.sanitizeModules)(moduleNames)).invoke(['$controller', function (controller) {
                $controller = controller;
            }]);

            function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
                scope = _common.scopeHelper.create(scope);
                scopeControllerName = scopeControllerName || 'controller';
                var locals = (0, _common.extend)(extendedLocals || {}, {
                    $scope: _common.scopeHelper.create(scope).$new()
                }, false);

                var constructor = $controller(controllerName, locals, true, scopeControllerName);
                constructor.provideBindings = function (b, myLocals) {
                    locals = myLocals || locals;
                    b = b || bindings;

                    (0, _common.extend)(constructor.instance, controller.parseBindings(bindings, scope, locals.$scope, scopeControllerName, locals));
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
    }]);

    return controller;
}();

exports.default = controller;

console.log('controllerQM.js end');