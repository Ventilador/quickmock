import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import {directiveProvider }from './../../src/directives/directiveProvider.js';
describe('ngBind', function() {
    let controllerService, myBind, spy, controller;
    const ngBind = directiveProvider.$get('ngBind');
    const expression = 'ctrl.myStringParameter';
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            myStringParameter: 'aValue'
        }, true);
        controllerService.create();
        controller = controllerService.controllerInstance;
        myBind = ngBind.compile(controllerService, expression);
    });
    it('should be defined', () => {
        expect(myBind).toBeDefined();
    });
    it('should be a function', () => {
        expect(myBind).toEqual(jasmine.any(Function));
    });
    it('should not throw when called', () => {
        expect(() => {
            myBind();
        }).not.toThrow();
    });
    it('should return undefined the first time it was attacher (watchers didn\'t run)', () => {
        expect(myBind()).toBeUndefined();
    });
    it('should return the last watched value', () => {
        controllerService.$apply();
        expect(myBind()).toBe('aValue');
        controller.myStringParameter = 'anotherValue';
        expect(myBind()).toBe('aValue');
        controllerService.$apply();
        expect(myBind()).toBe('anotherValue');
    });
    it('should allow me to watch changes', () => {
        myBind.changes(spy);
        controllerService.$apply();
        expect(spy).toHaveBeenCalledWith('aValue');
    });
});