import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngDisabledHTML', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
        spy = jasmine.createSpy('disabled');
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            anArray: [],
            aFunction: spy
        }, {
                anArray: '=',
                aFunction: '='
            });
        controllerService.create();
        controller = controllerService.controllerInstance;
    });
    it('should allow me to compile ng disabled', () => {
        expect(() => {
            new directiveHandler(controllerService, '<div><div ng-disabled="ctrl.anArray"/></div>');
        }).not.toThrow();
    });
    it('should disable the element when the evaluation is truthy', function () {
        const handler = new directiveHandler(controllerService, '<div><div ng-disabled="!ctrl.anArray.length"/></div>');
        controllerService.$apply();
        expect(handler.find('div').prop('disabled')).toBe(true);
        controller.anArray.push('');
        controllerService.$apply();
        expect(handler.find('div').prop('disabled')).toBe(false);
    });
    it('should disable childrens', function () {
        const handler = new directiveHandler(controllerService, '<div><div ng-disabled="!ctrl.anArray.length"><input type="text"/></div></div>');
        controllerService.$apply();
        expect(handler.find('input').prop('disabled')).toBe(true);
        controller.anArray.push('');
        controllerService.$apply();
        expect(handler.find('input').prop('disabled')).toBe(false);
    });
    it('should prevent events like click', function () {
        const handler = new directiveHandler(controllerService, '<div><a ng-disabled="!ctrl.anArray.length"><input type="button" ng-click="ctrl.aFunction(10)"/></a></div>');
        controllerService.$apply();
        expect(handler.find('input').prop('disabled')).toBe(true);
        handler.find('input').click();
        expect(controller.aFunction).not.toHaveBeenCalled();
    });


});
