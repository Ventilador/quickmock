import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngClickHTML', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
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
    it('should allow me to call ng-click', function () {
        const handler = new directiveHandler(controllerService, '<div ng-click="ctrl.aString = \'anotherValue\'"/>');
        handler.click();
        expect(controller.aString).toBe('anotherValue');
    });
    it('should not fail if the selected item is invalid', function () {
        const handler = new directiveHandler(controllerService, '<div />');
        expect(function () {
            handler.find('a').click();
        }).not.toThrow();
    });
    it('should not fail if the selected does not have the property', function () {
        const handler = new directiveHandler(controllerService, '<div />');
        expect(function () {
            handler.click();
        }).not.toThrow();
    });
    it('should apply the click event to each of its childrens (if needed)', function () {
        const handler = new directiveHandler(controllerService,
            `   <div ng-click="ctrl.aInt = ctrl.aInt + 1">
                    <div id='first'>
                        <div id='second'>
                        </div>
                    </div>
                    <div id='third'>
                    </div>
                </div>`);
        const first = handler.find('#first'),
            second = handler.find('#second'),
            third = handler.find('#third');
        first.click();
        second.click();
        third.click();
        expect(controller.aInt).toBe(3);
    });
   
});