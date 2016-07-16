'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _directiveProvider = require('./directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

var _attribute = require('./../controller/attribute.js');

var _attribute2 = _interopRequireDefault(_attribute);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (_$) {
    var _text = _$.fn.text,
        _click = _$.fn.click;
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
                var click = this.data('ng-click');
                return click && click(locals);
            }
            return _click.apply(this, arguments);
        },
        if: function _if() {
            if (this.length) {
                var ngIf = this.data('ng-if');
                return ngIf && ngIf.apply(undefined, arguments);
            }
        },
        $text: _text
    });
    _$.fn.init.prototype = _$.fn;
})(_jquery2.default);
var directiveHandler = function () {
    function compile(obj, controllerService) {
        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive = void 0;
            if (directive = _directiveProvider2.default.$get(directiveName)) {
                var compiledDirective = directive.compile(controllerService, expression);
                obj.data(directive.name, compiledDirective);
                if (angular.isFunction(directive.attachToElement)) {
                    directive.attachToElement(controllerService, obj, new _attribute2.default(obj));
                }
            }
        }

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