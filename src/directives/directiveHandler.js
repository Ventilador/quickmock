import directiveProvider from './directiveProvider.js';
import Attributes from './../controller/attribute.js';
import $ from 'jquery';
(
    function(_$) {
        const text = _$.fn.text,
            click = _$.fn.click;
        _$.fn.extend({
            text: function() {
                if (arguments.length) {
                    const text = this.data('ng-model') || text;
                    return text && text.apply(this, arguments) || '';
                }
                return text.apply(this, arguments) || '';
            },
            click: function(locals) {
                if (this.length) {
                    const click = this.data('ng-click');
                    return click && click(locals);
                }
                return click.apply(this, arguments);
            },
            if: function() {
                if (this.length) {
                    const ngIf = this.data('ng-if');
                    return ngIf && ngIf.apply(undefined, arguments);
                }
            },
            $text: text
        });
        _$.fn.init.prototype = _$.fn;
    }
)($);
var directiveHandler = (function() {
    function compile(obj, controllerService) {
        for (let ii = 0; ii < obj[0].attributes.length; ii++) {
            const directiveName = obj[0].attributes[ii].name;
            const expression = obj[0].attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName)) {
                const compiledDirective = directive.compile(controllerService, expression);
                obj.data(directive.name, compiledDirective);
                if (angular.isFunction(directive.attachToElement)) {
                    directive.attachToElement(controllerService, obj, new Attributes(obj));
                }
            }
        }

        const childrens = obj.children();
        for (let ii = 0; ii < childrens.length; ii++) {
            compile($(childrens[ii]), controllerService);
        }
    }

    function control(controllerService, obj) {
        let current = $(obj || '');
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);
        return current;
    }

    return control;
})();
export default directiveHandler;