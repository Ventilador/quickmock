import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngBind', function() {
    let controllerService, spy, controller;
    beforeEach(function() {
        spy = jasmine.createSpy('bind');
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
        controller = controllerService.create();
    });
    it('should be not throw', () => {
        expect(() => {
            new directiveHandler(controllerService, '<p ng-bind="ctrl.aString"/>');
        }).not.toThrow();
    });
    it('should defined ngBind', () => {
        const handler = new directiveHandler(controllerService, '<p ng-bind="ctrl.aString"/>');
        expect(handler.$text).toEqual(jasmine.any(Function));
    });
    it('should return the same as jQuerymethod .text()', () => {
        const handler = new directiveHandler(controllerService, '<p ng-bind="ctrl.aString"/>');
        expect(handler.text()).toBe(handler.$text());
    });
});