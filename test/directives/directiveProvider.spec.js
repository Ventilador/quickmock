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
});