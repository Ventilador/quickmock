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