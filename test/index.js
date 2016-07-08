/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	  var injections = (function() {
	      var toReturn = {
	          $rootScope: scopeHelper.$rootScope
	      };
	      return toReturn;
	  })();
	  describe('Util logic', function() {
	      beforeEach(function() {
	          var $rootScope = scopeHelper.$rootScope;
	      });
	      describe('array-like', function() {
	          it('should return true for array-like objects', function() {
	              expect(isArrayLike(arguments)).toBe(true);
	              expect(isArrayLike([])).toBe(true);
	              var testObject = {
	                  length: 1,
	                  0: 'lala'
	              };
	              expect(isArrayLike(testObject)).toBe(true);
	              if (isArrayLike(testObject)) {
	                  expect(function() {
	                      Array.prototype.slice.apply(testObject);
	                  }).not.toThrow();
	              }
	          });
	      });
	      describe('sanitizeModles', function() {
	          it('should allow empty modules', function() {
	              expect(function() {
	                  sanitizeModules();
	              }).not.toThrow();
	              expect(function() {
	                  sanitizeModules([]);
	              }).not.toThrow();
	              expect(function() {
	                  sanitizeModules({
	                      length: 0
	                  });
	              }).not.toThrow();
	          });
	          it('shoud add ng module it its not present', function() {
	              expect(sanitizeModules().indexOf('ng')).not.toBe(-1);
	              expect(sanitizeModules([]).indexOf('ng')).not.toBe(-1);
	              expect(sanitizeModules({
	                  length: 0
	              }).indexOf('ng')).not.toBe(-1);
	          });
	          it('should not add ng nor angular to the array', function() {
	              expect(sanitizeModules('ng').length).toBe(1);
	              expect(sanitizeModules('angular').length).toBe(1);
	          });
	          it('should allow passing arrays-like objects', function() {
	              var object1 = ['module1', 'module2'];
	              var object2 = arguments;
	              var object3 = {
	                  length: 2,
	                  0: 'module1',
	                  1: 'module2'
	              };
	              [object1, object2, object3].forEach(function(value) {
	                  expect(function() {
	                      var result = sanitizeModules(value);
	                      expect(result.length).toBe(value.length + 1);
	                  }).not.toThrow();
	              });
	          });
	          it('should move default ng/angular module to the first position', function() {
	              var result1 = sanitizeModules(['module1', 'module2', 'ng']),
	                  result2 = sanitizeModules(['module1', 'module2', 'angular']);
	              expect(result1[0]).toBe('ng');
	              expect(result1.length).toBe(3);
	              expect(result2[0]).toBe('ng');
	              expect(result2.length).toBe(3);
	          });
	      });
	      describe('scopeHelper', function() {
	          it('should return a scope when no arguments where given', function() {
	              expect(scopeHelper.create().$root).toBe(injections.$rootScope);
	          });
	          it('should return the same scope reference when it receive a scope', function() {
	              var scope = injections.$rootScope.$new();
	              expect(scopeHelper.create(scope)).toBe(scope);
	          });
	          it('should return the same scope reference when it receives an isolated scope', function() {
	              var scope = injections.$rootScope.$new(true);
	              expect(scopeHelper.create(scope)).toBe(scope);
	          });
	          it('should return an scope with the properties of a passed object', function() {
	              var toPass = {
	                  a: {}, // for reference checking
	                  b: {}
	              };
	              var returnedScope;
	              expect(function() {
	                  returnedScope = scopeHelper.create(toPass);
	              }).not.toThrow();
	              expect(returnedScope.a).toBe(toPass.a);
	              expect(returnedScope.b).toBe(toPass.b);
	          });
	          it('should know when an object is a controller Constructor', function() {
	              controllerHandler.clean();
	              var controllerObj = controllerHandler.setScope({
	                  boundProperty: 'something'
	              }).bindWith({
	                  boundProperty: '='
	              }).new('withBindings');

	              expect(scopeHelper.isController(controllerObj)).toBe(true);
	              controllerObj.$destroy();
	          });
	      });
	  });

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	describe('controllerHandler', function() {
	    beforeEach(function() {
	        controllerHandler.clean();
	    });
	    it('should be defined', function() {
	        expect(controllerHandler).toBeDefined();
	    });
	    it('should allow adding modules', function() {
	        expect(function() {
	            controllerHandler.addModules('myModule');
	        }).not.toThrow();
	    });
	    it('should return the controllerHandler when adding modules', function() {
	        expect(controllerHandler.addModules('myModule')).toBe(controllerHandler);
	    });
	    describe('creating a controller', function() {
	        beforeEach(function() {
	            controllerHandler.addModules('test');
	        });
	        it('should allow creating a controller', function() {
	            var controllerObj;
	            expect(function() {
	                controllerObj = controllerHandler.new('emptyController');
	            }).not.toThrow();
	            expect(controllerObj).toBeDefined();
	            expect(controllerObj.parentScope).toBeDefined();
	            expect(controllerObj.controllerScope).toBeDefined();
	            expect(controllerObj.controllerScope.$parent).toBe(controllerObj.parentScope);
	            expect(controllerObj.controllerInstance).toBeUndefined();
	            expect(controllerObj.usedModules).toEqual(['test']);
	        });
	        it('should allow creating a controller with bindings', function() {
	            var controllerObj = controllerHandler.setScope({
	                boundProperty: 'something'
	            }).bindWith({
	                boundProperty: '='
	            }).new('withBindings');
	            expect(controllerObj.create()).toBe(controllerObj.controllerInstance);
	            expect(controllerObj.controllerInstance.boundProperty).toBe('something modified');
	        });
	        it('should allow to change the name of the binding', function() {
	            var scope = {
	                    equals: function() {},
	                    byText: 'byText',
	                    expression: 'byText.toUpperCase()'
	                },
	                controllerObj = controllerHandler.setScope(scope).bindWith({
	                    equalsResult: '=equals',
	                    byTextResult: '@byText',
	                    expressionResult: '&expression'
	                }).new('emptyController');
	            expect(function() {
	                controllerObj.create();
	            }).not.toThrow();
	            expect(controllerObj.controllerInstance.equalsResult).toBe(scope.equals);
	            expect(controllerObj.controllerInstance.byTextResult).toBe(scope.byText);
	            expect(controllerObj.controllerInstance.expressionResult()).toBe(scope.byText.toUpperCase());
	        });
	        describe('Watchers', function() {
	            var scope, controllerObj;
	            beforeEach(function() {
	                scope = controllerHandler.$rootScope.$new();
	            });
	            it('should allow adding watchers', function() {
	                scope.boundProperty = 'lala';
	                controllerObj = controllerHandler.setScope(scope).bindWith({
	                        boundProperty: '='
	                    })
	                    .new('emptyController');
	                var args;
	                var controller = controllerObj.watch('controller.boundProperty', function() {
	                    args = arguments;
	                }).create();
	                expect(controller.boundProperty).toBe('lala');
	                controller.boundProperty = 'lolo';
	                controllerObj.controllerScope.$apply();
	                expect(args).toBeDefined();
	            });
	            it('should reflec changes on the controller into the scope', function() {
	                scope.boundProperty = 'lala';
	                controllerObj = controllerHandler.setScope(scope).bindWith({
	                        boundProperty: '='
	                    })
	                    .new('withInjections');
	                var args;
	                var controller = controllerObj.watch('controller.boundProperty', function() {
	                    args = arguments;
	                }).create();
	                expect(controller.boundProperty).toBe('lala');
	                controller.boundProperty = 'lolo';
	                controllerObj.$apply();
	                expect(controllerObj.parentScope.boundProperty).toBe('lolo');
	                controllerObj.parentScope.$destroy();
	            });
	            it('should reflec changes on the scope into the controller', function() {
	                scope.boundProperty = 'lala';
	                controllerObj = controllerHandler.setScope(scope).bindWith({
	                        boundProperty: '='
	                    })
	                    .new('withInjections');
	                var controller = controllerObj.create();
	                controllerObj.parentScope.boundProperty = 'parent';
	                controllerObj.$apply();
	                expect(controller.boundProperty).toBe('parent');
	            });
	            it('should give the parent scope privilege over the controller', function() {
	                controllerObj = controllerHandler.setScope(scope).bindWith({
	                        boundProperty: '='
	                    })
	                    .new('withInjections');
	                var controller = controllerObj.create();
	                controllerObj.parentScope.boundProperty = 'parent';
	                controller.boundProperty = 'child';
	                controllerObj.$apply();
	                expect(controller.boundProperty).toBe('parent');
	                expect(controllerObj.parentScope.boundProperty).toBe('parent');
	            });
	        });
	    });
	    describe('destroying a controller', function() {
	        var controllerObj;
	        beforeEach(function() {
	            controllerHandler.clean();
	            controllerHandler.addModules('test');
	        });
	        it('should allow destroying the object', function() {
	            expect(function() {
	                controllerObj = controllerHandler.new('emptyController');
	            }).not.toThrow();
	            var controller = controllerObj.create(false);
	            var parentScope = controllerObj.parentScope;
	            var controllerScope = controllerObj.controllerScope;
	            controllerObj.$destroy();
	        });
	    });
	});

