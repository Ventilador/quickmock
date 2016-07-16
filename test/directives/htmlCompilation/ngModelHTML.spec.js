import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngModel', function() {
    let controllerService, spy, controller;
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            aString: 'aValue',
            aFunction: spy,
            aKey: 'HELLO',
            aInt: 0,
            aBoolean: true
        }, {
            aString: '=',
            aFunction: '&',
            aKey: '@',
            aInt: '=',
            aBoolean: '='
        });
        controllerService.create();
        controller = controllerService.controllerInstance;
    });
    it('should allow me to call text', function() {
        const handler = new directiveHandler(controllerService, '<div ng-model="ctrl.aString"/>');
        expect(handler.text()).toBe('');
        controllerService.$apply();
        expect(handler.text()).toBe('aValue');
    });
    it('should allow me to change the controller value', function() {
        const handler = new directiveHandler(controllerService, '<div ng-model="ctrl.aString"/>');
        handler.text('newValue');
        expect(controller.aString).toBe('newValue');
    });
    it('should allow me to change the controller value, one letter at the time', function() {
        const handler = new directiveHandler(controllerService, '<div ng-model="ctrl.aString"/>');
        controllerService.watch('ctrl.aString', spy);
        handler.text('newValue'.split(''));
        expect(controller.aString).toBe('newValue');
        expect(spy.calls.count()).toBe('newValue'.length);
    });
});