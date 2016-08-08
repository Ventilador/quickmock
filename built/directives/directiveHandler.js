'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _directiveProvider = require('./directiveProvider.js');

var _directiveProvider2 = _interopRequireDefault(_directiveProvider);

require('perfnow');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {isSameComment} from './../controller/common.js';

(function (_$) {
    function newId() {
        var uuid = void 0;
        /* jshint ignore:start*/
        var d = performance.now();
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (arguments[0] == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
        /* jshint ignore:end*/
        return uuid;
    }
    var _text = _$.fn.text,
        _click = _$.fn.click,
        attr = _$.fn.attr,
        _clone = _$.fn.clone;

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
        },
        trackerId: function trackerId() {
            if (arguments.length === 1) {
                if (arguments[0] === true) {
                    if (!(0, _jquery2.default)(this).attr('tracker-data')) {
                        (0, _jquery2.default)(this).attr('tracker-data', newId());
                    }
                } else {
                    (0, _jquery2.default)(this).attr('tracker-data', arguments[0]);
                }
            }
            return (0, _jquery2.default)(this).attr('tracker-data');
        },
        clone: function clone(createId) {
            var toReturn = _clone.apply(this);
            if (createId) {
                toReturn.trackerId(newId());
            }
            return toReturn;
        },
        isCloneOf: function isCloneOf(otherElement) {
            return (0, _jquery2.default)(this).trackerId(true) === (0, _jquery2.default)(otherElement).trackerId(true);
        }
    });
    _$.fn.init.prototype = _$.fn;
})(_jquery2.default);
var directiveHandler = function () {
    var sortedArray = function sortedArray() {};
    sortedArray.prototype = Array.prototype;
    sortedArray.prototype.$push = function (directive) {
        var ii = 0;
        while (ii < this.length && this[ii].priority < directive.priority) {
            ii++;
        }
        if (ii < this.length && this[ii].priority === directive.priority) {
            // console.debug('same priority found keeping pushing order');
            Array.prototype.splice.call(this, ii + 1, 0, directive);
        } else {
            Array.prototype.splice.call(this, ii, 0, directive);
        }
    };

    function getTransclude(obj, toCompile, controllerService, domHandler, comment) {
        var internalClon = obj.clone();
        var found = void 0;
        var ii = void 0;
        for (ii = 0; ii < toCompile.length; ii++) {
            if (toCompile[ii].directive.transclude) {
                if (found) {
                    throw 'Cannot have two transclusions in the same element';
                }
                found = true;
                domHandler.replace(obj, comment);
                break;
            }
        }

        return function (fn, scope) {
            var newScope = fn;
            if (typeof fn !== 'function') {
                fn = scope;
            } else {
                newScope = undefined;
            }
            var myClon = internalClon.clone(newScope);
            var currentScope = controllerService.$new(newScope, true);
            if (found) {
                toCompile.splice(ii, 1);
                found = false;
            }
            domHandler.createComment();
            /* jshint -W069*/
            delete myClon['prevObject'];
            /* jshint +W069*/
            collectAndCompileNodes(myClon, currentScope, toCompile);
            fn(myClon, currentScope);
        };
    }

    function getDomHandler(container, parent, after) {
        return {
            createComment: function createComment() {
                if (!(0, _jquery2.default)(container[0]).isCloneOf(after)) {
                    Array.prototype.splice.apply(container, Array.prototype.concat.apply([0, 0], after));
                }
            },
            enter: function enter(nodes, internalAfter) {
                if (parent && parent.length) {
                    if (parent.find(internalAfter).length) {
                        internalAfter.after(nodes);
                    } else if (parent.find(after).length) {
                        after.after(nodes);
                    } else {
                        (0, _jquery2.default)(parent.children().last()).after(nodes);
                    }
                } else if (container.length) {
                    var ii = void 0;
                    internalAfter = internalAfter || after;
                    if (internalAfter) {
                        for (ii = 0; ii < container.length; ii++) {
                            if ((0, _jquery2.default)(container[ii]).isCloneOf(internalAfter)) {
                                break;
                            }
                        }
                    }
                    Array.prototype.splice.apply(container, Array.prototype.concat.apply([ii + 1, 0], nodes));
                } else {
                    Array.prototype.push.apply(container, nodes);
                }
            },
            leave: function leave(nodes) {
                if (container.parent().length) {
                    nodes.remove();
                } else {
                    var node = void 0;
                    while (nodes.length) {
                        nodes.length--;
                        node = nodes[nodes.length];
                        var notFound = true;
                        for (var index = 0; index < container.length; index++) {
                            if ((0, _jquery2.default)(container[index]).isCloneOf(node)) {
                                Array.prototype.splice.call(container, index, 1);
                                notFound = false;
                                break;
                            }
                        }
                        if (notFound) {
                            console.log('could not find the node');
                        }
                    }
                }
            },
            replace: function replace(oldNodes, newNodes) {
                if (parent && parent.length) {
                    parent.find(oldNodes).replaceWith(newNodes);
                } else {
                    var from = -1,
                        to = 0;
                    for (var index = 0; index < container.length; index++) {
                        if ((0, _jquery2.default)(container[index]).isCloneOf(oldNodes[to++])) {
                            if (from === -1) {
                                from = index;
                            }
                        }
                    }
                    if (from === -1) {
                        Array.prototype.push.apply(container, newNodes);
                    } else {
                        Array.prototype.splice.apply(container, Array.prototype.concat.apply([from, to], newNodes));
                    }
                }
            }
        };
    }
    function collectDirectives(node) {
        var toReturn = new sortedArray();
        var length = node.attributes && node.attributes.length || 0;
        for (var ii = 0; ii < length; ii++) {
            var directiveName = node.attributes[ii].name;
            var expression = node.attributes[ii].value;
            var directive = void 0;
            if (directive = _directiveProvider2.default.$get(directiveName.toLowerCase())) {
                directive.priority = typeof directive.priority === 'number' ? directive.priority : 9999;
                toReturn.$push({
                    exp: expression,
                    directive: directive
                });
            }
        }
        return toReturn;
    }

    function applyDirectivesToNode(compiledNode, transcludeFn, controllerService, domHandler, toCompile) {
        toCompile.forEach(function (elem) {
            if (!compiledNode.data('compiled-directives')) {
                compiledNode.data('compiled-directives', []);
            }
            var compiledDirective = elem.directive.compile(controllerService, elem.exp);
            compiledNode.data('compiled-directives').push(compiledDirective);
            compiledNode.data(elem.directive.name, compiledDirective);
            if (angular.isFunction(elem.directive.attachToElement)) {
                elem.directive.attachToElement(controllerService, compiledNode, transcludeFn, domHandler);
            }
        });
    }
    function createComment() {
        return (0, _jquery2.default)('<!-- DOM-' + counter++ + '-->');
    }
    function compile(node, nodes, toCompile, comment, controllerService) {
        if (node.nodeName === '#text') {
            return;
        }
        var compiledNode = (0, _jquery2.default)(node);
        var domHandler = getDomHandler(nodes, nodes.parent(), comment);
        var transcludeFn = getTransclude((0, _jquery2.default)(node), toCompile, controllerService, domHandler, comment, nodes);
        applyDirectivesToNode(compiledNode, transcludeFn, controllerService, domHandler, toCompile);
    }
    var counter = void 0;
    function collectAndCompileNodes(nodes, controllerService, toCompile) {
        if (!nodes || !nodes.length) {
            return;
        }
        _jquery2.default.each(nodes, function () {
            var comment = createComment();
            var toCompilePrivate = toCompile || collectDirectives(this);
            if (toCompilePrivate.length) {
                compile(this, nodes, toCompilePrivate, comment, controllerService);
            }
            if (this.childNodes && this.childNodes.length) {
                collectAndCompileNodes((0, _jquery2.default)(this.childNodes), controllerService);
            }
        });
    }

    function control(controllerService, obj) {
        counter = 0;
        var current = (0, _jquery2.default)(obj || '');
        if (!current || !controllerService) {
            return current;
        }
        collectAndCompileNodes(current, controllerService);
        return current;
    }

    return control;
}();
exports.default = directiveHandler;