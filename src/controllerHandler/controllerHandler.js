import {
    QMAngular
} from './../controller/common.js';
import {
    $_CONTROLLER
} from './controllerHandler.extensions.js';

var controllerHandler = (function () {
    var internal = false;
    let ctrlName, cLocals, pScope, cScope, cName, bindToController;


    function clean(root) {
        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
        if (root) {
            $controllerHandler.$rootScope = QMAngular.$rootScope = root;
        }
        return $controllerHandler;
    }




    function $controllerHandler() {
        if (!ctrlName) {
            throw 'Please provide the controller\'s name';
        }
        pScope = QMAngular.create(pScope || {});
        if (!cScope) {
            cScope = pScope.$new();
        } else {
            const tempScope = QMAngular.isScope(cScope);
            if (tempScope !== false) {
                cScope = tempScope;
            }
        }

        const toReturn = new $_CONTROLLER(ctrlName, pScope, bindToController, cName, cLocals);
        clean();
        return toReturn;
    }
    $controllerHandler.bindWith = function (bindings) {
        bindToController = bindings;
        return $controllerHandler;
    };
    $controllerHandler.controllerType = $_CONTROLLER;
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
        get: function () {
            return QMAngular.$rootScope;
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
            pScope = QMAngular.isScope(scopeControllersName);
            cScope = QMAngular.isScope(parentScope) || cScope;
            cName = 'controller';
        } else {
            pScope = QMAngular.create(parentScope || pScope);
            cScope = QMAngular.create(childScope || pScope.$new());
            cName = scopeControllersName;
        }
        return $controllerHandler();
    };
    $controllerHandler.newService = function (controllerName, controllerAs, parentScope, bindings) {
        const toReturn = $controllerHandler.new(controllerName, controllerAs, parentScope);
        toReturn.bindings = bindings;
        return toReturn;
    };
    return $controllerHandler;
})();
export default controllerHandler;