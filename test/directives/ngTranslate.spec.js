import controllerHandler from './../../src/controllerHandler/controllerHandler.js';
import directiveProvider from './../../src/directives/directiveProvider.js';
describe('ngTranslate', function() {
    let controllerService, myTranslate;
    const ngTranslate = directiveProvider.$get('translate');
    beforeEach(function() {
        controllerService = controllerHandler.clean().addModules('test').newService('emptyController', 'ctrl', {
            prop: 'HELLO'
        }, true);
        controllerService.create();
        myTranslate = ngTranslate.compile('ctrl.prop', controllerService);
    });
});