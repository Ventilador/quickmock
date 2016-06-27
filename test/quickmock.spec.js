describe('quickmock', function() {
    let controllerMocker;
    beforeEach(function() {
        controllerMocker = quickmock({
            providerName: 'withInjections',
            moduleName: 'test',
            mockModules: ['SampleMocks']
        });
    });
    it('should have defined a controllerMocker', function() {
        expect(controllerMocker).toBeDefined();
    });

    it('should allow creating a controller', function() {
        const controller = controllerMocker.create(true, {
            a: 'lala'
        });
        expect(controller).toBeDefined();
        console.log(controller);
    });

});