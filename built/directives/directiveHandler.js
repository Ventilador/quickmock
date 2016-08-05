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
        var internalClon = obj.clone().contents();

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

    function getDomHandler(element) {

        return {
            enter: function enter(nodes, parent, after) {
                if (after) {
                    while (nodes.length--) {
                        after.nextSibling = nodes[nodes.length];
                        after = after.nextSibling;
                    }
                } else if (parent) {
                    (0, _jquery2.default)(parent).append((0, _jquery2.default)(nodes));
                } else {
                    var tempNode = element[element.length - 1];
                    while (nodes.length--) {
                        tempNode.nextSibling = nodes[nodes.length];
                        tempNode = tempNode.nextSibling;
                    }
                }
            },
            leave: function leave(nodes) {
                while (nodes.length--) {
                    var tempNode = element[0];
                    if (tempNode) {
                        do {
                            if (tempNode === nodes[nodes.length]) {
                                if (tempNode.prevSibling) {
                                    tempNode.prevSibling.nextSibling = tempNode.nextSibling;
                                    break;
                                } else if (tempNode.nextSibling) {
                                    tempNode.nextSibling.prevSibling = undefined;
                                    break;
                                } else if (tempNode.paretNode) {
                                    var index = tempNode.paretNode.childNodes.indexOf(tempNode);
                                    if (index !== -1) {
                                        tempNode.paretNode.childNodes.splice(index, 1);
                                    }
                                } else {
                                    Array.prototype.splice.call(element, 0, element.length - 1);
                                }
                            }
                        } while (tempNode = tempNode.nextSibling);
                    }
                }
            }
        };
    }

    function compile(nodes, controllerService) {
        if (!nodes || !nodes.length) {
            return;
        }
        _jquery2.default.each(nodes, function () {
            if (this.nodeName === '#text') {
                return;
            }
            var self = this;
            var compiledNode = (0, _jquery2.default)(self);
            var length = self.attributes.length;
            var toCompile = new sortedArray();
            for (var ii = 0; ii < length; ii++) {
                var directiveName = self.attributes[ii].name;
                var expression = self.attributes[ii].value;
                var directive = void 0;
                if (directive = _directiveProvider2.default.$get(directiveName.toLowerCase())) {
                    directive.priority = typeof directive.priority === 'number' ? directive.priority : 9999;
                    toCompile.$push({
                        exp: expression,
                        directive: directive
                    });
                }
            }

            toCompile.forEach(function (elem) {
                if (elem.directive.transclude) {
                    elem.directive.transcludeFn = getTransclude(compiledNode, elem.directive);
                }
                var compiledDirective = elem.directive.compile(controllerService, elem.exp);
                if (!compiledNode.data('compiled-directives')) {
                    compiledNode.data('compiled-directives', []);
                }
                compiledNode.data('compiled-directives').push(compiledDirective);
                compiledNode.data(elem.directive.name, compiledDirective);
                if (angular.isFunction(elem.directive.attachToElement)) {
                    elem.directive.attachToElement(controllerService, compiledNode, elem.directive.transcludeFn, getDomHandler(nodes));
                }
            });
            if (self.childNodes && self.childNodes.length) {
                compile(self.childNodes, controllerService);
            }
        });
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