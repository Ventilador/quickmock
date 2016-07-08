import controllerHandler from './../../src/controllerHandler/controllerHandler.js';

describe('controllerHandler', function() {
    beforeEach(function() {
        controllerHandler.clean();
    });
    it('should be defined', function() {
        expect(controllerHandler).toBeDefined();
    });
    it('should allow adding modules', function() {
        expect(function() {
            controllerHandler.addModules('myModule');
        }).not.toThrow();
    });
    it('should return the controllerHandler when adding modules', function() {
        expect(controllerHandler.addModules('myModule')).toBe(controllerHandler);
    });
    describe('creating a controller', function() {
        beforeEach(function() {
            controllerHandler.addModules('test');
        });
        it('should allow creating a controller', function() {
            let controllerObj;
            expect(function() {
                controllerObj = controllerHandler.new('emptyController');
            }).not.toThrow();
            expect(controllerObj).toBeDefined();
            expect(controllerObj.parentScope).toBeDefined();
            expect(controllerObj.controllerScope).toBeDefined();
            expect(controllerObj.controllerScope.$parent).toBe(controllerObj.parentScope);
            expect(controllerObj.controllerInstance).toBeUndefined();
            expect(controllerObj.usedModules).toEqual(['test']);
        });
        it('should allow creating a controller with bindings', function() {
            const controllerObj = controllerHandler.setScope({
                boundProperty: 'something'
            }).bindWith({
                boundProperty: '='
            }).new('withBindings');
            expect(controllerObj.create()).toBe(controllerObj.controllerInstance);
            expect(controllerObj.controllerInstance.boundProperty).toBe('something modified');
        });
        it('should allow to change the name of the binding', function() {
            const scope = {
                    equals: function() {},
                    byText: 'byText',
                    expression: 'byText.toUpperCase()'
                },
                controllerObj = controllerHandler.setScope(scope).bindWith({
                    equalsResult: '=equals',
                    byTextResult: '@byText',
                    expressionResult: '&expression'
                }).new('emptyController');
            expect(function() {
                controllerObj.create();
            }).not.toThrow();
            expect(controllerObj.controllerInstance.equalsResult).toBe(scope.equals);
            expect(controllerObj.controllerInstance.byTextResult).toBe(scope.byText);
            expect(controllerObj.controllerInstance.expressionResult()).toBe(scope.byText.toUpperCase());
        });
        describe('Watchers', function() {
            let scope, controllerObj;
            beforeEach(function() {
                scope = controllerHandler.$rootScope.$new();
            });
            it('should allow adding watchers', function() {
                scope.boundProperty = 'lala';
                controllerObj = controllerHandler.setScope(scope).bindWith({
                        boundProperty: '='
                    })
                    .new('emptyController');
                let args;
                const controller = controllerObj.watch('controller.boundProperty', function() {
                    args = arguments;
                }).create();
                expect(controller.boundProperty).toBe('lala');
                controller.boundProperty = 'lolo';
                controllerObj.controllerScope.$apply();
                expect(args).toBeDefined();
            });
            it('should reflec changes on the controller into the scope', function() {
                scope.boundProperty = 'lala';
                controllerObj = controllerHandler.setScope(scope).bindWith({
                        boundProperty: '='
                    })
                    .new('withInjections');
                let args;
                const controller = controllerObj.watch('controller.boundProperty', function() {
                    args = arguments;
                }).create();
                expect(controller.boundProperty).toBe('lala');
                controller.boundProperty = 'lolo';
                controllerObj.$apply();
                expect(controllerObj.parentScope.boundProperty).toBe('lolo');
                controllerObj.parentScope.$destroy();
            });
            it('should reflec changes on the scope into the controller', function() {
                scope.boundProperty = 'lala';
                controllerObj = controllerHandler.setScope(scope).bindWith({
                        boundProperty: '='
                    })
                    .new('withInjections');
                const controller = controllerObj.create();
                controllerObj.parentScope.boundProperty = 'parent';
                controllerObj.$apply();
                expect(controller.boundProperty).toBe('parent');
            });
            it('should give the parent scope privilege over the controller', function() {
                controllerObj = controllerHandler.setScope(scope).bindWith({
                        boundProperty: '='
                    })
                    .new('withInjections');
                const controller = controllerObj.create();
                controllerObj.parentScope.boundProperty = 'parent';
                controller.boundProperty = 'child';
                controllerObj.$apply();
                expect(controller.boundProperty).toBe('parent');
                expect(controllerObj.parentScope.boundProperty).toBe('parent');
            });
        });
    });
    describe('destroying a controller', function() {
        let controllerObj;
        beforeEach(function() {
            controllerHandler.clean();
            controllerHandler.addModules('test');
        });
        it('should allow destroying the object', function() {
            expect(function() {
                controllerObj = controllerHandler.new('emptyController');
            }).not.toThrow();
            controllerObj.$destroy();
        });
    });
});