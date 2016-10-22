import {directiveProvider }from './../directives/directiveProvider.js';
import directiveHandler from './../directives/directiveHandler.js';
import controller from './../controller/controllerQM.js';
import {
    makeArray,
    QMAngular,
    assert_$_CONTROLLER,
    clean
} from './../controller/common.js';




export class $_CONTROLLER {
    static isController(object) {
        return object instanceof $_CONTROLLER;
    }
    constructor(ctrlName, pScope, bindings, cName, cLocals) {
        this.providerName = ctrlName;
        this.scopeControllerName = cName || 'controller';
        this.parentScope = pScope;
        this.controllerScope = this.parentScope.$new();
        this.controllerScope.$on('$destroy', () => {
            this.$destroy(true);
        });
        this.bindings = bindings;
        this.locals = cLocals || {};
        this.locals.$scope = this.controllerScope;
        this.pendingWatchers = [];
        this.$rootScope = QMAngular.$rootScope;
    }
    $apply() {
        this.$rootScope.$apply();
    }
    $destroy(fromScope) {
        this.$rootScope = undefined;
        if (!fromScope) {
            if (this.controllerScope && this.controllerScope.$$destroyed === false && angular.isFunction(this.controllerScope.$destroy)) {
                const tempScope = this.controllerScope;
                this.controllerScope = undefined;
                tempScope.$destroy();
            }
        }
        clean(this);
    }
    create(bindings) {
        this.bindings = angular.isDefined(bindings) && bindings !== null ? bindings : this.bindings;
        assert_$_CONTROLLER(this);

        this.controllerConstructor =
            controller.$get()
                .create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
        this.controllerInstance = this.controllerConstructor();

        let watcher;
        while (watcher = this.pendingWatchers.shift()) {
            this.watch.apply(this, watcher);
        }
        this.create = undefined;
        return this.controllerInstance;
    }
    watch(expression, callback) {
        if (!this.controllerInstance) {
            this.pendingWatchers.push(arguments);
            return this;
        }
        return this.controllerScope.$watch(expression, callback);
    }
    createDirective() {
        const args = makeArray(arguments);
        const directive = directiveProvider.$get(arguments[0]);
        args[0] = this;
        return directive.compile.apply(undefined, args);
    }
    compileHTML(htmlText) {
        return new directiveHandler(this, htmlText);
    }
    $new(scope, isChildScope) {
        const constructorFunction = function (parent, child) {
            this.parentScope = parent;
            this.controllerScope = child;
        };
        constructorFunction.prototype = this;
        let parentScope, childScope;
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
            const toReturn = new constructorFunction(parentScope, childScope);
            childScope.$on('$destroy', () => {
                toReturn.$destroy(true);
            });
            return toReturn;
        }
        throw 'Scope chain broken';
    }
    createShallowCopy(scope) {
        const shallowConstructor = function () { };
        shallowConstructor.prototype = this;
        const toReturn = new shallowConstructor();
        toReturn.parentScope = this.controllerScope;
        toReturn.controllerScope = scope;
        return toReturn;
    }
}