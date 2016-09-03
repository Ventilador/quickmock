import quickmock from './../src/quickmock.js';
describe('quickmock', function () {
    let controllerMocker;
    beforeEach(function () {
        controllerMocker = quickmock({
            providerName: 'withInjections',
            moduleName: 'test',
            mockModules: []
        });
    });
    it('should have defined a controllerMocker', function () {
        expect(controllerMocker).toBeDefined();
    });
    it('should have modified angular modules', function () {
        expect(quickmock.mockHelper).toBeDefined();
    });
    it('should inject mocked object first, then real', function () {
        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
        controllerMocker.$timeout();
        expect(controllerMocker.$timeout).toHaveBeenCalled();
    });
    it('should inject mocked object first, then real', function () {
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
    describe('injecting scope', () => {
        let controllerService;
        const ref = function () { };
        beforeEach(function () {
            controllerService = quickmock({
                providerName: 'withScope',
                moduleName: 'test',
                mockModules: [],
                controller: {
                    parentScope: {
                        boundProperty: ref
                    },
                    bindToController: {
                        boundProperty: '='
                    }
                }
            });
        });
        it('should have defined the controller', () => {
            expect(controllerService).toBeDefined();
        });
        it('should have bound everything properly', () => {
            expect(controllerService.controllerScope.controller.boundProperty).toBe(ref);
            expect(controllerService.controllerInstance.boundProperty).toBe(ref);
            expect(controllerService.controllerInstance.scope.controller.boundProperty).toBe(ref);
            expect(controllerService.controllerScope.controller.scope.controller.boundProperty).toBe(ref);
        });
    });
});
