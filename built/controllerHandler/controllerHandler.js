'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = require('./../controller/common.js');

var _controllerHandlerExtensions = require('./controllerHandler.extensions.js');

var controllerHandler = function () {
    var internal = false;
    var myModules = void 0,
        ctrlName = void 0,
        cLocals = void 0,
        pScope = void 0,
        cScope = void 0,
        cName = void 0,
        bindToController = void 0;

    function clean(root) {
        myModules = [];
        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
        if (root) {
            $controllerHandler.$rootScope = _common.scopeHelper.$rootScope = root;
        }
        return $controllerHandler;
    }

    function $controllerHandler() {

        if (!ctrlName) {
            throw 'Please provide the controller\'s name';
        }
        pScope = _common.scopeHelper.create(pScope || {});
        if (!cScope) {
            cScope = pScope.$new();
        }{
            var tempScope = _common.scopeHelper.isScope(cScope);
            if (tempScope !== false) {
                cScope = tempScope;
            }
        }

        var toReturn = new _controllerHandlerExtensions.$_CONTROLLER(ctrlName, pScope, bindToController, myModules, cName, cLocals);
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

    $controllerHandler.$rootScope = _common.scopeHelper.$rootScope;

    $controllerHandler.addModules = function (modules) {
        function pushArray(array) {
            Array.prototype.push.apply(myModules, array);
        }
        if (angular.isString(modules)) {
            if (arguments.length > 1) {
                pushArray((0, _common.makeArray)(arguments));
            } else {
                pushArray([modules]);
            }
        } else if ((0, _common.isArrayLike)(modules)) {
            pushArray((0, _common.makeArray)(modules));
        }
        return $controllerHandler;
    };
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
            pScope = _common.scopeHelper.isScope(scopeControllersName);
            cScope = _common.scopeHelper.isScope(parentScope) || cScope;
            cName = 'controller';
        } else {
            pScope = _common.scopeHelper.create(parentScope || pScope);
            cScope = _common.scopeHelper.create(childScope || pScope.$new());
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