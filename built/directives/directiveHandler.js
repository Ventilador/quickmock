'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _directiveProvider = require('./directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

var _attribute = require('./../controller/attribute.js');

var _attribute2 = _interopRequireDefault(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directiveHandler = function () {

    var proto = angular.element.prototype || angular.element.__proto__;
    proto.$find = function (selector) {
        var values = {
            length: 0
        };
        for (var index = 0; index < this.length; index++) {
            var value = this[index].querySelector(selector);
            if (value) {
                values[values.length++] = value;
            }
        }

        return angular.element(join(values));
    };
    proto.$click = function (locals) {
        if (this.length) {
            var click = this.data('ng-click');
            return click && click(locals);
        }
    };
    proto.$text = function () {
        if (this.length) {
            var text = this.data('ng-model') || this.data('ng-bind') || this.data('ng-translate') || this.text;
            return text && text.apply(undefined, arguments) || '';
        }
    };
    proto.$if = function () {
        if (this.length) {
            var ngIf = this.data('ng-if');
            return ngIf && ngIf.value.apply(undefined, arguments);
        }
    };

    function join(obj) {
        return Array.prototype.concat.apply([], obj);
    }

    function compile(obj, controllerService) {
        obj = angular.element(obj);

        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive = void 0;
            if (directive = _directiveProvider2.default.$get(directiveName)) {
                var compiledDirective = directive.compile(controllerService, expression);
                obj.data(directive.name, compiledDirective);
                if (angular.isFunction(directive.attachToElement)) {
                    directive.attachToElement(controllerService, angular.element(obj), new _attribute2.default(obj));
                }
            }
        }

        var childrens = obj.children();
        for (var _ii = 0; _ii < childrens.length; _ii++) {
            compile(childrens[_ii], controllerService);
        }
    }

    function control(controllerService, obj) {
        var current = angular.element(obj);
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);
        return current;
    }

    return control;
}();
exports.default = directiveHandler;