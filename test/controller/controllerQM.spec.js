describe('controller', function() {
    it('should be defined', function() {
        expect(controller).toBeDefined();
    });
    it('should have a $get method which return a controller generator', function() {
        expect(controller.$get).toBeDefined();
        expect(angular.isFunction(controller.$get)).toBe(true);
        expect(angular.isFunction(controller.$get().create)).toBe(true);
    });
    describe('$get', function() {
        var controllerCreator;
        beforeEach(function() {
            controllerCreator = controller.$get('test');
        });
        it('should return a valid controller', function() {
            var controller = controllerCreator.create('emptyController');
            expect(controller).toBeDefined();
            expect(controller().name).toBe('emptyController');
        });
        it('should handle controllers with injections', function() {
            var controller = controllerCreator.create('withInjections');
            expect(controller().q).toBeDefined();
        });
        it('should support creating a controller with an scope', function() {
            var controller = controllerCreator.create('emptyController', {});
            expect(controller).toBeDefined();
        });
        it('should set a property in the scope for the controller', function() {
            var scope = scopeHelper.$rootScope.$new();
            var controller1 = controllerCreator.create('withBindings', scope, false)();
            expect(scope.$$childHead.controller).toBe(controller1);
        });
        it('should set a property in the scope for the controller with the given name', function() {
            var scope = scopeHelper.$rootScope.$new();
            var controller1 = controllerCreator.create('withBindings', scope, false, 'myController')();
            expect(scope.$$childHead.myController).toBe(controller1);
        });
        describe('bindings', function() {
            it('should support "true" and "=" as bindToController', function() {
                var controller1 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, true)();
                expect(controller1.boundProperty).toBe('Something modified');
                var controller2 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, '=')();
                expect(controller2.boundProperty).toBe('Something modified');
            });
            it('should not bind if bindToController is "false" or "undefined"', function() {
                var controller1 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                }, false)();
                expect(controller1.boundProperty).toBe('undefined modified');
                var controller2 = controllerCreator.create('withBindings', {
                    boundProperty: 'Something'
                })();
                expect(controller2.boundProperty).toBe('undefined modified');
            });

            describe('bindToController', function() {
                it('should support bindToController as an object for "="', function() {
                    var controller = controllerCreator.create('withBindings', {
                        boundProperty: 'Something'
                    }, {
                        boundProperty: '='
                    });
                    expect(controller().boundProperty).toBe('Something modified');
                });
                it('should support bindToController as an object for "@"', function() {
                    var controller = controllerCreator.create('withBindings', {
                        boundProperty: 'Something'
                    }, {
                        boundProperty: '@'
                    });
                    expect(controller().boundProperty).toBe('Something modified');
                });
                it('should support bindToController as an object for "&"', function() {
                    var controller = controllerCreator.create('emptyController', {
                        boundProperty: 'otherProperty.join("")',
                        otherProperty: [1, 2, 3]
                    }, {
                        boundProperty: '&'
                    });
                    controller = controller();
                    expect(controller.boundProperty()).toBe('123');

                });
                it('expressions should allow locals', function() {
                    var controller = controllerCreator.create('emptyController', {
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