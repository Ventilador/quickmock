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

    afterEach(function() {
        controllerService.$destroy();
    });

    it('should be defined', () => {
        expect(myRepeat).toBeDefined();
    });
    it('should be a function', () => {
        expect(myRepeat).toEqual(jasmine.any(Function));
    });
    it('should return an object before digest', () => {
        expect(myRepeat()).toBeDefined();
        expect(myRepeat()).toEqual(jasmine.any(Object));
    });
    it('should return an object representing the array', () => {
        controllerService.$apply();
        expect(Object.keys(myRepeat().differences.added).length).toBe(6);
    });
    describe('detect changes', () => {
        beforeEach(() => {
            // starting the collection
            controller.myArray = [];
            for (var index = 0; index < 10; index++) {
                controller.myArray.push({
                    initialKey: index
                });
            }
            controllerService.$apply();
        });
        it('should detect reference changes', () => {
            const firstValue = myRepeat();
            controllerService.$apply(); //no change
            let secondValue = myRepeat();
            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
            controller.myArray[0] = {
                a: 'changed'
            };
            controllerService.$apply(); //changes change
            secondValue = myRepeat();
            // although the results seem wrong they are right
            // what the ng repeat does it watch the collection,
            // so "new references" will be marked as added and
            // removed at the same time and items that MIGHT
            // have changed, as modified.
            // Is each specific item's scope responsability to
            // watch itself, and respond properly
            expect(firstValue.differences.added.length).toBe(10);
            expect(secondValue.differences.added.length).toBe(1);
            expect(firstValue.differences.removed.length).toBe(0);
            expect(secondValue.differences.removed.length).toBe(1);
            expect(firstValue.differences.modified.length).toBe(0);
            expect(secondValue.differences.modified.length).toBe(9);
        });
        it('should not detect internal changes', () => {
            const firstValue = myRepeat();
            controller.myArray.forEach((element, index) => {
                element.initialKey = index + 5;
            });
            controllerService.$apply();
            const secondValue = myRepeat();
            // this is because since the not refernce of the array
            // nor any reference of each of the immediate childrens has changed
            // the watch didn't fire
            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
        });
        it('should however, fire internal scopes watches', () => {
            const firstValue = myRepeat();
            const mySpies = [];
            controller.myArray.forEach((element, index) => {
                element.initialKey = index + 5;
                mySpies.push(jasmine.createSpy('spy' + index));
                firstValue.objects[index].scope.$watch(myRepeat.keyIdentifier + '.initialKey', (newValue, oldValue, scope) => {
                    mySpies[index](newValue, oldValue, scope);
                });
            });
            controllerService.$apply(); // watches fire the first time with the new value on both parameters (and the scope)
            const secondValue = myRepeat();
            // as before
            expect(firstValue.differences.added.length).toBe(secondValue.differences.added.length);
            expect(firstValue.differences.removed.length).toBe(secondValue.differences.removed.length);
            expect(firstValue.differences.modified.length).toBe(secondValue.differences.modified.length);
            mySpies.forEach((spy, index) => {
                expect(spy).toHaveBeenCalledWith(index + 5, index + 5, firstValue.objects[index].scope);
            });
        });
    });
});