'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = { n: angular.nopp };
var d = {};

var $parse, $interpolate;

var controller = function () {
    function controller() {
        _classCallCheck(this, controller);
    }

    _createClass(controller, null, [{
        key: 'assignBindings',
        value: function assignBindings(destination, bindings, parentScope) {
            var watchRemoveArray = [];
            if (!angular.isObject(bindings)) {
                if (bindings === true || bindings === '=') {
                    bindings = function () {
                        var toReturn = {};
                        for (var key in parentScope) {
                            if (parentScope.hasOwnProperty(key) && !_common.QMAngular.$rootScope[key] && !_common.QMAngular.$rootScope.hasOwnProperty(key)) {
                                toReturn[key] = '=';
                            }
                        }
                        return toReturn;
                    }();
                } else if (bindings === false) {
                    return angular.noop;
                }
            }
            var result = void 0;
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key) && (result = _common.PARSE_BINDING_REGEX.exec(bindings[key]))) {
                    (function () {
                        var mode = result[1];
                        var optional = result[2];
                        var parentKey = result[3] || key;
                        var childKey = key;
                        var parentGet = $parse(parentKey);

                        (function () {
                            switch (mode) {
                                case '=':
                                    var lastValue = parentGet(parentScope);
                                    var parentValue = null;
                                    if (!optional || lastValue) {
                                        destination[childKey] = lastValue;
                                    }
                                    watchRemoveArray.push(parentScope.$watch(function () {
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
                                    var fn = parentGet(parentScope);
                                    if ((fn === undefined || fn === null) && !optional) {
                                        fn = function fn(s, l) {
                                            return a.n(s, l, d);
                                        };
                                    } else if (typeof fn === 'function') {
                                        fn = (0, _common.annotate)(fn);
                                    }
                                    if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
                                        fn = (0, _common.compile)(fn, $parse);
                                    } else if (typeof fn === 'string') {
                                        fn = $parse(fn);
                                    }
                                    if (typeof fn === 'function') {
                                        destination[childKey] = function (locals) {
                                            return fn(parentScope, locals);
                                        };
                                    }
                                    break;
                                case '@':
                                    var expression = $interpolate(parentGet(parentScope));
                                    watchRemoveArray.push(parentScope.$watch(expression, function (newValue) {
                                        destination[childKey] = newValue;
                                    }));
                                    var initialVal = expression(parentScope);
                                    if (initialVal || !optional) {
                                        destination[childKey] = initialVal;
                                    }
                                    break;
                                case '<':
                                    var lastParentValue = parentGet(parentScope),
                                        currentValue = void 0;
                                    if (!optional || lastParentValue) {
                                        destination[childKey] = lastParentValue;
                                    }
                                    watchRemoveArray.push(parentScope.$watch(function () {
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
                        })();
                    })();
                }
            }
            return function () {
                while (watchRemoveArray.length) {
                    watchRemoveArray.shift()();
                }
            };
        }
    }, {
        key: '$get',
        value: function $get() {
            if (!$parse) {
                $parse = _common.QMAngular.injector.get('$parse');
            }
            if (!$interpolate) {
                $interpolate = _common.QMAngular.injector.get('$interpolate');
            }
            var $controller = void 0;
            _common.QMAngular.invoke(['$controller', function (controller) {
                $controller = controller;
            }]);

            function createController(controllerName, scope, bindings, scopeControllerName, extendedLocals) {
                scope = _common.QMAngular.create(scope);
                scopeControllerName = scopeControllerName || 'controller';
                extendedLocals = extendedLocals || {
                    $scope: scope.$new()
                };
                var constructor = function constructor() {
                    while (_common.QMAngular.$rootScope.$$childHead && _common.QMAngular.$rootScope.$$childHead !== scope) {
                        _common.QMAngular.$rootScope.$$childHead.$destroy();
                    }
                    while (_common.QMAngular.$rootScope.$$childTail && _common.QMAngular.$rootScope.$$childTail !== scope) {
                        _common.QMAngular.$rootScope.$$childTail.$destroy();
                    }

                    var constructor = $controller(controllerName, extendedLocals, true, scopeControllerName);
                    extendedLocals.$scope.$on('$destroy', controller.assignBindings(constructor.instance, bindings, scope));
                    return constructor();
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