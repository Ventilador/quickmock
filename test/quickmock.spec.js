describe('quickmock', function() {
    var controllerMocker;
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
});
describe('controller', function() {
    var controllerMocker, spy;
    beforeEach(function() {
        spy = jasmine.createSpy('magicClick')
        controllerMocker = quickmock({
            providerName: 'emptyController',
            moduleName: 'test',
            mockModules: [],
            controller: {
                parentScope: {
                    somethingToCall: spy
                },
                bindToController: {
                    somethingToCall: '='
                },
                controllerAs: 'ctrl'
            }
        });
    });
    it('should allow me to perform clicks', function() {
        expect(controllerMocker.ngClick).toEqual(jasmine.any(Function));
        var myClick = controllerMocker.ngClick('ctrl.somethingToCall(aObj, bObj)'),
            reference1 = function() {},
            reference2 = function() {},
            locals = {
                aObj: reference1,
                bObj: reference2
            };
        myClick(locals);
        expect(spy).toHaveBeenCalledWith(reference1, reference2);
    });
});