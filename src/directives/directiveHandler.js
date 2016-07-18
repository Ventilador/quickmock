import directiveProvider from './directiveProvider.js';
// import Attributes from './../controller/attribute.js';
import $ from 'jquery';
(
    function(_$) {
        const text = _$.fn.text,
            click = _$.fn.click,
            attr = _$.fn.attr;
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
                    for (var index = 0; index < this.length; index++) {
                        var element = this[index];
                        const click = $(element).data('ng-click');
                        if (click) {
                            click(locals);
                        }
                    }
                }
                return click.apply(this, arguments);
            },
            if: function() {
                if (this.length) {
                    const ngIf = this.data('ng-if');
                    return ngIf && ngIf.apply(undefined, arguments);
                }
            },
            $text: text,
            attrs: function() {
                if (arguments.length === 0) {
                    if (this.length === 0) {
                        return;
                    }

                    var obj = {};
                    $.each(this[0].attributes, function() {
                        if (this.specified) {
                            obj[this.name] = this.value;
                        }
                    });
                    return obj;
                }

                return attr.apply(this, arguments);
            }
        });
        _$.fn.init.prototype = _$.fn;
    }
)($);
var directiveHandler = (function() {
    const sortedArray = function() {};
    sortedArray.prototype = Array.prototype;
    sortedArray.prototype.$push = function(directive) {
        let ii = 0;
        while (ii < this.length && this[ii].priority < directive.priority) {
            ii++;
        }
        if (ii < this.length && this[ii].priority === directive.priority) {
            console.debug('same priority found keeping pushing order');
            Array.prototype.splice.call(this, ii + 1, 0, directive);
        } else {
            Array.prototype.splice.call(this, ii, 0, directive);
        }
    };

    function getTransclude(obj, directive) {
        const internalClon = obj.clone(true);

        if (directive && directive.removeOnTransclusion) {
            Object.keys(internalClon.attrs()).forEach((element) => {
                if (directive.removeOnTransclusion.indexOf(element) !== -1) {
                    const oldVal = internalClon.attr(element);
                    internalClon.removeAttr(element);
                    internalClon.attr('omited-' + element, oldVal);
                }
            });
        }
        return (fn) => {
            const data = internalClon.data('compiled-directive');
            if (data) {
                internalClon.removeData('compiled-directive');
                while (data.length) {
                    (data.shift().$destroy || angular.noop)();
                }
            }
            const myClon = internalClon.clone();
            /* jshint -W069*/
            delete myClon['prevObject'];
            /* jshint +W069*/
            fn(myClon, compile);
        };
    }

    function compile(obj, controllerService) {
        const length = obj[0].attributes.length;
        const toCompile = new sortedArray();
        for (let ii = 0; ii < length; ii++) {
            if (!obj[0]) {
                break;
            }
            const directiveName = obj[0].attributes[ii].name;
            const expression = obj[0].attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName)) {
                directive.priority = directive.priority || 9999;
                toCompile.$push({
                    exp: expression,
                    directive: directive
                });
            }
        }

        toCompile.forEach((elem) => {
            const compiledDirective = elem.directive.compile(controllerService, elem.exp);
            if (!obj.data('compiled-directives')) {
                obj.data('compiled-directives', []);
            }
            obj.data('compiled-directives').push(compiledDirective);
            obj.data(elem.directive.name, compiledDirective);
            if (angular.isFunction(elem.directive.attachToElement)) {
                elem.directive.attachToElement(controllerService, obj, getTransclude(obj, elem.directive));
            }
        });

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