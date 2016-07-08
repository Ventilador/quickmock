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