/***/ },
/* 8 */
/***/ function(module, exports) {

	describe('controllerSpies', function() {
	    var uniqueObject = function uniqueObject() {};
	    var controllerConstructor;
	    beforeEach(function() {
	        controllerHandler.clean();
	        if (controllerConstructor) {
	            controllerConstructor.$destroy();
	        }
	        controllerConstructor = controllerHandler.addModules('test').bindWith({
	            a: '=',
	            b: '@',
	            c: '&'
	        }).setScope({
	            a: uniqueObject,
	            b: 'b',
	            c: 'a'
	        }).new('emptyController');
	    });
	    it('should create spies for each Bounded property', function() {
	        var controller = controllerConstructor.create();
	        var mySpy = controllerConstructor.InternalSpies.Scope['a:a'];
	        expect(mySpy).toBeDefined();
	        controller.a = undefined;
	        expect(mySpy).not.toHaveBeenCalled();
	        controllerConstructor.$apply();
	        expect(mySpy).toHaveBeenCalled();
	        expect(typeof mySpy.took() === 'number').toBe(true);
	        expect(mySpy.took()).toBe(mySpy.took());
	        expect(mySpy.calls.count()).toBe(1);
	        controllerConstructor.$apply();
	        expect(mySpy.calls.count()).toBe(1);
	    });
	});

/***/ },
/* 9 */
/***/ function(module, exports) {

	describe('directiveProvider', function() {
	    it('should be defined', function() {
	        expect(directiveProvider).toBeDefined();
	    });
	    it('should have a $get method', function() {
	        expect(angular.isFunction(directiveProvider.$get)).toBe(true);
	    });
	    it('should return undefined and not throw is the directive does not exist', function() {
	        var returned = {};
	        expect(function() {
	            returned = directiveProvider.$get('not existing');
	        }).not.toThrow();
	        expect(returned).toBeUndefined();
	    });
	    [
	        'ng-if',
	        'ng:if',
	        'ngIf',
	        'ng-repeat',
	        'ng-click',
	        'ng-disabled',
	        'ng-bind',
	        'ng-model',
	        'translate',
	        'translate-value',
	        'ng-class'
	    ].forEach(function(item) {
	        it('should always contain the ' + item + 'directive', function() {
	            expect(directiveProvider.$get(item)).toBeDefined(item);
	        });
	    });

	    describe('puts and uses', function() {
	        var spy;
	        beforeEach(function() {
	            spy = jasmine.createSpy();
	            spy.and.returnValue(spy);
	            directiveProvider.$clean();
	        });
	        it('should allow adding directives', function() {
	            expect(function() {
	                directiveProvider.$put('my-directive', spy);
	            }).not.toThrow();
	            expect(spy).toHaveBeenCalled();
	            expect(directiveProvider.$get('my-directive')).toBe(spy);
	            expect(directiveProvider.$get('my:directive')).toBe(spy);
	            expect(directiveProvider.$get('myDirective')).toBe(spy);
	            expect(spy.calls.count()).toBe(1);
	        });
	        it('should not allow overwriting, but preserve first versions', function() {
	            directiveProvider.$put('my-directive', spy);
	            expect(function() {
	                directiveProvider.$put('my-directive', function() {});
	            }).toThrow();
	            expect(directiveProvider.$get('my-directive')).toBe(spy);
	        });
	        it('allow me to overwrite with a third parameter in a function that return true', function() {
	            directiveProvider.$put('my-directive', spy);
	            var anotherSpy = jasmine.createSpy();
	            anotherSpy.and.returnValue(anotherSpy);
	            expect(function() {
	                directiveProvider.$put('my-directive', anotherSpy, function() {
	                    return true;
	                });
	            }).not.toThrow();
	            expect(directiveProvider.$get('my-directive')).not.toBe(spy);
	            expect(directiveProvider.$get('my-directive')).toBe(anotherSpy);
	            expect(spy.calls.count()).toBe(1);
	            expect(anotherSpy.calls.count()).toBe(1);
	        });
	    });
	});

/***/ },
/* 10 */
/***/ function(module, exports) {

	describe('directiveHandler', function() {
	    var controllerService, spy, controller;
	    var expression = 'ctrl.myStringParameter';
	    beforeEach(function() {
	        spy = jasmine.createSpy('click');
	        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
	            aString: 'aValue',
	            aFunction: spy,
	            aKey: 'HELLO',
	            aInt: 0
	        }, {
	            aString: '=',
	            aFunction: '&',
	            aKey: '@',
	            aInt: '='
	        });
	        controllerService.create();
	        controller = controllerService.controllerInstance;
	    });
	    it('should be defined', function() {
	        expect(directiveHandler).toBeDefined();
	    });
	    it('should allow me to create new instances', function() {
	        expect(function() {
	            var temp = new directiveHandler();
	        }).not.toThrow();
	    });
	    it('should be able to compile html', function() {
	        expect(function() {
	            var temp = new directiveHandler(controllerService, '<div/>');
	        }).not.toThrow();
	    });
	    describe('ngClick', function() {
	        it('should allow me to call ng-click', function() {
	            var handler = new directiveHandler(controllerService, '<div ng-click="ctrl.aString = \'anotherValue\'"/>');
	            handler.click();
	            expect(controller.aString).toBe('anotherValue');
	        });
	        it('should not fail if the selected item is invalid', function() {
	            var handler = new directiveHandler(controllerService, '<div />');
	            expect(function() {
	                handler.ngFind('a').click();
	            }).not.toThrow();
	        });
	        it('should not fail if the selected does not have the property', function() {
	            var handler = new directiveHandler(controllerService, '<div />');
	            expect(function() {
	                handler.click();
	            }).not.toThrow();
	        });
	        it('should apply the click event to each of its childrens (if needed)', function() {
	            /* jshint ignore:start */
	            var handler = new directiveHandler(controllerService,
	                `   <div ng-click="ctrl.aInt = ctrl.aInt + 1">
	                    <div id='first'>
	                        <div id='second'>
	                        </div>
	                    </div>
	                    <div id='third'>
	                    </div>
	                <div/>`);
	            /* jshint ignore:end */
	            handler.ngFind('#first').click();
	            handler.ngFind('#second').click();
	            handler.ngFind('#third').click();
	            expect(controller.aInt).toBe(3);
	        });
	        it('should support locals (for testing)', function() {
	            /* jshint ignore:start */
	            var handler = new directiveHandler(controllerService,
	                `   <div ng-click="ctrl.aInt =  value + ctrl.aInt ">
	                    <div id='first'>
	                        <div id='second'>
	                        </div>
	                    </div>
	                    <div id='third'>
	                    </div>
	                <div/>`);
	            /* jshint ignore:end */
	            handler.ngFind('#first').click({
	                value: 1000
	            });
	            expect(controller.aInt).toBe(1000);
	            handler.ngFind('#second').click({
	                value: ''
	            });
	            expect(controller.aInt).toBe('1000');
	            handler.ngFind('#third').click({
	                value: 1
	            });
	            expect(controller.aInt).toBe('11000');
	        });
	    });
	    describe('ngBind', function() {
	        it('should allow me to call text', function() {
	            var handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
	            expect(handler.text()).toBe('aValue');
	        });
	        it('should allow me to change the controller value', function() {
	            var handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
	            handler.text('newValue');
	            expect(controller.aString).toBe('newValue');
	        });
	        it('should allow me to change the controller value, one letter at the time', function() {
	            var handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
	            controllerService.watch('ctrl.aString', spy);
	            handler.text('newValue'.split(''));
	            expect(controller.aString).toBe('newValue');
	            expect(spy.calls.count()).toBe('newValue'.length);
	        });
	    });
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	  describe('ngIf', function() {
	      var controllerService, myIf;
	      var ngIf = directiveProvider.$get('ng-if');
	      beforeEach(function() {
	          controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
	              myBoolean: true
	          }, true);
	          controllerService.create();
	          myIf = ngIf.compile('ctrl.myBoolean', controllerService);
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
	          var mySpy = jasmine.createSpy();
	          myIf(mySpy);
	          controllerService.$apply();
	          expect(mySpy).toHaveBeenCalled();
	          expect(mySpy.calls.count()).toBe(1);
	      });
	      it('should allow deattaching spies to the watching cycle', function() {
	          var mySpy = jasmine.createSpy();
	          var watcher = myIf(mySpy);
	          watcher();
	          controllerService.$apply();
	          expect(mySpy).not.toHaveBeenCalled();
	      });
	      it('should only deattach the correcponding spy', function() {
	          var mySpy = jasmine.createSpy();
	          var mySpy2 = jasmine.createSpy();
	          var watcher = myIf(mySpy);
	          myIf(mySpy2);
	          watcher();
	          controllerService.$apply();
	          expect(mySpy).not.toHaveBeenCalled();
	          expect(mySpy2).toHaveBeenCalled();
	      });
	  });

