import directiveProvider from './../../src/directives/directiveProvider.js';
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

    describe('puts and uses', function() {
        let spy;
        beforeEach(function() {
            spy = jasmine.createSpy();
            spy.and.returnValue(spy);
            directiveProvider.$clean();
        });
        it('should allow adding directives', function() {
            expect(function() {
                directiveProvider.$put('my-directive', spy);
            }).not.toThrow();
            expect(spy).toHaveBeenCalled();
            expect(directiveProvider.$get('my-directive')).toBe(spy);
            expect(directiveProvider.$get('my:directive')).toBe(spy);
            expect(directiveProvider.$get('myDirective')).toBe(spy);
            expect(spy.calls.count()).toBe(1);
        });
        it('should not allow overwriting, but preserve first versions', function() {
            directiveProvider.$put('my-directive', spy);
            expect(function() {
                directiveProvider.$put('my-directive', function() {});
            }).toThrow();
            expect(directiveProvider.$get('my-directive')).toBe(spy);
        });
        it('allow me to overwrite with a third parameter in a function that return true', function() {
            directiveProvider.$put('my-directive', spy);
            const anotherSpy = jasmine.createSpy();
            anotherSpy.and.returnValue(anotherSpy);
            expect(function() {
                directiveProvider.$put('my-directive', anotherSpy, function() {
                    return true;
                });
            }).not.toThrow();
            expect(directiveProvider.$get('my-directive')).not.toBe(spy);
            expect(directiveProvider.$get('my-directive')).toBe(anotherSpy);
            expect(spy.calls.count()).toBe(1);
            expect(anotherSpy.calls.count()).toBe(1);
        });
    });
});