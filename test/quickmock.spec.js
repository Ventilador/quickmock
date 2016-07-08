import quickmock from './../src/quickmock.js';
describe('quickmock', function() {
    let controllerMocker;
    beforeEach(function() {
        controllerMocker = quickmock({
            providerName: 'withInjections',
            moduleName: 'test',
            mockModules: []
        });
    });
    it('should have defined a controllerMocker', function() {
        expect(controllerMocker).toBeDefined();
    });
    it('should have modified angular modules', function() {
        expect(quickmock.mockHelper).toBeDefined();
    });
    it('should inject mocked object first, then real', function() {
        expect(controllerMocker.t.and.identity()).toBe('___$timeout');
        controllerMocker.t();
        expect(controllerMocker.t).toHaveBeenCalled();
    });
});
describe('controller', function() {
    let controllerMocker, spy;
    beforeEach(function() {
        spy = jasmine.createSpy('magicClick');
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
        const myClick = controllerMocker.ngClick('ctrl.somethingToCall(aObj, bObj)'),
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