import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveProvider from './../../src/directives/directiveProvider.js';
describe('ngModel', function() {
    let controllerService, myModel, spy, controller;
    const ngModel = directiveProvider.$get('ngModel');
    const expression = 'ctrl.myStringParameter';
    beforeEach(function() {
        spy = jasmine.createSpy('click');
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {}, true);
        controllerService.create();
        controller = controllerService.controllerInstance;
        myModel = ngModel.compile(controllerService, expression);
    });
    it('should be defined', function() {
        expect(myModel).toBeDefined();
    });
    it('should update the controller when receiving a string', function() {
        myModel('aValue');
        expect(controller.myStringParameter).toBe('aValue');
    });
    it('should fire an digest when doing and assigment', function() {
        controllerService.watch(expression, spy);
        expect(spy).not.toHaveBeenCalled();
        myModel('aValue');
        expect(spy).toHaveBeenCalled();
    });
    it('should return the current value of current state', function() {
        controller.myStringParameter = 'someValue';
        expect(myModel()).toBe('someValue');
    });
    it('should not fire digests when consulting', function() {
        controller.myStringParameter = 'someValue';
        controllerService.watch(expression, spy);
        myModel();
        expect(spy).not.toHaveBeenCalled();
    });
    it('should allow array to fire changes', function() {
        const object = {};
        controllerService.watch(expression, function(newValue) {
            object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
        });
        myModel(['a', 'V', 'a', 'l', 'u', 'e']);
        expect(controller.myStringParameter).toBe('aValue');
        expect(object).toEqual({
            a: 1, //only once
            aV: 1, //only once
            aVa: 1, //only once
            aVal: 1, //only once
            aValu: 1, //only once
            aValue: 1 //only once
        });
    });
    it('should allow a second true parameter, to simulate the array', function() {
        const object = {};
        controllerService.watch(expression, function(newValue) {
            object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
        });
        myModel('aValue', true);
        expect(controller.myStringParameter).toBe('aValue');
        expect(object).toEqual({
            a: 1, //only once
            aV: 1, //only once
            aVa: 1, //only once
            aVal: 1, //only once
            aValu: 1, //only once
            aValue: 1 //only once
        });
    });
    it('should have a changes function', function() {
        expect(myModel.changes).toEqual(jasmine.any(Function));
    });
    describe('changes', function() {
        it('changes should only fire once per change (independent of watcher)', function() {
            const watcherSpy = jasmine.createSpy();
            controllerService.watch(expression, watcherSpy);
            myModel.changes(spy);
            myModel('aValue', true);
            controller.myStringParameter = 'anotherValue';
            controllerService.$apply();
            expect(spy.calls.count()).toBe(6);
            expect(watcherSpy.calls.count()).toBe(7);
        });
    });
});