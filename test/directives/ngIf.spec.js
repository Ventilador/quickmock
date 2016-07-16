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
        expect(myIf()).toBeUndefined();
    });
    it('should return the value of the expression', function() {
        controllerService.$apply();
        expect(myIf()).toBe(true);
    });
    it('should return the latest evaluated value on a watch', function() {
        controllerService.$apply();
        controllerService.controllerInstance.myBoolean = angular.noop;
        expect(myIf()).not.toBe(angular.noop);
        controllerService.$apply();
        expect(myIf()).toBe(angular.noop);
    });
    it('should allow attaching spys to the watching cycle', function() {
        const mySpy = jasmine.createSpy();
        myIf.changes(mySpy);
        controllerService.$apply();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy.calls.count()).toBe(1);
    });
    it('should allow deattaching spies to the watching cycle', function() {
        const mySpy = jasmine.createSpy();
        const watcher = myIf.changes(mySpy);
        watcher();
        controllerService.$apply();
        expect(mySpy).not.toHaveBeenCalled();
    });
    it('should only deattach the correcponding spy', function() {
        const mySpy = jasmine.createSpy();
        const mySpy2 = jasmine.createSpy();
        const watcher = myIf.changes(mySpy);
        myIf.changes(mySpy2);
        watcher();
        controllerService.$apply();
        expect(mySpy).not.toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });
  
});