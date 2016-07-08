import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveProvider from './../../src/directives/directiveProvider.js';
describe('ngClick', function() {
    let controllerService, myClick, spy;
    const ngClick = directiveProvider.$get('ngClick');
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            mySpy: spy
        }, true);
        myClick = ngClick.compile(controllerService, 'ctrl.mySpy(param1, param2)');
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