import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngIf', function() {
    let controllerService, spy, controller;
    beforeEach(function() {
        spy = jasmine.createSpy('if');
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

    it('should allow to call ngIf', function() {
        const handler = new directiveHandler(controllerService, '<div><div ng-if="ctrl.aBoolean"/></div>');
        controllerService.$apply();
        expect(handler.$if()).toBe(undefined);
        expect(handler.$find('div').$if()).toBe(true);
    });
    it('should remove the elements from the dom', function() {
        const handler = new directiveHandler(controllerService, '<div><div ng-if="ctrl.aBoolean"/></div>');
        controller.aBoolean = false;
        controllerService.$apply();
        expect(handler.$find('div').$if()).toBe(undefined);
        expect(handler.children().length).toBe(0);
    });
    it('should remove the elements from the dom', function() {
        const handler = new directiveHandler(controllerService, '<div><div class="my-class" ng-if="ctrl.aBoolean"/></div>');
        controller.aBoolean = false;
        controllerService.$apply();
        expect(handler.$find('div').$if()).toBe(undefined);
        expect(handler.children().length).toBe(0);
        controller.aBoolean = true;
        controllerService.$apply();
        expect(handler.$find('div').$if()).toBe(true);
        expect(handler.children().length).toBe(1);
        expect(handler.$find('div').hasClass('my-class')).toBe(true);
    });
    it('should prevent the usage of nested directives', function() {
        const handler = new directiveHandler(controllerService, '<div><div class="my-class" ng-if="ctrl.aBoolean"><button ng-click="ctrl.aFunction()"/></div></div>');
        controller.aBoolean = false;
        controllerService.$apply();
        handler.$find('button').$click();
        expect(spy).not.toHaveBeenCalled();
    });
    it('should allow using ngIf on the top element', function() {
        const handler = new directiveHandler(controllerService, '<div class="my-class" ng-if="ctrl.aBoolean"/>');
        controller.aBoolean = false;
        controllerService.$apply();
        expect(handler.$if()).toBe(undefined);
        expect(handler.length).toBe(0);
        controller.aBoolean = true;
        controllerService.$apply();
        expect(handler.$if()).toBe(true);
        expect(handler.length).toBe(1);
        expect(handler.hasClass('my-class')).toBe(true);
    });
});