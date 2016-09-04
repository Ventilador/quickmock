import quickmock from './../src/quickmock.js';
describe('quickmock', function () {
    let controllerMocker;
    beforeEach(function () {
        controllerMocker = quickmock({
            providerName: 'withInjections',
            moduleName: 'test',
            mockModules: []
        });
    });
    it('should have defined a controllerMocker', function () {
        expect(controllerMocker).toBeDefined();
    });
    it('should have modified angular modules', function () {
        expect(quickmock.mockHelper).toBeDefined();
    });
    it('should inject mocked object first, then real', function () {
        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
        controllerMocker.$timeout();
        expect(controllerMocker.$timeout).toHaveBeenCalled();
    });
    it('should inject mocked object first, then real', function () {
        expect(controllerMocker.$timeout.and.identity()).toBe('___$timeout');
        expect(controllerMocker.$q.and.identity()).toBe('___$q');
        for (let key in controllerMocker.$timeout) {
            if (controllerMocker.$timeout.hasOwnProperty(key)) {
                expect(controllerMocker.$timeout[key]).toBe(controllerMocker.$mocks.$timeout[key]);
            }
        }
        for (let key in controllerMocker.$q) {
            if (controllerMocker.$q.hasOwnProperty(key)) {
                expect(controllerMocker.$q[key]).toBe(controllerMocker.$mocks.$q[key]);
            }
        }
        expect(controllerMocker.$q).toBe(controllerMocker.$mocks.$q);

    });
    describe('injecting scope', () => {
        let controllerService;
        const ref = function () { };
        beforeEach(function () {
            controllerService = quickmock({
                providerName: 'withScope',
                moduleName: 'test',
                mockModules: [],
                controller: {
                    parentScope: {
                        boundProperty: ref
                    },
                    bindToController: {
                        boundProperty: '='
                    }
                }
            });
        });
        it('should have defined the controller', () => {
            expect(controllerService).toBeDefined();
        });
        it('should have bound everything properly', () => {
            expect(controllerService.controllerScope.controller.boundProperty).toBe(ref);
            expect(controllerService.controllerInstance.boundProperty).toBe(ref);
            expect(controllerService.controllerInstance.scope.controller.boundProperty).toBe(ref);
            expect(controllerService.controllerScope.controller.scope.controller.boundProperty).toBe(ref);
        });
    });
    describe('Bindings', () => {
        let controllerService;
        const ref = {};
        const fnRef = function (firstArgument, secondArgument) {
            if (!firstArgument && !secondArgument) {
                return ref;
            }
            return [firstArgument, secondArgument];
        };
        const fnObj = {
            injections: {
                a: 'firstArgument',
                b: 'secondArgument',
                c: 'expressionObject'
            },
            fn: function (a, b, c) {
                if (c === fnObj) {
                    return fnRef(a, b);
                }
                throw 'invalid argument';
            }
        };
        const fnThisRef = function () {
            return this.expressionObject;
        };
        const fnThisRefObj = { injections: {}, fn: fnThisRef };
        beforeEach(function () {
            controllerService = quickmock({
                providerName: 'withScope',
                moduleName: 'test',
                mockModules: [],
                controller: {
                    parentScope: {
                        expressionFunction: fnRef,
                        expressionText: 'expressionFunction(firstArgument, secondArgument)',
                        expressionObject: fnObj,
                        expressionThisContextFunction: fnThisRef,
                        expressionThisContextText: 'expressionThisContextFunction()',
                        expressionThisContextObject: fnThisRefObj,
                        equalsReference: ref,
                        textReference: 'something',
                        expressionTextReference: '{{textReference}}',
                        oneWayBinding: ref
                    },
                    bindToController: {
                        expressionFunction: '&',
                        expressionObject: '&',
                        expressionText: '&',
                        expressionThisContextFunction: '&',
                        expressionThisContextText: '&',
                        expressionThisContextObject: '&',
                        equalsReference: '=',
                        textReference: '@',
                        expressionTextReference: '@',
                        oneWayBinding: '<'
                    },
                    controllerAs: 'ctrl'
                }
            });
        });

        describe('equals', function () {
            it('should assign the same reference', function () {
                expect(controllerService.controllerInstance.equalsReference).toBe(ref);
            });
            it('should have assigned the value to the parent scope', function () {
                expect(controllerService.parentScope.equalsReference).toBe(ref);
            });
            it('should modify the controller, if the parent changes', function () {
                controllerService.parentScope.equalsReference = Object.create(null);
                expect(controllerService.parentScope.equalsReference).not.toBe(controllerService.controllerInstance.equalsReference);
                controllerService.$apply();
                expect(controllerService.parentScope.equalsReference).toBe(controllerService.controllerInstance.equalsReference);
            });
            it('should modify the parent, if the controller changes', function () {
                controllerService.controllerInstance.equalsReference = Object.create(null);
                expect(controllerService.parentScope.equalsReference).not.toBe(controllerService.controllerInstance.equalsReference);
                controllerService.$apply();
                expect(controllerService.parentScope.equalsReference).toBe(controllerService.controllerInstance.equalsReference);
            });
            it('should give the parent preference over the child', function () {
                const parentReference = controllerService.parentScope.equalsReference = Object.create(null);
                controllerService.controllerInstance.equalsReference = Object.create(null);
                controllerService.$apply();
                expect(controllerService.parentScope.equalsReference).toBe(parentReference);
                expect(controllerService.controllerInstance.equalsReference).toBe(parentReference);
            });
        });
        ['Function', 'Text', 'Object'].forEach((key) => {
            describe('expression as ' + key, function () {
                it('should not give me the reference of the function, but a decorated reference of it', () => {
                    expect(controllerService.controllerInstance['expression' + key]).not.toBe(fnRef);
                });
                it('should return the same reference as the fn', () => {
                    expect(controllerService.controllerInstance['expression' + key]()).toBe(fnRef());
                });
                it('should support locals', () => {
                    const ref1 = {};
                    const ref2 = {};
                    expect(controllerService.controllerInstance['expression' + key]({
                        firstArgument: ref1,
                        secondArgument: ref2
                    })).toEqual(fnRef(ref1, ref2));
                    expect(controllerService.controllerInstance['expression' + key]({
                        firstArgument: ref2,
                        secondArgument: ref1
                    })).toEqual(fnRef(ref2, ref1));
                });
                it('should evaluate in the parents context', () => {
                    expect(controllerService.controllerInstance['expressionThisContext' + key]()).toBe(fnObj);
                    expect(controllerService.controllerInstance['expressionThisContext' + key]()).not.toBe(controllerService.controllerInstance.expressionObject);
                });
            });
        });
        describe('attribute', function () {
            it('should handle regular Attribute bindings', function () {
                expect(controllerService.controllerInstance.textReference).toBe('something');
            });
            describe('expression bindings', function () {
                it('should not assign the value before an $apply', function () {
                    expect(controllerService.controllerInstance.expressionTextReference).toBeUndefined();
                });
                it('should assign the value after an $apply', function () {
                    controllerService.$apply();
                    expect(controllerService.controllerInstance.expressionTextReference).toBe('something');
                });
                it('should change the value if the parent changes', function () {
                    controllerService.$apply();
                    expect(controllerService.controllerInstance.expressionTextReference).toBe('something');
                    controllerService.parentScope.textReference = 'somethingElse';
                    controllerService.$apply();
                    expect(controllerService.controllerInstance.expressionTextReference).toBe('somethingElse');
                });
            });
            it('should not modify the parent', function () {
                controllerService.controllerInstance.expressionTextReference = 'somethingElse';
                controllerService.$apply();
                expect(controllerService.parentScope.textReference).not.toBe('somethingElse');
            });
            it('should always have the parent value after an $apply()', () => {
                controllerService.controllerInstance.expressionTextReference = 'somethingElse';
                controllerService.$apply();
                expect(controllerService.controllerInstance.expressionTextReference).not.toBe('somethingElse');
                expect(controllerService.controllerInstance.expressionTextReference).toBe('something');
            });
        });

        describe('One way', function () {
            it('should have the parents value', () => {
                expect(controllerService.controllerInstance.oneWayBinding).toBe(ref);
            });
            it('should change child value if the parent changes (after $apply)', () => {
                controllerService.parentScope.oneWayBinding = {};
                expect(controllerService.controllerInstance.oneWayBinding).toBe(ref);
                controllerService.$apply();
                expect(controllerService.controllerInstance.oneWayBinding).not.toBe(ref);
                expect(controllerService.controllerInstance.oneWayBinding).toBe(controllerService.parentScope.oneWayBinding);
            });
            it('should not change the parent if the child changes', () => {
                controllerService.controllerInstance.oneWayBinding = {};
                controllerService.$apply();
                expect(controllerService.parentScope.oneWayBinding).not.toBe(controllerService.controllerInstance.oneWayBinding);
                expect(controllerService.parentScope.oneWayBinding).toBe(ref);
            });
            it('should remove the watcher when the child changes', () => {
                const newRef = controllerService.controllerInstance.oneWayBinding = { newRef: true };
                controllerService.$apply();
                expect(controllerService.controllerInstance.oneWayBinding).toBe(newRef, 'child new ref');
                expect(controllerService.parentScope.oneWayBinding).toBe(ref, 'parent old ref');
                const anotherNewRef = controllerService.parentScope.oneWayBinding = { anotherNewRef: true };
                controllerService.$apply();
                expect(controllerService.controllerInstance.oneWayBinding).toBe(newRef, 'child new ref');
                expect(controllerService.parentScope.oneWayBinding).toBe(anotherNewRef, 'parent new ref');
            });
        });
        describe('optionals', function () {
            let controllerService;
            const ref = function () { };
            beforeEach(function () {
                controllerService = quickmock({
                    providerName: 'withScope',
                    moduleName: 'test',
                    mockModules: [],
                    controller: {
                        parentScope: {
                            existing: ref,
                        },
                        bindToController: {
                            existing: '=?',
                            noneExistingOptional: '=?',
                            noneExisting: '='
                        }
                    }
                });
            });
            it('should have the existing with the reference', () => {
                expect(controllerService.controllerInstance.existing).toBe(ref);
            });
            it('should not have the missing optional as own property', () => {
                expect(controllerService.controllerInstance.hasOwnProperty('noneExistingOptional')).toBe(false);
            });
            it('should have the missing non optional property', () => {
                expect(controllerService.controllerInstance.hasOwnProperty('noneExisting')).toBe(true);
                expect(controllerService.controllerInstance.noneExisting).toBeUndefined();
            });
        });
    });
});
