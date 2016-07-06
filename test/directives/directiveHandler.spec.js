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
    describe('ngClick', function() {
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
        it('should support locals (for testing)', function() {
            const handler = new directiveHandler(controllerService,
                `   <div ng-click="ctrl.aInt =  value + ctrl.aInt ">
                    <div id='first'>
                        <div id='second'>
                        </div>
                    </div>
                    <div id='third'>
                    </div>
                <div/>`);
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
            const handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
            expect(handler.text()).toBe('aValue');
        });
        it('should allow me to change the controller value', function() {
            const handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
            handler.text('newValue');
            expect(controller.aString).toBe('newValue');
        });
        it('should allow me to change the controller value, one letter at the time', function() {
            const handler = new directiveHandler(controllerService, '<div ng-bind="ctrl.aString"/>');
            controllerService.watch('ctrl.aString', spy);
            handler.text('newValue'.split(''));
            expect(controller.aString).toBe('newValue');
            expect(spy.calls.count()).toBe('newValue'.length);
        });
    });
});