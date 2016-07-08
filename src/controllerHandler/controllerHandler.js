var $_CONTROLLER = $_CONTROLLER;
var scopeHelper = scopeHelper;
if (typeof require === 'function') {
    $_CONTROLLER = require('./controllerHandler.extensions.js');
    scopeHelper = require('./../controller/common.js').scopeHelper;
}
var controllerHandler = (function() {
    var internal = false;
    let myModules, ctrlName, cLocals, pScope, cScope, cName, bindToController;

    const $rootScope = angular.injector(['ng']).get('$rootScope');

    function clean() {
        myModules = [];
        ctrlName = pScope = cLocals = cScope = scopeControllerName = bindToController = undefined;
        return $controllerHandler;
    }

    function cleanExpressionForAssignment(expression, controllerName, bindings) {
        if (!controllerName) {
            return {
                value: expression
            };
        }
        expression = expression.replace(controllerName + '.', '');
        for (var key in bindings) {
            if (bindings.hasOwnProperty(key)) {
                if (expression.indexOf(key) !== -1) {
                    expression = expression.replace(key, PARSE_BINDING_REGEX.exec(bindings[key])[2] || key);
                    return expression;
                }
            }
        }
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
    return $controllerHandler;
})();

module.export = controllerHandler;