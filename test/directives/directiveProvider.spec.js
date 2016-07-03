describe('directiveProvider', function() {
    it('should be defined', function() {
        expect(directiveProvider).toBeDefined();
    });
    it('should have a $get method', function() {
        expect(angular.isFunction(directiveProvider.$get)).toBe(true);
    });
    it('should return undefined and not throw is the directive does not exist', function() {
        let returned = {};
        expect(function() {
            returned = directiveProvider.$get('not existing');
        }).not.toThrow();
        expect(returned).toBeUndefined();
    });
    [
        'ng-if',
        'ng:if',
        'ngIf',
        'ng-repeat',
        'ng-click',
        'ng-disabled',
        'ng-bind',
        'ng-model',
        'translate',
        'translate-value',
        'ng-class'
    ].forEach(function(item) {
        it('should always contain the ' + item + 'directive', function() {
            expect(directiveProvider.$get(item)).toBeDefined(item);
        });
    });
    describe('ngIf', function() {
        let controllerService, myIf;
        const ngIf = directiveProvider.$get('ng-if');
        beforeEach(function() {
            controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
                myBoolean: true
            }, true);
            myIf = ngIf.compile('ctrl.myBoolean', controllerService);
        });
        it('should have defined myIf', function() {
            expect(myIf).toBeDefined();
        });
        it('should return undefined if no $digest was executed', function() {
            expect(myIf.value()).toBeUndefined();
        })
        it('should return the value of the expression', function() {
            controllerService.$apply();
            expect(myIf.value()).toBe(true);
        });
        it('should return the latest evaluated value on a watch', function() {
            controllerService.$apply();
            controllerService.controllerInstance.myBoolean = angular.noop;
            expect(myIf.value()).not.toBe(angular.noop);
            controllerService.$apply();
            expect(myIf.value()).toBe(angular.noop);
        });
        it('should allow attaching spys to the watching cycle', function() {
            const mySpy = jasmine.createSpy();
            myIf(mySpy);
            controllerService.$apply();
            expect(mySpy).toHaveBeenCalled();
        });
        it('should allow deattaching spies to the watching cycle', function() {
            const mySpy = jasmine.createSpy();
            const watcher = myIf(mySpy);
            watcher();
            controllerService.$apply();
            expect(mySpy).not.toHaveBeenCalled();
        });
        it('should only deattach the correcponding spy', function() {
            const mySpy = jasmine.createSpy();
            const mySpy2 = jasmine.createSpy();
            const watcher = myIf(mySpy);
            myIf(mySpy2);
            watcher();
            controllerService.$apply();
            expect(mySpy).not.toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
        });
    });
    describe('ngClick', function() {
        let controllerService, myClick, spy;
        const ngClick = directiveProvider.$get('ngClick');
        beforeEach(function() {
            spy = jasmine.createSpy('click');
            controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
                mySpy: function() {
                    spy.apply(spy, arguments);
                }
            }, true);
            myClick = ngClick.compile('ctrl.mySpy(param1, param2)', controllerService);
        });
        it('should have defined myIf', function() {
            expect(myClick).toBeDefined();
        });
        it('should be a function', function() {
            expect(myClick).toEqual(jasmine.any(Function));
        });
        it('should allow calling it', function() {
            expect(function() {
                myClick();
            }).not.toThrow();
        });
        it('should call the spy when called', function() {
            myClick();
            expect(spy).toHaveBeenCalled();
        });
        it('should support locals', function() {
            const object1 = function() {};
            const object2 = function() {};
            const locals = {
                param1: object1,
                param2: object2
            };
            myClick(locals);
            expect(spy).toHaveBeenCalledWith(object1, object2);
        });
    });
});