import {
    makeArray,
    isArrayLike,
    scopeHelper
} from './../controller/common.js';
import {
    $_CONTROLLER
} from './controllerHandler.extensions.js';

var controllerHandler = (function() {
    console.log('controllerHandler.js');
    var internal = false;
    let myModules, ctrlName, cLocals, pScope, cScope, cName, bindToController;


    function clean() {
        myModules = [];
        ctrlName = pScope = cLocals = cScope = bindToController = undefined;
        return $controllerHandler;
    }

    function $controllerHandler() {

        if (!ctrlName) {
            throw 'Please provide the controller\'s name';
        }
        pScope = scopeHelper.create(pScope || {});
        if (!cScope) {
            cScope = pScope.$new();
        } {
            const tempScope = scopeHelper.isScope(cScope);
            if (tempScope !== false) {
                cScope = tempScope;
            }
        }

        const toReturn = new $_CONTROLLER(ctrlName, pScope, bindToController, myModules, cName, cLocals);
        clean();
        return toReturn;
    }
    $controllerHandler.bindWith = function(bindings) {
        bindToController = bindings;
        return $controllerHandler;
    };
    $controllerHandler.controllerType = $_CONTROLLER;
    $controllerHandler.clean = clean;
    $controllerHandler.setScope = function(newScope) {
        pScope = newScope;
        return $controllerHandler;
    };
    $controllerHandler.setLocals = function(locals) {
        cLocals = locals;
        return $controllerHandler;
    };

    $controllerHandler.$rootScope = scopeHelper.$rootScope;

    $controllerHandler.addModules = function(modules) {
        function pushArray(array) {
            Array.prototype.push.apply(myModules, array);
        }
        if (angular.isString(modules)) {
            if (arguments.length > 1) {
                pushArray(makeArray(arguments));
            } else {
                pushArray([modules]);
            }
        } else if (isArrayLike(modules)) {
            pushArray(makeArray(modules));
        }
        return $controllerHandler;
    };
    $controllerHandler.isInternal = function(flag) {
        if (angular.isUndefined(flag)) {
            return internal;
        }
        internal = !!flag;
        return function() {
            internal = !flag;
        };
    };
    $controllerHandler.new = function(controllerName, scopeControllersName, parentScope, childScope) {
        ctrlName = controllerName;
        if (scopeControllersName && !angular.isString(scopeControllersName)) {
            pScope = scopeHelper.isScope(scopeControllersName);
            cScope = scopeHelper.isScope(parentScope) || cScope;
            cName = 'controller';
        } else {
            pScope = scopeHelper.create(parentScope || pScope);
            cScope = scopeHelper.create(childScope || pScope.$new());
            cName = scopeControllersName;
        }
        return $controllerHandler();
    };
    $controllerHandler.newService = function(controllerName, controllerAs, parentScope, bindings) {
        const toReturn = $controllerHandler.new(controllerName, controllerAs, parentScope);
        toReturn.bindings = bindings;
        return toReturn;
    };
    console.log('controllerHandler.js end');
    return $controllerHandler;
})();
export default controllerHandler;