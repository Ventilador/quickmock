'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = require('./../controller/common.js');

var _controllerHandlerExtensions = require('./controllerHandler.extensions.js');

var controllerHandler = function () {
    var internal = false;
    var ctrlName = void 0,
        cLocals = void 0,
        pScope = void 0,
        cScope = void 0,
        cName = void 0,
        bindToController = void 0;

    function clean(root) {
        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
        if (root) {
            $controllerHandler.$rootScope = _common.QMAngular.$rootScope = root;
        }
        return $controllerHandler;
    }

    function $controllerHandler() {
        if (!ctrlName) {
            throw 'Please provide the controller\'s name';
        }
        pScope = _common.QMAngular.create(pScope || {});
        if (!cScope) {
            cScope = pScope.$new();
        } else {
            var tempScope = _common.QMAngular.isScope(cScope);
            if (tempScope !== false) {
                cScope = tempScope;
            }
        }

        var toReturn = new _controllerHandlerExtensions.$_CONTROLLER(ctrlName, pScope, bindToController, cName, cLocals);
        clean();
        return toReturn;
    }
    $controllerHandler.bindWith = function (bindings) {
        bindToController = bindings;
        return $controllerHandler;
    };
    $controllerHandler.controllerType = _controllerHandlerExtensions.$_CONTROLLER;
    $controllerHandler.clean = clean;
    $controllerHandler.setScope = function (newScope) {
        pScope = newScope;
        return $controllerHandler;
    };
    $controllerHandler.setLocals = function (locals) {
        cLocals = locals;
        return $controllerHandler;
    };

    Object.defineProperty($controllerHandler, '$rootScope', {
        get: function get() {
            return _common.QMAngular.$rootScope;
        }
    });

    $controllerHandler.isInternal = function (flag) {
        if (angular.isUndefined(flag)) {
            return internal;
        }
        internal = !!flag;
        return function () {
            internal = !flag;
        };
    };
    $controllerHandler.new = function (controllerName, scopeControllersName, parentScope, childScope) {
        ctrlName = controllerName;
        if (scopeControllersName && !angular.isString(scopeControllersName)) {
            pScope = _common.QMAngular.isScope(scopeControllersName);
            cScope = _common.QMAngular.isScope(parentScope) || cScope;
            cName = 'controller';
        } else {
            pScope = _common.QMAngular.create(parentScope || pScope);
            cScope = _common.QMAngular.create(childScope || pScope.$new());
            cName = scopeControllersName;
        }
        return $controllerHandler();
    };
    $controllerHandler.newService = function (controllerName, controllerAs, parentScope, bindings) {
        var toReturn = $controllerHandler.new(controllerName, controllerAs, parentScope);
        toReturn.bindings = bindings;
        return toReturn;
    };
    return $controllerHandler;
}();
exports.default = controllerHandler;