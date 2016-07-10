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
        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
        controllerMocker.$timeout();
        expect(controllerMocker.$timeout).toHaveBeenCalled();
    });
    it('should inject mocked object first, then real', function() {
        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
        expect(controllerMocker.$q.and.identity()).toBe('___$q');
        for (let key in controllerMocker.$timeout) {
            if (controllerMocker.$timeout.hasOwnProperty(key)) {
                expect(controllerMocker.$timeout[key]).toBe(controllerMocker.$mocks.$timeout[key]);
            }
        }
        for (let key in controllerMocker.$q) {
            if (controllerMocker.$q.hasOwnProperty(key)) {
                expect(controllerMocker.$q[key]).toBe(controllerMocker.$mocks.$q[key]);
            }
        }
        expect(controllerMocker.$q).toBe(controllerMocker.$mocks.$q);

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