import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import {directiveProvider }from './../../src/directives/directiveProvider.js';
describe('ngTranslate', function() {
    let controllerService, myTranslate;
    const ngTranslate = directiveProvider.$get('translate');
    beforeEach(function() {
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            prop: 'TITLE'
        }, true);
        controllerService.create();
        myTranslate = ngTranslate.compile(controllerService, '{{ctrl.prop}}');
        ngTranslate.changeLanguage('en');
        controllerService.$apply();
    });
    it('should allow calling the translate method', () => {
        expect(() => {
            myTranslate();
        }).not.toThrow();
    });
    it('should return the translated value (once evaluated)', () => {
        expect(myTranslate()).toBe('Hello');
    });
    it('should return the old value if it wasn\'t evaluated', () => {
        myTranslate.changeLanguage('de');
        expect(myTranslate()).toBe('Hello');
        controllerService.$apply();
        expect(myTranslate()).toBe('Hallo');
    });
    it('should allow me to attach to changes', () => {
        const spy = jasmine.createSpy('translate');
        myTranslate.changes(spy);
        controllerService.controllerInstance.prop = 'FOO';
        controllerService.$apply();
        expect(spy).toHaveBeenCalledWith('This is a paragraph.');
    });
});