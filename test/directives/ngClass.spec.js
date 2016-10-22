import { directiveProvider } from './../../src/directives/directiveProvider.js';
import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
describe('ngClass', () => {
    const ngClass = directiveProvider.$get('ng-class');

    let controller, controllerService, myClassText, myClassExpression;
    beforeEach(() => {
        controllerService = controllerHandler.clean().newService('emptyController', 'ctrl', {
            myStringParameter: 'my-class',
            class1: true,
            class2: false
        }, true);
        controller = controllerService.create();
        myClassText = ngClass.compile(controllerService, 'ctrl.myStringParameter');
        myClassExpression = ngClass.compile(controllerService, '{ "my-class": ctrl.class1, "my-other-class": ctrl.class2 }');
    });
    it('should be defined', () => {
        expect(myClassText).toBeDefined();
    });
    it('should return the class, but only after the first $digest', () => {
        expect(myClassText()).toBe('');
        controllerService.$apply();
        expect(myClassText()).toBe('my-class');
    });
    it('should accept semi build expressions', () => {
        expect(myClassExpression()).toBe('');
        controllerService.$apply();
        expect(myClassExpression()).toBe('my-class');
    });
    it('should check if it has the class, regardless of the expression', () => {
        expect(myClassText.hasClass('my-class')).toBe(false);
        expect(myClassText.hasClass('my-other-class')).toBe(false);
        expect(myClassExpression.hasClass('my-class')).toBe(false);
        expect(myClassExpression.hasClass('my-other-class')).toBe(false);
        controllerService.$apply();
        expect(myClassText.hasClass('my-class')).toBe(true);
        expect(myClassText.hasClass('my-other-class')).toBe(false);
        expect(myClassExpression.hasClass('my-class')).toBe(true);
        expect(myClassExpression.hasClass('my-other-class')).toBe(false);
        controller.class2 = true;
        controller.class1 = false;
        controller.myStringParameter = 'my-other-class';
        controllerService.$apply();
        expect(myClassText.hasClass('my-class')).toBe(false);
        expect(myClassText.hasClass('my-other-class')).toBe(true);
        expect(myClassExpression.hasClass('my-class')).toBe(false);
        expect(myClassExpression.hasClass('my-other-class')).toBe(true);
    });
});