import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngClassHTML', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
        spy = jasmine.createSpy('class');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            asString: 'my-class my-other-class',
            first: true,
            second: true
        }, true);
        controllerService.create();
        controller = controllerService.controllerInstance;
    });
    it('should set the class attribute (after $digest)', function () {
        const handler = new directiveHandler(controllerService, '<div ng-class="ctrl.asString"/>');
        expect(handler.hasClass('my-class')).toBe(false);
        expect(handler.hasClass('my-other-class')).toBe(false);
        controllerService.$apply();
        expect(handler.hasClass('my-class')).toBe(true);
        expect(handler.hasClass('my-other-class')).toBe(true);
    });
    it('should support multiples classes in an object', () => {
        const handler = new directiveHandler(controllerService, '<div ng-class="{\'fa fa-minus togglePanel-fa\': !ctrl.first, \'fa fa-external-link-square togglePanel-fa\': ctrl.first}"/>');
        controllerService.$apply();
        expect(handler.hasClass('fa')).toBe(true);
        expect(handler.hasClass('fa-minus')).toBe(false);
        expect(handler.hasClass('togglePanel-fa')).toBe(true);
        expect(handler.hasClass('fa-external-link-square')).toBe(true);
        controller.first = false;
        controllerService.$apply();
        expect(handler.hasClass('fa')).toBe(true);
        expect(handler.hasClass('fa-minus')).toBe(true);
        expect(handler.hasClass('togglePanel-fa')).toBe(true);
        expect(handler.hasClass('fa-external-link-square')).toBe(false);
    });
});