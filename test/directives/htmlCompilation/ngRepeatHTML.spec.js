import controllerHandler from './../../../src/controllerHandler/controllerHandler.js';
import directiveHandler from './../../../src/directives/directiveHandler.js';
describe('ngRepeatHTML', function () {
    let controllerService, spy, controller;
    beforeEach(function () {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            anArray: [
                'item1',
                'item2',
                'item3'
            ],
            aFunction: spy,
            aKey: 'HELLO',
            aInt: 0,
            aBoolean: true
        }, true);
        controllerService.create();
        controller = controllerService.controllerInstance;
    });
    it('should be able to compile ng-repeat', () => {
        expect(() => {
            new directiveHandler(controllerService, '<div ng-repeat="item in ctrl.anArray"></div>');
        }).not.toThrow();
    });
    it('should have added repetitions of the div', () => {
        const handler = new directiveHandler(controllerService, '<div ng-repeat="item in ctrl.anArray"></div>');
        controllerService.$apply();
        expect(handler.filter('div').length).toBe(3);
    });
    it('should compile internal directives', () => {
        const handler = new directiveHandler(controllerService, '<div ng-repeat="item in ctrl.anArray"><span ng-bind="item"></span></div>');
        controllerService.$apply();
        expect(handler.text()).toBe('item1item2item3');
        controller.anArray.push('item4');
        controllerService.$apply();
        expect(handler.text()).toBe('item1item2item3item4');
    });
    it('should have priority over same element directives', () => {
        const handler = new directiveHandler(controllerService, '<div ng-bind="item" ng-repeat="item in ctrl.anArray"></div>');
        controllerService.$apply();
        expect(handler.text()).toBe('item1item2item3');
        controller.anArray.push('item4');
        controllerService.$apply();
        expect(handler.text()).toBe('item1item2item3item4');
    });
    it('should have the parent controller in nested directives expressions', () => {
        controller.anArray = [{
            a: 'a'
        }, {
                b: 'b'
            }, {
                c: 'c'
            }];
        const handler = new directiveHandler(controllerService, '<ul ><li ng-repeat="item in ctrl.anArray" ng-click="ctrl.aFunction(item)"></li></ul>');
        controllerService.$apply();
        expect(handler.find('li').length).toBe(3);
        handler.find('li').click();
        expect(spy.calls.count()).toBe(3);
        for (var index = 0; index < controller.anArray.length; index++) {
            expect(spy.calls.argsFor(index)).toEqual([controller.anArray[index]]);
        }
    });
    it('should repeat childrend instead of self if any', () => {
        const handler = new directiveHandler(controllerService, '<ul ><li ng-repeat="item in ctrl.anArray" ng-click="ctrl.aFunction(item)"></li></ul>');
        controllerService.$apply();
        expect(handler.length).toBe(1);
        expect(handler.children().length).toBe(3);
    });
    it('should preserve scopes', () => {
        controller.anArray = [{
            value: 0
        }, {
                value: 0
            }, {
                value: 0
            }];
        const handler = new directiveHandler(controllerService, '<ul ><li ng-repeat="item in ctrl.anArray" ng-click="ctrl.aFunction(item.value = item.value + 1)"></li></ul>');
        controllerService.$apply();
        handler.find('li').click();
        expect(spy.calls.count()).toBe(3);
        controller.anArray[1] = {
            value: 100
        };
        controllerService.$apply();
        handler.find('li').click();
        expect(spy.calls.count()).toBe(6);
        for (var index = 0; index < controller.anArray.length; index++) {
            if (index === 1) {
                expect(spy.calls.argsFor(index + 3)).toEqual([101]);
            } else {
                expect(spy.calls.argsFor(index + 3)).toEqual([2]);
            }
        }
    });

    it('should not touch what it doesn\'t belong to ng repeat', () => {
        controller.anArray = [
            {
                value: 0
            },
            {
                value: 0
            },
            {
                value: 0
            }];
        const handler =
            new directiveHandler(
                controllerService,
                '<ul>' +
                '   <div class="first-div"/>' +
                '   <li ng-repeat="item in ctrl.anArray" ng-click="ctrl.aFunction(item.value = item.value + 1)"></li>' + // aFunction === spy (bound)
                '   <div class="last-div"/>' +
                '</ul>'
            );
        controllerService.$apply();
        expect(handler.find('.first-div').length).toBe(1);
        expect(handler.find('.last-div').length).toBe(1);
        handler.find('li').click();
        for (let ii = 0; ii < controller.anArray.length; ii++) {
            //each scope has its own value but share the same controller
            //so the spy gets called 3 times, with the same value, one of each scope
            expect(spy.calls.argsFor(ii)).toEqual([1]); 
        }
        expect(handler.find('.first-div').length).toBe(1);
        expect(handler.find('.last-div').length).toBe(1);
        expect(spy.calls.count()).toBe(3);
        controller.anArray[1] = {
            value: 100
        };
        controllerService.$apply();
        handler.find('li').click();
        expect(handler.find('.first-div').length).toBe(1);
        expect(handler.find('.last-div').length).toBe(1);
        expect(spy.calls.count()).toBe(6);
        for (let ii = 0; ii < controller.anArray.length; ii++) {
            if (ii === 1) {
                expect(spy.calls.argsFor(ii + 3)).toEqual([101]);
            } else {
                expect(spy.calls.argsFor(ii + 3)).toEqual([2]);
            }
        }
    });

});