/***/ },
/* 12 */
/***/ function(module, exports) {

	 describe('ngBind', function() {
	     var controllerService, myBind, spy, controller;
	     var ngBind = directiveProvider.$get('ngBind');
	     var expression = 'ctrl.myStringParameter';
	     beforeEach(function() {
	         spy = jasmine.createSpy('click');
	         controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {}, true);
	         controllerService.create();
	         controller = controllerService.controllerInstance;
	         myBind = ngBind.compile(controllerService, expression);
	     });
	     it('should be defined', function() {
	         expect(myBind).toBeDefined();
	     });
	     it('should update the controller when receiving a string', function() {
	         myBind('aValue');
	         expect(controller.myStringParameter).toBe('aValue');
	     });
	     it('should fire an digest when doing and assigment', function() {
	         controllerService.watch(expression, spy);
	         expect(spy).not.toHaveBeenCalled();
	         myBind('aValue');
	         expect(spy).toHaveBeenCalled();
	     });
	     it('should return the current value of current state', function() {
	         controller.myStringParameter = 'someValue';
	         expect(myBind()).toBe('someValue');
	     });
	     it('should not fire digests when consulting', function() {
	         controller.myStringParameter = 'someValue';
	         controllerService.watch(expression, spy);
	         myBind();
	         expect(spy).not.toHaveBeenCalled();
	     });
	     it('should allow array to fire changes', function() {
	         var object = {};
	         controllerService.watch(expression, function(newValue) {
	             object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
	         });
	         myBind(['a', 'V', 'a', 'l', 'u', 'e']);
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
	         var object = {};
	         controllerService.watch(expression, function(newValue) {
	             object[newValue] = !object[newValue] ? 1 : object[newValue] + 1; //counting the calls
	         });
	         myBind('aValue', true);
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
	         expect(myBind.changes).toEqual(jasmine.any(Function));
	     });
	     describe('changes', function() {
	         it('changes should only fire once per change (independent of watcher)', function() {
	             var watcherSpy = jasmine.createSpy();
	             controllerService.watch(expression, watcherSpy);
	             myBind.changes(spy);
	             myBind('aValue', true);
	             controller.myStringParameter = 'anotherValue';
	             controllerService.$apply();
	             expect(spy.calls.count()).toBe(6);
	             expect(watcherSpy.calls.count()).toBe(7);
	         });
	     });
	 });

