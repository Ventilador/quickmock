import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('transformDirective', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
        spy = jasmine.createSpy('bind');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            aString: 'aValue',
            aFunction: function (arg) {
                spy(arg);
            },
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
        controller.aFunctionWrapper = function (value) {
            this.aFunction({ arg: value });
        };
    });
    it('should transform ng-click to ng-whatEver', () => {
        const handler = new directiveHandler(controllerService,
            '<div ng-what-ever="ctrl.aFunction({ arg : ctrl.aFunction})"></div>',
            {
                'ngWhatEver': 'ngClick'
            });
        handler.click();
        expect(spy).toHaveBeenCalledWith(controllerService.controllerInstance.aFunction);
    });
    it('should transform ng-click to ng-whatEver (with wrapper)', () => {
        const handler = new directiveHandler(controllerService,
            '<div ng-what-ever="ctrl.aFunctionWrapper(ctrl.aFunction)"></div>',
            {
                'ngWhatEver': 'ngClick'
            });
        handler.click();
        expect(spy).toHaveBeenCalledWith(controllerService.controllerInstance.aFunction);
    });
});