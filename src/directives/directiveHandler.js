import directiveProvider from './directiveProvider.js';
import Attributes from './../controller/attribute.js';
var directiveHandler = (function() {

    let proto = angular.element.prototype || angular.element.__proto__;
    proto.$find = function(selector) {
        let values = {
            length: 0
        };
        for (let index = 0; index < this.length; index++) {
            let value = this[index].querySelector(selector);
            if (value) {
                values[values.length++] = value;
            }
        }

        return angular.element(join(values));
    };
    proto.$click = function(locals) {
        if (this.length) {
            const click = this.data('ng-click');
            return click && click(locals);
        }
    };
    proto.$text = function() {
        if (this.length) {
            const text = this.data('ng-model') || this.data('ng-bind') || this.data('ng-translate') || this.text;
            return text && text.apply(undefined, arguments) || '';
        }
    };
    proto.$if = function() {
        if (this.length) {
            const ngIf = this.data('ng-if');
            return ngIf && ngIf.value.apply(undefined, arguments);
        }
    };

    function join(obj) {
        return Array.prototype.concat.apply([], obj);
    }

    function compile(obj, controllerService) {
        obj = angular.element(obj);

        for (let ii = 0; ii < obj[0].attributes.length; ii++) {
            const directiveName = obj[0].attributes[ii].name;
            const expression = obj[0].attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName)) {
                const compiledDirective = directive.compile(controllerService, expression);
                obj.data(directive.name, compiledDirective);
                if (angular.isFunction(directive.attachToElement)) {
                    directive.attachToElement(controllerService, angular.element(obj), new Attributes(obj));
                }
            }
        }

        const childrens = obj.children();
        for (let ii = 0; ii < childrens.length; ii++) {
            compile(childrens[ii], controllerService);
        }
    }

    function control(controllerService, obj) {
        let current = angular.element(obj);
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);
        return current;
    }

    return control;
})();
export default directiveHandler;