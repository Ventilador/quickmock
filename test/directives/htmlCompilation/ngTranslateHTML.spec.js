import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngTranslateHTML', function() {
    let controllerService, spy, controller;
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            aString: 'aValue',
            aFunction: spy,
            aKey: 'TITLE',
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
    it('should replace the content of the element with the translatation', () => {
        const handler = new directiveHandler(controllerService, '<span translate="TITLE"><div>something</di></span>');
        expect(handler.text()).toBe('something');
        controllerService.$apply();
        expect(handler.text()).toBe('Hello');
        expect(handler.find('div').length).toBe(0);
    });
    it('should replace the content after a $digest', () => {
        const handler = new directiveHandler(controllerService, '<span translate="{{ctrl.aKey}}"><div>something</di></span>');
        expect(handler.text()).toBe('something');
        controllerService.$apply();
        expect(handler.text()).toBe('Hello');
    });
});