/***/ },
/* 13 */
/***/ function(module, exports) {

	describe('ngClick', function() {
	    var controllerService, myClick, spy;
	    var ngClick = directiveProvider.$get('ngClick');
	    beforeEach(function() {
	        spy = jasmine.createSpy('click');
	        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
	            mySpy: spy
	        }, true);
	        myClick = ngClick.compile(controllerService, 'ctrl.mySpy(param1, param2)');
	    });
	    it('should have defined myIf', function() {
	        expect(myClick).toBeDefined();
	    });
	    it('should be a function', function() {
	        expect(myClick).toEqual(jasmine.any(Function));
	    });
	    it('should allow calling it', function() {
	        expect(function() {
	            myClick();
	        }).not.toThrow();
	    });
	    it('should call the spy when called', function() {
	        myClick();
	        expect(spy).toHaveBeenCalled();
	    });
	    it('should support locals', function() {
	        var object1 = function() {};
	        var object2 = function() {};
	        var locals = {
	            param1: object1,
	            param2: object2
	        };
	        myClick(locals);
	        expect(spy).toHaveBeenCalledWith(object1, object2);
	    });
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	  describe('ngTranslate', function() {
	      var controllerService, myIf;
	      var ngTranslate = directiveProvider.$get('translate');
	      beforeEach(function() {
	          controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
	              prop: 'HELLO'
	          }, true);
	          controllerService.create();
	          myTranslate = ngTranslate.compile('ctrl.prop', controllerService);
	      });
	  });

/***/ }
/******/ ]);