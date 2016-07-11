import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveProvider from './../../src/directives/directiveProvider.js';
describe('ngRepeat', function() {
    let controllerService, myRepeat, spy, controller;
    const ngRepeat = directiveProvider.$get('ngRepeat');
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            myArray: [{
                a: 'a'
            }, {
                b: 'b'
            }, {
                c: 'c'
            }, {
                d: 'd'
            }, {
                e: 'e'
            }, {
                f: 'f'
            }]
        }, true);
        controllerService.create();
        controller = controllerService.controllerInstance;
        myRepeat = ngRepeat.compile(controllerService, 'items in ctrl.myArray');
    });
    it('should be defined', () => {
        expect(myRepeat).toBeDefined();
    });
    it('should be a function', () => {
        expect(myRepeat).toEqual(jasmine.any(Function));
    });
    it('should return an object before digest', () => {
        expect(myRepeat()).toBeDefined();
        expect(myRepeat()).toEqual(Object.create(null));
    });
    it('should return an object representing the array', () => {
        controllerService.$apply();
        expect(Object.keys(myRepeat()).length).toBe(6);
    });
    it('should detect changes', () => {
        console.log(myRepeat());
        controllerService.$apply();
        const firstValue = myRepeat();
        controllerService.$apply(); //no change
        let secondValue = myRepeat();
        expect(firstValue).toBe(secondValue);
        controller.myArray[0] = {
            a: 'changed'
        };
        controllerService.$apply();
        secondValue = myRepeat();
        expect(firstValue).not.toBe(secondValue);
    });
});