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
              }
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