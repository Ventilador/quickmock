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
});