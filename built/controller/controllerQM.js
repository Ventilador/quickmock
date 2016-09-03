'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $parse = angular.injector(['ng']).get('$parse');

var controller = function () {
    function controller() {
        _classCallCheck(this, controller);
    }

    _createClass(controller, null, [{
        key: 'getValues',
        value: function getValues(scope, bindings) {
            var toReturn = {};
            if (!angular.isObject(bindings)) {
                if (bindings === true || bindings === '=') {
                    bindings = function () {
                        var toReturn = {};
                        for (var key in scope) {
                            if (scope.hasOwnProperty(key) && !key.startsWith('$')) {
                                toReturn[key] = '=';
                            }
                        }
                        return toReturn;
                    }();
                } else if (bindings === false) {
                    return toReturn;
                }
            }
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    var result = _common.PARSE_BINDING_REGEX.exec(bindings[key]);
                    var mode = result[1];
                    var parentKey = result[2] || key;
                    var parentGet = $parse(parentKey);

                    (function () {
                        switch (mode) {
                            case '=':
                                toReturn[key] = parentGet(scope);
                                break;
                            case '&':
                                var fn = $parse(parentGet(scope));
                                toReturn[key] = function (locals) {
                                    return fn(scope, locals);
                                };
                                break;
                            case '@':
                                var exp = parentGet(scope);
                                var isExp = (0, _common.isExpression)(exp);
                                if (isExp) {
                                    toReturn[key] = $parse((0, _common.expressionSanitizer)(exp))(scope);
                                } else {
                                    toReturn[key] = parentGet(scope);
                                }
                                break;
                            default:
                                throw 'Could not apply bindings';
                        }
                    })();
                }
            }
            return toReturn;
        }
    }, {
        key: 'parseBindings',
        value: function parseBindings(bindings, scope, isolateScope, controllerAs) {
            var assignBindings = function assignBindings(destination, scope, key, mode) {
                mode = mode || '=';
                var result = _common.PARSE_BINDING_REGEX.exec(mode);
                mode = result[1];
                var parentKey = result[2] || key;
                var childKey = controllerAs + '.' + key;
                var parentGet = $parse(parentKey);
                var childGet = $parse(childKey);
                var unwatch;

                (function () {
                    switch (mode) {
                        case '=':
                            var lastValue = parentGet(scope);
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
                            unwatch = scope.$watch(parentValueWatch);

                            destination.$on('$destroy', unwatch);
                            break;
                        case '&':
                            break;
                        case '@':
                            var isExp = (0, _common.isExpression)(scope[parentKey]);
                            if (isExp) {
                                (function () {
                                    var exp = parentGet(scope);
                                    parentGet = $parse((0, _common.expressionSanitizer)(exp));
                                    var parentValue = parentGet(scope);
                                    var lastValue = parentValue;
                                    var parentValueWatch = function parentValueWatch() {
                                        parentValue = parentGet(scope, isolateScope);
                                        if (parentValue !== lastValue) {
                                            childGet.assign(destination, lastValue = parentValue);
                                        }
                                        return lastValue;
                                    };
                                    var unwatch = scope.$watch(parentValueWatch);
                                    destination.$on('$destroy', unwatch);
                                })();
                            }
                            break;
                        default:
                            throw 'Could not apply bindings';
                    }
                })();

                return destination;
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
                return destination;
            } else if (angular.isObject(bindings)) {
                for (var _key in bindings) {
                    if (bindings.hasOwnProperty(_key)) {
                        assignBindings(destination, scope, _key, bindings[_key]);
                    }
                }
                return destination;
            }
            throw 'Could not parse bindings';
        }
    }, {
        key: '$get',
        value: function $get(moduleNames) {
            var $controller = void 0;
            var array = (0, _common.makeArray)(moduleNames);
            // const indexMock = array.indexOf('ngMock');
            // const indexNg = array.indexOf('ng');
            // if (indexMock !== -1) {
            //     array[indexMock] = 'ng';
            // }
            // if (indexNg === -1) {
            //     array.push('ng');
            // }
            angular.injector(array).invoke(['$controller', function (controller) {
                $controller = controller;
            }]);
            var lastScope = void 0;

            function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
                scope = _common.scopeHelper.create(scope);
                scopeControllerName = scopeControllerName || 'controller';
                extendedLocals = extendedLocals || {
                    $scope: _common.scopeHelper.create(scope).$new()
                };
                // let locals = extendedLocals || {};
                // locals.$scope = /*locals.$scope ||*/ scopeHelper.create(scope).$new();
                // let locals2 = extend(extendedLocals || {}, {
                //     $scope: scopeHelper.create(scope).$new()
                // }, false);
                // console.log(locals2);
                var constructor = function constructor() {
                    if (lastScope) {
                        lastScope.$destroy();
                    }
                    lastScope = scope;
                    var constructor = $controller(controllerName, extendedLocals, true, scopeControllerName);
                    (0, _common.extend)(constructor.instance, controller.getValues(scope, bindings));
                    var toReturn = constructor();
                    controller.parseBindings(bindings, scope, extendedLocals.$scope, scopeControllerName);
                    return toReturn;
                };
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