'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = { n: angular.nopp };
var d = {};
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
                    var optional = result[2];
                    var parentKey = result[3] || key;
                    var parentGet = $parse(parentKey);
                    var tempValue = void 0;

                    (function () {
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
                                var parentValue = parentGet(scope);
                                var fn = void 0;
                                if ((parentValue === undefined || parentValue === null) && !optional) {
                                    fn = function fn(s, l) {
                                        return a.n(s, l, d);
                                    };
                                } else if (typeof parentValue === 'function') {
                                    parentValue = (0, _common.annotate)(parentValue);
                                }
                                if ((typeof parentValue === 'undefined' ? 'undefined' : _typeof(parentValue)) === 'object') {
                                    fn = (0, _common.compile)(parentValue, $parse);
                                } else if (typeof parentValue === 'string') {
                                    fn = $parse(parentValue);
                                }
                                if (typeof fn === 'function') {
                                    toReturn[key] = function (locals) {
                                        return fn(scope, locals);
                                    };
                                }
                                break;
                            case '@':
                                var exp = parentGet(scope);
                                var notExp = !(0, _common.isExpression)(exp);
                                if (notExp && (exp || !optional)) {
                                    toReturn[key] = exp;
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
                var parentKey = result[3] || key;
                var childKey = controllerAs + '.' + key;
                var parentGet = $parse(parentKey);
                var childGet = $parse(childKey);

                (function () {
                    switch (mode) {
                        case '=':
                            var lastValue = parentGet(scope);
                            destination.$watch(function () {
                                var parentValue = parentGet(scope);
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
                            var isExp = (0, _common.isExpression)(scope[parentKey]);
                            if (isExp) {
                                (function () {
                                    var exp = parentGet(scope);
                                    parentGet = $parse((0, _common.expressionSanitizer)(exp));
                                    var lastValue = function lastValue() {};
                                    destination.$watch(function () {
                                        if (lastValue !== (lastValue = parentGet(scope))) {
                                            childGet.assign(destination, lastValue);
                                        } else if (lastValue !== childGet(destination)) {
                                            childGet.assign(destination, lastValue);
                                        }
                                        return lastValue;
                                    });
                                })();
                            }
                            break;
                        case '<':
                            var lastParentValue = parentGet(scope);
                            var lastChildValue = lastParentValue;
                            var watcher = destination.$watch(function () {
                                var lastValue = parentGet(scope);
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