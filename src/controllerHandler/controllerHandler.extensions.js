
import directiveProvider from './../directives/directiveProvider.js';
import {
    directiveHandler
} from './../directives/directiveHandler.js';
import controller from './../controller/controllerQM.js';
import {
    extend,
    PARSE_BINDING_REGEX,
    createSpy,
    makeArray,
    scopeHelper,
    assert_$_CONTROLLER,
    clean
} from './../controller/common.js';




export class $_CONTROLLER {
    static isController(object) {
        return object instanceof $_CONTROLLER;
    }
    constructor(ctrlName, pScope, bindings, modules, cName, cLocals) {
        this.providerName = ctrlName;
        this.scopeControllerName = cName || 'controller';
        this.usedModules = modules.slice();
        this.parentScope = pScope;
        this.controllerScope = this.parentScope.$new();
        this.bindings = bindings;
        this.locals = extend(cLocals || {}, {
                $scope: this.controllerScope
            },
            false);
        this.pendingWatchers = [];
        this.$rootScope = scopeHelper.$rootScope;
        this.InternalSpies = {
            Scope: {},
            Controller: {}
        };
    }
    $apply() {
        this.$rootScope.$apply();
    }
    $destroy() {
        delete this.$rootScope;
        this.parentScope.$destroy();
        clean(this);
    }
    create(bindings) {
        this.bindings = angular.isDefined(bindings) && bindings !== null ? bindings : this.bindings;
        assert_$_CONTROLLER(this);
       
        this.controllerConstructor =
            controller.$get(this.usedModules)
            .create(this.providerName, this.parentScope, this.bindings, this.scopeControllerName, this.locals);
        this.controllerInstance = this.controllerConstructor();

        let watcher, self = this;
        while (watcher = this.pendingWatchers.shift()) {
            this.watch.apply(this, watcher);
        }
        for (var key in this.bindings) {
            if (this.bindings.hasOwnProperty(key)) {
                let result = PARSE_BINDING_REGEX.exec(this.bindings[key]),
                    scopeKey = result[2] || key,
                    spyKey = [scopeKey, ':', key].join('');
                if (result[1] === '=') {

                    const destroyer = this.watch(key, this.InternalSpies.Scope[spyKey] = createSpy(), self.controllerInstance);
                    const destroyer2 = this.watch(scopeKey, this.InternalSpies.Controller[spyKey] = createSpy(), self.parentScope);
                    this.parentScope.$on('$destroy', () => {
                        destroyer();
                        destroyer2();
                    });
                }
            }
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
    ngClick(expression) {
        return this.createDirective('ng-click', expression);
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
}