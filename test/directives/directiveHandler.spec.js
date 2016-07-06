describe('directiveHandler', function() {
    let controllerService, spy, controller;
    const expression = 'ctrl.myStringParameter';
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
            const temp = new directiveHandler();
        }).not.toThrow();
    });
    it('should be able to compile html', function() {
        expect(function() {
            const temp = new directiveHandler(controllerService, '<div/>');
        }).not.toThrow();
    });
    it('should allow me to call ng-click', function() {
        const handler = new directiveHandler(controllerService, '<div ng-click="ctrl.aString = \'anotherValue\'"/>');
        handler.click();
        expect(controller.aString).toBe('anotherValue');
    });
    it('should not fail if the selected item is invalid', function() {
        const handler = new directiveHandler(controllerService, '<div />');
        expect(function() {
            handler.ngFind('a').click();
        }).not.toThrow();
    });
    it('should not fail if the selected does not have the property', function() {
        const handler = new directiveHandler(controllerService, '<div />');
        expect(function() {
            handler.click();
        }).not.toThrow();
    });
    it('should apply the click event to each of its childrens (if needed)', function() {
        const handler = new directiveHandler(controllerService,
            `   <div ng-click="ctrl.aInt = ctrl.aInt + 1">
                    <div id='first'>
                        <div id='second'>
                        </div>
                    </div>
                    <div id='third'>
                    </div>
                <div/>`);
        handler.ngFind('#first').click();
        handler.ngFind('#second').click();
        handler.ngFind('#third').click();
        expect(controller.aInt).toBe(3);
    });
});