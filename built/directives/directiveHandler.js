'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _directiveProvider = require('./directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (_$) {
    var _text = _$.fn.text,
        _click = _$.fn.click,
        attr = _$.fn.attr;
    _$.fn.extend({
        text: function text() {
            if (arguments.length) {
                var text = this.data('ng-model') || text;
                return text && text.apply(this, arguments) || '';
            }
            return _text.apply(this, arguments) || '';
        },
        click: function click(locals) {
            if (this.length) {
                for (var index = 0; index < this.length; index++) {
                    var element = this[index];
                    var click = (0, _jquery2.default)(element).data('ng-click');
                    if (click) {
                        click(locals);
                    }
                }
            }
            return _click.apply(this, arguments);
        },
        if: function _if() {
            if (this.length) {
                var ngIf = this.data('ng-if');
                return ngIf && ngIf.apply(undefined, arguments);
            }
        },
        $text: _text,
        attrs: function attrs() {
            if (arguments.length === 0) {
                if (this.length === 0) {
                    return;
                }

                var obj = {};
                _jquery2.default.each(this[0].attributes, function () {
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
})(_jquery2.default);
// import Attributes from './../controller/attribute.js';

var directiveHandler = function () {
    var sortedArray = function sortedArray() {};
    sortedArray.prototype = Array.prototype;
    sortedArray.prototype.$push = function (directive) {
        var ii = 0;
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
        if (obj.children().length) {
            obj = obj.find('>*');
        }
        var internalClon = obj.clone(true);

        if (directive && directive.removeOnTransclusion) {
            Object.keys(internalClon.attrs()).forEach(function (element) {
                if (directive.removeOnTransclusion.indexOf(element) !== -1) {
                    var oldVal = internalClon.attr(element);
                    internalClon.removeAttr(element);
                    internalClon.attr('omited-' + element, oldVal);
                }
            });
        }
        return function (fn) {
            var data = internalClon.data('compiled-directive');
            if (data) {
                internalClon.removeData('compiled-directive');
                while (data.length) {
                    (data.shift().$destroy || angular.noop)();
                }
            }
            var myClon = internalClon.clone();
            /* jshint -W069*/
            delete myClon['prevObject'];
            /* jshint +W069*/
            fn(myClon, compile);
        };
    }

    function compile(obj, controllerService) {
        var length = obj[0].attributes.length;
        var toCompile = new sortedArray();
        for (var ii = 0; ii < length; ii++) {
            if (!obj[0]) {
                break;
            }
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive = void 0;
            if (directive = _directiveProvider2.default.$get(directiveName)) {
                directive.priority = directive.priority || 9999;
                toCompile.$push({
                    exp: expression,
                    directive: directive
                });
            }
        }

        toCompile.forEach(function (elem) {
            var compiledDirective = elem.directive.compile(controllerService, elem.exp);
            if (!obj.data('compiled-directives')) {
                obj.data('compiled-directives', []);
            }
            obj.data('compiled-directives').push(compiledDirective);
            obj.data(elem.directive.name, compiledDirective);
            if (angular.isFunction(elem.directive.attachToElement)) {
                elem.directive.attachToElement(controllerService, obj, getTransclude(obj, elem.directive));
            }
        });

        var childrens = obj.children();
        for (var _ii = 0; _ii < childrens.length; _ii++) {
            compile((0, _jquery2.default)(childrens[_ii]), controllerService);
        }
    }

    function control(controllerService, obj) {
        var current = (0, _jquery2.default)(obj || '');
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);
        return current;
    }

    return control;
}();
exports.default = directiveHandler;