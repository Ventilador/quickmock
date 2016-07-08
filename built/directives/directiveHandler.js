'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _directiveProvider = require('./directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directiveHandler = function () {
    console.log('directiveHandler');

    var proto = angular.element.prototype || angular.element.__proto__;
    proto.ngFind = function (selector) {
        var values = {
            length: 0
        };
        for (var index = 0; index < this.length; index++) {
            values[values.length++] = this[index].querySelector(selector) || '';
        }
        return angular.element(join(values));
    };
    proto.click = function (locals) {
        if (this.length) {
            var click = this.data('ng-click');
            return click && click(locals);
        }
    };
    proto.text = function () {
        if (this.length) {
            var click = this.data('ng-bind');
            return click && click.apply(undefined, arguments);
        }
    };

    // function getExpression(current) {
    //     let expression = current[0] && current[0].attributes.getNamedItem('ng-click');
    //     if (expression !== undefined && expression !== null) {
    //         expression = expression.value;
    //         return expression;
    //     }
    // }

    function join(obj) {
        return Array.prototype.concat.apply([], obj);
    }

    function applyDirectivesToNodes(object, attributeName, compiledDirective) {
        object = angular.element(object);
        object.data(attributeName, compiledDirective);
        var childrens = object.children();
        for (var ii = 0; ii < childrens.length; ii++) {
            applyDirectivesToNodes(childrens[ii], attributeName, compiledDirective);
        }
    }

    function compile(obj, controllerService) {
        obj = angular.element(obj);

        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive = void 0;
            if (directive = _directiveProvider2.default.$get(directiveName)) {
                var compiledDirective = directive.compile(controllerService, expression);
                if (directive.ApplyToChildren) {
                    applyDirectivesToNodes(obj, directiveName, compiledDirective);
                } else {
                    obj.data(directiveName, compiledDirective);
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

    console.log('directiveHandler end');
    return control;
}();
exports.default = directiveHandler;