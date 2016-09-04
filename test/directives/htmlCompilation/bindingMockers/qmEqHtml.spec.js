import controllerHandler from './../../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../../src/directives/directiveHandler.js';
describe('qmEqHTML', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
        spy = jasmine.createSpy('qmEq');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            aProperty: 'aValue'
        }, {
                aProperty: '='
            });
        controller = controllerService.create();
    });
    it('should be not throw', () => {
        expect(() => {
            new directiveHandler(controllerService, '<div my-directive="ctrl.aProperty"/>', { 'myDirective': 'qmEq' });
        }).not.toThrow();
    });
    it('should set the internal value after an $apply()', function () {
        const handler = new directiveHandler(controllerService, '<div my-directive="ctrl.aProperty"/>', { 'myDirective': 'qmEq' });
        expect(handler.getValue('myDirective')).toBe(undefined);
        controllerService.$apply();
        expect(handler.getValue('myDirective')).toBe(controller.aProperty);
    });
    it('should update the controllers value is child changes', () => {
        const handler = new directiveHandler(controllerService, '<div my-directive="ctrl.aProperty"/>', { 'myDirective': 'qmEq' });
        controllerService.$apply(); // init the watchers
        handler.setValue('myDirective', 'SomethingElse');
        expect(controller.aProperty).toBe('aValue');
        controllerService.$apply();
        expect(controller.aProperty).toBe('SomethingElse');
    });
    it('should update the parent as well', () => {
        const handler = new directiveHandler(controllerService, '<div my-directive="ctrl.aProperty"/>', { 'myDirective': 'qmEq' });
        controllerService.$apply(); // init the watchers
        handler.setValue('myDirective', 'SomethingElse');
        expect(controllerService.parentScope.aProperty).toBe('aValue');
        controllerService.$apply();
        expect(controllerService.parentScope.aProperty).toBe('SomethingElse');
    });
    it('should change the controller and the binding if the parent changes', () => {
        const handler = new directiveHandler(controllerService, '<div my-directive="ctrl.aProperty"/>', { 'myDirective': 'qmEq' });
        controllerService.$apply(); // init the watchers
        controllerService.parentScope.aProperty = 'SomethingElse';
        expect(controller.aProperty).toBe('aValue');
        expect(handler.getValue('myDirective')).toBe('aValue');
        controllerService.$apply();
        expect(controller.aProperty).toBe('SomethingElse');
        expect(handler.getValue('myDirective')).toBe('SomethingElse');
    });
});
