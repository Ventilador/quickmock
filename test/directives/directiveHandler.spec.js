import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../src/directives/directiveHandler.js';
describe('directiveHandler', function() {
    let controllerService, spy, controller;
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
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
    it('should be defined', function() {
        expect(directiveHandler).toBeDefined();
    });
    it('should allow me to create new instances', function() {
        expect(function() {
            new directiveHandler();
        }).not.toThrow();
    });
    it('should be able to compile html', function() {
        expect(function() {
            new directiveHandler(controllerService, '<div/>');
        }).not.toThrow();
    });
 
});