import controller from './../../src/controller/controllerQM.js';
import {
    scopeHelper
} from './../../src/controller/common.js';
describe('controller', function () {
    it('should be defined', function () {
        expect(controller).toBeDefined();
    });
    it('should have a $get method which return a controller generator', function () {
        expect(controller.$get).toBeDefined();
        expect(angular.isFunction(controller.$get)).toBe(true);
        expect(angular.isFunction(controller.$get('ng').create)).toBe(true);
    });
    describe('$get', function () {
        let controllerCreator;
        beforeEach(function () {
            controllerCreator = controller.$get('test');
        });
        it('should return a valid controller', function () {
            const controller = controllerCreator.create('emptyController');
            expect(controller).toBeDefined();
            expect(controller().name).toBe('emptyController');
        });
        it('should handle controllers with injections', function () {
            const controller = controllerCreator.create('withInjections');
            expect(controller().$q).toBeDefined();
        });
        it('should support creating a controller with an scope', function () {
            const controller = controllerCreator.create('emptyController', {});
            expect(controller).toBeDefined();
        });
        it('should set a property in the scope for the controller', function () {
            const scope = scopeHelper.$rootScope.$new();
            const controller1 = controllerCreator.create('withBindings', scope, false)();
            expect(scope.$$childHead.controller).toBe(controller1);
        });
        it('should set a property in the scope for the controller with the given name', function () {
            const scope = scopeHelper.$rootScope.$new();
            const controller1 = controllerCreator.create('withBindings', scope, false, 'myController')();
            expect(scope.$$childHead.myController).toBe(controller1);
        });
        describe('bindings', function () {
            it('should support "true" and "=" as bindToController', function () {
                const controller1 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, true)();
                expect(controller1.boundProperty).toBe('Something modified');
                const controller2 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, '=')();
                expect(controller2.boundProperty).toBe('Something modified');
            });
            it('should not bind if bindToController is falsy', function () {
                const controller1 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, false)();
                expect(controller1.boundProperty).toBe('undefined modified');
                const controller2 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                })();
                expect(controller2.boundProperty).toBe('undefined modified');
            });

            describe('bindToController', function () {
                it('should support bindToController as an object for "="', function () {
                    const controller = controllerCreator.create('withBindings', {
                        boundProperty: 'Something'
                    }, {
                            boundProperty: '='
                        });
                    expect(controller().boundProperty).toBe('Something modified');
                });
                it('should support bindToController as an object for "@"', function () {
                    const controller = controllerCreator.create('withBindings', {
                        boundProperty: 'Something'
                    }, {
                            boundProperty: '@'
                        });
                    expect(controller().boundProperty).toBe('Something modified');
                });
                describe('expression binding', () => {
                    it('should support text expressions', function () {
                        let controller = controllerCreator.create('emptyController', {
                            boundProperty: 'otherProperty.join("")',
                            otherProperty: [1, 2, 3]
                        }, {
                                boundProperty: '&'
                            });
                        controller = controller();
                        expect(controller.boundProperty()).toBe('123');
                    });
                    it('should support functions', function () {
                        let controller = controllerCreator.create('emptyController', {
                            boundProperty: function () {
                                return [1, 2, 3].join('');
                            },
                            otherProperty: [1, 2, 3]
                        }, {
                                boundProperty: '&'
                            });
                        controller = controller();
                        expect(controller.boundProperty()).toBe('123');
                    });
                });
                it('expressions should allow locals', function () {
                    let controller = controllerCreator.create('emptyController', {
                        boundProperty: 'otherProperty.join("")',
                        otherProperty: [1, 2, 3]
                    }, {
                            boundProperty: '&'
                        });
                    controller = controller();
                    expect(controller.boundProperty({
                        otherProperty: ['a', 'b', 'c']
                    })).toBe('abc');
                });
            });
        });
    });
});