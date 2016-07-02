describe('controllerSpies', function() {
    const uniqueObject = function uniqueObject() {};
    let controllerConstructor;
    beforeEach(function() {
        controllerHandler.clean();
        controllerConstructor = controllerHandler.addModules('test').bindWith({
            a: '=',
            b: '@',
            c: '&'
        }).setScope({
            a: uniqueObject,
            b: 'b',
            c: 'a'
        }).new('emptyController');
    });
    it('should create spies for each Bounded property', function() {
        const controller = controllerConstructor.create();
        const mySpy = controllerConstructor.InternalSpies.Scope['a:a'];
        expect(mySpy).toBeDefined();
        controller.a = undefined;
        expect(mySpy).not.toHaveBeenCalled();
        controllerConstructor.$apply();
        expect(mySpy).toHaveBeenCalled();
        expect(typeof mySpy.took() === 'number').toBe(true);
        expect(mySpy.took()).toBe(mySpy.took());
        expect(mySpy.took() > 0).toBe(true);
        expect(mySpy.calls.count()).toBe(1);
        controllerConstructor.$apply();
        expect(mySpy.calls.count()).toBe(1);

    });
});