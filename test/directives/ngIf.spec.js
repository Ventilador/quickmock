import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveProvider from './../../src/directives/directiveProvider.js';
describe('ngIf', function() {
    let controllerService, myIf;
    const ngIf = directiveProvider.$get('ng-if');
    beforeEach(function() {
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            myBoolean: true
        }, true);
        controllerService.create();
        myIf = ngIf.compile(controllerService, 'ctrl.myBoolean');
    });
    it('should have defined myIf', function() {
        expect(myIf).toBeDefined();
    });
    it('should return undefined if no $digest was executed', function() {
        expect(myIf.value()).toBeUndefined();
    });
    it('should return the value of the expression', function() {
        controllerService.$apply();
        expect(myIf.value()).toBe(true);
    });
    it('should return the latest evaluated value on a watch', function() {
        controllerService.$apply();
        controllerService.controllerInstance.myBoolean = angular.noop;
        expect(myIf.value()).not.toBe(angular.noop);
        controllerService.$apply();
        expect(myIf.value()).toBe(angular.noop);
    });
    it('should allow attaching spys to the watching cycle', function() {
        const mySpy = jasmine.createSpy();
        myIf(mySpy);
        controllerService.$apply();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy.calls.count()).toBe(1);
    });
    it('should allow deattaching spies to the watching cycle', function() {
        const mySpy = jasmine.createSpy();
        const watcher = myIf(mySpy);
        watcher();
        controllerService.$apply();
        expect(mySpy).not.toHaveBeenCalled();
    });
    it('should only deattach the correcponding spy', function() {
        const mySpy = jasmine.createSpy();
        const mySpy2 = jasmine.createSpy();
        const watcher = myIf(mySpy);
        myIf(mySpy2);
        watcher();
        controllerService.$apply();
        expect(mySpy).not.toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });
  
});