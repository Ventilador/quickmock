'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$_CONTROLLER = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _directiveProvider = require('./../directives/directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

var _directiveHandler = require('./../directives/directiveHandler.js');

var _directiveHandler2 = _interopRequireDefault(_directiveHandler);

var _controllerQM = require('./../controller/controllerQM.js');

var _controllerQM2 = _interopRequireDefault(_controllerQM);

var _common = require('./../controller/common.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $_CONTROLLER = exports.$_CONTROLLER = function () {
    _createClass($_CONTROLLER, null, [{
        key: 'isController',
        value: function isController(object) {
            return object instanceof $_CONTROLLER;
        }
    }]);

    function $_CONTROLLER(ctrlName, pScope, bindings, modules, cName, cLocals) {
        var _this = this;

        _classCallCheck(this, $_CONTROLLER);

        this.providerName = ctrlName;
        this.scopeControllerName = cName || 'controller';
        this.usedModules = modules.slice();
        this.parentScope = pScope;
        this.controllerScope = this.parentScope.$new();
        this.controllerScope.$on('$destroy', function () {
            _this.$destroy(true);
        });
        this.bindings = bindings;
        this.locals = (0, _common.extend)(cLocals || {}, {
            $scope: this.controllerScope
        }, false);
        this.pendingWatchers = [];
        this.$rootScope = _common.scopeHelper.$rootScope;
        this.InternalSpies = {
            Scope: {},
            Controller: {}
        };
    }

    _createClass($_CONTROLLER, [{
        key: '$apply',
        value: function $apply() {
            this.$rootScope.$apply();
        }
    }, {
        key: '$destroy',
        value: function $destroy(fromScope) {
            this.$rootScope = undefined;
            if (!fromScope) {
                if (this.controllerScope && this.controllerScope.$$destroyed === false && angular.isFunction(this.controllerScope.$destroy)) {
                    var tempScope = this.controllerScope;
                    this.controllerScope = undefined;
                    tempScope.$destroy();
                }
            }
            (0, _common.clean)(this);
        }
    }, {
        key: 'create',
        value: function create(bindings) {
            var _this2 = this;

            this.bindings = angular.isDefined(bindings) && bindings !== null ? bindings : this.bindings;
            (0, _common.assert_$_CONTROLLER)(this);

            this.controllerConstructor = _controllerQM2.default.$get(this.usedModules).create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
            this.controllerInstance = this.controllerConstructor();

            var watcher = void 0;
            while (watcher = this.pendingWatchers.shift()) {
                this.watch.apply(this, watcher);
            }
            for (var key in this.bindings) {
                if (this.bindings.hasOwnProperty(key)) {
                    var result = _common.PARSE_BINDING_REGEX.exec(this.bindings[key]),
                        scopeKey = result[2] || key,
                        spyKey = [scopeKey, ':', key].join('');
                    if (result[1] === '=') {
                        (function () {

                            var destroyer = _this2.watch(key, _this2.InternalSpies.Scope[spyKey] = (0, _common.createSpy)(), _this2.controllerInstance);
                            var destroyer2 = _this2.watch(scopeKey, _this2.InternalSpies.Controller[spyKey] = (0, _common.createSpy)(), _this2.parentScope);
                            _this2.parentScope.$on('$destroy', function () {
                                destroyer();
                                destroyer2();
                            });
                        })();
                    }
                }
            }
            this.create = undefined;
            return this.controllerInstance;
        }
    }, {
        key: 'watch',
        value: function watch(expression, callback) {
            if (!this.controllerInstance) {
                this.pendingWatchers.push(arguments);
                return this;
            }
            return this.controllerScope.$watch(expression, callback);
        }
    }, {
        key: 'ngClick',
        value: function ngClick(expression) {
            return this.createDirective('ng-click', expression);
        }
    }, {
        key: 'createDirective',
        value: function createDirective() {
            var args = (0, _common.makeArray)(arguments);
            var directive = _directiveProvider2.default.$get(arguments[0]);
            args[0] = this;
            return directive.compile.apply(undefined, args);
        }
    }, {
        key: 'compileHTML',
        value: function compileHTML(htmlText) {
            return new _directiveHandler2.default(this, htmlText);
        }
    }, {
        key: '$new',
        value: function $new(scope, isChildScope) {
            var constructorFunction = function constructorFunction(parent, child) {
                this.parentScope = parent;
                this.controllerScope = child;
            };
            constructorFunction.prototype = this;
            var parentScope = void 0,
                childScope = void 0;
            if (scope) {
                if (isChildScope) {
                    parentScope = this.controllerScope;
                    childScope = scope;
                } else {
                    parentScope = scope;
                    childScope = scope.$new();
                }
            } else {
                parentScope = this.controllerScope;
                childScope = this.controllerScope.$new();
            }

            if (childScope.$parent === parentScope) {
                var _ret2 = function () {
                    var toReturn = new constructorFunction(parentScope, childScope);
                    childScope.$on('$destroy', function () {
                        toReturn.$destroy(true);
                    });
                    return {
                        v: toReturn
                    };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            }
            throw 'Scope chain broken';
        }
    }, {
        key: 'createShallowCopy',
        value: function createShallowCopy(scope) {
            var shallowConstructor = function shallowConstructor() {};
            shallowConstructor.prototype = this;
            var toReturn = new shallowConstructor();
            toReturn.parentScope = this.controllerScope;
            toReturn.controllerScope = scope;
            return toReturn;
        }
    }]);

    return $_CONTROLLER;
}();